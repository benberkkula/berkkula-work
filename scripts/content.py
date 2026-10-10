#!/usr/bin/env python3
"""Validates and edits the content files; standard-library only."""
import argparse
import calendar
from collections import Counter
from datetime import date
import hashlib
import json
from pathlib import Path
import re
from urllib.parse import urlparse, parse_qs

ROOT = Path(__file__).resolve().parents[1]
SHOWS = ROOT / 'data' / 'concerts.json'
SITE = ROOT / 'data' / 'site.json'
REPORT_DIR = ROOT / 'data' / 'reports'


def load(path):
    return json.loads(path.read_text(encoding='utf-8'))


def save(path, data):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')


def validate_date(value):
    if not isinstance(value, str) or not re.fullmatch(r'\d{4}-\d{2}-\d{2}', value):
        raise ValueError('Date must be YYYY-MM-DD')
    return date.fromisoformat(value)


def clean(value, key, maxlen=180):
    if not isinstance(value, str) or not value.strip() or len(value) > maxlen:
        raise ValueError(f'{key} must be a non-empty string of at most {maxlen} characters')
    return value.strip()


def iso_country(value):
    value = clean(value, 'country', 2).upper()
    if not re.fullmatch(r'[A-Z]{2}', value):
        raise ValueError('Country must be a two-letter ISO country code such as TR, DE, GB')
    return value


def checked_url(value):
    value = clean(value, 'url', 500)
    parsed = urlparse(value)
    if parsed.scheme != 'https' or not parsed.netloc or parsed.username or parsed.password:
        raise ValueError('Link must be a valid HTTPS URL')
    return value


def video_id(value):
    value = clean(value, 'video', 500)
    if re.fullmatch(r'[\w-]{11}', value):
        return value
    parsed = urlparse(checked_url(value))
    host = (parsed.hostname or '').lower()
    if host in ('youtu.be', 'www.youtu.be'):
        part = parsed.path.strip('/').split('/')[0]
    elif host in ('youtube.com', 'www.youtube.com', 'm.youtube.com'):
        if parsed.path == '/watch':
            part = parse_qs(parsed.query).get('v', [''])[0]
        elif parsed.path.startswith(('/shorts/', '/embed/')):
            part = parsed.path.strip('/').split('/')[1]
        else:
            part = ''
    else:
        raise ValueError('Video needs a YouTube link or 11-character YouTube ID')
    if not re.fullmatch(r'[\w-]{11}', part):
        raise ValueError('Invalid YouTube video ID')
    return part


def add_concert(payload):
    when = clean(payload['date'], 'date', 10)
    validate_date(when)
    item = {
        'date': when,
        'artist': clean(payload['artist'], 'artist'),
        'city': clean(payload['city'], 'city'),
        'country': iso_country(payload['country']),
        'venue': (payload.get('venue') or '').strip()[:180],
        'role': clean(payload['role'], 'role', 100),
    }
    basis = '|'.join(str(item[k]).casefold() for k in ('date', 'artist', 'city', 'venue', 'role'))
    item['id'] = 'bk-' + hashlib.sha256(basis.encode('utf-8')).hexdigest()[:12]
    data = load(SHOWS)
    if any(event['id'] == item['id'] for event in data['concerts']):
        raise ValueError('This concert already exists (same date, artist, city, venue, role)')
    data['concerts'].append(item)
    data['concerts'].sort(key=lambda c: (c['date'], c['artist'], c['city']))
    save(SHOWS, data)
    return item


def update_mix(payload):
    when = clean(payload['date'], 'date', 10)
    validate_date(when)
    item = {
        'title': clean(payload['title'], 'title'),
        'artist': clean(payload['artist'], 'artist'),
        'date': when,
        'role': clean(payload.get('role') or 'Mixing', 'role'),
        'url': checked_url(payload['url'])
    }
    data = load(SITE)
    previous = data.get('latestMix')
    history = data.setdefault('mixHistory', [])
    if previous and previous != item and previous not in history:
        history.insert(0, previous)
    # Keep the permanent, dated discography in sync with newly featured releases.
    # The previous latest mix remains in the archive, never deleted.
    discography = data.setdefault('recordings', [])
    def archive_entry(mix):
        result = {
            'year': int(mix['date'][:4]),
            'date': mix['date'],
            'displayDate': mix['date'],
            'title': mix['title'],
            'artist': mix['artist'],
            'role': mix.get('role') or 'Mixing',
            'type': 'Single',
            'url': mix['url'],
        }
        return result
    for mix in (previous, item):
        if mix and 'date' in mix and 'url' in mix:
            existing = next((r for r in discography
                             if r.get('title', '').casefold() == mix['title'].casefold()
                             and r.get('artist', '').casefold() == mix['artist'].casefold()), None)
            if existing is None:
                discography.append(archive_entry(mix))
    data['latestMix'] = item
    save(SITE, data)
    return item


def add_video(payload):
    item = {
        'title': clean(payload['title'], 'title'),
        'artist': clean(payload['artist'], 'artist'),
        'type': clean(payload.get('type') or 'Mixing', 'type', 100),
        'videoId': video_id(payload['video']),
    }
    data = load(SITE)
    data['videos'] = [item] + [v for v in data['videos'] if v['videoId'] != item['videoId']]
    # Older entries remain stored. Only the three newest appear on the site.
    save(SITE, data)
    return item


def make_report(year, today=None):
    if not 2007 <= year <= 2100:
        raise ValueError('Report year out of accepted range')
    today = today or date.today()
    items = [e for e in load(SHOWS)['concerts'] if e['date'].startswith(f'{year}-') and validate_date(e['date']) <= today]
    artist = Counter(e['artist'] for e in items)
    roles = Counter(e['role'] for e in items)
    country = Counter(e['country'] for e in items)
    report = {
        'year': year, 'generatedAt': today.isoformat(), 'totalShows': len(items),
        'uniqueArtists': len(artist),
        'byArtist': dict(sorted(artist.items(), key=lambda x: (-x[1], x[0]))),
        'byRole': dict(sorted(roles.items(), key=lambda x: (-x[1], x[0]))),
        'byCountry': dict(sorted(country.items(), key=lambda x: (-x[1], x[0]))),
        'domesticShows': country.get('TR', 0),
        'internationalShows': len(items) - country.get('TR', 0),
        'byMonth': {str(m).zfill(2): sum(e['date'][5:7] == str(m).zfill(2) for e in items) for m in range(1, 13)},
        'concertIds': [e['id'] for e in items]
    }
    file = REPORT_DIR / f'{year}.json'
    save(file, report)
    return report, file


def main():
    parser = argparse.ArgumentParser(description='Manage Berk Kula website content.')
    sub = parser.add_subparsers(dest='command', required=True)
    p = sub.add_parser('concert', help='Add a dated concert')
    for name in ('date', 'artist', 'city', 'country', 'role'):
        p.add_argument('--'+name, required=True)
    p.add_argument('--venue', default='')
    p = sub.add_parser('mix', help='Set the latest mix')
    for name in ('date', 'artist', 'title', 'url'):
        p.add_argument('--'+name, required=True)
    p.add_argument('--role', default='Mixing')
    p = sub.add_parser('video', help='Put a video first in the newest-three list')
    for name in ('artist', 'title', 'video'):
        p.add_argument('--'+name, required=True)
    p.add_argument('--type', default='Mixing')
    p = sub.add_parser('report', help='Generate an annual report')
    p.add_argument('--year', type=int, default=date.today().year-1)
    args = parser.parse_args()
    payload = vars(args)
    if args.command == 'concert': result = add_concert(payload)
    elif args.command == 'mix': result = update_mix(payload)
    elif args.command == 'video': result = add_video(payload)
    else: result = make_report(args.year)[0]
    print(json.dumps(result, indent=2, ensure_ascii=False))

if __name__ == '__main__':
    main()

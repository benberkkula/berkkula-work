#!/usr/bin/env python3
"""Import a trusted repository owner's issue form into website JSON."""
import json
import os
import re
from pathlib import Path
from content import add_concert, add_video, update_mix


def get_form_values(body):
    blocks = re.split(r'(?m)^###\s+(.+?)\s*$', body)
    result = {}
    for i in range(1,len(blocks)-1,2):
        value = blocks[i+1].strip()
        result[blocks[i].strip()] = '' if value=='_No response_' else value
    return result


def main():
    event=json.loads(Path(os.environ['GITHUB_EVENT_PATH']).read_text(encoding='utf-8'))
    issue=event['issue']
    assert issue['user']['login'].casefold()==os.environ['GITHUB_REPOSITORY_OWNER'].casefold(), 'Only the repository owner may update content'
    title=issue['title'].strip().lower()
    fields=get_form_values(issue.get('body') or '')
    if title.startswith('[concert]'):
        data={key:fields.get(label,'') for key,label in {
          'date':'Date (YYYY-MM-DD)','artist':'Artist','city':'City','country':'Country code (TR / DE / etc.)',
          'venue':'Venue (optional)','role':'My role (FOH / Monitor / Mixing / etc.)'
        }.items()}
        result=add_concert(data)
    elif title.startswith('[mix]'):
        data={key:fields.get(label,'') for key,label in {
          'title':'Song title','artist':'Artist','date':'Release date (YYYY-MM-DD)','role':'Credit / role','url':'Listening URL (HTTPS)'
        }.items()}
        result=update_mix(data)
    elif title.startswith('[video]'):
        data={key:fields.get(label,'') for key,label in {
          'title':'Video title','artist':'Artist','type':'Credit / type','video':'YouTube link'
        }.items()}
        result=add_video(data)
    else:
        raise ValueError('Unsupported issue title prefix')
    print(json.dumps(result,ensure_ascii=False,indent=2))

if __name__=='__main__':
    main()

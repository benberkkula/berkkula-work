import unittest
from pathlib import Path
from html.parser import HTMLParser

ROOT = Path(__file__).resolve().parents[1]

class PageInspector(HTMLParser):
    def __init__(self):
        super().__init__()
        self.sections = []
        self.links = []
    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == 'section':
            self.sections.append(attrs.get('id'))
        if tag == 'a':
            self.links.append(attrs.get('href'))

class SiteLayoutTests(unittest.TestCase):
    def test_main_has_no_mixes_or_archive_section(self):
        html = (ROOT / 'index.html').read_text()
        page = PageInspector(); page.feed(html)
        self.assertNotIn('mixes', page.sections)
        self.assertNotIn('recording-preview-list', html)
        self.assertNotIn('recording-preview-head', html)
        self.assertIn('recordings.html', page.links)
        self.assertEqual([item for item in page.sections if item], ['top','work','videos','dates','about'])
    def test_discography_has_mixes_and_archive(self):
        html = (ROOT / 'recordings.html').read_text()
        page = PageInspector(); page.feed(html)
        self.assertIn('mixes', page.sections)
        self.assertIn('https://open.spotify.com/embed/playlist/7EuvD5Wx31tUKowpDn9pw0', html)
        self.assertIn('id="recordings-all"', html)
        self.assertIn('data-filter="mix"', html)
        self.assertIn('data-filter="recording"', html)
    def test_discography_contains_verified_album_credits(self):
        import json
        data = json.loads((ROOT / 'data/site.json').read_text())
        self.assertGreaterEqual(len(data['recordings']), 30)
        self.assertTrue(any(r['artist']=='Şebnem Ferah' and r['title']=='Benim Adım Orman' for r in data['recordings']))
        self.assertTrue(any(r['artist']=='Kaan Tangöze' and len(r.get('tracks',[]))==10 for r in data['recordings']))
        self.assertIn('data-filter="album"', (ROOT / 'recordings.html').read_text())
    def test_discography_omits_portfolio_pdf_link(self):
        self.assertNotIn('docs/berk-kula-portfolio.pdf', (ROOT / 'recordings.html').read_text())
    def test_blue_photo_border(self):
        css = (ROOT / 'assets/styles.css').read_text()
        self.assertIn('border: 6px solid #79ade0', css)
        self.assertIn('filter:none !important', css)

if __name__ == '__main__':
    unittest.main()

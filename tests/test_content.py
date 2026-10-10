import json
from pathlib import Path
import sys
import tempfile
import unittest
from datetime import date
sys.path.insert(0, str(Path(__file__).resolve().parents[1] / 'scripts'))
import content

class ContentTests(unittest.TestCase):
    def setUp(self):
        self.temp=tempfile.TemporaryDirectory()
        self.orig=(content.SHOWS,content.SITE,content.REPORT_DIR)
        root=Path(self.temp.name)
        content.SHOWS=root/'concerts.json'
        content.SITE=root/'site.json'
        content.REPORT_DIR=root/'reports'
        content.save(content.SHOWS,{'schemaVersion':1,'concerts':[]})
        content.save(content.SITE,{'latestMix':{'title':'Old','artist':'A','date':'2026-10-01','role':'Mixing','url':'https://example.com'},'videos':[]})

    def tearDown(self):
        content.SHOWS,content.SITE,content.REPORT_DIR=self.orig
        self.temp.cleanup()

    def test_date_validation(self):
        for d in ['2026-02-30','2026/11/13','tomorrow','2026-13-01']:
            with self.assertRaises(ValueError): content.validate_date(d)

    def test_concert_archived_in_report_and_duplicate_blocked(self):
        p={'date':'2026-04-30','artist':'Duman','city':'İstanbul','country':'TR','venue':'Venue','role':'FOH Engineer'}
        event=content.add_concert(p)
        with self.assertRaisesRegex(ValueError,'already exists'):content.add_concert(p)
        content.add_concert({'date':'2026-06-01','artist':'Other','city':'Berlin','country':'DE','role':'Monitor Engineer'})
        content.add_concert({'date':'2027-06-01','artist':'Other','city':'Berlin','country':'DE','role':'Monitor Engineer'})
        report,_=content.make_report(2026,date(2027,1,1))
        self.assertEqual(report['totalShows'],2)
        self.assertEqual(report['domesticShows'],1)
        self.assertEqual(report['internationalShows'],1)
        self.assertEqual(report['byRole']['FOH Engineer'],1)
        self.assertEqual(report['byArtist']['Duman'],1)
        self.assertEqual(report['concertIds'][0],event['id'])

    def test_report_excludes_future(self):
        content.add_concert({'date':'2026-12-30','artist':'Duman','city':'Berlin','country':'DE','role':'FOH'})
        report,_=content.make_report(2026,date(2026,12,20))
        self.assertEqual(report['totalShows'],0)

    def test_latest_mix_history(self):
        item=content.update_mix({'title':'Altın Hızma','artist':'Batuhan Aydın & Jülide Özçelik','date':'2026-10-09','url':'https://www.youtube.com/watch?v=3y82hqlA2mA'})
        data=content.load(content.SITE)
        self.assertEqual(item['title'],'Altın Hızma')
        self.assertEqual(data['mixHistory'][0]['title'],'Old')

    def test_new_mix_persists_to_discography(self):
        content.update_mix({'title':'New Song','artist':'Artist B','date':'2026-11-15','url':'https://example.com/new-song'})
        data=content.load(content.SITE)
        self.assertTrue(any(r['title']=='New Song' and r['role']=='Mixing' for r in data['recordings']))
        self.assertTrue(any(r['title']=='Old' for r in data['recordings']))
        content.update_mix({'title':'Next Song','artist':'Artist C','date':'2026-12-01','url':'https://example.com/next-song'})
        data=content.load(content.SITE)
        titles=[r['title'] for r in data['recordings']]
        self.assertEqual(titles.count('New Song'),1)
        self.assertEqual(titles.count('Next Song'),1)

    def test_video_de_duplicates(self):
        p={'title':'Dilerim Ki','artist':'DKTT','video':'https://www.youtube.com/watch?v=87Yj3G9kWgg'}
        content.add_video(p);content.add_video(p)
        self.assertEqual(len(content.load(content.SITE)['videos']),1)

    def test_country_rejected(self):
        with self.assertRaises(ValueError):content.iso_country('Turkey')

if __name__=='__main__':unittest.main()

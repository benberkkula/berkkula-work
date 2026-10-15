const LANGUAGE_KEY='berkkula.language';
function savedLanguage(){try{return localStorage.getItem(LANGUAGE_KEY)==='tr'?'tr':'en'}catch{return 'en'}}
function rememberLanguage(lang){try{localStorage.setItem(LANGUAGE_KEY,lang)}catch{/* Storage may be unavailable. */}}
const T={
  en:{work:'Work',discography:'Discography',videos:'Video',mixes:'Mixes',dates:'Dates',about:'About',back:'← Back to selected work',title:'Recording & mixing.',intro:'Albums, EPs, singles and live recordings. Each credit specifies the work completed, including selected tracks when relevant.',oldArchive:'Original discography 2007–2022 ↗',portfolio:'Portfolio PDF ↗',spotlightLabel:'01 / SELECTED MIXING WORKS',spotlightTitle:'Listen to my mixes.',spotlightIntro:'15 selected tracks mixed by Berk Kula.',playlistLink:'Open full playlist on Spotify ↗',selectedFullDiscography:'Explore all 34 recordings ↗',mixCredit:'MIXING',openSpotify:'Listen on Spotify ↗',playSpotify:'Load Spotify player ↗',listLabel:'02 / RECORDING & MIXING',listTitle:'Recording & mixing archive',filterAll:'All',filterAlbum:'Albums',filterMix:'Mixing',filterRec:'Recording',footnote:'More credits are documented in the original discography, including releases with artwork-only titles. The list here includes identified works.'},
  tr:{work:'İşler',discography:'Diskografi',videos:'Video',mixes:'Miksler',dates:'Takvim',about:'Hakkında',back:'← Seçili işlere dön',title:'Kayıt ve miks.',intro:'Albümler, EP’ler, tekliler ve canlı kayıtlar. Her eserdeki katkı ve varsa şarkı numaraları ayrı ayrı belirtilmiştir.',oldArchive:'2007–2022 orijinal diskografi ↗',portfolio:'Portfolyo PDF ↗',spotlightLabel:'01 / SEÇİLİ MİKSLER',spotlightTitle:'Mikslerimi dinleyin.',spotlightIntro:'Berk Kula tarafından mikslenmiş 15 seçili şarkı.',playlistLink:'Spotify’da listenin tamamını aç ↗',selectedFullDiscography:'34 kaydın tamamını keşfet ↗',mixCredit:'MIXING',openSpotify:'Spotify’da dinle ↗',playSpotify:'Spotify oynatıcıyı aç ↗',listLabel:'02 / KAYIT & MİKS',listTitle:'Kayıt ve miks arşivi',filterAll:'Tümü',filterAlbum:'Albümler',filterMix:'Miks',filterRec:'Kayıt',footnote:'Orijinal diskografide, ismi yalnızca kapakta bulunan başka çalışmalar da yer alıyor. Burada adı doğrulanabilen işler listeleniyor.'}
};
function initialRecords(){
  try{const records=JSON.parse(document.getElementById('recordings-data')?.textContent||'[]');return Array.isArray(records)?records:[]}catch{return []}
}
const state={lang:savedLanguage(),filter:'all',records:initialRecords(),latestMix:null};
const el=(t,c,txt)=>{const e=document.createElement(t);if(c)e.className=c;if(txt!==undefined)e.textContent=txt;return e};
function spotifyTrackId(mix){
  for(const value of [mix.spotifyUrl,mix.url]){
    if(!value)continue;
    try{
      const u=new URL(value);
      if(u.protocol!=='https:'||u.hostname!=='open.spotify.com')continue;
      const match=u.pathname.match(/(?:^|\/)track\/([A-Za-z0-9]{22})(?:\/|$)/);
      if(match)return match[1];
    }catch{}
  }
  return null;
}
function renderFeaturedMix(mix){
  const title=document.getElementById('discography-mix-title');
  const artist=document.getElementById('discography-mix-artist');
  const link=document.getElementById('discography-mix-link');
  const player=document.getElementById('discography-player');
  title.textContent=mix.title;
  artist.textContent=mix.artist;
  const url=mix.spotifyUrl||mix.url;
  if(url&&/^https:\/\//.test(url))link.href=url;
  player.replaceChildren();
  const trackId=spotifyTrackId(mix);
  if(mix.audioUrl && /^https:\/\//.test(mix.audioUrl)){
    const audio=el('audio');audio.controls=true;audio.preload='none';audio.src=mix.audioUrl;
    audio.style.width='100%';player.append(audio);
    return;
  }
  if(trackId){
    const box=el('div','spotify-preview');
    const detail=el('div','spotify-preview-info');
    detail.append(el('span','spotify-brand','SPOTIFY AUDIO'),el('strong','spotify-track',mix.title),el('span','spotify-artist',mix.artist));
    const btn=el('button','spotify-load',T[state.lang].playSpotify);btn.type='button';
    btn.addEventListener('click',()=>{
      const frame=el('iframe','spotify-frame');
      frame.src=`https://open.spotify.com/embed/track/${trackId}`;
      frame.title=`Spotify — ${mix.artist} — ${mix.title}`;
      frame.allow='autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture';
      frame.setAttribute('loading','lazy');
      player.replaceChildren(frame);
    });
    box.append(detail,btn);player.append(box);
  }else {
    const note=el('p','empty-dates',state.lang==='tr'?'Dinlemek için şarkı bağlantısını aç.':'Open the song link to listen.');
    player.append(note);
  }
}

function update(){
  document.documentElement.lang=state.lang;
  document.querySelectorAll('[data-i18n]').forEach(e=>e.textContent=T[state.lang][e.dataset.i18n]||'');
  document.getElementById('lang-switch').textContent=state.lang==='en'?'TR':'EN';
  document.getElementById('lang-switch').setAttribute('aria-label',state.lang==='en'?'TR — Switch to Turkish':'EN — İngilizceye geç');
  document.querySelector('.discography-filter').setAttribute('aria-label',state.lang==='en'?'Filter by role':'Göreve göre filtrele');
  document.querySelectorAll('[data-filter]').forEach(b=>{const active=b.dataset.filter===state.filter;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active))});

  const root=document.getElementById('recordings-all');root.replaceChildren();
  const rows=state.records.filter(r=>state.filter==='all'||(state.filter==='album'?/album|ep|soundtrack/i.test(r.type||''):(r.role||'').toLowerCase().includes(state.filter==='mix'?'mix':'record')));
  rows.sort((a,b)=>String(b.date||b.year).localeCompare(String(a.date||a.year))||String(a.artist||'').localeCompare(String(b.artist||'')));
  const counter=document.getElementById('archive-counter'); if(counter)counter.textContent=(state.lang==='tr'?`${rows.length} kayıt gösteriliyor`:`Showing ${rows.length} credits`);
  for(const r of rows){
    const row=el('div','recording-row');row.append(el('span','recording-year',String(r.displayDate||r.year)));
    const info=el('div','recording-info');const title=el('strong');
    if(r.url&&/^https:\/\//.test(r.url)){const link=el('a','',`${r.artist} — ${r.title}`);link.href=r.url;link.target='_blank';link.rel='noopener noreferrer';title.append(link)} else title.textContent=`${r.artist} — ${r.title}`;
    info.append(title,el('span','',r.role));
    if(Array.isArray(r.tracks)&&r.tracks.length && r.id!=='mahzuni'){
      const details=el('details','recording-tracks');
      details.append(el('summary','',state.lang==='tr'?`${r.tracks.length} parçayı göster`:`View ${r.tracks.length} tracks`));
      const list=el('ol','recording-tracklist');r.tracks.forEach(track=>list.append(el('li','',track)));
      details.append(list);info.append(details);
    }
    row.append(info,el('span','recording-type',r.type||''));root.append(row);
  }
}
document.getElementById('year').textContent=new Date().getFullYear();
document.getElementById('lang-switch').addEventListener('click',()=>{state.lang=state.lang==='en'?'tr':'en';rememberLanguage(state.lang);update()});
document.querySelectorAll('[data-filter]').forEach(b=>b.addEventListener('click',()=>{state.filter=b.dataset.filter;update()}));
update();
fetch('data/site.json',{cache:'no-store'}).then(r=>{if(!r.ok)throw new Error('Failed to load');return r.json()}).then(data=>{if(Array.isArray(data.recordings))state.records=data.recordings;state.latestMix=data.latestMix||null;update()}).catch(err=>{console.error(err);if(!state.records.length){const p=el('p','empty-dates','Records are temporarily unavailable.');document.getElementById('recordings-all').append(p)}});


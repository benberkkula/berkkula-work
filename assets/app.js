const i18n={
  en:{
    photoLabel:'LIVE SOUND',navWork:'Work',navDiscography:'Discography',navVideos:'Video',navDates:'Dates',navAbout:'About',
    introLabel:'ISTANBUL · INTERNATIONAL',introText:'Live sound, recording and mixing. A focused approach to sound, in the studio and on stage.',seeWork:'Selected work ↗',contact:'Get in touch',cvLink:'CV ↗',portfolioLink:'Portfolio PDF ↗',portraitTitle:'Audio engineer',portraitBody:'Live sound and studio work across concerts, records and touring productions.',
    selectedWork:'Selected work',selectedIntro:'A selection of recording, mixing and live sound credits.',latestMix:'LATEST MIX',listen:'Listen / watch ↗',albumCredit:'ALBUM / MIXING',albumLink:'Explore recordings ↗',discographyCardTitle:'Discography',discographyCardBody:'Selected albums, singles & recording credits · 2007–2026',liveCredit:'LIVE RECORDING / MIXING',watchVideo:'Watch video ↗',
    ongoingTitle:'Core live projects',rolesLabel:'Roles & years',collabsTitle:'Selected collaborations',collabsIntro:'Selected artists from live and studio projects.',
    mixesTitle:'Mixes',mixesIntro:'Latest mix on Spotify, followed by a dated selection of earlier recording and mixing work.',mixPlayerLabel:'CURRENT MIX SPOTLIGHT',openMix:'Watch on YouTube ↗',mixUpdateTitle:'IN THE ARCHIVE',mixUpdateBody:'Albums, singles and live recordings, organized by release year.',docLinksTitle:'DOCUMENTS',audioFallback:'Listen on Spotify. Playback availability depends on Spotify.',playLatest:'Play latest mix',
    archiveEyebrow:'RECENT & EARLIER WORK',archiveTitle:'Recording & mixing archive',allRecordings:'Full discography ↗',
    videosTitle:'Latest live videos',videosIntro:'Three selected recent live-related works. Videos open on YouTube.',
    datesTitle:'Upcoming dates',datesIntro:'Live schedule.',turkey:'Türkiye',international:'International',scheduledShows:'SCHEDULED PERFORMANCES',noConcerts:'New performance dates will be announced here.',
    aboutTitle:'About',aboutLead:'Independent audio engineer working across live performance, studio recording and mixing since 2007.',aboutBody:'FOH and monitor engineering for tours and festivals. Studio recording and mixing from a private mix suite, with project sessions at various studios.',writeMe:'Email me ↗',
    loadSpotify:'Load Spotify player ↗',spotifyPreviewLabel:'SPOTIFY AUDIO',err:'Schedule temporarily unavailable. Please check again later.'
  },
  tr:{
    photoLabel:'KONSER SESİ',navWork:'İşler',navDiscography:'Diskografi',navVideos:'Video',navDates:'Takvim',navAbout:'Hakkında',
    introLabel:'İSTANBUL · ULUSLARARASI',introText:'Konser ses mühendisliği, kayıt ve miks. Stüdyoda ve sahnede müziğe odaklanan bir yaklaşım.',seeWork:'Seçili işler ↗',contact:'İletişime geç',cvLink:'CV ↗',portfolioLink:'Portfolyo PDF ↗',portraitTitle:'Ses mühendisi',portraitBody:'Konser, kayıt ve turne prodüksiyonlarında canlı ses ve stüdyo çalışmaları.',
    selectedWork:'Seçili işler',selectedIntro:'Kayıt, miks ve canlı ses çalışmalarından bir seçki.',latestMix:'SON MİKS',listen:'Dinle / izle ↗',albumCredit:'ALBÜM / MİKS',albumLink:'Diskografiye git ↗',discographyCardTitle:'Diskografi',discographyCardBody:'Seçili albümler, tekliler ve kayıt kredileri · 2007–2026',liveCredit:'CANLI KAYIT / MİKS',watchVideo:'Videoyu izle ↗',
    ongoingTitle:'Süregelen sahne projeleri',rolesLabel:'Görevler ve yıllar',collabsTitle:'Seçili iş birlikleri',collabsIntro:'Sahne ve stüdyo projelerinden seçili sanatçılar.',
    mixesTitle:'Miksler',mixesIntro:'Spotify’da son miks; altında tarihli eski kayıt ve miks çalışmaları.',mixPlayerLabel:'GÜNCEL MİKS SPOTU',openMix:'YouTube’da izle ↗',mixUpdateTitle:'ARŞİVDE',mixUpdateBody:'Albümler, tekliler ve canlı kayıtlar yayın yılına göre sıralanır.',docLinksTitle:'DOKÜMANLAR',audioFallback:'Spotify’da dinle. Tam oynatma için Spotify gerekebilir.',playLatest:'Son miksi oynat',
    archiveEyebrow:'YENİ & ESKİ ÇALIŞMALAR',archiveTitle:'Kayıt ve miks arşivi',allRecordings:'Tüm diskografi ↗',
    videosTitle:'Güncel live videolar',videosIntro:'Yakın dönemden seçili üç live iş. Videolar YouTube’da açılır.',
    datesTitle:'Yaklaşan konserler',datesIntro:'Konser takvimi.',turkey:'Türkiye',international:'Yurtdışı',scheduledShows:'PLANLANAN KONSERLER',noConcerts:'Yeni konser tarihleri burada yayınlanacak.',
    aboutTitle:'Hakkında',aboutLead:'2007’den bu yana canlı ses, stüdyo kaydı ve miks alanlarında çalışan bağımsız ses mühendisi.',aboutBody:'Turneler ve festivaller için FOH ve monitör mühendisliği. Özel miks stüdyosunda kayıt ve miks; farklı stüdyolarda proje bazlı çalışmalar.',writeMe:'E-posta gönder ↗',
    loadSpotify:'Spotify oynatıcıyı aç ↗',spotifyPreviewLabel:'SPOTIFY SES',err:'Takvim geçici olarak yüklenemedi. Lütfen daha sonra tekrar deneyin.'
  }
};
const state={recordings:[],lang:'en',cursor:new Date(new Date().getFullYear(),new Date().getMonth(),1),events:[],latestMix:null};
const $=sel=>document.querySelector(sel);
const getToday=()=>{const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`};
const locale=()=>state.lang==='tr'?'tr-TR':'en-GB';
function setLanguage(lang){
  state.lang=lang;document.documentElement.lang=lang;
  document.querySelectorAll('[data-i18n]').forEach(node=>{const translated=i18n[lang][node.dataset.i18n];if(translated)node.textContent=translated;});
  $('#lang-switch').textContent=lang==='en'?'TR':'EN';
  renderCalendar();renderUpcoming();renderLatestDate();renderRecordings();if(state.latestMix)renderMixPlayer(state.latestMix);
}
const el=(tag,cls,text)=>{const node=document.createElement(tag);if(cls)node.className=cls;if(text!==undefined)node.textContent=text;return node};
function artistSpotifyLink(name, profiles){
  const href=profiles?.[name];
  if(typeof href!=='string'||!/^https:\/\/open\.spotify\.com\/artist\/[A-Za-z0-9]{22}$/.test(href))return document.createTextNode(name);
  const link=el('a','artist-spotify',name);
  link.href=href;link.target='_blank';link.rel='noopener noreferrer';link.title='Spotify — '+name;
  return link;
}
function renderProjects(projects,profiles){const root=$('#core-projects');root.replaceChildren();for(const project of projects){const row=el('div','credit-row');const title=el('strong');title.append(artistSpotifyLink(project.artist,profiles));row.append(title,el('span','',`${project.role} · ${project.years}`));root.append(row)}}
function renderCollabs(names,profiles){const root=$('#collab-list');root.replaceChildren();names.forEach(name=>{const item=el('span');item.append(artistSpotifyLink(name,profiles));root.append(item)})}
function renderLatestDate(){const target=$('#latest-mix-date');if(target.dataset.displayDate){target.textContent=target.dataset.displayDate;return}if(target.dataset.iso){const parts=target.dataset.iso.split('-').map(Number);target.textContent=new Intl.DateTimeFormat(locale(),{day:'numeric',month:'long',year:'numeric'}).format(new Date(parts[0],parts[1]-1,parts[2]))}}
function renderMix(mix){
  state.latestMix=mix;
  $('#latest-mix-title').textContent=mix.title;
  $('#latest-mix-artist').textContent=mix.artist;
  $('#latest-mix-date').dataset.iso=mix.date;
  $('#latest-mix-date').dataset.displayDate=mix.displayDate||'';
  if(/^https:\/\//.test(mix.url))$('#latest-mix-link').href=mix.url;
  const titleNode=$('#mix-section-title'), artistNode=$('#mix-section-artist'), linkNode=$('#mix-section-link');
  if(titleNode) titleNode.textContent=mix.title;
  if(artistNode) artistNode.textContent=mix.artist + (mix.role?` · ${mix.role}`:'');
  if(linkNode && /^https:\/\//.test(mix.url)) linkNode.href=mix.url;
  renderLatestDate();renderMixPlayer(mix);
}
function spotifyTrackId(mix){
  for(const value of [mix.spotifyUrl,mix.url]){
    if(!value)continue;
    try{
      const u=new URL(value);
      if(u.protocol!=='https:'||u.hostname!=='open.spotify.com')continue;
      const found=u.pathname.match(/(?:^|\/)track\/([A-Za-z0-9]{22})(?:\/|$)/);
      if(found)return found[1];
    }catch{}
  }
  return null;
}
function renderMixPlayer(mix){
  const shell=$('#mix-player-shell');if(!shell)return;shell.replaceChildren();
  if(mix.audioUrl && /^https:\/\//.test(mix.audioUrl)){
    const audio=el('audio');audio.controls=true;audio.preload='none';audio.src=mix.audioUrl;audio.style.width='100%';shell.append(audio);return;
  }
  const trackId=spotifyTrackId(mix);
  if(trackId){
    const preview=el('div','spotify-preview');
    const intro=el('div','spotify-preview-info');
    intro.append(el('span','spotify-brand',i18n[state.lang].spotifyPreviewLabel),el('strong','spotify-track',mix.title),el('span','spotify-artist',mix.artist));
    const load=el('button','spotify-load',i18n[state.lang].loadSpotify);load.type='button';
    load.addEventListener('click',()=>{
      const player=el('iframe','spotify-frame');
      player.src=`https://open.spotify.com/embed/track/${trackId}?utm_source=generator`;
      player.title=`Spotify — ${mix.artist} · ${mix.title}`;
      player.allow='autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture';
      player.loading='lazy';player.height='152';
      preview.replaceWith(player);
    });
    preview.append(intro,load);shell.append(preview);
    const note=el('p','spotify-caption');
    note.append(document.createTextNode(i18n[state.lang].audioFallback+' '));
    const link=el('a','',state.lang==='tr'?'Spotify’da aç ↗':'Open in Spotify ↗');
    link.href=mix.spotifyUrl||mix.url;link.target='_blank';link.rel='noopener noreferrer';
    note.append(link);shell.append(note);
    return;
  }
  const card=el('div','audio-card');
  const note=el('p','audio-note',state.lang==='tr'?'Ses önizlemesi bulunmuyor. Bağlantıdan dinleyebilirsin.':'No embedded audio preview yet. Follow the listening link.');
  card.append(note);shell.append(card);
}
function extractVideoId(url){try{const u=new URL(url);return u.searchParams.get('v')||u.pathname.split('/').pop()||''}catch{return ''}}
function renderVideos(videos){
  const root=$('#video-grid');root.replaceChildren();
  videos.slice(0,3).forEach((vid,i)=>{
    if(!/^[\w-]{11}$/.test(vid.videoId))return;
    const article=el('article','video-card');
    const button=el('button','video-thumb');button.type='button';button.setAttribute('aria-label',`Play ${vid.artist} – ${vid.title}`);
    const img=el('img');img.src=`https://i.ytimg.com/vi/${vid.videoId}/hqdefault.jpg`;img.alt=`${vid.artist} – ${vid.title}`;img.loading='lazy';
    button.append(img,el('span','play','▶'));
    button.addEventListener('click',()=>{const iframe=el('iframe');iframe.src=`https://www.youtube-nocookie.com/embed/${vid.videoId}?autoplay=1`;iframe.title=`${vid.artist} – ${vid.title}`;iframe.loading='lazy';iframe.allow='accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture';iframe.allowFullscreen=true;iframe.style.cssText='display:block;width:100%;aspect-ratio:16/9;border:0';button.replaceWith(iframe)});
    const meta=el('div','video-meta');meta.append(el('span','',`0${i+1} / 03`),el('span','',vid.type.toUpperCase()));
    const heading=el('h3');const link=el('a','',vid.title);link.href=`https://www.youtube.com/watch?v=${vid.videoId}`;link.target='_blank';link.rel='noopener noreferrer';heading.append(link);
    article.append(button,meta,heading,el('p','',vid.artist));root.append(article);
  });
}
function renderRecordings(){
  const root=$('#recording-preview-list'); if(!root) return;
  root.replaceChildren();
  const records=[...state.recordings].sort((x,y)=>(y.date || String(y.year)).localeCompare(x.date || String(x.year)));
  for(const rec of records.slice(0,8)){
    const row=el('div','recording-row');
    const year=el('span','recording-year',String(rec.displayDate||rec.year||rec.date?.slice(0,4)||''));
    const info=el('div','recording-info');
    const title=el('strong');
    const label=`${rec.artist} — ${rec.title}`;
    if(rec.url && /^https:\/\//.test(rec.url)){
      const link=el('a','',label);link.href=rec.url;link.target='_blank';link.rel='noopener noreferrer';title.append(link);
    }else title.textContent=label;
    info.append(title,el('span','',rec.role));
    row.append(year,info,el('span','recording-type',rec.type||''));
    root.append(row);
  }
}
function normalizedEvent(item){if(!item||!/^\d{4}-\d{2}-\d{2}$/.test(item.date)||typeof item.artist!=='string'||!item.artist.trim())return null;return {...item,region:item.country?.toUpperCase()==='TR'?'tr':'int'}}
function renderCalendar(){const {cursor,events}=state;const year=cursor.getFullYear(),month=cursor.getMonth();$('#calendar-month').textContent=new Intl.DateTimeFormat(locale(),{month:'long',year:'numeric'}).format(cursor);const weekdays=$('#weekdays');weekdays.replaceChildren();const monday=new Date(2026,0,5);for(let i=0;i<7;i++){const d=new Date(monday);d.setDate(d.getDate()+i);weekdays.append(el('span','',new Intl.DateTimeFormat(locale(),{weekday:'short'}).format(d)))}const grid=$('#calendar-days');grid.replaceChildren();const offset=(new Date(year,month,1).getDay()+6)%7;const length=new Date(year,month+1,0).getDate();const cellCount=Math.ceil((offset+length)/7)*7;const eventByDate=new Map();events.filter(e=>e.date>=getToday()).forEach(e=>{const ar=eventByDate.get(e.date)||[];ar.push(e);eventByDate.set(e.date,ar)});for(let i=0;i<cellCount;i++){const day=i-offset+1,valid=day>=1&&day<=length,d=new Date(year,month,day),iso=`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;const cell=el('div',`calendar-cell${valid?' in-month':''}${iso===getToday()?' today':''}`,String(d.getDate()));if(valid&&eventByDate.has(iso)){const marks=el('div','day-marks');const dayEvents=eventByDate.get(iso);for(const region of ['tr','int'])if(dayEvents.some(x=>x.region===region))marks.append(el('i',region==='int'?'international':''));cell.append(marks);cell.title=dayEvents.map(x=>`${x.artist} — ${x.role}`).join(' / ')}grid.append(cell)}}
function renderUpcoming(){const upcoming=state.events.filter(e=>e.date>=getToday()).sort((a,b)=>a.date.localeCompare(b.date)||a.artist.localeCompare(b.artist));$('#shows-count').textContent=String(upcoming.length).padStart(2,'0');const root=$('#upcoming-shows');root.replaceChildren();if(!upcoming.length){root.append(el('p','empty-dates',i18n[state.lang].noConcerts));return}upcoming.slice(0,12).forEach(e=>{const row=el('div',`date-item${e.region==='int'?' abroad':''}`);const d=e.date.split('-').map(Number),time=el('time','',new Intl.DateTimeFormat(locale(),{day:'2-digit',month:'short'}).format(new Date(d[0],d[1]-1,d[2])));time.dateTime=e.date;const details=el('div');details.append(el('strong','',e.artist),el('span','place',[e.city,e.venue,e.country?.toUpperCase()==='TR'?'':e.country].filter(Boolean).join(' · ')));row.append(time,details,el('span','role',e.role||'Live audio'));root.append(row)})}
async function init(){
  $('#year').textContent=new Date().getFullYear();
  $('#month-prev').addEventListener('click',()=>{state.cursor=new Date(state.cursor.getFullYear(),state.cursor.getMonth()-1,1);renderCalendar()});
  $('#month-next').addEventListener('click',()=>{state.cursor=new Date(state.cursor.getFullYear(),state.cursor.getMonth()+1,1);renderCalendar()});
  $('#lang-switch').addEventListener('click',()=>setLanguage(state.lang==='en'?'tr':'en')); 
  renderCalendar();renderUpcoming();setLanguage('en');
  try{const [siteRes,showsRes]=await Promise.all([fetch('data/site.json',{cache:'no-store'}),fetch('data/concerts.json',{cache:'no-store'})]);if(!siteRes.ok||!showsRes.ok)throw new Error('Unable to load site data');const [site,shows]=await Promise.all([siteRes.json(),showsRes.json()]);renderMix(site.latestMix);renderProjects(site.projects||[],site.artistSpotify||{});renderCollabs(site.collaborations||[],site.artistSpotify||{});renderVideos(site.videos||[]);state.recordings=site.recordings||[];renderRecordings();state.events=(shows.concerts||[]).map(normalizedEvent).filter(Boolean);renderCalendar();renderUpcoming()}catch(error){console.error(error);$('#upcoming-shows').replaceChildren(el('p','empty-dates',i18n[state.lang].err))}
}
init();
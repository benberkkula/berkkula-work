const LANGUAGE_KEY='berkkula.language';
function savedLanguage(){try{return localStorage.getItem(LANGUAGE_KEY)==='tr'?'tr':'en'}catch{return 'en'}}
function rememberLanguage(lang){try{localStorage.setItem(LANGUAGE_KEY,lang)}catch{/* Storage may be unavailable. */}}
const i18n={
  en:{
    photoLabel:'LIVE SOUND',navWork:'Work',navDiscography:'Discography',navVideos:'Video',navDates:'Dates',navAbout:'About',
    introLabel:'ISTANBUL · INTERNATIONAL',introText:'Live sound, recording and mixing. A focused approach to sound, in the studio and on stage.',seeWork:'Discography ↗',contact:'Get in touch',cvLink:'CV ↗',portfolioLink:'Portfolio PDF ↗',portraitTitle:'Audio engineer',portraitBody:'Live sound and studio work across concerts, records and touring productions.',
    selectedWork:'Selected credits',selectedIntro:'A selection of recording and mixing credits.',latestMix:'LATEST MIX',listen:'Listen',albumCredit:'ALBUMS — RECORDING / MIXING',albumLink:'Explore recordings ↗',discographyCardTitle:'Discography',discographyCardBody:'Selected albums and singles — recording & mixing credits · 2007–2026',liveCredit:'LIVE RECORDING / MIXING',watchVideo:'Watch video ↗',
    ongoingTitle:'Core live projects',rolesLabel:'Roles & years',collabsTitle:'Selected collaborations',collabsIntro:'Selected artists from live and studio projects.',
    mixesTitle:'Mixes',mixesIntro:'Latest mix on Spotify, followed by a dated selection of earlier recording and mixing work.',mixPlayerLabel:'CURRENT MIX SPOTLIGHT',openMix:'Watch on YouTube ↗',mixUpdateTitle:'IN THE ARCHIVE',mixUpdateBody:'Albums, singles and live recordings, organized by release year.',docLinksTitle:'DOCUMENTS',audioFallback:'Listen on Spotify. Playback availability depends on Spotify.',playLatest:'Play latest mix',
    archiveEyebrow:'RECENT & EARLIER WORK',archiveTitle:'Recording & mixing archive',allRecordings:'Full discography ↗',
    videosTitle:'Selected works',videosIntro:'Three selected live recording & mixing works.',
    datesTitle:'Upcoming dates',datesIntro:'Live schedule.',turkey:'Turkey',international:'International',scheduledShows:'NEXT PERFORMANCES',noConcerts:'New performance dates will be announced here.',
    aboutTitle:'About',aboutLead:'Independent audio engineer working across live performance, studio recording and mixing since 2007.',aboutLiveTitle:'Live Sound Engineering',aboutLiveText:'FOH and monitor engineering for concerts, tours and festivals.',aboutMixTitle:'Mixing',aboutMixText:'Professional mixing services from my private mixing suite.',aboutStudioTitle:'Studio Recording',aboutStudioText:'Recording sessions and music productions at various professional studios.',writeMe:'Get in touch ↗',
    loadSpotify:'Load Spotify player ↗',spotifyPreviewLabel:'SPOTIFY AUDIO',err:'Schedule temporarily unavailable. Please check again later.'
  },
  tr:{
    photoLabel:'KONSER SESİ',navWork:'İşler',navDiscography:'Diskografi',navVideos:'Video',navDates:'Takvim',navAbout:'Hakkında',
    introLabel:'İSTANBUL · ULUSLARARASI',introText:'Konser ses mühendisliği, kayıt ve miks. Stüdyoda ve sahnede müziğe odaklanan bir yaklaşım.',seeWork:'Diskografi ↗',contact:'İletişime geç',cvLink:'CV ↗',portfolioLink:'Portfolyo PDF ↗',portraitTitle:'Ses mühendisi',portraitBody:'Konser, kayıt ve turne prodüksiyonlarında canlı ses ve stüdyo çalışmaları.',
    selectedWork:'Seçili referanslar',selectedIntro:'Kayıt ve miks çalışmalarından bir seçki.',latestMix:'SON MİKS',listen:'Dinle',albumCredit:'ALBÜMLER — KAYIT / MİKS',albumLink:'Diskografiye git ↗',discographyCardTitle:'Diskografi',discographyCardBody:'Seçili albüm ve tekliler — kayıt ve miks kredileri · 2007–2026',liveCredit:'CANLI KAYIT / MİKS',watchVideo:'Videoyu izle ↗',
    ongoingTitle:'Süregelen sahne projeleri',rolesLabel:'Görevler ve yıllar',collabsTitle:'Seçili iş birlikleri',collabsIntro:'Sahne ve stüdyo projelerinden seçili sanatçılar.',
    mixesTitle:'Miksler',mixesIntro:'Spotify’da son miks; altında tarihli eski kayıt ve miks çalışmaları.',mixPlayerLabel:'GÜNCEL MİKS SPOTU',openMix:'YouTube’da izle ↗',mixUpdateTitle:'ARŞİVDE',mixUpdateBody:'Albümler, tekliler ve canlı kayıtlar yayın yılına göre sıralanır.',docLinksTitle:'DOKÜMANLAR',audioFallback:'Spotify’da dinle. Tam oynatma için Spotify gerekebilir.',playLatest:'Son miksi oynat',
    archiveEyebrow:'YENİ & ESKİ ÇALIŞMALAR',archiveTitle:'Kayıt ve miks arşivi',allRecordings:'Tüm diskografi ↗',
    videosTitle:'Seçili çalışmalar',videosIntro:'Seçili üç canlı kayıt ve miks çalışması.',
    datesTitle:'Yaklaşan konserler',datesIntro:'Konser takvimi.',turkey:'Türkiye',international:'Yurtdışı',scheduledShows:'SIRADAKİ KONSERLER',noConcerts:'Yeni konser tarihleri burada yayınlanacak.',
    aboutTitle:'Hakkında',aboutLead:'2007’den bu yana canlı ses, stüdyo kaydı ve miks alanlarında çalışan bağımsız ses mühendisi.',aboutLiveTitle:'Canlı Ses Mühendisliği',aboutLiveText:'Konser, turne ve festivallerde FOH ve monitör ses mühendisliği.',aboutMixTitle:'Miks',aboutMixText:'Kendi özel miks stüdyomda profesyonel miks hizmetleri.',aboutStudioTitle:'Stüdyo Kaydı',aboutStudioText:'Farklı profesyonel stüdyolarda kayıt seansları ve müzik prodüksiyonları.',writeMe:'İletişime geç ↗',
    loadSpotify:'Spotify oynatıcıyı aç ↗',spotifyPreviewLabel:'SPOTIFY SES',err:'Takvim geçici olarak yüklenemedi. Lütfen daha sonra tekrar deneyin.'
  }
};
const state={recordings:[],lang:'en',cursor:new Date(new Date().getFullYear(),new Date().getMonth(),1),events:[],latestMix:null,scheduleUnavailable:false};
const $=sel=>document.querySelector(sel);
const getToday=()=>{const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`};
const locale=()=>state.lang==='tr'?'tr-TR':'en-GB';
function setLanguage(lang){
  rememberLanguage(lang);
  state.lang=lang;document.documentElement.lang=lang;
  document.querySelectorAll('[data-i18n]').forEach(node=>{const translated=i18n[lang][node.dataset.i18n];if(translated)node.textContent=translated;});
  $('#lang-switch').textContent=lang==='en'?'TR':'EN';
  $('#lang-switch').setAttribute('aria-label',lang==='en'?'TR — Switch to Turkish':'EN — İngilizceye geç');
  $('#month-prev').setAttribute('aria-label',lang==='en'?'Previous month':'Önceki ay');
  $('#month-next').setAttribute('aria-label',lang==='en'?'Next month':'Sonraki ay');
  $('.calendar').setAttribute('aria-label',lang==='en'?'Concert calendar':'Konser takvimi');
  document.querySelectorAll('.video-thumb').forEach(button=>button.setAttribute('aria-label',`${lang==='en'?'Play':'Oynat'} ${button.querySelector('img').alt}`));
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
function markCollabLineStarts(){
  const root=$('#collab-list');
  if(!root)return;
  // Read every position before changing classes to avoid repeated forced layouts.
  const items=[...root.children];
  const tops=items.map(item=>item.getBoundingClientRect().top);
  let previousTop=null;
  for(let i=0;i<items.length;i++){
    const top=tops[i];
    items[i].classList.toggle('line-start',previousTop===null||top>previousTop+2);
    previousTop=top;
  }
}
function renderCollabs(names,profiles){const root=$('#collab-list');root.replaceChildren();names.forEach(name=>{const item=el('span');item.append(artistSpotifyLink(name,profiles));root.append(item)});requestAnimationFrame(markCollabLineStarts)}
function renderLatestDate(){const target=$('#latest-mix-date');if(target.dataset.displayDate){target.textContent=target.dataset.displayDate;return}if(target.dataset.iso){const parts=target.dataset.iso.split('-').map(Number);target.textContent=new Intl.DateTimeFormat(locale(),{day:'numeric',month:'long',year:'numeric'}).format(new Date(parts[0],parts[1]-1,parts[2]))}}
function initLatestMixLoading(){
  const frame=$('#latest-mix-frame');
  if(!frame||frame.hasAttribute('src'))return;
  const load=()=>{
    if(!frame.dataset.spotifySrc)return;
    frame.src=frame.dataset.spotifySrc;
    delete frame.dataset.spotifySrc;
  };
  const observe=()=>{
    if(!('IntersectionObserver' in window)){load();return;}
    const observer=new IntersectionObserver(entries=>{
      if(entries.some(entry=>entry.isIntersecting)){
        load();
        observer.disconnect();
      }
    },{rootMargin:'300px 0px'});
    observer.observe(frame);
  };
  if(window.PerformanceObserver?.supportedEntryTypes?.includes('paint')){
    if(performance.getEntriesByName('first-contentful-paint').length){observe();return;}
    const paintObserver=new PerformanceObserver(entries=>{
      if(entries.getEntries().some(entry=>entry.name==='first-contentful-paint')){
        paintObserver.disconnect();
        observe();
      }
    });
    paintObserver.observe({type:'paint',buffered:true});
  }else requestAnimationFrame(()=>requestAnimationFrame(observe));
}
function renderMix(mix){
  state.latestMix=mix;
  $('#latest-mix-title').textContent=mix.title;
  $('#latest-mix-artist').textContent=mix.artist;
  $('#latest-mix-date').dataset.iso=mix.date;
  $('#latest-mix-date').dataset.displayDate=mix.displayDate||'';
  const trackId=spotifyTrackId(mix);
  if(trackId){
    const frame=$('#latest-mix-frame');
    const src=`https://open.spotify.com/embed/track/${trackId}?utm_source=generator&theme=0`;
    if(frame.hasAttribute('src')){
      if(frame.getAttribute('src')!==src)frame.src=src;
    }else frame.dataset.spotifySrc=src;
    frame.title=`Spotify — ${mix.artist} — ${mix.title}`;
  }
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
    if(!/^[A-Za-z0-9_-]{11}$/.test(vid.videoId))return;
    const article=el('article','video-card');
    const frame=el('div','video-frame');
    const button=el('button','video-thumb');button.type='button';button.setAttribute('aria-label',`${state.lang==='en'?'Play':'Oynat'} ${vid.artist} – ${vid.title}`);
    const img=el('img');img.src=`https://i.ytimg.com/vi/${vid.videoId}/hqdefault.jpg`;img.alt=`${vid.artist} – ${vid.title}`;img.loading='lazy';
    button.append(img,el('span','play','▶'));
    button.addEventListener('click',()=>{
      const iframe=el('iframe');
      iframe.src=`https://www.youtube-nocookie.com/embed/${vid.videoId}?autoplay=1&start=0`;
      iframe.title=`${vid.artist} – ${vid.title}`;iframe.allow='accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture';
      iframe.allowFullscreen=true;
      button.replaceWith(iframe);
    });
    frame.append(button);
    const meta=el('div','video-meta');meta.append(el('span','',`0${i+1} / 03`),el('span','',vid.type.toUpperCase()));
    const heading=el('h3');const link=el('a','',vid.title);link.href=`https://www.youtube.com/watch?v=${vid.videoId}`;link.target='_blank';link.rel='noopener noreferrer';heading.append(link);
    article.append(frame,meta,heading,el('p','',vid.artist));root.append(article);
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
// One shared, text-only tooltip for hover, keyboard focus and touch.
let calendarPopup=null,calendarPopupAnchor=null,calendarPopupMode='',calendarPopupTimer=null;
let calendarPointerFocus=false;
function closeCalendarPopup(){
  clearTimeout(calendarPopupTimer);
  if(calendarPopupAnchor){
    calendarPopupAnchor.setAttribute('aria-expanded','false');
    calendarPopupAnchor.removeAttribute('aria-describedby');
  }
  calendarPopupAnchor=null;calendarPopupMode='';
  if(calendarPopup)calendarPopup.hidden=true;
}
function deferCalendarPopupClose(){
  clearTimeout(calendarPopupTimer);
  calendarPopupTimer=setTimeout(()=>{if(calendarPopupMode==='hover')closeCalendarPopup()},120);
}
function ensureCalendarPopup(){
  if(!calendarPopup){
    calendarPopup=el('div','calendar-tooltip');calendarPopup.id='calendar-event-tooltip';
    calendarPopup.setAttribute('role','tooltip');calendarPopup.hidden=true;
    calendarPopup.addEventListener('pointerenter',()=>clearTimeout(calendarPopupTimer));
    calendarPopup.addEventListener('pointerleave',deferCalendarPopupClose);
    document.body.append(calendarPopup);
  }
}
function showCalendarPopup(anchor,dayEvents,iso,mode){
  clearTimeout(calendarPopupTimer);
  ensureCalendarPopup();
  if(calendarPopupAnchor&&calendarPopupAnchor!==anchor)closeCalendarPopup();
  calendarPopupAnchor=anchor;calendarPopupMode=mode;
  calendarPopup.replaceChildren();
  const [year,month,day]=iso.split('-').map(Number);
  calendarPopup.append(el('div','calendar-tooltip-date',new Intl.DateTimeFormat(locale(),{day:'numeric',month:'long',year:'numeric'}).format(new Date(year,month-1,day))));
  for(const event of dayEvents){
    const item=el('div','calendar-tooltip-event');
    item.append(el('strong','',event.artist),el('span','calendar-tooltip-place',[event.city,event.venue].filter(Boolean).join(' · ')),el('span','calendar-tooltip-role',event.role||'Live audio'));
    calendarPopup.append(item);
  }
  calendarPopup.hidden=false;
  anchor.setAttribute('aria-expanded','true');anchor.setAttribute('aria-describedby',calendarPopup.id);
  const rect=anchor.getBoundingClientRect(),box=calendarPopup.getBoundingClientRect();
  const left=Math.max(12,Math.min(rect.left+rect.width/2-box.width/2,window.innerWidth-box.width-12));
  const below=rect.bottom+8;
  const top=below+box.height<=window.innerHeight-12?below:Math.max(12,rect.top-box.height-8);
  calendarPopup.style.left=`${left}px`;calendarPopup.style.top=`${top}px`;
}
function initCalendarPopup(){
  ensureCalendarPopup();
  document.addEventListener('pointerdown',event=>{
    calendarPointerFocus=true;
    if(calendarPopupAnchor&&!calendarPopupAnchor.contains(event.target)&&!calendarPopup?.contains(event.target))closeCalendarPopup();
  });
  document.addEventListener('keydown',event=>{
    calendarPointerFocus=false;
    if(event.key==='Escape')closeCalendarPopup();
  });
  window.addEventListener('resize',closeCalendarPopup);
  document.addEventListener('scroll',event=>{if(event.target!==calendarPopup)closeCalendarPopup()},true);
}
function renderCalendar(){
  closeCalendarPopup();
  const {cursor,events}=state;
  const year=cursor.getFullYear(),month=cursor.getMonth();
  $('#calendar-month').textContent=new Intl.DateTimeFormat(locale(),{month:'long',year:'numeric'}).format(cursor);
  const weekdays=$('#weekdays');weekdays.replaceChildren();const monday=new Date(2026,0,5);
  for(let i=0;i<7;i++){const d=new Date(monday);d.setDate(d.getDate()+i);weekdays.append(el('span','',new Intl.DateTimeFormat(locale(),{weekday:'short'}).format(d)))}
  const grid=$('#calendar-days');grid.replaceChildren();
  const offset=(new Date(year,month,1).getDay()+6)%7,length=new Date(year,month+1,0).getDate();
  const cellCount=Math.ceil((offset+length)/7)*7,eventByDate=new Map();
  events.filter(e=>e.date>=getToday()).forEach(e=>{const ar=eventByDate.get(e.date)||[];ar.push(e);eventByDate.set(e.date,ar)});
  for(let i=0;i<cellCount;i++){
    const day=i-offset+1,valid=day>=1&&day<=length,d=new Date(year,month,day);
    const iso=`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
    const dayEvents=valid?eventByDate.get(iso):null;
    const cell=el(dayEvents?'button':'div',`calendar-cell${valid?' in-month':''}${iso===getToday()?' today':''}${dayEvents?' calendar-event':''}`,String(d.getDate()));
    if(dayEvents){
      cell.type='button';cell.dataset.date=iso;
      cell.setAttribute('aria-expanded','false');cell.setAttribute('aria-controls','calendar-event-tooltip');
      cell.setAttribute('aria-label',new Intl.DateTimeFormat(locale(),{day:'numeric',month:'long',year:'numeric'}).format(d)+': '+dayEvents.map(e=>e.artist).join(', '));
      const marks=el('div','day-marks');marks.setAttribute('aria-hidden','true');
      for(const region of ['tr','int'])if(dayEvents.some(x=>x.region===region))marks.append(el('i',region==='int'?'international':''));
      cell.append(marks);
      cell.addEventListener('pointerenter',event=>{if(event.pointerType==='mouse')showCalendarPopup(cell,dayEvents,iso,'hover')});
      cell.addEventListener('pointerleave',()=>{if(calendarPopupAnchor===cell&&calendarPopupMode==='hover')deferCalendarPopupClose()});
      cell.addEventListener('focus',()=>{if(!calendarPointerFocus)showCalendarPopup(cell,dayEvents,iso,'focus')});
      cell.addEventListener('blur',()=>{if(calendarPopupAnchor===cell)closeCalendarPopup()});
      cell.addEventListener('click',event=>{
        const touch=event.pointerType==='touch'||event.pointerType==='pen';
        if(touch&&calendarPopupAnchor===cell)closeCalendarPopup();
        else showCalendarPopup(cell,dayEvents,iso,touch?'touch':event.detail===0?'focus':'hover');
      });
    }
    grid.append(cell);
  }
}
function renderUpcoming(){const upcoming=state.events.filter(e=>e.date>=getToday()).sort((a,b)=>a.date.localeCompare(b.date)||a.artist.localeCompare(b.artist));const visible=upcoming.slice(0,4);$('#shows-count').textContent=String(visible.length).padStart(2,'0');const root=$('#upcoming-shows');root.replaceChildren();if(state.scheduleUnavailable){root.append(el('p','empty-dates',i18n[state.lang].err));return}if(!upcoming.length){root.append(el('p','empty-dates',i18n[state.lang].noConcerts));return}visible.forEach(e=>{const row=el('div',`date-item${e.region==='int'?' abroad':''}`);const d=e.date.split('-').map(Number),time=el('time','',new Intl.DateTimeFormat(locale(),{day:'2-digit',month:'short'}).format(new Date(d[0],d[1]-1,d[2])));time.dateTime=e.date;const details=el('div');const place=el('span','place');place.append(el('span','city',e.city));const remaining=[e.venue,e.country?.toUpperCase()==='TR'?'':e.country].filter(Boolean);if(remaining.length)place.append(document.createTextNode(' · '+remaining.join(' · ')));details.append(el('strong','',e.artist),place);row.append(time,details,el('span','role',e.role||'Live audio'));root.append(row)})}
async function init(){
  initCalendarPopup();
  initLatestMixLoading();
  $('#year').textContent=new Date().getFullYear();
  $('#month-prev').addEventListener('click',()=>{state.cursor=new Date(state.cursor.getFullYear(),state.cursor.getMonth()-1,1);renderCalendar()});
  $('#month-next').addEventListener('click',()=>{state.cursor=new Date(state.cursor.getFullYear(),state.cursor.getMonth()+1,1);renderCalendar()});
  $('#lang-switch').addEventListener('click',()=>setLanguage(state.lang==='en'?'tr':'en'));
  window.addEventListener('resize',markCollabLineStarts);
  requestAnimationFrame(markCollabLineStarts);
  renderCalendar();renderUpcoming();setLanguage(savedLanguage());
  // Each data source is independent: a calendar outage must not hide portfolio content.
  const loadJson=async url=>{const response=await fetch(url,{cache:'no-store'});if(!response.ok)throw new Error(`Unable to load ${url} (HTTP ${response.status})`);return response.json()};
  const [siteResult,showsResult]=await Promise.allSettled([loadJson('data/site.json'),loadJson('data/concerts.json')]);
  if(siteResult.status==='fulfilled'){
    const site=siteResult.value;
    if(site.latestMix)renderMix(site.latestMix);
    renderProjects(site.projects||[],site.artistSpotify||{});
    renderCollabs(site.collaborations||[],site.artistSpotify||{});
    renderVideos(site.videos||[]);
    state.recordings=site.recordings||[];
    renderRecordings();
  }else{console.error('Site content unavailable:',siteResult.reason)}
  if(showsResult.status==='fulfilled'){
    state.events=(showsResult.value.concerts||[]).map(normalizedEvent).filter(Boolean);
    renderCalendar();renderUpcoming();
  }else{
    console.error('Concert schedule unavailable:',showsResult.reason);
    state.scheduleUnavailable=true;
    renderUpcoming();
  }
}
init();

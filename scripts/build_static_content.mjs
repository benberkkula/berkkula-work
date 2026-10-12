// data/site.json remains the only editable source for artist and recording credits.
// Run before publishing; GitHub Pages runs this automatically on every deployment.
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { resolve, dirname } from 'node:path';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const data = JSON.parse(readFileSync(resolve(root, 'data/site.json'), 'utf8'));
const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const artist = name => {
  const url = data.artistSpotify?.[name];
  return typeof url === 'string' && /^https:\/\/open\.spotify\.com\/artist\/[A-Za-z0-9]{22}$/.test(url)
    ? `<a class="artist-spotify" href="${escape(url)}" target="_blank" rel="noopener noreferrer" title="Spotify — ${escape(name)}">${escape(name)}</a>` : escape(name);
};
function replaceBlock(html, name, initial, content) {
  const start = `<!-- static:${name}:start -->`, end = `<!-- static:${name}:end -->`;
  const replacement = `${start}${content}${end}`;
  if (html.includes(start)) {
    const a = html.indexOf(start), b = html.indexOf(end, a);
    if (b < a) throw new Error(`Missing end marker: ${name}`);
    return html.slice(0, a) + replacement + html.slice(b + end.length);
  }
  if (!html.includes(initial)) throw new Error(`Missing initial block: ${name}`);
  return html.replace(initial, replacement);
}
let home = readFileSync(resolve(root, 'index.html'), 'utf8');
const projects = data.projects.map(p => `<div class="credit-row"><strong>${artist(p.artist)}</strong><span>${escape(p.role)} · ${escape(p.years)}</span></div>`).join('');
const collabs = data.collaborations.map(name => `<span>${artist(name)}</span>`).join('');
home = replaceBlock(home, 'projects', '<div class="credit-list" id="core-projects"></div>', `<div class="credit-list" id="core-projects">${projects}</div>`);
home = replaceBlock(home, 'collaborations', '<p class="name-cloud" id="collab-list"></p>', `<p class="name-cloud" id="collab-list">${collabs}</p>`);
writeFileSync(resolve(root, 'index.html'), home);
let archive = readFileSync(resolve(root, 'recordings.html'), 'utf8');
const records = [...data.recordings].sort((a,b) => String(b.date || b.year).localeCompare(String(a.date || a.year)) || String(a.artist || '').localeCompare(String(b.artist || '')));
const rows = records.map(r => {
  const title = `${escape(r.artist)} — ${escape(r.title)}`;
  const link = r.url && /^https:\/\//.test(r.url) ? `<a href="${escape(r.url)}" target="_blank" rel="noopener noreferrer">${title}</a>` : title;
  const tracks = Array.isArray(r.tracks) && r.tracks.length && r.id !== 'mahzuni' ? `<details class="recording-tracks"><summary>View ${r.tracks.length} tracks</summary><ol class="recording-tracklist">${r.tracks.map(t=>`<li>${escape(t)}</li>`).join('')}</ol></details>` : '';
  return `<div class="recording-row"><span class="recording-year">${escape(r.displayDate || r.year)}</span><div class="recording-info"><strong>${link}</strong><span>${escape(r.role)}</span>${tracks}</div><span class="recording-type">${escape(r.type)}</span></div>`;
}).join('');
archive = replaceBlock(archive, 'recordings', '<div id="recordings-all" class="recording-list"></div>', `<div id="recordings-all" class="recording-list">${rows}</div>`);
archive = archive.replace(/(<p class="archive-counter" id="archive-counter" aria-live="polite">)[\s\S]*?(<\/p>)/, `$1Showing ${records.length} credits$2`);
// Generated bootstrap lets filters and language switching survive a failed JSON request.
const bootstrap = `<script id="recordings-data" type="application/json">${JSON.stringify(data.recordings).replace(/</g, '\\u003c')}</script>`;
archive = replaceBlock(archive, 'recordings-data', '</body>', bootstrap + '</body>');
writeFileSync(resolve(root, 'recordings.html'), archive);
console.log(`Generated ${data.projects.length} projects, ${data.collaborations.length} collaborations and ${records.length} recordings.`);

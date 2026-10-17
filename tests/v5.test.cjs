const assert=require('node:assert/strict'),fs=require('node:fs'),{boot}=require('./game.test.cjs');
const g=boot({found:[8,500,998],best:0});
g.nodes['gift-search'].value='no match';g.nodes['theme-filter'].value='1';g.get('albumPage=50');g.nodes['open-album'].onclick();assert(g.nodes['owned-only'].checked);assert.equal(g.nodes['album-grid'].children.length,3);assert.equal(g.nodes['gift-search'].value,'');assert.equal(g.get('albumPage'),0);
assert.equal(g.get('missionDeck.length'),10872);assert.equal(g.get('new Set(missionDeck.map(m=>m.text)).size'),10872);
assert.equal(g.get('footerDeck.length'),1000);assert.equal(g.get('new Set(footerDeck.map(f=>f.head+f.tag)).size'),1000);
assert.equal(g.get('new Set(Array.from({length:1000},()=>JSON.stringify(nextFooter()))).size'),1000);
const seen=new Set([g.get("missionIndex")]);for(let i=0;i<10871;i++){g.get('nextMission()');const n=g.get('missionIndex');assert(!seen.has(n));seen.add(n);}
const html=fs.readFileSync(require('node:path').join(__dirname,'../public/index.html'),'utf8');assert(!html.includes('PNG'));assert(html.indexOf('id="album-grid"')<html.indexOf('id="save-album"'));
console.log('PASS default owned album and stale filter reset; 10,872 distinct prompts; full nonrepeat cycle; 1,000 footer combinations; image labels.');

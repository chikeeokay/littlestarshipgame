const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {createCanvas,GlobalFonts,Image}=require('@napi-rs/canvas'),{boot}=require('./game.test.cjs');
const font=process.env.JOY_TEST_CJK_FONT;if(font)GlobalFonts.registerFromPath(font,'Noto Sans CJK TC');
async function main(){
 const g=boot({found:Array.from({length:999},(_,i)=>i),best:0});
 const original=g.sandbox.document.createElement;g.sandbox.document.createElement=t=>t==='canvas'?createCanvas(1080,1440):original(t);
 g.nodes.start.onclick();g.nodes['open-album'].onclick();g.nodes['save-album'].onclick();await g.get('refreshSheet()');
 assert(g.get('paused'));assert.equal(g.nodes['sheet-page'].textContent,'1 / 84 頁');
 g.get('sheetPage=83');await g.get('refreshSheet()');assert(g.nodes['sheet-next'].disabled);assert.equal(g.nodes['sheet-page'].textContent,'84 / 84 頁');
 assert(g.nodes['sheet-image'].alt.includes(g.get('gifts[998].name')));assert(!g.nodes['sheet-image'].alt.includes(g.get('gifts[0].name')));
 const png=Buffer.from(g.nodes['sheet-image'].src.split(',')[1],'base64');assert.equal(png.readUInt32BE(16),1080);assert.equal(png.readUInt32BE(20),1440);
 g.nodes['sheet-close'].onclick();assert(g.get('paused'));g.nodes['close-album'].onclick();assert(!g.get('paused'));
 let prevented=false;g.nodes.game.onpointerdown({button:2,clientX:0});assert.equal(g.get('x'),.5);
 for(const type of ['contextmenu','selectstart','dragstart']){
  prevented=false;g.events[type]({target:{closest:s=>s==='main,dialog'},preventDefault:()=>prevented=true});assert(prevented);
  prevented=false;g.events[type]({target:{closest:s=>s!=='main,dialog'},preventDefault:()=>prevented=true});assert(!prevented);
 }
 g.get('sheetIds=[]');await g.get('refreshSheet()');assert.equal(g.nodes['sheet-download'].href,undefined);assert(g.nodes['sheet-status'].textContent.includes('空'));
 g.sandbox.Image=class extends Image{set src(uri){super.src=Buffer.from(decodeURIComponent(uri.split(',')[1]));}};g.get(fs.readFileSync(path.join(__dirname,'../public/gift-art.js'),'utf8'));
 g.get('sheetIds=Array.from({length:12},(_,i)=>i);sheetPage=0');await g.get('refreshSheet()');
 fs.writeFileSync(path.join(__dirname,'../examples/album-sheet.png'),Buffer.from(g.nodes['sheet-image'].src.split(',')[1],'base64'));
 console.log('PASS 999-item pagination, last-page ownership, PNG dimensions, empty guard, nested pause, secondary click and gesture exemptions');
}
main().catch(e=>{console.error(e);process.exitCode=1;});

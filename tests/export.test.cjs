const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),{createCanvas,Image}=require('@napi-rs/canvas');
const {boot}=require('./game.test.cjs');
async function main(){
 const g=boot({found:[0,1,5],best:0});
 const oldCreate=g.sandbox.document.createElement;
 g.sandbox.document.createElement=tag=>tag==='canvas'?createCanvas(1080,1350):oldCreate(tag);
 // Browser Image stand-in uses the exact embedded SVG URI produced by the shipped loader.
 g.sandbox.Image=class extends Image{set src(uri){assert(uri.startsWith('data:image/svg+xml;charset=utf-8,'));super.src=Buffer.from(decodeURIComponent(uri.split(',')[1]));}};
 g.sandbox.navigator={canShare:()=>false};g.sandbox.File=File;
 g.get(fs.readFileSync(path.join(__dirname,'../public/gift-art.js'),'utf8'));
 g.get('showGift(1)');await g.get("postcardScene='day';refreshPostcard()");
 const uri=g.nodes['postcard-image'].src;assert(uri.startsWith('data:image/png;base64,'));const buf=Buffer.from(uri.split(',')[1],'base64');assert.equal(buf.readUInt32BE(16),2160);assert.equal(buf.readUInt32BE(20),2700);assert.equal(g.nodes['download-card'].download,'little-joy-gift-0002-day.png');assert.equal(g.nodes['download-card'].href,uri);assert(g.nodes['postcard-image'].alt.includes('唔返工鴨'));assert(g.nodes['postcard-image'].alt.includes('聽日先算'));
 // Font-loading delay must not allow an older request to replace a new selection.
 let finishFonts;g.sandbox.document.fonts={ready:new Promise(resolve=>finishFonts=resolve)};
 const old=g.get("postcardScene='dusk';refreshPostcard()");const latest=g.get("postcardScene='night';refreshPostcard()");finishFonts();await Promise.all([old,latest]);assert.equal(g.nodes['download-card'].download,'little-joy-gift-0002-night.png');
 g.get('selectedGift=25');await g.get('refreshPostcard()');assert.equal(g.nodes['download-card']['aria-disabled'],'true');assert.equal(g.nodes['download-card'].href,undefined);
 console.log('PASS actual PNG export through UI handler, embedded SVG load, file name, image size, complete alt/story, stale async request guard, unowned download guard.');
}
main().catch(e=>{console.error(e);process.exitCode=1;});

// Run using Node with @napi-rs/canvas available. No remote website is used.
const fs=require('node:fs'),vm=require('node:vm'),path=require('node:path'),assert=require('node:assert/strict');
const {createCanvas,GlobalFonts,loadImage}=require('@napi-rs/canvas');
const root=path.resolve(__dirname,'..');
const font=process.env.JOY_TEST_CJK_FONT;
if(font)assert(GlobalFonts.registerFromPath(font,'Noto Sans CJK TC'));
const emoji=process.env.JOY_TEST_EMOJI_FONT;
if(emoji)assert(GlobalFonts.registerFromPath(emoji,'Noto Color Emoji'));
const c=createCanvas(1080,1350),context=vm.createContext({console});
for(const f of ['gifts.js','scenes.js','gift-art.js','postcards.js'])vm.runInContext(fs.readFileSync(path.join(root,'public',f),'utf8'),context);
context.c=c.getContext('2d');
async function main(){
const art={};const svgs=vm.runInContext("GIFT_ART",context);for(const [icon,svg] of Object.entries(svgs))art[icon]=await loadImage(Buffer.from(svg));
let maxBottom=0;
for(let i=0;i<999;i++){
 context.giftIndex=i;context.art=art[vm.runInContext('gifts[giftIndex].icon',context)];
 const stats=vm.runInContext("renderGiftPostcard(c,gifts[giftIndex],'night',art)",context);
 assert(stats.storyBottom<1195,`Story clipped for gift ${i}`);maxBottom=Math.max(maxBottom,stats.storyBottom);
}
console.log(`PASS actual Canvas rendering of all 999 story cards; lowest story baseline ${maxBottom}px, footer starts at 1230px.`);
const out=process.env.JOY_TEST_OUTPUT;
if(out){fs.mkdirSync(out,{recursive:true});
 for(const [mode,i] of [['day',1],['dusk',777],['night',0]]){
  context.mode=mode;context.giftIndex=i;context.art=art[vm.runInContext('gifts[giftIndex].icon',context)];vm.runInContext('renderGiftPostcard(c,gifts[giftIndex],mode,art)',context);const png=c.toBuffer('image/png');assert.equal(png.readUInt32BE(16),1080);assert.equal(png.readUInt32BE(20),1350);fs.writeFileSync(path.join(out,`story-card-${mode}.png`),png);
 }
 console.log('PASS three 1080×1350 PNG files generated locally.');
}

}
main().catch(e=>{console.error(e);process.exitCode=1;});

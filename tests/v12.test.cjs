const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const {boot}=require('./game.test.cjs');
const c=vm.createContext({});for(const file of ['gifts.js','gift-art.js'])vm.runInContext(fs.readFileSync(__dirname+'/../public/'+file,'utf8'),c);
assert.equal(vm.runInContext('gifts.filter(g=>!GIFT_ART[g.icon]).length',c),0,'all gifts have embedded art');
const g=boot();g.get(fs.readFileSync(__dirname+'/../public/gift-art.js','utf8'));
assert(g.get("card(0).children[0].children[0].src.startsWith('data:image/svg+xml')"));
assert.equal(g.get("card(0,true).children[0].textContent"),'?');
const {loadImage}=require('@napi-rs/canvas');
(async()=>{for(const svg of Object.values(vm.runInContext('GIFT_ART',c)))await loadImage(Buffer.from(svg));console.log('PASS embedded art covers all 999 gifts; card uses SVG, locked card stays hidden; every SVG decoded successfully.');})();

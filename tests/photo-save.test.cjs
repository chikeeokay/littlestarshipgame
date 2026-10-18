const fs=require('node:fs'),assert=require('node:assert/strict'),{boot}=require('./game.test.cjs');
const g=boot({found:[0],best:0});g.get(fs.readFileSync(__dirname+'/../public/photo-save.js','utf8'));
g.get("postcardURL='data:image/png;base64,card';");g.nodes['save-photo'].onclick();assert(g.nodes['photo-save-dialog'].open);assert.equal(g.nodes['photo-save-image'].src,'data:image/png;base64,card');
g.nodes['photo-save-close'].onclick();assert(!g.nodes['photo-save-dialog'].open);assert.equal(g.nodes['photo-save-image'].src,undefined);
g.get("sheetURL='data:image/png;base64,sheet'");g.nodes['sheet-save-photo'].onclick();assert.equal(g.nodes['photo-save-image'].src,'data:image/png;base64,sheet');
g.nodes['photo-save-close'].onclick();g.get("postcardURL=''");g.nodes['save-photo'].onclick();assert(!g.nodes['photo-save-dialog'].open);
let blocked=false;g.get('guardGameGesture')({target:{closest:sel=>sel.includes('.saveable-image')},preventDefault(){blocked=true}});assert(!blocked);
console.log('PASS card/album photo-save entry, empty-image guard, close cleanup and native long-press exemption.');

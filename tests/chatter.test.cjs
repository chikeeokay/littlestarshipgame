const assert=require('node:assert/strict'),{boot}=require('./game.test.cjs');
const g=boot();g.nodes.start.onclick();
g.get('score=1;catchChatter()');assert(g.nodes.toast.textContent.includes('唔值錢'));
g.get('score=2;time=3;catchChatter()');assert(g.nodes.toast.textContent.includes('唔值錢'));
g.get("notify('禮物優先');score=3;time=20;catchChatter()");assert.equal(g.nodes.toast.textContent,'禮物優先');
g.get('toastUntil=-1;time=40;Math.random=()=>0;catchChatter()');assert(g.get('catchLines.includes($("toast").textContent)'));
const seen=g.get('new Set(Array.from({length:24},nextCatchLine)).size');assert.equal(seen,24);
console.log('PASS first-star message, chatter cooldown, active-gift priority, random non-gift chatter and nonrepeat bag.');

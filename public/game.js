
const $=id=>document.getElementById(id),canvas=$('game'),ctx=canvas.getContext('2d');let W=800,H=490,x=.5,items=[],sparkles=[],running=false,paused=false,score=0,time=60,spawn=0,last=0,drag=false,sound=false,audio=null,toastUntil=0;const STORAGE_KEY='littleJoyV1';
let saved={found:[],best:0,scene:'night'};
try {
 const z=JSON.parse(localStorage.getItem(STORAGE_KEY));
 if(z && Array.isArray(z.found)) saved={found:[...new Set(z.found.filter(n=>Number.isInteger(n)&&n>=0&&n<gifts.length))],best:Math.max(0,Number(z.best)||0),scene:Object.hasOwn(SCENES,z.scene)?z.scene:'night'};
} catch(e) {}
let storageOK=true;
function save(){try{localStorage.setItem(STORAGE_KEY,JSON.stringify(saved));storageOK=true;}catch(e){storageOK=false;}$('storage').textContent=storageOK?'收藏會留喺呢個瀏覽器。':'儲存不可用：今次可玩，但關閉後進度可能消失。';}
let albumPage=0, albumReturn=false,selectedGift=null,currentScene=saved.scene;
const PAGE_SIZE=18;
function showGift(i){if(!saved.found.includes(i))return;selectedGift=i;const g=gifts[i];$('note').textContent=g.name+'：'+g.story;$('take-gift').disabled=false;$('album-take-gift').disabled=false;}
function card(i,locked=false){
 const g=gifts[i],b=document.createElement('button');b.className='gift-card'+(locked?' locked':'');b.style.setProperty('--gift-color',g.color);
 b.setAttribute('aria-label',(locked?'未發現：':'')+g.name);b.title=g.name;
 const icon=document.createElement('span');icon.className='gift-icon';icon.textContent=locked?'?':g.icon;
 const badge=document.createElement('small');badge.textContent=g.badge+' '+giftThemes[g.theme].name;
 const label=document.createElement('span');label.className='gift-name';label.textContent=g.name;
 b.append(icon,badge,label);b.onclick=()=>{if(locked)$('album-note').textContent='呢件仲未發現。接星星或者禮物盒，就有機會遇見佢。';else{showGift(i);$('album-note').textContent=g.name+'：'+g.story;openPostcard();}};return b;
}
function collection(){
 $('collection').replaceChildren();const recent=saved.found.slice(-6).reverse();
 if(!recent.length){const msg=document.createElement('p');msg.className='empty-pocket';msg.textContent='口袋仲有好多空位。\n第一件驚喜會係乜？';$('collection').append(msg);}
 recent.forEach(i=>$('collection').append(card(i)));
 $('count').textContent=saved.found.length+'/'+gifts.length;
 $('progress').value=saved.found.length;
 if($('album').open)renderAlbum();
}
function renderAlbum(){
 const q=$('gift-search').value.trim().toLowerCase(),theme=$('theme-filter').value,owned=$('owned-only').checked,found=new Set(saved.found);
 const list=gifts.filter(g=>(!owned||found.has(g.id))&&(theme===''||g.theme===Number(theme))&&(!q||g.name.toLowerCase().includes(q)||g.story.toLowerCase().includes(q)));
 const pages=Math.max(1,Math.ceil(list.length/PAGE_SIZE));albumPage=Math.max(0,Math.min(albumPage,pages-1));$('album-grid').replaceChildren();
 list.slice(albumPage*PAGE_SIZE,(albumPage+1)*PAGE_SIZE).forEach(g=>$('album-grid').append(card(g.id,!found.has(g.id))));
 $('album-page').textContent=(albumPage+1)+' / '+pages+' · '+list.length+' 件';$('album-prev').disabled=albumPage===0;$('album-next').disabled=albumPage>=pages-1;
 $('album-empty').hidden=!!list.length;
}
giftThemes.forEach((t,i)=>{const o=document.createElement('option');o.value=i;o.textContent=t.badge+' '+t.name;$('theme-filter').append(o);});
$('open-album').onclick=()=>{albumReturn=running&&!paused;if(albumReturn)pause();resetInput();renderAlbum();$('album').showModal();};
$('close-album').onclick=()=>$('album').close();
$('album').addEventListener('close',()=>{if(albumReturn&&running&&paused)pause();albumReturn=false;});
['gift-search','theme-filter','owned-only'].forEach(id=>$(id).addEventListener('input',()=>{albumPage=0;renderAlbum();}));
$('album-prev').onclick=()=>{albumPage--;renderAlbum();};$('album-next').onclick=()=>{albumPage++;renderAlbum();};
collection();
function resize(){let r=canvas.getBoundingClientRect();W=r.width;H=r.height;canvas.width=W*devicePixelRatio;canvas.height=H*devicePixelRatio;ctx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0)}window.addEventListener('resize',resize);resize();function ping(){if(!sound)return;try{audio=audio||new (window.AudioContext||window.webkitAudioContext)();audio.resume();let o=audio.createOscillator(),g=audio.createGain();o.connect(g);g.connect(audio.destination);o.frequency.value=520+(score%5)*85;g.gain.setValueAtTime(.06,audio.currentTime);g.gain.exponentialRampToValueAtTime(.001,audio.currentTime+.25);o.start();o.stop(audio.currentTime+.25)}catch(e){}}$('sound').onclick=()=>{sound=!sound;$('sound').textContent='♫ 音效：'+(sound?'開':'關');if(sound)ping()};function notify(t){$('toast').textContent=t;toastUntil=performance.now()+2600}function reward(){
 const found=new Set(saved.found),remaining=gifts.filter(g=>!found.has(g.id));
 const pool=remaining.length?remaining:gifts,g=pool[Math.floor(Math.random()*pool.length)];
 if(!found.has(g.id))saved.found.push(g.id);
 save();collection();showGift(g.id);notify(g.icon+' '+(remaining.length?'新發現：':'再遇見：')+g.name);
}
function begin(){resetInput();spawnCount=0;score=0;time=60;spawn=.3;items=[];sparkles=[];x=.5;running=true;paused=false;$('score').textContent=0;$('timer').textContent='60s';$('overlay').classList.add('hidden');$('pause').hidden=false;$('pause').textContent='暫停 Ⅱ';$('toast').textContent='';last=performance.now()}function pause(){if(!running)return;resetInput();paused=!paused;$('pause').textContent=paused?'繼續 ▷':'暫停 Ⅱ';$('overlay').classList.toggle('hidden',!paused);if(paused){$('symbol').textContent='☁';$('title').textContent='停一停，都幾好。';$('desc').textContent='小船會喺度等你。準備好先再出發。';$('start').textContent='繼續漂流 →';$('best').textContent='時間已暫停'}else{last=performance.now()}}$('pause').onclick=pause;$('start').onclick=()=>{if(running&&paused)pause();else begin()};document.addEventListener('visibilitychange',()=>{if(document.hidden&&running&&!paused)pause()});function end(){resetInput();running=false;saved.best=Math.max(saved.best,score);save();$('pause').hidden=true;$('overlay').classList.remove('hidden');$('symbol').textContent='✦';$('title').textContent='帶返 '+score+' 粒小快樂。';$('desc').textContent=score?'呢一分鐘冇解決人生，但船冇沉，算交代到。':'發咗一分鐘呆。海冇投訴，隻貓都冇意見。';$('start').textContent='再漂流一陣 ↗';$('best').textContent='口袋收藏 '+saved.found.length+'/'+gifts.length+' · 最多接過 '+saved.best+' 粒';$('toast').textContent=''}// Track pressed keys independently. The latest direction wins; releasing it
// restores the other held direction. Movement never waits for OS key repeat.
const heldKeys=new Map(),pointerKeys=new Map();let inputOrder=0,spawnCount=0;
const LEFT=new Set(['ArrowLeft','KeyA']),RIGHT=new Set(['ArrowRight','KeyD']);
function inputDirection(){let latest=-1,dir=0;for(const v of [...heldKeys.values(),...pointerKeys.values()])if(v.order>latest){latest=v.order;dir=v.dir;}return dir;}
function resetInput(){heldKeys.clear();pointerKeys.clear();drag=false;}
function editing(e){return e.target && (['INPUT','SELECT','TEXTAREA'].includes(e.target.tagName)||e.target.isContentEditable);}
function nudge(dir){x=Math.max(.06,Math.min(.94,x+dir*8/W));paint(performance.now());}
document.addEventListener('keydown',e=>{
 if($('album').open||$('postcard').open||$('sheet').open||editing(e))return;
 const code=e.code||e.key;
 if(LEFT.has(code)||RIGHT.has(code)){
  if(!running||paused)return;e.preventDefault();
  if(!heldKeys.has(code)){const dir=LEFT.has(code)?-1:1;heldKeys.set(code,{dir,order:++inputOrder});nudge(dir);}
 }
 if(e.key==='Escape'&&!e.repeat&&running)pause();
});
document.addEventListener('keyup',e=>{heldKeys.delete(e.code||e.key);});
window.addEventListener('blur',()=>{resetInput();if(running&&!paused)pause();});
function move(e){if(!running||paused)return;x=Math.max(.06,Math.min(.94,(e.clientX-canvas.getBoundingClientRect().left)/W));paint(performance.now());}
canvas.onpointerdown=e=>{if(!running||paused||e.button>0)return;e.preventDefault?.();resetInput();drag=true;canvas.setPointerCapture(e.pointerId);move(e);};
canvas.onpointermove=e=>{if(drag)move(e);};canvas.onpointerup=canvas.onpointercancel=canvas.onlostpointercapture=()=>drag=false;
[['left',-1],['right',1]].forEach(([id,dir])=>{
 $(id).onpointerdown=e=>{if(!running||paused||e.button>0)return;e.preventDefault();pointerKeys.set(e.pointerId,{dir,order:++inputOrder});$(id).setPointerCapture(e.pointerId);nudge(dir);};
 $(id).onpointerup=$(id).onpointercancel=$(id).onlostpointercapture=e=>pointerKeys.delete(e.pointerId);
});
function star(px,py,r,col){ctx.fillStyle=col;ctx.beginPath();for(let i=0;i<10;i++){let a=i*Math.PI/5-Math.PI/2,rr=i%2?r*.45:r;ctx.lineTo(px+Math.cos(a)*rr,py+Math.sin(a)*rr)}ctx.closePath();ctx.fill()}function draw(t){let dt=Math.min((t-last)/1000||0,.04);last=t;const active=running&&!paused;if(active){time=Math.max(0,time-dt);$('timer').textContent=Math.ceil(time)+'s';x=Math.max(.06,Math.min(.94,x+inputDirection()*dt*1.35));spawn-=dt;if(spawn<=0){spawnCount++;items.push({x:.08+Math.random()*.84,y:65,v:65+Math.random()*35,gift:spawnCount%7===0});spawn=.65+Math.random()*.3}items.forEach(a=>{a.y+=a.v*dt;if(a.y>=H-90&&a.y<H-60&&Math.abs(a.x*W-x*W)<38){a.hit=true;score++;$('score').textContent=score;ping();for(let k=0;k<9;k++)sparkles.push({x:a.x*W,y:a.y,vx:(Math.random()-.5)*95,vy:-Math.random()*80,life:1});if(a.gift)reward();if(score%5===0)reward();else if(score===1&&!a.gift)notify('接到喇。唔值錢，但手感幾好。')}});items=items.filter(a=>!a.hit&&a.y<H-42);sparkles.forEach(a=>{a.x+=a.vx*dt;a.y+=a.vy*dt;a.life-=dt});sparkles=sparkles.filter(a=>a.life>0);if(time<=0)end()}paint(t);requestAnimationFrame(draw);}
function paint(t){const active=running&&!paused;if(t>toastUntil)$('toast').textContent='';drawScenery(ctx,W,H,currentScene,t,active);items.forEach(a=>{ctx.shadowBlur=14;ctx.shadowColor='#ffd17a';if(a.gift){ctx.font='25px system-ui';ctx.textAlign='center';ctx.fillText('🎁',a.x*W,a.y+8);}else star(a.x*W,a.y,10,SCENES[currentScene].star);ctx.shadowBlur=0});sparkles.forEach(a=>{ctx.globalAlpha=a.life;star(a.x,a.y,3,'#ffe3a2')});ctx.globalAlpha=1;let bx=x*W,by=H-78;ctx.save();ctx.translate(bx,by);ctx.fillStyle='#edba84';ctx.beginPath();ctx.moveTo(-34,0);ctx.lineTo(34,0);ctx.lineTo(17,18);ctx.lineTo(-17,18);ctx.closePath();ctx.fill();ctx.fillStyle='#ffe6ba';ctx.beginPath();ctx.moveTo(-30,0);ctx.lineTo(5,-17);ctx.lineTo(30,0);ctx.fill();ctx.fillStyle='#e9e4d3';ctx.beginPath();ctx.ellipse(-7,-13,11,12,0,0,7);ctx.fill();ctx.beginPath();ctx.moveTo(-17,-18);ctx.lineTo(-16,-30);ctx.lineTo(-7,-23);ctx.lineTo(1,-30);ctx.lineTo(3,-17);ctx.fill();ctx.fillStyle='#283742';ctx.fillRect(-12,-18,2,3);ctx.fillRect(-4,-18,2,3);ctx.restore();}
function setScene(mode,persist=true){
 if(!Object.hasOwn(SCENES,mode))return;currentScene=mode;saved.scene=mode;
 document.body.dataset.scene=mode;
 for(const k of Object.keys(SCENES))$('scene-'+k).setAttribute('aria-pressed',String(k===mode));
 $('scene-caption').textContent=SCENES[mode].caption;
 if(!running)$('title').textContent=SCENES[mode].title;
 if(persist)save();paint(performance.now());
}
for(const k of Object.keys(SCENES))$('scene-'+k).onclick=()=>setScene(k);
initMissions();initPostcards();initAlbumExport();
if(saved.found.length)showGift(saved.found[saved.found.length-1]);
setScene(currentScene,false);
requestAnimationFrame(draw);

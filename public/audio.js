// Local synthesized ambience: no network or media downloads required.
(()=>{
 const nature=['rain','sea','wind','stream','waterfall','birds','crickets','frogs'];
 const ids=['effects',...nature];let prefs={effects:true,rain:false,sea:false,wind:false,stream:false,waterfall:false,birds:false,crickets:false,frogs:false,music:"off",musicVolume:75,volume:55,muted:false,defaultsVersion:11};
 try{const p=JSON.parse(localStorage.getItem('littleJoyAudioV1'));if(p&&typeof p==='object'){for(const k of [...ids,'muted'])if(typeof p[k]==='boolean')prefs[k]=p[k];if(['off','lofi','piano','jazz','bowl','ambient','musicbox'].includes(p.music))prefs.music=p.music;if(Number.isFinite(p.musicVolume))prefs.musicVolume=Math.max(0,Math.min(100,p.musicVolume));if(Number.isFinite(p.volume))prefs.volume=Math.max(0,Math.min(100,p.volume));if(p.defaultsVersion!==11){if(p.musicVolume===45)prefs.musicVolume=75;if(p.volume===35)prefs.volume=55;}}}catch(_){}
 let ac=null,master=null,unlocked=false;const layers={};let musicBus=null,timer=null,nextBeat=0,beat=0;const nextCall={};const musicNodes=new Set();
 const status=t=>$('audio-status').textContent=t;
 function persist(){try{localStorage.setItem('littleJoyAudioV1',JSON.stringify(prefs));}catch(_){}}
 function sync(){for(const k of ids)$('audio-'+k).checked=prefs[k];$('audio-volume').value=prefs.volume;$('audio-music').value=prefs.music;$('audio-music-volume').value=prefs.musicVolume;$('sound').textContent=prefs.muted?'♫ 全部聲音：靜音':'♫ 全部聲音：開';$('sound').setAttribute('aria-pressed',String(!prefs.muted));sound=prefs.effects&&!prefs.muted&&prefs.music!=='bowl';}
 function layer(kind){
  if(layers[kind])return layers[kind];
  if(['birds','crickets','frogs'].includes(kind)){const gain=ac.createGain();gain.gain.value=0;gain.connect(master);return layers[kind]={gain};}
  const source=ac.createBufferSource(),filter=ac.createBiquadFilter(),gain=ac.createGain();const buffer=ac.createBuffer(1,ac.sampleRate*8,ac.sampleRate),data=buffer.getChannelData(0);let smooth=0;
  for(let i=0;i<data.length;i++){const white=Math.random()*2-1;smooth=(smooth+.025*white)/1.025;data[i]=['rain','waterfall'].includes(kind)?white:kind==='stream'?white*.18+smooth*3:smooth*5;}
  source.buffer=buffer;source.loop=true;filter.type=kind==='rain'?'lowpass':'lowpass';filter.frequency.value=kind==='rain'?3800:kind==='sea'?1100:kind==='stream'?2300:kind==='waterfall'?1800:550;gain.gain.value=0;source.connect(filter);filter.connect(gain);gain.connect(master);source.start();
  // Slow changes give the ocean and breeze a natural rise and fall.
  const lfo=ac.createOscillator(),depth=ac.createGain();lfo.frequency.value=kind==='sea'?.12:kind==='wind'?.075:.43;depth.gain.value=kind==='sea'?450:kind==='wind'?180:220;lfo.connect(depth);depth.connect(filter.frequency);lfo.start();
  return layers[kind]={gain,source,lfo};
 }
 function apply(){if(!ac)return;master.gain.setTargetAtTime(prefs.muted||document.hidden?0:prefs.volume/100,ac.currentTime,.08);if(musicBus)musicBus.gain.setTargetAtTime(prefs.music==='off'?0:prefs.musicVolume/100,ac.currentTime,.15);for(const k of nature){if(prefs[k]||layers[k])layer(k).gain.gain.setTargetAtTime(prefs[k]&&prefs.music!=='bowl'?({rain:.13,sea:.32,wind:.24,stream:.24,waterfall:.12,birds:.22,crickets:.12,frogs:.22}[k]):0,ac.currentTime,.18);}}

 function tone(bus,freq,t,duration,level,type='sine',endFreq,attack=.015){
  const o=ac.createOscillator(),g=ac.createGain();o.type=type;o.frequency.setValueAtTime(freq,t);
  if(endFreq)o.frequency.exponentialRampToValueAtTime(endFreq,t+duration);
  g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(level,t+attack);g.gain.exponentialRampToValueAtTime(.0001,t+duration);
  o.connect(g);g.connect(bus);if(bus===musicBus)musicNodes.add({o,g});o.start(t);o.stop(t+duration+.02);o.onended=()=>{for(const n of musicNodes)if(n.o===o)musicNodes.delete(n);o.disconnect();g.disconnect();};
 }
 function schedule(){
  if(!ac||ac.state!=='running'||document.hidden||prefs.muted)return;
  const now=ac.currentTime;
  for(const k of ['birds','crickets','frogs'])if(prefs.music!=='bowl'&&prefs[k]&&now>=(nextCall[k]||0)){
   const bus=layer(k).gain;
   if(k==='birds'){const f=1600+Math.random()*1200;for(let j=0;j<3;j++)tone(bus,f,now+j*.16,.13,.22,'sine',f*1.45);nextCall[k]=now+2+Math.random()*5;}
   if(k==='crickets'){for(let j=0;j<4;j++)tone(bus,3900,now+j*.09,.045,.15);nextCall[k]=now+.9+Math.random()*.8;}
   if(k==='frogs'){const f=170+Math.random()*75;for(let j=0;j<2;j++)tone(bus,f,now+j*.24,.18,.22,'triangle',f*.65);nextCall[k]=now+3+Math.random()*5;}
  }
  if(prefs.music==='off'){nextBeat=now;return;}
  if(nextBeat<now)nextBeat=now;
  const hz=n=>440*Math.pow(2,(n-69)/12);
  while(nextBeat<now+.15){
   const t=nextBeat,mode=prefs.music;
   let step=.5;
   if(mode==='bowl'){
    // Overlapping inharmonic resonances, no other ambience or catch sounds.
    const base=[174,196,164.81,174][beat%4];
    [1,2.71,5.43,8.93].forEach((ratio,i)=>tone(musicBus,base*ratio,t,12-i*1.5,.2/((i+1)*(i+1))));
    step=8;
   }else if(mode==='jazz'){
    // ii-V-I-vi voicings, swung eighths, walking bass and sparse comping.
    const chords=[[50,53,57,60,64],[43,53,59,62,69],[48,52,55,59,62],[45,52,55,60,64]];
    const c=chords[Math.floor(beat/8)%4];
    if([0,3,6].includes(beat%8))c.slice(1,4).forEach((n,i)=>{tone(musicBus,hz(n),t+i*.008,.7,.045);tone(musicBus,hz(n)*2,t+i*.008,.3,.008);});
    if(beat%2===0)tone(musicBus,hz(c[[0,2,3,1][Math.floor(beat%8/2)]]-12),t,.44,.13,'triangle');
    if(beat%8!==7){const n=c[[4,2,3,1,4,3,2,1][beat%8]]+12;tone(musicBus,hz(n),t,.32,.045,'triangle');}
    if(beat%4===2)tone(musicBus,4200,t,.035,.012,'triangle');
    step=beat%2===0?.36:.18;
   }else if(mode==='ambient'){
    const c=[[48,55,62],[45,52,59],[53,60,67],[43,50,57]][beat%4];
    c.forEach((n,i)=>tone(musicBus,hz(n),t+i*.6,8,.065,'sine',hz(n)*1.002,1.5));step=6;
   }else if(mode==='musicbox'){
    const melody=[72,76,79,83,79,76,74,71,69,72,76,79,76,72,67,71];const f=hz(melody[beat%melody.length]);
    tone(musicBus,f,t,1.8,.09);tone(musicBus,f*2.01,t,1,.025);tone(musicBus,f*3,t,.4,.008);step=.62;
   }else{
    const c=[[48,52,55,59],[45,48,52,55],[53,57,60,64],[43,47,50,55]][Math.floor(beat/8)%4];
    if(beat%8===0)c.forEach((n,i)=>{tone(musicBus,hz(n),t+i*.035,2.8,.055);tone(musicBus,hz(n)*2,t+i*.035,1.5,.012);});
    if(beat%2===0){const n=c[Math.floor(Math.random()*4)]+12;tone(musicBus,hz(n),t,1.7,.075);tone(musicBus,hz(n)*2,t,1,.015);}
    if(mode==='lofi'){if(beat%4===0)tone(musicBus,110,t,.16,.12,'sine',42);if(beat%4===2)tone(musicBus,170,t,.09,.035,'triangle',110);tone(musicBus,6000,t,.025,.009,'triangle');}
    step=mode==='lofi'?.4167:.5;
   }
   beat++;nextBeat+=step;
  }
 }
 function clearMusic(){if(!ac)return;for(const n of musicNodes){n.g.gain.setTargetAtTime(.0001,ac.currentTime,.025);try{n.o.stop(ac.currentTime+.12);}catch(_){}}musicNodes.clear();}
 $('audio-music').onchange=()=>{clearMusic();prefs.music=$('audio-music').value;beat=0;nextBeat=0;persist();sync();unlock();};
 $('audio-music-volume').oninput=()=>{prefs.musicVolume=Number($('audio-music-volume').value);persist();apply();};
 async function unlock(){try{if(!ac){const C=window.AudioContext||window.webkitAudioContext;if(!C){status('呢個瀏覽器暫時播唔到聲。遊戲照玩。');return;}ac=new C();master=ac.createGain();master.gain.value=0;const limiter=ac.createDynamicsCompressor();limiter.threshold.value=-12;limiter.ratio.value=8;master.connect(limiter);limiter.connect(ac.destination);musicBus=ac.createGain();musicBus.gain.value=0;musicBus.connect(master);timer=setInterval(schedule,100);}if(ac.state!=='running')await ac.resume();unlocked=ac.state==='running';apply();status(unlocked?(prefs.music==='bowl'?'純頌缽連續播放中；自然聲同接星音效暫停，轉曲會恢復。':'合成聲景可混搭。耳仔放假，個人未必。'):'再撳一下開聲。');}catch(_){status('聲音未開到，再撳一下試吓。');}}
 ping=function(){if(!prefs.effects||prefs.muted||prefs.music==='bowl'||!ac||ac.state!=='running')return;const o=ac.createOscillator(),g=ac.createGain();o.type='sine';o.frequency.value=520+(score%5)*85;o.connect(g);g.connect(master);g.gain.setValueAtTime(.0001,ac.currentTime);g.gain.exponentialRampToValueAtTime(.16,ac.currentTime+.01);g.gain.exponentialRampToValueAtTime(.0001,ac.currentTime+.23);o.start();o.stop(ac.currentTime+.25);o.onended=()=>{o.disconnect();g.disconnect();};};
 for(const k of ids)$('audio-'+k).onchange=()=>{prefs[k]=$('audio-'+k).checked;persist();sync();unlock();};
 let lastBowl=-100;
 $('audio-bowl').onclick=async()=>{await unlock();if(!ac||ac.state!=='running')return;if(prefs.muted){status('先取消靜音，頌缽先有聲。');return;}if(ac.currentTime-lastBowl<1)return;lastBowl=ac.currentTime;
 // Inharmonic partials, a gentle strike and a long decaying resonance.
 [1,2.71,5.43,8.93].forEach((ratio,i)=>{const o=ac.createOscillator(),g=ac.createGain();o.type='sine';o.frequency.value=174*ratio;o.connect(g);g.connect(master);const t=ac.currentTime;g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(.23/(i+1),t+.025);g.gain.exponentialRampToValueAtTime(.0001,t+7-i);o.start(t);o.stop(t+7.1-i);o.onended=()=>{o.disconnect();g.disconnect();};});status('叮——呢七秒唔使覆任何人。');};
 $('audio-volume').oninput=()=>{prefs.volume=Number($('audio-volume').value);persist();apply();};
 $('sound').onclick=()=>{prefs.muted=!prefs.muted;persist();sync();unlock();};
 document.addEventListener('pointerdown',()=>{if(!unlocked)unlock();},{passive:true});
 document.addEventListener('keydown',()=>{if(!unlocked)unlock();});
 document.addEventListener('visibilitychange',()=>{if(ac){if(document.hidden){master.gain.setTargetAtTime(0,ac.currentTime,.05);}else{unlocked=false;status('撳一下繼續聽。');}}});
 sync();
})();

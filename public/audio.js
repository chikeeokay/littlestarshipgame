// Local synthesized ambience: no network or media downloads required.
(()=>{
 const ids=['effects','rain','sea','wind'];let prefs={effects:true,rain:false,sea:false,wind:false,volume:35,muted:false};
 try{const p=JSON.parse(localStorage.getItem('littleJoyAudioV1'));if(p&&typeof p==='object'){for(const k of [...ids,'muted'])if(typeof p[k]==='boolean')prefs[k]=p[k];if(Number.isFinite(p.volume))prefs.volume=Math.max(0,Math.min(100,p.volume));}}catch(_){}
 let ac=null,master=null,unlocked=false;const layers={};
 const status=t=>$('audio-status').textContent=t;
 function persist(){try{localStorage.setItem('littleJoyAudioV1',JSON.stringify(prefs));}catch(_){}}
 function sync(){for(const k of ids)$('audio-'+k).checked=prefs[k];$('audio-volume').value=prefs.volume;$('sound').textContent=prefs.muted?'♫ 全部聲音：靜音':'♫ 全部聲音：開';$('sound').setAttribute('aria-pressed',String(!prefs.muted));sound=prefs.effects&&!prefs.muted;}
 function layer(kind){
  if(layers[kind])return layers[kind];
  const source=ac.createBufferSource(),filter=ac.createBiquadFilter(),gain=ac.createGain();const buffer=ac.createBuffer(1,ac.sampleRate*8,ac.sampleRate),data=buffer.getChannelData(0);let smooth=0;
  for(let i=0;i<data.length;i++){const white=Math.random()*2-1;smooth=(smooth+.025*white)/1.025;data[i]=kind==='rain'?white:smooth*5;}
  source.buffer=buffer;source.loop=true;filter.type=kind==='rain'?'lowpass':'lowpass';filter.frequency.value=kind==='rain'?3800:kind==='sea'?1100:550;gain.gain.value=0;source.connect(filter);filter.connect(gain);gain.connect(master);source.start();
  // Slow changes give the ocean and breeze a natural rise and fall.
  const lfo=ac.createOscillator(),depth=ac.createGain();lfo.frequency.value=kind==='sea'?.12:kind==='wind'?.075:.43;depth.gain.value=kind==='sea'?450:kind==='wind'?180:220;lfo.connect(depth);depth.connect(filter.frequency);lfo.start();
  return layers[kind]={gain,source,lfo};
 }
 function apply(){if(!ac)return;master.gain.setTargetAtTime(prefs.muted||document.hidden?0:prefs.volume/100,ac.currentTime,.08);for(const k of ['rain','sea','wind']){if(prefs[k]||layers[k])layer(k).gain.gain.setTargetAtTime(prefs[k]?({rain:.13,sea:.32,wind:.24}[k]):0,ac.currentTime,.18);}}
 async function unlock(){try{if(!ac){const C=window.AudioContext||window.webkitAudioContext;if(!C){status('呢個瀏覽器暫時播唔到聲。遊戲照玩。');return;}ac=new C();master=ac.createGain();master.gain.value=0;master.connect(ac.destination);}if(ac.state!=='running')await ac.resume();unlocked=ac.state==='running';apply();status(unlocked?'聲音可混搭。落雨兼有海，唔使請假。':'再撳一下開聲。');}catch(_){status('聲音未開到，再撳一下試吓。');}}
 ping=function(){if(!prefs.effects||prefs.muted||!ac||ac.state!=='running')return;const o=ac.createOscillator(),g=ac.createGain();o.type='sine';o.frequency.value=520+(score%5)*85;o.connect(g);g.connect(master);g.gain.setValueAtTime(.0001,ac.currentTime);g.gain.exponentialRampToValueAtTime(.16,ac.currentTime+.01);g.gain.exponentialRampToValueAtTime(.0001,ac.currentTime+.23);o.start();o.stop(ac.currentTime+.25);o.onended=()=>{o.disconnect();g.disconnect();};};
 for(const k of ids)$('audio-'+k).onchange=()=>{prefs[k]=$('audio-'+k).checked;persist();sync();unlock();};
 $('audio-volume').oninput=()=>{prefs.volume=Number($('audio-volume').value);persist();apply();};
 $('sound').onclick=()=>{prefs.muted=!prefs.muted;persist();sync();unlock();};
 document.addEventListener('pointerdown',()=>{if(!unlocked)unlock();},{passive:true});
 document.addEventListener('keydown',()=>{if(!unlocked)unlock();});
 document.addEventListener('visibilitychange',()=>{if(ac){if(document.hidden){master.gain.setTargetAtTime(0,ac.currentTime,.05);}else{unlocked=false;status('撳一下繼續聽。');}}});
 sync();
})();

// Shared by the game and exported postcards. Pure local canvas drawing; no remote images.
const SCENES={
 day:{label:'日間',icon:'☀',sky:['#a6d6dd','#deeddb','#79afb2'],hill:'#6f9993',water:'#5c999f',wave:'#d4f0e355',sun:'#fff4bc',star:'#835819',card:'#f7f2e5',ink:'#273f42',muted:'#52696a',accent:'#815e2e',title:'日頭摸魚，都算海洋活動。',caption:'今日天氣：適合唔趕時間。'},
 dusk:{label:'黃昏',icon:'◒',sky:['#66536f','#e4a085','#776e83'],hill:'#625d76',water:'#555f7c',wave:'#f4c9ae44',sun:'#ffe0a0',star:'#ffe7aa',card:'#f8e9db',ink:'#523e4c',muted:'#79596a',accent:'#9c5745',title:'太陽收工，你都可以唞吓。',caption:'黃昏限定，唔使加班排隊。'},
 night:{label:'夜間',icon:'☾',sky:['#19283d','#294556','#153748'],hill:'#192f40',water:'#163b4b',wave:'#a0c0c025',sun:'#f4dfaa',star:'#f9d48c',card:'#142b3b',ink:'#f5f0de',muted:'#b0c5ca',accent:'#f3cf87',title:'今晚嘅海，有啲無謂驚喜。',caption:'夜更由月亮返，你負責發呆。'}
};
function drawScenery(c,w,h,mode='night',t=0,animate=false){
 const s=SCENES[mode]||SCENES.night;c.save();
 const sky=c.createLinearGradient(0,0,0,h);s.sky.forEach((color,i)=>sky.addColorStop([0,.65,1][i],color));c.fillStyle=sky;c.fillRect(0,0,w,h);
 const orbX=w*.78,orbY=h*(mode==='dusk'?.52:.22),radius=Math.min(w,h)*.062;
 if(mode==='night')for(let i=0;i<45;i++){const px=(Math.sin(i*72.4)*.5+.5)*w,py=(Math.cos(i*39.7)*.5+.5)*h*.57;c.fillStyle='rgba(238,225,187,'+(.25+(i%4)*.13)+')';c.beginPath();c.arc(px,py,i%3===0?1.4:.7,0,7);c.fill();}
 c.fillStyle=s.sun;c.shadowColor=s.sun;c.shadowBlur=mode==='day'?12:28;c.beginPath();c.arc(orbX,orbY,radius,0,7);c.fill();c.shadowBlur=0;
 if(mode==='night'){c.fillStyle='#203447';c.beginPath();c.arc(orbX-radius*.36,orbY-radius*.24,radius*.94,0,7);c.fill();}
 else{
  c.fillStyle=mode==='day'?'#ffffff80':'#f9c2a64d';
  [[.2,.2,.15],[.52,.32,.1],[.86,.13,.1]].forEach(([px,py,r])=>{c.beginPath();c.ellipse(w*px,h*py,w*r,h*.026,0,0,7);c.fill();c.beginPath();c.ellipse(w*(px-.03),h*(py-.02),w*r*.5,h*.035,0,0,7);c.fill();});
  c.strokeStyle=mode==='day'?'#486f79':'#7e5060';c.lineWidth=1.5;
  for(let i=0;i<3;i++){const bx=w*(.36+i*.035),by=h*(.34+i*.02);c.beginPath();c.moveTo(bx-5,by+2);c.quadraticCurveTo(bx-2,by-3,bx,by);c.quadraticCurveTo(bx+2,by-3,bx+5,by+2);c.stroke();}
 }
 c.fillStyle=s.hill;c.beginPath();c.moveTo(0,h*.7);c.bezierCurveTo(w*.15,h*.48,w*.28,h*.76,w*.43,h*.66);c.bezierCurveTo(w*.66,h*.5,w*.81,h*.68,w,h*.59);c.lineTo(w,h);c.lineTo(0,h);c.fill();
 c.fillStyle=s.water;c.fillRect(0,h*.74,w,h*.26);
 c.strokeStyle=s.wave;c.lineWidth=1;
 for(let i=0;i<12;i++){const y=h*.74+i*h*.024;c.beginPath();for(let j=0;j<=w+12;j+=12){const yy=y+Math.sin(j/65+i+(animate?t/2200:0))*3;if(!j)c.moveTo(j,yy);else c.lineTo(j,yy);}c.stroke();}
 c.restore();
}

// Postcard renderer: text stays on the image, no network or screenshot service.
const CARD_W=1080,CARD_H=1350;
const CARD_FONT='"PingFang TC", "Microsoft JhengHei", "Noto Sans CJK TC", "Noto Sans TC", sans-serif';
function wrapCardText(c,text,maxWidth){
 const lines=[];let line='';
 for(const char of Array.from(text)){
  if(char==='\n'){lines.push(line);line='';continue;}
  if(line&&c.measureText(line+char).width>maxWidth){lines.push(line);line=char;}else line+=char;
 }
 if(line)lines.push(line);return lines;
}
function renderGiftPostcard(c,g,mode,art=null,quote=null,footer=null){
 const s=SCENES[mode]||SCENES.night;
 c.save();c.clearRect(0,0,CARD_W,CARD_H);c.fillStyle=s.card;c.fillRect(0,0,CARD_W,CARD_H);
 c.save();c.beginPath();c.rect(36,36,1008,558);c.clip();c.translate(36,36);drawScenery(c,1008,558,mode,0,false);c.restore();
 c.fillStyle=mode==='day'?'#263c45':'#f5f0de';c.textAlign='left';c.textBaseline='alphabetic';c.font='500 24px '+CARD_FONT;c.fillText('無聊小島  /  小廢物領取處',76,88);
 c.textAlign='right';c.font='23px '+CARD_FONT;c.fillText(s.label+'限定風景',1004,88);
 // Collector's stamp and gift emblem.
 c.save();c.translate(540,318);c.fillStyle=mode==='night'?'#ffffff10':'#fff9ed88';c.beginPath();c.arc(0,0,138,0,Math.PI*2);c.fill();c.strokeStyle=mode==='night'?'#f4dfaa66':'#ffffffbb';c.lineWidth=2;c.beginPath();c.arc(0,0,151,0,Math.PI*2);c.stroke();c.textAlign='center';c.textBaseline='middle';c.font='176px "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif';if(art){c.drawImage(art,-102,-102,204,204);}else{c.fillStyle=g.color;c.fillRect(-66,-42,132,110);c.fillStyle='#fbedd0';c.fillRect(-76,-60,152,24);c.fillRect(-10,-60,20,128);c.strokeStyle='#fbedd0';c.lineWidth=12;c.beginPath();c.ellipse(-26,-76,25,15,.4,0,7);c.stroke();c.beginPath();c.ellipse(26,-76,25,15,-.4,0,7);c.stroke();}c.restore();
 c.textAlign='center';c.fillStyle=mode==='day'?'#213f43':'#fff0d6';c.font='23px '+CARD_FONT;c.fillText('冇乜實際用途。但係你嘅。',540,537);
 c.textAlign='left';c.fillStyle=s.accent;c.font='500 23px '+CARD_FONT;c.fillText('收藏 '+String(g.id+1).padStart(3,'0')+' / 999   ·   '+giftThemes[g.theme].name+'系列',76,661);
 c.fillStyle=s.ink;let titleSize=68;c.font='700 '+titleSize+'px '+CARD_FONT;
 while(c.measureText(g.name).width>928&&titleSize>36){titleSize--;c.font='700 '+titleSize+'px '+CARD_FONT;}c.fillText(g.name,76,758);
 c.strokeStyle=mode==='night'?'#ffffff28':'#44332225';c.lineWidth=1;c.beginPath();c.moveTo(76,800);c.lineTo(1004,800);c.stroke();
 let storySize=39,lines=[];do{c.font=storySize+'px '+CARD_FONT;lines=wrapCardText(c,g.story,928);if(lines.length*storySize*1.65<=205)break;storySize--;}while(storySize>=22);
 c.fillStyle=s.ink;const lineHeight=storySize*1.65;lines.forEach((line,i)=>c.fillText(line,76,842+i*lineHeight));
 const q=quote||missionDeck[g.id%missionDeck.length],f=footer||footerDeck[g.id%footerDeck.length];
 c.fillStyle=s.accent;c.font='25px '+CARD_FONT;c.fillText('隨卡附送 · '+q.kind+' · 可做可唔做',76,1080);
 c.fillStyle=s.ink;let qs=33,ql;do{c.font=qs+'px '+CARD_FONT;ql=wrapCardText(c,q.text,928);if(ql.length<=3)break;qs--;}while(qs>18);ql.forEach((line,i)=>c.fillText(line,76,1123+i*38));
 c.fillStyle=s.muted;let footerSize=28;c.font=footerSize+'px '+CARD_FONT;while(c.measureText(f.head).width>928&&footerSize>18){footerSize--;c.font=footerSize+'px '+CARD_FONT;}const footerWidth=c.measureText(f.head).width;c.fillText(f.head,76,1240);
 c.fillStyle=s.accent;c.font='20px '+CARD_FONT;c.fillText('小島留念 · '+q.kind,76,1280);c.textAlign='right';c.fillText(f.tag,1004,1280);c.fillStyle=s.muted;c.font='13px '+CARD_FONT;c.fillText('Art: Twemoji © Twitter & contributors · CC BY 4.0',1004,1320);c.restore();
 return {lines:lines.length,storyBottom:842+(lines.length-1)*lineHeight,fontSize:storySize,quoteLines:ql.length,quoteBottom:1123+(ql.length-1)*38,footerWidth};
}
const cardArtCache=new Map();
function loadGiftArt(icon){
 if(typeof Image==='undefined'||typeof GIFT_ART==='undefined'||!GIFT_ART[icon])return Promise.resolve(null);
 if(!cardArtCache.has(icon))cardArtCache.set(icon,new Promise(resolve=>{const im=new Image();im.onload=()=>resolve(im);im.onerror=()=>{cardArtCache.delete(icon);resolve(null);};im.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(GIFT_ART[icon]);}));
 return cardArtCache.get(icon);
}
let postcardQuote=null,postcardFooter=null;
let postcardScene='night',postcardReturn=false,postcardURL='',postcardBlob=null,postcardVersion=0;
async function refreshPostcard(){
 const $=id=>document.getElementById(id),version=++postcardVersion;
 postcardURL='';postcardBlob=null;document.getElementById('save-photo').disabled=true;$('download-card').removeAttribute('href');$('download-card').setAttribute('aria-disabled','true');$('share-card').hidden=true;
 try{
  if(selectedGift===null||!saved.found.includes(selectedGift))throw new Error('gift_not_owned');
  // Wait for available local fonts; no external font dependency.
  if(document.fonts&&document.fonts.ready)await document.fonts.ready;
  if(version!==postcardVersion)return;
  const g=gifts[selectedGift],art=await loadGiftArt(g.icon);
  if(version!==postcardVersion)return;
  const out=document.createElement('canvas');out.width=CARD_W*2;out.height=CARD_H*2;out.getContext('2d').scale(2,2);
  renderGiftPostcard(out.getContext('2d'),g,postcardScene,art,postcardQuote,postcardFooter);
  const url=out.toDataURL('image/png');if(version!==postcardVersion)return;
  postcardURL=url;$('save-photo').disabled=false;$('postcard-image').src=url;$('postcard-image').alt=g.name+'。'+g.story+'。'+(postcardQuote?postcardQuote.text:'');
  const filename='little-joy-gift-'+String(g.id+1).padStart(4,'0')+'-'+postcardScene+'.png';
  $('download-card').href=url;$('download-card').download=filename;$('download-card').setAttribute('aria-disabled','false');
  $('postcard-status').textContent='2160 × 2700 高清原圖。存相簿請撳「存入相片」，再長按圖片。';
  if(out.toBlob)out.toBlob(blob=>{if(version!==postcardVersion||!blob)return;postcardBlob=blob;try{const f=new File([blob],filename,{type:'image/png'});$('share-card').hidden=!(navigator.canShare&&navigator.canShare({files:[f]}));}catch(e){}},'image/png');
 }catch(e){$('postcard-status').textContent='今次製圖未成功，試吓重新開啟呢張卡。原本收藏仲喺度。';}
}
function openPostcard(){
 if(selectedGift===null||!saved.found.includes(selectedGift))return;
 const $=id=>document.getElementById(id);
 nextMission();postcardQuote=missionDeck[missionIndex>=0?missionIndex:0];postcardFooter=nextFooter();postcardScene=currentScene;postcardReturn=running&&!paused;if(postcardReturn)pause();resetInput();
 $('postcard-name').textContent=gifts[selectedGift].name;$('postcard-story').textContent=gifts[selectedGift].story;
 updateGiftNavigation();$('postcard').showModal();setPostcardScene(postcardScene);
}
function setPostcardScene(mode){
 if(!SCENES[mode])return;postcardScene=mode;
 for(const k of Object.keys(SCENES))document.getElementById('card-'+k).setAttribute('aria-pressed',String(k===mode));
 document.getElementById('postcard-status').textContent='幫你包裝緊，唔收膠袋錢。';refreshPostcard();
}
function updateGiftNavigation(){const ids=[...saved.found].sort((a,b)=>a-b),i=ids.indexOf(selectedGift);document.getElementById('gift-position').textContent=(i+1)+' / '+ids.length+' 件已收藏';document.getElementById('gift-prev').disabled=ids.length<2;document.getElementById('gift-next').disabled=ids.length<2;}
function navigateGift(dir){const ids=[...saved.found].sort((a,b)=>a-b);if(ids.length<2)return;selectedGift=ids[(ids.indexOf(selectedGift)+dir+ids.length)%ids.length];showGift(selectedGift);document.getElementById('postcard-name').textContent=gifts[selectedGift].name;document.getElementById('postcard-story').textContent=gifts[selectedGift].story;nextMission();postcardQuote=missionDeck[missionIndex];postcardFooter=nextFooter();updateGiftNavigation();refreshPostcard();}
function initPostcards(){
 const $=id=>document.getElementById(id);
 $('save-photo').onclick=()=>{if(postcardURL)openPhotoSave(postcardURL,$('postcard-image').alt);};
 $('gift-prev').onclick=()=>navigateGift(-1);$('gift-next').onclick=()=>navigateGift(1);
 $('card-new-quote').onclick=()=>{nextMission();postcardQuote=missionDeck[missionIndex];postcardFooter=nextFooter();refreshPostcard();};
 $('take-gift').onclick=openPostcard;$('album-take-gift').onclick=openPostcard;
 $('close-postcard').onclick=()=>$('postcard').close();
 $('postcard').addEventListener('close',()=>{++postcardVersion;if(postcardReturn&&running&&paused&&!$('album').open)pause();postcardReturn=false;});
 for(const k of Object.keys(SCENES))$('card-'+k).onclick=()=>setPostcardScene(k);
 $('download-card').onclick=e=>{if(!postcardURL){e.preventDefault();return;}$('postcard-status').textContent='已交俾瀏覽器下載；如果冇彈出，試吓長按圖片儲存。';};
 $('share-card').onclick=async()=>{try{if(!postcardBlob)return;const f=new File([postcardBlob],$('download-card').download,{type:'image/png'});await navigator.share({files:[f],title:gifts[selectedGift].name});}catch(e){if(e.name!=='AbortError')$('postcard-status').textContent='呢個瀏覽器分享唔到，仲可以用「下載故事卡」。';}};
}

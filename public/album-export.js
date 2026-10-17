// Fixed-size pages keep the full 999-gift collection exportable on phones.
const SHEET_SIZE=12;
let sheetPage=0,sheetScene='night',sheetIds=[],sheetVersion=0,sheetReturn=false,sheetURL='';
function renderAlbumSheet(c,ids,page,mode,arts=[]){
 const s=SCENES[mode],pages=Math.ceil(ids.length/SHEET_SIZE);
 c.save();c.fillStyle=s.card;c.fillRect(0,0,1080,1440);
 c.save();c.beginPath();c.rect(0,0,1080,230);c.clip();drawScenery(c,1080,400,mode,0,false);c.restore();
 c.textAlign='left';c.textBaseline='alphabetic';c.fillStyle=mode==='day'?'#213f43':'#fff0d6';c.font='bold 48px '+CARD_FONT;c.fillText('你嘅小廢物圖鑑',48,88);
 c.font='25px '+CARD_FONT;c.fillText('已收集 '+ids.length+' / 999 件 · 第 '+(page+1)+' / '+pages+' 頁',48,140);
 c.fillText('冇乜用，但全部係你接返嚟。',48,184);
 const subset=ids.slice(page*SHEET_SIZE,(page+1)*SHEET_SIZE);
 subset.forEach((id,i)=>{
  const g=gifts[id],x=48+(i%3)*336,y=260+Math.floor(i/3)*260;
  c.fillStyle=mode==='night'?'#ffffff09':'#ffffff45';c.fillRect(x,y,312,238);
  if(arts[i])c.drawImage(arts[i],x+108,y+18,96,96);else{c.fillStyle=g.color;c.fillRect(x+120,y+30,72,70);c.fillStyle='#fff0b9';c.fillRect(x+148,y+30,16,70);}
  c.textAlign='center';c.fillStyle=s.accent;c.font='18px '+CARD_FONT;c.fillText('#'+String(id+1).padStart(3,'0')+' · '+giftThemes[g.theme].name,x+156,y+143);
  c.fillStyle=s.ink;c.font='bold 26px '+CARD_FONT;wrapCardText(c,g.name,280).forEach((line,j)=>c.fillText(line,x+156,y+183+j*34));
 });
 c.textAlign='left';c.fillStyle=s.muted;c.font='22px '+CARD_FONT;c.fillText('無聊小島 · 收藏唔使交租。暫時。',48,1356);
 c.font='16px '+CARD_FONT;c.fillText('Art: Twemoji © Twitter & contributors · CC BY 4.0',48,1400);c.restore();
 return subset;
}
async function refreshSheet(){
 const v=++sheetVersion,pages=Math.ceil(sheetIds.length/SHEET_SIZE);
 sheetPage=Math.max(0,Math.min(sheetPage,pages-1));sheetURL='';
 $('sheet-download').removeAttribute('href');$('sheet-download').setAttribute('aria-disabled','true');$('sheet-image').removeAttribute('src');
 $('sheet-prev').disabled=sheetPage===0;$('sheet-next').disabled=sheetPage>=pages-1;
 $('sheet-page').textContent=pages?(sheetPage+1)+' / '+pages+' 頁':'';
 if(!pages){$('sheet-status').textContent='口袋仲係空嘅。接到禮物再嚟印啦。';return;}
 $('sheet-status').textContent='排緊位，每件小廢物都有自己個位。';
 try{
  if(document.fonts)await document.fonts.ready;
  const ids=sheetIds.slice(sheetPage*SHEET_SIZE,(sheetPage+1)*SHEET_SIZE),page=sheetPage,mode=sheetScene;
  const arts=await Promise.all(ids.map(id=>loadGiftArt(gifts[id].icon)));if(v!==sheetVersion)return;
  const out=document.createElement('canvas');out.width=2160;out.height=2880;out.getContext('2d').scale(2,2);renderAlbumSheet(out.getContext('2d'),sheetIds,page,mode,arts);
  sheetURL=out.toDataURL('image/png');$('sheet-image').src=sheetURL;$('sheet-image').alt='已收集圖鑑，第 '+(page+1)+' 頁：'+ids.map(id=>gifts[id].name).join('、');
  $('sheet-download').href=sheetURL;$('sheet-download').download='little-joy-album-'+mode+'-'+String(page+1).padStart(2,'0')+'.png';$('sheet-download').setAttribute('aria-disabled','false');
  $('sheet-status').textContent='2160 × 2880 高清圖片 · 每頁最多 12 件。手機可長按圖片儲存；多頁請逐頁下載。圖片唔係遊戲進度備份。';
 }catch(e){if(v===sheetVersion)$('sheet-status').textContent='今次印唔到，試吓重新開啟。收藏冇受影響。';}
}
function initAlbumExport(){
 $('save-album').onclick=()=>{sheetIds=[...saved.found].sort((a,b)=>a-b);sheetPage=0;sheetScene=currentScene;sheetReturn=running&&!paused;if(sheetReturn)pause();resetInput();$('sheet').showModal();refreshSheet();};
 $('sheet-close').onclick=()=>$('sheet').close();
 $('sheet').addEventListener('close',()=>{++sheetVersion;if(sheetReturn&&running&&paused&&!$('album').open)pause();sheetReturn=false;});
 $('sheet-prev').onclick=()=>{sheetPage--;refreshSheet();};$('sheet-next').onclick=()=>{sheetPage++;refreshSheet();};
 $('sheet-download').onclick=e=>{if(!sheetURL)e.preventDefault();};
}
// Protect gameplay text, while keeping native editing and image saving available.
function guardGameGesture(e){
 const target=e.target;
 if(!target||!target.closest)return;
 if(target.closest('input,textarea,select,[contenteditable="true"],.saveable-image,a[download]'))return;
 if(target.closest('main,dialog'))e.preventDefault();
}
for(const type of ['contextmenu','selectstart','dragstart'])document.addEventListener(type,guardGameGesture);

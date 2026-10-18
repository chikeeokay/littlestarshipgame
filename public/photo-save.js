// A visible image gives iPhone its native long-press image-saving menu.
// Websites cannot choose Photos as the native share destination or confirm a save.
function openPhotoSave(url,description){
 if(!url||!url.startsWith('data:image/png'))return;
 const im=document.getElementById('photo-save-image');im.src=url;im.alt=description||'長按圖片儲存';
 document.getElementById('photo-save-dialog').showModal();
}
document.getElementById('photo-save-close').onclick=()=>document.getElementById('photo-save-dialog').close();
document.getElementById('photo-save-dialog').addEventListener('close',()=>document.getElementById('photo-save-image').removeAttribute('src'));

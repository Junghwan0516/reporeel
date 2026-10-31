'use strict';
const button=document.getElementById('capture'),status=document.getElementById('status');
let active=false;
async function refresh(){const s=await chrome.runtime.sendMessage({target:'worker',type:'status'});active=s.active;button.textContent=active?'Stop & open studio':'Start recording this tab';status.textContent=active?'Recording '+s.seconds+'s. Your app stays on your device.':'';}
button.onclick=async()=>{button.disabled=true;try{const r=await chrome.runtime.sendMessage({target:'worker',type:active?'stop':'start'});if(r.error)throw Error(r.error);if(!active)window.close();else await refresh();}catch(e){status.textContent=e.message;}finally{button.disabled=false;}};
document.getElementById('studio').onclick=()=>chrome.tabs.create({url:chrome.runtime.getURL('studio/index.html#capture')});
refresh().catch(e=>{status.textContent=e.message;});

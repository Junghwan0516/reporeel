'use strict';
// The worker owns capture initiation. The offscreen document owns recording state.
let captureTab=null;
async function ensureOffscreen(){const contexts=await chrome.runtime.getContexts({contextTypes:['OFFSCREEN_DOCUMENT']});if(!contexts.length)await chrome.offscreen.createDocument({url:'offscreen.html',reasons:['USER_MEDIA'],justification:'Record the tab stream locally and preserve a clip for the editor.'});}
async function offscreen(message){await ensureOffscreen();return chrome.runtime.sendMessage({target:'offscreen',...message});}
chrome.runtime.onMessage.addListener((message,sender,reply)=>{
 if(message.target!=='worker')return;
 (async()=>{
  if(message.type==='status')return offscreen({type:'status'});
  if(message.type==='start'){
   const s=await offscreen({type:'status'});if(s.active)throw Error('A capture is already running.');
   const [tab]=await chrome.tabs.query({active:true,currentWindow:true});
   if(!tab?.id||!/^https?:/.test(tab.url||''))throw Error('Open a regular HTTP or HTTPS app tab first. Browser-internal pages cannot be recorded.');
   // Reject a restricted page before acquiring a recording stream.
   await chrome.scripting.executeScript({target:{tabId:tab.id},files:['pointer.js']});
   const id=await chrome.tabCapture.getMediaStreamId({targetTabId:tab.id});
   const result=await offscreen({type:'start',streamId:id,tabId:tab.id});if(result.error)throw Error(result.error);
   captureTab=tab.id;await chrome.storage.session.set({captureTab:tab.id});await chrome.tabs.sendMessage(tab.id,{type:'reporeel-start'});await chrome.action.setBadgeText({text:'REC'});await chrome.action.setBadgeBackgroundColor({color:'#df766f'});return {ok:true};
  }
  if(message.type==='pointer'){
   const s=await chrome.storage.session.get('captureTab');
   if(sender.tab?.id!==s.captureTab)return {ok:false};
   return offscreen({type:'pointer',event:message.event});
  }
  if(message.type==='stop'){
   const result=await offscreen({type:'stop'});if(result.error)throw Error(result.error);return {ok:true};
  }
  if(message.type==='finished'){
   const tabId=captureTab??(await chrome.storage.session.get('captureTab')).captureTab;
   if(tabId!=null)try{await chrome.tabs.sendMessage(tabId,{type:'reporeel-stop'});}catch{}
   captureTab=null;await chrome.storage.session.remove('captureTab');await chrome.action.setBadgeText({text:''});
   if(message.error){await chrome.storage.session.set({lastError:message.error});return {ok:false};}
   await chrome.tabs.create({url:chrome.runtime.getURL('studio/index.html#capture')});return {ok:true};
  }
  return {error:'Unknown capture command.'};
 })().then(reply,e=>reply({error:e.message}));
 return true;
});

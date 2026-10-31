'use strict';
let recorder=null,stream=null,chunks=[],events=[],started=0,bytes=0,done=null,stopResolve=null,limitTimer=null;
const MAX=80*1024*1024;
function save(value){return new Promise((resolve,reject)=>{const req=indexedDB.open('reporeel-capture',1);req.onupgradeneeded=()=>req.result.createObjectStore('recordings');req.onerror=()=>reject(Error('Local recording storage could not be opened.'));req.onsuccess=()=>{const db=req.result,tx=db.transaction('recordings','readwrite');tx.objectStore('recordings').put(value,'latest');tx.oncomplete=()=>{db.close();resolve();};tx.onerror=()=>{db.close();reject(Error('Local storage is full.'));};};});}
async function finish(){const duration=(Date.now()-started)/1000;clearTimeout(limitTimer);stream?.getTracks().forEach(t=>t.stop());let error=null;try{if(!chunks.length)throw Error('The recording is empty.');if(bytes>MAX)throw Error('The capture exceeded 80 MB. Please record a shorter clip.');const video=new Blob(chunks,{type:recorder.mimeType});await save({video,duration,events:events.filter(e=>e.time<=duration)});}catch(e){error=e.message;}chunks=[];events=[];recorder=null;await chrome.runtime.sendMessage({target:'worker',type:'finished',error});stopResolve?.({ok:!error,error});stopResolve=null;}
chrome.runtime.onMessage.addListener((m,sender,reply)=>{
 if(m.target!=='offscreen')return;
 (async()=>{
  if(m.type==='status')return {active:Boolean(recorder&&recorder.state!=='inactive'),seconds:Math.round((Date.now()-started)/1000)};
  if(m.type==='start'){
   if(recorder&&recorder.state!=='inactive')throw Error('A capture is already running.');
   stream=await navigator.mediaDevices.getUserMedia({audio:false,video:{mandatory:{chromeMediaSource:'tab',chromeMediaSourceId:m.streamId},frameRate:30}});
   const type=['video/webm;codecs=vp9','video/webm;codecs=vp8','video/webm'].find(t=>MediaRecorder.isTypeSupported(t));
   recorder=new MediaRecorder(stream,{mimeType:type||'video/webm',videoBitsPerSecond:4000000});chunks=[];events=[];bytes=0;started=Date.now();
   recorder.ondataavailable=e=>{if(e.data.size){chunks.push(e.data);bytes+=e.data.size;if(bytes>=MAX&&recorder?.state==='recording')recorder.stop();}};
   recorder.onstop=finish;
   recorder.onerror=()=>{if(recorder?.state==='recording')recorder.stop();};
   stream.getVideoTracks()[0].onended=()=>{if(recorder?.state==='recording')recorder.stop();};
   recorder.start(400);limitTimer=setTimeout(()=>{if(recorder?.state==='recording')recorder.stop();},600000);return {ok:true};
  }
  if(m.type==='pointer'){
   const e=m.event;if(!recorder||recorder.state!=='recording'||!e||!['move','click'].includes(e.type)||!Number.isFinite(e.x)||!Number.isFinite(e.y))return {ok:false};
   const time=(e.at-started)/1000;if(time<0||time>600||events.length>=40000)return {ok:false};events.push({time,x:Math.max(0,Math.min(1,e.x)),y:Math.max(0,Math.min(1,e.y)),type:e.type,...(e.type==='click'?{duration:1.8}:{})});return {ok:true};
  }
  if(m.type==='stop'){
   if(!recorder||recorder.state==='inactive')throw Error('No capture is running.');
   return new Promise(resolve=>{stopResolve=resolve;recorder.stop();});
  }
  return {error:'Unknown recorder command.'};
 })().then(reply,e=>reply({error:e.message}));return true;
});

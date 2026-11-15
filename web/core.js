/* Shared, deterministic project model and animation math. */
(function(root){
'use strict';
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const smooth=t=>{t=clamp(t,0,1);return t*t*(3-2*t);};
const defaults=()=>({theme:'iris',ratio:'wide',padding:56,radius:14,shadow:true,zoom:1.65,autoZoom:true,cursor:true,cursorSize:24,title:'A little less explaining. A lot more showing.',speed:1,trimStart:0,trimEnd:12});
function demoProject(){return {format:'reporeel/1',name:'Orbit — a calmer launch week',source:{kind:'demo',duration:12,width:1200,height:750},settings:defaults(),events:[{time:0,x:.38,y:.37,type:'move'},{time:1.5,x:.73,y:.46,type:'move'},{time:2,x:.73,y:.46,type:'click',duration:1.6},{time:3.8,x:.43,y:.27,type:'move'},{time:4.3,x:.43,y:.27,type:'click',duration:1.8},{time:6.2,x:.78,y:.18,type:'move'},{time:6.7,x:.78,y:.18,type:'click',duration:1.7},{time:8.8,x:.68,y:.43,type:'move'},{time:9.3,x:.68,y:.43,type:'click',duration:1.6},{time:11.5,x:.54,y:.55,type:'move'}],captions:[{start:0,end:3.5,text:'Meet your next launch. Without the chaos.'},{start:3.8,end:7.8,text:'One space. Every moving piece.'},{start:8.2,end:12,text:'From a good idea to a great launch.'}],masks:[]};}
function finite(v,label,min,max){if(typeof v!=='number'||!Number.isFinite(v)||v<min||v>max)throw Error(`Invalid ${label}.`);return v;}
function validate(p){
 if(!p||p.format!=='reporeel/1')throw Error('This is not a RepoReel project.');
 if(!p.source||!['demo','video'].includes(p.source.kind))throw Error('Unsupported source.');
 finite(p.source.duration,'duration',.05,600);finite(p.source.width,'width',1,16384);finite(p.source.height,'height',1,16384);
 if(p.source.kind==='video'&&(typeof p.source.data!=='string'||!/^data:video\/[\w.+-]+;base64,[A-Za-z0-9+/=]+$/.test(p.source.data)))throw Error('Video project is missing its embedded video.');
 if((p.source.data?.length||0)>115000000)throw Error('Embedded video is too large.');
 const s={...defaults(),...p.settings};
 if(!['iris','sunrise','mint','slate','paper'].includes(s.theme)||!['wide','square','portrait'].includes(s.ratio))throw Error('Unsupported canvas style.');
 for(const [key,min,max] of [['padding',0,160],['radius',0,60],['zoom',1,3],['cursorSize',12,60],['speed',.5,3],['trimStart',0,p.source.duration],['trimEnd',0,p.source.duration]])finite(s[key],key,min,max);
 if(s.trimEnd-s.trimStart<.05)throw Error('The trim end must be after the trim start.');
 if(typeof s.title!=='string'||s.title.length>160)throw Error('Title must be 160 characters or fewer.');
 for(const key of ['shadow','autoZoom','cursor'])if(typeof s[key]!=='boolean')throw Error(`Invalid ${key}.`);
 const events=p.events||[],captions=p.captions||[],masks=p.masks||[];
 if(!Array.isArray(events)||events.length>40000||!Array.isArray(captions)||captions.length>100||!Array.isArray(masks)||masks.length>100)throw Error('Project contains too many tracks.');
 for(const e of events){finite(e.time,'event time',0,p.source.duration);finite(e.x,'event x',0,1);finite(e.y,'event y',0,1);if(!['move','click','focus'].includes(e.type))throw Error('Unsupported event type.');if(e.duration!=null)finite(e.duration,'focus duration',.1,30);}
 for(const c of captions){finite(c.start,'caption start',0,p.source.duration);finite(c.end,'caption end',0,p.source.duration);if(c.end<=c.start||typeof c.text!=='string'||c.text.length>160)throw Error('Invalid caption.');}
 for(const m of masks){for(const k of ['x','y','w','h'])finite(m[k],'redaction '+k,0,1);if(!m.w||!m.h||m.x+m.w>1.00001||m.y+m.h>1.00001)throw Error('Redaction must fit inside the source.');}
 return {format:'reporeel/1',name:String(p.name||'Untitled demo').slice(0,100),source:{...p.source},settings:s,events:[...events].sort((a,b)=>a.time-b.time),captions:captions.map(c=>({...c})),masks:masks.map(m=>({...m}))};
}
function pointerAt(events,t){if(!events.length)return null;let lo=0,hi=events.length;while(lo<hi){const mid=(lo+hi)>>1;if(events[mid].time<=t)lo=mid+1;else hi=mid;}const a=events[Math.max(0,lo-1)],b=events[Math.min(events.length-1,lo)];const f=a===b?0:smooth((t-a.time)/Math.max(.001,b.time-a.time));return {x:a.x+(b.x-a.x)*f,y:a.y+(b.y-a.y)*f};}
function cameraAt(events,t,settings){
 if(!settings.autoZoom)return {zoom:1,x:.5,y:.5};
 let strength=0,x=.5,y=.5;
 for(const e of events){if(e.type==='move')continue;const dt=t-e.time,d=e.duration||1.8;const w=smooth((dt+.35)/.4)*(1-smooth((dt-d+.45)/.55));if(w>strength){strength=w;x=e.x;y=e.y;}}
 const zoom=1+(settings.zoom-1)*strength;
 return {zoom,x:clamp(.5+(x-.5)*strength,.5/zoom,1-.5/zoom),y:clamp(.5+(y-.5)*strength,.5/zoom,1-.5/zoom)};
}
function dimensions(ratio,width=1280){return ratio==='portrait'?{width:Math.round(width*9/16),height:width}:ratio==='square'?{width,height:width}:{width,height:Math.round(width*9/16)};}
function outputDuration(p){return (p.settings.trimEnd-p.settings.trimStart)/p.settings.speed;}
function launchPreset(name) {
 const presets = {
  pitch: {ratio:'wide',theme:'slate',padding:36,radius:12,shadow:true},
  readme: {ratio:'wide',theme:'iris',padding:52,radius:14,shadow:true},
  social: {ratio:'square',theme:'mint',padding:46,radius:16,shadow:true}
 };
 return Object.hasOwn(presets,name) ? {...presets[name]} : null;
}
const api={launchPreset,clamp,smooth,defaults,demoProject,validate,pointerAt,cameraAt,dimensions,outputDuration};
if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.ReelCore=api;
})(typeof globalThis!=='undefined'?globalThis:this);

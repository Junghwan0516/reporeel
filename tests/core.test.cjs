const {test}=require('node:test');const assert=require('node:assert/strict');const C=require('../web/core.js');const {GifWriter}=require('../web/gif.js');
test('sample is a valid portable project with bounded tracks',()=>{const p=C.validate(C.demoProject());assert.equal(p.events.filter(e=>e.type==='click').length,4);assert.equal(C.outputDuration(p),12);});
test('camera returns to neutral and clamps anchors to avoid blank edges',()=>{const s=C.defaults(),e=[{time:2,x:0,y:1,type:'click',duration:2}];assert.deepEqual(C.cameraAt(e,0,s),{zoom:1,x:.5,y:.5});const c=C.cameraAt(e,2.5,s);assert.equal(c.zoom,s.zoom);assert.ok(c.x>=.5/c.zoom);assert.ok(c.y<=1-.5/c.zoom);assert.deepEqual(C.cameraAt(e,5,s),{zoom:1,x:.5,y:.5});});
test('pointer interpolation handles empty lists and temporal bounds',()=>{assert.equal(C.pointerAt([],1),null);const e=[{time:1,x:0,y:0},{time:3,x:1,y:1}];assert.deepEqual(C.pointerAt(e,2),{x:.5,y:.5});assert.deepEqual(C.pointerAt(e,8),{x:1,y:1});assert.deepEqual(C.pointerAt(e,0),{x:0,y:0});});
test('trim and speed determine exported duration',()=>{const p=C.demoProject();p.settings.trimStart=2;p.settings.trimEnd=10;p.settings.speed=2;assert.equal(C.outputDuration(p),4);});
test('project validation rejects hostile dimensions, invalid times and out-of-bounds masks',()=>{for(const mutate of [p=>p.source.duration=Infinity,p=>p.settings.trimEnd=0,p=>p.events[0].x=2,p=>p.settings.zoom=NaN,p=>p.captions[0].end=20,p=>p.masks=[{x:.9,y:0,w:.5,h:.2}],p=>p.source.kind='html',p=>p.settings.theme='url(javascript:1)',p=>p.settings.cursor='yes']){const p=C.demoProject();mutate(p);assert.throws(()=>C.validate(p));}});
test('embedded sources must be video data, not remote resources or executable HTML',()=>{const p=C.demoProject();p.source.kind='video';for(const data of ['https://example.com/secret','data:text/html;base64,PHNjcmlwdD4=','javascript:alert(1)']){p.source.data=data;assert.throws(()=>C.validate(p));}p.source.data='data:video/webm;base64,AA==';assert.equal(C.validate(p).source.kind,'video');});
test('all aspect ratios have deterministic dimensions',()=>{assert.deepEqual(C.dimensions('wide'),{width:1280,height:720});assert.deepEqual(C.dimensions('portrait'),{width:720,height:1280});assert.deepEqual(C.dimensions('square'),{width:1280,height:1280});});
test('GIF emits valid signature, looping metadata and trailer',()=>{const gif=new GifWriter(2,2,10);gif.frame(new Uint8ClampedArray([255,0,0,255,0,255,0,255,0,0,255,255,255,255,255,255]));const b=gif.finish();assert.equal(Buffer.from(b.slice(0,6)).toString(),'GIF89a');assert.equal(b[b.length-1],59);assert.ok(Buffer.from(b).includes(Buffer.from('NETSCAPE2.0')));assert.throws(()=>new GifWriter(0,3));assert.throws(()=>new GifWriter(3,3).frame(new Uint8Array(2)));});

test('launch presets return only visual fields and fresh objects',()=>{
 const presets=require('../web/core.js');
 const pitch=presets.launchPreset('pitch');
 assert.equal(pitch.ratio,'wide');
 pitch.ratio='square';
 assert.equal(presets.launchPreset('pitch').ratio,'wide');
 assert.equal(presets.launchPreset('social').ratio,'square');
 assert.deepEqual(Object.keys(pitch).sort(),['padding','radius','ratio','shadow','theme']);
 assert.equal(presets.launchPreset('toString'),null);
});

test('source comparison fits the video and covers redaction edges',()=>{
 const calls=[];
 const ctx={canvas:{width:640,height:360},fillRect(...a){calls.push(['fill',...a]);},drawImage(...a){calls.push(['draw',...a]);}};
 const video={};
 require('../web/renderer.js').renderSourceFrame(ctx,{
  source:{kind:'video',width:800,height:600}, masks:[{x:.101,y:.101,w:.1,h:.1}]
 },3,video);
 assert.deepEqual(calls,[['fill',0,0,640,360],['draw',video,80,0,480,360],['fill',128,36,49,37]]);
});

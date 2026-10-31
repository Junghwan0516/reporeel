/* Canvas renderer shared by preview, exports, and the sample asset builder. */
(function(root){
'use strict';
const C=typeof module!=='undefined'&&module.exports?require('./core.js'):root.ReelCore;
const themes={iris:['#c9b9ff','#8a80ce','#e3c8ee'],sunrise:['#f7c7ad','#e9a8ad','#ac9ec7'],mint:['#c1e9cf','#7cbdac','#bad3d5'],slate:['#42495e','#242b3d','#656a80'],paper:['#f2eadf','#d6cdbd','#eee5d9']};
function rounded(ctx,x,y,w,h,r,fill){ctx.beginPath();ctx.roundRect(x,y,w,h,r);if(fill){ctx.fillStyle=fill;ctx.fill();}}
function text(ctx,txt,x,y,size,color='#2d3343',weight=400){ctx.fillStyle=color;ctx.font=`${weight} ${size}px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`;ctx.fillText(txt,x,y);}
function sample(ctx,t){
 const w=1200,h=750;ctx.clearRect(0,0,w,h);ctx.fillStyle='#fbfaf7';ctx.fillRect(0,0,w,h);ctx.fillStyle='#f1f0e9';ctx.fillRect(0,0,213,h);ctx.fillStyle='#e2e2da';ctx.fillRect(212,0,1,h);
 rounded(ctx,25,27,32,32,9,'#303c33');text(ctx,'o',34,50,28,'#d5e6ba',700);text(ctx,'orbit',67,51,25,'#28352c',650);text(ctx,'WORKSPACE',28,113,10,'#91998f',600);
 const active=t>=4.2&&t<6.5?'Overview':'Launch board';
 for(const [i,label] of ['Overview','Launch board','Inbox','Documents'].entries()){if(label===active)rounded(ctx,17,132+i*44,178,36,7,'#e1e6d6');text(ctx,['◉','▦','↙','▤'][i],29,156+i*44,16,'#697666');text(ctx,label,55,155+i*44,13,label===active?'#33482e':'#788174',label===active?600:400);}
 text(ctx,'YOUR PROJECTS',28,362,10,'#91998f',600);for(const [i,label] of ['Website launch','Brand refresh','Product roadmap'].entries()){ctx.fillStyle=['#a0b98a','#d9b3a9','#b2b3d5'][i];ctx.fillRect(30,389+i*38,7,7);text(ctx,label,49,397+i*38,12,'#7b8376');}
 rounded(ctx,18,625,176,104,10,'#e6e9dd');text(ctx,'Room for your next idea.',31,652,12,'#4b5d43',600);text(ctx,'You’re making good progress.',31,674,10,'#7b8674');rounded(ctx,31,691,145,20,5,'#c9d6b6');text(ctx,'Keep going ↗',70,705,10,'#4c6042',600);
 text(ctx,'Workspace  /  Website launch',246,44,12,'#989c91');ctx.fillStyle='#e4e5dc';ctx.fillRect(213,70,987,1);rounded(ctx,1107,23,29,29,15,'#e7d4c5');text(ctx,'JL',1114,43,10,'#6e594a',600);text(ctx,'···',1150,43,18,'#6c7863');
 text(ctx,t>=4.2&&t<6.5?'Your launch, at a glance.':'Make something worth launching.',248,126,29,'#303b30',600);text(ctx,'A little focus. A lot of forward motion.',249,156,13,'#989f91');rounded(ctx,1021,112,142,36,7,'#3d5138');text(ctx,t>=6.6?'✓  Link copied':'+  Share project',1040,135,12,'#f2f7ed',500);
 const stats=[['12','Tasks in motion'],[t>=9.1?'9':'8','Ready to launch'],['3','Days to go']];
 for(let i=0;i<3;i++){const x=248+i*310;rounded(ctx,x,190,292,94,10,i===1?'#eaf0df':'#f0f0e8');text(ctx,stats[i][0],x+19,232,29,'#3c5035',600);text(ctx,stats[i][1],x+19,258,11,'#8a947e');text(ctx,['↗','✓','◷'][i],x+248,223,19,'#8c9e78');}
 if(t>=4.2&&t<6.5){rounded(ctx,248,310,914,367,12,'#f0f1e9');text(ctx,'A clear path to launch',273,348,18,'#40513a',600);text(ctx,'Completed tasks this week',273,372,12,'#939d88');for(let i=0;i<12;i++){let bar=35+(i*31)%135+(i>7?80:0);rounded(ctx,287+i*68,620-bar,31,bar,5,i>7?'#728963':'#c7d2b9');}return;}
 const cols=[['TO DO','03'],['IN PROGRESS','04'],['DONE',t>=9.1?'06':'05']];
 const tasks=[['Polish the landing page','Design','Explore a little. Ship a lot.'],['Create launch assets','Marketing','Good things deserve a good story.'],['Write the release notes','Content','Keep it short. Make it count.'],['Review the final details','Design','The details are the design.'],['Invite the early birds','Community','Your first users are everything.'],['A little celebration','Team','You made something. That matters.']];
 for(let i=0;i<3;i++){let x=248+i*310;rounded(ctx,x,310,292,370,10,'#f1f1eb');text(ctx,cols[i][0],x+16,338,10,'#7b8970',650);rounded(ctx,x+232,323,40,22,6,'#e5e8df');text(ctx,cols[i][1],x+245,338,10,'#8b977e');for(let j=0;j<2;j++){const k=i*2+j,yy=357+j*143;rounded(ctx,x+12,yy,268,127,8,'#fffefa');ctx.strokeStyle='#e7e9df';ctx.stroke();rounded(ctx,x+25,yy+14,68,20,5,['#e7ecda','#f3e4dc','#e9e6f2'][k%3]);text(ctx,tasks[k][1],x+32,yy+28,9,['#788866','#ad8c79','#9288ab'][k%3]);text(ctx,tasks[k][0],x+25,yy+56,13,'#3f4d37',600);text(ctx,tasks[k][2],x+25,yy+77,10,'#a1a898');rounded(ctx,x+25,yy+94,18,18,9,'#e6dbcc');text(ctx,['A','J','M'][i],x+31,yy+107,8,'#8b7967');text(ctx,'Oct '+(20+k),x+201,yy+108,9,'#a5ad9b');}}
 if(t>=2&&t<3.5){rounded(ctx,667,353,365,219,11,'#fffefb');ctx.strokeStyle='#c2cfb2';ctx.lineWidth=2;ctx.stroke();text(ctx,'Write the release notes',687,390,20,'#3a4935',600);text(ctx,'The best launch story starts here.',687,420,12,'#929d85');rounded(ctx,686,446,326,36,7,'#eff3e6');text(ctx,'✓  Draft complete',700,469,12,'#748764',600);text(ctx,'Good to go. Make it yours.',687,512,12,'#9ba58f');}
 if(t>=9.1){rounded(ctx,869,615,282,43,8,'#dce8cd');text(ctx,'✓  Ready for the world.',890,641,13,'#597548',600);}
}
function sourceRect(canvas,p){const W=canvas.width,H=canvas.height;const pad=p.settings.padding/1280*Math.max(W,H);const usableW=W-pad*2,usableH=H-pad*2-26*W/1280;const scale=Math.min(usableW/p.source.width,usableH/p.source.height);const w=p.source.width*scale,h=p.source.height*scale;return {x:(W-w)/2,y:(H-h)/2-8*W/1280,w,h};}
function render(ctx,p,t,source,sampleCanvas){
 const W=ctx.canvas.width,H=ctx.canvas.height,s=p.settings,theme=themes[s.theme]||themes.iris;
 const g=ctx.createLinearGradient(0,0,W,H);g.addColorStop(0,theme[0]);g.addColorStop(.55,theme[1]);g.addColorStop(1,theme[2]);ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
 const glow=ctx.createRadialGradient(W*.18,H*.05,0,W*.18,H*.05,W*.9);glow.addColorStop(0,'#ffffff25');glow.addColorStop(1,'#ffffff00');ctx.fillStyle=glow;ctx.fillRect(0,0,W,H);
 if(p.source.kind==='demo'){sample(sampleCanvas.getContext('2d'),t);source=sampleCanvas;}
 const r=sourceRect(ctx.canvas,p),radius=s.radius*Math.max(W,H)/1280;
 if(s.shadow){ctx.save();ctx.shadowColor='#1a113c55';ctx.shadowBlur=45*W/1280;ctx.shadowOffsetY=22*W/1280;rounded(ctx,r.x,r.y,r.w,r.h,radius,'#0c0c14');ctx.restore();}
 const cam=C.cameraAt(p.events,t,s);ctx.save();rounded(ctx,r.x,r.y,r.w,r.h,radius);ctx.clip();ctx.save();ctx.translate(r.x+r.w/2,r.y+r.h/2);ctx.scale(cam.zoom,cam.zoom);ctx.translate(-cam.x*r.w,-cam.y*r.h);
 if(source)ctx.drawImage(source,0,0,r.w,r.h);else{ctx.fillStyle='#24242f';ctx.fillRect(0,0,r.w,r.h);}
 for(const mask of p.masks){ctx.fillStyle='#20212a';ctx.fillRect(mask.x*r.w,mask.y*r.h,mask.w*r.w,mask.h*r.h);}
 ctx.restore();
 if(s.cursor){const ptr=C.pointerAt(p.events,t);if(ptr){const x=r.x+r.w/2+(ptr.x-cam.x)*r.w*cam.zoom,y=r.y+r.h/2+(ptr.y-cam.y)*r.h*cam.zoom;for(const e of p.events){const age=t-e.time;if(e.type==='click'&&age>=0&&age<.65){const xx=r.x+r.w/2+(e.x-cam.x)*r.w*cam.zoom,yy=r.y+r.h/2+(e.y-cam.y)*r.h*cam.zoom;ctx.beginPath();ctx.arc(xx,yy,(10+age*38)*W/1280,0,Math.PI*2);ctx.strokeStyle=`rgba(123,94,235,${.8*(1-age/.65)})`;ctx.lineWidth=3*W/1280;ctx.stroke();}}const k=s.cursorSize*W/1280;ctx.save();ctx.translate(x,y);ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(k*.17,k);ctx.lineTo(k*.4,k*.68);ctx.lineTo(k*.71,k*.97);ctx.lineTo(k*.87,k*.82);ctx.lineTo(k*.57,k*.54);ctx.lineTo(k*.94,k*.39);ctx.closePath();ctx.fillStyle='#181924';ctx.strokeStyle='white';ctx.lineWidth=2*W/1280;ctx.shadowColor='#0005';ctx.shadowBlur=5;ctx.fill();ctx.stroke();ctx.restore();}}
 ctx.restore();
 const caption=p.captions.find(c=>t>=c.start&&t<c.end);const bottom=Math.min(H-16*W/1280,r.y+r.h+33*W/1280);if(caption&&caption.text){ctx.textAlign='center';text(ctx,caption.text,W/2,bottom,15*W/1280,s.theme==='slate'?'#e9e9f2':'#262039',550);ctx.textAlign='start';}
 return r;
}
const api={render,sample,sourceRect,themes};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.ReelRenderer=api;
})(typeof globalThis!=='undefined'?globalThis:this);

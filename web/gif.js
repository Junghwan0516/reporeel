/* GIF89a writer, fixed 3-3-2 palette. Uses GIF LZW compression and a bounded 4096-code dictionary. */
(function(root){
'use strict';
class GifWriter{
 constructor(w,h,fps=10){if(!Number.isInteger(w)||!Number.isInteger(h)||w<1||h<1||w>4096||h>4096)throw Error('Invalid GIF dimensions');this.w=w;this.h=h;this.delay=Math.max(1,Math.round(100/fps));this.parts=[];this.add(new TextEncoder().encode('GIF89a'));this.add([w&255,w>>8,h&255,h>>8,0xf7,0,0]);const pal=[];for(let i=0;i<256;i++)pal.push(Math.round(((i>>5)&7)*255/7),Math.round(((i>>2)&7)*255/7),Math.round((i&3)*255/3));this.add(pal);this.add([0x21,0xff,11,...new TextEncoder().encode('NETSCAPE2.0'),3,1,0,0,0]);}
 add(a){this.parts.push(Uint8Array.from(a));}
 frame(rgba){if(rgba.length!==this.w*this.h*4)throw Error('Wrong GIF frame size');this.add([0x21,0xf9,4,4,this.delay&255,this.delay>>8,0,0,0x2c,0,0,0,0,this.w&255,this.w>>8,this.h&255,this.h>>8,0,8]);const bytes=[];let pending=0,acc=0,width=9,next=258;let dict=new Map();const emit=n=>{acc|=n<<pending;pending+=width;while(pending>=8){bytes.push(acc&255);acc>>>=8;pending-=8;}};const pixel=i=>(rgba[i]&224)|((rgba[i+1]&224)>>3)|(rgba[i+2]>>6);emit(256);let prefix=pixel(0);for(let i=4;i<rgba.length;i+=4){const value=pixel(i),key=prefix*256+value,found=dict.get(key);if(found!==undefined){prefix=found;continue;}emit(prefix);if(next<4096){dict.set(key,next++);if(next>(1<<width)&&width<12)width++;}else{emit(256);dict=new Map();next=258;width=9;}prefix=value;}emit(prefix);emit(257);if(pending)bytes.push(acc&255);for(let i=0;i<bytes.length;i+=255){const slice=bytes.slice(i,i+255);this.add([slice.length,...slice]);}this.add([0]);}
 finish(){this.add([0x3b]);const n=this.parts.reduce((s,p)=>s+p.length,0),out=new Uint8Array(n);let offset=0;for(const p of this.parts){out.set(p,offset);offset+=p.length;}return out;}
}
if(typeof module!=='undefined'&&module.exports)module.exports={GifWriter};else root.ReelGIF={GifWriter};
})(typeof globalThis!=='undefined'?globalThis:this);

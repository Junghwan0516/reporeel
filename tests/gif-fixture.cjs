const {GifWriter}=require('../web/gif.js');const fs=require('node:fs');
const w=157,h=89,g=new GifWriter(w,h,10);let seed=91;
for(let t=0;t<3;t++){const pixels=new Uint8ClampedArray(w*h*4);for(let i=0;i<w*h;i++){seed=(seed*1664525+1013904223)>>>0;pixels[i*4]=(seed>>>16)&255;pixels[i*4+1]=(seed>>>8)&255;pixels[i*4+2]=seed&255;pixels[i*4+3]=255;}g.frame(pixels);fs.writeFileSync(process.argv[2]+'.'+t+'.rgba',pixels);}
fs.writeFileSync(process.argv[2],g.finish());

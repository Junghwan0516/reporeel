/* Optional maintainer asset generator: npm install --no-save @napi-rs/canvas */
const fs=require('node:fs');const path=require('node:path');const {createCanvas}=require('@napi-rs/canvas');const C=require('../web/core.js'),R=require('../web/renderer.js'),{GifWriter}=require('../web/gif.js');
const root=path.resolve(__dirname,'..'),p=C.demoProject(),sample=createCanvas(1200,750),out=createCanvas(640,360),gif=new GifWriter(640,360,10);
for(let i=0;i<120;i++){R.render(out.getContext('2d'),p,i/10,null,sample);gif.frame(out.getContext('2d').getImageData(0,0,640,360).data);}
fs.mkdirSync(path.join(root,'docs'),{recursive:true});fs.writeFileSync(path.join(root,'docs','demo.gif'),gif.finish());
const cover=createCanvas(1280,720);R.render(cover.getContext('2d'),p,0,null,sample);fs.writeFileSync(path.join(root,'docs','cover.png'),cover.toBuffer('image/png'));
console.log('Built real renderer demo:',fs.statSync(path.join(root,'docs','demo.gif')).size,'bytes');

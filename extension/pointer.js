/* No text, keystrokes, DOM content, or URLs are collected. */
(()=>{
 if(window.__reporeelPointerInstalled)return;
 window.__reporeelPointerInstalled=true;
 let active=false,last=0;
 chrome.runtime.onMessage.addListener(m=>{if(m.type==='reporeel-start')active=true;if(m.type==='reporeel-stop')active=false;});
 const send=(event,type)=>{if(!active)return;const now=Date.now();if(type==='move'&&now-last<50)return;last=now;chrome.runtime.sendMessage({target:'worker',type:'pointer',event:{at:now,x:Math.max(0,Math.min(1,event.clientX/innerWidth)),y:Math.max(0,Math.min(1,event.clientY/innerHeight)),type}}).catch(()=>{active=false;});};
 addEventListener('pointermove',e=>send(e,'move'),{passive:true});
 addEventListener('pointerdown',e=>send(e,'click'),{passive:true});
})();

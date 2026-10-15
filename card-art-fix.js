(()=>{'use strict';
const fix=p=>{const m=p&&p.match(/^(?:\.\/)?assets\/card-art\/([^?#]+)(?:[?#].*)?$/);return m?'assets/card-art-v2/'+Array.from(new TextEncoder().encode(decodeURIComponent(m[1])),b=>b.toString(16).padStart(2,'0')).join('')+'.jpg':p;};
if(typeof cardArtwork!=='undefined')for(const key of Object.keys(cardArtwork))cardArtwork[key]=fix(cardArtwork[key]);
const patch=root=>{for(const el of [root,...(root.querySelectorAll?root.querySelectorAll('img,a'):[])]){if(!el.getAttribute)continue;for(const attr of ['src','data-src','href']){const old=el.getAttribute(attr),next=fix(old);if(next!==old)el.setAttribute(attr,next);}}};
patch(document.documentElement);new MutationObserver(records=>{for(const r of records)for(const n of r.addedNodes)if(n.nodeType===1)patch(n);}).observe(document.documentElement,{childList:true,subtree:true});
})();
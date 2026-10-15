/* ARCANA pixel theatre. Visuals observe the game; rules and saves stay in game.js. */
(() => {
  'use strict';
  const colors = {火:'#ff975b',氷:'#9eeaff',雷:'#ffe879',風:'#8df0b8',土:'#d8ba83',光:'#fff2bf',闇:'#c59aff'};
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let scene=null, action=null, frame=0, animation=0;
  const esc = value => String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  function mount(mode, foes=s?.enemies||[]) {
    document.querySelector('.pixel-theatre')?.remove();
    const anchor=mode==='battle'?document.querySelector('.arena'):document.querySelector('.explore-scene');
    if(!anchor)return;
    const box=document.createElement('section');box.className='pixel-theatre';
    box.innerHTML=`<div class="pixel-heading"><span>${mode==='battle'?'BATTLE / CARD COMMAND':'EXPLORATION / THE FORGOTTEN SANCTUM'}</span><span>${esc(weapon)} × ${esc(magic)}</span></div><canvas width="480" height="152" role="img" aria-label="${mode==='battle'?'主人公と敵のドット絵。敵は下のカードで選択できます。':'遺跡を歩く冒険者のドット絵'}"></canvas><div class="pixel-caption" aria-live="polite">${mode==='battle'?'カードを使って技を繰り出す':'遺跡の奥へ。進む道を選んでください。'}</div>`;
    anchor.before(box);if(mode==='battle')anchor.classList.add('pixel-targets');
    scene={mode,box,canvas:box.querySelector('canvas'),foes:foes.map(e=>({...e})),weapon,magic};
    draw(performance.now());if(!animation)animation=requestAnimationFrame(tick);
  }
  function tick(time){animation=0;if(!scene?.box.isConnected){scene=null;return;}if(!document.hidden)draw(time);animation=requestAnimationFrame(tick);}
  function rect(ctx,x,y,w,h,color){ctx.fillStyle=color;ctx.fillRect(Math.round(x),Math.round(y),w,h);}
  function hero(ctx,x,y,time,motion){
    const moving=motion==='walk',step=reduced.matches?0:Math.floor(time/130)%2;
    const bob=reduced.matches?0:moving?step:Math.floor(time/440)%2;
    ctx.save();ctx.translate(Math.round(x),Math.round(y-bob));
    rect(ctx,-10,-2,25,3,'#081016');
    // Cloak, boots, armour, face and hood are drawn on a fixed pixel grid.
    rect(ctx,-8,-29,9,23,'#243c56');rect(ctx,-11,-18,7,15,'#345771');
    rect(ctx,-4,-11,5,10,'#111d2c');rect(ctx,4,-11,5,10,'#111d2c');
    rect(ctx,-6-(moving?step*2:0),-3,8,3,'#a3947e');rect(ctx,4+(moving?step*2:0),-3,8,3,'#a3947e');
    rect(ctx,-5,-27,14,17,'#687c88');rect(ctx,-2,-25,8,11,'#b6c3c4');rect(ctx,-5,-13,15,3,'#b5995e');
    rect(ctx,-5,-42,15,15,'#23374d');rect(ctx,-2,-37,13,10,'#deb590');rect(ctx,-5,-42,17,6,'#405f77');rect(ctx,8,-35,2,2,'#182436');
    rect(ctx,8,-25,5,12,'#899ba4');rect(ctx,9,-16,5,5,'#deb590');
    if(motion==='cast'){rect(ctx,12,-30,6,5,'#deb590');rect(ctx,17,-34,4,4,colors[scene.magic]);}
    else weaponArt(ctx,scene.weapon,motion==='attack');
    ctx.restore();
  }
  function weaponArt(ctx,type,attack){
    ctx.save();ctx.translate(13,-17);if(attack)ctx.rotate(.95);
    const metal='#d9e9e8',gold='#d5ae63';
    if(type==='弓'){rect(ctx,1,-20,3,32,gold);rect(ctx,4,-17,3,5,gold);rect(ctx,4,4,3,5,gold);rect(ctx,7,-13,1,18,'#d9e9e8');rect(ctx,-2,-3,17,2,metal);}
    else if(type==='戦槌'){rect(ctx,0,-17,3,29,gold);rect(ctx,-7,-23,17,10,'#8297a8');rect(ctx,-5,-23,3,9,metal);}
    else if(type==='槍'){rect(ctx,0,-27,3,42,gold);rect(ctx,-2,-33,7,9,metal);rect(ctx,0,-38,3,8,metal);}
    else {const length=type==='大剣'?31:type==='短剣'?12:23;rect(ctx,0,-length,4,length,metal);rect(ctx,0,-length,2,length,'#8ca8b6');rect(ctx,-4,0,12,3,gold);rect(ctx,0,3,4,7,'#725d4d');}
    ctx.restore();
  }
  function monster(ctx,x,y,index,time,dead,hit){
    const boss=!!s?.encounterSpec?.boss,kind=((scene.foes[index]?.portrait||index)+index)%3;
    ctx.save();ctx.translate(Math.round(x),Math.round(y));
    if(dead){ctx.globalAlpha=Math.max(0,1-hit);ctx.translate(0,hit*14);}
    const bob=reduced.matches?0:Math.floor(time/350+index)%2;
    ctx.translate(0,-bob);if(boss)ctx.scale(1.35,1.35);
    const base=kind===0?'#7c9b91':kind===1?'#9b83bb':'#a29a82';
    rect(ctx,-18,-2,37,3,'#081016');
    if(kind===0){ // Slime: stepped silhouette, shining eyes.
      rect(ctx,-17,-18,34,15,base);rect(ctx,-12,-26,24,11,base);rect(ctx,-6,-30,12,6,base);rect(ctx,-13,-10,26,7,'#4a686a');rect(ctx,-8,-20,4,5,'#edeeac');rect(ctx,5,-20,4,5,'#edeeac');rect(ctx,-7,-19,2,3,'#172737');
    }else if(kind===1){ // Winged ruin spirit.
      rect(ctx,-9,-35,18,28,base);rect(ctx,-14,-29,28,13,base);rect(ctx,-29,-34,12,5,'#665b8e');rect(ctx,-23,-30,12,10,'#665b8e');rect(ctx,17,-34,12,5,'#665b8e');rect(ctx,11,-30,12,10,'#665b8e');rect(ctx,-6,-28,4,4,'#ffe1a2');rect(ctx,3,-28,4,4,'#ffe1a2');rect(ctx,-5,-8,4,7,base);rect(ctx,3,-8,4,7,base);
    }else{ // Stone sentinel.
      rect(ctx,-14,-29,28,20,base);rect(ctx,-10,-43,20,15,base);rect(ctx,-20,-28,6,22,'#676c70');rect(ctx,14,-28,7,22,'#676c70');rect(ctx,-12,-9,8,8,'#676c70');rect(ctx,4,-9,8,8,'#676c70');rect(ctx,-7,-37,14,3,'#f2c57d');rect(ctx,-4,-24,8,9,'#d0b677');
    }
    if(hit>0&&!dead){ctx.globalAlpha=.45*(1-hit);rect(ctx,-22,-45,44,44,'#fff1c8');}
    ctx.restore();
  }
  function draw(time){
    if(!scene)return;const ctx=scene.canvas.getContext('2d');if(!ctx)return;
    ctx.imageSmoothingEnabled=false;frame++;const t=reduced.matches?0:time;
    ctx.fillStyle='#101d2a';ctx.fillRect(0,0,480,152);
    // Pixel-built ruins: distant arches, lanterns, masonry and a moving floor.
    for(let i=0;i<7;i++){let x=i*88-35;rect(ctx,x,25,11,91,'#253846');rect(ctx,x+10,20,50,7,'#253846');rect(ctx,x+57,25,11,91,'#253846');rect(ctx,x+15,30,37,75,'#14222f');rect(ctx,x+22,48,5,13,'#b28c55');rect(ctx,x+23,50,3,7,Math.floor(t/180)%2?'#ffd89a':'#e8ae67');}
    rect(ctx,0,117,480,35,'#28343d');rect(ctx,0,117,480,2,'#69716c');
    const offset=scene.mode==='explore'?Math.floor(t/55)%48:0;
    for(let row=0;row<3;row++)for(let col=-1;col<12;col++){rect(ctx,col*48+row%2*24-offset,121+row*11,44,1,'#46525a');rect(ctx,col*48+row%2*24-offset,121+row*11,1,9,'#1b2932');}
    const a=action,elapsed=a?time-a.time:10000,p=Math.min(1,elapsed/650),active=p<1;
    let motion=scene.mode==='explore'?'walk':'idle',hx=92;
    if(active&&a.kind==='attack'){motion='attack';hx+=Math.sin(p*Math.PI)*70;}
    if(active&&['magic','heal','guard'].includes(a.kind))motion='cast';
    if(active&&a.kind==='hurt')hx+=Math.sin(p*40)*4;
    hero(ctx,hx,120,t,motion);
    const foes=scene.mode==='battle'?scene.foes:[];
    foes.forEach((e,i)=>{let x=foeX(i,foes.length);if(active&&a.kind==='hurt'&&!reduced.matches)x-=Math.sin(p*Math.PI)*35;const affected=active&&a?.targets?.includes(i);monster(ctx,x,120,i,t,e.hp<=0,affected?p:e.hp<=0?1:0);if(s?.target===i&&e.hp>0){rect(ctx,x-3,57,7,3,'#ead398');rect(ctx,x-1,60,3,3,'#ead398');}});
    if(active&&!reduced.matches){
      const color=colors[a.element]||'#f5dfac';
      if(a.kind==='magic'){for(const i of a.targets){const x=92+(foeX(i,foes.length)-92)*p;for(let j=0;j<8;j++)rect(ctx,x-j*5,87+Math.sin(p*12+j)*4,4,4,color);}}
      if(a.kind==='attack'&&p>.25)for(const i of a.targets){const x=foeX(i,foes.length);for(let j=0;j<6;j++)rect(ctx,x-16+j*5,77+j*5,3,9,'#fff0ce');}
      if(a.kind==='heal'||a.kind==='guard'){for(let j=0;j<9;j++)rect(ctx,70+j*5,108-(p*35+j*7)%45,3,4,a.kind==='heal'?'#9ef0bf':color);}
      for(const hit of a.hits||[]){ctx.fillStyle=hit.player?'#ffb6a0':'#fff1c4';ctx.font='bold 10px monospace';ctx.textAlign='center';ctx.fillText(hit.text,hit.player?92:foeX(hit.index,foes.length),67-p*16);}
    }
  }
  function foeX(i,count){return count<=1?350:265+i*Math.min(78,170/Math.max(1,count-1));}
  function perform(kind,label,targets=[],hits=[],element=magic){action={kind,targets,hits,element,time:performance.now()};if(scene){scene.foes=(s?.enemies||[]).map(e=>({...e}));scene.box.querySelector('.pixel-caption').textContent=label;draw(action.time);}}
  const originalRender=render;render=function(...args){const result=originalRender(...args);mount('battle');return result;};
  const originalExplore=exploration;exploration=function(...args){const result=originalExplore(...args);mount('explore');return result;};
  const originalPlay=play;play=function(i){
    const card=s?.phase==='battle'&&!s.pending?all[s.hand[i]]:null;
    if(!card||!can(card))return originalPlay(i);
    const run=s,before=s.enemies.map(e=>e.hp),hp=s.hp,played=s.played;
    const result=originalPlay(i);if(s!==run||s.played===played)return result;
    const targets=before.map((h,i)=>h>s.enemies[i].hp?i:-1).filter(i=>i>=0);
    const hits=targets.map(index=>({index,text:'−'+(before[index]-s.enemies[index].hp)}));
    if(s.hp>hp)hits.push({player:true,text:'＋'+(s.hp-hp)});
    if(s.phase==='reward'){const anchor=document.querySelector('#app > *');if(anchor){const holder=document.createElement('div');holder.className='arena';anchor.before(holder);mount('battle');holder.remove();}}
    perform(card.e.hit?(magics.includes(card.g)?'magic':'attack'):card.e.heal?'heal':'guard',card.n+(s.phase==='reward'?' · 敵を撃破！':''),targets,hits,card.g);
    return result;
  };
  const originalEnd=endTurn;endTurn=function(...args){const run=s,hp=s?.hp;const result=originalEnd(...args);if(s===run&&s?.phase==='battle')perform(s.hp<hp?'hurt':'guard',s.hp<hp?'敵の攻撃を受けた':'敵の攻撃を防いだ',[],s.hp<hp?[{player:true,text:'−'+(hp-s.hp)}]:[]);return result;};
  // Initial page may already have a resumed adventure.
  if(s?.phase==='battle')mount('battle');else if(s?.phase==='explore')mount('explore');
})();

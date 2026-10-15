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
    box.innerHTML=`<div class="pixel-heading"><span>${mode==='battle'?'BATTLE / CARD COMMAND':'EXPLORATION / THE FORGOTTEN SANCTUM'}</span><span>${esc(weapon)} × ${esc(magic)}</span></div><canvas width="960" height="304" role="img" aria-label="${mode==='battle'?'主人公と敵のドット絵。敵は下のカードで選択できます。':'遺跡を歩く冒険者のドット絵'}"></canvas><div class="pixel-caption" aria-live="polite">${mode==='battle'?'カードを使って技を繰り出す':'遺跡の奥へ。進む道を選んでください。'}</div>`;
    anchor.before(box);if(mode==='battle')anchor.classList.add('pixel-targets');
    scene={mode,box,canvas:box.querySelector('canvas'),foes:foes.map(e=>({...e})),weapon,magic};
    draw(performance.now());if(!animation)animation=requestAnimationFrame(tick);
  }
  function tick(time){animation=0;if(!scene?.box.isConnected){scene=null;return;}if(!document.hidden)draw(time);animation=requestAnimationFrame(tick);}
  function rect(ctx,x,y,w,h,color){ctx.fillStyle=color;ctx.fillRect(Math.round(x),Math.round(y),w,h);}
  // The heroine uses a 2x pixel grid: individual hair strands, eyes and embroidery.
  function hero(ctx,x,y,time,motion){
    const moving=motion==='walk',phase=reduced.matches?0:Math.floor(time/120)%4;
    const stride=moving?[0,3,0,-3][phase]:0;
    const bob=reduced.matches?0:moving?phase%2:Math.floor(time/460)%2;
    const sway=reduced.matches?0:Math.floor(time/220)%3-1;
    ctx.save();ctx.translate(Math.round(x),Math.round(y)-bob*.5);ctx.scale(.5,.5);
    const ink='#222039',silver='#c2c7df',white='#f7f5ff',shade='#939dbd',skin='#f7d9cd';
    const r=(x,y,w,h,c)=>rect(ctx,x,y,w,h,c);
    r(-24,-3,51,5,'#08101b');
    // Long silver-white hair flows behind her shoulders and waist.
    r(-20,-102,29,6,ink);r(-25,-95,44,24,ink);r(-26,-77,39,28,ink);
    r(-29+sway,-65,31,25,ink);r(-32+sway,-46,25,13,ink);
    r(-20,-100,27,7,white);r(-24,-93,41,20,silver);r(-24,-76,17,26,silver);
    r(-27+sway,-58,14,17,silver);r(-30+sway,-43,13,7,silver);
    r(-21,-89,6,27,white);r(-22,-65,5,21,white);r(-25+sway,-45,4,9,white);
    r(-14,-92,5,37,'#e4e5f4');r(-17,-57,4,18,shade);r(-12,-77,5,26,shade);
    // Stockings and buckled boots move in alternating walking poses.
    for(const [lx,offset] of [[-11,stride],[7,-stride]]){
      r(lx,-29,9,24,ink);r(lx+1,-27,6,18,'#39344e');r(lx+1,-27,6,3,'#d3c4e2');
      r(lx+offset-1,-10,11,8,ink);r(lx+offset,-9,9,5,'#4d4561');r(lx+offset+4,-8,3,2,'#dec58b');r(lx+offset-1,-3,13,3,'#82748d');
    }
    // Midnight-violet dress, ivory jacket, silver pauldrons and gold trim.
    r(-14,-65,30,27,ink);r(-17,-43,35,13,ink);r(-20,-33,41,6,ink);
    r(-11,-61,25,22,'#514467');r(-12,-44,28,12,'#66527e');r(-16,-34,33,6,'#806796');
    r(-13,-62,9,20,'#ece8f4');r(8,-62,7,21,'#ccc9dd');r(-9,-59,4,14,white);
    r(-17,-63,9,8,shade);r(-17,-63,9,3,white);r(12,-62,8,9,silver);r(13,-62,6,3,white);
    r(-11,-42,27,3,'#e2c98f');r(0,-44,6,6,'#f3dda4');r(2,-43,2,3,'#b09cce');
    for(let i=-12;i<17;i+=7){r(i,-35,2,6,'#d4beda');r(i,-28,4,1,'#e4c989');}
    r(-4,-63,11,4,white);r(-1,-59,5,6,'#b9a2dd');r(0,-59,3,2,'#e3d5ff');
    // Small anime face, shaded chin, two violet eyes and a white fringe.
    r(-8,-88,29,23,ink);r(-7,-86,27,18,skin);r(-4,-68,20,4,'#e9bfb9');r(0,-65,11,3,skin);
    r(-6,-88,29,6,white);r(-9,-83,9,13,silver);r(-5,-84,6,8,white);
    r(1,-85,5,7,white);r(9,-85,5,5,'#e3e4f1');r(17,-85,5,11,white);
    r(0,-77,5,5,ink);r(1,-77,3,4,'#a496dc');r(2,-77,2,2,white);
    r(12,-77,5,5,ink);r(13,-77,3,4,'#a496dc');r(14,-77,2,2,white);
    r(0,-70,4,2,'#edb6c2');r(15,-70,4,2,'#edb6c2');r(8,-68,3,1,'#af7f94');
    // Dark ribbon and little star ornament identify her silhouette.
    r(-20,-85,8,5,'#55436f');r(-22,-88,5,6,'#8870a5');r(-17,-84,4,12,'#57446f');
    r(-17,-87,3,7,'#f4d99a');r(-19,-85,7,3,'#f4d99a');r(-17,-85,3,3,white);
    const casting=motion==='cast';
    r(16,casting?-65:-53,7,casting?8:14,ink);r(17,casting?-64:-52,5,casting?6:12,'#ece5f2');
    r(casting?22:18,casting?-65:-41,6,7,skin);r(casting?23:19,casting?-64:-40,4,2,white);
    if(casting){r(29,-69,5,5,colors[scene.magic]);r(31,-73,1,13,white);r(27,-67,9,1,white);}
    else {ctx.save();ctx.translate(0,-4);ctx.scale(2,2);weaponArt(ctx,scene.weapon,motion==='attack');ctx.restore();}
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
    ctx.setTransform(2,0,0,2,0,0);ctx.imageSmoothingEnabled=false;frame++;const t=reduced.matches?0:time;
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
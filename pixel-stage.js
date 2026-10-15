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
    box.innerHTML=`<div class="pixel-heading"><span>${mode==='battle'?'BATTLE / CARD COMMAND':'EXPLORATION / THE FORGOTTEN SANCTUM'}</span><span>${esc(weapon)} × ${esc(magic)}</span></div><canvas width="1920" height="608" role="img" aria-label="${mode==='battle'?'主人公と敵のドット絵。敵は下のカードで選択できます。':'遺跡を歩く冒険者のドット絵'}"></canvas><div class="pixel-caption" aria-live="polite">${mode==='battle'?'カードを使って技を繰り出す':'遺跡の奥へ。進む道を選んでください。'}</div>`;
    anchor.before(box);if(mode==='battle')anchor.classList.add('pixel-targets');
    scene={mode,box,canvas:box.querySelector('canvas'),foes:foes.map(e=>({...e})),weapon,magic};
    draw(performance.now());if(!animation)animation=requestAnimationFrame(tick);
  }
  function tick(time){animation=0;if(!scene?.box.isConnected){scene=null;return;}if(!document.hidden)draw(time);animation=requestAnimationFrame(tick);}
  function rect(ctx,x,y,w,h,color){ctx.fillStyle=color;ctx.fillRect(Math.round(x),Math.round(y),w,h);}
  // Rebuilt articulated pixel sprite: six walk poses, blinking, cloth and hair.
  function hero(ctx,x,y,time,motion){
    const t=reduced.matches?0:time,walk=motion==='walk';
    const f=Math.floor(t/105)%6,stride=walk?[0,5,8,0,-5,-8][f]:0;
    const ap=action?Math.min(1,(time-action.time)/900):1;
    const swing=motion==='attack'?Math.sin(ap*Math.PI):0;
    const breath=walk?[0,1,2,0,1,2][f]:Math.floor(t/450)%2;
    const hair=walk?[0,1,3,2,0,-1][f]:Math.floor(t/300)%3-1;
    ctx.save();ctx.translate(Math.round(x),Math.round(y)-breath*.4);ctx.scale(.4,.4);
    if(motion==='hurt')ctx.rotate(-.07);
    const r=(x,y,w,h,c)=>rect(ctx,x,y,w,h,c);
    const ink='#28263e',dark='#45425e',violet='#74628f',silver='#c5d0e9',white='#fbfaff',skin='#f6d8ce',gold='#e4c58a';
    r(-26,-3,56,5,'#0b1422');
    // Swept long hair silhouette: layered edges rather than a rectangular hood.
    r(-15,-136,29,3,ink);r(-23,-132,45,7,ink);r(-27,-125,52,19,ink);
    r(-29,-108,23,27,ink);r(-33+hair,-84,24,28,ink);r(-38+hair,-58,24,12,ink);
    r(-17,-133,29,5,white);r(-23,-127,44,13,silver);r(-24,-115,15,35,silver);
    r(-29+hair,-81,15,25,silver);r(-33+hair,-57,14,8,silver);
    for(let i=0;i<6;i++){r(-22+i*5,-125+i%2*2,2,13,'#ffffff');r(-23+i*3,-108,1,26-i*3,'#edf0ff');}
    r(-21,-94,3,22,white);r(-27+hair,-74,2,17,white);r(-15,-108,3,31,'#a2b0ce');
    // Alternating legs, lifted knees and heel/toe poses.
    for(const [lx,step] of [[-11,stride],[9,-stride]]){
      ctx.save();ctx.translate(lx, -43);ctx.rotate(step*.018);
      r(-5,0,12,37,ink);r(-3,1,8,29,dark);r(-3,1,8,5,'#d7c8e6');r(-2,8,2,19,'#69607b');
      const lift=walk&&step>0?Math.floor(step/3):0;
      r(-5,-lift+31,14,9,ink);r(-3,-lift+32,12,5,'#65566f');r(1,-lift+32,4,2,gold);r(-5,-lift+39,18,2,'#a497ac');ctx.restore();
    }
    // Split coat tails sway independently of the torso.
    r(-19-hair,-61,16,20,ink);r(9+hair,-61,17,21,ink);
    r(-17-hair,-59,12,16,'#76618f');r(11+hair,-59,12,17,'#5d4f79');
    r(-17-hair,-45,12,2,gold);r(11+hair,-44,12,2,gold);
    // Fitted ivory jacket, violet skirt, gold seams, gem clasp.
    r(-15,-94,32,33,ink);r(-18,-65,38,19,ink);
    r(-12,-91,26,28,'#e9e7f4');r(-7,-88,17,24,'#63527e');
    r(-11,-88,4,21,white);r(11,-88,3,23,'#b4b5d0');
    r(-15,-64,32,15,violet);r(-18,-51,38,4,'#a28ab3');
    for(let i=-13;i<17;i+=6){r(i,-61,2,10,'#bda6cd');r(i,-49,3,1,gold);r(i+1,-55,1,3,'#f1d9a0');}
    r(-13,-67,29,3,gold);r(-2,-69,7,7,'#faf0c6');r(0,-68,3,4,'#9885c7');
    r(-18,-92,11,9,silver);r(-18,-92,10,2,white);r(12,-92,10,9,silver);r(13,-91,7,2,white);
    r(-3,-91,9,4,white);r(0,-88,4,7,'#b3a0d9');r(1,-88,2,2,'#f9efff');
    // Rounded pixel face with two shaded violet irises and eyelash animation.
    r(-8,-119,32,20,ink);r(-5,-116,28,18,skin);r(-1,-99,20,4,'#edc4be');r(3,-95,11,2,skin);
    r(-8,-121,31,5,white);r(-9,-116,7,14,silver);r(-5,-118,6,8,white);
    r(2,-120,5,8,white);r(10,-119,5,5,'#e2e8fa');r(19,-117,5,14,white);
    const blink=t>0&&t%3700>3550;
    for(const eye of [0,13]){
      r(eye,-109,7,1,ink);
      if(!blink){r(eye+1,-108,5,6,'#76569e');r(eye+2,-105,3,3,'#c8aff3');r(eye+2,-108,2,3,'#3f2e62');r(eye+1,-108,2,2,white);}
    }
    r(-1,-101,5,1,'#e8aebe');r(17,-101,4,1,'#e8aebe');r(9,-98,4,1,'#ae7f91');
    // Star ribbon and fine silver hair strands.
    r(-21,-117,8,6,'#64517e');r(-23,-120,5,5,'#947cae');r(-19,-111,3,15,'#675482');
    r(-18,-120,2,10,gold);r(-22,-116,10,2,gold);r(-18,-116,2,2,white);
    // Arms are articulated, not a translation of the entire character.
    r(-18,-81,7,17,'#d2cddd');r(-17,-65,6,5,skin);
    ctx.save();ctx.translate(18,-83);
    if(motion==='cast')ctx.rotate(-1.05);else if(motion==='attack')ctx.rotate(-.7+swing*1.5);
    r(-2,0,8,20,ink);r(-1,1,6,17,'#ece7f6');r(0,3,2,12,white);r(-1,18,6,7,skin);r(0,18,4,2,'#fff0e8');
    ctx.restore();
    if(motion==='cast'){
      const pulse=Math.floor(t/110)%3;r(31,-105,3,3,colors[scene.magic]);r(28-pulse,-102,9+pulse*2,1,white);r(32,-106-pulse,1,10+pulse*2,white);
    }else{ctx.save();ctx.translate(6+swing*9,-13-swing*9);ctx.rotate(motion==='attack'?-.7+swing*1.4:0);ctx.scale(2.5,2.5);weaponArt(ctx,scene.weapon,false);ctx.restore();}
    ctx.restore();
  }
  function weaponArt(ctx,type,attack){
    ctx.save();ctx.translate(13,-17);if(attack)ctx.rotate(.95);ctx.scale(.5,.5);
    const r=(x,y,w,h,c)=>rect(ctx,x,y,w,h,c),edge='#29344e',metal='#d7e7f2',light='#ffffff',steel='#8fa6c4',gold='#e5c780';
    if(type==='弓'){
      for(const [x,y,w,h] of [[0,-40,5,9],[5,-32,5,10],[9,-23,4,24],[5,0,5,10],[0,9,5,9]]){r(x-1,y-1,w+2,h+2,edge);r(x,y,w,h,gold);r(x,y,2,h,'#fff0ba');}
      r(1,-31,1,41,'#f4e7dc');r(-5,-9,33,2,steel);r(25,-12,5,7,metal);r(-5,-12,5,3,'#a8d5f3');
    }else if(type==='戦槌'){
      r(0,-37,6,59,edge);r(1,-36,4,55,'#9b755b');for(let y=-20;y<20;y+=6)r(1,y,4,2,gold);
      r(-16,-48,38,24,edge);r(-14,-46,34,20,steel);r(-12,-45,7,18,metal);r(-12,-45,7,3,light);r(-4,-43,17,13,'#576e8e');r(1,-39,7,6,gold);r(3,-38,3,3,'#d6bbff');
    }else if(type==='槍'){
      r(0,-52,5,84,edge);r(1,-50,3,80,'#aa8d6a');r(0,-43,5,11,gold);r(-5,-58,15,9,steel);r(-3,-65,11,12,metal);r(0,-75,5,17,metal);r(1,-73,2,22,light);r(-7,-44,15,3,'#8e6baf');r(-6,-41,4,12,'#bca6d6');
    }else{
      const length=type==='大剣'?64:type==='短剣'?29:49,width=type==='大剣'?13:7;
      r(-2,-length,width+4,length+3,edge);r(0,-length+4,width,length-4,steel);r(1,-length+4,Math.max(2,width-3),length-5,metal);r(1,-length+5,2,length-7,light);r(2,-length,3,5,metal);
      r(-9,-1,width+18,6,edge);r(-8,0,width+16,3,gold);r(-7,0,6,1,'#fff2c2');r(0,5,width,15,'#634c6e');for(let y=7;y<19;y+=4)r(0,y,width,1,'#bba0a8');r(-1,20,width+2,4,gold);r(1,1,4,4,'#bba0f0');r(2,1,2,2,light);
    }
    ctx.restore();
  }
  function magicArt(ctx,x,y,element,p){
    ctx.save();ctx.translate(x,y);ctx.scale(.5,.5);
    const color=colors[element]||'#d5bdff',r=(x,y,w,h,c)=>rect(ctx,x,y,w,h,c);
    for(let i=0;i<16;i++){const q=(i*2.399+p*5),radius=7+i%5*3;r(Math.cos(q)*radius,Math.sin(q)*radius,1+i%2,1+i%2,color);}
    if(element==='火'){for(let i=9;i>=0;i--){r(-i*4,-6+Math.sin(i+p*12)*5,6+i,9-i*.5,i<3?'#fff5b0':i<6?'#ffc567':'#e77855');}r(-3,-5,9,10,'#fff8da');}
    else if(element==='氷'){r(-17,-2,34,4,color);r(-2,-17,4,34,'#e9fcff');for(let i=-12;i<13;i+=3){r(i,i,3,3,'#c2f5ff');r(i,-i,3,3,'#c2f5ff');}r(-4,-4,8,8,'#ffffff');}
    else if(element==='雷'){for(let i=0;i<10;i++){r(-30+i*6,Math.sin(i*2+p*9)*10,9,2,'#f8d377');r(-30+i*6,Math.sin(i*2+p*9)*10,7,1,'#fffbea');}}
    else if(element==='風'){for(let j=0;j<3;j++)for(let i=0;i<20;i++){const q=i*.27+p*8+j*2;r(Math.cos(q)*(18-j*4),Math.sin(q)*(9+j*2),3,1,j===0?'#e4fff0':color);}}
    else if(element==='土'){for(const [dx,dy] of [[-12,3],[1,-8],[13,6]]){r(dx-5,dy-7,10,14,'#a78663');r(dx-3,dy-9,7,3,color);r(dx-4,dy-5,3,8,'#ead1a0');}}
    else if(element==='光'){for(let i=0;i<4;i++){r(-1,-24+i*6,2,48-i*12,'#fff6ca');r(-24+i*6,-1,48-i*12,2,'#fff6ca');}r(-5,-5,10,10,'#ffffff');}
    else {for(let i=0;i<28;i++){const q=i*.23+p*6;r(Math.cos(q)*15,Math.sin(q)*15,3,3,color);}r(-8,-8,16,16,'#302043');r(-3,-3,6,6,'#f1ddff');}
    ctx.restore();
  }
  function monster(ctx,x,y,index,time,dead,hit){
    const t=reduced.matches?0:time,phase=Math.floor(t/135+index)%6;
    const kind=((scene.foes[index]?.portrait||index)+index)%3,boss=!!s?.encounterSpec?.boss;
    const death=dead?hit:0;
    ctx.save();ctx.translate(Math.round(x),Math.round(y));
    if(dead){ctx.globalAlpha=Math.max(0,1-death);ctx.translate(0,death*12);}
    if(boss)ctx.scale(1.25,1.25);
    ctx.scale(.5,.5);
    const r=(x,y,w,h,c)=>rect(ctx,x,y,w,h,c),ink='#20253e',gold='#f1d797';
    r(-35,-3,70,5,'#091422');
    if(kind===0){
      const squash=[0,2,4,2,0,-2][phase];ctx.translate(0,squash);ctx.scale(1+squash*.012,1-squash*.012);
      r(-35,-28,70,23,ink);r(-31,-43,62,20,ink);r(-22,-55,44,16,ink);r(-10,-61,22,9,ink);
      r(-32,-28,64,20,'#3f808a');r(-28,-42,56,20,'#5aabb2');r(-19,-53,38,16,'#81d4cf');r(-8,-58,18,9,'#b0eee0');
      r(-24,-37,6,14,'#b7f5e5');r(-18,-47,9,5,'#d9fff1');r(-28,-18,56,7,'#326172');
      for(const ex of [-13,11]){r(ex,-35,7,10,ink);r(ex+1,-34,4,5,gold);r(ex+1,-34,2,2,'#ffffff');}
      r(-2,-24,6,2,ink);r(-1,-17,5,4,'#8fede0');
    }else if(kind===1){
      const flap=[0,4,8,4,0,-4][phase],float=[0,1,3,4,3,1][phase];ctx.translate(0,-float);
      for(const side of [-1,1]){
        ctx.save();ctx.scale(side,1);r(19,-65-flap,35,7,ink);r(27,-58-flap,24,12,'#564273');r(20,-50-flap,23,14,'#77559d');r(19,-39-flap,14,11,'#a77ccd');
        r(36,-65-flap,15,2,'#c79ce6');ctx.restore();
      }
      r(-17,-71,34,49,ink);r(-12,-76,24,12,'#8a70aa');r(-21,-54,42,24,'#695189');
      r(-15,-60,30,22,'#362f54');r(-10,-57,7,5,'#f6d4ff');r(5,-57,7,5,'#f6d4ff');
      r(-12,-36,25,20,'#8967ad');r(-17,-21,32,11,'#70578f');r(-20+flap,-11,12,6,'#b68fd5');r(9-flap,-11,12,6,'#b68fd5');
      r(-3,-43,6,8,'#d0a7ed');r(-2,-42,3,4,'#ffffff');
    }else{
      const breathe=[0,0,1,2,1,0][phase];ctx.translate(0,-breathe);
      r(-23,-67,46,45,ink);r(-17,-88,34,22,ink);r(-14,-85,28,17,'#9aa2ad');
      r(-10,-80,22,5,'#3b4d67');r(-8,-79,6,3,'#a2e6f1');r(5,-79,6,3,'#a2e6f1');
      r(-20,-63,40,35,'#7d899a');r(-16,-61,8,29,'#b6bdc6');r(12,-60,5,25,'#56667c');
      r(-31,-62,11,37,ink);r(21,-62,12,37,ink);r(-29,-60,7,28,'#a1abb7');r(23,-60,8,28,'#7d8a9f');
      r(-22,-24,15,21,ink);r(8,-24,15,21,ink);r(-19,-23,9,17,'#8996a7');r(11,-23,9,17,'#7b899f');
      r(-6,-55,14,16,'#dbc78b');r(-4,-53,10,12,'#74c6e0');r(-2,-50,6,6,'#d0f5ff');
      r(-18,-66,36,3,gold);r(-28,-36,6,2,gold);r(24,-36,7,2,gold);
    }
    if(hit>0&&!dead&&Math.floor(hit*10)%2===0){ctx.globalAlpha=.5*(1-hit);r(-35,-85,70,78,'#fff3da');}
    if(dead&&!reduced.matches)for(let j=0;j<14;j++){const q=j*2.4;r(Math.cos(q)*death*60,-35+Math.sin(q)*death*42,2,2,'#dfc6ff');}
    ctx.restore();
  }
  function draw(time){
    if(!scene)return;const ctx=scene.canvas.getContext('2d');if(!ctx)return;
    ctx.setTransform(4,0,0,4,0,0);ctx.imageSmoothingEnabled=false;frame++;const t=reduced.matches?0:time;
    ctx.fillStyle='#101d2a';ctx.fillRect(0,0,480,152);
    // Pixel-built ruins: distant arches, lanterns, masonry and a moving floor.
    for(let i=0;i<7;i++){let x=i*88-35;rect(ctx,x,25,11,91,'#253846');rect(ctx,x+10,20,50,7,'#253846');rect(ctx,x+57,25,11,91,'#253846');rect(ctx,x+15,30,37,75,'#14222f');rect(ctx,x+22,48,5,13,'#b28c55');rect(ctx,x+23,50,3,7,Math.floor(t/180)%2?'#ffd89a':'#e8ae67');}
    rect(ctx,0,117,480,35,'#28343d');rect(ctx,0,117,480,2,'#69716c');
    const offset=scene.mode==='explore'?Math.floor(t/55)%48:0;
    for(let row=0;row<3;row++)for(let col=-1;col<12;col++){rect(ctx,col*48+row%2*24-offset,121+row*11,44,1,'#46525a');rect(ctx,col*48+row%2*24-offset,121+row*11,1,9,'#1b2932');}
    const a=action,elapsed=a?time-a.time:10000,p=Math.min(1,elapsed/(a?.kind==='enemy'?1100:900)),active=p<1;
    let motion=scene.mode==='explore'?'walk':'idle',hx=92;
    if(active&&a.kind==='attack'){motion='attack';hx+=reduced.matches?0:Math.sin(p*Math.PI)*90;}
    if(active&&['magic','heal','guard'].includes(a.kind))motion='cast';
    if(active&&(a.kind==='hurt'||a.kind==='enemy'&&a.hits.length)){motion='hurt';hx+=reduced.matches?0:Math.sin(p*40)*4;}
    hero(ctx,hx,120,t,motion);
    const foes=scene.mode==='battle'?scene.foes:[];
    foes.forEach((e,i)=>{let x=foeX(i,foes.length);if(active&&a.kind==='enemy'&&!reduced.matches){const ep=Math.max(0,Math.min(1,p*1.6-i*.28));x-=Math.sin(ep*Math.PI)*48;}const affected=active&&a?.targets?.includes(i);monster(ctx,x,120,i,t,e.hp<=0,affected?p:e.hp<=0?1:0);if(s?.target===i&&e.hp>0){rect(ctx,x-3,57,7,3,'#ead398');rect(ctx,x-1,60,3,3,'#ead398');}});
    if(active&&!reduced.matches){
      const color=colors[a.element]||'#f5dfac';
      if(a.kind==='magic'){for(const i of a.targets){const x=92+(foeX(i,foes.length)-92)*p;magicArt(ctx,x,87,a.element,p);}}
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
  const originalEnd=endTurn;endTurn=function(...args){const run=s,hp=s?.hp;const result=originalEnd(...args);if(s===run&&s?.phase==='battle')perform('enemy',s.hp<hp?'敵の攻撃を受けた':'敵の攻撃を防いだ',[],s.hp<hp?[{player:true,text:'−'+(hp-s.hp)}]:[]);return result;};
  // Initial page may already have a resumed adventure.
  if(s?.phase==='battle')mount('battle');else if(s?.phase==='explore')mount('explore');
})();

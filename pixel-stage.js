/* ARCANA pixel theatre. Visuals observe the game; rules and saves stay in game.js. */
(() => {
  'use strict';
  const colors = {火:'#ff975b',氷:'#9eeaff',雷:'#ffe879',風:'#8df0b8',土:'#d8ba83',光:'#fff2bf',闇:'#c59aff'};
  const cast = new Image();cast.src='character-art-v1.png';
  const scenery = new Image();scenery.src='assets/sanctum.png';
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let scene=null, action=null, frame=0, animation=0;
  const esc = value => String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  function mount(mode, foes=s?.enemies||[]) {
    document.querySelector('.pixel-theatre')?.remove();
    const anchor=mode==='battle'?document.querySelector('.arena'):document.querySelector('.explore-scene');
    if(!anchor)return;
    const box=document.createElement('section');box.className='pixel-theatre';
    box.innerHTML=`<div class="pixel-heading"><span>${mode==='battle'?'BATTLE / CARD COMMAND':'EXPLORATION / THE FORGOTTEN SANCTUM'}</span><span>${esc(weapon)} × ${esc(magic)}</span></div><canvas width="1920" height="608" role="img" aria-label="${mode==='battle'?'主人公と敵のキャラクターイラスト。敵は下のカードで選択できます。':'遺跡を歩く白髪の冒険者'}"></canvas><div class="pixel-caption" aria-live="polite">${mode==='battle'?'カードを使って技を繰り出す':'遺跡の奥へ。進む道を選んでください。'}</div>`;
    anchor.before(box);if(mode==='battle')anchor.classList.add('pixel-targets');
    scene={mode,box,canvas:box.querySelector('canvas'),foes:foes.map(e=>({...e})),weapon,magic};
    draw(performance.now());if(!animation)animation=requestAnimationFrame(tick);
  }
  function tick(time){animation=0;if(!scene?.box.isConnected){scene=null;return;}if(!document.hidden)draw(time);animation=requestAnimationFrame(tick);}
  function rect(ctx,x,y,w,h,color){ctx.fillStyle=color;ctx.fillRect(Math.round(x),Math.round(y),w,h);}
  function characterImage(ctx,cell,x,y,w,h,alpha=1){
    if(!cast.complete||!cast.naturalWidth)return;
    const cw=cast.naturalWidth/2,ch=cast.naturalHeight/2;
    ctx.save();ctx.globalAlpha=alpha;ctx.drawImage(cast,(cell%2)*cw,Math.floor(cell/2)*ch,cw,ch,x-w/2,y-h,w,h);ctx.restore();
  }
  function hero(ctx,x,y,time,motion){
    const walking=motion==='walk',t=reduced.matches?0:time;
    const bob=walking?Math.sin(t/110)*1.25:Math.sin(t/500)*.5;
    ctx.save();ctx.translate(x,y-bob);if(walking)ctx.rotate(Math.sin(t/160)*.015);
    ctx.shadowColor='#080b15';ctx.shadowBlur=5;
    characterImage(ctx,0,0,4,100,108);
    ctx.shadowBlur=0;
    ctx.save();ctx.translate(6,-9);if(motion==='cast'){
      const glow=ctx.createRadialGradient(18,-29,0,18,-29,12);glow.addColorStop(0,'#ffffff');glow.addColorStop(.3,colors[scene.magic]);glow.addColorStop(1,'transparent');ctx.fillStyle=glow;ctx.beginPath();ctx.arc(18,-29,12,0,Math.PI*2);ctx.fill();
    }else weaponArt(ctx,scene.weapon,motion==='attack');ctx.restore();ctx.restore();
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
    const boss=!!s?.encounterSpec?.boss,kind=((scene.foes[index]?.portrait||index)+index)%3;
    const cell=kind===0?1:kind===1?2:3;
    const bob=reduced.matches?0:Math.sin(time/430+index)*1.4;
    ctx.save();ctx.translate(x,y-bob+(dead?hit*9:0));
    if(hit>0&&!dead)ctx.translate(Math.sin(hit*40)*2,0);
    const size=boss?112:90;
    ctx.shadowColor=hit>0&&!dead?'#fff0da':'#080b15';ctx.shadowBlur=hit>0&&!dead?12:5;
    characterImage(ctx,cell,0,4,size,size,dead?Math.max(0,1-hit):1);ctx.restore();
  }
  function draw(time){
    if(!scene)return;const ctx=scene.canvas.getContext('2d');if(!ctx)return;
    ctx.setTransform(4,0,0,4,0,0);ctx.imageSmoothingEnabled=true;ctx.imageSmoothingQuality="high";frame++;const t=reduced.matches?0:time;
    ctx.fillStyle='#101d2a';ctx.fillRect(0,0,480,152);
    if(scenery.complete&&scenery.naturalWidth){
      const iw=scenery.naturalWidth,ih=scenery.naturalHeight,ratio=480/152;
      const sh=Math.min(ih,iw/ratio);ctx.drawImage(scenery,0,(ih-sh)*.55,iw,sh,0,0,480,152);
    }
    const veil=ctx.createLinearGradient(0,0,0,152);veil.addColorStop(0,'#0b17285c');veil.addColorStop(1,'#080e2477');ctx.fillStyle=veil;ctx.fillRect(0,0,480,152);
    ctx.fillStyle='#09122280';ctx.beginPath();ctx.ellipse(92,123,29,3,0,0,Math.PI*2);ctx.fill();
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
  const originalEnd=endTurn;endTurn=function(...args){const run=s,hp=s?.hp;const result=originalEnd(...args);if(s===run&&s?.phase==='battle')perform(s.hp<hp?'hurt':'guard',s.hp<hp?'敵の攻撃を受けた':'敵の攻撃を防いだ',[],s.hp<hp?[{player:true,text:'−'+(hp-s.hp)}]:[]);return result;};
  // Initial page may already have a resumed adventure.
  if(s?.phase==='battle')mount('battle');else if(s?.phase==='explore')mount('explore');
})();

/* ARCANA pixel theatre. Visuals observe the game; rules and saves stay in game.js. */
(() => {
  'use strict';
  const colors = {火:'#ff975b',氷:'#9eeaff',雷:'#ffe879',風:'#8df0b8',土:'#d8ba83',光:'#fff2bf',闇:'#c59aff'};
  const heroineSheet=new Image();heroineSheet.src='heroine-reference-v1.png';
  const enemySheet=new Image();enemySheet.src='character-art-v1.png';
  const stageBackground=new Image();stageBackground.src='assets/sanctum.png';
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let scene=null, action=null, frame=0, animation=0;
  const esc = value => String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  function mount(mode, foes=s?.enemies||[]) {
    scene?.resizeObserver?.disconnect();
    document.querySelector('.pixel-theatre')?.remove();
    const anchor=mode==='battle'?document.querySelector('.arena'):document.querySelector('.explore-scene');
    if(!anchor)return;
    const box=document.createElement('section');box.className='pixel-theatre';
    box.innerHTML=`<div class="pixel-heading"><span>${mode==='battle'?'BATTLE / CARD COMMAND':'EXPLORATION / THE FORGOTTEN SANCTUM'}</span><span>${esc(weapon)} × ${esc(magic)}</span></div><canvas width="1920" height="608" role="img" aria-label="${mode==='battle'?'主人公と敵のアニメーション。敵は下のカードで選択できます。':'白と赤の衣装で歩く白髪の冒険者'}"></canvas><div class="pixel-caption" aria-live="polite">${mode==='battle'?'カードを使って技を繰り出す':'遺跡の奥へ。進む道を選んでください。'}</div>`;
    anchor.before(box);if(mode==='battle')anchor.classList.add('pixel-targets');
    const canvas=box.querySelector('canvas');
    const bounds=canvas.getBoundingClientRect?.();
    if(bounds?.height>0&&bounds?.width>0)canvas.width=Math.round(608*bounds.width/bounds.height/4)*4;
    scene={mode,box,canvas,width:(canvas.width||1920)/4,foes:foes.map(e=>({...e})),weapon,magic};
    if(typeof ResizeObserver==='function'){
      const mounted=scene;mounted.resizeObserver=new ResizeObserver(()=>{
        if(scene!==mounted||!canvas.isConnected)return;
        const b=canvas.getBoundingClientRect();
        if(b.height>0){const width=Math.round(608*b.width/b.height/4)*4;if(canvas.width!==width)canvas.width=width;mounted.width=width/4;}
      });mounted.resizeObserver.observe(canvas);
    }
    draw(performance.now());if(!animation)animation=requestAnimationFrame(tick);
  }
  function tick(time){animation=0;if(!scene?.box.isConnected){scene?.resizeObserver?.disconnect();scene=null;return;}if(!document.hidden)draw(time);animation=requestAnimationFrame(tick);}
  function rect(ctx,x,y,w,h,color){ctx.fillStyle=color;ctx.fillRect(Math.round(x),Math.round(y),w,h);}
  function atlasSprite(ctx,image,cols,rows,cell,x,y,w,h,alpha=1){
    if(!image.complete||!image.naturalWidth)return;
    const sw=image.naturalWidth/cols,sh=image.naturalHeight/rows;
    ctx.save();ctx.globalAlpha=alpha;
    ctx.drawImage(image,cell%cols*sw,Math.floor(cell/cols)*sh,sw,sh,x-w/2,y-h,w,h);ctx.restore();
  }
  function hero(ctx,x,y,time,motion){
    const t=reduced.matches?0:time,walking=motion==='walk';
    const phase=Math.floor(t/150)%4;
    const progress=action?Math.min(1,Math.max(0,(time-action.time)/900)):1;
    let cell=walking?[1,0,2,0][phase]:0;
    if(!reduced.matches){if(motion==='attack'&&progress>.12&&progress<.85)cell=3;else if(motion==='cast')cell=4;else if(motion==='hurt')cell=5;}
    const bob=reduced.matches?0:walking?Math.sin(t/150)*1.5:Math.sin(t/500)*.45;
    ctx.save();ctx.translate(x,y-bob);
    ctx.fillStyle='#07102177';ctx.beginPath();ctx.ellipse(0,1,21,2.5,0,0,Math.PI*2);ctx.fill();
    atlasSprite(ctx,heroineSheet,3,2,cell,0,4,110,112);
    if(motion==='cast'){
      ctx.save();ctx.translate(49,-82);const color=colors[scene.magic];
      const glow=ctx.createRadialGradient(0,0,0,0,0,11);
      glow.addColorStop(0,'#ffffff');glow.addColorStop(.3,color);glow.addColorStop(1,'transparent');
      ctx.fillStyle=glow;ctx.beginPath();ctx.arc(0,0,11,0,Math.PI*2);ctx.fill();ctx.restore();
    }else if(cell!==5){
      const hands=[[20,-49],[30,-56],[30,-57],[51,-82],[49,-84],[18,-55]],hand=hands[cell];
      ctx.save();ctx.translate(hand[0]-12,hand[1]+7);
      weaponArt(ctx,scene.weapon,motion==='attack');ctx.restore();
    }
    ctx.restore();
  }
  function weaponArt(ctx,type,attack){
    ctx.save();ctx.translate(10,-19);if(attack)ctx.rotate(-.55+Math.sin(Math.max(0,(performance.now()-(action?.time||0))/900)*Math.PI)*1.5);
    ctx.lineWidth=1;ctx.lineJoin='round';ctx.strokeStyle='#24324b';
    const metal=ctx.createLinearGradient(-2,0,6,0);
    metal.addColorStop(0,'#8095ae');metal.addColorStop(.4,'#fcffff');metal.addColorStop(.55,'#d0dfec');metal.addColorStop(1,'#6e87a5');
    const poly=(points,color)=>{ctx.beginPath();ctx.moveTo(...points[0]);for(const pt of points.slice(1))ctx.lineTo(...pt);ctx.closePath();ctx.fillStyle=color;ctx.fill();ctx.stroke();};
    if(type==='弓'){
      ctx.strokeStyle='#dec38b';ctx.lineWidth=2.4;ctx.beginPath();ctx.moveTo(0,-26);ctx.bezierCurveTo(20,-19,20,10,0,16);ctx.stroke();
      ctx.strokeStyle='#f7efdc';ctx.lineWidth=.6;ctx.beginPath();ctx.moveTo(0,-26);ctx.lineTo(0,16);ctx.stroke();
      ctx.strokeStyle='#99b8cd';ctx.beginPath();ctx.moveTo(-6,-4);ctx.lineTo(25,-4);ctx.stroke();poly([[25,-7],[31,-4],[25,-1]],metal);
    }else if(type==='戦槌'){
      poly([[0,-20],[4,-20],[4,14],[0,14]],'#8c6957');poly([[-11,-30],[15,-30],[17,-27],[17,-16],[14,-13],[-11,-13],[-14,-16],[-14,-27]],metal);
      poly([[-4,-26],[7,-26],[7,-17],[-4,-17]],'#5e7494');poly([[0,-24],[4,-24],[4,-20],[0,-20]],'#d7be80');
    }else if(type==='槍'){
      poly([[1,-34],[3,-34],[3,21],[1,21]],'#a78861');poly([[2,-48],[-4,-32],[2,-27],[8,-32]],metal);
      ctx.strokeStyle='#f8ffff';ctx.beginPath();ctx.moveTo(2,-45);ctx.lineTo(2,-29);ctx.stroke();
      poly([[-3,-27],[7,-27],[7,-24],[-3,-24]],'#d4bd87');
    }else{
      const length=type==='大剣'?43:type==='短剣'?20:32,w=type==='大剣'?7:4;
      poly([[0,0],[0,-length+6],[w/2,-length],[w,-length+6],[w,0]],metal);
      ctx.strokeStyle='#ffffff';ctx.lineWidth=.5;ctx.beginPath();ctx.moveTo(w/2,-length+4);ctx.lineTo(w/2,-2);ctx.stroke();
      poly([[-5,-1],[w+5,-1],[w+5,2],[-5,2]],'#d6bb7b');
      poly([[.5,2],[w-.5,2],[w-.5,12],[.5,12]],'#73546f');poly([[-1,12],[w+1,12],[w,15],[0,15]],'#dcc78b');
      ctx.fillStyle='#b59adc';ctx.fillRect(w/2-1,0,2,2);
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
    const kind=((scene.foes[index]?.portrait||index)+index)%3,cell=kind===0?1:kind===1?2:3;
    const t=reduced.matches?0:time,boss=!!s?.encounterSpec?.boss;
    const bob=Math.sin(t/400+index)*1.5;
    ctx.save();ctx.translate(x,y-bob+(dead?hit*12:0));
    if(kind===0&&!reduced.matches){const squash=Math.sin(t/220)*.035;ctx.scale(1+squash,1-squash);}
    if(kind===1&&!reduced.matches)ctx.rotate(Math.sin(t/500)*.02);
    if(hit>0&&!dead&&!reduced.matches)ctx.translate(Math.sin(hit*35)*2,0);
    ctx.shadowColor=hit>0&&!dead?'#fff0dd':'#07101a';ctx.shadowBlur=hit>0&&!dead?9:3;
    const size=boss?112:90;atlasSprite(ctx,enemySheet,2,2,cell,0,4,size,size,dead?Math.max(0,1-hit):1);
    if(dead&&!reduced.matches){ctx.globalAlpha=1-hit;ctx.fillStyle='#dfc4ff';for(let j=0;j<16;j++){const q=j*2.4;ctx.beginPath();ctx.arc(Math.cos(q)*hit*34,-25+Math.sin(q)*hit*30,1.2,0,Math.PI*2);ctx.fill();}}
    ctx.restore();
  }
  function draw(time){
    if(!scene)return;const ctx=scene.canvas.getContext('2d');if(!ctx)return;
    ctx.setTransform(4,0,0,4,0,0);ctx.imageSmoothingEnabled=true;ctx.imageSmoothingQuality="high";frame++;const t=reduced.matches?0:time;
    ctx.fillStyle='#101d2a';ctx.fillRect(0,0,480,152);
    const viewWidth=scene.width||480;
    if(stageBackground.complete&&stageBackground.naturalWidth){
      const iw=stageBackground.naturalWidth,ih=stageBackground.naturalHeight;
      const sh=Math.min(ih,iw/(viewWidth/152));
      ctx.drawImage(stageBackground,0,(ih-sh)*.65,iw,sh,0,0,viewWidth,152);
    }else{ctx.fillStyle='#152537';ctx.fillRect(0,0,viewWidth,152);}
    const shade=ctx.createLinearGradient(0,0,0,152);shade.addColorStop(0,'#0a162b40');shade.addColorStop(1,'#09102185');ctx.fillStyle=shade;ctx.fillRect(0,0,viewWidth,152);
    const a=action,elapsed=a?time-a.time:10000,p=Math.min(1,elapsed/(a?.kind==='enemy'?1100:900)),active=p<1;
    let motion=scene.mode==='explore'?'walk':'idle',hx=(scene.width||480)*.2;
    if(active&&a.kind==='attack'){motion='attack';hx+=reduced.matches?0:Math.sin(p*Math.PI)*90;}
    if(active&&['magic','heal','guard'].includes(a.kind))motion='cast';
    if(active&&(a.kind==='hurt'||a.kind==='enemy'&&a.hits.length)){motion='hurt';hx+=reduced.matches?0:Math.sin(p*40)*4;}
    hero(ctx,hx,120,t,motion);
    const foes=scene.mode==='battle'?scene.foes:[];
    foes.forEach((e,i)=>{let x=foeX(i,foes.length);if(active&&a.kind==='enemy'&&!reduced.matches){const ep=Math.max(0,Math.min(1,p*1.6-i*.28));x-=Math.sin(ep*Math.PI)*48;}const affected=active&&a?.targets?.includes(i);monster(ctx,x,120,i,t,e.hp<=0,affected?p:e.hp<=0?1:0);if(s?.target===i&&e.hp>0){rect(ctx,x-3,57,7,3,'#ead398');rect(ctx,x-1,60,3,3,'#ead398');}});
    if(active&&!reduced.matches){
      const color=colors[a.element]||'#f5dfac';
      if(a.kind==='magic'){for(const i of a.targets){const origin=(scene.width||480)*.2;const x=origin+(foeX(i,foes.length)-origin)*p;magicArt(ctx,x,87,a.element,p);}}
      if(a.kind==='attack'&&p>.25)for(const i of a.targets){const x=foeX(i,foes.length);for(let j=0;j<6;j++)rect(ctx,x-16+j*5,77+j*5,3,9,'#fff0ce');}
      if(a.kind==='heal'||a.kind==='guard'){for(let j=0;j<9;j++)rect(ctx,(scene.width||480)*.2-22+j*5,108-(p*35+j*7)%45,3,4,a.kind==='heal'?'#9ef0bf':color);}
      for(const hit of a.hits||[]){ctx.fillStyle=hit.player?'#ffb6a0':'#fff1c4';ctx.font='bold 10px monospace';ctx.textAlign='center';ctx.fillText(hit.text,hit.player?(scene.width||480)*.2:foeX(hit.index,foes.length),67-p*16);}
    }
  }
  function foeX(i,count){const w=scene?.width||480;return count<=1?w*.74:w*.58+i*Math.min(100,w*.3/Math.max(1,count-1));}
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

/* ARCANA pixel theatre. Visuals observe the game; rules and saves stay in game.js. */
(() => {
  'use strict';
  const colors = {火:'#ff975b',氷:'#9eeaff',雷:'#ffe879',風:'#8df0b8',土:'#d8ba83',光:'#fff2bf',闇:'#c59aff'};
  const heroineSheet=new Image();heroineSheet.src='heroine-reference-v1.png';
  const armedSheet=new Image();armedSheet.src='heroine-weapons-v2.png';
  const walkingSheet=new Image();walkingSheet.src='heroine-walk-v2.png';
  const attackSheet=new Image();attackSheet.src='heroine-attacks-v1.png';
  const attacks={
    '片手剣':{duration:820,impact:.42,reach:66,color:'#c3edff',name:'横一閃'},
    '大剣':{duration:1150,impact:.52,reach:76,color:'#ffe4a6',name:'断ち下ろし'},
    '短剣':{duration:720,impact:.35,reach:53,color:'#e1c2ff',name:'双刃連撃'},
    '弓':{duration:980,impact:.65,reach:0,color:'#b6f1cb',name:'疾風の射撃'},
    '槍':{duration:880,impact:.43,reach:84,color:'#a7e9ff',name:'貫通突き'},
    '戦槌':{duration:1200,impact:.54,reach:68,color:'#ffd08d',name:'砕地撃'}
  };
  const ease=t=>{t=Math.max(0,Math.min(1,t));return t*t*(3-2*t);};
  function attackTravel(type,p){
    const spec=attacks[type]||attacks['片手剣'];if(type==='弓')return -Math.sin(p*Math.PI)*3;
    return ease(p/(spec.impact*.85))*(1-ease((p-.69)/.31));
  }
  function attackHero(ctx,type,x,y,p,height=103){
    const spec=attacks[type]||attacks['片手剣'];
    const col=p<spec.impact-.09?0:p<spec.impact+.15?1:2;
    const row=Math.max(0,weaponOrder.indexOf(type));
    ctx.save();ctx.translate(x,y);
    const heavy=type==='大剣'||type==='戦槌';
    const settle=Math.sin(ease(Math.max(0,p-spec.impact)/.28)*Math.PI);
    ctx.translate(0,heavy?settle*2:-Math.sin(p*Math.PI)*1.3);
    if(attackSheet.complete&&attackSheet.naturalWidth){
      // One fully opaque articulated pose at a time; transparent margins remain intact.
      const cw=attackSheet.naturalWidth/3,sy=attackSheet.naturalHeight/1774;
      const bounds=[0,279,589,833,1132,1407,1774],feet=[274,572,824,1124,1398,1730];
      const anchors=[[142,132,180],[143,133,142],[139,132,145],[139,145,151],[139,138,162],[145,144,153]];
      const top=bounds[row]*sy,bottom=Math.min(bounds[row+1],feet[row]+1)*sy,scale=height/(260*sy)*(type==='戦槌'?.88:1);
      const width=row===2&&col===1?cw*.81:cw;
      ctx.drawImage(attackSheet,col*cw,top,width,bottom-top,-anchors[row][col]*cw/295.67*scale,(top-feet[row]*sy)*scale,width*scale,(bottom-top)*scale);
    }else groundedSprite(ctx,armedSheet,3,2,row,0,2,height,spriteGeometry.armed);
    ctx.restore();
  }
  function weaponEffects(ctx,type,origin,target,p,baseline=120){
    const spec=attacks[type]||attacks['片手剣'],q=(p-spec.impact)/.28;
    const stroke=(points,color,width)=>{ctx.strokeStyle=color;ctx.lineWidth=width;ctx.beginPath();points(ctx);ctx.stroke();};
    ctx.save();ctx.lineCap='round';ctx.lineJoin='round';
    if(type==='弓'){
      const flight=(p-.32)/(spec.impact-.32);
      if(flight>=0&&flight<=1){const x=origin+24+(target-origin-24)*flight,y=baseline-44;
        const trail=ctx.createLinearGradient(x-42,y,x,y);trail.addColorStop(0,'#b6f1cb00');trail.addColorStop(1,'#e9ffed');
        stroke(c=>{c.moveTo(x-42,y);c.lineTo(x,y);},trail,2);
        stroke(c=>{c.moveTo(x-12,y);c.lineTo(x+4,y);c.moveTo(x,y-3);c.lineTo(x+4,y);c.lineTo(x,y+3);},'#f5ffde',1.3);
      }
    }
    if(q>=-.28&&q<=1){
      const k=Math.max(0,q),alpha=Math.max(0,1-k);ctx.globalAlpha=alpha;
      ctx.shadowColor=spec.color;ctx.shadowBlur=7;
      if(type==='片手剣'||type==='短剣'){
        const slash=(tilt,delay)=>{const v=Math.max(0,Math.min(1,(q+.22-delay)*2.7));if(!v)return;
          ctx.save();ctx.translate(target,baseline-39);ctx.rotate(tilt);
          stroke(c=>c.ellipse(-9,0,38,16,0,-2.5,-2.5+v*3.5),spec.color,5*(1-k)+1);
          stroke(c=>c.ellipse(-9,-1,38,16,0,-2.5,-2.5+v*3.5),'#ffffff',1.2);ctx.restore();};
        slash(type==='短剣'?-.65:-.25,0);if(type==='短剣')slash(.7,.2);
      }else if(type==='大剣'){
        stroke(c=>{c.moveTo(target-30,baseline-80);c.quadraticCurveTo(target+28,baseline-45,target-4,baseline-4);},spec.color,9*(1-k)+1);
        stroke(c=>{c.moveTo(target-29,baseline-80);c.quadraticCurveTo(target+27,baseline-45,target-4,baseline-4);},'#fffdf2',2);
      }else if(type==='槍'){
        stroke(c=>{c.moveTo(target-67,baseline-37);c.lineTo(target+22,baseline-37);},spec.color,4*(1-k)+.5);
        stroke(c=>{c.moveTo(target-60,baseline-37);c.lineTo(target+22,baseline-37);c.moveTo(target+9,baseline-43);c.lineTo(target+22,baseline-37);c.lineTo(target+9,baseline-31);},'#f4fdff',1);
      }else if(type==='戦槌'){
        stroke(c=>c.ellipse(target,baseline,8+k*48,2+k*9,0,0,Math.PI*2),spec.color,2.5*(1-k)+.5);
        for(let j=0;j<7;j++){const dx=(j-3)*8;stroke(c=>{c.moveTo(target,baseline);c.lineTo(target+dx*.5,baseline-4);c.lineTo(target+dx,baseline+1);},'#ffe3a5',.8);}
      }
      if(q>=0){
        ctx.shadowBlur=0;
        for(let j=0;j<(type==='戦槌'?15:9);j++){
          const angle=j*2.399,dist=5+k*(type==='戦槌'?35:24),cy=type==='戦槌'?baseline-3:baseline-38;
          const px=target+Math.cos(angle)*dist,py=cy+Math.sin(angle)*dist*(type==='戦槌'?.55:.8)+k*k*9;
          stroke(c=>{c.moveTo(px,py);c.lineTo(px+Math.cos(angle)*(3+2*k),py+Math.sin(angle)*3);},j%3?'#fff7df':spec.color,j%3?.9:1.7);
        }
        ctx.globalAlpha=alpha*.7;stroke(c=>c.arc(target,baseline-38,3+k*15,0,Math.PI*2),spec.color,.7);
      }
    }
    ctx.restore();
  }
  const weaponOrder=['片手剣','大剣','短剣','弓','槍','戦槌'];
  const spriteGeometry={"armed":{"width":1536,"height":1024,"cols":3,"rows":2,"referenceHeight":502,"frames":[{"left":87,"top":10,"right":467,"bottom":512,"anchorX":270,"sourceX":0,"sourceY":0},{"left":84,"top":10,"right":407,"bottom":512,"anchorX":264,"sourceX":512,"sourceY":0},{"left":55,"top":10,"right":380,"bottom":512,"anchorX":242,"sourceX":1024,"sourceY":0},{"left":102,"top":0,"right":531,"bottom":486,"anchorX":287,"sourceX":0,"sourceY":512,"clips":[[0,0,512,512],[512,120,19,40]]},{"left":63,"top":-14,"right":504,"bottom":486,"anchorX":271,"sourceX":512,"sourceY":512,"clips":[[45,0,467,512],[467,-14,45,14]]},{"left":69,"top":2,"right":493,"bottom":486,"anchorX":279,"sourceX":1024,"sourceY":512}],"rowReferenceHeights":[502,490]},"walk":{"width":1774,"height":887,"cols":4,"rows":2,"referenceHeight":436,"frames":[{"left":59,"top":8,"right":437,"bottom":444,"anchorX":280,"hand":[395.96,207.33],"sourceX":0,"sourceY":0},{"left":74,"top":8,"right":306,"bottom":444,"anchorX":259,"hand":[294.27,213.96],"sourceX":444,"sourceY":0},{"left":50,"top":7,"right":305,"bottom":444,"anchorX":246,"hand":[288.78,219.13],"sourceX":887,"sourceY":0},{"left":38,"top":8,"right":389,"bottom":444,"anchorX":233,"hand":[331.61,203.88],"sourceX":1330,"sourceY":0},{"left":60,"top":19,"right":444,"bottom":427,"anchorX":247,"hand":[128.16,193.95],"sourceX":0,"sourceY":444},{"left":154,"top":10,"right":405,"bottom":426,"anchorX":214,"hand":[165.21,207.24],"sourceX":444,"sourceY":444},{"left":128,"top":10,"right":386,"bottom":430,"anchorX":190,"hand":[146.64,212.86],"sourceX":887,"sourceY":444},{"left":56,"top":13,"right":382,"bottom":429,"anchorX":209,"hand":[108.85,197.83],"sourceX":1330,"sourceY":444}],"rowReferenceHeights":[436,415]}};
  const enemySheet=new Image();enemySheet.src='character-art-v1.png';
  const stageBackground=new Image();stageBackground.src='assets/sanctum.png';
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let scene=null, action=null, frame=0, animation=0, lastPaint=-Infinity;
  const esc = value => String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  function mount(mode, foes=s?.enemies||[]) {
    scene?.resizeObserver?.disconnect();
    document.querySelector('.pixel-theatre')?.remove();
    const anchor=mode==='battle'?document.querySelector('.arena'):document.querySelector('.explore-scene');
    if(!anchor)return;
    const box=document.createElement('section');box.className='pixel-theatre';
    box.innerHTML=`<div class="pixel-heading"><span>${mode==='battle'?'BATTLE / CARD COMMAND':'EXPLORATION / THE FORGOTTEN SANCTUM'}</span><span>${esc(weapon)} × ${esc(magic)}</span><button type="button" onclick="arcanaOpenWeaponArt()" aria-label="装備中の武器イラストを見る">装備イラスト</button></div><canvas width="960" height="304" role="img" aria-label="${mode==='battle'?'主人公と敵のアニメーション。敵は下のカードで選択できます。':'白と赤の衣装で歩く白髪の冒険者'}"></canvas><div class="pixel-caption" aria-live="polite">${mode==='battle'?'カードを使って技を繰り出す':'遺跡の奥へ。進む道を選んでください。'}</div>`;
    const previewButton=document.createElement('button');previewButton.type='button';previewButton.textContent='攻撃モーション';previewButton.onclick=()=>globalThis.arcanaPreviewAttack(scene?.weapon||weapon);box.querySelector('.pixel-heading').append(previewButton);
    anchor.before(box);if(mode==='battle')anchor.classList.add('pixel-targets');
    const canvas=box.querySelector('canvas');
    const bounds=canvas.getBoundingClientRect?.();
    if(bounds?.height>0&&bounds?.width>0)canvas.width=Math.round(304*bounds.width/bounds.height/2)*2;
    scene={mode,box,canvas,width:(canvas.width||960)/2,foes:foes.map(e=>({...e})),weapon,magic};
    draw(performance.now());if(!animation)animation=requestAnimationFrame(tick);
  }
  function tick(time){animation=0;if(!scene?.box.isConnected){scene?.resizeObserver?.disconnect();scene=null;return;}if(!document.hidden&&time-lastPaint>=15){lastPaint=time;draw(time);}animation=requestAnimationFrame(tick);}
  function rect(ctx,x,y,w,h,color){ctx.fillStyle=color;ctx.fillRect(Math.round(x),Math.round(y),w,h);}
  function atlasSprite(ctx,image,cols,rows,cell,x,y,w,h,alpha=1){
    if(!image.complete||!image.naturalWidth)return;
    const sw=image.naturalWidth/cols,sh=image.naturalHeight/rows;
    ctx.save();ctx.globalAlpha=alpha;
    ctx.drawImage(image,cell%cols*sw,Math.floor(cell/cols)*sh,sw,sh,x-w/2,y-h,w,h);ctx.restore();
  }
  function groundedSprite(ctx,image,cols,rows,cell,x,y,height,geometry){
    if(!image.complete||!image.naturalWidth)return false;
    const cw=image.naturalWidth/cols,ch=image.naturalHeight/rows;
    const g=geometry?.frames?.[cell]||{left:0,top:0,right:cw,bottom:ch};
    const referenceHeight=geometry?.rowReferenceHeights?.[Math.floor(cell/cols)]||geometry?.referenceHeight||ch;
    const anchorX=g.anchorX??cw/2;
    const scale=height/referenceHeight;
    ctx.save();
    if(g.clips){ctx.beginPath();for(const [cx,cy,ww,hh]of g.clips)ctx.rect(x+(cx-anchorX)*scale,y+(cy-g.bottom)*scale,ww*scale,hh*scale);ctx.clip();}
    ctx.drawImage(image,(g.sourceX??cell%cols*cw)+g.left,(g.sourceY??Math.floor(cell/cols)*ch)+g.top,g.right-g.left,g.bottom-g.top,
      x+(g.left-anchorX)*scale,y-(g.bottom-g.top)*scale,(g.right-g.left)*scale,(g.bottom-g.top)*scale);
    ctx.restore();
    return true;
  }
  function hero(ctx,x,y,time,motion){
    const t=reduced.matches?0:time,walking=motion==='walk'&&!reduced.matches;
    const walkPosition=t/140,walkFrame=Math.floor(walkPosition)%8;
    const progress=action?Math.min(1,Math.max(0,(time-action.time)/(action.duration||900))):1;
    const attacking=motion==='attack'&&!reduced.matches;
    const casting=motion==='cast'&&!reduced.matches,hurt=motion==='hurt'&&!reduced.matches;
    const cell=hurt?5:casting?4:attacking?3:0;
    const equipped=weaponOrder.indexOf(scene.weapon);
    ctx.save();ctx.translate(x,y);
    ctx.fillStyle='#07102177';ctx.beginPath();ctx.ellipse(0,1,21,2.5,0,0,Math.PI*2);ctx.fill();
    if(attacking){attackHero(ctx,action.weapon||scene.weapon,0,0,progress);ctx.restore();return;}
    let drawn=false;
    if(walking){
      // Eight uninterrupted contact/down/passing/up frames; soles stay on the ground.
      const paintWalk=(cell)=>{
        ctx.save();if(cell>=4)ctx.scale(-1,1);
        // Narrow the stride below the hips without squeezing the head or torso.
        for(let top=-105;top<3;top+=2){
          const depth=Math.max(0,Math.min(1,(top+48)/50));
          const width=1-depth*.4;
          ctx.save();ctx.beginPath();ctx.rect(-150,top,300,2);ctx.clip();ctx.scale(width,1);
          groundedSprite(ctx,walkingSheet,4,2,cell,0,2,103,spriteGeometry.walk);ctx.restore();
        }
        ctx.restore();
      };
      // Keep a single opaque pose: crossfading silhouettes duplicates faces and limbs.
      // Continuous subpixel sway supplements the eight pose frames without ghosting.
      ctx.save();ctx.translate(Math.sin(walkPosition*Math.PI/2)*.6,0);
      paintWalk(walkFrame);ctx.restore();
      drawn=walkingSheet.complete&&!!walkingSheet.naturalWidth;
    }else if(!casting&&!hurt){
      // Hands and weapon are painted together, including two-handed heavy weapons.
      ctx.save();if(attacking){ctx.translate(0,-42);ctx.rotate(Math.sin(progress*Math.PI)*.12);ctx.translate(0,42);}
      drawn=groundedSprite(ctx,armedSheet,3,2,Math.max(0,equipped),0,2,103,spriteGeometry.armed);ctx.restore();
    }
    if(!drawn)atlasSprite(ctx,heroineSheet,3,2,cell,0,4,110,112);
    if(casting){
      ctx.save();ctx.translate(49,-82);const color=colors[scene.magic];
      const glow=ctx.createRadialGradient(0,0,0,0,0,11);
      glow.addColorStop(0,'#ffffff');glow.addColorStop(.3,color);glow.addColorStop(1,'transparent');
      ctx.fillStyle=glow;ctx.beginPath();ctx.arc(0,0,11,0,Math.PI*2);ctx.fill();ctx.restore();
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

  function ruinsBackground(ctx,width,time){
    const moving=scene.mode==='explore'&&!reduced.matches;
    const seconds=moving?time/1000:0;
    ctx.fillStyle='#101d2a';ctx.fillRect(0,0,width,152);
    if(stageBackground.complete&&stageBackground.naturalWidth){
      const iw=stageBackground.naturalWidth,ih=stageBackground.naturalHeight;
      const tileWidth=moving?Math.max(width*1.2,520):width;
      const sh=Math.min(ih,iw/(tileWidth/152));
      const distance=seconds*9,first=Math.floor(distance/tileWidth),offset=distance%tileWidth;
      for(let i=0;i<(moving?2:1);i++){
        const x=i*tileWidth-offset;
        ctx.save();ctx.translate(x,0);
        if((first+i)%2){ctx.translate(tileWidth,0);ctx.scale(-1,1);}
        ctx.drawImage(stageBackground,0,(ih-sh)*.65,iw,sh,0,0,tileWidth+.5,152);ctx.restore();
      }
    }
    if(scene.mode!=='explore')return;
    // Nearby broken columns and floor joints pass faster than the distant ruins.
    const ground=ctx.createLinearGradient(0,113,0,152);
    ground.addColorStop(0,'#15253600');ground.addColorStop(1,'#07111bd9');
    ctx.fillStyle=ground;ctx.fillRect(0,113,width,39);
    const stoneOffset=(seconds*22)%84;
    ctx.strokeStyle='#8ba5ac20';ctx.lineWidth=.6;
    for(let x=-84-stoneOffset;x<width+84;x+=84){
      ctx.beginPath();ctx.moveTo(x,124);ctx.lineTo(x-22,152);ctx.stroke();
      ctx.beginPath();ctx.moveTo(x,137);ctx.lineTo(x+84,137);ctx.stroke();
    }
    const period=360,distance=seconds*18,start=Math.floor(distance/period),offset=distance%period;
    for(let i=0;i<Math.ceil(width/period)+1;i++){
      const x=i*period-offset+300,k=(start+i)%3;
      const height=[52,34,65][k],base=128;
      const stone=ctx.createLinearGradient(x-12,0,x+12,0);
      stone.addColorStop(0,'#0b1522');stone.addColorStop(.5,'#30434b');stone.addColorStop(1,'#111e2a');
      ctx.fillStyle=stone;ctx.fillRect(x-7,base-height,14,height);
      ctx.fillStyle='#3d5054';ctx.fillRect(x-10,base-height,20,4);
      ctx.fillStyle='#17232c';ctx.fillRect(x-12,base-3,25,6);
      ctx.strokeStyle='#92a09b44';ctx.beginPath();ctx.moveTo(x+1,base-height+8);ctx.lineTo(x-2,base-height+16);ctx.lineTo(x+2,base-height+23);ctx.stroke();
      ctx.fillStyle='#52604b55';ctx.fillRect(x-6,base-height+3,7,3);
      ctx.fillStyle='#24333c';ctx.fillRect(x+19,base+2,10,4);ctx.fillRect(x-24,base+4,8,3);
    }
    // A slow translucent mist layer adds depth without obscuring the heroine.
    for(let i=0;i<3;i++){
      const x=((i*width/2+seconds*4)%(width+140))-70;
      const mist=ctx.createRadialGradient(x,108,2,x,108,75);
      mist.addColorStop(0,'#b2d6e612');mist.addColorStop(1,'#b2d6e600');
      ctx.fillStyle=mist;ctx.fillRect(x-75,68,150,80);
    }
  }
  function draw(time){
    if(!scene)return;const ctx=scene.canvas.getContext('2d');if(!ctx)return;
    ctx.setTransform(2,0,0,2,0,0);ctx.imageSmoothingEnabled=true;ctx.imageSmoothingQuality="high";frame++;const t=reduced.matches?0:time;
    const viewWidth=scene.width||480;
    ruinsBackground(ctx,viewWidth,t);
    const shade=ctx.createLinearGradient(0,0,0,152);shade.addColorStop(0,'#0a162b40');shade.addColorStop(1,'#09102185');ctx.fillStyle=shade;ctx.fillRect(0,0,viewWidth,152);
    const a=action,elapsed=a?time-a.time:10000,p=Math.min(1,elapsed/(a?.duration||900)),active=p<1;
    const spec=attacks[a?.weapon||scene.weapon]||attacks['片手剣'];
    const impact=a?.kind==='attack'?spec.impact:a?.kind==='magic'?.6:.2;
    let motion=scene.mode==='explore'?'walk':'idle',hx=(scene.width||480)*.2;
    if(active&&a.kind==='attack'){
      motion='attack';const target=foeX(a.targets[0]??s?.target??0,scene.foes.length);
      hx+=reduced.matches||a.weapon==='弓'?0:attackTravel(a.weapon,p)*Math.max(0,target-hx-spec.reach);
    }
    if(active&&['magic','heal','guard'].includes(a.kind))motion='cast';
    if(active&&(a.kind==='hurt'||a.kind==='enemy'&&a.hits.length)){motion='hurt';hx+=reduced.matches?0:Math.sin(p*40)*4;}
    hero(ctx,hx,120,t,motion);
    const foes=scene.mode==='battle'?scene.foes:[];
    foes.forEach((e,i)=>{let x=foeX(i,foes.length);if(active&&a.kind==='enemy'&&!reduced.matches){const ep=Math.max(0,Math.min(1,p*1.6-i*.28));x-=Math.sin(ep*Math.PI)*48;}const affected=active&&a?.targets?.includes(i),landed=affected&&p>=impact;const death=affected&&!landed?false:e.hp<=0;const hit=landed?Math.min(1,(p-impact)/(1-impact)):e.hp<=0&&!affected?1:0;monster(ctx,x,120,i,t,death,hit);if(s?.target===i&&e.hp>0){rect(ctx,x-3,57,7,3,'#ead398');rect(ctx,x-1,60,3,3,'#ead398');}});
    if(active&&!reduced.matches){
      const color=colors[a.element]||'#f5dfac';
      if(a.kind==='magic'){for(const i of a.targets){const origin=(scene.width||480)*.2;const x=origin+(foeX(i,foes.length)-origin)*p;magicArt(ctx,x,87,a.element,p);}}
      if(a.kind==='attack')for(const i of a.targets.length?a.targets:[s?.target??0])weaponEffects(ctx,a.weapon,(scene.width||480)*.2,foeX(i,foes.length),p);
      if(a.kind==='heal'||a.kind==='guard'){for(let j=0;j<9;j++)rect(ctx,(scene.width||480)*.2-22+j*5,108-(p*35+j*7)%45,3,4,a.kind==='heal'?'#9ef0bf':color);}
      if(p>=impact)for(const hit of a.hits||[]){const rise=(p-impact)/(1-impact);ctx.save();ctx.globalAlpha=Math.min(1,(1-rise)*3);ctx.fillStyle=hit.player?'#ffb6a0':'#fff1c4';ctx.strokeStyle='#131923';ctx.lineWidth=2;ctx.font='bold 11px monospace';ctx.textAlign='center';const tx=hit.player?(scene.width||480)*.2:foeX(hit.index,foes.length),ty=67-rise*18;ctx.strokeText(hit.text,tx,ty);ctx.fillText(hit.text,tx,ty);ctx.restore();}
    }
  }
  function foeX(i,count){const w=scene?.width||480;return count<=1?w*.74:w*.58+i*Math.min(100,w*.3/Math.max(1,count-1));}
  function perform(kind,label,targets=[],hits=[],element=magic){const type=scene?.weapon||weapon;action={kind,targets,hits,element,weapon:type,duration:kind==='attack'?(attacks[type]?.duration||900):kind==='enemy'?1100:900,time:performance.now()};if(scene){scene.foes=(s?.enemies||[]).map(e=>({...e}));scene.box.querySelector('.pixel-caption').textContent=label;draw(action.time);}}
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

  let previewAnimation=0;
  globalThis.arcanaPreviewAttack=function(type=scene?.weapon||weapon){
    if(!weaponOrder.includes(type))return;
    cancelAnimationFrame(previewAnimation);
    let dialog=document.getElementById('attack-motion-preview');
    if(!dialog){dialog=document.createElement('dialog');dialog.id='attack-motion-preview';dialog.className='weapon-art-dialog';dialog.setAttribute('aria-label','武器別の攻撃モーション');document.body.append(dialog);dialog.addEventListener('close',()=>cancelAnimationFrame(previewAnimation));}
    dialog.innerHTML='<div class="weapon-art-titlebar"><h2>'+esc(type)+' · '+attacks[type].name+'</h2><button type="button" onclick="document.getElementById(\'attack-motion-preview\').close()">閉じる ×</button></div><div class="choices">'+weaponOrder.map(w=>'<button type="button" class="'+(w===type?'chosen':'')+'" onclick="arcanaPreviewAttack(\''+w+'\')">'+esc(w)+'</button>').join('')+'</div><p>溜め → 攻撃 → 振り抜き。武器を切り替えて演出を確認できます。</p><canvas width="960" height="304" role="img" aria-label="'+esc(type)+'の攻撃モーション"></canvas>';
    const canvas=dialog.querySelector('canvas'),ctx=canvas.getContext('2d'),start=performance.now(),spec=attacks[type];
    function paint(now){
      if(!dialog.open||!canvas.isConnected)return;
      const elapsed=(now-start)%(spec.duration+650),p=reduced.matches?spec.impact+.03:Math.min(1,elapsed/spec.duration);
      ctx.setTransform(2,0,0,2,0,0);ctx.clearRect(0,0,480,152);
      const bg=ctx.createLinearGradient(0,0,0,152);bg.addColorStop(0,'#122a3b');bg.addColorStop(1,'#060d18');ctx.fillStyle=bg;ctx.fillRect(0,0,480,152);
      ctx.strokeStyle='#b6c3cf30';ctx.beginPath();ctx.moveTo(0,124);ctx.lineTo(480,124);ctx.stroke();
      const active=elapsed<spec.duration||reduced.matches,x=96+(type==='弓'?0:attackTravel(type,p)*Math.max(0,344-96-spec.reach));
      ctx.fillStyle='#0c0b1599';ctx.beginPath();ctx.ellipse(x,121,22,3,0,0,Math.PI*2);ctx.fill();
      if(active)attackHero(ctx,type,x,120,p);else groundedSprite(ctx,armedSheet,3,2,weaponOrder.indexOf(type),96,122,103,spriteGeometry.armed);
      ctx.save();ctx.translate(344,83);ctx.strokeStyle=spec.color;ctx.fillStyle='#253a50';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(0,-20);ctx.lineTo(13,0);ctx.lineTo(0,22);ctx.lineTo(-13,0);ctx.closePath();ctx.fill();ctx.stroke();ctx.restore();
      if(active)weaponEffects(ctx,type,96,344,p);
      ctx.fillStyle='#e8d9b0';ctx.font='8px sans-serif';ctx.fillText(reduced.matches?'攻撃ポーズ':!active?'構え':p<spec.impact?'溜め':p<spec.impact+.15?'攻撃':'振り抜き',14,18);
      if(!reduced.matches)previewAnimation=requestAnimationFrame(paint);
    }
    if(!dialog.open)dialog.showModal();paint(start);
    if(reduced.matches&&!attackSheet.complete)attackSheet.addEventListener('load',()=>paint(start),{once:true});
  };
  globalThis.arcanaOpenWeaponArt=function(type=scene?.weapon||weapon){
    if(!weaponOrder.includes(type))return;
    let dialog=document.getElementById('weapon-art-preview');
    if(!dialog){dialog=document.createElement('dialog');dialog.id='weapon-art-preview';dialog.className='weapon-art-dialog';dialog.setAttribute('aria-labelledby','weapon-art-title');document.body.append(dialog);}
    dialog.innerHTML='<div class="weapon-art-titlebar"><h2 id="weapon-art-title">'+esc(type)+'の装備イラスト</h2><button onclick="document.getElementById(\'weapon-art-preview\').close()">閉じる ×</button></div><div class="choices">'+weaponOrder.map(w=>'<button class="'+(w===type?'chosen':'')+'" onclick="arcanaOpenWeaponArt(\''+w+'\')">'+esc(w)+'</button>').join('')+'</div><p>武器を握った専用イラストを拡大して確認できます。</p><canvas width="900" height="900" role="img" aria-label="'+esc(type)+'を握る白髪の冒険者"></canvas>';
    const canvas=dialog.querySelector('canvas'),context=canvas.getContext('2d'),index=weaponOrder.indexOf(type);
    function paint(){if(!canvas.isConnected)return;context.clearRect(0,0,900,900);context.imageSmoothingEnabled=true;context.imageSmoothingQuality='high';groundedSprite(context,armedSheet,3,2,index,450,865,800,spriteGeometry.armed);}
    if(armedSheet.complete&&armedSheet.naturalWidth)paint();else armedSheet.addEventListener('load',paint,{once:true});
    if(!dialog.open)dialog.showModal();
  };

  // Initial page may already have a resumed adventure.
  if(s?.phase==='battle')mount('battle');else if(s?.phase==='explore')mount('explore');
})();


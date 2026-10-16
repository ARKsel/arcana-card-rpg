/* ARCANA pixel theatre. Visuals observe the game; rules and saves stay in game.js. */
(() => {
  'use strict';
  const colors = {火:'#ff975b',氷:'#9eeaff',雷:'#ffe879',風:'#8df0b8',土:'#d8ba83',光:'#fff2bf',闇:'#c59aff'};
  const heroineSheet=new Image();heroineSheet.src='heroine-reference-v1.png';
  const armedSheet=new Image();armedSheet.src='heroine-weapons-v2.png';
  const walkingSheet=new Image();walkingSheet.src='heroine-walk-v2.png';
  const motionIds={'片手剣':'sword','大剣':'greatsword','短剣':'daggers','弓':'bow','槍':'spear','戦槌':'hammer'};
  const motionGeometry={"spear":{"cw":768,"frames":[{"top":58,"h":395,"left":159,"x":159,"y":58,"foot":450,"anchor":320,"w":364},{"top":64,"h":389,"left":130,"x":898,"y":64,"foot":450,"anchor":320,"w":411},{"top":79,"h":374,"left":105,"x":1641,"y":79,"foot":450,"anchor":320,"w":436},{"top":84,"h":370,"left":133,"x":2437,"y":84,"foot":450,"anchor":320,"w":439},{"top":101,"h":352,"left":163,"x":163,"y":613,"foot":450,"anchor":320,"w":484},{"top":82,"h":371,"left":183,"x":951,"y":594,"foot":450,"anchor":320,"w":398},{"top":57,"h":396,"left":155,"x":1691,"y":569,"foot":450,"anchor":320,"w":365},{"top":60,"h":393,"left":159,"x":2463,"y":572,"foot":450,"anchor":320,"w":362}],"height":1024,"ch":512,"width":3072},"daggers":{"cw":768,"frames":[{"top":46,"h":407,"left":162,"x":162,"y":46,"foot":450,"anchor":320,"w":348},{"top":80,"h":373,"left":164,"x":932,"y":80,"foot":450,"anchor":320,"w":366},{"top":64,"h":389,"left":149,"x":1685,"y":64,"foot":450,"anchor":320,"w":386},{"top":76,"h":377,"left":140,"x":2444,"y":76,"foot":450,"anchor":320,"w":407},{"top":87,"h":369,"left":143,"x":143,"y":599,"foot":450,"anchor":320,"w":428},{"top":67,"h":386,"left":155,"x":923,"y":579,"foot":450,"anchor":320,"w":401},{"top":81,"h":372,"left":167,"x":1703,"y":593,"foot":450,"anchor":320,"w":320},{"top":41,"h":412,"left":157,"x":2461,"y":553,"foot":450,"anchor":320,"w":353}],"height":1024,"ch":512,"width":3072},"sword":{"cw":768,"frames":[{"top":50,"h":403,"left":168,"x":168,"y":50,"foot":450,"anchor":320,"w":316},{"top":63,"h":390,"left":77,"x":845,"y":63,"foot":450,"anchor":320,"w":399},{"top":72,"h":381,"left":70,"x":1606,"y":72,"foot":450,"anchor":320,"w":381},{"top":72,"h":381,"left":70,"x":2374,"y":72,"foot":450,"anchor":320,"w":381},{"top":103,"h":356,"left":109,"x":109,"y":615,"foot":450,"anchor":320,"w":567},{"top":103,"h":356,"left":109,"x":877,"y":615,"foot":450,"anchor":320,"w":567},{"top":60,"h":393,"left":166,"x":1702,"y":572,"foot":450,"anchor":320,"w":409},{"top":50,"h":403,"left":170,"x":2474,"y":562,"foot":450,"anchor":320,"w":321}],"height":1024,"ch":512,"width":3072},"bow":{"cw":768,"frames":[{"top":46,"h":407,"left":156,"x":156,"y":46,"foot":450,"anchor":320,"w":369},{"top":19,"h":434,"left":134,"x":902,"y":19,"foot":450,"anchor":320,"w":391},{"top":19,"h":434,"left":134,"x":1670,"y":19,"foot":450,"anchor":320,"w":391},{"top":21,"h":432,"left":157,"x":2461,"y":21,"foot":450,"anchor":320,"w":368},{"top":16,"h":437,"left":150,"x":150,"y":528,"foot":450,"anchor":320,"w":393},{"top":20,"h":433,"left":148,"x":916,"y":532,"foot":450,"anchor":320,"w":348},{"top":45,"h":408,"left":157,"x":1693,"y":557,"foot":450,"anchor":320,"w":350},{"top":44,"h":409,"left":157,"x":2461,"y":556,"foot":450,"anchor":320,"w":366}],"height":1024,"ch":512,"width":3072},"greatsword":{"cw":768,"frames":[{"top":73,"h":380,"left":177,"x":177,"y":73,"foot":450,"anchor":320,"w":419},{"top":20,"h":433,"left":153,"x":921,"y":20,"foot":450,"anchor":320,"w":382},{"top":58,"h":395,"left":169,"x":1705,"y":58,"foot":450,"anchor":320,"w":429},{"top":13,"h":440,"left":146,"x":2450,"y":13,"foot":450,"anchor":320,"w":332},{"top":91,"h":362,"left":168,"x":168,"y":603,"foot":450,"anchor":320,"w":438},{"top":142,"h":311,"left":176,"x":944,"y":654,"foot":450,"anchor":320,"w":453},{"top":60,"h":393,"left":161,"x":1697,"y":572,"foot":450,"anchor":320,"w":398},{"top":73,"h":380,"left":177,"x":2481,"y":585,"foot":450,"anchor":320,"w":419}],"height":1024,"ch":512,"width":3072},"hammer":{"cw":768,"frames":[{"top":114,"h":339,"left":169,"x":169,"y":114,"foot":450,"anchor":320,"w":382},{"top":37,"h":416,"left":154,"x":922,"y":37,"foot":450,"anchor":320,"w":347},{"top":63,"h":390,"left":166,"x":1702,"y":63,"foot":450,"anchor":320,"w":294},{"top":38,"h":415,"left":158,"x":2462,"y":38,"foot":450,"anchor":320,"w":317},{"top":161,"h":292,"left":198,"x":198,"y":673,"foot":450,"anchor":320,"w":376},{"top":155,"h":298,"left":193,"x":961,"y":667,"foot":450,"anchor":320,"w":395},{"top":50,"h":403,"left":161,"x":1697,"y":562,"foot":450,"anchor":320,"w":381},{"top":114,"h":339,"left":168,"x":2472,"y":626,"foot":450,"anchor":320,"w":381}],"height":1024,"ch":512,"width":3072}};
  const motionImages={};
  function motionImage(type){const id=motionIds[type]||'sword';if(!motionImages[id]){const image=new Image();image.src='attack-'+id+'-v2.png';motionImages[id]=image;}return motionImages[id];}
  const attacks={
    '片手剣':{duration:1080,impact:.45,reach:63,color:'#bcecff',name:'蒼白の弧'},
    '大剣':{duration:1380,impact:.5,reach:72,color:'#ffe4ab',name:'断空の一撃'},
    '短剣':{duration:960,impact:.43,reach:53,color:'#dfb8ff',name:'紫閃の双刃'},
    '弓':{duration:1260,release:.44,impact:.7,reach:0,color:'#b8f4ca',name:'風を裂く矢'},
    '槍':{duration:1100,impact:.45,reach:78,color:'#9ee8ff',name:'蒼穹の刺突'},
    '戦槌':{duration:1440,impact:.51,reach:65,color:'#ffd294',name:'砕地の波紋'}
  };
  const ease=t=>{t=Math.max(0,Math.min(1,t));return t*t*(3-2*t);};
  function attackTravel(type,p){
    if(type==='弓')return 0;
    if(type==='片手剣'||type==='大剣')return ease((p-.04)/.27)*(1-ease((p-.78)/.22));
    const impact=(attacks[type]||attacks['片手剣']).impact;
    return ease((p-.08)/(impact-.1))*(1-ease((p-.64)/.36));
  }
  function motionFrame(type,p){
    const a=attacks[type]||attacks['片手剣'];
    const times=type==='弓'?[0,.07,.17,.25,.34,a.release,.62,.89]:[0,.07,.17,a.impact-.14,a.impact-.025,a.impact+.10,a.impact+.24,.9];
    let cell=0;for(let i=1;i<8;i++)if(p>=times[i])cell=i;return cell;
  }
  function poseFrame(type,cell){
    // The sword's old contact cells were a thrust, incompatible with its raised blade.
    // Greatsword begins and ends in the same lifted two-handed guard.
    if(type==='片手剣')return [0,1,2,2,6,6,0,0][cell];
    if(type==='大剣')return [1,1,2,2,4,5,6,1][cell];
    return cell===7?0:cell;
  }
  function motionScale(type,height=103){const d=motionGeometry[motionIds[type]];return Math.min(height/(d.ch*.64),110/Math.max(...d.frames.map(g=>g.foot-g.top)));}
  function motionSprite(ctx,type,x,y,cell,height=103,lean=0){
    const image=motionImage(type),data=motionGeometry[motionIds[type]],f=data?.frames[poseFrame(type,cell)];
    if(!f||!image.complete||!image.naturalWidth)return false;
    const scale=motionScale(type,height);
    ctx.save();ctx.translate(x,y);ctx.transform(1,0,lean,1,0,0);
    ctx.drawImage(image,f.x,f.y,f.w,f.h,(f.left-f.anchor)*scale,(f.top-f.foot)*scale,f.w*scale,f.h*scale);ctx.restore();return true;
  }
  function motionExtents(type,height=103){
    const d=motionGeometry[motionIds[type]];if(!d)return{left:40,right:60};const scale=Math.min(height/(d.ch*.64),110/Math.max(...d.frames.map(f=>f.foot-f.top)));
    return{left:Math.max(...d.frames.map(f=>(f.anchor-f.left)*scale))+7,right:Math.max(...d.frames.map(f=>(f.left+f.w-f.anchor)*scale))+7};
  }
  function attackHero(ctx,type,x,y,p,height=103){
    const a=attacks[type]||attacks['片手剣'],drive=ease((p-.12)/(a.impact-.12))*(1-ease((p-.62)/.38));
    // A single opaque pose plus continuous torso shear and planted feet, never a crossfade.
    const lean=type==='弓'?.012*Math.sin(p*Math.PI):type==='片手剣'||type==='大剣'?0:-.045*drive;
    if(!motionSprite(ctx,type,x,y,motionFrame(type,p),height,lean))groundedSprite(ctx,armedSheet,3,2,Math.max(0,weaponOrder.indexOf(type)),x,y+2,height,spriteGeometry.armed);
  }
  function arrowShot(origin,target,p,baseline=120){
    const a=attacks['弓'],flight=(p-a.release)/(a.impact-a.release);
    if(flight<0||flight>1)return null;
    // Authored tip/nock points in the padded bow aiming cell, including its torso shear.
    const scale=motionScale('弓'),lean=.012*Math.sin(a.release*Math.PI);
    const sx=origin+((535-320)+lean*(150-450))*scale,sy=baseline+(150-450)*scale;
    const dx=target-sx,dy=baseline-38-sy;
    return{x:sx+dx*flight,y:sy+dy*flight*flight,angle:Math.atan2(2*dy*flight,dx),shaft:70*scale,trail:Math.min(38,Math.max(0,Math.abs(dx)*flight-70*scale)),flight,sx,sy};
  }
  function glow(ctx,x,y,r,color,alpha=1){
    ctx.save();ctx.globalAlpha*=alpha;const g=ctx.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,'#fffce9');g.addColorStop(.18,color);g.addColorStop(1,color+'00');ctx.fillStyle=g;ctx.fillRect(x-r,y-r,r*2,r*2);ctx.restore();
  }
  function ribbon(ctx,x,y,angle,progress,color,size=1){
    if(progress<0||progress>1)return;
    const head=ease(Math.min(1,progress*2.1)),tail=ease(Math.max(0,(progress-.18)/.82));
    ctx.save();ctx.translate(x,y);ctx.rotate(angle);ctx.scale(size,size);ctx.globalAlpha*=Math.sin(Math.PI*Math.min(1,progress*1.1));
    const a=-2.5+head*3.9,b=-2.5+tail*3.9;
    ctx.beginPath();ctx.ellipse(-8,0,40,20,0,b,a);ctx.ellipse(-8,-1,34,15,0,a,b,true);ctx.closePath();
    const gradient=ctx.createLinearGradient(-40,-20,35,20);gradient.addColorStop(0,color+'00');gradient.addColorStop(.5,color+'aa');gradient.addColorStop(1,'#ffffff');ctx.fillStyle=gradient;ctx.fill();
    ctx.lineWidth=1;ctx.strokeStyle='#f5fdff';ctx.beginPath();ctx.ellipse(-8,0,40,20,0,Math.max(b,a-.5),a);ctx.stroke();ctx.restore();
  }
  function weaponEffects(ctx,type,origin,target,p,baseline=120){
    const a=attacks[type]||attacks['片手剣'],q=(p-a.impact)/.36,y=baseline-38;
    ctx.save();ctx.lineCap='round';ctx.lineJoin='round';ctx.globalCompositeOperation='lighter';
    const line=(x1,y1,x2,y2,color,width)=>{ctx.strokeStyle=color;ctx.lineWidth=width;ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke();};
    if(type==='片手剣')ribbon(ctx,target-3,y,.62,(p-a.impact+.13)/.43,a.color,1.05);
    if(type==='大剣')ribbon(ctx,target-4,y,.86,(p-a.impact+.14)/.47,a.color,1.35);
    if(type==='短剣'){ribbon(ctx,target-2,y,-.7,(p-a.impact+.12)/.32,a.color,.8);ribbon(ctx,target+2,y,.7,(p-a.impact-.015)/.31,'#e7c9ff',.8);}
    if(type==='弓'){
      const shot=arrowShot(origin,target,p,baseline);
      if(shot){ctx.save();ctx.translate(shot.x,shot.y);ctx.rotate(shot.angle);
        if(shot.trail>0){const end=-shot.shaft,start=end-shot.trail,g=ctx.createLinearGradient(start,0,end,0);g.addColorStop(0,a.color+'00');g.addColorStop(1,a.color+'bb');line(start,0,end,0,g,1.5);}
        line(-shot.shaft,0,-1,0,'#f8ffe5',1.2);line(-4,-2.5,0,0,'#f8ffe5',1);line(-4,2.5,0,0,'#f8ffe5',1);glow(ctx,0,0,4,a.color,.35);ctx.restore();
      }
    }
    if(type==='槍'&&q>-.22&&q<.55){const f=ease((q+.22)/.77);ctx.globalAlpha=1-f;
      const g=ctx.createLinearGradient(target-82,y,target+24,y);g.addColorStop(0,a.color+'00');g.addColorStop(.8,a.color);g.addColorStop(1,'#ffffff');
      ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(target-82,y-1);ctx.lineTo(target+13,y-5);ctx.lineTo(target+26,y);ctx.lineTo(target+13,y+5);ctx.closePath();ctx.fill();line(target-65,y,target+22,y,'#ffffff',1);
    }
    if(q>=0&&q<1){const fade=1-ease(q),ground=type==='戦槌';ctx.globalAlpha=fade;
      glow(ctx,target,ground?baseline-3:y,ground?21:16,a.color,.68*(1-q));
      const count=ground?16:type==='大剣'?13:8;
      for(let i=0;i<count;i++){const angle=i*2.399+.3,dist=5+ease(q)*(ground?39:27),px=target+Math.cos(angle)*dist,py=(ground?baseline-3:y)+Math.sin(angle)*dist*.64+q*q*10;
        if(ground){ctx.fillStyle=i%2?'#e3b87f':'#9a8265';ctx.save();ctx.translate(px,py-Math.sin(q*Math.PI)*13);ctx.rotate(angle+q*3);ctx.fillRect(-1.5,-1.2,3,2.4);ctx.restore();}
        else line(px,py,px+Math.cos(angle)*(3+3*(1-q)),py+Math.sin(angle)*3,i%3?a.color:'#ffffff',i%3?.65:1.4);
      }
      if(ground){for(let k=0;k<2;k++){ctx.globalAlpha=fade*(1-k*.3);ctx.strokeStyle=a.color;ctx.lineWidth=1.5-k*.6;ctx.beginPath();ctx.ellipse(target,baseline+1,9+q*(49-k*12),2+q*(11-k*3),0,.1,Math.PI*1.85);ctx.stroke();}}
      else{line(target-3,y-10*(1-q),target+3,y+10*(1-q),'#ffffff',1.2);line(target-13*(1-q),y+3,target+13*(1-q),y-3,a.color,1);}
    }
    ctx.restore();
  }

  const weaponOrder=['片手剣','大剣','短剣','弓','槍','戦槌'];
  const spriteGeometry={"armed":{"width":1536,"height":1024,"cols":3,"rows":2,"referenceHeight":502,"frames":[{"left":87,"top":10,"right":467,"bottom":512,"anchorX":270,"sourceX":0,"sourceY":0},{"left":84,"top":10,"right":407,"bottom":512,"anchorX":264,"sourceX":512,"sourceY":0},{"left":55,"top":10,"right":380,"bottom":512,"anchorX":242,"sourceX":1024,"sourceY":0},{"left":102,"top":0,"right":531,"bottom":486,"anchorX":287,"sourceX":0,"sourceY":512,"clips":[[0,0,512,512],[512,120,19,40]]},{"left":63,"top":-14,"right":504,"bottom":486,"anchorX":271,"sourceX":512,"sourceY":512,"clips":[[45,0,467,512],[467,-14,45,14]]},{"left":69,"top":2,"right":493,"bottom":486,"anchorX":279,"sourceX":1024,"sourceY":512}],"rowReferenceHeights":[502,490]},"walk":{"width":1774,"height":887,"cols":4,"rows":2,"referenceHeight":436,"frames":[{"left":59,"top":8,"right":437,"bottom":444,"anchorX":280,"hand":[395.96,207.33],"sourceX":0,"sourceY":0},{"left":74,"top":8,"right":306,"bottom":444,"anchorX":259,"hand":[294.27,213.96],"sourceX":444,"sourceY":0},{"left":50,"top":7,"right":305,"bottom":444,"anchorX":246,"hand":[288.78,219.13],"sourceX":887,"sourceY":0},{"left":38,"top":8,"right":389,"bottom":444,"anchorX":233,"hand":[331.61,203.88],"sourceX":1330,"sourceY":0},{"left":60,"top":19,"right":444,"bottom":427,"anchorX":247,"hand":[128.16,193.95],"sourceX":0,"sourceY":444},{"left":154,"top":10,"right":405,"bottom":426,"anchorX":214,"hand":[165.21,207.24],"sourceX":444,"sourceY":444},{"left":128,"top":10,"right":386,"bottom":430,"anchorX":190,"hand":[146.64,212.86],"sourceX":887,"sourceY":444},{"left":56,"top":13,"right":382,"bottom":429,"anchorX":209,"hand":[108.85,197.83],"sourceX":1330,"sourceY":444}],"rowReferenceHeights":[436,415]}};
  const enemySheet=new Image();enemySheet.src='character-art-v1.png';
  const combatAtlasGeometry={"enemies-v3":{"frames":[{"path":"enemies-v3/0.png","x":0,"y":0,"w":257,"h":163,"anchor":109.45431034482759,"foot":150,"pixels":18061},{"path":"enemies-v3/1.png","x":0,"y":0,"w":175,"h":233,"anchor":99.59173553719009,"foot":220,"pixels":12305},{"path":"enemies-v3/2.png","x":0,"y":0,"w":243,"h":189,"anchor":113.50625711035268,"foot":176,"pixels":23481},{"path":"enemies-v3/3.png","x":0,"y":0,"w":221,"h":231,"anchor":140.5992277992278,"foot":218,"pixels":23135},{"path":"enemies-v3/4.png","x":0,"y":0,"w":264,"h":216,"anchor":139.08407437348424,"foot":203,"pixels":24161},{"path":"enemies-v3/5.png","x":0,"y":0,"w":244,"h":215,"anchor":123.0912330719886,"foot":202,"pixels":19285},{"path":"enemies-v3/6.png","x":0,"y":0,"w":223,"h":220,"anchor":119.88589743589743,"foot":207,"pixels":15737},{"path":"enemies-v3/7.png","x":0,"y":0,"w":247,"h":207,"anchor":105.9322033898305,"foot":194,"pixels":13329},{"path":"enemies-v3/8.png","x":0,"y":0,"w":271,"h":212,"anchor":137.1290322580645,"foot":199,"pixels":24017},{"path":"enemies-v3/9.png","x":0,"y":0,"w":268,"h":227,"anchor":142.89986648865153,"foot":214,"pixels":18801},{"path":"enemies-v3/10.png","x":0,"y":0,"w":241,"h":222,"anchor":118.44186046511628,"foot":209,"pixels":19270},{"path":"enemies-v3/11.png","x":0,"y":0,"w":183,"h":230,"anchor":108.72260869565217,"foot":217,"pixels":15996},{"path":"enemies-v3/12.png","x":0,"y":0,"w":256,"h":180,"anchor":122.1660777385159,"foot":167,"pixels":18323},{"path":"enemies-v3/13.png","x":0,"y":0,"w":297,"h":227,"anchor":139.36036036036037,"foot":214,"pixels":22383},{"path":"enemies-v3/14.png","x":0,"y":0,"w":285,"h":207,"anchor":163.72861842105263,"foot":194,"pixels":25981},{"path":"enemies-v3/15.png","x":0,"y":0,"w":204,"h":200,"anchor":96.8110599078341,"foot":187,"pixels":11960},{"path":"enemies-v3/16.png","x":0,"y":0,"w":242,"h":210,"anchor":144.64137931034483,"foot":197,"pixels":18781},{"path":"enemies-v3/17.png","x":0,"y":0,"w":224,"h":200,"anchor":68.87254901960785,"foot":187,"pixels":18767},{"path":"enemies-v3/18.png","x":0,"y":0,"w":251,"h":172,"anchor":114.94972067039106,"foot":159,"pixels":18600},{"path":"enemies-v3/19.png","x":0,"y":0,"w":279,"h":207,"anchor":166.9120879120879,"foot":194,"pixels":18737},{"path":"enemies-v3/20.png","x":0,"y":0,"w":255,"h":191,"anchor":151.30935251798562,"foot":178,"pixels":20161},{"path":"enemies-v3/21.png","x":0,"y":0,"w":235,"h":210,"anchor":124.08211143695014,"foot":197,"pixels":16196},{"pixels":83706,"w":537,"foot":467,"path":"enemies-v3/22.png","h":480,"y":0,"x":0,"anchor":302.37097196751375},{"pixels":85414,"w":442,"foot":473,"path":"enemies-v3/23.png","h":486,"y":0,"x":0,"anchor":237.65158648925282},{"path":"enemies-v3/24.png","x":0,"y":0,"w":255,"h":231,"anchor":153.5492565055762,"foot":218,"pixels":24955},{"path":"enemies-v3/25.png","x":0,"y":0,"w":251,"h":220,"anchor":149.9908536585366,"foot":207,"pixels":19805},{"path":"enemies-v3/26.png","x":0,"y":0,"w":261,"h":227,"anchor":119.71398747390397,"foot":214,"pixels":25411},{"path":"enemies-v3/27.png","x":0,"y":0,"w":256,"h":186,"anchor":96.41909196740396,"foot":173,"pixels":23831},{"pixels":110091,"w":593,"foot":473,"path":"enemies-v3/28.png","h":486,"y":0,"x":0,"anchor":241.76453674121404},{"pixels":162842,"w":651,"foot":474,"path":"enemies-v3/29.png","h":487,"y":0,"x":0,"anchor":211.12315841748054}]},"bosses-v3":{"frames":[{"path":"bosses-v3/0.png","x":0,"y":0,"w":255,"h":286,"anchor":138.96080218778488,"foot":273,"pixels":30276},{"path":"bosses-v3/1.png","x":0,"y":0,"w":293,"h":294,"anchor":153.23890339425589,"foot":281,"pixels":43144},{"path":"bosses-v3/2.png","x":0,"y":0,"w":301,"h":291,"anchor":160.56543037088872,"foot":278,"pixels":47500},{"path":"bosses-v3/3.png","x":0,"y":0,"w":285,"h":296,"anchor":141.35861856305888,"foot":283,"pixels":43525},{"path":"bosses-v3/4.png","x":0,"y":0,"w":289,"h":288,"anchor":139.84429065743944,"foot":275,"pixels":34038},{"path":"bosses-v3/5.png","x":0,"y":0,"w":268,"h":292,"anchor":117.29642647920328,"foot":279,"pixels":38592},{"path":"bosses-v3/6.png","x":0,"y":0,"w":312,"h":284,"anchor":161.3391583452211,"foot":271,"pixels":39841},{"path":"bosses-v3/7.png","x":0,"y":0,"w":278,"h":297,"anchor":125.7662129703763,"foot":284,"pixels":38409},{"path":"bosses-v3/8.png","x":0,"y":0,"w":301,"h":286,"anchor":149.04753363228699,"foot":273,"pixels":35586},{"path":"bosses-v3/9.png","x":0,"y":0,"w":290,"h":278,"anchor":145.77707930367504,"foot":265,"pixels":44668},{"path":"bosses-v3/10.png","x":0,"y":0,"w":280,"h":280,"anchor":141.6920343500148,"foot":267,"pixels":39093},{"path":"bosses-v3/11.png","x":0,"y":0,"w":301,"h":286,"anchor":173.14103110353642,"foot":273,"pixels":43345},{"path":"bosses-v3/12.png","x":0,"y":0,"w":285,"h":288,"anchor":143.9214891264283,"foot":275,"pixels":35659},{"path":"bosses-v3/13.png","x":0,"y":0,"w":305,"h":284,"anchor":168.60989533777354,"foot":271,"pixels":44794},{"path":"bosses-v3/14.png","x":0,"y":0,"w":281,"h":283,"anchor":140.57751277683136,"foot":270,"pixels":39652},{"path":"bosses-v3/15.png","x":0,"y":0,"w":283,"h":307,"anchor":168.4780999383097,"foot":294,"pixels":37958},{"path":"bosses-v3/16.png","x":0,"y":0,"w":312,"h":307,"anchor":156.15267175572518,"foot":294,"pixels":32809},{"path":"bosses-v3/17.png","x":0,"y":0,"w":278,"h":293,"anchor":109.7717576791809,"foot":280,"pixels":42619},{"path":"bosses-v3/18.png","x":0,"y":0,"w":282,"h":298,"anchor":149.4366576819407,"foot":285,"pixels":36456},{"path":"bosses-v3/19.png","x":0,"y":0,"w":307,"h":305,"anchor":148.15150316455697,"foot":292,"pixels":49298}]},"support-poses-v4":{"frames":[{"path":"support-poses-v4/0.png","x":0,"y":0,"w":212,"h":275,"anchor":132.92911392405063,"foot":262,"pixels":23366},{"path":"support-poses-v4/1.png","x":0,"y":0,"w":270,"h":273,"anchor":138.92307692307693,"foot":260,"pixels":27078},{"path":"support-poses-v4/2.png","x":0,"y":0,"w":215,"h":276,"anchor":126.28280358598207,"foot":263,"pixels":23667},{"path":"support-poses-v4/3.png","x":0,"y":0,"w":194,"h":279,"anchor":111.18827160493827,"foot":266,"pixels":21992},{"path":"support-poses-v4/4.png","x":0,"y":0,"w":195,"h":281,"anchor":119.90678824721378,"foot":268,"pixels":22532},{"path":"support-poses-v4/5.png","x":0,"y":0,"w":190,"h":279,"anchor":115.4402332361516,"foot":266,"pixels":22099},{"path":"support-poses-v4/6.png","x":0,"y":0,"w":240,"h":262,"anchor":137.59574468085106,"foot":249,"pixels":25011},{"path":"support-poses-v4/7.png","x":0,"y":0,"w":223,"h":265,"anchor":126.50499545867393,"foot":252,"pixels":23390},{"path":"support-poses-v4/8.png","x":0,"y":0,"w":227,"h":262,"anchor":129.08985765124555,"foot":249,"pixels":24025},{"path":"support-poses-v4/9.png","x":0,"y":0,"w":243,"h":260,"anchor":164.07014028056113,"foot":247,"pixels":21961},{"path":"support-poses-v4/10.png","x":0,"y":0,"w":285,"h":249,"anchor":202.2404255319149,"foot":236,"pixels":24619},{"path":"support-poses-v4/11.png","x":0,"y":0,"w":211,"h":267,"anchor":122.90942360475755,"foot":254,"pixels":21873},{"path":"support-poses-v4/12.png","x":0,"y":0,"w":206,"h":278,"anchor":124.10469314079423,"foot":265,"pixels":23261},{"path":"support-poses-v4/13.png","x":0,"y":0,"w":219,"h":279,"anchor":135.11824324324326,"foot":266,"pixels":24213},{"path":"support-poses-v4/14.png","x":0,"y":0,"w":209,"h":276,"anchor":128.60255319148936,"foot":263,"pixels":23306},{"path":"support-poses-v4/15.png","x":0,"y":0,"w":227,"h":280,"anchor":146.0573566084788,"foot":267,"pixels":25895},{"path":"support-poses-v4/16.png","x":0,"y":0,"w":224,"h":279,"anchor":135.05208333333334,"foot":266,"pixels":24672},{"path":"support-poses-v4/17.png","x":0,"y":0,"w":205,"h":280,"anchor":124.90381282495667,"foot":267,"pixels":23209},{"path":"support-poses-v4/18.png","x":0,"y":0,"w":214,"h":273,"anchor":126.48181011535048,"foot":260,"pixels":23772},{"path":"support-poses-v4/19.png","x":0,"y":0,"w":216,"h":269,"anchor":123.02588686481305,"foot":256,"pixels":23089},{"path":"support-poses-v4/20.png","x":0,"y":0,"w":214,"h":273,"anchor":127.55309734513274,"foot":260,"pixels":23322},{"path":"support-poses-v4/21.png","x":0,"y":0,"w":217,"h":268,"anchor":134.23941068139962,"foot":255,"pixels":23224},{"path":"support-poses-v4/22.png","x":0,"y":0,"w":240,"h":265,"anchor":146.01575532900833,"foot":252,"pixels":24047},{"path":"support-poses-v4/23.png","x":0,"y":0,"w":208,"h":273,"anchor":128.1136783733826,"foot":260,"pixels":22092}],"standingHeight":250}};
  const combatImageCache=new Map();
  function combatImage(path){if(!combatImageCache.has(path)){const image=new Image();image.src='assets/combat-art-v3/'+path;combatImageCache.set(path,image);}return combatImageCache.get(path);}
  for(const frame of combatAtlasGeometry['support-poses-v4'].frames)combatImage(frame.path);
  const supportSequences={magic:[0,1,1,2],heal:[3,4,4,5],guard:[6,7,7,8],evade:[9,10,10,11],focus:[12,13,13,14],draw:[15,16,16,17],recharge:[18,19,19,20],cleanse:[21,22,22,23]};
  function isolatedCombatSprite(ctx,image,frame,x,y,scale){
    if(!frame||!image.complete||!image.naturalWidth)return false;
    ctx.drawImage(image,frame.x,frame.y,frame.w,frame.h,x+(frame.x-frame.anchor)*scale,y+(frame.y-frame.foot)*scale,frame.w*scale,frame.h*scale);
    return true;
  }
  function cardMotionKind(card){
    const e=card.e;
    if(e.hit)return magics.includes(card.g)?'magic':'attack';
    if(e.recoverEnergy||e.recoverMana)return 'recharge';
    if(e.heal||e.drain)return 'heal';
    if(e.cleanse)return 'cleanse';
    if(e.evade&&!e.block)return 'evade';
    if(e.block||e.reduce||e.counter||e.carry)return 'guard';
    if(e.draw||e.discard)return 'draw';
    if(e.buff||e.weaponBuff||e.magicBuff||e.discount)return 'focus';
    return magics.includes(card.g)?'magic':'focus';
  }
  function cardSpellStyle(card){
    const e=card.e;
    return e.all?'storm':e.freeze?'prison':e.times?'barrage':e.pierce?'beam':['bolt','burst','sigil','beam'][card.id%4];
  }
  function supportFrameIndex(kind,p){
    const sequence=supportSequences[kind];if(!sequence)return -1;
    // Anticipate, hold the appropriate action, then recover. Exhaust is an
    // effect overlay and must never replace a healing/guarding/casting pose.
    return sequence[p<.22?0:p<.50?1:p<.78?2:3];
  }
  function supportHero(ctx,kind,p){
    const frames=combatAtlasGeometry['support-poses-v4'].frames,cell=supportFrameIndex(kind,p);
    if(cell<0)return false;
    const scale=103/combatAtlasGeometry['support-poses-v4'].standingHeight;
    const ease=Math.sin(Math.PI*Math.max(0,Math.min(1,p)));
    ctx.save();
    // Keep soles anchored. Only the actual evasive step travels backward;
    // recovery, guard and card drawing do not float or rotate off balance.
    ctx.translate(kind==='evade'&&!reduced.matches?-ease*8:0,0);
    const drawn=isolatedCombatSprite(ctx,combatImage(frames[cell].path),frames[cell],0,1,scale);
    ctx.restore();return drawn;
  }
  function enemyAtlasFrame(enemy){
    if(enemy.bossArtIndex>=0){const frame=combatAtlasGeometry['bosses-v3'].frames[enemy.bossArtIndex];return {image:combatImage(frame.path),frame};}
    const order=['獣','植物','機械','人型','竜族','精霊','昆虫','不死','魔族','幻獣'];
    const named={'森牙の狼':0,'角冠の大鹿':1,'洞窟熊':2,'歩く古樹':3,'喰らい蔓':4,'苔の番兵':5,'遺跡の自動兵':6,'巡回ドローン':7,'古式戦闘機':8,'白銀の騎士':9,'幼き地竜':12,'翼蛇':13,'焔の眷属':15,'雷雲の精霊':17,'甲殻の大蟲':18,'洞窟の毒蜘蛛':19,'石棺の亡者':23,'霧の幻狼':27,'星角の麒麟':28};
    const name=String(enemy.n||'').replace(/・.*$/,'').replace(/\s+\d+$/,'');
    const hash=Array.from(name).reduce((n,ch)=>(n*31+ch.charCodeAt(0))>>>0,0);
    const cell=named[name]??Math.max(0,order.indexOf(enemy.species))*3+hash%3;
    const frame=combatAtlasGeometry['enemies-v3'].frames[cell];return {image:combatImage(frame.path),frame};
  }

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
    const previewButton=document.createElement('button');previewButton.type='button';previewButton.textContent='モーション確認';previewButton.onclick=()=>globalThis.arcanaPreviewAttack(scene?.weapon||weapon);box.querySelector('.pixel-heading').append(previewButton);
    anchor.before(box);if(mode==='battle')anchor.classList.add('pixel-targets');
    const canvas=box.querySelector('canvas');
    const bounds=canvas.getBoundingClientRect?.();
    if(bounds?.height>0&&bounds?.width>0)canvas.width=Math.round(304*bounds.width/bounds.height/2)*2;
    scene={mode,box,canvas,width:(canvas.width||960)/2,foes:foes.map(e=>({...e})),weapon,magic};
    // Recompute the logical stage after layout, monitor, orientation or window changes.
    const mounted=scene;
    const fitCanvas=()=>{
      if(scene!==mounted||!box.isConnected)return;
      const bounds=canvas.getBoundingClientRect();
      if(bounds.width<=0||bounds.height<=0)return;
      const width=Math.max(2,Math.round(152*bounds.width/bounds.height)*2);
      if(canvas.width!==width){canvas.width=width;mounted.width=width/2;}
      draw(performance.now());
    };
    if(typeof ResizeObserver!=='undefined'){
      mounted.resizeObserver=new ResizeObserver(fitCanvas);
      mounted.resizeObserver.observe(canvas);
    }
    fitCanvas();if(!animation)animation=requestAnimationFrame(tick);
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
    if(supportSequences[motion]&&supportHero(ctx,motion,progress)){ctx.restore();return;}
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
      drawn=motionSprite(ctx,scene.weapon,0,0,0)||groundedSprite(ctx,armedSheet,3,2,Math.max(0,equipped),0,2,103,spriteGeometry.armed);ctx.restore();
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
    const kind=scene.foes[index]?.visualKind??((scene.foes[index]?.portrait||index)+index)%3,cell=kind===0?1:kind===1?2:3;
    const t=reduced.matches?0:time,boss=!!s?.encounterSpec?.boss;
    const bob=Math.sin(t/400+index)*1.5;
    ctx.save();ctx.translate(x,y-bob+(dead?hit*12:0));
    if(kind===0&&!reduced.matches){const squash=Math.sin(t/220)*.035;ctx.scale(1+squash,1-squash);}
    if(kind===1&&!reduced.matches)ctx.rotate(Math.sin(t/500)*.02);
    if(hit>0&&!dead&&!reduced.matches)ctx.translate(Math.sin(hit*35)*2,0);
    ctx.shadowColor=hit>0&&!dead?'#fff0dd':'#07101a';ctx.shadowBlur=hit>0&&!dead?9:3;
    const size=boss?112:90,art=enemyAtlasFrame(scene.foes[index]);
    const maxWidth=Math.min(scene.foes.length>=3?82:scene.foes.length===2?105:145,(scene.width||480)*(scene.foes.length>=3?.19:scene.foes.length===2?.24:.32));
    const scale=Math.min(size/art.frame.h,maxWidth/art.frame.w);
    ctx.save();ctx.globalAlpha=dead?Math.max(0,1-hit):1;
    if(!isolatedCombatSprite(ctx,art.image,art.frame,0,2,scale))atlasSprite(ctx,enemySheet,2,2,cell,0,4,size,size);
    ctx.restore();
    if(dead&&!reduced.matches){ctx.globalAlpha=1-hit;ctx.fillStyle='#dfc4ff';for(let j=0;j<16;j++){const q=j*2.4;ctx.beginPath();ctx.arc(Math.cos(q)*hit*34,-25+Math.sin(q)*hit*30,1.2,0,Math.PI*2);ctx.fill();}}
    ctx.restore();
  }

  function arcaneRuinsBackground(ctx,width,time){
    // Underground arcane vault: the architecture never depends on an external image.
    const moving=scene.mode==='explore'&&!reduced.matches,seconds=moving?time/1000:0;
    const pulse=reduced.matches?0:time/1000;
    const battle=scene.mode==='battle',floor=110;
    const wall=ctx.createLinearGradient(0,0,0,152);
    wall.addColorStop(0,'#070815');wall.addColorStop(.65,'#182039');wall.addColorStop(1,'#070e1c');
    ctx.fillStyle=wall;ctx.fillRect(0,0,width,152);
    const line=(points,color,w=.6)=>{ctx.strokeStyle=color;ctx.lineWidth=w;ctx.beginPath();points.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.stroke()};
    const glow=(x,y,r,color)=>{const g=ctx.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,color);g.addColorStop(1,'#00000000');ctx.fillStyle=g;ctx.fillRect(x-r,y-r,r*2,r*2)};
    const rune=(x,y,size,color)=>{
      line([[x-size,y-size],[x,y-size*1.7],[x+size,y-size],[x,y+size],[x-size,y-size]],color,.8);
      line([[x,y-size*1.7],[x,y+size*1.4],[x+size,y]],color,.7);
    };
    // Small joints stay in the distance; large pillars pass closer to the viewer.
    const brick=seconds*5%56;
    for(let row=0;row<7;row++){
      const y=6+row*15;line([[0,y],[width,y]],'#66708a16');
      for(let x=-56-brick+(row%2)*28;x<width;x+=56)line([[x,y],[x,y+15]],'#67728f18');
    }
    const spacing=battle?190:154,offset=seconds*8%spacing;
    for(let x=-spacing-offset;x<width+spacing;x+=spacing){
      ctx.fillStyle='#080d1e';ctx.beginPath();ctx.moveTo(x+18,floor);
      ctx.lineTo(x+18,64);ctx.bezierCurveTo(x+18,13,x+104,13,x+104,64);ctx.lineTo(x+104,floor);ctx.closePath();ctx.fill();
      ctx.strokeStyle='#5a64844d';ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(x+13,111);ctx.lineTo(x+13,61);ctx.bezierCurveTo(x+13,6,x+109,6,x+109,61);ctx.lineTo(x+109,111);ctx.stroke();
      // An inner arch and sealed doorway suggest chambers beyond the passage.
      ctx.strokeStyle='#353c6060';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(x+36,109);ctx.lineTo(x+36,67);ctx.bezierCurveTo(x+36,37,x+86,37,x+86,67);ctx.lineTo(x+86,109);ctx.stroke();
      glow(x+61,74,32,'#6350c025');rune(x+61,73,5,'#a89be78c');
    }
    // Thick stone piers, cyan wards and violet sconces.
    const nearOffset=seconds*17%spacing;
    for(let x=-spacing-nearOffset;x<width+spacing;x+=spacing){
      const stone=ctx.createLinearGradient(x,0,x+19,0);
      stone.addColorStop(0,'#080f20');stone.addColorStop(.45,'#303951');stone.addColorStop(1,'#11182b');
      ctx.fillStyle=stone;ctx.fillRect(x,0,19,114);
      ctx.fillStyle='#48516b';ctx.fillRect(x-3,14,25,4);ctx.fillRect(x-3,102,25,5);
      ctx.fillStyle='#171f33';ctx.fillRect(x-5,108,29,7);
      line([[x+3,22],[x+13,36],[x+8,50],[x+12,60]],'#8191b230');
      glow(x+9,62,27,'#40d3ef28');rune(x+9,62,3,'#91eef3b0');
      ctx.fillStyle='#302644';ctx.fillRect(x+5,83,8,5);
      glow(x+9,80,20,'#ad63ed32');ctx.fillStyle='#d1a6ff';ctx.fillRect(x+8,77,2,5);
    }
    // A side-view floor keeps the actor's feet grounded at y=120.
    const ground=ctx.createLinearGradient(0,floor,0,152);
    ground.addColorStop(0,'#2b3450');ground.addColorStop(1,'#080f20');
    ctx.fillStyle=ground;ctx.fillRect(0,floor,width,42);
    line([[0,floor],[width,floor]],'#8599bd50');
    for(const y of [116,126,142])line([[0,y],[width,y]],'#7487a129');
    const tiles=seconds*25%64;
    for(let x=-64-tiles;x<width+64;x+=64){
      line([[x,110],[x-28,152]],'#99a8bd29');
      line([[x+5,129],[x+12,133],[x+8,141]],'#030a15aa');
    }
    const seal=(x,y,r,alpha)=>{
      ctx.save();ctx.translate(x,y);ctx.scale(1,.23);ctx.globalAlpha=alpha;
      ctx.strokeStyle='#8edee8';ctx.lineWidth=.8;
      for(const radius of [r,r*.82,r*.37]){ctx.beginPath();ctx.arc(0,0,radius,0,Math.PI*2);ctx.stroke()}
      for(let n=0;n<8;n++){const q=n*Math.PI/4;line([[Math.cos(q)*r*.37,Math.sin(q)*r*.37],[Math.cos(q+Math.PI/2)*r*.82,Math.sin(q+Math.PI/2)*r*.82]],'#8edee8');rune(Math.cos(q)*r*.92,Math.sin(q)*r*.92,2,'#d1a6ff')}
      ctx.restore();
    };
    if(battle){glow(width*.59,118,76,'#7163e52a');seal(width*.59,124,Math.min(width*.28,110),.36+.04*Math.sin(pulse*1.5))}
    else for(let x=160-seconds*25%320;x<width+100;x+=320)seal(x,132,42,.26);
    // Low mist and a few suspended motes; reduced-motion mode is entirely still.
    for(let i=0;i<4;i++)glow((i*173+seconds*3)%(width+100)-30,104+Math.sin(i*2)*4,66,'#829aca0b');
    for(let i=0;i<15;i++){
      const x=((i*83.71-seconds*10)%(width+20)+width+20)%(width+20)-10;
      const y=24+(i*31%79)+Math.sin(pulse*.65+i)*2;
      ctx.fillStyle=i%3?'#a3a9e347':'#9de9ef87';ctx.fillRect(x,y,.7,.7);
    }
    const vignette=ctx.createLinearGradient(0,0,0,152);
    vignette.addColorStop(0,'#02030cb0');vignette.addColorStop(.3,'#03041000');vignette.addColorStop(.8,'#03041000');vignette.addColorStop(1,'#03051060');
    ctx.fillStyle=vignette;ctx.fillRect(0,0,width,152);
  }
  function ruinsBackground(ctx,width,time){
    const biome=typeof getDungeonBiome==='function'?getDungeonBiome():null;
    if(!biome||biome.scene==='ruins'){arcaneRuinsBackground(ctx,width,time);return}
    const moving=scene.mode==='explore'&&!reduced.matches,seconds=moving?time/1000:0;
    const pulse=reduced.matches?0:time/1000,kind=biome.scene;
    const path=(points,fill,stroke)=>{ctx.beginPath();points.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.closePath();if(fill){ctx.fillStyle=fill;ctx.fill()}if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=.7;ctx.stroke()}};
    const glow=(x,y,r,alpha=.18)=>{const g=ctx.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,biome.glow+Math.round(alpha*255).toString(16).padStart(2,'0'));g.addColorStop(1,biome.glow+'00');ctx.fillStyle=g;ctx.fillRect(x-r,y-r,r*2,r*2)};
    const bg=ctx.createLinearGradient(0,0,0,152);bg.addColorStop(0,biome.sky);bg.addColorStop(.7,biome.stone);bg.addColorStop(1,'#080e1a');ctx.fillStyle=bg;ctx.fillRect(0,0,width,152);
    // Distant cavern silhouettes move slower than the near trees, ruins or crystals.
    for(let x=-180-seconds*5%180;x<width+180;x+=180){
      path([[x,0],[x+35,22],[x+74,12],[x+105,48],[x+135,20],[x+180,0]],'#050b168a');
      glow(x+92,65,47,.12);
    }
    const spacing=kind==='forest'?100:kind==='temple'?130:115,offset=seconds*15%spacing;
    for(let n=0,x=-spacing-offset;x<width+spacing;x+=spacing,n++){
      const top=12+n%3*9;
      if(kind==='forest'||kind==='swamp'){
        const mushroom=kind==='swamp';
        path([[x+17,115],[x+27,69],[x+22,top],[x+39,top-8],[x+43,73],[x+55,115]],'#0b191de6',biome.glow+'28');
        if(mushroom){
          ctx.fillStyle=biome.glow+'70';ctx.beginPath();ctx.ellipse(x+36,top+16,27,7,0,Math.PI,Math.PI*2);ctx.fill();
          ctx.fillStyle=biome.glow+'20';ctx.beginPath();ctx.ellipse(x+36,top+16,27,5,0,0,Math.PI*2);ctx.fill();glow(x+36,top+18,35,.15);
        }else{
          path([[x+30,70],[x+7,38],[x-10,30],[x+19,38],[x+34,55],[x+52,19],[x+74,12],[x+53,35],[x+40,77]],'#101f25');
          for(let k=0;k<4;k++){ctx.fillStyle=biome.glow+'25';ctx.beginPath();ctx.ellipse(x+10+k*17,20+Math.sin(k)*9,21,8,-.2,0,Math.PI*2);ctx.fill()}
        }
        path([[x+24,111],[x+2,120],[x+34,116],[x+68,122],[x+47,110]],'#17272c');
      }else if(kind==='crystal'||kind==='frost'){
        for(let k=0;k<3;k++){
          const left=x+10+k*15,h=30+(n*17+k*23)%55;
          path([[left,112],[left-7,112-h*.7],[left+3,112-h],[left+13,112-h*.65],[left+17,112]],biome.glow+(k===1?'65':'35'),biome.glow+'85');
          path([[left+3,112-h],[left+5,112],[left+17,112]],biome.glow+'25');
        }
        if(kind==='frost')for(let k=0;k<4;k++)path([[x+k*24,0],[x+k*24+7,19+(k*13)%27],[x+k*24+13,0]],biome.glow+'66');
        glow(x+28,87,45,.14);
      }else if(kind==='temple'||kind==='crypt'){
        ctx.fillStyle='#101824';ctx.fillRect(x+12,top,15,111-top);
        ctx.fillStyle=biome.stone;ctx.fillRect(x+9,top,22,4);ctx.fillRect(x+8,107,24,6);
        if(kind==='crypt'){
          path([[x+53,112],[x+53,74],[x+67,64],[x+81,74],[x+81,112]],'#101523',biome.glow+'36');
          ctx.strokeStyle=biome.glow+'60';ctx.beginPath();ctx.moveTo(x+67,78);ctx.lineTo(x+67,94);ctx.moveTo(x+61,84);ctx.lineTo(x+73,84);ctx.stroke();
        }else{
          ctx.strokeStyle=biome.glow+'3c';ctx.lineWidth=2;ctx.beginPath();ctx.arc(x+73,57,23,Math.PI,0);ctx.lineTo(x+96,110);ctx.moveTo(x+50,110);ctx.lineTo(x+50,57);ctx.stroke();
          glow(x+73,64,31,.22);
        }
      }else if(kind==='desert'||kind==='canyon'){
        path([[x-12,114],[x+5,53],[x+23,34],[x+42,48],[x+52,83],[x+76,114]],'#15202cb8',biome.glow+'20');
        if(kind==='desert'){ctx.fillStyle=biome.stone;ctx.fillRect(x+18,70,12,41);ctx.fillRect(x+15,68,19,4)}
        else{path([[x+63,0],[x+66,59],[x+86,96],[x+106,112],[x+116,0]],'#091323d9');}
      }else{
        path([[x+8,112],[x+13,74],[x+27,61],[x+43,87],[x+60,112]],'#111522',biome.glow+'30');
        if(kind==='abyss'){
          path([[x+55,15],[x+48,34],[x+58,53],[x+49,78],[x+55,91],[x+64,64],[x+60,44],[x+68,24]],biome.glow+'66');
          glow(x+57,55,30,.18);
        }else{
          path([[x+58,18],[x+52,50],[x+61,71],[x+55,111],[x+63,111],[x+67,68],[x+59,49],[x+65,18]],biome.glow+'88');glow(x+59,93,36,.2);
        }
      }
    }
    const floor=ctx.createLinearGradient(0,110,0,152);floor.addColorStop(0,biome.stone);floor.addColorStop(1,biome.sky);ctx.fillStyle=floor;ctx.fillRect(0,110,width,42);
    ctx.strokeStyle=biome.glow+'28';ctx.lineWidth=.5;
    for(let x=-70-seconds*25%70;x<width+70;x+=70){ctx.beginPath();ctx.moveTo(x,110);ctx.lineTo(x-29,152);ctx.stroke()}
    for(const y of [117,129,145]){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(width,y);ctx.stroke()}
    if(kind==='forge'||kind==='water'){
      ctx.fillStyle=biome.glow+(kind==='forge'?'75':'25');ctx.fillRect(0,140,width,12);
      ctx.strokeStyle=biome.glow+'80';ctx.beginPath();
      for(let x=0;x<=width;x+=4){const y=141+Math.sin(x/18+pulse)*1.4;x?ctx.lineTo(x,y):ctx.moveTo(x,y)}ctx.stroke();
    }
    for(let i=0;i<16;i++){const x=((i*67.31-seconds*7)%(width+20)+width+20)%(width+20)-10,y=15+i*37%94+Math.sin(pulse*.5+i)*2;ctx.fillStyle=biome.glow+'65';ctx.fillRect(x,y,.8,.8)}
    const shade=ctx.createLinearGradient(0,0,0,152);shade.addColorStop(0,'#03071255');shade.addColorStop(.5,'#03071200');shade.addColorStop(1,'#03071240');ctx.fillStyle=shade;ctx.fillRect(0,0,width,152);
  }
  function effectPath(ctx,points,color,width=1){
    ctx.strokeStyle=color;ctx.lineWidth=width;ctx.lineCap='round';ctx.lineJoin='round';ctx.beginPath();
    points.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.stroke();
  }
  function effectGlow(ctx,x,y,r,color){
    if(r<=0)return;
    const glow=ctx.createRadialGradient(x,y,0,x,y,r);
    glow.addColorStop(0,color+'aa');glow.addColorStop(.3,color+'55');glow.addColorStop(1,color+'00');
    ctx.fillStyle=glow;ctx.fillRect(x-r,y-r,r*2,r*2);
  }
  function elementalBurst(ctx,x,y,element,q,seed=0){
    const color=colors[element]||'#ddcaff',fade=Math.max(0,Math.sin(Math.PI*q));
    if(!fade)return;
    ctx.save();ctx.globalAlpha=fade;
    effectGlow(ctx,x,y,15+q*35,color);
    if(element==='火'){
      for(let n=0;n<13;n++){const a=n*2.399+seed,r=8+q*(15+n%4*7),xx=x+Math.cos(a)*r,yy=y+Math.sin(a)*r*.65;
        ctx.fillStyle=n%2?'#ffe7a1':color;ctx.beginPath();ctx.ellipse(xx,yy,2+fade*2,5+fade*3,a,0,Math.PI*2);ctx.fill();}
    }else if(element==='氷'||element==='土'){
      for(let n=0;n<7;n++){const xx=x+(n-3)*9,yy=y+9-Math.sin(n*.7+seed)*8,h=(element==='氷'?28:18)*fade+6;
        ctx.fillStyle=n%2?color:element==='氷'?'#e1fbff':'#90775c';ctx.beginPath();ctx.moveTo(xx-5,yy);ctx.lineTo(xx-3,yy-h*.7);ctx.lineTo(xx+1,yy-h);ctx.lineTo(xx+6,yy-h*.35);ctx.lineTo(xx+5,yy);ctx.closePath();ctx.fill();}
    }else if(element==='雷'){
      for(let n=0;n<5;n++){const a=n*Math.PI*.4+seed;const points=Array.from({length:8},(_,i)=>{const r=i*6;return[x+Math.cos(a)*r+Math.sin(i*2+n)*4,y+Math.sin(a)*r*.7+Math.cos(i*3)*4]});effectPath(ctx,points,color,2);effectPath(ctx,points,'#fffbea',.6);}
    }else if(element==='風'){
      for(let n=0;n<4;n++){ctx.strokeStyle=n%2?'#e1fff1':color;ctx.lineWidth=1.5;ctx.beginPath();ctx.ellipse(x,y-n*3,12+q*35,6+q*12,q*4+n,0,Math.PI*1.5);ctx.stroke();}
    }else if(element==='光'){
      ctx.strokeStyle='#fff8d7';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x,y-44*fade);ctx.lineTo(x,y+20);ctx.moveTo(x-22*fade,y-4);ctx.lineTo(x+22*fade,y-4);ctx.stroke();
      for(let n=0;n<8;n++){const a=n*Math.PI/4+q;effectPath(ctx,[[x+Math.cos(a)*12,y+Math.sin(a)*12],[x+Math.cos(a)*(17+q*25),y+Math.sin(a)*(17+q*25)]],color,1);}
    }else{
      ctx.fillStyle='#100e24';ctx.strokeStyle=color;ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(x,y,13+fade*9,11+fade*6,0,0,Math.PI*2);ctx.fill();ctx.stroke();
      for(let n=0;n<6;n++){const a=n*Math.PI/3+q*3;effectPath(ctx,[[x+Math.cos(a)*15,y+Math.sin(a)*12],[x+Math.cos(a+.4)*(24+q*12),y+Math.sin(a+.4)*(18+q*10)]],color,1);}
    }
    ctx.restore();
  }
  function spellEffects(ctx,a,hx,p,foes){
    const color=colors[a.element]||'#ddcaff',targets=a.targets.length?a.targets:[s?.target??0],style=a.style;
    const travel=Math.max(0,Math.min(1,(p-.15)/.43));
    for(const index of targets){
      const tx=foeX(index,foes.length),ox=hx+28,oy=63,ty=82;
      if(p>=.15&&p<=.65){
        if(style==='beam'||a.element==='雷'){
          const points=Array.from({length:13},(_,i)=>{const z=i/12;return[ox+(tx-ox)*z*travel,oy+(ty-oy)*z+(a.element==='雷'?Math.sin(i*2.8+p*40)*5:Math.sin(z*Math.PI)*-5)]});
          ctx.save();ctx.globalAlpha=Math.sin(Math.min(1,(p-.15)/.5)*Math.PI);effectPath(ctx,points,color,5);effectPath(ctx,points,'#fff4df',1.3);ctx.restore();
        }else{
          const count=style==='barrage'?3:1;
          for(let n=0;n<count;n++){
            const q=Math.max(0,Math.min(1,travel-n*.14)),x=ox+(tx-ox)*ease(q),y=oy+(ty-oy)*q-Math.sin(q*Math.PI)*(style==='storm'?40:15);
            effectGlow(ctx,x,y,11,color);
            effectPath(ctx,[[x-12,y+5],[x-5,y+1],[x,y]],color,2);
            magicArt(ctx,x,y,a.element,q);
          }
        }
      }
      if(p>.48){const q=Math.min(1,(p-.48)/.52);elementalBurst(ctx,tx,ty,a.element,q,(a.card?.id||0)%11);
        if(style==='sigil'||style==='prison'){ctx.save();ctx.globalAlpha=Math.sin(q*Math.PI);ctx.strokeStyle=color;ctx.lineWidth=1.2;ctx.beginPath();ctx.ellipse(tx,105,30,9,q*2,0,Math.PI*2);ctx.stroke();for(let n=0;n<5;n++){const x=tx-22+n*11;effectPath(ctx,[[x,104],[x,104-Math.sin(q*Math.PI)*50]],color,.8)}ctx.restore();}
      }
    }
    if(p<.35){ctx.save();ctx.globalAlpha=Math.sin(p/.35*Math.PI)*.8;ctx.strokeStyle=color;ctx.beginPath();ctx.ellipse(hx,118,27,6,p*5,0,Math.PI*2);ctx.stroke();ctx.restore();}
  }
  function supportEffects(ctx,kind,x,p,element,e={}){
    const q=Math.sin(Math.PI*p),color=kind==='heal'?'#8df0b8':kind==='guard'?'#9eeaff':kind==='cleanse'?'#fff2bf':kind==='recharge'?(e.recoverMana?'#a8cfff':'#ffda92'):colors[element]||'#c59aff';
    ctx.save();ctx.globalAlpha=q;effectGlow(ctx,x,86,38,color);
    if(kind==='guard'){
      ctx.fillStyle=color+'22';ctx.strokeStyle=color;ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(x+22,48);ctx.lineTo(x+46,57);ctx.lineTo(x+43,88);ctx.lineTo(x+25,105);ctx.lineTo(x+10,89);ctx.lineTo(x+8,57);ctx.closePath();ctx.fill();ctx.stroke();
      effectPath(ctx,[[x+26,60],[x+26,91]],'#e7fcff',.8);effectPath(ctx,[[x+16,74],[x+38,74]],'#e7fcff',.8);
      if(e.counter)for(let n=0;n<5;n++)effectPath(ctx,[[x+43,57+n*8],[x+51+q*5,61+n*8],[x+44,65+n*8]],'#ffe3a1',1);
    }else if(kind==='heal'||kind==='cleanse'){
      for(let n=0;n<10;n++){const xx=x-25+n*6,yy=112-(p*58+n*9)%64;ctx.fillStyle=color;ctx.fillRect(xx-2,yy,5,1);ctx.fillRect(xx,yy-2,1,5);}
      ctx.strokeStyle=color;ctx.lineWidth=1;ctx.beginPath();ctx.ellipse(x,118,24+q*8,5+q*2,0,0,Math.PI*2);ctx.stroke();
      if(kind==='cleanse')for(let n=0;n<8;n++){const angle=n*Math.PI/4;effectPath(ctx,[[x+Math.cos(angle)*15,84+Math.sin(angle)*18],[x+Math.cos(angle)*(20+p*28),84+Math.sin(angle)*(25+p*30)]],color,.9);}
    }else if(kind==='draw'){
      for(let n=0;n<3;n++){ctx.save();ctx.translate(x-24+n*22,69-Math.sin((p+n*.1)*Math.PI)*12);ctx.rotate((n-1)*.2+p*.25);ctx.fillStyle='#142539';ctx.strokeStyle=color;ctx.lineWidth=1;ctx.fillRect(-7,-10,14,20);ctx.strokeRect(-7,-10,14,20);effectPath(ctx,[[-4,0],[0,-5],[4,0],[0,5],[-4,0]],color,.7);ctx.restore();}
    }else if(kind==='evade'){
      for(let n=0;n<5;n++)effectPath(ctx,[[x+20,65+n*8],[x-10-p*32,68+n*8],[x-26-p*20,71+n*8]],color,.8);
    }else{
      for(let n=0;n<14;n++){const angle=n*2.399+p*6,r=(1-p)*35+8,xx=x+Math.cos(angle)*r,yy=82+Math.sin(angle)*r*.7;ctx.fillStyle=n%3?'#e5f5ff':color;ctx.beginPath();ctx.arc(xx,yy,1.2+n%2*.5,0,Math.PI*2);ctx.fill();}
      ctx.strokeStyle=color;ctx.beginPath();ctx.ellipse(x,117,26,6,p*5,0,Math.PI*2);ctx.stroke();
    }
    if(e.exhaust){const z=Math.max(0,(p-.45)/.55);for(let n=0;n<10;n++){const angle=n*Math.PI/5;effectPath(ctx,[[x+Math.cos(angle)*(10+z*14),68+Math.sin(angle)*(10+z*14)],[x+Math.cos(angle)*(15+z*23),68+Math.sin(angle)*(15+z*23)]],'#ffd49f',1)}}
    ctx.restore();
  }
  function cardWeaponAccents(ctx,a,hx,p,foes,impact){
    const e=a.card?.e||{};if(p<impact)return;
    const q=(p-impact)/(1-impact),color=colors[a.element]||'#e8d5a6';
    for(const index of a.targets){const x=foeX(index,foes.length);
      if(e.times>1)for(let n=1;n<Math.min(4,e.times);n++){const phase=Math.max(0,q-n*.1);if(phase>0&&phase<.6)effectPath(ctx,[[x-25,65+n*8],[x+12,94-n*5],[x+24,83-n*8]],'#f9e6b8',1.2*(1-phase));}
      if(e.break)for(let n=0;n<8;n++){const angle=n*2.399;ctx.fillStyle='#9eeaff';ctx.globalAlpha=1-q;ctx.fillRect(x+Math.cos(angle)*q*28,85+Math.sin(angle)*q*25,2,3);ctx.globalAlpha=1;}
      if(e.pierce)effectPath(ctx,[[hx+12,82],[x+20,82]],'#f5e7ca',Math.max(.2,(1-q)*1.5));
      if(e.drain&&q>.1){const z=Math.min(1,(q-.1)/.8);effectGlow(ctx,x+(hx-x)*z,85-Math.sin(z*Math.PI)*12,7,'#c59aff');}
    }
  }
  function drawHitNumbers(ctx,a,p,impact,foes){
    if(p<impact)return;
    const rise=(p-impact)/(1-impact);
    for(const hit of a.hits||[]){
      ctx.save();ctx.globalAlpha=reduced.matches?1:Math.min(1,(1-rise)*3);
      ctx.fillStyle=hit.kind==='block'?'#79e5ff':hit.kind==='heal'?'#96f5b4':hit.kind==='resource'?'#abcfff':hit.kind==='guard'?'#a2ecff':hit.kind==='status'?'#d5b4ff':hit.player?'#ffb6a0':'#fff1c4';
      ctx.strokeStyle='#101623';ctx.lineWidth=2.2;ctx.font='bold 10px sans-serif';ctx.textAlign='center';
      const x=hit.player?(scene.width||480)*.2:foeX(hit.index,foes.length),y=64-(reduced.matches?0:rise*17)+(hit.offset||0);
      ctx.strokeText(hit.text,x,y);ctx.fillText(hit.text,x,y);ctx.restore();
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
    if(active&&supportSequences[a.kind])motion=a.kind;
    if(active&&a.kind==='enemy')motion=a.hits.some(hit=>hit.player&&hit.kind==='hp')?'hurt':'guard';
    if(active&&motion==='hurt')hx+=reduced.matches?0:Math.sin(p*40)*4;
    const extent=motionExtents(scene.weapon);hx=Math.max(extent.left,Math.min(viewWidth-extent.right,hx));
    hero(ctx,hx,120,t,motion);
    const foes=scene.mode==='battle'?scene.foes:[];
    foes.forEach((e,i)=>{let x=foeX(i,foes.length);if(active&&a.kind==='enemy'&&!reduced.matches){const ep=Math.max(0,Math.min(1,p*1.6-i*.28));x-=Math.sin(ep*Math.PI)*48;}const affected=active&&a?.targets?.includes(i),landed=affected&&p>=impact;const death=affected&&!landed?false:e.hp<=0;const hit=landed?Math.min(1,(p-impact)/(1-impact)):e.hp<=0&&!affected?1:0;monster(ctx,x,120,i,t,death,hit);if(s?.target===i&&e.hp>0){rect(ctx,x-3,57,7,3,'#ead398');rect(ctx,x-1,60,3,3,'#ead398');}});
    if(active){
      if(!reduced.matches){
        if(a.kind==='magic')spellEffects(ctx,a,hx,p,foes);
        if(a.kind==='attack'){
          for(const index of a.targets.length?a.targets:[s?.target??0])weaponEffects(ctx,a.weapon,hx,foeX(index,foes.length),p);
          cardWeaponAccents(ctx,a,hx,p,foes,impact);
        }
        if(supportSequences[a.kind])supportEffects(ctx,a.kind,hx,p,a.element,a.card?.e);
        else if(a.card?.e.exhaust)supportEffects(ctx,'focus',hx,p,a.element,a.card.e);
        if(a.kind==='attack'||a.kind==='magic'){
          if(a.card?.e.heal||a.card?.e.drain)supportEffects(ctx,'heal',hx,p,a.element);
          if(a.card?.e.recoverEnergy||a.card?.e.recoverMana)supportEffects(ctx,'recharge',hx,p,a.element,a.card.e);
        }
      }
      drawHitNumbers(ctx,a,p,impact,foes);
    }
  }
  function foeX(i,count){const w=scene?.width||480,edge=Math.min(count<=1?75:48,w*.16),raw=count<=1?w*.74:w*.58+i*Math.min(100,w*.3/Math.max(1,count-1));return Math.max(edge,Math.min(w-edge,raw));}
  function perform(kind,label,targets=[],hits=[],element=magic,card=null){
    const type=scene?.weapon||weapon;
    action={kind,targets,hits,element:magics.includes(element)?element:magic,weapon:type,card,style:card?cardSpellStyle(card):'bolt',duration:kind==='attack'?(attacks[type]?.duration||900):kind==='enemy'?1150:kind==='magic'?1400:kind==='heal'?1350:1100,time:performance.now()};
    if(scene){scene.foes=(s?.enemies||[]).map(e=>({...e}));scene.box.querySelector('.pixel-caption').textContent=label+(hits.some(h=>h.kind==='block')?' ／ 水色：防御・金色：HP':'');draw(action.time);}
  }
  const originalRender=render;render=function(...args){const result=originalRender(...args);mount('battle');return result;};
  const originalExplore=exploration;exploration=function(...args){const result=originalExplore(...args);mount('explore');return result;};
  function ensureResultStage(){
    if(s?.phase!=='reward')return;
    const anchor=document.querySelector('#app > *');
    if(anchor){const holder=document.createElement('div');holder.className='arena';anchor.before(holder);mount('battle');holder.remove();}
  }
  const originalPlay=play;play=function(i){
    const card=s?.phase==='battle'&&!s.pending?all[s.hand[i]]:null;
    if(!card||!can(card))return originalPlay(i);
    const run=s,before=s.enemies.map(e=>({...e})),hp=s.hp,block=s.block,energy=s.energy,mana=s.mana,paid=cost(card),played=s.played;
    const target=s.enemies[s.target]?.hp>0?s.target:s.enemies.findIndex(e=>e.hp>0);
    const result=originalPlay(i);if(s!==run||s.played===played)return result;
    const e=card.e;
    const targets=before.map((old,index)=>old.hp>s.enemies[index].hp||(old.block||0)>(s.enemies[index].block||0)||(e.weak||e.freeze||e.vulnerable||e.burn||e.poison)&&(e.all||index===target)&&old.hp>0?index:-1).filter(index=>index>=0);
    const hits=targets.flatMap(index=>{
      const hpDamage=before[index].hp-s.enemies[index].hp,blockDamage=(before[index].block||0)-(s.enemies[index].block||0),numbers=[];
      if(blockDamage>0)numbers.push({index,kind:'block',text:'防御 −'+blockDamage,offset:hpDamage>0?-17:0});
      if(hpDamage>0)numbers.push({index,kind:'hp',text:'−'+hpDamage});
      if(!hpDamage&&!blockDamage)numbers.push({index,kind:'status',text:e.freeze?'凍結':e.weak?'攻撃−'+e.weak:e.vulnerable?'被ダメージ＋'+e.vulnerable:e.poison?'毒':'火傷'});
      return numbers;
    });
    let actorLines=0;
    const actorNumber=(text,kind)=>{hits.push({player:true,kind,text,offset:-actorLines*15});actorLines++;};
    const healing=Math.max(0,s.hp-(hp-(e.hpCost||0)));
    if(healing)actorNumber('HP＋'+healing,'heal');
    if(e.hpCost)actorNumber('HP−'+e.hpCost,'hp');
    if(e.block)actorNumber('防御＋'+e.block,'guard');
    const energyGain=s.energy-(energy-(magics.includes(card.g)?0:paid)),manaGain=s.mana-(mana-(magics.includes(card.g)?paid:0));
    if(energyGain>0)actorNumber('行動＋'+energyGain,'resource');
    if(manaGain>0)actorNumber('マナ＋'+manaGain,'resource');
    ensureResultStage();
    perform(cardMotionKind(card),card.n+(s.phase==='reward'?' · 敵を撃破！':''),targets,hits,card.g,card);
    return result;
  };
  const originalEnd=endTurn;endTurn=function(...args){
    const run=s,hp=s?.hp,before=s?.enemies?.map(e=>({...e}))||[];
    const result=originalEnd(...args);
    if(s===run&&['battle','reward'].includes(s?.phase)){
      const hits=[],targets=[];
      for(const [index,old]of before.entries()){
        const now=s.enemies[index],damage=old.hp-now.hp;if(!damage)continue;targets.push(index);
        hits.push({index,kind:damage<0?'heal':'hp',text:damage<0?'HP＋'+(-damage):'−'+damage});
      }
      if(s.hp<hp)hits.push({player:true,kind:'hp',text:'HP−'+(hp-s.hp)});
      ensureResultStage();perform('enemy',s.phase==='reward'?'反撃・継続効果で敵を撃破！':s.hp<hp?'敵の攻撃を受けた':'敵の行動・継続効果',targets,hits,s.enemies.find(e=>e.hp>0)?.element||magic);
    }
    return result;
  };


  function motionPreviewControls(selectedWeapon='',selectedCard=-1){
    const examples=magics.map(element=>all.find(c=>c.g===element&&c.e.hit)).concat([
      all.find(c=>cardMotionKind(c)==='heal'),all.find(c=>cardMotionKind(c)==='guard'),
      all.find(c=>cardMotionKind(c)==='evade'),all.find(c=>cardMotionKind(c)==='recharge'),
      all.find(c=>cardMotionKind(c)==='draw'),all.find(c=>cardMotionKind(c)==='focus'),
      all.find(c=>cardMotionKind(c)==='cleanse')
    ]).filter(Boolean);
    const labels={heal:'回復',guard:'防御',evade:'回避',recharge:'コスト回復',draw:'ドロー',focus:'集中・強化',cleanse:'浄化'};
    return '<p class="small">武器の攻撃</p><div class="choices" role="group" aria-label="武器のモーション">'+weaponOrder.map(w=>`<button type="button" class="${w===selectedWeapon?'chosen':''}" onclick="arcanaOpenMotionPreview('weapon','${w}')">${esc(w)}</button>`).join('')+'</div><p class="small">属性魔法・補助動作</p><div class="choices" role="group" aria-label="魔法と補助のモーション">'+examples.map(c=>`<button type="button" class="${c.id===selectedCard?'chosen':''}" onclick="arcanaOpenMotionPreview('card',${c.id})">${esc(magics.includes(c.g)&&c.e.hit?c.g:labels[cardMotionKind(c)])}</button>`).join('')+'</div>';
  }
  globalThis.arcanaOpenMotionPreview=function(kind,value){
    if(kind==='weapon'&&weaponOrder.includes(value)){
      const other=document.getElementById('card-motion-preview');if(other?.open)other.close();
      globalThis.arcanaPreviewAttack(value);
    }else if(kind==='card'&&Number.isInteger(value)&&all[value]){
      const other=document.getElementById('attack-motion-preview');if(other?.open)other.close();
      globalThis.arcanaPreviewCard(value);
    }
  };

  let cardPreviewAnimation=0;
  globalThis.arcanaPreviewCard=function(id=0){
    const card=all[id];if(!card)return;
    cancelAnimationFrame(cardPreviewAnimation);
    let dialog=document.getElementById('card-motion-preview');
    if(!dialog){dialog=document.createElement('dialog');dialog.id='card-motion-preview';dialog.className='weapon-art-dialog';dialog.setAttribute('aria-label','カード演出');document.body.append(dialog);dialog.addEventListener('close',()=>cancelAnimationFrame(cardPreviewAnimation));}
    dialog.innerHTML='<div class="weapon-art-titlebar"><h2>'+esc(card.n)+'</h2><button onclick="document.getElementById(\'card-motion-preview\').close()">閉じる ×</button></div><p>'+esc(card.d)+'<br>演出のプレビューです。カード・HP・コストは消費しません。</p>'+motionPreviewControls('',card.id)+'<canvas width="960" height="304" role="img" aria-label="'+esc(card.n)+'のカード演出"></canvas>';
    const canvas=dialog.querySelector('canvas'),kind=cardMotionKind(card),duration=kind==='attack'?(attacks[weapons.includes(card.g)?card.g:weapon]?.duration||1100):1400,start=performance.now();
    const hits=card.e.hit?[{index:0,kind:'hp',text:'−'+card.e.hit}]:card.e.heal?[{player:true,kind:'heal',text:'HP＋'+card.e.heal}]:card.e.block?[{player:true,kind:'guard',text:'防御＋'+card.e.block}]:[];
    function paint(now){
      if(!dialog.open||!canvas.isConnected)return;
      const previousScene=scene,previousAction=action,elapsed=reduced.matches?duration*.65:(now-start)%(duration+600);
      const foes=Array.from({length:card.e.all?3:1},(_,i)=>({n:i?'遺跡の自動兵':'森牙の狼',hp:100,max:100,species:i?'機械':'獣',bossArtIndex:-1,portrait:0}));
      scene={mode:'battle',canvas,width:480,weapon:weapons.includes(card.g)?card.g:weapon,magic:magics.includes(card.g)?card.g:magic,foes};
      action={kind,card,targets:card.e.hit?foes.map((_,i)=>i):[],hits,element:magics.includes(card.g)?card.g:magic,style:cardSpellStyle(card),weapon:scene.weapon,duration,time:now-Math.min(elapsed,duration)};
      try{draw(now)}finally{scene=previousScene;action=previousAction}
      if(!reduced.matches)cardPreviewAnimation=requestAnimationFrame(paint);
    }
    if(!dialog.open)dialog.showModal();paint(start);
    if(reduced.matches)for(const image of combatImageCache.values())if(!image.complete)image.addEventListener('load',()=>paint(performance.now()),{once:true});
  };

  let previewAnimation=0;
  globalThis.arcanaPreviewAttack=function(type=scene?.weapon||weapon){
    if(!weaponOrder.includes(type))return;
    cancelAnimationFrame(previewAnimation);
    let dialog=document.getElementById('attack-motion-preview');
    if(!dialog){dialog=document.createElement('dialog');dialog.id='attack-motion-preview';dialog.className='weapon-art-dialog';dialog.setAttribute('aria-label','モーション確認');document.body.append(dialog);dialog.addEventListener('close',()=>cancelAnimationFrame(previewAnimation));}
    dialog.innerHTML='<div class="weapon-art-titlebar"><h2>'+esc(type)+' · '+attacks[type].name+'</h2><button type="button" onclick="document.getElementById(\'attack-motion-preview\').close()">閉じる ×</button></div>'+motionPreviewControls(type)+'<p>武器攻撃・属性魔法・回復や防御などの補助動作を切り替えて確認できます。HP・カード・コストは消費しません。</p><canvas width="960" height="304" role="img" aria-label="'+esc(type)+'の攻撃モーション"></canvas>';
    const canvas=dialog.querySelector('canvas'),ctx=canvas.getContext('2d'),start=performance.now(),spec=attacks[type];
    function paint(now){
      if(!dialog.open||!canvas.isConnected)return;
      const elapsed=(now-start)%(spec.duration+650),p=reduced.matches?spec.impact+.03:Math.min(1,elapsed/spec.duration);
      ctx.setTransform(2,0,0,2,0,0);ctx.clearRect(0,0,480,152);
      const bg=ctx.createLinearGradient(0,0,0,152);bg.addColorStop(0,'#122a3b');bg.addColorStop(1,'#060d18');ctx.fillStyle=bg;ctx.fillRect(0,0,480,152);
      ctx.strokeStyle='#b6c3cf30';ctx.beginPath();ctx.moveTo(0,124);ctx.lineTo(480,124);ctx.stroke();
      const active=elapsed<spec.duration||reduced.matches,x=96+(type==='弓'?0:attackTravel(type,p)*Math.max(0,344-96-spec.reach));
      ctx.fillStyle='#0c0b1599';ctx.beginPath();ctx.ellipse(x,121,22,3,0,0,Math.PI*2);ctx.fill();
      if(active)attackHero(ctx,type,x,120,p);else attackHero(ctx,type,96,120,0);
      ctx.save();ctx.translate(344,83);ctx.strokeStyle=spec.color;ctx.fillStyle='#253a50';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(0,-20);ctx.lineTo(13,0);ctx.lineTo(0,22);ctx.lineTo(-13,0);ctx.closePath();ctx.fill();ctx.stroke();ctx.restore();
      if(active)weaponEffects(ctx,type,96,344,p);
      ctx.fillStyle='#e8d9b0';ctx.font='8px sans-serif';ctx.fillText(reduced.matches?'攻撃ポーズ':!active?'構え':p<spec.impact?'溜め':p<spec.impact+.15?'攻撃':'振り抜き',14,18);
      if(!reduced.matches)previewAnimation=requestAnimationFrame(paint);
    }
    if(!dialog.open)dialog.showModal();paint(start);
    const previewSheet=motionImage(type);if(reduced.matches&&!previewSheet.complete)previewSheet.addEventListener('load',()=>paint(start),{once:true});
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

  motionImage(weapon);
  // Initial page may already have a resumed adventure.
  if(s?.phase==='battle')mount('battle');else if(s?.phase==='explore')mount('explore');
})();


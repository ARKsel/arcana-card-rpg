/* Presentation only: status badges share definitions across actors and cards. */
const ArcanaStatusMarks=(()=>{
  'use strict';
  const defs={
    burn:{name:'火傷',color:'#ffaf78',path:'M12 2c1 5-4 5-2 9 1-2 3-3 4-5 1 4 5 6 5 10a7 7 0 0 1-14 0c0-4 3-7 7-14Z'},
    poison:{name:'毒',color:'#b6eb90',path:'M5 10a7 7 0 0 1 14 0v5l-3 2v4H8v-4l-3-2Z M8 11h1m6 0h1 M10 18v3m4-3v3'},
    freeze:{name:'凍結',color:'#a9e7ff',path:'M12 2v20M3 7l18 10M3 17 21 7M9 4l3 3 3-3M9 20l3-3 3 3M4 10l1-4 4-1M15 19l4-1 1-4M4 14l1 4 4 1M15 5l4 1 1 4'},
    weak:{name:'弱体',color:'#d2b3ff',path:'m5 3 7 7-2 2-7-7 2-2Zm7 9 4 4m-3 0 3-3M18 8v13m-4-4 4 4 4-4'},
    vulnerable:{name:'防御脆弱',color:'#ffb2a9',path:'m12 2 8 3v7c0 5-8 10-8 10S4 17 4 12V5l8-3Zm1 3-4 6 6 1-4 7'},
    noDraw:{name:'ドロー停止',color:'#f2b9be',path:'M6 3h13v17H6V3ZM3 7v15h12M4 3l17 18'},
    cleanse:{name:'浄化',color:'#fff0ad',path:'m12 2 2 7 7 3-7 2-2 8-2-8-7-2 7-3 2-7ZM3 3v4M1 5h4'},
    buff:{name:'攻撃強化',color:'#ffd99b',path:'m4 4 9 9-3 3-9-9 3-3Zm9 12 5 5m-6-1 7-7M18 3v8m-3-5 3-3 3 3'},
    weaponBuff:{name:'武器強化',color:'#ffd99b',path:'m3 3 12 12-3 3L0 6l3-3Zm12 15 5 5M10 21l11-11M21 3l-6 6M17 3h4v4'},
    magicBuff:{name:'雷強化',color:'#fff196',path:'m14 1-9 12h6l-2 10 10-14h-7l2-8ZM19 3h4m-2-2v4'},
    discount:{name:'武器コスト軽減',color:'#b9e4ee',path:'M4 3h15v18H4V3Zm4 8h7M1 7v16h14'},
    evade:{name:'回避',color:'#a7e8d8',path:'M2 12s4-6 10-6 10 6 10 6-4 6-10 6S2 12 2 12Zm8 0a2 2 0 1 0 4 0 2 2 0 1 0-4 0M4 22 21 2'},
    reduce:{name:'被ダメージ軽減',color:'#abe6ff',path:'m12 2 8 3v7c0 5-8 10-8 10S4 17 4 12V5l8-3Zm-4 9h8'},
    counter:{name:'反撃',color:'#ffcea8',path:'M8 5 2 11l6 6M2 11h12c5 0 8 4 8 9M14 3l7 7m-7-7v5m0-5h5'},
    carry:{name:'防御持越し',color:'#abe6ff',path:'m9 2 7 3v6c0 4-7 9-7 9S2 15 2 11V5l7-3Zm4 14h9m-4-4 4 4-4 4'}
  };
  const esc=v=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  function effect(key,value,subject='enemy',card=false){
    const d=defs[key];if(!d||!value)return null;
    let detail='',count='',name=d.name;
    switch(key){
      case 'burn':count=value;detail=`ターン終了時にHPへ2ダメージ。防御では軽減されません。${card?'付与する期間':'残り'}：${value}ターン。`;break;
      case 'poison':count=value;detail=`ターン終了時にHPへ${subject==='player'?2:3}ダメージ。防御では軽減されません。${card?'付与する期間':'残り'}：${value}ターン。`;break;
      case 'freeze':count='1';detail='次の行動を1回停止します。火傷・毒の継続ダメージは発生します。';break;
      case 'weak':count='−'+value;detail=`次に攻撃するとき、攻撃ダメージを${value}減らします。攻撃後に解除されます。`;break;
      case 'vulnerable':count='＋'+value;detail=`この敵が受ける攻撃1回ごとにダメージを${value}加算します。あなたのターン終了時に解除されます。`;break;
      case 'noDraw':detail='このターンの追加ドローができなくなります。次ターンの手札補充は通常どおり行います。';break;
      case 'cleanse':detail='自分に付与されている毒を解除します。';break;
      case 'buff':count='＋'+value;detail=`次の攻撃カードの最初の命中に${value}ダメージを加算。攻撃するまで持続します。`;break;
      case 'weaponBuff':count='＋'+value;detail=`次の武器攻撃の最初の命中に${value}ダメージを加算。武器で攻撃するまで持続します。`;break;
      case 'magicBuff':count='＋'+value;detail=`次の雷属性攻撃の最初の命中に${value}ダメージを加算。雷で攻撃するまで持続します。`;break;
      case 'discount':count='−'+value;detail=`次の武器技カードの行動コストを${value}軽減します。最小0。使用すると解除されます。`;break;
      case 'evade':count=value;detail=`敵からの攻撃をあと${value}回無効化します。攻撃を受けるまで持続します。`;break;
      case 'reduce':count='−'+value;detail=`次に受ける敵の攻撃ダメージを${value}軽減します。攻撃を受けると解除されます。`;break;
      case 'counter':count=value;detail=`次に自分を攻撃した敵へ${value}ダメージで反撃します。反撃後に解除されます。`;break;
      case 'carry':count=value;detail=`ターン終了時、残った防御を最大${value}まで次のターンへ持ち越します。`;break;
    }
    if(card&&['burn','poison','freeze','weak','vulnerable'].includes(key))name='付与：'+name;
    return {key,name,detail,count,color:d.color,path:d.path};
  }
  const keys=Object.keys(defs).filter(k=>k!=='cleanse');
  function actorEffects(actor,player=false){
    if(!actor||!player&&actor.hp<=0)return [];
    const chosen=player?['poison','noDraw','buff','weaponBuff','magicBuff','discount','evade','reduce','counter','carry']:['burn','poison','freeze','weak','vulnerable'];
    const list=chosen.map(k=>effect(k,actor[k],player?'player':'enemy')).filter(Boolean);
    if(!player&&actor.poisonAttack)list.push({...effect('poison',2,'player'),name:'予告：毒攻撃',count:'!',detail:'この敵の攻撃を受けると、自分に毒が付与されます。ターン終了時にHPへ2ダメージ、2ターン継続。現在かかっている毒ではなく、敵の攻撃特性です。'});
    return list;
  }
  function cardEffects(c){
    if(!c?.e)return [];
    const list=keys.map(k=>effect(k,c.e[k],k==='noDraw'?'player':'enemy',true)).filter(Boolean);
    if(c.e.cleanse)list.push(effect('cleanse',1,'player',true));
    if(c.e.burnBonus&&!c.e.burn)list.push({...effect('burn',1),name:'条件：火傷特効',count:'＋'+c.e.burnBonus,detail:`対象が火傷中なら、攻撃ダメージを${c.e.burnBonus}加算します。このマーク自体は火傷を付与しません。`});
    return list;
  }
  function badge(item){return `<span class="status-mark" role="img" aria-label="${esc(item.name+'：'+item.detail)}" data-status-title="${esc(item.name)}" data-status-detail="${esc(item.detail)}" style="--status-color:${item.color}"><svg class="status-glyph" viewBox="0 0 24 24" aria-hidden="true"><path d="${item.path}"/></svg>${item.count!==''?'<small>'+esc(item.count)+'</small>':''}</span>`;}
  function row(list,card=false){return list.length?`<span class="${card?'card-status-marks':'actor-status-marks'}" role="group" aria-label="${card?'カードの状態効果':'状態効果'}">${list.map(badge).join('')}</span>`:'';}
  const oldCard=card;
  card=function(c,...args){
    let html=oldCard(c,...args);const list=cardEffects(c);if(!list.length)return html;
    const summary=list.map(x=>x.name+'：'+x.detail).join('\n');
    html=html.replace('<button class="card','<button data-status-summary="'+esc(summary)+'" class="card');
    return html.replace('<span class="desc">',row(list,true)+'<span class="desc">');
  };
  let tooltip=null,anchor=null,hideTimer=0;
  function hide(){clearTimeout(hideTimer);if(tooltip)tooltip.hidden=true;if(anchor?.getAttribute('aria-describedby')==='arcana-status-tooltip')anchor.removeAttribute('aria-describedby');anchor=null;}
  function show(target,combined=false){
    const title=combined?'状態効果の詳細':target.dataset.statusTitle;
    const detail=combined?target.dataset.statusSummary:target.dataset.statusDetail;
    if(!detail)return;
    hide();anchor=target;
    if(!tooltip){
      tooltip=document.createElement('div');tooltip.id='arcana-status-tooltip';tooltip.className='status-detail-tooltip';tooltip.setAttribute('role','tooltip');
      tooltip.addEventListener('pointerenter',()=>clearTimeout(hideTimer));
      tooltip.addEventListener('pointerleave',()=>{hideTimer=setTimeout(hide,120);});
    }
    const host=target.closest('dialog[open]')||document.body;host.append(tooltip);
    tooltip.innerHTML='<strong>'+esc(title)+'</strong><span>'+esc(detail)+'</span>';tooltip.hidden=false;
    target.setAttribute('aria-describedby',tooltip.id);
    const r=target.getBoundingClientRect(),t=tooltip.getBoundingClientRect(),width=document.documentElement.clientWidth,height=window.innerHeight;
    tooltip.style.left=Math.max(8,Math.min(width-t.width-8,r.left+r.width/2-t.width/2))+'px';
    const top=r.top-t.height-10;tooltip.style.top=Math.max(8,top>=8?top:Math.min(height-t.height-8,r.bottom+10))+'px';
  }
  document.addEventListener('pointerover',event=>{const target=event.target.closest?.('.status-mark');if(target&&target!==anchor)show(target);});
  document.addEventListener('pointerout',event=>{if(!anchor)return;const next=event.relatedTarget;if(next&&(anchor.contains(next)||tooltip?.contains(next)))return;hideTimer=setTimeout(hide,120);});
  document.addEventListener('focusin',event=>{const target=event.target.closest?.('[data-status-summary]');if(target)show(target,true);});
  document.addEventListener('focusout',()=>{hideTimer=setTimeout(hide,100);});
  document.addEventListener('click',event=>{
    const target=event.target.closest?.('.status-mark');if(!target)return;
    // Inspecting a mark must never play, purchase, or discard its parent card.
    event.preventDefault();event.stopImmediatePropagation();show(target);
  },true);
  document.addEventListener('pointerdown',event=>{if(!event.target.closest?.('.status-mark,.status-detail-tooltip'))hide();},true);
  document.addEventListener('keydown',event=>{if(event.key==='Escape')hide();});
  document.addEventListener('scroll',event=>{if(!tooltip?.contains(event.target))hide();},true);window.addEventListener('resize',hide);
  const oldRender=render;
  render=function(...args){
    hide();oldRender(...args);if(s?.phase!=='battle')return;
    document.querySelectorAll('.arena .enemy').forEach((node,i)=>{
      const list=actorEffects(s.enemies[i]);const previous=node.querySelector(':scope > .small:last-child');if(previous)previous.remove();
      node.insertAdjacentHTML('beforeend',row(list));
      if(list.length)node.setAttribute('data-status-summary',list.map(x=>x.name+'：'+x.detail).join('\n'));
    });
    const player=document.querySelector('.player-health');if(player){player.insertAdjacentHTML('beforeend',row(actorEffects(s,true)));const label=player.querySelector('.health-label');if(label)label.innerHTML=label.innerHTML.replace(' · 毒','');}
    const oldSummary=document.querySelector('.battle-effect-status');if(oldSummary)oldSummary.innerHTML='<span class="status-help">状態マークにマウスを重ねると詳細を表示。タップでも確認できます。</span>';
  };
  return {defs,effect,actorEffects,cardEffects,badge,row,hide};
})();

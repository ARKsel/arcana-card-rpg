/* Run-only discoveries, card sequencing and optional contracts. */
const ArcanaAdventure = (() => {
  'use strict';
  const relics = [
    {id:'ember',mark:'✺',name:'熾火の剣印',text:'魔法→武器技の連携時、最初の命中にさらに＋3ダメージ。'},
    {id:'echo',mark:'⌘',name:'星鳴りの触媒',text:'武器技→魔法の連携時、最初の命中にさらに＋3ダメージ。'},
    {id:'bastion',mark:'⬡',name:'眠れる城壁',text:'戦闘開始時、防御を6得る。'},
    {id:'page',mark:'▱',name:'失われた一頁',text:'戦闘開始時、追加でカードを1枚引く。'},
    {id:'bloom',mark:'❋',name:'帰り花の種',text:'戦闘勝利時、通常の回復に加えてHPを4回復。'},
    {id:'coin',mark:'◈',name:'黄金鼠の古貨',text:'戦闘勝利時、追加で12 Gを獲得。'},
    {id:'pulse',mark:'ϟ',name:'双奏の心臓',text:'各ターン最初の武器技・魔法の連携で、共鳴をさらに1得る。'},
    {id:'crown',mark:'♛',name:'砕けた王冠',text:'共鳴奥義「星砕き」の各対象へのダメージ＋8。'},
    {id:'guardian',mark:'◇',name:'銀糸の護符',text:'各ターン最初の防御を得るカードで、追加の防御2。'},
    {id:'thorn',mark:'♧',name:'夜咲きの毒牙',text:'各ターン最初に命中した武器技で、その敵に毒を1ターン付与。'},
    {id:'moon',mark:'☽',name:'月洗いの雫',text:'HP回復効果のあるカードを使うと、自分の毒を解除。'},
    {id:'lantern',mark:'✧',name:'旅路の灯火',text:'共鳴奥義「再起の光」のHP回復量＋5。'}
  ];
  const contracts = [
    {id:'wins',name:'遺跡の掃討',text:'戦闘に3回勝利する',goal:3},
    {id:'magic',name:'星の研究',text:'魔法カードを6回使う',goal:6},
    {id:'weapon',name:'鋼の証明',text:'武器技カードを6回使う',goal:6},
    {id:'links',name:'双奏の探求',text:'武器技と魔法の連携を4回発動する',goal:4},
    {id:'guards',name:'守りの心得',text:'防御を得るカードを3回使う',goal:3},
    {id:'healed',name:'命を繋ぐ者',text:'カードで実際にHPを合計12回復する',goal:12}
  ];
  const findRelic = id => relics.find(r=>r.id===id);
  function state(){
    if(!s)return null;
    if(!s.adventure){
      s.adventure={relics:[],offer:[],draftKeys:[],draftQueue:[],contract:null,contractLayer:0,contractOffer:[],totals:{wins:0,magic:0,weapon:0,links:0,guards:0,healed:0},claims:0,momentum:0,lastKind:null,burstUsed:false,turnFlags:{},links:0,bursts:0,notice:''};
      draft('arrival');
    }
    if(s.adventure.relics.length>1)s.adventure.relics=s.adventure.relics.slice(0,1);
    return s.adventure;
  }
  const has = id => !!state()?.relics.includes(id);
  function draft(key){
    const a=s.adventure;
    if(a.draftKeys.includes(key))return;
    a.draftKeys.push(key);
    if(a.offer.length){a.draftQueue.push(key);return;}
    a.offer=shuffle(relics.filter(r=>!a.relics.includes(r.id))).slice(0,3).map(r=>r.id);
  }
  function nextDraft(){const a=state();a.offer=[];if(a.draftQueue.length){a.draftQueue.shift();a.offer=shuffle(relics.filter(r=>!a.relics.includes(r.id))).slice(0,3).map(r=>r.id);}}
  function contractOptions(){
    const a=state();
    if(!a.contract&&a.contractLayer!==(s.layer||1)&&!a.contractOffer.length)
      a.contractOffer=shuffle(contracts).slice(0,3).map(c=>c.id);
    return a.contractOffer;
  }
  function progress(){
    const a=state(),c=a?.contract;if(!c)return 0;
    const spec=contracts.find(x=>x.id===c.id);
    return Math.min(spec.goal,Math.max(0,a.totals[c.id]-c.start));
  }
  function relicPanel(){
    const a=state();
    if(!a.offer.length)return '';
    return `<section class="adventure-draft" aria-label="遺物の発見"><div class="adventure-kicker">RELIC DISCOVERY</div><h2>遺跡が、あなたに応える。</h2><p>所持できる遺物は1つまで。新しい遺物を選ぶと入れ替わり、以前の効果は失われます。デッキ枠は使いません。${a.relics.length?'<br>現在の遺物：'+findRelic(a.relics[0]).name:''}</p><div class="adventure-choice-grid">${a.offer.map(id=>{const r=findRelic(id);return `<button onclick="chooseAdventureRelic('${r.id}')" aria-label="遺物 ${r.name}${a.relics.length?'に入れ替える':'を選ぶ'}"><span class="relic-sigil" aria-hidden="true">${r.mark}</span><strong>${r.name}</strong><span>${r.text}</span><small>${a.relics.length?'この遺物に入れ替える →':'この遺物を手に取る →'}</small></button>`}).join('')}</div><button class="adventure-skip" onclick="skipAdventureRelic()">${a.relics.length?'現在の遺物を維持する':'今回は受け取らない'}</button></section>`;
  }
  function questPanel(){
    const a=state(),c=a.contract;
    if(c){const spec=contracts.find(x=>x.id===c.id),n=progress(),ready=n>=spec.goal;
      return `<section class="adventure-contract" aria-label="冒険の依頼"><div><div class="adventure-kicker">OPTIONAL CONTRACT</div><h3>${spec.name}</h3><p>${spec.text} · ${n} / ${spec.goal}</p><progress aria-label="依頼の進捗" value="${n}" max="${spec.goal}"></progress></div><div><b>50 G ＋ 魔晶石2個</b><p class="small">魔晶石はリザルトで精算</p>${ready?'<button class="primary" onclick="claimAdventureContract()">依頼達成の報酬を受け取る</button>':'<span class="adventure-muted">進行中 · 達成後にここで報告</span>'}</div></section>`;
    }
    const options=contractOptions();
    if(!options.length)return '';
    return `<details class="adventure-contract-options"><summary>冒険の依頼を選ぶ <span>任意 · 3択 / 報酬50 G＋魔晶石2個</span></summary><div class="adventure-choice-grid">${options.map(id=>{const q=contracts.find(x=>x.id===id);return `<button onclick="chooseAdventureContract('${id}')"><strong>${q.name}</strong><span>${q.text}</span><small>この依頼を受ける →</small></button>`}).join('')}</div></details>`;
  }
  function collectionPanel(){
    const a=state();
    return `<div class="adventure-relic-bar"><span>冒険の遺物 <b>${a.relics.length} / 1</b></span>${a.relics.map(id=>{const r=findRelic(id);return `<span class="adventure-relic" title="${r.text}">${r.mark} ${r.name}</span>`}).join('')}<button onclick="openAdventureGuide()">効果・遊び方</button></div>`;
  }
  function attachCamp(){
    if(!s||!['explore','reward','shop'].includes(s.phase))return;
    state();
    const app=$('#app');
    app.innerHTML=app.innerHTML.replace(/<aside id="adventure-camp">[\s\S]*?<\/aside>/,'');
    const content=`<aside id="adventure-camp">${campContent()}</aside>`;
    // Put discoveries before the routes, so choices remain close to exploration.
    const marker='<div class="explore-actions">';
    app.innerHTML=app.innerHTML.includes(marker)?app.innerHTML.replace(marker,content+marker):app.innerHTML+content;
  }
  function campContent(){const a=state();return `${a.notice?'<p class="adventure-notice" role="status">'+a.notice+'</p>':''}${relicPanel()}${questPanel()}${collectionPanel()}`;}
  function refreshCamp(){
    // Redraw only our panel: never regenerate routes, shop stock, or reward cards.
    const panel=document.getElementById('adventure-camp');
    if(panel)panel.innerHTML=campContent();
  }
  function chooseRelic(id){
    if(!s||!['explore','reward','shop'].includes(s.phase))return;
    const a=state();if(!a.offer.includes(id)||a.relics.includes(id))return;
    const previous=a.relics[0];a.relics=[id];nextDraft();a.notice=previous?findRelic(previous).name+'を手放し、'+findRelic(id).name+'に入れ替えた。':findRelic(id).name+'を手に入れた。';
    playSE('buy');refreshCamp();
  }
  function skipRelic(){if(!s||!['explore','reward','shop'].includes(s.phase))return;nextDraft();refreshCamp();}
  function chooseContract(id){
    if(!s||!['explore','reward','shop'].includes(s.phase))return;
    const a=state();if(a.contract||!a.contractOffer.includes(id))return;
    a.contract={id,start:a.totals[id]};a.contractOffer=[];a.contractLayer=s.layer||1;
    playSE('click');refreshCamp();
  }
  function claimContract(){
    if(!s||!['explore','reward','shop'].includes(s.phase))return;
    const a=state(),c=a.contract;if(!c)return;
    const spec=contracts.find(x=>x.id===c.id);if(progress()<spec.goal)return;
    // Clear first so repeated clicks cannot claim the same reward twice.
    const oldGold=s.gold,oldPending=pendingCrystals();
    a.contract=null;a.claims++;s.gold+=50;s.earned+=50;queueCrystals(2,'event');
    a.notice=spec.name+'を達成！ 50 G獲得。魔晶石2個は終了時に精算。';
    playSE('win');
    if(s.phase==='explore'){
      const hud=document.querySelector('.dungeon-hud');
      if(hud)hud.innerHTML=hud.innerHTML.replace('◈ '+oldGold+' G','◈ '+s.gold+' G');
      document.querySelectorAll('.hint').forEach(hint=>{
        const before='未精算の魔晶石：'+oldPending+'個';
        if(hint.textContent.includes(before))hint.innerHTML=hint.innerHTML.replace(before,'未精算の魔晶石：'+pendingCrystals()+'個');
      });
      refreshCamp();
    }else if(s.phase==='reward')reward();else shop();
  }
  function battlePanel(){
    const a=state(),ready=a.momentum>=6&&!a.burstUsed&&!s.pending;
    return `<section class="adventure-resonance ${ready?'resonance-ready':''}" aria-label="共鳴と連携"><div class="resonance-heading"><div><span class="adventure-kicker">RESONANCE</span><h3>${a.burstUsed?'共鳴奥義 発動済み':ready?'共鳴解放 — 奥義を選べる':'共鳴を繋ぐ'}</h3></div><span class="resonance-count">${a.momentum}<small> / 6</small></span></div><div class="resonance-track" role="progressbar" aria-label="共鳴ゲージ" aria-valuemin="0" aria-valuemax="6" aria-valuenow="${a.momentum}">${Array.from({length:6},(_,i)=>`<i class="${i<a.momentum?'lit':''}"></i>`).join('')}</div><p>カード使用で＋1。武器技⇄魔法を続けると＋2、攻撃なら最初の命中＋2。連携・共鳴ゲージはターン更新時にリセット。</p><div class="resonance-actions"><button onclick="useAdventureBurst('strike')" ${!ready?'disabled':''}><b>星砕き</b><span>敵全体に${burstDamage()}ダメージ</span></button><button onclick="useAdventureBurst('guard')" ${!ready?'disabled':''}><b>不落の結界</b><span>防御${14+Math.min(20,s.layer||1)*2}を得る</span></button><button onclick="useAdventureBurst('renew')" ${!ready?'disabled':''}><b>再起の光</b><span>HP${has('lantern')?11:6}・行動1・マナ1回復</span></button></div><div class="resonance-foot"><span>${a.notice||'6で奥義解放 · 各戦闘1回 · 行動/マナ消費なし'}</span><button onclick="openAdventureGuide()">遺物・連携の説明</button></div></section>`;
  }
  function burstDamage(){return 12+Math.min(20,s?.layer||1)*2+(has('crown')?8:0);}
  function burst(kind){
    if(!s||s.phase!=='battle'||s.pending||!['strike','guard','renew'].includes(kind)||s.hp<=0)return;
    const a=state();if(a.momentum<6||a.burstUsed||!s.enemies.some(e=>e.hp>0))return;
    a.momentum=0;a.burstUsed=true;a.bursts++;
    if(kind==='strike'){let damage=0;for(const enemy of s.enemies)if(enemy.hp>0)damage+=hurt(enemy,burstDamage());a.notice='共鳴奥義・星砕き：合計'+damage+'ダメージ。';playSE('magic');}
    if(kind==='guard'){const n=14+Math.min(20,s.layer||1)*2;s.block+=n;s.guard=true;a.notice='共鳴奥義・不落の結界：防御＋'+n+'。';playSE('heal');}
    if(kind==='renew'){const before=s.hp;s.hp=Math.min(s.max,s.hp+(has('lantern')?11:6));s.energy=Math.min(s.stats.maxEnergy,s.energy+1);s.mana=Math.min(s.stats.maxMana,s.mana+1);a.notice='共鳴奥義・再起の光：HP＋'+(s.hp-before)+'、行動・マナ回復。';playSE('heal');}
    note(a.notice);if(!winCheck())render();
  }
  function openGuide(){
    let dialog=document.getElementById('adventure-guide');
    if(!dialog){dialog=document.createElement('dialog');dialog.id='adventure-guide';dialog.className='weapon-art-dialog';dialog.setAttribute('aria-label','遺物と共鳴の遊び方');document.body.append(dialog);}
    dialog.innerHTML=`<div class="weapon-art-titlebar"><h2>遺物と共鳴</h2><button onclick="document.getElementById('adventure-guide').close()">閉じる ×</button></div><p>武器技と魔法を交互に使い、共鳴6で奥義を選択。奥義は各戦闘1回、3種から1つ使えます。汎用カードで連携が途切れ、ターン更新時に連携と共鳴ゲージは0へ戻ります。共鳴6は同じターン内に溜めて使ってください。</p><p>遺物は出発時・戦闘3勝ごと・ボス撃破で3択。受け取るまで候補は固定。所持は1つまでで、新たに選ぶと現在の遺物と入れ替わります。以前の効果は失われます。デッキ枠は消費しません。遺物・共鳴・依頼は次の冒険に持ち越しません。</p><p>依頼は任意です。受注後の行動で進み、探索・ショップ・報酬画面で報告できます。報告した層では再受注できず、次の層から新しい依頼を選べます。</p><div class="adventure-choice-grid guide-relics">${relics.map(r=>`<article class="${has(r.id)?'relic-owned':''}"><span class="relic-sigil">${r.mark}</span><h3>${r.name}${has(r.id)?' · 所持中':''}</h3><p>${r.text}</p></article>`).join('')}</div>`;
    dialog.showModal();
  }
  let resolution=null;
  const oldHit=criticalHit;
  criticalHit=function(enemy,n,pierce,c){
    if(resolution&&c===resolution.card){
      if(!resolution.hit){n+=resolution.bonus;resolution.hit=true;}
      if(c.e.hit&&weapons.includes(c.g)&&has('thorn')&&!state().turnFlags.thorn){enemy.poison=Math.max(enemy.poison||0,1);state().turnFlags.thorn=true;}
    }
    const damage=oldHit(enemy,n,pierce,c);
    if(resolution&&c===resolution.card)resolution.damage+=damage;
    return damage;
  };
  const oldPlay=play;
  play=function(i){
    if(!s||s.phase!=='battle'||s.pending||!Number.isInteger(i)||i<0||i>=s.hand.length){oldPlay(i);return;}
    const c=all[s.hand[i]];normalizeEnemyTarget();if(!c||!can(c)||!s.enemies.some(e=>e.hp>0)){oldPlay(i);return;}
    const run=s,a=state(),kind=weapons.includes(c.g)?'weapon':magics.includes(c.g)?'magic':'common';
    const linked=(kind==='weapon'&&a.lastKind==='magic')||(kind==='magic'&&a.lastKind==='weapon');
    let bonus=linked?2:0;if(linked&&kind==='weapon'&&has('ember'))bonus+=3;if(linked&&kind==='magic'&&has('echo'))bonus+=3;
    const hp=s.hp,played=s.played;
    const resolved={card:c,bonus,hit:false,damage:0};resolution=resolved;
    try{oldPlay(i);}finally{resolution=null;}
    if(s!==run||s.played!==played+1)return;
    a.lastKind=kind;
    if(kind==='weapon'||kind==='magic')a.totals[kind]++;
    if(c.e.block){a.totals.guards++;if(has('guardian')&&!a.turnFlags.guard){s.block+=2;a.turnFlags.guard=true;}}
    if(c.e.heal||c.e.drain){const healing=(c.e.heal?c.e.heal+s.stats.healing:0)+(c.e.drain?Math.floor(resolved.damage/2):0);a.totals.healed+=Math.max(0,Math.min(healing,s.max-hp+(c.e.hpCost||0)));}
    if(c.e.heal&&has('moon'))s.poison=0;
    let charge=linked?2:1;
    if(linked){a.links++;a.totals.links++;if(has('pulse')&&!a.turnFlags.pulse){charge++;a.turnFlags.pulse=true;}a.notice='双奏連携！ '+(!a.burstUsed?'共鳴＋'+charge:'奥義発動済み')+(c.e.hit?' / 最初の命中＋'+bonus:'');note(a.notice);}
    else a.notice=c.n+(a.burstUsed?' · 奥義発動済み':' · 共鳴＋1');
    if(!a.burstUsed)a.momentum=Math.min(6,a.momentum+charge);
    if(s.phase==='battle')render();else if(s.phase==='reward')refreshCamp();
  };
  const oldTurn=newTurn;
  newTurn=function(){if(s){const a=state();a.momentum=0;a.lastKind=null;a.turnFlags={};a.notice='';}oldTurn();};
  const oldBattle=battle;
  battle=function(){
    const a=state();a.momentum=0;a.lastKind=null;a.burstUsed=false;a.turnFlags={};a.notice='';
    oldBattle();
    if(has('bastion')){s.block+=6;s.guard=true;note('眠れる城壁：防御＋6。');}
    if(has('page')){draw(1);note('失われた一頁：追加で1枚引いた。');}
    render();
  };
  const oldWin=winCheck;
  winCheck=function(){
    if(!s||s.phase!=='battle'||!s.enemies.every(e=>e.hp<=0))return false;
    const a=state();a.totals.wins++;
    if(has('coin')){s.gold+=12;s.earned+=12;}
    if(has('bloom'))s.hp=Math.min(s.max,s.hp+4);
    if(s.encounterSpec?.boss||(s.battlesWon+1)%3===0)draft('victory-'+(s.battlesWon+1));
    return oldWin();
  };
  for(const name of ['exploration','reward','shop']){
    if(name==='exploration'){const old=exploration;exploration=function(...args){old(...args);attachCamp();};}
    if(name==='reward'){const old=reward;reward=function(...args){old(...args);attachCamp();};}
    if(name==='shop'){const old=shop;shop=function(...args){old(...args);attachCamp();};}
  }
  const oldRender=render;
  render=function(){oldRender();if(s?.phase==='battle'){const app=$('#app');app.innerHTML=app.innerHTML.replace('<div class="cards">',battlePanel()+'<div class="cards">');}};
  const oldFinish=finish;
  finish=function(...args){oldFinish(...args);const a=s?.adventure;if(a)$('#app').innerHTML+=`<section class="adventure-result"><h2>今回の冒険の軌跡</h2><div><span>双奏連携 <b>${a.links}回</b></span><span>共鳴奥義 <b>${a.bursts}回</b></span><span>依頼達成 <b>${a.claims}件</b></span></div>${collectionPanel()}<p>遺物は遺跡へ還ります。次の冒険では、新たな組み合わせを。</p></section>`;};
  Object.assign(globalThis,{chooseAdventureRelic:chooseRelic,skipAdventureRelic:skipRelic,chooseAdventureContract:chooseContract,claimAdventureContract:claimContract,useAdventureBurst:burst,openAdventureGuide:openGuide});
  const oldSetup=setup;
  setup=function(){oldSetup();$('#app').innerHTML+='<section class="adventure-intro"><span class="adventure-kicker">A DIFFERENT JOURNEY, EVERY TIME</span><h2>遺物を選び、武器と魔法を繋げ。</h2><p>冒険限定の遺物12種類から、所持する1つを選択。ターン内で繋ぐ共鳴と3種類の奥義。<br>自分のデッキに合う依頼を選んで、遺跡の奥へ。</p><button onclick="openAdventureGuide()">新しい冒険の遊び方</button></section>';};
  if(!s)setup();
  return {state,relics,contracts,progress};
})();

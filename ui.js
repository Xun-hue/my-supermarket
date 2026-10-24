// 全部介面：HUD、底部 7 個分頁、擴店 7 個子頁。數值先用示範資料，流程之後一步步接上。
import {initStore} from './store.js';
const $=id=>document.getElementById(id),f=n=>'$'+Math.round(n).toLocaleString();
const store=initStore($('stage'));
const P=[['water','礦泉水','💧',12,20],['cola','可樂','🥤',15,25],['milk','鮮奶','🥛',50,75,1],['chips','洋芋片','🍟',28,45],['choco','巧克力','🍫',38,59],['noodle','泡麵','🍜',22,35],['onigiri','御飯糰','🍙',22,35,1]]
 .map(([id,n,e,cost,price,cold],i)=>({id,n,e,cost,price,mkt:price,cold:!!cold,pack:[24,24,12,12,12,12,12][i],wh:cold?0:24,shelf:cold?0:8,want:0}));
const S={money:3000,star:80,visit:0,lv:1,min:480,day:1,phase:'prep',orders:[],qOpen:false,total:0,stat:{served:0,perfect:0,rev:0,thief:0,member:0,hot:0},daily:[],tab:'cash',sub:'store',pm:'cash',sel:-1,own:{},hired:{},kb:'',ambCap:600,coldCap:1000};
const CAT={
 equip:[['cold','❄️','冷藏庫','解鎖冷藏倉容量（鮮奶、御飯糰要用）',1500],['hot','🍢','熱食檔口','賣關東煮、茶葉蛋、熱狗',350],['dine','🪑','就餐區','座位帶來額外客流與心情',480],['charge','🔋','共享行動電源','出租收入約 $8/天',120],['scan','⚡','一鍵掃台','收銀時出現「一鍵結算」',150],['pos','💳','智能POS','刷卡自動收款',180],['ac','🌬️','中央空調','夏天顧客心情＋',250]],
 staff:[['stock','🧑‍🔧','理貨員','自動把倉庫的貨補上貨架',50,2],['buyer','🧾','採購員','缺貨時自動進貨',70,3],['guard','👮','保安','抓小偷',80,2],['pack','📦','打包員','外送訂單打包',50,3],['night','🌙','夜班店員','打烊後也能 24 小時營業',90,3]],
 mkt:[['flyer','📄','發傳單','明天客流 +25%',160],['ig','📱','IG 限動廣告','客流 +20%、口碑 +3',240],['member','💳','會員卡','會員折扣，回頭客更多',500]]};
// 等級名稱表：原作至少有 Lv9，之後要加新等級只要在這裡多加一行名字（沒寫名字的等級會顯示「Lv數字」）
const LV=['街角柑仔店','社區便利店','鄰里超市','區域超市','大型量販店','連鎖旗艦店','生活購物中心','城市百貨','超級商業廣場'];
const MAXLV=9,lvName=n=>LV[n-1]||'Lv'+n;
const nextLv=()=>S.lv<MAXLV?`🎯 擴店升級為「${lvName(S.lv+1)}」 0/3 +$${500*S.lv}`:'🏆 已是最高等級';
const SUBS=[['store','店鋪'],['equip','設備'],['staff','員工'],['mkt','營銷'],['decor','裝修'],['bank','銀行'],['ledger','帳本']];
const TABS=[['cash','🧾','收銀'],['shelf','🗄️','貨架'],['wh','📦','倉庫'],['price','🏷️','價格'],['exp','🏪','擴店'],['food','🍜','餐飲'],['set','⚙️','設定']];
const DEN=[[1000,'#3a6bc4'],[500,'#b8864b'],[200,'#2c9b7f'],[100,'#d94452'],[50,'#e0b84a;color:#333'],[10,'#c9a63c;color:#333'],[5,'#c7ccd6;color:#333'],[1,'#b9bec8;color:#333']];
const pr=id=>P.find(p=>p.id===id),btn=(a,v,t,c)=>`<button class="${c||'sm'}" data-a="${a}" data-v="${v}">${t}</button>`;
const used=c=>P.filter(p=>p.cold===c).reduce((a,p)=>a+p.wh,0);
function toast(s,bad){const e=$('toast');e.textContent=s;e.className=bad?'bad':'';e.style.opacity=1;clearTimeout(toast.h);toast.h=setTimeout(()=>e.style.opacity=0,1300)}
// ---- 任務：升級任務（3 個條件）＋每日隨機任務 ----
const POOL=[['perfect','完美找零',[3,5,8],'次',[60,100,160]],['served','服務顧客',[20,30,40],'位',[80,120,180]],['rev','單日營業額達',[600,900,1500],'元',[100,160,260]],['visit','進店人數達',[25,40,60],'人',[60,100,150]],['thief','抓到小偷',[1,2,3],'個',[120,200,300]],['member','新增會員',[2,4,6],'位',[80,120,180]],['hot','賣出熱食',[8,12,20],'份',[80,120,200]]];
function newDaily(){return POOL.map(a=>[Math.random(),a]).sort((x,y)=>x[0]-y[0]).slice(0,3).map(([,a])=>{const d=rnd3(a[2].length);return{k:a[0],n:a[1],goal:a[2][d],unit:a[3],reward:a[4][d],done:false}})}
function rnd3(n){return Math.floor(Math.random()*n)}
const qv=k=>k==='visit'?S.visit:(S.stat[k]||0);
function mainConds(){const g=[1500*S.lv,80+5*S.lv,5+S.lv],c=[S.total,S.star,store.shelves.length];return[['累計營業額',f],['店鋪星級',x=>x],['貨架數量',x=>x+' 個']].map(([n,fm],i)=>({n,cur:c[i],goal:g[i],ok:c[i]>=g[i],show:fm(c[i])+' / '+fm(g[i])}))}
function qPanel(mc){const lvl=S.lv<MAXLV;return `<div class=qp><h4>${lvl?'升級「'+lvName(S.lv+1)+'」':'已是最高等級'}（${mc.filter(c=>c.ok).length}/3）</h4>`+mc.map(c=>`<div class=qr><div class=t>${c.ok?'✅':'⬜'} ${c.n}<small>${c.show}</small><div class=b2><i style="width:${Math.min(100,c.cur/c.goal*100)}%"></i></div></div></div>`).join('')+(lvl?`<div class=qr><div class=t>獎勵 ${f(500*S.lv)}</div><button data-a="upgrade" ${mc.every(c=>c.ok)?'':'disabled'}>升級</button></div>`:'')+`<h4>📅 每日任務 <small style="font-weight:500;color:#8a7566">隔天換新的</small></h4>`+S.daily.map((d,i)=>{const v=qv(d.k),ok=v>=d.goal;return `<div class=qr><div class=t>${d.n} ${d.goal}${d.unit}<small>${Math.min(v,d.goal)}/${d.goal} · 獎勵 ${f(d.reward)}</small><div class=b2><i style="width:${Math.min(100,v/d.goal*100)}%"></i></div></div><button data-a="claim" data-v="${i}" ${ok&&!d.done?'':'disabled'}>${d.done?'已領':'領取'}</button></div>`}).join('')+`</div>`}
S.daily=newDaily();
function hud(){const pr=S.phase==='prep',m=Math.floor(S.min),T=String(Math.floor(m/60)).padStart(2,'0')+':'+String(m%60).padStart(2,'0'),W=['一','二','三','四','五','六','日'][(S.day+1)%7],clk=pr?'準備中':S.phase==='open'?T:'已打烊',mc=mainConds();
 const h=`<div class=r1 data-p="${S.phase}"><span class=pill style="font-size:15px"><span id=clock>{T}</span> <small style="color:#8a7566">第${S.day}天 週${W}</small></span></div><div class=r1><span class="pill r">日日鮮超市 Lv${S.lv}</span><span class=pill>⭐ ${S.star}</span>${pr?'':`<span class=pill>👥 ${S.visit} 進店</span>`}</div><div class=quest data-a="quest">${S.lv<MAXLV?`🎯 擴店升級為「${lvName(S.lv+1)}」 ${mc.filter(c=>c.ok).length}/3`:'🏆 已是最高等級'} ${S.qOpen?'▾':'▸'}</div>${S.qOpen?qPanel(mc):''}<div class=r1><span class=pill>🪙 ${f(S.money)}</span></div>`;
 if(hud.k!==h){hud.k=h;$('hud').innerHTML=h.replace('{T}',clk)}else{const c=$('clock');if(c)c.textContent=clk}
 $('openBtn').style.display=pr?'block':'none';$('closeBtn').style.display=(S.phase==='open'&&S.min>=1320)?'block':'none'}
// ---- 各分頁 ----
function rCash(){const mk={cash:`<div class=rc><div class=l>牛奶 ×3　$14<br>啤酒 ×2　$11<br>可樂 ×4　$12</div><div class=r><small>應收</small><b>$37</b></div></div><div class=info><div>顧客付<b>$100</b></div><div>應找<b style="color:#ff5a4e">$63</b></div><div>已找<b style="color:#3a6bc4">$0</b></div></div><div class=bills style="grid-template-columns:repeat(4,1fr)">${DEN.map(d=>`<button class=b style="background:${d[1]}" data-a="toast" data-v="找零流程之後接上">$${d[0]}</button>`).join('')}</div><div class=acts>${btn('toast','x','撤銷','btn g')}${btn('toast','x','清空','btn g')}${btn('toast','x','確認找零','btn')}</div>`,
 qr:`<div class=rc><div class=l>礦泉水 ×2　$40<br>洋芋片　$45</div><div class=r><small>應收</small><b>$85</b></div></div><div class=qrw><div class=qr>${Array.from({length:81},()=>`<i style="background:${Math.random()<.5?'#111':'#fff'}"></i>`).join('')}</div><div style="flex:1"><b>顧客出示了付款碼</b><br><br>${btn('toast','x','📷 掃碼收款','btn w')}</div></div>`,
 card:`<div class=rc><div class=l>鮮奶 ×3　$225<br>巧克力　$59</div><div class=r><small>應收</small><b>$284</b></div></div><div class=lcd>NT$ ${S.kb||'<span style="opacity:.5;font-size:15px">輸入應收金額</span>'}</div><div class=kp>${['1','2','3','4','5','6','7','8','9','C','0','<'].map(k=>`<button class=b data-a="kp" data-v="${k}">${k==='<'?'⌫':k}</button>`).join('')}</div><div style="margin-top:8px">${btn('toast','刷卡流程：輸入密碼中… → 列印簽單中…','確認收款','btn w')}</div>`};
 return `<div class=c><div style="font-size:40px">🧾</div><b>暫時沒人排隊</b><p>可以去補貨、調價～</p></div><div class=hd><span>收銀介面預覽</span><small>流程之後接上</small></div><div class=chips>${[['cash','💵 現金'],['qr','📱 行動支付'],['card','💳 刷卡']].map(([k,n])=>btn('pm',k,n,'chip'+(S.pm===k?' on':''))).join('')}</div>${mk[S.pm]}`}
function rShelf(){const sh=store.shelves;return `<div class=hd><span>貨架管理</span><small>點一排看它在店裡的位置</small></div><div class=hint>👍 所有貨架都挺滿的</div>`+sh.map((s,i)=>{const on=S.sel===i,fill=[90,70,55,100,40,80][i];
 return `<div class=card style="${on?'border-color:#ff5a4e':''}"><div class=nm>${s.name}<small>貨架 Lv1 · 6 格</small><div class=bar style="margin-top:6px"><i style="width:${fill}%"></i></div></div>${btn('sel',on?-1:i,on?'收起':'查看',on?'sm g':'sm')}</div>`+(on?`<div style="padding:0 4px 10px">${P.slice(0,3).map(p=>`<div class=row><span class=ic>${p.e}</span><div class=nm>${p.n}<small>貨架 ${p.shelf}/12 · 倉庫 ${p.wh}</small></div>${btn('toast','補貨之後接上','補滿','sm g')}</div>`).join('')}<div class=acts style="margin-top:8px">${btn('toast','之後接上','整架補滿','btn g')}${btn('toast','之後接上','擴貨 $200','btn g')}${btn('toast','之後接上','轉 90°','btn g')}</div></div>`:'')}).join('')}
function rWh(){const au=used(false),cu=used(true),cold=S.own.cold,want=P.reduce((a,p)=>a+p.want,0),cost=P.reduce((a,p)=>a+p.want*p.cost*p.pack,0);
 return `<div class=hd><span>倉庫進貨</span><small>${S.phase==='prep'?'開門前下單立即到貨':'營業中下單，30 分鐘後到'}</small>${btn('toast','之後接上','智能補貨','sm g')}</div><div class=cap>常溫 ${au}/${S.ambCap}<div class=bar><i style="width:${au/S.ambCap*100}%"></i></div></div><div class=cap>${cold?`冷藏 ${cu}/${S.coldCap}<div class=bar><i style="width:${cu/S.coldCap*100}%;background:#4aa3ff"></i></div>`:`❄️ 冷藏庫未購買　${btn('tab','exp','去擴店購買','sm')}`}</div>`+
 P.map(p=>{const lock=p.cold&&!cold;return `<div class=row style="${lock?'opacity:.5':''}"><span class=ic>${p.e}</span><div class=nm>${p.n}${p.cold?' ❄️':''}<small>進價 ${f(p.cost)} · 倉庫 ${p.wh} · 貨架 ${p.shelf} · 1箱=${p.pack}件</small></div>${lock?'<span class="sm off">需冷藏庫</span>':btn('want',p.id+'|-1','−','sm g')+`<b style="width:22px;text-align:center">${p.want}</b>`+btn('want',p.id+'|1','＋','sm g')}</div>`}).join('')+
 (S.orders.length?`<div class=hint>🚚 配送中：${S.orders.map(o=>pr(o.id).n+' ×'+o.q).join('、')}</div>`:'')+`<div style="position:sticky;bottom:0;background:var(--bg);padding:10px 0 2px;display:flex;justify-content:space-between;align-items:center"><div><small style="color:var(--sub)">合計</small><br><b style="font-size:20px;color:#d64034">${f(cost)}</b></div>${btn('order','x','下單進貨',want?'btn':'btn g')}</div>`}
function rPrice(){return `<div class=hd><span>今日價格</span><small>市價每天浮動</small></div><div class=chips>${btn('pall','mkt','全部=市價','chip')}${btn('pall','.9','全部九折','chip')}${btn('pall','1.1','全部+10%','chip')}</div>`+P.map(p=>{const m=Math.round((p.price-p.cost)/p.price*100),d=Math.round((p.price-p.mkt)/p.mkt*100);
 return `<div class=row><span class=ic>${p.e}</span><div class=nm>${p.n}<small>進價 ${f(p.cost)} · 市價 ${f(p.mkt)} · 毛利 ${m}%${d?` · <span style="color:${d>0?'#d94452':'#2c9b7f'}">${d>0?'偏貴':'偏便宜'} ${Math.abs(d)}%</span>`:''}</small></div>${btn('price',p.id+'|-1','−','sm g')}<b style="width:46px;text-align:center">${f(p.price)}</b>${btn('price',p.id+'|1','＋','sm g')}</div>`}).join('')}
function cards(k){return CAT[k].map(([id,ic,n,d,p,lv])=>{const lock=lv&&S.lv<lv,own=k==='staff'?S.hired[id]:S.own[id];
 return `<div class=card><span class=ic>${ic}</span><div class=nm>${n}<small>${d}${k==='staff'?` · 工資 ${f(p)}/天`:''}</small></div>${lock?`<span class="sm off">Lv${lv}</span>`:btn('buy',k+'|'+id,own?(k==='staff'?'解雇':'已擁有'):(k==='staff'?'雇用':f(p)),own?(k==='staff'?'sm g':'sm ok'):'sm')}</div>`}).join('')}
function rExp(){const sub={
 store:`<div class=card><span class=ic>🏪</span><div class=nm>日日鮮超市 Lv${S.lv}<small>${lvName(S.lv)} · 租金 $80/天 · 目前 6 個貨架</small></div></div><div class=card><span class=ic>🏗️</span><div class=nm>店面擴建<small>面積變大、可放更多貨架</small></div>${btn('toast','之後接上','$3,800','sm')}</div><div class=hint>${nextLv()}</div>`,
 equip:cards('equip'),staff:`<div class=hint>員工每天結算工資；有些要店鋪等級夠才能雇用</div>`+cards('staff'),mkt:cards('mkt'),
 decor:`<div class=hd><span>牆壁顏色</span></div><div class=sw>${[[0xf6ede2,'奶油'],[0xcfe6f7,'淺藍'],[0xf7d5dd,'粉紅'],[0xd6f0e0,'薄荷']].map(([c,n])=>`<button style="background:#${c.toString(16)}" data-a="wall" data-v="${c}" title="${n}"></button>`).join('')}</div><div class=hd><span>擺設</span><small>心情加成</small></div>${[['🪴','綠植','心情 +0.8',80],['🖼️','海報','心情 +0.6',50],['🧶','地毯','心情 +0.6',120]].map(([i,n,d,p])=>`<div class=card><span class=ic>${i}</span><div class=nm>${n}<small>${d}</small></div>${btn('toast','之後接上',f(p),'sm')}</div>`).join('')}`,
 bank:`<div class=hd><span>現金 ${f(S.money)}</span></div><div class=card><span class=ic>🏦</span><div class=nm>活期<small>日息 0.2%，隨存隨取</small></div>${btn('toast','之後接上','存入','sm')}</div><div class=card><span class=ic>🔒</span><div class=nm>定期<small>3 天 1.2% · 7 天 3.5% · 14 天 9%</small></div>${btn('toast','之後接上','存入','sm')}</div><div class=card><span class=ic>💸</span><div class=nm>貸款<small>日息 0.8%，額度隨資產成長</small></div>${btn('toast','之後接上','借款','sm')}</div>`,
 ledger:`<div class=stats><div>總資產<b>${f(S.money+9000)}</b></div><div>累計營業額<b>$16,755</b></div><div>累計服務<b>599 人</b></div></div><div class=chart>${[3,2.5,5,6.5,3,4.5,3.8].map((v,i)=>`<div style="height:${v*14}px"><span>D${i+3}</span></div>`).join('')}</div><div class=ln style="margin-top:22px"><span>最佳單日利潤</span><b>$1,093</b></div><div class=ln><span>完美找零</span><b>72 次</b></div><div class=ln><span>顧客流失</span><b>18 人</b></div>`}[S.sub];
 return `<div class=chips>${SUBS.map(([k,n])=>btn('sub',k,n,'chip'+(S.sub===k?' on':''))).join('')}</div>${sub}`}
function rFood(){if(!S.own.hot)return `<div class=c><div style="font-size:40px">🍢</div><b>還沒有熱食檔口</b><p>買了才能賣關東煮、茶葉蛋、熱狗，每道菜要先備食材</p>${btn('tab','exp','去擴店 → 設備','btn')}</div>`;
 return `<div class=hd><span>熱食菜單</span><small>價格自己定</small></div>`+[['🍢','關東煮',12,25],['🥚','茶葉蛋',8,15],['🌭','熱狗',14,30],['🍠','烤地瓜',18,40]].map(([i,n,c,p])=>`<div class=row><span class=ic>${i}</span><div class=nm>${n}<small>成本 ${f(c)} · 售價 ${f(p)} · 每份毛利 ${Math.round((p-c)/p*100)}%</small></div>${btn('toast','之後接上','上架','sm g')}</div>`).join('')}
function rSet(){const row=(n,d,b)=>`<div class=row><div class=nm>${n}<small>${d}</small></div>${b}</div>`;
 return `<div class=hd><span>設定</span></div>`+row('畫質','卡頓時選流暢',btn('toast','之後接上','標準','sm g'))+row('同屏顧客','少一點更流暢',btn('toast','之後接上','正常','sm g'))+row('超市名字','日日鮮超市',btn('toast','之後接上','改名','sm g'))+row('雲存檔','之後用 Firebase 接上',btn('toast','之後接上','同步','sm g'))+row('玩法說明','','')+`<div style="margin-top:12px">${btn('reset','x','重新開店','btn g w')}</div>`}
function render(){$('tabs').innerHTML=TABS.map(([k,i,n])=>`<button class="tab${S.tab===k?' on':''}" data-a="tab" data-v="${k}"><b>${i}</b>${n}</button>`).join('');
 const keep=$('sheet').scrollTop;$('sheet').innerHTML='<div class=grab data-a="grab"><i></i></div>'+({cash:rCash,shelf:rShelf,wh:rWh,price:rPrice,exp:rExp,food:rFood,set:rSet})[S.tab]();$('sheet').scrollTop=keep;hud()}
// ---- 動作 ----
function buy(v){const[k,id]=v.split('|'),it=CAT[k].find(x=>x[0]===id),pri=it[4];
 if(k==='staff'){S.hired[id]=!S.hired[id];toast(S.hired[id]?'已雇用 '+it[2]:'已解雇 '+it[2]);return}
 if(S.own[id])return toast('已經擁有了');if(S.money<pri)return toast('資金不足',1);
 S.money-=pri;S.own[id]=1;if(id==='hot'||id==='dine')store.setVisible(id,true);toast('已購買 '+it[2])}
function focus(){const t=S.tab;store.focus(t==='shelf'?(S.sel>=0?'shelf'+S.sel:'shelves'):t==='wh'?'wh':t==='cash'?'cash':t==='food'?'food':'all')}
function act(a,v){v=String(v);const[x,y]=v.split('|');
 if(a==='toast'){toast(v==='x'?'之後接上':v);return}
 if(a==='tab'){S.tab=v;S.sel=-1;store.mark(-1);focus()}else if(a==='sub')S.sub=v;else if(a==='pm')S.pm=v;
 else if(a==='sel'){S.sel=+v;store.mark(+v);focus()}
 else if(a==='want')pr(x).want=Math.max(0,pr(x).want+ +y);
 else if(a==='order'){const c=P.reduce((s,p)=>s+p.want*p.cost*p.pack,0);if(!c)return;if(c>S.money)return toast('資金不足',1);const qa=P.filter(p=>!p.cold).reduce((n,p)=>n+p.want*p.pack,0),qc=P.filter(p=>p.cold).reduce((n,p)=>n+p.want*p.pack,0);if(used(false)+qa>S.ambCap||used(true)+qc>S.coldCap)return toast('倉庫空間不足',1);S.money-=c;P.forEach(p=>{if(p.want){const q=p.want*p.pack;if(S.phase==='prep')p.wh+=q;else S.orders.push({id:p.id,q,eta:S.min+30});p.want=0}});toast(S.phase==='prep'?'已下單，貨立即到倉庫':'已下單，遊戲內 30 分鐘後到貨')}
 else if(a==='price')pr(x).price=Math.max(1,pr(x).price+ +y);
 else if(a==='pall')P.forEach(p=>p.price=Math.max(1,Math.round(v==='mkt'?p.mkt:p.price*+v)));
 else if(a==='buy')buy(v);else if(a==='wall')store.setWall(+v);
 else if(a==='kp')S.kb=v==='C'?'':v==='<'?S.kb.slice(0,-1):(S.kb+v).slice(0,5);
 else if(a==='grab')$('app').classList.toggle('min');
 else if(a==='quest')S.qOpen=!S.qOpen;
 else if(a==='upgrade'){if(S.lv<MAXLV&&mainConds().every(c=>c.ok)){S.money+=500*S.lv;S.lv++;toast('升級成「'+lvName(S.lv)+'」！')}}
 else if(a==='claim'){const d=S.daily[+v];if(d&&!d.done&&qv(d.k)>=d.goal){d.done=true;S.money+=d.reward;toast('領取 '+f(d.reward))}}
 else if(a==='open'){S.phase='open';S.min=480;S.visit=0;store.setOpen(true);toast('開門營業！')}
 else if(a==='close'){S.phase='closed';store.setOpen(false);const rev=S.visit*30,net=rev-Math.round(rev*.45)-100;$('modal').innerHTML=`<div class=box><h3 style="margin:0 0 4px">第${S.day}天 營業結束</h3><div style="text-align:center;font-size:32px;font-weight:800;color:#17a05a;margin:6px 0">+${f(net)}</div><div class=ln><span>營業額</span><span>${f(rev)}</span></div><div class=ln><span>商品成本</span><span>−${f(rev*.45)}</span></div><div class=ln><span>房租＋水電</span><span>−$100</span></div><p style="color:var(--sub);font-size:12px">這是示範數字，正式結算之後接上。</p><button class="btn w" data-a="next">下一天 →</button></div>`;$('modal').classList.add('on');return}
 else if(a==='next'){$('modal').classList.remove('on');S.day++;S.min=480;S.visit=0;S.phase='prep';S.orders.forEach(o=>pr(o.id).wh+=o.q);S.orders=[];S.daily=newDaily();S.stat={served:0,perfect:0,rev:0,thief:0,member:0,hot:0};P.forEach(p=>p.mkt=Math.round(p.cost*(1.55+Math.random()*.2)))}
 else if(a==='reset'){location.reload();return}
 render()}
document.addEventListener('click',e=>{const b=e.target.closest('[data-a]');if(b)act(b.dataset.a,b.dataset.v??'x')});
function checkOrders(){const d=S.orders.filter(o=>S.min>=o.eta);if(d.length){d.forEach(o=>pr(o.id).wh+=o.q);S.orders=S.orders.filter(o=>S.min<o.eta);toast('📦 貨到了！');if(S.tab==='wh')render()}}
let lt=performance.now();(function loop(){requestAnimationFrame(loop);const n=performance.now(),dt=Math.min(.2,(n-lt)/1000);lt=n;
 if(S.phase==='open'&&S.min<1320){const o=Math.floor(S.min);S.min=Math.min(1320,S.min+dt*3);if(Math.floor(S.min)!==o){if(Math.random()<.18)S.visit++;checkOrders();hud()}}})(); // 遊戲時間每秒走 3 分鐘，一分鐘一分鐘平順地走
render();
store.setOpen(false);focus();

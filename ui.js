// 全部介面：HUD、底部 7 個分頁、擴店 7 個子頁。數值先用示範資料，流程之後一步步接上。
import {initStore} from './store.js';
const $=id=>document.getElementById(id),f=n=>'$'+Math.round(n).toLocaleString();
const store=initStore($('stage'));
// ---- 幣值換算：原作是人民幣，一律 ×4.5 換成新台幣（約略匯率）再取整，改 FX 就能整體調整 ----
const FX=4.5,nt=c=>{const v=c*FX;return v<30?Math.max(1,Math.round(v)):v<200?Math.round(v/5)*5:Math.round(v/10)*10};
const CATALOG=[['water','礦泉水','💧',.9,2,0,1,24,'瓶'],['cola','可樂','🥤',1.5,3,0,1,24,'罐'],['chips','薯片','🍟',4.4,7,0,1,12,'袋'],['noodle','方便麵','🍜',2.4,4.5,0,1,12,'桶'],['biscuit','餅乾','🍪',3.1,5.9,0,1,10,'盒'],['spicy','辣條','🌶️',1.3,2.6,0,1,20,'包'],['tissue','紙巾','🧻',4.3,7.4,0,1,10,'提'],['bread','麵包','🍞',2.9,5.6,0,1,10,'個'],
 ['milk','牛奶','🥛',2.6,4.6,1,2,12,'盒'],['yogurt','優格','🍶',3.5,6.2,1,2,12,'杯'],['beer','啤酒','🍺',3.4,5.3,1,2,24,'罐'],['sausage','香腸','🌭',4.1,7.7,0,2,12,'袋'],['choco','巧克力','🍫',5.5,10.4,0,2,12,'塊'],
 ['apple','蘋果','🍎',1.8,3.5,1,3,20,'顆'],['banana','香蕉','🍌',1.5,3,1,3,20,'根'],['tomato','番茄','🍅',1.2,2.5,1,3,20,'顆'],['egg','雞蛋','🥚',4,6.5,1,3,12,'盒'],['icecream','冰淇淋','🍦',2,4,1,3,24,'支'],['dumpling','冷凍水餃','🥟',5,8.5,1,3,12,'袋'],['strawberry','草莓','🍓',4.5,8,1,3,10,'盒']];
const P=CATALOG.map(([id,n,e,c,p,cold,lv,pack,un])=>({id,n,e,cost:nt(c),cb:nt(c),old:nt(c),price:nt(p),mkt:nt(p),cold:!!cold,lv,pack,u:un,wh:(!cold&&lv===1)?pack:0,shelf:(!cold&&lv===1)?8:0,want:0}));
const A=()=>P.filter(p=>p.lv<=S.lv);
const S={money:4500,star:80,visit:0,lv:1,min:480,day:1,phase:'prep',orders:[],qOpen:false,total:0,hist:[],member:{own:false,count:0,disc:95},wn:['☀️','晴',1.1],expect:60,stat:null,daily:[],tab:'cash',sub:'store',pm:'cash',sel:-1,own:{},eq:{},staff:{},kb:'',get ambCap(){return Math.round(SPEC(this.lv).cap*(1+.4*(this.eq.whx||0)))},get coldCap(){return[0,2000,5000,12000][this.eq.cold||0]},fix:['shelf','shelf','shelf','shelf'],queue:[],pend:[],cur:null,buyerMid:true,days:[]};
const newStat=()=>({err:0,ct:0,cnt:{},s0:S.star,served:0,total:0,perfect:0,gross:0,rev:0,cogs:0,memberDisc:0,newMember:0,lost:0,thief:0,caught:0,hot:0,hotRev:0,charge:0,best:'',bestN:0});S.stat=newStat();
const RATE={95:.04,90:.08,85:.13},UPC=[6750,17100,36000,67500,117000,180000,270000,405000];
const wk=()=>['一','二','三','四','五','六','日'][(S.day+1)%7];
const CAT={mkt:[['flyer','📄','發傳單','明天客流 +25%',nt(160)],['ig','📱','IG 限動廣告','客流 +20%、口碑 +3',nt(240)],['member','💳','會員卡','會員結帳打折，顧客更常來',nt(500)]]};
// 設備：id、圖示、名稱、說明、效果、各級價格（人民幣，顯示時換算）、最低等級
const EQ=[['neon','🏮','霓虹招牌','店招亮起來，路人更容易進店','客流 +10% / +20%',[120,260],1],['whx','📦','倉庫擴容','加裝貨架，倉庫能放更多貨','倉庫容量 +40% / 級',[80,160,320],1],['music','🎵','店內音響','放點輕鬆的音樂，顧客心情更好','滿意度 +4',[60],1],['scan','⚡','一鍵掃碼台','收銀時一鍵把傳送帶上的商品全部掃完','收銀時出現「一鍵掃碼」按鈕',[150],1],['pos','💳','智慧 POS 機','刷卡時自動帶出應收金額','刷卡一鍵收款',[180],1],['ac','❄️','中央空調','冬暖夏涼，排隊也不煩躁','顧客耐心 +35%，電費 '+f(nt(8))+'/天',[250],1],['cart','🛒','購物車','推著車，顧客會多買一些','人均多買約 1 件',[200],3],['change','🪙','自動找零機','現金找零一鍵完成','找零按鈕一鍵完成',[280],3],['cold','🧊','冷庫','倉庫裡的冷藏間：果蔬、乳品、冷凍品、熱食食材要放冷庫，放不下的很快變質','冷藏容量 2000 / 5000 / 12000',[800,1500,3000],2],['self','🖥️','自助收銀機','顧客自己掃碼結帳，無需工資','新增一個自助收銀位',[500],3]];
const EQ2=[['hot','🍢','熱食檔口','關東煮、包子、熱咖啡……要先採購食材，每道菜可自己定價','在「餐飲」頁管理菜品；瓦斯費 '+f(nt(15))+'/天',[350],2],['dine','🪑','就餐區','在店鋪右側擴建一間用餐室，買桌椅後顧客會坐下吃','熱食購買率 +15%，坐下吃的顧客滿意度 +4（需先有熱食檔口）',[350],3],['charge','🔋','共享行動電源','門口放一台行動電源租借櫃，租借收入分成','約 8% 顧客租借，每次 '+f(nt(3)),[120],2],['delivery','🛵','外送跑腿','接入外送平台，外送員上門取貨送貨','營業中持續接線上訂單，每單加收配送費 '+f(nt(5))+'；平台費 '+f(nt(50))+'/天',[400],3],['gate','🚪','防盜門','門口裝上防盜檢測門，沒付錢的商品一過門就報警','逃跑的小偷約七成會在門口被攔下',[300],2],['cctv','📹','監控攝影機','店裡裝上監控，小偷不敢亂來','小偷少約四成；小偷一動手就能發現，抓捕時間更長',[250],2]];
const ST=[['cashier','🧑‍💼','收銀員','各自守一個收銀台自動結帳（1 號台永遠留給你）',60,1,()=>Math.max(0,SPEC(S.lv).reg-1)],['stocker','🧑‍🔧','理貨員','自動把倉庫商品補到貨架上，人多補得快',50,1,()=>S.lv>=2?6:2],['buyer','🧑‍💻','採購員','每天開門前按銷量自動進貨；可設定營業中也補缺貨',70,3,()=>S.lv>=3?2:0],['guard','👮','保安','在門口站崗、自動巡邏，看到小偷就追上去抓',80,2,()=>1],['packer','📦','打包員','外送訂單自動配貨裝袋，放到取貨處給外送員',50,3,()=>S.lv>=3?1:0],['night','🌙','夜班店員','你打烊後接著營業到天亮，24 小時不打烊（夜裡客人少，主要賣貨架上的貨）',90,3,()=>S.lv>=3?1:0]];
function eqCard(e){const[id,ic,n,d,ef,pr,lv]=e,mx=pr.length,cur=S.eq[id]||0,lock=S.lv<lv;
 const b=lock?`<span class="sm off">Lv${lv}</span>`:cur>=mx?`<span class="sm ok">${mx>1?'已滿級':'已擁有'}</span>`:btn('eq',id,(cur?'升級 ':'')+f(nt(pr[cur])),'sm');
 return `<div class=card><span class=ic>${ic}</span><div class=nm>${n}${mx>1?` <span style="color:var(--sub);font-size:12px">Lv${cur}/${mx}</span>`:''}<small>${d}</small><small style="color:#2db36f;font-weight:800">${ef}</small></div>${b}</div>`}
const eqTab=()=>EQ.map(eqCard).join('')+`<div class=hd style="margin:8px 0;font-size:14px;color:var(--sub)"><span>增值服務 / 防盜</span></div>`+EQ2.map(eqCard).join('');
function stTab(){return `<div style="color:var(--sub);font-size:13px;font-weight:700;margin-bottom:8px">工資在每天打烊時結算</div>`+ST.map(([id,ic,n,d,w,lv,mx])=>{const m=mx(),c=S.staff[id]||0,lock=S.lv<lv;
 return `<div class=card><span class=ic>${ic}</span><div class=nm>${n}<small style="font-weight:900;color:var(--tx)">${c}/${m}</small><small>${d}</small><small style="color:#2db36f;font-weight:800">工資 ${f(nt(w))}/天</small></div>${lock?`<span class="sm off">Lv${lv}</span>`:`<div style="display:flex;flex-direction:column;gap:6px">${c?btn('fire',id,'解雇','sm g'):''}${c<m?btn('hire',id,'雇用','sm'):''}</div>`}</div>`}).join('')+(S.staff.buyer>0?`<div class=card data-a="bm" data-v="x" style="cursor:pointer"><span style="width:30px;height:30px;flex:none;border-radius:9px;background:${S.buyerMid?'#4aa56a':'#fff'};border:2px solid #4aa56a;color:#fff;display:flex;align-items:center;justify-content:center;font-weight:900">${S.buyerMid?'✓':''}</span><div class=nm>營業中也補缺貨<small>每 20 分鐘巡檢一次，倉庫快空、貨架又不滿的商品自動補訂（30 分鐘送到）</small></div></div>`:'')}
const lockHint=()=>{const l=P.filter(p=>p.lv>S.lv);return l.length?`<div style="color:var(--sub);font-size:13px;font-weight:700;margin:6px 2px 10px">🔒 擴店後解鎖更多商品：${l.slice(0,6).map(p=>p.n).join('、')}…</div>`:''};
const HOWTO=[['🧾','收銀','顧客排隊後，點傳送帶上的商品掃碼；現金要照「應找」金額點錢幣找零，刷卡要輸入應收金額，行動支付點一下就行。又快又準，顧客更滿意。'],['🛒','貨架','到「貨架」頁按「補貨」，把倉庫的商品補到貨架上；顧客只會買貨架上有的貨，缺貨會讓顧客失望。'],['📦','倉庫','每天進價會波動，便宜時多進點；開門前下單立即到貨，營業中下單要等遊戲內 30 分鐘。'],['🏷️','價格','售價高於市價越多，顧客越不願意買；適當打折能衝銷量和口碑。'],['🏗️','擴店','存錢擴店、買貨架、請員工、買設備，從街角柑仔店做到超級商場！長按貨架可以拖動換位置，買錯了還能賣掉。'],['🧑‍💼','收銀員','1 號台留給你，收銀員守其他台。你停在「收銀」頁時顧客才會來你的台，離開後會改去收銀員或自助機那裡結帳。'],['🏷️','臨期特價區','打烊時快過期的貨會自動放進去，第二天打折賣，比直接報損划算。'],['🌙','夜班','Lv3 起可雇夜班店員，你打烊後他接著賣到天亮，夜裡的收入一起算進當天結算。'],['🍢','餐飲','買了熱食檔口後，在「餐飲」頁替每道菜定價、採購食材；擴建用餐區並擺上桌椅，顧客會坐下來吃。'],['💳','會員卡','在「擴店 → 營銷」開通，會員結帳打折、更常來。'],['🚨','小偷','有人拿了東西不付錢就跑，頭上會冒出紅色按鈕，倒數結束前點它就能抓住；也可以雇保安、裝防盜門和監控。'],['🧊','冷庫','果蔬、乳品、冷凍品和熱食食材在倉庫裡要放冷庫，放不下的會很快變質。'],['🛵','外送','訂單要配貨裝袋放到取貨處，外送員才會來取；可以雇打包員。'],['🪴','裝修','長按貨架可以拖到店裡任意空地，也能轉向；「擴店 → 裝修」裡換壁紙、擺綠植海報地毯和分區牌。'],['⚡','突發事件','阿姨搶購、公司大採購、網紅清空挑戰……每天最多遇到一次，貨備足了才接得住！'],['🏦','銀行','閒錢存活期或定期吃利息，周轉不開可以貸款，記得早點還。']];
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
// ---- 彈窗 ----
const openModal=h=>{$('modal').innerHTML='<div class=box>'+h+'</div>';$('modal').classList.add('on')},closeModal=()=>$('modal').classList.remove('on');
// ---- 任務：升級任務（3 個條件）＋每日隨機任務 ----
const POOL=[['perfect','完美找零',[3,5,8],'次',[60,100,160]],['served','服務顧客',[20,30,40],'位',[80,120,180]],['rev','單日營業額達',[600,900,1500],'元',[100,160,260]],['visit','進店人數達',[25,40,60],'人',[60,100,150]],['thief','抓到小偷',[1,2,3],'個',[120,200,300]],['member','新增會員',[2,4,6],'位',[80,120,180]],['hot','賣出熱食',[8,12,20],'份',[80,120,200]]];
const rnd3=n=>Math.floor(Math.random()*n);
function newDaily(){return POOL.map(a=>[Math.random(),a]).sort((x,y)=>x[0]-y[0]).slice(0,3).map(([,a])=>{const d=rnd3(a[2].length);return{k:a[0],n:a[1],goal:a[0]==='rev'?Math.round(a[2][d]*FX/100)*100:a[2][d],unit:a[3],reward:Math.round(a[4][d]*FX/10)*10,done:false}})}
const qv=k=>k==='visit'?S.visit:k==='member'?S.stat.newMember:k==='rev'?S.stat.gross:(S.stat[k]||0);
function mainConds(){const cost=UPC[S.lv-1]||0,g=[1500*S.lv,80+5*S.lv,cost],c=[S.total,S.star,S.money],fm=[f,x=>x,f];return['累計營業額','店鋪星級','現金（擴店費用）'].map((n,i)=>({n,cur:c[i],goal:g[i],ok:c[i]>=g[i],show:fm[i](c[i])+' / '+fm[i](g[i])}))}
function showQuest(){const mc=mainConds(),lvl=S.lv<MAXLV;openModal(`<button class=x data-a="mclose">✕</button><div class=hd style="margin-right:36px"><span>🎯 ${lvl?'升級「'+lvName(S.lv+1)+'」':'已是最高等級'}</span><small>${mc.filter(c=>c.ok).length}/3</small></div>`+(lvl?mc.map(c=>`<div class=qrow><div class=t>${c.ok?'✅':'⬜'} ${c.n}<small>${c.show}</small><div class=pb><i style="width:${Math.min(100,c.cur/c.goal*100)}%"></i></div></div></div>`).join('')+`<div class=hint style="margin-top:10px">三項都達成後，到「擴店」按「擴店」升級，可再領獎勵 ${f(2250)}</div>`:'')+`<div class=hd style="margin-top:10px"><span>📅 每日任務</span><small>隔天換新的</small></div>`+S.daily.map((d,i)=>{const v=qv(d.k),ok=v>=d.goal;return `<div class=qrow><div class=t>${d.n} ${d.goal}${d.unit}<small>${Math.min(v,d.goal)}/${d.goal} · 獎勵 ${f(d.reward)}</small><div class=pb><i style="width:${Math.min(100,v/d.goal*100)}%"></i></div></div><button data-a="claim" data-v="${i}" ${ok&&!d.done?'':'disabled'}>${d.done?'已領':'領取'}</button></div>`}).join(''))}
S.daily=newDaily();
function hud(){const pr=S.phase==='prep',m=Math.floor(S.min),T=String(Math.floor(m/60)).padStart(2,'0')+':'+String(m%60).padStart(2,'0'),clk=pr?'準備中':S.phase==='open'?T:'已打烊',mc=mainConds();
 const h=`<div class=tb data-p="${S.phase}"><div class=cp><span id=clock>{T}</span><small>第${S.day}天 週${wk()} ${S.wn[0]}</small></div></div><div class=r1><span class="pill r">日日鮮超市 Lv${S.lv}</span><span class=pill>⭐ ${S.star}</span>${pr?'':`<span class=pill>👥 ${S.visit} 進店</span><span class=pill>🧾 排隊 ${S.queue.length+(S.cur?1:0)}</span>`}</div><div class=quest data-a="quest">${S.lv<MAXLV?`🎯 擴店升級為「${lvName(S.lv+1)}」 ${mc.filter(c=>c.ok).length}/3 <b>+${f(2250)}</b>`:'🏆 已是最高等級'} ›</div><div class=r1><span class=pill>🪙 ${f(S.money)}</span></div>`;
 if(hud.k!==h){hud.k=h;$('hud').innerHTML=h.replace('{T}',clk)}else{const c=$('clock');if(c)c.textContent=clk}
 $('openBtn').style.display=pr?'block':'none';$('closeBtn').style.display=(S.phase==='open'&&S.min>=1320)?'block':'none'}
// ---- 每天開始：天氣、進價浮動、預計客流、早晨簡報 ----
function rollDay(){S.wn=[['☀️','晴',1.1],['⛅','多雲',1],['🌧️','雨',.8]][rnd3(3)];P.forEach(p=>{p.old=p.cost;p.cost=Math.max(1,Math.round(p.cb*(.85+Math.random()*.3)))});
 S.expect=Math.round((40+12*S.lv+(S.own.dine?10:0)+(S.member.own?Math.min(30,S.member.count/5):0))*S.wn[2]*(1+[0,.1,.2][S.eq.neon||0]))}
function showBrief(){const dn=A().filter(p=>p.cost<p.old).slice(0,3).map(p=>p.n).join('、'),up=A().filter(p=>p.cost>p.old).slice(0,3).map(p=>p.n).join('、'),d=S.daily[0];
 openModal(`<div class=bt>${S.wn[0]} 第 ${S.day} 天 · 週${wk()}</div><div class=bcard><div class=bw>${S.wn[0]}<br><b>${S.wn[1]}</b></div><div class=bl>預計客流約 <b>${S.expect}</b> 人${dn?'<br>📉 進價下跌：'+dn:''}${up?'<br>📈 進價上漲：'+up:''}<br>🎯 今日挑戰：${d.n} ${d.goal}${d.unit}</div></div><p style="text-align:center;color:var(--sub);font-size:13px;font-weight:700">先進貨、擺貨、看看價格，準備好就開門營業！</p><button class="btn w" data-a="bstart">開始準備</button>`)}
const chg=p=>{const c=Math.round((p.cost/p.cb-1)*100);return c?`<span style="color:${c>0?'#d94452':'#2db36f'}">${c>0?'↑':'↓'}${Math.abs(c)}%</span>`:'—'};
// ---- 會員卡 ----
function showMember(){const m=S.member;openModal(`<button class=x data-a="mclose">✕</button><div class=hd style="margin-right:36px"><span>💳 會員卡</span><b style="color:#ff4d4d">${m.count} 位會員</b></div><p style="color:var(--sub);font-size:13px;font-weight:700;margin:0 0 10px">選一個會員折扣。折扣越大，辦卡的人越多，但每筆會員消費少收越多。</p>`+[[95,'95 折','約 4% 的顧客會辦卡'],[90,'90 折','約 8% 的顧客會辦卡'],[85,'85 折','約 13% 的顧客會辦卡']].map(([d,n,t])=>`<div class=card style="${m.disc===d?'border-color:#ff5a4e;background:#fff3f0':''}"><div class=nm>${n}<small>${t}</small></div>${btn('disc',d,m.disc===d?'目前':'選這個',m.disc===d?'sm ok':'sm')}</div>`).join('')+`<button class="btn w" data-a="mclose">確定</button>`)}
function rMkt(){const m=S.member;return cards('mkt',x=>x[0]!=='member')+(!m.own?`<div class=card><span class=ic>💳</span><div class=nm>會員卡<small>開通後顧客可辦卡，享固定折扣，回頭客更多</small></div>${btn('buy','mkt|member',f(nt(500)),'sm')}</div>`:`<div class=dash><div class=hd style="margin:0 0 4px"><span>💳 會員卡</span><b style="color:#ff4d4d">${m.count} 位會員</b></div><div style="font-size:12px;color:var(--sub);font-weight:700">今天新辦 ${S.stat.newMember} 張 · 目前 ${m.disc} 折</div><div class=chips style="margin-top:8px">${[95,90,85].map(d=>btn('disc',d,d+' 折','chip'+(m.disc===d?' on':''))).join('')}</div><div style="font-size:12px;color:var(--sub);font-weight:600">折扣越大辦卡越多（約 4% / 8% / 13%），但每筆會員消費少收越多。</div></div>`)}
// ---- 擴店・店鋪 ----
const SPEC=lv=>({size:`${8+2*lv}×${5+2*lv}米`,shelf:lv<2?4:6+3*(lv-2),reg:[2,3,3,4,4,5,5,6,6][Math.min(lv,9)-1],flow:40+12*lv,cap:lv<=2?1000:1000+550*(lv-2),self:Math.max(0,lv-1)});
const canUp=()=>S.lv<MAXLV&&mainConds().every(c=>c.ok);
function storeTab(){const a=SPEC(S.lv),b=SPEC(S.lv+1),cost=UPC[S.lv-1]||0,ok=canUp();
 return `<div style="background:linear-gradient(135deg,#ff6a52,#e8392c);color:#fff;border-radius:20px;padding:14px;display:flex;gap:12px;align-items:center;margin-bottom:10px"><div style="width:58px;height:58px;border-radius:50%;background:#fff;color:#ff4d4d;font-weight:900;display:flex;align-items:center;justify-content:center;font-size:18px;flex:none">Lv${S.lv}</div><div><div style="font-size:19px;font-weight:900">日日鮮超市</div><div style="font-size:13px;font-weight:700">${lvName(S.lv)}・${a.size}・貨架位 ${S.fix.length}/${a.shelf}・收銀台 ${a.reg}</div></div></div>`+(S.lv<MAXLV?`<div class=dash><b style="font-size:15px">下一級：<span style="color:#ff4d4d">${lvName(S.lv+1)}</span></b><div class=tags>${['店面 '+b.size,'貨架位 '+b.shelf,'收銀台 '+b.reg,'基礎客流 '+b.flow+' 人/天','倉庫 '+b.cap,'自助收銀位 '+b.self].map(x=>`<span>${x}</span>`).join('')}</div><div style="font-size:13px;font-weight:800;margin-top:8px;line-height:1.8">新商品：${P.filter(p=>p.lv===S.lv+1).map(p=>p.e+' '+p.n).join('　')||'—'}</div><div class=ln style="margin-top:10px;align-items:center"><span style="color:var(--sub)">房租 ${f(360*S.lv)}/天</span>${btn('upgrade','x','擴店 '+f(cost),ok?'btn':'btn g')}</div>${ok?'':'<div style="font-size:12px;color:var(--sub);font-weight:600;margin-top:4px">條件還沒達成，點左上角任務可查看</div>'}</div>`:'')+`<div class=hd style="margin-top:6px"><span>購買貨架 / 櫃台</span></div>`+Object.keys(FIXT).map(k=>{const x=FIXT[k];return `<div class=card><div class=nm>${x.n}<small>${x.d}</small></div>${S.lv<x.lv?'<span class="sm off">Lv'+x.lv+'</span>':S.fix.length>=SPEC(S.lv).shelf?'<span class="sm off">沒空位</span>':btn('fix',k,f(x.price),'sm')}</div>`}).join('')}
// ---- 打烊結算（目前用模擬的一天；收銀流程接上後改成真實數字）----
function daySim(){const st=S.stat,vis=S.visit,share=Math.min(.6,S.member.count/200),dc=S.member.own?(100-S.member.disc)/100:0,cnt={};
 for(let i=0;i<vis;i++){if(Math.random()<.1){st.lost++;continue}let t=0,c=0;for(let k=0,n=2+rnd3(3);k<n;k++){const av=A(),p=av[rnd3(av.length)];if(p.cold&&!S.own.cold)continue;t+=p.price;c+=p.cost;cnt[p.id]=(cnt[p.id]||0)+1}
  if(!t){st.lost++;continue}st.served++;st.gross+=t;st.cogs+=c;if(Math.random()<share)st.memberDisc+=t*dc;else if(S.member.own&&Math.random()<RATE[S.member.disc])st.newMember++;if(Math.random()<.12)st.perfect++}
 st.total=vis+st.lost*0;if(S.own.hot){st.hot=Math.round(st.served*.12);st.hotRev=st.hot*30}if(S.own.charge)st.charge=2;st.gross+=st.hotRev+st.charge*14;
 const th=Math.random()<(S.own.cctv?.3:.5)?1:0;st.thief=th;st.caught=th&&(S.staff.guard>0||Math.random()<(S.own.gate?.85:.6))?1:0;st.best=Object.keys(cnt).sort((a,b)=>cnt[b]-cnt[a])[0]||'';st.bestN=cnt[st.best]||0;S.member.count+=st.newMember;st.rev=st.gross-st.memberDisc}
function settle(){const st=S.stat,sim=!st.served;if(sim)daySim();if(!st.best){const k=Object.keys(st.cnt).sort((a,b)=>st.cnt[b]-st.cnt[a])[0];if(k){st.best=k;st.bestN=st.cnt[k]}}
 const wage=ST.reduce((a,s)=>a+(S.staff[s[0]]||0)*nt(s[4]),0),rent=360*S.lv,util=90+Math.round(st.served*1.8),net=Math.round(st.gross-st.cogs-rent-util-wage-st.memberDisc-st.err);
 S.money+=Math.round((sim?st.gross-st.memberDisc:0)-rent-util-wage);if(sim)S.total+=st.gross;S.hist.push(net);const H=S.hist.slice(-7),mx=Math.max(1,...H.map(Math.abs)),rk=net<300?['C','努力的店主','#3a86ff']:net<1000?['B','小有名氣','#2db36f']:net<2500?['A','生意興隆','#ff9f1a']:['S','商業巨頭','#ff4d4d'];
 const L=(n,v,c)=>`<div class=ln style="color:${c||'var(--tx)'}"><span>${n}</span><span>${v}</span></div>`,pb=P.find(p=>p.id===st.best);
 openModal(`<div class=hd><span style="font-size:16px">第 ${S.day} 天 · 週${wk()} · 營業結束</span><span style="background:${rk[2]};color:#fff;border-radius:99px;padding:5px 12px;font-size:13px">${rk[0]} ${rk[1]}</span></div><div style="color:var(--sub);font-size:13px;font-weight:700">今日淨利潤</div><div class=big style="color:${net>=0?'#2db36f':'#d94452'}">${net>=0?'+':'−'}${f(Math.abs(net))}</div>
 <div class=dash>${L('營業額',f(st.gross))}${L('商品成本','−'+f(st.cogs),'#b4553f')}${L('房租','−'+f(rent),'#b4553f')}${L('水電','−'+f(util),'#b4553f')}${L('員工工資','−'+f(wage),'#b4553f')}${L('找零誤差 / 會員優惠','−'+f(st.memberDisc+st.err),'#b4553f')}</div>
 <div class=stats><div>服務顧客<b>${st.served}/${S.visit}</b></div><div>好評率<b>${Math.min(99,Math.round(S.star*.9))}%</b></div><div>口碑<b>${st.s0}→${S.star}</b></div><div>完美找零<b>${st.perfect} 次</b></div><div>平均結帳<b>${st.served?(st.ct/st.served).toFixed(1)+' 秒':'—'}</b></div><div>缺貨<b>${st.lost} 次</b></div></div>
 <div class=sec><b class=t>收款明細</b>${L('🙋 店長（你）　'+st.served+' 位',f(st.gross-st.hotRev-st.charge*14))}</div>`+
 (S.own.hot||S.own.charge?`<div class=sec><b class=t>夜班與增值服務（已計入營業額）</b>${S.own.hot?L('🍢 熱食　'+st.hot+' 份',f(st.hotRev)):''}${S.own.charge?L('🔋 行動電源　'+st.charge+' 次',f(st.charge*14)):''}</div>`:'')+
 (S.member.own?`<div class=sec>💳 會員 ${S.member.count} 位（今天新辦 ${st.newMember} 張），會員優惠 ${f(st.memberDisc)}</div>`:'')+(pb?`<div class=sec>🔥 今日暢銷：${pb.e} ${pb.n} ${st.bestN} 件</div>`:'')+
 `<div class="sec good">🚨 小偷 ${st.thief} 個：抓住 ${st.caught} 個</div>`+S.daily.map(d=>{const ok=qv(d.k)>=d.goal;return `<div class="sec ${ok?'good':''}">${ok?'✅ 每日挑戰完成':'⬜ 每日挑戰未完成'}：${d.n} ${d.goal}${d.unit}（獎勵 ${f(d.reward)}）</div>`}).join('')+
 `<div class=chart>${H.map((v,i)=>`<div style="height:${Math.max(6,Math.abs(v)/mx*100)}px;background:${v>=0?'#2db36f':'#d94452'}"><span>D${S.day-H.length+1+i}</span></div>`).join('')}</div>${sim?'<p style="font-size:11px;color:var(--sub);text-align:center;margin:-8px 0 8px">今天沒有真實交易，這是模擬結算</p>':''}<button class="btn w" data-a="next">下一天 →</button>`)}
// ---- 各分頁 ----
// ---- 收銀流程：顧客排隊 → 掃碼 → 收款（現金找零／行動支付／刷卡）----
const CB=[];let TID=0;
const NEED={milk:'cold',yogurt:'cold',beer:'cold',egg:'cold',apple:'produce',banana:'produce',tomato:'produce',strawberry:'produce',icecream:'freezer',dumpling:'freezer'},need=p=>NEED[p.id]||'shelf',hasFx=p=>S.fix.includes(need(p)),SC=12,
 inc=p=>S.orders.filter(o=>o.id===p.id).reduce((a,o)=>a+o.q,0),
 fc=p=>{const d=S.days.slice(-5),n=d.length,V=d.reduce((a,x)=>a+x.v,0),C=d.reduce((a,x)=>a+(x.cnt[p.id]||0),0),pri=2.25/Math.max(1,A().length),w=Math.min(n,3)/3;return((V?C/V:pri)*w+pri*(1-w))*S.expect},
 plan=(p,mid)=>{if(!hasFx(p)||(p.cold&&!S.own.cold))return 0;const r=mid?(1320-S.min)/840:1;if(mid&&r<.12)return 0;const need=fc(p)*r*(mid?1.15:1.25)-(p.wh+p.shelf+inc(p));return need>0?Math.ceil(need/p.pack):0};
function putOrder(p,boxes,inst){const q=boxes*p.pack,c=boxes*p.cost*p.pack;if(boxes<1||c>S.money||used(p.cold)+q>(p.cold?S.coldCap:S.ambCap))return 0;S.money-=c;if(inst)p.wh+=q;else S.orders.push({id:p.id,q,eta:S.min+30});return c}
function autoBuy(mid){let n=0,c=0;A().forEach(p=>{if(p.cold&&!S.own.cold)return;const x=putOrder(p,plan(p,mid),!mid);if(x){n++;c+=x}});return{n,c}}
function syncStore(){const id=S.cur?S.cur.id:0;if(syncStore.id!==id){syncStore.id=id;store.setTill(id);store.setBelt(S.cur?S.cur.items.map(i=>i.id):[])}{const sg=A().map(p=>p.shelf).join(',');if(syncStore.sg!==sg){syncStore.sg=sg;const m={};P.forEach(p=>m[p.id]=Math.min(1,p.shelf/SC));store.setStock(m)}}}

const carts={};
function stopsFor(){const ix=S.fix.map((t,i)=>t==='clear'?-1:i).filter(i=>i>=0).sort(()=>Math.random()-.5);return ix.slice(0,Math.min(ix.length,1+rnd3(3)))}
function take(cid,fi){const c=carts[cid],type=S.fix[fi];if(!c||!type)return;const n=1+(Math.random()<.4?1:0)+(S.eq.cart&&Math.random()<.5?1:0);
 for(let k=0;k<n&&c.items.length<5;k++){const ok=A().filter(p=>need(p)===type&&(!p.cold||S.own.cold)&&p.shelf>0);if(!ok.length)break;const p=ok[rnd3(ok.length)];if(p.price>p.mkt*1.2&&Math.random()<.5)continue;p.shelf--;c.items.push({id:p.id,s:false});c.sum+=p.price;c.cogs+=p.cost}}
function arrive(cid){const c=carts[cid];delete carts[cid];if(!c||!c.items.length){S.stat.lost++;return false}
 if(S.queue.length>=6){c.items.forEach(i=>pr(i.id).shelf++);S.stat.lost++;return false}
 const sum=c.sum,mem=S.member.own&&Math.random()<Math.min(.6,S.member.count/200),total=mem?Math.round(sum*S.member.disc/100):sum,r=Math.random(),pm=r<.5?'cash':r<.8?'qr':'card',
 t={items:c.items,sum,total,cogs:c.cogs,mem,pm,pat:1,ph:'scan',chg:[],cs:null,id:cid,who:['上班族','學生','阿嬤','大叔','媽媽'][rnd3(5)]};
 if(pm==='cash'){const o=[...new Set([total,Math.ceil(total/10)*10,Math.ceil(total/50)*50,Math.ceil(total/100)*100,500,1000])].filter(x=>x>=total);t.given=o[rnd3(o.length)];t.due=t.given-total}
 S.queue.push(t);S.dirty=true;return true}
function lose(t,pen){t.items.forEach(i=>pr(i.id).shelf++);S.stat.lost++;if(pen)S.star=Math.max(0,S.star-1);
 if(S.cur===t)S.cur=null;else{S.queue=S.queue.filter(x=>x!==t);store.leave(t.id)}if(pen)toast('顧客等不及走了　⭐-1',1)}
function pull(){if(S.tab==='cash'&&!S.cur&&S.queue.length){S.cur=S.queue.shift();S.cur.t0=performance.now();S.kb=''}}
function done(t,o){const st=S.stat,err=o.err||0,pf=o.perfect&&t.pm==='cash';
 st.served++;st.gross+=t.sum;st.memberDisc+=t.sum-t.total;st.cogs+=t.cogs;st.err+=err;st.ct+=(performance.now()-(t.t0||performance.now()))/1000;t.items.forEach(i=>st.cnt[i.id]=(st.cnt[i.id]||0)+1);
 S.money+=t.total-err;S.total+=t.total-err;if(S.cur===t)S.cur=null;else store.leave(t.id);
 if(pf){st.perfect++;S.star++}
 if(S.member.own&&!t.mem&&Math.random()<RATE[S.member.disc]){st.newMember++;S.member.count++}
 if(!o.auto){toast('收款成功 +'+f(t.total-err)+(pf?'　完美找零！':''));S.kb='';pull()}
 hud()}
function dropAll(){[S.cur,...S.queue].filter(Boolean).forEach(t=>lose(t,0));S.cur=null;S.queue=[];syncStore()}
function tickCash(dt){let ch=false;
 if(S.dirty){S.dirty=false;ch=true}
 const dec=dt/(45*(1+(S.eq.ac?.35:0)));[S.cur,...S.queue].forEach(t=>{if(t&&!t.cs)t.pat-=dec});
 [S.cur,...S.queue].filter(t=>t&&t.pat<=0).forEach(t=>{lose(t,1);ch=true});
 const now=performance.now();for(let i=0;i<(S.staff.cashier||0);i++){if(S.queue.length&&now>=(CB[i]||0)){CB[i]=now+(4+Math.random()*3)*1000;done(S.queue.shift(),{auto:1,perfect:1});ch=true}}
 if(!S.cur&&S.tab==='cash'&&S.queue.length){pull();ch=true}
 let rf=false;if(S.staff.stocker){S.stk=(S.stk||0)+dt*S.staff.stocker;if(S.stk>=3){S.stk-=3;const c=A().filter(p=>hasFx(p)&&p.wh>0&&p.shelf<SC).sort((a,b)=>a.shelf-b.shelf)[0];if(c){const m=Math.min(4,SC-c.shelf,c.wh);c.wh-=m;c.shelf+=m;rf=true}}}
 if(ch){hud();if(S.tab==='cash')render()}if(rf&&(S.tab==='shelf'||S.tab==='wh'))render();
 syncStore();const e=$('pat');if(e&&S.cur)e.style.width=Math.max(0,S.cur.pat*100)+'%'}
const PML={cash:'💵 現金',qr:'📱 行動支付',card:'💳 刷卡'},PK='style="background:#fde9e6;color:#c8352b"';
function rCash(){const t=S.cur;
 if(!t)return `<div class=c><div style="font-size:40px">🧾</div><b>${S.phase==='open'?'暫時沒人排隊':S.phase==='prep'?'還沒開門':'已打烊'}</b><p>${S.phase==='open'?'可以去補貨、調價～顧客結帳時會自動排過來':'開門營業後，顧客會來這裡排隊結帳'}</p></div>`;
 const sc=t.items.filter(i=>i.s),sum=sc.reduce((a,i)=>a+pr(i.id).price,0),scan=t.ph==='scan',left=t.items.length-sc.length,
 lines=Object.entries(sc.reduce((m,i)=>(m[i.id]=(m[i.id]||0)+1,m),{})).map(([id,n])=>pr(id).n+' ×'+n+'　'+f(pr(id).price*n)).join('<br>')||'<span style="opacity:.6">點傳送帶上的商品掃碼</span>',
 head=`<div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;margin-bottom:6px"><b style="font-size:17px">${t.who}</b>${S.member.own&&t.mem?'<span class=pill style="background:#ffe08a;font-size:12px;padding:3px 9px">💳 會員</span>':''}<span style="font-size:13px;font-weight:800;color:var(--sub)">${PML[t.pm]}</span><span style="flex:1"></span><span style="font-size:12px;color:var(--sub);font-weight:800">排隊 <b style="color:#ff5a4e;font-size:16px">${S.queue.length}</b> 人</span><button class=sm ${PK} data-a="quick" data-v="x">一鍵結算</button>${t.cs?'':`<button class=sm ${PK} data-a="leave" data-v="x">請他離開</button>`}</div><div class=pb style="height:10px;margin:0 0 10px"><i id=pat style="width:${Math.max(0,t.pat*100)}%"></i></div>`,
 rc=`<div class=rc><div class=l>${lines}${!scan&&t.mem?`<br>會員價 ${S.member.disc/10} 折　−${f(t.sum-t.total)}`:''}</div><div class=r><small>${scan?'已掃 '+sc.length+'/'+t.items.length:'應收'}</small><b>${f(scan?sum:t.total)}</b></div></div>`;
 let body;
 if(scan)body=(S.eq.scan?btn('scanall','x',`⚡ 一鍵掃碼（剩 ${left} 件）`,'btn w'):'')+`<div style="text-align:center;color:var(--sub);font-weight:800;font-size:13px;margin-top:8px">${S.eq.scan?'也可以':'請'}點傳送帶上的商品逐個掃</div>`;
 else if(t.pm==='cash'){const got=t.chg.reduce((a,b)=>a+b,0);
  body=`<div class=info><div>顧客付<b>${f(t.given)}</b></div><div>應找<b style="color:#ff5a4e">${f(t.due)}</b></div><div>已找<b style="color:#3a6bc4">${f(got)}</b></div></div>`+(t.due?`${t.chg.length?`<div class=tags style="margin:0 0 8px">${t.chg.map(x=>`<span>$${x}</span>`).join('')}</div>`:''}<div class=bills>${DEN.map(d=>`<button class=b style="background:${d[1]}" data-a="bill" data-v="${d[0]}">$${d[0]}</button>`).join('')}</div>`:'<div class=hint>剛好，不用找錢</div>')+(S.eq.change&&t.due?btn('autochg','x','🪙 自動找零','btn w')+'<div style="height:8px"></div>':'')+`<div class=acts>${btn('undo','x','撤銷','btn g')}${btn('clr','x','清空','btn g')}${btn('cashok','x','確認找零','btn')}</div>`}
 else if(t.pm==='qr'){t.qr=t.qr||Array.from({length:81},()=>Math.random()<.5);body=`<div class=qrw><div class=qr>${t.qr.map(b=>`<i style="background:${b?'#111':'#fff'}"></i>`).join('')}</div><div style="flex:1"><b>顧客出示了付款碼</b><br><br>${btn('qrok','x','📷 掃碼收款','btn w')}</div></div>`}
 else body=t.cs?`<div class=lcd style="font-size:17px">${t.cs==='pin'?'顧客輸入密碼中…':'交易成功，列印簽單中…'}</div>`:`<div class=lcd>NT$ ${S.kb||'<span style="opacity:.5;font-size:15px">輸入應收金額</span>'}</div><div style="display:flex;gap:8px"><div class=kp style="flex:3">${['1','2','3','4','5','6','7','8','9','C','0','<'].map(k=>`<button class=b data-a="kp" data-v="${k}">${k==='<'?'⌫':k}</button>`).join('')}</div><div style="flex:1;display:flex;flex-direction:column;gap:8px">${S.eq.pos?'<button class=btn style="flex:1;padding:6px;background:linear-gradient(#5aa8ff,#3a86ff);box-shadow:0 4px 0 #2a63c4" data-a="posfill" data-v="x">帶出金額</button>':''}<button class=btn style="flex:1;padding:6px" data-a="cardok" data-v="x">確認收款</button></div></div>`;
 return head+rc+body}
const FIXT={shelf:{n:'貨架',price:300,lv:1,d:'常溫商品：飲料、零食、日用品'},cold:{n:'冷藏櫃',price:800,lv:2,d:'冷藏商品：乳品、啤酒、果汁・電費 $5/天'},produce:{n:'果蔬台',price:500,lv:2,d:'生鮮果蔬'},clear:{n:'臨期特價區',price:400,lv:2,d:'快過期的貨打折賣，少報損'},freezer:{n:'冷凍櫃',price:1200,lv:3,d:'冷凍商品：冰淇淋、速凍食品・電費 $8/天'}};
const FXLIST=()=>`<div class=hd style="margin-top:14px"><span>賣場設施（${S.fix.length}）</span><small>可換位、賣掉（退 50%）</small></div>`+S.fix.map((t,i)=>`<div class=card><div class=nm>#${i+1} ${FIXT[t].n}</div>${i?btn('fmv',i+'|-1','◀','sm g'):''}${i<S.fix.length-1?btn('fmv',i+'|1','▶','sm g'):''}${btn('fsell',i,'賣 '+f(FIXT[t].price/2),'sm g')}</div>`).join('');
function rShelf(){const G=[['shelf','🗄️','常溫貨架'],['cold','🧊','冷藏櫃'],['produce','🥬','果蔬台'],['freezer','❄️','冷凍櫃']],av=A(),low=av.filter(p=>hasFx(p)&&p.shelf<=2);
 return `<div class=hd><span>貨架管理</span><small>貨架位 ${S.fix.length}/${SPEC(S.lv).shelf}</small></div>`+(low.length?`<div class=hint>⚠️ 快賣完了：${low.map(p=>p.n).join('、')}</div>`:'<div class=hint>👍 所有貨架都挺滿的</div>')+btn('rsall','x','🗄️ 一鍵補滿全部貨架','btn w')+
 G.map(([k,ic,n])=>{const ps=av.filter(p=>need(p)===k);if(!ps.length)return '';const c=S.fix.filter(x=>x===k).length;
  return `<div class=hd style="font-size:14px;margin-top:12px"><span>${ic} ${n} ×${c}</span></div>`+(c?'':`<div class=hint>還沒有${n}，這些商品沒辦法上架（到「擴店」購買）</div>`)+ps.map(p=>`<div class=row><span class=ic>${ico(p)}</span><div class=nm>${p.n}${p.cold?' ❄️':''}<small>貨架 ${p.shelf}/${SC} · 倉庫 ${p.wh}</small><div class=bar style="margin-top:5px"><i style="width:${p.shelf/SC*100}%;background:${p.shelf<=2?'#d94452':'#2db36f'}"></i></div></div>${c?btn('rs',p.id,p.shelf>=SC?'已滿':'補貨',p.shelf>=SC||!p.wh?'sm off':'sm'):''}</div>`).join('')}).join('')+FXLIST()}
function rWh(){const au=used(false),cu=used(true),cold=S.own.cold,want=P.reduce((a,p)=>a+p.want,0),cost=P.reduce((a,p)=>a+p.want*p.cost*p.pack,0);
 return `<div class=hd><span>倉庫進貨</span><small>${S.phase==='prep'?'開門前下單立即到貨':'營業中下單，30 分鐘後到'}</small>${btn('smart','x','智能補貨','sm g')}</div><div class=cap>常溫 ${au}/${S.ambCap}<div class=bar><i style="width:${au/S.ambCap*100}%"></i></div></div><div class=cap>${cold?`冷藏 ${cu}/${S.coldCap}<div class=bar><i style="width:${cu/S.coldCap*100}%;background:#4aa3ff"></i></div>`:`❄️ 冷藏庫未購買　${S.lv<2?'<span class="sm off">Lv2 解鎖</span>':btn('tab','exp','去擴店購買','sm')}`}</div>`+
 A().map(p=>{const lock=p.cold&&!cold;return `<div class=row style="${lock?'opacity:.5':''}"><span class=ic>${ico(p)}</span><div class=nm>${p.n}${p.cold?' ❄️':''}<small>進價 ${f(p.cost)} ${chg(p)} · 倉庫 ${p.wh} · 貨架 ${p.shelf} · 1箱=${p.pack}${p.u} · 預估 ${Math.round(fc(p))}/天</small></div>${lock?'<span class="sm off">需冷藏庫</span>':btn('want',p.id+'|-1','−','sm g')+`<b style="width:22px;text-align:center">${p.want}</b>`+btn('want',p.id+'|1','＋','sm g')}</div>`}).join('')+
 lockHint()+(S.orders.length?`<div class=hint>🚚 配送中：${S.orders.map(o=>pr(o.id).n+' ×'+o.q).join('、')}</div>`:'')+`<div style="position:sticky;bottom:0;background:var(--bg);padding:10px 0 2px;display:flex;justify-content:space-between;align-items:center"><div><small style="color:var(--sub)">合計</small><br><b style="font-size:20px;color:#d64034">${f(cost)}</b></div>${btn('order','x','下單進貨',want?'btn':'btn g')}</div>`}
function rPrice(){return `<div class=hd><span>今日價格</span><small>市價每天浮動</small></div><div class=chips>${btn('pall','mkt','全部=市價','chip')}${btn('pall','.9','全部九折','chip')}${btn('pall','1.1','全部+10%','chip')}</div>`+A().map(p=>{const m=Math.round((p.price-p.cost)/p.price*100),d=Math.round((p.price-p.mkt)/p.mkt*100);
 return `<div class=row><span class=ic>${ico(p)}</span><div class=nm>${p.n}<small>進價 ${f(p.cost)} · 市價 ${f(p.mkt)} · 毛利 ${m}%${d?` · <span style="color:${d>0?'#d94452':'#2c9b7f'}">${d>0?'偏貴':'偏便宜'} ${Math.abs(d)}%</span>`:''}</small></div>${btn('price',p.id+'|-1','−','sm g')}<b style="width:46px;text-align:center">${f(p.price)}</b>${btn('price',p.id+'|1','＋','sm g')}</div>`}).join('')}
function cards(k,fl){return CAT[k].filter(fl||(()=>1)).map(([id,ic,n,d,p,lv])=>{const lock=lv&&S.lv<lv,own=S.own[id];
 return `<div class=card><span class=ic>${ic}</span><div class=nm>${n}<small>${d}${k==='staff'?` · 工資 ${f(p)}/天`:''}</small></div>${lock?`<span class="sm off">Lv${lv}</span>`:btn('buy',k+'|'+id,own?(k==='staff'?'解雇':'已擁有'):(k==='staff'?'雇用':f(p)),own?(k==='staff'?'sm g':'sm ok'):'sm')}</div>`}).join('')}
function rExp(){const sub={
 store:storeTab(),
 equip:eqTab(),staff:stTab(),mkt:rMkt(),
 decor:`<div class=hd><span>牆壁顏色</span></div><div class=sw>${[[0xf6ede2,'奶油'],[0xcfe6f7,'淺藍'],[0xf7d5dd,'粉紅'],[0xd6f0e0,'薄荷']].map(([c,n])=>`<button style="background:#${c.toString(16)}" data-a="wall" data-v="${c}" title="${n}"></button>`).join('')}</div><div class=hd><span>擺設</span><small>心情加成</small></div>${[['🪴','綠植','心情 +0.8',80],['🖼️','海報','心情 +0.6',50],['🧶','地毯','心情 +0.6',120]].map(([i,n,d,p])=>`<div class=card><span class=ic>${i}</span><div class=nm>${n}<small>${d}</small></div>${btn('toast','之後接上',f(p),'sm')}</div>`).join('')}`,
 bank:`<div class=hd><span>現金 ${f(S.money)}</span></div><div class=card><span class=ic>🏦</span><div class=nm>活期<small>日息 0.2%，隨存隨取</small></div>${btn('toast','之後接上','存入','sm')}</div><div class=card><span class=ic>🔒</span><div class=nm>定期<small>3 天 1.2% · 7 天 3.5% · 14 天 9%</small></div>${btn('toast','之後接上','存入','sm')}</div><div class=card><span class=ic>💸</span><div class=nm>貸款<small>日息 0.8%，額度隨資產成長</small></div>${btn('toast','之後接上','借款','sm')}</div>`,
 ledger:`<div class=stats><div>總資產<b>${f(S.money+9000)}</b></div><div>累計營業額<b>$16,755</b></div><div>累計服務<b>599 人</b></div></div><div class=chart>${[3,2.5,5,6.5,3,4.5,3.8].map((v,i)=>`<div style="height:${v*14}px"><span>D${i+3}</span></div>`).join('')}</div><div class=ln style="margin-top:22px"><span>最佳單日利潤</span><b>$1,093</b></div><div class=ln><span>完美找零</span><b>72 次</b></div><div class=ln><span>顧客流失</span><b>18 人</b></div>`}[S.sub];
 return `<div class=chips>${SUBS.map(([k,n])=>btn('sub',k,n,'chip'+(S.sub===k?' on':''))).join('')}</div>${sub}`}
function rFood(){if(!S.own.hot)return `<div class=c><div style="font-size:40px">🍢</div><b>還沒有熱食檔口</b><p>買了才能賣關東煮、茶葉蛋、熱狗，每道菜要先備食材</p>${btn('tab','exp','去擴店 → 設備','btn')}</div>`;
 return `<div class=hd><span>熱食菜單</span><small>價格自己定</small></div>`+[['🍢','關東煮',12,25],['🥚','茶葉蛋',8,15],['🌭','熱狗',14,30],['🍠','烤地瓜',18,40]].map(([i,n,c,p])=>`<div class=row><span class=ic>${i}</span><div class=nm>${n}<small>成本 ${f(c)} · 售價 ${f(p)} · 每份毛利 ${Math.round((p-c)/p*100)}%</small></div>${btn('toast','之後接上','上架','sm g')}</div>`).join('')}
function rSet(){const row=(n,d,b)=>`<div class=row><div class=nm>${n}<small>${d}</small></div>${b}</div>`;
 return `<div class=hd><span>設定</span></div>`+row('畫質','卡頓時選流暢',btn('toast','之後接上','標準','sm g'))+row('同屏顧客','少一點更流暢',btn('toast','之後接上','正常','sm g'))+row('超市名字','日日鮮超市',btn('toast','之後接上','改名','sm g'))+row('雲存檔','之後用 Firebase 接上',btn('toast','之後接上','同步','sm g'))+row('測試工具','開發階段用，正式版會拿掉',btn('dbg','money','+$10,000','sm g')+btn('dbg','lv','升一級','sm g'))+row('玩法說明','原作玩法與我們的做法',btn('howto','x','查看','sm g'))+`<div style="margin-top:12px">${btn('reset','x','重新開店','btn g w')}</div>`}
function syncStaff(){const reg=SPEC(S.lv).reg,c=Math.min(S.staff.cashier||0,reg-1),k=reg+'/'+c;if(syncStaff.k===k)return;syncStaff.k=k;store.setCounters(reg,c)}
const ico=p=>{const u=store.icon(p.id);return u?`<img src="${u}" width=40 height=40 style="object-fit:contain">`:p.e};
function render(){syncStaff();syncStore();{const tl=S.tab==='cash'&&!!S.cur;if(render.tl!==tl){render.tl=tl;focus()}}$('tabs').innerHTML=TABS.map(([k,i,n])=>`<button class="tab${S.tab===k?' on':''}" data-a="tab" data-v="${k}"><b>${i}</b>${n}</button>`).join('');
 const keep=$('sheet').scrollTop;$('sheet').innerHTML='<div class=grab><i></i></div>'+({cash:rCash,shelf:rShelf,wh:rWh,price:rPrice,exp:rExp,food:rFood,set:rSet})[S.tab]();$('sheet').scrollTop=keep;hud()}
// ---- 動作 ----
function buy(v){const[k,id]=v.split('|'),it=CAT[k].find(x=>x[0]===id),pri=it[4];
 if(S.own[id])return toast('已經擁有了');if(S.money<pri)return toast('資金不足',1);
 S.money-=pri;S.own[id]=1;if(id==='hot'||id==='dine'||id==='cold')store.setVisible(id==='cold'?'coldroom':id,true);toast('已購買 '+it[2]);if(id==='member'){S.member.own=true;showMember()}}
function focus(){const t=S.tab;store.focus(t==='shelf'?(S.sel>=0?'shelf'+S.sel:'shelves'):t==='wh'?'wh':t==='cash'?(S.cur?'till':'cash'):t==='food'?'food':'all')}
function act(a,v){v=String(v);const[x,y]=v.split('|');
 if(a==='toast'){toast(v==='x'?'之後接上':v);return}
 if(a==='tab'){S.tab=v;S.sel=-1;store.mark(-1);focus();pull()}else if(a==='sub')S.sub=v;else if(a==='pm')S.pm=v;
 else if(a==='sel'){S.sel=+v;store.mark(+v);focus()}
 else if(a==='want')pr(x).want=Math.max(0,pr(x).want+ +y);
 else if(a==='order'){const c=P.reduce((s,p)=>s+p.want*p.cost*p.pack,0);if(!c)return;if(c>S.money)return toast('資金不足',1);const qa=P.filter(p=>!p.cold).reduce((n,p)=>n+p.want*p.pack,0),qc=P.filter(p=>p.cold).reduce((n,p)=>n+p.want*p.pack,0);if(used(false)+qa>S.ambCap||used(true)+qc>S.coldCap)return toast('倉庫空間不足',1);S.money-=c;P.forEach(p=>{if(p.want){const q=p.want*p.pack;if(S.phase==='prep')p.wh+=q;else S.orders.push({id:p.id,q,eta:S.min+30});p.want=0}});toast(S.phase==='prep'?'已下單，貨立即到倉庫':'已下單，遊戲內 30 分鐘後到貨')}
 else if(a==='price')pr(x).price=Math.max(1,pr(x).price+ +y);
 else if(a==='pall')P.forEach(p=>p.price=Math.max(1,Math.round(v==='mkt'?p.mkt:p.price*+v)));
 else if(a==='buy')buy(v);else if(a==='wall')store.setWall(+v);
 else if(a==='kp')S.kb=v==='C'?'':v==='<'?S.kb.slice(0,-1):(S.kb+v).slice(0,5);
 else if(a==='eq'){const e=EQ.concat(EQ2).find(x=>x[0]===v),cur=S.eq[v]||0;if(S.lv<e[6])toast('Lv'+e[6]+' 才解鎖',1);else if(v==='dine'&&!S.own.hot)toast('需要先有熱食檔口',1);else if(cur>=e[5].length)toast('已經是最高等級');else{const p=nt(e[5][cur]);if(S.money<p)toast('資金不足',1);else{S.money-=p;S.eq[v]=cur+1;S.own[v]=true;if(v==='hot'||v==='dine')store.setVisible(v,true);if(v==='dine')store.focus('dine');if(v==='cold')store.setVisible('coldroom',true);toast('已購買 '+e[2])}}}
 else if(a==='hire'){const s=ST.find(x=>x[0]===v),c=S.staff[v]||0;if(c<s[6]()){S.staff[v]=c+1;toast('已雇用 '+s[2])}else toast('人數已滿',1)}
 else if(a==='fire'){if(S.staff[v]>0){S.staff[v]--;toast('已解雇')}}
 else if(a==='dbg'){if(v==='money'){S.money+=10000;toast('+$10,000')}else if(S.lv<MAXLV){S.lv++;toast('升到 Lv'+S.lv+'：'+lvName(S.lv))}}
 else if(a==='howto'){S.qOpen=false;openModal('<button class=x data-a="mclose">✕</button><div class=bt>怎麼玩</div>'+HOWTO.map(([i,t,d])=>`<p style="margin:0 0 10px;font-size:14px;line-height:1.7;font-weight:600"><b>${i} ${t}</b>：${d}</p>`).join('')+'<p style="color:var(--sub);font-size:12px;font-weight:700">※ 外送、突發事件、員工自動化等功能還在開發中。金額已從人民幣換算成新台幣。</p>')}
 else if(a==='fix'){const x=FIXT[v];if(S.lv<x.lv)toast('Lv'+x.lv+' 才解鎖',1);else if(S.fix.length>=SPEC(S.lv).shelf)toast('沒空位了，先升級店鋪',1);else if(S.money<x.price)toast('資金不足',1);else{S.money-=x.price;S.fix.push(v);store.setFixtures(S.fix);toast('已購買 '+x.n)}}
 else if(a==='scan'){const t=S.cur;if(t&&t.ph==='scan'){if(!t.items[+v].s){t.items[+v].s=true;store.beltScan(+v)}if(t.items.every(i=>i.s))t.ph='pay'}}
 else if(a==='scanall'){const t=S.cur;if(t){t.items.forEach(i=>i.s=true);t.ph='pay';store.beltScanAll()}}
 else if(a==='bill'){if(S.cur)S.cur.chg.push(+v)}else if(a==='undo'){if(S.cur)S.cur.chg.pop()}else if(a==='clr'){if(S.cur)S.cur.chg=[]}
 else if(a==='cashok'){const t=S.cur;if(!t)return;const got=t.chg.reduce((x,y)=>x+y,0);if(got<t.due){toast('找少了，顧客不接受',1)}else done(t,{err:got-t.due,perfect:got===t.due})}
 else if(a==='autochg'){if(S.cur)done(S.cur,{perfect:1})}
 else if(a==='qrok'){if(S.cur)done(S.cur,{})}
 else if(a==='posfill'){if(S.cur)S.kb=String(S.cur.total)}
 else if(a==='cardok'){const t=S.cur;if(!t||t.cs)return;if(S.kb!==String(t.total)){S.kb='';toast('金額不對，請重新輸入',1)}else{t.cs='pin';S.kb='';setTimeout(()=>{if(S.cur===t){t.cs='print';render()}},1200);setTimeout(()=>{if(S.cur===t){done(t,{});render()}},2300)}}
 else if(a==='quick'){if(S.cur)done(S.cur,{})}
 else if(a==='rs'){const p=pr(v),m=Math.min(SC-p.shelf,p.wh);if(m>0){p.wh-=m;p.shelf+=m;toast('已補貨 '+p.n+' +'+m)}else toast(p.shelf>=SC?'貨架已經滿了':'倉庫沒貨了',1)}
 else if(a==='rsall'){let n=0;A().forEach(p=>{if(!hasFx(p))return;const m=Math.min(SC-p.shelf,p.wh);if(m>0){p.wh-=m;p.shelf+=m;n+=m}});toast(n?'補貨完成，共 '+n+' 件':'沒有可補的貨',!n)}
 else if(a==='smart'){P.forEach(p=>p.want=0);let n=0;A().forEach(p=>{const b=plan(p,S.phase==='open');p.want=b;if(b)n++});const dn=Math.min(5,S.days.length);toast(n?'已估好 '+n+' 種（'+(dn>=3?'依近 '+dn+' 天銷量':'營業天數不到 3 天，先用預設估算')+'）':'目前庫存夠用，不用補')}
 else if(a==='bm'){S.buyerMid=!S.buyerMid}
 else if(a==='fmv'){const i=+x,j=i+ +y;if(S.fix[j]){[S.fix[i],S.fix[j]]=[S.fix[j],S.fix[i]];store.setFixtures(S.fix);toast('已換位')}}
 else if(a==='fsell'){const i=+v,t=S.fix[i];if(S.fix.length<=1)toast('至少要留一個貨架',1);else{S.money+=Math.round(FIXT[t].price/2);S.fix.splice(i,1);store.setFixtures(S.fix);toast('已賣掉 '+FIXT[t].n)}}
 else if(a==='leave'){if(S.cur){lose(S.cur,1);pull()}}
 else if(a==='quest'){S.qOpen=true;showQuest()}
 else if(a==='mclose'){S.qOpen=false;closeModal()}
 else if(a==='bstart')closeModal();
 else if(a==='disc'){S.member.disc=+v;toast('會員折扣設為 '+v+' 折');showMember()}
 else if(a==='upgrade'){const c=UPC[S.lv-1];if(canUp()){S.money+=2250-c;S.lv++;toast('升級成「'+lvName(S.lv)+'」！')}else toast('升級條件還沒達成',1)}
 else if(a==='claim'){const d=S.daily[+v];if(d&&!d.done&&qv(d.k)>=d.goal){d.done=true;S.money+=d.reward;toast('領取 '+f(d.reward))}showQuest()}
 else if(a==='open'){S.phase='open';S.min=480;S.visit=0;S.queue=[];S.pend=[];S.cur=null;CB.length=0;if(S.staff.stocker)A().forEach(p=>{if(!hasFx(p))return;const m=Math.min(SC-p.shelf,p.wh);if(m>0){p.wh-=m;p.shelf+=m}});store.setOpen(true);toast('開門營業！')}
 else if(a==='close'){S.phase='closed';dropAll();S.pend=[];Object.keys(carts).forEach(k=>{carts[k].items.forEach(i=>pr(i.id).shelf++);delete carts[k]});if(S.stat.served){S.days.push({v:S.visit,cnt:S.stat.cnt});if(S.days.length>7)S.days.shift()}store.setOpen(false);settle();return}
 else if(a==='next'){closeModal();S.day++;S.min=480;S.visit=0;S.phase='prep';S.orders.forEach(o=>pr(o.id).wh+=o.q);S.orders=[];S.daily=newDaily();S.stat=newStat();rollDay();if(S.staff.buyer){const r=autoBuy(false);if(r.n)toast('🧑‍💻 採購員進貨 '+r.n+' 種，共 '+f(r.c))}showBrief()}
 else if(a==='reset'){location.reload();return}
 render()}
document.addEventListener('click',e=>{const b=e.target.closest('[data-a]');if(b)act(b.dataset.a,b.dataset.v??'x')});
function checkOrders(){const d=S.orders.filter(o=>S.min>=o.eta);if(d.length){d.forEach(o=>pr(o.id).wh+=o.q);S.orders=S.orders.filter(o=>S.min<o.eta);toast('📦 貨到了！');if(S.tab==='wh')render()}}
let lt=performance.now();(function loop(){requestAnimationFrame(loop);const n=performance.now(),dt=Math.min(.2,(n-lt)/1000);lt=n;
 if(S.phase==='open'&&S.min<1320){const o=Math.floor(S.min);S.min=Math.min(1320,S.min+dt*3);if(Math.floor(S.min)!==o){if(Math.random()<S.expect/840){const cid=++TID;carts[cid]={items:[],sum:0,cogs:0};if(store.spawnCustomer(cid,stopsFor()))S.visit++;else delete carts[cid]};if(S.staff.buyer&&S.buyerMid&&Math.floor(S.min)%20===0){const r=autoBuy(true);if(r.n)toast('🧑‍💻 採購員補訂了 '+r.n+' 種商品')}checkOrders();hud()}}if(S.phase==='open')tickCash(dt)})(); // 遊戲時間每秒走 3 分鐘，一分鐘一分鐘平順地走
render();
store.setHandlers({take,arrive});store.onPick(i=>{if(S.cur&&S.cur.ph==='scan')act('scan',i)});store.setFixtures(S.fix);store.setOpen(false);focus();rollDay();showBrief();
{const app=$('app'),sh=$('sheet');let d=null;
 sh.addEventListener('pointerdown',e=>{if(!e.target.closest('.grab'))return;d={y:e.clientY,h:$('stage').clientHeight,m:false};sh.setPointerCapture(e.pointerId)});
 sh.addEventListener('pointermove',e=>{if(!d)return;const dy=e.clientY-d.y;if(Math.abs(dy)>5)d.m=true;if(d.m)app.style.setProperty('--sh',Math.min(76,Math.max(18,(d.h+dy)/app.clientHeight*100))+'%')});
 const end=()=>{if(!d)return;const S3=[22,44,70],cur=parseFloat(app.style.getPropertyValue('--sh'))||44;let t;if(!d.m){const i=S3.findIndex(x=>Math.abs(x-cur)<6);t=S3[(i+1)%3]}else t=S3.reduce((a,b)=>Math.abs(b-cur)<Math.abs(a-cur)?b:a);app.style.setProperty('--sh',t+'%');d=null};
 sh.addEventListener('pointerup',end);sh.addEventListener('pointercancel',end)}

// 全部介面：HUD、底部 7 個分頁、擴店 7 個子頁。數值先用示範資料，流程之後一步步接上。
import {initStore} from './store.js';
const $=id=>document.getElementById(id),f=n=>'$'+Math.round(n).toLocaleString();
const store=initStore($('stage'));
// ---- 幣值換算：原作是人民幣，一律 ×4.5 換成新台幣（約略匯率）再取整，改 FX 就能整體調整 ----
const FX=4.5,nt=c=>{const v=c*FX;return v<30?Math.max(1,Math.round(v)):v<200?Math.round(v/5)*5:Math.round(v/10)*10};
const CATALOG=[['water','礦泉水','💧',.9,2,0,1,24,'瓶'],['cola','可樂','🥤',1.5,3,0,1,24,'罐'],['chips','洋芋片','🍟',4.4,7,0,1,12,'袋'],['noodle','泡麵','🍜',2.4,4.5,0,1,12,'桶'],['biscuit','餅乾','🍪',3.1,5.9,0,1,10,'盒'],['spicy','點心麵','🌶️',1.3,2.6,0,1,20,'包'],['tissue','衛生紙','🧻',4.3,7.4,0,1,10,'包'],['bread','麵包','🍞',2.9,5.6,0,1,10,'個'],
 ['milk','牛奶','🥛',2.6,4.6,1,2,12,'盒'],['yogurt','優格','🍶',3.5,6.2,1,2,12,'杯'],['beer','啤酒','🍺',3.4,5.3,1,2,24,'罐'],['sausage','香腸','🌭',4.1,7.7,0,2,12,'袋'],['choco','巧克力','🍫',5.5,10.4,0,2,12,'塊'],
 ['apple','蘋果','🍎',1.8,3.5,1,3,20,'顆'],['banana','香蕉','🍌',1.5,3,1,3,20,'根'],['tomato','番茄','🍅',1.2,2.5,1,3,20,'顆'],['egg','雞蛋','🥚',4,6.5,1,3,12,'盒'],['icecream','冰淇淋','🍦',2,4,1,3,24,'支'],['dumpling','冷凍水餃','🥟',5,8.5,1,3,12,'袋'],['strawberry','草莓','🍓',4.5,8,1,3,10,'盒']];
const P=CATALOG.map(([id,n,e,c,p,cold,lv,pack,un])=>({id,n,e,cost:nt(c),cb:nt(c),old:nt(c),price:nt(p),mkt:nt(p),cold:!!cold,lv,pack,u:un,wh:(!cold&&lv===1)?pack:0,shelf:(!cold&&lv===1)?8:0,want:0}));
const A=()=>P.filter(p=>p.lv<=S.lv);
// 熱食：食材用「份」計，進一批立刻到；價格自己定，高於參考價太多就沒人買
const HOT=[['oden','關東煮','🍢',4,12,20],['bun','肉包','🥟',1.5,5,30],['coffee','熱咖啡','☕',4.5,15,20],['rice','飯糰','🍙',3,8,20],['hotdog','烤香腸','🌭',2,6,30]].map(([id,n,e,c,p,b])=>({id,n,e,cost:nt(c),ref:nt(p),price:nt(p),batch:b,bcost:nt(c)*b,stock:0,sold:0,rev:0,hist:[]}));
const pickHot=()=>{const ok=HOT.filter(h=>h.stock>0),w=ok.map(h=>{const r=h.price/h.ref;return r<=1?1:r<=1.25?.6:r<=1.5?.2:.03}),sw=w.reduce((a,b)=>a+b,0);if(!ok.length||Math.random()>=Math.min(1,sw))return null;let x=Math.random()*sw,k=0;while(k<w.length-1&&x>w[k]){x-=w[k];k++}return ok[k]},
 hotOf=id=>HOT.find(h=>h.id===id),nmOf=id=>(pr(id)||hotOf(id)).n;
// 逐架：每個貨架（fxd）有 3 格，每格擺一種商品；商品的「貨架庫存」就是它所在那一格的數量
const SC0=12,slotCap=x=>Math.round(SC0*[1,1.5,2][x.cl-1]),capOf=p=>p.sls.reduce((a,sl)=>a+slotCap(sl.fx),0),mkFx=(t,pi)=>({t,pi,cl:1,rot:0,dx:0,dz:0,s:[null,null,null]});
P.forEach(p=>{p._init=p.shelf;p.sls=[];Object.defineProperty(p,'shelf',{get(){return p.sls.reduce((a,sl)=>a+sl.q,0)},set(n){if(!p.sls.length)return;n=Math.max(0,Math.min(capOf(p),Math.round(n)));const c=p.shelf;if(n>c){let d=n-c;for(const sl of p.sls){const m=Math.min(d,slotCap(sl.fx)-sl.q);sl.q+=m;d-=m;if(!d)break}}else{let d=c-n;for(const sl of[...p.sls].reverse()){const m=Math.min(d,sl.q);sl.q-=m;d-=m;if(!d)break}}},configurable:true,enumerable:true})});
// 即期：LIFE＝進貨後幾天到「即期日」；每批貨各自記錄 lots（q 數量、d 距離即期日還有幾天，0＝今天即期）
// DISC＝即期區折扣：pr 售價比例、visit 顧客逛到即期區的機率、more 多拿一件的機率
const LIFE={bread:2,milk:3,yogurt:4,egg:5,apple:4,banana:3,tomato:3,strawberry:2},DISC={7:{pr:.7,visit:.35,more:.2},5:{pr:.5,visit:.6,more:.45},3:{pr:.3,visit:.9,more:.7}},CCAP=30;P.forEach(p=>{p.life=LIFE[p.id]||0;p.lots=[];p.clr=0});
const S={money:4500,star:80,visit:0,lv:1,min:480,day:1,phase:'prep',orders:[],qOpen:false,total:0,hist:[],member:{own:false,count:0,disc:95},wn:['☀️','晴',1.1],expect:60,stat:null,daily:[],tab:'cash',sub:'store',pm:'cash',sel:-1,own:{},eq:{},staff:{},kb:'',get ambCap(){return Math.round(SPEC(this.lv).cap*(1+.4*(this.eq.whx||0)))},get coldCap(){return[0,2000,5000,12000][this.eq.cold||0]},fxd:[],get fix(){return this.fxd.map(x=>x.t)},queue:[],pend:[],cur:null,clrD:7,buyerMid:true,days:[],jobs:[],dord:[],dseq:0,buyerBusy:false,dOpen:false};
const newStat=()=>({err:0,ct:0,cnt:{},s0:S.star,served:0,total:0,perfect:0,gross:0,rev:0,cogs:0,memberDisc:0,newMember:0,lost:0,thief:0,caught:0,hot:0,hotRev:0,charge:0,best:'',bestN:0,waste:0,wasteN:0,clr:0,clrRev:0,mv:0,rebate:0,dv:0,dvRev:0,loss:0,dine:0,waive:0,by:{you:{n:0,rev:0},cashier:{n:0,rev:0},self:{n:0,rev:0},hot:{n:0,rev:0}}});S.stat=newStat();S.fxd=(()=>{const sl=store.slots();return[0,1,2,3].map(i=>mkFx('shelf',sl[i]))})();
const RATE={95:.04,90:.08,85:.13},UPC=[6750,17100,36000,67500,117000,180000,270000,405000];
const wk=()=>['一','二','三','四','五','六','日'][(S.day+1)%7];
const CAT={mkt:[['flyer','📄','發傳單','明天客流 +25%',nt(160)],['ig','📱','IG 限動廣告','客流 +20%、口碑 +3',nt(240)],['member','💳','會員卡','會員結帳打折，顧客更常來',nt(500)]]};
// 設備：id、圖示、名稱、說明、效果、各級價格（人民幣，顯示時換算）、最低等級
const EQ=[['neon','🏮','霓虹招牌','店招亮起來，路人更容易進店','客流 +10% / +20%',[120,260],1],['whx','📦','倉庫擴充','加裝貨架，倉庫能放更多貨','倉庫容量 +40% / 級',[80,160,320],1],['music','🎵','店內音響','放點輕鬆的音樂，顧客心情更好','滿意度 +4',[60],1],['scan','⚡','一鍵掃碼台','收銀時一鍵把輸送帶上的商品全部掃完','收銀時出現「一鍵掃碼」按鈕',[150],1],['pos','💳','智慧 POS 機','刷卡時自動帶出應收金額','刷卡一鍵收款',[180],1],['ac','❄️','中央空調','冬暖夏涼，排隊也不煩躁','顧客耐心 +35%，電費 '+f(nt(8))+'/天',[250],1],['cart','🛒','購物車','推著車，顧客會多買一些','人均多買約 1 件',[200],3],['change','🪙','自動找零機','現金找零一鍵完成','找零按鈕一鍵完成',[280],3],['cold','🧊','冷庫','倉庫裡的冷藏間：蔬果、乳品、冷凍品、熱食食材要放冷庫，放不下的很快變質','冷藏容量 2000 / 5000 / 12000',[800,1500,3000],2],['self','🖥️','自助結帳機','顧客自己掃碼結帳，無需薪資','依店面等級放自助結帳機（Lv3 起 2 台），顧客自己結帳，不用薪資',[500],3]];
const EQ2=[['hot','🍢','熱食區','關東煮、包子、熱咖啡……要先採購食材，每道菜可自己定價','在「餐飲」頁管理菜色；瓦斯費 '+f(nt(15))+'/天',[350],2],['dine','🪑','用餐區','在店面右側擴建用餐室，可升 3 級（房間變大、桌椅變多）','熱食購買率 +15%，坐下吃的顧客滿意度 +4（需先有熱食區）',[350,700,1400],3],['charge','🔋','共享行動電源','門口放一台行動電源租借櫃，租借收入分成','約 8% 顧客租借，每次 '+f(nt(3)),[120],2],['delivery','🛵','外送跑腿','接入外送平台，外送員上門取貨送貨','營業中接外送平台訂單，要揀貨包貨、平台司機才會來取；每單加收配送費 '+f(nt(5))+'；平台費 '+f(nt(50))+'/天',[400],3],['gate','🚪','防盜門','門口裝上防盜檢測門，沒付錢的商品一過門就報警','逃跑的小偷約七成會在門口被攔下',[300],2],['cctv','📹','監視器','店裡裝上監視器，小偷不敢亂來','小偷少約四成；小偷一動手就能發現，抓捕時間更長',[250],2]];
const ST=[['cashier','🧑‍💼','收銀員','各自守一個收銀台自動結帳（1 號台永遠留給你）',60,1,()=>Math.max(0,SPEC(S.lv).reg-1)],['stocker','🧑‍🔧','理貨員','會真的走到倉庫搬貨，再補到貨架上，人多補得快',50,1,()=>S.lv>=2?6:2],['buyer','🧑‍💻','採購員','每天開門前在辦公室電腦下單；營業中會走賣場巡視缺貨，再回辦公室下單（可關閉）',70,3,()=>S.lv>=3?2:0],['guard','👮','保全','在門口站崗、自動巡邏，看到小偷就追上去抓',80,2,()=>1],['packer','📦','打包員','外送訂單自動配貨裝袋，放到取貨處給外送員',50,3,()=>S.lv>=3?1:0],['night','🌙','夜班店員','你打烊後接著營業到天亮，24 小時不打烊（夜裡客人少，主要賣貨架上的貨）',90,3,()=>S.lv>=3?1:0]];
function eqCard(e){const[id,ic,n,d,ef,pr,lv]=e,mx=pr.length,cur=S.eq[id]||0,lock=S.lv<lv;
 const b=lock?`<span class="sm off">Lv${lv}</span>`:cur>=mx?`<span class="sm ok">${mx>1?'已滿級':'已擁有'}</span>`:btn('eq',id,(cur?'升級 ':'')+f(nt(pr[cur])),'sm');
 return `<div class=card><span class=ic>${ic}</span><div class=nm>${n}${mx>1?` <span style="color:var(--sub);font-size:12px">Lv${cur}/${mx}</span>`:''}<small>${d}</small><small style="color:#2db36f;font-weight:800">${ef}</small></div>${b}</div>`}
const eqTab=()=>EQ.map(eqCard).join('')+`<div class=hd style="margin:8px 0;font-size:14px;color:var(--sub)"><span>增值服務 / 防盜</span></div>`+EQ2.map(eqCard).join('');
function stTab(){return `<div style="color:var(--sub);font-size:13px;font-weight:700;margin-bottom:8px">薪資在每天打烊時結算</div>`+ST.map(([id,ic,n,d,w,lv,mx])=>{const m=mx(),c=S.staff[id]||0,lock=S.lv<lv;
 return `<div class=card><span class=ic>${ic}</span><div class=nm>${n}<small style="font-weight:900;color:var(--tx)">${c}/${m}</small><small>${d}</small><small style="color:#2db36f;font-weight:800">薪資 ${f(nt(w))}/天</small></div>${lock?`<span class="sm off">Lv${lv}</span>`:`<div style="display:flex;flex-direction:column;gap:6px">${c?btn('fire',id,'解僱','sm g'):''}${c<m?btn('hire',id,'僱用','sm'):''}</div>`}</div>`}).join('')+(S.staff.buyer>0?`<div class=card data-a="bm" data-v="x" style="cursor:pointer"><span style="width:30px;height:30px;flex:none;border-radius:9px;background:${S.buyerMid?'#4aa56a':'#fff'};border:2px solid #4aa56a;color:#fff;display:flex;align-items:center;justify-content:center;font-weight:900">${S.buyerMid?'✓':''}</span><div class=nm>營業中也補缺貨<small>每 20 分鐘巡檢一次，倉庫快空、貨架又不滿的商品自動補訂（30 分鐘送到）</small></div></div>`:'')}
const lockHint=()=>{const l=P.filter(p=>p.lv>S.lv);return l.length?`<div style="color:var(--sub);font-size:13px;font-weight:700;margin:6px 2px 10px">🔒 擴店後解鎖更多商品：${l.slice(0,6).map(p=>p.n).join('、')}…</div>`:''};
const HOWTO=[['🕹️','操作','單指拖曳平移畫面；雙指捏合縮放、扭轉轉向、上下滑改仰角。拖曳面板上方的小橫條，可以調整面板高度。'],
 ['🧾','收銀','你停在「收銀」頁，1 號台才有人收；收銀員守其他櫃台，自助結帳機自己結帳。每個有人的櫃台各排一條隊，沒人收銀時顧客只在入口等。點輸送帶上的商品掃碼；現金要照「應找」點錢幣，刷卡輸入應收金額，行動支付掃碼即可。偶爾顧客會問零頭能不能抹掉：答應他會很開心但少收一點，拒絕他會有點不高興。'],
 ['🗄️','貨架','到「貨架」頁點一個貨架，每個貨架有 3 格，可以擺商品、補貨、擴充容量、轉向、微調位置，不要的可以賣掉。理貨員會真的走去倉庫搬貨補上。顧客只買貨架上有的東西，缺貨會讓他們失望。'],
 ['📦','倉庫','進價每天會波動，便宜時多進一點。開門前下單立刻到貨，營業中下單要等遊戲內 30 分鐘。蔬果、乳品、冷凍品要放冷庫。「智慧補貨」會依近幾天的銷量替你估。'],
 ['🏷️','價格','售價高於市價越多，顧客越不願意買；適當降價可以衝銷量和口碑。'],
 ['🏗️','擴店與設備','存夠錢、達成升級任務就能擴店，店面變大、貨架位和收銀台變多。設備、員工和行銷在「擴店」頁購買。'],
 ['🧑‍💼','員工','收銀員、理貨員、採購員、保全、打包員的薪資都在每天打烊時結算。採購員開門前會自動下單，營業中也會巡場補缺貨。'],
 ['🏷️','即期特價區','有保存期限的商品，即期當天照常賣；打烊時沒賣完的，會自動搬進即期特價區，隔天打 3、5 或 7 折賣，再賣不完就報廢。廠商偶爾送來即期貨，會退你 4 成貨款。'],
 ['🍢','餐飲與內用','買了熱食區，到「餐飲」頁替每道菜定價、進食材。有些顧客專程來吃，也有人結帳時順便買。再買用餐區，顧客可以坐下來內用；價格太貴就沒人買。'],
 ['🛵','外送','買了外送之後，畫面下方會多一個「外送」分頁。接到訂單要揀貨包貨（或僱打包員），包好放到取貨處，平台司機才會來取；逾時會取消並扣口碑。'],
 ['🚨','小偷與保全','有人拿了東西不付錢就跑，頭上會冒出紅色「抓小偷」按鈕和倒數，倒數結束前點它就能抓住，東西會放回貨架；跑掉的話貨就沒了、口碑 −1。保全會自己追上去抓；防盜門在門口攔下約七成；監視器讓小偷少約四成，而且一動手就看得到。'],
 ['💳','會員卡','到「擴店 → 行銷」開通，會員結帳打折、回頭客更多。'],
 ['💾','存檔','每天按「下一天」時，會自動存在這支手機的瀏覽器裡；營業到一半關掉頁面，當天的進度不會保留。'],
 ['🔜','即將推出','夜班營業、突發事件、銀行與帳本、裝潢擺設。']];
// 等級名稱表：原作至少有 Lv9，之後要加新等級只要在這裡多加一行名字（沒寫名字的等級會顯示「Lv數字」）
const LV=['街角柑仔店','社區便利店','鄰里超市','生活超市','大型量販店','連鎖旗艦店','生活購物中心','城市百貨','超級商業廣場'];
const MAXLV=9,lvName=n=>LV[n-1]||'Lv'+n;
const nextLv=()=>S.lv<MAXLV?`🎯 擴店升級為「${lvName(S.lv+1)}」 0/3 +$${500*S.lv}`:'🏆 已是最高等級';
const SUBS=[['store','店面'],['equip','設備'],['staff','員工'],['mkt','行銷'],['decor','裝潢'],['bank','銀行'],['ledger','帳本']];
const TAB_DLV=['dlv','🛵','外送'],tabsNow=()=>{const t=TABS.slice();if(S.eq.delivery)t.splice(5,0,TAB_DLV);return t};
const TABS=[['cash','🧾','收銀'],['shelf','🗄️','貨架'],['wh','📦','倉庫'],['price','🏷️','價格'],['exp','🏪','擴店'],['food','🍜','餐飲'],['set','⚙️','設定']];
const DEN=[[1000,'#3a6bc4'],[500,'#b8864b'],[200,'#2c9b7f'],[100,'#d94452'],[50,'#e0b84a;color:#333'],[10,'#c9a63c;color:#333'],[5,'#c7ccd6;color:#333'],[1,'#b9bec8;color:#333']];
const pr=id=>P.find(p=>p.id===id),btn=(a,v,t,c)=>`<button class="${c||'sm'}" data-a="${a}" data-v="${v}">${t}</button>`;
const used=c=>P.filter(p=>p.cold===c).reduce((a,p)=>a+p.wh,0);
function toast(s,bad){const e=$('toast');e.textContent=s;e.className=bad?'bad':'';e.style.opacity=1;clearTimeout(toast.h);toast.h=setTimeout(()=>e.style.opacity=0,1300)}
// ---- 彈窗 ----
const openModal=h=>{$('modal').innerHTML='<div class=box>'+h+'</div>';$('modal').classList.add('on')},closeModal=()=>{S.dOpen=false;$('modal').classList.remove('on')};
function fitModal(){const bx=$('modal').firstChild;if(!bx)return;bx.classList.add('cmp');let z=1;for(let k=0;k<4;k++){const ch=bx.clientHeight,sh=bx.scrollHeight;if(!ch||sh<=ch+1)break;z*=ch/sh*.97;bx.style.zoom=z}}
// ---- 任務：升級任務（3 個條件）＋每日隨機任務 ----
const POOL=[['perfect','完美找零',[3,5,8],'次',[60,100,160]],['served','服務顧客',[20,30,40],'位',[80,120,180]],['rev','單日營業額達',[600,900,1500],'元',[100,160,260]],['visit','進店人數達',[25,40,60],'人',[60,100,150]],['thief','抓到小偷',[1,2,3],'個',[120,200,300]],['member','新增會員',[2,4,6],'位',[80,120,180]],['hot','賣出熱食',[8,12,20],'份',[80,120,200]]];
const rnd3=n=>Math.floor(Math.random()*n);
function newDaily(){return POOL.map(a=>[Math.random(),a]).sort((x,y)=>x[0]-y[0]).slice(0,3).map(([,a])=>{const d=rnd3(a[2].length);return{k:a[0],n:a[1],goal:a[0]==='rev'?Math.round(a[2][d]*FX/100)*100:a[2][d],unit:a[3],reward:Math.round(a[4][d]*FX/10)*10,done:false}})}
const qv=k=>k==='visit'?S.visit:k==='thief'?S.stat.caught:k==='member'?S.stat.newMember:k==='rev'?S.stat.gross:(S.stat[k]||0);
function mainConds(){const cost=UPC[S.lv-1]||0,g=[1500*S.lv,80+5*S.lv,cost],c=[S.total,S.star,S.money],fm=[f,x=>x,f];return['累計營業額','店家星級','現金（擴店費用）'].map((n,i)=>({n,cur:c[i],goal:g[i],ok:c[i]>=g[i],show:fm[i](c[i])+' / '+fm[i](g[i])}))}
function showQuest(){const mc=mainConds(),lvl=S.lv<MAXLV;openModal(`<button class=x data-a="mclose">✕</button><div class=hd style="margin-right:36px"><span>🎯 ${lvl?'升級「'+lvName(S.lv+1)+'」':'已是最高等級'}</span><small>${mc.filter(c=>c.ok).length}/3</small></div>`+(lvl?mc.map(c=>`<div class=qrow><div class=t>${c.ok?'✅':'⬜'} ${c.n}<small>${c.show}</small><div class=pb><i style="width:${Math.min(100,c.cur/c.goal*100)}%"></i></div></div></div>`).join('')+`<div class=hint style="margin-top:10px">三項都達成後，到「擴店」按「擴店」升級，可再領獎勵 ${f(2250)}</div>`:'')+`<div class=hd style="margin-top:10px"><span>📅 每日任務</span><small>隔天換新的</small></div>`+S.daily.map((d,i)=>{const v=qv(d.k),ok=v>=d.goal;return `<div class=qrow><div class=t>${d.n} ${d.goal}${d.unit}<small>${Math.min(v,d.goal)}/${d.goal} · 獎勵 ${f(d.reward)}</small><div class=pb><i style="width:${Math.min(100,v/d.goal*100)}%"></i></div></div><button data-a="claim" data-v="${i}" ${ok&&!d.done?'':'disabled'}>${d.done?'已領':'領取'}</button></div>`}).join(''))}
S.daily=newDaily();
function hud(){const pr=S.phase==='prep',m=Math.floor(S.min),T=String(Math.floor(m/60)).padStart(2,'0')+':'+String(m%60).padStart(2,'0'),clk=pr?'準備中':S.phase==='open'?T:'已打烊',mc=mainConds();
 const h=`<div class=tb data-p="${S.phase}"><div class=cp><span id=clock>{T}</span><small>第${S.day}天 週${wk()} ${S.wn[0]}</small></div></div><div class=r1><span class="pill r">日日鮮超市 Lv${S.lv}</span><span class=pill>⭐ ${S.star}</span>${pr?'':`<span class=pill>👥 ${S.visit} 進店</span><span class=pill>🧾 排隊 ${S.queue.length+(S.cur?1:0)}</span>`}</div><div class=quest data-a="quest">${S.lv<MAXLV?`🎯 擴店升級為「${lvName(S.lv+1)}」 ${mc.filter(c=>c.ok).length}/3 <b>+${f(2250)}</b>`:'🏆 已是最高等級'} ›</div><div class=r1><span class=pill>🪙 ${f(S.money)}</span></div>`;
 if(hud.k!==h){hud.k=h;$('hud').innerHTML=h.replace('{T}',clk)}else{const c=$('clock');if(c)c.textContent=clk}
 $('openBtn').style.display=pr?'block':'none';$('closeBtn').style.display=(S.phase==='open'&&S.min>=1320)?'block':'none'}
// ---- 每天開始：天氣、進價浮動、預計客流、早晨簡報 ----
function rollDay(){S.wn=[['☀️','晴',1.1],['⛅','多雲',1],['🌧️','雨',.8]][rnd3(3)];P.forEach(p=>{p.old=p.cost;p.cost=Math.max(1,Math.round(p.cb*(.85+Math.random()*.3)))});
 calcExpect()}
const calcExpect=()=>{S.expect=Math.round((SPEC(S.lv).flow+((S.eq.dine||0)*10)+(S.member.own?Math.min(30,S.member.count/5):0))*S.wn[2]*(1+[0,.1,.2][S.eq.neon||0]))}
const CFG=(()=>{try{return Object.assign({crowd:2},JSON.parse(localStorage.getItem('rrx-cfg')))}catch(e){return{crowd:2}}})(),capFor=()=>Math.round((20+4*S.lv)*[.5,1,1.5,2.2][CFG.crowd]);
const SAVE='rrx-save-v1';
function saveGame(){try{localStorage.setItem(SAVE,JSON.stringify({v:1,S:{money:S.money,star:S.star,lv:S.lv,day:S.day,total:S.total,hist:S.hist,member:S.member,own:S.own,eq:S.eq,staff:S.staff,clrD:S.clrD,buyerMid:S.buyerMid,days:S.days},P:P.map(p=>({id:p.id,price:p.price,wh:p.wh,clr:p.clr,lots:p.lots,off:!!p.off})),H:HOT.map(h=>({id:h.id,price:h.price,stock:h.stock,hist:h.hist})),F:S.fxd.map(x=>({t:x.t,pi:x.pi,cl:x.cl,rot:x.rot,dx:x.dx,dz:x.dz,s:x.s.map(sl=>sl?{pid:sl.pid,q:sl.q}:null)}))}))}catch(e){}}
const readSave=()=>{try{const d=JSON.parse(localStorage.getItem(SAVE));return d&&d.v===1?d:null}catch(e){return null}};
function loadGame(d){Object.assign(S,d.S);P.forEach(p=>{p.sls=[];p._init=0});d.P.forEach(o=>{const p=pr(o.id);if(p){p.price=o.price;p.wh=o.wh;p.clr=o.clr;p.lots=o.lots||[];p.off=o.off}});
 (d.H||[]).forEach(o=>{const h=hotOf(o.id);if(h){h.price=o.price;h.stock=o.stock;h.hist=o.hist||[]}});
 S.fxd=d.F.map(x=>{const f={...mkFx(x.t,x.pi),cl:x.cl,rot:x.rot,dx:x.dx,dz:x.dz};x.s.forEach((sl,i)=>{const p=sl&&pr(sl.pid);if(p){const o={pid:p.id,q:sl.q,fx:f};f.s[i]=o;p.sls.push(o)}});return f});
 S.phase='prep';S.min=480;S.visit=0;S.queue=[];S.cur=null;S.orders=[];S.dord=[];S.jobs=[];S.sel=-1;S.tab='cash';S.stat=newStat();S.daily=newDaily();
 if(S.own.hot)store.setVisible('hot',true);if(S.own.cold)store.setVisible('coldroom',true);store.setClrDisc(S.clrD);rollDay()}
function showBrief(){const dn=A().filter(p=>p.cost<p.old).slice(0,3).map(p=>p.n).join('、'),up=A().filter(p=>p.cost>p.old).slice(0,3).map(p=>p.n).join('、'),d=S.daily[0];
 openModal(`<div class=bt>${S.wn[0]} 第 ${S.day} 天 · 週${wk()}</div><div class=bcard><div class=bw>${S.wn[0]}<br><b>${S.wn[1]}</b></div><div class=bl>預計客流約 <b>${S.expect}</b> 人${dn?'<br>📉 進價下跌：'+dn:''}${up?'<br>📈 進價上漲：'+up:''}<br>🎯 今日挑戰：${d.n} ${d.goal}${d.unit}</div></div><p style="text-align:center;color:var(--sub);font-size:13px;font-weight:700">先進貨、擺貨、看看價格，準備好就開門營業！</p><button class="btn w" data-a="bstart">開始準備</button>`)}
const chg=p=>{const c=Math.round((p.cost/p.cb-1)*100);return c?`<span style="color:${c>0?'#d94452':'#2db36f'}">${c>0?'↑':'↓'}${Math.abs(c)}%</span>`:'—'};
// ---- 會員卡 ----
function showMember(){const m=S.member;openModal(`<button class=x data-a="mclose">✕</button><div class=hd style="margin-right:36px"><span>💳 會員卡</span><b style="color:#ff4d4d">${m.count} 位會員</b></div><p style="color:var(--sub);font-size:13px;font-weight:700;margin:0 0 10px">選一個會員折扣。折扣越大，辦卡的人越多，但每筆會員消費少收越多。</p>`+[[95,'95 折','約 4% 的顧客會辦卡'],[90,'90 折','約 8% 的顧客會辦卡'],[85,'85 折','約 13% 的顧客會辦卡']].map(([d,n,t])=>`<div class=card style="${m.disc===d?'border-color:#ff5a4e;background:#fff3f0':''}"><div class=nm>${n}<small>${t}</small></div>${btn('disc',d,m.disc===d?'目前':'選這個',m.disc===d?'sm ok':'sm')}</div>`).join('')+`<button class="btn w" data-a="mclose">確定</button>`)}
function rMkt(){const m=S.member;return cards('mkt',x=>x[0]!=='member')+(!m.own?`<div class=card><span class=ic>💳</span><div class=nm>會員卡<small>開通後顧客可辦卡，享固定折扣，回頭客更多</small></div>${btn('buy','mkt|member',f(nt(500)),'sm')}</div>`:`<div class=dash><div class=hd style="margin:0 0 4px"><span>💳 會員卡</span><b style="color:#ff4d4d">${m.count} 位會員</b></div><div style="font-size:12px;color:var(--sub);font-weight:700">今天新辦 ${S.stat.newMember} 張 · 目前 ${m.disc} 折</div><div class=chips style="margin-top:8px">${[95,90,85].map(d=>btn('disc',d,d+' 折','chip'+(m.disc===d?' on':''))).join('')}</div><div style="font-size:12px;color:var(--sub);font-weight:600">折扣越大辦卡越多（約 4% / 8% / 13%），但每筆會員消費少收越多。</div></div>`)}
// ---- 擴店・店面 ----
const SPEC=lv=>({size:`${8+2*lv}×${5+2*lv}米`,shelf:lv<2?4:6+3*(lv-2),reg:[2,2,3,4,4,5,5,6,6][Math.min(lv,9)-1],flow:lv<2?40:40+12*lv,cap:lv<=2?1000:1000+550*(lv-2),self:lv>=3?lv-1:0});
const canUp=()=>S.lv<MAXLV&&mainConds().every(c=>c.ok);
function storeTab(){const a=SPEC(S.lv),b=SPEC(S.lv+1),cost=UPC[S.lv-1]||0,ok=canUp();
 return `<div style="background:linear-gradient(135deg,#ff6a52,#e8392c);color:#fff;border-radius:20px;padding:14px;display:flex;gap:12px;align-items:center;margin-bottom:10px"><div style="width:58px;height:58px;border-radius:50%;background:#fff;color:#ff4d4d;font-weight:900;display:flex;align-items:center;justify-content:center;font-size:18px;flex:none">Lv${S.lv}</div><div><div style="font-size:19px;font-weight:900">日日鮮超市</div><div style="font-size:13px;font-weight:700">${lvName(S.lv)}・${a.size}・貨架位 ${S.fix.length}/${a.shelf}・收銀台 ${a.reg}</div></div></div>`+(S.lv<MAXLV?`<div class=dash><b style="font-size:15px">下一級：<span style="color:#ff4d4d">${lvName(S.lv+1)}</span></b><div class=tags>${['店面 '+b.size,'貨架位 '+b.shelf,'收銀台 '+b.reg,'基礎客流 '+b.flow+' 人/天','倉庫 '+b.cap,'自助結帳位 '+b.self].map(x=>`<span>${x}</span>`).join('')}</div><div style="font-size:13px;font-weight:800;margin-top:8px;line-height:1.8">新商品：${P.filter(p=>p.lv===S.lv+1).map(p=>p.e+' '+p.n).join('　')||'—'}</div><div class=ln style="margin-top:10px;align-items:center"><span style="color:var(--sub)">房租 ${f(360*S.lv)}/天</span>${btn('upgrade','x','擴店 '+f(cost),ok?'btn':'btn g')}</div>${ok?'':'<div style="font-size:12px;color:var(--sub);font-weight:600;margin-top:4px">條件還沒達成，點左上角任務可查看</div>'}</div>`:'')+`<div class=hd style="margin-top:6px"><span>購買貨架 / 櫃台</span></div>`+Object.keys(FIXT).map(k=>{const x=FIXT[k];return `<div class=card><div class=nm>${x.n}<small>${x.d}</small></div>${S.lv<x.lv?'<span class="sm off">Lv'+x.lv+'</span>':S.fix.length>=SPEC(S.lv).shelf?'<span class="sm off">沒空位</span>':btn('fix',k,f(x.price),'sm')}</div>`}).join('')}
// ---- 打烊結算（目前用模擬的一天；收銀流程接上後改成真實數字）----
function daySim(){const st=S.stat,vis=S.visit,share=Math.min(.6,S.member.count/200),dc=S.member.own?(100-S.member.disc)/100:0,cnt={};
 for(let i=0;i<vis;i++){if(Math.random()<.1){st.lost++;continue}let t=0,c=0;for(let k=0,n=2+rnd3(3);k<n;k++){const av=A(),p=av[rnd3(av.length)];if(p.cold&&!S.own.cold)continue;t+=p.price;c+=p.cost;cnt[p.id]=(cnt[p.id]||0)+1}
  if(!t){st.lost++;continue}st.served++;st.gross+=t;st.cogs+=c;if(Math.random()<share)st.memberDisc+=t*dc;else if(S.member.own&&Math.random()<RATE[S.member.disc])st.newMember++;if(Math.random()<.12)st.perfect++}
 st.total=vis+st.lost*0;if(S.own.hot){st.hot=Math.round(st.served*.12);st.hotRev=st.hot*30}if(S.own.charge)st.charge=2;st.gross+=st.hotRev+st.charge*14;
 const th=Math.random()<(S.own.cctv?.3:.5)?1:0;st.thief=th;st.caught=th&&(S.staff.guard>0||Math.random()<(S.own.gate?.85:.6))?1:0;st.best=Object.keys(cnt).sort((a,b)=>cnt[b]-cnt[a])[0]||'';st.bestN=cnt[st.best]||0;S.member.count+=st.newMember;st.rev=st.gross-st.memberDisc}
function settle(){const st=S.stat,sim=!st.served;if(sim)daySim();if(!st.best){const k=Object.keys(st.cnt).sort((a,b)=>st.cnt[b]-st.cnt[a])[0];if(k){st.best=k;st.bestN=st.cnt[k]}}
 const plat=S.eq.delivery?nt(50):0,wage=ST.reduce((a,s)=>a+(S.staff[s[0]]||0)*nt(s[4]),0),rent=360*S.lv,util=90+Math.round(st.served*1.8),net=Math.round(st.gross-st.cogs-rent-util-wage-st.memberDisc-st.err-st.waive-st.waste-st.loss+st.rebate-plat);
 S.money+=Math.round((sim?st.gross-st.memberDisc:0)-rent-util-wage-plat);if(sim)S.total+=st.gross;S.hist.push(net);const H=S.hist.slice(-7),mx=Math.max(1,...H.map(Math.abs)),rk=net<300?['C','努力的店主','#3a86ff']:net<1000?['B','小有名氣','#2db36f']:net<2500?['A','生意興隆','#ff9f1a']:['S','商業巨頭','#ff4d4d'];
 const L=(n,v,c)=>`<div class=ln style="color:${c||'var(--tx)'}"><span>${n}</span><span>${v}</span></div>`,pb=P.find(p=>p.id===st.best);
 openModal(`<div class=hd><span style="font-size:16px">第 ${S.day} 天 · 週${wk()} · 營業結束</span><span style="background:${rk[2]};color:#fff;border-radius:99px;padding:5px 12px;font-size:13px">${rk[0]} ${rk[1]}</span></div><div style="color:var(--sub);font-size:13px;font-weight:700">今日淨利潤</div><div class=big style="color:${net>=0?'#2db36f':'#d94452'}">${net>=0?'+':'−'}${f(Math.abs(net))}</div>
 <div class=dash>${L('營業額',f(st.gross))}${L('商品成本','−'+f(st.cogs),'#b4553f')}${L('房租','−'+f(rent),'#b4553f')}${L('水電','−'+f(util),'#b4553f')}${L('員工薪資','−'+f(wage),'#b4553f')}${L('找零誤差 / 會員優惠 / 抹零','−'+f(st.memberDisc+st.err+st.waive),'#b4553f')}${st.waste?L('過期報廢（'+st.wasteN+' 件）','−'+f(st.waste),'#b4553f'):''}${st.loss?L('小偷偷走的貨','−'+f(st.loss),'#b4553f'):''}${st.rebate?L('廠商即期貨折讓','+'+f(st.rebate),'#2db36f'):''}${S.eq.delivery?L('外送平台費','−'+f(plat),'#b4553f'):''}</div>
 <div class=stats><div>服務顧客<b>${st.served}/${S.visit}</b></div><div>好評率<b>${Math.min(99,Math.round(S.star*.9))}%</b></div><div>口碑<b>${st.s0}→${S.star}</b></div><div>完美找零<b>${st.perfect} 次</b></div><div>平均結帳<b>${st.by.you.n?(st.ct/st.by.you.n).toFixed(1)+' 秒':'—'}</b></div><div>缺貨<b>${st.lost} 次</b></div></div>
 <div class=sec><b class=t>收款明細</b>${(sim?L('🙋 店長（你）　'+st.served+' 位',f(st.gross-st.hotRev-st.charge*14-st.dvRev)):[['you','🙋 店長（你）'],['cashier','🧑‍💼 收銀員'],['self','🖥️ 自助結帳機'],['hot','🍢 熱食檔口']].filter(x=>st.by[x[0]].n).map(x=>L(x[1]+'　'+st.by[x[0]].n+' 位',f(st.by[x[0]].rev))).join('')||L('今天沒有結帳','—'))}</div>`+
 (S.own.hot||S.own.charge?`<div class=sec><b class=t>夜班與增值服務（已計入營業額）</b>${S.own.hot?L('🍢 熱食　'+st.hot+' 份'+(S.eq.dine?'・內用 '+st.dine+' 人':''),f(st.hotRev)):''}${S.own.charge?L('🔋 行動電源　'+st.charge+' 次',f(st.charge*14)):''}</div>`:'')+
 (S.member.own?`<div class=sec>💳 會員 ${S.member.count} 位（今天新辦 ${st.newMember} 張），會員優惠 ${f(st.memberDisc)}</div>`:'')+(pb?`<div class=sec>🔥 今日暢銷：${pb.e} ${pb.n} ${st.bestN} 件</div>`:'')+
 (st.dv?`<div class=sec>🛵 外送 ${st.dv} 單，收入 ${f(st.dvRev)}（已計入營業額）</div>`:'')+((st.clr||st.mv)?`<div class=sec>🏷️ 即期特價賣出 ${st.clr} 件（${f(st.clrRev)}）${st.mv?`・今晚 ${st.mv} 件轉進即期區，明天 ${S.clrD} 折`:''}</div>`:'')+`<div class="sec good">🚨 小偷 ${st.thief} 個：抓住 ${st.caught} 個</div>`+S.daily.map(d=>{const ok=qv(d.k)>=d.goal;return `<div class="sec ${ok?'good':''}">${ok?'✅ 每日挑戰完成':'⬜ 每日挑戰未完成'}：${d.n} ${d.goal}${d.unit}（獎勵 ${f(d.reward)}）</div>`}).join('')+
 `<div class=chart>${H.map((v,i)=>`<div style="height:${Math.max(6,Math.abs(v)/mx*100)}px;background:${v>=0?'#2db36f':'#d94452'}"><span>D${S.day-H.length+1+i}</span></div>`).join('')}</div>${sim?'<p style="font-size:11px;color:var(--sub);text-align:center;margin:-8px 0 8px">今天沒有真實交易，這是模擬結算</p>':''}<button class="btn w" data-a="next">下一天 →</button>`);fitModal()}
// ---- 各分頁 ----
// ---- 收銀流程：顧客排隊 → 掃碼 → 收款（現金找零／行動支付／刷卡）----
const CB={},SV={};let TID=0;const SH=[];
const lotSync=p=>{if(!p.life)return;const tot=p.wh+p.shelf+(p.tr||0),s=p.lots.reduce((a,l)=>a+l.q,0);if(s<tot)p.lots.push({q:tot-s,d:p.life});else if(s>tot){p.lots.sort((a,b)=>a.d-b.d);let x=s-tot;for(const l of p.lots){const m=Math.min(l.q,x);l.q-=m;x-=m;if(!x)break}}p.lots=p.lots.filter(l=>l.q>0)},
 recv=(p,q)=>{lotSync(p);p.wh+=q;if(!p.life)return;const sh=Math.random()<.25;p.lots.push({q,d:sh?rnd3(2):p.life});if(sh){SH.push(p.n);const rb=Math.round(q*p.cost*.4);S.money+=rb;S.stat.rebate+=rb}},
 shTxt=()=>{const t=SH.length?'⚠️ 即期貨：'+[...new Set(SH)].join('、')+'（退 4 成貨款）':'';SH.length=0;return t},
 back=i=>{if(i.hot){const h=hotOf(i.id);if(h)h.stock++;return}const p=pr(i.id);if(i.cl)p.clr++;else{if(p.shelf<capOf(p))p.shelf++;else p.wh++;if(p.life&&p.lots.length){p.lots.sort((a,b)=>a.d-b.d);p.lots[0].q++}}},
 clrCap=()=>S.fix.filter(x=>x==='clear').length*CCAP,clrP=p=>Math.max(1,Math.round(p.price*DISC[S.clrD].pr)),
 fresh=p=>{if(!p.life)return '';lotSync(p);if(!p.lots.length)return '';const m=Math.min(...p.lots.map(l=>l.d));if(m<=0){const n=p.lots.filter(l=>l.d<=0).reduce((a,l)=>a+l.q,0);return ` · <span style="color:#d94452">⚠️ 今天即期 ${n} 件</span>`}return ` · <span style="color:${m<=1?'#d94452':'var(--sub)'}">🕒 ${m} 天後即期</span>`};
const NEED={milk:'cold',yogurt:'cold',beer:'cold',egg:'cold',apple:'produce',banana:'produce',tomato:'produce',strawberry:'produce',icecream:'freezer',dumpling:'freezer'},need=p=>NEED[p.id]||'shelf',hasFx=p=>p.sls.length>0,
 inc=p=>S.orders.filter(o=>o.id===p.id).reduce((a,o)=>a+o.q,0),
 fc=p=>{const d=S.days.slice(-5),n=d.length,V=d.reduce((a,x)=>a+x.v,0),C=d.reduce((a,x)=>a+(x.cnt[p.id]||0),0),pri=2.25/Math.max(1,A().length),w=Math.min(n,3)/3;return((V?C/V:pri)*w+pri*(1-w))*S.expect},
 plan=(p,mid)=>{if(!hasFx(p)||(p.cold&&!S.own.cold))return 0;const r=mid?(1320-S.min)/840:1;if(mid&&r<.12)return 0;const k=p.life?(mid?1.05:1.1):(mid?1.15:1.25),base=fc(p)*r*k-(p.wh+p.shelf+inc(p)),refill=capOf(p)*(p.life?.6:1)-(p.wh+inc(p)),need=Math.max(base,r>=1||!mid?refill:refill*r);return need>0?Math.max(0,Math.ceil((need-(p.life?p.pack*.3:0))/p.pack)):0};
function putOrder(p,boxes,inst){const q=boxes*p.pack,c=boxes*p.cost*p.pack;if(boxes<1||c>S.money||used(p.cold)+q>(p.cold?S.coldCap:S.ambCap))return 0;S.money-=c;if(inst)recv(p,q);else S.orders.push({id:p.id,q,eta:S.min+30});return c}
function autoBuy(mid){let n=0,c=0;A().forEach(p=>{if(p.cold&&!S.own.cold)return;const x=putOrder(p,plan(p,mid),!mid);if(x){n++;c+=x}});
 if(S.own.hot)HOT.forEach(h=>{const avg=h.hist.length?h.hist.reduce((a,b)=>a+b,0)/h.hist.length:8,r=mid?(1320-S.min)/840:1,need=avg*1.15*r-h.stock;if(need>0&&!(mid&&r<.15)){const bx=Math.ceil(need/h.batch),cc=bx*h.bcost;if(cc<=S.money){S.money-=cc;h.stock+=bx*h.batch;n++;c+=cc}}});return{n,c}}
function fxView(){return S.fxd.map((x,i)=>({t:x.t,pi:x.pi,rot:x.rot,dx:x.dx,dz:x.dz,label:x.t==='shelf'?fxName(x):TNAME[x.t],pids:x.s.map(sl=>sl?sl.pid:null),keys:x.s.map((sl,k)=>sl?i+':'+k:null)}))}
function syncStore(){const id=S.cur?S.cur.id:0;if(syncStore.id!==id){syncStore.id=id;store.setTill(id);store.setBelt(S.cur?S.cur.items.map(i=>i.id):[])}
 {const fv=JSON.stringify(fxView());if(syncStore.fv!==fv){syncStore.fv=fv;store.setFixtures(JSON.parse(fv));syncStore.sg=null}}
 {const sg=A().map(p=>p.shelf+':'+p.clr).join(',')+S.fxd.map(x=>x.s.map(sl=>sl?sl.q:'-').join('.')).join(',')+'|'+S.fix.join()+'|'+S.fxd.map(x=>x.cl).join();if(syncStore.sg!==sg){syncStore.sg=sg;const m={};S.fxd.forEach((x,i)=>x.s.forEach((sl,k)=>{if(sl)m[i+':'+k]=Math.min(1,sl.q/slotCap(x))}));m._clear=clrCap()?Math.min(1,P.reduce((a,p)=>a+p.clr,0)/clrCap()):0;store.setStock(m)}}}
// 自動把還沒上架的商品擺進空格（玩家主動下架的不會再自動擺）
function placeAt(p,x,i){const sl={pid:p.id,q:p._init||0,fx:x};p._init=0;x.s[i]=sl;p.sls.push(sl);p.off=false}
function unplaceSlot(sl){const p=pr(sl.pid);p.wh+=sl.q;sl.q=0;const x=sl.fx,i=x.s.indexOf(sl);if(i>=0)x.s[i]=null;p.sls=p.sls.filter(y=>y!==sl)}
function autoPlace(){A().forEach(p=>{if(p.sls.length||p.off)return;const ty=need(p),c=S.fxd.filter(x=>x.t===ty&&x.s.some(q=>!q)).sort((a,b)=>a.s.filter(Boolean).length-b.s.filter(Boolean).length)[0];if(c)placeAt(p,c,c.s.findIndex(q=>!q))})}
// 理貨員的工作：挑最缺的商品，到倉庫搬貨回來補（貨在搬的時候先從倉庫扣掉）
function stockJob(){if(S.phase==='closed')return null;const busy=new Set(S.jobs.map(j=>j.sl));let best=null,bf=2;
 A().forEach(p=>{if(!p.wh)return;p.sls.forEach(sl=>{if(busy.has(sl))return;const cp=slotCap(sl.fx);if(cp-sl.q<Math.min(3,cp))return;const fr=sl.q/cp;if(fr<bf){bf=fr;best={p,sl,cp}}})});
 if(!best)return null;const{p,sl,cp}=best,j={pid:p.id,sl,q:Math.min(cp-sl.q,p.wh),fi:S.fxd.indexOf(sl.fx),cold:p.cold,got:0};S.jobs.push(j);return j}
function jobPick(j){const p=pr(j.pid),m=Math.min(j.q,p.wh);p.wh-=m;j.got=m;p.tr=(p.tr||0)+m}
function jobDrop(j){const p=pr(j.pid),ok=j.sl.fx.s.includes(j.sl),add=ok?Math.min(j.got,Math.max(0,slotCap(j.sl.fx)-j.sl.q)):0;p.tr=Math.max(0,(p.tr||0)-j.got);j.sl.q+=add;p.wh+=j.got-add;j.got=0;S.jobs=S.jobs.filter(x=>x!==j);if(S.tab==='shelf'||S.tab==='wh')render()}
function jobCancel(j,picked){const p=pr(j.pid);if(picked&&j.got){p.wh+=j.got;p.tr=Math.max(0,(p.tr||0)-j.got);j.got=0}S.jobs=S.jobs.filter(x=>x!==j)}
function buyerDone(){S.buyerBusy=false;if(S.phase==='open'){const r=autoBuy(true);if(r.n)toast('🧑\u200d💻 採購員下單 '+r.n+' 種商品')}}
// ---- 外送：平台訂單，要揀貨包貨，司機才會來取 ----
const DL=240,dRev=o=>o.items.reduce((a,i)=>a+pr(i.id).price*i.q,0)+o.fee,dTxt=o=>o.items.map(i=>pr(i.id).n+' ×'+i.q).join('、'),dReady=()=>S.dord.filter(o=>o.st==='ready').length;
function newDeliveryOrder(){const av=A().filter(p=>p.sls.length&&(!p.cold||S.own.cold));if(!av.length)return;const m={};for(let k=0,n=1+rnd3(3);k<n;k++){const p=av[rnd3(av.length)];m[p.id]=(m[p.id]||0)+1+(Math.random()<.3?1:0)}
 S.dord.push({id:++S.dseq,items:Object.entries(m).map(([id,q])=>({id,q})),fee:nt(5),st:'new',dl:S.min+DL});toast('🛵 外送新訂單！');S.ddirty=true}
function dPick(o,auto){const bad=o.items.find(i=>pr(i.id).shelf<i.q);if(bad){if(!auto)toast(pr(bad.id).n+' 貨架不夠，先補貨',1);return false}
 o.items.forEach(i=>{const p=pr(i.id);p.shelf-=i.q;lotSync(p)});o.cost=o.items.reduce((a,i)=>a+pr(i.id).cost*i.q,0);o.rev=dRev(o);o.picked=true;o.st='packing';o.doneAt=performance.now()+(auto?7000:2500);S.ddirty=true;return true}
function dDone(o){S.money+=o.rev;S.total+=o.rev;const st=S.stat;st.gross+=o.rev;st.cogs+=o.cost;st.dv++;st.dvRev+=o.rev;toast('🛵 外送完成 +'+f(o.rev))}
function dCancel(o,pen){if(o.picked)o.items.forEach(i=>{const p=pr(i.id),m=Math.min(i.q,Math.max(0,capOf(p)-p.shelf));p.shelf+=m;p.wh+=i.q-m});S.stat.lost++;if(pen){S.star=Math.max(0,S.star-1);toast('外送訂單逾時取消　⭐-1',1)}}
function driverPicked(oid){const o=S.dord.find(q=>q.id===oid);if(!o)return;dDone(o);S.dord=S.dord.filter(q=>q!==o);store.setBags(dReady());S.ddirty=true;hud()}
function closeDelivery(){S.dord.forEach(o=>{if(o.st==='ready')dDone(o);else dCancel(o,false)});S.dord=[];store.setBags(0);S.dOpen=false}
function dTick(){let rf=false;const now=performance.now(),pk=S.staff.packer||0;
 if(pk&&S.dord.filter(o=>o.st==='packing'&&o.auto).length<pk){const o=S.dord.find(q=>q.st==='new');if(o&&dPick(o,true)){o.auto=true;rf=true}}
 S.dord.forEach(o=>{if(o.st==='packing'&&now>=o.doneAt){o.st='ready';o.drvAt=now+(5+Math.random()*7)*1000;store.setBags(dReady());S.ddirty=true}if(o.st==='ready'&&!o.called&&now>=o.drvAt){o.called=true;store.callDriver(o.id)}});
 const ex=S.dord.filter(o=>o.st!=='ready'&&S.min>=o.dl);if(ex.length){ex.forEach(o=>dCancel(o,true));S.dord=S.dord.filter(o=>!ex.includes(o));S.ddirty=true;rf=true}
 if(S.ddirty){S.ddirty=false;hud();if(S.tab==='dlv')rf=true}return rf}
function rDlv(){const pk=(S.staff.packer||0)>0,st=S.stat,nw=S.dord.filter(o=>o.st==='new').length,bg=S.dord.length-nw;
 return `<div class=hd><span>外送訂單</span><small>${pk?'打包員會自動揀貨包貨':'沒僱打包員，要你親自配貨裝袋'}</small></div><div class=stats style="grid-template-columns:repeat(4,1fr)"><div>待配貨<b>${nw}</b></div><div>已裝袋<b>${bg}</b></div><div>今日送出<b>${st.dv}</b></div><div>外送收入<b>${f(st.dvRev)}</b></div></div><p style="color:var(--sub);font-size:13px;font-weight:700;margin:0 0 10px">包好放到門口取貨處，平台司機就會來取；超過 4 小時沒處理，訂單會取消、口碑 −1。</p>`+
 (S.dord.length?S.dord.map(o=>`<div class=card style="display:block"><div style="display:flex;justify-content:space-between;font-weight:900"><span>#${o.id} ${dTxt(o)}</span><span style="color:#2db36f">${f(dRev(o))}</span></div><div class=pb style="height:8px;margin:8px 0"><i style="width:${Math.max(0,Math.min(100,(o.dl-S.min)/DL*100))}%;background:${o.dl-S.min<60?'#d94452':'var(--grn)'}"></i></div><div style="display:flex;justify-content:space-between;align-items:center"><small style="color:var(--sub);font-weight:700">${o.st==='new'?'等你揀貨':o.st==='packing'?'包貨中…':'已包好，等司機取貨'}</small>${o.st==='new'?btn('dpick',o.id,'揀貨包貨','sm'):o.st==='packing'?'<span class="sm off">包貨中…</span>':'<span class="sm ok">等司機</span>'}</div></div>`).join(''):'<div class=hint>暫時沒有外送訂單</div>')}
const carts={};
// ---- 小偷：拿了貨不排隊就跑。玩家點頭上紅按鈕、保全追上去、防盜門攔下，都會把貨放回去 ----
function addHot(c){let wd=false;if(S.own.hot&&Math.random()<.38+(S.eq.dine?.17:0)){const h=pickHot();if(h){h.stock--;c.items.push({id:h.id,s:false,pr:h.price,hot:1});c.sum+=h.price;c.cogs+=h.cost;wd=!!S.eq.dine&&store.seatsFree()>0&&Math.random()<.75;if(Math.random()<.2){const h2=pickHot();if(h2){h2.stock--;c.items.push({id:h2.id,s:false,pr:h2.price,hot:1});c.sum+=h2.price;c.cogs+=h2.cost}}}}return wd}
// 超過同屏上限的顧客不畫出來，但照樣進店、逛貨架、結帳，營收不受影響
function virtualVisit(hot){const cn=Math.min(S.staff.cashier||0,SPEC(S.lv).reg-1),sn=S.eq.self?SPEC(S.lv).self:0,who=cn>0?'cashier':sn>0?'self':S.tab==='cash'?'you':null;S.visit++;
 if(!who){S.stat.lost++;return}
 if(hot){hotBuy(0,true);return}
 const cid=++TID;carts[cid]={items:[],sum:0,cogs:0};stopsFor().forEach(fi=>take(cid,fi));const c=carts[cid];delete carts[cid];if(!c.items.length){S.stat.lost++;return}
 addHot(c);const mem=S.member.own&&Math.random()<Math.min(.6,S.member.count/200),total=mem?Math.round(c.sum*S.member.disc/100):c.sum;
 done({items:c.items,sum:c.sum,total,cogs:c.cogs,mem,pm:'qr',id:cid,pat:1},{auto:1,who,perfect:0})}
function hotBuy(cid,virt){const h=pickHot(),st=S.stat;if(!h){if(!HOT.some(x=>x.stock>0))st.lost++;return 0}
 h.stock--;h.sold++;h.rev+=h.price;S.money+=h.price;S.total+=h.price;st.gross+=h.price;st.cogs+=h.cost;st.hot++;st.hotRev+=h.price;st.by.hot.n++;st.by.hot.rev+=h.price;
 const dn=!virt&&!!S.eq.dine&&store.seatsFree()>0&&Math.random()<.8;if(dn)st.dine++;hud();return dn?2:1}
function thiefBack(cid,by){const c=carts[cid];if(!c)return;c.items.forEach(back);delete carts[cid];S.stat.caught++;store.thiefCaught(cid);
 toast(by==='guard'?'🚔 保全抓住了小偷，東西都放回去了':by==='gate'?'🚪 防盜門響了，小偷被攔下，東西放回去了':'👆 抓住小偷了！東西放回去了');hud();if(S.tab==='shelf'||S.tab==='wh')render()}
function thiefEv(cid,ev){const c=carts[cid];
 if(ev==='alert'){if(!c||!c.items.length)return false;if(!c.seen){c.seen=1;S.stat.thief++}return true}
 if(ev==='door'){if(c&&S.eq.gate&&Math.random()<.7)thiefBack(cid,'gate');return}
 if(ev==='guard'){if(c)thiefBack(cid,'guard');return}
 if(ev==='escape'){if(!c)return;S.stat.loss+=c.cogs;delete carts[cid];S.star=Math.max(0,S.star-1);toast('小偷跑掉了！損失 '+f(c.sum)+'　⭐-1',1);hud()}}
function stopsFor(){const ix=S.fxd.map((x,i)=>x.t==='clear'||!x.s.some(sl=>sl&&sl.q>0)?-1:i).filter(i=>i>=0).sort(()=>Math.random()-.5),s=ix.slice(0,Math.min(ix.length,1+rnd3(3))),cx=S.fxd.map((x,i)=>x.t==='clear'?i:-1).filter(i=>i>=0);
 if(s.length&&cx.length&&A().some(p=>p.clr>0)&&Math.random()<DISC[S.clrD].visit)s.splice(rnd3(s.length+1),0,cx[rnd3(cx.length)]);return s}
function take(cid,fi){const c=carts[cid],fx=S.fxd[fi];if(!c||!fx)return;const cl=fx.t==='clear',dz=DISC[S.clrD].more,n=c.thief?1+rnd3(2):cl?1+(Math.random()<dz?1:0)+(Math.random()<dz/2?1:0):1+(Math.random()<.4?1:0)+(S.eq.cart&&Math.random()<.5?1:0);
 for(let k=0;k<n&&c.items.length<5;k++){const ok=cl?A().filter(p=>p.clr>0):fx.s.filter(sl=>sl&&sl.q>0&&(!pr(sl.pid).cold||S.own.cold));if(!ok.length)break;const pk=ok[rnd3(ok.length)],p=cl?pk:pr(pk.pid),pp=cl?clrP(p):p.price;if(!cl&&p.price>p.mkt*1.2&&Math.random()<.5)continue;if(cl)p.clr--;else{pk.q--;lotSync(p)}c.items.push({id:p.id,s:false,pr:pp,cl:cl?1:0});c.sum+=pp;c.cogs+=p.cost}}
const LCAP=3,KCAP=2,HCAP=6;
const activeLanes=()=>{const cn=Math.min(S.staff.cashier||0,SPEC(S.lv).reg-1),sn=S.eq.self?SPEC(S.lv).self:0,a=[];if(S.tab==='cash')a.push('c0');for(let i=1;i<=cn;i++)a.push('c'+i);for(let k=0;k<sn;k++)a.push('k'+k);return a},
 laneN=k=>S.queue.filter(t=>t.lane===k).length+(S.cur&&S.cur.lane===k?1:0),laneCap=k=>k==='hold'?HCAP:k[0]==='k'?KCAP:LCAP;
function pickLane(){const act=activeLanes();let best=null,bc=1e9;act.forEach(k=>{const n=laneN(k);if(n>=laneCap(k))return;const c=(n+.5)*(k[0]==='k'?1.6:k==='c0'?1.2:1);if(c<bc){bc=c;best=k}});return best||(act.length?null:laneN('hold')<HCAP?'hold':null)}
function rebalance(){const act=activeLanes();let ch=false;S.queue.slice().forEach(t=>{if(t.srv)return;const bad=t.lane==='hold'?act.length>0:!act.includes(t.lane);if(!bad)return;const old=t.lane;t.lane=null;const k=pickLane();if(!k){t.lane=old;return}t.lane=k;if(k!==old){S.queue=S.queue.filter(x=>x!==t);S.queue.push(t);store.moveCust(t.id,k);ch=true}});return ch}
function arrive(cid){const c=carts[cid];delete carts[cid];if(!c||!c.items.length){S.stat.lost++;return false}
 const lane=pickLane();if(!lane){c.items.forEach(back);S.stat.lost++;return false}
 const wantDine=addHot(c);
 const sum=c.sum,mem=S.member.own&&Math.random()<Math.min(.6,S.member.count/200),total=mem?Math.round(sum*S.member.disc/100):sum,r=Math.random(),pm=r<.5?'cash':r<.8?'qr':'card',
 t={items:c.items,sum,total,cogs:c.cogs,mem,pm,pat:1,ph:'scan',chg:[],cs:null,id:cid,who:['上班族','學生','阿嬤','大叔','媽媽'][rnd3(5)]};
 if(pm==='cash'){const o=[...new Set([total,Math.ceil(total/10)*10,Math.ceil(total/50)*50,Math.ceil(total/100)*100,500,1000])].filter(x=>x>=total);t.given=o[rnd3(o.length)];t.due=t.given-total;if(total%10>0&&Math.random()<.22){t.ask='pending';t.askAmt=total%10}}
 t.lane=lane;t.dine=wantDine;S.queue.push(t);S.dirty=true;return lane}
function lose(t,pen){t.items.forEach(back);S.stat.lost++;if(pen)S.star=Math.max(0,S.star-1);
 S.queue=S.queue.filter(x=>x!==t);if(S.cur===t)S.cur=null;store.leave(t.id);if(pen)toast('顧客等不及走了　⭐-1',1)}
function pull(){if(S.tab==='cash'&&!S.cur){const i=S.queue.findIndex(t=>t.lane==='c0'&&!t.srv);if(i>=0){S.cur=S.queue.splice(i,1)[0];S.cur.t0=performance.now();S.kb=''}}}
function done(t,o){const st=S.stat,err=o.err||0,pf=o.perfect&&t.pm==='cash';
 st.served++;st.gross+=t.sum;st.memberDisc+=t.sum-t.total-(t.waive||0);st.waive+=t.waive||0;st.cogs+=t.cogs;st.err+=err;{const w=o.auto?o.who:'you',b=st.by[w];b.n++;b.rev+=t.total-err;if(!o.auto)st.ct+=(performance.now()-(t.t0||performance.now()))/1000}t.items.forEach(i=>{if(i.hot){const h=hotOf(i.id);st.hot++;st.hotRev+=i.pr;if(h){h.sold++;h.rev+=i.pr}}else if(i.cl){st.clr++;st.clrRev+=i.pr}else st.cnt[i.id]=(st.cnt[i.id]||0)+1});
 S.money+=t.total-err;S.total+=t.total-err;S.queue=S.queue.filter(x=>x!==t);if(S.cur===t)S.cur=null;if(store.leave(t.id,t.dine))st.dine++;
 if(pf){st.perfect++;S.star++}
 if(S.member.own&&!t.mem&&Math.random()<RATE[S.member.disc]){st.newMember++;S.member.count++}
 if(!o.auto){toast('收款成功 +'+f(t.total-err)+(pf?'　完美找零！':''));S.kb='';pull()}
 hud()}
function dropAll(){Object.values(SV).forEach(x=>done(x.t,{auto:1,who:x.who,perfect:0}));Object.keys(SV).forEach(k=>delete SV[k]);[S.cur,...S.queue].filter(Boolean).forEach(t=>lose(t,0));S.cur=null;S.queue=[];syncStore()}
function tickCash(dt){let ch=false;
 if(S.dirty){S.dirty=false;ch=true}
 if(rebalance())ch=true;const hold=S.queue.some(t=>t.lane==='hold'),dec=dt/(45*(1+(S.eq.ac?.35:0)));[S.cur,...S.queue].forEach(t=>{if(t&&!t.cs&&!t.srv&&t.lane!=='hold')t.pat-=dec});
 if(hold&&performance.now()>(tickCash.hn||0)){tickCash.hn=performance.now()+20000;toast('沒有人收銀，顧客在入口等（到「收銀」頁自己收，或僱收銀員／裝自助機）',1)}
 {const rd=!!S.cur&&store.tillReady();if(rd!==tickCash.rd){tickCash.rd=rd;ch=true}}
 [S.cur,...S.queue].filter(t=>t&&!t.srv&&t.pat<=0).forEach(t=>{lose(t,1);ch=true});
 const now=performance.now(),act=activeLanes().filter(k=>k!=='c0');
 act.forEach(k=>{const sv=SV[k],ck=k[0]==='c';
  if(sv){if(!sv.end){if(store.laneReady(sv.t.id))sv.end=now+sv.dur*1000}else if(now>=sv.end){delete SV[k];CB[k]=now+500;done(sv.t,{auto:1,who:sv.who,perfect:ck?1:0});ch=true}}
  else if(now>=(CB[k]||0)){const t=S.queue.find(x=>x.lane===k&&!x.srv);if(t){t.srv=true;const dur=ck?4+Math.random()*3:7+Math.random()*4;SV[k]={t,who:ck?'cashier':'self',dur,end:0};if(ck)store.serveBelt(t.id,t.items.map(i=>i.id),dur);ch=true}}});
 Object.keys(SV).forEach(k=>{if(!act.includes(k)){const sv=SV[k];delete SV[k];done(sv.t,{auto:1,who:sv.who,perfect:0});ch=true}});
 if(!S.cur&&S.tab==='cash'){pull();if(S.cur)ch=true}
 let rf=dTick();
 if(ch){hud();if(S.tab==='cash')render()}if(rf&&(S.tab==='shelf'||S.tab==='wh'||S.tab==='dlv'))render();
 syncStore();const e=$('pat');if(e&&S.cur)e.style.width=Math.max(0,S.cur.pat*100)+'%'}
const PML={cash:'💵 現金',qr:'📱 行動支付',card:'💳 刷卡'},PK='style="background:#fde9e6;color:#c8352b"';
function rCash(){const t=S.cur;
 if(!t)return `<div class=c><div style="font-size:40px">🧾</div><b>${S.phase==='open'?'暫時沒人排隊':S.phase==='prep'?'還沒開門':'已打烊'}</b><p>${S.phase==='open'?'可以去補貨、調價～顧客結帳時會自動排過來':'開門營業後，顧客會來這裡排隊結帳'}</p></div>`;
 const sc=t.items.filter(i=>i.s),sum=sc.reduce((a,i)=>a+i.pr,0),scan=t.ph==='scan',left=t.items.length-sc.length,
 lines=Object.values(sc.reduce((m,i)=>{const k=i.id+(i.cl?'c':'');(m[k]=m[k]||{id:i.id,cl:i.cl,pr:i.pr,n:0}).n++;return m},{})).map(o=>nmOf(o.id)+(o.cl?'（即期）':'')+' ×'+o.n+'　'+f(o.pr*o.n)).join('<br>')||'<span style="opacity:.6">點輸送帶上的商品掃碼</span>',
 head=`<div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;margin-bottom:6px"><b style="font-size:17px">${t.who}</b>${S.member.own&&t.mem?'<span class=pill style="background:#ffe08a;font-size:12px;padding:3px 9px">💳 會員</span>':''}<span style="font-size:13px;font-weight:800;color:var(--sub)">${PML[t.pm]}</span><span style="flex:1"></span><span style="font-size:12px;color:var(--sub);font-weight:800">排隊 <b style="color:#ff5a4e;font-size:16px">${S.queue.length}</b> 人</span><button class=sm ${PK} data-a="quick" data-v="x">一鍵結算</button>${t.cs?'':`<button class=sm ${PK} data-a="leave" data-v="x">請他離開</button>`}</div><div class=pb style="height:10px;margin:0 0 10px"><i id=pat style="width:${Math.max(0,t.pat*100)}%"></i></div>`,
 rc=`<div class=rc><div class=l>${lines}${!scan&&t.mem?`<br>會員價 ${S.member.disc/10} 折`:''}${!scan&&t.waive?`<br>抹零　−${f(t.waive)}`:''}</div><div class=r><small>${scan?'已掃 '+sc.length+'/'+t.items.length:'應收'}</small><b>${f(scan?sum:t.total)}</b></div></div>`;
 if(!store.tillReady())return `<div class=cashc>${head}<div class=hint>🚶 顧客走向櫃台中…</div></div>`;
 let body;
 if(scan)body=(S.eq.scan?btn('scanall','x',`⚡ 一鍵掃碼（剩 ${left} 件）`,'btn w'):'')+`<div style="text-align:center;color:var(--sub);font-weight:800;font-size:13px;margin-top:8px">${S.eq.scan?'也可以':'請'}點輸送帶上的商品逐個掃</div>`;
 else if(t.pm==='cash'){const got=t.chg.reduce((a,b)=>a+b,0);
  body=(t.ask==='pending'?`<div class=hint style="margin-bottom:6px">💬 「老闆，零頭 ${f(t.askAmt)} 算我便宜一點啦～」<div class=acts style="margin-top:6px">${btn('waive','y','好啊，抹零','btn')}${btn('waive','n','不行，照算','btn g')}</div></div>`:'')+`<div class=info><div>顧客付<b>${f(t.given)}</b></div><div>應找<b style="color:#ff5a4e">${f(t.due)}</b></div><div>已找<b style="color:#3a6bc4">${f(got)}</b></div></div>`+(t.due?`${t.chg.length?`<div class=tags style="margin:0 0 8px">${t.chg.map(x=>`<span>$${x}</span>`).join('')}</div>`:''}<div class=bills>${DEN.map(d=>`<button class=b style="background:${d[1]}" data-a="bill" data-v="${d[0]}">$${d[0]}</button>`).join('')}</div>`:'<div class=hint>剛好，不用找錢</div>')+(S.eq.change&&t.due?btn('autochg','x','🪙 自動找零','btn w')+'<div style="height:8px"></div>':'')+`<div class=acts>${btn('undo','x','復原','btn g')}${btn('clr','x','清空','btn g')}${btn('cashok','x','確認找零','btn')}</div>`}
 else if(t.pm==='qr'){t.qr=t.qr||Array.from({length:81},()=>Math.random()<.5);body=`<div class=qrw><div class=qr>${t.qr.map(b=>`<i style="background:${b?'#111':'#fff'}"></i>`).join('')}</div><div style="flex:1"><b>顧客出示了付款碼</b><br><br>${btn('qrok','x','📷 掃碼收款','btn w')}</div></div>`}
 else body=t.cs?`<div class=lcd style="font-size:17px">${t.cs==='pin'?'顧客輸入密碼中…':'交易成功，列印簽單中…'}</div>`:`<div class=lcd>NT$ ${S.kb||'<span style="opacity:.5;font-size:15px">輸入應收金額</span>'}</div><div style="display:flex;gap:8px"><div class=kp style="flex:3">${['1','2','3','4','5','6','7','8','9','C','0','<'].map(k=>`<button class=b data-a="kp" data-v="${k}">${k==='<'?'⌫':k}</button>`).join('')}</div><div style="flex:1;display:flex;flex-direction:column;gap:8px">${S.eq.pos?'<button class=btn style="flex:1;padding:6px;background:linear-gradient(#5aa8ff,#3a86ff);box-shadow:0 4px 0 #2a63c4" data-a="posfill" data-v="x">帶出金額</button>':''}<button class=btn style="flex:1;padding:6px" data-a="cardok" data-v="x">確認收款</button></div></div>`;
 return `<div class=cashc>${head}${rc}${body}</div>`}
const FIXT={shelf:{n:'貨架',price:300,lv:1,d:'常溫商品：飲料、零食、日用品'},cold:{n:'冷藏櫃',price:800,lv:2,d:'冷藏商品：乳品、啤酒、果汁・電費 $5/天'},produce:{n:'蔬果台',price:500,lv:2,d:'生鮮蔬果'},clear:{n:'即期特價區',price:400,lv:2,d:'即期貨打折賣（3／5／7 折），少報廢'},freezer:{n:'冷凍櫃',price:1200,lv:3,d:'冷凍商品：冰淇淋、速凍食品・電費 $8/天'}};
const TNAME={shelf:'常溫貨架',cold:'冷藏櫃',produce:'蔬果台',freezer:'冷凍櫃',clear:'即期特價區'},TICO={shelf:'🗄️',cold:'🧊',produce:'🥬',freezer:'❄️',clear:'🏷️'},
 fxName=x=>x.t==='shelf'?(x.s.filter(Boolean).slice(0,2).map(sl=>pr(sl.pid).n).join('·')||'貨架'):TNAME[x.t],capCost=x=>Math.round(FIXT[x.t].price*.6*x.cl/10)*10;
function showPick(fi,k){const x=S.fxd[fi],cur=x.s[k],cand=A().filter(p=>need(p)===x.t);
 openModal(`<button class=x data-a="mclose">✕</button><div class=bt>${cur?'換商品':'擺商品'}</div>`+(cur?`<div class=card><div class=nm>${pr(cur.pid).n}<small>目前這格（貨架上 ${cur.q} 件會退回倉庫）</small></div>${btn('unp',fi+'|'+k,'下架','sm g')}</div>`:'')+(cand.length?cand.map(p=>`<div class=card><span class=ic>${ico(p)}</span><div class=nm>${p.n}<small>倉庫 ${p.wh} · 售價 ${f(p.price)}</small></div>${btn('put',fi+'|'+k+'|'+p.id,'擺上去','sm')}</div>`).join(''):'<div class=hint>沒有可以擺的商品了（其他格已擺滿，或還沒解鎖）</div>'))}
const clrSec=()=>{const has=S.fix.includes('clear'),ps=A().filter(p=>p.clr>0),soon=A().filter(p=>p.life&&p.wh+p.shelf>0&&(lotSync(p),p.lots.some(l=>l.d<=1)));
 return `<div class=hd style="font-size:14px;margin-top:12px"><span>🏷️ 即期特價區 ×${S.fix.filter(x=>x==='clear').length}</span><small>${has?'容量 '+ps.reduce((a,p)=>a+p.clr,0)+'/'+clrCap():'未購買'}</small></div>`+(has?`<div class=chips>${[7,5,3].map(d=>btn('cdisc',d,d+' 折','chip'+(S.clrD===d?' on':''))).join('')}</div><div style="font-size:12px;color:var(--sub);font-weight:600;margin:-4px 0 8px">折扣越低越好賣，但 3、5 折可能低於進價會虧；賣不完打烊就報廢</div>`+(ps.length?ps.map(p=>`<div class=row><span class=ic>${ico(p)}</span><div class=nm>${p.n}<small>即期 ${p.clr} 件 · 特價 ${f(clrP(p))}（${S.clrD} 折）· 進價 ${f(p.cost)}</small></div></div>`).join(''):'<div class=hint>目前沒有即期貨。打烊時還沒賣完的即期貨會自動搬進來，隔天打折賣</div>'):'<div class=hint>還沒有即期特價區：打烊時沒賣完的即期貨只能直接報廢（到「擴店」購買）</div>')+(soon.length?`<div class=hint>⏳ 快即期：${soon.map(p=>p.n).join('、')}（要在即期當天賣掉，賣不完打烊轉進即期區）</div>`:'')};
function expire(){const st=S.stat;let left=clrCap();
 P.forEach(p=>{if(p.clr>0){st.waste+=p.clr*p.cost;st.wasteN+=p.clr;p.clr=0}});
 P.forEach(p=>{if(!p.life)return;lotSync(p);p.lots.sort((a,b)=>a.d-b.d);let mv=0,lost=0;
  p.lots.forEach(l=>{if(l.d<=0){const m=Math.min(left,l.q);left-=m;mv+=m;lost+=l.q-m;l.q=0}else l.d--});
  p.lots=p.lots.filter(l=>l.q>0);const out=mv+lost,s=Math.min(out,p.shelf);p.shelf-=s;p.wh-=out-s;p.clr+=mv;st.mv+=mv;if(lost>0){st.waste+=lost*p.cost;st.wasteN+=lost}})}
function slotRow(x,fi,k){const sl=x.s[k];if(!sl)return `<div class=row style="padding:7px 10px;margin-bottom:6px"><span class=ic style="opacity:.4;font-size:22px">＋</span><div class=nm style="font-size:14px">空格<small>還沒擺商品，什麼都能擺</small></div>${btn('pick',fi+'|'+k,'擺商品','sm xs')}</div>`;
 const p=pr(sl.pid),cp=slotCap(x);return `<div class=row style="padding:7px 10px;margin-bottom:6px;gap:8px"><span class=ic style="font-size:22px;width:34px">${ico(p)}</span><div class=nm style="font-size:14px">${p.n}${p.cold?' ❄️':''} <span style="color:var(--sub);font-size:12px">${f(p.price)}</span><small style="margin-top:1px">貨架 ${sl.q}/${cp} · 倉庫 ${p.wh}${fresh(p)}</small><div class=bar style="margin-top:3px;height:6px"><i style="width:${sl.q/cp*100}%;background:${sl.q<=2?'#d94452':'#2db36f'}"></i></div></div><div style="display:flex;gap:5px;flex:none"><button class="sm g xs" data-hold="${fi}|${k}">按住補</button>${btn('rs',fi+'|'+k,sl.q>=cp?'滿':'補滿',sl.q>=cp||!p.wh?'sm off xs':'sm xs')}${btn('pick',fi+'|'+k,'換','sm g xs')}</div></div>`}
function rShelf(){
 if(S.sel>=S.fxd.length)S.sel=-1;
 if(S.sel>=0){const fi=S.sel,x=S.fxd[fi];
  return `<div style="display:flex;align-items:center;gap:6px;margin-bottom:6px">${btn('sel','-1','☰','sm g xs')}${btn('selm',-1,'‹','sm g xs')}<div style="flex:1;text-align:center;line-height:1.2"><b style="font-size:16px"><span style="color:#ff5a4e">#${fi+1}</span> ${TICO[x.t]} ${fxName(x)}</b><br><small style="color:var(--sub);font-weight:800">${fi+1}/${S.fxd.length}${x.t==='clear'?'':' · 容量 Lv'+x.cl}</small></div>${btn('selm',1,'›','sm g xs')}</div>`+
  `<div style="display:flex;gap:5px;margin-bottom:6px">${x.t==='clear'?'':btn('fall',fi,'整架補滿','sm xs')+btn('fcap',fi,x.cl>=3?'容量已滿':'擴充 '+f(capCost(x)),'sm g xs')}${btn('frot',fi,'⟳ 轉向','sm g xs')}${btn('fsell',fi,'賣掉 '+f(FIXT[x.t].price/2),'sm g xs')}</div>`+
  `<div style="display:flex;align-items:center;gap:5px;margin-bottom:8px"><b style="font-size:12px;color:var(--sub);margin-right:auto">微調位置（每次 0.25 米）</b>${btn('fnud',fi+'|-.25|0','◀','sm g xs')}${btn('fnud',fi+'|0|-.25','▲','sm g xs')}${btn('fnud',fi+'|0|.25','▼','sm g xs')}${btn('fnud',fi+'|.25|0','▶','sm g xs')}</div>`+
  (x.t==='clear'?clrSec():[0,1,2].map(k=>slotRow(x,fi,k)).join(''))}
 const un=A().filter(p=>!p.sls.length),low=A().filter(p=>p.sls.length&&p.shelf<=2);
 return `<div class=hd><span>貨架管理</span><small>貨架位 ${S.fxd.length}/${SPEC(S.lv).shelf}</small></div>`+(low.length?`<div class=hint>⚠️ 快賣完了：${low.map(p=>p.n).join('、')}</div>`:'<div class=hint>👍 所有貨架都挺滿的</div>')+(un.length?`<div class=hint style="border-color:#d94452">📦 還沒上架：${un.map(p=>p.n).join('、')}<br><small>點貨架的空格擺上去；缺對應貨架到「擴店」買</small></div>`:'')+btn('rsall','x','🗄️ 一鍵補滿全部貨架','btn w')+
  `<div style="height:10px"></div>`+S.fxd.map((x,i)=>`<div class=card data-a="sel" data-v="${i}" style="cursor:pointer;display:block"><div style="display:flex;justify-content:space-between;font-weight:900;font-size:15px"><span>#${i+1} ${TICO[x.t]} ${fxName(x)}</span><span style="color:var(--sub)">›</span></div>${x.t==='clear'?`<small style="color:var(--sub);font-weight:700">即期 ${P.reduce((a,p)=>a+p.clr,0)} 件 · ${S.clrD} 折</small>`:`<div style="display:flex;gap:8px;margin-top:8px">${x.s.map(sl=>{if(!sl)return '<div style="flex:1;text-align:center;opacity:.35;font-size:22px">＋</div>';const p=pr(sl.pid),cp=slotCap(x);return `<div style="flex:1;text-align:center;font-size:11px;font-weight:800;min-width:0">${ico(p)}<div class=bar style="margin:2px 0"><i style="width:${sl.q/cp*100}%;background:${sl.q<=2?'#d94452':'#2db36f'}"></i></div>${sl.q}/${cp}</div>`}).join('')}</div>`}</div>`).join('')+clrSecIfNone()}
const clrSecIfNone=()=>S.fix.includes('clear')?'':clrSec();
function rWh(){const au=used(false),cu=used(true),cold=S.own.cold,want=P.reduce((a,p)=>a+p.want,0),cost=P.reduce((a,p)=>a+p.want*p.cost*p.pack,0);
 return `<div class=hd><span>倉庫進貨</span><small>${S.phase==='prep'?'開門前下單立即到貨':'營業中下單，30 分鐘後到'}</small>${btn('smart','x','智慧補貨','sm g')}</div><div class=cap>常溫 ${au}/${S.ambCap}<div class=bar><i style="width:${au/S.ambCap*100}%"></i></div></div><div class=cap>${cold?`冷藏 ${cu}/${S.coldCap}<div class=bar><i style="width:${cu/S.coldCap*100}%;background:#4aa3ff"></i></div>`:`❄️ 冷藏庫未購買　${S.lv<2?'<span class="sm off">Lv2 解鎖</span>':btn('tab','exp','去擴店購買','sm')}`}</div>`+
 A().map(p=>{const lock=p.cold&&!cold;return `<div class=row style="${lock?'opacity:.5':''}"><span class=ic>${ico(p)}</span><div class=nm>${p.n}${p.cold?' ❄️':''}<small>進價 ${f(p.cost)} ${chg(p)} · 倉庫 ${p.wh} · 貨架 ${p.shelf} · 1箱=${p.pack}${p.u} · 預估 ${Math.round(fc(p))}/天${p.life?' · '+p.life+' 天後即期':''}</small></div>${lock?'<span class="sm off">需冷藏庫</span>':btn('want',p.id+'|-1','−','sm g')+`<b style="width:22px;text-align:center">${p.want}</b>`+btn('want',p.id+'|1','＋','sm g')}</div>`}).join('')+
 lockHint()+(S.orders.length?`<div class=hint>🚚 配送中：${S.orders.map(o=>pr(o.id).n+' ×'+o.q).join('、')}</div>`:'')+`<div style="position:sticky;bottom:0;background:var(--bg);padding:10px 0 2px;display:flex;justify-content:space-between;align-items:center"><div><small style="color:var(--sub)">合計</small><br><b style="font-size:20px;color:#d64034">${f(cost)}</b></div>${btn('order','x','下單進貨',want?'btn':'btn g')}</div>`}
function rPrice(){return `<div class=hd><span>今日價格</span><small>市價每天浮動</small></div><div class=chips>${btn('pall','mkt','全部=市價','chip')}${btn('pall','.9','全部九折','chip')}${btn('pall','1.1','全部+10%','chip')}</div>`+A().map(p=>{const m=Math.round((p.price-p.cost)/p.price*100),d=Math.round((p.price-p.mkt)/p.mkt*100);
 return `<div class=row><span class=ic>${ico(p)}</span><div class=nm>${p.n}<small>進價 ${f(p.cost)} · 市價 ${f(p.mkt)} · 毛利 ${m}%${d?` · <span style="color:${d>0?'#d94452':'#2c9b7f'}">${d>0?'偏貴':'偏便宜'} ${Math.abs(d)}%</span>`:''}</small></div>${btn('price',p.id+'|-1','−','sm g')}<b style="width:46px;text-align:center">${f(p.price)}</b>${btn('price',p.id+'|1','＋','sm g')}</div>`}).join('')}
function cards(k,fl){return CAT[k].filter(fl||(()=>1)).map(([id,ic,n,d,p,lv])=>{const lock=lv&&S.lv<lv,own=S.own[id];
 return `<div class=card><span class=ic>${ic}</span><div class=nm>${n}<small>${d}${k==='staff'?` · 薪資 ${f(p)}/天`:''}</small></div>${lock?`<span class="sm off">Lv${lv}</span>`:btn('buy',k+'|'+id,own?(k==='staff'?'解僱':'已擁有'):(k==='staff'?'僱用':f(p)),own?(k==='staff'?'sm g':'sm ok'):'sm')}</div>`}).join('')}
function rExp(){const sub={
 store:storeTab(),
 equip:eqTab(),staff:stTab(),mkt:rMkt(),
 decor:`<div class=hd><span>牆壁顏色</span></div><div class=sw>${[[0xf6ede2,'奶油'],[0xcfe6f7,'淺藍'],[0xf7d5dd,'粉紅'],[0xd6f0e0,'薄荷']].map(([c,n])=>`<button style="background:#${c.toString(16)}" data-a="wall" data-v="${c}" title="${n}"></button>`).join('')}</div><div class=hd><span>擺設</span><small>心情加成</small></div>${[['🪴','盆栽','心情 +0.8',80],['🖼️','海報','心情 +0.6',50],['🧶','地毯','心情 +0.6',120]].map(([i,n,d,p])=>`<div class=card><span class=ic>${i}</span><div class=nm>${n}<small>${d}</small></div>${btn('toast','之後接上',f(p),'sm')}</div>`).join('')}`,
 bank:`<div class=hd><span>現金 ${f(S.money)}</span></div><div class=card><span class=ic>🏦</span><div class=nm>活存<small>日息 0.2%，隨存隨取</small></div>${btn('toast','之後接上','存入','sm')}</div><div class=card><span class=ic>🔒</span><div class=nm>定存<small>3 天 1.2% · 7 天 3.5% · 14 天 9%</small></div>${btn('toast','之後接上','存入','sm')}</div><div class=card><span class=ic>💸</span><div class=nm>貸款<small>日息 0.8%，額度隨資產成長</small></div>${btn('toast','之後接上','借款','sm')}</div>`,
 ledger:`<div class=stats><div>總資產<b>${f(S.money+9000)}</b></div><div>累計營業額<b>$16,755</b></div><div>累計服務<b>599 人</b></div></div><div class=chart>${[3,2.5,5,6.5,3,4.5,3.8].map((v,i)=>`<div style="height:${v*14}px"><span>D${i+3}</span></div>`).join('')}</div><div class=ln style="margin-top:22px"><span>最佳單日利潤</span><b>$1,093</b></div><div class=ln><span>完美找零</span><b>72 次</b></div><div class=ln><span>顧客流失</span><b>18 人</b></div>`}[S.sub];
 return `<div class=chips>${SUBS.map(([k,n])=>btn('sub',k,n,'chip'+(S.sub===k?' on':''))).join('')}</div>${sub}`}
function rFood(){if(!S.own.hot)return `<div class=c><div style="font-size:40px">🍢</div><b>還沒有熱食區</b><p>買了才能賣關東煮、肉包、熱咖啡，每道菜要先備食材</p>${btn('tab','exp','去擴店 → 設備','btn')}</div>`;
 const tag=h=>{const r=h.price/h.ref,[t,c,b]=r<.85?['便宜','#17613a','#d9f3e3']:r<=1.2?['合理','#2a5db0','#e2ecfb']:r<=1.5?['偏貴','#a05a00','#fff0d6']:['太貴','#a3261b','#fde3e0'];return `<span style="font-size:11px;font-weight:900;border-radius:99px;padding:2px 8px;margin-left:6px;color:${c};background:${b}">${t}</span>`},
 sold=HOT.reduce((a,h)=>a+h.sold,0),rev=HOT.reduce((a,h)=>a+h.rev,0),dl=S.eq.dine||0,tb=[0,4,6,12][dl];
 return `<div class=hd><span>餐飲</span><small>熱食檔口 · 就餐區</small></div><div style="font-size:14px;font-weight:900;margin:2px 0 8px">菜品（${HOT.length}）<span style="color:var(--sub);font-weight:700">今天賣出 ${sold} 份 · ${f(rev)}</span></div>`+
 HOT.map(h=>`<div class=row><span class=ic>${ico(h)}</span><div class=nm>${h.n}${tag(h)}<small>食材 <b style="color:${h.stock?'var(--tx)':'#d94452'}">${h.stock}</b> 份 · 成本 ${f(h.cost)}/份 · 今日 ${h.sold} 份</small></div>${btn('hprice',h.id+'|-1','−','sm g')}<b style="width:46px;text-align:center">${f(h.price)}</b>${btn('hprice',h.id+'|1','＋','sm g')}${btn('hbuy',h.id,'進 '+h.batch+' 份 '+f(h.bcost),'sm')}</div>`).join('')+
 `<div class=hint style="margin-top:4px">價格高於參考價太多就沒人買；採購員會自動補快用完的食材</div><div class=hd style="font-size:14px;margin-top:10px"><span>就餐區</span></div>`+
 (dl?`<div class=card style="background:linear-gradient(135deg,#ff7a63,#ff4d4d);color:#fff;border:0"><span class=ic>🪑</span><div class=nm>桌子 ${tb} 張（${tb*2} 個座位）<small style="color:#ffe3dd">現在有 ${store.diners()} 人在吃 · 今天內用 ${S.stat.dine} 人</small></div></div>`+(dl<3?`<div class=card><div class=nm>擴建用餐區<small>房間變大、桌椅變多，熱食更好賣</small></div>${btn('tab','exp','去擴店','sm')}</div>`:'<div class="hint" style="border-color:#bfe6cf">就餐區擺滿啦</div>'):`<div class=hint>還沒有用餐區：到「擴店 → 設備」購買，顧客買了熱食可以坐下來吃</div>`)}
function rSet(){const row=(n,d,b)=>`<div class=row><div class=nm>${n}<small>${d}</small></div>${b}</div>`;
 return `<div class=hd><span>設定</span></div>`+row('畫質','卡頓時選流暢',btn('toast','之後接上','標準','sm g'))+row('畫面顧客數','少一點比較不卡；超過的顧客不顯示，照樣結帳',btn('crowd','x',['少','普通','多','很多'][CFG.crowd],'sm g'))+row('超市名字','日日鮮超市',btn('toast','之後接上','改名','sm g'))+row('雲存檔','之後用 Firebase 接上',btn('toast','之後接上','同步','sm g'))+row('測試工具','開發階段用，正式版會拿掉',btn('dbg','money','+$10,000','sm g')+btn('dbg','lv','升一級','sm g'))+row('遊戲怎麼玩','各項功能的說明',btn('howto','x','查看','sm g'))+`<div style="margin-top:12px">${btn('reset','x','重新開店','btn g w')}</div>`}
function syncScene(){const sp=SPEC(S.lv),c=Math.min(S.staff.cashier||0,sp.reg-1),e=S.eq,eq={neon:e.neon||0,whx:e.whx||0,music:!!e.music,scan:!!e.scan,pos:!!e.pos,ac:!!e.ac,cart:!!e.cart,change:!!e.change,self:e.self?sp.self:0,charge:!!e.charge,delivery:!!e.delivery,gate:!!e.gate,cctv:!!e.cctv},st={stocker:S.staff.stocker||0,buyer:S.staff.buyer||0,guard:S.staff.guard||0,packer:S.staff.packer||0,night:S.staff.night||0};
 if(syncScene.lv!==S.lv){syncScene.lv=S.lv;store.setLevel(S.lv)}
 {const cp=capFor();if(syncScene.cp!==cp){syncScene.cp=cp;store.setCap(cp)}}
 const k1=sp.reg+'/'+c+'/'+JSON.stringify(eq),k2=JSON.stringify(st);
 if(syncScene.k1!==k1){syncScene.k1=k1;store.setEquip(eq);store.setCounters(sp.reg,c,eq)}
 if(syncScene.k3!==(e.dine||0)){syncScene.k3=e.dine||0;store.setDine(syncScene.k3)}
 if(syncScene.k2!==k2){syncScene.k2=k2;store.setStaff(st)}}
const ico=p=>{const u=store.icon(p.id);return u?`<img src="${u}" width=40 height=40 style="object-fit:contain">`:p.e};
function render(){calcExpect();autoPlace();syncScene();syncStore();{const tl=S.tab==='cash'&&!!S.cur;if(render.tl!==tl){const ap=$('app');if(tl){render.sv=ap.style.getPropertyValue('--sh');ap.style.setProperty('--sh','34%')}else if(render.sv!==undefined){ap.style.setProperty('--sh',render.sv||'44%');render.sv=undefined}render.tl=tl;focus()}}if(S.tab==='dlv'&&!S.eq.delivery)S.tab='cash';$('tabs').innerHTML=tabsNow().map(([k,i,n])=>`<button class="tab${S.tab===k?' on':''}" data-a="tab" data-v="${k}"><b>${i}</b>${n}${k==='dlv'&&S.dord.filter(o=>o.st==='new').length?`<em class=bd>${S.dord.filter(o=>o.st==='new').length}</em>`:''}</button>`).join('');
 const keep=$('sheet').scrollTop;$('sheet').innerHTML='<div class=grab><i></i></div>'+({dlv:rDlv,cash:rCash,shelf:rShelf,wh:rWh,price:rPrice,exp:rExp,food:rFood,set:rSet})[S.tab]();$('sheet').scrollTop=keep;hud()}
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
 else if(a==='order'){const c=P.reduce((s,p)=>s+p.want*p.cost*p.pack,0);if(!c)return;if(c>S.money)return toast('資金不足',1);const qa=P.filter(p=>!p.cold).reduce((n,p)=>n+p.want*p.pack,0),qc=P.filter(p=>p.cold).reduce((n,p)=>n+p.want*p.pack,0);if(used(false)+qa>S.ambCap||used(true)+qc>S.coldCap)return toast('倉庫空間不足',1);S.money-=c;P.forEach(p=>{if(p.want){const q=p.want*p.pack;if(S.phase==='prep')recv(p,q);else S.orders.push({id:p.id,q,eta:S.min+30});p.want=0}});{const t=S.phase==='prep'?shTxt():'';toast(t||(S.phase==='prep'?'已下單，貨立即到倉庫':'已下單，遊戲內 30 分鐘後到貨'),!!t)}}
 else if(a==='price')pr(x).price=Math.max(1,pr(x).price+ +y);
 else if(a==='pall')P.forEach(p=>p.price=Math.max(1,Math.round(v==='mkt'?p.mkt:p.price*+v)));
 else if(a==='buy')buy(v);else if(a==='wall')store.setWall(+v);
 else if(a==='kp')S.kb=v==='C'?'':v==='<'?S.kb.slice(0,-1):(S.kb+v).slice(0,5);
 else if(a==='eq'){const e=EQ.concat(EQ2).find(x=>x[0]===v),cur=S.eq[v]||0;if(S.lv<e[6])toast('Lv'+e[6]+' 才解鎖',1);else if(v==='dine'&&!S.own.hot)toast('需要先有熱食區',1);else if(cur>=e[5].length)toast('已經是最高等級');else{const p=nt(e[5][cur]);if(S.money<p)toast('資金不足',1);else{S.money-=p;S.eq[v]=cur+1;S.own[v]=true;if(v==='hot')store.setVisible(v,true);if(v==='dine')store.focus('dine');if(v==='cold')store.setVisible('coldroom',true);toast('已購買 '+e[2])}}}
 else if(a==='hire'){const s=ST.find(x=>x[0]===v),c=S.staff[v]||0;if(c<s[6]()){S.staff[v]=c+1;toast('已僱用 '+s[2])}else toast('人數已滿',1)}
 else if(a==='fire'){if(S.staff[v]>0){S.staff[v]--;if(v==='buyer')S.buyerBusy=false;toast('已解僱')}}
 else if(a==='dbg'){if(v==='money'){S.money+=10000;toast('+$10,000')}else if(S.lv<MAXLV){S.lv++;toast('升到 Lv'+S.lv+'：'+lvName(S.lv))}}
 else if(a==='howto'){S.qOpen=false;openModal('<button class=x data-a="mclose">✕</button><div class=bt>怎麼玩</div>'+HOWTO.map(([i,t,d])=>`<p style="margin:0 0 10px;font-size:14px;line-height:1.7;font-weight:600"><b>${i} ${t}</b>：${d}</p>`).join(''))}
 else if(a==='fix'){const x=FIXT[v];if(S.lv<x.lv)toast('Lv'+x.lv+' 才解鎖',1);else if(S.fix.length>=SPEC(S.lv).shelf)toast('沒空位了，先升級店面',1);else if(S.money<x.price)toast('資金不足',1);else{const used=new Set(S.fxd.map(q=>q.pi)),pi=store.slots().find(c=>!used.has(c));if(pi===undefined)toast('沒空位了',1);else{S.money-=x.price;S.fxd.push(mkFx(v,pi));autoPlace();toast('已購買 '+x.n)}}}
 else if(a==='scan'){const t=S.cur;if(t&&t.ph==='scan'&&store.tillReady()){if(!t.items[+v].s){t.items[+v].s=true;store.beltScan(+v)}if(t.items.every(i=>i.s))t.ph='pay'}}
 else if(a==='scanall'){const t=S.cur;if(t&&store.tillReady()){t.items.forEach(i=>i.s=true);t.ph='pay';store.beltScanAll()}}
 else if(a==='bill'){if(S.cur)S.cur.chg.push(+v)}else if(a==='undo'){if(S.cur)S.cur.chg.pop()}else if(a==='clr'){if(S.cur)S.cur.chg=[]}
 else if(a==='waive'){const t=S.cur;if(t&&t.ask==='pending'){if(v==='y'){const r=t.askAmt;t.total-=r;t.waive=r;t.due=t.given-t.total;t.ask='yes';t.chg=[];toast('抹掉零頭 −'+f(r)+'，顧客很開心');if(Math.random()<.3)S.star++}else{t.ask='no';t.pat=Math.max(.05,t.pat-.3);toast('顧客有點不開心',1)}}}
 else if(a==='cashok'){const t=S.cur;if(!t)return;if(t.ask==='pending'){toast('先回覆顧客的抹零要求',1);return}const got=t.chg.reduce((x,y)=>x+y,0);if(got<t.due){toast('找少了，顧客不接受',1)}else done(t,{err:got-t.due,perfect:got===t.due})}
 else if(a==='autochg'){if(S.cur)done(S.cur,{perfect:1})}
 else if(a==='qrok'){if(S.cur)done(S.cur,{})}
 else if(a==='posfill'){if(S.cur)S.kb=String(S.cur.total)}
 else if(a==='cardok'){const t=S.cur;if(!t||t.cs)return;if(S.kb!==String(t.total)){S.kb='';toast('金額不對，請重新輸入',1)}else{t.cs='pin';S.kb='';setTimeout(()=>{if(S.cur===t){t.cs='print';render()}},1200);setTimeout(()=>{if(S.cur===t){done(t,{});render()}},2300)}}
 else if(a==='quick'){if(S.cur)done(S.cur,{})}
 else if(a==='rs'){const sl=S.fxd[+x]&&S.fxd[+x].s[+y];if(sl){const p=pr(sl.pid),m=Math.min(slotCap(sl.fx)-sl.q,p.wh);if(m>0){p.wh-=m;sl.q+=m;toast('已補貨 '+p.n+' +'+m)}else toast(sl.q>=slotCap(sl.fx)?'這格已經滿了':'倉庫沒貨了',1)}}
 else if(a==='rsall'){let n=0;S.fxd.forEach(fx=>fx.s.forEach(sl=>{if(!sl)return;const p=pr(sl.pid),m=Math.min(slotCap(fx)-sl.q,p.wh);if(m>0){p.wh-=m;sl.q+=m;n+=m}}));toast(n?'補貨完成，共 '+n+' 件':'沒有可補的貨',!n)}
 else if(a==='smart'){P.forEach(p=>p.want=0);let n=0;A().forEach(p=>{const b=plan(p,S.phase==='open');p.want=b;if(b)n++});const dn=Math.min(5,S.days.length);toast(n?'已估好 '+n+' 種（'+(dn>=3?'依近 '+dn+' 天銷量':'營業天數不到 3 天，先用預設估算')+'）':'目前庫存夠用，不用補')}
 else if(a==='cdisc'){S.clrD=+v;store.setClrDisc(S.clrD);toast('即期區改成 '+v+' 折')}
 else if(a==='hbuy'){const h=hotOf(v);if(h){if(S.money<h.bcost)toast('資金不足',1);else{S.money-=h.bcost;h.stock+=h.batch;toast('進貨 '+h.n+' '+h.batch+' 份')}}}
 else if(a==='hprice'){const[i,d]=v.split('|'),h=hotOf(i);if(h)h.price=Math.max(1,h.price+ +d*(h.price<30?1:5))}
 else if(a==='crowd'){CFG.crowd=(CFG.crowd+1)%4;try{localStorage.setItem('rrx-cfg',JSON.stringify(CFG))}catch(e){}toast('畫面顧客數：'+['少','普通','多','很多'][CFG.crowd])}
 else if(a==='bm'){S.buyerMid=!S.buyerMid}
 else if(a==='fsell'){const i=+v,x0=S.fxd[i];if(!x0)return;if(S.fxd.length<=1)toast('至少要留一個貨架',1);else{S.money+=Math.round(FIXT[x0.t].price/2);x0.s.slice().forEach(sl=>{if(sl)unplaceSlot(sl)});S.fxd.splice(i,1);S.sel=-1;store.mark(-1);autoPlace();toast('已賣掉 '+FIXT[x0.t].n)}}
 else if(a==='selm'){const n=S.fxd.length;S.sel=((S.sel+ +v)%n+n)%n;store.mark(S.sel);focus()}
 else if(a==='fall'){const x0=S.fxd[+v];let n=0;if(x0)x0.s.forEach(sl=>{if(!sl)return;const p=pr(sl.pid),m=Math.min(slotCap(x0)-sl.q,p.wh);if(m>0){p.wh-=m;sl.q+=m;n+=m}});toast(n?'整架補滿，共 '+n+' 件':'沒有可補的貨',!n)}
 else if(a==='fcap'){const x0=S.fxd[+v];if(x0){const c=capCost(x0);if(x0.cl>=3)toast('容量已經最大',1);else if(S.money<c)toast('資金不足',1);else{S.money-=c;x0.cl++;toast('容量升到 Lv'+x0.cl)}}}
 else if(a==='frot'){const x0=S.fxd[+v];if(x0){x0.rot=(x0.rot+1)%4;store.mark(+v)}}
 else if(a==='fnud'){const[i,ax,ay]=v.split('|'),x0=S.fxd[+i];if(x0){x0.dx=Math.max(-3,Math.min(3,x0.dx+ +ax));x0.dz=Math.max(-3,Math.min(3,x0.dz+ +ay));syncStore();store.mark(+i)}}
 else if(a==='pick'){const[i,k]=v.split('|');showPick(+i,+k);return}
 else if(a==='put'){const[i,k,id]=v.split('|'),x0=S.fxd[+i],p=pr(id);if(x0&&p){const old=x0.s[+k];if(old){const q=pr(old.pid);unplaceSlot(old);if(!q.sls.length)q.off=true}placeAt(p,x0,+k);closeModal();toast('已擺上 '+p.n)}}
 else if(a==='unp'){const[i,k]=v.split('|'),x0=S.fxd[+i],sl=x0&&x0.s[+k];if(sl){const q=pr(sl.pid);unplaceSlot(sl);if(!q.sls.length)q.off=true;closeModal();toast('已下架 '+q.n)}}
 else if(a==='dpick'){const o=S.dord.find(q=>q.id===+v);if(o&&o.st==='new')dPick(o,false)}
 else if(a==='thief'){thiefBack(+v,'you')}
 else if(a==='leave'){if(S.cur){lose(S.cur,1);pull()}}
 else if(a==='quest'){S.qOpen=true;showQuest()}
 else if(a==='mclose'){S.qOpen=false;S.dOpen=false;closeModal()}
 else if(a==='bstart')closeModal();
 else if(a==='disc'){S.member.disc=+v;toast('會員折扣設為 '+v+' 折');showMember()}
 else if(a==='upgrade'){const c=UPC[S.lv-1];if(canUp()){S.money+=2250-c;S.lv++;toast('升級成「'+lvName(S.lv)+'」！')}else toast('升級條件還沒達成',1)}
 else if(a==='claim'){const d=S.daily[+v];if(d&&!d.done&&qv(d.k)>=d.goal){d.done=true;S.money+=d.reward;toast('領取 '+f(d.reward))}showQuest()}
 else if(a==='open'){S.phase='open';S.min=480;S.visit=0;S.queue=[];S.pend=[];S.cur=null;Object.keys(CB).forEach(k=>delete CB[k]);Object.keys(SV).forEach(k=>delete SV[k]);S.dord=[];S.buyerBusy=false;store.setOpen(true);toast('開門營業！')}
 else if(a==='close'){S.phase='closed';dropAll();closeDelivery();S.buyerBusy=false;S.pend=[];Object.keys(carts).forEach(k=>{carts[k].items.forEach(back);delete carts[k]});HOT.forEach(h=>{h.hist.push(h.sold);if(h.hist.length>3)h.hist.shift()});if(S.stat.served){S.days.push({v:S.visit,cnt:S.stat.cnt});if(S.days.length>7)S.days.shift()}store.setOpen(false);expire();settle();return}
 else if(a==='next'){closeModal();HOT.forEach(h=>{h.sold=0;h.rev=0});S.day++;S.min=480;S.visit=0;S.phase='prep';S.daily=newDaily();S.stat=newStat();S.orders.forEach(o=>recv(pr(o.id),o.q));S.orders=[];rollDay();let bt='';if(S.staff.buyer){const r=autoBuy(false);if(r.n)bt='🧑‍💻 採購員進貨 '+r.n+' 種，共 '+f(r.c)}{const t=shTxt();if(t||bt)toast(t||bt,!!t)}saveGame();showBrief()}
 else if(a==='reset'){try{localStorage.removeItem(SAVE)}catch(e){}location.reload();return}
 else if(a==='tnew'){try{localStorage.removeItem(SAVE)}catch(e){}$('app').classList.remove('ttl');$('title').remove();focus();showBrief()}
 else if(a==='tcont'){const d=readSave();if(d)loadGame(d);render();$('app').classList.remove('ttl');$('title').remove();focus();showBrief();return}
 render()}
document.addEventListener('click',e=>{const b=e.target.closest('[data-a]');if(b)act(b.dataset.a,b.dataset.v??'x')});
function checkOrders(){const d=S.orders.filter(o=>S.min>=o.eta);if(d.length){d.forEach(o=>recv(pr(o.id),o.q));S.orders=S.orders.filter(o=>S.min<o.eta);{const t=shTxt();toast(t||'📦 貨到了！',!!t)};if(S.tab==='wh')render()}}
let lt=performance.now();(function loop(){requestAnimationFrame(loop);const n=performance.now(),dt=Math.min(.2,(n-lt)/1000);lt=n;
 if(S.phase==='open'&&S.min<1320){const o=Math.floor(S.min);S.min=Math.min(1320,S.min+dt*3);if(Math.floor(S.min)!==o){if(Math.random()<S.expect*(S.own.hot?.8:1)/840){const cid=++TID;const th=Math.random()<(S.eq.cctv?.018:.03);carts[cid]={items:[],sum:0,cogs:0,thief:th};if(store.spawnCustomer(cid,stopsFor(),th))S.visit++;else{delete carts[cid];if(!th)virtualVisit(false)}};if(S.own.hot&&Math.random()<S.expect*.2*(1+(S.eq.dine?.35:0))/840){const cid=++TID;if(store.spawnCustomer(cid,[],false,true))S.visit++;else virtualVisit(true)}if(S.eq.delivery&&Math.random()<SPEC(S.lv).flow*.12/840)newDeliveryOrder();if(S.staff.buyer&&S.buyerMid&&Math.floor(S.min)%20===0)store.buyerPatrol();checkOrders();hud();if(S.tab==='dlv'&&Math.floor(S.min)%3===0)render()}}if(S.phase==='open')tickCash(dt)})(); // 遊戲時間每秒走 3 分鐘，一分鐘一分鐘平順地走
autoPlace();render();
store.setHandlers({hotBuy,thief:thiefEv,take,arrive,job:stockJob,pickup:jobPick,deliver:jobDrop,cancel:jobCancel,buyerDone,driverPicked});store.onPick(i=>{if(S.cur&&S.cur.ph==='scan')act('scan',i)});store.setClrDisc(S.clrD);syncStore();store.setOpen(false);rollDay();
{const d=readSave(),t=document.createElement('div');t.id='title';t.innerHTML='<div class=tl><div class=tn><b>日日鮮</b><i>超市</i></div><p>進貨・定價・收銀找零・擴店升級</p>'+(d?`<button class=btn data-a="tcont" data-v="x">繼續營業<small>「日日鮮超市」第 ${d.S.day} 天 · ${f(d.S.money)}</small></button><button class="btn g" data-a="tnew" data-v="x">開一家新店</button>`:`<button class=btn data-a="tnew" data-v="x">開始營業</button>`)+'<em>進貨要精打細算，有賺有賠（純屬遊戲）</em></div>';
 document.body.appendChild(t);$('app').classList.add('ttl');store.focus('title')}
{const app=$('app'),sh=$('sheet');let d=null;
 sh.addEventListener('pointerdown',e=>{if(!e.target.closest('.grab'))return;d={y:e.clientY,h:$('stage').clientHeight,m:false};sh.setPointerCapture(e.pointerId)});
 sh.addEventListener('pointermove',e=>{if(!d)return;const dy=e.clientY-d.y;if(Math.abs(dy)>5)d.m=true;if(d.m)app.style.setProperty('--sh',Math.min(76,Math.max(18,(d.h+dy)/app.clientHeight*100))+'%')});
 const end=()=>{if(!d)return;const S3=[22,44,70],cur=parseFloat(app.style.getPropertyValue('--sh'))||44;let t;if(!d.m){const i=S3.findIndex(x=>Math.abs(x-cur)<6);t=S3[(i+1)%3]}else t=S3.reduce((a,b)=>Math.abs(b-cur)<Math.abs(a-cur)?b:a);app.style.setProperty('--sh',t+'%');d=null};
 sh.addEventListener('pointerup',end);sh.addEventListener('pointercancel',end)}
{let hid=null;document.addEventListener('pointerdown',e=>{const b=e.target.closest&&e.target.closest('[data-hold]');if(!b)return;const id=b.dataset.hold,step=()=>{const[fi,k]=id.split('|'),sl=S.fxd[+fi]&&S.fxd[+fi].s[+k];if(!sl)return;const p=pr(sl.pid),m=Math.min(slotCap(sl.fx)-sl.q,p.wh,1);if(m>0){p.wh-=m;sl.q+=m;syncStore()}};step();hid=setInterval(step,90)});const stop=()=>{if(hid){clearInterval(hid);hid=null;render()}};document.addEventListener('pointerup',stop);document.addEventListener('pointercancel',stop)}

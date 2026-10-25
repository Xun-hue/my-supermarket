// 全部介面：HUD、底部 7 個分頁、擴店 7 個子頁。數值先用示範資料，流程之後一步步接上。
import {initStore} from './store.js';
const $=id=>document.getElementById(id),f=n=>'$'+Math.round(n).toLocaleString();
const store=initStore($('stage'));
const P=[['water','礦泉水','💧',12,20],['cola','可樂','🥤',15,25],['milk','鮮奶','🥛',50,75,1],['chips','洋芋片','🍟',28,45],['choco','巧克力','🍫',38,59],['noodle','泡麵','🍜',22,35],['onigiri','御飯糰','🍙',22,35,1]]
 .map(([id,n,e,cost,price,cold],i)=>({id,n,e,cost,cb:cost,old:cost,price,mkt:price,cold:!!cold,pack:[24,24,12,12,12,12,12][i],wh:cold?0:24,shelf:cold?0:8,want:0}));
const S={money:3000,star:80,visit:0,lv:1,min:480,day:1,phase:'prep',orders:[],qOpen:false,total:0,hist:[],member:{own:false,count:0,disc:95},wn:['☀️','晴',1.1],expect:60,stat:null,daily:[],tab:'cash',sub:'store',pm:'cash',sel:-1,own:{},hired:{},kb:'',coldLv:1,get ambCap(){return SPEC(this.lv).cap},get coldCap(){return 300*this.coldLv},fix:['shelf','shelf','shelf','shelf']};
const newStat=()=>({served:0,total:0,perfect:0,gross:0,rev:0,cogs:0,memberDisc:0,newMember:0,lost:0,thief:0,caught:0,hot:0,hotRev:0,charge:0,best:'',bestN:0});S.stat=newStat();
const RATE={95:.04,90:.08,85:.13},UPC=[1500,3800,8000,15000,26000,40000,60000,90000];
const wk=()=>['一','二','三','四','五','六','日'][(S.day+1)%7];
const CAT={
 equip:[['cold','❄️','冷藏庫','解鎖冷藏倉容量（鮮奶、御飯糰要用），Lv2 才能買',1500,2],['hot','🍢','熱食檔口','賣關東煮、茶葉蛋、熱狗',350],['dine','🪑','就餐區','座位帶來額外客流與心情',480],['charge','🔋','共享行動電源','出租收入約 $8/天',120],['scan','⚡','一鍵掃台','收銀時出現「一鍵結算」',150],['pos','💳','智能POS','刷卡自動收款',180],['ac','🌬️','中央空調','夏天顧客心情＋',250]],
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
// ---- 彈窗 ----
const openModal=h=>{$('modal').innerHTML='<div class=box>'+h+'</div>';$('modal').classList.add('on')},closeModal=()=>$('modal').classList.remove('on');
// ---- 任務：升級任務（3 個條件）＋每日隨機任務 ----
const POOL=[['perfect','完美找零',[3,5,8],'次',[60,100,160]],['served','服務顧客',[20,30,40],'位',[80,120,180]],['rev','單日營業額達',[600,900,1500],'元',[100,160,260]],['visit','進店人數達',[25,40,60],'人',[60,100,150]],['thief','抓到小偷',[1,2,3],'個',[120,200,300]],['member','新增會員',[2,4,6],'位',[80,120,180]],['hot','賣出熱食',[8,12,20],'份',[80,120,200]]];
const rnd3=n=>Math.floor(Math.random()*n);
function newDaily(){return POOL.map(a=>[Math.random(),a]).sort((x,y)=>x[0]-y[0]).slice(0,3).map(([,a])=>{const d=rnd3(a[2].length);return{k:a[0],n:a[1],goal:a[2][d],unit:a[3],reward:a[4][d],done:false}})}
const qv=k=>k==='visit'?S.visit:k==='member'?S.stat.newMember:k==='rev'?S.stat.gross:(S.stat[k]||0);
function mainConds(){const cost=UPC[S.lv-1]||0,g=[1500*S.lv,80+5*S.lv,cost],c=[S.total,S.star,S.money],fm=[f,x=>x,f];return['累計營業額','店鋪星級','現金（擴店費用）'].map((n,i)=>({n,cur:c[i],goal:g[i],ok:c[i]>=g[i],show:fm[i](c[i])+' / '+fm[i](g[i])}))}
function showQuest(){const mc=mainConds(),lvl=S.lv<MAXLV;openModal(`<button class=x data-a="mclose">✕</button><div class=hd style="margin-right:36px"><span>🎯 ${lvl?'升級「'+lvName(S.lv+1)+'」':'已是最高等級'}</span><small>${mc.filter(c=>c.ok).length}/3</small></div>`+(lvl?mc.map(c=>`<div class=qrow><div class=t>${c.ok?'✅':'⬜'} ${c.n}<small>${c.show}</small><div class=pb><i style="width:${Math.min(100,c.cur/c.goal*100)}%"></i></div></div></div>`).join('')+`<div class=hint style="margin-top:10px">三項都達成後，到「擴店」按「擴店」升級，可再領獎勵 ${f(500)}</div>`:'')+`<div class=hd style="margin-top:10px"><span>📅 每日任務</span><small>隔天換新的</small></div>`+S.daily.map((d,i)=>{const v=qv(d.k),ok=v>=d.goal;return `<div class=qrow><div class=t>${d.n} ${d.goal}${d.unit}<small>${Math.min(v,d.goal)}/${d.goal} · 獎勵 ${f(d.reward)}</small><div class=pb><i style="width:${Math.min(100,v/d.goal*100)}%"></i></div></div><button data-a="claim" data-v="${i}" ${ok&&!d.done?'':'disabled'}>${d.done?'已領':'領取'}</button></div>`}).join(''))}
S.daily=newDaily();
function hud(){const pr=S.phase==='prep',m=Math.floor(S.min),T=String(Math.floor(m/60)).padStart(2,'0')+':'+String(m%60).padStart(2,'0'),clk=pr?'準備中':S.phase==='open'?T:'已打烊',mc=mainConds();
 const h=`<div class=tb data-p="${S.phase}"><div class=rb>‹</div><div class=cp><span id=clock>{T}</span><small>第${S.day}天 週${wk()} ${S.wn[0]}</small></div><div class=rbs><div class=rb>👤</div><div class=rb>↗</div></div></div><div class=r1><span class="pill r">日日鮮超市 Lv${S.lv}</span><span class=pill>⭐ ${S.star}</span>${pr?'':`<span class=pill>👥 ${S.visit} 進店</span>`}</div><div class=quest data-a="quest">${S.lv<MAXLV?`🎯 擴店升級為「${lvName(S.lv+1)}」 ${mc.filter(c=>c.ok).length}/3 <b>+$500</b>`:'🏆 已是最高等級'} ›</div><div class=r1><span class=pill>🪙 ${f(S.money)}</span></div>`;
 if(hud.k!==h){hud.k=h;$('hud').innerHTML=h.replace('{T}',clk)}else{const c=$('clock');if(c)c.textContent=clk}
 $('openBtn').style.display=pr?'block':'none';$('closeBtn').style.display=(S.phase==='open'&&S.min>=1320)?'block':'none'}
// ---- 每天開始：天氣、進價浮動、預計客流、早晨簡報 ----
function rollDay(){S.wn=[['☀️','晴',1.1],['⛅','多雲',1],['🌧️','雨',.8]][rnd3(3)];P.forEach(p=>{p.old=p.cost;p.cost=Math.max(1,Math.round(p.cb*(.85+Math.random()*.3)))});
 S.expect=Math.round((40+12*S.lv+(S.own.dine?10:0)+(S.member.own?Math.min(30,S.member.count/5):0))*S.wn[2])}
function showBrief(){const dn=P.filter(p=>p.cost<p.old).slice(0,3).map(p=>p.n).join('、'),up=P.filter(p=>p.cost>p.old).slice(0,3).map(p=>p.n).join('、'),d=S.daily[0];
 openModal(`<div class=bt>${S.wn[0]} 第 ${S.day} 天 · 週${wk()}</div><div class=bcard><div class=bw>${S.wn[0]}<br><b>${S.wn[1]}</b></div><div class=bl>預計客流約 <b>${S.expect}</b> 人${dn?'<br>📉 進價下跌：'+dn:''}${up?'<br>📈 進價上漲：'+up:''}<br>🎯 今日挑戰：${d.n} ${d.goal}${d.unit}</div></div><p style="text-align:center;color:var(--sub);font-size:13px;font-weight:700">先進貨、擺貨、看看價格，準備好就開門營業！</p><button class="btn w" data-a="bstart">開始準備</button>`)}
const chg=p=>{const c=Math.round((p.cost/p.cb-1)*100);return c?`<span style="color:${c>0?'#d94452':'#2db36f'}">${c>0?'↑':'↓'}${Math.abs(c)}%</span>`:'—'};
// ---- 會員卡 ----
function showMember(){const m=S.member;openModal(`<button class=x data-a="mclose">✕</button><div class=hd style="margin-right:36px"><span>💳 會員卡</span><b style="color:#ff4d4d">${m.count} 位會員</b></div><p style="color:var(--sub);font-size:13px;font-weight:700;margin:0 0 10px">選一個會員折扣。折扣越大，辦卡的人越多，但每筆會員消費少收越多。</p>`+[[95,'95 折','約 4% 的顧客會辦卡'],[90,'90 折','約 8% 的顧客會辦卡'],[85,'85 折','約 13% 的顧客會辦卡']].map(([d,n,t])=>`<div class=card style="${m.disc===d?'border-color:#ff5a4e;background:#fff3f0':''}"><div class=nm>${n}<small>${t}</small></div>${btn('disc',d,m.disc===d?'目前':'選這個',m.disc===d?'sm ok':'sm')}</div>`).join('')+`<button class="btn w" data-a="mclose">確定</button>`)}
function rMkt(){const m=S.member;return cards('mkt',x=>x[0]!=='member')+(!m.own?`<div class=card><span class=ic>💳</span><div class=nm>會員卡<small>開通後顧客可辦卡，享固定折扣，回頭客更多</small></div>${btn('buy','mkt|member','$500','sm')}</div>`:`<div class=dash><div class=hd style="margin:0 0 4px"><span>💳 會員卡</span><b style="color:#ff4d4d">${m.count} 位會員</b></div><div style="font-size:12px;color:var(--sub);font-weight:700">今天新辦 ${S.stat.newMember} 張 · 目前 ${m.disc} 折</div><div class=chips style="margin-top:8px">${[95,90,85].map(d=>btn('disc',d,d+' 折','chip'+(m.disc===d?' on':''))).join('')}</div><div style="font-size:12px;color:var(--sub);font-weight:600">折扣越大辦卡越多（約 4% / 8% / 13%），但每筆會員消費少收越多。</div></div>`)}
// ---- 擴店・店鋪 ----
const SPEC=lv=>({size:`${8+2*lv}×${5+2*lv}米`,shelf:lv<2?4:6+3*(lv-2),reg:[2,3,3,4,4,5,5,6,6][Math.min(lv,9)-1],flow:40+12*lv,cap:450+550*(lv-1),self:Math.max(0,lv-1)});
const canUp=()=>S.lv<MAXLV&&mainConds().every(c=>c.ok);
function storeTab(){const a=SPEC(S.lv),b=SPEC(S.lv+1),cost=UPC[S.lv-1]||0,ok=canUp();
 return `<div style="background:linear-gradient(135deg,#ff6a52,#e8392c);color:#fff;border-radius:20px;padding:14px;display:flex;gap:12px;align-items:center;margin-bottom:10px"><div style="width:58px;height:58px;border-radius:50%;background:#fff;color:#ff4d4d;font-weight:900;display:flex;align-items:center;justify-content:center;font-size:18px;flex:none">Lv${S.lv}</div><div><div style="font-size:19px;font-weight:900">日日鮮超市</div><div style="font-size:13px;font-weight:700">${lvName(S.lv)}・${a.size}・貨架位 ${S.fix.length}/${a.shelf}・收銀台 ${a.reg}</div></div></div>`+(S.lv<MAXLV?`<div class=dash><b style="font-size:15px">下一級：<span style="color:#ff4d4d">${lvName(S.lv+1)}</span></b><div class=tags>${['店面 '+b.size,'貨架位 '+b.shelf,'收銀台 '+b.reg,'基礎客流 '+b.flow+' 人/天','倉庫 '+b.cap,'自助收銀位 '+b.self].map(x=>`<span>${x}</span>`).join('')}</div><div class=ln style="margin-top:10px;align-items:center"><span style="color:var(--sub)">房租 ${f(80*S.lv)}/天</span>${btn('upgrade','x','擴店 '+f(cost),ok?'btn':'btn g')}</div>${ok?'':'<div style="font-size:12px;color:var(--sub);font-weight:600;margin-top:4px">條件還沒達成，點左上角任務可查看</div>'}</div>`:'')+`<div class=hd style="margin-top:6px"><span>購買貨架 / 櫃台</span></div>`+Object.keys(FIXT).map(k=>{const x=FIXT[k];return `<div class=card><div class=nm>${x.n}<small>${x.d}</small></div>${S.lv<x.lv?'<span class="sm off">Lv'+x.lv+'</span>':S.fix.length>=SPEC(S.lv).shelf?'<span class="sm off">沒空位</span>':btn('fix',k,f(x.price),'sm')}</div>`}).join('')}
// ---- 打烊結算（目前用模擬的一天；收銀流程接上後改成真實數字）----
function daySim(){const st=S.stat,vis=S.visit,share=Math.min(.6,S.member.count/200),dc=S.member.own?(100-S.member.disc)/100:0,cnt={};
 for(let i=0;i<vis;i++){if(Math.random()<.1){st.lost++;continue}let t=0,c=0;for(let k=0,n=2+rnd3(3);k<n;k++){const p=P[rnd3(P.length)];if(p.cold&&!S.own.cold)continue;t+=p.price;c+=p.cost;cnt[p.id]=(cnt[p.id]||0)+1}
  if(!t){st.lost++;continue}st.served++;st.gross+=t;st.cogs+=c;if(Math.random()<share)st.memberDisc+=t*dc;else if(S.member.own&&Math.random()<RATE[S.member.disc])st.newMember++;if(Math.random()<.12)st.perfect++}
 st.total=vis+st.lost*0;if(S.own.hot){st.hot=Math.round(st.served*.12);st.hotRev=st.hot*12}if(S.own.charge)st.charge=2;st.gross+=st.hotRev+st.charge*3;
 const th=Math.random()<.5?1:0;st.thief=th;st.caught=th&&(S.hired.guard||Math.random()<.6)?1:0;st.best=Object.keys(cnt).sort((a,b)=>cnt[b]-cnt[a])[0]||'';st.bestN=cnt[st.best]||0;S.member.count+=st.newMember;st.rev=st.gross-st.memberDisc}
function settle(){const st=S.stat;if(!st.served)daySim();
 const wage=Object.keys(S.hired).filter(k=>S.hired[k]).reduce((a,k)=>a+CAT.staff.find(x=>x[0]===k)[4],0),rent=80*S.lv,util=20+Math.round(st.served*.4),net=Math.round(st.gross-st.cogs-rent-util-wage-st.memberDisc);
 S.money+=Math.round(st.gross-st.memberDisc-rent-util-wage);S.total+=st.gross;S.hist.push(net);const H=S.hist.slice(-7),mx=Math.max(1,...H.map(Math.abs)),rk=net<300?['C','努力的店主','#3a86ff']:net<1000?['B','小有名氣','#2db36f']:net<2500?['A','生意興隆','#ff9f1a']:['S','商業巨頭','#ff4d4d'];
 const L=(n,v,c)=>`<div class=ln style="color:${c||'var(--tx)'}"><span>${n}</span><span>${v}</span></div>`,pb=P.find(p=>p.id===st.best);
 openModal(`<div class=hd><span style="font-size:16px">第 ${S.day} 天 · 週${wk()} · 營業結束</span><span style="background:${rk[2]};color:#fff;border-radius:99px;padding:5px 12px;font-size:13px">${rk[0]} ${rk[1]}</span></div><div style="color:var(--sub);font-size:13px;font-weight:700">今日淨利潤</div><div class=big style="color:${net>=0?'#2db36f':'#d94452'}">${net>=0?'+':'−'}${f(Math.abs(net))}</div>
 <div class=dash>${L('營業額',f(st.gross))}${L('商品成本','−'+f(st.cogs),'#b4553f')}${L('房租','−'+f(rent),'#b4553f')}${L('水電','−'+f(util),'#b4553f')}${L('員工工資','−'+f(wage),'#b4553f')}${L('抹零 / 會員優惠','−'+f(st.memberDisc),'#b4553f')}</div>
 <div class=stats><div>服務顧客<b>${st.served}/${S.visit}</b></div><div>好評率<b>${Math.min(99,Math.round(S.star*.9))}%</b></div><div>口碑<b>${S.star}→${S.star}</b></div><div>完美找零<b>${st.perfect} 次</b></div><div>平均結帳<b>${st.served?'2.8 秒':'—'}</b></div><div>缺貨<b>${st.lost} 次</b></div></div>
 <div class=sec><b class=t>收款明細</b>${L('🙋 店長（你）　'+st.served+' 位',f(st.gross-st.hotRev-st.charge*3))}</div>`+
 (S.own.hot||S.own.charge?`<div class=sec><b class=t>夜班與增值服務（已計入營業額）</b>${S.own.hot?L('🍢 熱食　'+st.hot+' 份',f(st.hotRev)):''}${S.own.charge?L('🔋 行動電源　'+st.charge+' 次',f(st.charge*3)):''}</div>`:'')+
 (S.member.own?`<div class=sec>💳 會員 ${S.member.count} 位（今天新辦 ${st.newMember} 張），會員優惠 ${f(st.memberDisc)}</div>`:'')+(pb?`<div class=sec>🔥 今日暢銷：${pb.e} ${pb.n} ${st.bestN} 件</div>`:'')+
 `<div class="sec good">🚨 小偷 ${st.thief} 個：抓住 ${st.caught} 個</div>`+S.daily.map(d=>{const ok=qv(d.k)>=d.goal;return `<div class="sec ${ok?'good':''}">${ok?'✅ 每日挑戰完成':'⬜ 每日挑戰未完成'}：${d.n} ${d.goal}${d.unit}（獎勵 ${f(d.reward)}）</div>`}).join('')+
 `<div class=chart>${H.map((v,i)=>`<div style="height:${Math.max(6,Math.abs(v)/mx*100)}px;background:${v>=0?'#2db36f':'#d94452'}"><span>D${S.day-H.length+1+i}</span></div>`).join('')}</div><p style="font-size:11px;color:var(--sub);text-align:center;margin:-8px 0 8px">目前是模擬結算，收銀流程接上後會換成真實數字</p><button class="btn w" data-a="next">下一天 →</button>`)}
// ---- 各分頁 ----
function rCash(){const mk={cash:`<div class=rc><div class=l>牛奶 ×3　$14<br>啤酒 ×2　$11<br>可樂 ×4　$12</div><div class=r><small>應收</small><b>$37</b></div></div><div class=info><div>顧客付<b>$100</b></div><div>應找<b style="color:#ff5a4e">$63</b></div><div>已找<b style="color:#3a6bc4">$0</b></div></div><div class=bills style="grid-template-columns:repeat(4,1fr)">${DEN.map(d=>`<button class=b style="background:${d[1]}" data-a="toast" data-v="找零流程之後接上">$${d[0]}</button>`).join('')}</div><div class=acts>${btn('toast','x','撤銷','btn g')}${btn('toast','x','清空','btn g')}${btn('toast','x','確認找零','btn')}</div>`,
 qr:`<div class=rc><div class=l>礦泉水 ×2　$40<br>洋芋片　$45</div><div class=r><small>應收</small><b>$85</b></div></div><div class=qrw><div class=qr>${Array.from({length:81},()=>`<i style="background:${Math.random()<.5?'#111':'#fff'}"></i>`).join('')}</div><div style="flex:1"><b>顧客出示了付款碼</b><br><br>${btn('toast','x','📷 掃碼收款','btn w')}</div></div>`,
 card:`<div class=rc><div class=l>鮮奶 ×3　$225<br>巧克力　$59</div><div class=r><small>應收</small><b>$284</b></div></div><div class=lcd>NT$ ${S.kb||'<span style="opacity:.5;font-size:15px">輸入應收金額</span>'}</div><div class=kp>${['1','2','3','4','5','6','7','8','9','C','0','<'].map(k=>`<button class=b data-a="kp" data-v="${k}">${k==='<'?'⌫':k}</button>`).join('')}</div><div style="margin-top:8px">${btn('toast','刷卡流程：輸入密碼中… → 列印簽單中…','確認收款','btn w')}</div>`};
 return `<div class=c><div style="font-size:40px">🧾</div><b>暫時沒人排隊</b><p>可以去補貨、調價～</p></div><div class=hd><span>收銀介面預覽</span><small>流程之後接上</small></div><div class=chips>${[['cash','💵 現金'],['qr','📱 行動支付'],['card','💳 刷卡']].map(([k,n])=>btn('pm',k,n,'chip'+(S.pm===k?' on':''))).join('')}</div>${mk[S.pm]}`}
const FIXT={shelf:{n:'貨架',price:300,lv:1,d:'常溫商品：飲料、零食、日用品'},cold:{n:'冷藏櫃',price:800,lv:2,d:'冷藏商品：乳品、啤酒、果汁・電費 $5/天'},produce:{n:'果蔬台',price:500,lv:2,d:'生鮮果蔬'},clear:{n:'臨期特價區',price:400,lv:2,d:'快過期的貨打折賣，少報損'},freezer:{n:'冷凍櫃',price:1200,lv:3,d:'冷凍商品：冰淇淋、速凍食品・電費 $8/天'}};
function rShelf(){return `<div class=hd><span>貨架管理</span><small>貨架位 ${S.fix.length}/${SPEC(S.lv).shelf}</small></div><div class=hint>👍 所有貨架都挺滿的</div><div class=hd style="font-size:14px"><span>全部貨架（${S.fix.length}）</span></div>`+S.fix.map((t,i)=>{const on=S.sel===i,fx=FIXT[t],ps=t==='shelf'?P.filter(p=>!p.cold).slice(i%3,i%3+3):t==='cold'?P.filter(p=>p.cold):[];
 return `<div class=card style="${on?'border-color:#ff5a4e':''}"><div class=nm>#${i+1} ${fx.n}<small>容量 Lv1 · ${ps.map(p=>p.e).join(' ')||'—'}</small></div>${btn('sel',on?-1:i,on?'收起':'查看',on?'sm g':'sm')}</div>`+(on?`<div style="padding:0 4px 10px">${ps.map(p=>`<div class=row><span class=ic>${p.e}</span><div class=nm>${p.n}<small>貨架 ${p.shelf}/12 · 倉庫 ${p.wh}</small></div>${btn('toast','補貨之後接上','補滿','sm g')}</div>`).join('')}<div class=acts style="margin-top:8px">${btn('toast','之後接上','整架補滿','btn g')}${btn('toast','之後接上','轉 90°','btn g')}</div></div>`:'')}).join('')}
function rWh(){const au=used(false),cu=used(true),cold=S.own.cold,want=P.reduce((a,p)=>a+p.want,0),cost=P.reduce((a,p)=>a+p.want*p.cost*p.pack,0);
 return `<div class=hd><span>倉庫進貨</span><small>${S.phase==='prep'?'開門前下單立即到貨':'營業中下單，30 分鐘後到'}</small>${btn('toast','之後接上','智能補貨','sm g')}</div><div class=cap>常溫 ${au}/${S.ambCap}<div class=bar><i style="width:${au/S.ambCap*100}%"></i></div></div><div class=cap>${cold?`冷藏 ${cu}/${S.coldCap}<div class=bar><i style="width:${cu/S.coldCap*100}%;background:#4aa3ff"></i></div><div style="margin-top:6px">${btn('upcold','x','擴充容量 '+f(600*S.coldLv),'sm g')}</div>`:`❄️ 冷藏庫未購買　${S.lv<2?'<span class="sm off">Lv2 解鎖</span>':btn('tab','exp','去擴店購買','sm')}`}</div>`+
 P.map(p=>{const lock=p.cold&&!cold;return `<div class=row style="${lock?'opacity:.5':''}"><span class=ic>${p.e}</span><div class=nm>${p.n}${p.cold?' ❄️':''}<small>進價 ${f(p.cost)} ${chg(p)} · 倉庫 ${p.wh} · 貨架 ${p.shelf} · 1箱=${p.pack}件</small></div>${lock?'<span class="sm off">需冷藏庫</span>':btn('want',p.id+'|-1','−','sm g')+`<b style="width:22px;text-align:center">${p.want}</b>`+btn('want',p.id+'|1','＋','sm g')}</div>`}).join('')+
 (S.orders.length?`<div class=hint>🚚 配送中：${S.orders.map(o=>pr(o.id).n+' ×'+o.q).join('、')}</div>`:'')+`<div style="position:sticky;bottom:0;background:var(--bg);padding:10px 0 2px;display:flex;justify-content:space-between;align-items:center"><div><small style="color:var(--sub)">合計</small><br><b style="font-size:20px;color:#d64034">${f(cost)}</b></div>${btn('order','x','下單進貨',want?'btn':'btn g')}</div>`}
function rPrice(){return `<div class=hd><span>今日價格</span><small>市價每天浮動</small></div><div class=chips>${btn('pall','mkt','全部=市價','chip')}${btn('pall','.9','全部九折','chip')}${btn('pall','1.1','全部+10%','chip')}</div>`+P.map(p=>{const m=Math.round((p.price-p.cost)/p.price*100),d=Math.round((p.price-p.mkt)/p.mkt*100);
 return `<div class=row><span class=ic>${p.e}</span><div class=nm>${p.n}<small>進價 ${f(p.cost)} · 市價 ${f(p.mkt)} · 毛利 ${m}%${d?` · <span style="color:${d>0?'#d94452':'#2c9b7f'}">${d>0?'偏貴':'偏便宜'} ${Math.abs(d)}%</span>`:''}</small></div>${btn('price',p.id+'|-1','−','sm g')}<b style="width:46px;text-align:center">${f(p.price)}</b>${btn('price',p.id+'|1','＋','sm g')}</div>`}).join('')}
function cards(k,fl){return CAT[k].filter(fl||(()=>1)).map(([id,ic,n,d,p,lv])=>{const lock=lv&&S.lv<lv,own=k==='staff'?S.hired[id]:S.own[id];
 return `<div class=card><span class=ic>${ic}</span><div class=nm>${n}<small>${d}${k==='staff'?` · 工資 ${f(p)}/天`:''}</small></div>${lock?`<span class="sm off">Lv${lv}</span>`:btn('buy',k+'|'+id,own?(k==='staff'?'解雇':'已擁有'):(k==='staff'?'雇用':f(p)),own?(k==='staff'?'sm g':'sm ok'):'sm')}</div>`}).join('')}
function rExp(){const sub={
 store:storeTab(),
 equip:cards('equip'),staff:`<div class=hint>員工每天結算工資；有些要店鋪等級夠才能雇用</div>`+cards('staff'),mkt:rMkt(),
 decor:`<div class=hd><span>牆壁顏色</span></div><div class=sw>${[[0xf6ede2,'奶油'],[0xcfe6f7,'淺藍'],[0xf7d5dd,'粉紅'],[0xd6f0e0,'薄荷']].map(([c,n])=>`<button style="background:#${c.toString(16)}" data-a="wall" data-v="${c}" title="${n}"></button>`).join('')}</div><div class=hd><span>擺設</span><small>心情加成</small></div>${[['🪴','綠植','心情 +0.8',80],['🖼️','海報','心情 +0.6',50],['🧶','地毯','心情 +0.6',120]].map(([i,n,d,p])=>`<div class=card><span class=ic>${i}</span><div class=nm>${n}<small>${d}</small></div>${btn('toast','之後接上',f(p),'sm')}</div>`).join('')}`,
 bank:`<div class=hd><span>現金 ${f(S.money)}</span></div><div class=card><span class=ic>🏦</span><div class=nm>活期<small>日息 0.2%，隨存隨取</small></div>${btn('toast','之後接上','存入','sm')}</div><div class=card><span class=ic>🔒</span><div class=nm>定期<small>3 天 1.2% · 7 天 3.5% · 14 天 9%</small></div>${btn('toast','之後接上','存入','sm')}</div><div class=card><span class=ic>💸</span><div class=nm>貸款<small>日息 0.8%，額度隨資產成長</small></div>${btn('toast','之後接上','借款','sm')}</div>`,
 ledger:`<div class=stats><div>總資產<b>${f(S.money+9000)}</b></div><div>累計營業額<b>$16,755</b></div><div>累計服務<b>599 人</b></div></div><div class=chart>${[3,2.5,5,6.5,3,4.5,3.8].map((v,i)=>`<div style="height:${v*14}px"><span>D${i+3}</span></div>`).join('')}</div><div class=ln style="margin-top:22px"><span>最佳單日利潤</span><b>$1,093</b></div><div class=ln><span>完美找零</span><b>72 次</b></div><div class=ln><span>顧客流失</span><b>18 人</b></div>`}[S.sub];
 return `<div class=chips>${SUBS.map(([k,n])=>btn('sub',k,n,'chip'+(S.sub===k?' on':''))).join('')}</div>${sub}`}
function rFood(){if(!S.own.hot)return `<div class=c><div style="font-size:40px">🍢</div><b>還沒有熱食檔口</b><p>買了才能賣關東煮、茶葉蛋、熱狗，每道菜要先備食材</p>${btn('tab','exp','去擴店 → 設備','btn')}</div>`;
 return `<div class=hd><span>熱食菜單</span><small>價格自己定</small></div>`+[['🍢','關東煮',12,25],['🥚','茶葉蛋',8,15],['🌭','熱狗',14,30],['🍠','烤地瓜',18,40]].map(([i,n,c,p])=>`<div class=row><span class=ic>${i}</span><div class=nm>${n}<small>成本 ${f(c)} · 售價 ${f(p)} · 每份毛利 ${Math.round((p-c)/p*100)}%</small></div>${btn('toast','之後接上','上架','sm g')}</div>`).join('')}
function rSet(){const row=(n,d,b)=>`<div class=row><div class=nm>${n}<small>${d}</small></div>${b}</div>`;
 return `<div class=hd><span>設定</span></div>`+row('畫質','卡頓時選流暢',btn('toast','之後接上','標準','sm g'))+row('同屏顧客','少一點更流暢',btn('toast','之後接上','正常','sm g'))+row('超市名字','日日鮮超市',btn('toast','之後接上','改名','sm g'))+row('雲存檔','之後用 Firebase 接上',btn('toast','之後接上','同步','sm g'))+row('玩法說明','','')+`<div style="margin-top:12px">${btn('reset','x','重新開店','btn g w')}</div>`}
function render(){$('tabs').innerHTML=TABS.map(([k,i,n])=>`<button class="tab${S.tab===k?' on':''}" data-a="tab" data-v="${k}"><b>${i}</b>${n}</button>`).join('');
 const keep=$('sheet').scrollTop;$('sheet').innerHTML='<div class=grab><i></i></div>'+({cash:rCash,shelf:rShelf,wh:rWh,price:rPrice,exp:rExp,food:rFood,set:rSet})[S.tab]();$('sheet').scrollTop=keep;hud()}
// ---- 動作 ----
function buy(v){const[k,id]=v.split('|'),it=CAT[k].find(x=>x[0]===id),pri=it[4];
 if(k==='staff'){S.hired[id]=!S.hired[id];toast(S.hired[id]?'已雇用 '+it[2]:'已解雇 '+it[2]);return}
 if(S.own[id])return toast('已經擁有了');if(S.money<pri)return toast('資金不足',1);
 S.money-=pri;S.own[id]=1;if(id==='hot'||id==='dine'||id==='cold')store.setVisible(id==='cold'?'coldroom':id,true);toast('已購買 '+it[2]);if(id==='member'){S.member.own=true;showMember()}}
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
 else if(a==='fix'){const x=FIXT[v];if(S.lv<x.lv)toast('Lv'+x.lv+' 才解鎖',1);else if(S.fix.length>=SPEC(S.lv).shelf)toast('沒空位了，先升級店鋪',1);else if(S.money<x.price)toast('資金不足',1);else{S.money-=x.price;S.fix.push(v);store.setFixtures(S.fix);toast('已購買 '+x.n)}}
 else if(a==='upcold'){const c=600*S.coldLv;if(S.coldLv>=5)toast('已是最大容量',1);else if(S.money<c)toast('資金不足',1);else{S.money-=c;S.coldLv++;toast('冷藏庫容量提升到 '+S.coldCap)}}
 else if(a==='quest'){S.qOpen=true;showQuest()}
 else if(a==='mclose'){S.qOpen=false;closeModal()}
 else if(a==='bstart')closeModal();
 else if(a==='disc'){S.member.disc=+v;toast('會員折扣設為 '+v+' 折');showMember()}
 else if(a==='upgrade'){const c=UPC[S.lv-1];if(canUp()){S.money+=500-c;S.lv++;toast('升級成「'+lvName(S.lv)+'」！')}else toast('升級條件還沒達成',1)}
 else if(a==='claim'){const d=S.daily[+v];if(d&&!d.done&&qv(d.k)>=d.goal){d.done=true;S.money+=d.reward;toast('領取 '+f(d.reward))}showQuest()}
 else if(a==='open'){S.phase='open';S.min=480;S.visit=0;store.setOpen(true);toast('開門營業！')}
 else if(a==='close'){S.phase='closed';store.setOpen(false);settle();return}
 else if(a==='next'){closeModal();S.day++;S.min=480;S.visit=0;S.phase='prep';S.orders.forEach(o=>pr(o.id).wh+=o.q);S.orders=[];S.daily=newDaily();S.stat=newStat();rollDay();showBrief()}
 else if(a==='reset'){location.reload();return}
 render()}
document.addEventListener('click',e=>{const b=e.target.closest('[data-a]');if(b)act(b.dataset.a,b.dataset.v??'x')});
function checkOrders(){const d=S.orders.filter(o=>S.min>=o.eta);if(d.length){d.forEach(o=>pr(o.id).wh+=o.q);S.orders=S.orders.filter(o=>S.min<o.eta);toast('📦 貨到了！');if(S.tab==='wh')render()}}
let lt=performance.now();(function loop(){requestAnimationFrame(loop);const n=performance.now(),dt=Math.min(.2,(n-lt)/1000);lt=n;
 if(S.phase==='open'&&S.min<1320){const o=Math.floor(S.min);S.min=Math.min(1320,S.min+dt*3);if(Math.floor(S.min)!==o){if(Math.random()<S.expect/840)S.visit++;checkOrders();hud()}}})(); // 遊戲時間每秒走 3 分鐘，一分鐘一分鐘平順地走
render();
store.setFixtures(S.fix);store.setOpen(false);focus();rollDay();showBrief();
{const app=$('app'),sh=$('sheet');let d=null;
 sh.addEventListener('pointerdown',e=>{if(!e.target.closest('.grab'))return;d={y:e.clientY,h:$('stage').clientHeight,m:false};sh.setPointerCapture(e.pointerId)});
 sh.addEventListener('pointermove',e=>{if(!d)return;const dy=e.clientY-d.y;if(Math.abs(dy)>5)d.m=true;if(d.m)app.style.setProperty('--sh',Math.min(76,Math.max(18,(d.h+dy)/app.clientHeight*100))+'%')});
 const end=()=>{if(!d)return;const S3=[22,44,70],cur=parseFloat(app.style.getPropertyValue('--sh'))||44;let t;if(!d.m){const i=S3.findIndex(x=>Math.abs(x-cur)<6);t=S3[(i+1)%3]}else t=S3.reduce((a,b)=>Math.abs(b-cur)<Math.abs(a-cur)?b:a);app.style.setProperty('--sh',t+'%');d=null};
 sh.addEventListener('pointerup',end);sh.addEventListener('pointercancel',end)}

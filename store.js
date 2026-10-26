// 整間店的 3D 場景（第 1 輪：戶外環境、倉庫棟、鏡頭切換、標籤氣泡、光影）
import * as THREE from 'three';
const rnd=n=>Math.floor(Math.random()*n);
const M=c=>new THREE.MeshLambertMaterial({color:c});
function box(w,h,d,c,x,y,z,p,o){const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),M(c));m.position.set(x,y,z);m.castShadow=m.receiveShadow=true;if(o){m.material.transparent=true;m.material.opacity=o;m.castShadow=false}if(p)p.add(m);return m}
const GC={},MC={};
const geo=(k,f)=>GC[k]||(GC[k]=f()),mat=c=>MC[c]||(MC[c]=M(c));
const cyl=(a,b,h,n)=>geo('c'+a+b+h+n,()=>new THREE.CylinderGeometry(a,b,h,n||10)),bx=(w,h,d)=>geo('b'+w+h+d,()=>new THREE.BoxGeometry(w,h,d));
function pm(g,c,x,y,z,p){const m=new THREE.Mesh(g,mat(c));m.position.set(x,y,z);p.add(m)}
function prod(id,p,x,y,z){const g=new THREE.Group();g.position.set(x,y,z);
 if(id==='water'){pm(cyl(.08,.08,.28),0xcfe9ff,0,.14,0,g);pm(cyl(.035,.07,.08),0xcfe9ff,0,.32,0,g);pm(cyl(.04,.04,.04),0x2d7ff9,0,.38,0,g);pm(cyl(.082,.082,.1),0x2d7ff9,0,.14,0,g)}
 else if(id==='cola'){pm(cyl(.09,.09,.3),0xd63030,0,.15,0,g);pm(cyl(.092,.092,.08),0xffffff,0,.15,0,g);pm(cyl(.09,.09,.03),0xdddddd,0,.31,0,g)}
 else if(id==='milk'){pm(bx(.17,.3,.14),0xf4f4f4,0,.15,0,g);pm(bx(.172,.1,.142),0x4a90e2,0,.12,0,g);pm(bx(.17,.05,.07),0xe6e6e6,0,.33,0,g)}
 else if(id==='chips'){pm(bx(.22,.32,.07),0xe8b830,0,.16,0,g);pm(bx(.1,.1,.075),0xd63030,0,.17,0,g);pm(bx(.22,.03,.09),0xc99a10,0,.33,0,g)}
 else if(id==='choco'){pm(bx(.22,.3,.05),0x6b3a1e,0,.15,0,g);pm(bx(.23,.08,.055),0xc0392b,0,.15,0,g)}
 else if(id==='noodle'){pm(cyl(.12,.085,.2),0xff8a3d,0,.1,0,g);pm(cyl(.125,.125,.03),0xffffff,0,.21,0,g);pm(cyl(.122,.122,.06),0xffd23f,0,.1,0,g)}
 else if(id==='biscuit'){pm(bx(.22,.28,.08),0xd9a066,0,.14,0,g);pm(bx(.23,.1,.085),0x2d7ff9,0,.14,0,g)}
 else if(id==='spicy'){pm(bx(.18,.3,.05),0xd63030,0,.15,0,g);pm(bx(.18,.04,.06),0xffd23f,0,.3,0,g)}
 else if(id==='tissue'){pm(bx(.26,.2,.18),0xf4f4f4,0,.1,0,g);pm(bx(.27,.07,.19),0x3fa65b,0,.12,0,g)}
 else if(id==='bread'){pm(bx(.26,.14,.14),0xc98a4b,0,.07,0,g);pm(bx(.22,.07,.12),0xd9a066,0,.17,0,g)}
 else if(id==='yogurt'){pm(cyl(.09,.07,.16),0xffc2d6,0,.08,0,g);pm(cyl(.095,.095,.02),0xffffff,0,.17,0,g)}
 else if(id==='beer'){pm(cyl(.09,.09,.3),0x2f8f4e,0,.15,0,g);pm(cyl(.092,.092,.07),0xe8b830,0,.15,0,g);pm(cyl(.09,.09,.03),0xdddddd,0,.31,0,g)}
 else if(id==='sausage'){pm(bx(.22,.28,.06),0xd94452,0,.14,0,g);pm(bx(.23,.07,.065),0xe8b830,0,.16,0,g)}
 else{pm(cyl(0,.14,.22,3),0xffffff,0,.11,0,g);pm(cyl(.07,.14,.08,3),0x1b2a1b,0,.04,0,g)}
 p.add(g);return g}
function person(sh,o={}){const g=new THREE.Group(),sk=[0xf1c9a5,0xc68e6a,0x8d5a3c][rnd(3)],hs=o.hat??rnd(4),hc=[0x1b1512,0x5a3a22,0x9a9a9a,0xc9a227][rnd(4)],pt=[0x2f3b5c,0x3a3a3a,0x5a4a3a][rnd(3)];
 box(.17,.45,.2,pt,-.11,.3,0,g);box(.17,.45,.2,pt,.11,.3,0,g);box(.19,.08,.26,0x222222,-.11,.04,.03,g);box(.19,.08,.26,0x222222,.11,.04,.03,g);
 box(.5,.6,.3,sh,0,.85,0,g);box(.52,.06,.32,0x333333,0,.57,0,g);if(o.vest)box(.52,.42,.04,o.vest,0,.85,.17,g);
 const arm=x=>{const a=new THREE.Group();a.position.set(x,1.12,0);box(.12,.5,.14,sh,0,-.25,0,a);box(.1,.1,.12,sk,0,-.54,0,a);g.add(a);return a};g.userData.arms=[arm(-.31),arm(.31)];
 box(.38,.36,.36,sk,0,1.35,0,g);box(.06,.07,.02,0x222222,-.09,1.37,.19,g);box(.06,.07,.02,0x222222,.09,1.37,.19,g);box(.08,.04,.02,0xf08a8a,-.15,1.28,.19,g);box(.08,.04,.02,0xf08a8a,.15,1.28,.19,g);box(.08,.025,.02,0x8a3b3b,0,1.25,.19,g);
 if(hs===2){const c=o.cap||[0xd94452,0x2d7ff9,0x3fa65b][rnd(3)];box(.4,.12,.4,c,0,1.6,0,g);box(.3,.03,.16,c,0,1.55,.26,g)}
 else{box(.4,.12,.4,hc,0,1.58,-.01,g);box(.4,.3,.08,hc,0,1.45,-.17,g);if(hs===1)box(.2,.2,.2,hc,0,1.74,-.05,g);if(hs===3){box(.1,.2,.38,hc,-.2,1.42,0,g);box(.1,.2,.38,hc,.2,1.42,0,g)}}
 return g}
function shelf(x,z,ry,ids,top,glass){const g=new THREE.Group(),fc=glass?0x3a6ea5:0x9aa5b8;g.position.set(x,0,z);g.rotation.y=ry;
 box(2.3,1.8,.08,fc,0,.9,-.3,g);box(.08,1.8,.65,fc,-1.15,.9,0,g);box(.08,1.8,.65,fc,1.15,.9,0,g);box(2.4,.18,.8,top,0,1.86,0,g);box(2.4,.05,.82,0xffffff,0,1.76,0,g);
 for(let l=0;l<4;l++){box(2.3,.06,.65,0xf4f4f8,0,.08+l*.52,0,g);box(2.3,.04,.04,top,0,.12+l*.52,.32,g);if(l<3)for(let i=0;i<5;i++)prod(ids[l%ids.length],g,-.88+i*.44,.11+l*.52,.06)}
 if(glass)box(2.2,1.6,.03,0xbfe3ff,0,.9,.33,g,.25);return g}
function counter(x,z){const g=new THREE.Group();g.position.set(x,0,z);
 box(2.2,.9,.9,0x3a404c,0,.45,0,g);box(2.2,.06,.95,0xe9edf2,0,.92,0,g);box(1.9,.06,.7,0x22262e,-.1,.96,0,g);for(let i=-4;i<=4;i++)box(.04,.065,.68,0x343a46,-.1+i*.2,.96,0,g);
 box(.55,.38,.05,0x4dd4ff,.8,1.5,-.1,g);box(.1,.3,.1,0x22262e,.8,1.25,-.1,g);box(.4,.1,.35,0x1a1d24,.75,1.03,.15,g);box(.22,.02,.12,0xff3b3b,.75,1.09,.15,g);
 box(.06,1.1,.8,0x9aa5b8,-1.1,1.4,0,g,.5);box(2.2,.1,.1,0x7a2a26,0,.9,.46,g);
 [0,1,2].forEach(i=>box(.45,.1,.32,0xe05a4a,-.55,1.05+i*.07,-.2,g));box(.05,.3,.05,0x9aa5b8,.35,1.15,.38,g);box(.26,.22,.03,0x2d7ff9,.35,1.3,.38,g);
 [-1.25,1.25].forEach(px=>box(.06,.9,.06,0x9aa5b8,px,.45,.75,g));box(2.5,.05,.05,0xd94452,0,.85,.75,g);
 return g}
function rack(sc,x,z,ry){const g=new THREE.Group();g.position.set(x,0,z);g.rotation.y=ry;
 [-1.1,1.1].forEach(px=>[-.35,.35].forEach(pz=>box(.08,2.2,.08,0x3a5fa0,px,1.1,pz,g)));
 for(let l=0;l<3;l++){box(2.3,.06,.8,0xe6e8ee,0,.2+l*.7,0,g);for(let i=0;i<4;i++)box(.5,.4,.55,0xc8955e,-.8+i*.55,.43+l*.7,0,g),box(.18,.1,.02,[0xd63030,0x2d7ff9,0xe8b830][(i+l)%3],-.8+i*.55,.45+l*.7,.29,g)}
 sc.add(g)}
const SHAPED=new Set(['water','cola','chips','noodle','biscuit','spicy','tissue','bread','milk','yogurt','beer','sausage','choco']);let IR;const IC={};
function icon(id){if(!SHAPED.has(id))return null;if(IC[id])return IC[id];
 if(!IR){IR=new THREE.WebGLRenderer({alpha:true,antialias:true,preserveDrawingBuffer:true});IR.setSize(96,96);IR.setClearColor(0,0)}
 const sc=new THREE.Scene();sc.add(new THREE.HemisphereLight(0xffffff,0xbbaa99,1.15));const d=new THREE.DirectionalLight(0xffffff,.6);d.position.set(1,2,3);sc.add(d);
 const g=new THREE.Group();prod(id,g,0,0,0);g.scale.setScalar(2.3);g.position.y=-.38;g.rotation.y=-.5;sc.add(g);
 const c=new THREE.PerspectiveCamera(30,1,.1,10);c.position.set(0,.15,2.3);c.lookAt(0,0,0);IR.render(sc,c);return IC[id]=IR.domElement.toDataURL()}
export function initStore(host){
 const R=new THREE.WebGLRenderer({antialias:true});R.setPixelRatio(Math.min(devicePixelRatio||1,2));R.shadowMap.enabled=true;R.shadowMap.type=THREE.PCFSoftShadowMap;host.prepend(R.domElement);
 const scene=new THREE.Scene();scene.background=new THREE.Color(0xbfe3d0);
 const cam=new THREE.PerspectiveCamera(40,1,.1,200);
 scene.add(new THREE.HemisphereLight(0xffffff,0xd9cbb8,.8));
 const dl=new THREE.DirectionalLight(0xffffff,.6);dl.position.set(8,18,10);dl.castShadow=true;dl.shadow.mapSize.set(1024,1024);dl.shadow.bias=-.0006;
 Object.assign(dl.shadow.camera,{left:-24,right:16,top:14,bottom:-14,near:1,far:50});dl.target.position.set(-4,0,0);scene.add(dl,dl.target);
 // 戶外：草地、人行道、馬路、背景大樓、樹
 const grass=box(140,.1,140,0x86c065,0,-.1,0,scene);
 box(60,.08,1.8,0xd9d4cc,-2,-.03,7.6,scene);box(80,.06,4.2,0x8d8d96,0,-.04,11,scene);for(let i=-6;i<=6;i++)box(2,.07,.2,0xf4f4f4,i*4,0,11,scene);
 const wm=M(0x6f9ac4);
 [[-24,-18,8,12,0xd98c8c],[-14,-20,9,9,0xe6cf8a],[-3,-19,8,14,0x9ab8d9],[8,-20,9,10,0xe3a6a0],[19,-19,8,13,0xb9d4a8],[-30,-6,6,9,0xcfa6d9]].forEach(([x,z,w,h,c])=>{box(w,h,6,c,x,h/2,z,scene);
  for(let r=0;r<Math.floor(h/2.4);r++)for(let i=0;i<Math.floor(w/2.4);i++){const p=new THREE.Mesh(new THREE.PlaneGeometry(1.1,1.3),wm);p.position.set(x-w/2+1.5+i*2.4,1.8+r*2.4,z+3.02);scene.add(p)}});
 const tree=(x,z,s)=>{box(.3*s,1.5*s,.3*s,0x7a4a2b,x,.75*s,z,scene);const c=new THREE.Mesh(new THREE.IcosahedronGeometry(1.2*s,0),M(0x4fae4a));c.position.set(x,2.3*s,z);c.castShadow=true;scene.add(c)};
 [[-10,-9,1.2],[11,-10,1.3],[-22,5,1.1],[14,8.2,.9],[-19,9,1],[22,-6,1.2]].forEach(a=>tree(...a));
 // 店面地板與牆
 const fc=document.createElement('canvas');fc.width=fc.height=64;const fg=fc.getContext('2d');fg.fillStyle='#f3e7d8';fg.fillRect(0,0,64,64);fg.fillStyle='#e4d3be';fg.fillRect(0,0,32,32);fg.fillRect(32,32,32,32);
 const ft=new THREE.CanvasTexture(fc);ft.wrapS=ft.wrapT=THREE.RepeatWrapping;ft.repeat.set(8,6);ft.magFilter=THREE.NearestFilter;
 const floor=new THREE.Mesh(new THREE.PlaneGeometry(16,12),new THREE.MeshLambertMaterial({map:ft}));floor.rotation.x=-Math.PI/2;floor.receiveShadow=true;scene.add(floor);
 const walls=[box(16.4,2.8,.2,0xf6ede2,0,1.4,-6.1,scene),box(.2,1,4.7,0xf6ede2,-8.1,.5,-3.85,scene),box(.2,1,5.6,0xf6ede2,-8.1,.5,3.3,scene),box(.2,1,4.6,0xf6ede2,8.1,.5,-3.8,scene),box(.2,1,5.6,0xf6ede2,8.1,.5,3.3,scene),box(13.4,1,.2,0xf6ede2,-1.5,.5,6.1,scene),box(1,1,.2,0xf6ede2,7.7,.5,6.1,scene)];
 box(16.6,.35,.3,0xc0392b,0,2.6,-6.05,scene);box(.08,1.3,4.6,0xbfe3ff,8.1,1.65,-3.8,scene,.2);box(.08,1.3,5.6,0xbfe3ff,8.1,1.65,3.3,scene,.2);const rwFill=new THREE.Group();scene.add(rwFill);box(.2,1,2,0xf6ede2,8.1,.5,-.5,rwFill);box(.08,1.3,2,0xbfe3ff,8.1,1.65,-.5,rwFill,.2);walls.push(rwFill.children[0]);box(13.2,1.3,.08,0xbfe3ff,-1.5,1.65,6.1,scene,.2);box(.9,1.3,.08,0xbfe3ff,7.7,1.65,6.1,scene,.2);
 [5.2,7.2].forEach(x=>box(.15,2.3,.15,0xff5a4e,x,1.15,6.1,scene));box(2.2,.35,.2,0xff5a4e,6.2,2.45,6.1,scene);box(1.8,.04,1.2,0xd94452,6.2,.03,5.6,scene);for(let i=0;i<8;i++)box(.28,.1,1.3,i%2?0xffffff:0xd94452,5.2+i*.28,2.62,6.75,scene);
 [-1.5,.5].forEach(z=>box(.3,2.3,.2,0x9aa5b8,-8.1,1.15,z,scene));box(.3,.35,2.2,0x9aa5b8,-8.1,2.3,-.5,scene);box(1.4,.04,2,0xc4c4cc,-8.2,.01,-.5,scene);
 // 倉庫棟（在店的左邊）
 const wf=box(9.6,.1,7.6,0xc4c4cc,-13,-.05,-2.5,scene);box(9.6,1.6,.2,0xb8b8c0,-13,.8,-6.1,scene);box(.2,1.6,7.6,0xb8b8c0,-17.8,.8,-2.5,scene);box(9.6,.5,.2,0xb8b8c0,-13,.25,1.3,scene);box(9.6,.3,.25,0xc0392b,-13,1.55,-6.05,scene);
 [-16,-13.4,-10.8].forEach(x=>rack(scene,x,-5.3,0));rack(scene,-17,-3,Math.PI/2);rack(scene,-17,-.4,Math.PI/2);
 for(let r=0;r<2;r++)for(let i=0;i<3-r;i++)box(.7,.5,.6,0xc8955e,-11.6+i*.75+r*.37,.25+r*.5,-3.4,scene);
 const coldroom=new THREE.Group();coldroom.visible=false;scene.add(coldroom);box(3,2.4,2.4,0xf5f7fa,-14,1.2,0,coldroom);box(1.1,1.9,.06,0x3a6ea5,-14,.97,1.23,coldroom);
 // 貨架（UI 會讀這份清單）
 const OR=0xff8a3d,BL=0x3a7bd5,opt={coldroom};
 const lbl=[],W={w:1,h:1};
 function label(html,x,y,z,vis,fx){const e=document.createElement('div');e.className='lb';e.innerHTML=html;host.appendChild(e);lbl.push({e,v:new THREE.Vector3(x,y,z),vis,fx})}
 label('倉庫 →',-8.1,2.75,-.5);label('冷藏庫',-14,2.7,0,()=>coldroom.visible);
 // 賣場上的貨架／櫃台：由玩家買了什麼決定（Lv1 最多 4 個貨架位，冷藏櫃、果蔬台、臨期區要 Lv2 才能買）
 const POS=[[-6,-5.4],[-3.4,-5.4],[-.8,-5.4],[1.9,-5.4],[4.5,-5.4],[-5,-2],[-2.2,-2],[1.2,-2],[3.8,-2.2]];
 const AMB=[['飲料·零食',['water','cola','chips']],['速食·零食',['noodle','biscuit','spicy']],['零食·日用',['tissue','bread','chips']],['飲料·日用',['cola','water','noodle']],['零食·速食',['biscuit','chips','spicy']],['飲料·零食',['water','cola','bread']]];
 const fixG=new THREE.Group();scene.add(fixG);
 function mkVeg(g){const sg=new THREE.SphereGeometry(.13,8,6);for(let i=0;i<3;i++){box(.9,.45,.8,0xb98b5e,-1+i,.22,0,g);for(let k=0;k<7;k++){const m=new THREE.Mesh(sg,M([0xd63030,0x3fa65b,0xff8a3d][i]));m.position.set(-1+i+(k%3-1)*.25,.52,(Math.floor(k/3)-1)*.25);g.add(m)}}}
 function setFixtures(types){while(fixG.children.length)fixG.remove(fixG.children[0]);for(let i=lbl.length-1;i>=0;i--)if(lbl[i].fx===true){lbl[i].e.remove();lbl.splice(i,1)}
  let a=0;types.forEach((t,i)=>{const[x,z]=POS[i];let g,tx;
   if(t==='shelf'){const d=AMB[a++%AMB.length];g=shelf(0,0,0,d[1],a%2?OR:BL);tx=d[0]}
   else if(t==='cold'){g=shelf(0,0,0,['milk','yogurt','beer'],BL,1);tx='冷藏櫃'}
   else if(t==='produce'){g=new THREE.Group();mkVeg(g);tx='生鮮果蔬'}
   else if(t==='clear'){g=new THREE.Group();box(1.8,.8,.9,0xd94452,0,.4,0,g);box(1.9,.08,1,0xe8b830,0,.84,0,g);for(let k=0;k<4;k++)box(.3,.3,.3,[0xe8b830,0xf4f4f4,0x4aa3ff][k%3],-.6+k*.4,1,0,g);tx='臨期 <em>7折</em>'}
   else{g=new THREE.Group();box(2,.8,1,0xf4f6fa,0,.4,0,g);box(1.9,.08,.9,0xbfe3ff,0,.84,0,g,.5);for(let k=0;k<5;k++)box(.3,.12,.5,[0xff9bb0,0x9bd0ff,0xffe08a][k%3],-.7+k*.35,.8,0,g);tx='冷凍櫃'}
   g.position.set(x,0,z);fixG.add(g);label(tx,x,(t==='shelf'||t==='cold')?2.3:1.6,z,null,true)})}
 const CPOS=[1.2,4.4,-2],cG=new THREE.Group();scene.add(cG);
 function setCounters(reg,cashiers){while(cG.children.length)cG.remove(cG.children[0]);for(let i=lbl.length-1;i>=0;i--)if(lbl[i].fx==='c'){lbl[i].e.remove();lbl.splice(i,1)}
  for(let i=0;i<Math.min(reg,CPOS.length);i++){const x=CPOS[i];cG.add(counter(x,3));const p=i===0?person(0x2d7ff9,{hat:2,cap:0x2d7ff9,vest:0xffffff}):(i<=cashiers?person(0xd94452,{hat:2,cap:0xd94452,vest:0xffffff}):null);if(p){p.position.set(x,0,2.05);cG.add(p)}label((i+1)+'號台',x,2.4,2.6,null,'c')}}
 setCounters(2,0);
 const hot=new THREE.Group();hot.position.set(-6.4,0,4.9);box(2.4,.9,.9,0xb85c38,0,.45,0,hot);box(2.2,.5,.7,0xffb347,0,1.15,0,hot,.65);
 const dine=new THREE.Group();
 box(6.7,.1,8.2,0xe6d3b8,11.55,-.05,-.4,dine);box(.5,.02,2,0xe6d3b8,8.1,.01,-.5,dine);
 box(6.9,2.8,.2,0xf6ede2,11.55,1.4,-4.6,dine);box(6.9,.35,.3,0xc0392b,11.55,2.6,-4.55,dine);
 box(.2,1,8.2,0xf6ede2,14.9,.5,-.4,dine);box(.08,1.3,8.2,0xbfe3ff,14.9,1.65,-.4,dine,.2);
 box(6.9,1,.2,0xf6ede2,11.55,.5,3.7,dine);box(6.9,1.3,.08,0xbfe3ff,11.55,1.65,3.7,dine,.2);
 [-1.5,.5].forEach(z=>box(.3,2.3,.2,0x9aa5b8,8.1,1.15,z,dine));box(.3,.35,2.2,0x9aa5b8,8.1,2.3,-.5,dine);
 [[10.3,-2.6],[12.9,-2.6],[10.3,.8],[12.9,.8]].forEach(([x,z])=>{box(1.1,.06,1.1,0xd9c3a5,x,.75,z,dine);box(.1,.72,.1,0x8a6a4a,x,.38,z,dine);[-.85,.85].forEach(o=>box(.4,.4,.4,0xe05a4a,x+o,.2,z,dine))});
 hot.visible=dine.visible=false;scene.add(hot,dine);opt.hot=hot;opt.dine=dine;label('熱食檔口',-6.4,2,4.9,()=>hot.visible);label('就餐區',11.55,2.2,-.5,()=>dine.visible);
 [[-7.5,-5.4],[7.5,-5.4],[7.5,5.3]].forEach(([x,z])=>{const g=new THREE.Group();g.position.set(x,0,z);const c=new THREE.Mesh(new THREE.CylinderGeometry(.25,.2,.4,10),M(0xc0713d));c.position.y=.2;g.add(c);const l=new THREE.Mesh(new THREE.SphereGeometry(.45,8,6),M(0x3fa65b));l.position.y=.85;l.castShadow=true;g.add(l);scene.add(g)});
 // 逛店顧客（開門後才出現）
 const WP=[[-5.5,.6],[-2.5,.6],[1.5,-.8],[5,-.3],[6.5,1.8],[0,1.6],[-6.5,-.4],[3.4,.4],[-3,1.8]];
 // 顧客從外面人行道走來，進門逛店，再走出門離開
 const SW=7.6,DOOR=[6.2,6.9],IN=[6.2,5],cust=[],COL=[0xe05a4a,0x3fa65b,0x6a5acd,0xf2a33a,0x2d7ff9,0xc2185b];
 function spawnCustomer(){if(cust.length>=12)return;const fl=Math.random()<.5,m=person(COL[rnd(6)]);m.position.set(fl?-24:24,0,SW+(Math.random()-.5)*.6);scene.add(m);
  const path=[[DOOR[0]+(Math.random()-.5)*.8,SW],DOOR,IN];for(let i=0,n=2+rnd(3);i<n;i++)path.push([...WP[rnd(WP.length)],1.2]);path.push(IN,DOOR,[DOOR[0]+(fl?-8:8),SW],[fl?-27:27,SW]);cust.push({m,path,i:0,wait:0})}
 function leaveAll(){cust.forEach(c=>{c.path=[DOOR,[DOOR[0]+8,SW],[27,SW]];c.i=0;c.wait=0})}
 const ring=new THREE.Mesh(new THREE.RingGeometry(1.3,1.5,32),new THREE.MeshBasicMaterial({color:0xffc400,side:THREE.DoubleSide}));ring.rotation.x=-Math.PI/2;ring.position.y=.05;ring.visible=false;scene.add(ring);
 // 鏡頭：預設位置會順順滑過去；單指旋轉、雙指縮放
 const PRE={all:{x:-1,z:.5,az:.62,el:.9,dist:25},cash:{x:2.8,z:3.4,az:.45,el:.62,dist:8},wh:{x:-13,z:-2.5,az:.6,el:1,dist:15},shelves:{x:-1,z:-4,az:.35,el:.75,dist:16},food:{x:-5,z:4.5,az:.5,el:.85,dist:13},dine:{x:10,z:-.4,az:.55,el:.85,dist:17}};
 const goal={...PRE.all},cur={...PRE.all},pts=new Map(),cv=R.domElement;
 const place=()=>{cam.position.set(cur.x+Math.sin(cur.az)*Math.cos(cur.el)*cur.dist,.6+Math.sin(cur.el)*cur.dist,cur.z+Math.cos(cur.az)*Math.cos(cur.el)*cur.dist);cam.lookAt(cur.x,.6,cur.z)};
 const pd=()=>{const a=[...pts.values()];return Math.hypot(a[0].x-a[1].x,a[0].y-a[1].y)};
 cv.addEventListener('pointerdown',e=>{cv.setPointerCapture(e.pointerId);pts.set(e.pointerId,{x:e.clientX,y:e.clientY})});
 cv.addEventListener('pointermove',e=>{const p=pts.get(e.pointerId);if(!p)return;
  if(pts.size===2){const o=pd();p.x=e.clientX;p.y=e.clientY;goal.dist=Math.min(34,Math.max(7,goal.dist*o/pd()))}
  else{goal.az=Math.min(1.25,Math.max(.1,goal.az-(e.clientX-p.x)*.007));goal.el=Math.min(1.2,Math.max(.45,goal.el+(e.clientY-p.y)*.005));p.x=e.clientX;p.y=e.clientY}});
 const up=e=>pts.delete(e.pointerId);cv.addEventListener('pointerup',up);cv.addEventListener('pointercancel',up);
 const fit=()=>{const w=host.clientWidth,h=host.clientHeight;if(!w||!h)return;W.w=w;W.h=h;R.setSize(w,h);cam.aspect=w/h;cam.updateProjectionMatrix()};
 new ResizeObserver(fit).observe(host);fit();
 let t=0;(function loop(){requestAnimationFrame(loop);t+=.016;
  for(const k in goal)cur[k]+=(goal[k]-cur[k])*.08;place();
  for(let i=cust.length-1;i>=0;i--){const c=cust[i],p=c.m.position;if(c.wait>0){c.wait-=.016;continue}const pt=c.path[c.i];if(!pt){scene.remove(c.m);cust.splice(i,1);continue}
   const dx=pt[0]-p.x,dz=pt[1]-p.z,d=Math.hypot(dx,dz);if(d<.12){c.wait=pt[2]||0;c.i++}else{p.x+=dx/d*.045;p.z+=dz/d*.045;c.m.rotation.y=Math.atan2(dx,dz);p.y=Math.abs(Math.sin(t*9))*.04;const a=c.m.userData.arms;if(a){a[0].rotation.x=Math.sin(t*9)*.7;a[1].rotation.x=-Math.sin(t*9)*.7}}}
  R.render(scene,cam);cam.updateMatrixWorld();
  const hH=document.getElementById('hud').offsetHeight+4;lbl.forEach(l=>{if(l.vis&&!l.vis()){l.e.style.display='none';return}const p=l.v.clone().project(cam),yy=(-p.y*.5+.5)*W.h;if(p.z>1||yy<hH||W.h<240){l.e.style.display='none';return}
   l.e.style.display='';l.e.style.transform=`translate(${(p.x*.5+.5)*W.w}px,${(-p.y*.5+.5)*W.h}px) translate(-50%,-100%)`})})();
 return{setFixtures,setVisible:(k,v)=>{if(opt[k])opt[k].visible=v;if(k==='dine')rwFill.visible=!v},setWall:c=>walls.forEach(w=>w.material.color.setHex(c)),setOpen:b=>{if(!b)leaveAll()},spawnCustomer,setCounters,icon,
  focus:n=>{let p=PRE[n];if(!p&&n.startsWith('shelf')){const s=POS[+n.slice(5)];if(s)p={x:s[0],z:s[1]+.5,az:.3,el:.7,dist:9}}if(p)Object.assign(goal,p)},
  mark:i=>{if(i<0||!POS[i]){ring.visible=false;return}ring.visible=true;ring.position.x=POS[i][0];ring.position.z=POS[i][1]+.3}}}

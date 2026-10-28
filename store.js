// 整間店的 3D 場景（第 4 版：店面隨等級放大、員工與設備會出現在場景、顧客用格子尋路、蔬果台／冷凍櫃／即期區新外觀）
import * as THREE from 'three';
const rnd=n=>Math.floor(Math.random()*n);
const M=c=>new THREE.MeshLambertMaterial({color:c});
function box(w,h,d,c,x,y,z,p,o){const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),M(c));m.position.set(x,y,z);m.castShadow=m.receiveShadow=true;if(o){m.material.transparent=true;m.material.opacity=o;m.castShadow=false}if(p)p.add(m);return m}
const GC={},MC={};
const geo=(k,f)=>GC[k]||(GC[k]=f()),mat=c=>MC[c]||(MC[c]=M(c));
const cyl=(a,b,h,n)=>geo('c'+a+'_'+b+'_'+h+'_'+n,()=>new THREE.CylinderGeometry(a,b,h,n||10)),bx=(w,h,d)=>geo('b'+w+'_'+h+'_'+d,()=>new THREE.BoxGeometry(w,h,d)),sph=r=>geo('s'+r,()=>new THREE.SphereGeometry(r,10,8));
function pm(g,c,x,y,z,p,rx,ry,rz){const m=new THREE.Mesh(g,mat(c));m.position.set(x,y,z);if(rx||ry||rz)m.rotation.set(rx||0,ry||0,rz||0);p.add(m);return m}
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
 else if(id==='bread'){pm(bx(.26,.1,.14),0xc98a4b,0,.05,0,g);pm(cyl(.075,.075,.26,10),0xd9a066,0,.15,0,g,0,0,Math.PI/2);pm(bx(.05,.02,.1),0xf2d9a8,-.06,.23,0,g);pm(bx(.05,.02,.1),0xf2d9a8,.06,.23,0,g)}
 else if(id==='yogurt'){pm(cyl(.09,.07,.16),0xffc2d6,0,.08,0,g);pm(cyl(.095,.095,.02),0xffffff,0,.17,0,g)}
 else if(id==='beer'){pm(cyl(.09,.09,.3),0x2f8f4e,0,.15,0,g);pm(cyl(.092,.092,.07),0xe8b830,0,.15,0,g);pm(cyl(.09,.09,.03),0xdddddd,0,.31,0,g)}
 else if(id==='sausage'){pm(bx(.22,.28,.06),0xd94452,0,.14,0,g);pm(bx(.23,.07,.065),0xe8b830,0,.16,0,g)}
 else if(id==='apple'){pm(sph(.095),0xd63030,0,.1,0,g);pm(cyl(.01,.01,.05,5),0x6b3a1e,0,.2,0,g);pm(bx(.06,.01,.03),0x3fa65b,.04,.21,0,g)}
 else if(id==='banana'){[-.05,0,.05].forEach((o,i)=>{pm(cyl(.03,.03,.22,6),0xf2d13a,o,.12,(i-1)*.03,g,0,0,.4-i*.1);pm(cyl(.014,.014,.04,5),0x6b4a1e,o-.045,.24,(i-1)*.03,g)})}
 else if(id==='tomato'){pm(sph(.09),0xe03a2e,0,.09,0,g);pm(cyl(.04,.04,.015,5),0x3fa65b,0,.185,0,g)}
 else if(id==='egg'){pm(bx(.28,.06,.19),0xd9c3a5,0,.03,0,g);for(let i=0;i<3;i++)for(let j=0;j<2;j++)pm(sph(.04),0xfff6e3,-.08+i*.08,.09,-.045+j*.09,g)}
 else if(id==='strawberry'){pm(bx(.2,.07,.16),0xf4f4f4,0,.035,0,g);for(let i=0;i<4;i++){const x=-.065+(i%2)*.13,z=-.035+Math.floor(i/2)*.07;pm(sph(.045),0xe0304a,x,.1,z,g);pm(cyl(.03,.03,.012,5),0x3fa65b,x,.15,z,g)}}
 else if(id==='icecream'){pm(cyl(.05,.008,.14,8),0xd9a066,0,.07,0,g);pm(sph(.07),0xff9bb0,0,.17,0,g)}
 else if(id==='dumpling'){pm(bx(.22,.3,.06),0xf4f6fa,0,.15,0,g);pm(bx(.22,.09,.065),0x2d7ff9,0,.2,0,g);pm(sph(.05),0xfff1d6,0,.09,.035,g)}
 else{pm(cyl(0,.14,.22,3),0xffffff,0,.11,0,g);pm(cyl(.07,.14,.08,3),0x1b2a1b,0,.04,0,g)}
 p.add(g);return g}
function person(sh,o={}){const g=new THREE.Group(),sk=[0xf1c9a5,0xc68e6a,0x8d5a3c][rnd(3)],hs=o.hat??rnd(4),hc=[0x1b1512,0x5a3a22,0x9a9a9a,0xc9a227][rnd(4)],pt=o.pants||[0x2f3b5c,0x3a3a3a,0x5a4a3a][rnd(3)];
 box(.17,.45,.2,pt,-.11,.3,0,g);box(.17,.45,.2,pt,.11,.3,0,g);box(.19,.08,.26,0x222222,-.11,.04,.03,g);box(.19,.08,.26,0x222222,.11,.04,.03,g);
 box(.5,.6,.3,sh,0,.85,0,g);box(.52,.06,.32,0x333333,0,.57,0,g);if(o.vest)box(.52,.42,.04,o.vest,0,.85,.17,g);
 const arm=x=>{const a=new THREE.Group();a.position.set(x,1.12,0);box(.12,.5,.14,sh,0,-.25,0,a);box(.1,.1,.12,sk,0,-.54,0,a);g.add(a);return a};g.userData.arms=[arm(-.31),arm(.31)];
 box(.38,.36,.36,sk,0,1.35,0,g);box(.06,.07,.02,0x222222,-.09,1.37,.19,g);box(.06,.07,.02,0x222222,.09,1.37,.19,g);box(.08,.04,.02,0xf08a8a,-.15,1.28,.19,g);box(.08,.04,.02,0xf08a8a,.15,1.28,.19,g);box(.08,.025,.02,0x8a3b3b,0,1.25,.19,g);
 if(o.mask)box(.4,.17,.03,0x15151a,0,1.29,.2,g);if(hs===2){const c=o.cap||[0xd94452,0x2d7ff9,0x3fa65b][rnd(3)];box(.4,.12,.4,c,0,1.6,0,g);box(.3,.03,.16,c,0,1.55,.26,g)}
 else{box(.4,.12,.4,hc,0,1.58,-.01,g);box(.4,.3,.08,hc,0,1.45,-.17,g);if(hs===1)box(.2,.2,.2,hc,0,1.74,-.05,g);if(hs===3){box(.1,.2,.38,hc,-.2,1.42,0,g);box(.1,.2,.38,hc,.2,1.42,0,g)}}
 return g}
// ===== 走路：速度平滑、轉向平滑、轉角不停頓（用真實經過時間 dt，不受螢幕更新率影響）=====
const ANG=(a,b)=>{let d=b-a;while(d>Math.PI)d-=2*Math.PI;while(d<-Math.PI)d+=2*Math.PI;return d};
function gait(m,sp,dt){const u=m.userData,a=u.arms;u.ph=(u.ph||0)+sp*dt*3.4;const k=Math.min(1,sp/1.6);if(a){a[0].rotation.x=Math.sin(u.ph)*.7*k;a[1].rotation.x=-Math.sin(u.ph)*.7*k}m.position.y=Math.abs(Math.sin(u.ph))*.04*k}
function step(m,pt,dt,vmax,stop,t){const u=m.userData,p=m.position,dx=pt[0]-p.x,dz=pt[1]-p.z,d=Math.hypot(dx,dz),want=stop?Math.min(vmax,.35+d*3):vmax,k=Math.min(1,dt*8),tx=d>1e-4?dx/d*want:0,tz=d>1e-4?dz/d*want:0;
 u.vx=(u.vx||0)+(tx-(u.vx||0))*k;u.vz=(u.vz||0)+(tz-(u.vz||0))*k;p.x+=u.vx*dt;p.z+=u.vz*dt;
 const sp=Math.hypot(u.vx,u.vz);if(sp>.2)m.rotation.y+=ANG(m.rotation.y,Math.atan2(u.vx,u.vz))*Math.min(1,dt*9);gait(m,sp,dt);return d}
function idle(m,dt,face){const u=m.userData,p=m.position,k=Math.exp(-dt*12);u.vx=(u.vx||0)*k;u.vz=(u.vz||0)*k;p.x+=u.vx*dt;p.z+=u.vz*dt;
 if(face!==undefined&&face!==null)m.rotation.y+=ANG(m.rotation.y,face)*Math.min(1,dt*8);
 const a=u.arms,j=Math.min(1,dt*10);if(a){a[0].rotation.x*=1-j;a[1].rotation.x*=1-j}p.y*=1-j}
function shelf(ids,top){const g=new THREE.Group(),fc=0x9aa5b8;
 box(2.3,1.8,.08,fc,0,.9,-.3,g);box(.08,1.8,.65,fc,-1.15,.9,0,g);box(.08,1.8,.65,fc,1.15,.9,0,g);box(2.4,.18,.8,top,0,1.86,0,g);box(2.4,.05,.82,0xffffff,0,1.76,0,g);
 for(let l=0;l<4;l++){box(2.3,.06,.65,0xf4f4f8,0,.08+l*.52,0,g);box(2.3,.04,.04,top,0,.12+l*.52,.32,g);if(l<3&&ids[l])for(let i=0;i<5;i++)REG.push({id:ids[l],k:i,g:prod(ids[l],g,-.88+i*.44,.11+l*.52,.06)})}
 return g}
// 冷藏櫃：白色頂箱＋玻璃門＋藍邊層板
function coldCab(ids){const g=new THREE.Group(),F=0x8fa8c4,BL=0x2d7ff9;
 box(2.4,.14,.95,0x2a2f3a,0,.07,0,g);box(2.3,1.7,.08,F,0,1,-.36,g);box(.08,1.7,.8,F,-1.15,1,0,g);box(.08,1.7,.8,F,1.15,1,0,g);
 for(let l=0;l<3;l++){box(2.3,.05,.72,0xdcecf8,0,.2+l*.55,0,g);box(2.3,.06,.04,BL,0,.23+l*.55,.36,g);if(ids[l])for(let i=0;i<5;i++)REG.push({id:ids[l],k:i,g:prod(ids[l],g,-.88+i*.44,.225+l*.55,.04)})}
 box(2.5,.55,1,0xffffff,0,2.08,0,g);box(2.4,.07,.05,BL,0,1.78,.5,g);box(2.3,1.5,.03,0xbfe3ff,0,1.0,.4,g,.22);return g}
// 冷凍櫃：白色臥式櫃身＋藍條，三格開口各放一種商品
function freezerCab(ids){const g=new THREE.Group();
 box(2.4,.72,1.1,0xf2f4f7,0,.36,0,g);box(2.42,.1,1.12,0x2d8fc4,0,.45,0,g);box(2.44,.08,1.14,0x2a2f3a,0,.04,0,g);
 box(2.4,.06,.08,0xffffff,0,.78,.51,g);box(2.4,.06,.08,0xffffff,0,.78,-.51,g);box(.08,.06,1.1,0xffffff,-1.16,.78,0,g);box(.08,.06,1.1,0xffffff,1.16,.78,0,g);
 box(2.2,.02,.9,0xcfe8f5,0,.72,0,g);[-.4,.4].forEach(x=>box(.05,.22,.95,0xffffff,x,.84,0,g));
 [-.8,0,.8].forEach((cx,j)=>{if(ids[j])for(let a=0;a<3;a++)for(let b=0;b<3;b++)REG.push({id:ids[j],k:a*3+b,n:9,g:prod(ids[j],g,cx+(a-1)*.2,.73,(b-1)*.27)})});
 return g}
// 蔬果台：木頭台面三個木箱，綠色頂棚
function produceStand(ids){const g=new THREE.Group(),WD=0x7a4a2b;
 box(2.55,.4,.95,WD,0,.2,0,g);[-1.28,1.28].forEach(x=>box(.1,2.05,.1,WD,x,1.03,-.38,g));box(2.7,.1,.7,0x3fa65b,0,2.08,-.12,g);box(2.7,.18,.06,0x2e8a4a,0,1.98,.22,g);
 [0,1,2].forEach(j=>{const cx=-.85+j*.85;box(.8,.26,.74,0xb98b5e,cx,.52,-.04,g);box(.68,.03,.62,0x6b4426,cx,.64,-.04,g);if(ids[j])for(let a=0;a<3;a++)for(let b=0;b<3;b++){const it=prod(ids[j],g,cx+(a-1)*.2,.66,-.04+(b-1)*.2);it.scale.setScalar(.8);REG.push({id:ids[j],k:a*3+b,n:9,g:it})}});
 return g}
// 即期特價區：紅色櫃身＋黃色邊框＋紅色招牌，三個木箱
function clearStand(){const g=new THREE.Group(),Y=0xf2c230,RD=0xe84a3a,ids=['egg','strawberry','bread'];
 box(2.4,.8,1,RD,0,.4,0,g);box(2.5,.07,1.1,Y,0,.82,0,g);box(2.5,.07,1.1,Y,0,.05,0,g);
 [-1.2,1.2].forEach(x=>box(.1,1.95,.1,Y,x,.98,-.42,g));box(2.5,.42,.08,RD,0,1.78,-.42,g);box(2.6,.06,.1,Y,0,2.0,-.42,g);box(2.6,.06,.1,Y,0,1.56,-.42,g);
 [-.75,0,.75].forEach((cx,j)=>{box(.7,.2,.62,Y,cx,.93,.12,g);box(.6,.03,.52,0xffffff,cx,1.04,.12,g);for(let i=0;i<4;i++)REG.push({id:'_clear',k:i*3+j,n:12,g:prod(ids[j],g,cx+(i%2-.5)*.26,1.06,.12+(Math.floor(i/2)-.5)*.2)})});
 return g}
function counter(x,z,eq){const g=new THREE.Group();g.position.set(x,0,z);
 box(2.2,.9,.9,0x3a404c,0,.45,0,g);box(2.2,.06,.95,0xe9edf2,0,.92,0,g);box(1.9,.06,.7,0x22262e,-.1,.96,0,g);for(let i=-4;i<=4;i++)box(.04,.065,.68,0x343a46,-.1+i*.2,.96,0,g);
 box(.55,.38,.05,0x4dd4ff,.8,1.5,-.1,g);box(.1,.3,.1,0x22262e,.8,1.25,-.1,g);box(.4,.1,.35,0x1a1d24,.75,1.03,.15,g);box(.22,.02,.12,0xff3b3b,.75,1.09,.15,g);
 box(.06,1.1,.8,0x9aa5b8,-1.1,1.4,0,g,.5);box(2.2,.1,.1,0x7a2a26,0,.9,.46,g);
 [0,1,2].forEach(i=>box(.45,.1,.22,0xe05a4a,-.55,1+i*.07,.3,g));box(.05,.3,.05,0x9aa5b8,.35,1.15,.38,g);box(.26,.22,.03,0x2d7ff9,.35,1.3,.38,g);
 [-1.25,1.25].forEach(px=>box(.06,.9,.06,0x9aa5b8,px,.45,.75,g));box(2.5,.05,.05,0xd94452,0,.85,.75,g);
 if(eq){if(eq.change){box(.3,.22,.24,0xb7bcc6,-.95,1.06,.12,g);box(.2,.04,.05,0xffd23f,-.95,1.19,.2,g)}if(eq.scan){box(.1,.26,.1,0x3a404c,-.35,1.06,.28,g);box(.09,.1,.14,0xd63030,-.35,1.22,.3,g)}if(eq.pos){box(.36,.05,.26,0x1a1d24,.4,1.0,-.15,g);box(.3,.02,.2,0x33d6a6,.4,1.04,-.15,g)}}
 return g}
function rack(sc,x,z,ry){const g=new THREE.Group();g.position.set(x,0,z);g.rotation.y=ry;
 [-1.1,1.1].forEach(px=>[-.35,.35].forEach(pz=>box(.08,2.2,.08,0x3a5fa0,px,1.1,pz,g)));
 for(let l=0;l<3;l++){box(2.3,.06,.8,0xe6e8ee,0,.2+l*.7,0,g);for(let i=0;i<4;i++)box(.5,.4,.55,0xc8955e,-.8+i*.55,.43+l*.7,0,g),box(.18,.1,.02,[0xd63030,0x2d7ff9,0xe8b830][(i+l)%3],-.8+i*.55,.45+l*.7,.29,g)}
 sc.add(g)}
function cartModel(){const g=new THREE.Group();box(.5,.3,.8,0xcfd5df,0,.55,0,g,.5);box(.52,.03,.82,0x9aa5b8,0,.7,0,g);box(.52,.03,.82,0x9aa5b8,0,.4,0,g);box(.5,.03,.04,0xd94452,0,.95,-.44,g);[-.24,.24].forEach(x=>box(.03,.28,.03,0x9aa5b8,x,.8,-.43,g));[-.2,.2].forEach(x=>[-.3,.3].forEach(z=>pm(cyl(.05,.05,.04,8),0x333333,x,.05,z,g,0,0,Math.PI/2)));return g}
function kiosk(){const g=new THREE.Group();box(.5,1.1,.6,0xe9edf2,0,.55,0,g);box(.42,.3,.04,0x4dd4ff,0,1.0,.32,g);box(.3,.04,.2,0x22262e,0,.72,.38,g);box(.5,.12,.62,0x2d7ff9,0,1.18,0,g);box(.2,.12,.04,0x22262e,0,.5,.32,g);return g}
function bikeModel(){const g=new THREE.Group();box(1.1,.35,.4,0x00b4a2,0,.45,0,g);box(.5,.1,.35,0x222222,-.1,.68,0,g);box(.15,.5,.3,0x00b4a2,.5,.6,0,g);box(.5,.45,.45,0xffd23f,-.62,.9,0,g);[-.4,.4].forEach(x=>pm(cyl(.2,.2,.1,12),0x222222,x,.2,0,g,Math.PI/2,0,0));return g}
function camModel(){const g=new THREE.Group();box(.18,.14,.3,0x2b2f3a,0,0,0,g);pm(cyl(.04,.04,.08,8),0x66c8ff,0,0,.18,g,Math.PI/2,0,0);return g}
const REG=[];const SHAPED=new Set(['water','cola','chips','noodle','biscuit','spicy','tissue','bread','milk','yogurt','beer','sausage','choco','apple','banana','tomato','egg','strawberry','icecream','dumpling']);let IR;const IC={};
function icon(id){if(!SHAPED.has(id))return null;if(IC[id])return IC[id];
 if(!IR){IR=new THREE.WebGLRenderer({alpha:true,antialias:true,preserveDrawingBuffer:true});IR.setSize(96,96);IR.setClearColor(0,0)}
 const sc=new THREE.Scene();sc.add(new THREE.HemisphereLight(0xffffff,0xbbaa99,3.2));const d=new THREE.DirectionalLight(0xffffff,1.6);d.position.set(1,2,3);sc.add(d);
 const g=new THREE.Group();prod(id,g,0,0,0);g.scale.setScalar(2.3);g.position.y=-.38;g.rotation.y=-.5;sc.add(g);
 const c=new THREE.PerspectiveCamera(30,1,.1,10);c.position.set(0,.15,2.3);c.lookAt(0,0,0);IR.render(sc,c);return IC[id]=IR.domElement.toDataURL()}
function clearGroup(g){while(g.children.length){const c=g.children[0];g.remove(c);c.traverse&&c.traverse(o=>{if(o.geometry&&!Object.values(GC).includes(o.geometry))o.geometry.dispose();if(o.material&&!Object.values(MC).includes(o.material))o.material.dispose()})}}
export function initStore(host){
 const R=new THREE.WebGLRenderer({antialias:true});R.setPixelRatio(Math.min(devicePixelRatio||1,2));R.shadowMap.enabled=true;R.shadowMap.type=THREE.PCFSoftShadowMap;host.prepend(R.domElement);
 const scene=new THREE.Scene();scene.background=new THREE.Color(0xbfe3d0);
 const cam=new THREE.PerspectiveCamera(40,1,.1,300);
 scene.add(new THREE.HemisphereLight(0xffffff,0xf0e6d6,2.3));
 const dl=new THREE.DirectionalLight(0xffffff,1.6);dl.castShadow=true;dl.shadow.mapSize.set(2048,2048);dl.shadow.bias=-.0006;scene.add(dl,dl.target);
 const tree=(p,x,z,s)=>{box(.3*s,1.5*s,.3*s,0x7a4a2b,x,.75*s,z,p);const c=new THREE.Mesh(new THREE.IcosahedronGeometry(1.2*s,0),M(0x4fae4a));c.position.set(x,2.3*s,z);c.castShadow=true;p.add(c)};
 // 戶外背景（固定）
 box(260,.1,260,0x86c065,0,-.1,0,scene);
 const wm=M(0x6f9ac4);
 [[-24,-18,8,12,0xd98c8c],[-14,-20,9,9,0xe6cf8a],[-3,-19,8,14,0x9ab8d9],[8,-20,9,10,0xe3a6a0],[19,-19,8,13,0xb9d4a8],[30,-20,9,11,0xe6cf8a],[41,-19,8,14,0x9ab8d9],[-30,-6,6,9,0xcfa6d9]].forEach(([x,z,w,h,c])=>{box(w,h,6,c,x,h/2,z,scene);
  for(let r=0;r<Math.floor(h/2.4);r++)for(let i=0;i<Math.floor(w/2.4);i++){const p=new THREE.Mesh(new THREE.PlaneGeometry(1.1,1.3),wm);p.position.set(x-w/2+1.5+i*2.4,1.8+r*2.4,z+3.02);scene.add(p)}});
 [[-10,-9,1.2],[11,-10,1.3],[-22,5,1.1],[34,-8,1.2]].forEach(a=>tree(scene,...a));
 const fc=document.createElement('canvas');fc.width=fc.height=64;const fg=fc.getContext('2d');fg.fillStyle='#f3e7d8';fg.fillRect(0,0,64,64);fg.fillStyle='#e4d3be';fg.fillRect(0,0,32,32);fg.fillRect(32,32,32,32);
 const ft=new THREE.CanvasTexture(fc);ft.wrapS=ft.wrapT=THREE.RepeatWrapping;ft.magFilter=THREE.NearestFilter;
 const coldroom=new THREE.Group();coldroom.visible=false;scene.add(coldroom);box(3,2.4,2.4,0xf5f7fa,-14,1.2,0,coldroom);box(.06,1.9,1.1,0x3a6ea5,-12.47,.97,0,coldroom);
 const opt={coldroom};
 const lbl=[],V={w:1,h:1};
 function label(html,x,y,z,vis,fx){const e=document.createElement('div');e.className='lb';e.innerHTML=html;host.appendChild(e);const o={e,v:new THREE.Vector3(x,y,z),vis,fx};lbl.push(o);return o}
 label('倉庫 →',-8.1,2.75,-.5);label('冷藏庫',-14,2.7,0,()=>coldroom.visible);
 // 倉庫棟＋採購辦公室（隨等級變大）
 const whG=new THREE.Group(),office=new THREE.Group();scene.add(whG,office);office.visible=false;const officeL=label('採購辦公室',-12.4,2.4,3,()=>office.visible);
 const AX=-8.7,OX=-12.4;let WWH=9.6,DWH=7.6,zf=1.3,nBack=3;
 function buildWh(lv){clearGroup(whG);clearGroup(office);WWH=9.6+1.5*(lv-1);DWH=7.6+.5*(lv-1);zf=-6.3+DWH;const xl=-8.2-WWH,cx=-8.2-WWH/2,zm=-6.3+DWH/2;
  box(WWH,.1,DWH,0xc4c4cc,cx,-.05,zm,whG);box(WWH,1.6,.2,0xb8b8c0,cx,.8,-6.1,whG);box(.2,1.6,DWH,0xb8b8c0,xl+.1,.8,zm,whG);{const g1=OX-1.2,g2=OX+1.2;box(g1-xl,.5,.2,0xb8b8c0,(xl+g1)/2,.25,zf,whG);box(-8.2-g2,.5,.2,0xb8b8c0,(g2-8.2)/2,.25,zf,whG)}box(WWH,.3,.25,0xc0392b,cx,1.55,-6.05,whG);
  nBack=Math.floor((WWH-1)/2.6);for(let i=0;i<nBack;i++)rack(whG,-10.8-2.6*i,-5.3,0);
  for(let k=0;k<Math.floor((DWH-3.5)/2.6)+1;k++)rack(whG,xl+.8,-3+2.6*k,Math.PI/2);
  for(let r=0;r<2;r++)for(let i=0;i<3-r;i++)box(.7,.5,.6,0xc8955e,-11.6+i*.75+r*.37,.25+r*.5,-3.4,whG);
  const oz=zf+1.8;box(5.6,.1,3.6,0xe8dcc8,OX,-.04,oz,office);box(.2,1.6,3.6,0xb8b8c0,OX-2.8,.8,oz,office);box(.2,1.6,3.6,0xb8b8c0,OX+2.8,.8,oz,office);box(5.6,1.6,.2,0xb8b8c0,OX,.8,zf+3.6,office);box(5.6,.3,.25,0x3a6ea5,OX,1.55,zf+3.6,office);
  [-1.8,1.8].forEach(dx=>{box(1.4,.75,.7,0x8a6a4a,OX+dx,.38,zf+1.5,office);box(.5,.35,.05,0x2b2f3a,OX+dx,1.15,zf+1.55,office);box(.44,.27,.02,0x4dd4ff,OX+dx,1.15,zf+1.51,office);box(.4,.03,.15,0xdddddd,OX+dx,.77,zf+1.3,office);box(.45,.5,.45,0x3a404c,OX+dx,.25,zf+.45,office)});
  box(.6,1.2,.5,0x9aa5b8,OX+2.3,.6,zf+3.2,office);box(.5,.04,.7,0xd94452,OX,.03,zf+2.6,office);officeL.v.set(OX,2.4,zf+1.8)}
 buildWh(1);
 const OR=0xff8a3d,BL=0x3a7bd5;
 const AMB=[['飲料·零食',['water','cola','chips']],['速食·零食',['noodle','biscuit','spicy']],['零食·日用',['tissue','bread','chips']],['飲料·日用',['cola','water','noodle']],['零食·速食',['biscuit','chips','spicy']],['飲料·零食',['water','cola','bread']]];
 // 熱食區、用餐區（用餐區跟著店面右牆平移）
 const hot=new THREE.Group();box(2.4,.9,.9,0xb85c38,0,.45,0,hot);box(2.2,.5,.7,0xffb347,0,1.15,0,hot,.65);
 const dine=new THREE.Group();let dW=6.7,dineLv=0;
 hot.visible=dine.visible=false;scene.add(hot,dine);opt.hot=hot;opt.dine=dine;const hotL=label('熱食區',-6.4,2,4.9,()=>hot.visible),dineL=label('用餐區',11.55,2.2,-.5,()=>dine.visible);
 // ===== 店面外殼：隨等級放大（內部單位不等於米，比標示的大一點才放得下貨架）=====
 const GZ=-.5,x0=-8,z0=-6,CS=.5;
 let dineOn=false;
 function buildDine(lv){clearGroup(dine);dineLv=lv;dineOn=lv>0;dine.visible=lv>0;if(rwFill)rwFill.visible=!dineOn;if(lv<=0)return;
  const cols=[2,3,4][lv-1]||4,rows=[2,2,3][lv-1]||3;dW=cols*2.6+1.5;const zf2=3.7+3.4*(rows-2),dep=zf2+4.5,zm=(zf2-4.6)/2;
  box(dW,.1,dep,0xe6d3b8,.2+dW/2,-.05,zm,dine);box(.5,.02,2,0xe6d3b8,.1,.01,GZ,dine);
  box(dW+.2,2.8,.2,0xf6ede2,.2+dW/2,1.4,-4.6,dine);box(dW+.2,.35,.3,0xc0392b,.2+dW/2,2.6,-4.55,dine);
  box(.2,1,dep,0xf6ede2,dW+.3,.5,zm,dine);box(.08,1.3,dep,0xbfe3ff,dW+.3,1.65,zm,dine,.2);
  box(dW+.2,1,.2,0xf6ede2,.2+dW/2,.5,zf2,dine);box(dW+.2,1.3,.08,0xbfe3ff,.2+dW/2,1.65,zf2,dine,.2);
  [GZ-1,GZ+1].forEach(z=>box(.3,2.3,.2,0x9aa5b8,.1,1.15,z,dine));box(.3,.35,2.2,0x9aa5b8,.1,2.3,GZ,dine);
  for(let r=0;r<rows;r++)for(let c=0;c<cols;c++){const x=2.3+2.6*c,z=-2.6+3.4*r;box(1.1,.06,1.1,0xd9c3a5,x,.75,z,dine);box(.1,.72,.1,0x8a6a4a,x,.38,z,dine);[-.85,.85].forEach(o=>box(.4,.4,.4,0xe05a4a,x+o,.2,z,dine))}
  dineL.v.set(x1+.2+dW/2,2.2,zm)}
 let W=16,D=12,x1=8,z1=6,dc=6.2,xb=1.2,SW=7.6,DOOR=[6.2,6.9],IN=[6.2,5],PQ=[6.3,5.5],TILL=[1.2,3.95],QS=[],CPOS=[],SLOTS=[],maxDist=34,wallC=0xf6ede2,focusName='all',STN=[8,6.5],site='c1';
 // 每個有員工的櫃台、每台自助機各一條隊伍；沒人收銀時顧客在入口旁等
 const lanes={};
 function laneSpot(k,j){if(k==='hold')return[dc-1.8-.85*j,z1-.8];const i=+k.slice(1);return k[0]==='c'?[CPOS[i],z1-2.05+.75*j]:[x1-1.5-.9*j,z1-5-1.3*i]}
 const shell=new THREE.Group();scene.add(shell);let walls=[],rwFill=null;
 function buildShell(lv){clearGroup(shell);walls=[];W=11+2*lv;D=9+2*lv;x1=x0+W;z1=z0+D;dc=x1-1.8;xb=x1-6.8;SW=z1+1.6;DOOR=[dc,z1+.9];IN=[dc,z1-1];PQ=[x1-1.7,z1-.5];STN=[dc+1.7,z1+.5];TILL=[xb,z1-2.05];CPOS=[xb,xb+3.2,xb-3.2,xb-6.4,xb-9.6,xb-12.8];maxDist=34+(lv-1)*3;
  const cx=x0+W/2,wl=(w,h,d,x,y,z)=>{const m=box(w,h,d,wallC,x,y,z,shell);walls.push(m);return m},gl=(w,h,d,x,y,z,p)=>box(w,h,d,0xbfe3ff,x,y,z,p||shell,.2);
  ft.repeat.set(W/2,D/2);const floor=new THREE.Mesh(new THREE.PlaneGeometry(W,D),new THREE.MeshLambertMaterial({map:ft}));floor.rotation.x=-Math.PI/2;floor.position.set(cx,0,z0+D/2);floor.receiveShadow=true;shell.add(floor);
  wl(W+.4,2.8,.2,cx,1.4,z0-.1);box(W+.6,.35,.3,0xc0392b,cx,2.6,z0-.05,shell);
  const la=GZ-1-(z0-.2),ca=(GZ-1+z0-.2)/2,ra=GZ-1-(z0-.1),rc=(GZ-1+z0-.1)/2,lb=z1+.1-(GZ+1),cb=(z1+.1+GZ+1)/2;
  wl(.2,1,la,x0-.1,.5,ca);wl(.2,1,lb,x0-.1,.5,cb);wl(.2,1,ra,x1+.1,.5,rc);wl(.2,1,lb,x1+.1,.5,cb);gl(.08,1.3,ra,x1+.1,1.65,rc);gl(.08,1.3,lb,x1+.1,1.65,cb);
  rwFill=new THREE.Group();shell.add(rwFill);walls.push(box(.2,1,2,wallC,x1+.1,.5,GZ,rwFill));gl(.08,1.3,2,x1+.1,1.65,GZ,rwFill);rwFill.visible=!dineOn;
  const fa=(dc-1)-(x0-.2),fcx=((dc-1)+(x0-.2))/2;wl(fa,1,.2,fcx,.5,z1+.1);wl(1,1,.2,dc+1.5,.5,z1+.1);gl(fa-.2,1.3,.08,fcx,1.65,z1+.1);gl(.9,1.3,.08,dc+1.5,1.65,z1+.1);
  [dc-1,dc+1].forEach(x=>box(.15,2.3,.15,0xff5a4e,x,1.15,z1+.1,shell));box(2.2,.35,.2,0xff5a4e,dc,2.45,z1+.1,shell);box(1.8,.04,1.2,0xd94452,dc,.03,z1-.4,shell);for(let i=0;i<8;i++)box(.28,.1,1.3,i%2?0xffffff:0xd94452,dc-1+i*.28,2.62,z1+.75,shell);
  [GZ-1,GZ+1].forEach(z=>box(.3,2.3,.2,0x9aa5b8,x0-.1,1.15,z,shell));box(.3,.35,2.2,0x9aa5b8,x0-.1,2.3,GZ,shell);box(1.4,.04,2,0xc4c4cc,x0-.2,.01,GZ,shell);
  [[x0+.5,z0+.6],[x1-.5,z0+.6],[x1-.5,z1-.7]].forEach(([x,z])=>{const g=new THREE.Group();g.position.set(x,0,z);const c=new THREE.Mesh(new THREE.CylinderGeometry(.25,.2,.4,10),M(0xc0713d));c.position.y=.2;g.add(c);const l=new THREE.Mesh(new THREE.SphereGeometry(.45,8,6),M(0x3fa65b));l.position.y=.85;l.castShadow=true;g.add(l);shell.add(g)});
  box(90,.08,1.8,0xd9d4cc,cx,-.03,z1+1.6,shell);box(110,.06,4.2,0x8d8d96,cx,-.04,z1+5,shell);for(let i=-10;i<=10;i++)box(2,.07,.2,0xf4f4f4,cx+i*4,0,z1+5,shell);tree(shell,x1+6,z1+2.2,.9);tree(shell,x0-11,z1+3,1);
  dine.position.x=x1;dineL.v.x=x1+.2+dW/2;hot.position.set(x0+1.6,0,z1-1.1);hotL.v.set(x0+1.6,2,z1-1.1);
  const hx=20+Math.max(0,x1-8)*.8,hy=14+Math.max(0,z1-6)*.8,tx=-4+(x1-8)/2,tz=(z1-6)/2;
  Object.assign(dl.shadow.camera,{left:-hx-4,right:hx-4,top:hy,bottom:-hy,near:1,far:90});dl.shadow.camera.updateProjectionMatrix();dl.target.position.set(tx,0,tz);dl.position.set(tx+12,18,tz+10);
  SLOTS=[];const xs=[];for(let x=x0+2;x<=x1-3.35+1e-6;x+=2.6)xs.push(Math.round(x*100)/100);let ri=0;for(let z=z0+.6;z<=z1-5.9+1e-6;z+=3.4,ri++)xs.forEach((x,ci)=>SLOTS.push({code:ri*20+ci,x,z:Math.round(z*100)/100}))}
 // ===== 走道格子：貨架、收銀台、設備會擋路，顧客與員工用 BFS 繞過去 =====
 let gw=0,gh=0,blk=null,navFix=[],navCnt=[],navEq=[],navOn=false;
 function buildNav(){gw=Math.ceil(W/CS);gh=Math.ceil(D/CS);blk=new Uint8Array(gw*gh);const rs=[...navFix,...navCnt,...navEq,[x0+.4,x0+2.8,z1-1.55,z1-.65,.25]];
  for(let j=0;j<gh;j++)for(let i=0;i<gw;i++){const x=x0+(i+.5)*CS,z=z0+(j+.5)*CS;let b=x<x0+.45||x>x1-.45||z<z0+.45||z>z1-.45;if(!b)for(const r of rs){const f=r[4]??.25;if(x>r[0]-f&&x<r[1]+f&&z>r[2]-f&&z<r[3]+f){b=true;break}}blk[j*gw+i]=b?1:0}navOn=true}
 const cell=(x,z)=>[Math.min(gw-1,Math.max(0,Math.floor((x-x0)/CS))),Math.min(gh-1,Math.max(0,Math.floor((z-z0)/CS)))];
 function near([i,j]){if(!blk[j*gw+i])return[i,j];for(let r=1;r<12;r++)for(let dj=-r;dj<=r;dj++)for(let di=-r;di<=r;di++){if(Math.max(Math.abs(di),Math.abs(dj))!==r)continue;const a=i+di,b=j+dj;if(a>=0&&b>=0&&a<gw&&b<gh&&!blk[b*gw+a])return[a,b]}return[i,j]}
 function los(a,b){const d=Math.hypot(b[0]-a[0],b[1]-a[1]),n=Math.ceil(d/.2);for(let i=1;i<n;i++){const[ci,cj]=cell(a[0]+(b[0]-a[0])*i/n,a[1]+(b[1]-a[1])*i/n);if(blk[cj*gw+ci])return false}return true}
 function route(ax,az,bx,bz){if(!navOn)buildNav();const c0=near(cell(ax,az)),c1=near(cell(bx,bz));if(c0[0]===c1[0]&&c0[1]===c1[1])return[[bx,bz]];
  const prev=new Int32Array(gw*gh).fill(-2),s=c0[1]*gw+c0[0],t=c1[1]*gw+c1[0],q=[s];prev[s]=-1;
  for(let h=0;h<q.length&&prev[t]===-2;h++){const u=q[h],ui=u%gw,uj=(u/gw)|0;for(let dj=-1;dj<=1;dj++)for(let di=-1;di<=1;di++){if(!di&&!dj)continue;const ni=ui+di,nj=uj+dj;if(ni<0||nj<0||ni>=gw||nj>=gh)continue;const v=nj*gw+ni;if(prev[v]!==-2||blk[v])continue;if(di&&dj&&(blk[uj*gw+ni]||blk[nj*gw+ui]))continue;prev[v]=u;q.push(v)}}
  if(prev[t]===-2)return[[bx,bz]];
  const cs=[];for(let u=t;u!==-1;u=prev[u])cs.push(u);cs.reverse();
  const pts=[[ax,az],...cs.map(u=>[x0+((u%gw)+.5)*CS,z0+(((u/gw)|0)+.5)*CS])],out=[];let k=0;
  while(k<pts.length-1){let n=pts.length-1;while(n>k+1&&!los(pts[k],pts[n]))n--;out.push(pts[n]);k=n}
  out[out.length-1]=[bx,bz];return out}
 // ===== 貨架／櫃台 =====
 const fixG=new THREE.Group();scene.add(fixG);let curFix=[],FXS=[];
 let stk={},cdD=7;function applyStock(){REG.forEach(r=>{const f=stk[r.id];r.g.visible=f===undefined||r.k<Math.ceil(f*(r.n||5))})}
 const FW=2.6;
 function stand(i){const f=FXS[i],a=f.r*Math.PI/2;return[f.x+Math.sin(a)*1.1,f.z+Math.cos(a)*1.1]}
 function setFixtures(list){curFix=list;REG.length=0;clearGroup(fixG);for(let i=lbl.length-1;i>=0;i--)if(lbl[i].fx===true){lbl[i].e.remove();lbl.splice(i,1)}
  navFix=[];FXS=[];list.forEach((f,i)=>{const sl=SLOTS.find(q=>q.code===f.pi);if(!sl){FXS.push(null);return}const x=sl.x+(f.dx||0),z=sl.z+(f.dz||0),r=(((f.rot||0)%4)+4)%4,ids=f.pids||[];let g,tx=f.label,ly=2.3;
   if(f.t==='shelf'){g=shelf(ids,i%2?OR:BL);tx=tx||'貨架'}
   else if(f.t==='cold'){g=coldCab(ids);tx=tx||'冷藏櫃';ly=2.6}
   else if(f.t==='produce'){g=produceStand(ids);tx=tx||'蔬果台'}
   else if(f.t==='clear'){g=clearStand();tx='即期 <em class=cd>'+cdD+'折</em>';ly=2.2}
   else{g=freezerCab(ids);tx=tx||'冷凍櫃';ly=1.5}
   g.position.set(x,0,z);g.rotation.y=r*Math.PI/2;fixG.add(g);label(tx,x,ly,z,null,true);FXS.push({x,z,r,t:f.t});
   navFix.push(r%2?[x-.55,x+.55,z-FW/2,z+FW/2,.25]:[x-FW/2,x+FW/2,z-.55,z+.55,.25])});navOn=false;applyStock()}
 const cG=new THREE.Group();scene.add(cG);let lock=false,me=null,curCnt=[2,0,null];
 function setCounters(reg,cashiers,eq){curCnt=[reg,cashiers,eq];clearGroup(cG);me=null;for(let i=lbl.length-1;i>=0;i--)if(lbl[i].fx==='c'){lbl[i].e.remove();lbl.splice(i,1)}
  navCnt=[];const zc=z1-3;
  for(let i=0;i<Math.min(reg,CPOS.length);i++){const x=CPOS[i];cG.add(counter(x,zc,eq));const p=i===0?person(0x2d7ff9,{hat:2,cap:0x2d7ff9,vest:0xffffff}):(i<=cashiers?person(0xd94452,{hat:2,cap:0xd94452,vest:0xffffff}):null);if(p){p.position.set(x,0,zc-.95);cG.add(p);if(i===0)me=p}label((i+1)+'號台',x,2.4,zc-.4,null,'c');navCnt.push([x-1.4,x+1.4,zc-1.3,zc+.85,.25])}
  navOn=false;if(me)me.visible=!lock}
 // ===== 設備（買了才會出現）=====
 const eqG=new THREE.Group();scene.add(eqG);let curEq={};
 function setEquip(eq0){curEq=eq0||{};const e=curEq;clearGroup(eqG);navEq=[];const cx=x0+W/2;
  if(e.neon){const cv=document.createElement('canvas');cv.width=512;cv.height=128;const c2=cv.getContext('2d'),big=e.neon>1;c2.fillStyle='#1a1d28';c2.fillRect(0,0,512,128);c2.font='bold 62px -apple-system,PingFang TC,sans-serif';c2.textAlign='center';c2.textBaseline='middle';c2.shadowColor=big?'#ff4fa3':'#4dd4ff';c2.shadowBlur=18;c2.fillStyle=big?'#ffd6ec':'#d6f6ff';c2.fillText('日日鮮超市',256,66);
   const sw=big?4.4:3.6,sh=sw/4,sg=new THREE.Mesh(new THREE.PlaneGeometry(sw,sh),new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(cv)}));sg.position.set(dc,3.55,z1+.9);eqG.add(sg);box(sw+.12,sh+.12,.08,0x2b2f3a,dc,3.55,z1+.84,eqG);[-1,1].forEach(s=>box(.1,.9,.1,0x555b6b,dc+s*(sw/2-.2),3.0,z1+.85,eqG))}
  for(let i=0;i<(e.whx||0);i++)rack(eqG,[-15,-12.5,-10][i],-2,0);
  if(e.music)[x0+.5,x1-.5].forEach(x=>{box(.4,.7,.3,0x2b2f3a,x,2.1,z0+.35,eqG);pm(cyl(.12,.12,.04,12),0x555b6b,x,2.0,z0+.52,eqG,Math.PI/2,0,0)});
  if(e.ac){box(2.2,.5,.4,0xf2f4f7,cx+2,2.25,z0+.3,eqG);box(2,.06,.02,0x6ab7ff,cx+2,2.12,z0+.51,eqG)}
  if(e.cart)for(let k=0;k<3;k++){const c=cartModel();c.position.set(dc+3.4+.75*k,0,z1+.95);c.rotation.y=.12*(k-1);eqG.add(c)}
  if(e.charge){box(.8,1.4,.35,0xff9f1a,dc-2.4,.7,z1+.45,eqG);for(let i=0;i<6;i++)box(.14,.2,.05,0x2b2f3a,dc-2.4-.27+(i%3)*.27,.95-(Math.floor(i/3))*.3,z1+.65,eqG)}
  if(e.delivery){const g=new THREE.Group();g.position.set(STN[0],0,STN[1]);box(1.4,.75,.55,0x7a8aa0,0,.38,0,g);box(1.5,.06,.65,0xe9edf2,0,.78,0,g);[-.6,.6].forEach(x=>box(.06,1.5,.06,0x555b6b,x,.75,-.1,g));box(1.4,.4,.06,0x00b4a2,0,1.5,-.1,g);eqG.add(g);bagG=new THREE.Group();bagG.position.set(STN[0],.8,STN[1]);eqG.add(bagG);setBags(curBags)}
  if(e.gate)[-.95,.95].forEach(s=>{box(.1,1.3,.3,0xe9edf2,dc+s,.65,z1-.5,eqG);box(.12,.1,.12,0xff3b3b,dc+s,1.35,z1-.5,eqG)});
  if(e.cctv)[[x0+.4,2.35,z0+.4],[x1-.4,2.35,z0+.4],[dc,2.2,z1-.2]].forEach(([x,y,z])=>{const c=camModel();c.position.set(x,y,z);c.rotation.x=.3;eqG.add(c)});
  for(let k=0;k<(e.self||0);k++){const z=z1-5-1.3*k,g=kiosk();g.position.set(x1-.55,0,z);g.rotation.y=-Math.PI/2;eqG.add(g);navEq.push([x1-1.05,x1,z-.5,z+.5,.1])}
  navOn=false;if(curCnt)setCounters(curCnt[0],curCnt[1],e)}
 // ===== 員工（買了才會出現；增減人數時只動那一位）=====
 const stfG=new THREE.Group();scene.add(stfG);let stf=[],curStf={},curBags=0,bagG=new THREE.Group();
 const LIM={stocker:6,guard:2,buyer:2,packer:2,night:2},dskPos=i=>[OX-1.8+3.6*i,zf+.85];
 const pushPts=(path,pts)=>pts.forEach(a=>path.push([a[0],a[1]]));
 function stkNext(s){const j=cb&&cb.job&&cb.job();if(!j||!FXS[j.fi]){s.wait=2;return}s.job=j;s.picked=false;const p=s.m.position,pk=j.cold?[[AX,0],[-11.8,0]]:[[AX,-4.4],[-10.8-2.6*rnd(Math.max(1,nBack)),-4.4]],sp=stand(j.fi),path=[];
  pushPts(path,route(p.x,p.z,x0+.7,GZ));pushPts(path,[[x0-.4,GZ],[AX,GZ],...pk]);path[path.length-1][2]=.8;path[path.length-1][3]='pick';
  pushPts(path,[...pk.slice(0,-1).reverse(),[AX,GZ],[x0-.4,GZ],[x0+.7,GZ]]);pushPts(path,route(x0+.7,GZ,sp[0],sp[1]));path[path.length-1][2]=1.2;path[path.length-1][3]='drop';
  s.face=FXS[j.fi].r*Math.PI/2+Math.PI;s.path=path;s.i=0}
 function gdNext(s){const ps=[[dc-1.4,z1-1.2],[x1-2,(z0+z1)/2],[x0+W/2,z1-4.6]],q=ps[rnd(ps.length)],path=[];pushPts(path,route(s.m.position.x,s.m.position.z,q[0],q[1]));path[path.length-1][2]=5+Math.random()*6;s.path=path;s.i=0;s.face=0}
 function stfTag(s,tag){if(tag==='pick'){s.picked=true;if(cb&&cb.pickup)cb.pickup(s.job);s.m.userData.carry.visible=true}
  else if(tag==='drop'){if(cb&&cb.deliver)cb.deliver(s.job);s.m.userData.carry.visible=false;s.job=null;s.picked=false}
  else if(tag==='home'){s.busy=false;if(cb&&cb.buyerDone)cb.buyerDone()}}
 const MK={
  stocker:()=>{const m=person(0xf2a33a,{hat:2,cap:0xf2a33a,vest:0xffffff});const cr=box(.42,.3,.36,0xc8955e,0,.95,.32,m);cr.visible=false;m.userData.carry=cr;return{m,home:()=>[x0+1.4,GZ+.8,Math.PI/2],next:stkNext,speed:.07}},
  guard:()=>({m:person(0x1f2d4d,{hat:2,cap:0x1f2d4d,pants:0x1f2d4d}),home:()=>[dc-1.4,z1-1.2,0],next:gdNext,speed:.04}),
  buyer:i=>({m:person(0x6a5acd,{hat:0}),home:()=>[...dskPos(i),0],speed:.06}),
  packer:i=>({m:person(0x3fa65b,{hat:2,cap:0x3fa65b,vest:0xffffff}),home:()=>[x1-.6,z1-.9-.9*i,Math.PI],speed:.04}),
  night:i=>({m:person(0x34374a,{hat:1}),home:()=>[x0+1.2,z1-3-i,Math.PI/2],speed:.04})};
 function setStaff(c){curStf=c||{};Object.keys(LIM).forEach(k=>{const want=Math.min(curStf[k]||0,LIM[k]),have=stf.filter(s=>s.kind===k);
   while(have.length>want){const s=have.pop();if(s.job&&cb&&cb.cancel)cb.cancel(s.job,s.picked);stfG.remove(s.m);stf.splice(stf.indexOf(s),1)}
   for(let i=have.length;i<want;i++){const o=MK[k](i),h=o.home();o.m.position.set(h[0],0,h[1]);o.m.rotation.y=h[2];stfG.add(o.m);stf.push({...o,kind:k,idx:i,face:h[2],wait:Math.random()*2,path:null,i:0,job:null,picked:false,busy:false})}});
  office.visible=(curStf.buyer||0)>0}
 function rehome(){stf.forEach(s=>{if(s.path||s.kind==='stocker')return;const h=s.home();s.m.position.set(h[0],0,h[1]);s.m.rotation.y=h[2];s.face=h[2]})}
 function buyerPatrol(){const s=stf.find(a=>a.kind==='buyer'&&!a.busy&&!a.path);if(!s)return false;s.busy=true;const dp=dskPos(s.idx),out=[[OX,zf+.6],[OX,zf-.7],[AX,zf-.7],[AX,GZ],[x0-.4,GZ]],path=[];
  pushPts(path,out);path.push([x0+.7,GZ]);let cx=x0+.7,cz=GZ;
  FXS.map((f,i)=>f?i:-1).filter(i=>i>=0).sort(()=>Math.random()-.5).slice(0,4).forEach(i=>{const sp=stand(i);pushPts(path,route(cx,cz,sp[0],sp[1]));path[path.length-1][2]=1.8;cx=sp[0];cz=sp[1]});
  pushPts(path,route(cx,cz,x0+.7,GZ));pushPts(path,[...out].reverse());path.push([dp[0],dp[1],1,'home']);s.path=path;s.i=0;s.face=0;return true}
 // 外送：取貨處、紙袋、平台司機
 function setBags(n){curBags=n;clearGroup(bagG);for(let i=0;i<Math.min(n,4);i++)box(.28,.35,.2,0xc8955e,-.45+i*.3,.18,0,bagG)}
 const drv=[];function callDriver(oid){const sc=bikeModel(),m=person(0x00b4a2,{hat:2,cap:0x00b4a2,vest:0xffffff});sc.position.set(x0-18,0,z1+3.8);m.visible=false;scene.add(sc,m);drv.push({oid,sc,m,st:'in'})}
 // ===== 顧客 =====
 const cust=[],COL=[0xe05a4a,0x3fa65b,0x6a5acd,0xf2a33a,0x2d7ff9,0xc2185b];
 let cb=null;
 const exitFrom=m=>[...route(m.position.x,m.position.z,IN[0],IN[1]),[...DOOR],[DOOR[0]+8,SW],[x1+19,SW]];
 function spawnCustomer(cid,stops,thief){if(cust.length>=12||!stops||!stops.length)return false;const fl=Math.random()<.5,m=thief?person(0x2a2a30,{hat:1,pants:0x1b1b20,mask:1}):person(COL[rnd(6)]);m.position.set(fl?x0-16:x1+16,0,SW+(Math.random()-.5)*.6);scene.add(m);
  const path=[[DOOR[0]+(Math.random()-.5)*.8,SW],[...DOOR],[...IN]];let cx=IN[0],cz=IN[1];
  stops.forEach(i=>{if(!FXS[i])return;const sp=stand(i);route(cx,cz,sp[0],sp[1]).forEach(p=>path.push([p[0],p[1]]));const l=path[path.length-1];l[2]=1.6+Math.random();l[3]={s:i};cx=sp[0];cz=sp[1]});
  const c={m,path,i:0,wait:0,cid};
  if(thief){c.thief=true;const fp=route(cx,cz,IN[0],IN[1]).map(p=>[p[0],p[1]]),d=[...DOOR];d[2]=0;d[3]='door';
   let L=0,px=cx,pz=cz;[...fp,d].forEach(q=>{L+=Math.hypot(q[0]-px,q[1]-pz);px=q[0];pz=q[1]});c.fs=Math.min(FS,Math.max(.8,L/9));
   path.push([cx,cz,Math.max(0,8-L/c.fs),'flee'],...fp,d,[DOOR[0]+8,SW],[x1+19,SW]);c.fk=path.length-fp.length-4;c.dk=path.length-3}
  else{route(cx,cz,PQ[0],PQ[1]).forEach(p=>path.push([p[0],p[1]]));path[path.length-1]=[PQ[0],PQ[1],0,'q']}
  cust.push(c);return true}
 function leaveAll(){cust.forEach(c=>dropC(c));cust.length=0}
 const ring=new THREE.Mesh(new THREE.RingGeometry(1.3,1.5,32),new THREE.MeshBasicMaterial({color:0xffc400,side:THREE.DoubleSide}));ring.rotation.x=-Math.PI/2;ring.position.y=.05;ring.visible=false;scene.add(ring);
 const beltG=new THREE.Group(),rc=new THREE.Raycaster(),v2=new THREE.Vector2();scene.add(beltG);
 let belt=[],pick=null,till=null,tillId=0,dn=null,pendBelt=null;const autos=[],autoPend=[];
 const mkp=()=>{const m=person(COL[rnd(6)]);m.position.set(DOOR[0],0,DOOR[1]);scene.add(m);return m};
 const memberOf=cid=>{for(const k in lanes){const j=lanes[k].findIndex(q=>q.userData.cid===cid);if(j>=0)return{m:lanes[k][j],k,j}}return null};
 function setTill(id){if(id===tillId)return;tillId=id;const f=id&&memberOf(id);till=f?f.m:null}
 function joinLane(c,k){c.m.userData.cid=c.cid;c.m.userData.fc=k[0]==='k'?Math.PI/2:Math.PI;(lanes[k]=lanes[k]||[]).push(c.m)}
 function moveCust(cid,k){const f=memberOf(cid);if(!f)return;lanes[f.k].splice(f.j,1);f.m.userData.fc=k[0]==='k'?Math.PI/2:Math.PI;(lanes[k]=lanes[k]||[]).push(f.m)}
 function laneReady(cid){const f=memberOf(cid);if(!f||f.j!==0)return false;const p=laneSpot(f.k,0);return Math.hypot(p[0]-f.m.position.x,p[1]-f.m.position.z)<.15}
 function serveBelt(cid,ids,dur){autoPend.push({cid,ids,dur})}
 function startAuto(a,ci){const cx=CPOS[ci],zc=z1-3,n=a.ids.length,items=a.ids.map((id,i)=>{const g=new THREE.Group();prod(id,g,0,0,0);g.position.set(cx-.95+i*.34,.99,zc+(i%2?.1:-.1));g.scale.setScalar(1.25);g.rotation.y=(i%3-1)*.4;beltG.add(g);return{g,s:false,t:0,at:(i+.5)/n*a.dur*.75}});autos.push({cid:a.cid,cx,t:0,items})}
 function leave(cid){const f=memberOf(cid);if(!f)return;lanes[f.k].splice(f.j,1);cust.push({m:f.m,path:exitFrom(f.m),i:0,wait:0});if(till===f.m){till=null;tillId=0}
  for(let i=autos.length-1;i>=0;i--)if(autos[i].cid===cid){autos[i].items.forEach(b=>beltG.remove(b.g));autos.splice(i,1)}
  for(let i=autoPend.length-1;i>=0;i--)if(autoPend[i].cid===cid)autoPend.splice(i,1)}
 // ===== 小偷：頭上的紅色按鈕、被抓後道歉離開 =====
 const WS=2.7,FS=2.4,GS=4.4,tmpV=new THREE.Vector3();
 function remT(c){if(c.dk==null||c.i>c.dk)return 0;let t=c.wait>0?c.wait:0,x=c.m.position.x,z=c.m.position.z;for(let k=c.i;k<=c.dk;k++){const q=c.path[k];t+=Math.hypot(q[0]-x,q[1]-z)/(k>c.fk||c.fleeing?c.fs:WS)+(k>c.i?(q[2]||0):0);x=q[0];z=q[1]}return t}
 function alertOn(c){if(c.alert||c.state==='caught'||!cb||!cb.thief||!cb.thief(c.cid,'alert'))return;c.alert=true;const e=document.createElement('button');e.className='tf';e.dataset.a='thief';e.dataset.v=c.cid;e.style.display='none';host.appendChild(e);c.tf=e}
 function bubble(c,txt,sec){if(c.bub)c.bub.e.remove();const e=document.createElement('div');e.className='lb sry';e.textContent=txt;e.style.display='none';host.appendChild(e);c.bub={e,t:sec}}
 function dropC(c){if(c.tf){c.tf.remove();c.tf=null}if(c.bub){c.bub.e.remove();c.bub=null}scene.remove(c.m)}
 function thiefCaught(cid){const c=cust.find(q=>q.cid===cid&&q.thief);if(!c||c.state==='caught')return;c.state='caught';c.alert=false;c.fleeing=false;if(c.tf){c.tf.remove();c.tf=null}bubble(c,'對不起，我錯了…',2.6);c.path=exitFrom(c.m);c.i=0;c.wait=2.6;c.fk=c.dk=null}
 function arrive(c,tag){if(tag==='q'){const key=cb&&cb.arrive(c.cid),k=cust.indexOf(c);if(key){if(k>=0)cust.splice(k,1);joinLane(c,key)}else{c.path=exitFrom(c.m);c.i=0;c.wait=0}}
  else if(tag==='flee'){alertOn(c);c.fleeing=!!c.alert}
  else if(tag==='door'){if(c.alert&&c.state!=='caught'&&cb&&cb.thief){cb.thief(c.cid,'door');if(c.state!=='caught'){c.escaped=true;c.alert=false;c.fleeing=false;if(c.tf){c.tf.remove();c.tf=null}cb.thief(c.cid,'escape')}}}
  else{c.face=FXS[tag.s]?FXS[tag.s].r*Math.PI/2+Math.PI:Math.PI;if(cb)cb.take(c.cid,tag.s);if(c.thief&&curEq.cctv)alertOn(c)}}
 function tillReady(){return !!till&&Math.hypot(TILL[0]-till.position.x,TILL[1]-till.position.z)<.15}
 function setBelt(ids){belt.forEach(b=>beltG.remove(b.g));belt=[];pendBelt=ids&&ids.length?ids:null;if(pendBelt&&tillReady()){buildBelt(pendBelt);pendBelt=null}}
 function buildBelt(ids){belt.forEach(b=>beltG.remove(b.g));const zc=z1-3;belt=ids.map((id,i)=>{const g=new THREE.Group();prod(id,g,0,0,0);g.position.set(CPOS[0]-.95+i*.34,.99,zc+(i%2?.1:-.1));g.scale.setScalar(1.25);g.rotation.y=(i%3-1)*.4;
  const hit=new THREE.Mesh(new THREE.BoxGeometry(.26,.6,.5),new THREE.MeshBasicMaterial({visible:false}));hit.position.y=.2;hit.userData.i=i;g.add(hit);beltG.add(g);return{g,hit,s:false,t:0}})}
 function beltScan(i){const b=belt[i];if(b&&b.s===false)b.s=true}
 function beltScanAll(){belt.forEach((b,k)=>setTimeout(()=>beltScan(k),k*110))}
 function guardChase(s,dt,t){const c=s.chase;if(!c)return false;
  if(c.state==='caught'||!cust.includes(c)){s.chase=null;s.rp=null;s.wait=.6;return false}
  const m=s.m,tp=c.m.position,d=Math.hypot(tp.x-m.position.x,tp.z-m.position.z);
  if(d<.9){const id=c.cid;s.chase=null;s.rp=null;s.path=null;s.wait=1.2;if(cb&&cb.thief)cb.thief(id,'guard');return true}
  s.rt=(s.rt||0)-dt;if(!s.rp||s.rt<=0){s.rp=route(m.position.x,m.position.z,tp.x,tp.z);s.rt=.3;s.ri=0}
  let pt=s.rp[Math.min(s.ri,s.rp.length-1)];if(Math.hypot(pt[0]-m.position.x,pt[1]-m.position.z)<.4&&s.ri<s.rp.length-1){s.ri++;pt=s.rp[s.ri]}
  step(m,pt,dt,GS,false,t);return true}
 function tick(t,dt){for(const k in lanes)lanes[k].forEach((m,j)=>{const g=laneSpot(k,j);m.userData.tg=g;const d=Math.hypot(g[0]-m.position.x,g[1]-m.position.z);if(d>.1)step(m,g,dt,2.8,true,t);else idle(m,dt,m.userData.fc??Math.PI)});
  if(pendBelt&&tillReady()){buildBelt(pendBelt);pendBelt=null}
  const bk=dt*60;belt.forEach(b=>{if(b.s!==true)return;b.t+=.05*bk;b.g.position.x+=(CPOS[0]+.6-b.g.position.x)*(1-Math.pow(.8,bk));b.g.position.y=.99+Math.sin(b.t*3)*.12;b.g.scale.multiplyScalar(Math.pow(.93,bk));if(b.t>1){beltG.remove(b.g);b.s=2}});
  for(let i=autoPend.length-1;i>=0;i--){const a=autoPend[i];if(!laneReady(a.cid))continue;autoPend.splice(i,1);const f=memberOf(a.cid);if(f&&f.k[0]==='c')startAuto(a,+f.k.slice(1))}
  autos.forEach(a=>{a.t+=dt;a.items.forEach(b=>{if(b.s===false&&a.t>=b.at)b.s=true;if(b.s!==true)return;b.t+=.05*bk;b.g.position.x+=(a.cx+.6-b.g.position.x)*(1-Math.pow(.8,bk));b.g.position.y=.99+Math.sin(b.t*3)*.12;b.g.scale.multiplyScalar(Math.pow(.93,bk));if(b.t>1){beltG.remove(b.g);b.s=2}})});
  cust.forEach(c=>{if(!c.thief||!c.alert||c.state==='caught'||stf.some(s=>s.chase===c))return;const gs=stf.filter(s=>s.kind==='guard'&&!s.chase).sort((p,q)=>Math.hypot(p.m.position.x-c.m.position.x,p.m.position.z-c.m.position.z)-Math.hypot(q.m.position.x-c.m.position.x,q.m.position.z-c.m.position.z));if(gs.length){const g=gs[0];g.chase=c;g.path=null;g.wait=0;g.rp=null;g.rt=0}});
  stf.forEach(s=>{const m=s.m;if(s.kind==='guard'&&guardChase(s,dt,t))return;if(s.wait>0){s.wait-=dt;idle(m,dt,s.face);return}const pt=s.path&&s.path[s.i];if(!pt){if(s.next)s.next(s);else s.wait=5;return}
   const last=s.i===s.path.length-1,stop=(pt[2]>0)||last,d=step(m,pt,dt,(s.speed||.04)*60,stop,t);
   if(d<(stop?.12:.4)){s.wait=pt[2]||0;s.i++;if(pt[3])stfTag(s,pt[3]);if(!s.path||!s.path[s.i]){s.path=null;if(s.next&&s.wait<1)s.wait=1}}});
  for(let i=drv.length-1;i>=0;i--){const d=drv[i],sc=d.sc,m=d.m,tx=STN[0]+1.4;
   if(d.st==='in'){sc.position.x+=12*dt;if(sc.position.x>=tx){sc.position.x=tx;d.st='walk';m.visible=true;m.position.set(tx,0,z1+3.4)}}
   else if(d.st==='walk'||d.st==='back'){const g=d.st==='walk'?[STN[0]+.3,z1+1.3]:[tx,z1+3.4],dd=Math.hypot(g[0]-m.position.x,g[1]-m.position.z);
    if(dd<.12){if(d.st==='walk'){d.st='wait';d.w=1.2}else{d.st='out';m.visible=false}}else step(m,g,dt,3.6,true,t)}
   else if(d.st==='wait'){d.w-=dt;idle(m,dt,Math.PI);if(d.w<=0){if(cb&&cb.driverPicked)cb.driverPicked(d.oid);d.st='back'}}
   else if(d.st==='out'){sc.position.x+=15*dt;if(sc.position.x>x1+25){scene.remove(sc);scene.remove(m);drv.splice(i,1)}}}}
 R.domElement.addEventListener('pointerdown',e=>{dn={x:e.clientX,y:e.clientY}});
 R.domElement.addEventListener('pointerup',e=>{if(!dn)return;const mv=Math.hypot(e.clientX-dn.x,e.clientY-dn.y);dn=null;if(mv>10||!belt.length)return;
  const r=R.domElement.getBoundingClientRect();v2.set((e.clientX-r.left)/r.width*2-1,-((e.clientY-r.top)/r.height)*2+1);rc.setFromCamera(v2,cam);
  const h=rc.intersectObjects(belt.filter(b=>b.s===false).map(b=>b.hit),false)[0];if(h&&pick)pick(h.object.userData.i)});
 // ===== 鏡頭 =====
 const pre=()=>({all:{x:x1/2-5,z:(z1-6)/2+.5,az:.62,el:.9,dist:Math.min(60,Math.max(22,(x1+17.8)*.97))},cash:{x:xb+1.6,z:z1-2.6,az:.45,el:.62,dist:8},wh:{x:-13,z:-2.5,az:.6,el:1,dist:15},shelves:{x:x0+W/2-1,z:z0+2,az:.35,el:.75,dist:Math.max(13,W)},food:{x:x0+3,z:z1-1.5,az:.5,el:.85,dist:13},dine:{x:x1+dW/2,z:-.4,az:.55,el:.85,dist:17},title:{x:dc-.6,z:z1+.5,az:.22,el:.2,dist:12,ly:2.3},till:{x:xb-.3,z:z1-2,az:Math.PI,el:.5,dist:4.2,ly:1.4}});
 buildShell(1);buildDine(0);
 const goal={...pre().all,ly:.6},cur={...pre().all,ly:.6},pts=new Map(),cv=R.domElement;
 const place=()=>{cam.position.set(cur.x+Math.sin(cur.az)*Math.cos(cur.el)*cur.dist,.6+Math.sin(cur.el)*cur.dist,cur.z+Math.cos(cur.az)*Math.cos(cur.el)*cur.dist);cam.lookAt(cur.x,cur.ly,cur.z)};
 // 單指拖曳＝平移、雙指捏合＝縮放、雙指扭轉＝轉向、雙指上下＝改仰角（滾輪也能縮放）
 const two=()=>{const a=[...pts.values()];return{d:Math.hypot(a[0].x-a[1].x,a[0].y-a[1].y)||1,r:Math.atan2(a[1].y-a[0].y,a[1].x-a[0].x),my:(a[0].y+a[1].y)/2}};let g2=null;
 const zoomTo=d=>{goal.dist=Math.min(maxDist+14,Math.max(5,d))},clampXZ=o=>{o.x=Math.min(x1+30,Math.max(x0-30,o.x));o.z=Math.min(z1+14,Math.max(z0-14,o.z))};
 cv.addEventListener('pointerdown',e=>{cv.setPointerCapture(e.pointerId);pts.set(e.pointerId,{x:e.clientX,y:e.clientY});g2=pts.size===2?two():null});
 cv.addEventListener('pointermove',e=>{const p=pts.get(e.pointerId);if(!p||lock)return;
  const dx=e.clientX-p.x,dy=e.clientY-p.y;p.x=e.clientX;p.y=e.clientY;
  if(pts.size===2){const n=two();if(g2){zoomTo(goal.dist*g2.d/n.d);goal.az+=n.r-g2.r;goal.el=Math.min(1.25,Math.max(.35,goal.el+(n.my-g2.my)*.005))}g2=n}
  else if(pts.size===1){const k=2*cur.dist*Math.tan(20*Math.PI/180)/Math.max(300,V.h),kf=k/Math.max(.35,Math.sin(cur.el)),sn=Math.sin(cur.az),cs=Math.cos(cur.az),mx=-sn*dy*kf-cs*dx*k,mz=-cs*dy*kf+sn*dx*k;
   goal.x+=mx;goal.z+=mz;cur.x+=mx;cur.z+=mz;clampXZ(goal);clampXZ(cur)}});
 const up=e=>{pts.delete(e.pointerId);g2=null};cv.addEventListener('pointerup',up);cv.addEventListener('pointercancel',up);
 cv.addEventListener('wheel',e=>{e.preventDefault();if(!lock)zoomTo(goal.dist*(1+Math.sign(e.deltaY)*.1))},{passive:false});
 const fit=()=>{const w=host.clientWidth,h=host.clientHeight;if(!w||!h)return;V.w=w;V.h=h;R.setSize(w,h);cam.aspect=w/h;cam.updateProjectionMatrix()};
 new ResizeObserver(fit).observe(host);fit();
 function focus(n){focusName=n;let p=pre()[n];if(!p&&n.startsWith('shelf')){const s=FXS[+n.slice(5)];if(s)p={x:s.x,z:s.z+.5,az:.3,el:.7,dist:9}}lock=n==='till';if(me)me.visible=!lock;if(p)Object.assign(goal,{ly:.6},p)}
 function setLevel(lv){buildShell(lv);buildWh(lv);buildDine(dineLv);setFixtures(curFix);setEquip(curEq);rehome();focus(focusName)}
 setCounters(2,0,null);
 let t=0,lastT=performance.now();(function loop(){requestAnimationFrame(loop);const nw=performance.now(),dt=Math.min(.05,Math.max(.001,(nw-lastT)/1000));lastT=nw;t+=dt;
  const ck=1-Math.pow(.92,dt*60);for(const k in goal)cur[k]+=(goal[k]-cur[k])*ck;place();
  for(let i=cust.length-1;i>=0;i--){const c=cust[i];
   if(c.bub){c.bub.t-=dt;if(c.bub.t<=0){c.bub.e.remove();c.bub=null}}
   if(c.wait>0){c.wait-=dt;idle(c.m,dt,c.face);continue}
   const pt=c.path[c.i];if(!pt){dropC(c);cust.splice(i,1);continue}
   const last=c.i===c.path.length-1,stop=(pt[2]>0)||last,d=step(c.m,pt,dt,c.fleeing?c.fs:WS,stop,t);
   if(d<(stop?.12:.4)){c.wait=pt[2]||0;c.i++;if(pt[3])arrive(c,pt[3])}}
  tick(t,dt);R.render(scene,cam);cam.updateMatrixWorld();
  const hH=document.getElementById('hud').offsetHeight+4;lbl.forEach(l=>{if(lock||(l.vis&&!l.vis())){l.e.style.display='none';return}const p=l.v.clone().project(cam),yy=(-p.y*.5+.5)*V.h;if(p.z>1||yy<hH||V.h<240){l.e.style.display='none';return}
   l.e.style.display='';l.e.style.transform=`translate(${(p.x*.5+.5)*V.w}px,${(-p.y*.5+.5)*V.h}px) translate(-50%,-100%)`});
  cust.forEach(c=>{const e=c.tf||(c.bub&&c.bub.e);if(!e)return;if(c.tf)c.tf.textContent='🚨 抓小偷 '+Math.ceil(remT(c));
   const p=tmpV.set(c.m.position.x,c.m.position.y+2.1,c.m.position.z).project(cam),yy=(-p.y*.5+.5)*V.h;if(lock||p.z>1||yy<hH||V.h<240){e.style.display='none';return}
   e.style.display='';e.style.transform=`translate(${(p.x*.5+.5)*V.w}px,${(-p.y*.5+.5)*V.h}px) translate(-50%,-100%)`})})();
 return{tillReady,moveCust,laneReady,serveBelt,thiefCaught,setLevel,setEquip,setStaff,setDine:buildDine,setBags,callDriver,buyerPatrol,slots:()=>SLOTS.map(q=>q.code),setClrDisc:n=>{cdD=n;host.querySelectorAll('.lb em.cd').forEach(e=>e.textContent=n+'折')},setTill,leave,setHandlers:o=>{cb=o},setStock:m=>{stk=m;applyStock()},setBelt,beltScan,beltScanAll,onPick:f=>{pick=f},setFixtures,setVisible:(k,v)=>{if(opt[k])opt[k].visible=v;},setWall:c=>{wallC=c;walls.forEach(w=>w.material.color.setHex(c))},setOpen:b=>{if(!b){leaveAll();for(const k in lanes){lanes[k].forEach(m=>scene.remove(m));lanes[k].length=0}autos.forEach(a=>a.items.forEach(x=>beltG.remove(x.g)));autos.length=0;autoPend.length=0;till=null;tillId=0}},spawnCustomer,setCounters,icon,focus,
  mark:i=>{const f=FXS[i];if(i<0||!f){ring.visible=false;return}ring.visible=true;ring.position.x=f.x;ring.position.z=f.z+.3}}}

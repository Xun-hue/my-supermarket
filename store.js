// 整間店的 3D 場景（第 1 輪：戶外環境、倉庫棟、鏡頭切換、標籤氣泡、光影）
import * as THREE from 'three';
const rnd=n=>Math.floor(Math.random()*n);
const M=c=>new THREE.MeshLambertMaterial({color:c});
function box(w,h,d,c,x,y,z,p,o){const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),M(c));m.position.set(x,y,z);m.castShadow=m.receiveShadow=true;if(o){m.material.transparent=true;m.material.opacity=o;m.castShadow=false}if(p)p.add(m);return m}
function person(sh){const g=new THREE.Group(),sk=[0xf1c9a5,0xc68e6a,0x8d5a3c][rnd(3)];
 box(.4,.5,.25,0x2f3b5c,0,.25,0,g);box(.5,.6,.3,sh,0,.8,0,g);box(.12,.5,.14,sh,-.31,.8,0,g);box(.12,.5,.14,sh,.31,.8,0,g);
 box(.36,.36,.36,sk,0,1.28,0,g);box(.4,.12,.4,[0x1b1512,0x5a3a22,0x9a9a9a][rnd(3)],0,1.5,0,g);
 box(.06,.06,.02,0x222222,-.09,1.3,.19,g);box(.06,.06,.02,0x222222,.09,1.3,.19,g);return g}
function shelf(x,z,ry,cols,top,glass){const g=new THREE.Group(),fc=glass?0x3a6ea5:0x9aa5b8;g.position.set(x,0,z);g.rotation.y=ry;
 box(2.3,1.8,.08,fc,0,.9,-.3,g);box(.08,1.8,.65,fc,-1.15,.9,0,g);box(.08,1.8,.65,fc,1.15,.9,0,g);box(2.4,.18,.8,top,0,1.86,0,g);box(2.4,.05,.82,0xffffff,0,1.76,0,g);
 for(let l=0;l<4;l++){box(2.3,.06,.65,0xf4f4f8,0,.08+l*.52,0,g);box(2.3,.04,.04,top,0,.12+l*.52,.32,g);if(l<3)for(let i=0;i<7;i++)box(.24,.36,.2,cols[(i+l)%cols.length],-.9+i*.3,.29+l*.52,.05,g)}
 if(glass)box(2.2,1.6,.03,0xbfe3ff,0,.9,.33,g,.25);return g}
function counter(x,z){const g=new THREE.Group();g.position.set(x,0,z);
 box(2.2,.9,.9,0x3a404c,0,.45,0,g);box(1.9,.06,.7,0x22262e,-.1,.93,0,g);for(let i=-4;i<=4;i++)box(.04,.065,.68,0x343a46,-.1+i*.2,.93,0,g);
 box(.5,.35,.05,0x4dd4ff,.8,1.45,-.1,g);box(.1,.3,.1,0x22262e,.8,1.2,-.1,g);box(.4,.1,.35,0x1a1d24,.75,1.0,.15,g);
 box(.06,1.1,.8,0x9aa5b8,-1.1,1.4,0,g,.5);box(2.2,.1,.1,0x7a2a26,0,.9,.46,g);
 const c=person(0x2d7ff9);c.position.set(0,0,-.95);g.add(c);return g}
function rack(sc,x,z,ry){const g=new THREE.Group();g.position.set(x,0,z);g.rotation.y=ry;
 [-1.1,1.1].forEach(px=>[-.35,.35].forEach(pz=>box(.08,2.2,.08,0x3a5fa0,px,1.1,pz,g)));
 for(let l=0;l<3;l++){box(2.3,.06,.8,0xe6e8ee,0,.2+l*.7,0,g);for(let i=0;i<4;i++)box(.5,.4,.55,0xc8955e,-.8+i*.55,.43+l*.7,0,g),box(.18,.1,.02,[0xd63030,0x2d7ff9,0xe8b830][(i+l)%3],-.8+i*.55,.45+l*.7,.29,g)}
 sc.add(g)}
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
 const walls=[box(16.4,2.8,.2,0xf6ede2,0,1.4,-6.1,scene),box(.2,1,7,0xf6ede2,-8.1,.5,-2.5,scene),box(.2,1,2.5,0xf6ede2,-8.1,.5,4.75,scene)];
 box(16.6,.35,.3,0xc0392b,0,2.6,-6.05,scene);box(16.6,.2,.2,0xc0392b,0,1,6.05,scene);box(16.6,.5,.1,0x9aa5b8,0,.3,6.05,scene,.5);
 box(.1,2.3,2.5,0xbfe3ff,-8.1,1.15,2.25,scene,.3);box(.3,.5,2.7,0xff5a4e,-8.1,2.55,2.25,scene);box(1.6,.04,1.1,0xd94452,-7.4,.03,2.25,scene);
 // 倉庫棟（在店的左邊）
 const wf=box(9.6,.1,7.6,0xc4c4cc,-13,-.04,-2.5,scene);box(9.6,1.6,.2,0xb8b8c0,-13,.8,-6.1,scene);box(.2,1.6,7.6,0xb8b8c0,-17.8,.8,-2.5,scene);box(9.6,.5,.2,0xb8b8c0,-13,.25,1.3,scene);box(9.6,.3,.25,0xc0392b,-13,1.55,-6.05,scene);
 [-16,-13.4,-10.8].forEach(x=>rack(scene,x,-5.3,0));rack(scene,-17,-3,Math.PI/2);rack(scene,-17,-.4,Math.PI/2);
 for(let r=0;r<2;r++)for(let i=0;i<3-r;i++)box(.7,.5,.6,0xc8955e,-13.2+i*.75+r*.37,.25+r*.5,-1.6,scene);
 box(3,2.4,2.4,0xf5f7fa,-10.2,1.2,-.2,scene);box(1.1,1.9,.06,0x3a6ea5,-10.2,.97,1.02,scene);
 // 貨架（UI 會讀這份清單）
 const OR=0xff8a3d,BL=0x3a7bd5;
 const DEF=[['#1 飲料・零食貨架','飲料·零食',-6,-5.4,[0x4aa3ff,0xd63030,0xe8b830],OR],['#2 速食・零食貨架','速食·零食',-3.4,-5.4,[0xff8a3d,0xe8b830,0x6b3a1e],BL],['#3 零食・日用貨架','零食·日用',-.8,-5.4,[0xe05a4a,0xf4f4f4,0x4aa3ff],OR],
  ['#4 冷藏櫃','冷藏櫃',1.9,-5.4,[0xf4f4f4,0x4aa3ff,0xffffff],BL,1],['#5 冷藏櫃','冷藏櫃',4.5,-5.4,[0xf4f4f4,0x3fa65b,0xffffff],BL,1],['#6 島型貨架','速食·零食',-5,-2,[0xe8b830,0xe05a4a,0x3fa65b],OR]];
 const lbl=[],W={w:1,h:1};
 function label(html,x,y,z,vis){const e=document.createElement('div');e.className='lb';e.innerHTML=html;host.appendChild(e);lbl.push({e,v:new THREE.Vector3(x,y,z),vis})}
 const SH=DEF.map(([name,short,x,z,cols,top,gl])=>{scene.add(shelf(x,z,0,cols,top,gl));if(!gl&&z>-5)scene.add(shelf(x,z-.75,Math.PI,cols,top));label(short,x,2.3,z);return{name,x,z}});
 scene.add(shelf(-2.2,-2,0,[0xff8a3d,0x8a55bf,0xe05a4a],BL),shelf(-2.2,-2.75,Math.PI,[0x4aa3ff,0xe8b830],BL));label('日用·雜貨',-2.2,2.3,-2.4);
 const veg=new THREE.Group();veg.position.set(3,0,-2.2);scene.add(veg);const sg=new THREE.SphereGeometry(.13,8,6);
 for(let i=0;i<3;i++){box(.9,.45,.8,0xb98b5e,-1+i,.22,0,veg);for(let k=0;k<7;k++){const m=new THREE.Mesh(sg,M([0xd63030,0x3fa65b,0xff8a3d][i]));m.position.set(-1+i+(k%3-1)*.25,.52,(Math.floor(k/3)-1)*.25);veg.add(m)}}label('生鮮果蔬',3,1.3,-2.2);
 const fz=new THREE.Group();fz.position.set(6.2,0,-2.4);scene.add(fz);box(2,.8,1,0xf4f6fa,0,.4,0,fz);box(1.9,.08,.9,0xbfe3ff,0,.84,0,fz,.5);for(let i=0;i<5;i++)box(.3,.12,.5,[0xff9bb0,0x9bd0ff,0xffe08a][i%3],-.7+i*.35,.8,0,fz);label('冷凍櫃',6.2,1.4,-2.4);
 const cl=new THREE.Group();cl.position.set(6.4,0,.4);scene.add(cl);box(1.8,.8,.9,0xd94452,0,.4,0,cl);box(1.9,.08,1,0xe8b830,0,.84,0,cl);for(let i=0;i<4;i++)box(.3,.3,.3,[0xe8b830,0xf4f4f4,0x4aa3ff][i%3],-.6+i*.4,1,0,cl);label('臨期 <em>7折</em>',6.4,1.8,.4);
 [1.2,4.4].forEach(x=>{scene.add(counter(x,3));const c=person([0xe05a4a,0x3fa65b][rnd(2)]);c.position.set(x,0,4.2);c.rotation.y=Math.PI;scene.add(c)});label('收銀',2.8,2.3,2.6);
 const opt={};const hot=new THREE.Group();hot.position.set(-6.4,0,4.9);box(2.4,.9,.9,0xb85c38,0,.45,0,hot);box(2.2,.5,.7,0xffb347,0,1.15,0,hot,.65);
 const dine=new THREE.Group();[-3.8,-1.6].forEach(x=>{box(1,.06,1,0xd9c3a5,x,.75,4.7,dine);box(.1,.72,.1,0x8a6a4a,x,.38,4.7,dine);[-.8,.8].forEach(o=>box(.4,.4,.4,0xe05a4a,x+o,.2,4.7,dine))});
 hot.visible=dine.visible=false;scene.add(hot,dine);opt.hot=hot;opt.dine=dine;label('熱食檔口',-6.4,2,4.9,()=>hot.visible);label('就餐區',-2.7,1.8,4.7,()=>dine.visible);
 [[-7.5,-5.4],[7.5,-5.4],[7.5,5.3]].forEach(([x,z])=>{const g=new THREE.Group();g.position.set(x,0,z);const c=new THREE.Mesh(new THREE.CylinderGeometry(.25,.2,.4,10),M(0xc0713d));c.position.y=.2;g.add(c);const l=new THREE.Mesh(new THREE.SphereGeometry(.45,8,6),M(0x3fa65b));l.position.y=.85;l.castShadow=true;g.add(l);scene.add(g)});
 // 逛店顧客（開門後才出現）
 const WP=[[-5.5,.6],[-2.5,.6],[1.5,-.8],[5,-.3],[6.5,1.8],[0,1.6],[-6.5,-.4],[3.4,.4],[-3,1.8]];
 const cust=Array.from({length:6},(_,i)=>{const m=person([0xe05a4a,0x3fa65b,0x6a5acd,0xf2a33a,0x2d7ff9,0xc2185b][i]);const w=WP[rnd(WP.length)];m.position.set(w[0],0,w[1]);m.visible=false;scene.add(m);return{m,t:WP[rnd(WP.length)]}});
 const ring=new THREE.Mesh(new THREE.RingGeometry(1.3,1.5,32),new THREE.MeshBasicMaterial({color:0xffc400,side:THREE.DoubleSide}));ring.rotation.x=-Math.PI/2;ring.position.y=.05;ring.visible=false;scene.add(ring);
 // 鏡頭：預設位置會順順滑過去；單指旋轉、雙指縮放
 const PRE={all:{x:-1,z:.5,az:.62,el:.9,dist:25},cash:{x:2.8,z:3.2,az:.5,el:.8,dist:12},wh:{x:-13,z:-2.5,az:.6,el:1,dist:15},shelves:{x:-1,z:-4,az:.35,el:.75,dist:16},food:{x:-5,z:4.5,az:.5,el:.85,dist:13}};
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
  cust.forEach(c=>{if(!c.m.visible)return;const p=c.m.position,dx=c.t[0]-p.x,dz=c.t[1]-p.z,d=Math.hypot(dx,dz);if(d<.15)c.t=WP[rnd(WP.length)];else{p.x+=dx/d*.025;p.z+=dz/d*.025;c.m.rotation.y=Math.atan2(dx,dz);p.y=Math.abs(Math.sin(t*9))*.04}});
  R.render(scene,cam);cam.updateMatrixWorld();
  lbl.forEach(l=>{if(l.vis&&!l.vis()){l.e.style.display='none';return}const p=l.v.clone().project(cam);if(p.z>1){l.e.style.display='none';return}
   l.e.style.display='';l.e.style.transform=`translate(${(p.x*.5+.5)*W.w}px,${(-p.y*.5+.5)*W.h}px) translate(-50%,-100%)`})})();
 return{shelves:SH,setVisible:(k,v)=>{if(opt[k])opt[k].visible=v},setWall:c=>walls.forEach(w=>w.material.color.setHex(c)),setOpen:b=>cust.forEach(c=>c.m.visible=b),
  focus:n=>{let p=PRE[n];if(!p&&n.startsWith('shelf')){const s=SH[+n.slice(5)];p={x:s.x,z:s.z+.5,az:.3,el:.7,dist:9}}if(p)Object.assign(goal,p)},
  mark:i=>{if(i<0||!SH[i]){ring.visible=false;return}ring.visible=true;ring.position.x=SH[i].x;ring.position.z=SH[i].z+.3}}}

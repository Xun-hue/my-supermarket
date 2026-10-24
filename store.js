// 整間店的 3D 模型（全部用程式碼組出來，不需要任何 .glb）
import * as THREE from 'three';
const rnd=n=>Math.floor(Math.random()*n);
const M=c=>new THREE.MeshLambertMaterial({color:c});
function box(w,h,d,c,x,y,z,p,o){const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),M(c));m.position.set(x,y,z);if(o){m.material.transparent=true;m.material.opacity=o}if(p)p.add(m);return m}
function sign(text,w,bg){const c=document.createElement('canvas');c.width=320;c.height=80;const g=c.getContext('2d');
 g.fillStyle=bg||'#fff';g.fillRect(0,0,320,80);if(!bg){g.fillStyle='#d64034';g.fillRect(0,0,320,8)}
 g.fillStyle=bg?'#fff':'#2b1d14';g.font='bold 36px -apple-system,sans-serif';g.textAlign='center';g.textBaseline='middle';g.fillText(text,160,44);
 return new THREE.Mesh(new THREE.PlaneGeometry(w,w/4),new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(c)}))}
function person(sh){const g=new THREE.Group(),sk=[0xf1c9a5,0xc68e6a,0x8d5a3c][rnd(3)];
 box(.4,.5,.25,0x2f3b5c,0,.25,0,g);box(.5,.6,.3,sh,0,.8,0,g);box(.12,.5,.14,sh,-.31,.8,0,g);box(.12,.5,.14,sh,.31,.8,0,g);
 box(.36,.36,.36,sk,0,1.28,0,g);box(.4,.12,.4,[0x1b1512,0x5a3a22,0x9a9a9a][rnd(3)],0,1.5,0,g);
 box(.06,.06,.02,0x222222,-.09,1.3,.19,g);box(.06,.06,.02,0x222222,.09,1.3,.19,g);return g}
function shelf(x,z,ry,cols,glass){const g=new THREE.Group(),fc=glass?0x3a6ea5:0xb98b5e;g.position.set(x,0,z);g.rotation.y=ry;
 box(2.3,1.8,.08,fc,0,.9,-.3,g);box(.08,1.8,.65,fc,-1.15,.9,0,g);box(.08,1.8,.65,fc,1.15,.9,0,g);
 for(let l=0;l<4;l++){box(2.3,.06,.65,0xd9c3a5,0,.08+l*.52,0,g);if(l<3)for(let i=0;i<7;i++)box(.24,.36,.2,cols[(i+l)%cols.length],-.9+i*.3,.29+l*.52,.05,g)}
 if(glass)box(2.2,1.6,.03,0xbfe3ff,0,.9,.33,g,.25);return g}
function counter(x,z){const g=new THREE.Group();g.position.set(x,0,z);
 box(2.2,.9,.9,0x3a404c,0,.45,0,g);box(1.9,.06,.7,0x22262e,-.1,.93,0,g);for(let i=-4;i<=4;i++)box(.04,.065,.68,0x343a46,-.1+i*.2,.93,0,g);
 box(.5,.35,.05,0x4dd4ff,.8,1.45,-.1,g);box(.1,.3,.1,0x22262e,.8,1.2,-.1,g);box(.4,.1,.35,0x1a1d24,.75,1.0,.15,g);
 box(.06,1.1,.8,0x9aa5b8,-1.1,1.4,0,g,.5);box(2.2,.1,.1,0x7a2a26,0,.9,.46,g);
 const c=person(0x2d7ff9);c.position.set(0,0,-.95);g.add(c);return g}
export function initStore(host){
 const R=new THREE.WebGLRenderer({antialias:true});R.setPixelRatio(Math.min(devicePixelRatio||1,2));host.prepend(R.domElement);
 const scene=new THREE.Scene();scene.background=new THREE.Color(0xf0e4d6);
 const cam=new THREE.PerspectiveCamera(40,1,.1,100);
 scene.add(new THREE.AmbientLight(0xffffff,.85));const dl=new THREE.DirectionalLight(0xffffff,.75);dl.position.set(6,12,8);scene.add(dl);
 // 地板
 const fc=document.createElement('canvas');fc.width=fc.height=64;const fg=fc.getContext('2d');fg.fillStyle='#f3e7d8';fg.fillRect(0,0,64,64);fg.fillStyle='#e6d5c0';fg.fillRect(0,0,32,32);fg.fillRect(32,32,32,32);
 const ft=new THREE.CanvasTexture(fc);ft.wrapS=ft.wrapT=THREE.RepeatWrapping;ft.repeat.set(8,6);ft.magFilter=THREE.NearestFilter;
 const floor=new THREE.Mesh(new THREE.PlaneGeometry(16,12),new THREE.MeshLambertMaterial({map:ft}));floor.rotation.x=-Math.PI/2;scene.add(floor);
 // 牆（只做後牆和左牆，像剖面圖）＋大門
 const walls=[box(16.4,2.8,.2,0xf6ede2,0,1.4,-6.1,scene),box(.2,2.8,7,0xf6ede2,-8.1,1.4,-2.5,scene),box(.2,2.8,2.5,0xf6ede2,-8.1,1.4,4.75,scene)];
 box(.1,2.3,2.5,0xbfe3ff,-8.1,1.15,2.25,scene,.3);box(.25,.5,2.7,0xff5a4e,-8.1,2.55,2.25,scene);
 const ds=sign('日日鮮超市',2.6,'#ff5a4e');ds.rotation.y=Math.PI/2;ds.position.set(-7.95,2.55,2.25);scene.add(ds);
 // 貨架（UI 的「貨架」分頁會讀這份清單）
 const DEF=[['#1 飲料・零食貨架',-6,-5.4,[0x4aa3ff,0xd63030,0xe8b830]],['#2 速食・零食貨架',-3.4,-5.4,[0xff8a3d,0xe8b830,0x6b3a1e]],['#3 零食・日用貨架',-.8,-5.4,[0xe05a4a,0xf4f4f4,0x4aa3ff]],
  ['#4 冷藏櫃',1.9,-5.4,[0xf4f4f4,0x4aa3ff,0xffffff],1],['#5 冷藏櫃',4.5,-5.4,[0xf4f4f4,0x3fa65b,0xffffff],1],['#6 島型貨架',-5,-2,[0xe8b830,0xe05a4a,0x3fa65b]]];
 const SH=DEF.map(([name,x,z,cols,gl])=>{scene.add(shelf(x,z,0,cols,gl));if(!gl&&z>-5){scene.add(shelf(x,z-.75,Math.PI,cols));}
  if(z<-5){const s=sign(name.slice(3),2.2);s.position.set(x,2.3,-5.9);scene.add(s)}return{name,x,z}});
 scene.add(shelf(-2.2,-2,0,[0xff8a3d,0x8a55bf,0xe05a4a]),shelf(-2.2,-2.75,Math.PI,[0x4aa3ff,0xe8b830]));
 // 果蔬台、冷凍櫃、臨期特價區
 const veg=new THREE.Group();veg.position.set(3,0,-2.2);scene.add(veg);const sg=new THREE.SphereGeometry(.13,8,6);
 for(let i=0;i<3;i++){box(.9,.45,.8,0xb98b5e,-1+i,.22,0,veg);for(let k=0;k<7;k++){const m=new THREE.Mesh(sg,M([0xd63030,0x3fa65b,0xff8a3d][i]));m.position.set(-1+i+(k%3-1)*.25,.52,(Math.floor(k/3)-1)*.25);veg.add(m)}}
 const vs=sign('生鮮果蔬',1.8);vs.position.set(3,1.5,-2.2);scene.add(vs);
 const fz=new THREE.Group();fz.position.set(6.2,0,-2.4);scene.add(fz);box(2,.8,1,0xf4f6fa,0,.4,0,fz);box(1.9,.08,.9,0xbfe3ff,0,.84,0,fz,.5);for(let i=0;i<5;i++)box(.3,.12,.5,[0xff9bb0,0x9bd0ff,0xffe08a][i%3],-.7+i*.35,.8,0,fz);
 const cl=new THREE.Group();cl.position.set(6.4,0,.4);scene.add(cl);box(1.8,.8,.9,0xd94452,0,.4,0,cl);for(let i=0;i<4;i++)box(.3,.3,.3,[0xe8b830,0xf4f4f4,0x4aa3ff][i%3],-.6+i*.4,.95,0,cl);
 const cs=sign('臨期特價 7折',1.8,'#d94452');cs.position.set(6.4,1.7,.4);scene.add(cs);
 // 收銀台＋排隊顧客
 [1.2,4.4].forEach(x=>{scene.add(counter(x,3));const c=person([0xe05a4a,0x3fa65b][rnd(2)]);c.position.set(x,0,4.2);c.rotation.y=Math.PI;scene.add(c)});
 const bs=sign('收銀',1.2);bs.position.set(2.8,2.2,2.4);scene.add(bs);
 // 可購買的區域（買了才出現）
 const opt={};const hot=new THREE.Group();hot.position.set(-6.4,0,4.9);box(2.4,.9,.9,0xb85c38,0,.45,0,hot);box(2.2,.5,.7,0xffb347,0,1.15,0,hot,.65);const hs=sign('熱食檔口',2.2,'#e07a2f');hs.position.set(0,2,0);hot.add(hs);
 const dine=new THREE.Group();[-3.8,-1.6].forEach(x=>{box(1,.06,1,0xd9c3a5,x,.75,4.7,dine);box(.1,.72,.1,0x8a6a4a,x,.38,4.7,dine);[-.8,.8].forEach(o=>box(.4,.4,.4,0xe05a4a,x+o,.2,4.7,dine))});
 hot.visible=dine.visible=false;scene.add(hot,dine);opt.hot=hot;opt.dine=dine;
 // 裝飾
 [[-7.5,-5.4],[7.5,-5.4],[7.5,5.3]].forEach(([x,z])=>{const g=new THREE.Group();g.position.set(x,0,z);const c=new THREE.Mesh(new THREE.CylinderGeometry(.25,.2,.4,10),M(0xc0713d));c.position.y=.2;g.add(c);const l=new THREE.Mesh(new THREE.SphereGeometry(.45,8,6),M(0x3fa65b));l.position.y=.85;g.add(l);scene.add(g)});
 for(let i=0;i<3;i++)box(.7,.5,.5,0xc7ccd6,-7.3,.3+i*.12,.1+i*.05,scene);
 // 逛店顧客
 const WP=[[-5.5,.6],[-2.5,.6],[1.5,-.8],[5,-.3],[6.5,1.8],[0,1.6],[-6.5,-.4],[3.4,.4],[-3,1.8]];
 const cust=Array.from({length:6},(_,i)=>{const m=person([0xe05a4a,0x3fa65b,0x6a5acd,0xf2a33a,0x2d7ff9,0xc2185b][i]);const w=WP[rnd(WP.length)];m.position.set(w[0],0,w[1]);scene.add(m);return{m,t:WP[rnd(WP.length)]}});
 const ring=new THREE.Mesh(new THREE.RingGeometry(1.3,1.5,32),new THREE.MeshBasicMaterial({color:0xffc400,side:THREE.DoubleSide}));ring.rotation.x=-Math.PI/2;ring.position.y=.04;ring.visible=false;scene.add(ring);
 // 鏡頭：單指旋轉、雙指縮放
 let az=.62,el=.85,dist=21;const tgt=new THREE.Vector3(0,.5,0.5),pts=new Map(),cv=R.domElement;
 const place=()=>{cam.position.set(tgt.x+Math.sin(az)*Math.cos(el)*dist,tgt.y+Math.sin(el)*dist,tgt.z+Math.cos(az)*Math.cos(el)*dist);cam.lookAt(tgt)};
 const pd=()=>{const a=[...pts.values()];return Math.hypot(a[0].x-a[1].x,a[0].y-a[1].y)};
 cv.addEventListener('pointerdown',e=>{cv.setPointerCapture(e.pointerId);pts.set(e.pointerId,{x:e.clientX,y:e.clientY})});
 cv.addEventListener('pointermove',e=>{const p=pts.get(e.pointerId);if(!p)return;
  if(pts.size===2){const o=pd();p.x=e.clientX;p.y=e.clientY;dist=Math.min(30,Math.max(10,dist*o/pd()))}
  else{az=Math.min(1.25,Math.max(.1,az-(e.clientX-p.x)*.007));el=Math.min(1.15,Math.max(.45,el+(e.clientY-p.y)*.005));p.x=e.clientX;p.y=e.clientY}place()});
 const up=e=>pts.delete(e.pointerId);cv.addEventListener('pointerup',up);cv.addEventListener('pointercancel',up);
 const fit=()=>{const w=host.clientWidth,h=host.clientHeight;if(!w||!h)return;R.setSize(w,h);cam.aspect=w/h;cam.updateProjectionMatrix();place()};
 new ResizeObserver(fit).observe(host);fit();
 let t=0;(function loop(){requestAnimationFrame(loop);t+=.016;
  cust.forEach(c=>{const p=c.m.position,dx=c.t[0]-p.x,dz=c.t[1]-p.z,d=Math.hypot(dx,dz);if(d<.15)c.t=WP[rnd(WP.length)];else{p.x+=dx/d*.025;p.z+=dz/d*.025;c.m.rotation.y=Math.atan2(dx,dz);p.y=Math.abs(Math.sin(t*9))*.04}});
  R.render(scene,cam)})();
 return{shelves:SH,setVisible:(k,v)=>{if(opt[k])opt[k].visible=v},setWall:c=>walls.forEach(w=>w.material.color.setHex(c)),
  mark:i=>{if(i<0||!SH[i]){ring.visible=false;return}ring.visible=true;ring.position.x=SH[i].x;ring.position.z=SH[i].z+.3}}}

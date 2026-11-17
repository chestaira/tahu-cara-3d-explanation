import React,{useMemo} from 'react';
import {useCurrentFrame} from 'remotion';
import {CatmullRomCurve3,Color,DoubleSide,InstancedMesh,MeshStandardMaterial,Object3D,Shape,ShapeGeometry,TubeGeometry,Vector3} from 'three';

export function LeafCloud({seed=0,radius=1.8,count=580}:{seed?:number;radius?:number;count?:number}){
  const frame=useCurrentFrame();
  const leaves=useMemo(()=>{
    const s=new Shape();s.moveTo(0,-.5);s.bezierCurveTo(.32,-.2,.32,.25,0,.5);s.bezierCurveTo(-.32,.2,-.28,-.25,0,-.5);
    const mesh=new InstancedMesh(new ShapeGeometry(s),new MeshStandardMaterial({roughness:.8,side:DoubleSide}),count),o=new Object3D();
    for(let i=0;i<count;i++){
      const a=i*2.399+seed,r=radius*Math.cbrt(((i*73+seed*31)%997)/997),y=Math.sin(i*1.713+seed);
      o.position.set(Math.cos(a)*r*Math.sqrt(1-y*y),y*r*.63,Math.sin(a)*r*Math.sqrt(1-y*y));
      o.rotation.set(i*.71,i*.31+seed,i*1.13);o.scale.set(.3+(i%5)*.035,.4+(i%7)*.025,1);o.updateMatrix();mesh.setMatrixAt(i,o.matrix);
      const color=new Color(['#65A30D','#365314','#D97706'][(seed+i%7)%3]);color.multiplyScalar(.85+(i%5)*.07);mesh.setColorAt(i,color);
    }
    mesh.castShadow=true;mesh.receiveShadow=true;return mesh;
  },[seed,radius,count]);
  return <group rotation={[.012*Math.sin(frame*.05+seed),0,.018*Math.sin(frame*.05+seed*2)]}><primitive object={leaves}/></group>;
}

function Tree({index,position,scale}:{index:number;position:[number,number,number];scale:number}){
  const branches=useMemo(()=>Array.from({length:10},(_,b)=>{
    const a=b*2.4+index*.9,y=1.8+(b%4)*.47,reach=.9+(b%3)*.35;
    const points=b===0?[[0,0,0],[.12,1.8,0],[-.13,3.3,.13],[.1,4.65,.1]]:[[0,y-.6,0],[Math.cos(a)*reach*.5,y+.2,Math.sin(a)*reach*.5],[Math.cos(a)*reach,y+.85,Math.sin(a)*reach]];
    return new TubeGeometry(new CatmullRomCurve3(points.map(p=>new Vector3(...p))),16,b===0?.13:.045,7,false);
  }),[index]);
  return <group position={position} scale={scale} rotation={[.025*Math.sin(index),index*1.37,.04*Math.cos(index*2)]}>
    {branches.map((g,i)=><mesh key={i} geometry={g} castShadow><meshStandardMaterial color="#725339" roughness={.95}/></mesh>)}
    <group position={[0,3.7,0]}><LeafCloud seed={index} radius={1.85} count={850}/></group>
    <group position={[.8,4.45,-.25]}><LeafCloud seed={index+9} radius={1.15} count={300}/></group>
  </group>;
}

export function InstancedTrees(){
  const positions:[number,number,number][]=[[-8,.03,-4],[-6.4,.03,-9],[-2.9,.03,-11.8],[1.3,.03,-13.4],[5,.03,-11],[8.2,.03,-7],[8.8,.03,-1.8],[-9.2,.03,2]];
  return <group>{positions.map((p,i)=><Tree key={i} index={i} position={p} scale={[1.3,.85,1.1,1.4,.95,1.22,.7,1.05][i]}/>)}</group>;
}

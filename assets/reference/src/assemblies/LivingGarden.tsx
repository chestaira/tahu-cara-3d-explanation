import React,{useLayoutEffect,useMemo,useRef} from 'react';
import {useCurrentFrame} from 'remotion';
import {BackSide,Color,InstancedMesh,Object3D,PlaneGeometry,Vector3} from 'three';
import {LeafCloud} from './GardenTrees';
import {GrassMaterial,StoneMaterial} from '../materials';

export function Atmosphere(){
  const uniforms=useMemo(()=>({low:{value:new Color('#FDBA74')},middle:{value:new Color('#38BDF8')},high:{value:new Color('#1E293B')}}),[]);
  return <><fog attach="fog" args={['#FDE68A',12,38]}/><mesh renderOrder={-10}>
    <sphereGeometry args={[110,32,24]}/><shaderMaterial side={BackSide} depthWrite={false} uniforms={uniforms} vertexShader={'varying vec3 v; void main(){v=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }'} fragmentShader={'uniform vec3 low;uniform vec3 middle;uniform vec3 high;varying vec3 v;void main(){float h=clamp(normalize(v).y,0.,1.);vec3 c=mix(low,middle,smoothstep(0.,.45,h));c=mix(c,high,smoothstep(.4,1.,h));gl_FragColor=vec4(c,1.);\n#include <tonemapping_fragment>\n#include <colorspace_fragment>\n}'}/>
  </mesh></>;
}

export function RollingGround(){
  const geometry=useMemo(()=>{const g=new PlaneGeometry(160,160,100,100);g.rotateX(-Math.PI/2);const p=g.attributes.position;
    for(let i=0;i<p.count;i++){const x=p.getX(i),z=p.getZ(i),distance=Math.hypot(x,z),blend=Math.min(1,Math.max(0,(distance-10)/12));p.setY(i,.02+blend*(1.6+.85*Math.sin(x*.19+z*.13)+.65*Math.cos(z*.21)));}g.computeVertexNormals();return g;
  },[]);
  return <mesh geometry={geometry} receiveShadow><GrassMaterial/></mesh>;
}

export function GardenBoundary(){return <group>
  <mesh position={[0,.47,-14.5]} castShadow receiveShadow><boxGeometry args={[42,.9,.5]}/><StoneMaterial color="#947d64"/></mesh>
  <mesh position={[0,.98,-14.5]} castShadow><boxGeometry args={[42,.16,.65]}/><StoneMaterial color="#c7ae84"/></mesh>
  {Array.from({length:43},(_,i)=><group key={i} position={[i-21,1.1,-14.5]}><mesh position={[0,.65,0]} castShadow><cylinderGeometry args={[.024,.024,1.3,6]}/><meshStandardMaterial color="#35403a" metalness={.65} roughness={.4}/></mesh><mesh position={[0,1.31,0]}><coneGeometry args={[.065,.16,4]}/><meshStandardMaterial color="#35403a"/></mesh></group>)}
  {[1.3,2.1].map(y=><mesh key={y} position={[0,y,-14.5]}><boxGeometry args={[42,.035,.035]}/><meshStandardMaterial color="#35403a" metalness={.65}/></mesh>)}
  {Array.from({length:25},(_,i)=><group key={i} position={[-20+i*1.65,1.05+(i%3)*.13,-12.9]} scale={[1,.75+(i%4)*.09,.75]}><LeafCloud seed={i+30} radius={1.3} count={200}/></group>)}
  {[-1,1].map(side=><group key={side}>{Array.from({length:8},(_,i)=><group key={i} position={[side*11,1,-12+i*1.8]}><LeafCloud seed={i+50} radius={1.25} count={160}/></group>)}</group>)}
 </group>;}

export function FlowerBeds(){
  const ref=useRef<InstancedMesh>(null),frame=useCurrentFrame();
  useLayoutEffect(()=>{if(!ref.current)return;const o=new Object3D();for(let i=0;i<120;i++){
    const a=i*2.399,r=4.2+(i%11)*.22,x=Math.cos(a)*r,z=Math.sin(a)*r;
    for(let petal=0;petal<5;petal++){const angle=petal*Math.PI*2/5;o.position.set(x+Math.cos(angle)*.045+.015*Math.sin(frame*.05+i),.24+(i%3)*.05,z+Math.sin(angle)*.045);o.rotation.set(-Math.PI/2,0,angle);o.scale.set(.045,.075,.018);o.updateMatrix();ref.current.setMatrixAt(i*5+petal,o.matrix);ref.current.setColorAt(i*5+petal,new Color(['#FACC15','#FFF7ED','#F9A8D4'][i%3]));}}
    ref.current.instanceMatrix.needsUpdate=true;if(ref.current.instanceColor)ref.current.instanceColor.needsUpdate=true;
  },[frame]);
  return <instancedMesh ref={ref} args={[undefined,undefined,600]}><sphereGeometry args={[1,6,4]}/><meshStandardMaterial roughness={.8}/></instancedMesh>;
}

export function GoldenMotes(){const frame=useCurrentFrame(),ref=useRef<InstancedMesh>(null);useLayoutEffect(()=>{if(!ref.current)return;const o=new Object3D();for(let i=0;i<36;i++){o.position.set(Math.sin(i*13.7)*6+.25*Math.sin(frame*.012+i),.7+(i%9)*.37+.13*Math.sin(frame*.018+i*2),Math.cos(i*4.7)*5);o.scale.setScalar(.012+.009*(.5+.5*Math.sin(frame*.03+i)));o.updateMatrix();ref.current.setMatrixAt(i,o.matrix);}ref.current.instanceMatrix.needsUpdate=true;},[frame]);return <instancedMesh ref={ref} args={[undefined,undefined,36]}><sphereGeometry args={[1,6,4]}/><meshStandardMaterial color="#FFE6A4" emissive="#FFD07A" emissiveIntensity={2.5} transparent opacity={.6} depthWrite={false}/></instancedMesh>;}

export function RearPath(){return <group>{Array.from({length:24},(_,i)=>{const z=3.5-i*.7,x=4.1+Math.sin(i*.15)*1.1;return <mesh key={i} position={[x,.06,z]} rotation={[-Math.PI/2,0,i*.47]}><circleGeometry args={[.4+(i%3)*.03,7]}/><StoneMaterial color={i%2?'#c8b69a':'#a6977f'}/></mesh>;})}</group>;}

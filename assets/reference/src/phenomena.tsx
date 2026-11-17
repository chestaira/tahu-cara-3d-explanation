import React,{useLayoutEffect,useMemo,useRef} from 'react';
import {CatmullRomCurve3,Color,InstancedMesh,Object3D,TubeGeometry,Vector3} from 'three';
import {Wire} from './assemblies/Pump';
import {ease,NARRATION_OFFSET} from './timeline';

const inlet=new CatmullRomCurve3([[-1.6,.57,1.45],[-1.25,.54,1.1],[-.96,.519,.97],[-.96,.519,.78]].map(p=>new Vector3(...p)));
const impeller=new CatmullRomCurve3([[-.96,.519,.78],[-.91,.519,.76],[-.83,.559,.75],[-.78,.619,.75],[-.74,.689,.74],[-.666,.82,.71]].map(p=>new Vector3(...p)));
const pipePoints:[number,number,number][]=[[-.666,.82,.71],[-.5,.96,.64],[-.21,1.02,.33],[0,1.14,0],[0,1.9,0],[0,2.7,0],[0,3.25,0],[0,3.88,0]];
const pipe=new CatmullRomCurve3(pipePoints.map(p=>new Vector3(...p)));
const returning=new CatmullRomCurve3([[0,3.88,0],[.16,4.03,.1],[.4,3.95,.25],[.61,3.7,.4],[.73,3.14,.47],[1.3,3.04,.62],[1.63,3.06,.65],[1.7,2.8,.68],[1.8,2.2,.72],[1.87,1.5,.75],[1.9,.76,.76],[1.4,.74,1],[.6,.7,1.2],[-.7,.6,1.3],[-1.35,.45,1.3]].map(p=>new Vector3(...p)));

function FlowParticles({curve,frame,count=48,visible=1,color='#24c9ed',speed=.25,size=.022}:{curve:CatmullRomCurve3;frame:number;count?:number;visible?:number;color?:string;speed?:number;size?:number}) {
  const ref=useRef<InstancedMesh>(null);
  useLayoutEffect(()=>{if(!ref.current)return;const o=new Object3D();for(let i=0;i<count;i++){const u=(i/count+frame/30*speed)%1; o.position.copy(curve.getPoint(u));o.scale.setScalar(size*visible*(.8+.2*Math.sin(i)));o.updateMatrix();ref.current.setMatrixAt(i,o.matrix);ref.current.setColorAt(i,new Color(color).lerp(new Color('#e3fcff'),u*.45));}ref.current.instanceMatrix.needsUpdate=true;if(ref.current.instanceColor)ref.current.instanceColor.needsUpdate=true;},[frame,curve,count,visible,color,speed,size]);
  return <instancedMesh ref={ref} args={[undefined,undefined,count]} frustumCulled={false}><sphereGeometry args={[1,8,6]}/><meshStandardMaterial color="#78e8f8" emissive="#1682a7" emissiveIntensity={.42} roughness={.18} metalness={.15}/></instancedMesh>;
}

export function PumpFlow({frame,xray}:{frame:number;xray:number}) {
  const t=frame/30-NARRATION_OFFSET;
  // Integrate speed changes. Multiplying absolute frame by a varying speed
  // would reverse particles during slowdown.
  const integral=(start:number,end:number)=>{if(t<=start)return 0;if(t>=end)return t-(start+end)/2;const u=(t-start)/(end-start);return (end-start)*(u<.5?u**4: u+(1-u)**4-.5);};
  const flowFrame=frame-30*.6*(integral(54,57)-integral(60,62));
  const motorFocus=ease(t,20.22,22.8)*(1-ease(t,30,31.5));
  const active=xray*(1-motorFocus*.95);
  return <group>
    <Wire points={pipePoints} radius={.058} color="#203d4a" opacity={Math.max(.16,1-xray*.82)}/>
    {pipePoints.slice(1,-1).map((p,i)=><mesh key={i} position={p}><torusGeometry args={[.066,.012,8,28]}/><meshStandardMaterial color="#CBD5E1" metalness={.88} roughness={.25}/></mesh>)}
    <FlowParticles curve={inlet} frame={flowFrame} count={9} speed={.22} visible={active} size={.014}/>
    <FlowParticles curve={impeller} frame={flowFrame} count={12} speed={.32} visible={active} size={.012}/>
    <FlowParticles curve={pipe} frame={flowFrame} count={40} speed={.12} visible={active} size={.016}/>
    <FlowParticles curve={returning} frame={frame} count={100} speed={.1} visible={ease(t,46,48)} size={.025}/>
  </group>;
}

export function FountainWater({frame,opacity=1}:{frame:number;opacity?:number}) {
  const curves=useMemo(()=>Array.from({length:32},(_,i)=>{const a=i*Math.PI*2/32,c=Math.cos(a),s=Math.sin(a);return new CatmullRomCurve3([[c*1.64,3.05,s*1.64],[c*1.7,2.96,s*1.7],[c*1.79,2.35,s*1.79],[c*1.89,1.45,s*1.89],[c*1.94,.76,s*1.94]].map(p=>new Vector3(...p)));}),[]);
  const geometries=useMemo(()=>curves.map(c=>new TubeGeometry(c,32,.009,6,false)),[curves]);
  const jetCurves=useMemo(()=>Array.from({length:10},(_,i)=>{const a=i*Math.PI/5,c=Math.cos(a),s=Math.sin(a);return new CatmullRomCurve3([[0,3.89,0],[c*.17,4.03,s*.17],[c*.4,3.9,s*.4],[c*.66,3.05,s*.66]].map(p=>new Vector3(...p)));}),[]);
  return <group>
    {curves.map((c,i)=><group key={i}><mesh geometry={geometries[i]}><meshPhysicalMaterial color="#a8e4ed" transparent opacity={opacity*.22} transmission={.85} ior={1.33} thickness={.04} roughness={.12} clearcoat={.8}/></mesh><FlowParticles curve={c} frame={frame} count={10} speed={.48} visible={opacity} size={.012}/></group>)}
    {jetCurves.map((c,i)=><FlowParticles key={i} curve={c} frame={frame} count={12} speed={.55} visible={opacity} size={.014}/>)}
    {Array.from({length:8},(_,i)=>{const a=i*Math.PI/4,r=.1+((frame/30*.23+i*.12)%1)*.25;return <mesh key={i} rotation={[-Math.PI/2,0,0]} position={[Math.cos(a)*1.94,.761,Math.sin(a)*1.94]}><torusGeometry args={[r,.004,5,32]}/><meshStandardMaterial color="#afdee1" transparent opacity={opacity*.3}/></mesh>;})}
  </group>;
}

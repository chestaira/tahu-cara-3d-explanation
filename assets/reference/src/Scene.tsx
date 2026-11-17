import React,{useEffect,useLayoutEffect,useRef} from 'react';
import {useThree} from '@react-three/fiber';
import {Box3,Group,PerspectiveCamera} from 'three';
import {continueRender} from 'remotion';
import {Pump} from './assemblies/Pump';
import {Fountain} from './assemblies/Fountain';
import {Garden} from './assemblies/Garden';
import {Atmosphere} from './assemblies/LivingGarden';
import {FountainWater,PumpFlow} from './phenomena';
import {cameraAt,ease,NARRATION_OFFSET} from './timeline';

export function SceneReady({handle,frame}:{handle:number;frame:number}){
  const {advance,gl}=useThree();
  useEffect(()=>{gl.toneMappingExposure=.78;advance(frame/30);advance(frame/30);continueRender(handle);},[handle,advance,gl,frame]);
  return null;
}
export function Scene({frame}:{frame:number}){
  const {camera}=useThree(),fountain=useRef<Group>(null),pump=useRef<Group>(null);
  const t=frame/30-NARRATION_OFFSET;
  const xray=ease(t,9.2,12.6)*(1-ease(t,62.72,65.5));
  const pumpXray=ease(t,14.72,17.48)*(1-ease(t,62.72,65.5));
  const motorReveal=ease(t,20.22,22.8)*(1-ease(t,30,31.5));
  useLayoutEffect(()=>{const pose=cameraAt(frame);camera.position.copy(pose.position);if(camera instanceof PerspectiveCamera){camera.fov=pose.camera.fov;camera.updateProjectionMatrix();}camera.lookAt(pose.target);camera.updateMatrixWorld();
    if([0,450,710,1050,2030].includes(frame))for(const [name,ref]of [['fountain',fountain],['pump',pump]]as const){if(!ref.current)continue;ref.current.updateWorldMatrix(true,true);const b=new Box3().setFromObject(ref.current);console.log('BOUNDS',JSON.stringify({name,frame,min:b.min.toArray(),max:b.max.toArray(),floorY:name==='pump'?.28:.02,pass:b.min.y>=(name==='pump'?.28:.0199)}));}
  },[camera,frame]);
  return <>
    <Atmosphere/>
    <Garden detail={ease(t,12.36,16)*(1-ease(t,39,43)) + ease(t,53.92,55)*(1-ease(t,58,59))}/>
    <group ref={fountain}><Fountain xray={xray}/></group>
    <group ref={pump}><Pump time={t} xray={pumpXray} motorReveal={motorReveal}/></group>
    <PumpFlow frame={frame} xray={xray}/>
    <FountainWater frame={frame} opacity={1-xray*.82}/>
  </>;
}

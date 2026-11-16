import React, {useLayoutEffect, useRef} from 'react';
import {Environment, ContactShadows} from '@react-three/drei';
import {Bloom, EffectComposer, N8AO, ToneMapping} from '@react-three/postprocessing';
import {ToneMappingMode} from 'postprocessing';
import {Audio, Img, Sequence, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';

export function getImpactShake(frame:number, impactFrame:number, intensity=.08, fps=30){
  const elapsed=frame-impactFrame;
  if(elapsed<0||elapsed>=8)return 0;
  const t=elapsed/fps;
  return intensity*Math.sin(t*45)*Math.exp(-t*8);
}

// Place inside ThreeCanvas/Suspense. Wait for HDR and fonts before capturing.
export function CoreEnvironment({floorY=0,hdrFile}:{floorY?:number;hdrFile?:string}){
  const ao=useRef<any>(null);
  useLayoutEffect(()=>{if(ao.current){ao.current.configuration.gammaCorrection=false;ao.current.configuration.autoRenderBeauty=false;}},[]);
  return <>
    {hdrFile?<Environment files={staticFile(hdrFile)} environmentIntensity={.6} background={false}/>:<Environment preset="studio" environmentIntensity={.6} background={false}/>}
    <hemisphereLight args={['#BAE6FD','#78716C',.3]}/>
    <directionalLight position={[4,7,3]} color="#FFD28E" intensity={2.8} castShadow shadow-mapSize={[2048,2048]} shadow-bias={-.0005} shadow-normalBias={.015} shadow-radius={3} shadow-camera-left={-8} shadow-camera-right={8} shadow-camera-top={8} shadow-camera-bottom={-8}/>
    <ContactShadows position={[0,floorY+.001,0]} opacity={.45} scale={10} blur={2} far={4} frames={Infinity}/>
    <EffectComposer multisampling={0}><N8AO ref={ao} aoRadius={.5} intensity={1.2}/><Bloom mipmapBlur luminanceThreshold={1.1} intensity={.35}/><ToneMapping mode={ToneMappingMode.ACES_FILMIC}/></EffectComposer>
  </>;
}

// DOM overlay: render once outside ThreeCanvas, including during outro.
export function BrandWatermark(){return <Img src={staticFile('logo.png')} style={{position:'absolute',top:'5%',right:'6%',width:72,height:72,borderRadius:14,opacity:.5,objectFit:'contain'}}/>;}

export type SoundEvent={frame:number;type:'whoosh'|'popup'|'click';durationInFrames:number};
const sounds={whoosh:{file:'whoosh.mp3',volume:.35},popup:{file:'ui popup.mp3',volume:.25},click:{file:'click.mp3',volume:.3}};
export function AutoAudioLayer({events,outroFrame,narration}:{events:SoundEvent[];outroFrame:number;narration?:string}){
  const frame=useCurrentFrame(),{durationInFrames}=useVideoConfig();
  const unique=events.filter((event,index)=>events.findIndex(e=>e.frame===event.frame&&e.type===event.type)===index);
  return <>
    {narration&&<Audio src={staticFile(narration)}/>}
    <Audio src={staticFile('sfx/bgm.mp3')} loop volume={frame>=outroFrame?.03:.07}/>
    {unique.filter(e=>e.frame>=0&&e.frame<durationInFrames).map(e=><Sequence key={`${e.type}-${e.frame}`} from={e.frame} durationInFrames={Math.max(1,Math.min(e.durationInFrames,durationInFrames-e.frame))} layout="none"><Audio src={staticFile(`sfx/${sounds[e.type].file}`)} volume={sounds[e.type].volume}/></Sequence>)}
  </>;
}

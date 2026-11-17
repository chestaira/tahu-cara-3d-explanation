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
export function CoreEnvironment({floorY=0,hdrFile,context='indoor'}:{floorY?:number;hdrFile?:string;context?:'indoor'|'outdoor'}){
  const ao=useRef<any>(null);
  useLayoutEffect(()=>{if(ao.current){ao.current.configuration.gammaCorrection=false;ao.current.configuration.autoRenderBeauty=false;}},[]);
  const outdoor=context==='outdoor';
  return <>
    {outdoor?<Environment preset="sunset" environmentIntensity={.75} background={false}/>:hdrFile?<Environment files={staticFile(hdrFile)} environmentIntensity={.6} background={false}/>:<Environment preset="studio" environmentIntensity={.6} background={false}/>}
    {outdoor?<hemisphereLight args={['#93C5FD','#365314',.65]}/>:<hemisphereLight args={['#BAE6FD','#78716C',.3]}/>}
    <directionalLight position={outdoor?[-6,3.2,4]:[4,7,3]} color={outdoor?'#FFB76B':'#FFD28E'} intensity={outdoor?3.2:2.8} castShadow shadow-mapSize={[2048,2048]} shadow-bias={-.0005} shadow-normalBias={.015} shadow-radius={3} shadow-camera-left={-8} shadow-camera-right={8} shadow-camera-top={8} shadow-camera-bottom={-8}/>
    <ContactShadows position={[0,floorY+.001,0]} opacity={.45} scale={10} blur={2} far={4} frames={Infinity}/>
    <EffectComposer multisampling={0}><N8AO ref={ao} aoRadius={.5} intensity={1.2}/><Bloom mipmapBlur luminanceThreshold={1.1} intensity={.35}/><ToneMapping mode={ToneMappingMode.ACES_FILMIC}/></EffectComposer>
  </>;
}

// DOM overlay: render once outside ThreeCanvas, including during outro.
export function BrandWatermark(){return <Img src={staticFile('logo.png')} style={{position:'absolute',top:'5%',right:'6%',width:72,height:72,borderRadius:14,opacity:.5,objectFit:'contain'}}/>;}

export type SoundEvent={frame:number;type:'whoosh'|'popup'|'click';durationInFrames:number};
const sounds={whoosh:{file:'whoosh.mp3',volume:.35},popup:{file:'ui popup.mp3',volume:.25},click:{file:'click.mp3',volume:.3}};
export function AutoAudioLayer({events,outroFrame,narration,speechWindows=[]}:{events:SoundEvent[];outroFrame:number;narration?:string;speechWindows?:{start:number;end:number}[]}){
  const frame=useCurrentFrame(),{durationInFrames}=useVideoConfig();
  const clamp=(n:number)=>Math.max(0,Math.min(1,n));
  const voiceAt=(f:number)=>speechWindows.reduce((level,w)=>Math.max(level,Math.min(clamp((f-w.start*30+4)/4),clamp((w.end*30+10-f)/7))),0);
  const bgmVolume=(f:number)=>(f>=outroFrame?.03:.07-.035*voiceAt(f))*clamp((durationInFrames-f)/18)*clamp((f+1)/12);
  const unique=events.filter((event,index)=>events.findIndex(e=>e.frame===event.frame&&e.type===event.type)===index);
  return <>
    {narration&&<Audio src={staticFile(narration)} volume={.92}/>}
    <Audio src={staticFile('sfx/bgm.mp3')} loop volume={bgmVolume}/>
    {unique.filter(e=>e.frame>=0&&e.frame<durationInFrames).map(e=><Sequence key={`${e.type}-${e.frame}`} from={e.frame} durationInFrames={Math.max(1,Math.min(e.durationInFrames,durationInFrames-e.frame))} layout="none"><Audio src={staticFile(`sfx/${sounds[e.type].file}`)} volume={f=>sounds[e.type].volume*(1-.28*voiceAt(f+e.frame))}/></Sequence>)}
  </>;
}

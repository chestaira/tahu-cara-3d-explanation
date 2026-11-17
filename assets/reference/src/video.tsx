import React,{Suspense,useEffect,useState} from 'react';
import {AbsoluteFill,Composition,Sequence,cancelRender,continueRender,delayRender,staticFile,useCurrentFrame} from 'remotion';
import {ThreeCanvas} from '@remotion/three';
import {CoreEnvironment,BrandWatermark,AutoAudioLayer} from './components/core/CoreEnvironment';
import {CalloutPointer,WorldSyncedPill} from './components/core/CalloutPointer';
import {KaraokeSubtitle} from './components/core/KaraokeSubtitle';
import {BrandOutro} from './components/core/BrandOutro';
import {Scene,SceneReady} from './Scene';
import {cameraAt,DURATION,OUTRO,events,ease,COVER_END} from './timeline';
import {hudState} from './hud-state';
import groups from './caption-groups.json';

function Fonts(){const[handle]=useState(()=>delayRender('Load local brand fonts'));useEffect(()=>{Promise.all([new FontFace('Plus Jakarta Sans',`url(${staticFile('jakarta.ttf')})`,{weight:'100 900'}).load(),new FontFace('JetBrains Mono',`url(${staticFile('mono.ttf')})`,{weight:'100 900'}).load()]).then(fonts=>{fonts.forEach(font=>document.fonts.add(font));continueRender(handle);}).catch(cancelRender);},[handle]);return null;}

export function Video(){
  const frame=useCurrentFrame(),h=hudState(frame),pose=cameraAt(frame);
  const[sceneHandle]=useState(()=>delayRender('HDR and scene assets'));
  return <AbsoluteFill style={{background:'#e1ded0',fontFamily:'Plus Jakarta Sans'}}>
    <Fonts/>
    {frame<OUTRO&&<>
      <ThreeCanvas width={1080} height={1920} shadows camera={{fov:34,position:[7.6,6.1,11.2],near:.04,far:130}} gl={{antialias:true}}>
         <Suspense fallback={null}><CoreEnvironment context="outdoor" floorY={.02}/><Scene frame={frame}/><SceneReady handle={sceneHandle} frame={frame}/></Suspense>
      </ThreeCanvas>
      <div style={{position:'absolute',inset:0,background:'linear-gradient(rgba(7,25,21,.28),transparent 34%,transparent 78%,rgba(7,25,21,.24))',pointerEvents:'none'}}/>
      <div style={{position:'absolute',top:'5%',left:'6%',padding:'17px 23px',borderRadius:40,background:'#D9F938',fontWeight:800,fontSize:26,color:'#0F172A'}}>TAHU CARA / POMPA AIR MANCUR</div>
      {frame<COVER_END&&<div style={{position:'absolute',top:'33%',left:'8%',width:'84%',textAlign:'center',fontSize:76,lineHeight:1.12,fontWeight:800,color:'#fff',textShadow:'0 4px 24px #0f201c',opacity:1-ease(frame,36,45),transform:`translateY(${-12*ease(frame,36,45)}px) scale(${1+.04*ease(frame,36,45)})`}}>Air Mancur<br/><span style={{color:'#0F172A',background:'#D9F938',padding:'0 14px',textShadow:'none'}}>Muter Terus?</span></div>}
      {h.state!=='idle'&&<CalloutPointer point={h.shot.anchor} camera={pose.camera} startFrame={h.start} endFrame={h.end} label={h.shot.label} card={{x:65,y:284,width:950}} occluded={false}/>}
      {frame>=COVER_END&&<>
        <WorldSyncedPill camera={pose.camera} point={[h.shot.anchor[0]-.12,h.shot.anchor[1]+.13,h.shot.anchor[2]]} text={h.shot.pill} startFrame={h.start} endFrame={h.end} occluded={h.i<2||h.i>8}/>
        <KaraokeSubtitle outroFrame={OUTRO} groups={groups} dangerWords={['tersumbat','rendah','melemah','berkurang']}/>
        <div style={{position:'absolute',bottom:'8%',left:'6%',fontFamily:'JetBrains Mono',fontSize:20,color:'#F1F5F9',opacity:.8,background:'rgba(15,23,42,.8)',padding:'12px 16px',borderRadius:10}}>ILUSTRASI ALIRAN • KONSTRUKSI POMPA BERVARIASI</div>
      </>}
    </>}
    {frame>=OUTRO&&<><SceneDone handle={sceneHandle}/><Sequence from={OUTRO}><BrandOutro showWatermark={false} headline="Airnya dipakai ulang." highlight="Listrik memberi energi." summary="Pompa mengalirkan air ke nosel. Gravitasi mengembalikannya ke bak." cta="Mau bedah bentuk noselnya?"/></Sequence></>}
    <BrandWatermark/>
    <AutoAudioLayer events={events} outroFrame={OUTRO} narration="narration-normalized.wav" speechWindows={groups.map(g=>({start:g[0].start,end:g[g.length-1].end}))}/>
  </AbsoluteFill>;
}
function SceneDone({handle}:{handle:number}){useEffect(()=>continueRender(handle),[handle]);return null;}
function AudioReview(){return <AutoAudioLayer events={events} outroFrame={OUTRO} narration="narration-normalized.wav" speechWindows={groups.map(g=>({start:g[0].start,end:g[g.length-1].end}))}/>;}
export const previewSections=[
  {name:'Cover dan taman hidup',source:0,length:120},
  {name:'Reveal bak dan rumah pompa',source:320,length:60},
  {name:'Close-up motor',source:720,length:45},
  {name:'Aliran impeller',source:1080,length:45},
  {name:'Opacity kembali solid',source:1930,length:90},
  {name:'Outro',source:2153,length:60},
];
function Preview(){let offset=0;return <>{previewSections.map(section=>{const start=offset;offset+=section.length;return <Sequence key={section.name} from={start} durationInFrames={section.length}><Sequence from={-section.source}><Video/></Sequence></Sequence>;})}</>;}
export function Root(){return <><Composition id="PompaAirMancur" component={Video} width={1080} height={1920} fps={30} durationInFrames={DURATION}/><Composition id="Preview" component={Preview} width={1080} height={1920} fps={30} durationInFrames={previewSections.reduce((sum,s)=>sum+s.length,0)}/><Composition id="AudioReview" component={AudioReview} width={1080} height={1920} fps={30} durationInFrames={DURATION}/></>;}

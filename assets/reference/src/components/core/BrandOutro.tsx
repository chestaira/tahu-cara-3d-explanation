import React from 'react';
import {AbsoluteFill,Img,spring,staticFile,useCurrentFrame,useVideoConfig} from 'remotion';
import {BrandWatermark} from './CoreEnvironment';
export function BrandOutro({headline='Sekarang kamu tahu',highlight='caranya.',summary,cta='Mau dibedah apa lagi?',showWatermark=true}:{headline?:string;highlight?:string;summary:string;cta?:string;showWatermark?:boolean}){
  const frame=useCurrentFrame(),{fps}=useVideoConfig();
  const motion=(delay:number)=>{const p=spring({frame:Math.max(0,frame-delay),fps,config:{damping:15,stiffness:190,mass:.7}});return {opacity:Math.max(0,Math.min(1,p)),transform:`translateY(${20*(1-p)}px) scale(${.94+.06*p})`};};
  return <AbsoluteFill style={{backgroundColor:'#F8FAFC',backgroundImage:'linear-gradient(#E2E8F0 1px,transparent 1px),linear-gradient(90deg,#E2E8F0 1px,transparent 1px)',backgroundSize:'60px 60px',fontFamily:'Plus Jakarta Sans',color:'#0F172A',justifyContent:'center',alignItems:'center'}}>
    {showWatermark&&<BrandWatermark/>}
    <div style={{width:900,textAlign:'center'}}>
      <div style={motion(0)}><Img src={staticFile('logo.png')} style={{width:180,height:180,borderRadius:32,border:'8px solid #D9F938'}}/></div>
      <h1 style={{fontSize:72,lineHeight:1.15,margin:'45px 0',fontWeight:800,...motion(3)}}>{headline}<br/><span style={{background:'#D9F938',padding:'0 14px'}}>{highlight}</span></h1>
      <div style={{fontSize:34,lineHeight:1.5,padding:34,borderRadius:24,background:'#fff',border:'1px solid #E2E8F0',...motion(6)}}>{summary}</div>
      <div style={{display:'inline-block',marginTop:44,padding:'24px 36px',borderRadius:60,background:'#0F172A',color:'#D9F938',fontSize:32,fontWeight:800,...motion(9)}}>{cta}</div>
    </div>
  </AbsoluteFill>;
}

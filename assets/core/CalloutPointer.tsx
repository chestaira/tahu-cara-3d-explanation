import React,{useId} from 'react';
import {spring,useCurrentFrame,useVideoConfig} from 'remotion';
import {Camera,Vector3} from 'three';
const clamp=(v:number)=>Math.max(0,Math.min(1,v));
export function projectAnchor(point:[number,number,number],camera:Camera,width:number,height:number){
  camera.updateMatrixWorld();
  const p=new Vector3(...point).project(camera);
  return {x:(p.x+1)*width/2,y:(1-p.y)*height/2,visible:p.z>=-1&&p.z<=1&&Math.abs(p.x)<=1&&Math.abs(p.y)<=1};
}
export function CalloutPointer({point,camera,startFrame,endFrame,label,card={x:65,y:288,width:950,height:132},occluded=false}:{point:[number,number,number];camera:Camera;startFrame:number;endFrame:number;label?:string;card?:{x:number;y:number;width:number;height:number};occluded?:boolean}){
  const frame=useCurrentFrame(),{fps,width,height}=useVideoConfig(),id=useId().replace(/:/g,'');
  const p=projectAnchor(point,camera,width,height),elapsed=frame-startFrame;
  const enter=spring({frame:Math.max(0,elapsed),fps,config:{damping:15,stiffness:190,mass:.7}}),scale=.94+.06*enter;
  const margin=width*.06,cw=Math.min(card.width,width-margin*2),ch=card.height;
  const x=Math.max(margin,Math.min(width-margin-cw,card.x)),y=Math.max(height*.14,Math.min(height*.26-ch,card.y));
  const edgeFade=clamp(Math.min(p.x-margin,width-margin-p.x,p.y-margin,height-margin-p.y)/24);
  const opacity=clamp(enter)*clamp((endFrame-frame)/8)*edgeFade;
  if(elapsed<0||frame>=endFrame||!p.visible||occluded)return null;
  const endX=x+cw/2,endY=y+ch/2+ch/2*scale+20*(1-enter),d=`M ${p.x} ${p.y} L ${endX} ${endY}`,length=Math.hypot(endX-p.x,endY-p.y);
  return <div style={{position:'absolute',inset:0,pointerEvents:'none',opacity}}>
    <svg width={width} height={height}><defs><mask id={id} maskUnits="userSpaceOnUse" x={0} y={0} width={width} height={height}><path d={d} fill="none" stroke="white" strokeWidth={8} strokeDasharray={`${length} ${length}`} strokeDashoffset={length*(1-clamp(elapsed/9))}/></mask></defs><path d={d} stroke="#0d746d" strokeWidth={3} strokeDasharray="8 9" fill="none" mask={`url(#${id})`}/><circle cx={p.x} cy={p.y} r={8*clamp(enter)} fill="#D9F938"/></svg>
    {label&&<div style={{position:'absolute',left:x,top:y,width:cw,height:ch,boxSizing:'border-box',display:'flex',alignItems:'center',padding:26,borderRadius:24,background:'rgba(232,255,226,.95)',color:'#0F172A',fontFamily:'Plus Jakarta Sans',fontWeight:800,fontSize:31,transform:`translateY(${20*(1-enter)}px) scale(${scale})`}}>{label}</div>}
  </div>;
}
// World-synced object pill; caller supplies occlusion from scene/raycast or focus state.
export function WorldSyncedPill({point,camera,text,startFrame,endFrame,occluded=false}:{point:[number,number,number];camera:Camera;text:string;startFrame:number;endFrame:number;occluded?:boolean}){
  const f=useCurrentFrame(),{fps,width,height}=useVideoConfig(),p=projectAnchor(point,camera,width,height);
  const enter=spring({frame:Math.max(0,f-startFrame),fps,config:{damping:15,stiffness:190,mass:.7}});
  const edge=clamp(Math.min(p.x-180,width-180-p.x,p.y-45,height*.68-p.y)/35);
  if(!p.visible||occluded||f<startFrame||f>=endFrame)return null;
  return <div style={{position:'absolute',left:p.x,top:p.y,opacity:clamp(enter)*clamp((endFrame-f)/8)*edge,transform:`translate(-50%,${20*(1-enter)}px) scale(${.94+.06*enter})`,maxWidth:320,padding:'14px 20px',borderRadius:40,fontFamily:'JetBrains Mono',fontSize:25,color:'#fff',background:'rgba(15,23,42,.88)',textAlign:'center'}}>{text}</div>;
}

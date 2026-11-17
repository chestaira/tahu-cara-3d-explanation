import React,{useEffect,useMemo,useState} from 'react';
import {cancelRender,continueRender,delayRender,spring,staticFile,useCurrentFrame,useVideoConfig} from 'remotion';
export type Word={word:string;start:number;end:number};
const clamp=(v:number)=>Math.max(0,Math.min(1,v));
export function validateTranscript(value:unknown):Word[]{
  if(!Array.isArray(value)||value.some((w,i)=>!w||typeof w.word!=='string'||!Number.isFinite(w.start)||!Number.isFinite(w.end)||w.start<0||w.end<=w.start||(i>0&&w.start<value[i-1].start)))throw new Error('Invalid transcript.json: expected ordered [{word,start,end}] in seconds.');
  return value;
}
export function groupWords(words:Word[]):Word[][]{
  const groups:Word[][]=[];let current:Word[]=[];
  for(const w of words){current.push(w);if(/[,.!?;:]$/.test(w.word)||current.length===8){groups.push(current);current=[];}}
  if(current.length)groups.push(current);
  // Join short comma fragments with continuation, never across sentence endings.
  for(let i=0;i<groups.length-1;i++){if(groups[i].length<4&&!/[.!?]$/.test(groups[i].at(-1)!.word)&&groups[i].length+groups[i+1].length<=8){groups.splice(i,2,[...groups[i],...groups[i+1]]);i--;}}
  for(let i=1;i<groups.length;i++){if(groups[i].length===1&&!/[.!?]$/.test(groups[i-1].at(-1)!.word)&&groups[i-1].length>4)groups[i].unshift(groups[i-1].pop()!);}
  return groups;
}
export function KaraokeSubtitle({transcriptFile='transcript.json',outroFrame,dangerWords=['bahaya','berbahaya','rusak','kerusakan','panas','bocor','kebocoran','korsleting','gagal','kembung'],groups:provided}:{transcriptFile?:string;outroFrame:number;dangerWords?:string[];groups?:Word[][]}){
  const f=useCurrentFrame(),{fps}=useVideoConfig();
  const [words,setWords]=useState<Word[]>([]),[handle]=useState(()=>delayRender('Load word-level transcript'));
  useEffect(()=>{let live=true;fetch(staticFile(transcriptFile)).then(r=>{if(!r.ok)throw new Error(`Transcript HTTP ${r.status}`);return r.json();}).then(data=>{const parsed=validateTranscript(data);if(live)setWords(parsed);continueRender(handle);}).catch(cancelRender);return()=>{live=false;};},[transcriptFile,handle]);
  const groups=useMemo(()=>provided??groupWords(words),[provided,words]);
  const index=groups.findIndex((g,i)=>f/fps>=g[0].start&&f/fps<Math.min(groups[i+1]?.[0].start??Infinity,g.at(-1)!.end+.2));
  if(f>=outroFrame||index<0)return null;
  const g=groups[index],p=spring({frame:f-g[0].start*fps,fps,config:{damping:15,stiffness:190,mass:.7}});
  const end=Math.min(outroFrame,(groups[index+1]?.[0].start??g.at(-1)!.end+.2)*fps,g.at(-1)!.end*fps+.2*fps);
  return <div style={{position:'absolute',bottom:'25%',left:'8%',width:'84%',textAlign:'center',fontFamily:'Plus Jakarta Sans',fontWeight:700}}><div style={{display:'inline-block',maxWidth:'100%',boxSizing:'border-box',padding:'19px 28px',borderRadius:20,background:'rgba(15,23,42,.94)',fontSize:39,lineHeight:1.4,textWrap:'balance',opacity:clamp(p)*clamp((end-f)/3),transform:`scale(${.96+.04*p})`}}>{g.map((w,i)=>{
    const active=f/fps>=w.start&&f/fps<w.end,negative=dangerWords.includes(w.word.toLowerCase().replace(/[^\p{L}\p{N}]/gu,''));
    const pop=active?clamp(spring({frame:f-w.start*fps,fps,config:{damping:15,stiffness:190,mass:.7}})):0;
    return <React.Fragment key={`${w.start}-${i}`}><span style={{display:'inline-block',color:active?(negative?'#FF4D4D':'#D9F938'):'#FFFFFF',transform:`scale(${1+.05*pop})`}}>{w.word}</span>{i<g.length-1?' ':''}</React.Fragment>;
  })}</div></div>;
}

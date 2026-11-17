import React,{forwardRef} from 'react';

// Extracted from the user-approved fountain v4 CalloutPointer card.
export type TopDataCardProps={children:React.ReactNode;x:number;y:number;maxWidth:number;enter:number;scale:number};
export const TopDataCard=forwardRef<HTMLDivElement,TopDataCardProps>(function TopDataCard({children,x,y,maxWidth,enter,scale},ref){
  return <div ref={ref} style={{position:'absolute',left:x,top:y,width:'max-content',maxWidth,height:'auto',boxSizing:'border-box',display:'inline-flex',alignItems:'center',padding:'12px 22px',borderRadius:18,backgroundColor:'rgba(240, 253, 244, 0.95)',color:'#0F172A',fontFamily:'Plus Jakarta Sans',fontWeight:800,fontSize:31,lineHeight:1.25,transform:`translateY(${20*(1-enter)}px) scale(${scale})`}}>{children}</div>;
});

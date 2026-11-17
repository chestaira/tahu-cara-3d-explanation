import {shotState,COVER_END} from './timeline';

export function hudState(frame:number){
  const shot=shotState(frame);
  const start=Math.max(COVER_END+8,shot.start),end=shot.end;
  const state=frame<start||frame>=end?'idle':frame<start+12?'entering':frame>=end-8?'exiting':'active';
  return {...shot,start,end,state};
}

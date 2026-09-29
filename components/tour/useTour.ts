'use client';
import {useEffect,useState,useCallback} from 'react';
import {shots,clamp} from '@/data/tour';
export function useTour(){
 const [state,setState]=useState({index:0,progress:0,total:0,width:1440,height:900,reduced:false,visible:true,finished:false,inDivider:false});
 useEffect(()=>{let frame=0;const media=matchMedia('(prefers-reduced-motion: reduce)');
 const update=()=>{frame=0;const height=innerHeight;const nodes=[...document.querySelectorAll<HTMLElement>('[data-tour-shot]')];let index=0;nodes.forEach((n,i)=>{if(n.getBoundingClientRect().top<=1)index=i});const node=nodes[index];const rect=node?.getBoundingClientRect();const p=rect?clamp(-rect.top/Math.min(rect.height,height*1.15)):0;const end=document.getElementById('plan')?.getBoundingClientRect().top??1;setState({index,progress:p,total:(index+p)/shots.length,width:innerWidth,height,reduced:media.matches,visible:!document.hidden,finished:end<height*.35,inDivider:[...document.querySelectorAll('.room-divider')].some(n=>{const r=n.getBoundingClientRect();return r.top<115&&r.bottom>0})})};
 const schedule=()=>{if(!frame)frame=requestAnimationFrame(update)};schedule();addEventListener('scroll',schedule,{passive:true});addEventListener('resize',schedule);document.addEventListener('visibilitychange',schedule);media.addEventListener('change',schedule);
 return()=>{cancelAnimationFrame(frame);removeEventListener('scroll',schedule);removeEventListener('resize',schedule);document.removeEventListener('visibilitychange',schedule);media.removeEventListener('change',schedule)};
 },[]);
 const go=useCallback((index:number)=>{const node=document.getElementById('tour-'+shots[index].id);if(!node)return;history.replaceState(null,'','#tour-'+shots[index].id);window.scrollTo({top:window.scrollY+node.getBoundingClientRect().top+Math.min(node.offsetHeight,innerHeight*1.15)*.6,behavior:'instant'})},[]);
 return {...state,go};
}

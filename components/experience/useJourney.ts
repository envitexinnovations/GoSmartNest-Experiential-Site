'use client';
import {useEffect,useState} from 'react';
import {chapters} from '@/data/experience';
export function useJourney(){
 const [journey,setJourney]=useState({active:0,local:0,total:0,reduced:false});
 useEffect(()=>{let frame=0;const mq=matchMedia('(prefers-reduced-motion: reduce)');
 const measure=()=>{frame=0;if(document.hidden)return;const nodes=chapters.map(c=>document.getElementById(c.id));let active=0;nodes.forEach((el,i)=>{if(el&&el.getBoundingClientRect().top<=innerHeight*.25)active=i});const el=nodes[active];const rect=el?.getBoundingClientRect();const local=rect?Math.max(0,Math.min(1,(-rect.top+innerHeight*.1)/Math.max(1,rect.height-innerHeight*.65))):0;setJourney({active,local,total:Math.min(1,scrollY/Math.max(1,document.documentElement.scrollHeight-innerHeight)),reduced:mq.matches})};
 const schedule=()=>{if(!frame)frame=requestAnimationFrame(measure)};schedule();addEventListener('scroll',schedule,{passive:true});addEventListener('resize',schedule);mq.addEventListener('change',schedule);document.addEventListener('visibilitychange',schedule);
 return()=>{cancelAnimationFrame(frame);removeEventListener('scroll',schedule);removeEventListener('resize',schedule);mq.removeEventListener('change',schedule);document.removeEventListener('visibilitychange',schedule)};
 },[]);return journey;
}

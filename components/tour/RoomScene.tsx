'use client';
/* Room photography supplies the geometry; overlays are device-state feedback. */
import {useEffect,useRef,useId,type CSSProperties} from 'react';
import {assets,type Scene} from '@/data/tour';
export type DeviceValues={lights:number;fan:number;curtains:number;tv:boolean;fryer:boolean;ac:boolean;temperature:number;bedfan:number;bedlight:number;guard:boolean;night:boolean;doorlock:boolean;chimney:boolean;tablelights:number;mixer:boolean;geyser:boolean};
export function RoomScene({room,values,width,height,x,y,zoom,running,timer,loaded}:{room:Scene;values:DeviceValues;width:number;height:number;x:number;y:number;zoom:number;running:boolean;timer:string;loaded:boolean}){
 const brightness=room==='living'?.40+values.lights*.006+values.curtains*.0014:room==='bedroom'?.24+values.bedlight*.007:room==='kitchen'?.63+values.tablelights*.0032:.87;
 const fanSpeed=room==='living'?values.fan:values.bedfan;
 const fanPosition=room==='living'?[52.5,10.5]:[49.5,11.3];
 return <div className={`room-world room-${room}`} style={{width,height,transform:`translate3d(${x}px,${y}px,0) scale(${zoom})`}} aria-hidden="true">
 {/* Native image keeps a deliberate color fallback if loading fails. */}
 {/* eslint-disable-next-line @next/next/no-img-element */}
 {loaded&&<img className="room-photo" src={assets[room]} alt="" fetchPriority={room==='living'?'high':'low'} loading={room==='living'?'eager':'lazy'} style={{filter:`brightness(${brightness}) saturate(${room==='bedroom'&&values.bedlight<25?.65:1})`}}/>}
 {room==='living'&&<>
 <PerspectiveCurtains opening={values.curtains} width={width} height={height}/>
 <div className="daylight" style={{opacity:values.curtains/130}}/>
 <div className="ceiling-glow" style={{opacity:values.lights/130}}/>
 <div className="tv-screen" style={{opacity:values.tv?1:0}}><WildlifeVideo playing={values.tv&&running}/></div>
 </>}
 {(room==='living'||room==='bedroom')&&<div className="fan-position" style={{left:`${fanPosition[0]}%`,top:`${fanPosition[1]}%`}}><div className="fan-downrod"/><div className="fan-canopy"/><div className="fan-perspective"><div className="fan-rotor" style={{animationDuration:`${fanSpeed===1?1.5:fanSpeed===2?.85:.45}s`,animationPlayState:fanSpeed&&running?'running':'paused'}}/></div><div className="fan-motor"><i/></div></div>}
 {room==='kitchen'&&<>
 <div className={`fryer-display ${values.fryer?'on':''}`}><span>{timer}</span><i/></div>
 <div className={`chimney-indicator ${values.chimney?'on':''}`}><span>●</span></div>
 <div className={`extractor-flow ${values.chimney?'on':''}`} style={{animationPlayState:running?'running':'paused'}}><i/><i/><i/></div>
 <div className="pendant-glow first" style={{opacity:values.tablelights/100}}/><div className="pendant-glow second" style={{opacity:values.tablelights/100}}/>
 <KiwiJuice blending={values.mixer&&running}/>
 <div className={`mixer-feedback ${values.mixer?'on':''}`}><span>●</span><i style={{animationPlayState:running&&values.mixer?'running':'paused'}}/></div>
 </>}
 {room==='entry'&&<div className={`doorlock-feedback ${values.doorlock?'locked':'unlocked'}`}><span>{values.doorlock?'LOCKED':'UNLOCKED'}</span><i/></div>}
 {room==='bathroom'&&<div className={`geyser-feedback ${values.geyser?'on':''}`}><i/><span>{values.geyser?'HEATING':'OFF'}</span></div>}
 {room==='bedroom'&&<>
 <div className={`ac-vent ${values.ac?'open':'closed'}`}><div className="ac-vent-fins"/><div className="ac-flap"><i/></div></div>
 <div className={`ac-airflow ${values.ac?'on':''}`}><i/><i/><i/><span>{values.temperature}°</span></div>
 <div className="bedside-glow left" style={{opacity:values.bedlight/100}}/><div className="bedside-glow right" style={{opacity:values.bedlight/100}}/>
 <div className="night-glow" style={{opacity:values.night?1:0}}/>
 <div className={`guard-feedback ${values.guard?'armed':''}`}><span>✓</span></div>
 </>}
 <div className="scene-grain" style={{'--grain-opacity':'.025'} as CSSProperties}/>
 </div>
}

function WildlifeVideo({playing}:{playing:boolean}){
 const ref=useRef<HTMLVideoElement>(null);
 useEffect(()=>{const video=ref.current;if(!video)return;if(playing){void video.play().catch(()=>{});}else video.pause();},[playing]);
 return <video ref={ref} className="wildlife-video" src="/tour/wildlife-elephants.mp4" muted loop playsInline preload="metadata"/>;
}

// Project each complete fabric panel onto the ceiling/window plane.
function curtainProjection(p:number[][]){
 const [p0,p1,p2,p3]=p;const dx1=p1[0]-p2[0],dx2=p3[0]-p2[0],dx3=p0[0]-p1[0]+p2[0]-p3[0];
 const dy1=p1[1]-p2[1],dy2=p3[1]-p2[1],dy3=p0[1]-p1[1]+p2[1]-p3[1];
 const den=dx1*dy2-dx2*dy1;const g=(dx3*dy2-dx2*dy3)/den,h=(dx1*dy3-dx3*dy1)/den;
 const a=p1[0]-p0[0]+g*p1[0],b=p3[0]-p0[0]+h*p3[0],d=p1[1]-p0[1]+g*p1[1],e=p3[1]-p0[1]+h*p3[1];
 return `matrix3d(${a/100},${d/100},0,${g/100},${b/100},${e/100},0,${h/100},0,0,1,0,${p0[0]},${p0[1]},0,1)`;
}
function PerspectiveCurtains({opening,width,height}:{opening:number;width:number;height:number}){
 const w=width*.228,h=height*.65,panel=w*.505*(1-opening/100*.94),r=w-panel;
 const top=(x:number)=>x/w*h*.36,bottom=(x:number)=>h-x/w*h*.14;
 return <div className="curtain-projection"><div className="curtain-warp" style={{transform:curtainProjection([[0,0],[panel,top(panel)],[panel,bottom(panel)],[0,h]])}}/><div className="curtain-warp curtain-far" style={{transform:curtainProjection([[r,top(r)],[w,top(w)],[w,bottom(w)],[r,bottom(r)]])}}/><svg className="curtain-bar" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" aria-hidden="true"><path d={`M -4 -3 L ${w+4} ${top(w+4)-3}`} stroke="#211b17" strokeWidth="5" strokeLinecap="round"/><path d={`M -4 -4 L ${w+4} ${top(w+4)-4}`} stroke="#a28b6a" strokeWidth="2" strokeLinecap="round"/>{[.08,.94].map(t=><path key={t} d={`M ${w*t} ${top(w*t)-11} v 8`} stroke="#69543d" strokeWidth="3" strokeLinecap="round"/>)}</svg></div>;
}
function KiwiJuice({blending}:{blending:boolean}){
 const id=useId().replace(/:/g,'');
 return <svg className={'kiwi-jar '+(blending?'is-blending':'is-settled')} viewBox="0 0 100 150" preserveAspectRatio="none"><defs><clipPath id={id+'jar'}><path d="M3 0H97L84 145Q50 151 16 145Z"/></clipPath><pattern id={id+'texture'} width="130" height="180" patternUnits="userSpaceOnUse"><image href="/tour/kiwi-texture.webp" width="130" height="180" preserveAspectRatio="none"/></pattern><linearGradient id={id+'glass'}><stop stopColor="#fff" stopOpacity=".45"/><stop offset=".15" stopColor="#fff" stopOpacity="0"/><stop offset=".75" stopColor="#172d0e" stopOpacity=".12"/><stop offset="1" stopColor="#fff" stopOpacity=".35"/></linearGradient></defs><g clipPath={'url(#'+id+'jar)'}><path className="juice-body" fill={'url(#'+id+'texture)'} d="M0 53 Q24 44 48 53 T100 51 V155H0Z"/><path className="juice-surface" d="M0 53 Q24 44 48 53 T100 51 Q74 66 49 61T0 53Z" fill="#b7cd7180"/>{[0,1,2,3,4].map(n=><ellipse key={n} className="juice-splash" cx={13+n*18} cy={31+n%2*6} rx={2+n%2} ry={5+n%3} fill="#a4bc62" style={{animationDelay:`${n*-.17}s`}}/>)}<path d="M3 0H97L84 145Q50 151 16 145Z" fill={'url(#'+id+'glass)'}/></g></svg>
}

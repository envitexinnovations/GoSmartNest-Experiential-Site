'use client';
import {useState,useEffect,type CSSProperties} from 'react';
import {ArrowUpRight,ArrowDown,MessageCircle,RotateCcw} from 'lucide-react';
import {shots,roomNames,roomStarts,roomEnds,cameraAt,clamp,type Room,type Scene} from '@/data/tour';
import {WHATSAPP} from '@/data/experience';
import {useTour} from '@/components/tour/useTour';
import {RoomScene,type DeviceValues} from '@/components/tour/RoomScene';
import {DeviceControl,featureIcons} from '@/components/tour/DeviceControl';
const pad=(n:number)=>String(n).padStart(2,'0');
export default function Page(){
 const tour=useTour();const {height,reduced}=tour;
 return <main className={reduced?'tour-app reduced-motion':'tour-app'} style={{'--vh':`${height}px`} as CSSProperties}>
 <h1 className="sr-only">Home automation that responds to you.</h1>
 <a className="skip-link" href="#plan">Skip to planning your home</a>
 <header className={`tour-header ${tour.finished||tour.inDivider?'over-plan':''}`}><a className="brand" href="#tour-welcome" onClick={e=>{e.preventDefault();tour.go(0)}} aria-label="GoSmartNest home"><span className="logo-crop"><BrandMark/></span></a><a className="plan-nav" href="https://gosmartnest.com/">PLAN MY HOME <ArrowUpRight size={16}/></a></header>
 {(['living','kitchen','bedroom'] as Room[]).map(room=><RoomFold key={room} room={room} tour={tour}/>)}
 <section className="plan-section" id="plan" aria-labelledby="plan-heading"><div className="plan-copy"><div className="eyebrow">ONE ROOM. OR YOUR WHOLE HOME.</div><h2 id="plan-heading">MAKE THIS<br/><em>YOUR EVERYDAY.</em></h2><p>Keep the home. Upgrade the experience.<br/>Start with one room, or connect your whole space.</p><a className="gold-button" href={WHATSAPP} target="_blank" rel="noopener noreferrer">CHAT ON WHATSAPP <MessageCircle size={18}/></a><button className="replay" onClick={()=>tour.go(0)}><RotateCcw size={14}/> BACK TO THE LIVING ROOM</button></div>
 <details className="details-panel"><summary>Retrofit, compatibility & more possibilities <PlusIcon/></summary><div className="details-content"><div><h3>Start with what you have.</h3><p>Explore smart lights, fans, ACs, heavy-duty sockets, compatible appliances, voice and app control, and a central IoT control hub. Installation requirements are assessed for your space.</p><p>Solutions starting at ₹17,999. Free 1-hour installation where applicable.</p></div><div><h3>Make room for more.</h3><p>Door locks, motion and occupancy sensors, bathroom fitting opportunities and customizable commercial control. Commercial options include zonal lighting, HVAC control, energy monitoring and surveillance-view access.</p><p>Curtains and appliance scenes illustrate a possible setup. Compatibility and exact controls are confirmed during planning.</p></div></div></details>
 <footer className="site-footer"><span>© GoSmartNest · Intelligent living</span><span>Illustrative tour. No guaranteed savings or universal compatibility.</span></footer></section>
 {<a className="floating-whatsapp" href={WHATSAPP} target="_blank" rel="noopener noreferrer" aria-label="Chat with GoSmartNest on WhatsApp"><WhatsAppIcon/></a>}
 </main>
}
function PlusIcon(){return <span aria-hidden="true">+</span>}

function RoomFold({room,tour}:{room:Room;tour:ReturnType<typeof useTour>}){
 const first=roomStarts[room];const last=roomEnds[room];
 const index=clamp(tour.index,first,last);const progress=tour.index<first?0:tour.index>last?1:tour.progress;
 const {width,height,reduced,visible}=tour;const shot=shots[index];
 const [override,setOverride]=useState<{index:number;values:Partial<DeviceValues>}>({index:-1,values:{}});
 const [minutes,setMinutes]=useState(15);const [remaining,setRemaining]=useState(900);
 const passed=(id:string)=>index>=shots.findIndex(s=>s.id===id);
 const auto:DeviceValues={lights:shot.id==='welcome'?25:75,fan:passed('fan')?2:0,curtains:!passed('curtains')?0:shot.id==='curtains'?Math.round(clamp((progress-.22)/.48)*100):100,tv:passed('tv'),fryer:shot.id==='airfryer'&&progress>.35,ac:passed('ac'),temperature:24,bedfan:passed('bedfan')?1:0,bedlight:passed('night')?8:shot.id==='bedlight'?Math.round(75-clamp(progress)*50):65,guard:passed('guard'),night:passed('night'),doorlock:progress>.35,chimney:passed('chimney'),tablelights:75,mixer:shot.id==='mixer'&&progress>.35,geyser:shot.id==='geyser'&&progress>.35};
 if(shot.id==='lights')auto.lights=Math.round(20+clamp((progress-.25)/.5)*65);
 const values={...auto,...(override.index===index?override.values:{})};
 const change=(key:keyof DeviceValues,value:number|boolean)=>setOverride(prev=>({index,values:{...(prev.index===index?prev.values:{}),[key]:value}}));
 const resetTimer=(m:number)=>{setMinutes(m);setRemaining(m*60)};
 useEffect(()=>{if(shots[tour.index].id!=='airfryer'||!values.fryer||!visible)return;const interval=setInterval(()=>setRemaining(s=>Math.max(0,s-1)),1000);return()=>clearInterval(interval)},[tour.index,values.fryer,visible]);
 const timer=`${pad(Math.floor(remaining/60))}:${pad(remaining%60)}`;
 const camera=cameraAt(index,progress,reduced);const mobile=width<760;
 const zoom=mobile?Math.min(camera.zoom,1.65):camera.zoom;
 const worldW=Math.max(width,height*(1672/941)),worldH=worldW/(1672/941);
 const x=clamp(width/2-camera.x*worldW*zoom,width-worldW*zoom,0);
 const y=clamp(height*.44-camera.y*worldH*zoom,height-worldH*zoom,0);
 const targetX=x+shot.target[0]*worldW*zoom,targetY=y+shot.target[1]*worldH*zoom;
 const cardX=mobile?width/2:width-205,cardY=mobile?height-230:height-300;
 const showControl=shot.id in featureIcons;


 const goPlan=()=>scrollToSection('plan');
 const hotShots=shots.map((s,i)=>({s,i})).filter(({s})=>s.room===shot.room&&s.id in featureIcons);
 return (
 <section className="room-fold" id={'room-'+room} aria-label={roomNames[room]}>
 <div className="room-scroll-track">
 <div className="tour-stage" role="region" aria-label={roomNames[room]+' interactive features'}>
 <div className="scene-fallback"/>
 {([room,...(room==='living'?['entry']:room==='bedroom'?['bathroom']:[])] as Scene[]).map(scene=><div key={scene} className="scene-layer" style={{opacity:scene===(shot.scene??room)?1:0}}><RoomScene room={scene} values={values} width={worldW} height={worldH} x={x} y={y} zoom={zoom} running={visible&&!reduced&&tour.index>=first&&tour.index<=last&&!tour.finished&&scene===(shot.scene??room)} timer={timer} loaded={room==='living'||tour.index>=first-1}/></div>)}
 <div className="scene-vignette"/>
 <div className="room-caption"><span>{pad(room==='living'?1:room==='kitchen'?2:3)} / {shot.scene==='bathroom'?'BEDROOM / EN-SUITE':roomNames[shot.room].toUpperCase()}</span><span className="experience-tag">SMARTER EVERYDAY</span></div>
 {(shot.id==='welcome'||shot.id==='kitchen'||shot.id==='bedroom'||shot.id==='complete')&&<div className="room-intro" key={shot.id}><p>{shot.id==='welcome'?'A HOME THAT RESPONDS TO YOU':shot.id==='complete'?'YOUR HOME. YOUR WAY.':'MAKE ROOM FOR MORE'}</p>{shot.id==='welcome'?<h2 id="room-heading-living">COME<br/><em>ON IN.</em></h2>:<h2>{shot.title.split(' ').slice(0,2).join(' ')}<br/><em>{shot.title.split(' ').slice(2).join(' ')}</em></h2>}<span>{shot.hint}</span>{shot.id==='complete'?<button className="enter-button" onClick={goPlan}>MAKE IT YOURS <ArrowUpRight size={18}/></button>:<button className="enter-button" onClick={()=>tour.go(index+1)}>{shot.id==='welcome'?'ENTER THE HOME':'EXPLORE THE ROOM'} <ArrowDown size={18}/></button>}</div>}
 {showControl&&<><div className="feature-title" key={shot.id}><span>{roomNames[room].toUpperCase()} / {shot.label.toUpperCase()}</span><h2>{shot.title}</h2><p>{shot.hint}</p></div><svg className="label-connector" aria-hidden="true" width={width} height={height}><path d={`M ${clamp(targetX,30,width-30)} ${clamp(targetY,100,height-200)} L ${mobile?cardX:cardX-160} ${cardY-35} L ${cardX} ${cardY-35}`}/><circle cx={clamp(targetX,30,width-30)} cy={clamp(targetY,100,height-200)} r="5"/></svg><div className="device-anchor" style={{opacity:reduced?1:clamp((progress-.12)*5)}}><DeviceControl shot={shot} values={values} change={change} timer={timer} minutes={minutes} setMinutes={resetTimer}/></div></>}
 {!showControl&&shot.id!=='complete'&&<div className="hotspots" aria-label="Explore devices">{hotShots.filter(({s})=>(s.scene??s.room)===(shot.scene??room)).map(({s,i})=>{const hx=x+s.target[0]*worldW*zoom,hy=y+s.target[1]*worldH*zoom;if(hx<30||hx>width-30||hy<110||hy>height-160)return null;const Icon=featureIcons[s.id as keyof typeof featureIcons];return <button key={s.id} className="hotspot" style={{left:hx,top:hy}} onClick={()=>tour.go(i)} aria-label={`Explore ${s.label}`}><Icon size={17}/><span>{s.label}</span></button>})}</div>}
 <div className="tour-bottom"><div className="scroll-cue"><span className="scroll-icon"/> <span>SCROLL TO DISCOVER</span></div><nav className="feature-links" aria-label={roomNames[room]+' features'}>{hotShots.map(({s,i})=><button key={s.id} aria-current={index===i?'step':undefined} onClick={()=>tour.go(i)}>{s.label}</button>)}</nav><button className="next-room" onClick={()=>room==='bedroom'?goPlan():scrollToSection('room-'+(room==='living'?'kitchen':'bedroom'))}>{room==='living'?'NEXT: KITCHEN':room==='kitchen'?'NEXT: BEDROOM':'MAKE IT YOURS'} <ArrowDown size={15}/></button><div className="tour-progress"><i style={{transform:`scaleX(${(index-first+progress)/(last-first+1)})`}}/></div></div>
 </div>
 <div className="tour-markers">{shots.map((s,i)=>({s,i})).filter(({s})=>s.room===room).map(({s,i})=><section id={'tour-'+s.id} data-tour-shot={i} data-last={i===last?'true':undefined} key={s.id} aria-label={`${roomNames[s.room]}: ${s.label}`}><h2 className="sr-only">{s.label}: {s.hint}</h2></section>)}</div>
 </div>
 </section>
);
}

function scrollToSection(id:string){const node=document.getElementById(id);if(node)window.scrollTo({top:window.scrollY+node.getBoundingClientRect().top,behavior:'instant'});}

function WhatsAppIcon(){return <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor" aria-hidden="true"><path d="M20.52 3.48A11.85 11.85 0 0 0 12.04 0C5.46 0 .1 5.35.1 11.94c0 2.1.55 4.15 1.6 5.96L0 24l6.25-1.64a11.9 11.9 0 0 0 5.78 1.48h.01c6.58 0 11.94-5.35 11.94-11.94 0-3.19-1.24-6.18-3.46-8.42ZM12.04 21.82a9.86 9.86 0 0 1-5.03-1.38l-.36-.21-3.71.97.99-3.62-.24-.37a9.87 9.87 0 0 1-1.51-5.27c0-5.47 4.45-9.92 9.93-9.92 2.65 0 5.14 1.03 7.01 2.91a9.85 9.85 0 0 1 2.9 7.01c0 5.47-4.45 9.92-9.98 9.88Zm5.45-7.42c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.61-.92-2.21-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.87 1.21 3.07c.15.2 2.1 3.2 5.08 4.48.71.31 1.27.49 1.7.63.71.23 1.36.2 1.87.12.57-.08 1.76-.72 2.01-1.41.25-.69.25-1.29.17-1.41-.07-.12-.27-.2-.57-.35Z"/></svg>}

function BrandMark(){return <svg className="brand-art" viewBox="180 322 765 500" role="img" aria-label="GoSmartNest Automation"><defs><filter id="brand-transparent" colorInterpolationFilters="sRGB"><feColorMatrix type="matrix" values="1 -1.685 0 0 1.136  0 -.669 0 0 1.126  0 -.863 1 0 .582  -3 0 0 0 2"/><feComposite in2="SourceGraphic" operator="in"/></filter></defs><image href="/gosmartnest-logo.png" width="1125" height="1125" filter="url(#brand-transparent)"/></svg>}

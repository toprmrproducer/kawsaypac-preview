(() => {
  'use strict';
  const hero=document.querySelector('.journey-scroll');
  if(!hero)return;
  const sticky=hero.querySelector('.journey-sticky');
  const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const mobile=matchMedia('(max-width: 720px)').matches;
  if(reduce||mobile||!window.gsap||!window.ScrollTrigger){hero.classList.add('journey-static');return}

  gsap.registerPlugin(ScrollTrigger);
  const q=s=>hero.querySelector(s);
  const brand=q('.journey-brand'),shade=q('.journey-shade');
  const landscape=q('.journey-landscape'),landscapeMaster=q('.journey-landscape-master');
  const ridgeWide=q('.journey-ridge-wide'),ridgeLeft=q('.journey-ridge-left'),ridgeRight=q('.journey-ridge-right');
  const mountain=q('.journey-mountain'),river=q('.journey-river'),clouds=q('.journey-clouds'),mist=q('.journey-mist');
  const jungle=q('.journey-jungle'),jungleMaster=q('.journey-jungle-master');
  const canopy=q('.journey-canopy'),philodendron=q('.journey-philodendron'),bromeliads=q('.journey-bromeliads'),orchid=q('.journey-orchid');
  const snake=q('.journey-snake'),toucan=q('.journey-toucan'),forestFrame=q('.journey-forest-frame');
  const forestBeat=q('.journey-beat-forest'),waterBeat=q('.journey-beat-water'),finalCopy=q('.journey-final'),progress=q('.journey-progress span');

  gsap.set([forestBeat,waterBeat,finalCopy],{autoAlpha:0,y:32});
  gsap.set(landscape,{filter:'blur(17px) saturate(.72)',scale:1.08});
  gsap.set(landscapeMaster,{scale:1.14});
  gsap.set([ridgeWide,ridgeLeft,ridgeRight],{yPercent:34,autoAlpha:0});
  gsap.set(mountain,{xPercent:-50,yPercent:38,autoAlpha:0,scale:.92});
  gsap.set(river,{yPercent:52,autoAlpha:0,scale:.88});
  gsap.set(clouds,{xPercent:-7,autoAlpha:0});
  gsap.set(mist,{xPercent:6,autoAlpha:0});
  gsap.set(jungleMaster,{scale:1.04});
  gsap.set(progress,{scaleY:0,transformOrigin:'top'});

  const tl=gsap.timeline({defaults:{ease:'none'},scrollTrigger:{trigger:hero,start:'top top',end:()=>`+=${Math.round(innerHeight*4.15)}`,pin:sticky,scrub:.85,anticipatePin:1,invalidateOnRefresh:true}});
  tl.to(progress,{scaleY:1,duration:100},0)
    .to(brand,{autoAlpha:0,y:-24,duration:6},8)
    .to(jungleMaster,{scale:1.17,yPercent:-2,duration:20,ease:'power1.inOut'},8)
    .to(forestFrame,{scale:1.12,duration:20,ease:'power1.inOut'},8)
    .to(canopy,{xPercent:11,yPercent:8,scale:1.1,duration:20,ease:'power1.inOut'},8)
    .to(philodendron,{xPercent:-11,yPercent:-5,scale:1.08,duration:20,ease:'power1.inOut'},8)
    .to(bromeliads,{yPercent:-12,scale:1.08,duration:20,ease:'power1.inOut'},8)
    .to(orchid,{xPercent:-8,yPercent:10,scale:1.12,duration:20,ease:'power1.inOut'},8)
    .to(snake,{xPercent:-5,yPercent:4,scale:1.05,duration:20,ease:'power1.inOut'},8)
    .to(toucan,{xPercent:5,yPercent:-4,scale:1.06,duration:20,ease:'power1.inOut'},8)
    .to(forestBeat,{autoAlpha:1,y:0,duration:4,ease:'power2.out'},14)
    .to(forestBeat,{autoAlpha:1,duration:8},18)
    .to(forestBeat,{autoAlpha:0,y:-22,duration:4},26)
    .to(jungleMaster,{filter:'blur(14px) saturate(.76)',autoAlpha:0,scale:1.3,duration:17,ease:'power2.inOut'},27)
    .to(forestFrame,{xPercent:0,yPercent:8,scale:1.45,autoAlpha:.22,duration:20,ease:'power2.inOut'},28)
    .to(canopy,{xPercent:34,yPercent:20,scale:1.32,autoAlpha:.2,duration:20,ease:'power2.inOut'},28)
    .to(philodendron,{xPercent:-34,yPercent:-18,scale:1.3,autoAlpha:.18,duration:20,ease:'power2.inOut'},28)
    .to(bromeliads,{yPercent:-40,scale:1.28,autoAlpha:.1,duration:18,ease:'power2.inOut'},28)
    .to(orchid,{xPercent:-25,yPercent:28,autoAlpha:0,duration:15},30)
    .to([snake,toucan],{autoAlpha:0,scale:1.12,duration:12},31)
    .to(landscape,{filter:'blur(6px) saturate(.84)',scale:1.035,duration:18,ease:'power2.inOut'},28)
    .to([ridgeWide,ridgeLeft,ridgeRight],{yPercent:0,autoAlpha:.62,duration:18,ease:'power2.out'},30)
    .to(mountain,{yPercent:0,autoAlpha:.84,scale:1,duration:20,ease:'power2.out'},31)
    .to(river,{yPercent:0,autoAlpha:.72,scale:1,duration:19,ease:'power2.out'},34)
    .to(clouds,{xPercent:0,autoAlpha:.52,duration:15,ease:'power1.out'},35)
    .to(mist,{xPercent:-4,autoAlpha:.4,duration:14,ease:'power1.inOut'},37)
    .to(waterBeat,{autoAlpha:1,y:0,duration:4,ease:'power2.out'},42)
    .to(waterBeat,{autoAlpha:1,duration:8},46)
    .to(waterBeat,{autoAlpha:0,y:-22,duration:4},54)
    .to(jungle,{autoAlpha:0,duration:10},48)
    .to(landscape,{filter:'blur(0px) saturate(.96)',scale:1,duration:16,ease:'power2.inOut'},50)
    .to([ridgeWide,ridgeLeft,ridgeRight,mountain,river],{autoAlpha:0,duration:12,ease:'power1.inOut'},56)
    .to(clouds,{xPercent:8,autoAlpha:.18,duration:14},56)
    .to(mist,{xPercent:-12,autoAlpha:.12,duration:14},56)
    .to(landscapeMaster,{scale:1.02,yPercent:-1.5,duration:20,ease:'power1.inOut'},58)
    .to(shade,{opacity:.84,duration:12},62)
    .to(finalCopy,{autoAlpha:1,y:0,duration:7,ease:'power2.out'},69)
    .from(finalCopy.querySelectorAll('.eyebrow,h2,p,.hero-actions,.journey-trust'),{autoAlpha:0,y:16,stagger:.5,duration:4.5,ease:'power2.out'},69)
    .to(finalCopy,{autoAlpha:1,duration:20},80);

  if(matchMedia('(hover: hover) and (pointer: fine)').matches){
    sticky.addEventListener('pointermove',event=>{
      const x=(event.clientX/innerWidth-.5)*2,y=(event.clientY/innerHeight-.5)*2;
      gsap.to([forestFrame,canopy,philodendron],{x:`${x*-8}px`,y:`${y*-5}px`,duration:1.1,overwrite:'auto'});
      gsap.to([snake,toucan],{x:`${x*6}px`,y:`${y*4}px`,duration:.9,overwrite:'auto'});
      gsap.to(finalCopy,{x:x*5,y:y*3,duration:.8,overwrite:'auto'});
    },{passive:true});
  }
})();

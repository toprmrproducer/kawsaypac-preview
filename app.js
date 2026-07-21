(function(){
  'use strict';
  const $=(s,c=document)=>c.querySelector(s);const $$=(s,c=document)=>Array.from(c.querySelectorAll(s));
  const sprout='<img class="sprout" src="assets/sprites/herb-icons/guayusa-sprig.webp?v=17" alt="" aria-hidden="true">';
  const concerns=[['All Products','all'],["Women's Wellness",'womens-wellness'],["Men's Wellness",'mens-wellness'],['Digestive Health','digestive-health'],['Auto-Immune Support','auto-immune-support'],['Nervous System','nervous-system'],['Energy & Vitality','energy-vitality'],['Joint & Mobility','joint-mobility'],['Heart Health','heart-health'],['Liver Support','liver-support'],['Kidney Support','kidney-support'],['Lung Support','lung-support'],['Hormone Balance','hormone-balance'],['Sleep & Relaxation','sleep-relaxation'],['Full Body Detox','full-body-detox']];
  const products=[
    {slug:'river-of-life',name:'River of Life',tag:'Heart Health',concerns:'heart-health lung-support',price:'$34.00',image:'assets/img/blend-river-of-life.webp',desc:'A grounding daily botanical blend for a steady whole-body ritual.',benefits:['Daily foundational ritual','Whole botanicals','Direct Ecuador sourcing'],ingredients:'A rotating whole-herb formulation. Refer to the current pouch for the exact ingredient list and preparation directions.'},
    {slug:'scales-of-balance',name:'Scales of Balance',tag:'Nervous System',concerns:'nervous-system auto-immune-support joint-mobility',price:'$28.50',image:'assets/img/blend-scales-of-balance.webp',desc:'A calm-focused blend for moments when the nervous system needs less noise.',benefits:['Calm daily practice','Small-batch blend','No fillers'],ingredients:'A layered Ecuadorian botanical formulation. Refer to the current pouch for ingredients and serving guidance.'},
    {slug:'sacred-sacral',name:'Sacred Sacral',tag:"Women's Wellness",concerns:'womens-wellness hormone-balance sleep-relaxation',price:'$28.50',image:'assets/img/blend-sacred-sacral.webp',desc:'A thoughtful blend created for cyclical ritual, grounding, and care.',benefits:['Cyclical wellness ritual','Whole loose herbs','Educational preparation'],ingredients:'Whole botanicals selected around a women’s wellness ritual. Use the product label as the final ingredient authority.'},
    {slug:'zapped-in',name:'Zapped In',tag:'Energy & Vitality',concerns:'energy-vitality mens-wellness',price:'$34.00',image:'assets/img/new/kawsaypac-zapped-in-editorial-hero.webp',desc:'A bright daytime blend built around clean energy, presence, and sharp focus.',benefits:['Morning ritual','Focused energy','Resealable pouch'],ingredients:'Guayusa-led botanical blend with complementary whole herbs. Confirm current formula and directions on the pouch.'},
    {slug:'bowel-balance',name:'Bowel Balance',tag:'Digestive Health',concerns:'digestive-health',price:'$28.50',image:'assets/img/blend-bowel-balance.webp',desc:'A practical daily preparation created around digestive comfort and regularity.',benefits:['After-meal ritual','Loose whole herbs','Clear brewing guide'],ingredients:'Whole herbs and roots selected around digestive wellness. Follow the exact preparation guidance on the current label.'},
    {slug:'eliminate-regenerate',name:'Eliminate + Regenerate',tag:'Full Body Detox',concerns:'full-body-detox liver-support kidney-support',price:'$113.00',image:'assets/img/blend-eliminate-regenerate.webp',desc:'A structured multi-blend program for customers who prefer a complete ritual.',benefits:['Coordinated program','Multiple small batches','Step-by-step guide'],ingredients:'A coordinated collection of separate herbal blends. Each pouch includes its own formula and preparation directions.'},
    {slug:'final-flush',name:'Final Flush',tag:'Liver + Kidney',concerns:'liver-support kidney-support digestive-health',price:'$28.50',image:'assets/img/blend-final-flush.webp',desc:'A concise closing blend designed to complete a guided cleansing program.',benefits:['Closing-phase ritual','Whole botanicals','Small-batch preparation'],ingredients:'A whole-herb formulation for the final phase of a guided routine. Follow the current pouch and consult a clinician when appropriate.'},
    {slug:'guayusa-leaf',name:'Wild Guayusa Leaf',tag:'Single Herb',concerns:'energy-vitality mens-wellness',price:'$22.00',image:'assets/img/apoth-guayusa.webp',desc:'A clean, naturally caffeinated Amazonian leaf for a focused morning infusion.',benefits:['Single wildcrafted herb','Amazonian origin','Naturally caffeinated'],ingredients:'100% guayusa leaf. Preparation and batch origin are recorded on the pouch.'},
    {slug:'ritual-bundle',name:'Daily Ritual Bundle',tag:'Bundle',concerns:'all nervous-system energy-vitality digestive-health',price:'$86.00',image:'assets/img/chip-cup.webp',desc:'Three complementary blends for morning, after-meal, and evening rituals.',benefits:['Three-part daily rhythm','Bundled education','Gift-ready'],ingredients:'A rotating bundle of three full-size blends. Exact contents are listed before the Shopify connection is activated.'},
    {slug:'ebook-preparation',name:'The Herbal Preparation Book',tag:'eBook',concerns:'all',price:'$18.00',image:'assets/img/new/kawsaypac-herbal-field-journal.webp',desc:'A digital field guide to infusions, decoctions, timing, and responsible use.',benefits:['Instant digital guide','Clear preparation methods','Printable references'],ingredients:'Digital educational product. No physical ingredients or medical claims.'}
  ];
  window.KAWSAYPAC={concerns,products};
  function navLink(label,href){return `<a class="nav-link" href="${href}">${sprout}<span>${label}</span></a>`}
  function renderHeader(){const host=$('[data-site-header]');if(!host)return;const ribbon='<span>Wildcrafted in Ecuador</span><i>✦</i><span>Whole botanicals</span><i>✦</i><span>Small-batch blends</span><i>✦</i><span>Direct partner sourcing</span><i>✦</i>';host.innerHTML=`<svg width="0" height="0" aria-hidden="true"><filter id="liquid-refraction" x="-15%" y="-15%" width="130%" height="130%"><feTurbulence type="fractalNoise" baseFrequency="0.012 0.025" numOctaves="2" seed="8" result="noise"/><feGaussianBlur in="noise" stdDeviation="1.2" result="softNoise"/><feDisplacementMap in="SourceGraphic" in2="softNoise" scale="12" xChannelSelector="R" yChannelSelector="G"/></filter></svg><header class="site-header"><div class="trust-ribbon" aria-label="Kawsaypac sourcing highlights"><div class="trust-track">${ribbon}${ribbon}</div></div><div class="nav-pill"><span class="nav-refraction"></span><span class="nav-tint"></span><a class="brand" href="index.html"><img src="assets/brand/kawsaypac-mark.svg?v=17" alt=""><span><strong>KAWSAYPAC</strong><small>Ancestral Herbs</small></span></a><nav class="desktop-nav" aria-label="Primary"><div class="nav-item"><button class="nav-link drop-trigger" type="button" aria-expanded="false">${sprout}<span>Shop by Concern</span></button><div class="dropdown mega"><div class="mega-links">${concerns.map(c=>`<a href="shop.html?concern=${c[1]}">${c[0]}</a>`).join('')}</div><a class="mega-feature" href="shop.html?concern=digestive-health"><img src="assets/img/bowl-digestive.webp?v=17" alt="Digestive herbs prepared in a ceramic bowl"><span><small>Find your ritual</small><strong>Begin with what your body is asking for.</strong></span></a></div></div>${navLink('Philosophy','philosophy.html')}${navLink('Retreats','retreats.html')}${navLink('Apothecary','apothecary.html')}<div class="nav-item"><button class="nav-link drop-trigger" type="button" aria-expanded="false">${sprout}<span>Learn</span></button><div class="dropdown"><a href="philosophy.html">About Kawsaypac</a><a href="tea-preparation.html">Tea Preparation Guide</a><a href="preparing-your-body.html">Preparing Your Body</a><a href="recipes.html">Recipes & Programs</a></div></div>${navLink('Our Story','story.html')}</nav><div class="nav-actions"><a class="btn btn-primary" href="shop.html">Shop Herbs</a><button class="menu-toggle icon-button" type="button" aria-label="Open menu" aria-expanded="false"><svg class="icon" viewBox="0 0 24 24"><path d="M4 7h16M4 12h16M4 17h16"/></svg></button></div></div><div class="mobile-sheet" aria-hidden="true"><nav><a href="shop.html">Shop by Concern</a><a href="philosophy.html">Philosophy</a><a href="retreats.html">Retreats</a><a href="apothecary.html">Apothecary</a><a href="story.html">Our Story</a><a class="mobile-sub" href="tea-preparation.html">Tea Preparation Guide</a><a class="mobile-sub" href="preparing-your-body.html">Preparing Your Body</a><a class="mobile-sub" href="recipes.html">Recipes & Programs</a></nav></div></header>`;}
  function normalizeRibbon(){const track=$('.trust-track');if(!track||track.querySelector('.trust-group'))return;const items=[...track.children],mid=Math.ceil(items.length/2);const first=document.createElement('div'),second=document.createElement('div');first.className='trust-group';second.className='trust-group';second.setAttribute('aria-hidden','true');items.slice(0,mid).forEach(item=>first.append(item));items.slice(mid).forEach(item=>second.append(item));track.append(first,second)}
  function renderFooter(){const host=$('[data-site-footer]');if(!host)return;host.innerHTML=`<footer class="site-footer"><img class="footer-bg" src="assets/img/bg-footer-jungle.webp?v=17" alt="Sunlit Ecuadorian forest floor"><div class="footer-foliage" aria-hidden="true"><img src="assets/img/fg-leaf-monstera.webp?v=17" alt=""><img src="assets/img/fg-leaf-fern.webp?v=17" alt=""></div><div class="footer-card"><div class="footer-grid"><div class="footer-intro"><a class="brand" href="index.html"><img src="assets/brand/kawsaypac-mark.svg?v=17" alt=""><span><strong>KAWSAYPAC</strong><small>ANCESTRAL HERBS</small></span></a><p>Wildcrafted herbal rituals rooted in Ecuador and shared through direct community relationships.</p></div><div class="footer-col"><h3>Explore</h3><ul><li><a href="shop.html">Shop All Herbs</a></li><li><a href="shop.html?type=blends">Kawsaypac Blends</a></li><li><a href="shop.html?type=bundles">Kawsaypac Bundles</a></li><li><a href="retreats.html">Ecuador Retreats</a></li><li><a href="recipes.html">Recipes & Programs</a></li></ul></div><div class="footer-col"><h3>Learn</h3><ul><li><a href="philosophy.html">Why Kawsaypac</a></li><li><a href="tea-preparation.html">Tea Preparation Guide</a></li><li><a href="preparing-your-body.html">Preparing Your Body</a></li><li><a href="story.html">Our Story</a></li></ul></div><div class="footer-col"><h3>Support</h3><ul><li><a href="contact.html">Contact Us</a></li><li><a href="faq.html">FAQ</a></li><li><a href="wholesale.html">Wholesale</a></li></ul></div><div class="footer-col"><h3>Policies</h3><ul><li><a href="shipping-returns.html">Shipping & Returns</a></li><li><a href="refund-policy.html">Refund Policy</a></li><li><a href="privacy.html">Privacy Policy</a></li><li><a href="terms.html">Terms of Service</a></li><li><a href="fda-disclaimer.html">FDA Disclaimer</a></li></ul></div></div><div class="footer-bottom"><div><div class="electric">THE ELECTRIC EATS</div><div class="footer-tagline">Rooted in Ecuador. Guided by Nature. Created for Transformation.</div></div><div class="socials"><a href="https://www.instagram.com/theelectriceats/" aria-label="Instagram"><svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><path d="M17.5 6.5h.01"/></svg></a><a href="https://www.youtube.com/@theelectriceats" aria-label="YouTube"><svg viewBox="0 0 24 24"><path d="M21 8.2a3 3 0 0 0-2-2C17 5.6 14.3 5.5 12 5.5s-5 .1-6.9.7A3 3 0 0 0 3 8.2 20 20 0 0 0 2.5 12 20 20 0 0 0 3 15.8a3 3 0 0 0 2.1 2c1.9.6 4.6.7 6.9.7s5-.1 6.9-.7a3 3 0 0 0 2.1-2 20 20 0 0 0 .5-3.8 20 20 0 0 0-.5-3.8Z"/><path d="m10 9 5 3-5 3Z"/></svg></a><a href="https://x.com/theelectriceats" aria-label="X"><svg viewBox="0 0 24 24"><path d="M5 4l14 16M19 4 5 20"/></svg></a><a href="https://www.tiktok.com/@theelectriceats" aria-label="TikTok"><svg viewBox="0 0 24 24"><path d="M14 3v11.5a4.5 4.5 0 1 1-4-4.5M14 3c.5 3 2 4.5 5 5"/></svg></a><a href="mailto:hello@theelectriceats.com" aria-label="Email"><svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m4 7 8 6 8-6"/></svg></a></div><p class="legal">© 2026 The Electric Eats. These statements have not been evaluated by the Food and Drug Administration. Products are not intended to diagnose, treat, cure, or prevent disease.</p></div></div></footer>`;}
  function renderModal(){const host=$('[data-site-modal]');if(!host)return;host.innerHTML='<div class="modal" role="dialog" aria-modal="true" aria-label="Media viewer"><div class="modal-card"><button class="modal-close icon-button" type="button" aria-label="Close"><svg class="icon" viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18"/></svg></button><div class="video-frame" data-modal-content></div></div></div><div class="toast" role="status" aria-live="polite"></div>';}
  function initNav(){
    const toggle=$('.menu-toggle'),sheet=$('.mobile-sheet');
    const setMenu=open=>{
      if(!toggle||!sheet)return;
      sheet.classList.toggle('open',open);
      sheet.setAttribute('aria-hidden',String(!open));
      toggle.setAttribute('aria-expanded',String(open));
      document.body.classList.toggle('menu-open',open);
    };
    if(toggle&&sheet){
      toggle.addEventListener('click',()=>setMenu(!sheet.classList.contains('open')));
      $$('a',sheet).forEach(a=>a.addEventListener('click',()=>setMenu(false)));
    }
    $$('.drop-trigger').forEach(btn=>btn.addEventListener('click',e=>{e.stopPropagation();const item=btn.closest('.nav-item');const open=!item.classList.contains('open');$$('.nav-item.open').forEach(i=>i.classList.remove('open'));item.classList.toggle('open',open);btn.setAttribute('aria-expanded',String(open))}));
    document.addEventListener('click',()=>$$('.nav-item.open').forEach(i=>i.classList.remove('open')));
    document.addEventListener('keydown',e=>{if(e.key==='Escape'){$$('.nav-item.open').forEach(i=>i.classList.remove('open'));setMenu(false)}});
  }
  function card(p){return `<article class="product-card reveal" data-shop-product data-concern="${p.concerns}" data-type="${p.tag.toLowerCase()}"><a class="product-media" href="product.html?product=${p.slug}"><img src="${p.image}?v=17" alt="${p.name} herbal product" loading="lazy"><span class="product-tag">${p.tag}</span></a><div class="product-copy"><h3>${p.name}</h3><strong>${p.price}</strong><p>${p.desc}</p><a class="card-link" href="product.html?product=${p.slug}">View blend</a></div></article>`}
  const liveProductUrls={
    'river-of-life':'https://theelectriceats.com/products/river-of-life',
    'scales-of-balance':'https://theelectriceats.com/products/scales-of-balance',
    'sacred-sacral':'https://theelectriceats.com/products/sacred-sacral-sweetened',
    'zapped-in':'https://theelectriceats.com/products/zapped-in'
  };
  function homeCard(p){const href=liveProductUrls[p.slug]||`https://theelectriceats.com/collections/all`;return `<article class="product-card reveal"><a class="product-media" href="${href}"><img src="${p.image}?v=23" alt="${p.name} herbal product" loading="lazy"><span class="product-tag">${p.tag}</span></a><div class="product-copy"><h3>${p.name}</h3><strong>${p.price}</strong><p>${p.desc}</p><a class="card-link" href="${href}">View in shop</a></div></article>`}
  function renderHomeData(){
    const best=$('[data-best-sellers]');
    if(best)best.innerHTML=products.slice(0,4).map(homeCard).join('');
    const videos=$('[data-video-stories]');
    if(videos){
      const stories=[
        ['testimonial-02.webp','Chapter 01','Morning energy'],
        ['testimonial-04.webp','Chapter 02','A grounded daily ritual'],
        ['testimonial-07.webp','Chapter 03','Learning the preparation'],
        ['testimonial-08.webp','Chapter 04','Plants in family life']
      ];
      videos.innerHTML=stories.map(story=>`<button class="video-card reveal" type="button" data-placeholder-video aria-label="Preview ${story[2]} film position"><img src="assets/img/testimonials/${story[0]}?v=23" alt="Editorial portrait placeholder for the forthcoming ${story[2]} film"><span class="preview-badge">Film in production</span><span class="video-play"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg></span><span class="video-card-copy"><small>${story[1]}</small><strong>${story[2]}</strong></span></button>`).join('');
    }
  }
  function initReveal(){if(matchMedia('(prefers-reduced-motion: reduce)').matches){$$('.reveal').forEach(e=>e.classList.add('visible'));return}const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');io.unobserve(e.target)}}),{threshold:.12});$$('.reveal').forEach(e=>io.observe(e))}
  function initHero(){
    const hero=$('.hero-scroll'),sticky=$('.hero-sticky');
    if(!hero||!sticky)return;

    const mobile=matchMedia('(max-width: 720px)').matches;
    const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
    if(mobile||reduce||!window.gsap||!window.ScrollTrigger)return;

    gsap.registerPlugin(ScrollTrigger);
    const summit=$('.hero-frame-summit');
    const summitImage=$('.hero-frame-summit img');
    const summitOccluder=$('.hero-summit-occluder');
    const valley=$('.hero-frame-valley');
    const valleyImage=$('.hero-frame-valley img');
    const amazon=$('.hero-frame-amazon');
    const amazonImage=$('.hero-frame-amazon img');
    const intro=$('.hero-intro');
    const valleyChapter=$('.hero-chapter-valley');
    const amazonChapter=$('.hero-chapter-amazon');
    const clouds=$('.hero-clouds');
    const mist=$('.hero-mist');
    const rays=$('.hero-rays');
    const hummingbird=$('.hero-hummingbird');
    const altitude=$('[data-hero-altitude]');
    const altitudeLine=$('.hero-altitude i');

    gsap.set([summit,summitImage,summitOccluder,intro],{autoAlpha:1,force3D:true});
    gsap.set([valley,amazon,valleyChapter,amazonChapter,mist,rays,hummingbird],{autoAlpha:0,force3D:true});
    gsap.set(valleyImage,{scale:1.36,yPercent:2,transformOrigin:'52% 10%',force3D:true});
    gsap.set(amazonImage,{scale:1.12,yPercent:3,transformOrigin:'50% 48%',force3D:true});
    gsap.set(clouds,{autoAlpha:.18,xPercent:-2,yPercent:1,force3D:true});
    gsap.set(valleyChapter,{y:24});
    gsap.set(amazonChapter,{y:24});
    gsap.set(hummingbird,{xPercent:-12,yPercent:8,rotation:-3,transformOrigin:'50% 50%'});
    gsap.set(altitudeLine,{scaleY:0});

    const altitudeAt=progress=>Math.round(5897+(250-5897)*progress);
    const timeline=gsap.timeline({
      defaults:{ease:'none',force3D:true},
      scrollTrigger:{
        id:'home-hero',
        trigger:hero,
        start:'top top',
        end:()=>`+=${Math.round(innerHeight*1.65)}`,
        pin:sticky,
        scrub:.65,
        anticipatePin:1,
        invalidateOnRefresh:true,
        onUpdate:self=>{
          if(altitude)altitude.textContent=`${altitudeAt(self.progress).toLocaleString()} m`;
          if(altitudeLine)gsap.set(altitudeLine,{scaleY:self.progress});
        }
      }
    });

    timeline
      .to([summitImage,summitOccluder],{scale:1.075,yPercent:-1.5,duration:30},0)
      .to(clouds,{xPercent:1.5,yPercent:-1.5,autoAlpha:.28,duration:34},0)
      .to(intro,{autoAlpha:0,y:-22,duration:9},19)
      .to(mist,{autoAlpha:.34,yPercent:-4,duration:7},24)
      .to(valley,{autoAlpha:1,duration:10},26)
      .to([summit,summitOccluder],{autoAlpha:0,duration:10},29)
      .to(mist,{autoAlpha:.08,yPercent:-8,duration:8},31)
      .to(valleyImage,{scale:1.015,yPercent:-1,duration:31},28)
      .to(valleyChapter,{autoAlpha:1,y:0,duration:8},37)
      .to(valleyChapter,{autoAlpha:0,y:-18,duration:7},57)
      .to(mist,{autoAlpha:.3,yPercent:-12,duration:7},62)
      .to(amazon,{autoAlpha:1,duration:10},64)
      .to(valley,{autoAlpha:0,duration:10},67)
      .to(amazonImage,{scale:1,yPercent:-1,duration:31},64)
      .to(mist,{autoAlpha:.04,yPercent:-16,duration:9},70)
      .to(rays,{autoAlpha:.28,duration:10},70)
      .to(amazonChapter,{autoAlpha:1,y:0,duration:9},74)
      .to(hummingbird,{autoAlpha:.82,xPercent:0,yPercent:0,rotation:2,duration:8},79)
      .to(hummingbird,{xPercent:9,yPercent:-6,rotation:-1,duration:17},87)
      .to(rays,{autoAlpha:.16,duration:20},80);

    if(document.fonts&&document.fonts.ready)document.fonts.ready.then(()=>ScrollTrigger.refresh());
  }
  function initFilm(){const frame=$('[data-youtube-film]');if(!frame)return;let loaded=false;const command=func=>{if(frame.contentWindow)frame.contentWindow.postMessage(JSON.stringify({event:'command',func,args:[]}), '*')};const io=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){if(!loaded){frame.src=frame.dataset.src;loaded=true;setTimeout(()=>command('playVideo'),900)}else command('playVideo')}else if(loaded)command('pauseVideo')}),{threshold:.45});io.observe(frame)}
  function initDraggableSprites(){
    const placements=[
      ['.shop-hero','assets/sprites/hummingbirds/hummingbird-flight.webp','85%','28%','clamp(92px,10vw,145px)','7deg','edge'],
      ['.pdp-hero','assets/sprites/herb-icons/herbal-teacup.webp','90%','12%','clamp(82px,9vw,125px)','-8deg','edge']
    ];
    if($('.page-hero')){
      const pageSprites={
        '/apothecary.html':'assets/sprites/herb-icons/passionflower-vine.webp',
        '/philosophy.html':'assets/sprites/herb-icons/mountain-herb-rosette.webp',
        '/retreats.html':'assets/img/fg-leaf-fern.webp',
        '/story.html':'assets/img/fg-orchid.webp',
        '/tea-preparation.html':'assets/sprites/herb-icons/herbal-teacup.webp',
        '/recipes.html':'assets/sprites/herb-icons/seed-pod.webp',
        '/preparing-your-body.html':'assets/sprites/herb-icons/guayusa-sprig.webp'
      };
      placements.push(['.page-hero',pageSprites[location.pathname]||'assets/sprites/herb-icons/cinchona-bark-leaves.webp','88%','70%','clamp(76px,8vw,118px)','12deg','behind']);
    }
    placements.forEach(([selector,path,left,top,size,rotate,layer],index)=>{const host=$(selector);if(!host)return;if(getComputedStyle(host).position==='static')host.style.position='relative';const sprite=document.createElement('button');sprite.type='button';sprite.className=`drag-sprite sprite-${layer}`;sprite.setAttribute('aria-label','Move this botanical illustration');sprite.title='Drag me, or use the arrow keys';sprite.style.cssText=`left:${left};top:${top};--sprite-size:${size};--sprite-rotate:${rotate};--ambient-delay:-${(index*.73).toFixed(2)}s;--ambient-duration:${5.2+(index%4)*.8}s;--sprite-depth:${.35+(index%5)*.11}`;sprite.innerHTML=`<img src="${path}?v=17" alt="" draggable="false">`;host.append(sprite);let dx=0,dy=0,startX=0,startY=0,originX=0,originY=0,moved=false;const paint=()=>{sprite.style.setProperty('--drag-x',`${dx}px`);sprite.style.setProperty('--drag-y',`${dy}px`)};sprite.addEventListener('pointerdown',e=>{if(e.button!==0)return;startX=e.clientX;startY=e.clientY;originX=dx;originY=dy;moved=false;sprite.classList.add('is-dragging');sprite.setPointerCapture(e.pointerId);e.preventDefault()});sprite.addEventListener('pointermove',e=>{if(!sprite.hasPointerCapture(e.pointerId))return;dx=originX+e.clientX-startX;dy=originY+e.clientY-startY;moved=moved||Math.abs(e.clientX-startX)>3||Math.abs(e.clientY-startY)>3;paint()});const release=e=>{if(sprite.hasPointerCapture(e.pointerId))sprite.releasePointerCapture(e.pointerId);sprite.classList.remove('is-dragging')};sprite.addEventListener('pointerup',release);sprite.addEventListener('pointercancel',release);sprite.addEventListener('click',e=>{if(moved)e.preventDefault()});sprite.addEventListener('dblclick',()=>{dx=0;dy=0;paint()});sprite.addEventListener('keydown',e=>{const step=e.shiftKey?20:6;if(e.key==='ArrowLeft')dx-=step;else if(e.key==='ArrowRight')dx+=step;else if(e.key==='ArrowUp')dy-=step;else if(e.key==='ArrowDown')dy+=step;else return;e.preventDefault();paint()})})
  }
  function initLivingInterface(){
    const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
    if(reduce)return;
    const fine=matchMedia('(hover: hover) and (pointer: fine)').matches;
    const root=document.documentElement;
    let frame=0,lastX=innerWidth/2,lastY=innerHeight/2;
    const paint=()=>{frame=0;const nx=(lastX/innerWidth-.5)*2,ny=(lastY/innerHeight-.5)*2;root.style.setProperty('--scene-x',`${(nx*13).toFixed(2)}px`);root.style.setProperty('--scene-y',`${(ny*9).toFixed(2)}px`);root.style.setProperty('--scene-x-back',`${(nx*-7).toFixed(2)}px`);root.style.setProperty('--scene-y-back',`${(ny*-5).toFixed(2)}px`);$$('.drag-sprite:not(.is-dragging)').forEach((sprite,index)=>{const depth=Number(sprite.style.getPropertyValue('--sprite-depth'))||.5;sprite.style.setProperty('--pointer-x',`${(nx*11*depth).toFixed(2)}px`);sprite.style.setProperty('--pointer-y',`${(ny*8*depth).toFixed(2)}px`)});if(cursor){cursor.style.setProperty('--cursor-x',`${lastX}px`);cursor.style.setProperty('--cursor-y',`${lastY}px`)}};
    let cursor=null;
    if(fine){cursor=document.createElement('div');cursor.className='cursor-bloom';cursor.setAttribute('aria-hidden','true');document.body.append(cursor)}
    document.addEventListener('pointermove',e=>{lastX=e.clientX;lastY=e.clientY;if(!frame)frame=requestAnimationFrame(paint)},{passive:true});
    $$('a,button,.product-card,.collection-bowl,.concern-bowl,.video-card,.retreat-film,.retreat-chapter,.specimen').forEach(el=>{el.addEventListener('pointerenter',()=>cursor&&cursor.classList.add('is-active'));el.addEventListener('pointerleave',()=>{cursor&&cursor.classList.remove('is-active');el.style.removeProperty('--mag-x');el.style.removeProperty('--mag-y')});if(el.matches('.btn,.icon-button'))el.addEventListener('pointermove',e=>{const r=el.getBoundingClientRect();el.style.setProperty('--mag-x',`${((e.clientX-r.left)/r.width-.5)*8}px`);el.style.setProperty('--mag-y',`${((e.clientY-r.top)/r.height-.5)*6}px`)})});
    $$('.section,.shop-hero,.page-hero,.pdp-hero').forEach(section=>{const react=e=>{const r=section.getBoundingClientRect(),x=((e.clientX-r.left)/r.width-.5)*2,y=((e.clientY-r.top)/r.height-.5)*2;section.style.setProperty('--react-x',`${(x*7).toFixed(2)}px`);section.style.setProperty('--react-y',`${(y*5).toFixed(2)}px`)};section.addEventListener('pointermove',react,{passive:true});section.addEventListener('pointerleave',()=>{section.style.setProperty('--react-x','0px');section.style.setProperty('--react-y','0px')});section.addEventListener('pointerdown',react,{passive:true})});
  }
  function toast(message){const t=$('.toast');if(!t)return;t.textContent=message;t.classList.add('show');clearTimeout(toast.timer);toast.timer=setTimeout(()=>t.classList.remove('show'),3800)}
  function initImageGuard(){
    const fallback='data:image/svg+xml;charset=UTF-8,'+encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600"><rect width="800" height="600" fill="#f3f0e9"/><circle cx="400" cy="275" r="86" fill="none" stroke="#c9a942" stroke-width="3"/><path d="M400 198c-45 38-70 83-70 132 42-8 72-33 70-132Zm0 0c45 38 70 83 70 132-42-8-72-33-70-132Z" fill="none" stroke="#1f3a2a" stroke-width="4"/><text x="400" y="430" text-anchor="middle" fill="#1f3a2a" font-family="Georgia,serif" font-size="28" letter-spacing="6">KAWSAYPAC</text></svg>`);
    $$('img').forEach(img=>{const swap=()=>{if(img.src.startsWith('data:'))return;img.src=fallback;img.classList.add('image-fallback')};img.addEventListener('error',swap,{once:true});if(img.complete&&!img.naturalWidth)swap()});
  }
  function initForms(){
    $$('[data-newsletter],.contact-form').forEach(form=>form.addEventListener('submit',e=>{
      const email=$('input[type="email"]',form);
      const error=$('.newsletter-error',form.closest('.newsletter-card')||document);
      if(email&&(!email.value.trim()||!email.validity.valid)){
        e.preventDefault();
        if(error)error.hidden=false;
        toast('Please enter a valid email address.');
        email.focus();
        return;
      }
      if(error)error.hidden=true;
      if(form.matches('[data-newsletter]')){
        const button=$('button[type="submit"]',form);
        if(button){button.textContent='Joining…';button.setAttribute('aria-busy','true')}
        return;
      }
      e.preventDefault();
      if(form.classList.contains('contact-form')){const data=new FormData(form);location.href=`mailto:hello@theelectriceats.com?subject=${encodeURIComponent(data.get('subject')||'Kawsaypac inquiry')}&body=${encodeURIComponent(data.get('message')||'')}`}
    }));
    $$('[data-add-cart]').forEach(btn=>btn.addEventListener('click',()=>toast('Added to the preview bag. Shopify checkout will be connected at launch.')))
  }
  function initModal(){const modal=$('.modal'),content=$('[data-modal-content]'),close=$('.modal-close');if(!modal)return;let last=null;function shut(){modal.classList.remove('open');document.body.classList.remove('modal-open');content.innerHTML='';if(last)last.focus()}function open(el){last=el;const src=el.dataset.video;if(src)content.innerHTML=`<iframe src="${src}" title="Kawsaypac film" allow="autoplay; fullscreen" allowfullscreen></iframe>`;else content.innerHTML='<div style="padding:50px;text-align:center"><p class="eyebrow" style="color:#f0d77c">Client footage pending</p><h2 style="font-family:var(--display);font-weight:400">Customer video placeholder</h2><p>This clearly labeled preview position will hold an approved customer story.</p></div>';modal.classList.add('open');document.body.classList.add('modal-open');close.focus()}$$('[data-video],[data-placeholder-video]').forEach(el=>el.addEventListener('click',()=>open(el)));close&&close.addEventListener('click',shut);modal.addEventListener('click',e=>{if(e.target===modal)shut()});document.addEventListener('keydown',e=>{if(e.key==='Escape'&&modal.classList.contains('open'))shut()})}
  function initJournalLinks(){const learn=$$('.desktop-nav .dropdown').find(menu=>menu.closest('.nav-item')?.querySelector('.drop-trigger span')?.textContent.trim()==='Learn');if(learn&&!learn.querySelector('a[href="journal.html"]'))learn.insertAdjacentHTML('beforeend','<a href="journal.html">Botanical Journal</a>');const mobile=$('.mobile-sheet nav');if(mobile&&!mobile.querySelector('a[href="journal.html"]'))mobile.insertAdjacentHTML('beforeend','<a class="mobile-sub" href="journal.html">Botanical Journal</a>');const footer=$$('.footer-col').find(col=>col.querySelector('h3')?.textContent.trim()==='Learn');if(footer&&!footer.querySelector('a[href="journal.html"]'))footer.querySelector('ul')?.insertAdjacentHTML('beforeend','<li><a href="journal.html">Botanical Journal</a></li>')}
  function boot(){renderHeader();normalizeRibbon();renderFooter();renderModal();initJournalLinks();renderHomeData();initImageGuard();initDraggableSprites();initNav();initHero();initFilm();initReveal();initForms();initModal();initLivingInterface();document.documentElement.classList.add('ready')}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();

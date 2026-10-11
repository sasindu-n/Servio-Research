// Navigation and research story controls.
const nav=document.querySelector('.links');
const menu=document.querySelector('.menu-btn');
const header=document.querySelector('.site-header');
const mainSections=['home','domain','milestones','documents','presentations','about','contact'];
function refreshHeaderHeight(){document.documentElement.style.setProperty('--actual-header',Math.ceil(header?.getBoundingClientRect().height||78)+'px');}
refreshHeaderHeight();
window.addEventListener('resize',refreshHeaderHeight,{passive:true});
menu?.addEventListener('click',()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(open));});
function markActive(id){nav?.querySelectorAll('a[href^="#"]').forEach(a=>{const on=a.hash==='#'+id;a.classList.toggle('active',on);if(on)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current');});}
let scrollingUntil=0;
function navigate(id,writeHistory=true){
 const target=document.getElementById(id);if(!target)return;
 nav?.classList.remove('open');menu?.setAttribute('aria-expanded','false');
 // Let the mobile menu close BEFORE measuring the sticky header.
 requestAnimationFrame(()=>{
  refreshHeaderHeight();
  const headerHeight=Math.ceil(header?.getBoundingClientRect().height||78);
  const section=mainSections.includes(id);
  const heading=section?target.querySelector('.section-heading, .compact-hero-copy, .intro, h1, h2'):null;
  const destination=id==='home'?0:(heading||target).getBoundingClientRect().top+window.scrollY-headerHeight-16;
  const top=Math.max(0,Math.round(destination));
  scrollingUntil=performance.now()+650;
  window.scrollTo({top,behavior:'instant'});
  if(writeHistory&&location.hash!=='#'+id)history.pushState(null,'','#'+id);
  markActive(section?id:id.startsWith('component-')?'domain':id);
 });
}
document.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{const id=decodeURIComponent(a.hash.slice(1));if(!document.getElementById(id))return;e.preventDefault();navigate(id); }));
window.addEventListener('popstate',()=>navigate(decodeURIComponent(location.hash.slice(1))||'home',false));
window.addEventListener('load',()=>{refreshHeaderHeight();if(location.hash)navigate(decodeURIComponent(location.hash.slice(1)),false);else markActive('home');});
let frame=false;
window.addEventListener('scroll',()=>{if(frame||performance.now()<scrollingUntil)return;frame=true;requestAnimationFrame(()=>{frame=false;let current='home';const threshold=(header?.offsetHeight||78)+40;for(const id of mainSections){const el=document.getElementById(id);if(el&&el.getBoundingClientRect().top<=threshold)current=id;}markActive(current);});},{passive:true});
const scenes={water:{file:'water.svg',name:'Water leak',quote:'“Ane plumber kenek one, pipe eka kadila, water yanawa!”',role:'plumber',problem:'A water pipe breaks at home. The resident needs urgent plumbing assistance.',urgency:'High'},car:{file:'car.svg',name:'Car breakdown',quote:'“Car eka start wenne na. Mechanic kenek ikmanata one!”',role:'mechanic',problem:'A car breaks down on the roadside. The driver needs help quickly.',urgency:'High'},electric:{file:'electric.svg',name:'Electrical repair',quote:'“Gedara switch eka wada karanne na. Electrician kenek one.”',role:'electrician',problem:'A household switch is not working. The resident needs a qualified electrician.',urgency:'Normal'}};
const headings=['A real person needs help','The user speaks naturally','The AI evaluates nearby providers','Fair opportunities and provider trust','A suitable provider is recommended'];
const phase=['REAL-WORLD PROBLEM','VOICE INTELLIGENCE','MULTI-AGENT COORDINATION','WORKFORCE INTELLIGENCE','RESEARCH OUTCOME'];
const sceneFrames=['','voice','matching','workforce','result'];
let selected='water',step=0,timer=null;const get=id=>document.getElementById(id);
function stop(){if(timer){clearInterval(timer);timer=null;}get('story-play').textContent='▶ Play story';}
function render(){const x=scenes[selected];const frame=step===0?x.file:selected+'-'+sceneFrames[step]+'.svg';get('world-image').src='assets/images/scenarios/'+frame;get('world-image').alt='Illustration of '+x.name+' during '+phase[step].toLowerCase();get('world-phase').textContent=String(step+1).padStart(2,'0')+' / 05 · '+phase[step];get('world-title').textContent=headings[step];get('world-quote').textContent=x.quote;const details=[x.problem,'Component 01 interprets the mixed-language request and estimates urgency: '+x.urgency+'.','Component 02 coordinates provider search, context, travel feasibility, availability and adaptive ranking.','Component 03 provides reputation and fair opportunity information for suitable workers.','The research proposes a context-sensitive '+x.role+' recommendation. This is an illustrative result, not a booking.'];get('world-detail').textContent=details[step];get('world-contribution').textContent=['Real-life Sri Lankan service problem','01 · Voice intelligence','02 · Multi-agent coordination','03 · Workforce intelligence','Integrated research outcome'][step];get('world-visual-label').textContent=[x.name+' · A resident needs help','Speech request understood · '+x.urgency+' urgency','Searching and evaluating possible '+x.role+'s','Considering worker trust and fair opportunities','Suitable '+x.role+' suggested'][step];get('world-prev').disabled=step===0;get('world-next').textContent=step===4?'↺ Replay':'Next scene →';document.querySelectorAll('#world-stepper span').forEach((s,i)=>s.classList.toggle('selected',i===step));document.querySelectorAll('[data-world]').forEach(b=>{b.classList.toggle('active',b.dataset.world===selected);b.setAttribute('aria-pressed',String(b.dataset.world===selected));});get('research-sim').dataset.stage=String(step);}
function next(){step=(step+1)%5;render();}
get('world-next')?.addEventListener('click',()=>{stop();next();});get('world-prev')?.addEventListener('click',()=>{stop();step=Math.max(0,step-1);render();});get('story-restart')?.addEventListener('click',()=>{stop();step=0;render();});document.querySelectorAll('[data-world]').forEach(b=>b.addEventListener('click',()=>{stop();selected=b.dataset.world;step=0;render();}));get('story-play')?.addEventListener('click',()=>{if(timer){stop();return;}get('story-play').textContent='Ⅱ Pause';next();timer=setInterval(next,3800);});document.addEventListener('visibilitychange',()=>{if(document.hidden)stop()});render();

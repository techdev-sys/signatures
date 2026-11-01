import {signatureMenu, menuCategories, menuSections} from './signature-menu.mjs?v=paramount-fire-1';
import {menuVisual} from './menu-art.mjs?v=paramount-fire-1';
/**
 * Paramount Signature / Concept 01 — Mobile-Native App Edition
 * Paramount's restaurant identity and workspace journeys, engineered with a
 * native mobile app shell, slide-up bottom sheets, floating tray bar, live
 * order status pill, horizontal snap carousels, and an interactive phone-frame
 * preview mode for desktop browsers.
 * Standalone browser prototype: no backend, payment gateway or real dispatch.
 * Open app1.html through an HTTP server. Original app.mjs is untouched.
 */
const $ = (selector, scope = document) => scope.querySelector(selector);
const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const money = cents => '$' + (cents / 100).toFixed(2);
const asset = name => './concept-assets/' + name;
const STORE = 'paramount-concept-01-v1';
const glyphs = {
  home:'<path d="m3 10 9-7 9 7M5 9v12h14V9M9 21v-8h6v8"/>',
  menu:'<path d="M4 3v7a3 3 0 0 0 6 0V3M7 3v18M18 3v18M18 3c-4 2-4 9 0 9"/>',
  pin:'<path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2"/>',
  bag:'<path d="M5 7h14l1 14H4L5 7ZM8 7V6a4 4 0 0 1 8 0v1"/>',
  arrow:'<path d="M4 12h16m-6-6 6 6-6 6"/>',
  clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  grid:'<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
  search:'<circle cx="10" cy="10" r="6"/><path d="m15 15 5 5"/>',
  truck:'<path d="M2 5h12v13H2ZM14 9h4l4 5v4h-8"/><circle cx="6" cy="18" r="2"/><circle cx="18" cy="18" r="2"/>',
  check:'<path d="m5 12 4 4L19 6"/>',
  flame:'<path d="M12 2c3 5-1 6 3 9 1-2 2-3 2-5 7 8 4 16-5 16S1 14 6 9c0 4 3 4 3 4-2-5 3-7 3-11Z"/>',
  people:'<circle cx="9" cy="7" r="3"/><path d="M3 21v-3a6 6 0 0 1 12 0v3M16 4a3 3 0 0 1 0 6m2 4a5 5 0 0 1 3 4v3"/>',
  phone:'<rect x="6" y="2" width="12" height="20" rx="3"/><path d="M11 18h2"/>',
  close:'<path d="m6 6 12 12M6 18 18 6"/>'
};
const icon = (name, extra = '') => '<svg class="icon '+extra+'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+(glyphs[name] || glyphs.menu)+'</svg>';
const products = signatureMenu;
const categories = menuCategories;
const initial = () => ({
  version:1, branch:'cbd', mode:'delivery', cart:[], orders:[], enquiries:[], activeOrder:null,
  branches:[
    {id:'cbd',name:'CBD',area:'In the heart of the city',prep:20,fee:200,delta:0,open:true,sold:[]},
    {id:'borrowdale',name:'Borrowdale',area:'A little room to slow down',prep:25,fee:250,delta:50,open:true,sold:['wings']},
    {id:'chitungwiza',name:'Chitungwiza',area:'Good food, close to home',prep:20,fee:200,delta:0,open:true,sold:['mango']},
    {id:'hatfield',name:'Hatfield',area:'Your neighbourhood table',prep:30,fee:300,delta:0,open:true,sold:[]}
  ]
});
let state = initial();
try {
  const saved = JSON.parse(localStorage.getItem(STORE));
  if (saved?.version === 1 && Array.isArray(saved.branches) && saved.branches.length === 4 && saved.branches.some(b=>b.id===saved.branch) && Array.isArray(saved.cart) && Array.isArray(saved.orders) && Array.isArray(saved.enquiries)) state = saved;
} catch {}
const motionPreference=window.matchMedia('(prefers-reduced-motion: reduce)');
let atmospherePaused=motionPreference.matches;
try{atmospherePaused=atmospherePaused||sessionStorage.getItem('paramount-concept-atmosphere-paused')==='true';}catch{}
let mobileFrameMode = window.innerWidth > 760;
try {
  const savedFrame = sessionStorage.getItem('paramount-mobile-frame');
  if (savedFrame !== null) mobileFrameMode = savedFrame === 'true';
} catch {}
let route = location.hash.slice(1) || 'home', category = 'All menu', menuSection = 'all', query = '', lastFocus, toastTimer;
const branch = (id = state.branch) => state.branches.find(b => b.id === id);
const product = id => products.find(p => p.id === id) || (id==='vanilla'?products.find(p=>p.id==='shake'):undefined);
const price = p => p.price + branch().delta;
const canOrder = p => Boolean(p) && branch().open && !branch().sold.includes(p.id);
const quantity = () => state.cart.reduce((n,l) => n+l.qty,0);
const itemQtyInCart = id => state.cart.filter(l => l.id === id).reduce((n, l) => n + l.qty, 0);
const subtotal = () => state.cart.reduce((n,l) => n+l.unit*l.qty,0);
const delivery = () => state.mode === 'delivery' && state.cart.length ? branch().fee : 0;
const total = () => subtotal()+delivery();
const stepsFor = o => o.mode==='delivery'?['Order received','Accepted by branch','Kitchen & bar preparing','Ready for pickup','On the way','Delivered']:['Order received','Accepted by branch','Kitchen & bar preparing','Ready for collection','Collected'];
const activeLiveOrder = () => state.orders.find(o => o.step < stepsFor(o).length - 1);

function syncViewportClasses() {
  const isSmall = window.innerWidth <= 760;
  document.body.classList.toggle('is-mobile-view', isSmall);
  document.body.classList.toggle('mobile-frame-mode', !isSmall && mobileFrameMode);
}
window.addEventListener('resize', syncViewportClasses);

function save() { try { localStorage.setItem(STORE,JSON.stringify(state)); } catch { notify('Browser storage is unavailable. This preview will last for this visit.'); } }
function notify(text) { $('#toast').textContent=text; $('#toast').classList.add('show'); clearTimeout(toastTimer); toastTimer=setTimeout(()=>$('#toast').classList.remove('show'),3400); }
const btn = (label, action, attrs = '', style = 'button') => '<button type="button" class="'+style+'" data-action="'+action+'" '+attrs+'>'+label+'</button>';
const link = (label, dest, cls='') => '<a class="'+cls+'" href="#'+dest+'">'+label+'</a>';
const title = (kicker, heading, text='') => '<div class="page-heading"><span class="eyebrow">'+kicker+'</span><h1>'+heading+'</h1>'+(text?'<p>'+text+'</p>':'')+'</div>';
const empty = (heading, text, action='Explore the menu',dest='order') => '<div class="empty">'+icon('bag')+'<h2>'+heading+'</h2><p>'+text+'</p>'+link(action+icon('arrow'),dest,'button')+'</div>';
function go(dest) {
  if(route===dest) {render();scrollTop();}
  else location.hash=dest;
}
function scrollTop() {
  const appEl = $('#app');
  if (appEl && document.body.classList.contains('mobile-frame-mode')) appEl.scrollTo(0, 0);
  window.scrollTo(0, 0);
}
function brand() {return '<span class="brand-symbol">'+icon('flame')+'</span><span class="wordmark">PARAMOUNT<small>S I G N A T U R E</small></span>';}
function navItem(name, text, dest) {return link(icon(name)+'<span>'+text+'</span>',dest,route===dest?'rail-link active':'rail-link');}

function statusBar() {
  const now = new Date();
  const timeStr = String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0');
  return '<div class="mobile-status-bar" aria-hidden="true"><span>' + timeStr + '</span><div class="status-notch"></div><div class="status-icons"><span>5G</span><span>100%</span></div></div>';
}

function liveOrderBanner() {
  const live = activeLiveOrder();
  if (!live || ['tracking', 'branch', 'driver', 'admin'].includes(route)) return '';
  const steps = stepsFor(live);
  return '<div class="live-order-banner"><div class="live-order-left"><span class="live-pulse"></span><span class="live-order-text"><strong>' + esc(live.id) + '</strong>' + esc(steps[live.step]) + ' · ' + esc(branch(live.branch).name) + '</span></div>' + link('Track ' + icon('arrow'), 'tracking', 'live-order-cta') + '</div>';
}

function floatingTrayBar() {
  const qty = quantity();
  if (!qty || ['checkout', 'tracking', 'branch', 'driver', 'admin'].includes(route)) return '';
  return '<a class="floating-tray-bar" href="#checkout" aria-label="View your tray, ' + qty + ' items, total ' + money(total()) + '"><div class="floating-tray-left"><span class="floating-tray-badge">' + qty + '</span><div class="floating-tray-info"><strong>View your tray</strong><small>' + esc(branch().name) + ' · ' + (state.mode === 'delivery' ? 'Delivery' : 'Collection') + '</small></div></div><div class="floating-tray-right"><span>' + money(total()) + '</span>' + icon('arrow') + '</div></a>';
}

function shell() {
  const operational=['branch','driver','admin'].includes(route);
  const b = branch();
  return '<a class="skip-link" href="#main">Skip to content</a>' + statusBar() + '<aside class="rail">'+link('<span class="rail-logo">'+icon('flame')+'</span>','home','rail-brand')+
    '<nav aria-label="Main navigation">'+navItem('home','Home','home')+navItem('menu','Menu','order')+navItem('pin','Places','branches')+navItem('clock','Orders','tracking')+navItem('people','Gather','services')+'</nav><div class="rail-bottom">'+navItem('grid','Studio','admin')+'<span>EST. HARARE</span></div></aside>'+
    '<div class="page"><header class="topbar">'+link(brand(),'home','brand')+'<nav class="topnav" aria-label="Restaurant and bar">'+link('Food & drinks','order',route==='order'?'selected':'')+link('Our places','branches',route==='branches'?'selected':'')+link('Gather with us','services',route==='services'?'selected':'')+'</nav><div class="header-actions">'+
    btn('<i></i>' + icon('pin') + '<span>' + esc(b.name) + ' · ' + (state.mode === 'delivery' ? 'Delivery' : 'Collect') + '</span>', 'quick-context', 'aria-label="Change branch or fulfilment mode"', 'app-header-pill ' + (!b.open ? 'closed' : '')) +
    btn(icon('phone') + '<span>' + (mobileFrameMode ? 'App frame' : 'Full width') + '</span>', 'toggle-frame', 'aria-pressed="' + mobileFrameMode + '" title="Toggle mobile app phone frame on desktop"', 'frame-toggle-btn ' + (mobileFrameMode ? 'active' : '')) +
    '<label class="workspace-label"><span class="sr-only">Preview workspace</span><select id="workspace"><option value="home" '+(!operational?'selected':'')+'>Customer app</option><option value="branch" '+(route==='branch'?'selected':'')+'>Branch ops</option><option value="driver" '+(route==='driver'?'selected':'')+'>Driver app</option><option value="admin" '+(route==='admin'?'selected':'')+'>Admin view</option></select></label>'+link(icon('bag')+'<span class="tray-label">Your tray</span><b class="count">'+quantity()+'</b>','checkout','tray-button')+'</div></header>'+
    liveOrderBanner() +
    '<main id="main" tabindex="-1">'+views[route]()+'</main><footer><div>'+brand()+'</div><span>Four places. The same warm welcome.</span><span>Harare, Zimbabwe</span></footer>'+
    '<div class="demo-strip"><span><i></i> CONCEPT 01 <span class="demo-detail"> / Illustrative menu & prices · Simulated orders and payments</span></span>'+btn('Reset preview','reset','','text-button')+'</div></div>'+
    floatingTrayBar() +
    '<nav class="mobile-nav" aria-label="Mobile navigation">'+navItem('home','Home','home')+navItem('menu','Menu','order')+navItem('pin','Places','branches')+navItem('clock','Orders','tracking')+navItem('bag','Tray'+(quantity()?' ('+quantity()+')':''),'checkout')+'</nav>';
}
function contextBar() {
  return '<div class="order-context"><div class="branch-context">'+icon('pin')+'<div><span class="micro">ORDERING FROM</span><label><span class="sr-only">Ordering branch</span><select id="shop-branch">'+state.branches.map(b=>'<option value="'+b.id+'" '+(b.id===state.branch?'selected':'')+'>'+b.name+' branch</option>').join('')+'</select></label></div><span class="service-status '+(!branch().open?'closed':'')+'"><i></i>'+(branch().open?'Taking orders':'Orders paused')+'</span></div><div class="context-right"><span class="estimate">'+icon('clock')+branch().prep+'–'+(branch().prep+15)+' min</span>'+modes()+'</div></div>';
}
function modes() {return '<div class="segmented" aria-label="Fulfilment">'+['delivery','collection'].map(m=>btn(icon(m==='delivery'?'truck':'bag')+(m==='delivery'?'Delivery':'Collection'),'mode','data-mode="'+m+'" aria-pressed="'+(state.mode===m)+'"',state.mode===m?'active':'')).join('')+'</div>';}
function fireAtmosphere() {
  const flames=Array.from({length:13},(_,i)=>{
    const x=50+i*110, y=300+(i%4)*30, scale=.8+(i%3)*.24;
    return '<g transform="translate('+x+' '+y+') scale('+scale+')"><g class="flame-plume" style="--duration:'+(3+(i%5)*.4)+'s;--delay:-'+(i*.7)+'s"><path d="M0 360C-25 280 40 237 20 181c58 48 15 79 46 113-14-85 53-120 30-204 73 100 6 159 52 224-4-65 42-93 40-138 46 75 15 129 20 184Z" fill="url(#paramount-fire-outer)"/><path d="M36 360c-12-48 30-72 25-113 35 37 12 60 31 81 8-69 42-95 35-139 47 70 12 104 27 142 7-29 18-40 30-51-1 34 11 54 6 80Z" fill="url(#paramount-fire-inner)"/></g></g>';
  }).join('');
  const embers=Array.from({length:16},(_,i)=>'<i style="--x:'+(8+i*5.8)+'%;--duration:'+(7+(i%5))+'s;--delay:-'+(i*1.3)+'s;--drift:'+((i%2?-1:1)*(20+i*3))+'px"></i>').join('');
  return '<div class="paramount-fire" aria-hidden="true"><div class="fire-glow"></div><svg viewBox="0 0 1600 700" preserveAspectRatio="xMidYMax slice"><defs><linearGradient id="paramount-fire-outer" x1="0" y1="1" x2=".2" y2="0"><stop offset="0" stop-color="#8f2f0e" stop-opacity=".1"/><stop offset=".28" stop-color="#d55c18" stop-opacity=".7"/><stop offset=".68" stop-color="#f39737" stop-opacity=".68"/><stop offset="1" stop-color="#f5c06b" stop-opacity=".05"/></linearGradient><linearGradient id="paramount-fire-inner" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#ef7e24" stop-opacity=".35"/><stop offset=".65" stop-color="#ffd486" stop-opacity=".7"/><stop offset="1" stop-color="#ffe3aa" stop-opacity=".08"/></linearGradient></defs>'+flames+'</svg></div><div class="hero-shade"></div><div class="ember-atmosphere" aria-hidden="true">'+embers+'</div>';
}
function atmosphereControl() {
  return '<div class="hero-bottom"><span>RESTAURANT & BAR / HARARE</span><span>FIRE. FLAVOUR. GOOD COMPANY.</span>'+btn(motionPreference.matches?'Reduced motion':atmospherePaused?'Play atmosphere':'Pause atmosphere','hero-motion','aria-pressed="'+atmospherePaused+'" '+(motionPreference.matches?'disabled':''),'motion-control')+'</div>';
}
function syncAtmosphere() {
  const hero=$('.hero');if(!hero)return;
  hero.classList.toggle('motion-paused',atmospherePaused||motionPreference.matches);
  const control=$('.motion-control');
  if(control){control.textContent=motionPreference.matches?'Reduced motion':atmospherePaused?'Play atmosphere':'Pause atmosphere';control.setAttribute('aria-pressed',String(atmospherePaused||motionPreference.matches));control.disabled=motionPreference.matches;}
}
motionPreference.addEventListener('change',()=>{if(motionPreference.matches)atmospherePaused=true;syncAtmosphere();});

function home() {
  return '<section class="hero '+(atmospherePaused?'motion-paused':'')+'">'+fireAtmosphere()+'<div class="hero-grain"></div><div class="hero-copy"><span class="eyebrow"><i></i> FIRE. FLAVOUR. GOOD COMPANY.</span><h1>A little fire.<br><em>A lot of flavour.</em></h1><p>Sadza & mazondo. Flame-grilled favourites.<br>Lagers, cocktails and something worth sipping.</p><div class="hero-actions">'+link('Order now '+icon('arrow'),'order','button gold')+link('Find your place '+icon('pin'),'branches','hero-link')+'</div><div class="hero-note"><span>FROM OUR KITCHEN. FROM OUR BAR.</span><span>Always good company.</span></div></div>'+
    '<div class="hero-art"><span class="hero-arc arc-one"></span><span class="hero-arc arc-two"></span><div class="round-seal">KITCHEN & BAR<br><b>Made<br>for you.</b><span>PARAMOUNT SIGNATURE</span></div><div class="hero-plate"></div><div class="hero-food hero-food-illustration">'+menuVisual(product('full'))+'</div><div class="hero-bar-art">'+menuVisual(product('signature-sunset'))+'</div><div class="hero-food-label"><span>FROM THE FIRE TO YOUR FIRST SIP</span><strong>Your table. Your round.</strong><small>Local flavours and a well-stocked bar concept.</small></div><span class="hero-vertical">PARAMOUNT SIGNATURE / RESTAURANT & BAR</span></div>'+atmosphereControl()+'</section>'+
    contextBar()+'<div class="content-pad"><div class="menu-entry-grid">'+btn('<span class="eyebrow">FROM OUR KITCHEN</span><strong>Kitchen menu</strong><span>Sadza, grill & sides '+icon('arrow')+'</span>','menu-section','data-section="food"','menu-entry')+btn('<span class="eyebrow">FROM OUR BAR</span><strong>Bar & pours</strong><span>Lagers, spirits & cocktails '+icon('arrow')+'</span>','menu-section','data-section="drinks"','menu-entry bar-entry')+'</div>'+
    '<div class="section-heading"><div><span class="eyebrow">A PLACE FOR EVERY APPETITE</span><h2>Explore categories</h2></div>'+link('Full menu '+icon('arrow'),'order','text-link')+'</div>'+categoryStrip()+
    '<div class="section-heading favourite-heading"><div><span class="eyebrow">LOCAL FLAVOUR. SIGNATURE FIRE.</span><h2>From our kitchen<span class="heading-dot">.</span></h2></div>'+btn('All food '+icon('arrow'),'menu-section','data-section="food"','text-button text-link')+'</div><div class="product-grid home-grid">'+['mazondo','chicken','burger','fries'].map(product).filter(Boolean).map(card).join('')+'</div>'+
    '<div class="section-heading favourite-heading"><div><span class="eyebrow">A ROUND FOR GOOD COMPANY</span><h2>From our bar<span class="heading-dot">.</span></h2></div>'+btn('All drinks '+icon('arrow'),'menu-section','data-section="drinks"','text-button text-link')+'</div><div class="product-grid home-grid">'+['zambezi','jameson','signature-sunset','coffee'].map(product).filter(Boolean).map(card).join('')+'</div>'+
    '<p class="menu-disclaimer">Proposed Signature menu. All USD prices, brands, serving sizes and availability are illustrative until confirmed.</p>'+
    '<section class="gather-banner"><div class="gather-monogram">'+icon('people')+'</div><div><span class="eyebrow">PULL UP A CHAIR. RAISE A GLASS.</span><h2>Good moments deserve good company.</h2><p>Lunch with the family. Drinks with friends. Your kind of evening.</p></div>'+link('Plan a gathering '+icon('arrow'),'services','button outline')+'</section></div>';
}
function sectionTabs() {return '<div class="menu-section-tabs" aria-label="Menu sections">'+menuSections.map(g=>btn('<strong>'+g.name+'</strong><small>'+g.note+'</small><span>'+products.filter(p=>g.id==='all'||p.section===g.id).length+'</span>','menu-section','data-section="'+g.id+'" aria-pressed="'+(menuSection===g.id)+'"','section-tab '+(menuSection===g.id?'active':''))).join('')+'</div>';}

function categoryStrip() {
  const visible=categories.filter(c=>route==='home'||menuSection==='all'||c.section===menuSection);
  return '<div class="category-strip signature-categories" aria-label="Menu categories">'+(route==='home'?'':btn('<span class="all-menu-symbol">'+icon('grid')+'</span><span>All '+(menuSection==='food'?'food':menuSection==='drinks'?'drinks':'items')+'</span>','category','data-category="All menu" aria-pressed="'+(category==='All menu')+'"','category '+(category==='All menu'?'active':'')))+visible.map(c=>btn(menuVisual({...c,name:c.name},true)+'<span>'+esc(c.name)+'</span>','category','data-category="'+esc(c.name)+'" data-section="'+c.section+'" aria-pressed="'+(category===c.name)+'"','category '+(category===c.name?'active':''))).join('')+'</div>';
}

function card(p) {
  const available=canOrder(p);
  const inCart = itemQtyInCart(p.id);
  return '<article class="food-card '+(p.alcohol?'bar-card ':'')+(!available?'unavailable':'')+'"><button class="food-picture" data-action="product" data-id="'+p.id+'" aria-label="View '+esc(p.name)+'"><span class="food-tag">'+esc(p.tag||p.category.toUpperCase())+'</span>'+menuVisual(p)+(p.alcohol?'<span class="alcohol-label">ALCOHOL</span>':'')+'</button><div class="food-content"><h3>'+esc(p.name)+'</h3><p>'+esc(p.description)+'</p><div class="food-bottom"><div><small>'+(available?'DEMO PRICE':'UNAVAILABLE HERE')+'</small><strong>'+money(price(p))+'</strong><span class="serving-unit">'+esc(p.unit)+'</span></div><div class="card-actions">'+(inCart ? '<span class="in-tray-pill">'+inCart+' in tray</span>' : '')+btn(available?'+':icon('pin'),available?'product':'alternatives','data-id="'+p.id+'" aria-label="'+(available?'Customize '+esc(p.name):'Find '+esc(p.name)+' at another branch')+'"','add-button')+'</div></div></div></article>';
}
function matchingProducts() {
  const term=query.trim().toLowerCase();
  return products.filter(p=>(menuSection==='all'||p.section===menuSection)&&(category==='All menu'||p.category===category)&&(!term||(p.name+' '+p.description+' '+p.category+' '+p.section).toLowerCase().includes(term)));
}

function menuGrid() {
  const items=matchingProducts();
  if(!items.length)return '<div class="empty search-empty"><h2>No matches on this menu.</h2><p>Try sadza, lager, whisky, cocktails or coffee, or change your section.</p>'+btn('Clear search & filters','clear-search')+'</div>';
  return categories.map(c=>{const selected=items.filter(p=>p.category===c.name);return selected.length?'<section class="menu-category-section"><div class="category-heading"><div><span class="eyebrow">'+(c.section==='food'?'FROM THE KITCHEN':'FROM THE BAR')+'</span><h2>'+esc(c.name)+'</h2></div><span>'+selected.length+' '+(selected.length===1?'item':'items')+'</span></div><div class="product-grid catalogue-grid">'+selected.map(card).join('')+'</div></section>':'';}).join('');
}

function order() {
  return '<div class="content-pad menu-page">'+title('SIGNATURE / FOOD, DRINKS & GOOD COMPANY','Your plate. Your pour.','Local dishes and grill favourites meet a full bar, cold drinks and coffee.')+contextBar()+sectionTabs()+categoryStrip()+
    '<p class="menu-disclaimer">Proposed menu · USD demo prices · Brands, serving sizes and stock require confirmation.</p><div class="catalogue-layout"><section><div class="menu-tools"><div><h2>'+esc(category==='All menu'?menuSections.find(g=>g.id===menuSection).name:category)+'</h2><p id="menu-summary" class="muted small" aria-live="polite">'+matchingProducts().length+' items to explore</p></div><label class="search">'+icon('search')+'<input id="search" type="search" value="'+esc(query)+'" placeholder="Search food, drinks or brands" aria-label="Search menu"></label></div><div id="menu-grid" class="menu-results">'+menuGrid()+'</div></section><aside class="tray-panel">'+tray()+'</aside></div></div>';
}

function cartLines() {
  return state.cart.map((l,i)=>'<div class="cart-line"><div class="cart-art">'+menuVisual(product(l.id)||{name:l.name,art:'local'},true)+'</div><div><h3>'+esc(l.name)+'</h3><p>'+esc(l.options.join(' · ')||product(l.id)?.unit||'Standard serving')+'</p><div class="quantity">'+btn('-','qty','data-index="'+i+'" data-delta="-1" aria-label="Remove one '+esc(l.name)+'"','')+'<span>'+l.qty+'</span>'+btn('+','qty','data-index="'+i+'" data-delta="1" aria-label="Add one '+esc(l.name)+'"','')+'</div></div><strong>'+money(l.unit*l.qty)+'</strong></div>').join('');
}

function totals() {return '<div class="totals"><div><span>Subtotal</span><span>'+money(subtotal())+'</span></div><div><span>'+(state.mode==='delivery'?'Delivery':'Branch collection')+'</span><span>'+(delivery()?money(delivery()):'Free')+'</span></div><div class="grand-total"><strong>Total <small>USD</small></strong><strong>'+money(total())+'</strong></div></div>';}
function tray() {return '<div class="tray-heading"><h2>Your serving tray</h2><span class="count">'+quantity()+'</span></div><p class="muted small">'+branch().name+' branch · '+(state.mode==='delivery'?'Delivery':'Collection')+'</p>'+(state.cart.length?cartLines()+totals()+link('Review your order '+icon('arrow'),'checkout','button full'):'<div class="tray-empty">'+icon('bag')+'<h3>A plate, a pour, or both.</h3><p>Add food and drinks to one tray.<br>We’ll keep them right here.</p></div>')+'<div class="tray-foot">'+icon('flame')+' From your local kitchen & bar.</div>';}
function checkout() {
  if(!state.cart.length) return '<div class="content-pad">'+title('YOUR SERVING TRAY','Make it a good meal.')+empty('Your tray is waiting.','Explore local food, grill favourites or a drink from the bar.')+'</div>';
  return '<div class="content-pad">'+title('THE FINAL DETAILS','Good food is almost yours.','One branch. One freshly prepared order.')+'<div class="checkout-layout"><section class="paper"><div class="tray-heading"><h2>Your order</h2>'+link('Add more','order','text-link')+'</div><p class="muted">'+branch().name+' branch</p>'+cartLines()+totals()+'</section><section class="paper"><h2>How shall we serve you?</h2>'+modes()+
    '<form id="checkout-form" class="form"><label>Your name<input name="name" required maxlength="60" autocomplete="off" placeholder="e.g. Tariro Moyo"></label>'+
    (state.mode==='delivery'?'<label>Delivery area<select name="zone"><option value="'+branch().id+'">'+branch().name+' delivery area</option><option value="outside">Outside this branch’s delivery area</option></select></label><label>Address & landmark<textarea name="address" required maxlength="240" placeholder="Street address, gate colour or landmark"></textarea></label>':'<div class="callout">'+icon('pin')+'<span>Collect from <b>'+branch().name+'</b><br>Estimated preparation: '+branch().prep+'–'+(branch().prep+10)+' minutes.</span></div>')+
    '<label>Payment preview<select name="payment"><option value="paid">Simulate instant mobile / card payment</option><option value="cash">Pay cash on '+(state.mode==='delivery'?'delivery':'collection')+'</option><option value="declined">Simulate declined payment</option></select></label><p class="form-note">This is an interactive concept. No payment is taken and no order is sent to a restaurant.</p><p id="checkout-error" class="form-error" role="alert"></p><button class="button gold full" type="submit">Place demo order · '+money(total())+icon('arrow')+'</button></form></section></div></div>';
}
function branches() {return '<div class="content-pad">'+title('FOUR PLACES. ONE WARM WELCOME.','Find your Paramount.','Choose your local branch to see its menu, prices and availability.')+'<div class="branch-grid">'+state.branches.map((b,i)=>'<article class="branch-card"><div class="branch-art"><span class="branch-number">0'+(i+1)+'</span>'+icon('pin')+'<span>PARAMOUNT / '+b.name.toUpperCase()+'</span></div><div class="branch-body"><div class="row"><span class="service-status '+(!b.open?'closed':'')+'"><i></i>'+(b.open?'Taking orders':'Orders paused')+'</span><span class="small">'+b.prep+'–'+(b.prep+15)+' min</span></div><h2>'+b.name+'</h2><p>'+b.area+'</p><div class="branch-facts"><span>Delivery from <b>'+money(b.fee)+'</b></span><span>Collection <b>Available</b></span></div>'+btn((b.id===state.branch?'Selected · ':'Choose ')+b.name+icon('arrow'),'branch','data-id="'+b.id+'"',b.id===state.branch?'button full gold':'button full outline')+'</div></article>').join('')+'</div><p class="form-note">Branch service, delivery areas, timings and prices are illustrative for this concept.</p></div>';}

function tracking() {
  const o=state.orders.find(o=>o.id===state.activeOrder)||state.orders[0];
  if(!o)return '<div class="content-pad">'+title('FROM OUR KITCHEN TO YOU','Something good is on the way.')+empty('No orders just yet.','Place a demo order to follow its live journey.')+'</div>';
  const steps=stepsFor(o);
  const done = o.step === steps.length - 1;
  return '<div class="content-pad">'+title('YOUR ORDER / '+esc(o.id),done?'Good food. Enjoy every bite.':'We’ll take it from here.','Prepared by Paramount Signature '+branch(o.branch).name+'.')+'<div class="tracking-layout"><section class="paper"><div class="row"><h2>'+steps[o.step]+'</h2><span class="pill">'+(o.mode==='delivery'?'Delivery':'Collection')+'</span></div><div class="timeline">'+steps.map((text,i)=>'<div class="timeline-step '+(i<=o.step?'reached':'')+'" '+(i===o.step?'aria-current="step"':'')+'><span>'+(i<o.step?icon('check'):i+1)+'</span><div><h3>'+text+'</h3><p>'+(i===o.step?'Current stage':i<o.step?'Completed':'Coming up')+'</p></div></div>').join('')+'</div><div class="callout">'+icon('clock')+'<span>'+(done?'Order complete. Thank you for dining with Paramount Signature.':'Illustrative estimate: '+o.estimate+' minutes from confirmation.')+'</span></div><div class="simulation-tools"><span class="micro">LIVE DEMO CONTROLS</span>'+(!done ? btn('Simulate next step ' + icon('arrow'), 'simulate-step', 'data-id="' + o.id + '"', 'button outline') : '')+link('Branch workspace '+icon('arrow'),'branch','text-link')+(o.mode==='delivery'?link('Driver workspace '+icon('arrow'),'driver','text-link'):'')+'</div></section>'+
    '<aside class="paper ticket"><span class="eyebrow">PARAMOUNT SIGNATURE</span><h2>Your '+(o.mode==='collection'?'collection ticket':'order receipt')+'</h2><div class="ticket-code">'+esc(o.code)+'</div><p>'+esc(o.name)+' · '+esc(o.id)+'</p><div class="ticket-divider"></div>'+o.lines.map(l=>'<div class="receipt-line"><span>'+l.qty+' × '+esc(l.name)+'<small class="receipt-options">'+esc(l.options.join(' · '))+'</small></span><b>'+money(l.unit*l.qty)+'</b></div>').join('')+'<div class="receipt-line"><span>'+(o.mode==='delivery'?'Delivery':'Collection')+'</span><b>'+money(o.fee)+'</b></div><div class="receipt-line grand-total"><b>Total USD</b><b>'+money(o.total)+'</b></div><span class="pill">'+(o.payment==='paid'?'Demo payment successful':o.payment==='cash_received'?'Demo cash received':'Cash due at handover')+'</span><p class="muted small">'+(o.mode==='collection'?'Show this reference when collecting. It is a demo ticket, not a real collection authorization.':'Delivery address: '+esc(o.address))+'</p></aside></div>'+
    (state.orders.length>1?'<section class="paper order-history"><h2>Your recent orders</h2>'+state.orders.map(x=>btn('<span><b>'+esc(x.id)+'</b> · '+branch(x.branch).name+' · '+stepsFor(x)[x.step]+'</span><b>'+money(x.total)+'</b>','view-order','data-id="'+x.id+'"','history-row')).join('')+'</section>':'')+'</div>';
}
function services() {return '<div class="content-pad">'+title('MAKE ROOM FOR A GOOD TIME','Some moments deserve a gathering.','Team lunches, birthdays, private dinners. Tell us what you have in mind.')+'<div class="checkout-layout"><section class="gather-story"><span class="eyebrow">THE PARAMOUNT WAY</span><h2>A table of favourites.<br><em>Your favourite people.</em></h2><div class="gather-illustration">'+menuVisual(product('full'))+'</div><p>Good food. Warm company.<br>Time that’s yours to enjoy.</p></section><section class="paper"><h2>Plan your occasion</h2><form id="enquiry-form" class="form"><label>Your name<input name="name" required maxlength="60" placeholder="Your full name"></label><label>Occasion<select name="occasion"><option>Birthday gathering</option><option>Team lunch</option><option>Private dinner</option></select></label><label>Preferred branch<select name="branch">'+state.branches.map(b=>'<option>'+b.name+'</option>').join('')+'</select></label><div class="form-two"><label>Preferred date<input type="date" name="date" min="'+new Date().toLocaleDateString('en-CA')+'" required></label><label>Guests<input type="number" name="guests" min="2" max="100" value="8" required></label></div><label>A little more about it<textarea name="notes" maxlength="500" placeholder="Preferred time, drinks or platter notes"></textarea></label><p class="form-note">Saved in this browser only. This does not send an enquiry or confirm a booking.</p><button class="button full">Save demo enquiry '+icon('arrow')+'</button></form></section></div>'+(state.enquiries.length?'<section class="paper order-history"><h2>Your occasions</h2>'+state.enquiries.map(e=>'<div class="history-row"><span>'+esc(e.occasion)+' · '+esc(e.branch)+' · '+esc(e.date)+' · '+esc(e.guests)+' guests</span><span class="pill">Enquiry saved</span></div>').join('')+'</section>':'')+'</div>';}
function operationalCards(orders,workspace) {
  if(!orders.length)return '<div class="empty"><h2>The pass is clear.</h2><p>Place a customer order to see it appear here.</p>'+link('Open the menu','order','button')+'</div>';
  return orders.map(o=>{
    const steps=stepsFor(o), done=o.step===steps.length-1;
    let action='';
    if(!done) {
      if(workspace==='driver' && o.step>=3) action=btn(o.step===3?'Confirm pickup':'Complete delivery','advance-order','data-id="'+o.id+'"','button full');
      if(workspace==='branch' && (o.step<3 || o.mode==='collection')) action=btn(['Accept order','Start preparation','Mark ready','Confirm collection'][o.step],'advance-order','data-id="'+o.id+'"','button full');
    }
    return '<article class="paper ops-order"><div class="row"><span class="eyebrow">'+esc(o.id)+'</span><span class="pill">'+steps[o.step]+'</span></div><h2>'+esc(o.name)+'</h2><p class="muted">'+branch(o.branch).name+' · '+o.mode+'</p>'+o.lines.map(l=>'<p class="ops-item"><b>'+l.qty+' × '+esc(l.name)+'</b><small>'+esc(l.options.join(' · '))+'</small></p>').join('')+'<div class="receipt-line"><span>'+ (o.payment==='paid'?'Demo paid':o.payment==='cash_received'?'Demo cash received':'Cash to collect')+'</span><b>'+money(o.total)+'</b></div>'+(workspace==='driver'?'<p class="driver-address">'+icon('pin')+esc(o.address)+'</p>':'')+action+(!done&&!action?'<p class="form-note">'+(workspace==='admin'?'Open the branch or driver workspace to continue.':'Ready for the driver workspace.')+'</p>':'')+'</article>';
  }).join('');
}
function operations() {
  const kind=route, active=state.orders.filter(o=>o.step<stepsFor(o).length-1), completed=state.orders.length-active.length;
  const headings={branch:['BRANCH OPERATIONS','Every order. A clear next step.'],driver:['DRIVER WORKSPACE','From the pass to the doorstep.'],admin:['SERVICE OVERVIEW','The whole service, in view.']};
  let content='';
  if(kind==='admin') content='<div class="metrics">'+[['Orders',state.orders.length],['In progress',active.length],['Completed',completed],['Demo order value',money(state.orders.reduce((n,o)=>n+o.total,0))]].map(([a,b])=>'<div class="paper metric"><span>'+a+'</span><strong>'+b+'</strong></div>').join('')+'</div><section class="paper"><div class="section-heading"><div><h2>Four branches. One service.</h2><p class="muted">Service changes are reflected in the customer menu.</p></div></div><div class="admin-branches">'+state.branches.map(b=>'<div class="admin-branch"><div><h3>'+b.name+'</h3><p>'+b.prep+' min preparation · '+money(b.fee)+' delivery</p></div><span class="service-status '+(!b.open?'closed':'')+'"><i></i>'+(b.open?'Taking orders':'Orders paused')+'</span>'+btn(b.open?'Pause orders':'Resume orders','toggle-branch','data-id="'+b.id+'"','button outline')+'</div>').join('')+'</div></section><div class="section-heading"><h2>Latest orders</h2>'+link('Branch workspace '+icon('arrow'),'branch','text-link')+'</div><div class="ops-grid">'+operationalCards(state.orders.slice(0,8),'admin')+'</div>';
  else if(kind==='branch') content='<div class="workspace-controls"><label>Operating branch<select id="ops-branch">'+state.branches.map(b=>'<option value="'+b.id+'" '+(b.id===state.branch?'selected':'')+'>'+b.name+'</option>').join('')+'</select></label><span class="muted">Accept → Prepare → Ready → Handover</span></div><div class="ops-grid">'+operationalCards(state.orders.filter(o=>o.branch===state.branch),kind)+'</div><section class="paper order-history"><h2>Menu availability · '+branch().name+'</h2><p class="muted">Change what your branch can serve.</p><div class="availability-grid">'+products.map(p=>btn(esc(p.name)+'<span class="pill">'+(branch().sold.includes(p.id)?'Sold out':'Available')+'</span>','toggle-product','data-id="'+p.id+'" aria-pressed="'+(!branch().sold.includes(p.id))+'"','availability-item')).join('')+'</div></section>';
  else content='<div class="callout">'+icon('truck')+'<span>Demo driver: Tariro M. · Delivery orders appear when the kitchen marks them ready.</span></div><div class="ops-grid">'+operationalCards(state.orders.filter(o=>o.mode==='delivery'&&o.step>=3),kind)+'</div>';
  return '<div class="content-pad">'+title(headings[kind][0],headings[kind][1],'Workspace preview · All data is stored in this browser; role switching is not authentication.')+content+'</div>';
}
const views={home,order,checkout,branches,tracking,services,branch:operations,driver:operations,admin:operations};
function render() {
  if(!views[route])route='home';
  syncViewportClasses();
  document.title='Paramount Signature · '+({home:'Restaurant & bar',order:'Order online',checkout:'Your tray',tracking:'Your order',branches:'Our places',services:'Gather with us',branch:'Branch workspace',driver:'Driver workspace',admin:'Service overview'}[route]);
  $('#app').innerHTML=shell();
  $('#workspace').onchange=e=>go(e.target.value);
  if($('#shop-branch'))$('#shop-branch').onchange=e=>switchBranch(e.target.value);
  if($('#ops-branch'))$('#ops-branch').onchange=e=>switchBranch(e.target.value,false);
  if($('#search'))$('#search').oninput=e=>{query=e.target.value;$('#menu-grid').innerHTML=menuGrid();$('#menu-summary').textContent=matchingProducts().length+' items to explore';};
  if($('#checkout-form'))$('#checkout-form').onsubmit=submitOrder;
  if($('#enquiry-form'))$('#enquiry-form').onsubmit=e=>{e.preventDefault();state.enquiries.unshift(Object.fromEntries(new FormData(e.target)));save();render();notify('Demo enquiry saved. No message was sent.');};
}
function showDialog(content, cls='') {
  lastFocus=document.activeElement;
  const dlg = $('#dialog');
  dlg.className=cls;
  dlg.style.transform = '';
  dlg.innerHTML='<div class="sheet-handle-bar" data-sheet-drag><span class="sheet-handle-pill"></span></div>'+btn(icon('close'),'close','aria-label="Close dialog"','dialog-close')+content;
  if(!dlg.open)dlg.showModal();
  document.body.classList.add('modal-open');
}
function closeDialog() {
  const dlg = $('#dialog');
  dlg.style.transform = '';
  dlg.close();
}

function quickContextDialog() {
  showDialog(
    '<div class="dialog-body"><span class="eyebrow">ORDER SETTINGS</span><h2 id="dialog-title">How would you like your order?</h2><p>Choose delivery or branch collection, or switch your local Paramount Signature branch.</p>' +
    modes() +
    '<div style="margin-top:18px"><span class="micro">SELECT YOUR BRANCH</span>' +
    state.branches.map(b => btn(
      '<span><b>' + esc(b.name) + '</b> · <small>' + (b.open ? b.prep + '–' + (b.prep + 15) + ' min' : 'Paused') + '</small></span><span>' + (b.id === state.branch ? 'Active' : money(b.fee) + ' del.') + '</span>',
      'branch',
      'data-id="' + b.id + '"',
      'button full ' + (b.id === state.branch ? 'gold' : 'outline') + ' branch-choice'
    )).join('') +
    '</div></div>'
  );
}

function productDialog(id) {
  const p=product(id);if(!p)return;
  const choices=(name,items)=>'<div class="option-row">'+items.map((x,i)=>'<label class="choice"><input type="radio" name="'+name+'" value="'+i+'" '+(!i?'checked':'')+'><span>'+esc(x.label)+(x.price!==undefined?'<small>'+money(x.price+branch().delta)+'</small>':x.extra?'<small>+'+money(x.extra)+'</small>':'<small>Included</small>')+'</span></label>').join('')+'</div>';
  const servings=p.servings?'<fieldset><legend>Choose your serving</legend>'+choices('serving',p.servings)+'</fieldset>':'<div class="serving-note">'+esc(p.unit)+(p.alcohol?' · Contains alcohol':'')+'</div>';
  const sides=p.sides?'<fieldset><legend>Choose your starch</legend>'+choices('side',p.sides)+'</fieldset>':'';
  const heat=p.meal?'<fieldset><legend>Choose your heat</legend><div class="option-row">'+['Mild','Medium','Hot'].map((x,i)=>'<label class="choice"><input type="radio" name="heat" value="'+x+'" '+(!i?'checked':'')+'><span>'+x+'</span></label>').join('')+'</div></fieldset>':'';
  const addons=p.meal?'<fieldset><legend>Make it your meal</legend><label class="addon"><span><b>Add golden chips</b><small>A little something on the side</small></span><b>+$1.50</b><input name="chips" type="checkbox"></label><label class="addon"><span><b>Add a cold cola</b><small>330 ml can · alcohol-free</small></span><b>+$2.00</b><input name="drink" type="checkbox"></label></fieldset>':'';
  const ice=p.alcohol&&p.servings&&p.category!=='Wine & bubbles'?'<label class="pour-style">How would you like it?<select name="style"><option>Neat</option><option>Over ice</option></select></label><p class="form-note">Mixers are ordered separately under Soft drinks & juices.</p>':'';
  showDialog('<div class="detail-photo '+(p.alcohol?'bar-detail':'')+'">'+menuVisual(p)+'<span class="eyebrow">'+esc(p.tag||p.category)+'</span></div><form id="product-form" class="detail-content"><span class="eyebrow">'+esc(p.category)+(p.alcohol?' · ALCOHOL':'')+'</span><h2 id="dialog-title">'+esc(p.name)+'</h2><p class="muted">'+esc(p.description)+'</p>'+servings+sides+heat+addons+ice+'<div class="detail-footer"><div class="detail-stepper" aria-label="Quantity"><button type="button" data-step="-1" aria-label="Decrease quantity">−</button><span id="detail-qty-display">1</span><button type="button" data-step="1" aria-label="Increase quantity">+</button><input type="hidden" name="qty" id="detail-qty-input" value="1"></div><button type="submit" class="button gold" '+(!canOrder(p)?'disabled':'')+' id="add-to-tray">'+(canOrder(p)?'Add to tray · '+money(price(p)):'Unavailable at this branch')+'</button></div><p class="form-note menu-price-note">Illustrative menu and prices for this preview.</p></form>','product-dialog');
  const form=$('#product-form');
  function configuration(){
    const f=new FormData(form), serving=p.servings?.[Number(f.get('serving')||0)], side=p.sides?.[Number(f.get('side')||0)];
    const unit=(serving?serving.price:p.price)+branch().delta+(side?.extra||0)+(f.has('chips')?150:0)+(f.has('drink')?200:0);
    const options=[serving?.label||p.unit,side?side.label:null,f.get('heat'),f.has('chips')?'Golden chips':null,f.has('drink')?'Cola · 330 ml':null,f.get('style')].filter(Boolean);
    return {unit,options,qty:Number(f.get('qty')||1)};
  }
  function updatePriceCTA() {
    const c=configuration();
    $('#add-to-tray').textContent=canOrder(p)?'Add to tray · '+money(c.unit*Math.max(1,Math.min(20,c.qty||1))):'Unavailable at this branch';
  }
  form.querySelectorAll('[data-step]').forEach(b => {
    b.onclick = () => {
      const inp = $('#detail-qty-input');
      const next = Math.max(1, Math.min(20, Number(inp.value || 1) + Number(b.dataset.step)));
      inp.value = String(next);
      $('#detail-qty-display').textContent = String(next);
      updatePriceCTA();
    };
  });
  form.oninput=updatePriceCTA;
  form.onsubmit=e=>{
    e.preventDefault();if(!canOrder(p)){notify('This item is no longer available at your branch.');return;}
    const {unit,options,qty}=configuration();
    if(!Number.isInteger(qty)||qty<1||qty>20)return;
    const key=p.id+'|'+options.join('|'), found=state.cart.find(l=>l.key===key);
    if(found&&found.qty+qty>20){notify('Maximum 20 of each configuration per demo order.');return;}
    if(found)found.qty+=qty;else state.cart.push({key,id:p.id,name:p.name,options,unit,qty,station:p.station,alcohol:Boolean(p.alcohol)});
    save();closeDialog();render();notify('Added ' + qty + ' × ' + p.name + ' to tray');
  };
}

function switchBranch(id, navigate=true) {
  if(!branch(id))return;
  if(id===state.branch){if($('#dialog').open)closeDialog();if(navigate)go('order');return;}
  if(state.cart.length){
    showDialog('<div class="dialog-body"><span class="eyebrow">ONE BRANCH PER TRAY</span><h2 id="dialog-title">A fresh start at '+branch(id).name+'?</h2><p>Your tray belongs to '+branch().name+'. Switching clears it because prices and availability differ by branch.</p><div class="dialog-actions">'+btn('Keep my current branch','close','','button outline')+btn('Clear tray & switch','confirm-branch','data-id="'+id+'" data-navigate="'+navigate+'"')+'</div></div>');
    if($('#shop-branch'))$('#shop-branch').value=state.branch;
    if($('#ops-branch'))$('#ops-branch').value=state.branch;
  }else{state.branch=id;save();if($('#dialog').open)closeDialog();if(navigate)go('order');else render();notify('Switched to ' + branch(id).name + ' branch');}
}
function submitOrder(e) {
  e.preventDefault();const f=new FormData(e.target), error=$('#checkout-error');
  if(!state.cart.length){error.textContent='Your tray is empty.';return;}
  if(!branch().open||state.cart.some(l=>!canOrder(product(l.id)))){error.textContent='Your branch is paused or an item is sold out. Please review the menu before ordering.';return;}
  if(f.get('zone')==='outside'){error.textContent='This address is outside the demo delivery area. Choose collection or a supported area.';return;}
  if(f.get('payment')==='declined'){error.textContent='Demo payment declined. Your tray is safe. Choose another payment preview to try again.';return;}
  if(!String(f.get('name')).trim()||(state.mode==='delivery'&&!String(f.get('address')).trim())){error.textContent='Please enter a name and delivery address.';return;}
  const sequence=state.orders.length+1, id='PS-'+String(sequence).padStart(4,'0');
  state.orders.unshift({id,code:String(4100+sequence),branch:state.branch,name:String(f.get('name')).trim(),address:String(f.get('address')||'Branch collection'),mode:state.mode,payment:f.get('payment'),lines:structuredClone(state.cart),fee:delivery(),total:total(),estimate:branch().prep+(state.mode==='delivery'?15:0),step:0,created:Date.now()});
  state.activeOrder=id;state.cart=[];save();go('tracking');notify('Order ' + id + ' placed! Live tracking started.');
}
function handleAction(el) {
  const {action,id}=el.dataset;
  if(action==='toggle-frame'){
    mobileFrameMode = !mobileFrameMode;
    try { sessionStorage.setItem('paramount-mobile-frame', String(mobileFrameMode)); } catch {}
    render();
    notify(mobileFrameMode ? 'Switched to Mobile App Frame view' : 'Switched to Full-Width view');
    return;
  }
  if(action==='quick-context'){quickContextDialog();return;}
  if(action==='hero-motion'){if(motionPreference.matches)return;atmospherePaused=!atmospherePaused;try{sessionStorage.setItem('paramount-concept-atmosphere-paused',String(atmospherePaused));}catch{}syncAtmosphere();return;}
  if(action==='close')return closeDialog();
  if(action==='product')return productDialog(id);
  if(action==='menu-section'){menuSection=el.dataset.section;category='All menu';query='';if(route!=='order')go('order');else render();return;}
  if(action==='category'){category=el.dataset.category;if(el.dataset.section)menuSection=el.dataset.section;query='';if(route!=='order')go('order');else render();return;}
  if(action==='clear-search'){query='';category='All menu';menuSection='all';render();return;}
  if(action==='mode'){state.mode=el.dataset.mode;save();if($('#dialog').open)quickContextDialog();render();return;}
  if(action==='qty'){
    const l=state.cart[Number(el.dataset.index)];if(!l)return;
    if(Number(el.dataset.delta)>0&&!canOrder(product(l.id))){notify('This item is unavailable. You can still remove it from your tray.');return;}
    l.qty=Math.min(20,l.qty+Number(el.dataset.delta));state.cart=state.cart.filter(x=>x.qty>0);save();render();return;
  }
  if(action==='branch')return switchBranch(id);
  if(action==='confirm-branch'){state.cart=[];state.branch=id;save();closeDialog();if(el.dataset.navigate==='true')go('order');else render();notify('Switched to ' + branch(id).name + ' branch');return;}
  if(action==='alternatives'){
    const p=product(id), choices=state.branches.filter(b=>b.open&&!b.sold.includes(id));
    showDialog('<div class="dialog-body"><span class="eyebrow">FIND YOUR FAVOURITE</span><h2 id="dialog-title">'+p.name+'</h2><p>Available at these demo branches. Each branch has its own menu prices.</p>'+choices.map(b=>btn(b.name+' · '+money(p.price+b.delta)+icon('arrow'),'branch','data-id="'+b.id+'"','button full outline branch-choice')).join('')+(!choices.length?'<p>Currently unavailable at every branch. Please choose another meal.</p>':'')+'</div>');return;
  }
  if(action==='view-order'){state.activeOrder=id;save();render();scrollTop();return;}
  if(action==='simulate-step'){
    const o=state.orders.find(o=>o.id===id);if(!o)return;
    const maxStep = stepsFor(o).length - 1;
    if(o.step < maxStep){
      o.step++;
      if(o.step===maxStep&&o.payment==='cash')o.payment='cash_received';
      save();render();notify(stepsFor(o)[o.step]);
    }
    return;
  }
  if(action==='advance-order'){
    const o=state.orders.find(o=>o.id===id);if(!o)return;
    const allowed=route==='branch'&&(o.step<3||(o.mode==='collection'&&o.step===3))||route==='driver'&&o.mode==='delivery'&&o.step>=3&&o.step<5;
    if(allowed){o.step++;if(o.step===stepsFor(o).length-1&&o.payment==='cash')o.payment='cash_received';save();render();notify(stepsFor(o)[o.step]+'. Customer tracking updated.');}return;
  }
  if(action==='toggle-branch'){branch(id).open=!branch(id).open;save();render();return;}
  if(action==='toggle-product'){const b=branch();b.sold=b.sold.includes(id)?b.sold.filter(x=>x!==id):[...b.sold,id];save();render();return;}
  if(action==='reset'){showDialog('<div class="dialog-body"><span class="eyebrow">CONCEPT 01</span><h2 id="dialog-title">Start fresh?</h2><p>This clears only this concept’s demo tray, orders, enquiries and service changes.</p><div class="dialog-actions">'+btn('Keep exploring','close','','button outline')+btn('Reset this preview','confirm-reset')+'</div></div>');return;}
  if(action==='confirm-reset'){state=initial();category='All menu';menuSection='all';query='';save();closeDialog();go('home');notify('Preview reset.');}
}
const mount = document.createElement('div');
mount.innerHTML='<div id="app"></div><dialog id="dialog" aria-labelledby="dialog-title"></dialog><div id="toast" role="status" aria-live="polite"></div>';
document.body.append(mount);
document.addEventListener('click',e=>{if(e.target.closest('.skip-link')){e.preventDefault();$('#main').focus();$('#main').scrollIntoView();return;}const el=e.target.closest('[data-action]');if(el)handleAction(el);});
$('#dialog').addEventListener('click',e=>{if(e.target===$('#dialog')){const r=e.target.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)closeDialog();}});
$('#dialog').addEventListener('close',()=>{document.body.classList.remove('modal-open');if(lastFocus?.isConnected)lastFocus.focus();else $('#main')?.focus({preventScroll:true});});

// Touch-drag gesture to dismiss mobile bottom sheet
let dragStartY = null;
$('#dialog').addEventListener('pointerdown', e => {
  if (!e.target.closest('[data-sheet-drag]')) return;
  dragStartY = e.clientY;
  $('#dialog').setPointerCapture(e.pointerId);
});
$('#dialog').addEventListener('pointermove', e => {
  if (dragStartY === null) return;
  const dy = Math.max(0, e.clientY - dragStartY);
  $('#dialog').style.transform = 'translateY(' + dy + 'px)';
});
$('#dialog').addEventListener('pointerup', e => {
  if (dragStartY === null) return;
  const dy = e.clientY - dragStartY;
  dragStartY = null;
  if (dy > 65) closeDialog();
  else $('#dialog').style.transform = '';
});

window.addEventListener('hashchange',()=>{route=location.hash.slice(1)||'home';if($('#dialog').open)closeDialog();render();scrollTop();});
render();
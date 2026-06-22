# Word Match — Dakota

Flip cards to find matching pairs. Choose your vocabulary set.

<div id="wm-root"></div>

<style>
#wm-root *{box-sizing:border-box}
#wm-root{font-family:inherit;margin:1rem 0}
.wm-wrap{border:0.5px solid #ccc;border-radius:10px;overflow:hidden}
.wm-hdr{background:#8B1A1A;color:#fff;padding:12px 16px;display:flex;align-items:center;justify-content:space-between}
.wm-hdr h3{font-size:16px;font-weight:500;margin:0;color:#fff}
.wm-ctrl{display:flex;align-items:center;gap:6px;padding:10px 14px;background:#f5f5f5;flex-wrap:wrap}
.wm-ctrl button{font-size:12px;padding:4px 10px;border-radius:6px;border:1px solid #ccc;background:transparent;cursor:pointer;color:#555}
.wm-ctrl button.act{background:#8B1A1A;color:#fff;border-color:#8B1A1A}
.wm-stats{margin-left:auto;display:flex;gap:10px;font-size:13px}
.wm-board{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;padding:14px}
.wm-card{aspect-ratio:1.4;border:1px solid #ddd;border-radius:8px;cursor:pointer;display:flex;align-items:center;justify-content:center;text-align:center;padding:8px;font-size:13px;line-height:1.3;background:#fff;transition:transform .1s;position:relative}
.wm-card:hover:not(.mat):not(.fli){background:#f0f0f0;transform:scale(1.02)}
.wm-card.fli{background:#FFF0F0;border-color:#D4787878;color:#8B1A1A}
.wm-card.mat{background:#F9E8E8;border-color:#C8860A;color:#7A3A00;cursor:default}
.wm-card.bad{background:#FCEBEB;border-color:#F09595;color:#A32D2D;animation:sk .3s}
.wm-card .lbl{font-size:10px;color:#999;position:absolute;top:4px;right:6px}
.wm-card .dk{font-weight:600;color:#8B1A1A}
.wm-card.fli .dk{color:#7A0000}
@keyframes sk{0%,100%{transform:translateX(0)}25%{transform:translateX(-4px)}75%{transform:translateX(4px)}}
.wm-win{background:#FFF0F0;border:1px solid #C8860A;border-radius:8px;margin:0 14px 14px;padding:12px 16px;text-align:center;color:#7A3A00}
.wm-win h4{font-size:16px;font-weight:500;margin:0 0 4px}
.wm-btn{margin-top:8px;padding:6px 18px;background:#8B1A1A;color:#fff;border:none;border-radius:6px;cursor:pointer;font-size:13px}
</style>
<script>
(function(){
const SETS={
  greetings:[{dk:'Háu',en:'Hello (male)'},{dk:'Haŋ',en:'Hello (female)'},{dk:'Pidámayaye',en:'Thank you'},{dk:'Háŋ',en:'Yes'},{dk:'Hiyá',en:'No'},{dk:'Tokhéya',en:'Goodbye'},{dk:'emáčiyapi',en:'My name is'},{dk:'Oyáte',en:'Nation / people'}],
  numbers:[{dk:'Waŋží',en:'One (1)'},{dk:'Núŋpa',en:'Two (2)'},{dk:'Yámni',en:'Three (3)'},{dk:'Tópa',en:'Four (4)'},{dk:'Záptaŋ',en:'Five (5)'},{dk:'Šákpe',en:'Six (6)'},{dk:'Šakówiŋ',en:'Seven (7)'},{dk:'Wikčémna',en:'Ten (10)'}],
  nature:[{dk:'Makóčhe',en:'Land / homeland'},{dk:'Háŋhépi',en:'Night'},{dk:'Áŋpetu',en:'Day'},{dk:'Wétȟo',en:'Spring'},{dk:'Blokétu',en:'Summer'},{dk:'Ptaŋyétu',en:'Fall'},{dk:'Waníyetu',en:'Winter'},{dk:'Šúŋka',en:'Dog'}],
  sacred:[{dk:'Mitákuye Oyásʼiŋ',en:'All my relations'},{dk:'Wakȟáŋ Tȟáŋka',en:'Great Mystery'},{dk:'Wóčhekiye',en:'Prayer'},{dk:'Wačháŋtognaka',en:'Generosity'},{dk:'Ohítika',en:'Bravery'},{dk:'Ksapá',en:'Wisdom'},{dk:'Iktómi',en:'Spider / trickster'},{dk:'Wóoyake',en:'Story / oral narrative'}],
  directions:[{dk:'Wiyóhiŋyaŋpa',en:'East'},{dk:'Wiyóhpeyata',en:'West'},{dk:'Wazíyata',en:'North'},{dk:'Itókaga',en:'South'},{dk:'Šá',en:'It is red'},{dk:'Tó',en:'It is blue'},{dk:'Sápa',en:'It is black'},{dk:'Sáŋ',en:'It is white'}],
};
let cat='greetings',cards=[],flipped=[],matched=0,rights=0,wrongs=0,locked=false,secs=0,tmr=null;
function sh(a){return[...a].sort(()=>Math.random()-.5)}
function render(){
  const r=document.getElementById('wm-root');
  const pairs=SETS[cat];
  r.innerHTML=`<div class="wm-wrap">
  <div class="wm-hdr"><div><h3>Word Match — Dakota</h3></div><div style="font-size:11px;color:#F5C070">Pairs: <span id="wm-pf">0</span>/${pairs.length}</div></div>
  <div class="wm-ctrl" id="wm-ctrl"></div>
  <div class="wm-board" id="wm-board"></div>
  <div id="wm-win" style="display:none" class="wm-win"><h4>Pidámayaye! All pairs found!</h4><p id="wm-wmsg" style="font-size:13px;margin-bottom:8px"></p><button class="wm-btn" onclick="wmStart()">Play again</button></div>
  </div>`;
  const ctrl=document.getElementById('wm-ctrl');
  Object.keys(SETS).forEach(k=>{
    const b=document.createElement('button');
    b.textContent=k.charAt(0).toUpperCase()+k.slice(1);
    if(k===cat)b.className='act';
    b.onclick=()=>{cat=k;ctrl.querySelectorAll('button').forEach(x=>x.className='');b.className='act';wmStart();};
    ctrl.appendChild(b);
  });
  const sd=document.createElement('div');sd.className='wm-stats';
  sd.innerHTML=`<span id="wm-sr" style="color:#8B1A1A;font-weight:500">0 ✓</span> <span id="wm-sw" style="color:#A32D2D;font-weight:500">0 ✗</span> <span id="wm-st" style="color:#555;font-weight:500">0:00</span>`;
  ctrl.appendChild(sd);
  cards=[];flipped=[];matched=0;rights=0;wrongs=0;locked=false;
  clearInterval(tmr);secs=0;
  tmr=setInterval(()=>{secs++;const m=Math.floor(secs/60),s=secs%60;const el=document.getElementById('wm-st');if(el)el.textContent=m+':'+(s<10?'0':'')+s;},1000);
  pairs.forEach((p,i)=>{cards.push({id:i,type:'dk',text:p.dk,pair:i});cards.push({id:i+pairs.length,type:'en',text:p.en,pair:i});});
  sh(cards);
  const bd=document.getElementById('wm-board');
  cards.forEach((c,idx)=>{
    const el=document.createElement('div');el.className='wm-card';
    el.dataset.idx=idx;el.dataset.pair=c.pair;el.dataset.type=c.type;
    el.innerHTML=`<span class="lbl">${c.type.toUpperCase()}</span><span${c.type==='dk'?' class="dk"':''}>${c.text}</span>`;
    el.onclick=()=>wmFlip(idx);bd.appendChild(el);
  });
}
window.wmStart=function(){render();}
function wmFlip(idx){
  if(locked)return;
  const el=document.querySelector(`[data-idx="${idx}"]`);
  if(!el||el.classList.contains('mat')||el.classList.contains('fli'))return;
  el.classList.add('fli');flipped.push(idx);
  if(flipped.length===2){
    locked=true;
    const a=document.querySelector(`[data-idx="${flipped[0]}"]`);
    const b=document.querySelector(`[data-idx="${flipped[1]}"]`);
    if(a.dataset.pair===b.dataset.pair&&a.dataset.type!==b.dataset.type){
      rights++;matched++;
      const pf=document.getElementById('wm-pf');if(pf)pf.textContent=matched;
      const sr=document.getElementById('wm-sr');if(sr)sr.textContent=rights+' ✓';
      setTimeout(()=>{a.classList.remove('fli');a.classList.add('mat');b.classList.remove('fli');b.classList.add('mat');flipped=[];locked=false;
        if(matched===SETS[cat].length){clearInterval(tmr);const m=Math.floor(secs/60),s=secs%60;const w=document.getElementById('wm-win');if(w){w.style.display='block';document.getElementById('wm-wmsg').textContent=`Time: ${m}:${s<10?'0':''}${s} · Correct: ${rights} · Errors: ${wrongs}`;}}},400);
    } else {
      wrongs++;const sw=document.getElementById('wm-sw');if(sw)sw.textContent=wrongs+' ✗';
      a.classList.add('bad');b.classList.add('bad');
      setTimeout(()=>{a.classList.remove('fli','bad');b.classList.remove('fli','bad');flipped=[];locked=false;},800);
    }
  }
}
render();
})();
</script>

---
*Back to [Games Hub](index.md)*

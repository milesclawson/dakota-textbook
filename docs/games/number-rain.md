# Number Rain — Dakota

Numbers fall — click the correct Dakota word before they hit the bottom!

<div id="nr-root"></div>

<style>
#nr-root *{box-sizing:border-box}
#nr-root{font-family:inherit;margin:1rem 0}
.nr-wrap{border:0.5px solid #ccc;border-radius:10px;overflow:hidden}
.nr-hdr{background:#8B1A1A;color:#fff;padding:12px 16px;display:flex;align-items:center;justify-content:space-between}
.nr-hdr h3{font-size:16px;font-weight:500;margin:0;color:#fff}
.nr-stats{display:flex;gap:16px;font-size:13px;color:#F5C070;align-items:center}
.nr-sn{font-weight:500;font-size:17px;color:#fff}
.nr-arena{position:relative;height:280px;background:#f8f8f8;overflow:hidden;border-bottom:0.5px solid #ddd}
.nr-drop{position:absolute;background:#8B1A1A;color:#fff;border-radius:8px;padding:8px 18px;font-size:22px;font-weight:600;user-select:none}
.nr-drop.ok{background:#6B3A00}
.nr-drop.miss{background:#A32D2D}
.nr-bottom{padding:12px 14px;background:#fff}
.nr-prompt{font-size:13px;color:#666;margin-bottom:8px;text-align:center;min-height:20px}
.nr-choices{display:grid;grid-template-columns:repeat(4,1fr);gap:8px}
.nr-ch{padding:9px 4px;border:1px solid #ddd;border-radius:8px;background:#fff;cursor:pointer;font-size:13px;font-weight:500;text-align:center;transition:background .1s;font-family:inherit}
.nr-ch:hover{background:#f0f0f0}
.nr-ch.g{background:#FFF0E0;border-color:#C8860A;color:#7A3A00}
.nr-ch.r{background:#FCEBEB;border-color:#F09595;color:#A32D2D}
.nr-ov{position:absolute;inset:0;background:rgba(0,0,0,.55);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;z-index:10}
.nr-ov h4{color:#fff;font-size:20px;font-weight:500;margin:0}
.nr-ov p{color:#F5C070;font-size:14px;margin:0;text-align:center;padding:0 20px}
.nr-btn{padding:8px 24px;background:#C8860A;color:#fff;border:none;border-radius:8px;font-size:14px;font-weight:500;cursor:pointer}
</style>
<script>
(function(){
const NUMS=[{n:1,dk:'waŋží'},{n:2,dk:'núŋpa'},{n:3,dk:'yámni'},{n:4,dk:'tópa'},{n:5,dk:'záptaŋ'},{n:6,dk:'šákpe'},{n:7,dk:'šakówiŋ'},{n:8,dk:'šaglóğaŋ'},{n:9,dk:'napčíyuŋka'},{n:10,dk:'wikčémna'}];
let score=0,lives=3,level=1,target=null,locked=false,active=false,dropEl=null,dropTmr=null;
function sh(a){return[...a].sort(()=>Math.random()-.5)}
function hud(){
  const s=document.getElementById('nr-sc'),li=document.getElementById('nr-li'),lv=document.getElementById('nr-lv');
  if(s)s.textContent=score;if(li)li.textContent='❤️'.repeat(lives)+'🖤'.repeat(3-lives);if(lv)lv.textContent=level;
}
function choices(cor){return sh([cor,...sh(NUMS.filter(n=>n.n!==cor.n)).slice(0,3)]);}
function renderChoices(ch){
  const c=document.getElementById('nr-choices');if(!c)return;c.innerHTML='';
  ch.forEach(x=>{const b=document.createElement('button');b.className='nr-ch';b.textContent=x.dk;b.onclick=()=>pick(x,b);c.appendChild(b);});
}
function newDrop(){
  if(!active)return;
  const arena=document.getElementById('nr-arena');if(!arena)return;
  if(dropEl&&dropEl.parentElement)dropEl.remove();
  target=NUMS[Math.floor(Math.random()*NUMS.length)];
  const x=20+Math.random()*(arena.offsetWidth-100);
  const el=document.createElement('div');el.className='nr-drop';el.textContent=target.n;
  el.style.left=x+'px';el.style.top='-44px';arena.appendChild(el);dropEl=el;locked=false;
  const speed=Math.max(2800-level*250,900);
  el.style.transition=`top ${speed}ms linear`;
  const pr=document.getElementById('nr-prompt');if(pr)pr.textContent=`"${target.n}" in Dakota?`;
  renderChoices(choices(target));
  requestAnimationFrame(()=>requestAnimationFrame(()=>{el.style.top=(arena.offsetHeight+10)+'px';}));
  clearTimeout(dropTmr);
  dropTmr=setTimeout(()=>{
    if(el.parentElement&&!el.classList.contains('ok')){
      el.classList.add('miss');setTimeout(()=>{el.remove();},300);
      lives--;hud();if(lives<=0){setTimeout(endGame,400);}else setTimeout(newDrop,400);
    }
  },speed+120);
}
function pick(ch,btn){
  if(locked||!active)return;locked=true;clearTimeout(dropTmr);
  if(ch.n===target.n){score+=10+level*5;if(score>=level*60)level++;btn.classList.add('g');
    if(dropEl){dropEl.classList.add('ok');setTimeout(()=>{if(dropEl)dropEl.remove();},300);}
    hud();setTimeout(()=>{btn.classList.remove('g');newDrop();},300);
  } else {btn.classList.add('r');lives--;hud();setTimeout(()=>{btn.classList.remove('r');locked=false;},500);if(lives<=0){setTimeout(endGame,400);}}
}
function startGame(){score=0;lives=3;level=1;locked=false;active=true;const ov=document.getElementById('nr-ov');if(ov)ov.style.display='none';hud();newDrop();}
function endGame(){active=false;clearTimeout(dropTmr);if(dropEl&&dropEl.parentElement)dropEl.remove();
  const ov=document.getElementById('nr-ov');if(ov){ov.innerHTML=`<h4>Game over!</h4><p>Score: ${score} · Level: ${level}</p><button class="nr-btn" onclick="nrStart()">Play again</button>`;ov.style.display='flex';}}
window.nrStart=startGame;
document.getElementById('nr-root').innerHTML=`<div class="nr-wrap">
<div class="nr-hdr"><div><h3>Number Rain — Dakota</h3></div><div class="nr-stats"><div>Score <span class="nr-sn" id="nr-sc">0</span></div><div>Lives <span class="nr-sn" id="nr-li">❤️❤️❤️</span></div><div>Level <span class="nr-sn" id="nr-lv">1</span></div></div></div>
<div class="nr-arena" id="nr-arena"><div class="nr-ov" id="nr-ov" style="display:flex"><h4>Number Rain</h4><p>Numbers fall — click the Dakota word!<br>3 lives, speed increases.</p><button class="nr-btn" onclick="nrStart()">Start</button></div></div>
<div class="nr-bottom"><div class="nr-prompt" id="nr-prompt">Click Start to begin</div><div class="nr-choices" id="nr-choices"></div></div></div>`;
})();
</script>

---
*Back to [Games Hub](index.md)*

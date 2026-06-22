# Tiyóšpaye Defense

Match each of the Seven Council Fires (Očhéthi Šakówiŋ) to its Dakota name meaning and homeland before the timer runs out.

<div id="dd-root"></div>

<style>
#dd-root *{box-sizing:border-box}
#dd-root{font-family:inherit;margin:1rem 0}
.dd-wrap{border:0.5px solid #ccc;border-radius:10px;overflow:hidden}
.dd-hdr{background:#8B1A1A;color:#fff;padding:12px 16px;display:flex;align-items:center;justify-content:space-between}
.dd-hdr h3{font-size:16px;font-weight:500;margin:0;color:#fff}
.dd-sub{font-size:11px;color:#F5C070}
.dd-stats{display:flex;gap:14px;font-size:13px;color:#F5C070;align-items:center}
.dd-sn{font-weight:500;font-size:16px;color:#fff}
.dd-arena{padding:16px}
.dd-timer-bar{height:5px;background:#C8860A;border-radius:3px;margin:0 16px 12px;transition:width .5s linear}
.dd-clan{padding:10px 14px;border:1px solid #ccc;border-radius:8px;background:#fff;cursor:pointer;font-size:14px;font-weight:500;transition:background .15s,border-color .15s;margin-bottom:8px}
.dd-clan:hover{background:#fdf0f0;border-color:#8B1A1A}
.dd-clan.selected{background:#8B1A1A;color:#fff;border-color:#8B1A1A}
.dd-clan.matched{background:#FFF0E0;border-color:#C8860A;color:#7A3A00;cursor:default}
.dd-clan.wrong{background:#FCEBEB;border-color:#F09595;color:#A32D2D}
.dd-role{padding:10px 14px;border:1px solid #ccc;border-radius:8px;background:#fff;cursor:pointer;font-size:13px;transition:background .15s,border-color .15s;margin-bottom:8px}
.dd-role:hover{background:#fdf0f0;border-color:#8B1A1A}
.dd-role.matched{background:#FFF0E0;border-color:#C8860A;color:#7A3A00;cursor:default}
.dd-role.flash-ok{background:#FFF0E0;border-color:#C8860A}
.dd-role.flash-bad{background:#FCEBEB;border-color:#F09595}
.dd-result{text-align:center;padding:24px 16px}
.dd-result h4{font-size:20px;font-weight:500;color:#8B1A1A;margin:0 0 8px}
.dd-btn{padding:8px 20px;background:#8B1A1A;color:#fff;border:none;border-radius:8px;font-size:14px;cursor:pointer;margin-top:12px}
</style>
<script>
(function(){
const FIRES=[
  {name:'Bdewákhaŋthuŋwaŋ',en:'Mdewakanton',meaning:'"Spirit Lake Village" — Mille Lacs & southeastern MN'},
  {name:'Waȟpékute',en:'Wahpekute',meaning:'"Shooters among the Leaves" — southern MN & Iowa border'},
  {name:'Sisíthuŋwaŋ',en:'Sisseton',meaning:'"Village of the Swamp" — northeastern SD & western MN'},
  {name:'Waȟpéthuŋwaŋ',en:'Wahpeton',meaning:'"Village in the Leaves" — Red River Valley area'},
  {name:'Iháŋkthuŋwaŋ',en:'Yankton',meaning:'"Village at the End" — southeastern SD & Nebraska'},
  {name:'Iháŋkthuŋwaŋna',en:'Yanktonai',meaning:'"Little Village at the End" — central SD & ND'},
  {name:'Thítȟuŋwaŋ',en:'Teton / Lakota',meaning:'"Prairie Dwellers" — western SD, the Great Plains'},
];
let selected=null,matched=0,score=0,secs=90,tmr=null,active=false,shuffledMeanings=[];
function sh(a){return[...a].sort(()=>Math.random()-.5)}
function hud(){
  const s=document.getElementById('dd-sc'),t=document.getElementById('dd-tm'),m=document.getElementById('dd-mt');
  if(s)s.textContent=score;if(t)t.textContent=secs+'s';if(m)m.textContent=matched+'/'+FIRES.length;
}
function init(){
  shuffledMeanings=sh([...FIRES]);
  document.getElementById('dd-root').innerHTML=`<div class="dd-wrap">
<div class="dd-hdr"><div><h3>Tiyóšpaye Defense</h3><div class="dd-sub">Match each Council Fire to its meaning &amp; homeland</div></div>
<div class="dd-stats"><div>Score <span class="dd-sn" id="dd-sc">0</span></div><div>Matched <span class="dd-sn" id="dd-mt">0/7</span></div><div>Time <span class="dd-sn" id="dd-tm">90s</span></div></div></div>
<div class="dd-timer-bar" id="dd-tbar" style="width:100%"></div>
<div class="dd-arena" id="dd-arena"></div></div>`;
  renderBoard();startTimer();active=true;
}
function renderBoard(){
  const a=document.getElementById('dd-arena');
  a.innerHTML=`<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
<div><div style="font-size:12px;color:#888;margin-bottom:6px;font-weight:500">COUNCIL FIRES (Očhéthi Šakówiŋ)</div>
<div id="dd-clans">${FIRES.map((d,i)=>`<div class="dd-clan" id="dc${i}" onclick="ddPickClan(${i})"><strong>${d.name}</strong><br><span style="font-size:12px;font-weight:400;opacity:.7">${d.en}</span></div>`).join('')}</div></div>
<div><div style="font-size:12px;color:#888;margin-bottom:6px;font-weight:500">MEANINGS &amp; HOMELANDS</div>
<div id="dd-roles">${shuffledMeanings.map((d,i)=>`<div class="dd-role" id="dr${i}" onclick="ddPickRole(${i})">${d.meaning}</div>`).join('')}</div></div></div>
<div id="dd-fb" style="margin-top:10px;font-size:13px;min-height:20px;color:#888;text-align:center"></div>`;
}
window.ddPickClan=function(i){
  if(!active)return;
  const el=document.getElementById('dc'+i);
  if(!el||el.classList.contains('matched'))return;
  if(selected&&selected.type==='role'){tryMatch(i,selected.i);return;}
  document.querySelectorAll('.dd-clan').forEach(c=>c.classList.remove('selected'));
  el.classList.add('selected');selected={type:'clan',i};
};
window.ddPickRole=function(i){
  if(!active)return;
  const el=document.getElementById('dr'+i);
  if(!el||el.classList.contains('matched'))return;
  if(selected&&selected.type==='clan'){tryMatch(selected.i,i);return;}
  document.querySelectorAll('.dd-role').forEach(c=>c.classList.remove('selected'));
  el.classList.add('selected');selected={type:'role',i};
};
function tryMatch(clanIdx,roleIdx){
  const fire=FIRES[clanIdx];
  const role=shuffledMeanings[roleIdx];
  const cl=document.getElementById('dc'+clanIdx);
  const rl=document.getElementById('dr'+roleIdx);
  selected=null;
  document.querySelectorAll('.dd-clan,.dd-role').forEach(c=>c.classList.remove('selected'));
  if(fire.meaning===role.meaning){
    score+=15;matched++;
    cl.classList.add('matched');rl.classList.add('matched');rl.classList.add('flash-ok');
    const fb=document.getElementById('dd-fb');
    if(fb)fb.textContent=`✓ ${fire.name} — ${fire.meaning}`;
    hud();
    if(matched===FIRES.length){clearInterval(tmr);setTimeout(showResult,500);}
  } else {
    score=Math.max(0,score-3);
    cl.classList.add('wrong');rl.classList.add('flash-bad');
    const fb=document.getElementById('dd-fb');if(fb)fb.textContent='✗ Hiyá — try again';
    setTimeout(()=>{cl.classList.remove('wrong');rl.classList.remove('flash-bad');},600);
    hud();
  }
}
function startTimer(){
  clearInterval(tmr);secs=90;
  tmr=setInterval(()=>{
    secs--;hud();
    const bar=document.getElementById('dd-tbar');
    if(bar)bar.style.width=Math.max(0,(secs/90)*100)+'%';
    if(secs<=0){clearInterval(tmr);if(matched<FIRES.length)timeUp();}
  },1000);
}
function timeUp(){
  active=false;
  document.getElementById('dd-arena').innerHTML=`<div class="dd-result"><h4>Hiyá — time's up!</h4><p>You matched ${matched} of ${FIRES.length} Council Fires · Score: ${score}</p>
<button class="dd-btn" onclick="ddRestart()">Try again</button></div>`;
}
function showResult(){
  active=false;
  document.getElementById('dd-arena').innerHTML=`<div class="dd-result"><h4>Pidámayaye! All matched!</h4>
<p style="font-size:15px;color:#8B1A1A;font-weight:500">Score: ${score} · Time left: ${secs}s</p>
<p style="color:#888;font-size:13px">You matched all seven fires of the Očhéthi Šakówiŋ!</p>
<button class="dd-btn" onclick="ddRestart()">Play again</button></div>`;
}
window.ddRestart=function(){matched=0;score=0;selected=null;active=false;clearInterval(tmr);init();};
init();
})();
</script>

---
*Back to [Games Hub](index.md)*

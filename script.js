document.addEventListener('DOMContentLoaded',function(){
  const particles=document.getElementById('particles');
  for(let i=0;i<60;i++){const d=document.createElement('div');d.className='dot';d.style.left=Math.random()*100+'%';d.style.top=Math.random()*100+'%';d.style.animationDelay=(Math.random()*8)+'s';particles.appendChild(d)}
  const parallax=document.getElementById('parallax');
  if(parallax){for(let i=0;i<3;i++){const l=document.createElement('div');l.className='layer';parallax.appendChild(l)};window.addEventListener('mousemove',e=>{const x=(e.clientX/window.innerWidth-.5)*2;const y=(e.clientY/window.innerHeight-.5)*2;const layers=parallax.querySelectorAll('.layer');layers.forEach((el,idx)=>{const s=(idx+1)*2;el.style.transform=`translate3d(${x*s}px,${y*s}px,0)`})})}
  const btnBack=document.getElementById('btnBack');
  const search=document.getElementById('search');
  const table=document.getElementById('table');
  const tbody=table.querySelector('tbody');
  const tablewrap=document.querySelector('.tablewrap');
  const prev=document.getElementById('prev');
  const next=document.getElementById('next');
  const stat=document.getElementById('stat');
  const rain=document.getElementById('emojiRain');
  let bgm,musicOn=false;
  let sortKey='no',sortDir='asc',page=1,pageSize=10,data=parseTable();
  function parseTable(){const rows=[...tbody.querySelectorAll('tr')];return rows.map(r=>{const c=r.querySelectorAll('td');return {no:Number(c[0].textContent.trim()),nik:c[1].textContent.trim(),nama:c[2].textContent.trim(),dept:c[3].textContent.trim()}})}
  function unique(arr){return[...new Set(arr)]}
  function sortData(){data.sort((a,b)=>{const va=a[sortKey],vb=b[sortKey];if(va<vb)return sortDir==='asc'?-1:1;if(va>vb)return sortDir==='asc'?1:-1;return 0})}
  function filtered(){const q=search.value.trim().toLowerCase();return data.filter(d=>!q||(String(d.nik).toLowerCase().includes(q)||d.nama.toLowerCase().includes(q)||d.dept.toLowerCase().includes(q)))}
  function paginate(arr){const total=arr.length;const pages=Math.max(1,Math.ceil(total/pageSize));page=Math.min(page,pages);const start=(page-1)*pageSize;const rows=arr.slice(start,start+pageSize);stat.textContent=`Menampilkan ${rows.length} dari ${total} data • Halaman ${page}/${pages}`;prev.disabled=page<=1;next.disabled=page>=pages;return rows}
  function render(){sortData();const rows=paginate(filtered());tbody.innerHTML='';rows.forEach(r=>{const tr=document.createElement('tr');tr.innerHTML=`<td>${r.no}</td><td>${r.nik}</td><td>${r.nama}</td><td><span class="badgeDept">${r.dept}</span></td>`;tr.classList.add('enter');tbody.appendChild(tr)})}
  function animatePage(){ if(tablewrap){ tablewrap.classList.add('swap'); setTimeout(()=>tablewrap.classList.remove('swap'),260) } if(stat){ stat.classList.add('pulse'); setTimeout(()=>stat.classList.remove('pulse'),320) } }
  function ripple(btn){ const s=document.createElement('span'); s.className='rpl'; btn.appendChild(s); setTimeout(()=>{ if(s.parentNode) s.parentNode.removeChild(s) },520) }
  function confettiBurst(){const c=document.getElementById('confetti');const ctx=c.getContext('2d');const W=c.width=window.innerWidth;const H=c.height=window.innerHeight;const pieces=Array.from({length:140},()=>({x:Math.random()*W,y:-10,r:4+Math.random()*6,c:['#00e7ff','#4bff88','#ff3ef0'][Math.floor(Math.random()*3)],s:2+Math.random()*4,a:Math.random()*360}));let t=0;function loop(){ctx.clearRect(0,0,W,H);pieces.forEach(p=>{p.y+=p.s;p.x+=Math.sin((p.a+t)/50)*1.6;ctx.fillStyle=p.c;ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fill()});t++;if(t<260)requestAnimationFrame(loop);else ctx.clearRect(0,0,W,H)}loop()}
  function ensureBgm(){
    if(!bgm){
      bgm=document.getElementById('bgm');
      if(!bgm){
        bgm=document.createElement('audio');
        bgm.id='bgm';
        bgm.src='assets/queen_champions.m4a';
        bgm.preload='auto';
        bgm.setAttribute('playsinline','');
        document.body.appendChild(bgm);
      }
    }
    return bgm;
  }
  function startMusic(){
    if(musicOn) return;
    const a=ensureBgm();
    a.loop=true;
    a.volume=0.5;
    a.load();
    const tryPlay=()=>{
      const pr=a.play();
      if(pr && typeof pr.then==='function'){
        pr.then(()=>{ musicOn=true }).catch(()=>{});
      } else {
        musicOn=true;
      }
    };
    a.addEventListener('canplaythrough',()=>{ if(a.paused) tryPlay() },{once:true});
    setTimeout(()=>{ if(a.paused) tryPlay() },2000);
    const p=a.play();
    if(p && typeof p.catch==='function'){
      p.catch(()=>{
        const kick=()=>{
          a.play();
          document.removeEventListener('pointerdown',kick);
          document.removeEventListener('keydown',kick);
          document.removeEventListener('touchstart',kick);
        };
        document.addEventListener('pointerdown',kick);
        document.addEventListener('keydown',kick);
        document.addEventListener('touchstart',kick,{passive:true});
      });
    } else {
      musicOn=true;
    }
  }
  function stopMusic(){ const a=ensureBgm(); a.pause(); musicOn=false }
  table.querySelectorAll('th').forEach(th=>th.addEventListener('click',()=>{const key=th.dataset.key;if(sortKey===key)sortDir=sortDir==='asc'?'desc':'asc';else{sortKey=key;sortDir='asc'}render()}));
  search.addEventListener('input',()=>{page=1;render()});
  prev.addEventListener('click',()=>{ripple(prev);page=Math.max(1,page-1);render();animatePage()});
  next.addEventListener('click',()=>{ripple(next);page=page+1;render();animatePage()});
  if(btnBack){btnBack.addEventListener('click',()=>{stopMusic();window.location.href='index.html'})}
  function emojiRain(){if(!rain)return;const list=['🎉','✨','🚀','🔋','⚡','🌟','🎊','💡','🪐'];for(let i=0;i<28;i++){const s=document.createElement('span');s.className='emo';s.textContent=list[Math.floor(Math.random()*list.length)];s.style.left=Math.random()*100+'%';s.style.fontSize=(18+Math.random()*18)+'px';s.style.animationDuration=(6+Math.random()*6)+'s';s.style.animationDelay=(Math.random()*4)+'s';rain.appendChild(s)} }
  emojiRain();
  confettiBurst();
  startMusic();
  render();
})

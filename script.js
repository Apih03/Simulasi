// E-Voting Ciater - SIMULASI FRONT-END
// Data disimpan di localStorage browser. Tidak aman untuk pemilihan resmi.
const ADMIN_PIN = "123456"; // Ganti PIN demo ini jika diperlukan.

const DEFAULT_CANDIDATES = [
  {id:1, number:"01", name:"Nama Calon Pertama", vision:"Membangun desa yang maju, terbuka, dan mengutamakan pelayanan masyarakat.", initials:"01"},
  {id:2, number:"02", name:"Nama Calon Kedua", vision:"Menguatkan ekonomi warga melalui pertanian, UMKM, dan pemberdayaan pemuda.", initials:"02"},
  {id:3, number:"03", name:"Nama Calon Ketiga", vision:"Mewujudkan lingkungan desa yang aman, harmonis, dan berkelanjutan.", initials:"03"},
  {id:4, number:"04", name:"Nama Calon Keempat", vision:"Mendorong tata kelola desa yang transparan, partisipatif, dan inovatif.", initials:"04"}
];
const KEYS = {candidates:"ciater_candidates_v1", votes:"ciater_votes_v1", voted:"ciater_voted_v1"};
let candidates = load(KEYS.candidates, DEFAULT_CANDIDATES);
let votes = load(KEYS.votes, {});
let pendingCandidate = null;

function load(key, fallback){try{const value=localStorage.getItem(key);return value?JSON.parse(value):structuredClone(fallback)}catch(e){return structuredClone(fallback)}}
function save(){localStorage.setItem(KEYS.candidates,JSON.stringify(candidates));localStorage.setItem(KEYS.votes,JSON.stringify(votes))}
function hasVoted(){return localStorage.getItem(KEYS.voted)==="yes"}
function countVotes(){return candidates.reduce((sum,c)=>sum+(Number(votes[c.id])||0),0)}
function initials(name){return name.trim().split(/\s+/).slice(0,2).map(x=>x[0]||"").join("").toUpperCase()||"??"}
function escapeHTML(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}

function renderCandidates(){
  const grid=document.getElementById("candidateGrid");
  grid.innerHTML=candidates.map(c=>`
    <article class="candidate-card">
      <div class="candidate-photo">
        <span class="candidate-number">NO. URUT ${escapeHTML(c.number)}</span>
        <div class="candidate-placeholder">${escapeHTML(initials(c.name))}</div>
      </div>
      <div class="candidate-content">
        <div class="candidate-label">CALON KEPALA DESA</div>
        <h3 class="candidate-name">${escapeHTML(c.name)}</h3>
        <p class="candidate-vision">${escapeHTML(c.vision)}</p>
        <button class="choose-button" data-vote="${c.id}" ${hasVoted()?"disabled":""}>${hasVoted()?"SUARA TERSIMPAN":"PILIH CALON  →"}</button>
      </div>
    </article>`).join("");
  grid.querySelectorAll("[data-vote]").forEach(btn=>btn.addEventListener("click",()=>openConfirm(Number(btn.dataset.vote))));
  if(hasVoted()){
    const note=document.querySelector(".notice p");
    note.textContent="Terima kasih. Suara simulasi dari browser ini sudah tercatat. Hubungi admin simulasi untuk melakukan reset.";
  }
}
function openConfirm(id){
  if(hasVoted()){toast("Browser ini sudah mengirim suara simulasi.");return}
  pendingCandidate=candidates.find(c=>c.id===id);
  if(!pendingCandidate)return;
  document.getElementById("confirmCandidate").innerHTML=`<div class="mini-avatar">${escapeHTML(initials(pendingCandidate.name))}</div><div><b>${escapeHTML(pendingCandidate.name)}</b><small>CALON NOMOR URUT ${escapeHTML(pendingCandidate.number)}</small></div>`;
  showModal("confirmModal");
}
function castVote(){
  if(!pendingCandidate||hasVoted())return;
  votes[pendingCandidate.id]=(Number(votes[pendingCandidate.id])||0)+1;
  localStorage.setItem(KEYS.votes,JSON.stringify(votes));
  localStorage.setItem(KEYS.voted,"yes");
  closeModal("confirmModal");pendingCandidate=null;
  document.getElementById("receiptTime").textContent=new Date().toLocaleString("id-ID",{dateStyle:"long",timeStyle:"short"});
  renderCandidates();renderAdmin();showModal("successModal");
}
function showModal(id){const el=document.getElementById(id);el.classList.add("open");el.setAttribute("aria-hidden","false")}
function closeModal(id){const el=document.getElementById(id);el.classList.remove("open");el.setAttribute("aria-hidden","true")}
document.querySelectorAll("[data-close]").forEach(b=>b.addEventListener("click",()=>closeModal(b.dataset.close)));
document.querySelectorAll(".modal-backdrop").forEach(bg=>bg.addEventListener("click",e=>{if(e.target===bg)closeModal(bg.id)}));
document.getElementById("confirmVote").addEventListener("click",castVote);
document.getElementById("howItWorks").addEventListener("click",()=>toast("Pilih satu kandidat, periksa nama, lalu konfirmasi suara."));
document.getElementById("resultsOpen").addEventListener("click",()=>{showLoginOrDashboard();});

function showLoginOrDashboard(){if(sessionStorage.getItem("ciater_admin_session")==="yes")openAdmin();else showModal("loginModal")}
document.getElementById("adminOpen").addEventListener("click",showLoginOrDashboard);
document.getElementById("loginSubmit").addEventListener("click",login);
document.getElementById("adminPin").addEventListener("keydown",e=>{if(e.key==="Enter")login()});
function login(){
  const pin=document.getElementById("adminPin").value;
  if(pin===ADMIN_PIN){sessionStorage.setItem("ciater_admin_session","yes");document.getElementById("adminPin").value="";document.getElementById("loginError").textContent="";closeModal("loginModal");openAdmin()}
  else document.getElementById("loginError").textContent="PIN tidak sesuai. Silakan coba kembali.";
}
function openAdmin(){document.getElementById("adminPanel").classList.add("open");document.getElementById("adminPanel").setAttribute("aria-hidden","false");renderAdmin()}
function closeAdmin(){document.getElementById("adminPanel").classList.remove("open");document.getElementById("adminPanel").setAttribute("aria-hidden","true")}
document.getElementById("adminClose").addEventListener("click",closeAdmin);
document.getElementById("adminLogout").addEventListener("click",()=>{sessionStorage.removeItem("ciater_admin_session");closeAdmin();toast("Anda telah keluar dari panel admin.")});

document.querySelectorAll(".side-link").forEach(btn=>btn.addEventListener("click",()=>{
  document.querySelectorAll(".side-link").forEach(x=>x.classList.remove("active"));btn.classList.add("active");
  document.querySelectorAll(".admin-tab").forEach(x=>x.classList.add("hidden"));
  document.getElementById("tab-"+btn.dataset.tab).classList.remove("hidden");
  document.getElementById("adminPageTitle").textContent=({overview:"Ringkasan pemilihan",candidates:"Data kandidat",settings:"Pengaturan simulasi"})[btn.dataset.tab];
  if(btn.dataset.tab==="candidates")renderCandidateEditor();
}));
function renderAdmin(){
  const total=countVotes();
  document.getElementById("totalVotes").textContent=total;
  document.getElementById("totalCandidates").textContent=candidates.length;
  document.getElementById("participation").textContent=hasVoted()?"100%":"0%";
  const max=Math.max(1,...candidates.map(c=>Number(votes[c.id])||0));
  document.getElementById("adminResults").innerHTML=candidates.map(c=>{
    const n=Number(votes[c.id])||0,p=total?Math.round(n/total*100):0;
    return `<div class="admin-result-row"><div class="result-label"><b>${escapeHTML(c.number)} · ${escapeHTML(c.name)}</b><span>${n} suara · ${p}%</span></div><div class="bar-track"><div class="bar-fill" style="width:${total?p:0}%"></div></div></div>`;
  }).join("");
  renderCandidateEditor();
}
function renderCandidateEditor(){
  document.getElementById("candidateEditor").innerHTML=candidates.map((c,i)=>`
    <div class="editor-row">
      <div class="editor-number">${escapeHTML(c.number)}</div>
      <div><label for="candidate-name-${i}">NAMA KANDIDAT</label><input id="candidate-name-${i}" data-name="${c.id}" value="${escapeHTML(c.name)}" maxlength="60"></div>
      <div><label for="candidate-vision-${i}">VISI / DESKRIPSI SINGKAT</label><input id="candidate-vision-${i}" data-vision="${c.id}" value="${escapeHTML(c.vision)}" maxlength="140"></div>
    </div>`).join("");
}
document.getElementById("saveCandidates").addEventListener("click",()=>{
  candidates=candidates.map(c=>{
    const name=document.querySelector(`[data-name="${c.id}"]`)?.value.trim()||c.name;
    const vision=document.querySelector(`[data-vision="${c.id}"]`)?.value.trim()||c.vision;
    return {...c,name,vision};
  });
  save();renderCandidates();renderAdmin();toast("Data kandidat berhasil disimpan.");
});
document.getElementById("resetVotes").addEventListener("click",()=>{
  if(!confirm("Yakin ingin menghapus seluruh suara simulasi pada browser ini?"))return;
  votes={};localStorage.setItem(KEYS.votes,JSON.stringify(votes));localStorage.removeItem(KEYS.voted);
  renderCandidates();renderAdmin();toast("Data suara simulasi telah direset.");
});
document.getElementById("exportCsv").addEventListener("click",()=>{
  const rows=[["Nomor Urut","Nama Kandidat","Jumlah Suara","Persentase"]];
  const total=countVotes();
  candidates.forEach(c=>{const n=Number(votes[c.id])||0;rows.push([c.number,c.name,n,total?((n/total)*100).toFixed(2)+"%":"0%"])});
  rows.push(["TOTAL","",total,"100%"]);
  const csv=rows.map(r=>r.map(v=>`"${String(v).replace(/"/g,'""')}"`).join(",")).join("\r\n");
  const blob=new Blob(["\ufeff"+csv],{type:"text/csv;charset=utf-8"});
  const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download="rekap-e-voting-ciater.csv";a.click();URL.revokeObjectURL(url);
});
function toast(message){const el=document.getElementById("toast");el.textContent=message;el.classList.add("show");clearTimeout(toast.timer);toast.timer=setTimeout(()=>el.classList.remove("show"),2600)}

renderCandidates();

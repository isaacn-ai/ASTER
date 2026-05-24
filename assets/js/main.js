document.getElementById('year').textContent = new Date().getFullYear();
const themeToggle=document.getElementById('themeToggle');
const stored=localStorage.getItem('theme');if(stored)document.documentElement.dataset.theme=stored;
themeToggle?.addEventListener('click',()=>{const n=document.documentElement.dataset.theme==='light'?'dark':'light';document.documentElement.dataset.theme=n;localStorage.setItem('theme',n);});
const CONTACT_ENDPOINT=""; // TODO: configure
const form=document.getElementById('contactForm');const state=document.getElementById('contactState');
form?.addEventListener('submit',async(e)=>{e.preventDefault();state.textContent='Sending…';await new Promise(r=>setTimeout(r,600));if(!CONTACT_ENDPOINT){state.textContent='Success (demo mode). Configure CONTACT_ENDPOINT to enable backend submission.';return;}state.textContent='Error: endpoint unavailable.';});

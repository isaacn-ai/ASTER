const io=new IntersectionObserver((entries)=>entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('in')}),{threshold:.15});document.querySelectorAll('section').forEach(s=>io.observe(s));

document.getElementById('contact-form').addEventListener('submit',function(e){
  e.preventDefault();
  const f=new FormData(e.target);
  const subject=encodeURIComponent('Portfolio contact from '+f.get('name'));
  const body=encodeURIComponent(`Name: ${f.get('name')}\nEmail: ${f.get('email')}\n\n${f.get('message')}`);
  window.location.href = `mailto:your@email.example?subject=${subject}&body=${body}`;
});

const extensions = document.getElementById('extensions');

fetch('/extensions')
  .then(response => response.json())
  .then(data =>  {
    data.forEach(item => {
      extensions.innerHTML += ` 
      <div class="extension">
      <h3 class="extension-name"> ${item.eklenti_adi} </h3>
      <p class="desc"> ${item.aciklama}</p>
      <div class="version"> <b>Version<b>:${item.surum}</div>
      <div class="download"> <b>Download count:<b> ${item.indirme_sayisi}</div>
    </div>
      
      `
    });
  })


import app from "./server.js";


// Inputs
  const tituloInput = document.getElementById('titulo');
  const mensagemInput = document.getElementById('mensagem');
  const fotoInput = document.getElementById('foto');
  const musicaInput = document.getElementById('musica');
  const dataInicioInput = document.getElementById('dataInicio');

  // Preview elements
  const previewTitulo = document.getElementById('previewTitulo');
  const previewMensagem = document.getElementById('previewMensagem');
  const carousel = document.getElementById('carousel');
  const dots = document.getElementById('dots');
  const loveTimer = document.getElementById('loveTimer');
  const previewMusica = document.getElementById('previewMusica');
  const alertaFotos = document.getElementById('alertaFotos');

  // Atualiza título e mensagem
  tituloInput.addEventListener('input', () => {
    previewTitulo.textContent = tituloInput.value.trim() || 'Seu título aqui';
  });
  mensagemInput.addEventListener('input', () => {
    previewMensagem.textContent = mensagemInput.value.trim() || 'Sua mensagem especial aparecerá aqui.';
  });

  // Carrossel de imagens
  let images = [];
  let currentIndex = 0;
  let autoplayInterval = null;

  function showImage(index) {
    if (index < 0) index = images.length - 1;
    if (index >= images.length) index = 0;
    const imgs = carousel.querySelectorAll('img');
    imgs.forEach((img, i) => {
      img.classList.toggle('active', i === index);
    });
    const dotsItems = dots.querySelectorAll('.dot');
    dotsItems.forEach((dot, i) => {
      dot.classList.toggle('active', i === index);
    });
    currentIndex = index;
  }

  function nextImage() {
    showImage(currentIndex + 1);
  }

  function startAutoplay() {
    if (autoplayInterval) clearInterval(autoplayInterval);
    autoplayInterval = setInterval(nextImage, 5000);
  }

  function createCarousel(files) {
    carousel.innerHTML = '';
    dots.innerHTML = '';
    images = [];

    if (files.length === 0) {
      carousel.style.display = 'none';
      return;
    }

    carousel.style.display = 'block';

    Array.from(files).forEach((file, i) => {
      const reader = new FileReader();
      reader.onload = e => {
        const img = document.createElement('img');
        img.src = e.target.result;
        if (i === 0) img.classList.add('active');
        carousel.appendChild(img);
        images.push(img);

        const dot = document.createElement('div');
        dot.classList.add('dot');
        if (i === 0) dot.classList.add('active');
       
        dots.appendChild(dot);

        // Começar autoplay depois que todas as imagens foram carregadas
        if (images.length === files.length) {
          startAutoplay();
        }
      };
      reader.readAsDataURL(file);
    });
  }

  // Limite de 5 imagens e chamada única do createCarousel
  fotoInput.addEventListener('change', e => {
    const files = e.target.files;
    if (files.length > 5) {
      alertaFotos.style.display = 'block';
      fotoInput.value = '';
      carousel.style.display = 'none';
      dots.innerHTML = '';
      if (autoplayInterval) clearInterval(autoplayInterval);
      return;
    }
    alertaFotos.style.display = 'none';
    if (autoplayInterval) clearInterval(autoplayInterval);
    createCarousel(files);
  });

  // Contador "Eu te amo há..."
  let startDate = null;
  let timerInterval = null;

  dataInicioInput.addEventListener('change', () => {
    const val = dataInicioInput.value;
    if (!val) return;

    const [year, month, day] = val.split('-').map(Number);
    startDate = new Date(year, month -1, day);

    if (timerInterval) clearInterval(timerInterval);
    atualizarContador();
    timerInterval = setInterval(atualizarContador, 1000);
  });

  function atualizarContador() {
    if (!startDate) return;
    const agora = new Date();

    if (agora < startDate) {
      loveTimer.textContent = "A data escolhida é no futuro! 🥲";
      return;
    }

    let anos = agora.getFullYear() - startDate.getFullYear();
    const aniversarioEsteAno = new Date(agora.getFullYear(), startDate.getMonth(), startDate.getDate());
    if (agora < aniversarioEsteAno) {
      anos--;
    }

    const ultimaData = new Date(startDate);
    ultimaData.setFullYear(startDate.getFullYear() + anos);

    const diff = agora - ultimaData;

    const dias = Math.floor(diff / (1000 * 60 * 60 * 24));
    let resto = diff % (1000 * 60 * 60 * 24);

    const horas = Math.floor(resto / (1000 * 60 * 60));
    resto = resto % (1000 * 60 * 60);

    const minutos = Math.floor(resto / (1000 * 60));
    const segundos = Math.floor((resto % (1000 * 60)) / 1000);

    loveTimer.textContent = `${anos} anos, 
    ${dias} dias,
     ${horas} horas,
      ${minutos} minutos e
       ${segundos} segundos`;
  }

  // Música Spotify
  function gerarEmbed() {
    const link = document.getElementById("spotifyLink").value;
    const regex = /spotify\.com\/(track|album|playlist|episode)\/([a-zA-Z0-9]+)/;
    const match = link.match(regex);

    if (match) {
        const type = match[1];
        const id = match[2];
        const embedUrl = `https://open.spotify.com/embed/${type}/${id}?utm_source=generator`;
        
        document.getElementById("player").innerHTML = `
            <iframe src="${embedUrl}" width="300" height="380" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"></iframe>
        `;
    } else {
        alert("Link inválido do Spotify!");
    }
}

  // Inicializa valores padrões
  previewTitulo.textContent = 'Seu título aqui';
  previewMensagem.textContent = 'Sua mensagem especial aparecerá aqui.';
  loveTimer.textContent = 'TEMPO DA MEMORIA';


  document.getElementById("botao-gerar").addEventListener("click", async () => {
    const response = await fetch("http://localhost:3000/create_preference", {
        method: "POST",
        headers: { "Content-Type": "application/json" }
    });

    const data = await response.json();
    if (data.url) {
        window.location.href = data.url; // redireciona para o checkout do MP
    }
});
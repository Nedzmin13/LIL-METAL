document.addEventListener('DOMContentLoaded', function() {

  const header = document.querySelector('header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });


  const hamburgerButton = document.getElementById('hamburger-button');
  const mobileNavMenu = document.getElementById('mobile-nav-menu');

  if (hamburgerButton && mobileNavMenu) {
    const mobileNavLinks = mobileNavMenu.querySelectorAll('a');

    hamburgerButton.addEventListener('click', () => {
      mobileNavMenu.classList.toggle('active');
      const icon = hamburgerButton.querySelector('i');
      if (mobileNavMenu.classList.contains('active')) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-times');
      } else {
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
      }
    });

    mobileNavLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (mobileNavMenu.classList.contains('active')) {
          mobileNavMenu.classList.remove('active');
          const icon = hamburgerButton.querySelector('i');
          icon.classList.remove('fa-times');
          icon.classList.add('fa-bars');
        }
      });
    });
  } else {
    console.error("Elementi hamburger o menu mobile non trovati.");
  }


  const heroParagraph = document.querySelector('#hero .hero-content p');
  if (heroParagraph) {
    const textToType = heroParagraph.textContent.trim();
    heroParagraph.textContent = ''; // Svuota per iniziare
    heroParagraph.style.width = 'auto'; // Rendi larghezza automatica subito
    heroParagraph.style.borderRight = '3px solid transparent'; // Inizia senza cursore visibile
    heroParagraph.style.visibility = 'visible'; // Rendi visibile subito

    let i = 0;
    let typingInterval;

    function typeWriter() {
      if (!heroParagraph) return; // Check sicurezza
      if (i < textToType.length) {
        if (i === 0) {
          heroParagraph.classList.add('typing-cursor'); // Mostra cursore all'inizio
        }
        heroParagraph.textContent += textToType.charAt(i);
        i++;
      } else {
        clearInterval(typingInterval);

        setTimeout(() => {
          if (heroParagraph) {
            heroParagraph.classList.remove('typing-cursor');
            heroParagraph.style.borderRight = 'none'; // Nascondi bordo
          }
        }, 1500); // Pausa prima di nascondere cursore
      }
    }


    setTimeout(() => {
      if (textToType.length > 0) {
        // Inizia subito a mostrare il cursore
        heroParagraph.classList.add('typing-cursor');
        typingInterval = setInterval(typeWriter, 120); // Leggermente più lento?
      } else {
        console.warn("Testo del paragrafo Hero vuoto, animazione non avviata.");
      }
    }, 800); // Ritardo prima di iniziare a scrivere

  } else {
    console.error("Paragrafo Hero non trovato per l'animazione.");
  }



  const portfolioGrid = document.getElementById('portfolio-grid');
  // === ARRAY IMMAGINI COMPLETO ===
  const images = [
    '1.jpg', '2.jpg', '3.jpg', '4.jpg', '5.jpg', '6.jpg', '7.jpg',
    '8.jpg',  '12.jpg',
    '15.jpg', '16.jpg', '17.jpg', '18.jpg', '19.jpg', // Aggiunte!
    '20.jpg', '21.jpg', '22.jpg', '9.jpg', '10.jpg', '11.jpg',  '13.jpg', '14.jpg', // Aggiunte!
  ];


  function createPortfolioGrid() {
    if (!portfolioGrid) { console.error("Elemento portfolio-grid non trovato."); return; }
    portfolioGrid.innerHTML = ''; // Pulisci griglia esistente
    if (!images || images.length === 0) { console.warn("L'array 'images' è vuoto."); return; }

    images.forEach(imageName => {
      const itemDiv = document.createElement('div');
      itemDiv.classList.add('portfolio-item');

      const imgElement = document.createElement('img');
      // Assumendo che le immagini siano nella cartella 'img/'
      imgElement.src = `img/${imageName}`; // Percorso corretto
      imgElement.alt = `Lavoro LIL METAL - ${imageName.split('.')[0]}`;
      imgElement.loading = 'lazy'; // Caricamento lazy per performance

      // Gestore errori immagine
      imgElement.onerror = () => {
        console.error(`Errore caricamento immagine: ${imageName} nel percorso ${imgElement.src}`);
        itemDiv.innerHTML = `<p style="color: red; font-size: 0.8em; padding: 10px;">Errore caricando ${imageName}</p>`; // Messaggio errore visibile
      };


      imgElement.addEventListener('click', () => {
        if (typeof basicLightbox !== 'undefined' && basicLightbox.create) {
          const imageUrl = imgElement.src;
          try {
            basicLightbox.create(`<img src="${imageUrl}" style="max-width: 90vw; max-height: 90vh; display: block; margin: auto;">`).show();
          } catch (e) {
            console.error("Errore BasicLightbox:", e);
          }
        } else {
          console.error("Libreria basicLightbox non caricata correttamente.");
        }
      });

      itemDiv.appendChild(imgElement);
      portfolioGrid.appendChild(itemDiv);
    });
  }


  if (portfolioGrid) {
    createPortfolioGrid();
  }

  // --- INTEGRAZIONE EMAILJS ---
  const emailJsPublicKey = '4QJ-TzCSp0eddiiMV'; // La tua Public Key
  const emailJsServiceID = 'service_copca4h'; // Il tuo Service ID
  const emailJsTemplateID = 'template_umb585q'; // Il tuo Template ID

  if (emailJsPublicKey && typeof emailjs !== 'undefined') {
    try {
      emailjs.init({ publicKey: emailJsPublicKey }); // Usa oggetto configurazione
      console.log("EmailJS Inizializzato.");
    } catch (e) {
      console.error("Errore durante emailjs.init(): ", e);
    }
  } else {

    if (!emailJsPublicKey) console.error("ATTENZIONE: Public Key di EmailJS mancante.");
    if (typeof emailjs === 'undefined') console.error("ATTENZIONE: Libreria EmailJS non caricata correttamente.");
  }

  const contactForm = document.getElementById('contact-form');
  const submitButton = contactForm ? contactForm.querySelector('button.submit-button') : null;
  const formStatusMessage = document.getElementById('form-status-message');

  if (contactForm && submitButton && formStatusMessage) {
    contactForm.addEventListener('submit', function (event) {
      event.preventDefault();

      if (typeof emailjs === 'undefined' || typeof emailjs.sendForm !== 'function' || !emailJsPublicKey) {

        formStatusMessage.textContent = 'Errore di configurazione EmailJS.';
        formStatusMessage.className = 'form-status error';
        formStatusMessage.style.display = 'block';
        return;
      }


      formStatusMessage.textContent = '';
      formStatusMessage.className = 'form-status';
      formStatusMessage.style.display = 'none';
      submitButton.disabled = true;
      const originalButtonText = submitButton.textContent;
      submitButton.textContent = 'Invio in corso...';


      emailjs.sendForm(emailJsServiceID, emailJsTemplateID, this) // 'this' si riferisce al form
        .then(() => {
          console.log('SUCCESSO: Email inviata!');
          contactForm.reset();
          formStatusMessage.textContent = 'Grazie! Il tuo messaggio è stato inviato.';
          formStatusMessage.classList.add('success');
        }, (error) => {
          console.error('ERRORE invio email:', error);
          let errorMessage = 'Errore durante l\'invio. Riprova più tardi.';
          if (error && error.text) { errorMessage = `Errore invio: ${error.text}`; }

          formStatusMessage.textContent = errorMessage;
          formStatusMessage.classList.add('error');
        }).finally(() => {

        submitButton.disabled = false;
        submitButton.textContent = originalButtonText;
        formStatusMessage.style.display = 'block'; // Mostra messaggio

      });
    });
  } else {

    if (!contactForm) console.error("Form con ID 'contact-form' non trovato.");
    if (contactForm && !submitButton) console.error("Bottone submit non trovato DENTRO il form.");
    if (!formStatusMessage) console.error("Elemento '#form-status-message' non trovato.");
  }

});
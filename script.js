document.addEventListener('DOMContentLoaded', () => {

    /* =========================================
       1. HEADER DINÁMICO
       ========================================= */
    const header = document.getElementById('main-header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) header.classList.add('scrolled');
            else header.classList.remove('scrolled');
        });
    }

    /* =========================================
       2. SLIDER SWIPER (CONFIGURACIÓN 9 IMÁGENES)
       ========================================= */
    
    // Verificamos si Swiper cargó
    if (typeof Swiper !== 'undefined') {

        // --- A. SLIDER LATERAL (MINIATURAS) ---
        var navSlider = new Swiper('.nav-slider', {
            // IMPORTANTE: Aunque tengas 9 fotos, mostramos 6 para que se vean bien
            slidesPerView: 6, 
            spaceBetween: 0,
            
            // Loop activado para que gire infinitamente con tus 9 fotos
            loop: true, 
            // Esto ayuda a que el bucle sea suave
            loopAdditionalSlides: 6, 
            
            direction: 'vertical',
            speed: 1000,
            touchRatio: 0.2,
            slideToClickedSlide: true,
            centeredSlides: false, // Falso para evitar huecos
            on: {
                init: function() {
                    this.el.classList.remove('loading');
                },
                click: function() {
                    // Pausa el automático si tocan una miniatura
                    if (typeof mainSlider !== 'undefined') {
                        mainSlider.autoplay.stop();
                        setTimeout(() => {
                            mainSlider.autoplay.start();
                        }, 5000);
                    }
                }
            }
        });

        // --- B. SLIDER PRINCIPAL (GRANDE) ---
        var mainSlider = new Swiper('.main-slider', {
            loop: true,
            speed: 1000, // Transición suave
            
            // Efecto Desvanecer (Fade)
            effect: 'fade', 
            fadeEffect: { crossFade: true },
            
            autoplay: {
                delay: 3000,
                disableOnInteraction: false
            },
            
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            
            // CONEXIÓN CON MINIATURAS
            thumbs: {
                swiper: navSlider
            },
            
            on: {
                init: function() {
                    this.el.classList.remove('loading'); 
                    this.autoplay.start();
                },
                slideChangeTransitionStart: function() {
                    // Animación de salida del texto
                    let swiper = this;
                    let captions = swiper.el.querySelectorAll('.caption');
                    captions.forEach(c => {
                        c.style.opacity = '0';
                        c.style.transform = 'translateY(20px)';
                    });
                },
                slideChangeTransitionEnd: function() {
                    // Animación de entrada del texto
                    let swiper = this;
                    let activeSlide = swiper.slides[swiper.activeIndex];
                    if (activeSlide) {
                        let caption = activeSlide.querySelector('.caption');
                        if (caption) {
                            caption.style.opacity = '1';
                            caption.style.transform = 'translateY(0)';
                        }
                    }
                }
            }
        });

    } else {
        console.error("Swiper JS no cargó. Verifica tu conexión o el CDN.");
        document.querySelectorAll('.swiper-container').forEach(el => el.classList.remove('loading'));
    }


    /* =========================================
       3. EFECTO HOVER SERVICIOS
       ========================================= */
    const elements = document.querySelectorAll('.element');
    const stage = document.querySelector('.stage');
    
    if (stage && elements.length > 0) {
        elements.forEach(el => {
            el.addEventListener('mouseover', () => {
                elements.forEach(e => e.classList.remove('active', 'inactive'));
                el.classList.add('active');
                elements.forEach(e => { if (e !== el) e.classList.add('inactive'); });
            });
        });
        stage.addEventListener('mouseleave', () => {
            elements.forEach(e => e.classList.remove('active', 'inactive'));
        });
    }

    /* =========================================
       4. SCROLL REVEAL
       ========================================= */
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.15 });
    revealElements.forEach(el => revealObserver.observe(el));

    /* =========================================
       5. MENÚ MÓVIL
       ========================================= */
    const menuBtn = document.getElementById('mobile-btn');
    const navList = document.getElementById('nav-list');

    if (menuBtn && navList) {
        menuBtn.addEventListener('click', () => {
            navList.classList.toggle('active'); 
            const icon = menuBtn.querySelector('i');
            if (navList.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
        navList.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navList.classList.remove('active');
                const icon = menuBtn.querySelector('i');
                if(icon) {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            });
        });
    }
});

document.getElementById('bookingForm').addEventListener('submit', function(e) {
    e.preventDefault(); // Evita que la página se recargue

    // 1. Capturar valores
    const nombre = document.getElementById('nombre').value;
    const telefono = document.getElementById('telefono').value;
    const tratamiento = document.getElementById('tratamiento').value;
    const fecha = document.getElementById('fecha').value;
    const hora = document.getElementById('hora').value;

    // 2. Formatear el mensaje para WhatsApp
    // %0A crea un salto de línea
    const mensaje = `Hola, quiero reservar una cita desde la web.%0A%0A` +
                    `👤 *Nombre:* ${nombre}%0A` +
                    `📱 *Teléfono:* ${telefono}%0A` +
                    `🦷 *Tratamiento:* ${tratamiento}%0A` +
                    `📅 *Fecha deseada:* ${fecha}%0A` +
                    `⏰ *Hora:* ${hora}`;

    // 3. Tu número de WhatsApp (Código país + número)
    const numero = "51937273210"; 

    // 4. Crear URL y abrir
    const url = `https://wa.me/${numero}?text=${mensaje}`;
    window.open(url, '_blank');
});



const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15 
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            // Si el elemento entra en pantalla...
            if (entry.isIntersecting) {
                // ...le ponemos la clase 'active' para que se anime
                entry.target.classList.add('active');
                
                // (Opcional) Si quieres que se anime solo una vez y ya, descomenta la linea de abajo:
                // observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Buscamos todos los elementos con la clase "reveal" y los empezamos a vigilar
    const elementsToReveal = document.querySelectorAll('.reveal');
    elementsToReveal.forEach(el => {
        observer.observe(el);
    });


     const doctors = [
            { name: "Dr. Alex Ren", role: "Cirujano Maxilofacial", img: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=600&q=80" },
            { name: "Dra. Sarah Lee", role: "Ortodoncia Avanzada", img: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&w=600&q=80" },
            { name: "Dr. David Chen", role: "Estética Dental", img: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=600&q=80" },
            { name: "Dra. Maria Lopez", role: "Implantología", img: "https://images.unsplash.com/photo-1651008376811-b90baee60c1f?auto=format&fit=crop&w=600&q=80" },
            { name: "Dr. James Wilson", role: "Odontopediatría", img: "https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&w=600&q=80" } // Nuevo para probar 5 elementos
        ];

        const track = document.getElementById('doctorsTrack');
        const nameEl = document.getElementById('docName');
        const roleEl = document.getElementById('docRole');
        const dotsContainer = document.getElementById('dotsNav');
        const prevBtn = document.getElementById('prevDoc');
        const nextBtn = document.getElementById('nextDoc');
        const wrapper = document.getElementById('carouselWrapper');

        let currentIndex = 0;
        let cardSpacing = 180;

        function initCarousel() {
            // Limpiar track por si se reinicia
            track.innerHTML = '';
            dotsContainer.innerHTML = '';

            doctors.forEach((doc, index) => {
                const li = document.createElement('li');
                li.classList.add('carousel-card');
                li.innerHTML = `<img src="${doc.img}" alt="${doc.name}">`;
                li.addEventListener('click', () => {
                    currentIndex = index;
                    updateCarousel();
                });
                track.appendChild(li);

                const dot = document.createElement('div');
                dot.classList.add('dot');
                dot.addEventListener('click', () => {
                    currentIndex = index;
                    updateCarousel();
                });
                dotsContainer.appendChild(dot);
            });

            updateSpacing();
            updateCarousel();
            
            if (window.innerWidth <= 480) {
                document.getElementById('swipeHint').style.display = 'block';
            }
        }

        function updateSpacing() {
            const w = window.innerWidth;
            if (w > 768) { cardSpacing = 200; }
            else if (w > 480) { cardSpacing = 140; }
            else { cardSpacing = 110; }
        }

        function updateCarousel() {
            const cards = document.querySelectorAll('.carousel-card');
            const dots = document.querySelectorAll('.dot');
            const total = cards.length;

            cards.forEach((card, i) => {
                /* --- LÓGICA DE SIMETRÍA CORREGIDA --- */
                // Calculamos la distancia ideal en un círculo
                // Esto asegura que si tenemos 5 items, y estamos en el 0, 
                // los items 3 y 4 se consideren "a la izquierda" (-2 y -1) 
                // en lugar de "muy a la derecha" (3 y 4).
                
                let dist = (i - currentIndex) % total;
                if (dist < 0) dist += total; // Ajuste para negativos en JS
                
                // Si la distancia es mayor a la mitad, significa que el camino más corto
                // es por el otro lado (izquierda)
                if (dist > total / 2) {
                    dist -= total;
                }

                
                let xTrans = dist * cardSpacing;
                let scale = 0.8;
                // Z-index basado en cuán cerca del 0 (centro) está la distancia
                let zIndex = 10 - Math.abs(dist); 
                
                let filter = 'grayscale(100%) brightness(0.4) blur(1px)'; 
                let opacity = 0.5;

                if (i === currentIndex) {
                    xTrans = 0;
                    scale = 1.1; 
                    zIndex = 20; // Máxima prioridad
                    filter = 'grayscale(0%) brightness(1) blur(0)';
                    opacity = 1;
                    card.classList.add('active');
                } else {
                    card.classList.remove('active');
                }

                card.style.transform = `translateX(${xTrans}px) scale(${scale})`;
                card.style.zIndex = zIndex;
                card.style.filter = filter;
                card.style.opacity = opacity;
            });

            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === currentIndex);
            });

            animateText(doctors[currentIndex].name, doctors[currentIndex].role);
        }

        function animateText(name, role) {
            nameEl.classList.remove('text-visible');
            roleEl.classList.remove('text-visible');
            setTimeout(() => {
                nameEl.textContent = name;
                roleEl.textContent = role;
                nameEl.classList.add('text-visible');
                roleEl.classList.add('text-visible');
            }, 300);
        }

        function goNext() { currentIndex = (currentIndex + 1) % doctors.length; updateCarousel(); }
        function goPrev() { currentIndex = (currentIndex - 1 + doctors.length) % doctors.length; updateCarousel(); }

        nextBtn.addEventListener('click', goNext);
        prevBtn.addEventListener('click', goPrev);
        window.addEventListener('resize', () => { updateSpacing(); updateCarousel(); });

        let touchStartX = 0;
        let touchEndX = 0;
        wrapper.addEventListener('touchstart', e => { touchStartX = e.changedTouches[0].screenX; }, {passive: true});
        wrapper.addEventListener('touchend', e => { 
            touchEndX = e.changedTouches[0].screenX; 
            if (touchStartX - touchEndX > 50) goNext();
            if (touchEndX - touchStartX > 50) goPrev();
        }, {passive: true});

        initCarousel();


        // Configuración  de testimonios
    var testimSpeed = 4500; // Velocidad de cambio (4.5 segundos)
    
    // Variables
    var testim = document.getElementById("testimonials"),
        testimDots = Array.prototype.slice.call(document.getElementById("testim-dots").children),
        testimContent = Array.prototype.slice.call(document.getElementById("testim-content").children),
        testimLeftArrow = document.getElementById("left-arrow"),
        testimRightArrow = document.getElementById("right-arrow"),
        currentSlide = 0,
        currentActive = 0,
        testimTimer,
        touchStartPos,
        touchEndPos,
        touchPosDiff,
        ignoreTouch = 30;

    window.onload = function() {

        // Función principal para cambiar el slide
        function playSlide(slide) {
            for (var k = 0; k < testimDots.length; k++) {
                testimContent[k].classList.remove("active");
                testimContent[k].classList.remove("inactive");
                testimDots[k].classList.remove("active");
            }

            if (slide < 0) {
                slide = currentSlide = testimContent.length - 1;
            }

            if (slide > testimContent.length - 1) {
                slide = currentSlide = 0;
            }

            if (currentActive != currentSlide) {
                testimContent[currentActive].classList.add("inactive");
            }
            
            testimContent[slide].classList.add("active");
            testimDots[slide].classList.add("active");

            currentActive = currentSlide;
    
            // Reiniciar el temporizador para que no salte justo después de un click
            clearTimeout(testimTimer);
            testimTimer = setTimeout(function() {
                playSlide(currentSlide += 1);
            }, testimSpeed);
        }

        // Evento: Click Flecha Izquierda
        testimLeftArrow.addEventListener("click", function() {
            playSlide(currentSlide -= 1);
        });

        // Evento: Click Flecha Derecha
        testimRightArrow.addEventListener("click", function() {
            playSlide(currentSlide += 1);
        });

        // Evento: Click en los Puntos (Dots)
        for (var l = 0; l < testimDots.length; l++) {
            testimDots[l].addEventListener("click", function() {
                playSlide(currentSlide = testimDots.indexOf(this));
            });
        }

        // Evento: Teclado (Flechas izquierda/derecha)
        document.addEventListener("keyup", function(e) {
            switch (e.keyCode) {
                case 37: // Flecha Izquierda
                    testimLeftArrow.click();
                    break;
                case 39: // Flecha Derecha
                    testimRightArrow.click();
                    break;
            }
        });

        // Eventos: Táctil (Swipe para móviles)
        testim.addEventListener("touchstart", function(e) {
            touchStartPos = e.changedTouches[0].clientX;
        });

        testim.addEventListener("touchend", function(e) {
            touchEndPos = e.changedTouches[0].clientX;
            touchPosDiff = touchStartPos - touchEndPos;

            if (touchPosDiff > 0 + ignoreTouch) {
                testimLeftArrow.click(); // Deslizar izquierda
            } else if (touchPosDiff < 0 - ignoreTouch) {
                testimRightArrow.click(); // Deslizar derecha
            } 
        });

        // Iniciar el slider
        playSlide(currentSlide);
    }
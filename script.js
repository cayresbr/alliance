// script.js

// Language Management
let currentLanguage = 'en';
const languages = ['en', 'es', 'pt'];
const flagImages = {
    'en': 'usa.png',
    'es': 'esp.jpg',
    'pt': 'br.png'
};

// Hamburger Menu Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close menu when clicking on a link
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Enhanced language switcher animation
languageFlag.addEventListener('click', (e) => {
    // Add rotation animation
    languageFlag.style.transform = 'rotate(360deg) scale(1.2)';
    
    setTimeout(() => {
        const currentIndex = languages.indexOf(currentLanguage);
        const nextIndex = (currentIndex + 1) % languages.length;
        currentLanguage = languages[nextIndex];
        
        // Update flag image
        languageFlag.src = flagImages[currentLanguage];
        
        // Update all text elements
        updateLanguage();
        
        // Reset transform
        setTimeout(() => {
            languageFlag.style.transform = 'rotate(0deg) scale(1)';
        }, 100);
    }, 200);
});

function updateLanguage() {
    document.querySelectorAll('[data-en]').forEach(element => {
        const text = element.getAttribute(`data-${currentLanguage}`);
        if (text) {
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                element.placeholder = text;
            } else {
                element.textContent = text;
            }
        }
    });

    // Update select options
    const selectOptions = document.querySelectorAll('option[data-en]');
    selectOptions.forEach(option => {
        const text = option.getAttribute(`data-${currentLanguage}`);
        if (text) {
            option.textContent = text;
        }
    });

    // Update WhatsApp and SMS links
    updateContactLinks();
}

function updateContactLinks() {
    const messages = {
        en: 'Hello! I would like to request a quote for life and health insurance.',
        es: '¡Hola! Me gustaría solicitar una cotización para seguro de vida y salud.',
        pt: 'Olá! Gostaria de solicitar um orçamento para seguro de vida e saúde.'
    };

    const whatsappLink = document.querySelector('.whatsapp');
    const smsLink = document.querySelector('.sms');

    whatsappLink.href = `https://wa.me/19013959005?text=${encodeURIComponent(messages[currentLanguage])}`;
    smsLink.href = `sms:+19013959005&body=${encodeURIComponent(messages[currentLanguage])}`;
}

// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerOffset = 100;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Form Submission with Email
const quoteForm = document.getElementById('quoteForm');
const modal = document.getElementById('successModal');
const closeModal = document.querySelector('.close');

// Form Submission com FormSubmit via AJAX
quoteForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(quoteForm);
    
    // Mostrar loading
    const submitBtn = quoteForm.querySelector('.btn-submit');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span data-en="Sending..." data-es="Enviando..." data-pt="Enviando...">Sending...</span>';
    submitBtn.disabled = true;
    
    try {
        const response = await fetch('https://formsubmit.co/rafaelcayress@gmail.com', {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        });
        
        if (response.ok) {
            // Mostrar modal de sucesso
            modal.style.display = 'block';
            
            // Reset form
            quoteForm.reset();
            
            // Store in localStorage
            const quotes = JSON.parse(localStorage.getItem('quotes') || '[]');
            quotes.push({
                timestamp: new Date().toISOString()
            });
            localStorage.setItem('quotes', JSON.stringify(quotes));
        } else {
            alert('Erro ao enviar. Tente novamente.');
        }
    } catch (error) {
        alert('Erro ao enviar. Verifique sua conexão.');
    } finally {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
});

// Close modal
closeModal.addEventListener('click', () => {
    modal.style.display = 'none';
});

window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
    }
});

// Header scroll effect
let lastScroll = 0;
const header = document.querySelector('header');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
        header.style.boxShadow = '0 5px 20px rgba(0,0,0,0.1)';
    } else {
        header.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
    }

    lastScroll = currentScroll;
});

// Form validation enhancement
const inputs = document.querySelectorAll('input, select, textarea');

inputs.forEach(input => {
    input.addEventListener('blur', () => {
        if (input.value.trim() !== '' && input.checkValidity()) {
            input.style.borderColor = '#10b981';
        } else if (input.value.trim() !== '') {
            input.style.borderColor = '#ef4444';
        }
    });

    input.addEventListener('focus', () => {
        input.style.borderColor = '#3b82f6';
    });
});

// Phone number formatting
const phoneInput = document.getElementById('phone');
phoneInput.addEventListener('input', (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 0) {
        if (value.length <= 3) {
            value = `(${value}`;
        } else if (value.length <= 6) {
            value = `(${value.slice(0, 3)}) ${value.slice(3)}`;
        } else {
            value = `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6, 10)}`;
        }
    }
    e.target.value = value;
});

// Animate elements on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.service-card, .contact-card, .about-text, .about-image').forEach(el => {
    el.style.opacity = '0';
    observer.observe(el);
});

// Initialize language on page load
updateLanguage();

// Console log for testing
console.log('Alliance Insurance Agency - Website loaded successfully');
console.log('WhatsApp: +1 (901) 395-9005');
console.log('Current Language:', currentLanguage);
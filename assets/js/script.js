document.addEventListener('DOMContentLoaded', () => {

    // --- Mobile Navigation Toggle ---
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });

    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
            }
        });
    });

    // --- Light/Dark Mode Toggle ---
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        body.className = savedTheme; 
    } else {
        body.className = 'light-mode'; 
    }

    themeToggle.addEventListener('click', () => {
        if (body.classList.contains('light-mode')) {
            body.classList.replace('light-mode', 'dark-mode');
            localStorage.setItem('theme', 'dark-mode');
        } else {
            body.classList.replace('dark-mode', 'light-mode');
            localStorage.setItem('theme', 'light-mode');
        }
    });

    // --- Scroll Spy for Active Navigation Links ---
    const sections = document.querySelectorAll('section[id]');
    const navLinksList = document.querySelectorAll('.nav-links a');

    function highlightNavLink() {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100; 
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= sectionTop && pageYOffset < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinksList.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', highlightNavLink);
    highlightNavLink();

    // --- Unified Intersection Observer for Scroll Animations ---
    const animatedElements = document.querySelectorAll('[data-animation]');

    const animationObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const delay = parseInt(element.dataset.delay) || 0;

                setTimeout(() => {
                    element.classList.add('is-visible');
                }, delay);
                
                observer.unobserve(element);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    animatedElements.forEach(element => {
        animationObserver.observe(element);
    });

    // --- Project Details Modal ---
    const projectModal = document.getElementById('project-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalDescription = document.getElementById('modal-description');
    const modalDetails = document.getElementById('modal-details');
    const modalLinks = document.getElementById('modal-links');
    const modalCloseButton = document.querySelector('.modal-close');
    const viewDetailsButtons = document.querySelectorAll('.view-details-btn'); 

    const projectDetails = {
        "Lifewood Website": {
            title: "Laundry Management System",
            description: "Full-stack system for managing laundry pickup, delivery, and order tracking.",
            details: [{ label: "Technologies", value: "Flutter, Firebase, Dart" }]
        },
        "HR": {
            title: "AI Chatbot Application",
            description: "Chatbot built using AI API integration with real-time interaction.",
            details: [{ label: "Technologies", value: "HTML, CSS, JavaScript, Gemini API" }]
        },
        "Minesweeper": {
            title: "Fireboy & Watergirl Prototype",
            description: "4-hour game prototype developed in a hackathon.",
            details: [{ label: "Technologies", value: "JavaScript, HTML, CSS" }]
        }
    };

    function openModal(projectKey) {
        const projectData = projectDetails[projectKey];
        if (!projectData) return;

        modalTitle.textContent = projectData.title;
        modalDescription.textContent = projectData.description;
        modalDetails.innerHTML = ''; 
        modalLinks.innerHTML = ''; 

        projectModal.classList.add('active');
        body.classList.add('modal-open'); 
    }

    function closeModal() {
        projectModal.classList.remove('active');
        body.classList.remove('modal-open'); 
    }

    viewDetailsButtons.forEach(button => {
        button.addEventListener('click', () => {
            const projectKey = button.dataset.project; 
            openModal(projectKey);
        });
    });

    modalCloseButton.addEventListener('click', closeModal);
    projectModal.addEventListener('click', (e) => { if (e.target === projectModal) closeModal(); });

    // --- Image Modal (Lightbox) Logic ---
    const imageModal = document.getElementById('image-modal');
    const modalImageView = document.getElementById('modal-image-view');
    const imageModalClose = document.getElementById('image-modal-close');
    const certificateTriggers = document.querySelectorAll('.certificate-trigger');

    function openImageModal(imageSrc) {
        modalImageView.src = imageSrc;
        imageModal.classList.add('active');
        body.classList.add('modal-open');
    }

    function closeImageModal() {
        imageModal.classList.remove('active');
        body.classList.remove('modal-open');
        setTimeout(() => { modalImageView.src = ''; }, 300); 
    }

    certificateTriggers.forEach(button => {
        button.addEventListener('click', (e) => {
            const card = e.target.closest('.cert-card-horizontal');
            const imgSrc = card.querySelector('img').src;
            openImageModal(imgSrc);
        });
    });

    imageModalClose.addEventListener('click', closeImageModal);
    imageModal.addEventListener('click', (e) => { 
        if (e.target === imageModal) closeImageModal(); 
    });

    // --- Global Escape Key Listener ---
    document.addEventListener('keydown', (e) => { 
        if (e.key === 'Escape') {
            closeModal(); 
            closeImageModal(); 
        }
    });

    // --- Heart Like/Unlike Functionality ---
    const likeButton = document.getElementById('like-button');
    const likeCountDisplay = document.getElementById('like-count');
    const heartIcon = document.getElementById('heart-icon');
    
    let currentLikes = localStorage.getItem('portfolioLikes') ? parseInt(localStorage.getItem('portfolioLikes')) : 0;
    let hasLiked = localStorage.getItem('userHasLiked') === 'true';
    
    likeCountDisplay.textContent = currentLikes;
    if (hasLiked) {
        likeButton.classList.add('liked');
        heartIcon.classList.replace('far', 'fas'); 
    }

    likeButton.addEventListener('click', () => {
        if (hasLiked) {
            currentLikes--;
            hasLiked = false;
            likeButton.classList.remove('liked');
            heartIcon.classList.replace('fas', 'far'); 
        } else {
            currentLikes++;
            hasLiked = true;
            likeButton.classList.add('liked');
            heartIcon.classList.replace('far', 'fas'); 
            
            likeButton.classList.remove('pop');
            void likeButton.offsetWidth; 
            likeButton.classList.add('pop');
        }
        
        likeCountDisplay.textContent = currentLikes;
        localStorage.setItem('portfolioLikes', currentLikes);
        localStorage.setItem('userHasLiked', hasLiked);
    });

    // --- Video Demo Modal Logic ---
    const videoModal = document.getElementById('video-modal');
    const videoPlayer = document.getElementById('modal-video-player');
    const videoModalClose = document.getElementById('video-modal-close');
    const viewDemoButtons = document.querySelectorAll('.view-demo-btn');

    function openVideoModal(videoSrc) {
        // Set the source of the video player
        videoPlayer.src = videoSrc;
        videoModal.classList.add('active');
        body.classList.add('modal-open');
        
        // Auto-play the video when opened
        videoPlayer.play(); 
    }

    function closeVideoModal() {
        videoModal.classList.remove('active');
        body.classList.remove('modal-open');
        
        // Pause the video and clear the source when closing so it doesn't keep playing in the background
        videoPlayer.pause();
        setTimeout(() => {
            videoPlayer.src = "";
        }, 300);
    }

    viewDemoButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            // Grab the video path from the data-video attribute in the HTML
            const videoSrc = button.getAttribute('data-video');
            openVideoModal(videoSrc);
        });
    });

    videoModalClose.addEventListener('click', closeVideoModal);
    videoModal.addEventListener('click', (e) => { 
        if (e.target === videoModal) closeVideoModal(); 
    });

    // --- Global Escape Key Listener ---
    document.addEventListener('keydown', (e) => { 
        if (e.key === 'Escape') {
            closeModal(); 
            closeImageModal(); 
            if(typeof closeVideoModal === 'function') closeVideoModal(); // Added this line
        }
    });

});
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getFirestore, doc, getDoc, updateDoc, increment } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";
import { firebaseConfig } from "./config.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

document.addEventListener('DOMContentLoaded', async () => {

    // --- 1. Mobile Navigation Toggle ---
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle && navLinks) {
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
    }

    // --- 2. Light/Dark Mode Toggle ---
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;

    if (themeToggle) {
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
    }

    // --- 3. Scroll Spy for Active Navigation Links ---
    const sections = document.querySelectorAll('section[id]');
    const navLinksList = document.querySelectorAll('.nav-links a');

    function highlightNavLink() {
        if (sections.length === 0) return;

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
            if (current !== '' && link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', highlightNavLink);
    highlightNavLink();

    // --- 4. Scroll Animations (Intersection Observer) ---
    const animatedElements = document.querySelectorAll('[data-animation]');

    if (animatedElements.length > 0) {
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
    }

    // --- 5. Image Modal (Lightbox) Logic ---
    const imageModal = document.getElementById('image-modal');
    const modalImageView = document.getElementById('modal-image-view');
    const imageModalClose = document.getElementById('image-modal-close');
    const certificateTriggers = document.querySelectorAll('.certificate-trigger');

    if (imageModal && modalImageView && imageModalClose) {
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
                if (card) {
                    const imgSrc = card.querySelector('img').src;
                    openImageModal(imgSrc);
                }
            });
        });

        imageModalClose.addEventListener('click', closeImageModal);
        imageModal.addEventListener('click', (e) => {
            if (e.target === imageModal) closeImageModal();
        });
    }

    // --- 6. Heart Like/Unlike Functionality (Firebase) ---
    const likeButton = document.getElementById('like-button');
    const likeCountDisplay = document.getElementById('like-count');
    const heartIcon = document.getElementById('heart-icon');

    if (likeButton && likeCountDisplay && heartIcon) {
        const likeRef = doc(db, "portfolio", "likes");
        let hasLiked = localStorage.getItem('userHasLiked') === 'true';

        // Load current count from Firestore
        try {
            const snap = await getDoc(likeRef);
            if (snap.exists()) {
                likeCountDisplay.textContent = snap.data().count;
            }
        } catch (e) {
            console.error("Failed to load like count:", e);
        }

        // Restore liked state for this user
        if (hasLiked) {
            likeButton.classList.add('liked');
            heartIcon.classList.replace('far', 'fas');
        }

        likeButton.addEventListener('click', async () => {
            try {
                if (hasLiked) {
                    await updateDoc(likeRef, { count: increment(-1) });
                    hasLiked = false;
                    likeButton.classList.remove('liked');
                    heartIcon.classList.replace('fas', 'far');
                } else {
                    await updateDoc(likeRef, { count: increment(1) });
                    hasLiked = true;
                    likeButton.classList.add('liked');
                    heartIcon.classList.replace('far', 'fas');

                    likeButton.classList.remove('pop');
                    void likeButton.offsetWidth;
                    likeButton.classList.add('pop');
                }

                localStorage.setItem('userHasLiked', hasLiked);

                // Refresh count from Firestore
                const updated = await getDoc(likeRef);
                if (updated.exists()) {
                    likeCountDisplay.textContent = updated.data().count;
                }
            } catch (e) {
                console.error("Failed to update like count:", e);
            }
        });
    }

    // --- 7. Video Demo Modal Logic ---
    const videoModal = document.getElementById('video-modal');
    const videoPlayer = document.getElementById('modal-video-player');
    const videoModalClose = document.getElementById('video-modal-close');
    const viewDemoButtons = document.querySelectorAll('.view-demo-btn');

    if (videoModal && videoPlayer && videoModalClose) {
        function openVideoModal(videoSrc) {
            videoPlayer.src = videoSrc;
            videoModal.classList.add('active');
            body.classList.add('modal-open');
            videoPlayer.play();
        }

        function closeVideoModal() {
            videoModal.classList.remove('active');
            body.classList.remove('modal-open');
            videoPlayer.pause();
            setTimeout(() => {
                videoPlayer.src = "";
            }, 300);
        }

        viewDemoButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const videoSrc = button.getAttribute('data-video');
                if (videoSrc) openVideoModal(videoSrc);
            });
        });

        videoModalClose.addEventListener('click', closeVideoModal);
        videoModal.addEventListener('click', (e) => {
            if (e.target === videoModal) closeVideoModal();
        });
    }

    // --- 8. Floating Chat Widget Logic ---
    const chatToggleBtn = document.getElementById('chat-toggle-btn');
    const chatCloseBtn = document.getElementById('chat-close-btn');
    const chatPanel = document.getElementById('chat-panel');

    if (chatToggleBtn && chatPanel && chatCloseBtn) {
        chatToggleBtn.addEventListener('click', () => {
            chatPanel.classList.toggle('active');
        });

        chatCloseBtn.addEventListener('click', () => {
            chatPanel.classList.remove('active');
        });
    }

    // --- 9. Global Escape Key Listener ---
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (imageModal && imageModal.classList.contains('active')) {
                imageModal.classList.remove('active');
                body.classList.remove('modal-open');
            }
            if (videoModal && videoModal.classList.contains('active')) {
                videoModal.classList.remove('active');
                body.classList.remove('modal-open');
                if (videoPlayer) videoPlayer.pause();
            }
            if (chatPanel && chatPanel.classList.contains('active')) {
                chatPanel.classList.remove('active');
            }
        }
    });

    // --- 10. 3D Project Gallery Logic ---
    const galleryContainers = document.querySelectorAll('.project-gallery-container');

    galleryContainers.forEach(container => {
        const track = container.querySelector('.gallery-track');
        const items = Array.from(track.querySelectorAll('.gallery-item'));
        const prevBtn = container.querySelector('.gallery-nav.prev');
        const nextBtn = container.querySelector('.gallery-nav.next');
        const dotsContainer = container.nextElementSibling;

        if (items.length === 0) return;

        let currentIndex = 0;

        items.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.classList.add('gallery-dot');
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(index));
            dotsContainer.appendChild(dot);
        });

        const dots = Array.from(dotsContainer.querySelectorAll('.gallery-dot'));

        function updateGallery() {
            items.forEach((item, index) => {
                item.className = 'gallery-item';
                let diff = index - currentIndex;
                if (diff < -Math.floor(items.length / 2)) diff += items.length;
                if (diff > Math.floor(items.length / 2)) diff -= items.length;

                if (diff === 0) item.classList.add('active');
                else if (diff === -1) item.classList.add('prev-1');
                else if (diff === 1) item.classList.add('next-1');
                else if (diff === -2) item.classList.add('prev-2');
                else if (diff === 2) item.classList.add('next-2');
            });

            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentIndex);
            });
        }

        function goToSlide(index) {
            currentIndex = index;
            updateGallery();
        }

        function nextSlide() {
            currentIndex = (currentIndex + 1) % items.length;
            updateGallery();
        }

        function prevSlide() {
            currentIndex = (currentIndex - 1 + items.length) % items.length;
            updateGallery();
        }

        if (prevBtn) prevBtn.addEventListener('click', prevSlide);
        if (nextBtn) nextBtn.addEventListener('click', nextSlide);

        items.forEach((item, index) => {
            item.addEventListener('click', () => {
                if (!item.classList.contains('active')) {
                    goToSlide(index);
                    return;
                }
                const images = items.map(i => i.querySelector('img').src);
                openGalleryModal(images, currentIndex);
            });
        });

        updateGallery();
    });

    // --- Gallery Modal with nav + thumbs ---
    function openGalleryModal(images, startIndex) {
        const modal = document.getElementById('image-modal');
        const modalImg = document.getElementById('modal-image-view');
        const counter = document.getElementById('image-modal-counter');
        const thumbsContainer = document.getElementById('image-modal-thumbs');
        const prevBtn = document.getElementById('image-modal-prev');
        const nextBtn = document.getElementById('image-modal-next');
        if (!modal || !modalImg) return;

        let current = startIndex;

        thumbsContainer.innerHTML = '';
        images.forEach((src, i) => {
            const thumb = document.createElement('img');
            thumb.src = src;
            thumb.alt = `Thumbnail ${i + 1}`;
            thumb.addEventListener('click', () => goTo(i));
            thumbsContainer.appendChild(thumb);
        });

        function goTo(index) {
            current = (index + images.length) % images.length;
            modalImg.src = images[current];
            counter.textContent = `${current + 1} / ${images.length}`;
            thumbsContainer.querySelectorAll('img').forEach((t, i) => {
                t.classList.toggle('active', i === current);
            });
        }

        prevBtn.onclick = () => goTo(current - 1);
        nextBtn.onclick = () => goTo(current + 1);

        function handleKey(e) {
            if (!modal.classList.contains('active')) return;
            if (e.key === 'ArrowRight') goTo(current + 1);
            if (e.key === 'ArrowLeft') goTo(current - 1);
        }
        document.addEventListener('keydown', handleKey);

        modal.addEventListener('click', function cleanup(e) {
            if (e.target === modal) {
                document.removeEventListener('keydown', handleKey);
                modal.removeEventserListener('click', cleanup);
            }
        });

        goTo(current);
        modal.classList.add('active');
        document.body.classList.add('modal-open');
    }

});
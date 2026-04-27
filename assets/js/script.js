import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getFirestore, doc, getDoc, updateDoc, increment } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";
import { firebaseConfig, geminiApiKey } from "./config.js";

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

        // Project image preview — clicking the image wrapper opens the modal
        const projectImgTriggers = document.querySelectorAll('.project-img-trigger');
        projectImgTriggers.forEach(wrapper => {
            wrapper.addEventListener('click', () => {
                const img = wrapper.querySelector('img');
                if (img) openImageModal(img.src);
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

        try {
            const snap = await getDoc(likeRef);
            if (snap.exists()) {
                likeCountDisplay.textContent = snap.data().count;
            }
        } catch (e) {
            console.error("Failed to load like count:", e);
        }

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

    // --- 8. Floating Chat Widget Logic + Gemini AI ---
    const chatToggleBtn = document.getElementById('chat-toggle-btn');
    const chatCloseBtn  = document.getElementById('chat-close-btn');
    const chatPanel     = document.getElementById('chat-panel');
    const chatInput     = document.querySelector('.chat-input');
    const chatSendBtn   = document.querySelector('.chat-send-btn');
    const chatBody      = document.querySelector('.chat-body');

    if (chatToggleBtn && chatPanel && chatCloseBtn) {
        chatToggleBtn.addEventListener('click', () => chatPanel.classList.toggle('active'));
        chatCloseBtn.addEventListener('click',  () => chatPanel.classList.remove('active'));
    }

    const SYSTEM_PROMPT = `You are a helpful assistant on Raysel Sabellano's portfolio website.
Answer questions about Raysel naturally and concisely. Here are the facts:

- Full name: Raysel Sabellano
- Role: Junior Full-Stack Developer based in Cebu, Philippines
- Skills: HTML, CSS, JavaScript, React, Flutter, Dart, Java, Python, PHP, MySQL, Node.js, Firebase, IndexedDB
- Projects: Laundry Management System, Lifewood POS System, Posture Detection App, Minesweeper game
- Contact: sabellanoraysel16@gmail.com | +639053446245
- GitHub: github.com/Rays30 | LinkedIn: linkedin.com/in/raysel-sabellano-806959397
- Quote: "Code. Learn. Build. Repeat."

If asked something unrelated to Raysel or web development, politely redirect.
Keep replies short — 2 to 4 sentences max.`;

    function appendMessage(text, role) {
        const div = document.createElement('div');
        div.classList.add('chat-message', role === 'user' ? 'user-message' : 'bot-message');
        div.innerHTML = `<p>${text}</p><span class="message-time">Just now</span>`;
        chatBody.appendChild(div);
        chatBody.scrollTop = chatBody.scrollHeight;
    }

    function appendTyping() {
        const div = document.createElement('div');
        div.classList.add('chat-message', 'bot-message');
        div.id = 'typing-indicator';
        div.innerHTML = `<p style="color: var(--text-secondary); font-style: italic;">Typing...</p>`;
        chatBody.appendChild(div);
        chatBody.scrollTop = chatBody.scrollHeight;
    }

    async function sendToGemini(userMessage) {
        appendTyping();

        try {
            // Using v1beta and gemini-2.0-flash (the model your new project supports)
            const res = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiApiKey}`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        systemInstruction: {
                            parts: [{ text: SYSTEM_PROMPT }]
                        },
                        contents: [
                            { role: 'user', parts: [{ text: userMessage }] }
                        ]
                    })
                }
            );

            const data = await res.json();

            if (!res.ok) {
                console.error("Gemini API error:", data.error?.message || data);
                document.getElementById('typing-indicator')?.remove();
                appendMessage("Sorry, I couldn't get a response. Try again!", 'bot');
                return;
            }

            const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't get a response. Try again!";
            document.getElementById('typing-indicator')?.remove();
            appendMessage(reply, 'bot');

        } catch (err) {
            console.error("Gemini fetch error:", err);
            document.getElementById('typing-indicator')?.remove();
            appendMessage("Something went wrong. Please try again!", 'bot');
        }
    }

    let isSending = false;

    function handleSend() {
        if (isSending) return;
        const msg = chatInput.value.trim();
        if (!msg) return;

        isSending = true;
        chatSendBtn.disabled = true;
        chatInput.disabled = true;

        appendMessage(msg, 'user');
        chatInput.value = '';

        sendToGemini(msg).finally(() => {
            isSending = false;
            chatSendBtn.disabled = false;
            chatInput.disabled = false;
            chatInput.focus();
        });
    }

    chatSendBtn?.addEventListener('click', handleSend);
    chatInput?.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') handleSend();
    });

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

    // --- 10. 3D Project Gallery Logic (Standard) ---
    const hasTabbedGallery = document.querySelector('.gallery-tab');

    if (!hasTabbedGallery) {
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
    }

    // --- Shared Gallery Modal with nav + thumbs ---
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
                modal.removeEventListener('click', cleanup);
            }
        });

        goTo(current);
        modal.classList.add('active');
        document.body.classList.add('modal-open');
    }

    // --- 11. Tabbed Gallery Logic (project-laundry.html) ---
    const galleryTabs = document.querySelectorAll('.gallery-tab:not(.coming-soon)');

    if (galleryTabs.length > 0) {
        const allItems = document.querySelectorAll('.gallery-item');
        const dotsContainer = document.querySelector('.gallery-dots');
        const prevBtn = document.querySelector('.gallery-nav.prev');
        const nextBtn = document.querySelector('.gallery-nav.next');

        let currentGroup = 'customer';
        let currentIndex = 0;

        function getGroupItems() {
            return [...allItems].filter(el => el.dataset.group === currentGroup);
        }

        function buildDots(items) {
            dotsContainer.innerHTML = '';
            items.forEach((_, i) => {
                const dot = document.createElement('button');
                dot.className = 'gallery-dot' + (i === currentIndex ? ' active' : '');
                dot.addEventListener('click', () => tabbedGoTo(i));
                dotsContainer.appendChild(dot);
            });
        }

        function updateDots() {
            dotsContainer.querySelectorAll('.gallery-dot').forEach((d, i) => {
                d.classList.toggle('active', i === currentIndex);
            });
        }

        function applyPositions() {
            const items = getGroupItems();
            allItems.forEach(el => { el.className = 'gallery-item'; });

            const classes = ['prev-2', 'prev-1', 'active', 'next-1', 'next-2'];
            const offsets = [-2, -1, 0, 1, 2];

            offsets.forEach((offset, ci) => {
                const idx = (currentIndex + offset + items.length) % items.length;
                if (items[idx]) items[idx].className = 'gallery-item ' + classes[ci];
            });

            updateDots();
        }

        function tabbedGoTo(index) {
            const items = getGroupItems();
            currentIndex = (index + items.length) % items.length;
            applyPositions();
        }

        function switchGroup(group) {
            currentGroup = group;
            currentIndex = 0;
            const items = getGroupItems();
            buildDots(items);
            applyPositions();
        }

        galleryTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                galleryTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                switchGroup(tab.dataset.group);
            });
        });

        prevBtn.addEventListener('click', () => tabbedGoTo(currentIndex - 1));
        nextBtn.addEventListener('click', () => tabbedGoTo(currentIndex + 1));

        document.addEventListener('keydown', e => {
            const modal = document.getElementById('image-modal');
            if (modal && modal.classList.contains('active')) return;
            if (e.key === 'ArrowLeft') tabbedGoTo(currentIndex - 1);
            if (e.key === 'ArrowRight') tabbedGoTo(currentIndex + 1);
        });

        allItems.forEach(item => {
            item.addEventListener('click', () => {
                const items = getGroupItems();
                const idx = items.indexOf(item);
                if (idx === -1) return;

                if (!item.classList.contains('active')) {
                    tabbedGoTo(idx);
                    return;
                }

                const images = items.map(i => i.querySelector('img').src);
                openGalleryModal(images, currentIndex);
            });
        });

        switchGroup('customer');
    }

    // --- 12. Contact Form (EmailJS) ---
    const contactForm = document.getElementById("contact-form");
    if (contactForm) {
        emailjs.init("ah4oIE440AM0t21ja");

        contactForm.addEventListener("submit", function (e) {
            e.preventDefault();
            const btn = document.getElementById("send-btn");
            const status = document.getElementById("form-status");
            btn.disabled = true;
            btn.textContent = "Sending...";
            status.textContent = "";

            emailjs.send("service_nj5oej8", "template_gvwk33q", {
                from_name: document.getElementById("from_name").value,
                subject:   document.getElementById("subject").value,
                message:   document.getElementById("message").value,
            })
            .then(() => {
                status.textContent = "✅ Message sent! I'll get back to you soon.";
                status.style.color = "#C4956A";
                contactForm.reset();
            })
            .catch(() => {
                status.textContent = "❌ Something went wrong. Please try again.";
                status.style.color = "#f87171";
            })
            .finally(() => {
                btn.disabled = false;
                btn.textContent = "Send Message";
            });
        });
    }


// --- 13. Tech Stack Carousel — Infinite Single Item Loop ---
    const techTrack = document.getElementById('tech-track');
    const techPrev = document.getElementById('tech-prev');
    const techNext = document.getElementById('tech-next');

    if (techTrack && techPrev && techNext) {
        let isAnimating = false;

        // Calculate exactly how far to slide (1 column width + 1 gap)
        function getShiftAmount() {
            const column = techTrack.children[0];
            const gap = parseFloat(getComputedStyle(techTrack).gap) || 24;
            return column.offsetWidth + gap;
        }

        techNext.addEventListener('click', () => {
            if (isAnimating) return;
            isAnimating = true;

            const shift = getShiftAmount();
            
            // 1. Animate sliding to the left
            techTrack.style.transition = 'transform 0.4s ease-in-out';
            techTrack.style.transform = `translateX(-${shift}px)`;

            // 2. When animation finishes, move the first item to the back
            techTrack.addEventListener('transitionend', function handler() {
                techTrack.removeEventListener('transitionend', handler);
                
                techTrack.style.transition = 'none'; // Turn off animation instantly
                techTrack.appendChild(techTrack.firstElementChild); // Move DOM element
                techTrack.style.transform = 'translateX(0)'; // Reset position
                
                // Force browser to register the reset before allowing next click
                void techTrack.offsetWidth; 
                isAnimating = false;
            });
        });

        techPrev.addEventListener('click', () => {
            if (isAnimating) return;
            isAnimating = true;

            const shift = getShiftAmount();
            
            // 1. Instantly move the last item to the front and offset the track
            techTrack.style.transition = 'none';
            techTrack.prepend(techTrack.lastElementChild);
            techTrack.style.transform = `translateX(-${shift}px)`;
            
            // Force browser to register the instant move
            void techTrack.offsetWidth;

            // 2. Animate sliding back to 0
            techTrack.style.transition = 'transform 0.4s ease-in-out';
            techTrack.style.transform = 'translateX(0)';

            techTrack.addEventListener('transitionend', function handler() {
                techTrack.removeEventListener('transitionend', handler);
                isAnimating = false;
            });
        });

        // Optional: Auto-slide every 4 seconds
        let autoSlide = setInterval(() => techNext.click(), 4000);
        
        const wrapper = document.querySelector('.tech-carousel-wrapper');
        wrapper.addEventListener('mouseenter', () => clearInterval(autoSlide));
        wrapper.addEventListener('mouseleave', () => {
            autoSlide = setInterval(() => techNext.click(), 4000);
        });
    }

}); // end DOMContentLoadeds
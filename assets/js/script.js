document.addEventListener('DOMContentLoaded', () => {

    // --- Mobile Navigation Toggle ---
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });

    // Close mobile menu when a nav link is clicked
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
            }
        });
    });


    // --- Light/Dark Mode Toggle and Image Swapping ---
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    // Select all images that have the 'data-dark-src' attribute for theme swapping
    const themeSwapImages = document.querySelectorAll('img[data-dark-src]');

    // Function to apply the correct image src based on the current theme
    function applyImageTheme() {
        themeSwapImages.forEach(img => {
            // Get the original (light mode) src and the dark mode src
            const lightSrc = img.dataset.lightSrc || img.src; // Use current src if lightSrc not stored yet
            const darkSrc = img.dataset.darkSrc;

            // Update the src based on the body's class
            if (body.classList.contains('light-mode')) {
                img.src = lightSrc;
            } else {
                img.src = darkSrc;
            }
            // Store the lightSrc back in case it was the dark one initially
            img.dataset.lightSrc = lightSrc;
        });
    }

    // Check for saved theme in localStorage or default to dark
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        body.classList.add(savedTheme);
        if (savedTheme === 'light-mode') {
            themeToggle.querySelector('i').classList.replace('fa-moon', 'fa-sun');
        }
    } else {
        // Default to dark mode if no preference is saved
        body.classList.add('dark-mode'); // Ensure initial state is dark-mode
    }
    // Apply image theme immediately after setting the initial body class
    applyImageTheme();

    themeToggle.addEventListener('click', () => {
        if (body.classList.contains('light-mode')) {
            body.classList.replace('light-mode', 'dark-mode');
            themeToggle.querySelector('i').classList.replace('fa-sun', 'fa-moon');
            localStorage.setItem('theme', 'dark-mode');
        } else {
            body.classList.replace('dark-mode', 'light-mode');
            themeToggle.querySelector('i').classList.replace('fa-moon', 'fa-sun');
            localStorage.setItem('theme', 'light-mode');
        }
        applyImageTheme(); // Call after theme class is toggled
    });


    // --- Scroll Spy for Active Navigation Links ---
    const sections = document.querySelectorAll('section[id]');
    const navLinksList = document.querySelectorAll('.nav-links a');

    function highlightNavLink() {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 70; // Adjust for fixed navbar height
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
    highlightNavLink(); // Call on load to set initial active link


    // --- Intersection Observer for Project Card Fade-in Animation ---
    const projectCards = document.querySelectorAll('.project-card');

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const projectObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    projectCards.forEach(card => {
        projectObserver.observe(card);
    });

    // --- Project Details Modal ---
    const projectModal = document.getElementById('project-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalDescription = document.getElementById('modal-description');
    const modalDetails = document.getElementById('modal-details');
    const modalLinks = document.getElementById('modal-links');
    const modalCloseButton = document.querySelector('.modal-close');
    const viewDetailsButtons = document.querySelectorAll('.view-details-btn'); // Select all "View details" buttons

    // Developer Note: Define your project details here.
    // Use the 'data-project' attribute from your HTML buttons as keys.
    const projectDetails = {
        "Lifewood Website": {
            title: "Lifewood Website Prototype",
            description: "A fully responsive and modern website inspired by Lifewood's branding. Built using AI-assisted design tools, this project replicates the structure of the original company site while using entirely original content and layout choices.",
            details: [
                { label: "Role", value: "Solo Front-End Developer" },
                { label: "Technologies Used", value: "HTML, CSS, JavaScript" },
                {
                    label: "Key Features",
                    value: [
                        "Homepage, About, Services, Contact",
                        "Mobile and desktop responsive layout",
                        "Branding inspired by Lifewood (fonts, colors, UI patterns)",
                        "Original text and visuals (no copy-paste)",
                        "AI-assisted layout and structure"
                    ]
                }
            ],
            // IMPORTANT: Replace these with your actual links!
            liveLink: "https://lifewood-website.vercel.app", 
            githubLink: "https://github.com/Rays30/Lifewood-Website-Prototype-/tree/main/Lifewood%20WebsiteFinal"
        },
        "HR": {
            title: "LIFEWOOD WEBSITE(REACT JS)",
            description: "A fully responsive, modern web application re-imagined with React.js, strictly adhering to Lifewood's brand identity. This project showcases component-based architecture, efficient state management, and leverages AI for creative content generation and design exploration, extending beyond a static prototype.",
            details: [
                { label: "Technologies Used", value: "React.js, JavaScript (ES6+), HTML5, CSS3 (modules/styled-components), npm/yarn, Git, AI tools (e.g., for content/design inspiration)" },
                {
                    label: "Key Features",
                    value: [
                        "Component-based UI architecture for scalability and reusability",
                        "Client-side routing for seamless navigation (e.g., Home, About, Services, Contact)",
                        "Interactive elements and dynamic content rendering",
                        "Mobile-first responsive design across all breakpoints",
                        "Strict adherence to Lifewood branding guidelines (colors, fonts, logo integration)",
                        "Original, AI-assisted content and design concepts",
                        "Optimized for performance and user experience"
                    ]
                }
            ],
            liveLink: "https://raysel-portfolio.vercel.app/", // Placeholder
            githubLink: "https://github.com/Rays30/lifewood-react-website" // Placeholder
        },
        "Future": {
            title: "More Projects Coming Soon...",
            description: "This slot is reserved for exciting new projects! I'm constantly exploring and building. Check back soon for showcases in areas like [e.g., React development, Python automation, UI/UX design].",
            details: [], // No specific details for placeholder
            liveLink: "#",
            githubLink: "#"
        }
    };

    function openModal(projectKey) {
        const projectData = projectDetails[projectKey];

        if (!projectData) {
            console.error(`No data found for project: ${projectKey}`);
            return;
        }

        modalTitle.textContent = projectData.title;
        modalDescription.textContent = projectData.description;
        modalDetails.innerHTML = ''; // Clear previous details

        if (projectData.details && projectData.details.length > 0) {
            const ul = document.createElement('ul');
            projectData.details.forEach(detail => {
                const li = document.createElement('li');
                if (Array.isArray(detail.value)) {
                    // For Key Features, create sub-list or multiple lines
                    // Ensure the strong tag is within the <li> and bolding the label
                    li.innerHTML = `<strong>${detail.label}:</strong><br>` + detail.value.map(item => `    • ${item}`).join('<br>');
                } else {
                    li.innerHTML = `<strong>${detail.label}:</strong> ${detail.value}`;
                }
                ul.appendChild(li);
            });
            modalDetails.appendChild(ul);
        }

        modalLinks.innerHTML = ''; // Clear previous links
        // Dynamically add Live Link if available
        if (projectData.liveLink && projectData.liveLink !== "#") {
            const liveLink = document.createElement('a');
            liveLink.href = projectData.liveLink;
            liveLink.target = "_blank";
            liveLink.rel = "noopener noreferrer";
            liveLink.innerHTML = '<i class="fas fa-external-link-alt"></i> View Project';
            modalLinks.appendChild(liveLink);
        }
        // Dynamically add GitHub Link if available
        if (projectData.githubLink && projectData.githubLink !== "#") {
            const githubLink = document.createElement('a');
            githubLink.href = projectData.githubLink;
            githubLink.target = "_blank";
            githubLink.rel = "noopener noreferrer";
            githubLink.innerHTML = '<i class="fab fa-github"></i> View Code';
            modalLinks.appendChild(githubLink);
        }


        projectModal.classList.add('active');
        body.classList.add('modal-open'); // Disable body scroll
    }

    function closeModal() {
        projectModal.classList.remove('active');
        body.classList.remove('modal-open'); // Re-enable body scroll
    }

    // Add event listeners to all "View details" buttons
    viewDetailsButtons.forEach(button => {
        button.addEventListener('click', () => {
            const projectKey = button.dataset.project; // Get project key from data-project attribute
            openModal(projectKey);
        });
    });

    // Add event listener to modal close button
    modalCloseButton.addEventListener('click', closeModal);

    // Close modal if overlay is clicked (outside modal content)
    projectModal.addEventListener('click', (event) => {
        if (event.target === projectModal) {
            closeModal();
        }
    });

    // Close modal if Escape key is pressed
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && projectModal.classList.contains('active')) {
            closeModal();
        }
    });

});

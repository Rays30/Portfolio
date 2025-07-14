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
            title: "HR Dashboard",
            description: "This Power BI dashboard provides comprehensive People Analytics, offering insights into employee profiles, salary structures, turnover rates, admissions trends, and team demographics to support strategic HR decision-making.",
            details: [
                { label: "Technologies Used", value: "Power BI, Excel" },
                {
                    label: "Key Indicators",
                    value: [
                        "Employee profiles & demographics",
                        "Salary range analysis",
                        "Employee turnover and admission trends",
                        "Team seniority levels by area/age group"
                    ]
                }
            ],
            liveLink: "https://_YOUR_HR_DASHBOARD_LIVE_DEMO_URL_", // Placeholder
            githubLink: "https://github.com/_YOUR_USERNAME_/HR-Dashboard-Repo" // Placeholder
        },
        "Logistics": {
            title: "Logistics Dashboard",
            description: "An interactive Power BI dashboard designed for robust stock control and logistics performance analysis. It tracks key supply chain metrics to optimize inventory management and reduce costs.",
            details: [
                { label: "Technologies Used", value: "Power BI, SQL (simulated data)" },
                {
                    label: "Key Indicators",
                    value: [
                        "Stockouts & inventory turnover rate",
                        "Stock value by storage area, supplier, and SKU",
                        "ABC classification of items",
                        "Warehouse occupancy dynamics"
                    ]
                }
            ],
            liveLink: "https://_YOUR_LOGISTICS_DASHBOARD_LIVE_DEMO_URL_", // Placeholder
            githubLink: "https://github.com/_YOUR_USERNAME_/Logistics-Dashboard-Repo" // Placeholder
        },
        "Production": {
            title: "Production Dashboard",
            description: "A comprehensive production control tower dashboard that provides real-time insights into manufacturing operations, focusing on efficiency, quality, and equipment performance.",
            details: [
                { label: "Technologies Used", value: "Power BI, Manufacturing Data Source" },
                {
                    label: "Key Indicators",
                    value: [
                        "Overall Equipment Effectiveness (OEE): Availability, Performance, Quality",
                        "Ranking of production rejections",
                        "Analysis of operational occurrences",
                        "Machine downtime and utilization"
                    ]
                }
            ],
            liveLink: "https://_YOUR_PRODUCTION_DASHBOARD_LIVE_DEMO_URL_", // Placeholder
            githubLink: "https://github.com/_YOUR_USERNAME_/Production-Dashboard-Repo" // Placeholder
        },
        "Customer NPS": {
            title: "Customer NPS Dashboard",
            description: "This Power BI dashboard evaluates customer satisfaction and loyalty using Net Promoter Score (NPS) and Customer Satisfaction (CSAT) metrics, breaking down results by various demographics.",
            details: [
                { label: "Technologies Used", value: "Power BI, Survey Data (e.g., Excel, CSV)" },
                {
                    label: "Key Indicators",
                    value: [
                        "Net Promoter Score (NPS) calculation",
                        "Customer Satisfaction (CSAT) score",
                        "Breakdown of scores by location, manager, and category",
                        "Trend analysis of customer feedback over time"
                    ]
                }
            ],
            liveLink: "https://_YOUR_CUSTOMER_NPS_DASHBOARD_LIVE_DEMO_URL_", // Placeholder
            githubLink: "https://github.com/_YOUR_USERNAME_/Customer-NPS-Dashboard-Repo" // Placeholder
        },
        "Marketing": {
            title: "Marketing Dashboard",
            description: "An analytical dashboard for monitoring paid traffic campaigns and lead conversion funnels, providing a clear overview of marketing investment effectiveness and key performance metrics.",
            details: [
                { label: "Technologies Used", value: "Power BI, Google Ads Data, Facebook Ads Data" },
                {
                    label: "Key Indicators",
                    value: [
                        "Paid traffic investment by channel (Google Ads, Facebook Ads)",
                        "Lead conversion funnel analysis",
                        "Customer Acquisition Cost (CAC)",
                        "Return on Ad Spend (ROAS)",
                        "Cost Per Click (CPC), Impressions, Reach"
                    ]
                }
            ],
            liveLink: "https://_YOUR_MARKETING_DASHBOARD_LIVE_DEMO_URL_", // Placeholder
            githubLink: "https://github.com/_YOUR_USERNAME_/Marketing-Dashboard-Repo" // Placeholder
        },
        "Inventory": {
            title: "Inventory Dashboard",
            description: "A dynamic Power BI solution for real-time inventory overview, value tracking, and warehouse optimization. It provides detailed insights into stock movement and classification.",
            details: [
                { label: "Technologies Used", value: "Power BI, Supply Chain Data" },
                {
                    label: "Key Indicators",
                    value: [
                        "Stock value by supplier, SKU, and storage area",
                        "ABC classification of items",
                        "Dynamic visibility of warehouse occupancy",
                        "Breakdown by supplier and product categories"
                    ]
                }
            ],
            liveLink: "https://_YOUR_INVENTORY_DASHBOARD_LIVE_DEMO_URL_", // Placeholder
            githubLink: "https://github.com/_YOUR_USERNAME_/Inventory-Dashboard-Repo" // Placeholder
        },
        "Finance": {
            title: "Finance Dashboard",
            description: "A comprehensive financial dashboard designed to monitor cash flow, analyze profit margins, and categorize expenses, providing a clear picture of the company's financial health.",
            details: [
                { label: "Technologies Used", value: "Power BI, Financial Data (e.g., ERP export)" },
                {
                    label: "Key Indicators",
                    value: [
                        "Cash flow evolution over time",
                        "Profit margin (%) calculation",
                        "Expenses categorized by type",
                        "Representativeness of expenses by sector/department"
                    ]
                }
            ],
            liveLink: "https://_YOUR_FINANCE_DASHBOARD_LIVE_DEMO_URL_", // Placeholder
            githubLink: "https://github.com/_YOUR_USERNAME_/Finance-Dashboard-Repo" // Placeholder
        },
        "Purchasing": {
            title: "Purchasing Dashboard",
            description: "This Power BI dashboard offers deep insights into purchasing trends and supplier performance, optimizing procurement processes and ensuring cost-effectiveness.",
            details: [
                { label: "Technologies Used", value: "Power BI, Purchasing Data" },
                {
                    label: "Key Indicators",
                    value: [
                        "Evolution of average purchase price over time",
                        "Analysis of main categories and SKUs",
                        "Supplier performance (quality and delivery metrics)",
                        "Supplier ranking and share percentage"
                    ]
                }
            ],
            liveLink: "https://_YOUR_PURCHASING_DASHBOARD_LIVE_DEMO_URL_", // Placeholder
            githubLink: "https://github.com/_YOUR_USERNAME_/Purchasing-Dashboard-Repo" // Placeholder
        },
        "Projects": {
            title: "Projects Dashboard",
            description: "A robust project management dashboard for tracking project evolution, managing schedules, monitoring activity statuses, and assessing team workload to ensure successful project delivery.",
            details: [
                { label: "Technologies Used", value: "Power BI, Project Management Software Data" },
                {
                    label: "Key Indicators",
                    value: [
                        "Project evolution tracking (e.g., S-Curve)",
                        "Schedule adherence and completion status",
                        "Activity status and progress",
                        "Team workload distribution",
                        "Identification of critical activities/paths"
                    ]
                }
            ],
            liveLink: "https://_YOUR_PROJECTS_DASHBOARD_LIVE_DEMO_URL_", // Placeholder
            githubLink: "https://github.com/_YOUR_USERNAME_/Projects-Dashboard-Repo" // Placeholder
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
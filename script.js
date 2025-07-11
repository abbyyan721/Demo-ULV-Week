// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initMobileMenu();
    initSmoothScrolling();
    initScrollAnimations();
    initHeaderScroll();
    initCTAButtons();
    setupGolfAnalysisForm();
});

// Mobile Menu Functionality
function initMobileMenu() {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const nav = document.querySelector('.nav');
    
    if (mobileMenuToggle && nav) {
        mobileMenuToggle.addEventListener('click', function() {
            nav.classList.toggle('active');
            mobileMenuToggle.classList.toggle('active');
        });
        
        // Close mobile menu when clicking on a link
        const navLinks = nav.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                nav.classList.remove('active');
                mobileMenuToggle.classList.remove('active');
            });
        });
    }
}

// Smooth Scrolling for Navigation Links
function initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Scroll Animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll('.feature-card, .testimonial-card, .step');
    animateElements.forEach(el => {
        observer.observe(el);
    });
}

// Header Scroll Effect
function initHeaderScroll() {
    const header = document.querySelector('.header');
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Add/remove scrolled class for styling
        if (scrollTop > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Hide/show header on scroll (optional)
        if (scrollTop > lastScrollTop && scrollTop > 200) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;
    });
}

// CTA Button Functionality
function initCTAButtons() {
    const ctaButtons = document.querySelectorAll('.btn-primary');
    
    ctaButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Only prevent default if it's not a hash link
            if (!this.getAttribute('href') || !this.getAttribute('href').startsWith('#')) {
                e.preventDefault();
            }
            
            // Add click animation
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
            
            // If it's a hash link, let the smooth scrolling handle it
            // Otherwise, scroll to the analysis section
            if (!this.getAttribute('href') || !this.getAttribute('href').startsWith('#')) {
                const analysisSection = document.getElementById('golf-analysis');
                if (analysisSection) {
                    const headerHeight = document.querySelector('.header').offsetHeight;
                    const targetPosition = analysisSection.offsetTop - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
}

// Add CSS for scroll animations
const scrollAnimationStyles = `
    <style>
        .feature-card,
        .testimonial-card,
        .step {
            opacity: 0;
            transform: translateY(30px);
            transition: all 0.6s ease;
        }
        
        .feature-card.animate-in,
        .testimonial-card.animate-in,
        .step.animate-in {
            opacity: 1;
            transform: translateY(0);
        }
        
        .header.scrolled {
            background: rgba(255, 255, 255, 0.98);
            box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
        }
        
        .nav.active {
            display: block;
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: white;
            box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
            padding: 1rem;
        }
        
        .nav.active .nav-list {
            flex-direction: column;
            gap: 1rem;
        }
        
        .mobile-menu-toggle.active i {
            transform: rotate(90deg);
        }
        
        .mobile-menu-toggle i {
            transition: transform 0.3s ease;
        }
    </style>
`;

document.head.insertAdjacentHTML('beforeend', scrollAnimationStyles);

// Performance optimization: Throttle scroll events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Apply throttling to scroll events
window.addEventListener('scroll', throttle(function() {
    // Scroll event handling is already optimized in initHeaderScroll
}, 16)); // ~60fps 

// Golf Analysis Interactive Logic
const proData = {
    tiger: {
        name: 'Tiger Woods',
        video: 'https://www.youtube.com/embed/vH0nZZLgwgA',
        img: 'https://upload.wikimedia.org/wikipedia/commons/2/2e/Tiger_Woods_driver_2007_cropped.jpg'
    },
    rory: {
        name: 'Rory McIlroy',
        video: 'https://www.youtube.com/embed/2uQ2g1bqH1A',
        img: 'https://upload.wikimedia.org/wikipedia/commons/7/7e/Rory_McIlroy_2013.jpg'
    },
    nelly: {
        name: 'Nelly Korda',
        video: 'https://www.youtube.com/embed/0QkQ0Q0Q0Q0',
        img: 'https://upload.wikimedia.org/wikipedia/commons/6/6e/Nelly_Korda_2019.jpg'
    },
    scottie: {
        name: 'Scottie Scheffler',
        video: 'https://www.youtube.com/embed/0QkQ0Q0Q0Q0',
        img: 'https://upload.wikimedia.org/wikipedia/commons/2/2e/Scottie_Scheffler_2022.jpg'
    },
    lydia: {
        name: 'Lydia Ko',
        video: 'https://www.youtube.com/embed/0QkQ0Q0Q0Q0',
        img: 'https://upload.wikimedia.org/wikipedia/commons/2/2e/Lydia_Ko_2015.jpg'
    }
};

function setupGolfAnalysisForm() {
    const proSelect = document.getElementById('proSelect');
    const proPreview = document.getElementById('proPreview');
    const swingVideo = document.getElementById('swingVideo');
    const videoPreview = document.getElementById('videoPreview');
    const form = document.getElementById('analysisForm');

    if (proSelect && proPreview) {
        proSelect.addEventListener('change', function() {
            const val = proSelect.value;
            if (proData[val]) {
                proPreview.innerHTML = `
                    <div style="margin-top:1rem;">
                        <img src="${proData[val].img}" alt="${proData[val].name}" style="max-width:120px;border-radius:10px;box-shadow:0 2px 8px rgba(0,0,0,0.08);margin-bottom:0.5rem;" />
                        <div><strong>${proData[val].name}</strong></div>
                    </div>
                `;
            } else {
                proPreview.innerHTML = '';
            }
        });
    }

    if (swingVideo && videoPreview) {
        swingVideo.addEventListener('change', function() {
            const file = swingVideo.files[0];
            if (file) {
                const url = URL.createObjectURL(file);
                videoPreview.src = url;
                videoPreview.style.display = 'block';
            } else {
                videoPreview.src = '';
                videoPreview.style.display = 'none';
            }
        });
    }

    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            const pro = proSelect.value;
            const file = swingVideo.files[0];
            if (!pro || !file) return;

            // Show loading indicator
            const submitBtn = form.querySelector('button[type="submit"]');
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.textContent = 'Analyzing...';
            }

            // Send video to backend with pro_name
            const formData = new FormData();
            formData.append('pro_name', proData[pro].name);
            formData.append('video', file);
            
            try {
                const response = await fetch('http://localhost:5001/analyze', {
                    method: 'POST',
                    body: formData
                });
                const result = await response.json();
                
                if (result.error) {
                    throw new Error(result.error);
                }
                
                // Display results on the same page
                displayAnalysisResults(result, pro, file);
                
            } catch (err) {
                alert('Error analyzing swing: ' + err.message);
            } finally {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Get AI Analysis';
                }
            }
        });
    }
}

function displayAnalysisResults(result, proKey, file) {
    const analysisFormContainer = document.getElementById('analysisFormContainer');
    const analysisResults = document.getElementById('analysisResults');
    const userVideoResult = document.getElementById('userVideoResult');
    const proInfoResult = document.getElementById('proInfoResult');
    const feedbackContent = document.getElementById('feedbackContent');
    
    const pro = proData[proKey];
    if (!pro) return;
    
    // Hide form and show results
    analysisFormContainer.style.display = 'none';
    analysisResults.style.display = 'block';
    
    // Set user video
    const videoUrl = URL.createObjectURL(file);
    userVideoResult.src = videoUrl;
    
    // Set pro info
    proInfoResult.innerHTML = `
        <img src="${pro.img}" alt="${pro.name}" style="max-width:120px;border-radius:10px;box-shadow:0 2px 8px rgba(0,0,0,0.08);margin-bottom:0.5rem;" />
        <div style="margin-bottom:1rem;"><strong>${pro.name}</strong></div>
        <a href="${pro.video}" target="_blank" class="btn-outline" style="display:inline-block;">View Pro Swing Video</a>
    `;
    
    // Build feedback content
    let feedbackHtml = '<h3 style="color:var(--powder-blue);margin-bottom:1rem;">AI Analysis & Feedback</h3>';
    
    // Add summary
    if (result.summary) {
        feedbackHtml += `<p style="font-size:1.2rem;font-weight:600;color:var(--celadon);margin-bottom:1.5rem;">${result.summary}</p>`;
    }
    
    // Add session ID
    if (result.session_id) {
        feedbackHtml += `<p style="font-size:0.9rem;color:var(--slate-gray);margin-bottom:1rem;"><strong>Session ID:</strong> ${result.session_id}</p>`;
    }
    
    // Add feedback section
    if (result.feedback) {
        feedbackHtml += '<h4 style="color:var(--celadon);margin-bottom:1rem;">Detailed Feedback:</h4>';
        feedbackHtml += '<ul style="font-size:1.1rem;line-height:1.7;color:var(--slate-gray);margin-bottom:1.5rem;">';
        Object.entries(result.feedback).forEach(([key, value]) => {
            if (key !== 'overall_similarity') { // Skip overall_similarity as it's shown in summary
                const displayKey = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                feedbackHtml += `<li><strong>${displayKey}:</strong> ${value}</li>`;
            }
        });
        feedbackHtml += '</ul>';
    }
    
    // Add metrics section
    if (result.metrics) {
        feedbackHtml += '<h4 style="color:var(--celadon);margin-bottom:1rem;">Technical Metrics:</h4>';
        feedbackHtml += '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:1rem;margin-bottom:1.5rem;">';
        Object.entries(result.metrics).forEach(([key, value]) => {
            if (key !== 'overall_similarity') { // Skip overall_similarity as it's shown in summary
                const displayKey = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                feedbackHtml += `<div style="background:white;padding:1rem;border-radius:10px;box-shadow:0 2px 8px rgba(0,0,0,0.04);">
                    <div style="font-weight:600;color:var(--celadon);font-size:0.9rem;">${displayKey}</div>
                    <div style="font-size:1.1rem;color:var(--slate-gray);">${typeof value === 'number' ? value.toFixed(3) : value}</div>
                </div>`;
            }
        });
        feedbackHtml += '</div>';
    }
    
    feedbackContent.innerHTML = feedbackHtml;
    
    // Set up button event handlers
    setupResultsButtons();
    
    // Scroll to results
    analysisResults.scrollIntoView({ behavior: 'smooth' });
}

function setupResultsButtons() {
    const tryAnotherBtn = document.getElementById('tryAnotherBtn');
    const downloadResultsBtn = document.getElementById('downloadResultsBtn');
    
    if (tryAnotherBtn) {
        tryAnotherBtn.addEventListener('click', function() {
            // Reset form and show it again
            const analysisFormContainer = document.getElementById('analysisFormContainer');
            const analysisResults = document.getElementById('analysisResults');
            const form = document.getElementById('analysisForm');
            
            // Reset form
            form.reset();
            document.getElementById('proPreview').innerHTML = '';
            document.getElementById('videoPreview').style.display = 'none';
            
            // Show form, hide results
            analysisFormContainer.style.display = 'block';
            analysisResults.style.display = 'none';
            
            // Scroll to form
            analysisFormContainer.scrollIntoView({ behavior: 'smooth' });
        });
    }
    
    if (downloadResultsBtn) {
        downloadResultsBtn.addEventListener('click', function() {
            // Create a text file with the analysis results
            const resultsText = generateResultsText();
            const blob = new Blob([resultsText], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'swing-analysis-results.txt';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        });
    }
}

function generateResultsText() {
    // This function would generate a text version of the results
    // For now, return a simple message
    return `SwingPro AI Analysis Results

Thank you for using SwingPro AI Analysis!
Your swing analysis has been completed successfully.

To view detailed results, please check the web interface.
Session ID: ${localStorage.getItem('sessionId') || 'N/A'}

For more information, visit the SwingPro demo page.`;
}

function showResultsPage() {
    const resultsContent = document.getElementById('resultsContent');
    if (!resultsContent) return;
    
    const proKey = localStorage.getItem('selectedPro');
    const videoData = localStorage.getItem('swingVideo');
    const analysisResult = localStorage.getItem('analysisResult');
    const sessionId = localStorage.getItem('sessionId');
    
    const pro = proData[proKey];
    let analysis = null;
    try {
        analysis = analysisResult ? JSON.parse(analysisResult) : null;
    } catch (e) {}
    
    if (!pro || !videoData || !analysis) {
        resultsContent.innerHTML = '<p style="color:red;">No analysis data found. Please go back and try again.</p>';
        return;
    }
    
    // Build analysis feedback using the new format
    let feedbackHtml = '<h3 style="color:var(--powder-blue);margin-bottom:1rem;">AI Analysis & Feedback</h3>';
    
    // Add summary
    if (analysis.summary) {
        feedbackHtml += `<p style="font-size:1.2rem;font-weight:600;color:var(--celadon);margin-bottom:1.5rem;">${analysis.summary}</p>`;
    }
    
    // Add session ID
    if (sessionId) {
        feedbackHtml += `<p style="font-size:0.9rem;color:var(--slate-gray);margin-bottom:1rem;"><strong>Session ID:</strong> ${sessionId}</p>`;
    }
    
    // Add feedback section
    if (analysis.feedback) {
        feedbackHtml += '<h4 style="color:var(--celadon);margin-bottom:1rem;">Detailed Feedback:</h4>';
        feedbackHtml += '<ul style="font-size:1.1rem;line-height:1.7;color:var(--slate-gray);margin-bottom:1.5rem;">';
        Object.entries(analysis.feedback).forEach(([key, value]) => {
            if (key !== 'overall_similarity') { // Skip overall_similarity as it's shown in summary
                const displayKey = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                feedbackHtml += `<li><strong>${displayKey}:</strong> ${value}</li>`;
            }
        });
        feedbackHtml += '</ul>';
    }
    
    // Add metrics section
    if (analysis.metrics) {
        feedbackHtml += '<h4 style="color:var(--celadon);margin-bottom:1rem;">Technical Metrics:</h4>';
        feedbackHtml += '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:1rem;margin-bottom:1.5rem;">';
        Object.entries(analysis.metrics).forEach(([key, value]) => {
            if (key !== 'overall_similarity') { // Skip overall_similarity as it's shown in summary
                const displayKey = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                feedbackHtml += `<div style="background:white;padding:1rem;border-radius:10px;box-shadow:0 2px 8px rgba(0,0,0,0.04);">
                    <div style="font-weight:600;color:var(--celadon);font-size:0.9rem;">${displayKey}</div>
                    <div style="font-size:1.1rem;color:var(--slate-gray);">${typeof value === 'number' ? value.toFixed(3) : value}</div>
                </div>`;
            }
        });
        feedbackHtml += '</div>';
    }
    
    feedbackHtml += `<div style="margin-top:1.5rem;text-align:center;">
        <a href="index.html#golf-analysis" class="btn-secondary">Try Another Swing</a>
    </div>`;

    resultsContent.innerHTML = `
        <div class="results-flex" style="display:flex;flex-wrap:wrap;gap:2rem;justify-content:center;align-items:flex-start;">
            <div style="flex:1;min-width:260px;text-align:center;">
                <h3>Your Swing</h3>
                <video src="${videoData}" controls style="max-width:100%;border-radius:10px;box-shadow:0 2px 8px rgba(0,0,0,0.08);"></video>
            </div>
            <div style="flex:1;min-width:260px;text-align:center;">
                <h3>${pro.name}'s Swing</h3>
                <img src="${pro.img}" alt="${pro.name}" style="max-width:120px;border-radius:10px;box-shadow:0 2px 8px rgba(0,0,0,0.08);margin-bottom:0.5rem;" />
                <div><a href="${pro.video}" target="_blank" class="btn-outline" style="margin-top:0.5rem;display:inline-block;">View Pro Swing Video</a></div>
            </div>
        </div>
        <div class="ai-feedback" style="margin-top:2.5rem;text-align:left;max-width:800px;margin-left:auto;margin-right:auto;background:var(--nyanza);padding:2rem;border-radius:16px;box-shadow:0 2px 8px rgba(0,0,0,0.04);">
            ${feedbackHtml}
        </div>
    `;
} 
// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initMobileMenu();
    initSmoothScrolling();
    initScrollAnimations();
    initHeaderScroll();
    initCTAButtons();
    setupGolfAnalysisForm();
    showResultsPage();
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
            e.preventDefault();
            
            // Add click animation
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
            
            // Show demo modal or redirect (placeholder)
            showDemoModal();
        });
    });
}

// Demo Modal Functionality
function showDemoModal() {
    // Create modal HTML
    const modalHTML = `
        <div class="demo-modal" id="demoModal">
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Welcome to SwingPro Demo</h3>
                    <button class="modal-close" onclick="closeDemoModal()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="demo-steps">
                        <div class="demo-step">
                            <div class="demo-step-icon">
                                <i class="fas fa-user-friends"></i>
                            </div>
                            <h4>Choose Your Pro</h4>
                            <p>Select from our library of professional golfers</p>
                        </div>
                        <div class="demo-step">
                            <div class="demo-step-icon">
                                <i class="fas fa-video"></i>
                            </div>
                            <h4>Upload Your Swing</h4>
                            <p>Record and upload your golf swing video</p>
                        </div>
                        <div class="demo-step">
                            <div class="demo-step-icon">
                                <i class="fas fa-brain"></i>
                            </div>
                            <h4>Get AI Analysis</h4>
                            <p>Receive personalized feedback and tips</p>
                        </div>
                    </div>
                    <div class="demo-cta">
                        <button class="btn-primary" onclick="startFreeTrial()">Start Free Trial</button>
                        <p>No credit card required • 14-day free trial</p>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Add modal to page
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Add modal styles
    addModalStyles();
    
    // Show modal with animation
    setTimeout(() => {
        document.getElementById('demoModal').classList.add('show');
    }, 10);
}

// Close Demo Modal
function closeDemoModal() {
    const modal = document.getElementById('demoModal');
    if (modal) {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.remove();
        }, 300);
    }
}

// Start Free Trial Function
function startFreeTrial() {
    // Placeholder for free trial functionality
    alert('Free trial functionality would be implemented here!');
    closeDemoModal();
}

// Add Modal Styles
function addModalStyles() {
    const modalStyles = `
        <style>
            .demo-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.8);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
                opacity: 0;
                transition: opacity 0.3s ease;
            }
            
            .demo-modal.show {
                opacity: 1;
            }
            
            .modal-content {
                background: white;
                border-radius: 20px;
                max-width: 600px;
                width: 90%;
                max-height: 90vh;
                overflow-y: auto;
                transform: scale(0.8);
                transition: transform 0.3s ease;
            }
            
            .demo-modal.show .modal-content {
                transform: scale(1);
            }
            
            .modal-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 2rem 2rem 1rem;
                border-bottom: 1px solid #eee;
            }
            
            .modal-header h3 {
                color: #2d5a27;
                font-size: 1.5rem;
                font-weight: 600;
            }
            
            .modal-close {
                background: none;
                border: none;
                font-size: 1.5rem;
                color: #666;
                cursor: pointer;
                padding: 0.5rem;
                border-radius: 50%;
                transition: all 0.3s ease;
            }
            
            .modal-close:hover {
                background: #f0f0f0;
                color: #333;
            }
            
            .modal-body {
                padding: 2rem;
            }
            
            .demo-steps {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 2rem;
                margin-bottom: 2rem;
            }
            
            .demo-step {
                text-align: center;
                padding: 1.5rem;
                border-radius: 15px;
                background: #f8faf9;
                transition: all 0.3s ease;
            }
            
            .demo-step:hover {
                transform: translateY(-5px);
                box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
            }
            
            .demo-step-icon {
                width: 60px;
                height: 60px;
                background: linear-gradient(135deg, #4a7c59, #2d5a27);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                margin: 0 auto 1rem;
            }
            
            .demo-step-icon i {
                color: white;
                font-size: 1.5rem;
            }
            
            .demo-step h4 {
                color: #2d5a27;
                margin-bottom: 0.5rem;
                font-weight: 600;
            }
            
            .demo-step p {
                color: #666;
                font-size: 0.9rem;
                line-height: 1.5;
            }
            
            .demo-cta {
                text-align: center;
                padding-top: 1rem;
                border-top: 1px solid #eee;
            }
            
            .demo-cta p {
                color: #666;
                font-size: 0.9rem;
                margin-top: 1rem;
            }
            
            @media (max-width: 768px) {
                .modal-content {
                    width: 95%;
                    margin: 1rem;
                }
                
                .demo-steps {
                    grid-template-columns: 1fr;
                }
            }
        </style>
    `;
    
    document.head.insertAdjacentHTML('beforeend', modalStyles);
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
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const pro = proSelect.value;
            const file = swingVideo.files[0];
            if (!pro || !file) return;
            // Store pro and video in localStorage (video as dataURL)
            const reader = new FileReader();
            reader.onload = function(evt) {
                localStorage.setItem('selectedPro', pro);
                localStorage.setItem('swingVideo', evt.target.result);
                window.location.href = 'results.html';
            };
            reader.readAsDataURL(file);
        });
    }
}

function showResultsPage() {
    const resultsContent = document.getElementById('resultsContent');
    if (!resultsContent) return;
    const proKey = localStorage.getItem('selectedPro');
    const videoData = localStorage.getItem('swingVideo');
    const pro = proData[proKey];
    if (!pro || !videoData) {
        resultsContent.innerHTML = '<p style="color:red;">No analysis data found. Please go back and try again.</p>';
        return;
    }
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
        <div class="ai-feedback" style="margin-top:2.5rem;text-align:left;max-width:700px;margin-left:auto;margin-right:auto;background:var(--nyanza);padding:2rem;border-radius:16px;box-shadow:0 2px 8px rgba(0,0,0,0.04);">
            <h3 style="color:var(--powder-blue);margin-bottom:1rem;">AI Analysis & Feedback</h3>
            <ul style="font-size:1.1rem;line-height:1.7;color:var(--slate-gray);">
                <li><strong>Backswing:</strong> Try to keep your left arm straighter for a more consistent arc.</li>
                <li><strong>Hip Rotation:</strong> Increase your hip rotation for more power, similar to ${pro.name}.</li>
                <li><strong>Follow Through:</strong> Finish your swing higher for better balance and control.</li>
                <li><strong>Tempo:</strong> Your tempo is good! Keep it smooth and controlled.</li>
            </ul>
            <div style="margin-top:1.5rem;text-align:center;">
                <a href="index.html#golf-analysis" class="btn-secondary">Try Another Swing</a>
            </div>
        </div>
    `;
} 
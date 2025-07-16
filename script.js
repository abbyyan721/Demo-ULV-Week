// SwingPro JavaScript - Handles form submission and results display

document.addEventListener('DOMContentLoaded', function() {
    // Initialize the application
    initializeApp();
});

function initializeApp() {
    // Handle mobile menu toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const nav = document.querySelector('.nav');
    
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function() {
            nav.classList.toggle('active');
        });
    }

    // Handle smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // Initialize analysis form if present
    const analysisForm = document.getElementById('analysisForm');
    if (analysisForm) {
        initializeAnalysisForm();
    }

    // Initialize results page if present
    if (window.location.pathname.includes('results.html')) {
        initializeResultsPage();
    }

    // Initialize pro selection
    initializeProSelection();
    
    // Initialize video preview
    initializeVideoPreview();
}

function initializeAnalysisForm() {
    const form = document.getElementById('analysisForm');
    const submitButton = form.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.textContent;

    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const proSelect = document.getElementById('proSelect');
        const videoInput = document.getElementById('swingVideo');
        
        // Validate form
        if (!proSelect.value) {
            alert('Please select a professional golfer to compare with.');
            return;
        }
        
        if (!videoInput.files || !videoInput.files[0]) {
            alert('Please upload a swing video.');
            return;
        }

        // Show loading state
        submitButton.disabled = true;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Analyzing Your Swing...';

        try {
            // Prepare form data
            const formData = new FormData();
            formData.append('pro_name', proSelect.value);
            formData.append('video', videoInput.files[0]);

            // Submit to backend
            const response = await fetch('/analyze', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            
            if (result.error) {
                throw new Error(result.error);
            }

            // Show results inline or redirect to results page
            if (result.session_id) {
                // Option 1: Redirect to results page (recommended)
                window.location.href = `results.html?session=${result.session_id}`;
                
                // Option 2: Show results inline (alternative approach)
                // displayResultsInline(result);
            } else {
                throw new Error('No session ID received from server');
            }

        } catch (error) {
            console.error('Analysis error:', error);
            alert(`Analysis failed: ${error.message}`);
        } finally {
            // Reset button state
            submitButton.disabled = false;
            submitButton.textContent = originalButtonText;
        }
    });
}

function initializeResultsPage() {
    const urlParams = new URLSearchParams(window.location.search);
    const sessionId = urlParams.get('session');
    
    if (!sessionId) {
        document.getElementById('resultsContent').innerHTML = `
            <div style="text-align:center;padding:2rem;">
                <h3>No Session Found</h3>
                <p>Please return to the main page and submit an analysis.</p>
                <a href="index.html" class="btn-primary">Back to Home</a>
            </div>
        `;
        return;
    }

    loadResultsFromSession(sessionId);
}

async function loadResultsFromSession(sessionId) {
    const resultsContent = document.getElementById('resultsContent');
    
    // Show loading state
    resultsContent.innerHTML = `
        <div style="text-align:center;padding:2rem;">
            <i class="fas fa-spinner fa-spin" style="font-size:2rem;color:var(--celadon);"></i>
            <h3 style="margin-top:1rem;">Loading Your Results...</h3>
        </div>
    `;

    try {
        const response = await fetch(`/results/${sessionId}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        
        if (result.error) {
            throw new Error(result.error);
        }

        displayResults(result);

    } catch (error) {
        console.error('Error loading results:', error);
        resultsContent.innerHTML = `
            <div style="text-align:center;padding:2rem;">
                <h3>Error Loading Results</h3>
                <p>${error.message}</p>
                <a href="index.html" class="btn-primary">Back to Home</a>
            </div>
        `;
    }
}

function displayResults(result) {
    const resultsContent = document.getElementById('resultsContent');
    const proName = getProDisplayName(result.pro_name);
    const similarity = result.metrics.overall_similarity;
    
    // Generate similarity color
    const similarityColor = getSimilarityColor(similarity);
    
    // Generate detailed feedback
    const feedback = generateDetailedFeedback(result.metrics, result.feedback);
    
    resultsContent.innerHTML = `
        <div style="background:white;border-radius:20px;box-shadow:0 10px 30px rgba(115,130,144,0.08);padding:2.5rem;margin-bottom:2rem;">
            
            <!-- Overall Score -->
            <div style="text-align:center;margin-bottom:2.5rem;padding:2rem;background:linear-gradient(135deg, var(--celadon), var(--sage));border-radius:16px;color:white;">
                <h3 style="margin:0;font-size:1.5rem;">Overall Similarity Score</h3>
                <div style="font-size:3rem;font-weight:700;margin:0.5rem 0;">${similarity}%</div>
                <p style="margin:0;opacity:0.9;">compared to ${proName}</p>
            </div>

            <!-- Metrics Grid -->
            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:1.5rem;margin-bottom:2.5rem;">
                ${generateMetricCards(result.metrics)}
            </div>

            <!-- Detailed Feedback -->
            <div style="background:var(--nyanza);padding:2rem;border-radius:16px;">
                <h4 style="color:var(--celadon);margin-bottom:1.5rem;font-size:1.3rem;">
                    <i class="fas fa-brain"></i> AI Analysis & Recommendations
                </h4>
                ${feedback}
            </div>

            <!-- Session Info -->
            <div style="margin-top:2rem;padding:1rem;background:#f8f9fa;border-radius:8px;font-size:0.9rem;color:#666;">
                <strong>Session ID:</strong> ${result.session_id} | 
                <strong>Analyzed:</strong> ${new Date(result.timestamp).toLocaleString()}
            </div>
        </div>
    `;
}

function generateMetricCards(metrics) {
    const metricDisplays = [
        { key: 'knee_angle_std', label: 'Knee Stability', format: (val) => (val * 100).toFixed(1), unit: '% variance' },
        { key: 'hip_rotation_speed', label: 'Hip Rotation', format: (val) => (val * 100).toFixed(1), unit: '% speed' },
        { key: 'backswing_height', label: 'Backswing Height', format: (val) => (val * 100).toFixed(1), unit: '% range' },
        { key: 'shoulder_stability', label: 'Shoulder Stability', format: (val) => (val * 100).toFixed(1), unit: '% variance' },
        { key: 'pose_stability', label: 'Overall Stability', format: (val) => (val * 100).toFixed(1), unit: '% consistency' }
    ];

    return metricDisplays.map(metric => {
        const value = metrics[metric.key] || 0;
        const formattedValue = metric.format(value);
        const score = getMetricScore(metric.key, value);
        
        return `
            <div style="background:white;border:1px solid #e9ecef;border-radius:12px;padding:1.5rem;text-align:center;">
                <h5 style="margin:0 0 0.5rem 0;color:var(--celadon);">${metric.label}</h5>
                <div style="font-size:1.5rem;font-weight:600;color:${getScoreColor(score)}">${formattedValue}</div>
                <div style="font-size:0.8rem;color:#666;">${metric.unit}</div>
                <div style="margin-top:0.5rem;">
                    <span style="background:${getScoreColor(score)};color:white;padding:0.2rem 0.5rem;border-radius:4px;font-size:0.7rem;">
                        ${getScoreLabel(score)}
                    </span>
                </div>
            </div>
        `;
    }).join('');
}

function generateDetailedFeedback(metrics, feedback) {
    const suggestions = [];
    
    // Analyze metrics and provide specific feedback
    if (metrics.knee_angle_std > 0.05) {
        suggestions.push("🦵 <strong>Knee Stability:</strong> Focus on maintaining consistent knee position throughout your swing. Practice slow-motion swings to build muscle memory.");
    }
    
    if (metrics.hip_rotation_speed < 0.05) {
        suggestions.push("🔄 <strong>Hip Rotation:</strong> Increase hip turn speed during your downswing. This will generate more power and improve timing.");
    }
    
    if (metrics.backswing_height < 0.1) {
        suggestions.push("⬆️ <strong>Backswing:</strong> Work on achieving a fuller backswing position. This will create more power potential.");
    }
    
    if (metrics.shoulder_stability > 0.02) {
        suggestions.push("👐 <strong>Shoulder Position:</strong> Focus on keeping your shoulders stable and level throughout the swing.");
    }
    
    if (metrics.pose_stability < 0.7) {
        suggestions.push("⚖️ <strong>Overall Balance:</strong> Work on maintaining better balance and posture consistency. Practice swings while focusing on your center of gravity.");
    }

    // Add general recommendations based on similarity score
    const similarity = metrics.overall_similarity;
    if (similarity >= 80) {
        suggestions.unshift("🎉 <strong>Excellent!</strong> Your swing shows strong similarity to professional technique. Focus on consistency and fine-tuning.");
    } else if (similarity >= 60) {
        suggestions.unshift("👍 <strong>Good Progress!</strong> Your swing has solid fundamentals. Focus on the specific areas highlighted below.");
    } else {
        suggestions.unshift("📈 <strong>Improvement Opportunity:</strong> Your swing has room for enhancement. Focus on the fundamental areas highlighted below.");
    }

    return suggestions.map(suggestion => `<p style="margin-bottom:1rem;">${suggestion}</p>`).join('');
}

function getMetricScore(key, value) {
    // Scoring logic for different metrics (higher is better for some, lower for others)
    switch(key) {
        case 'knee_angle_std':
        case 'shoulder_stability':
            return value < 0.02 ? 'excellent' : value < 0.05 ? 'good' : 'needs-work';
        case 'hip_rotation_speed':
        case 'backswing_height':
            return value > 0.1 ? 'excellent' : value > 0.05 ? 'good' : 'needs-work';
        case 'pose_stability':
            return value > 0.8 ? 'excellent' : value > 0.6 ? 'good' : 'needs-work';
        default:
            return 'good';
    }
}

function getScoreColor(score) {
    switch(score) {
        case 'excellent': return '#28a745';
        case 'good': return '#ffc107';
        case 'needs-work': return '#dc3545';
        default: return '#6c757d';
    }
}

function getScoreLabel(score) {
    switch(score) {
        case 'excellent': return 'Excellent';
        case 'good': return 'Good';
        case 'needs-work': return 'Needs Work';
        default: return 'Average';
    }
}

function getSimilarityColor(similarity) {
    if (similarity >= 80) return '#28a745';
    if (similarity >= 60) return '#ffc107';
    return '#dc3545';
}

function initializeProSelection() {
    const proSelect = document.getElementById('proSelect');
    const proPreview = document.getElementById('proPreview');
    
    if (!proSelect || !proPreview) return;

    const proData = {
        'tiger': {
            name: 'Tiger Woods',
            description: 'Legendary power and precision with exceptional control',
            specialty: 'Power & Accuracy',
            image: '🐅'
        },
        'rory': {
            name: 'Rory McIlroy',
            description: 'Explosive hip rotation and modern swing mechanics',
            specialty: 'Distance & Speed',
            image: '⚡'
        },
        'nelly': {
            name: 'Nelly Korda',
            description: 'Smooth tempo and consistent ball-striking',
            specialty: 'Consistency & Rhythm',
            image: '🎯'
        },
        'scottie': {
            name: 'Scottie Scheffler',
            description: 'Fundamentally sound with great course management',
            specialty: 'Fundamentals & Control',
            image: '🏆'
        },
        'lydia': {
            name: 'Lydia Ko',
            description: 'Precise short game and steady putting',
            specialty: 'Precision & Finesse',
            image: '🎪'
        }
    };

    proSelect.addEventListener('change', function() {
        const selectedPro = this.value;
        if (selectedPro && proData[selectedPro]) {
            const pro = proData[selectedPro];
            proPreview.innerHTML = `
                <div style="background:var(--nyanza);padding:1rem;border-radius:8px;border:2px solid var(--celadon);">
                    <div style="display:flex;align-items:center;gap:1rem;">
                        <div style="font-size:2rem;">${pro.image}</div>
                        <div>
                            <h4 style="margin:0;color:var(--celadon);">${pro.name}</h4>
                            <p style="margin:0.2rem 0;font-size:0.9rem;">${pro.description}</p>
                            <span style="background:var(--celadon);color:white;padding:0.2rem 0.5rem;border-radius:4px;font-size:0.8rem;">
                                ${pro.specialty}
                            </span>
                        </div>
                    </div>
                </div>
            `;
        } else {
            proPreview.innerHTML = '';
        }
    });
}

function initializeVideoPreview() {
    const videoInput = document.getElementById('swingVideo');
    const videoPreview = document.getElementById('videoPreview');
    
    if (!videoInput || !videoPreview) return;

    videoInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const url = URL.createObjectURL(file);
            videoPreview.src = url;
            videoPreview.style.display = 'block';
            
            // Clean up the URL when the video is loaded
            videoPreview.addEventListener('loadeddata', function() {
                URL.revokeObjectURL(url);
            });
        } else {
            videoPreview.style.display = 'none';
            videoPreview.src = '';
        }
    });
}

function getProDisplayName(proKey) {
    const proNames = {
        'tiger': 'Tiger Woods',
        'rory': 'Rory McIlroy', 
        'nelly': 'Nelly Korda',
        'scottie': 'Scottie Scheffler',
        'lydia': 'Lydia Ko'
    };
    return proNames[proKey] || proKey;
}

// Additional utility functions for enhanced UX
function displayResultsInline(result) {
    // Alternative approach - show results on the same page
    const formContainer = document.getElementById('analysisFormContainer');
    const resultsContainer = document.getElementById('analysisResults');
    
    if (formContainer && resultsContainer) {
        formContainer.style.display = 'none';
        resultsContainer.style.display = 'block';
        
        // Populate results
        displayResults(result);
        
        // Scroll to results
        resultsContainer.scrollIntoView({ behavior: 'smooth' });
        
        // Handle "Try Another" button
        const tryAnotherBtn = document.getElementById('tryAnotherBtn');
        if (tryAnotherBtn) {
            tryAnotherBtn.addEventListener('click', function() {
                formContainer.style.display = 'block';
                resultsContainer.style.display = 'none';
                document.getElementById('analysisForm').reset();
                document.getElementById('proPreview').innerHTML = '';
                document.getElementById('videoPreview').style.display = 'none';
            });
        }
    }
}
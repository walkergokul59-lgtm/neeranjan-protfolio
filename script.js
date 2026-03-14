// Smooth scroll behavior for navigation links
document.addEventListener('DOMContentLoaded', function() {
    // Add smooth scrolling to all links
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Observe all sections
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        observer.observe(section);
    });

    // Load LinkedIn posts from posts.json
    loadLinkedInPosts();
});

function buildPostHTML(post) {
    const imageHTML = post.image
        ? `<div class="post-image-container"><img src="${post.image}" alt="LinkedIn Post" class="post-image"></div>`
        : '';
    return `
        <div class="linkedin-post-item">
            <a href="${post.url}" target="_blank" class="post-link">
                <div class="post-header">
                    <img src="./Assets/Profile/portrait.jpeg" alt="Neeranjan Shankar" class="post-avatar">
                    <div class="post-author">
                        <h4>Neeranjan Shankar</h4>
                        <p>AI Enthusiast &amp; n8n Automation Builder</p>
                        <span>${post.date} • 🌐</span>
                    </div>
                </div>
                <div class="post-content">
                    <p>${post.text}</p>
                    ${imageHTML}
                </div>
            </a>
        </div>`;
}

async function loadLinkedInPosts() {
    const track = document.getElementById('linkedin-posts-track');
    if (!track) return;

    try {
        const res = await fetch('./posts.json?v=' + Date.now());
        if (!res.ok) throw new Error('Could not load posts.json');
        const posts = await res.json();

        if (!posts || posts.length === 0) {
            track.innerHTML = '<p style="color:var(--text-light);padding:20px;">No posts found.</p>';
            return;
        }

        // Render posts once + one duplicate set for seamless infinite scroll
        const html = [...posts, ...posts].map(buildPostHTML).join('');
        track.innerHTML = html;

        // Initialize swipe functionality
        initializeSwipe(track, posts.length);
    } catch (err) {
        console.error('LinkedIn posts load error:', err);
        track.innerHTML = '<p style="color:var(--text-light);padding:20px;">Could not load posts.</p>';
    }
}

function initializeSwipe(track, originalPostCount) {
    let startX = 0;
    let currentX = 0;
    let isDragging = false;
    let currentIndex = 0;
    const itemWidth = 420 + 24; // post width + gap
    
    function getTranslateX() {
        return -currentIndex * itemWidth;
    }
    
    function updateTransform(smooth = true) {
        if (smooth) {
            track.style.transition = 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';
        } else {
            track.style.transition = 'none';
        }
        track.style.transform = `translateX(${getTranslateX()}px)`;
    }
    
    function handleDragStart(e) {
        isDragging = true;
        track.style.animation = 'none';
        track.style.transition = 'none';
        startX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
        currentX = startX;
    }
    
    function handleDragMove(e) {
        if (!isDragging) return;
        const x = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
        const diff = x - startX;
        track.style.transform = `translateX(${getTranslateX() + diff}px)`;
    }
    
    function handleDragEnd(e) {
        if (!isDragging) return;
        isDragging = false;
        
        const x = e.type.includes('mouse') ? e.clientX : e.changedTouches[0].clientX;
        const diff = startX - x;
        
        // Swipe threshold
        if (Math.abs(diff) > 50) {
            if (diff > 0) {
                // Swiped left, go to next post
                currentIndex = Math.min(currentIndex + 1, originalPostCount * 2 - 1);
            } else {
                // Swiped right, go to previous post
                currentIndex = Math.max(currentIndex - 1, 0);
            }
        }
        
        // Loop around if needed
        if (currentIndex >= originalPostCount) {
            currentIndex = 0;
        } else if (currentIndex < 0) {
            currentIndex = originalPostCount - 1;
        }
        
        updateTransform(true);
        
        // Resume auto-scroll after a delay
        setTimeout(() => {
            track.style.animation = '';
        }, 500);
    }
    
    // Touch events
    track.addEventListener('touchstart', handleDragStart, false);
    track.addEventListener('touchmove', handleDragMove, false);
    track.addEventListener('touchend', handleDragEnd, false);
    
    // Mouse events
    track.addEventListener('mousedown', handleDragStart);
    document.addEventListener('mousemove', handleDragMove);
    document.addEventListener('mouseup', handleDragEnd);
}

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

function initializeSwipe(track, postCount) {
    const marquee = track.parentElement; // .linkedin-posts-marquee
    let touchStartX = 0;
    let touchEndX = 0;
    let currentTranslate = 0;
    let isAnimating = false;
    
    // Get post item width (including gap)
    const getPostWidth = () => {
        const item = track.querySelector('.linkedin-post-item');
        if (!item) return 0;
        const width = item.offsetWidth;
        const style = window.getComputedStyle(track);
        const gap = parseInt(style.gap) || 0;
        return width + gap;
    };

    track.addEventListener('touchstart', (e) => {
        if (isAnimating) return;
        touchStartX = e.changedTouches[0].clientX;
        track.style.animation = 'none'; // Pause animation during swipe
        track.style.transition = 'none';
    }, false);

    track.addEventListener('touchend', (e) => {
        if (isAnimating) return;
        touchEndX = e.changedTouches[0].clientX;
        const postWidth = getPostWidth();
        const swipeDistance = touchStartX - touchEndX;
        
        if (Math.abs(swipeDistance) > 50) { // Minimum swipe distance
            const postCount = track.querySelectorAll('.linkedin-post-item').length / 2;
            const itemsToMove = Math.round(Math.abs(swipeDistance) / postWidth);
            
            if (swipeDistance > 0) {
                // Swiped left, move carousel right (show next posts)
                currentTranslate += itemsToMove * postWidth;
            } else {
                // Swiped right, move carousel left (show previous posts)
                currentTranslate -= itemsToMove * postWidth;
            }
            
            isAnimating = true;
            track.style.transition = 'transform 0.5s ease-out';
            track.style.transform = `translateX(-${currentTranslate}px)`;
            
            setTimeout(() => {
                // Reset for seamless infinite loop
                if (currentTranslate >= postCount * postWidth) {
                    track.style.transition = 'none';
                    currentTranslate = 0;
                    track.style.transform = 'translateX(0)';
                } else if (currentTranslate < 0) {
                    track.style.transition = 'none';
                    currentTranslate = (postCount - 1) * postWidth;
                    track.style.transform = `translateX(-${currentTranslate}px)`;
                }
                
                // Resume animation
                track.style.animation = '';
                isAnimating = false;
            }, 500);
        } else {
            // Resume animation if swipe too small
            track.style.animation = '';
        }
    }, false);

    // Also support mouse drag on desktop
    let mouseDown = false;
    let mouseStartX = 0;

    track.addEventListener('mousedown', (e) => {
        if (isAnimating) return;
        mouseDown = true;
        mouseStartX = e.clientX;
        track.style.animation = 'none';
        track.style.transition = 'none';
    });

    document.addEventListener('mousemove', (e) => {
        if (!mouseDown || isAnimating) return;
        const diff = mouseStartX - e.clientX;
        track.style.transform = `translateX(-${currentTranslate + diff}px)`;
    });

    document.addEventListener('mouseup', (e) => {
        if (!mouseDown) return;
        mouseDown = false;
        const postWidth = getPostWidth();
        const swipeDistance = mouseStartX - e.clientX;
        
        if (Math.abs(swipeDistance) > 50) {
            const itemsToMove = Math.round(Math.abs(swipeDistance) / postWidth);
            
            if (swipeDistance > 0) {
                currentTranslate += itemsToMove * postWidth;
            } else {
                currentTranslate -= itemsToMove * postWidth;
            }
            
            isAnimating = true;
            track.style.transition = 'transform 0.5s ease-out';
            track.style.transform = `translateX(-${currentTranslate}px)`;
            
            setTimeout(() => {
                const fullPostCount = postCount * 2; // Because we duplicate posts
                const singlePostCount = postCount;
                
                if (currentTranslate >= singlePostCount * postWidth) {
                    track.style.transition = 'none';
                    currentTranslate = 0;
                    track.style.transform = 'translateX(0)';
                } else if (currentTranslate < 0) {
                    track.style.transition = 'none';
                    currentTranslate = (singlePostCount - 1) * postWidth;
                    track.style.transform = `translateX(-${currentTranslate}px)`;
                }
                
                track.style.animation = '';
                isAnimating = false;
            }, 500);
        } else {
            track.style.animation = '';
            track.style.transition = 'transform 0.3s ease-out';
            track.style.transform = `translateX(-${currentTranslate}px)`;
            isAnimating = true;
            setTimeout(() => { isAnimating = false; }, 300);
        }
    });
}

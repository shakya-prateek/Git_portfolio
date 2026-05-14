// --- 1. DYNAMIC FOOTER YEAR ---
document.getElementById('current-year').textContent = new Date().getFullYear();

// --- 2. FLOATING PARTICLES ---
const particlesContainer = document.getElementById('particles-container');
const particleColors = ['#6366f1', '#8b5cf6', '#a78bfa', '#818cf8', '#c4b5fd'];

function createParticle() {
    const particle = document.createElement('div');
    particle.className = 'particle';
    const size = Math.random() * 4 + 2;
    const color = particleColors[Math.floor(Math.random() * particleColors.length)];
    const duration = Math.random() * 20 + 15;
    const delay = Math.random() * 10;
    const left = Math.random() * 100;

    particle.style.cssText = `
        width: ${size}px; height: ${size}px;
        background: ${color};
        left: ${left}%;
        animation-duration: ${duration}s;
        animation-delay: ${delay}s;
    `;
    particlesContainer.appendChild(particle);
}
for (let i = 0; i < 25; i++) createParticle();

// --- 3. CONTRIBUTION GRAPH ---
const graphContainer = document.getElementById('contrib-squares');
const classes = ['g-sq', 'g-sq g-l1', 'g-sq g-l2', 'g-sq', 'g-sq', 'g-sq g-l3', 'g-sq', 'g-sq g-l4', 'g-sq g-l1'];
for (let i = 0; i < 200; i++) {
    const div = document.createElement('div');
    div.className = classes[Math.floor(Math.random() * classes.length)];
    graphContainer.appendChild(div);
}

// --- 4. SEARCH AND FILTER FUNCTIONALITY ---
const searchInput = document.getElementById('repo-search');
const filterBtns = document.querySelectorAll('.filter-btn');
const repoCards = document.querySelectorAll('.repo-card');
const repoCountBadge = document.getElementById('repo-count-badge');
const noResultsMsg = document.getElementById('no-results-msg');

let currentSearchTerm = '';
let currentFilter = 'all';

function filterRepositories() {
    let visibleCount = 0;
    repoCards.forEach(card => {
        const title = card.getAttribute('data-title').toLowerCase();
        const desc = card.getAttribute('data-desc').toLowerCase();
        const category = card.getAttribute('data-category');
        const matchesSearch = title.includes(currentSearchTerm) || desc.includes(currentSearchTerm);
        const matchesFilter = currentFilter === 'all' || category === currentFilter;
        if (matchesSearch && matchesFilter) {
            card.style.display = 'flex';
            visibleCount++;
        } else {
            card.style.display = 'none';
        }
    });
    repoCountBadge.innerText = visibleCount;
    noResultsMsg.style.display = visibleCount === 0 ? 'block' : 'none';
}

searchInput.addEventListener('input', (e) => {
    currentSearchTerm = e.target.value.toLowerCase();
    filterRepositories();
});

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.getAttribute('data-filter');
        filterRepositories();
    });
});

filterRepositories();

// --- 5. 3D TILT EFFECT ON CARDS ---
repoCards.forEach(card => {
    const glow = card.querySelector('.card-glow');

    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        // Calculate tilt (max 8 degrees)
        const tiltX = ((y - centerY) / centerY) * -8;
        const tiltY = ((x - centerX) / centerX) * 8;

        card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.02, 1.02, 1.02)`;

        // Move glow effect
        if (glow) {
            glow.style.left = `${x}px`;
            glow.style.top = `${y}px`;
        }
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
        card.style.transition = 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
    });

    card.addEventListener('mouseenter', () => {
        card.style.transition = 'transform 0.1s ease-out, box-shadow 0.4s ease, border-color 0.4s ease';
    });
});

// --- 6. MODAL LOGIC ---
const modal = document.getElementById('modal');
const closeModalBtn = document.getElementById('close-modal');
const cancelModalBtn = document.getElementById('cancel-modal');
const mTitle = document.getElementById('m-title');
const mDesc = document.getElementById('m-desc');
const mImg = document.getElementById('m-img');
const mLink = document.getElementById('m-link');
const mLive = document.getElementById('m-live');
const mBullets = document.getElementById('m-bullets');
const mTech = document.getElementById('m-tech');

repoCards.forEach(project => {
    project.addEventListener('click', () => {
        mTitle.textContent = project.getAttribute('data-title');
        mDesc.textContent = project.getAttribute('data-desc');
        mImg.src = project.getAttribute('data-img');
        mLink.href = project.getAttribute('data-link') || '#';

        // Handle live demo link
        const liveUrl = project.getAttribute('data-live');
        if (liveUrl) {
            mLive.href = liveUrl;
            mLive.style.display = 'inline-block';
        } else {
            mLive.style.display = 'none';
        }

        // Populate bullet points
        const bullets = project.getAttribute('data-bullets');
        mBullets.innerHTML = '';
        if (bullets) {
            bullets.split('|').forEach(b => {
                const li = document.createElement('li');
                li.textContent = b.trim();
                mBullets.appendChild(li);
            });
        }

        // Populate tech tags
        const tech = project.getAttribute('data-tech');
        mTech.innerHTML = '';
        if (tech) {
            tech.split(',').forEach(t => {
                const span = document.createElement('span');
                span.className = 'topic-tag';
                span.textContent = t.trim();
                mTech.appendChild(span);
            });
        }

        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
});

const closeModal = () => {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
};

closeModalBtn.addEventListener('click', closeModal);
cancelModalBtn.addEventListener('click', closeModal);
modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });

// --- 7. STAGGER ENTRANCE ANIMATION ---
const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
            }, index * 120);
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

repoCards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'perspective(1000px) rotateX(5deg) translateY(30px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
    observer.observe(card);
});

// --- 8. BADGE SKILL ANIMATION ON SCROLL ---
const badges = document.querySelectorAll('.badge');
const badgeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const badgesList = entry.target.querySelectorAll('.badge');
            badgesList.forEach((badge, i) => {
                badge.style.opacity = '0';
                badge.style.transform = 'translateY(10px)';
                badge.style.transition = `opacity 0.4s ease ${i * 0.05}s, transform 0.4s ease ${i * 0.05}s`;
                requestAnimationFrame(() => {
                    badge.style.opacity = '1';
                    badge.style.transform = 'translateY(0)';
                });
            });
            badgeObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.3 });

const skillsSection = document.querySelector('.skills-badges');
if (skillsSection) badgeObserver.observe(skillsSection);

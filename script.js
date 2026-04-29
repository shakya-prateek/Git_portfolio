// --- 1. DYNAMIC FOOTER YEAR ---
document.getElementById('current-year').textContent = new Date().getFullYear();

// --- 2. CONTRIBUTION GRAPH ---
const graphContainer = document.getElementById('contrib-squares');
const classes = ['g-sq', 'g-sq g-l1', 'g-sq g-l2', 'g-sq', 'g-sq', 'g-sq g-l3', 'g-sq', 'g-sq g-l4', 'g-sq g-l1'];
for (let i = 0; i < 200; i++) {
    const div = document.createElement('div');
    div.className = classes[Math.floor(Math.random() * classes.length)];
    graphContainer.appendChild(div);
}

// --- 3. SEARCH AND FILTER FUNCTIONALITY ---
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

// --- 4. MODAL LOGIC ---
const modal = document.getElementById('modal');
const closeModalBtn = document.getElementById('close-modal');
const cancelModalBtn = document.getElementById('cancel-modal');
const mTitle = document.getElementById('m-title');
const mDesc = document.getElementById('m-desc');
const mImg = document.getElementById('m-img');
const mLink = document.getElementById('m-link');
const mBullets = document.getElementById('m-bullets');
const mTech = document.getElementById('m-tech');

repoCards.forEach(project => {
    project.addEventListener('click', () => {
        mTitle.textContent = project.getAttribute('data-title');
        mDesc.textContent = project.getAttribute('data-desc');
        mImg.src = project.getAttribute('data-img');
        mLink.href = project.getAttribute('data-link') || '#';

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

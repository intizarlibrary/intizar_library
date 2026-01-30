// Intizar Digital Library - Enhanced Frontend Logic
// Version 2.0 - Enhanced with Surah animation and advanced features

// ==================== SURAH LOADING ANIMATION ====================

function initSurahAnimation() {
    const overlay = document.getElementById('surah-overlay');
    const bismillahEl = document.getElementById('bismillah-text');
    const surahEl = document.getElementById('surah-text');
    
    // Surah Al-Asr Arabic text
    const bismillah = "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ";
    const surahAlAsr = `وَالْعَصْرِ ﴿١﴾ إِنَّ الْإِنْسَانَ لَفِي خُسْرٍ ﴿٢﴾ إِلَّا الَّذِينَ آمَنُوا وَعَمِلُوا الصَّالِحَاتِ وَتَوَاصَوْا بِالْحَقِّ وَتَوَاصَوْا بِالصَّبْرِ ﴿٣﴾`;
    
    let bismillahIndex = 0;
    let surahIndex = 0;
    const bismillahSpeed = 50; // ms per character
    const surahSpeed = 30; // ms per character
    
    function typeBismillah() {
        if (bismillahIndex < bismillah.length) {
            bismillahEl.innerHTML += bismillah.charAt(bismillahIndex);
            bismillahIndex++;
            bismillahEl.style.opacity = 1;
            setTimeout(typeBismillah, bismillahSpeed);
        } else {
            // Wait 500ms then start Surah
            setTimeout(typeSurah, 500);
        }
    }
    
    function typeSurah() {
        if (surahIndex < surahAlAsr.length) {
            surahEl.innerHTML += surahAlAsr.charAt(surahIndex);
            surahIndex++;
            surahEl.style.opacity = Math.min(1, surahIndex / 100);
            setTimeout(typeSurah, surahSpeed);
        } else {
            // Animation complete
            setTimeout(() => {
                overlay.style.opacity = 0;
                setTimeout(() => {
                    overlay.style.display = 'none';
                    // Trigger callback if exists
                    if (window.onSurahComplete) window.onSurahComplete();
                }, 500);
            }, 1000);
        }
    }
    
    // Start animation
    overlay.style.display = 'flex';
    setTimeout(() => {
        overlay.style.opacity = 1;
        typeBismillah();
    }, 100);
}

// ==================== APP CONFIGURATION ====================

const APP = {
    backendUrl: 'https://script.google.com/macros/s/AKfycbxPIgiMv3cLO0qqgTFf9_z8ock1ZMT2Z6_xG-0CSds_h4GYV3_9uHiHZAmws-TkQeWt/exec',
    
    // Enhanced default documents with all metadata
    defaultDocs: [
        {
            id: 'core-1',
            title: 'Gabatarwar Mahdawiyyah',
            author: 'Ƙungiyar Binciken Intizar',
            description: 'Cikakken gabatarwa game da manufar Mahdawiyyah da muhimmancinta.',
            language: 'hausa',
            category: 'ideology',
            source: 'intizar',
            type: 'PDF',
            date: 'Core Collection',
            dateFormatted: 'Cibiyar Asali',
            url: 'intizar1.pdf',
            coverImage: null,
            externalLink: null,
            isRemote: false,
            isRecent: false
        },
        {
            id: 'core-2',
            title: 'Manufar Intizar',
            author: 'Ƙungiyar Binciken Intizar',
            description: 'Nazarin tauhidi da aikace-aikacen jiran Imam Mahdi (A.J.F).',
            language: 'hausa',
            category: 'ideology',
            source: 'intizar',
            type: 'PDF',
            date: 'Core Collection',
            dateFormatted: 'Cibiyar Asali',
            url: 'intizar2.pdf',
            coverImage: null,
            externalLink: null,
            isRemote: false,
            isRecent: false
        },
        {
            id: 'core-3',
            title: 'Imam Mahdi a cikin Littattafan Klasik',
            author: 'Ƙungiyar Binciken Intizar',
            description: 'Magana da bincike daga adabin Musulunci na gargajiya.',
            language: 'hausa',
            category: 'ideology',
            source: 'intizar',
            type: 'PDF',
            date: 'Core Collection',
            dateFormatted: 'Cibiyar Asali',
            url: 'intizar3.pdf',
            coverImage: null,
            externalLink: null,
            isRemote: false,
            isRecent: false
        },
        {
            id: 'core-4',
            title: 'Koyarwar Sayyid Zakzaky',
            author: 'Ƙungiyar Binciken Intizar',
            description: 'Ra\'ayoyin zamani kan Mahdawiyyah.',
            language: 'hausa',
            category: 'sermons',
            source: 'intizar',
            type: 'PDF',
            date: 'Core Collection',
            dateFormatted: 'Cibiyar Asali',
            url: 'intizar4.pdf',
            coverImage: null,
            externalLink: null,
            isRemote: false,
            isRecent: false
        },
        {
            id: 'core-5',
            title: 'Mahdawiyyah Tambaya & Amsa',
            author: 'Ƙungiyar Binciken Intizar',
            description: 'Tambayoyin da ake yawan yi da amsoshi.',
            language: 'hausa',
            category: 'ideology',
            source: 'intizar',
            type: 'PDF',
            date: 'Core Collection',
            dateFormatted: 'Cibiyar Asali',
            url: 'intizar5.pdf',
            coverImage: null,
            externalLink: null,
            isRemote: false,
            isRecent: false
        },
        {
            id: 'core-6',
            title: 'Tarihin Mahdawiyyah',
            author: 'Ƙungiyar Binciken Intizar',
            description: 'Ci gaban tauhidin Mahdawiyyah a cikin tarihi.',
            language: 'hausa',
            category: 'history',
            source: 'intizar',
            type: 'PDF',
            date: 'Core Collection',
            dateFormatted: 'Cibiyar Asali',
            url: 'intizar6.pdf',
            coverImage: null,
            externalLink: null,
            isRemote: false,
            isRecent: false
        },
        {
            id: 'core-7',
            title: 'Alamomin Zuhuru',
            author: 'Ƙungiyar Binciken Intizar',
            description: 'Alamomin zuhurun Imam Mahdi (A.J.F).',
            language: 'hausa',
            category: 'ideology',
            source: 'intizar',
            type: 'PDF',
            date: 'Core Collection',
            dateFormatted: 'Cibiyar Asali',
            url: 'intizar7.pdf',
            coverImage: null,
            externalLink: null,
            isRemote: false,
            isRecent: false
        },
        {
            id: 'core-8',
            title: 'Ayyukan Intizar',
            author: 'Ƙungiyar Binciken Intizar',
            description: 'Ayyukan da za a yi yayin jiran Imam Mahdi (A.J.F).',
            language: 'hausa',
            category: 'ideology',
            source: 'intizar',
            type: 'PDF',
            date: 'Core Collection',
            dateFormatted: 'Cibiyar Asali',
            url: 'intizar8.pdf',
            coverImage: null,
            externalLink: null,
            isRemote: false,
            isRecent: false
        },
        {
            id: 'core-9',
            title: 'Imam Mahdi a cikin Hadisi',
            author: 'Ƙungiyar Binciken Intizar',
            description: 'Hadisai masu ambaton Imam Mahdi (A.J.F).',
            language: 'hausa',
            category: 'ideology',
            source: 'intizar',
            type: 'PDF',
            date: 'Core Collection',
            dateFormatted: 'Cibiyar Asali',
            url: 'intizar9.pdf',
            coverImage: null,
            externalLink: null,
            isRemote: false,
            isRecent: false
        },
        {
            id: 'core-10',
            title: 'Manufofin Adalci',
            author: 'Ƙungiyar Binciken Intizar',
            description: 'Manufofin adalci na Imam Mahdi (A.J.F).',
            language: 'hausa',
            category: 'ideology',
            source: 'intizar',
            type: 'PDF',
            date: 'Core Collection',
            dateFormatted: 'Cibiyar Asali',
            url: 'intizar10.pdf',
            coverImage: null,
            externalLink: null,
            isRemote: false,
            isRecent: false
        },
        {
            id: 'core-11',
            title: 'Tsarin Mulki',
            author: 'Ƙungiyar Binciken Intizar',
            description: 'Tsarin mulkin da Imam Mahdi (A.J.F) zai kafa.',
            language: 'hausa',
            category: 'ideology',
            source: 'intizar',
            type: 'PDF',
            date: 'Core Collection',
            dateFormatted: 'Cibiyar Asali',
            url: 'intizar11.pdf',
            coverImage: null,
            externalLink: null,
            isRemote: false,
            isRecent: false
        },
        {
            id: 'core-12',
            title: 'Alƙawarin Imam Mahdi',
            author: 'Ƙungiyar Binciken Intizar',
            description: 'Alƙawarori da alƙawarin Imam Mahdi (A.J.F).',
            language: 'hausa',
            category: 'ideology',
            source: 'intizar',
            type: 'PDF',
            date: 'Core Collection',
            dateFormatted: 'Cibiyar Asali',
            url: 'intizar12.pdf',
            coverImage: null,
            externalLink: null,
            isRemote: false,
            isRecent: false
        }
    ],
    
    // External documents
    externalDocs: [
        {
            id: 'ext-1',
            title: 'Koyarwar Sheikh Zakzaky',
            author: 'Mai gabatarwa',
            description: 'Laccoci kan koyarwar Sheikh Ibraheem Zakzaky game da Mahdawiyyah.',
            language: 'hausa',
            category: 'sermons',
            source: 'external',
            type: 'WEB',
            date: 'External Source',
            dateFormatted: 'Hanyar Yanar Gizo',
            url: 'https://example.com/sheikh-zakzaky',
            coverImage: 'sheikh-zakzaky.jpg',
            externalLink: 'https://example.com/sheikh-zakzaky',
            isRemote: false,
            isRecent: false
        },
        {
            id: 'ext-2',
            title: 'Imam Mahdi a cikin Alkur\'ani',
            author: 'Masana',
            description: 'Nassosin Alkur\'ani masu ambaton Imam Mahdi.',
            language: 'arabic',
            category: 'ideology',
            source: 'external',
            type: 'WEB',
            date: 'External Source',
            dateFormatted: 'Hanyar Yanar Gizo',
            url: 'https://example.com/quran-mahdi',
            coverImage: 'quran-mahdi.jpg',
            externalLink: 'https://example.com/quran-mahdi',
            isRemote: false,
            isRecent: false
        },
        {
            id: 'ext-3',
            title: 'Tarihin Mahdawiyyah',
            author: 'Masana tarihi',
            description: 'Historical development of Mahdawiyyah doctrine.',
            language: 'english',
            category: 'history',
            source: 'external',
            type: 'WEB',
            date: 'External Source',
            dateFormatted: 'Hanyar Yanar Gizo',
            url: 'https://example.com/mahdawiyyah-history',
            coverImage: 'mahdawiyyah-history.jpg',
            externalLink: 'https://example.com/mahdawiyyah-history',
            isRemote: false,
            isRecent: false
        }
    ],
    
    currentPage: 'home',
    allDocuments: [],
    
    // Enhanced filters
    filters: {
        search: '',
        language: 'all',
        category: 'all',
        source: 'all',
        sort: 'date-desc'
    }
};

// ==================== DOM ELEMENTS ====================

const dom = {
    // Pages
    homePage: document.getElementById('home-page'),
    libraryPage: document.getElementById('library-page'),
    aboutPage: document.getElementById('about-page'),
    
    // Navigation
    navLinks: document.querySelectorAll('.nav-link'),
    mobileNavLinks: document.querySelectorAll('.mobile-nav-link'),
    hamburger: document.getElementById('hamburger'),
    mobileNav: document.getElementById('mobile-nav'),
    closeMenu: document.getElementById('close-menu'),
    
    // Home Page Elements
    featuredDocuments: document.getElementById('featured-documents'),
    
    // Library Page Elements
    libraryDocuments: document.getElementById('library-documents'),
    searchInput: document.getElementById('search-input'),
    typeFilter: document.getElementById('type-filter'),
    sortFilter: document.getElementById('sort-filter'),
    loadingIndicator: document.getElementById('loading-indicator'),
    totalDocs: document.getElementById('total-docs'),
    recentDocs: document.getElementById('recent-docs'),
    
    // New filter elements
    filterLanguage: document.getElementById('filter-language'),
    filterCategory: document.getElementById('filter-category'),
    filterSource: document.getElementById('filter-source'),
    resetFiltersBtn: document.getElementById('reset-filters'),
    filterCount: document.getElementById('filter-count'),
    
    // Book details modal elements
    detailsModal: null,
    detailsContent: null,
    
    // View details buttons
    viewDetailsBtns: document.querySelectorAll('.view-details'),
    
    // AI Modal Elements
    aiButton: document.getElementById('ai-button'),
    aiModal: document.getElementById('ai-modal'),
    closeAI: document.getElementById('close-ai'),
    chatMessages: document.getElementById('chat-messages'),
    userInput: document.getElementById('user-input'),
    sendAI: document.getElementById('send-ai'),
    clearChat: document.getElementById('clear-chat'),
    
    // Buttons
    heroBtn: document.querySelector('.hero-btn'),
    viewAllBtn: document.querySelector('.view-all-btn'),
    aiMobileBtn: document.querySelector('.ai-mobile-btn')
};

// ==================== PAGE NAVIGATION ====================

function switchPage(page) {
    // Update current page
    APP.currentPage = page;
    
    // Hide all pages
    document.querySelectorAll('.page').forEach(p => {
        p.classList.remove('active');
    });
    
    // Show selected page
    document.getElementById(`${page}-page`).classList.add('active');
    
    // Update active state in navigation
    updateActiveNav(page);
    
    // Close mobile menu if open
    closeMobileMenu();
    
    // Load data for the page
    if (page === 'library') {
        loadLibraryDocuments();
        startAutoRefresh(5); // Refresh every 5 minutes
    } else if (page === 'home') {
        loadFeaturedDocuments();
        if (refreshInterval) clearInterval(refreshInterval);
    }
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Update document title
    document.title = page === 'home' ? 'Intizar Digital Library' 
        : page === 'library' ? 'Digital Library - Intizar' 
        : 'About - Intizar Digital Library';
}

function updateActiveNav(page) {
    // Desktop navigation
    dom.navLinks.forEach(link => {
        if (link.dataset.page === page) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
    
    // Mobile navigation
    dom.mobileNavLinks.forEach(link => {
        if (link.dataset.page === page) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// ==================== MOBILE MENU FUNCTIONS ====================

function toggleMobileMenu() {
    dom.mobileNav.classList.toggle('active');
    dom.hamburger.classList.toggle('active');
    document.body.style.overflow = dom.mobileNav.classList.contains('active') ? 'hidden' : 'auto';
}

function closeMobileMenu() {
    dom.mobileNav.classList.remove('active');
    dom.hamburger.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// ==================== FEATURED DOCUMENTS ====================

async function loadFeaturedDocuments() {
    try {
        const response = await fetch(`${APP.backendUrl}?action=getDocuments`);
        
        if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);
        }
        
        const result = await response.json();
        
        let documents = [];
        if (result.success && result.documents) {
            documents = result.documents.slice(0, 3).map(doc => ({
                id: doc.ID,
                title: doc.Title || 'Untitled',
                author: doc.Author || 'Unknown',
                description: doc.Description || '',
                language: doc.Language || 'hausa',
                category: doc.Category || 'ideology',
                source: doc.Source || 'intizar',
                type: doc.Type || 'PDF',
                date: new Date(doc.DateAdded).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'short', 
                    day: 'numeric' 
                }),
                url: doc.DriveUrl || '#',
                coverImage: doc.CoverImageUrl || null,
                isRemote: true
            }));
        }
        
        // Render featured documents
        renderFeaturedDocuments(documents);
        
    } catch (error) {
        console.error('Failed to load featured documents:', error);
        renderFeaturedDocuments([]);
        
        // Show notification
        showNotification('Failed to load featured documents. Using offline content.', 'warning');
    }
}

function renderFeaturedDocuments(docs) {
    if (!dom.featuredDocuments) return;
    
    dom.featuredDocuments.innerHTML = '';
    
    if (docs.length === 0) {
        // Show default documents when no featured ones are available
        const defaultDocs = APP.defaultDocs.slice(0, 3);
        defaultDocs.forEach(doc => {
            const card = document.createElement('div');
            card.className = 'document-card';
            card.innerHTML = `
                <div class="doc-icon"><i class="fas fa-file-pdf"></i></div>
                <div class="doc-info">
                    <h4>${doc.title}</h4>
                    <p class="doc-meta">Marubuci: ${doc.author} | Nau'i: ${doc.type}</p>
                    <p class="doc-date">${doc.dateFormatted}</p>
                    ${doc.description ? `<p class="doc-description">${doc.description}</p>` : ''}
                </div>
                <div class="doc-actions">
                    <button class="doc-btn view-details" data-id="${doc.id}">
                        <i class="fas fa-eye"></i> Duba
                    </button>
                    <a href="${doc.url}" target="_blank" class="doc-btn secondary">
                        <i class="fas fa-book-open"></i> Karanta
                    </a>
                </div>
            `;
            dom.featuredDocuments.appendChild(card);
        });
        
        // Add event listeners
        setTimeout(() => {
            document.querySelectorAll('.view-details').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const bookId = e.target.closest('.view-details').dataset.id;
                    showBookDetails(bookId);
                });
            });
        }, 100);
        return;
    }
    
    docs.forEach(doc => {
        const card = document.createElement('div');
        card.className = 'document-card';
        card.innerHTML = `
            <div class="doc-icon"><i class="fas fa-file-pdf"></i></div>
            <div class="doc-info">
                <h4>${doc.title}</h4>
                <p class="doc-meta">Marubuci: ${doc.author} | Nau'i: ${doc.type}</p>
                <p class="doc-date">An ƙara: ${doc.date}</p>
                ${doc.description ? `<p class="doc-description">${doc.description}</p>` : ''}
            </div>
            <div class="doc-actions">
                <button class="doc-btn view-details" data-id="${doc.id}">
                    <i class="fas fa-eye"></i> Duba
                </button>
                <a href="${doc.url}" target="_blank" class="doc-btn secondary">
                    <i class="fas fa-book-open"></i> Karanta
                </a>
            </div>
        `;
        dom.featuredDocuments.appendChild(card);
    });
    
    // Add event listeners
    setTimeout(() => {
        document.querySelectorAll('.view-details').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const bookId = e.target.closest('.view-details').dataset.id;
                showBookDetails(bookId);
            });
        });
    }, 100);
}

// ==================== LIBRARY FUNCTIONS ====================

async function loadLibraryDocuments() {
    if (!dom.libraryDocuments) return;
    
    // Show loading state
    dom.loadingIndicator.style.display = 'flex';
    dom.libraryDocuments.innerHTML = '';
    
    // Add skeleton loading cards
    for (let i = 0; i < 6; i++) {
        const skeleton = document.createElement('div');
        skeleton.className = 'library-card skeleton-card';
        dom.libraryDocuments.appendChild(skeleton);
    }
    
    try {
        const response = await fetch(`${APP.backendUrl}?action=getDocuments`);
        
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Server error ${response.status}: ${errorText}`);
        }
        
        const result = await response.json();
        
        let remoteDocs = [];
        if (result.success && result.documents) {
            remoteDocs = result.documents.map(doc => ({
                id: doc.ID,
                title: doc.Title || 'Ba suna',
                author: doc.Author || 'Ba marubuci',
                description: doc.Description || '',
                language: doc.Language || 'other',
                category: doc.Category || 'other',
                source: doc.Source || 'intizar',
                type: doc.Type || 'PDF',
                date: new Date(doc.DateAdded),
                dateFormatted: new Date(doc.DateAdded).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'short', 
                    day: 'numeric' 
                }),
                url: doc.DriveUrl || '#',
                coverImage: doc.CoverImageUrl || null,
                externalLink: doc.ExternalLink || null,
                isRemote: true,
                isRecent: isRecentDocument(doc.DateAdded)
            }));
        }
        
        // Combine with default and external documents
        APP.allDocuments = remoteDocs;
        
        // Update stats
        updateLibraryStats(remoteDocs);
        
        // Apply filters (this will render all documents)
        applyFilters();
        
    } catch (error) {
        console.error('Failed to load library documents:', error);
        
        // Show error message
        dom.libraryDocuments.innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-triangle"></i>
                <h3>Matsalar Loda Littattafai</h3>
                <p>${error.message || 'Matsalar hanyar sadarwa'}</p>
                <button onclick="loadLibraryDocuments()" class="retry-btn">
                    <i class="fas fa-redo"></i> Yi Ƙoƙari Sake
                </button>
            </div>
        `;
        
        // Fallback to default + external documents only
        APP.allDocuments = [];
        updateLibraryStats([]);
        applyFilters();
        
        showNotification('Ana amfani da littattafan asali kawai.', 'warning');
    } finally {
        dom.loadingIndicator.style.display = 'none';
    }
}

function isRecentDocument(dateString) {
    const docDate = new Date(dateString);
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    return docDate > oneMonthAgo;
}

function updateLibraryStats(remoteDocs) {
    if (!dom.totalDocs || !dom.recentDocs) return;
    
    // Total documents (remote + default + external)
    const totalCount = remoteDocs.length + APP.defaultDocs.length + APP.externalDocs.length;
    dom.totalDocs.textContent = totalCount;
    
    // Recent documents (last 30 days)
    const recentCount = remoteDocs.filter(doc => isRecentDocument(doc.date)).length;
    dom.recentDocs.textContent = recentCount;
}

// ==================== FILTER FUNCTIONS ====================

function initFilters() {
    // Search input (debounced)
    let searchTimeout;
    if (dom.searchInput) {
        dom.searchInput.addEventListener('input', function(e) {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                APP.filters.search = e.target.value.toLowerCase();
                applyFilters();
            }, 300);
        });
    }
    
    // Language filter
    if (dom.filterLanguage) {
        dom.filterLanguage.addEventListener('change', function(e) {
            APP.filters.language = e.target.value;
            applyFilters();
        });
    }
    
    // Category filter
    if (dom.filterCategory) {
        dom.filterCategory.addEventListener('change', function(e) {
            APP.filters.category = e.target.value;
            applyFilters();
        });
    }
    
    // Source filter
    if (dom.filterSource) {
        dom.filterSource.addEventListener('change', function(e) {
            APP.filters.source = e.target.value;
            applyFilters();
        });
    }
    
    // Reset filters button
    if (dom.resetFiltersBtn) {
        dom.resetFiltersBtn.addEventListener('click', function() {
            APP.filters = {
                search: '',
                language: 'all',
                category: 'all',
                source: 'all',
                sort: 'date-desc'
            };
            
            // Reset UI
            if (dom.searchInput) dom.searchInput.value = '';
            if (dom.filterLanguage) dom.filterLanguage.value = 'all';
            if (dom.filterCategory) dom.filterCategory.value = 'all';
            if (dom.filterSource) dom.filterSource.value = 'all';
            if (dom.sortFilter) dom.sortFilter.value = 'date-desc';
            
            applyFilters();
            showNotification('An share saitunan tacewa.', 'success');
        });
    }
    
    // Sort filter (existing)
    if (dom.sortFilter) {
        dom.sortFilter.addEventListener('change', function(e) {
            APP.filters.sort = e.target.value;
            applyFilters();
        });
    }
}

function applyFilters() {
    if (!APP.allDocuments || APP.allDocuments.length === 0) return;
    
    // Combine all documents (remote + default + external)
    const allDocs = [...APP.defaultDocs, ...APP.externalDocs, ...APP.allDocuments];
    
    let filtered = [...allDocs];
    
    // Apply search filter
    if (APP.filters.search) {
        const searchTerm = APP.filters.search.toLowerCase();
        filtered = filtered.filter(doc => 
            (doc.title && doc.title.toLowerCase().includes(searchTerm)) ||
            (doc.author && doc.author.toLowerCase().includes(searchTerm)) ||
            (doc.description && doc.description.toLowerCase().includes(searchTerm)) ||
            (doc.language && getLanguageDisplayName(doc.language).toLowerCase().includes(searchTerm)) ||
            (doc.category && getCategoryDisplayName(doc.category).toLowerCase().includes(searchTerm))
        );
    }
    
    // Apply language filter
    if (APP.filters.language !== 'all') {
        filtered = filtered.filter(doc => doc.language === APP.filters.language);
    }
    
    // Apply category filter
    if (APP.filters.category !== 'all') {
        filtered = filtered.filter(doc => doc.category === APP.filters.category);
    }
    
    // Apply source filter
    if (APP.filters.source !== 'all') {
        filtered = filtered.filter(doc => doc.source === APP.filters.source);
    }
    
    // Apply sort
    switch (APP.filters.sort) {
        case 'date-desc':
            // For documents with actual dates
            filtered.sort((a, b) => {
                if (a.date instanceof Date && b.date instanceof Date) {
                    return b.date - a.date;
                }
                return 0;
            });
            break;
        case 'date-asc':
            filtered.sort((a, b) => {
                if (a.date instanceof Date && b.date instanceof Date) {
                    return a.date - b.date;
                }
                return 0;
            });
            break;
        case 'title':
            filtered.sort((a, b) => a.title.localeCompare(b.title));
            break;
        case 'author':
            filtered.sort((a, b) => a.author.localeCompare(b.author));
            break;
    }
    
    // Render filtered documents
    renderLibraryDocuments(filtered);
    
    // Update filter count
    updateFilterCount(filtered.length);
}

function updateFilterCount(count) {
    if (!dom.filterCount) {
        // Create filter count element if it doesn't exist
        const countEl = document.createElement('div');
        countEl.id = 'filter-count';
        countEl.className = 'filter-count';
        const filterControls = document.querySelector('.filter-controls');
        if (filterControls) {
            filterControls.appendChild(countEl);
            dom.filterCount = countEl;
        }
    }
    
    if (dom.filterCount) {
        const totalBooks = APP.defaultDocs.length + APP.externalDocs.length + APP.allDocuments.length;
        dom.filterCount.innerHTML = `
            An samo <strong>${count}</strong> daga cikin <strong>${totalBooks}</strong> littattafai
            ${APP.filters.search ? `don "<em>${APP.filters.search}</em>"` : ''}
        `;
    }
}

// Helper functions for display names
function getLanguageDisplayName(code) {
    const languages = {
        'hausa': 'Hausa',
        'english': 'English',
        'arabic': 'Arabic',
        'other': 'Sauran'
    };
    return languages[code] || code;
}

function getCategoryDisplayName(code) {
    const categories = {
        'history': 'Tarihi',
        'ideology': 'Akida',
        'articles': 'Kasidu',
        'lists': 'Jerin',
        'biography': 'Tarihin Rayuwa',
        'sermons': 'Wa\'azi',
        'other': 'Sauran'
    };
    return categories[code] || code;
}

function getSourceDisplayName(code) {
    const sources = {
        'intizar': 'Intizarul Imamul Muntazar',
        'individual': 'Rubutun Mutum',
        'external': 'Tushen Waje'
    };
    return sources[code] || code;
}

// ==================== RENDER LIBRARY DOCUMENTS ====================

function renderLibraryDocuments(docs) {
    if (!dom.libraryDocuments) return;
    
    dom.libraryDocuments.innerHTML = '';
    
    if (docs.length === 0) {
        const hasSearch = APP.filters.search.trim() !== '';
        const hasFilters = APP.filters.language !== 'all' || 
                          APP.filters.category !== 'all' || 
                          APP.filters.source !== 'all';
        
        let message = 'Babu littattafai da aka samo';
        if (hasSearch || hasFilters) {
            message += ' tare da saitunan tacewa na yanzu';
            if (hasSearch) {
                message += ` don "${APP.filters.search}"`;
            }
        }
        
        dom.libraryDocuments.innerHTML = `
            <div class="no-results">
                <i class="fas fa-search"></i>
                <h3>${message}</h3>
                ${hasSearch || hasFilters ? 
                    '<button onclick="resetFilters()" class="reset-btn">Share Tacewa</button>' : 
                    '<p>Duba nan da nan don ƙarin littattafai</p>'
                }
            </div>
        `;
        return;
    }
    
    docs.forEach(doc => {
        const card = document.createElement('div');
        card.className = 'library-card';
        if (doc.source === 'external') card.classList.add('external-card');
        
        // Get cover image or icon
        const coverHtml = doc.coverImage ? 
            `<img src="${doc.coverImage}" alt="${doc.title}" class="doc-cover-img">` :
            `<i class="fas fa-file-pdf pdf-icon"></i>`;
        
        // Get metadata badges
        const languageName = getLanguageDisplayName(doc.language);
        const categoryName = getCategoryDisplayName(doc.category);
        const sourceName = getSourceDisplayName(doc.source);
        
        card.innerHTML = `
            <div class="card-header">
                ${coverHtml}
                <span class="doc-badge">${doc.source === 'external' ? 'Hanyar Yanar Gizo' : 'Littafin Asali'}</span>
            </div>
            <div class="card-body">
                <h4>${doc.title}</h4>
                <p class="card-author">${doc.author}</p>
                <p class="card-excerpt">${doc.description ? doc.description.substring(0, 120) + '...' : 'Babu bayani.'}</p>
                <div class="card-meta">
                    <span class="meta-tag">${languageName}</span>
                    <span class="meta-tag">${categoryName}</span>
                    <span class="meta-tag">${sourceName}</span>
                </div>
            </div>
            <div class="card-footer">
                <button class="card-btn view-details" data-id="${doc.id}">
                    <i class="fas fa-eye"></i> Duba
                </button>
                <a href="${doc.url}" ${doc.type === 'WEB' ? 'target="_blank"' : ''} 
                   class="card-btn ${doc.type === 'WEB' ? 'external-btn' : ''}">
                    <i class="${doc.type === 'WEB' ? 'fas fa-external-link-alt' : 'fas fa-book-open'}"></i>
                    ${doc.type === 'WEB' ? 'Duba akan Yanar Gizo' : 'Karanta'}
                </a>
                ${doc.type !== 'WEB' ? 
                    `<a href="${doc.url}" download class="card-btn download">
                        <i class="fas fa-download"></i> Zazzage
                    </a>` : ''
                }
            </div>
        `;
        
        dom.libraryDocuments.appendChild(card);
    });
    
    // Add event listeners to view buttons
    setTimeout(() => {
        document.querySelectorAll('.view-details').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const bookId = e.target.closest('.view-details').dataset.id;
                showBookDetails(bookId);
            });
        });
    }, 100);
}

// ==================== BOOK DETAILS MODAL ====================

function showBookDetails(bookId) {
    // Find the book
    const allBooks = [...APP.defaultDocs, ...APP.externalDocs, ...APP.allDocuments];
    const book = allBooks.find(b => b.id === bookId);
    
    if (!book) {
        showNotification('Babu bayanin littafin da aka samo.', 'error');
        return;
    }
    
    // Create modal if it doesn't exist
    if (!dom.detailsModal) {
        dom.detailsModal = document.createElement('div');
        dom.detailsModal.className = 'details-modal hidden';
        dom.detailsModal.innerHTML = `
            <div class="details-content">
                <div class="details-header">
                    <h3>Cikakken Bayanin Littafi</h3>
                    <button class="details-close">&times;</button>
                </div>
                <div class="details-body" id="details-body">
                    <!-- Content will be added here -->
                </div>
            </div>
        `;
        document.body.appendChild(dom.detailsModal);
        
        // Add close event
        dom.detailsModal.querySelector('.details-close').addEventListener('click', () => {
            dom.detailsModal.classList.add('hidden');
        });
        
        // Close when clicking outside
        dom.detailsModal.addEventListener('click', (e) => {
            if (e.target === dom.detailsModal) {
                dom.detailsModal.classList.add('hidden');
            }
        });
    }
    
    // Populate with book data
    const detailsBody = document.getElementById('details-body');
    const languageName = getLanguageDisplayName(book.language);
    const categoryName = getCategoryDisplayName(book.category);
    const sourceName = getSourceDisplayName(book.source);
    
    detailsBody.innerHTML = `
        <div style="display: flex; gap: 20px; margin-bottom: 2rem; align-items: flex-start;">
            ${book.coverImage ? 
                `<img src="${book.coverImage}" alt="${book.title}" 
                      style="width: 120px; height: 160px; object-fit: cover; border-radius: 8px; border: 2px solid #ddd;">` : 
                `<div style="width: 120px; height: 160px; background: #f0f7f4; border-radius: 8px; 
                           display: flex; align-items: center; justify-content: center; font-size: 3rem; color: #13614a;">
                    <i class="fas fa-book"></i>
                </div>`
            }
            <div style="flex: 1;">
                <h2 style="color: var(--primary-dark); margin-bottom: 10px;">${book.title}</h2>
                <p style="color: #666; margin-bottom: 15px;"><strong>Marubuci:</strong> ${book.author}</p>
                <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                    <span class="meta-tag">${languageName}</span>
                    <span class="meta-tag">${categoryName}</span>
                    <span class="meta-tag">${sourceName}</span>
                    <span class="meta-tag">${book.type}</span>
                </div>
            </div>
        </div>
        
        <div style="margin-bottom: 2rem;">
            <h3 style="color: var(--primary-dark); margin-bottom: 10px;">Bayanin Littafi</h3>
            <p style="line-height: 1.6; color: #444;">${book.description || 'Babu bayani.'}</p>
        </div>
        
        ${book.externalLink ? `
            <div style="margin-bottom: 1.5rem;">
                <h3 style="color: var(--primary-dark); margin-bottom: 10px;">Hanyar Yanar Gizo</h3>
                <a href="${book.externalLink}" target="_blank" style="color: #13614a; text-decoration: underline;">
                    ${book.externalLink}
                </a>
            </div>
        ` : ''}
        
        <div class="details-actions">
            <a href="${book.url}" ${book.type === 'WEB' ? 'target="_blank"' : ''} 
               class="btn btn-primary" style="flex: 1;">
                <i class="${book.type === 'WEB' ? 'fas fa-external-link-alt' : 'fas fa-book-open'}"></i>
                ${book.type === 'WEB' ? 'Duba akan Yanar Gizo' : 'Fara Karatu'}
            </a>
            ${book.type !== 'WEB' ? 
                `<a href="${book.url}" download class="btn btn-secondary" style="flex: 1;">
                    <i class="fas fa-download"></i> Zazzage PDF
                </a>` : ''
            }
        </div>
    `;
    
    // Show modal
    dom.detailsModal.classList.remove('hidden');
}

// ==================== AI CHAT FUNCTIONS ====================

function openAIModal() {
    dom.aiModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    dom.userInput.focus();
}

function closeAIModal() {
    dom.aiModal.classList.add('hidden');
    document.body.style.overflow = 'auto';
}

function addMessage(text, isUser = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isUser ? 'user-message' : 'ai-message'}`;
    
    if (isUser) {
        messageDiv.innerHTML = `
            <div class="message-header">
                <i class="fas fa-user"></i>
                <span>You</span>
            </div>
            <p>${text}</p>
        `;
    } else {
        messageDiv.innerHTML = `
            <div class="message-header">
                <i class="fas fa-robot"></i>
                <span>Mahdawiyyah Assistant</span>
            </div>
            <p>${text}</p>
        `;
    }
    
    dom.chatMessages.appendChild(messageDiv);
    dom.chatMessages.scrollTop = dom.chatMessages.scrollHeight;
}

async function sendAIQuestion() {
    // Check network connectivity
    if (!navigator.onLine) {
        addMessage('You appear to be offline. Please check your connection and try again.');
        return;
    }
    
    const question = dom.userInput.value.trim();
    if (!question) return;
    
    // Add user message
    addMessage(question, true);
    dom.userInput.value = '';
    dom.sendAI.disabled = true;
    dom.sendAI.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    
    try {
        console.log('🤖 Sending AI question:', question.substring(0, 100));
        
        const response = await fetch(APP.backendUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `action=ai&input=${encodeURIComponent(question)}`
        });
        
        // Check response status
        if (!response.ok) {
            const errorText = await response.text();
            console.error('❌ Server error:', response.status, errorText);
            
            if (response.status === 401 || response.status === 403) {
                addMessage('Session expired. Please refresh the page and try again.');
            } else if (response.status === 429) {
                addMessage('Too many requests. Please wait a moment before trying again.');
            } else {
                addMessage(`Server error (${response.status}). Please try again.`);
            }
            return;
        }
        
        const result = await response.json();
        console.log('📥 AI response received:', result.success ? 'Success' : 'Failed');
        
        if (result.success) {
            addMessage(result.response);
        } else {
            // Show user-friendly error
            const errorMsg = result.error || 'AI service is currently unavailable';
            addMessage(`Sorry, I couldn't process that request. ${errorMsg}`);
            
            // Suggest if question is off-topic
            if (errorMsg.includes('not appear to be related')) {
                addMessage('Tip: Ask about Imam Mahdi (AJF), Mahdawiyyah, Intizar (awaiting), or Sayyid Zakzaky\'s teachings.');
            }
        }
    } catch (error) {
        console.error('❌ Network error:', error);
        addMessage('Network error. Please check your internet connection and try again.');
    } finally {
        dom.sendAI.disabled = false;
        dom.sendAI.innerHTML = 'Send <i class="fas fa-paper-plane"></i>';
    }
}

function clearChat() {
    dom.chatMessages.innerHTML = `
        <div class="message ai-message">
            <div class="message-header">
                <i class="fas fa-robot"></i>
                <span>Mahdawiyyah Assistant</span>
            </div>
            <p>Assalamu alaikum. I am an AI assistant specialized in Mahdawiyyah teachings. Ask me about Imam Mahdi (AJF), the concept of Intizar, or related topics.</p>
        </div>
    `;
}

// ==================== AUTO-REFRESH ====================

let refreshInterval;
function startAutoRefresh(intervalMinutes = 5) {
    if (refreshInterval) clearInterval(refreshInterval);
    refreshInterval = setInterval(() => {
        if (APP.currentPage === 'library') {
            console.log('🔄 Auto-refreshing library documents');
            loadLibraryDocuments();
        }
    }, intervalMinutes * 60 * 1000);
}

// ==================== BACKEND HEALTH CHECK ====================

async function checkBackendHealth() {
    try {
        const response = await fetch(`${APP.backendUrl}?action=health`);
        const data = await response.json();
        if (!data.success) {
            console.warn('⚠️ Backend health check failed:', data);
            showNotification('Backend service is experiencing issues', 'warning');
        }
    } catch (error) {
        console.warn('⚠️ Backend health check failed:', error.message);
    }
}

// ==================== NOTIFICATION SYSTEM ====================

function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button onclick="this.parentElement.remove()">&times;</button>
    `;
    
    document.body.appendChild(notification);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// ==================== EVENT LISTENERS ====================

function initEventListeners() {
    // Page Navigation
    dom.navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            if (link.href && link.href.includes('admin.html')) return;
            e.preventDefault();
            switchPage(link.dataset.page);
        });
    });
    
    // Mobile Navigation
    dom.mobileNavLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            if (link.href && link.href.includes('admin.html')) return;
            if (link.classList.contains('ai-mobile-btn')) {
                e.preventDefault();
                openAIModal();
                closeMobileMenu();
            } else if (link.dataset.page) {
                e.preventDefault();
                switchPage(link.dataset.page);
            }
        });
    });
    
    // Hamburger Menu
    dom.hamburger.addEventListener('click', toggleMobileMenu);
    dom.closeMenu.addEventListener('click', closeMobileMenu);
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (dom.mobileNav.classList.contains('active') && 
            !dom.mobileNav.contains(e.target) && 
            !dom.hamburger.contains(e.target)) {
            closeMobileMenu();
        }
    });
    
    // Close mobile menu on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && dom.mobileNav.classList.contains('active')) {
            closeMobileMenu();
        }
    });
    
    // Initialize filters
    initFilters();
    
    // Buttons
    if (dom.heroBtn) {
        dom.heroBtn.addEventListener('click', (e) => {
            e.preventDefault();
            switchPage('library');
        });
    }
    
    if (dom.viewAllBtn) {
        dom.viewAllBtn.addEventListener('click', (e) => {
            e.preventDefault();
            switchPage('library');
        });
    }
    
    // AI Modal
    dom.aiButton.addEventListener('click', openAIModal);
    dom.closeAI.addEventListener('click', closeAIModal);
    dom.aiModal.addEventListener('click', (e) => {
        if (e.target === dom.aiModal) closeAIModal();
    });
    
    // AI Chat
    dom.sendAI.addEventListener('click', sendAIQuestion);
    dom.userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendAIQuestion();
        }
    });
    
    // Clear chat button
    if (dom.clearChat) {
        dom.clearChat.addEventListener('click', clearChat);
    }
    
    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (!dom.aiModal.classList.contains('hidden')) {
                closeAIModal();
            }
            if (dom.detailsModal && !dom.detailsModal.classList.contains('hidden')) {
                dom.detailsModal.classList.add('hidden');
            }
        }
    });
    
    // Network status listeners
    window.addEventListener('online', () => {
        console.log('🌐 Network connection restored');
        showNotification('You are back online', 'success');
        
        if (APP.currentPage === 'library') {
            loadLibraryDocuments();
        } else if (APP.currentPage === 'home') {
            loadFeaturedDocuments();
        }
    });
    
    window.addEventListener('offline', () => {
        console.log('⚠️ Network connection lost');
        showNotification('You are offline. Some features may not work.', 'warning');
    });
}

// ==================== RESET FILTERS FUNCTION ====================

function resetFilters() {
    APP.filters = {
        search: '',
        language: 'all',
        category: 'all',
        source: 'all',
        sort: 'date-desc'
    };
    
    // Reset UI
    if (dom.searchInput) dom.searchInput.value = '';
    if (dom.filterLanguage) dom.filterLanguage.value = 'all';
    if (dom.filterCategory) dom.filterCategory.value = 'all';
    if (dom.filterSource) dom.filterSource.value = 'all';
    if (dom.sortFilter) dom.sortFilter.value = 'date-desc';
    
    applyFilters();
    showNotification('An share saitunan tacewa.', 'success');
}

// ==================== INITIALIZATION ====================

document.addEventListener('DOMContentLoaded', () => {
    console.log('📚 Intizar Digital Library initializing...');
    
    try {
        // Start Surah animation first
        initSurahAnimation();
        
        // Set callback for when animation completes
        window.onSurahComplete = function() {
            console.log('✅ Surah animation complete, initializing app...');
            
            initEventListeners();
            loadFeaturedDocuments();
            switchPage('home');
            
            // Check backend health on startup
            setTimeout(() => {
                checkBackendHealth();
            }, 2000);
            
            console.log('✅ Frontend loaded successfully.');
        };
        
    } catch (error) {
        console.error('❌ Initialization failed:', error);
        
        // Show user-friendly error
        document.body.innerHTML = `
            <div style="padding: 2rem; text-align: center; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                <h2 style="color: #13614a;">Matsalar Loda</h2>
                <p>Cibiyar littattafai ta gaza loda. Don Allah sake shigar shafin.</p>
                <button onclick="location.reload()" 
                        style="background: #13614a; color: white; border: none; padding: 10px 20px; 
                               border-radius: 4px; cursor: pointer; margin-top: 20px;">
                    Sake Shigar Shafin
                </button>
            </div>
        `;
    }
    
    // Add CSS for new elements
    addDynamicStyles();
});

// ==================== DYNAMIC STYLES ====================

function addDynamicStyles() {
    const styles = document.createElement('style');
    styles.textContent = `
        .no-documents, .no-results {
            grid-column: 1 / -1;
            text-align: center;
            padding: 3rem;
            color: #666;
        }
        
        .no-documents i, .no-results i {
            font-size: 3rem;
            margin-bottom: 1rem;
            color: #ccc;
        }
        
        .no-results h3 {
            color: var(--primary-dark);
            margin: 1rem 0;
        }
        
        .new-badge {
            position: absolute;
            top: -8px;
            right: -8px;
            background: #ff6b6b;
            color: white;
            font-size: 0.7rem;
            padding: 2px 8px;
            border-radius: 10px;
            font-weight: 600;
        }
        
        .core-badge {
            background: var(--accent);
            color: var(--primary-dark);
            padding: 2px 6px;
            border-radius: 4px;
            font-size: 0.8rem;
            font-weight: 600;
        }
        
        .doc-icon {
            position: relative;
        }
        
        .doc-description {
            color: #666;
            font-size: 0.9rem;
            line-height: 1.5;
            margin-top: 0.5rem;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
        }
        
        .document-card .doc-actions {
            display: flex;
            gap: 10px;
            margin-top: auto;
        }
        
        .document-card .doc-actions .doc-btn {
            flex: 1;
            text-align: center;
            padding: 8px 15px;
            font-size: 0.9rem;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 5px;
        }
        
        /* Error states */
        .error-message {
            background: #f8d7da;
            color: #721c24;
            padding: 1.5rem;
            border-radius: 8px;
            border-left: 4px solid #dc3545;
            text-align: center;
            grid-column: 1 / -1;
        }
        
        .error-message i {
            font-size: 2rem;
            color: #dc3545;
            margin-bottom: 1rem;
        }
        
        .error-message h3 {
            margin: 0 0 0.5rem 0;
            color: #721c24;
        }
        
        .retry-btn {
            background: #13614a;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 4px;
            cursor: pointer;
            margin-top: 10px;
            display: inline-flex;
            align-items: center;
            gap: 8px;
            font-size: 0.9rem;
            transition: background 0.3s;
        }
        
        .retry-btn:hover {
            background: #0b3d2e;
        }
        
        .reset-btn {
            background: #c99a6b;
            color: #0b3d2e;
            border: none;
            padding: 8px 16px;
            border-radius: 4px;
            cursor: pointer;
            font-weight: 600;
            margin-top: 15px;
            transition: background 0.3s;
        }
        
        .reset-btn:hover {
            background: #d8b085;
        }
        
        /* Loading skeleton */
        .skeleton-card {
            background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
            background-size: 200% 100%;
            animation: loading 1.5s infinite;
            border-radius: 8px;
            height: 180px;
            width: 100%;
        }
        
        @keyframes loading {
            0% { background-position: 200% 0; }
            100% { background-position: -200% 0; }
        }
        
        /* Notifications */
        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            color: white;
            display: flex;
            align-items: center;
            justify-content: space-between;
            min-width: 300px;
            max-width: 400px;
            z-index: 10000;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            animation: slideIn 0.3s ease-out;
        }
        
        .notification-info {
            background: #3498db;
            border-left: 4px solid #2980b9;
        }
        
        .notification-success {
            background: #27ae60;
            border-left: 4px solid #219653;
        }
        
        .notification-warning {
            background: #f39c12;
            border-left: 4px solid #d68910;
        }
        
        .notification-error {
            background: #e74c3c;
            border-left: 4px solid #c0392b;
        }
        
        .notification button {
            background: none;
            border: none;
            color: white;
            font-size: 1.2rem;
            cursor: pointer;
            margin-left: 1rem;
            opacity: 0.8;
        }
        
        .notification button:hover {
            opacity: 1;
        }
        
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        /* Filter count styles */
        .filter-count {
            margin-top: 1rem;
            padding: 10px 15px;
            background: #f0f7f4;
            border-radius: 6px;
            color: var(--primary-dark);
            font-size: 0.9rem;
            border-left: 3px solid var(--accent);
        }
        
        /* Meta tags in cards */
        .card-meta {
            display: flex;
            gap: 8px;
            margin-top: 1rem;
            flex-wrap: wrap;
        }
        
        .meta-tag {
            padding: 3px 8px;
            border-radius: 12px;
            font-size: 0.75rem;
            font-weight: 600;
            background: #e3f2fd;
            color: #1976d2;
        }
        
        /* External document styles */
        .external-card {
            border-left: 5px solid #c99a6b;
        }
        
        .external-card .card-btn {
            background: #c99a6b;
            color: #0b3d2e;
        }
        
        .external-card .card-btn:hover {
            background: #d8b085;
        }
        
        /* Book details modal */
        .details-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1002;
            padding: 20px;
        }
        
        .details-content {
            background: var(--white);
            border-radius: var(--radius);
            width: 100%;
            max-width: 600px;
            max-height: 80vh;
            overflow-y: auto;
            padding: 2rem;
            animation: slideDown 0.3s ease;
        }
        
        .details-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1.5rem;
            padding-bottom: 1rem;
            border-bottom: 2px solid #f0f7f4;
        }
        
        .details-header h3 {
            color: var(--primary-dark);
            margin: 0;
        }
        
        .details-close {
            background: none;
            border: none;
            font-size: 1.5rem;
            color: #666;
            cursor: pointer;
            padding: 5px;
        }
        
        .details-actions {
            display: flex;
            gap: 10px;
            margin-top: 2rem;
            padding-top: 1.5rem;
            border-top: 2px solid #f0f7f4;
        }
        
        /* Surah animation styles */
        .surah-loading-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, #0b3d2e 0%, #13614a 100%);
            z-index: 9999;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #c99a6b;
            font-family: 'Amiri', 'Traditional Arabic', serif;
            opacity: 0;
            transition: opacity 0.5s ease;
        }
        
        .surah-container {
            text-align: center;
            padding: 2rem;
            max-width: 800px;
        }
        
        .bismillah {
            font-size: 2.5rem;
            margin-bottom: 2rem;
            color: #f0f7f4;
            opacity: 0;
        }
        
        .surah-text {
            font-size: 2rem;
            line-height: 1.8;
            text-align: justify;
            direction: rtl;
            opacity: 0;
        }
        
        @keyframes slideDown {
            from { opacity: 0; transform: translateY(-20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        /* Responsive improvements */
        @media (max-width: 768px) {
            .details-content {
                margin: 10px;
                max-height: 90vh;
            }
            
            .card-footer {
                flex-direction: column;
            }
            
            .details-actions {
                flex-direction: column;
            }
        }
    `;
    document.head.appendChild(styles);
}

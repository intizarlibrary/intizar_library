/**
 * Intizar Digital Library - Admin Authentication & Management
 * UPDATED VERSION - Enhanced with Surah loading and multi-language support
 */

// Configuration - UPDATED WITH NEW URL!
const ADMIN = {
    // ✅ UPDATED BACKEND URL
    backendUrl: 'https://script.google.com/macros/s/AKfycbz2dF94BG1FTjuczsspNjLuwl0Sa0Qsew5mwsJ3f0_4gGEsk_FqbRiLXjiQhTgafTw6Ng/exec',
    
    // Session management
    token: localStorage.getItem('admin_token') || null,
    tokenExpiry: localStorage.getItem('admin_token_expiry') || null,
    adminName: localStorage.getItem('admin_name') || 'Administrator',
    
    // Operation states
    isUploading: false,
    isGenerating: false,
    isLoading: false
};

// DOM Elements Storage
const adminDom = {};

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
            setTimeout(typeSurah, 200);
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
                }, 200);
            }, 500);
        }
    }
    
    // Start animation
    overlay.style.display = 'flex';
    setTimeout(() => {
        overlay.style.opacity = 1;
        typeBismillah();
    }, 100);
}

function showSurahLoading(show) {
    const overlay = document.getElementById('surah-overlay');
    if (!overlay) return;
    
    if (show) {
        overlay.style.display = 'flex';
        setTimeout(() => overlay.style.opacity = 1, 10);
        initSurahAnimation();
    } else {
        overlay.style.opacity = 0;
        setTimeout(() => overlay.style.display = 'none', 500);
    }
}

// ==================== INITIALIZATION ====================

document.addEventListener('DOMContentLoaded', function() {
    console.log('Admin panel initializing...');
    
    // Start Surah animation first
    initSurahAnimation();
    
    // Set callback for when animation completes
    window.onSurahComplete = function() {
        console.log('✅ Surah animation complete, initializing admin panel...');
        
        // Load elements
        loadElements();
        
        // Initialize event listeners
        initEventListeners();
        
        // Check existing session
        if (checkSession()) {
            showDashboard();
            setTimeout(() => loadDashboardData(), 100);
        } else {
            showLogin();
        }
    };
});

// ==================== ELEMENT LOADING ====================

function loadElements() {
    // Main containers
    adminDom.loginScreen = document.getElementById('login-screen');
    adminDom.dashboard = document.getElementById('dashboard');
    
    // Login elements
    adminDom.loginForm = document.getElementById('login-form');
    adminDom.usernameInput = document.getElementById('username');
    adminDom.passwordInput = document.getElementById('password');
    adminDom.loginBtn = document.getElementById('login-btn');
    adminDom.loginStatus = document.getElementById('login-status');
    
    // Dashboard elements
    adminDom.logoutBtn = document.getElementById('logout-btn');
    adminDom.adminName = document.getElementById('admin-name');
    adminDom.statTotal = document.getElementById('stat-total');
    adminDom.statPdf = document.getElementById('stat-pdf');
    adminDom.statDocx = document.getElementById('stat-docx');
    adminDom.statGenerated = document.getElementById('stat-generated');
    adminDom.dashboardStatus = document.getElementById('dashboard-status');
    
    // Upload form elements
    adminDom.uploadForm = document.getElementById('upload-form');
    adminDom.uploadTitle = document.getElementById('upload-title');
    adminDom.uploadAuthor = document.getElementById('upload-author');
    adminDom.uploadFile = document.getElementById('upload-file');
    adminDom.uploadSubmit = document.getElementById('upload-submit');
    adminDom.uploadStatus = document.getElementById('upload-status');
    
    // Generate PDF form elements
    adminDom.generateForm = document.getElementById('generate-form');
    adminDom.generateTitle = document.getElementById('generate-title');
    adminDom.generateAuthor = document.getElementById('generate-author');
    adminDom.generateContent = document.getElementById('generate-content');
    adminDom.generateSubmit = document.getElementById('generate-submit');
    adminDom.generateStatus = document.getElementById('generate-status');
    
    // Manage documents elements
    adminDom.documentsList = document.getElementById('documents-list');
    adminDom.searchDocs = document.getElementById('search-docs');
    adminDom.manageStatus = document.getElementById('manage-status');
    
    console.log('Elements loaded successfully');
}

// ==================== SESSION MANAGEMENT ====================

function checkSession() {
    if (!ADMIN.token || !ADMIN.tokenExpiry) {
        return false;
    }
    
    const now = Date.now();
    const expiry = parseInt(ADMIN.tokenExpiry, 10);
    
    // Clear expired session
    if (now > expiry) {
        showNotification('Session expired. Please login again.', 'warning');
        clearSession();
        return false;
    }
    
    return true;
}

function saveSession(token, username) {
    ADMIN.token = token;
    ADMIN.adminName = username;
    ADMIN.tokenExpiry = (Date.now() + (60 * 60 * 1000)).toString();
    
    localStorage.setItem('admin_token', token);
    localStorage.setItem('admin_token_expiry', ADMIN.tokenExpiry);
    localStorage.setItem('admin_name', username);
    
    console.log('Session saved for:', username);
}

function clearSession() {
    ADMIN.token = null;
    ADMIN.tokenExpiry = null;
    ADMIN.adminName = 'Administrator';
    
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_token_expiry');
    localStorage.removeItem('admin_name');
    
    console.log('Session cleared');
}

// ==================== LOGIN FUNCTION ====================

async function handleLogin(event) {
    event.preventDefault();
    
    if (ADMIN.isLoading) {
        showNotification('Please wait...', 'info');
        return;
    }
    
    const username = adminDom.usernameInput?.value?.trim() || '';
    const password = adminDom.passwordInput?.value || '';
    
    // Validation
    if (!username || !password) {
        showNotification('Please enter both username and password', 'error');
        return;
    }
    
    // Show loading state
    showLoading(true, 'login');
    
    try {
        console.log('🔄 Attempting login for:', username);
        
        // Prepare form data
        const formData = new URLSearchParams();
        formData.append('action', 'login');
        formData.append('username', username);
        formData.append('password', password);
        
        console.log('📤 Sending request to:', ADMIN.backendUrl);
        
        const response = await fetch(ADMIN.backendUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: formData
        });
        
        // Check if response is okay
        if (!response.ok) {
            throw new Error(`Server error: ${response.status} ${response.statusText}`);
        }
        
        const result = await response.json();
        console.log('📥 Login response:', result);
        
        if (result.success && result.token) {
            // Success! Save session
            saveSession(result.token, username);
            
            // Show success message
            showNotification('✅ Login successful! Loading dashboard...', 'success');
            
            // Switch to dashboard after delay
            setTimeout(() => {
                showDashboard();
                loadDashboardData();
            }, 1500);
            
        } else {
            // Login failed
            throw new Error(result.error || 'Invalid credentials');
        }
        
    } catch (error) {
        console.error('❌ Login failed:', error);
        
        // Show detailed error message
        let errorMsg = 'Login failed. ';
        
        if (error.message.includes('NetworkError') || error.message.includes('Failed to fetch')) {
            errorMsg += 'Cannot connect to server. Check your internet connection and backend URL.';
        } else if (error.message.includes('Invalid credentials')) {
            errorMsg += 'Username or password is incorrect.';
        } else {
            errorMsg += error.message;
        }
        
        showNotification(errorMsg, 'error');
        
        // Clear password field
        if (adminDom.passwordInput) {
            adminDom.passwordInput.value = '';
            adminDom.passwordInput.focus();
        }
        
    } finally {
        // Hide loading state
        showLoading(false, 'login');
    }
}

// ==================== UPLOAD DOCUMENT FUNCTION (UPDATED) ====================

async function handleUpload(event) {
    event.preventDefault();
    
    if (!checkSession()) {
        showNotification('Session expired. Please login again.', 'error');
        return;
    }
    
    if (ADMIN.isUploading) {
        showNotification('Upload in progress...', 'info');
        return;
    }
    
    // Collect all form data
    const formData = {
        title: document.getElementById('upload-title').value.trim(),
        author: document.getElementById('upload-author').value.trim(),
        description: document.getElementById('upload-description').value.trim(),
        language: document.querySelector('input[name="language"]:checked').value,
        category: document.getElementById('upload-category').value,
        source: document.querySelector('input[name="source"]:checked').value,
        externalLink: document.getElementById('upload-external').value.trim(),
        coverImage: document.getElementById('upload-cover').files[0],
        mainFile: document.getElementById('upload-file').files[0]
    };
    
    // VALIDATION
    const errors = [];
    
    // Required fields
    if (!formData.title) errors.push("Sunan littafi ya zama dole");
    if (!formData.author) errors.push("Sunan marubuci ya zama dole");
    if (!formData.category) errors.push("Zaɓi rukuni");
    if (!formData.language) errors.push("Zaɓi harshe");
    if (!formData.source) errors.push("Zaɓi tushe");
    if (!formData.mainFile) errors.push("Fayil ya zama dole");
    
    // File type validation
    if (formData.mainFile) {
        const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        if (!validTypes.includes(formData.mainFile.type)) {
            errors.push("Ana karɓar PDF da DOCX kawai");
        }
        if (formData.mainFile.size > 20 * 1024 * 1024) {
            errors.push("Girman fayil bai wuce 20MB ba");
        }
    }
    
    // Cover image validation
    if (formData.coverImage) {
        const validImageTypes = ['image/png', 'image/jpeg', 'image/jpg'];
        if (!validImageTypes.includes(formData.coverImage.type)) {
            errors.push("Hoton murfin: Ana karɓar PNG, JPG, JPEG kawai");
        }
        if (formData.coverImage.size > 5 * 1024 * 1024) {
            errors.push("Girman hoton murfin bai wuce 5MB ba");
        }
    }
    
    // URL validation for external link
    if (formData.externalLink && !isValidUrl(formData.externalLink)) {
        errors.push("Hanyar haɗin waje ba ta da inganci");
    }
    
    if (errors.length > 0) {
        showNotification(errors.join('<br>'), 'error');
        return;
    }
    
    ADMIN.isUploading = true;
    adminDom.uploadSubmit.disabled = true;
    adminDom.uploadSubmit.innerHTML = '<span class="loading-spinner"></span> Ana ɗorawa...';
    
    try {
        console.log('📤 Uploading file:', formData.mainFile.name);
        
        // Convert cover image to base64 if exists
        let coverBase64 = null;
        let coverMimeType = null;
        if (formData.coverImage) {
            coverBase64 = await fileToBase64(formData.coverImage);
            coverMimeType = formData.coverImage.type;
        }
        
        // Convert main file to base64
        const fileBase64 = await fileToBase64(formData.mainFile);
        
        // Prepare payload for backend
        const payload = new URLSearchParams();
        payload.append('action', 'upload');
        payload.append('token', ADMIN.token);
        payload.append('fileName', formData.mainFile.name);
        payload.append('mimeType', formData.mainFile.type);
        payload.append('fileBase64', fileBase64.split(',')[1]);
        payload.append('title', formData.title);
        payload.append('author', formData.author);
        payload.append('description', formData.description);
        payload.append('language', formData.language);
        payload.append('category', formData.category);
        payload.append('source', formData.source);
        if (formData.externalLink) payload.append('externalLink', formData.externalLink);
        if (coverBase64) {
            payload.append('coverImage', coverBase64.split(',')[1]);
            payload.append('coverMimeType', coverMimeType);
        }
        
        console.log('📤 Sending upload request with metadata...');
        
        const response = await fetch(ADMIN.backendUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: payload
        });
        
        const result = await response.json();
        console.log('📥 Upload response:', result);
        
        if (result.success) {
            showNotification('✅ An ɗora littafin cikin nasara!', 'success');
            
            // Clear form
            adminDom.uploadForm.reset();
            document.getElementById('file-preview').classList.add('hidden');
            document.getElementById('cover-preview').classList.add('hidden');
            
            // Reload documents
            await loadDocuments();
            
            // Show success in status div
            if (adminDom.uploadStatus) {
                adminDom.uploadStatus.innerHTML = `
                    <div class="status-message status-success">
                        <i class="fas fa-check-circle"></i>
                        An ɗora littafin cikin nasara! <a href="${result.fileUrl}" target="_blank">Duba Fayil</a>
                    </div>
                `;
            }
        } else {
            throw new Error(result.error || 'Upload failed');
        }
        
    } catch (error) {
        console.error('❌ Upload failed:', error);
        showNotification('Upload failed: ' + error.message, 'error');
        
        if (adminDom.uploadStatus) {
            adminDom.uploadStatus.innerHTML = `
                <div class="status-message status-error">
                    <i class="fas fa-exclamation-circle"></i>
                    Upload failed: ${error.message}
                </div>
            `;
        }
    } finally {
        ADMIN.isUploading = false;
        adminDom.uploadSubmit.disabled = false;
        adminDom.uploadSubmit.innerHTML = '<i class="fas fa-cloud-upload-alt"></i> Ɗora zuwa Cibiyar Littattafai';
    }
}

// Helper function for URL validation
function isValidUrl(string) {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
}

// ==================== GENERATE PDF FUNCTION (UPDATED) ====================

async function handleGeneratePDF(event) {
    event.preventDefault();
    
    if (!checkSession()) {
        showNotification('Session expired. Please login again.', 'error');
        return;
    }
    
    if (ADMIN.isGenerating) {
        showNotification('PDF generation in progress...', 'info');
        return;
    }
    
    // Collect all form data
    const formData = {
        title: document.getElementById('generate-title').value.trim(),
        author: document.getElementById('generate-author').value.trim(),
        content: document.getElementById('generate-content').value.trim(),
        description: document.getElementById('generate-description')?.value.trim() || '',
        language: document.querySelector('input[name="gen-language"]:checked')?.value || 'english',
        category: document.getElementById('generate-category')?.value || 'articles',
        source: document.querySelector('input[name="gen-source"]:checked')?.value || 'intizar',
        externalLink: document.getElementById('generate-external')?.value.trim() || ''
    };
    
    // Validation
    if (!formData.title || !formData.author || !formData.content) {
        showNotification('Please fill all required fields', 'error');
        return;
    }
    
    ADMIN.isGenerating = true;
    adminDom.generateSubmit.disabled = true;
    adminDom.generateSubmit.innerHTML = '<span class="loading-spinner"></span> Ana ƙirƙira PDF...';
    
    try {
        console.log('📄 Generating PDF:', formData.title);
        
        // Prepare payload
        const payload = new URLSearchParams();
        payload.append('action', 'generatePdf');
        payload.append('token', ADMIN.token);
        payload.append('title', formData.title);
        payload.append('author', formData.author);
        payload.append('content', formData.content);
        payload.append('description', formData.description);
        payload.append('language', formData.language);
        payload.append('category', formData.category);
        payload.append('source', formData.source);
        if (formData.externalLink) payload.append('externalLink', formData.externalLink);
        
        console.log('📤 Sending generate request...');
        
        const response = await fetch(ADMIN.backendUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: payload
        });
        
        const result = await response.json();
        console.log('📥 Generate PDF response:', result);
        
        if (result.success) {
            showNotification('✅ An ƙirƙiri PDF cikin nasara!', 'success');
            
            // Clear form
            adminDom.generateForm.reset();
            
            // Reload documents
            await loadDocuments();
            
            // Show success in status div
            if (adminDom.generateStatus) {
                adminDom.generateStatus.innerHTML = `
                    <div class="status-message status-success">
                        <i class="fas fa-check-circle"></i>
                        An ƙirƙiri PDF cikin nasara! <a href="${result.fileUrl}" target="_blank">Duba PDF</a>
                    </div>
                `;
            }
        } else {
            throw new Error(result.error || 'PDF generation failed');
        }
        
    } catch (error) {
        console.error('❌ PDF generation failed:', error);
        showNotification('PDF generation failed: ' + error.message, 'error');
        
        if (adminDom.generateStatus) {
            adminDom.generateStatus.innerHTML = `
                <div class="status-message status-error">
                    <i class="fas fa-exclamation-circle"></i>
                    PDF generation failed: ${error.message}
                </div>
            `;
        }
    } finally {
        ADMIN.isGenerating = false;
        adminDom.generateSubmit.disabled = false;
        adminDom.generateSubmit.innerHTML = '<i class="fas fa-magic"></i> Ƙirƙira & Ajiye PDF';
    }
}

// ==================== LOGOUT FUNCTION ====================

async function handleLogout() {
    if (!confirm('Are you sure you want to logout?')) {
        return;
    }
    
    try {
        // Send logout request if we have a token
        if (ADMIN.token) {
            await fetch(`${ADMIN.backendUrl}?action=logout&token=${encodeURIComponent(ADMIN.token)}`)
                .catch(e => console.warn('Logout API call failed:', e));
        }
        
        // Clear local session
        clearSession();
        
        // Reset forms
        if (adminDom.loginForm) adminDom.loginForm.reset();
        if (adminDom.uploadForm) adminDom.uploadForm.reset();
        if (adminDom.generateForm) adminDom.generateForm.reset();
        
        // Show login screen
        showLogin();
        
        // Show notification
        showNotification('✅ Successfully logged out.', 'success');
        
    } catch (error) {
        console.error('Logout error:', error);
        showNotification('Logout failed: ' + error.message, 'error');
    }
}

// ==================== DASHBOARD FUNCTIONS ====================

async function loadDashboardData() {
    if (!checkSession()) {
        showLogin();
        return;
    }
    
    // Update admin name
    if (adminDom.adminName) {
        adminDom.adminName.textContent = ADMIN.adminName;
    }
    
    // Load documents
    await loadDocuments();
    
    // Update stats
    updateStats();
    
    // Show welcome message
    showNotification(`Welcome back, ${ADMIN.adminName}!`, 'success');
}

async function loadDocuments() {
    if (!checkSession()) return;
    
    // Show loading
    if (adminDom.documentsList) {
        adminDom.documentsList.innerHTML = `
            <tr>
                <td colspan="8" style="text-align: center; padding: 3rem;">
                    <div class="loading-spinner"></div>
                    <p>Ana loda littattafai...</p>
                </td>
            </tr>
        `;
    }
    
    try {
        const response = await fetch(`${ADMIN.backendUrl}?action=getDocuments`);
        const result = await response.json();
        
        if (result.success && result.documents) {
            renderDocuments(result.documents);
            updateStatsFromDocuments(result.documents);
            showNotification(`An loda littattafai ${result.documents.length}`, 'success');
        } else {
            throw new Error(result.error || 'Failed to load documents');
        }
    } catch (error) {
        console.error('Error loading documents:', error);
        showNotification('Failed to load documents: ' + error.message, 'error');
        
        if (adminDom.documentsList) {
            adminDom.documentsList.innerHTML = `
                <tr>
                    <td colspan="8" style="text-align: center; padding: 3rem; color: #721c24;">
                        <i class="fas fa-exclamation-triangle"></i>
                        <p>Gasa loda littattafai</p>
                        <p style="font-size: 0.9rem;">${error.message}</p>
                        <button onclick="loadDocuments()" class="retry-btn">
                            <i class="fas fa-redo"></i> Gwada Sake
                        </button>
                    </td>
                </tr>
            `;
        }
    }
}

function updateStatsFromDocuments(documents) {
    if (!documents) return;
    
    const stats = {
        total: documents.length,
        pdf: documents.filter(doc => doc.Type === 'PDF').length,
        docx: documents.filter(doc => doc.Type === 'DOCX').length,
        generated: documents.filter(doc => doc.Type === 'Generated PDF').length
    };
    
    // Update DOM elements
    if (adminDom.statTotal) adminDom.statTotal.textContent = stats.total;
    if (adminDom.statPdf) adminDom.statPdf.textContent = stats.pdf;
    if (adminDom.statDocx) adminDom.statDocx.textContent = stats.docx;
    if (adminDom.statGenerated) adminDom.statGenerated.textContent = stats.generated;
}

function updateStats() {
    // This function is called when we don't have documents yet
    // Set all to 0 initially
    if (adminDom.statTotal) adminDom.statTotal.textContent = '0';
    if (adminDom.statPdf) adminDom.statPdf.textContent = '0';
    if (adminDom.statDocx) adminDom.statDocx.textContent = '0';
    if (adminDom.statGenerated) adminDom.statGenerated.textContent = '0';
}

// ==================== UTILITY FUNCTIONS ====================

function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

// Helper functions for display names
function getLanguageDisplayName(code) {
    const languages = {
        'hausa': 'Hausa',
        'english': 'English',
        'arabic': 'Arabic (عربي)',
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

function renderDocuments(documents) {
    if (!adminDom.documentsList) return;
    
    if (!documents || documents.length === 0) {
        adminDom.documentsList.innerHTML = `
            <tr>
                <td colspan="8" style="text-align: center; padding: 3rem;">
                    <i class="fas fa-inbox"></i>
                    <p>Babu littattafai da aka samo</p>
                    <p style="font-size: 0.9rem;">Ɗora littafin ku na farko don farawa</p>
                </td>
            </tr>
        `;
        return;
    }
    
    let html = '';
    documents.forEach(doc => {
        const date = new Date(doc.DateAdded).toLocaleDateString();
        const typeClass = doc.Type === 'PDF' ? 'doc-type-pdf' :
                         doc.Type === 'DOCX' ? 'doc-type-docx' :
                         'doc-type-generated';
        
        // Get display names
        const languageDisplay = getLanguageDisplayName(doc.Language);
        const categoryDisplay = getCategoryDisplayName(doc.Category);
        const sourceDisplay = getSourceDisplayName(doc.Source);
        
        html += `
            <tr>
                <td><strong>${escapeHtml(doc.Title || 'Ba suna')}</strong></td>
                <td>${escapeHtml(doc.Author || 'Ba marubuci')}</td>
                <td>${escapeHtml(languageDisplay)}</td>
                <td>${escapeHtml(categoryDisplay)}</td>
                <td>${escapeHtml(sourceDisplay)}</td>
                <td><span class="doc-type-badge ${typeClass}">${doc.Type}</span></td>
                <td>${date}</td>
                <td>
                    <div class="action-buttons">
                        <a href="${doc.DriveUrl}" target="_blank" class="action-btn view">
                            <i class="fas fa-eye"></i> Duba
                        </a>
                        <a href="${doc.DriveUrl}" download class="action-btn download">
                            <i class="fas fa-download"></i> Zazzagewa
                        </a>
                    </div>
                </td>
            </tr>
        `;
    });
    
    adminDom.documentsList.innerHTML = html;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ==================== UI MANAGEMENT ====================

function showLogin() {
    if (adminDom.loginScreen) {
        adminDom.loginScreen.classList.remove('hidden');
    }
    if (adminDom.dashboard) {
        adminDom.dashboard.classList.add('hidden');
    }
    
    document.title = 'Admin Login - Intizar Library';
    
    // Focus on username field
    setTimeout(() => {
        if (adminDom.usernameInput) {
            adminDom.usernameInput.focus();
        }
    }, 100);
}

function showDashboard() {
    if (adminDom.loginScreen) {
        adminDom.loginScreen.classList.add('hidden');
    }
    if (adminDom.dashboard) {
        adminDom.dashboard.classList.remove('hidden');
    }
    
    document.title = 'Admin Dashboard - Intizar Library';
    
    // Set first tab as active
    switchTab('upload');
}

function showLoading(isLoading, type = 'general') {
    ADMIN.isLoading = isLoading;
    
    if (type === 'login' && adminDom.loginBtn) {
        if (isLoading) {
            adminDom.loginBtn.innerHTML = '<span class="loading-spinner"></span> Authenticating...';
            adminDom.loginBtn.disabled = true;
        } else {
            adminDom.loginBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Login to Dashboard';
            adminDom.loginBtn.disabled = false;
        }
    }
}

// ==================== TAB MANAGEMENT ====================

function switchTab(tabId) {
    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach(tab => {
        if (tab.dataset.tab === tabId) {
            tab.classList.add('active');
        } else {
            tab.classList.remove('active');
        }
    });
    
    // Update tab content
    document.querySelectorAll('.tab-content').forEach(content => {
        if (content.id === `tab-${tabId}`) {
            content.classList.add('active');
        } else {
            content.classList.remove('active');
        }
    });
}

// ==================== NOTIFICATION SYSTEM ====================

function showNotification(message, type = 'info') {
    console.log(`📢 ${type.toUpperCase()}: ${message}`);
    
    // Remove existing notifications
    const existing = document.querySelectorAll('.notification');
    existing.forEach(n => n.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${getIconForType(type)}"></i>
            <span>${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Show with animation
    setTimeout(() => notification.classList.add('show'), 10);
    
    // Auto-remove after 5 seconds (10 for errors)
    const duration = type === 'error' ? 10000 : 5000;
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, duration);
    
    // Close button
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    });
}

function getIconForType(type) {
    switch (type) {
        case 'success': return 'check-circle';
        case 'error': return 'exclamation-circle';
        case 'warning': return 'exclamation-triangle';
        default: return 'info-circle';
    }
}

// ==================== EVENT LISTENERS ====================

function initEventListeners() {
    console.log('Initializing event listeners...');
    
    // Login form
    if (adminDom.loginForm) {
        console.log('Login form found, adding listener');
        adminDom.loginForm.addEventListener('submit', handleLogin);
        
        // Also listen for Enter key
        adminDom.passwordInput?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !ADMIN.isLoading) {
                handleLogin(e);
            }
        });
    } else {
        console.warn('Login form not found!');
    }
    
    // Logout button
    if (adminDom.logoutBtn) {
        adminDom.logoutBtn.addEventListener('click', handleLogout);
    }
    
    // Upload form
    if (adminDom.uploadForm) {
        console.log('Upload form found, adding listener');
        adminDom.uploadForm.addEventListener('submit', handleUpload);
    }
    
    // Generate PDF form
    if (adminDom.generateForm) {
        console.log('Generate PDF form found, adding listener');
        adminDom.generateForm.addEventListener('submit', handleGeneratePDF);
    }
    
    // Tabs
    const tabs = document.querySelectorAll('.tab-btn');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabId = tab.dataset.tab;
            switchTab(tabId);
        });
    });
    
    // Refresh documents button
    const refreshBtn = document.getElementById('refresh-docs');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', () => {
            showNotification('Refreshing document list...', 'info');
            loadDocuments();
        });
    }
    
    // Form reset buttons
    const uploadResetBtn = document.getElementById('upload-reset');
    if (uploadResetBtn) {
        uploadResetBtn.addEventListener('click', () => {
            if (adminDom.uploadForm) {
                adminDom.uploadForm.reset();
                document.getElementById('file-preview').classList.add('hidden');
                document.getElementById('cover-preview').classList.add('hidden');
                if (adminDom.uploadStatus) adminDom.uploadStatus.innerHTML = '';
                showNotification('Form cleared', 'info');
            }
        });
    }
    
    // File preview for upload
    const uploadFileInput = document.getElementById('upload-file');
    if (uploadFileInput) {
        uploadFileInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const preview = document.getElementById('file-preview');
                const fileName = document.getElementById('file-name');
                const fileSize = document.getElementById('file-size');
                
                if (preview && fileName && fileSize) {
                    preview.classList.remove('hidden');
                    fileName.textContent = file.name;
                    fileSize.textContent = `${(file.size / 1024).toFixed(2)} KB`;
                }
            }
        });
    }
    
    // Cover image preview
    const uploadCoverInput = document.getElementById('upload-cover');
    if (uploadCoverInput) {
        uploadCoverInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const preview = document.getElementById('cover-preview');
                const coverName = document.getElementById('cover-name');
                const coverSize = document.getElementById('cover-size');
                const coverThumb = document.getElementById('cover-thumb');
                
                if (preview && coverName && coverSize && coverThumb) {
                    preview.classList.remove('hidden');
                    coverName.textContent = file.name;
                    coverSize.textContent = `${(file.size / 1024).toFixed(2)} KB`;
                    
                    // Create thumbnail preview
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        coverThumb.src = e.target.result;
                    };
                    reader.readAsDataURL(file);
                }
            }
        });
    }
    
    // Clear cover preview on form reset
    if (uploadResetBtn) {
        uploadResetBtn.addEventListener('click', () => {
            const coverPreview = document.getElementById('cover-preview');
            if (coverPreview) coverPreview.classList.add('hidden');
        });
    }
    
    // Home button
    const homeBtn = document.getElementById('home-btn');
    if (homeBtn) {
        homeBtn.addEventListener('click', () => {
            showNotification('Ana komawa gida...', 'info');
        });
    }
    
    // Preview formatting button
    const previewBtn = document.getElementById('generate-preview');
    if (previewBtn) {
        previewBtn.addEventListener('click', function() {
            const content = adminDom.generateContent?.value;
            if (content) {
                showNotification('Opening preview...', 'info');
                // Simple preview - you can enhance this
                const preview = window.open('', '_blank');
                preview.document.write(`
                    <html>
                    <head>
                        <title>Preview - PDF Generation</title>
                        <style>
                            body { font-family: Arial, sans-serif; padding: 20px; line-height: 1.6; }
                            h1 { color: #0b3d2e; }
                            .meta { color: #666; font-style: italic; }
                        </style>
                    </head>
                    <body>
                        <h1>${escapeHtml(adminDom.generateTitle?.value || 'Untitled')}</h1>
                        <div class="meta">Author: ${escapeHtml(adminDom.generateAuthor?.value || 'Unknown')}</div>
                        <hr>
                        <div>${content.replace(/\n/g, '<br>')}</div>
                    </body>
                    </html>
                `);
            } else {
                showNotification('Please enter content to preview', 'warning');
            }
        });
    }
    
    // Search documents
    if (adminDom.searchDocs) {
        adminDom.searchDocs.addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase();
            const rows = document.querySelectorAll('#documents-list tr');
            
            rows.forEach(row => {
                const text = row.textContent.toLowerCase();
                row.style.display = text.includes(searchTerm) ? '' : 'none';
            });
        });
    }
    
    // Add keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Escape key to cancel/focus
        if (e.key === 'Escape') {
            if (ADMIN.isLoading || ADMIN.isUploading || ADMIN.isGenerating) {
                showNotification('Operation cancelled', 'warning');
            }
        }
        
        // Ctrl/Cmd + L to focus login
        if ((e.ctrlKey || e.metaKey) && e.key === 'l') {
            e.preventDefault();
            if (adminDom.usernameInput) {
                adminDom.usernameInput.focus();
            }
        }
    });
    
    console.log('Event listeners initialized');
}

// ==================== CSS FOR NOTIFICATIONS & LOADING ====================

function addStyles() {
    // Check if styles are already added
    if (document.getElementById('admin-dynamic-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'admin-dynamic-styles';
    style.textContent = `
        /* Loading spinner */
        .loading-spinner {
            display: inline-block;
            width: 20px;
            height: 20px;
            border: 3px solid rgba(19, 97, 74, 0.3);
            border-radius: 50%;
            border-top-color: #13614a;
            animation: spin 1s ease-in-out infinite;
            margin-right: 10px;
            vertical-align: middle;
        }
        
        @keyframes spin {
            to { transform: rotate(360deg); }
        }
        
        /* Notifications */
        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            background: white;
            padding: 0;
            border-radius: 8px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            z-index: 10000;
            transform: translateX(150%);
            transition: transform 0.3s ease;
            max-width: 400px;
            overflow: hidden;
        }
        
        .notification.show {
            transform: translateX(0);
        }
        
        .notification-content {
            display: flex;
            align-items: center;
            padding: 15px 20px;
            gap: 12px;
        }
        
        .notification-success {
            background: #d4edda;
            color: #155724;
            border-left: 4px solid #28a745;
        }
        
        .notification-error {
            background: #f8d7da;
            color: #721c24;
            border-left: 4px solid #dc3545;
        }
        
        .notification-warning {
            background: #fff3cd;
            color: #856404;
            border-left: 4px solid #ffc107;
        }
        
        .notification-info {
            background: #d1ecf1;
            color: #0c5460;
            border-left: 4px solid #17a2b8;
        }
        
        .notification i {
            font-size: 1.2rem;
            flex-shrink: 0;
        }
        
        .notification-close {
            background: none;
            border: none;
            font-size: 1.5rem;
            color: inherit;
            cursor: pointer;
            margin-left: auto;
            padding: 0 5px;
        }
        
        /* Retry button */
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
        }
        
        .retry-btn:hover {
            background: #0b3d2e;
        }
        
        /* Disabled states */
        button:disabled {
            opacity: 0.6;
            cursor: not-allowed;
        }
        
        /* Hidden class */
        .hidden {
            display: none !important;
        }
        
        /* Action buttons in table */
        .action-btn {
            padding: 6px 12px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 0.85rem;
            display: flex;
            align-items: center;
            gap: 5px;
            transition: all 0.3s;
            text-decoration: none;
        }
        
        .action-btn.view {
            background: #f0f7f4;
            color: var(--primary-dark);
        }
        
        .action-btn.download {
            background: #e3f2fd;
            color: #1976d2;
        }
        
        .action-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 3px 10px rgba(0,0,0,0.1);
        }
        
        /* Status messages */
        .status-message {
            padding: 1rem;
            border-radius: 6px;
            margin: 1rem 0;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .status-success {
            background: #d4edda;
            color: #155724;
            border-left: 4px solid #28a745;
        }
        
        .status-error {
            background: #f8d7da;
            color: #721c24;
            border-left: 4px solid #dc3545;
        }
        
        .status-info {
            background: #d1ecf1;
            color: #0c5460;
            border-left: 4px solid #17a2b8;
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
    `;
    document.head.appendChild(style);
}

// Add styles when page loads
addStyles();

// Make functions available globally for debugging
window.ADMIN = ADMIN;
window.handleLogin = handleLogin;
window.handleLogout = handleLogout;
window.loadDocuments = loadDocuments;
window.handleUpload = handleUpload;
window.handleGeneratePDF = handleGeneratePDF;;
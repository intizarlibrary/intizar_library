// Intizar Digital Library - Google Apps Script Backend v4.1
// Enhanced Mahdawiyyah-focused version

const CONFIG = {
  GEMINI_API_KEY: PropertiesService.getScriptProperties().getProperty('GEMINI_API_KEY'),
  ADMIN_USERNAME: PropertiesService.getScriptProperties().getProperty('ADMIN_USERNAME'),
  ADMIN_PASSWORD: PropertiesService.getScriptProperties().getProperty('ADMIN_PASSWORD'),
  SPREADSHEET_ID: PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID'),
  DRIVE_FOLDER_NAME: 'Intizar Digital Library',
  SHEET_NAME: 'intizar_library',
  AI_MODEL: 'gemini-2.5-flash',
  SESSION_TIMEOUT_MINUTES: 60
};

const VALID_LANGUAGES = ['hausa', 'english', 'arabic', 'other'];
const VALID_CATEGORIES = ['history', 'ideology', 'articles', 'lists', 'biography', 'sermons', 'other'];
const VALID_SOURCES = ['intizar', 'individual', 'external'];

const MAHDAWIYYAH_KEYWORDS = [
  // Core Concepts
  'mahdawiyyah', 'mahdi', 'imam mahdi', 'imam al-mahdi', 'al-mahdi', 
  'intizar', 'muntazar', 'awaited', 'al-muntazar', 'al-muntadhar',
  'occultation', 'ghaybah', 'ghaibah', 'ghaybat', 'occultation',
  'zuhur', 'reappearance', 'appearance', 'advent', 'parousia',
  'rajah', 'return', 'second coming', 'end times', 'akhir zaman',
  'eschatology', 'apocalypse', 'qiyamah', 'judgment day',
  'savior', 'messiah', 'masih', 'deliverer', 'rescuer',
  
  // Titles and Nicknames of Imam Mahdi (AJF)
  'sahib al-zaman', 'sahibuzzaman', 'lord of the age', 'master of the time',
  'al-qa\'im', 'qa\'im', 'the riser', 'the one who will rise',
  'al-mahdi al-muntazar', 'the awaited mahdi',
  'baqiyyatullah', 'remnant of allah',
  'al-hujjah', 'hujjatullah', 'proof of allah',
  'al-khalaf al-salih', 'the righteous successor',
  'al-imam al-gha\'ib', 'the hidden imam',
  'al-imam al-hadi', 'the guiding imam',
  'al-mahdi al-maw\'ud', 'the promised mahdi',
  'sahib al-amr', 'master of the affair',
  'al-manthur', 'the promised one',
  'al-muntasir', 'the victorious',
  'al-mahdi al-mahmud', 'the praised mahdi',
  'al-mahdi al-mu\'adh', 'the promised helper',
  
  // Hausa Nicknames
  'mai ceton zaman', 'mai fansarwa', 'mai gyaran duniya',
  'mai kawo adalci', 'mai kawo zaman lafiya', 'mai zaman lafiya',
  'imam da ake jira', 'imam da za a yi rajarsa', 'imam na karshe',
  'shehun zaman', 'mujaddadin addini', 'mai kawo sauyi',
  
  // Arabic Nicknames
  'صاحب الزمان', 'القائم', 'المهدي', 'المنتظر', 'البقية', 'الحجة',
  'الخلف الصالح', 'الإمام الغائب', 'الإمام الهادي', 'المهدي الموعود',
  'صاحب الأمر', 'المنصور', 'المنتصر', 'المهدي المحمود', 'المهدي المعاذ',
  
  // Persian/Urdu Nicknames
  'صاحب الزمان', 'قائم', 'مهدي', 'منتظر', 'بقیة الله', 'حجة الله',
  
  // Key Figures and Advocates
  'zakzaky', 'sheikh ibrahim zakzaky', 'sheikh zakzaky', 'sayyid zakzaky',
  'khomeini', 'imam khomeini', 'ayatollah khomeini', 'ruhollah khomeini',
  'khamenei', 'sayyid khamenei', 'ayatollah khamenei', 'ali khamenei',
  'bahajati', 'allamah bahajati', 'allamah bahajatiy', 'bahajatiy', // Added as requested
  'shirazi', 'sayyid sadiq shirazi', 'grand ayatollah shirazi',
  'sistani', 'sayyid sistani', 'ayatollah sistani',
  'shariatmadari', 'ayatollah shariatmadari',
  'montazeri', 'ayatollah montazeri',
  'tabatabai', 'allamah tabatabai',
  'mutahhari', 'murtaza mutahhari',
  'makarim shirazi', 'ayatollah makarim shirazi',
  
  // Organizations and Movements
  'intizarul imamul muntazar', 'intizar foundation', 'intizar movement',
  'islamic movement', 'islamic movement in nigeria', 'imn',
  'shia', 'shiite', 'shii', 'shi\'a', 'twelver', 'ithna ashari',
  'ahlul bayt', 'ahl al-bayt', 'progeny of the prophet',
  
  // Doctrinal Terms
  'imamah', 'imamate', 'wilayat', 'wilayah', 'guardianship',
  'wilayat al-faqih', 'guardianship of the jurist',
  'tawalla', 'tabarra', 'love for ahlul bayt', 'disassociation from enemies',
  'taqiyyah', 'dissimulation', 'prudent concealment',
  
  // Geographical References
  'samin', 'samin wa samawat', 'jannatul ma\'wa', 'paradise of refuge',
  'jamkaran', 'masjid jamkaran', 'jamkaran mosque',
  
  // Hausa Variations
  'zakzaki', 'zakzakiy', 'zazakiy', 'zazaky',
  'mahdawiyya', 'mahdawiyar', 'mahdawiyancin',
  'intizara', 'muntazara', 'muntadara',
  'lokacin', 'sabon zaman', 'karshen duniya',
  'ranar sakamako', 'ranar kiyama', 'kayyamatan',
  'alkawari', 'alkawarin imam', 'alkawarin mahdi',
  'amana', 'amanar imam', 'amanar mahdi',
  'shehu', 'shehun zaman', 'malamai',
  
  // Arabic Variations
  'مهدوية', 'مهدي', 'إمام المهدي', 'انتظار', 'منتظر', 'غيبة',
  'ظهور', 'رجعة', 'قيامة', 'يوم القيامة', 'آخر الزمان',
  'شيعي', 'شيعة', 'إمامة', 'ولاية', 'ولاية الفقيه',
  'تولي', 'تبرء', 'تقيّة',
  
  // English Variations
  'mahdism', 'mahdaviat', 'mahdavi', 'mahdavian',
  'awaiting', 'expectation', 'the awaited one',
  'hidden imam', 'twelfth imam', 'imam of the time',
  'shia islam', 'shiism', 'twelver shia'
];

function getOrCreateFolder() {
  try {
    const folders = DriveApp.getFoldersByName(CONFIG.DRIVE_FOLDER_NAME);
    return folders.hasNext() ? folders.next() : DriveApp.createFolder(CONFIG.DRIVE_FOLDER_NAME);
  } catch (e) {
    console.error('Drive folder error:', e);
    throw new Error('Drive service error');
  }
}

function getSpreadsheet() {
  if (!CONFIG.SPREADSHEET_ID) {
    throw new Error('SPREADSHEET_ID not configured. Run setup() first.');
  }
  return SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
}

function ensureSheetExists() {
  try {
    const ss = getSpreadsheet();
    let sheet = ss.getSheetByName(CONFIG.SHEET_NAME);
    
    if (!sheet) {
      sheet = ss.insertSheet(CONFIG.SHEET_NAME);
      const headers = ['ID', 'Title', 'Author', 'Description', 'Language', 'Category', 
                      'Source', 'Type', 'DateAdded', 'DriveFileId', 'DriveUrl', 
                      'CoverImageId', 'ExternalLink'];
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
      sheet.setFrozenRows(1);
    }
    
    if (sheet.getLastColumn() < 13) {
      sheet.autoResizeColumns(1, 13);
    }
    
    return sheet;
  } catch (e) {
    console.error('Sheet error:', e);
    throw new Error('Spreadsheet error: ' + e.message);
  }
}

function generateUniqueId() {
  return Utilities.getUuid();
}

function isValidSession(token) {
  if (!token) return false;
  const cache = CacheService.getScriptCache();
  const stored = cache.get('admin_' + token);
  return stored === 'authenticated';
}

function createSession() {
  const token = Utilities.getUuid();
  const cache = CacheService.getScriptCache();
  cache.put('admin_' + token, 'authenticated', CONFIG.SESSION_TIMEOUT_MINUTES * 60);
  return token;
}

function destroySession(token) {
  if (token) {
    CacheService.getScriptCache().remove('admin_' + token);
  }
}

function makeFilePublic(fileId) {
  try {
    const file = DriveApp.getFileById(fileId);
    
    // Remove all existing editors and viewers
    const editors = file.getEditors();
    const viewers = file.getViewers();
    
    editors.forEach(function(user) {
      try {
        file.removeEditor(user);
      } catch (e) {
        console.warn('Error removing editor:', e);
      }
    });
    
    viewers.forEach(function(user) {
      try {
        file.removeViewer(user);
      } catch (e) {
        console.warn('Error removing viewer:', e);
      }
    });
    
    // Set to public view
    file.setSharing(DriveApp.Access.ANYONE, DriveApp.Permission.VIEW);
    
    // Also make parent folder public
    try {
      const folders = file.getParents();
      if (folders.hasNext()) {
        const folder = folders.next();
        folder.setSharing(DriveApp.Access.ANYONE, DriveApp.Permission.VIEW);
      }
    } catch (e) {
      console.warn('Could not set folder permissions:', e);
    }
    
    return file.getUrl();
  } catch (e) {
    console.error('Error making file public:', e);
    throw new Error('Failed to set public access: ' + e.message);
  }
}

function isMahdawiyyahRelated(text) {
  if (!text || text.trim().length < 3) return false;
  
  const lower = text.toLowerCase().trim();
  
  // Direct keyword matching
  for (let i = 0; i < MAHDAWIYYAH_KEYWORDS.length; i++) {
    if (lower.includes(MAHDAWIYYAH_KEYWORDS[i].toLowerCase())) {
      return true;
    }
  }
  
  // Check for advocates
  const advocates = ['zakzaky', 'khomeini', 'khamenei', 'bahajati', 'bahajatiy', 'shirazi', 'sistani', 'montazeri'];
  for (let i = 0; i < advocates.length; i++) {
    if (lower.includes(advocates[i])) {
      return true;
    }
  }
  
  // Enhanced detection for Islamic terms
  const islamicTerms = ['imam', 'mahdi', 'prophet', 'islam', 'quran', 'hadith', 'shia', 'sunni'];
  let islamicTermCount = 0;
  for (let i = 0; i < islamicTerms.length; i++) {
    if (lower.includes(islamicTerms[i])) {
      islamicTermCount++;
    }
  }
  
  // If multiple Islamic terms present, likely related
  if (islamicTermCount >= 2) {
    return true;
  }
  
  // Question patterns about Islamic leadership
  const questionPatterns = [
    /who is.*imam/i,
    /what is.*mahdi/i,
    /explain.*ghaybah/i,
    /tell me about.*zakzaky/i,
    /me.*game da.*imam/i,
    /ما هو.*المهدي/i,
    /من هو.*الإمام/i
  ];
  
  for (let i = 0; i < questionPatterns.length; i++) {
    if (questionPatterns[i].test(lower)) {
      return true;
    }
  }
  
  return false;
}

function escapeHtml(text) {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function detectLanguage(text) {
  if (!text || text.trim().length === 0) return 'ha';
  
  const cleanText = text.toLowerCase().trim();
  
  // Check for Arabic script
  const arabicRegex = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;
  if (arabicRegex.test(text)) return 'ar';
  
  // Check for Hausa patterns
  const hausaWords = ['hausa', 'almahdi', 'intizara', 'zakzaky', 'me', 'yaya', 'wane', 'wace', 
                      'ina', 'wana', 'kada', 'don', 'saboda', 'domin', 'wannan', 'wancan',
                      'ko', 'shi', 'ita', 'su', 'mu', 'ku', 'kai', 'ke'];
  
  for (let i = 0; i < hausaWords.length; i++) {
    if (cleanText.includes(hausaWords[i])) {
      return 'ha';
    }
  }
  
  const hausaPhrasePattern = /(me yasa|yaya ake|wace|wane|ina|don me|saboda me)/i;
  if (hausaPhrasePattern.test(cleanText)) return 'ha';
  
  // Check for English
  const englishWords = ['what', 'who', 'when', 'where', 'why', 'how', 'explain', 'describe', 
                       'tell me', 'about', 'islam', 'muslim', 'quran', 'prophet'];
  
  for (let i = 0; i < englishWords.length; i++) {
    if (cleanText.includes(englishWords[i])) {
      return 'en';
    }
  }
  
  // Default to Hausa
  return 'ha';
}

function validateBookMetadata(metadata) {
  const errors = [];
  
  if (!metadata.title || metadata.title.trim().length < 2) {
    errors.push('Title must be at least 2 characters.');
  }
  
  if (!metadata.author || metadata.author.trim().length < 2) {
    errors.push('Author must be at least 2 characters.');
  }
  
  if (metadata.description && metadata.description.length > 500) {
    errors.push('Description must be 500 characters or less.');
  }
  
  if (!metadata.language || !VALID_LANGUAGES.includes(metadata.language)) {
    errors.push(`Language is required. Must be one of: ${VALID_LANGUAGES.join(', ')}`);
  }
  
  if (!metadata.category || !VALID_CATEGORIES.includes(metadata.category)) {
    errors.push(`Category is required. Must be one of: ${VALID_CATEGORIES.join(', ')}`);
  }
  
  if (!metadata.source || !VALID_SOURCES.includes(metadata.source)) {
    errors.push(`Source is required. Must be one of: ${VALID_SOURCES.join(', ')}`);
  }
  
  if (metadata.externalLink && metadata.externalLink.trim() !== '') {
    if (!isValidUrl(metadata.externalLink)) {
      errors.push('External link must be a valid URL (starting with http:// or https://).');
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors: errors
  };
}

function isValidUrl(string) {
  try {
    const url = new URL(string);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch (_) {
    return false;
  }
}

function callGeminiAPI(prompt) {
  if (!CONFIG.GEMINI_API_KEY) {
    throw new Error('Gemini API key not configured. Set GEMINI_API_KEY in Script Properties.');
  }

  const detectedLanguage = detectLanguage(prompt);
  
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${CONFIG.AI_MODEL}:generateContent`;
  
  // ENHANCED PROMPT WITHOUT META VALIDATION
  const enhancedPrompt = `You are an expert scholar on Mahdawiyyah (the doctrine of Imam Mahdi AJF) at Intizar Digital Library. 

RESPONSE LANGUAGE: ${detectedLanguage === 'ar' ? 'Respond in clear classical Arabic.' : detectedLanguage === 'en' ? 'Respond in English.' : 'Respond in simple everyday Hausa.'}

CORE INSTRUCTIONS:
1. Respond ONLY in plain text without any markdown symbols (no asterisks, hashtags, underscores, or markdown).
2. Focus comprehensively on Mahdawiyyah topics.
3. Always use full honorifics: Imam Mahdi (عجل الله فرجه الشريف) or (AJF).
4. Mention relevant nicknames of Imam Mahdi when discussing him.
5. Include relevant Quran verses and Hadith with sources when appropriate.
6. Reference teachings of Sheikh Zakzaky about awaiting.
7. Mention works of Allamah Bahajatiy when relevant.
8. Discuss the concept of Wilayat al-Faqih in relation to Mahdawiyyah.
9. Explain the role of Intizar in contemporary times.

MAHDAWIYYAH TOPICS TO COVER:
- Imam Mahdi (AJF) - جميع ألقابه (صاحب الزمان، القائم، البقية، الحجة، الخ)
- Intizar/الانتظار (awaiting the Imam) - Duties during occultation
- Ghaybah/الغيبة (Occultation) - الصغرى والكبرى
- Raj'ah/الرجعة (Return) - المفهوم والأدلة
- Zuhur/الظهور (Reappearance) - العلامات والشروط
- Mahdawiyyah advocates: Sheikh Ibraheem Zakzaky, Imam Khomeini, Sayyid Ali Khamenei, Allamah Bahajatiy
- Islamic eschatology related to Imam Mahdi
- Mahdawiyyah in Quran and Hadith
- Signs of reappearance (علامات الظهور)
- Ahlul Bayt teachings about Imam Mahdi
- Historical accounts of Imam Mahdi
- Philosophical aspects of awaiting
- Social and political implications of Mahdawiyyah

Question: ${prompt}

Provide a comprehensive, scholarly answer focusing on Mahdawiyyah.`;
  
  const payload = {
    contents: [{
      parts: [{ text: enhancedPrompt }]
    }],
    generationConfig: {
      temperature: 0.7,
      topP: 0.95,
      topK: 40,
      maxOutputTokens: 3072,
    },
    safetySettings: [
      {
        category: "HARM_CATEGORY_HARASSMENT",
        threshold: "BLOCK_NONE"
      },
      {
        category: "HARM_CATEGORY_HATE_SPEECH",
        threshold: "BLOCK_NONE"
      },
      {
        category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
        threshold: "BLOCK_NONE"
      },
      {
        category: "HARM_CATEGORY_DANGEROUS_CONTENT",
        threshold: "BLOCK_NONE"
      }
    ]
  };

  const options = {
    method: 'post',
    contentType: 'application/json',
    headers: { 'x-goog-api-key': CONFIG.GEMINI_API_KEY },
    payload: JSON.stringify(payload),
    muteHttpExceptions: true,
    timeout: 30000
  };

  try {
    console.log('Sending request to Gemini API...');
    const response = UrlFetchApp.fetch(url, options);
    const data = JSON.parse(response.getContentText());
    
    if (data.error) {
      console.error('Gemini API error:', data.error);
      throw new Error(`AI service error: ${data.error.message || 'Unknown error'}`);
    }
    
    const aiResponse = data?.candidates?.[0]?.content?.parts?.[0]?.text || 
           'I apologize, but I could not generate a response. Please try again.';
    
    console.log('AI Response received, length:', aiResponse.length);
    return aiResponse;
  } catch (error) {
    console.error('Gemini API call failed:', error);
    throw new Error('AI service unavailable. Please try again later.');
  }
}

function getLanguageDisplayName(code) {
  const languages = {
    'hausa': 'Hausa',
    'english': 'English',
    'arabic': 'Arabic (عربي)',
    'other': 'Others'
  };
  return languages[code] || code;
}

function getCategoryDisplayName(code) {
  const categories = {
    'history': 'History (Tarihi)',
    'ideology': 'Ideology (Akida)',
    'articles': 'Articles (Kasidu)',
    'lists': 'Lists (Jerin)',
    'biography': 'Biography (Tarihin Rayuwa)',
    'sermons': 'Sermons (Wa\'azi)',
    'other': 'Others (Sauran)'
  };
  return categories[code] || code;
}

function getSourceDisplayName(code) {
  const sources = {
    'intizar': 'Intizarul Imamul Muntazar',
    'individual': 'Individual Writing (Rubutun Mutum)',
    'external': 'External Source (Tushen Waje)'
  };
  return sources[code] || code;
}

function countBy(array, key) {
  return array.reduce((acc, item) => {
    const value = item[key] || 'Unknown';
    acc[value] = (acc[value] || 0) + 1;
    return acc;
  }, {});
}

function handleGetDocuments() {
  try {
    const sheet = ensureSheetExists();
    const data = sheet.getDataRange().getValues();
    
    if (data.length < 2) {
      return { success: true, documents: [] };
    }
    
    const headers = data[0];
    const rows = data.slice(1)
      .filter(row => row[0])
      .map(row => {
        const obj = {};
        headers.forEach((header, idx) => {
          obj[header] = row[idx] || '';
        });
        
        if (obj.CoverImageId && obj.CoverImageId.trim() !== '') {
          try {
            obj.CoverImageUrl = `https://drive.google.com/uc?id=${obj.CoverImageId}`;
          } catch (e) {
            obj.CoverImageUrl = '';
          }
        } else {
          obj.CoverImageUrl = '';
        }
        
        if (obj.DriveFileId && obj.DriveFileId.trim() !== '') {
          try {
            makeFilePublic(obj.DriveFileId);
          } catch (e) {
            console.warn('Could not update permissions for:', obj.DriveFileId);
          }
        }
        
        obj.LanguageDisplay = getLanguageDisplayName(obj.Language);
        obj.CategoryDisplay = getCategoryDisplayName(obj.Category);
        obj.SourceDisplay = getSourceDisplayName(obj.Source);
        
        return obj;
      });

    rows.sort((a, b) => {
      const dateA = new Date(a.DateAdded || 0);
      const dateB = new Date(b.DateAdded || 0);
      return dateB - dateA;
    });

    return {
      success: true,
      documents: rows,
      count: rows.length,
      metadata: {
        total: rows.length,
        byLanguage: countBy(rows, 'Language'),
        byCategory: countBy(rows, 'Category'),
        bySource: countBy(rows, 'Source'),
        byType: countBy(rows, 'Type')
      }
    };
  } catch (e) {
    console.error('Error getting documents:', e);
    return {
      success: false,
      error: 'Failed to load documents: ' + e.message
    };
  }
}

function handleAIRequest(userInput) {
  try {
    if (!userInput || userInput.trim().length < 3) {
      return {
        success: false,
        error: 'Please enter a valid question (at least 3 characters).'
      };
    }
    
    if (userInput.length > 1000) {
      return {
        success: false,
        error: 'Question too long. Please keep it under 1000 characters.'
      };
    }

    console.log('AI Question received:', userInput.substring(0, 100));
    
    const detectedLanguage = detectLanguage(userInput);
    
    // Check if question is Mahdawiyyah-related (but don't reject if not)
    const isRelated = isMahdawiyyahRelated(userInput);
    
    const aiResponse = callGeminiAPI(userInput);

    return {
      success: true,
      response: aiResponse,
      timestamp: new Date().toISOString(),
      language: detectedLanguage,
      isMahdawiyyahRelated: isRelated
    };
  } catch (e) {
    console.error('AI request error:', e);
    return {
      success: false,
      error: e.message || 'Failed to process AI request.'
    };
  }
}

function handleAdminLogin(username, password) {
  try {
    if (username === CONFIG.ADMIN_USERNAME && password === CONFIG.ADMIN_PASSWORD) {
      const token = createSession();
      return {
        success: true,
        token: token,
        expiresIn: CONFIG.SESSION_TIMEOUT_MINUTES * 60
      };
    }
    return {
      success: false,
      error: 'Invalid username or password.'
    };
  } catch (e) {
    console.error('Login error:', e);
    return {
      success: false,
      error: 'Login service unavailable.'
    };
  }
}

function handleFileUpload(token, blob, fileName, title, author, description, language, category, source, externalLink, coverImageBase64, coverMimeType) {
  if (!isValidSession(token)) {
    throw new Error('Session expired. Please login again.');
  }

  const metadata = {
    title: title,
    author: author,
    description: description,
    language: language,
    category: category,
    source: source,
    externalLink: externalLink
  };

  const validation = validateBookMetadata(metadata);
  if (!validation.isValid) {
    throw new Error(validation.errors.join(' '));
  }

  const validTypes = ['application/pdf', 
                     'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
  if (!validTypes.includes(blob.getContentType())) {
    throw new Error('Only PDF and DOCX files are allowed.');
  }

  const folder = getOrCreateFolder();
  const file = folder.createFile(blob);
  file.setName(fileName.substring(0, 100));
  
  const publicUrl = makeFilePublic(file.getId());

  let coverImageId = '';
  let coverImageUrl = '';
  
  if (coverImageBase64 && coverMimeType && coverImageBase64.trim() !== '') {
    try {
      const coverBlob = Utilities.newBlob(
        Utilities.base64Decode(coverImageBase64),
        coverMimeType,
        'cover_' + fileName.replace(/\.[^/.]+$/, "").substring(0, 50) + '.jpg'
      );
      const coverFile = folder.createFile(coverBlob);
      coverImageUrl = makeFilePublic(coverFile.getId());
      coverImageId = coverFile.getId();
    } catch (e) {
      console.warn('Cover image upload failed:', e.message);
    }
  }

  const sheet = ensureSheetExists();
  const id = generateUniqueId();
  const date = new Date().toISOString();
  const type = fileName.toLowerCase().endsWith('.pdf') ? 'PDF' : 'DOCX';

  sheet.appendRow([
    id,
    title.substring(0, 200),
    author.substring(0, 100),
    (description || '').substring(0, 500),
    language,
    category,
    source,
    type,
    date,
    file.getId(),
    publicUrl,
    coverImageId,
    (externalLink || '').substring(0, 500)
  ]);

  sheet.autoResizeColumns(1, 13);

  return {
    success: true,
    fileId: file.getId(),
    fileUrl: publicUrl,
    fileName: file.getName(),
    coverImageUrl: coverImageUrl || null,
    coverImageId: coverImageId || null,
    message: 'File uploaded successfully with all metadata.'
  };
}

function handleGeneratePdf(token, title, author, content, description, language, category, source, externalLink) {
  if (!isValidSession(token)) {
    throw new Error('Session expired. Please login again.');
  }

  const metadata = {
    title: title,
    author: author,
    description: description,
    language: language,
    category: category,
    source: source,
    externalLink: externalLink
  };

  const validation = validateBookMetadata(metadata);
  if (!validation.isValid) {
    throw new Error(validation.errors.join(' '));
  }

  if (!content || content.trim().length < 10) {
    throw new Error('Content must be at least 10 characters.');
  }

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${escapeHtml(title)}</title>
  <style>
    @page { margin: 2cm; }
    body { 
      font-family: 'Times New Roman', serif; 
      line-height: 1.6; 
      color: #333;
    }
    .header { 
      text-align: center; 
      margin-bottom: 2cm;
      border-bottom: 2px solid #0b3d2e;
      padding-bottom: 1cm;
    }
    h1 { 
      color: #0b3d2e; 
      font-size: 24pt;
      margin-bottom: 0.5cm;
    }
    .meta { 
      color: #666; 
      font-style: italic;
      font-size: 11pt;
    }
    .content { 
      margin-top: 1cm;
      font-size: 12pt;
      text-align: justify;
    }
    .footer {
      margin-top: 2cm;
      padding-top: 0.5cm;
      border-top: 1px solid #ccc;
      font-size: 10pt;
      color: #666;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>${escapeHtml(title)}</h1>
    <div class="meta">
      Author: ${escapeHtml(author)}<br>
      Language: ${getLanguageDisplayName(language)}<br>
      Category: ${getCategoryDisplayName(category)}<br>
      Source: ${getSourceDisplayName(source)}<br>
      Generated: ${new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })}
    </div>
  </div>
  <div class="content">
    ${content.replace(/\n/g, '<br>').replace(/\r/g, '')}
  </div>
  <div class="footer">
    Generated by Intizar Digital Library | ${new Date().getFullYear()}
  </div>
</body>
</html>`;

  try {
    const htmlBlob = Utilities.newBlob(htmlContent, 'text/html', 'temp.html');
    const pdfBlob = htmlBlob.getAs('application/pdf');
    
    const folder = getOrCreateFolder();
    const safeTitle = title.replace(/[^\w\s-]/g, '').substring(0, 50);
    const fileName = `${safeTitle}_${Date.now()}.pdf`;
    const file = folder.createFile(pdfBlob).setName(fileName);
    
    const publicUrl = makeFilePublic(file.getId());

    const sheet = ensureSheetExists();
    const id = generateUniqueId();
    const date = new Date().toISOString();

    sheet.appendRow([
      id,
      title.substring(0, 200),
      author.substring(0, 100),
      (description || '').substring(0, 500),
      language,
      category,
      source,
      'Generated PDF',
      date,
      file.getId(),
      publicUrl,
      '',
      (externalLink || '').substring(0, 500)
    ]);

    sheet.autoResizeColumns(1, 13);

    return {
      success: true,
      fileId: file.getId(),
      fileUrl: publicUrl,
      fileName: file.getName(),
      message: 'PDF generated successfully with all metadata.'
    };
  } catch (e) {
    console.error('PDF generation error:', e);
    throw new Error('Failed to generate PDF: ' + e.message);
  }
}

function doGet(e) {
  const action = e.parameter.action;
  
  try {
    let result;
    switch (action) {
      case 'getDocuments':
        result = handleGetDocuments();
        break;
      case 'logout':
        const token = e.parameter.token;
        destroySession(token);
        result = { success: true, message: 'Logged out successfully.' };
        break;
      case 'health':
        result = { 
          success: true, 
          status: 'online',
          timestamp: new Date().toISOString(),
          services: {
            drive: true,
            sheets: true,
            ai: !!CONFIG.GEMINI_API_KEY,
            mahdawiyyah_focus: true
          }
        };
        break;
      case 'migrate':
        if (isValidSession(e.parameter.token)) {
          result = migrateToNewSchema();
        } else {
          result = { success: false, error: 'Unauthorized' };
        }
        break;
      default:
        result = { 
          success: false, 
          error: 'Invalid action',
          availableActions: ['getDocuments', 'logout', 'health', 'migrate']
        };
    }

    return ContentService
      .createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeaders({
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      });

  } catch (error) {
    console.error('doGet error:', error);
    return ContentService
      .createTextOutput(JSON.stringify({ 
        success: false, 
        error: error.message || 'Internal server error'
      }))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeaders({
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      });
  }
}

function doPost(e) {
  try {
    const params = e.parameter || {};
    const action = params.action;
    
    console.log('Received POST with action:', action);
    
    if (!action) {
      throw new Error('No action specified');
    }

    let result;
    switch (action) {
      case 'ai':
        const userInput = params.input || params.question || params.q || '';
        if (!userInput) throw new Error('No input provided');
        result = handleAIRequest(userInput);
        break;

      case 'login':
        const username = params.username;
        const password = params.password;
        if (!username || !password) {
          throw new Error('Username and password are required');
        }
        result = handleAdminLogin(username, password);
        break;

      case 'upload':
        if (!isValidSession(params.token)) {
          throw new Error('Unauthorized. Please login again.');
        }
        
        const description = params.description || '';
        const language = params.language || 'hausa';
        const category = params.category || 'other';
        const source = params.source || 'individual';
        const externalLink = params.externalLink || '';
        const coverImageBase64 = params.coverImage || '';
        const coverMimeType = params.coverMimeType || '';
        
        const blob = Utilities.newBlob(
          Utilities.base64Decode(params.fileBase64 || ''),
          params.mimeType || 'application/pdf',
          params.fileName || 'document.pdf'
        );
        
        result = handleFileUpload(
          params.token,
          blob,
          params.fileName || 'document.pdf',
          params.title || 'Untitled',
          params.author || 'Unknown',
          description,
          language,
          category,
          source,
          externalLink,
          coverImageBase64,
          coverMimeType
        );
        break;

      case 'generatePdf':
        if (!isValidSession(params.token)) {
          throw new Error('Unauthorized. Please login again.');
        }
        
        const pdfDescription = params.description || '';
        const pdfLanguage = params.language || 'hausa';
        const pdfCategory = params.category || 'articles';
        const pdfSource = params.source || 'individual';
        const pdfExternalLink = params.externalLink || '';
        
        result = handleGeneratePdf(
          params.token,
          params.title || 'Untitled Document',
          params.author || 'Unknown Author',
          params.content || '',
          pdfDescription,
          pdfLanguage,
          pdfCategory,
          pdfSource,
          pdfExternalLink
        );
        break;

      default:
        throw new Error(`Unknown action: ${action}`);
    }

    return ContentService
      .createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeaders({
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      });

  } catch (error) {
    console.error('doPost error:', error);
    return ContentService
      .createTextOutput(JSON.stringify({ 
        success: false, 
        error: error.message || 'Internal server error'
      }))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeaders({
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      });
  }
}

function setup() {
  console.log('Starting Intizar Digital Library setup...');
  
  try {
    const folder = getOrCreateFolder();
    console.log('Drive Folder created/accessed:', folder.getUrl());

    let spreadsheet;
    if (!CONFIG.SPREADSHEET_ID) {
      spreadsheet = SpreadsheetApp.create('Intizar Library Metadata');
      const id = spreadsheet.getId();
      PropertiesService.getScriptProperties().setProperty('SPREADSHEET_ID', id);
      console.log('New Spreadsheet created:', id);
    } else {
      spreadsheet = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
      console.log('Using existing spreadsheet:', CONFIG.SPREADSHEET_ID);
    }

    let sheet = spreadsheet.getSheetByName(CONFIG.SHEET_NAME);
    if (!sheet) {
      sheet = spreadsheet.insertSheet(CONFIG.SHEET_NAME);
      console.log('Created new sheet:', CONFIG.SHEET_NAME);
    }

    const headers = ['ID', 'Title', 'Author', 'Description', 'Language', 'Category', 
                    'Source', 'Type', 'DateAdded', 'DriveFileId', 'DriveUrl', 
                    'CoverImageId', 'ExternalLink'];
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
    sheet.setFrozenRows(1);
    sheet.autoResizeColumns(1, headers.length);

    const scriptProps = PropertiesService.getScriptProperties();
    if (!scriptProps.getProperty('DEFAULT_LANGUAGE')) {
      scriptProps.setProperty('DEFAULT_LANGUAGE', 'hausa');
    }
    if (!scriptProps.getProperty('DEFAULT_CATEGORY')) {
      scriptProps.setProperty('DEFAULT_CATEGORY', 'ideology');
    }
    if (!scriptProps.getProperty('DEFAULT_SOURCE')) {
      scriptProps.setProperty('DEFAULT_SOURCE', 'intizar');
    }

    console.log('Setup completed successfully!');
    
    return {
      success: true,
      folderId: folder.getId(),
      spreadsheetId: spreadsheet.getId(),
      message: 'Setup completed successfully!',
      defaultLanguage: 'hausa',
      mahdawiyyahFocus: true,
      keywordsCount: MAHDAWIYYAH_KEYWORDS.length
    };

  } catch (error) {
    console.error('Setup failed:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

function migrateToNewSchema() {
  console.log('Starting migration to new schema...');
  
  try {
    const sheet = ensureSheetExists();
    const data = sheet.getDataRange().getValues();
    
    if (data.length < 2) {
      console.log('No data to migrate.');
      return { success: true, message: 'No data to migrate.' };
    }
    
    const headers = data[0];
    const oldRowCount = data.length - 1;
    
    if (headers.length >= 13) {
      console.log('Schema already up-to-date.');
      return { success: true, message: 'Schema already up-to-date.' };
    }
    
    console.log(`Migrating ${oldRowCount} rows...`);
    
    const newHeaders = ['ID', 'Title', 'Author', 'Description', 'Language', 'Category', 
                       'Source', 'Type', 'DateAdded', 'DriveFileId', 'DriveUrl', 
                       'CoverImageId', 'ExternalLink'];
    
    const oldRows = data.slice(1);
    const newRows = oldRows.map(oldRow => {
      const newRow = new Array(13).fill('');
      
      const idIndex = headers.indexOf('ID');
      const titleIndex = headers.indexOf('Title');
      const authorIndex = headers.indexOf('Author');
      const typeIndex = headers.indexOf('Type');
      const dateIndex = headers.indexOf('DateAdded');
      const fileIdIndex = headers.indexOf('DriveFileId');
      const urlIndex = headers.indexOf('DriveUrl');
      
      if (idIndex >= 0) newRow[0] = oldRow[idIndex];
      if (titleIndex >= 0) newRow[1] = oldRow[titleIndex];
      if (authorIndex >= 0) newRow[2] = oldRow[authorIndex];
      if (typeIndex >= 0) newRow[7] = oldRow[typeIndex];
      if (dateIndex >= 0) newRow[8] = oldRow[dateIndex];
      if (fileIdIndex >= 0) newRow[9] = oldRow[fileIdIndex];
      if (urlIndex >= 0) newRow[10] = oldRow[urlIndex];
      
      newRow[3] = '';
      newRow[4] = 'hausa';
      newRow[5] = 'other';
      newRow[6] = 'intizar';
      newRow[11] = '';
      newRow[12] = '';
      
      return newRow;
    });
    
    sheet.clear();
    sheet.getRange(1, 1, 1, newHeaders.length).setValues([newHeaders]);
    sheet.getRange(2, 1, newRows.length, newHeaders.length).setValues(newRows);
    
    sheet.getRange(1, 1, 1, newHeaders.length).setFontWeight('bold');
    sheet.setFrozenRows(1);
    sheet.autoResizeColumns(1, newHeaders.length);
    
    console.log(`Successfully migrated ${oldRowCount} rows to new schema.`);
    
    return {
      success: true,
      migratedRows: oldRowCount,
      message: `Migrated ${oldRowCount} documents to new schema.`
    };
    
  } catch (error) {
    console.error('Migration failed:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

function testEndpoints() {
  console.log('Testing endpoints...');
  
  const tests = [
    { name: 'Health Check', url: `${ScriptApp.getService().getUrl()}?action=health` },
    { name: 'Get Documents', url: `${ScriptApp.getService().getUrl()}?action=getDocuments` }
  ];
  
  tests.forEach(test => {
    console.log(`\nTesting: ${test.name}`);
    try {
      const response = UrlFetchApp.fetch(test.url, { muteHttpExceptions: true });
      console.log('Status:', response.getResponseCode());
      console.log('Response:', response.getContentText().substring(0, 200));
    } catch (error) {
      console.error('Error:', error.message);
    }
  });
}

function testSchema() {
  const sheet = ensureSheetExists();
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  console.log('Headers:', headers);
  console.log('Header count:', headers.length);
}

function testValidation() {
  const testData = {
    title: 'Test Book',
    author: 'Test Author',
    description: 'Test description',
    language: 'hausa',
    category: 'ideology',
    source: 'intizar',
    externalLink: 'https://example.com'
  };
  
  const result = validateBookMetadata(testData);
  console.log('Validation result:', result);
}

function testGetDocs() {
  const result = handleGetDocuments();
  if (result.success && result.documents.length > 0) {
    const doc = result.documents[0];
    console.log('First doc has language:', doc.Language);
    console.log('First doc has category:', doc.Category);
    console.log('First doc has source:', doc.Source);
    console.log('First doc has cover image:', doc.CoverImageUrl);
  }
}

function testLanguageDetection() {
  const tests = [
    { text: 'Me yasa Imam Mahdi yake cikin ghaibah?', expected: 'ha' },
    { text: 'ما هي علامات ظهور الإمام المهدي؟', expected: 'ar' },
    { text: 'What are the signs of Imam Mahdi\'s reappearance?', expected: 'en' },
    { text: 'Who is Allamah Bahajatiy?', expected: 'en' },
    { text: 'Me game da Sheikh Zakzaky?', expected: 'ha' },
  ];
  
  tests.forEach(test => {
    const result = detectLanguage(test.text);
    console.log(`Text: "${test.text.substring(0, 30)}..."`);
    console.log(`Expected: ${test.expected}, Got: ${result}, Match: ${result === test.expected ? '✓' : '✗'}`);
  });
}

function testMahdawiyyahDetection() {
  const tests = [
    { text: 'What is Islam?', expected: true },
    { text: 'Who is Imam Mahdi?', expected: true },
    { text: 'Tell me about Sheikh Zakzaky', expected: true },
    { text: 'What did Allamah Bahajatiy say?', expected: true },
    { text: 'Explain Ghaybah', expected: true },
    { text: 'What is the weather today?', expected: false },
    { text: 'Me game da Intizara?', expected: true },
    { text: 'ما هي المهدوية؟', expected: true },
  ];
  
  tests.forEach(test => {
    const result = isMahdawiyyahRelated(test.text);
    console.log(`Text: "${test.text.substring(0, 30)}..."`);
    console.log(`Expected: ${test.expected}, Got: ${result}, Match: ${result === test.expected ? '✓' : '✗'}`);
  });
}

function initialize() {
  console.log('Initializing Intizar Digital Library with enhanced Mahdawiyyah focus...');
  
  const setupResult = setup();
  console.log('Setup result:', setupResult);
  
  console.log('\nTesting language detection:');
  testLanguageDetection();
  
  console.log('\nTesting Mahdawiyyah detection:');
  testMahdawiyyahDetection();
  
  console.log('\nTesting schema:');
  testSchema();
  
  return {
    success: true,
    message: 'Initialization complete with enhanced Mahdawiyyah focus',
    setup: setupResult,
    defaultLanguage: 'hausa',
    mahdawiyyahKeywordsCount: MAHDAWIYYAH_KEYWORDS.length,
    enhancedPrompt: 'Meta validation removed as requested'
  };
}

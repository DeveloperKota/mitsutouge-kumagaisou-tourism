/**
 * Language Switcher for Mitsutouge Tourism Website
 * Supports Japanese, English, Chinese, Korean, French, and Spanish
 */

class LanguageSwitcher {
  constructor() {
    this.currentLang = localStorage.getItem('selectedLanguage') || 'ja';
    this.supportedLanguages = {
      ja: { flag: '🇯🇵', name: '日本語' },
      en: { flag: '🇺🇸', name: 'English' }
    };
    this.mapUrls = {
      ja: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3246.9483617271617!2d138.839799176787!3d35.53027373824988!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x60195df877592bcd%3A0xc3627466034bebe8!2z5LiJ44OE5bOg44Gu5a6_!5e0!3m2!1sja!2sjp!4v1757050131177!5m2!1sja!2sjp',
      en: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3246.9483617271617!2d138.839799176787!3d35.53027373824988!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x60195df877592bcd%3A0xc3627466034bebe8!2sMitsutouge%20Station!5e0!3m2!1sen!2sjp!4v1757050131177!5m2!1sen!2sjp'
    };
    this.init();
  }

  init() {
    this.createLanguageSwitcher();
    this.bindEvents();
    this.switchLanguage(this.currentLang);
  }

  createLanguageSwitcher() {
    // Create language switcher HTML using the specified design
    const switcherHTML = `
      <!-- Language Switcher - Fixed Bottom Left -->
      <div class="fixed bottom-4 left-4 z-50">
        <div class="flex space-x-2 bg-white rounded-lg shadow-lg p-2 border border-gray-200">
          <button id="lang-ja" class="px-3 py-1 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors">日本語</button>
          <button id="lang-en" class="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors">English</button>
        </div>
      </div>
    `;

    // Insert before closing body tag
    document.body.insertAdjacentHTML('beforeend', switcherHTML);
  }

  bindEvents() {
    const jaBtn = document.getElementById('lang-ja');
    const enBtn = document.getElementById('lang-en');

    // Japanese button
    jaBtn.addEventListener('click', (e) => {
      e.preventDefault();
      this.switchLanguage('ja');
    });

    // English button
    enBtn.addEventListener('click', (e) => {
      e.preventDefault();
      this.switchLanguage('en');
    });

    // Keyboard navigation
    jaBtn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.switchLanguage('ja');
      }
    });

    enBtn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.switchLanguage('en');
      }
    });
  }

  switchLanguage(lang) {
    this.currentLang = lang;
    localStorage.setItem('selectedLanguage', lang);

    // Update all elements with data attributes
    document.querySelectorAll('[data-ja]').forEach(element => {
      const content = element.getAttribute(`data-${lang}`) || element.getAttribute('data-ja');
      if (content) {
        // HTMLエンティティをデコード
        element.innerHTML = this.decodeHtmlEntities(content);

        // alt属性も更新
        if (element.tagName === 'IMG') {
          element.alt = content;
        }
      }
    });

    // Update language switcher UI
    this.updateLanguageUI(lang);

    // Update meta tags
    this.updateMetaTags(lang);

    // Switch map
    this.switchMap(lang);

    // Update HTML lang attribute
    document.documentElement.lang = lang;
  }

  updateLanguageUI(lang) {
    const jaBtn = document.getElementById('lang-ja');
    const enBtn = document.getElementById('lang-en');
    
    if (jaBtn && enBtn) {
      // Reset all buttons to inactive state
      jaBtn.className = 'px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors';
      enBtn.className = 'px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors';
      
      // Set active button
      if (lang === 'ja') {
        jaBtn.className = 'px-3 py-1 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors';
      } else if (lang === 'en') {
        enBtn.className = 'px-3 py-1 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors';
      }
    }
  }

  decodeHtmlEntities(text) {
    const textarea = document.createElement('textarea');
    textarea.innerHTML = text;
    return textarea.value;
  }

  updateMetaTags(lang) {
    // Update title tag
    const titleElement = document.querySelector('title');
    if (titleElement) {
      const titleContent = titleElement.getAttribute(`data-${lang}`) || titleElement.getAttribute('data-ja');
      if (titleContent) {
        titleElement.textContent = titleContent;
      }
    }

    // Update description meta tag
    const descElement = document.querySelector('meta[name="description"]');
    if (descElement) {
      const descContent = descElement.getAttribute(`data-${lang}`) || descElement.getAttribute('data-ja');
      if (descContent) {
        descElement.setAttribute('content', descContent);
      }
    }

    // Update Open Graph tags
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      const ogTitleContent = ogTitle.getAttribute(`data-${lang}`) || ogTitle.getAttribute('data-ja');
      if (ogTitleContent) {
        ogTitle.setAttribute('content', ogTitleContent);
      }
    }

    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) {
      const ogDescContent = ogDesc.getAttribute(`data-${lang}`) || ogDesc.getAttribute('data-ja');
      if (ogDescContent) {
        ogDesc.setAttribute('content', ogDescContent);
      }
    }

    // Update Twitter tags
    const twitterTitle = document.querySelector('meta[name="twitter:title"]');
    if (twitterTitle) {
      const twitterTitleContent = twitterTitle.getAttribute(`data-${lang}`) || twitterTitle.getAttribute('data-ja');
      if (twitterTitleContent) {
        twitterTitle.setAttribute('content', twitterTitleContent);
      }
    }

    const twitterDesc = document.querySelector('meta[name="twitter:description"]');
    if (twitterDesc) {
      const twitterDescContent = twitterDesc.getAttribute(`data-${lang}`) || twitterDesc.getAttribute('data-ja');
      if (twitterDescContent) {
        twitterDesc.setAttribute('content', twitterDescContent);
      }
    }
  }

  switchMap(lang) {
    const mapIframe = document.querySelector('iframe[src*="google.com/maps"]');
    if (mapIframe && this.mapUrls[lang]) {
      mapIframe.src = this.mapUrls[lang];
    }
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  window.languageSwitcher = new LanguageSwitcher();
});

// Make available globally
window.LanguageSwitcher = LanguageSwitcher;

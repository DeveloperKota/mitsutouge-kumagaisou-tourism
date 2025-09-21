// 多言語対応機能
class LanguageSwitcher {
  constructor() {
    this.currentLang = 'ja';
    this.mapUrls = {
      ja: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3248.0079463369693!2d138.68201417678625!3d35.50408173968341!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x601be1a43bbe22df%3A0x460695618fa8dd0b!2z44Ki44Of44Ol44O844K644O044Kj44Os44OD44K4!5e0!3m2!1sja!2sjp!4v1756825424988!5m2!1sja!2sjp',
      en: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3248.0079463369693!2d138.68201417678625!3d35.50408173968341!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x601be1a43bbe22df%3A0x460695618fa8dd0b!2sSaiko%20Area%2C%20Fujikawaguchiko!5e0!3m2!1sen!2sjp!4v1756825424988!5m2!1sen!2sjp'
    };
    this.init();
  }

  init() {
    this.detectLanguageFromUrl();
    this.bindEvents();
    this.switchLanguage(this.currentLang);
  }

  detectLanguageFromUrl() {
    const currentUrl = window.location.href;
    const url = new URL(currentUrl);
    const pathname = url.pathname;
    
    console.log('Current pathname:', pathname);
    
    if (pathname.endsWith('/ja')) {
      this.currentLang = 'ja';
    } else if (pathname.endsWith('/en')) {
      this.currentLang = 'en';
    } else {
      // デフォルトは日本語
      this.currentLang = 'ja';
    }
    
    console.log(`Detected language from URL: ${this.currentLang}`);
  }

  bindEvents() {
    const jaButton = document.getElementById('lang-ja');
    const enButton = document.getElementById('lang-en');
    
    console.log('Binding events...');
    console.log('JA Button found:', jaButton);
    console.log('EN Button found:', enButton);
    
    if (jaButton) {
      jaButton.addEventListener('click', () => {
        console.log('JA button clicked');
        this.switchLanguage('ja');
      });
    }
    
    if (enButton) {
      enButton.addEventListener('click', () => {
        console.log('EN button clicked');
        this.switchLanguage('en');
      });
    }
  }

  switchLanguage(lang) {
    try {
      console.log(`Switching language to: ${lang}`);
      this.currentLang = lang;
      
      // URLパスの切り替え
      try {
        this.updateUrlPath(lang);
      } catch (error) {
        console.error('Error updating URL path:', error);
      }
      
      // すべてのdata-jaとdata-en属性を持つ要素を更新
      document.querySelectorAll('[data-ja][data-en]').forEach(element => {
        if (lang === 'ja') {
          const content = element.getAttribute('data-ja');
          if (content) {
            // HTMLエンティティをデコード
            element.innerHTML = this.decodeHtmlEntities(content);
          }
        } else {
          const content = element.getAttribute('data-en');
          if (content) {
            // HTMLエンティティをデコード
            element.innerHTML = this.decodeHtmlEntities(content);
          }
        }
      });
      
      // メタタグの更新
      this.updateMetaTags(lang);
      
      // マップの切り替え
      this.switchMap(lang);
      
      // リンクの切り替え
      this.switchLinks(lang);
      
      // HTMLのlang属性を更新
      document.documentElement.lang = lang;
      
      // ボタンのスタイルを更新
      this.updateButtonStyles(lang);
      
      console.log(`Language switched successfully to: ${lang}`);
    } catch (error) {
      console.error('Error in switchLanguage:', error);
    }
  }

  decodeHtmlEntities(text) {
    const textarea = document.createElement('textarea');
    textarea.innerHTML = text;
    return textarea.value;
  }

  updateUrlPath(lang) {
    try {
      const currentUrl = window.location.href;
      console.log('Current URL:', currentUrl);
      
      const url = new URL(currentUrl);
      console.log('URL object:', url);
      
      // パスベースの言語切り替え
      let pathname = url.pathname;
      console.log('Original pathname:', pathname);
      
      // 既存の言語パスを削除
      pathname = pathname.replace(/\/ja$/, '').replace(/\/en$/, '');
      console.log('Pathname after removing language codes:', pathname);
      
      // 新しい言語パスを追加
      if (lang === 'ja') {
        pathname += '/ja';
      } else if (lang === 'en') {
        pathname += '/en';
      }
      
      console.log('New pathname:', pathname);
      
      // URLを更新
      const newUrl = url.origin + pathname + url.search + url.hash;
      console.log('New URL:', newUrl);
      
      // ブラウザの履歴を更新（ページをリロードしない）
      try {
        window.history.pushState({ lang: lang }, '', newUrl);
        console.log('URL successfully updated to:', newUrl);
        console.log('Current URL after update:', window.location.href);
      } catch (historyError) {
        console.error('Error updating history:', historyError);
        // 直接locationを変更（ページがリロードされる）
        window.location.href = newUrl;
        console.log('Redirected to:', newUrl);
      }
    } catch (error) {
      console.error('Error in updateUrlPath:', error);
    }
  }

  updateMetaTags(lang) {
    // titleタグの更新
    const titleElement = document.querySelector('title');
    if (titleElement) {
      const titleJa = titleElement.getAttribute('data-ja');
      const titleEn = titleElement.getAttribute('data-en');
      if (lang === 'ja' && titleJa) {
        titleElement.textContent = titleJa;
      } else if (lang === 'en' && titleEn) {
        titleElement.textContent = titleEn;
      }
    }

    // descriptionメタタグの更新
    const descElement = document.querySelector('meta[name="description"]');
    if (descElement) {
      const descJa = descElement.getAttribute('data-ja');
      const descEn = descElement.getAttribute('data-en');
      if (lang === 'ja' && descJa) {
        descElement.setAttribute('content', descJa);
      } else if (lang === 'en' && descEn) {
        descElement.setAttribute('content', descEn);
      }
    }

    // Open Graphタグの更新
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      const ogTitleJa = ogTitle.getAttribute('data-ja');
      const ogTitleEn = ogTitle.getAttribute('data-en');
      if (lang === 'ja' && ogTitleJa) {
        ogTitle.setAttribute('content', ogTitleJa);
      } else if (lang === 'en' && ogTitleEn) {
        ogTitle.setAttribute('content', ogTitleEn);
      }
    }

    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) {
      const ogDescJa = ogDesc.getAttribute('data-ja');
      const ogDescEn = ogDesc.getAttribute('data-en');
      if (lang === 'ja' && ogDescJa) {
        ogDesc.setAttribute('content', ogDescJa);
      } else if (lang === 'en' && ogDescEn) {
        ogDesc.setAttribute('content', ogDescEn);
      }
    }

    // Twitterタグの更新
    const twitterTitle = document.querySelector('meta[name="twitter:title"]');
    if (twitterTitle) {
      const twitterTitleJa = twitterTitle.getAttribute('data-ja');
      const twitterTitleEn = twitterTitle.getAttribute('data-en');
      if (lang === 'ja' && twitterTitleJa) {
        twitterTitle.setAttribute('content', twitterTitleJa);
      } else if (lang === 'en' && twitterTitleEn) {
        twitterTitle.setAttribute('content', twitterTitleEn);
      }
    }

    const twitterDesc = document.querySelector('meta[name="twitter:description"]');
    if (twitterDesc) {
      const twitterDescJa = twitterDesc.getAttribute('data-ja');
      const twitterDescEn = twitterDesc.getAttribute('data-en');
      if (lang === 'ja' && twitterDescJa) {
        twitterDesc.setAttribute('content', twitterDescJa);
      } else if (lang === 'en' && twitterDescEn) {
        twitterDesc.setAttribute('content', twitterDescEn);
      }
    }
  }

  switchMap(lang) {
    const mapIframe = document.querySelector('iframe[src*="google.com/maps"]');
    if (mapIframe && this.mapUrls[lang]) {
      mapIframe.src = this.mapUrls[lang];
    }
  }

  switchLinks(lang) {
    // data-href-jaとdata-href-en属性を持つリンクを切り替え
    document.querySelectorAll('a[data-href-ja][data-href-en]').forEach(link => {
      const hrefJa = link.getAttribute('data-href-ja');
      const hrefEn = link.getAttribute('data-href-en');
      
      if (lang === 'ja' && hrefJa) {
        link.href = hrefJa;
        console.log(`Link switched to Japanese: ${hrefJa}`);
      } else if (lang === 'en' && hrefEn) {
        link.href = hrefEn;
        console.log(`Link switched to English: ${hrefEn}`);
      }
    });

    // リンクテキストも多言語対応（data-jaとdata-en属性を持つリンク）
    document.querySelectorAll('a[data-ja][data-en]').forEach(link => {
      const textJa = link.getAttribute('data-ja');
      const textEn = link.getAttribute('data-en');
      
      if (lang === 'ja' && textJa) {
        link.textContent = textJa;
      } else if (lang === 'en' && textEn) {
        link.textContent = textEn;
      }
    });
  }

  updateButtonStyles(lang) {
    const jaButton = document.getElementById('lang-ja');
    const enButton = document.getElementById('lang-en');
    
    const activeClass = 'px-3 py-1 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors';
    const inactiveClass = 'px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors';
    
    if (jaButton) {
      jaButton.className = lang === 'ja' ? activeClass : inactiveClass;
    }
    
    if (enButton) {
      enButton.className = lang === 'en' ? activeClass : inactiveClass;
    }
  }
}

// DOMContentLoadedイベントで初期化
document.addEventListener('DOMContentLoaded', function() {
  window.languageSwitcher = new LanguageSwitcher();
});

// グローバルに公開
window.LanguageSwitcher = LanguageSwitcher;

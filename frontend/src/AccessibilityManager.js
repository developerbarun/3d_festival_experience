export class AccessibilityManager {
  constructor() {
    this.isEnabled = true;
    this.features = {
      screenReader: false,
      highContrast: false,
      largeText: false,
      reducedMotion: false,
      keyboardNavigation: true,
      audioDescriptions: false,
      colorBlindSupport: false
    };
    
    this.keyboardNavigation = {
      currentFocus: null,
      focusableElements: [],
      tabIndex: 0
    };
    
    this.audioDescriptions = {
      enabled: false,
      currentDescription: null,
      queue: []
    };
    
    this.init();
  }

  init() {
    this.detectAccessibilityNeeds();
    this.setupKeyboardNavigation();
    this.setupScreenReaderSupport();
    this.setupHighContrastMode();
    this.setupReducedMotion();
    this.setupAudioDescriptions();
    this.setupColorBlindSupport();
    this.createAccessibilityUI();
  }

  detectAccessibilityNeeds() {
    // Detect if user prefers reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      this.features.reducedMotion = true;
      this.enableReducedMotion();
    }

    // Detect if user prefers high contrast
    if (window.matchMedia('(prefers-contrast: high)').matches) {
      this.features.highContrast = true;
      this.enableHighContrast();
    }

    // Detect if screen reader is likely being used
    if (navigator.userAgent.includes('NVDA') || 
        navigator.userAgent.includes('JAWS') || 
        navigator.userAgent.includes('VoiceOver')) {
      this.features.screenReader = true;
      this.enableScreenReaderSupport();
    }

    console.log('Accessibility needs detected:', this.features);
  }

  setupKeyboardNavigation() {
    // Make all interactive elements keyboard accessible
    this.updateFocusableElements();
    
    document.addEventListener('keydown', (e) => {
      this.handleKeyboardNavigation(e);
    });

    // Update focusable elements when DOM changes
    const observer = new MutationObserver(() => {
      this.updateFocusableElements();
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  updateFocusableElements() {
    const selectors = [
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      'a[href]',
      '[tabindex]:not([tabindex="-1"])',
      '.festival-card',
      '.nav-btn',
      '.control-btn'
    ];
    
    this.keyboardNavigation.focusableElements = Array.from(
      document.querySelectorAll(selectors.join(', '))
    ).filter(el => {
      return el.offsetParent !== null && // Element is visible
             !el.hasAttribute('aria-hidden') &&
             window.getComputedStyle(el).visibility !== 'hidden';
    });
    
    // Add ARIA attributes if missing
    this.keyboardNavigation.focusableElements.forEach((element, index) => {
      if (!element.hasAttribute('tabindex')) {
        element.setAttribute('tabindex', '0');
      }
      
      if (!element.hasAttribute('aria-label') && !element.hasAttribute('aria-labelledby')) {
        this.addAriaLabel(element);
      }
    });
  }

  addAriaLabel(element) {
    // Add appropriate ARIA labels based on element type and context
    if (element.classList.contains('festival-card')) {
      const festival = element.dataset.festival;
      const festivalNames = {
        'diwali': 'Explore Diwali Festival of Lights',
        'holi': 'Explore Holi Festival of Colors',
        'navratri': 'Explore Navratri Nine Nights of Dance',
        'ganesh': 'Explore Ganesh Chaturthi',
        'dussehra': 'Explore Dussehra Victory of Good',
        'kumbh': 'Explore Kumbh Mela Sacred Gathering'
      };
      element.setAttribute('aria-label', festivalNames[festival] || 'Explore Festival');
    } else if (element.classList.contains('nav-btn')) {
      const title = element.getAttribute('title');
      if (title) {
        element.setAttribute('aria-label', title);
      }
    } else if (element.tagName === 'BUTTON') {
      const text = element.textContent.trim();
      if (text) {
        element.setAttribute('aria-label', text);
      }
    }
  }

  handleKeyboardNavigation(e) {
    if (!this.features.keyboardNavigation) return;
    
    switch (e.key) {
      case 'Tab':
        this.handleTabNavigation(e);
        break;
      case 'Enter':
      case ' ':
        this.handleActivation(e);
        break;
      case 'Escape':
        this.handleEscape(e);
        break;
      case 'ArrowUp':
      case 'ArrowDown':
      case 'ArrowLeft':
      case 'ArrowRight':
        this.handleArrowNavigation(e);
        break;
    }
  }

  handleTabNavigation(e) {
    const focusableElements = this.keyboardNavigation.focusableElements;
    const currentIndex = focusableElements.indexOf(document.activeElement);
    
    let nextIndex;
    if (e.shiftKey) {
      nextIndex = currentIndex <= 0 ? focusableElements.length - 1 : currentIndex - 1;
    } else {
      nextIndex = currentIndex >= focusableElements.length - 1 ? 0 : currentIndex + 1;
    }
    
    if (focusableElements[nextIndex]) {
      e.preventDefault();
      focusableElements[nextIndex].focus();
      this.announceElement(focusableElements[nextIndex]);
    }
  }

  handleActivation(e) {
    const activeElement = document.activeElement;
    
    if (activeElement.tagName === 'BUTTON' || 
        activeElement.classList.contains('festival-card') ||
        activeElement.classList.contains('nav-btn')) {
      e.preventDefault();
      activeElement.click();
    }
  }

  handleEscape(e) {
    // Close any open dialogs or return to main menu
    if (window.app && window.app.uiManager) {
      if (window.app.uiManager.currentScreen === 'experience') {
        document.getElementById('menu-btn').click();
      }
    }
  }

  handleArrowNavigation(e) {
    // Handle arrow key navigation for grid layouts
    const activeElement = document.activeElement;
    
    if (activeElement.classList.contains('festival-card')) {
      e.preventDefault();
      this.navigateGrid(e.key, '.festival-card');
    } else if (activeElement.classList.contains('quick-festival')) {
      e.preventDefault();
      this.navigateGrid(e.key, '.quick-festival');
    }
  }

  navigateGrid(direction, selector) {
    const elements = Array.from(document.querySelectorAll(selector));
    const currentIndex = elements.indexOf(document.activeElement);
    
    let nextIndex = currentIndex;
    
    switch (direction) {
      case 'ArrowUp':
        nextIndex = Math.max(0, currentIndex - 3); // Assuming 3 columns
        break;
      case 'ArrowDown':
        nextIndex = Math.min(elements.length - 1, currentIndex + 3);
        break;
      case 'ArrowLeft':
        nextIndex = Math.max(0, currentIndex - 1);
        break;
      case 'ArrowRight':
        nextIndex = Math.min(elements.length - 1, currentIndex + 1);
        break;
    }
    
    if (elements[nextIndex]) {
      elements[nextIndex].focus();
      this.announceElement(elements[nextIndex]);
    }
  }

  setupScreenReaderSupport() {
    // Add ARIA live regions for dynamic content
    this.createLiveRegions();
    
    // Add semantic structure
    this.addSemanticStructure();
    
    // Add skip links
    this.addSkipLinks();
  }

  createLiveRegions() {
    const liveRegion = document.createElement('div');
    liveRegion.id = 'aria-live-region';
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.style.cssText = `
      position: absolute;
      left: -10000px;
      width: 1px;
      height: 1px;
      overflow: hidden;
    `;
    
    document.body.appendChild(liveRegion);
    
    const assertiveRegion = document.createElement('div');
    assertiveRegion.id = 'aria-assertive-region';
    assertiveRegion.setAttribute('aria-live', 'assertive');
    assertiveRegion.setAttribute('aria-atomic', 'true');
    assertiveRegion.style.cssText = liveRegion.style.cssText;
    
    document.body.appendChild(assertiveRegion);
  }

  addSemanticStructure() {
    // Add proper heading hierarchy
    const mainTitle = document.querySelector('.welcome-title');
    if (mainTitle && !mainTitle.tagName.startsWith('H')) {
      mainTitle.setAttribute('role', 'heading');
      mainTitle.setAttribute('aria-level', '1');
    }
    
    // Add landmarks
    const main = document.getElementById('app');
    if (main) {
      main.setAttribute('role', 'main');
    }
    
    // Add navigation roles
    const nav = document.querySelector('.floating-nav');
    if (nav) {
      nav.setAttribute('role', 'navigation');
      nav.setAttribute('aria-label', 'Main navigation');
    }
  }

  addSkipLinks() {
    const skipLinks = document.createElement('div');
    skipLinks.id = 'skip-links';
    skipLinks.innerHTML = `
      <a href="#main-content" class="skip-link">Skip to main content</a>
      <a href="#festival-menu" class="skip-link">Skip to festival selection</a>
      <a href="#ai-guide-container" class="skip-link">Skip to cultural guide</a>
    `;
    
    document.body.insertBefore(skipLinks, document.body.firstChild);
  }

  setupHighContrastMode() {
    this.highContrastStyles = document.createElement('style');
    this.highContrastStyles.id = 'high-contrast-styles';
    this.highContrastStyles.textContent = `
      .high-contrast {
        filter: contrast(150%) brightness(120%);
      }
      
      .high-contrast .festival-card {
        border: 3px solid #ffffff !important;
        background: #000000 !important;
        color: #ffffff !important;
      }
      
      .high-contrast button {
        background: #ffffff !important;
        color: #000000 !important;
        border: 2px solid #ffffff !important;
      }
      
      .high-contrast .nav-btn {
        background: #000000 !important;
        color: #ffffff !important;
        border: 2px solid #ffffff !important;
      }
    `;
    
    document.head.appendChild(this.highContrastStyles);
  }

  setupReducedMotion() {
    this.reducedMotionStyles = document.createElement('style');
    this.reducedMotionStyles.id = 'reduced-motion-styles';
    this.reducedMotionStyles.textContent = `
      .reduced-motion * {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
        scroll-behavior: auto !important;
      }
      
      .reduced-motion .loading-spinner {
        animation: none !important;
      }
      
      .reduced-motion .particle-system {
        display: none !important;
      }
    `;
    
    document.head.appendChild(this.reducedMotionStyles);
  }

  setupAudioDescriptions() {
    this.audioDescriptions.synth = window.speechSynthesis;
    
    if (this.audioDescriptions.synth) {
      // Get available voices
      this.audioDescriptions.voices = this.audioDescriptions.synth.getVoices();
      
      // Update voices when they load
      this.audioDescriptions.synth.addEventListener('voiceschanged', () => {
        this.audioDescriptions.voices = this.audioDescriptions.synth.getVoices();
      });
    }
  }

  setupColorBlindSupport() {
    this.colorBlindFilters = {
      protanopia: 'url(#protanopia-filter)',
      deuteranopia: 'url(#deuteranopia-filter)',
      tritanopia: 'url(#tritanopia-filter)'
    };
    
    this.createColorBlindFilters();
  }

  createColorBlindFilters() {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.style.cssText = 'position: absolute; width: 0; height: 0;';
    
    svg.innerHTML = `
      <defs>
        <filter id="protanopia-filter">
          <feColorMatrix values="0.567,0.433,0,0,0 0.558,0.442,0,0,0 0,0.242,0.758,0,0 0,0,0,1,0"/>
        </filter>
        <filter id="deuteranopia-filter">
          <feColorMatrix values="0.625,0.375,0,0,0 0.7,0.3,0,0,0 0,0.3,0.7,0,0 0,0,0,1,0"/>
        </filter>
        <filter id="tritanopia-filter">
          <feColorMatrix values="0.95,0.05,0,0,0 0,0.433,0.567,0,0 0,0.475,0.525,0,0 0,0,0,1,0"/>
        </filter>
      </defs>
    `;
    
    document.body.appendChild(svg);
  }

  createAccessibilityUI() {
    const accessibilityPanel = document.createElement('div');
    accessibilityPanel.id = 'accessibility-panel';
    accessibilityPanel.innerHTML = `
      <button class="accessibility-toggle" id="accessibility-toggle" aria-label="Open accessibility options">
        ♿
      </button>
      <div class="accessibility-menu" id="accessibility-menu" style="display: none;">
        <h3>Accessibility Options</h3>
        <div class="accessibility-options">
          <label>
            <input type="checkbox" id="high-contrast-toggle"> High Contrast Mode
          </label>
          <label>
            <input type="checkbox" id="large-text-toggle"> Large Text
          </label>
          <label>
            <input type="checkbox" id="reduced-motion-toggle"> Reduce Motion
          </label>
          <label>
            <input type="checkbox" id="audio-descriptions-toggle"> Audio Descriptions
          </label>
          <label>
            <input type="checkbox" id="keyboard-navigation-toggle" checked> Keyboard Navigation
          </label>
          <div class="color-blind-options">
            <label>Color Blind Support:</label>
            <select id="color-blind-filter">
              <option value="none">None</option>
              <option value="protanopia">Protanopia</option>
              <option value="deuteranopia">Deuteranopia</option>
              <option value="tritanopia">Tritanopia</option>
            </select>
          </div>
        </div>
      </div>
    `;
    
    // Add styles
    const styles = document.createElement('style');
    styles.textContent = `
      #accessibility-panel {
        position: fixed;
        top: 20px;
        left: 20px;
        z-index: 10001;
      }
      
      .accessibility-toggle {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: #4CAF50;
        color: white;
        border: none;
        font-size: 20px;
        cursor: pointer;
        box-shadow: 0 4px 8px rgba(0,0,0,0.3);
      }
      
      .accessibility-menu {
        position: absolute;
        top: 60px;
        left: 0;
        background: white;
        border: 1px solid #ccc;
        border-radius: 8px;
        padding: 16px;
        min-width: 250px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        color: #333;
      }
      
      .accessibility-menu h3 {
        margin: 0 0 12px 0;
        color: #333;
      }
      
      .accessibility-options label {
        display: block;
        margin-bottom: 8px;
        cursor: pointer;
      }
      
      .color-blind-options {
        margin-top: 12px;
      }
      
      .color-blind-options select {
        width: 100%;
        padding: 4px;
        margin-top: 4px;
      }
      
      .skip-link {
        position: absolute;
        top: -40px;
        left: 6px;
        background: #000;
        color: #fff;
        padding: 8px;
        text-decoration: none;
        border-radius: 4px;
        z-index: 10002;
      }
      
      .skip-link:focus {
        top: 6px;
      }
    `;
    
    document.head.appendChild(styles);
    document.body.appendChild(accessibilityPanel);
    
    this.setupAccessibilityEventListeners();
  }

  setupAccessibilityEventListeners() {
    const toggle = document.getElementById('accessibility-toggle');
    const menu = document.getElementById('accessibility-menu');
    
    toggle.addEventListener('click', () => {
      const isVisible = menu.style.display !== 'none';
      menu.style.display = isVisible ? 'none' : 'block';
      toggle.setAttribute('aria-expanded', !isVisible);
    });
    
    // Feature toggles
    document.getElementById('high-contrast-toggle').addEventListener('change', (e) => {
      this.toggleHighContrast(e.target.checked);
    });
    
    document.getElementById('large-text-toggle').addEventListener('change', (e) => {
      this.toggleLargeText(e.target.checked);
    });
    
    document.getElementById('reduced-motion-toggle').addEventListener('change', (e) => {
      this.toggleReducedMotion(e.target.checked);
    });
    
    document.getElementById('audio-descriptions-toggle').addEventListener('change', (e) => {
      this.toggleAudioDescriptions(e.target.checked);
    });
    
    document.getElementById('keyboard-navigation-toggle').addEventListener('change', (e) => {
      this.toggleKeyboardNavigation(e.target.checked);
    });
    
    document.getElementById('color-blind-filter').addEventListener('change', (e) => {
      this.applyColorBlindFilter(e.target.value);
    });
  }

  // Feature toggle methods
  toggleHighContrast(enabled) {
    this.features.highContrast = enabled;
    document.body.classList.toggle('high-contrast', enabled);
    this.announce(enabled ? 'High contrast mode enabled' : 'High contrast mode disabled');
  }

  toggleLargeText(enabled) {
    this.features.largeText = enabled;
    document.body.classList.toggle('large-text', enabled);
    this.announce(enabled ? 'Large text enabled' : 'Large text disabled');
  }

  toggleReducedMotion(enabled) {
    this.features.reducedMotion = enabled;
    document.body.classList.toggle('reduced-motion', enabled);
    this.announce(enabled ? 'Reduced motion enabled' : 'Reduced motion disabled');
  }

  toggleAudioDescriptions(enabled) {
    this.features.audioDescriptions = enabled;
    this.audioDescriptions.enabled = enabled;
    this.announce(enabled ? 'Audio descriptions enabled' : 'Audio descriptions disabled');
  }

  toggleKeyboardNavigation(enabled) {
    this.features.keyboardNavigation = enabled;
    this.announce(enabled ? 'Keyboard navigation enabled' : 'Keyboard navigation disabled');
  }

  applyColorBlindFilter(filterType) {
    const filter = filterType === 'none' ? 'none' : this.colorBlindFilters[filterType];
    document.body.style.filter = filter || 'none';
    this.features.colorBlindSupport = filterType !== 'none';
    
    this.announce(filterType === 'none' ? 
      'Color blind filter removed' : 
      `${filterType} color blind filter applied`
    );
  }

  // Screen reader announcement methods
  announce(message, priority = 'polite') {
    if (!this.features.screenReader && !this.features.audioDescriptions) return;
    
    const region = document.getElementById(
      priority === 'assertive' ? 'aria-assertive-region' : 'aria-live-region'
    );
    
    if (region) {
      region.textContent = message;
      
      // Clear after announcement
      setTimeout(() => {
        region.textContent = '';
      }, 1000);
    }
    
    // Also use speech synthesis if audio descriptions are enabled
    if (this.features.audioDescriptions && this.audioDescriptions.synth) {
      this.speak(message);
    }
  }

  announceElement(element) {
    if (!this.features.screenReader) return;
    
    let announcement = '';
    
    if (element.hasAttribute('aria-label')) {
      announcement = element.getAttribute('aria-label');
    } else if (element.hasAttribute('title')) {
      announcement = element.getAttribute('title');
    } else {
      announcement = element.textContent.trim();
    }
    
    if (element.tagName === 'BUTTON') {
      announcement += ', button';
    } else if (element.classList.contains('festival-card')) {
      announcement += ', festival card';
    }
    
    this.announce(announcement);
  }

  speak(text, options = {}) {
    if (!this.audioDescriptions.synth || !this.features.audioDescriptions) return;
    
    // Cancel current speech
    this.audioDescriptions.synth.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = options.rate || 1;
    utterance.pitch = options.pitch || 1;
    utterance.volume = options.volume || 0.8;
    
    // Use appropriate voice if available
    const voice = this.audioDescriptions.voices.find(v => 
      v.lang.startsWith('en') && v.name.includes('Female')
    ) || this.audioDescriptions.voices[0];
    
    if (voice) {
      utterance.voice = voice;
    }
    
    this.audioDescriptions.synth.speak(utterance);
  }

  describeFestival(festival) {
    if (!this.features.audioDescriptions) return;
    
    const descriptions = {
      diwali: 'Diwali scene with traditional oil lamps, decorated houses, and rangoli patterns. Click on diyas to light them up.',
      holi: 'Holi celebration with colorful powders, dancing people, and festive courtyard. Drag from color piles to throw colors.',
      navratri: 'Navratri scene with Durga pandal, circular dance floor, and traditional dancers performing Garba.',
      ganesh: 'Ganesh Chaturthi with elaborate elephant-headed deity idol, procession route, and devotees.',
      dussehra: 'Dussehra celebration with tall Ravana effigy, performance stage, and weapon worship area.',
      kumbh: 'Kumbh Mela with holy river, massive gathering of pilgrims, spiritual teachers, and sacred bathing area.'
    };
    
    this.speak(descriptions[festival] || 'Festival scene loaded');
  }

  // Public API methods
  enableFeature(feature) {
    if (this.features.hasOwnProperty(feature)) {
      this.features[feature] = true;
      this.applyFeature(feature, true);
    }
  }

  disableFeature(feature) {
    if (this.features.hasOwnProperty(feature)) {
      this.features[feature] = false;
      this.applyFeature(feature, false);
    }
  }

  applyFeature(feature, enabled) {
    switch (feature) {
      case 'highContrast':
        this.toggleHighContrast(enabled);
        break;
      case 'largeText':
        this.toggleLargeText(enabled);
        break;
      case 'reducedMotion':
        this.toggleReducedMotion(enabled);
        break;
      case 'audioDescriptions':
        this.toggleAudioDescriptions(enabled);
        break;
      case 'keyboardNavigation':
        this.toggleKeyboardNavigation(enabled);
        break;
    }
  }

  getAccessibilityReport() {
    return {
      featuresEnabled: this.features,
      focusableElements: this.keyboardNavigation.focusableElements.length,
      ariaLabelsPresent: document.querySelectorAll('[aria-label]').length,
      headingStructure: this.analyzeHeadingStructure(),
      colorContrast: this.analyzeColorContrast()
    };
  }

  analyzeHeadingStructure() {
    const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6, [role="heading"]'));
    return {
      total: headings.length,
      hierarchy: headings.map(h => ({
        level: h.tagName.charAt(1) || h.getAttribute('aria-level'),
        text: h.textContent.trim().substring(0, 50)
      }))
    };
  }

  analyzeColorContrast() {
    // Basic color contrast analysis
    const elements = document.querySelectorAll('button, .festival-card, .nav-btn');
    let lowContrastCount = 0;
    
    elements.forEach(element => {
      const styles = window.getComputedStyle(element);
      const bgColor = styles.backgroundColor;
      const textColor = styles.color;
      
      // Simple contrast check (would need more sophisticated algorithm in production)
      if (this.isLowContrast(bgColor, textColor)) {
        lowContrastCount++;
      }
    });
    
    return {
      totalElements: elements.length,
      lowContrastElements: lowContrastCount,
      contrastRatio: (elements.length - lowContrastCount) / elements.length
    };
  }

  isLowContrast(bgColor, textColor) {
    // Simplified contrast check
    // In production, would use proper WCAG contrast calculation
    return false; // Placeholder
  }

  dispose() {
    // Remove event listeners and clean up
    const accessibilityPanel = document.getElementById('accessibility-panel');
    if (accessibilityPanel) {
      accessibilityPanel.remove();
    }
    
    if (this.highContrastStyles) {
      this.highContrastStyles.remove();
    }
    
    if (this.reducedMotionStyles) {
      this.reducedMotionStyles.remove();
    }
  }
}
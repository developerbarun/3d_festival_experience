export class ErrorHandler {
  constructor() {
    this.errorLog = [];
    this.fallbackSystems = new Map();
    this.retryAttempts = new Map();
    this.maxRetries = 3;
    this.offlineMode = false;
    this.gracefulDegradation = true;
    
    this.init();
  }

  init() {
    this.setupGlobalErrorHandling();
    this.setupFallbackSystems();
    this.setupOfflineDetection();
    this.setupGracefulDegradation();
    this.createErrorUI();
  }

  setupGlobalErrorHandling() {
    // Catch unhandled JavaScript errors
    window.addEventListener('error', (event) => {
      this.handleError({
        type: 'javascript',
        message: event.message,
        filename: event.filename,
        line: event.lineno,
        column: event.colno,
        stack: event.error?.stack,
        timestamp: new Date().toISOString()
      });
    });

    // Catch unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.handleError({
        type: 'promise',
        message: event.reason?.message || 'Unhandled promise rejection',
        stack: event.reason?.stack,
        timestamp: new Date().toISOString()
      });
    });

    // Catch WebGL context lost
    const canvas = document.getElementById('babylon-canvas');
    if (canvas) {
      canvas.addEventListener('webglcontextlost', (event) => {
        event.preventDefault();
        this.handleWebGLContextLost();
      });

      canvas.addEventListener('webglcontextrestored', () => {
        this.handleWebGLContextRestored();
      });
    }
  }

  setupFallbackSystems() {
    // 3D Scene fallback
    this.fallbackSystems.set('3d_scene', {
      fallback: () => this.enable2DFallback(),
      condition: () => !this.isWebGLSupported()
    });

    // Audio fallback
    this.fallbackSystems.set('audio', {
      fallback: () => this.enableSilentMode(),
      condition: () => !this.isAudioSupported()
    });

    // AI Guide fallback
    this.fallbackSystems.set('ai_guide', {
      fallback: () => this.enableStaticGuide(),
      condition: () => !this.isAIServiceAvailable()
    });

    // Personalization fallback
    this.fallbackSystems.set('personalization', {
      fallback: () => this.enableBasicMode(),
      condition: () => !this.isPersonalizationAvailable()
    });
  }

  setupOfflineDetection() {
    window.addEventListener('online', () => {
      this.offlineMode = false;
      this.showNotification('Connection restored', 'success');
      this.retryFailedOperations();
    });

    window.addEventListener('offline', () => {
      this.offlineMode = true;
      this.showNotification('You are offline. Some features may be limited.', 'warning');
      this.enableOfflineMode();
    });
  }

  setupGracefulDegradation() {
    // Check device capabilities and enable appropriate fallbacks
    const capabilities = this.detectCapabilities();
    
    if (capabilities.isLowEnd) {
      this.enableLowEndOptimizations();
    }
    
    if (capabilities.isOldBrowser) {
      this.enableLegacySupport();
    }
    
    if (capabilities.hasLimitedFeatures) {
      this.enableFeatureFallbacks();
    }
  }

  detectCapabilities() {
    return {
      isLowEnd: (navigator.hardwareConcurrency || 4) < 4,
      isOldBrowser: !window.fetch || !window.Promise,
      hasWebGL: this.isWebGLSupported(),
      hasWebGL2: this.isWebGL2Supported(),
      hasAudio: this.isAudioSupported(),
      hasLocalStorage: this.isLocalStorageSupported(),
      hasLimitedFeatures: !window.IntersectionObserver || !window.ResizeObserver
    };
  }

  handleError(error) {
    console.error('Error caught by ErrorHandler:', error);
    
    // Log error
    this.errorLog.push(error);
    
    // Keep only last 50 errors
    if (this.errorLog.length > 50) {
      this.errorLog.shift();
    }
    
    // Determine error severity and response
    const severity = this.categorizeError(error);
    
    switch (severity) {
      case 'critical':
        this.handleCriticalError(error);
        break;
      case 'major':
        this.handleMajorError(error);
        break;
      case 'minor':
        this.handleMinorError(error);
        break;
    }
    
    // Report error if analytics available
    this.reportError(error);
  }

  categorizeError(error) {
    if (error.message?.includes('WebGL') || error.message?.includes('3D')) {
      return 'critical';
    }
    
    if (error.message?.includes('API') || error.message?.includes('network')) {
      return 'major';
    }
    
    return 'minor';
  }

  handleCriticalError(error) {
    console.error('Critical error detected:', error);
    
    // Try to recover or fallback
    if (error.message?.includes('WebGL')) {
      this.handleWebGLError();
    } else {
      this.enableSafeMode();
    }
    
    this.showErrorDialog({
      title: 'Technical Issue Detected',
      message: 'We\'re experiencing a technical issue. The app will continue in safe mode.',
      actions: [
        { text: 'Reload App', action: () => window.location.reload() },
        { text: 'Continue', action: () => this.dismissError() }
      ]
    });
  }

  handleMajorError(error) {
    console.warn('Major error detected:', error);
    
    // Try to retry the operation
    const retryKey = this.getRetryKey(error);
    const attempts = this.retryAttempts.get(retryKey) || 0;
    
    if (attempts < this.maxRetries) {
      this.retryAttempts.set(retryKey, attempts + 1);
      setTimeout(() => this.retryOperation(error), 1000 * (attempts + 1));
    } else {
      this.enableFallbackForError(error);
      this.showNotification('Some features may be limited due to connectivity issues.', 'warning');
    }
  }

  handleMinorError(error) {
    console.warn('Minor error detected:', error);
    
    // Log for analytics but don't interrupt user experience
    this.reportError(error);
  }

  handleWebGLError() {
    console.error('WebGL error detected, enabling 2D fallback');
    this.enable2DFallback();
  }

  handleWebGLContextLost() {
    console.warn('WebGL context lost, attempting recovery');
    this.showNotification('Graphics context lost. Attempting to recover...', 'warning');
  }

  handleWebGLContextRestored() {
    console.log('WebGL context restored');
    this.showNotification('Graphics restored successfully!', 'success');
    
    // Reinitialize 3D scene
    if (window.app && window.app.sceneManager) {
      window.app.sceneManager.reinitialize();
    }
  }

  enable2DFallback() {
    document.body.classList.add('fallback-2d');
    
    // Hide 3D canvas
    const canvas = document.getElementById('babylon-canvas');
    if (canvas) {
      canvas.style.display = 'none';
    }
    
    // Show 2D alternative
    this.create2DExperience();
    
    this.showNotification('3D features unavailable. Showing 2D experience.', 'info');
  }

  create2DExperience() {
    const fallbackContainer = document.createElement('div');
    fallbackContainer.id = 'fallback-2d-experience';
    fallbackContainer.innerHTML = `
      <div class="fallback-content">
        <h2>Hindu Festivals Cultural Experience</h2>
        <p>Explore the rich traditions through images and descriptions</p>
        <div class="festival-gallery">
          <!-- 2D festival content would go here -->
        </div>
      </div>
    `;
    
    document.body.appendChild(fallbackContainer);
  }

  enableSilentMode() {
    console.log('Audio not supported, enabling silent mode');
    document.body.classList.add('silent-mode');
    
    // Disable all audio-related UI
    const audioButtons = document.querySelectorAll('[data-audio]');
    audioButtons.forEach(btn => {
      btn.style.display = 'none';
    });
  }

  enableStaticGuide() {
    console.log('AI service unavailable, enabling static guide');
    
    // Replace AI guide with static cultural information
    if (window.app && window.app.aiGuide) {
      window.app.aiGuide.enableFallbackMode();
    }
  }

  enableBasicMode() {
    console.log('Personalization unavailable, enabling basic mode');
    document.body.classList.add('basic-mode');
    
    // Hide personalization features
    const personalizedElements = document.querySelectorAll('[data-personalized]');
    personalizedElements.forEach(element => {
      element.style.display = 'none';
    });
  }

  enableSafeMode() {
    console.log('Enabling safe mode due to critical error');
    document.body.classList.add('safe-mode');
    
    // Disable all advanced features
    this.enable2DFallback();
    this.enableSilentMode();
    this.enableStaticGuide();
    this.enableBasicMode();
  }

  enableOfflineMode() {
    console.log('Enabling offline mode');
    document.body.classList.add('offline-mode');
    
    // Cache essential data
    this.cacheEssentialData();
    
    // Disable network-dependent features
    this.disableNetworkFeatures();
  }

  enableLowEndOptimizations() {
    console.log('Enabling low-end device optimizations');
    document.body.classList.add('low-end-device');
    
    // Reduce visual effects
    document.body.classList.add('reduced-effects');
  }

  enableLegacySupport() {
    console.log('Enabling legacy browser support');
    document.body.classList.add('legacy-browser');
    
    // Load polyfills if needed
    this.loadPolyfills();
  }

  enableFeatureFallbacks() {
    console.log('Enabling feature fallbacks');
    
    // Implement fallbacks for missing browser features
    if (!window.IntersectionObserver) {
      this.polyfillIntersectionObserver();
    }
  }

  // Utility methods
  isWebGLSupported() {
    try {
      const canvas = document.createElement('canvas');
      return !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
    } catch (e) {
      return false;
    }
  }

  isWebGL2Supported() {
    try {
      const canvas = document.createElement('canvas');
      return !!canvas.getContext('webgl2');
    } catch (e) {
      return false;
    }
  }

  isAudioSupported() {
    return !!(window.AudioContext || window.webkitAudioContext);
  }

  isLocalStorageSupported() {
    try {
      localStorage.setItem('test', 'test');
      localStorage.removeItem('test');
      return true;
    } catch (e) {
      return false;
    }
  }

  isAIServiceAvailable() {
    return !!(import.meta.env.VITE_GEMINI_API_KEY);
  }

  isPersonalizationAvailable() {
    return !!(import.meta.env.VITE_QLOO_API_KEY);
  }

  getRetryKey(error) {
    return `${error.type}_${error.message?.substring(0, 50)}`;
  }

  retryOperation(error) {
    console.log('Retrying operation after error:', error);
    
    // Implement retry logic based on error type
    if (error.type === 'network') {
      this.retryNetworkOperation(error);
    } else if (error.type === 'api') {
      this.retryAPIOperation(error);
    }
  }

  retryNetworkOperation(error) {
    // Retry network operations
    console.log('Retrying network operation');
  }

  retryAPIOperation(error) {
    // Retry API calls
    console.log('Retrying API operation');
  }

  enableFallbackForError(error) {
    // Enable appropriate fallback based on error type
    if (error.message?.includes('3D') || error.message?.includes('WebGL')) {
      this.enable2DFallback();
    } else if (error.message?.includes('audio')) {
      this.enableSilentMode();
    } else if (error.message?.includes('AI') || error.message?.includes('API')) {
      this.enableStaticGuide();
    }
  }

  cacheEssentialData() {
    // Cache essential cultural data for offline use
    const essentialData = {
      festivals: ['diwali', 'holi', 'navratri', 'ganesh', 'dussehra', 'kumbh'],
      culturalInfo: {
        // Basic cultural information for offline access
      }
    };
    
    try {
      localStorage.setItem('offlineData', JSON.stringify(essentialData));
    } catch (e) {
      console.warn('Could not cache offline data:', e);
    }
  }

  disableNetworkFeatures() {
    // Disable features that require network connectivity
    const networkElements = document.querySelectorAll('[data-network]');
    networkElements.forEach(element => {
      element.style.display = 'none';
    });
  }

  loadPolyfills() {
    // Load necessary polyfills for older browsers
    if (!window.fetch) {
      console.log('Loading fetch polyfill');
      // Would load fetch polyfill
    }
    
    if (!window.Promise) {
      console.log('Loading Promise polyfill');
      // Would load Promise polyfill
    }
  }

  polyfillIntersectionObserver() {
    // Simple IntersectionObserver polyfill
    window.IntersectionObserver = class {
      constructor(callback) {
        this.callback = callback;
      }
      observe() {}
      unobserve() {}
      disconnect() {}
    };
  }

  createErrorUI() {
    const errorContainer = document.createElement('div');
    errorContainer.id = 'error-handler-ui';
    errorContainer.innerHTML = `
      <div class="error-dialog" id="error-dialog" style="display: none;">
        <div class="error-content">
          <h3 class="error-title"></h3>
          <p class="error-message"></p>
          <div class="error-actions"></div>
        </div>
      </div>
    `;
    
    document.body.appendChild(errorContainer);
  }

  showErrorDialog({ title, message, actions = [] }) {
    const dialog = document.getElementById('error-dialog');
    const titleEl = dialog.querySelector('.error-title');
    const messageEl = dialog.querySelector('.error-message');
    const actionsEl = dialog.querySelector('.error-actions');
    
    titleEl.textContent = title;
    messageEl.textContent = message;
    
    actionsEl.innerHTML = '';
    actions.forEach(action => {
      const button = document.createElement('button');
      button.textContent = action.text;
      button.onclick = action.action;
      button.className = 'error-action-btn';
      actionsEl.appendChild(button);
    });
    
    dialog.style.display = 'flex';
  }

  dismissError() {
    const dialog = document.getElementById('error-dialog');
    dialog.style.display = 'none';
  }

  showNotification(message, type = 'info') {
    if (window.app && window.app.uiManager) {
      window.app.uiManager.showNotification(message, type);
    } else {
      console.log(`${type.toUpperCase()}: ${message}`);
    }
  }

  reportError(error) {
    // Report error to analytics service
    console.log('Reporting error to analytics:', error);
    
    // In production, this would send to error tracking service
    if (window.app && window.app.analyticsManager) {
      window.app.analyticsManager.trackError(error);
    }
  }

  retryFailedOperations() {
    // Retry operations that failed due to network issues
    console.log('Retrying failed operations after connection restored');
    this.retryAttempts.clear();
  }

  getErrorReport() {
    return {
      totalErrors: this.errorLog.length,
      recentErrors: this.errorLog.slice(-10),
      fallbacksActive: Array.from(this.fallbackSystems.keys()).filter(key => 
        this.fallbackSystems.get(key).condition()
      ),
      offlineMode: this.offlineMode,
      capabilities: this.detectCapabilities()
    };
  }

  dispose() {
    this.errorLog = [];
    this.fallbackSystems.clear();
    this.retryAttempts.clear();
    
    const errorUI = document.getElementById('error-handler-ui');
    if (errorUI) {
      errorUI.remove();
    }
  }
}
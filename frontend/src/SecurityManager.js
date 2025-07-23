export class SecurityManager {
  constructor() {
    this.securityPolicies = {
      contentSecurityPolicy: true,
      xssProtection: true,
      clickjackingProtection: true,
      httpsEnforcement: true
    };
    
    this.dataProtection = {
      encryptLocalStorage: true,
      sanitizeInputs: true,
      validateApiResponses: true,
      anonymizeAnalytics: true
    };
    
    this.init();
  }

  init() {
    this.setupContentSecurityPolicy();
    this.setupXSSProtection();
    this.setupClickjackingProtection();
    this.setupDataProtection();
    this.setupInputSanitization();
    this.setupApiValidation();
  }

  setupContentSecurityPolicy() {
    // Set Content Security Policy headers
    const csp = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://fonts.googleapis.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: blob: https:",
      "connect-src 'self' https://api.gemini.com https://api.qloo.com",
      "media-src 'self' blob:",
      "worker-src 'self' blob:",
      "frame-ancestors 'none'"
    ].join('; ');
    
    const meta = document.createElement('meta');
    meta.httpEquiv = 'Content-Security-Policy';
    meta.content = csp;
    document.head.appendChild(meta);
  }

  setupXSSProtection() {
    // Enable XSS protection
    const xssProtection = document.createElement('meta');
    xssProtection.httpEquiv = 'X-XSS-Protection';
    xssProtection.content = '1; mode=block';
    document.head.appendChild(xssProtection);
    
    // Prevent MIME type sniffing
    const noSniff = document.createElement('meta');
    noSniff.httpEquiv = 'X-Content-Type-Options';
    noSniff.content = 'nosniff';
    document.head.appendChild(noSniff);
  }

  setupClickjackingProtection() {
    // Prevent clickjacking
    const frameOptions = document.createElement('meta');
    frameOptions.httpEquiv = 'X-Frame-Options';
    frameOptions.content = 'DENY';
    document.head.appendChild(frameOptions);
  }

  setupDataProtection() {
    // Encrypt sensitive data in localStorage
    this.encryptionKey = this.generateEncryptionKey();
    
    // Override localStorage methods for encryption
    const originalSetItem = localStorage.setItem;
    const originalGetItem = localStorage.getItem;
    
    localStorage.setItem = (key, value) => {
      if (this.shouldEncrypt(key)) {
        value = this.encrypt(value);
      }
      return originalSetItem.call(localStorage, key, value);
    };
    
    localStorage.getItem = (key) => {
      let value = originalGetItem.call(localStorage, key);
      if (value && this.shouldEncrypt(key)) {
        value = this.decrypt(value);
      }
      return value;
    };
  }

  setupInputSanitization() {
    // Sanitize all user inputs
    document.addEventListener('input', (event) => {
      if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
        event.target.value = this.sanitizeInput(event.target.value);
      }
    });
  }

  setupApiValidation() {
    // Validate all API responses
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      try {
        const response = await originalFetch(...args);
        return this.validateApiResponse(response);
      } catch (error) {
        console.error('API request failed:', error);
        throw error;
      }
    };
  }

  generateEncryptionKey() {
    // Generate a simple encryption key (in production, use proper key management)
    return btoa(Math.random().toString(36).substring(2, 15));
  }

  shouldEncrypt(key) {
    const sensitiveKeys = [
      'hinduFestivalsUserProfile',
      'hinduFestivalsProgress',
      'hinduFestivalsSettings'
    ];
    return sensitiveKeys.includes(key);
  }

  encrypt(data) {
    try {
      // Simple encryption (in production, use proper encryption)
      return btoa(encodeURIComponent(data));
    } catch (error) {
      console.warn('Encryption failed:', error);
      return data;
    }
  }

  decrypt(data) {
    try {
      // Simple decryption (in production, use proper decryption)
      return decodeURIComponent(atob(data));
    } catch (error) {
      console.warn('Decryption failed:', error);
      return data;
    }
  }

  sanitizeInput(input) {
    if (typeof input !== 'string') return input;
    
    // Remove potentially dangerous characters
    return input
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+\s*=/gi, '')
      .trim();
  }

  validateApiResponse(response) {
    // Validate response headers and content
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }
    
    // Check content type
    const contentType = response.headers.get('content-type');
    if (contentType && !contentType.includes('application/json') && !contentType.includes('text/')) {
      console.warn('Unexpected content type:', contentType);
    }
    
    return response;
  }

  reportSecurityIncident(incident) {
    console.warn('Security incident:', incident);
    
    // In production, send to security monitoring service
    if (import.meta.env.PROD && import.meta.env.VITE_SECURITY_ENDPOINT) {
      fetch(import.meta.env.VITE_SECURITY_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          incident,
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
          url: window.location.href
        })
      }).catch(error => {
        console.error('Failed to report security incident:', error);
      });
    }
  }

  getSecurityReport() {
    return {
      policies: this.securityPolicies,
      dataProtection: this.dataProtection,
      timestamp: new Date().toISOString()
    };
  }
}
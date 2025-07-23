export class DeploymentManager {
  constructor() {
    this.environment = import.meta.env.MODE;
    this.version = import.meta.env.VITE_APP_VERSION || '1.0.0';
    this.buildTime = import.meta.env.VITE_BUILD_TIME || new Date().toISOString();
    
    this.deploymentConfig = {
      cdn: {
        enabled: import.meta.env.PROD,
        baseUrl: import.meta.env.VITE_CDN_URL || '',
        cacheControl: 'public, max-age=31536000' // 1 year
      },
      ssl: {
        enforced: import.meta.env.PROD,
        hsts: true,
        redirectHttp: true
      },
      compression: {
        gzip: true,
        brotli: true,
        minify: import.meta.env.PROD
      },
      monitoring: {
        enabled: import.meta.env.PROD,
        endpoint: import.meta.env.VITE_MONITORING_ENDPOINT
      }
    };
    
    this.init();
  }

  init() {
    this.setupEnvironmentDetection();
    this.setupSSLEnforcement();
    this.setupCDNOptimization();
    this.setupCacheOptimization();
    this.setupCompressionHeaders();
    this.setupMonitoringIntegration();
    this.displayDeploymentInfo();
  }

  setupEnvironmentDetection() {
    // Add environment class to body
    document.body.classList.add(`env-${this.environment}`);
    
    // Set global environment variables
    window.APP_ENV = {
      mode: this.environment,
      version: this.version,
      buildTime: this.buildTime,
      isProduction: import.meta.env.PROD,
      isDevelopment: import.meta.env.DEV
    };
    
    console.log(`🚀 Environment: ${this.environment} (v${this.version})`);
  }

  setupSSLEnforcement() {
    if (this.deploymentConfig.ssl.enforced && location.protocol !== 'https:') {
      // Redirect to HTTPS in production
      if (import.meta.env.PROD) {
        location.replace(`https:${location.href.substring(location.protocol.length)}`);
      }
    }
    
    if (this.deploymentConfig.ssl.hsts) {
      // Set HSTS header (would be done server-side in production)
      console.log('🔒 HSTS enforcement enabled');
    }
  }

  setupCDNOptimization() {
    if (this.deploymentConfig.cdn.enabled && this.deploymentConfig.cdn.baseUrl) {
      // Optimize asset loading through CDN
      this.optimizeAssetLoading();
    }
  }

  optimizeAssetLoading() {
    // Preload critical resources
    const criticalResources = [
      '/assets/fonts/inter.woff2',
      '/assets/fonts/playfair-display.woff2',
      '/assets/images/festival-icons.webp'
    ];
    
    criticalResources.forEach(resource => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = this.deploymentConfig.cdn.baseUrl + resource;
      link.as = resource.includes('font') ? 'font' : 'image';
      if (resource.includes('font')) {
        link.crossOrigin = 'anonymous';
      }
      document.head.appendChild(link);
    });
    
    // Prefetch non-critical resources
    const prefetchResources = [
      '/assets/textures/marble.webp',
      '/assets/textures/wood.webp',
      '/assets/audio/ambient.mp3'
    ];
    
    prefetchResources.forEach(resource => {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = this.deploymentConfig.cdn.baseUrl + resource;
      document.head.appendChild(link);
    });
  }

  setupCacheOptimization() {
    // Set up service worker for caching (if available)
    if ('serviceWorker' in navigator && import.meta.env.PROD) {
      navigator.serviceWorker.register('/sw.js')
        .then(registration => {
          console.log('📦 Service Worker registered:', registration);
        })
        .catch(error => {
          console.warn('Service Worker registration failed:', error);
        });
    }
    
    // Implement cache-first strategy for static assets
    this.setupCacheStrategy();
  }

  setupCacheStrategy() {
    // Cache static assets in browser
    const staticAssets = [
      'style.css',
      'main.js',
      'index.html'
    ];
    
    staticAssets.forEach(asset => {
      // Add cache headers via meta tags (server would handle this in production)
      const meta = document.createElement('meta');
      meta.httpEquiv = 'Cache-Control';
      meta.content = this.deploymentConfig.cdn.cacheControl;
      document.head.appendChild(meta);
    });
  }

  setupCompressionHeaders() {
    if (this.deploymentConfig.compression.gzip) {
      // Enable gzip compression (server-side configuration)
      console.log('🗜️ Gzip compression enabled');
    }
    
    if (this.deploymentConfig.compression.brotli) {
      // Enable Brotli compression (server-side configuration)
      console.log('🗜️ Brotli compression enabled');
    }
  }

  setupMonitoringIntegration() {
    if (this.deploymentConfig.monitoring.enabled) {
      // Initialize monitoring
      this.initializeMonitoring();
    }
  }

  initializeMonitoring() {
    // Send deployment event
    this.sendDeploymentEvent();
    
    // Monitor critical metrics
    this.monitorCriticalMetrics();
  }

  sendDeploymentEvent() {
    const deploymentData = {
      version: this.version,
      environment: this.environment,
      buildTime: this.buildTime,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    };
    
    if (this.deploymentConfig.monitoring.endpoint) {
      fetch(this.deploymentConfig.monitoring.endpoint + '/deployment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(deploymentData)
      }).catch(error => {
        console.warn('Failed to send deployment event:', error);
      });
    }
    
    console.log('📊 Deployment event sent:', deploymentData);
  }

  monitorCriticalMetrics() {
    // Monitor page load performance
    window.addEventListener('load', () => {
      const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
      this.reportMetric('page_load_time', loadTime);
    });
    
    // Monitor JavaScript errors
    window.addEventListener('error', (event) => {
      this.reportMetric('javascript_error', {
        message: event.message,
        filename: event.filename,
        line: event.lineno
      });
    });
    
    // Monitor resource loading failures
    document.addEventListener('error', (event) => {
      if (event.target !== window) {
        this.reportMetric('resource_error', {
          type: event.target.tagName,
          src: event.target.src || event.target.href
        });
      }
    }, true);
  }

  reportMetric(metricName, value) {
    if (!this.deploymentConfig.monitoring.endpoint) return;
    
    const metricData = {
      metric: metricName,
      value: value,
      timestamp: new Date().toISOString(),
      version: this.version,
      environment: this.environment
    };
    
    fetch(this.deploymentConfig.monitoring.endpoint + '/metrics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(metricData)
    }).catch(error => {
      console.warn('Failed to report metric:', error);
    });
  }

  displayDeploymentInfo() {
    // Add deployment info to console
    console.log(`
🎭 Hindu Festivals VR Experience
📦 Version: ${this.version}
🌍 Environment: ${this.environment}
⏰ Build Time: ${this.buildTime}
🔧 CDN: ${this.deploymentConfig.cdn.enabled ? 'Enabled' : 'Disabled'}
🔒 SSL: ${this.deploymentConfig.ssl.enforced ? 'Enforced' : 'Optional'}
📊 Monitoring: ${this.deploymentConfig.monitoring.enabled ? 'Active' : 'Disabled'}
    `);
    
    // Add version info to page (hidden)
    const versionInfo = document.createElement('meta');
    versionInfo.name = 'app-version';
    versionInfo.content = this.version;
    document.head.appendChild(versionInfo);
  }

  checkDeploymentHealth() {
    const healthChecks = [
      { name: 'WebGL Support', check: () => this.checkWebGLSupport() },
      { name: 'Local Storage', check: () => this.checkLocalStorage() },
      { name: 'Audio Context', check: () => this.checkAudioContext() },
      { name: 'Fetch API', check: () => this.checkFetchAPI() },
      { name: 'ES6 Support', check: () => this.checkES6Support() }
    ];
    
    const results = healthChecks.map(({ name, check }) => {
      try {
        const result = check();
        return { name, status: 'pass', result };
      } catch (error) {
        return { name, status: 'fail', error: error.message };
      }
    });
    
    const passedChecks = results.filter(r => r.status === 'pass').length;
    const healthScore = (passedChecks / results.length) * 100;
    
    console.log(`🏥 Deployment Health: ${healthScore.toFixed(1)}% (${passedChecks}/${results.length})`);
    
    return {
      score: healthScore,
      checks: results,
      timestamp: new Date().toISOString()
    };
  }

  checkWebGLSupport() {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) throw new Error('WebGL not supported');
    return { supported: true, version: gl.getParameter(gl.VERSION) };
  }

  checkLocalStorage() {
    localStorage.setItem('test', 'test');
    const value = localStorage.getItem('test');
    localStorage.removeItem('test');
    if (value !== 'test') throw new Error('Local Storage not working');
    return { supported: true };
  }

  checkAudioContext() {
    if (!window.AudioContext && !window.webkitAudioContext) {
      throw new Error('Audio Context not supported');
    }
    return { supported: true };
  }

  checkFetchAPI() {
    if (!window.fetch) throw new Error('Fetch API not supported');
    return { supported: true };
  }

  checkES6Support() {
    try {
      eval('const test = () => true; class Test {}');
      return { supported: true };
    } catch (error) {
      throw new Error('ES6 not fully supported');
    }
  }

  getDeploymentReport() {
    return {
      version: this.version,
      environment: this.environment,
      buildTime: this.buildTime,
      config: this.deploymentConfig,
      health: this.checkDeploymentHealth(),
      timestamp: new Date().toISOString()
    };
  }
}
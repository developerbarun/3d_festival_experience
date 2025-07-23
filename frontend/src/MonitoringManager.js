export class MonitoringManager {
  constructor() {
    this.metrics = {
      performance: new Map(),
      errors: new Map(),
      userBehavior: new Map(),
      culturalAccuracy: new Map()
    };
    
    this.alerts = {
      performanceThresholds: {
        fps: 30,
        memoryUsage: 500, // MB
        loadTime: 5000 // ms
      },
      errorThresholds: {
        criticalErrors: 5,
        userErrors: 20
      }
    };
    
    this.isProduction = import.meta.env.PROD;
    this.monitoringEndpoint = import.meta.env.VITE_MONITORING_ENDPOINT;
    
    this.init();
  }

  init() {
    this.setupPerformanceMonitoring();
    this.setupErrorMonitoring();
    this.setupUserBehaviorTracking();
    this.setupCulturalAccuracyMonitoring();
    this.setupRealTimeAlerts();
  }

  setupPerformanceMonitoring() {
    // Monitor FPS and frame timing
    let frameCount = 0;
    let lastTime = performance.now();
    
    const monitorFrames = () => {
      const currentTime = performance.now();
      frameCount++;
      
      if (currentTime - lastTime >= 1000) {
        const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
        this.recordMetric('performance', 'fps', fps);
        
        if (fps < this.alerts.performanceThresholds.fps) {
          this.triggerAlert('performance', `Low FPS detected: ${fps}`);
        }
        
        frameCount = 0;
        lastTime = currentTime;
      }
      
      requestAnimationFrame(monitorFrames);
    };
    
    monitorFrames();
    
    // Monitor memory usage
    if (performance.memory) {
      setInterval(() => {
        const memoryUsage = performance.memory.usedJSHeapSize / 1048576; // MB
        this.recordMetric('performance', 'memory', memoryUsage);
        
        if (memoryUsage > this.alerts.performanceThresholds.memoryUsage) {
          this.triggerAlert('performance', `High memory usage: ${memoryUsage.toFixed(2)}MB`);
        }
      }, 5000);
    }
    
    // Monitor load times
    window.addEventListener('load', () => {
      const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
      this.recordMetric('performance', 'loadTime', loadTime);
      
      if (loadTime > this.alerts.performanceThresholds.loadTime) {
        this.triggerAlert('performance', `Slow load time: ${loadTime}ms`);
      }
    });
  }

  setupErrorMonitoring() {
    // Global error handler
    window.addEventListener('error', (event) => {
      const error = {
        message: event.message,
        filename: event.filename,
        line: event.lineno,
        column: event.colno,
        stack: event.error?.stack,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href
      };
      
      this.recordMetric('errors', 'javascript', error);
      this.sendErrorReport(error);
    });
    
    // Promise rejection handler
    window.addEventListener('unhandledrejection', (event) => {
      const error = {
        reason: event.reason?.message || 'Unhandled promise rejection',
        stack: event.reason?.stack,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href
      };
      
      this.recordMetric('errors', 'promise', error);
      this.sendErrorReport(error);
    });
  }

  setupUserBehaviorTracking() {
    // Track user engagement patterns
    let sessionStart = Date.now();
    let interactionCount = 0;
    
    document.addEventListener('click', () => {
      interactionCount++;
      this.recordMetric('userBehavior', 'interactions', interactionCount);
    });
    
    // Track session duration
    window.addEventListener('beforeunload', () => {
      const sessionDuration = Date.now() - sessionStart;
      this.recordMetric('userBehavior', 'sessionDuration', sessionDuration);
      this.sendBehaviorReport({
        sessionDuration,
        interactionCount,
        timestamp: new Date().toISOString()
      });
    });
    
    // Track page visibility
    document.addEventListener('visibilitychange', () => {
      this.recordMetric('userBehavior', 'visibility', document.hidden ? 'hidden' : 'visible');
    });
  }

  setupCulturalAccuracyMonitoring() {
    // Monitor AI response accuracy
    if (window.app?.aiGuide) {
      const originalGetAIResponse = window.app.aiGuide.getAIResponse;
      window.app.aiGuide.getAIResponse = async function(userMessage) {
        const startTime = performance.now();
        const response = await originalGetAIResponse.call(this, userMessage);
        const responseTime = performance.now() - startTime;
        
        window.app.monitoringManager.recordMetric('culturalAccuracy', 'aiResponseTime', responseTime);
        window.app.monitoringManager.recordMetric('culturalAccuracy', 'aiQuestions', userMessage);
        
        return response;
      };
    }
  }

  setupRealTimeAlerts() {
    // Check metrics every minute
    setInterval(() => {
      this.checkAlertThresholds();
    }, 60000);
  }

  recordMetric(category, type, value) {
    if (!this.metrics[category]) {
      this.metrics[category] = new Map();
    }
    
    if (!this.metrics[category].has(type)) {
      this.metrics[category].set(type, []);
    }
    
    const metrics = this.metrics[category].get(type);
    metrics.push({
      value: value,
      timestamp: Date.now()
    });
    
    // Keep only last 100 entries
    if (metrics.length > 100) {
      metrics.shift();
    }
  }

  triggerAlert(category, message) {
    console.warn(`🚨 Alert [${category}]: ${message}`);
    
    if (this.isProduction && this.monitoringEndpoint) {
      this.sendAlert(category, message);
    }
  }

  checkAlertThresholds() {
    // Check error rates
    const recentErrors = this.getRecentMetrics('errors', 'javascript', 300000); // Last 5 minutes
    if (recentErrors.length > this.alerts.errorThresholds.criticalErrors) {
      this.triggerAlert('errors', `High error rate: ${recentErrors.length} errors in 5 minutes`);
    }
  }

  getRecentMetrics(category, type, timeWindow) {
    const now = Date.now();
    const metrics = this.metrics[category]?.get(type) || [];
    return metrics.filter(metric => now - metric.timestamp < timeWindow);
  }

  async sendErrorReport(error) {
    if (!this.isProduction || !this.monitoringEndpoint) return;
    
    try {
      await fetch(`${this.monitoringEndpoint}/errors`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(error)
      });
    } catch (e) {
      console.warn('Failed to send error report:', e);
    }
  }

  async sendBehaviorReport(behavior) {
    if (!this.isProduction || !this.monitoringEndpoint) return;
    
    try {
      await fetch(`${this.monitoringEndpoint}/behavior`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(behavior)
      });
    } catch (e) {
      console.warn('Failed to send behavior report:', e);
    }
  }

  async sendAlert(category, message) {
    if (!this.isProduction || !this.monitoringEndpoint) return;
    
    try {
      await fetch(`${this.monitoringEndpoint}/alerts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category,
          message,
          timestamp: new Date().toISOString(),
          url: window.location.href
        })
      });
    } catch (e) {
      console.warn('Failed to send alert:', e);
    }
  }

  getMonitoringReport() {
    return {
      performance: Object.fromEntries(this.metrics.performance),
      errors: Object.fromEntries(this.metrics.errors),
      userBehavior: Object.fromEntries(this.metrics.userBehavior),
      culturalAccuracy: Object.fromEntries(this.metrics.culturalAccuracy),
      timestamp: new Date().toISOString()
    };
  }

  dispose() {
    this.metrics.clear();
  }
}
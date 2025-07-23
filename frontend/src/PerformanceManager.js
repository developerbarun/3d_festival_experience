export class PerformanceManager {
  constructor() {
    this.metrics = {
      frameRate: 0,
      renderTime: 0,
      memoryUsage: 0,
      activeObjects: 0,
      particleSystems: 0
    };
    
    this.settings = {
      targetFPS: 60,
      maxParticles: 1000,
      lodDistance: 50,
      cullingDistance: 100
    };
    
    this.isMonitoring = false;
    this.performanceHistory = [];
    this.optimizationLevel = 'medium'; // low, medium, high
    
    this.init();
  }

  init() {
    this.detectDeviceCapabilities();
    this.setupPerformanceMonitoring();
    this.createPerformanceUI();
  }

  detectDeviceCapabilities() {
    // Detect device performance capabilities
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    
    const deviceInfo = {
      cores: navigator.hardwareConcurrency || 4,
      memory: navigator.deviceMemory || 4,
      gpu: gl ? gl.getParameter(gl.RENDERER) : 'Unknown',
      isMobile: /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
      pixelRatio: window.devicePixelRatio || 1
    };
    
    // Determine optimization level based on device capabilities
    if (deviceInfo.cores < 4 || deviceInfo.memory < 4 || deviceInfo.isMobile) {
      this.optimizationLevel = 'low';
      this.settings.maxParticles = 500;
      this.settings.targetFPS = 30;
    } else if (deviceInfo.cores >= 8 && deviceInfo.memory >= 8) {
      this.optimizationLevel = 'high';
      this.settings.maxParticles = 2000;
      this.settings.targetFPS = 60;
    }
    
    console.log('Device capabilities detected:', deviceInfo);
    console.log('Optimization level set to:', this.optimizationLevel);
    
    return deviceInfo;
  }

  setupPerformanceMonitoring() {
    let lastTime = performance.now();
    let frameCount = 0;
    
    const monitor = () => {
      if (!this.isMonitoring) return;
      
      const currentTime = performance.now();
      const deltaTime = currentTime - lastTime;
      frameCount++;
      
      // Calculate FPS every second
      if (deltaTime >= 1000) {
        this.metrics.frameRate = Math.round((frameCount * 1000) / deltaTime);
        this.metrics.renderTime = deltaTime / frameCount;
        
        // Get memory usage if available
        if (performance.memory) {
          this.metrics.memoryUsage = Math.round(performance.memory.usedJSHeapSize / 1048576); // MB
        }
        
        // Store performance history
        this.performanceHistory.push({
          timestamp: currentTime,
          fps: this.metrics.frameRate,
          memory: this.metrics.memoryUsage
        });
        
        // Keep only last 60 seconds of data
        if (this.performanceHistory.length > 60) {
          this.performanceHistory.shift();
        }
        
        // Check if optimization is needed
        this.checkPerformanceThresholds();
        
        // Update performance UI
        this.updatePerformanceUI();
        
        frameCount = 0;
        lastTime = currentTime;
      }
      
      requestAnimationFrame(monitor);
    };
    
    // Start monitoring
    this.isMonitoring = true;
    monitor();
  }

  checkPerformanceThresholds() {
    const avgFPS = this.performanceHistory.slice(-10).reduce((sum, entry) => sum + entry.fps, 0) / 10;
    
    if (avgFPS < this.settings.targetFPS * 0.8) {
      console.warn('Performance below target, applying optimizations');
      this.applyPerformanceOptimizations();
    }
  }

  applyPerformanceOptimizations() {
    // Reduce particle count
    if (this.settings.maxParticles > 200) {
      this.settings.maxParticles *= 0.8;
      console.log('Reduced max particles to:', this.settings.maxParticles);
    }
    
    // Increase LOD distance
    this.settings.lodDistance *= 0.9;
    
    // Notify scene manager to apply optimizations
    if (window.app && window.app.sceneManager) {
      this.optimizeScene(window.app.sceneManager.scene);
    }
  }

  optimizeScene(scene) {
    if (!scene) return;
    
    // Reduce particle system emission rates
    scene.particleSystems.forEach(system => {
      if (system.emitRate > 50) {
        system.emitRate *= 0.8;
      }
    });
    
    // Implement level of detail for distant objects
    scene.meshes.forEach(mesh => {
      const distance = mesh.position.length();
      if (distance > this.settings.lodDistance) {
        mesh.setEnabled(false);
      }
    });
    
    console.log('Scene optimizations applied');
  }

  createPerformanceUI() {
    const performanceUI = document.createElement('div');
    performanceUI.id = 'performance-monitor';
    performanceUI.innerHTML = `
      <div class="performance-content">
        <div class="performance-toggle" id="performance-toggle">📊</div>
        <div class="performance-panel" id="performance-panel" style="display: none;">
          <h4>Performance Monitor</h4>
          <div class="metric">
            <span>FPS:</span>
            <span id="fps-value">--</span>
          </div>
          <div class="metric">
            <span>Memory:</span>
            <span id="memory-value">-- MB</span>
          </div>
          <div class="metric">
            <span>Objects:</span>
            <span id="objects-value">--</span>
          </div>
          <div class="metric">
            <span>Particles:</span>
            <span id="particles-value">--</span>
          </div>
          <div class="optimization-level">
            <span>Mode: ${this.optimizationLevel}</span>
          </div>
        </div>
      </div>
    `;
    
    // Add styles
    const styles = document.createElement('style');
    styles.textContent = `
      #performance-monitor {
        position: fixed;
        top: 20px;
        left: 20px;
        z-index: 9999;
        font-family: 'Inter', sans-serif;
      }
      
      .performance-toggle {
        width: 40px;
        height: 40px;
        background: rgba(0, 0, 0, 0.7);
        color: white;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        font-size: 16px;
      }
      
      .performance-panel {
        position: absolute;
        top: 50px;
        left: 0;
        background: rgba(0, 0, 0, 0.9);
        color: white;
        padding: 16px;
        border-radius: 8px;
        min-width: 200px;
        font-size: 14px;
      }
      
      .performance-panel h4 {
        margin: 0 0 12px 0;
        color: #FFD700;
      }
      
      .metric {
        display: flex;
        justify-content: space-between;
        margin-bottom: 8px;
      }
      
      .optimization-level {
        margin-top: 12px;
        padding-top: 8px;
        border-top: 1px solid rgba(255, 255, 255, 0.2);
        font-size: 12px;
        color: #FFD700;
      }
    `;
    
    document.head.appendChild(styles);
    document.body.appendChild(performanceUI);
    
    // Setup toggle functionality
    document.getElementById('performance-toggle').addEventListener('click', () => {
      const panel = document.getElementById('performance-panel');
      panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
    });
  }

  updatePerformanceUI() {
    const fpsElement = document.getElementById('fps-value');
    const memoryElement = document.getElementById('memory-value');
    const objectsElement = document.getElementById('objects-value');
    const particlesElement = document.getElementById('particles-value');
    
    if (fpsElement) fpsElement.textContent = this.metrics.frameRate;
    if (memoryElement) memoryElement.textContent = `${this.metrics.memoryUsage} MB`;
    if (objectsElement) objectsElement.textContent = this.metrics.activeObjects;
    if (particlesElement) particlesElement.textContent = this.metrics.particleSystems;
  }

  updateMetrics(scene) {
    if (!scene) return;
    
    this.metrics.activeObjects = scene.meshes.length;
    this.metrics.particleSystems = scene.particleSystems.length;
  }

  getPerformanceReport() {
    const avgFPS = this.performanceHistory.length > 0 
      ? this.performanceHistory.reduce((sum, entry) => sum + entry.fps, 0) / this.performanceHistory.length
      : 0;
    
    const avgMemory = this.performanceHistory.length > 0
      ? this.performanceHistory.reduce((sum, entry) => sum + entry.memory, 0) / this.performanceHistory.length
      : 0;
    
    return {
      averageFPS: Math.round(avgFPS),
      averageMemory: Math.round(avgMemory),
      optimizationLevel: this.optimizationLevel,
      currentMetrics: this.metrics,
      recommendations: this.getOptimizationRecommendations()
    };
  }

  getOptimizationRecommendations() {
    const recommendations = [];
    
    if (this.metrics.frameRate < 30) {
      recommendations.push('Consider reducing particle effects');
      recommendations.push('Lower graphics quality in settings');
    }
    
    if (this.metrics.memoryUsage > 500) {
      recommendations.push('High memory usage detected');
      recommendations.push('Consider restarting the application');
    }
    
    if (this.metrics.particleSystems > 10) {
      recommendations.push('Many particle systems active');
      recommendations.push('Some effects may be automatically reduced');
    }
    
    return recommendations;
  }

  dispose() {
    this.isMonitoring = false;
    this.performanceHistory = [];
    
    const performanceUI = document.getElementById('performance-monitor');
    if (performanceUI) {
      performanceUI.remove();
    }
    
    console.log('Performance Manager disposed');
  }
}
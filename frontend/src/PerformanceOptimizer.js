export class PerformanceOptimizer {
  constructor() {
    this.deviceCapabilities = null;
    this.currentQualityLevel = 'auto';
    this.lodSystem = null;
    this.textureManager = null;
    this.memoryManager = null;
    this.batteryOptimizer = null;
    this.performanceMetrics = {
      fps: 60,
      frameTime: 16.67,
      memoryUsage: 0,
      drawCalls: 0,
      triangles: 0
    };
    
    this.qualityPresets = {
      low: {
        maxParticles: 200,
        shadowQuality: 'none',
        textureQuality: 0.5,
        lodDistance: 20,
        maxLights: 4
      },
      medium: {
        maxParticles: 500,
        shadowQuality: 'low',
        textureQuality: 0.75,
        lodDistance: 35,
        maxLights: 8
      },
      high: {
        maxParticles: 1000,
        shadowQuality: 'high',
        textureQuality: 1.0,
        lodDistance: 50,
        maxLights: 12
      }
    };
    
    this.init();
  }

  async init() {
    this.detectDeviceCapabilities();
    this.initializeLODSystem();
    this.initializeTextureManager();
    this.initializeMemoryManager();
    this.initializeBatteryOptimizer();
    this.setupPerformanceMonitoring();
    this.applyOptimalSettings();
  }

  detectDeviceCapabilities() {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
    
    this.deviceCapabilities = {
      // Hardware info
      cores: navigator.hardwareConcurrency || 4,
      memory: navigator.deviceMemory || 4,
      connection: navigator.connection?.effectiveType || '4g',
      
      // GPU capabilities
      maxTextureSize: gl ? gl.getParameter(gl.MAX_TEXTURE_SIZE) : 2048,
      maxRenderBufferSize: gl ? gl.getParameter(gl.MAX_RENDERBUFFER_SIZE) : 2048,
      maxVertexAttribs: gl ? gl.getParameter(gl.MAX_VERTEX_ATTRIBS) : 16,
      
      // Device type
      isMobile: /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
      isTablet: /iPad|Android.*Tablet/i.test(navigator.userAgent),
      isLowEnd: (navigator.hardwareConcurrency || 4) < 4 || (navigator.deviceMemory || 4) < 4,
      
      // Display
      pixelRatio: window.devicePixelRatio || 1,
      screenSize: {
        width: window.screen.width,
        height: window.screen.height
      },
      
      // Battery
      battery: null // Will be set by battery API if available
    };

    // Get battery info if available
    if ('getBattery' in navigator) {
      navigator.getBattery().then(battery => {
        this.deviceCapabilities.battery = {
          level: battery.level,
          charging: battery.charging
        };
      });
    }

    console.log('Device capabilities detected:', this.deviceCapabilities);
    return this.deviceCapabilities;
  }

  initializeLODSystem() {
    this.lodSystem = {
      levels: [
        { distance: 0, quality: 1.0 },    // High detail
        { distance: 25, quality: 0.7 },   // Medium detail
        { distance: 50, quality: 0.4 },   // Low detail
        { distance: 100, quality: 0.1 }   // Very low detail
      ],
      
      applyLOD: (mesh, cameraPosition) => {
        const distance = mesh.position.subtract(cameraPosition).length();
        
        for (let i = this.lodSystem.levels.length - 1; i >= 0; i--) {
          const level = this.lodSystem.levels[i];
          if (distance >= level.distance) {
            mesh.scaling.setAll(level.quality);
            mesh.setEnabled(level.quality > 0.1);
            break;
          }
        }
      }
    };
  }

  initializeTextureManager() {
    this.textureManager = {
      compressionFormats: [],
      streamingEnabled: true,
      maxTextureSize: this.deviceCapabilities.maxTextureSize,
      
      compressTexture: (texture, quality = 1.0) => {
        if (quality < 1.0) {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          const img = new Image();
          
          img.onload = () => {
            const newWidth = Math.floor(img.width * quality);
            const newHeight = Math.floor(img.height * quality);
            
            canvas.width = newWidth;
            canvas.height = newHeight;
            ctx.drawImage(img, 0, 0, newWidth, newHeight);
            
            texture.updateURL(canvas.toDataURL());
          };
          
          img.src = texture.url;
        }
      },
      
      preloadTextures: (textureList) => {
        textureList.forEach(textureUrl => {
          const link = document.createElement('link');
          link.rel = 'preload';
          link.as = 'image';
          link.href = textureUrl;
          document.head.appendChild(link);
        });
      }
    };
  }

  initializeMemoryManager() {
    this.memoryManager = {
      maxMemoryUsage: this.deviceCapabilities.memory * 1024 * 0.7, // 70% of available memory
      currentUsage: 0,
      disposedObjects: new Set(),
      
      trackObject: (object) => {
        if (object.dispose && !this.memoryManager.disposedObjects.has(object)) {
          // Estimate memory usage
          this.memoryManager.currentUsage += this.estimateObjectSize(object);
        }
      },
      
      disposeObject: (object) => {
        if (object.dispose && !this.memoryManager.disposedObjects.has(object)) {
          object.dispose();
          this.memoryManager.disposedObjects.add(object);
          this.memoryManager.currentUsage -= this.estimateObjectSize(object);
        }
      },
      
      cleanup: () => {
        if (this.memoryManager.currentUsage > this.memoryManager.maxMemoryUsage) {
          console.warn('Memory usage high, performing cleanup');
          // Implement cleanup logic
        }
      }
    };
  }

  estimateObjectSize(object) {
    // Rough estimation of object memory usage
    if (object.geometry) {
      const vertices = object.geometry.getVerticesData ? 
        object.geometry.getVerticesData('position')?.length || 0 : 0;
      return vertices * 4; // 4 bytes per float
    }
    return 1024; // Default 1KB estimate
  }

  initializeBatteryOptimizer() {
    this.batteryOptimizer = {
      lowBatteryThreshold: 0.2,
      isOptimizing: false,
      
      checkBatteryStatus: () => {
        if (this.deviceCapabilities.battery) {
          const { level, charging } = this.deviceCapabilities.battery;
          
          if (level < this.batteryOptimizer.lowBatteryThreshold && !charging) {
            this.enableBatteryOptimizations();
          } else if (level > 0.5 || charging) {
            this.disableBatteryOptimizations();
          }
        }
      },
      
      enableOptimizations: () => {
        this.batteryOptimizer.isOptimizing = true;
        this.setQualityLevel('low');
        console.log('Battery optimizations enabled');
      },
      
      disableOptimizations: () => {
        this.batteryOptimizer.isOptimizing = false;
        this.setQualityLevel('auto');
        console.log('Battery optimizations disabled');
      }
    };
  }

  setupPerformanceMonitoring() {
    let frameCount = 0;
    let lastTime = performance.now();
    
    const monitor = () => {
      const currentTime = performance.now();
      frameCount++;
      
      if (currentTime - lastTime >= 1000) {
        this.performanceMetrics.fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
        this.performanceMetrics.frameTime = (currentTime - lastTime) / frameCount;
        
        if (performance.memory) {
          this.performanceMetrics.memoryUsage = performance.memory.usedJSHeapSize / 1048576;
        }
        
        this.adjustQualityBasedOnPerformance();
        
        frameCount = 0;
        lastTime = currentTime;
      }
      
      requestAnimationFrame(monitor);
    };
    
    monitor();
  }

  adjustQualityBasedOnPerformance() {
    const targetFPS = this.deviceCapabilities.isMobile ? 30 : 60;
    
    if (this.performanceMetrics.fps < targetFPS * 0.8) {
      this.downgradeQuality();
    } else if (this.performanceMetrics.fps > targetFPS * 1.1) {
      this.upgradeQuality();
    }
  }

  downgradeQuality() {
    if (this.currentQualityLevel === 'high') {
      this.setQualityLevel('medium');
    } else if (this.currentQualityLevel === 'medium') {
      this.setQualityLevel('low');
    }
  }

  upgradeQuality() {
    if (this.currentQualityLevel === 'low') {
      this.setQualityLevel('medium');
    } else if (this.currentQualityLevel === 'medium') {
      this.setQualityLevel('high');
    }
  }

  applyOptimalSettings() {
    let qualityLevel = 'medium';
    
    if (this.deviceCapabilities.isLowEnd || this.deviceCapabilities.isMobile) {
      qualityLevel = 'low';
    } else if (this.deviceCapabilities.cores >= 8 && this.deviceCapabilities.memory >= 8) {
      qualityLevel = 'high';
    }
    
    this.setQualityLevel(qualityLevel);
  }

  setQualityLevel(level) {
    if (level === 'auto') {
      this.applyOptimalSettings();
      return;
    }
    
    this.currentQualityLevel = level;
    const preset = this.qualityPresets[level];
    
    // Apply quality settings to document
    document.body.classList.remove('quality-low', 'quality-medium', 'quality-high');
    document.body.classList.add(`quality-${level}`);
    
    // Store settings for scene application
    this.currentSettings = preset;
    
    console.log(`Quality level set to: ${level}`, preset);
  }

  optimizeScene(scene) {
    if (!scene || !this.currentSettings) return;
    
    // Apply LOD to all meshes
    scene.meshes.forEach(mesh => {
      if (scene.activeCamera) {
        this.lodSystem.applyLOD(mesh, scene.activeCamera.position);
      }
    });
    
    // Optimize particle systems
    scene.particleSystems.forEach(system => {
      if (system.emitRate > this.currentSettings.maxParticles) {
        system.emitRate = this.currentSettings.maxParticles;
      }
    });
    
    // Optimize lighting
    const lights = scene.lights.slice(0, this.currentSettings.maxLights);
    scene.lights.forEach((light, index) => {
      light.setEnabled(index < this.currentSettings.maxLights);
    });
    
    // Apply texture quality
    scene.textures.forEach(texture => {
      if (this.currentSettings.textureQuality < 1.0) {
        this.textureManager.compressTexture(texture, this.currentSettings.textureQuality);
      }
    });
  }

  getPerformanceReport() {
    return {
      device: this.deviceCapabilities,
      currentQuality: this.currentQualityLevel,
      metrics: this.performanceMetrics,
      recommendations: this.getOptimizationRecommendations()
    };
  }

  getOptimizationRecommendations() {
    const recommendations = [];
    
    if (this.performanceMetrics.fps < 30) {
      recommendations.push('Consider reducing particle effects');
      recommendations.push('Lower texture quality');
      recommendations.push('Reduce number of 3D objects');
    }
    
    if (this.performanceMetrics.memoryUsage > 500) {
      recommendations.push('High memory usage detected');
      recommendations.push('Consider disposing unused objects');
    }
    
    if (this.deviceCapabilities.isMobile) {
      recommendations.push('Mobile optimizations active');
      recommendations.push('Touch controls optimized');
    }
    
    return recommendations;
  }

  dispose() {
    // Cleanup all optimization systems
    this.lodSystem = null;
    this.textureManager = null;
    this.memoryManager = null;
    this.batteryOptimizer = null;
  }
}
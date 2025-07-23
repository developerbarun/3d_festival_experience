import { 
  PostProcess,
  Effect,
  DefaultRenderingPipeline,
  BloomEffect,
  DepthOfFieldEffect,
  FxaaPostProcess,
  ColorCorrectionPostProcess,
  ParticleSystem,
  Vector3,
  Color4,
  Color3,
  Animation,
  DirectionalLight,
  HemisphericLight,
  PointLight,
  ShadowGenerator
} from '@babylonjs/core';

export class VisualEffectsManager {
  constructor(scene, camera) {
    this.scene = scene;
    this.camera = camera;
    this.renderPipeline = null;
    this.weatherSystem = null;
    this.timeOfDay = 'day';
    this.currentWeather = 'clear';
    this.shadowGenerators = [];
    this.postProcesses = [];
    
    this.init();
  }

  init() {
    this.setupRenderingPipeline();
    this.setupLightingSystem();
    this.setupWeatherSystem();
    this.setupTimeOfDaySystem();
    this.setupAtmosphericEffects();
  }

  setupRenderingPipeline() {
    // Create default rendering pipeline for post-processing
    this.renderPipeline = new DefaultRenderingPipeline(
      "defaultPipeline",
      true,
      this.scene,
      [this.camera]
    );

    // Configure bloom effect
    this.renderPipeline.bloomEnabled = true;
    this.renderPipeline.bloomThreshold = 0.8;
    this.renderPipeline.bloomWeight = 0.3;
    this.renderPipeline.bloomKernel = 64;
    this.renderPipeline.bloomScale = 0.5;

    // Configure tone mapping
    this.renderPipeline.imageProcessingEnabled = true;
    this.renderPipeline.imageProcessing.toneMappingEnabled = true;
    this.renderPipeline.imageProcessing.toneMappingType = 1; // ACES tone mapping
    this.renderPipeline.imageProcessing.exposure = 1.0;
    this.renderPipeline.imageProcessing.contrast = 1.1;
    this.renderPipeline.imageProcessing.vignetteEnabled = true;
    this.renderPipeline.imageProcessing.vignetteWeight = 0.3;

    // Configure anti-aliasing
    this.renderPipeline.fxaaEnabled = true;
    this.renderPipeline.samples = 4;

    console.log('Advanced rendering pipeline initialized');
  }

  setupLightingSystem() {
    // Enhanced lighting with shadows
    const mainLight = this.scene.lights.find(light => light.name.includes('directional'));
    
    if (mainLight) {
      // Setup shadow generator
      const shadowGenerator = new ShadowGenerator(1024, mainLight);
      shadowGenerator.useBlurExponentialShadowMap = true;
      shadowGenerator.blurKernel = 32;
      shadowGenerator.setDarkness(0.3);
      
      this.shadowGenerators.push(shadowGenerator);
    }

    // Add atmospheric lighting
    this.createAtmosphericLighting();
  }

  createAtmosphericLighting() {
    // Rim lighting for objects
    const rimLight = new DirectionalLight(
      "rimLight",
      new Vector3(1, -0.5, 1),
      this.scene
    );
    rimLight.intensity = 0.3;
    rimLight.diffuse = new Color3(0.8, 0.9, 1);

    // Fill light for shadows
    const fillLight = new HemisphericLight(
      "fillLight",
      new Vector3(0, -1, 0),
      this.scene
    );
    fillLight.intensity = 0.2;
    fillLight.diffuse = new Color3(0.6, 0.7, 0.8);
  }

  setupWeatherSystem() {
    this.weatherSystem = {
      rain: null,
      clouds: null,
      wind: null,
      
      createRain: () => {
        const rainSystem = new ParticleSystem("rain", 1000, this.scene);
        rainSystem.emitter = new Vector3(0, 20, 0);
        rainSystem.minEmitBox = new Vector3(-25, 0, -25);
        rainSystem.maxEmitBox = new Vector3(25, 0, 25);

        rainSystem.color1 = new Color4(0.7, 0.8, 1, 0.6);
        rainSystem.color2 = new Color4(0.5, 0.6, 0.8, 0.4);
        rainSystem.colorDead = new Color4(0.3, 0.4, 0.6, 0);

        rainSystem.minSize = 0.1;
        rainSystem.maxSize = 0.2;
        rainSystem.minLifeTime = 2;
        rainSystem.maxLifeTime = 4;
        rainSystem.emitRate = 300;

        rainSystem.direction1 = new Vector3(-1, -10, -1);
        rainSystem.direction2 = new Vector3(1, -15, 1);
        rainSystem.gravity = new Vector3(0, -9.8, 0);

        this.weatherSystem.rain = rainSystem;
        return rainSystem;
      },
      
      createClouds: () => {
        const cloudSystem = new ParticleSystem("clouds", 50, this.scene);
        cloudSystem.emitter = new Vector3(0, 15, 0);
        cloudSystem.minEmitBox = new Vector3(-30, -2, -30);
        cloudSystem.maxEmitBox = new Vector3(30, 2, 30);

        cloudSystem.color1 = new Color4(1, 1, 1, 0.8);
        cloudSystem.color2 = new Color4(0.9, 0.9, 0.9, 0.6);
        cloudSystem.colorDead = new Color4(0.8, 0.8, 0.8, 0);

        cloudSystem.minSize = 3;
        cloudSystem.maxSize = 8;
        cloudSystem.minLifeTime = 20;
        cloudSystem.maxLifeTime = 40;
        cloudSystem.emitRate = 2;

        cloudSystem.direction1 = new Vector3(-0.5, 0, -0.5);
        cloudSystem.direction2 = new Vector3(0.5, 0, 0.5);

        this.weatherSystem.clouds = cloudSystem;
        return cloudSystem;
      }
    };
  }

  setupTimeOfDaySystem() {
    this.timeOfDaySystem = {
      currentTime: 12, // 12 PM
      transitionSpeed: 0.1,
      
      timePresets: {
        dawn: {
          sunPosition: new Vector3(-0.8, -0.3, -0.5),
          sunColor: new Color3(1, 0.8, 0.6),
          ambientColor: new Color3(0.6, 0.7, 0.9),
          skyColor: new Color4(0.8, 0.6, 0.4, 1)
        },
        day: {
          sunPosition: new Vector3(-0.3, -1, -0.2),
          sunColor: new Color3(1, 0.95, 0.8),
          ambientColor: new Color3(0.8, 0.8, 0.9),
          skyColor: new Color4(0.5, 0.7, 1, 1)
        },
        dusk: {
          sunPosition: new Vector3(0.8, -0.3, 0.5),
          sunColor: new Color3(1, 0.6, 0.3),
          ambientColor: new Color3(0.7, 0.5, 0.6),
          skyColor: new Color4(0.9, 0.4, 0.2, 1)
        },
        night: {
          sunPosition: new Vector3(0.3, 1, 0.2),
          sunColor: new Color3(0.2, 0.3, 0.6),
          ambientColor: new Color3(0.2, 0.2, 0.4),
          skyColor: new Color4(0.1, 0.1, 0.3, 1)
        }
      },
      
      setTimeOfDay: (timeOfDay) => {
        const preset = this.timeOfDaySystem.timePresets[timeOfDay];
        if (!preset) return;
        
        this.timeOfDay = timeOfDay;
        
        // Update sun light
        const sunLight = this.scene.lights.find(light => 
          light.name.includes('directional') || light.name.includes('sun')
        );
        
        if (sunLight) {
          sunLight.direction = preset.sunPosition;
          sunLight.diffuse = preset.sunColor;
          sunLight.intensity = timeOfDay === 'night' ? 0.3 : 1.0;
        }
        
        // Update ambient light
        const ambientLight = this.scene.lights.find(light => 
          light.name.includes('ambient') || light.name.includes('hemispheric')
        );
        
        if (ambientLight) {
          ambientLight.diffuse = preset.ambientColor;
          ambientLight.intensity = timeOfDay === 'night' ? 0.4 : 0.6;
        }
        
        // Update sky color
        this.scene.clearColor = preset.skyColor;
        
        console.log(`Time of day changed to: ${timeOfDay}`);
      }
    };
  }

  setupAtmosphericEffects() {
    // Dust particles for atmosphere
    this.createAtmosphericParticles();
    
    // Heat haze effect for hot climates
    this.createHeatHaze();
    
    // Incense smoke for temples
    this.createIncenseSmoke();
  }

  createAtmosphericParticles() {
    const dustSystem = new ParticleSystem("atmosphericDust", 100, this.scene);
    dustSystem.emitter = new Vector3(0, 10, 0);
    dustSystem.minEmitBox = new Vector3(-20, -5, -20);
    dustSystem.maxEmitBox = new Vector3(20, 5, 20);

    dustSystem.color1 = new Color4(1, 1, 0.8, 0.1);
    dustSystem.color2 = new Color4(0.9, 0.9, 0.7, 0.05);
    dustSystem.colorDead = new Color4(0.8, 0.8, 0.6, 0);

    dustSystem.minSize = 0.5;
    dustSystem.maxSize = 1.5;
    dustSystem.minLifeTime = 10;
    dustSystem.maxLifeTime = 20;
    dustSystem.emitRate = 5;

    dustSystem.direction1 = new Vector3(-0.2, -0.1, -0.2);
    dustSystem.direction2 = new Vector3(0.2, 0.1, 0.2);

    dustSystem.start();
  }

  createHeatHaze() {
    // Heat distortion effect for hot weather
    const heatHazeEffect = new PostProcess(
      "heatHaze",
      "heatHaze",
      ["time", "intensity"],
      [],
      1.0,
      this.camera
    );

    heatHazeEffect.onApply = (effect) => {
      effect.setFloat("time", performance.now() * 0.001);
      effect.setFloat("intensity", this.timeOfDay === 'day' ? 0.02 : 0.0);
    };

    this.postProcesses.push(heatHazeEffect);
  }

  createIncenseSmoke() {
    // Incense smoke for temple areas
    const smokeSystem = new ParticleSystem("incenseSmoke", 50, this.scene);
    smokeSystem.emitter = new Vector3(0, 1, -10);
    smokeSystem.minEmitBox = new Vector3(-0.1, 0, -0.1);
    smokeSystem.maxEmitBox = new Vector3(0.1, 0.2, 0.1);

    smokeSystem.color1 = new Color4(0.8, 0.8, 0.8, 0.3);
    smokeSystem.color2 = new Color4(0.6, 0.6, 0.6, 0.2);
    smokeSystem.colorDead = new Color4(0.4, 0.4, 0.4, 0);

    smokeSystem.minSize = 0.2;
    smokeSystem.maxSize = 1.0;
    smokeSystem.minLifeTime = 3;
    smokeSystem.maxLifeTime = 6;
    smokeSystem.emitRate = 10;

    smokeSystem.direction1 = new Vector3(-0.1, 1, -0.1);
    smokeSystem.direction2 = new Vector3(0.1, 2, 0.1);

    smokeSystem.start();
  }

  // Festival-specific effects
  applyFestivalEffects(festival) {
    switch (festival) {
      case 'diwali':
        this.timeOfDaySystem.setTimeOfDay('night');
        this.enhanceLightingForDiwali();
        break;
      case 'holi':
        this.timeOfDaySystem.setTimeOfDay('day');
        this.addColorfulAtmosphere();
        break;
      case 'navratri':
        this.timeOfDaySystem.setTimeOfDay('dusk');
        this.addFestiveLighting();
        break;
      case 'ganesh':
        this.timeOfDaySystem.setTimeOfDay('day');
        this.addProcessionEffects();
        break;
      case 'dussehra':
        this.timeOfDaySystem.setTimeOfDay('dusk');
        this.addDramaticLighting();
        break;
      case 'kumbh':
        this.timeOfDaySystem.setTimeOfDay('dawn');
        this.addSpiritualAtmosphere();
        break;
    }
  }

  enhanceLightingForDiwali() {
    // Warm, golden lighting for Diwali
    this.renderPipeline.imageProcessing.colorCurvesEnabled = true;
    this.renderPipeline.imageProcessing.colorCurves.globalSaturation = 1.2;
    this.renderPipeline.imageProcessing.colorCurves.globalExposure = 0.2;
  }

  addColorfulAtmosphere() {
    // Vibrant, saturated colors for Holi
    this.renderPipeline.imageProcessing.colorCurvesEnabled = true;
    this.renderPipeline.imageProcessing.colorCurves.globalSaturation = 1.5;
    this.renderPipeline.imageProcessing.colorCurves.globalHue = 10;
  }

  addFestiveLighting() {
    // Dynamic, colorful lighting for Navratri
    this.renderPipeline.bloomWeight = 0.5;
    this.renderPipeline.bloomThreshold = 0.6;
  }

  addProcessionEffects() {
    // Bright, celebratory effects for Ganesh
    this.renderPipeline.imageProcessing.contrast = 1.2;
    this.renderPipeline.imageProcessing.exposure = 0.1;
  }

  addDramaticLighting() {
    // High contrast for Dussehra
    this.renderPipeline.imageProcessing.contrast = 1.3;
    this.renderPipeline.imageProcessing.vignetteWeight = 0.4;
  }

  addSpiritualAtmosphere() {
    // Soft, ethereal lighting for Kumbh
    this.renderPipeline.imageProcessing.colorCurvesEnabled = true;
    this.renderPipeline.imageProcessing.colorCurves.globalSaturation = 0.9;
    this.renderPipeline.bloomWeight = 0.4;
  }

  startWeatherEffect(weatherType) {
    this.stopWeatherEffects();
    this.currentWeather = weatherType;
    
    switch (weatherType) {
      case 'rain':
        if (!this.weatherSystem.rain) {
          this.weatherSystem.createRain();
        }
        this.weatherSystem.rain.start();
        break;
      case 'cloudy':
        if (!this.weatherSystem.clouds) {
          this.weatherSystem.createClouds();
        }
        this.weatherSystem.clouds.start();
        break;
    }
  }

  stopWeatherEffects() {
    if (this.weatherSystem.rain) {
      this.weatherSystem.rain.stop();
    }
    if (this.weatherSystem.clouds) {
      this.weatherSystem.clouds.stop();
    }
  }

  adjustQuality(qualityLevel) {
    switch (qualityLevel) {
      case 'low':
        this.renderPipeline.bloomEnabled = false;
        this.renderPipeline.fxaaEnabled = false;
        this.renderPipeline.samples = 1;
        break;
      case 'medium':
        this.renderPipeline.bloomEnabled = true;
        this.renderPipeline.bloomWeight = 0.2;
        this.renderPipeline.fxaaEnabled = true;
        this.renderPipeline.samples = 2;
        break;
      case 'high':
        this.renderPipeline.bloomEnabled = true;
        this.renderPipeline.bloomWeight = 0.3;
        this.renderPipeline.fxaaEnabled = true;
        this.renderPipeline.samples = 4;
        break;
    }
  }

  dispose() {
    if (this.renderPipeline) {
      this.renderPipeline.dispose();
    }
    
    this.postProcesses.forEach(postProcess => {
      postProcess.dispose();
    });
    
    this.shadowGenerators.forEach(generator => {
      generator.dispose();
    });
    
    this.stopWeatherEffects();
    
    if (this.weatherSystem.rain) {
      this.weatherSystem.rain.dispose();
    }
    if (this.weatherSystem.clouds) {
      this.weatherSystem.clouds.dispose();
    }
  }
}
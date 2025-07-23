import { 
  Engine, 
  Scene, 
  ArcRotateCamera, 
  Vector3, 
  HemisphericLight, 
  DirectionalLight,
  MeshBuilder,
  StandardMaterial,
  Color3,
  Texture,
  CubeTexture,
  Color4,
  Animation,
  DynamicTexture
} from '@babylonjs/core';
import { DiwaliScene } from './DiwaliScene.js';
import { HoliScene } from './HoliScene.js';
import { NavratriScene } from './NavratriScene.js';
import { GaneshChaturthiScene } from './GaneshChaturthi Scene.js';
import { DussehraScene } from './DussehraScene.js';
import { KumbhMelaScene } from './KumbhMelaScene.js';

export class SceneManager {
  constructor(canvas) {
    this.canvas = canvas;
    this.engine = null;
    this.scene = null;
    this.camera = null;
    this.currentFestival = null;
    this.currentFestivalScene = null;
    this.isTransitioning = false;
  }

  async initialize() {
    try {
      // Create Babylon.js engine
      this.engine = new Engine(this.canvas, true, {
        preserveDrawingBuffer: true,
        stencil: true,
        antialias: true,
        powerPreference: "high-performance"
      });

      // Create scene
      this.scene = new Scene(this.engine);
      this.scene.clearColor = new Color4(0.1, 0.1, 0.2, 1.0);

      // Setup camera
      this.setupCamera();
      
      // Setup lighting
      this.setupLighting();
      
      // Create environment
      this.createEnvironment();
      
      // Start render loop
      this.startRenderLoop();
      
      console.log('Scene initialized successfully');
      
    } catch (error) {
      console.error('Failed to initialize scene:', error);
    }
  }

  setupCamera() {
    // Create arc rotate camera
    this.camera = new ArcRotateCamera(
      "camera",
      -Math.PI / 2,
      Math.PI / 2.5,
      20,
      Vector3.Zero(),
      this.scene
    );

    // Set camera limits
    this.camera.lowerBetaLimit = Math.PI / 4;
    this.camera.upperBetaLimit = Math.PI / 2;
    this.camera.lowerRadiusLimit = 5;
    this.camera.upperRadiusLimit = 50;

    // Attach camera controls
    this.camera.attachControl(this.canvas, true);
    
    // Smooth camera movements
    this.camera.inertia = 0.8;
    this.camera.wheelDeltaPercentage = 0.01;
    this.camera.pinchDeltaPercentage = 0.01;
  }

  setupLighting() {
    // Ambient light
    const ambientLight = new HemisphericLight(
      "ambientLight",
      new Vector3(0, 1, 0),
      this.scene
    );
    ambientLight.intensity = 0.6;
    ambientLight.diffuse = new Color3(1, 0.95, 0.8);

    // Directional light (sun)
    const directionalLight = new DirectionalLight(
      "directionalLight",
      new Vector3(-1, -1, -1),
      this.scene
    );
    directionalLight.intensity = 0.8;
    directionalLight.diffuse = new Color3(1, 0.9, 0.7);
  }

  createEnvironment() {
    // Create ground
    const ground = MeshBuilder.CreateGround(
      "ground",
      { width: 50, height: 50 },
      this.scene
    );

    // Ground material
    const groundMaterial = new StandardMaterial("groundMaterial", this.scene);
    groundMaterial.diffuseColor = new Color3(0.3, 0.25, 0.2);
    groundMaterial.specularColor = new Color3(0.1, 0.1, 0.1);
    ground.material = groundMaterial;

    // Create skybox
    this.createSkybox();
    
    // Preload common textures and materials
    this.preloadAssets();
  }

  preloadAssets() {
    // Preload common textures for better performance
    const commonTextures = [
      'marble', 'wood', 'fabric', 'metal', 'stone'
    ];
    
    commonTextures.forEach(textureType => {
      this.createProceduralTexture(textureType);
    });
    
    console.log('Common assets preloaded for optimal performance');
  }

  createProceduralTexture(type) {
    // Create procedural textures for better visual quality
    const texture = new DynamicTexture(`${type}Texture`, { width: 256, height: 256 }, this.scene);
    const ctx = texture.getContext();
    
    switch (type) {
      case 'marble':
        this.generateMarbleTexture(ctx);
        break;
      case 'wood':
        this.generateWoodTexture(ctx);
        break;
      case 'fabric':
        this.generateFabricTexture(ctx);
        break;
      case 'metal':
        this.generateMetalTexture(ctx);
        break;
      case 'stone':
        this.generateStoneTexture(ctx);
        break;
    }
    
    texture.update();
    return texture;
  }

  generateMarbleTexture(ctx) {
    // Create marble-like texture
    const gradient = ctx.createLinearGradient(0, 0, 256, 256);
    gradient.addColorStop(0, '#f8f8f8');
    gradient.addColorStop(0.5, '#e8e8e8');
    gradient.addColorStop(1, '#d8d8d8');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 256, 256);
    
    // Add marble veins
    ctx.strokeStyle = 'rgba(200, 200, 200, 0.5)';
    ctx.lineWidth = 2;
    for (let i = 0; i < 10; i++) {
      ctx.beginPath();
      ctx.moveTo(Math.random() * 256, 0);
      ctx.quadraticCurveTo(Math.random() * 256, Math.random() * 256, Math.random() * 256, 256);
      ctx.stroke();
    }
  }

  generateWoodTexture(ctx) {
    // Create wood grain texture
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(0, 0, 256, 256);
    
    // Add wood grain lines
    ctx.strokeStyle = '#654321';
    ctx.lineWidth = 1;
    for (let i = 0; i < 256; i += 8) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(256, i + Math.sin(i * 0.1) * 4);
      ctx.stroke();
    }
  }

  generateFabricTexture(ctx) {
    // Create fabric weave texture
    ctx.fillStyle = '#F5F5DC';
    ctx.fillRect(0, 0, 256, 256);
    
    // Add weave pattern
    ctx.fillStyle = '#E6E6FA';
    for (let x = 0; x < 256; x += 4) {
      for (let y = 0; y < 256; y += 4) {
        if ((x + y) % 8 === 0) {
          ctx.fillRect(x, y, 2, 2);
        }
      }
    }
  }

  generateMetalTexture(ctx) {
    // Create metallic texture
    const gradient = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
    gradient.addColorStop(0, '#C0C0C0');
    gradient.addColorStop(0.5, '#A0A0A0');
    gradient.addColorStop(1, '#808080');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 256, 256);
  }

  generateStoneTexture(ctx) {
    // Create stone texture
    ctx.fillStyle = '#696969';
    ctx.fillRect(0, 0, 256, 256);
    
    // Add stone grain
    for (let i = 0; i < 100; i++) {
      ctx.fillStyle = `rgba(${100 + Math.random() * 50}, ${100 + Math.random() * 50}, ${100 + Math.random() * 50}, 0.3)`;
      ctx.fillRect(Math.random() * 256, Math.random() * 256, 2, 2);
    }
  }
  createSkybox() {
    const skybox = MeshBuilder.CreateSphere(
      "skybox",
      { diameter: 100 },
      this.scene
    );

    const skyboxMaterial = new StandardMaterial("skyboxMaterial", this.scene);
    skyboxMaterial.backFaceCulling = false;
    skyboxMaterial.diffuseColor = new Color3(0, 0, 0);
    skyboxMaterial.specularColor = new Color3(0, 0, 0);
    
    // Create gradient effect
    skyboxMaterial.emissiveColor = new Color3(0.2, 0.1, 0.3);
    
    skybox.material = skyboxMaterial;
    skybox.infiniteDistance = true;
  }

  async loadFestivalScene(festival) {
    this.currentFestival = festival;
    
    if (this.isTransitioning) return;
    this.isTransitioning = true;
    
    // Show loading indicator
    this.showLoadingIndicator();
    
    // Clear existing festival objects
    this.clearFestivalObjects();
    
    // Load festival-specific elements
    switch (festival) {
      case 'diwali':
        await this.loadDiwaliScene();
        break;
      case 'holi':
        await this.loadHoliScene();
        break;
      case 'navratri':
        await this.loadNavratriScene();
        break;
      case 'ganesh':
        await this.loadGaneshScene();
        break;
      case 'dussehra':
        await this.loadDussehraScene();
        break;
      case 'kumbh':
        await this.loadKumbhScene();
        break;
      default:
        this.createDefaultScene();
    }

    // Hide loading indicator
    this.hideLoadingIndicator();
    this.isTransitioning = false;
    
    console.log(`Loaded ${festival} scene`);
  }

  async loadDiwaliScene() {
    // Create detailed Diwali scene
    this.currentFestivalScene = new DiwaliScene(this.scene, this.camera);
    await this.currentFestivalScene.create();
    
    // Smooth camera transition to Diwali viewpoint
    this.animateCameraToPosition(
      new Vector3(0, 8, 15),  // position
      new Vector3(0, 2, 0),   // target
      2000 // duration in ms
    );
  }

  async loadHoliScene() {
    // Create detailed Holi scene
    this.currentFestivalScene = new HoliScene(this.scene, this.camera);
    await this.currentFestivalScene.create();
    
    // Smooth camera transition to Holi viewpoint
    this.animateCameraToPosition(
      new Vector3(0, 12, 20),  // position - higher and further for overview
      new Vector3(0, 3, 0),    // target - looking at courtyard
      2000 // duration in ms
    );
  }

  async loadNavratriScene() {
    // Create detailed Navratri scene
    this.currentFestivalScene = new NavratriScene(this.scene, this.camera);
    await this.currentFestivalScene.create();
    
    // Smooth camera transition to Navratri viewpoint
    this.animateCameraToPosition(
      new Vector3(0, 10, 18),  // position - elevated view of dance circle
      new Vector3(0, 2, 5),    // target - looking at garba circle
      2000 // duration in ms
    );
  }

  async loadGaneshScene() {
    // Create detailed Ganesh Chaturthi scene
    this.currentFestivalScene = new GaneshChaturthiScene(this.scene, this.camera);
    await this.currentFestivalScene.create();
    
    // Smooth camera transition to Ganesh viewpoint
    this.animateCameraToPosition(
      new Vector3(0, 8, 12),   // position - good view of idol
      new Vector3(0, 3, -8),   // target - looking at Ganesh idol
      2000 // duration in ms
    );
  }

  async loadDussehraScene() {
    // Create detailed Dussehra scene
    this.currentFestivalScene = new DussehraScene(this.scene, this.camera);
    await this.currentFestivalScene.create();
    
    // Smooth camera transition to Dussehra viewpoint
    this.animateCameraToPosition(
      new Vector3(0, 12, 8),   // position - elevated view of celebration
      new Vector3(0, 4, -15),  // target - looking at Ravana effigy
      2000 // duration in ms
    );
  }

  async loadKumbhScene() {
    // Create detailed Kumbh Mela scene
    this.currentFestivalScene = new KumbhMelaScene(this.scene, this.camera);
    await this.currentFestivalScene.create();
    
    // Smooth camera transition to Kumbh viewpoint
    this.animateCameraToPosition(
      new Vector3(0, 15, 25),  // position - high view of gathering
      new Vector3(0, 0, 0),    // target - looking at river confluence
      2000 // duration in ms
    );
  }

  createHoliScene() {
    // Create colorful particles/powders
    const colors = [
      new Color3(1, 0, 0.5), // Pink
      new Color3(0, 1, 0.5), // Green
      new Color3(0.5, 0, 1), // Purple
      new Color3(1, 1, 0),   // Yellow
      new Color3(1, 0.5, 0)  // Orange
    ];

    for (let i = 0; i < 20; i++) {
      const colorSphere = MeshBuilder.CreateSphere(
        `colorSphere${i}`,
        { diameter: 1 + Math.random() },
        this.scene
      );
      
      colorSphere.position = new Vector3(
        (Math.random() - 0.5) * 30,
        1 + Math.random() * 3,
        (Math.random() - 0.5) * 30
      );

      const material = new StandardMaterial(`colorMaterial${i}`, this.scene);
      material.diffuseColor = colors[Math.floor(Math.random() * colors.length)];
      material.emissiveColor = material.diffuseColor.scale(0.3);
      colorSphere.material = material;
    }
  }

  createNavratriScene() {
    // Create dancing stage
    const stage = MeshBuilder.CreateCylinder(
      "stage",
      { height: 0.5, diameter: 12 },
      this.scene
    );
    
    const stageMaterial = new StandardMaterial("stageMaterial", this.scene);
    stageMaterial.diffuseColor = new Color3(0.8, 0.6, 0.2);
    stage.material = stageMaterial;

    // Create decorative pillars
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const x = Math.cos(angle) * 8;
      const z = Math.sin(angle) * 8;
      
      const pillar = MeshBuilder.CreateCylinder(
        `pillar${i}`,
        { height: 6, diameter: 0.8 },
        this.scene
      );
      pillar.position = new Vector3(x, 3, z);
      
      const pillarMaterial = new StandardMaterial(`pillarMaterial${i}`, this.scene);
      pillarMaterial.diffuseColor = new Color3(0.7, 0.5, 0.8);
      pillar.material = pillarMaterial;
    }
  }

  createGaneshScene() {
    // Create temple structure
    const temple = MeshBuilder.CreateBox(
      "temple",
      { width: 8, height: 6, depth: 8 },
      this.scene
    );
    temple.position.y = 3;
    
    const templeMaterial = new StandardMaterial("templeMaterial", this.scene);
    templeMaterial.diffuseColor = new Color3(0.9, 0.8, 0.6);
    temple.material = templeMaterial;

    // Create dome
    const dome = MeshBuilder.CreateSphere(
      "dome",
      { diameter: 6 },
      this.scene
    );
    dome.position.y = 7;
    dome.scaling.y = 0.5;
    
    const domeMaterial = new StandardMaterial("domeMaterial", this.scene);
    domeMaterial.diffuseColor = new Color3(1, 0.8, 0.3);
    dome.material = domeMaterial;
  }

  createDussehraScene() {
    // Create Ravana effigy
    const effigy = MeshBuilder.CreateCylinder(
      "effigy",
      { height: 8, diameter: 2 },
      this.scene
    );
    effigy.position.y = 4;
    
    const effigyMaterial = new StandardMaterial("effigyMaterial", this.scene);
    effigyMaterial.diffuseColor = new Color3(0.6, 0.3, 0.1);
    effigy.material = effigyMaterial;

    // Create decorative elements around
    for (let i = 0; i < 10; i++) {
      const angle = (i / 10) * Math.PI * 2;
      const radius = 12;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      
      const decoration = MeshBuilder.CreateSphere(
        `decoration${i}`,
        { diameter: 1.5 },
        this.scene
      );
      decoration.position = new Vector3(x, 1, z);
      
      const decorationMaterial = new StandardMaterial(`decorationMaterial${i}`, this.scene);
      decorationMaterial.diffuseColor = new Color3(1, 0.5, 0);
      decorationMaterial.emissiveColor = new Color3(0.3, 0.15, 0);
      decoration.material = decorationMaterial;
    }
  }

  createKumbhScene() {
    // Create sacred river representation
    const river = MeshBuilder.CreateGround(
      "river",
      { width: 40, height: 10 },
      this.scene
    );
    river.position.z = -15;
    
    const riverMaterial = new StandardMaterial("riverMaterial", this.scene);
    riverMaterial.diffuseColor = new Color3(0.2, 0.5, 0.8);
    riverMaterial.specularColor = new Color3(0.5, 0.8, 1);
    river.material = riverMaterial;

    // Create ghats (steps)
    for (let i = 0; i < 5; i++) {
      const ghat = MeshBuilder.CreateBox(
        `ghat${i}`,
        { width: 30, height: 0.5, depth: 2 },
        this.scene
      );
      ghat.position = new Vector3(0, i * 0.5, -10 + i * 2);
      
      const ghatMaterial = new StandardMaterial(`ghatMaterial${i}`, this.scene);
      ghatMaterial.diffuseColor = new Color3(0.8, 0.7, 0.6);
      ghat.material = ghatMaterial;
    }
  }

  createDefaultScene() {
    // Default scene with basic elements
    const centerSphere = MeshBuilder.CreateSphere(
      "centerSphere",
      { diameter: 3 },
      this.scene
    );
    centerSphere.position.y = 1.5;
    
    const material = new StandardMaterial("centerMaterial", this.scene);
    material.diffuseColor = new Color3(1, 0.7, 0.3);
    material.emissiveColor = new Color3(0.3, 0.2, 0.1);
    centerSphere.material = material;
  }

  createDiya(position) {
    // Create diya base
    const diyaBase = MeshBuilder.CreateCylinder(
      "diyaBase",
      { height: 0.3, diameterTop: 1.2, diameterBottom: 0.8 },
      this.scene
    );
    diyaBase.position = position;
    
    const baseMaterial = new StandardMaterial("diyaBaseMaterial", this.scene);
    baseMaterial.diffuseColor = new Color3(0.8, 0.6, 0.3);
    diyaBase.material = baseMaterial;

    // Create flame
    const flame = MeshBuilder.CreateSphere(
      "flame",
      { diameter: 0.6 },
      this.scene
    );
    flame.position = position.clone();
    flame.position.y += 0.5;
    flame.scaling.y = 1.5;
    
    const flameMaterial = new StandardMaterial("flameMaterial", this.scene);
    flameMaterial.diffuseColor = new Color3(1, 0.8, 0.2);
    flameMaterial.emissiveColor = new Color3(1, 0.6, 0);
    flame.material = flameMaterial;
  }

  clearFestivalObjects() {
    // Remove all festival-specific meshes
    const meshesToRemove = this.scene.meshes.filter(mesh => 
      !['ground', 'skybox'].includes(mesh.name)
    );
    
    meshesToRemove.forEach(mesh => {
      mesh.dispose();
    });

    // Remove festival-specific lights
    const lightsToRemove = this.scene.lights.filter(light => 
      !['ambientLight', 'directionalLight'].includes(light.name)
    );
    
    lightsToRemove.forEach(light => {
      light.dispose();
    });
    
    // Dispose current festival scene
    if (this.currentFestivalScene && this.currentFestivalScene.dispose) {
      this.currentFestivalScene.dispose();
      this.currentFestivalScene = null;
    }
  }
  
  animateCameraToPosition(position, target, duration = 2000) {
    // Animate camera position
    const positionAnimation = Animation.CreateAndStartAnimation(
      "cameraPositionAnimation",
      this.camera,
      "position",
      60,
      (duration / 1000) * 60,
      this.camera.position.clone(),
      position,
      Animation.ANIMATIONLOOPMODE_CONSTANT
    );
    
    // Animate camera target
    const targetAnimation = Animation.CreateAndStartAnimation(
      "cameraTargetAnimation",
      this.camera,
      "target",
      60,
      (duration / 1000) * 60,
      this.camera.target.clone(),
      target,
      Animation.ANIMATIONLOOPMODE_CONSTANT
    );
  }
  
  showLoadingIndicator() {
    // Create loading overlay
    const loadingOverlay = document.createElement('div');
    loadingOverlay.id = 'scene-loading';
    loadingOverlay.innerHTML = `
      <div class="loading-content">
        <div class="loading-spinner"></div>
        <p>Loading ${this.currentFestival} experience...</p>
      </div>
    `;
    
    Object.assign(loadingOverlay.style, {
      position: 'fixed',
      top: '0',
      left: '0',
      width: '100%',
      height: '100%',
      background: 'rgba(0, 0, 0, 0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: '1000',
      color: 'white',
      fontFamily: 'Inter, sans-serif'
    });
    
    document.body.appendChild(loadingOverlay);
  }
  
  hideLoadingIndicator() {
    const loadingOverlay = document.getElementById('scene-loading');
    if (loadingOverlay) {
      loadingOverlay.style.opacity = '0';
      setTimeout(() => {
        if (loadingOverlay.parentNode) {
          loadingOverlay.parentNode.removeChild(loadingOverlay);
        }
      }, 300);
    }
  }

  startRenderLoop() {
    this.engine.runRenderLoop(() => {
      if (this.scene) {
        this.scene.render();
      }
    });
  }

  resize() {
    if (this.engine) {
      this.engine.resize();
    }
  }

  dispose() {
    if (this.scene) {
      this.scene.dispose();
    }
    if (this.engine) {
      this.engine.dispose();
    }
  }
}
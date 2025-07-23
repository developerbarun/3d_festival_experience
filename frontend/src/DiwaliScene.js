import { 
  Vector3, 
  MeshBuilder, 
  StandardMaterial, 
  Color3, 
  PointLight,
  ParticleSystem,
  Texture,
  Animation,
  Sound,
  ActionManager,
  ExecuteCodeAction,
  Color4,
  DynamicTexture,
  HemisphericLight
} from '@babylonjs/core';

export class DiwaliScene {
  constructor(scene, camera) {
    this.scene = scene;
    this.camera = camera;
    this.diyas = [];
    this.houses = [];
    this.stringLights = [];
    this.fireworksSystem = null;
    this.ambientSound = null;
    this.isLoaded = false;
  }

  async create() {
    try {
      // Set Diwali atmosphere
      this.setupAtmosphere();
      
      // Create traditional houses
      this.createHouses();
      
      // Create rangoli patterns
      this.createRangoli();
      
      // Create diyas (oil lamps)
      this.createDiyas();
      
      // Create string lights
      this.createStringLights();
      
      // Create fireworks
      this.createFireworks();
      
      // Setup ambient audio
      this.setupAudio();
      
      // Setup interactions
      this.setupInteractions();
      
      this.isLoaded = true;
      console.log('Diwali scene created successfully');
      
    } catch (error) {
      console.error('Error creating Diwali scene:', error);
    }
  }

  setupAtmosphere() {
    // Warm evening atmosphere
    this.scene.clearColor = new Color4(0.05, 0.05, 0.15, 1.0);
    
    // Warm ambient light
    const ambientLight = new HemisphericLight(
      "diwaliAmbient",
      new Vector3(0, 1, 0),
      this.scene
    );
    ambientLight.intensity = 0.3;
    ambientLight.diffuse = new Color3(1, 0.8, 0.5);
    ambientLight.specular = new Color3(0.5, 0.4, 0.2);
  }

  createHouses() {
    const housePositions = [
      new Vector3(-15, 0, -10),
      new Vector3(15, 0, -10),
      new Vector3(-20, 0, 5),
      new Vector3(20, 0, 5)
    ];

    housePositions.forEach((position, index) => {
      const house = this.createTraditionalHouse(position, index);
      this.houses.push(house);
    });
  }

  createTraditionalHouse(position, index) {
    const houseGroup = [];

    // Main structure
    const mainStructure = MeshBuilder.CreateBox(
      `house_main_${index}`,
      { width: 8, height: 6, depth: 6 },
      this.scene
    );
    mainStructure.position = position.clone();
    mainStructure.position.y = 3;

    const houseMaterial = new StandardMaterial(`houseMaterial_${index}`, this.scene);
    houseMaterial.diffuseColor = new Color3(0.9, 0.8, 0.6);
    houseMaterial.specularColor = new Color3(0.2, 0.2, 0.2);
    mainStructure.material = houseMaterial;

    // Roof
    const roof = MeshBuilder.CreateCylinder(
      `house_roof_${index}`,
      { height: 2, diameterTop: 0, diameterBottom: 12 },
      this.scene
    );
    roof.position = position.clone();
    roof.position.y = 7;
    roof.rotation.x = Math.PI;

    const roofMaterial = new StandardMaterial(`roofMaterial_${index}`, this.scene);
    roofMaterial.diffuseColor = new Color3(0.8, 0.3, 0.2);
    roof.material = roofMaterial;

    // Windows with warm light
    const windowPositions = [
      new Vector3(-2, 1, 0),
      new Vector3(2, 1, 0)
    ];

    windowPositions.forEach((windowPos, winIndex) => {
      const window = MeshBuilder.CreateBox(
        `window_${index}_${winIndex}`,
        { width: 1.5, height: 1.5, depth: 0.1 },
        this.scene
      );
      window.position = position.clone().add(windowPos);
      window.position.z += 3.1;

      const windowMaterial = new StandardMaterial(`windowMaterial_${index}_${winIndex}`, this.scene);
      windowMaterial.emissiveColor = new Color3(1, 0.8, 0.4);
      windowMaterial.diffuseColor = new Color3(1, 0.9, 0.6);
      window.material = windowMaterial;

      // Window light
      const windowLight = new PointLight(
        `windowLight_${index}_${winIndex}`,
        window.position.clone(),
        this.scene
      );
      windowLight.diffuse = new Color3(1, 0.8, 0.4);
      windowLight.intensity = 0.5;
      windowLight.range = 8;

      houseGroup.push(window);
    });

    houseGroup.push(mainStructure, roof);
    return houseGroup;
  }

  createRangoli() {
    const rangoli = MeshBuilder.CreateGround(
      "rangoli",
      { width: 12, height: 12 },
      this.scene
    );
    rangoli.position = new Vector3(0, 0.01, 8);

    // Create rangoli texture
    const rangoliTexture = new DynamicTexture(
      "rangoliTexture",
      { width: 512, height: 512 },
      this.scene
    );

    const ctx = rangoliTexture.getContext();
    
    // Background
    ctx.fillStyle = '#2a1810';
    ctx.fillRect(0, 0, 512, 512);

    // Draw rangoli pattern
    const centerX = 256;
    const centerY = 256;
    
    // Outer circle
    ctx.strokeStyle = '#ff6b35';
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.arc(centerX, centerY, 200, 0, 2 * Math.PI);
    ctx.stroke();

    // Inner patterns
    const colors = ['#ffd700', '#ff9800', '#e91e63', '#9c27b0', '#00bcd4'];
    
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const x1 = centerX + Math.cos(angle) * 100;
      const y1 = centerY + Math.sin(angle) * 100;
      const x2 = centerX + Math.cos(angle) * 180;
      const y2 = centerY + Math.sin(angle) * 180;

      ctx.strokeStyle = colors[i % colors.length];
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();

      // Petals
      ctx.fillStyle = colors[i % colors.length];
      ctx.beginPath();
      ctx.arc(x2, y2, 15, 0, 2 * Math.PI);
      ctx.fill();
    }

    // Center flower
    ctx.fillStyle = '#ffd700';
    ctx.beginPath();
    ctx.arc(centerX, centerY, 30, 0, 2 * Math.PI);
    ctx.fill();

    rangoliTexture.update();

    const rangoliMaterial = new StandardMaterial("rangoliMaterial", this.scene);
    rangoliMaterial.diffuseTexture = rangoliTexture;
    rangoliMaterial.emissiveColor = new Color3(0.3, 0.2, 0.1);
    rangoli.material = rangoliMaterial;
  }

  createDiyas() {
    const diyaPositions = [
      // Around rangoli
      new Vector3(-6, 0, 8), new Vector3(6, 0, 8),
      new Vector3(0, 0, 2), new Vector3(0, 0, 14),
      new Vector3(-4, 0, 4), new Vector3(4, 0, 4),
      new Vector3(-4, 0, 12), new Vector3(4, 0, 12),
      
      // Along pathways
      new Vector3(-10, 0, -5), new Vector3(-5, 0, -5),
      new Vector3(5, 0, -5), new Vector3(10, 0, -5),
      new Vector3(-12, 0, 0), new Vector3(12, 0, 0),
      
      // Near houses
      new Vector3(-18, 0, -8), new Vector3(18, 0, -8),
      new Vector3(-22, 0, 3), new Vector3(22, 0, 3)
    ];

    diyaPositions.forEach((position, index) => {
      const diya = this.createDiya(position, index);
      this.diyas.push(diya);
    });
  }

  createDiya(position, index) {
    const diyaGroup = {
      base: null,
      flame: null,
      light: null,
      isLit: false,
      position: position
    };

    // Diya base
    const base = MeshBuilder.CreateCylinder(
      `diya_base_${index}`,
      { height: 0.3, diameterTop: 1.2, diameterBottom: 0.8 },
      this.scene
    );
    base.position = position.clone();
    base.position.y = 0.15;

    const baseMaterial = new StandardMaterial(`diyaBaseMaterial_${index}`, this.scene);
    baseMaterial.diffuseColor = new Color3(0.8, 0.5, 0.2);
    baseMaterial.specularColor = new Color3(0.3, 0.2, 0.1);
    base.material = baseMaterial;

    // Flame (initially hidden)
    const flame = MeshBuilder.CreateSphere(
      `diya_flame_${index}`,
      { diameter: 0.4 },
      this.scene
    );
    flame.position = position.clone();
    flame.position.y = 0.5;
    flame.scaling.y = 1.5;
    flame.isVisible = false;

    const flameMaterial = new StandardMaterial(`flameMaterial_${index}`, this.scene);
    flameMaterial.diffuseColor = new Color3(1, 0.8, 0.2);
    flameMaterial.emissiveColor = new Color3(1, 0.6, 0);
    flame.material = flameMaterial;

    // Point light (initially disabled)
    const light = new PointLight(
      `diyaLight_${index}`,
      position.clone().add(new Vector3(0, 0.5, 0)),
      this.scene
    );
    light.diffuse = new Color3(1, 0.7, 0.3);
    light.intensity = 0;
    light.range = 6;

    diyaGroup.base = base;
    diyaGroup.flame = flame;
    diyaGroup.light = light;

    return diyaGroup;
  }

  createStringLights() {
    this.houses.forEach((house, houseIndex) => {
      const mainStructure = house[0];
      const housePos = mainStructure.position;

      // Create string lights around the house
      for (let i = 0; i < 20; i++) {
        const angle = (i / 20) * Math.PI * 2;
        const radius = 5;
        const x = housePos.x + Math.cos(angle) * radius;
        const z = housePos.z + Math.sin(angle) * radius;
        const y = housePos.y + 2 + Math.sin(angle * 3) * 0.5;

        const light = MeshBuilder.CreateSphere(
          `stringLight_${houseIndex}_${i}`,
          { diameter: 0.3 },
          this.scene
        );
        light.position = new Vector3(x, y, z);

        const colors = [
          new Color3(1, 0.2, 0.2),    // Red
          new Color3(0.2, 1, 0.2),    // Green
          new Color3(0.2, 0.2, 1),    // Blue
          new Color3(1, 1, 0.2),      // Yellow
          new Color3(1, 0.2, 1)       // Magenta
        ];

        const lightMaterial = new StandardMaterial(`stringLightMaterial_${houseIndex}_${i}`, this.scene);
        const color = colors[i % colors.length];
        lightMaterial.diffuseColor = color;
        lightMaterial.emissiveColor = color.scale(0.8);
        light.material = lightMaterial;

        // Twinkling animation
        const twinkleAnimation = Animation.CreateAndStartAnimation(
          `twinkle_${houseIndex}_${i}`,
          light,
          "material.emissiveColor",
          30,
          120,
          color.scale(0.8),
          color.scale(0.3),
          Animation.ANIMATIONLOOPMODE_CYCLE
        );

        this.stringLights.push(light);
      }
    });
  }

  createFireworks() {
    // Create fireworks particle system
    this.fireworksSystem = new ParticleSystem("fireworks", 2000, this.scene);
    
    // Emitter
    const fountainProfile = [
      new Vector3(0, 0, 0),
      new Vector3(0, 20, 0)
    ];
    
    this.fireworksSystem.emitter = new Vector3(0, 0, -20);
    this.fireworksSystem.minEmitBox = new Vector3(-5, 15, 0);
    this.fireworksSystem.maxEmitBox = new Vector3(5, 20, 0);

    // Colors
    this.fireworksSystem.color1 = new Color4(1, 0.8, 0.2, 1.0);
    this.fireworksSystem.color2 = new Color4(1, 0.4, 0.1, 1.0);
    this.fireworksSystem.colorDead = new Color4(0.5, 0.2, 0.1, 0.0);

    // Size
    this.fireworksSystem.minSize = 0.3;
    this.fireworksSystem.maxSize = 1.0;

    // Life time
    this.fireworksSystem.minLifeTime = 0.5;
    this.fireworksSystem.maxLifeTime = 2.0;

    // Emission rate
    this.fireworksSystem.emitRate = 100;

    // Direction
    this.fireworksSystem.direction1 = new Vector3(-2, 8, -2);
    this.fireworksSystem.direction2 = new Vector3(2, 12, 2);

    // Angular speed
    this.fireworksSystem.minAngularSpeed = 0;
    this.fireworksSystem.maxAngularSpeed = Math.PI;

    // Speed
    this.fireworksSystem.minInitialRotation = 0;
    this.fireworksSystem.maxInitialRotation = Math.PI;

    // Start the system
    this.fireworksSystem.start();
  }

  setupAudio() {
    // Note: In a real implementation, you would load actual audio files
    // For now, we'll create a placeholder for ambient sounds
    console.log('Diwali ambient audio would be loaded here');
  }

  setupInteractions() {
    // Setup action manager for the scene
    this.scene.actionManager = new ActionManager(this.scene);

    // Make diyas interactive
    this.diyas.forEach((diya, index) => {
      diya.base.actionManager = new ActionManager(this.scene);
      
      // Click to light up
      diya.base.actionManager.registerAction(
        new ExecuteCodeAction(ActionManager.OnPickTrigger, () => {
          this.lightDiya(index);
        })
      );

      // Hover effect
      diya.base.actionManager.registerAction(
        new ExecuteCodeAction(ActionManager.OnPointerOverTrigger, () => {
          diya.base.scaling = new Vector3(1.2, 1.2, 1.2);
        })
      );

      diya.base.actionManager.registerAction(
        new ExecuteCodeAction(ActionManager.OnPointerOutTrigger, () => {
          diya.base.scaling = new Vector3(1, 1, 1);
        })
      );
    });
  }

  lightDiya(index) {
    const diya = this.diyas[index];
    
    if (!diya.isLit) {
      // Show flame
      diya.flame.isVisible = true;
      
      // Enable light
      diya.light.intensity = 1.0;
      
      // Flame animation
      const flameAnimation = Animation.CreateAndStartAnimation(
        `flameFlicker_${index}`,
        diya.flame,
        "scaling.y",
        30,
        60,
        1.5,
        1.8,
        Animation.ANIMATIONLOOPMODE_CYCLE
      );

      // Light intensity animation
      const lightAnimation = Animation.CreateAndStartAnimation(
        `lightFlicker_${index}`,
        diya.light,
        "intensity",
        30,
        60,
        1.0,
        0.7,
        Animation.ANIMATIONLOOPMODE_CYCLE
      );

      diya.isLit = true;
      
      // Count lit diyas and notify AI Guide
      const litCount = this.diyas.filter(d => d.isLit).length;
      
      // Notify AI Guide if available
      if (window.app && window.app.aiGuide) {
        window.app.aiGuide.notifyDiyaLit(litCount);
      }
      
      // Show info panel
      this.showInfoPanel('diya');
    }
  }

  showInfoPanel(objectType) {
    // This would show cultural information about the clicked object
    const infoTexts = {
      diya: "Diyas are oil lamps that symbolize the victory of light over darkness and good over evil. They are lit during Diwali to welcome prosperity and happiness.",
      rangoli: "Rangoli are decorative art patterns created on floors using colored powders, flowers, and rice. They are believed to bring good luck and welcome guests.",
      house: "Traditional Indian homes are decorated with lights and diyas during Diwali, creating a warm and festive atmosphere."
    };

    // In a real implementation, this would create a UI panel
    console.log(`Info: ${infoTexts[objectType]}`);
  }

  lightAllDiyas() {
    this.diyas.forEach((diya, index) => {
      if (!diya.isLit) {
        setTimeout(() => {
          this.lightDiya(index);
        }, index * 200); // Stagger the lighting
      }
    });
  }

  dispose() {
    // Clean up all Diwali scene objects
    this.diyas.forEach(diya => {
      diya.base.dispose();
      diya.flame.dispose();
      diya.light.dispose();
    });

    this.houses.forEach(house => {
      house.forEach(mesh => mesh.dispose());
    });

    this.stringLights.forEach(light => light.dispose());

    if (this.fireworksSystem) {
      this.fireworksSystem.dispose();
    }

    if (this.ambientSound) {
      this.ambientSound.dispose();
    }

    // Remove Diwali-specific lights
    const diwaliLights = this.scene.lights.filter(light => 
      light.name.includes('diwali') || 
      light.name.includes('diya') || 
      light.name.includes('window')
    );
    
    diwaliLights.forEach(light => light.dispose());

    console.log('Diwali scene disposed');
  }
}
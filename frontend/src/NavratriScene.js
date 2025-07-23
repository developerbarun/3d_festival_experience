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
  HemisphericLight,
  DirectionalLight,
  CylinderBuilder
} from '@babylonjs/core';

export class NavratriScene {
  constructor(scene, camera) {
    this.scene = scene;
    this.camera = camera;
    this.dancers = [];
    this.pandal = null;
    this.durgaIdol = null;
    this.garbaCircle = [];
    this.decorations = [];
    this.musicSystem = null;
    this.danceSteps = [];
    this.isLoaded = false;
    this.currentDanceStep = 0;
    this.danceInProgress = false;
    
    // Navratri colors for nine nights
    this.navratriColors = [
      new Color3(1, 1, 0),      // Day 1: Yellow
      new Color3(0, 1, 0),      // Day 2: Green
      new Color3(0.5, 0.5, 0.5), // Day 3: Grey
      new Color3(1, 0.5, 0),    // Day 4: Orange
      new Color3(1, 1, 1),      // Day 5: White
      new Color3(1, 0, 0),      // Day 6: Red
      new Color3(0, 0, 1),      // Day 7: Royal Blue
      new Color3(1, 0, 1),      // Day 8: Pink
      new Color3(0.5, 1, 0.5)   // Day 9: Light Green
    ];
  }

  async create() {
    try {
      // Set Navratri atmosphere
      this.setupAtmosphere();
      
      // Create pandal (temporary structure)
      this.createPandal();
      
      // Create Durga idol
      this.createDurgaIdol();
      
      // Create Garba dance circle
      this.createGarbaCircle();
      
      // Create dancers
      this.createDancers();
      
      // Create decorations
      this.createDecorations();
      
      // Create costume displays
      this.createCostumeDisplays();
      
      // Setup dance learning system
      this.setupDanceLearningSystem();
      
      // Setup interactions
      this.setupInteractions();
      
      this.isLoaded = true;
      console.log('Navratri scene created successfully');
      
    } catch (error) {
      console.error('Error creating Navratri scene:', error);
    }
  }

  setupAtmosphere() {
    // Festive evening atmosphere
    this.scene.clearColor = new Color4(0.1, 0.05, 0.2, 1.0);
    
    // Warm festival lighting
    const festivalLight = new DirectionalLight(
      "navratriFestivalLight",
      new Vector3(-0.3, -1, -0.5),
      this.scene
    );
    festivalLight.intensity = 1.0;
    festivalLight.diffuse = new Color3(1, 0.9, 0.7);
    
    // Ambient light
    const ambientLight = new HemisphericLight(
      "navratriAmbient",
      new Vector3(0, 1, 0),
      this.scene
    );
    ambientLight.intensity = 0.4;
    ambientLight.diffuse = new Color3(0.8, 0.7, 0.9);
  }

  createPandal() {
    // Main pandal structure
    const pandal = MeshBuilder.CreateBox(
      "pandal",
      { width: 20, height: 12, depth: 15 },
      this.scene
    );
    pandal.position = new Vector3(0, 6, -10);

    const pandalMaterial = new StandardMaterial("pandalMaterial", this.scene);
    pandalMaterial.diffuseColor = new Color3(0.9, 0.8, 0.6);
    pandalMaterial.emissiveColor = new Color3(0.1, 0.08, 0.05);
    pandal.material = pandalMaterial;

    // Decorative pillars
    for (let i = 0; i < 4; i++) {
      const pillar = MeshBuilder.CreateCylinder(
        `pandalPillar_${i}`,
        { height: 12, diameter: 1 },
        this.scene
      );
      
      const x = i < 2 ? -9 : 9;
      const z = i % 2 === 0 ? -17 : -3;
      pillar.position = new Vector3(x, 6, z);
      
      const pillarMaterial = new StandardMaterial(`pillarMaterial_${i}`, this.scene);
      pillarMaterial.diffuseColor = new Color3(0.8, 0.6, 0.3);
      pillar.material = pillarMaterial;
    }

    // Colorful drapes
    this.createPandalDrapes();
    
    this.pandal = pandal;
  }

  createPandalDrapes() {
    const drapePositions = [
      { pos: new Vector3(-10, 8, -10), rot: 0 },
      { pos: new Vector3(10, 8, -10), rot: 0 },
      { pos: new Vector3(0, 8, -18), rot: Math.PI / 2 }
    ];

    drapePositions.forEach((drape, index) => {
      const fabric = MeshBuilder.CreateBox(
        `drape_${index}`,
        { width: 8, height: 6, depth: 0.1 },
        this.scene
      );
      fabric.position = drape.pos;
      fabric.rotation.y = drape.rot;

      const drapeMaterial = new StandardMaterial(`drapeMaterial_${index}`, this.scene);
      const color = this.navratriColors[index % this.navratriColors.length];
      drapeMaterial.diffuseColor = color;
      drapeMaterial.emissiveColor = color.scale(0.2);
      fabric.material = drapeMaterial;
    });
  }

  createDurgaIdol() {
    // Main idol base
    const idolBase = MeshBuilder.CreateCylinder(
      "durgaIdolBase",
      { height: 1, diameter: 3 },
      this.scene
    );
    idolBase.position = new Vector3(0, 0.5, -15);

    const baseMaterial = new StandardMaterial("idolBaseMaterial", this.scene);
    baseMaterial.diffuseColor = new Color3(0.9, 0.8, 0.6);
    idolBase.material = baseMaterial;

    // Durga figure (simplified representation)
    const durgaFigure = MeshBuilder.CreateBox(
      "durgaFigure",
      { width: 2, height: 4, depth: 1 },
      this.scene
    );
    durgaFigure.position = new Vector3(0, 3, -15);

    const figureMaterial = new StandardMaterial("durgaFigureMaterial", this.scene);
    figureMaterial.diffuseColor = new Color3(1, 0.8, 0.6);
    figureMaterial.emissiveColor = new Color3(0.2, 0.15, 0.1);
    durgaFigure.material = figureMaterial;

    // Crown
    const crown = MeshBuilder.CreateCylinder(
      "durgaCrown",
      { height: 0.5, diameterTop: 1.5, diameterBottom: 1.2 },
      this.scene
    );
    crown.position = new Vector3(0, 5.2, -15);

    const crownMaterial = new StandardMaterial("crownMaterial", this.scene);
    crownMaterial.diffuseColor = new Color3(1, 0.8, 0.2);
    crownMaterial.emissiveColor = new Color3(0.3, 0.2, 0.05);
    crown.material = crownMaterial;

    // Decorative lights around idol
    this.createIdolLights();
    
    this.durgaIdol = { base: idolBase, figure: durgaFigure, crown: crown };
  }

  createIdolLights() {
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2;
      const radius = 4;
      const x = Math.cos(angle) * radius;
      const z = -15 + Math.sin(angle) * radius;
      
      const light = MeshBuilder.CreateSphere(
        `idolLight_${i}`,
        { diameter: 0.2 },
        this.scene
      );
      light.position = new Vector3(x, 2, z);

      const lightMaterial = new StandardMaterial(`idolLightMaterial_${i}`, this.scene);
      const color = this.navratriColors[i % this.navratriColors.length];
      lightMaterial.diffuseColor = color;
      lightMaterial.emissiveColor = color.scale(0.8);
      light.material = lightMaterial;

      // Twinkling animation
      const twinkleAnimation = Animation.CreateAndStartAnimation(
        `idolLightTwinkle_${i}`,
        light,
        "material.emissiveColor",
        30,
        90,
        color.scale(0.8),
        color.scale(0.3),
        Animation.ANIMATIONLOOPMODE_CYCLE
      );
    }
  }

  createGarbaCircle() {
    // Create circular dance floor
    const danceFloor = MeshBuilder.CreateCylinder(
      "garbaCircle",
      { height: 0.1, diameter: 24 },
      this.scene
    );
    danceFloor.position = new Vector3(0, 0.05, 5);

    const floorMaterial = new StandardMaterial("danceFloorMaterial", this.scene);
    floorMaterial.diffuseColor = new Color3(0.8, 0.7, 0.5);
    floorMaterial.specularColor = new Color3(0.2, 0.2, 0.2);
    danceFloor.material = floorMaterial;

    // Create rangoli pattern on dance floor
    this.createGarbaRangoli();
    
    this.garbaCircle.push(danceFloor);
  }

  createGarbaRangoli() {
    const rangoli = MeshBuilder.CreateCylinder(
      "garbaRangoli",
      { height: 0.02, diameter: 20 },
      this.scene
    );
    rangoli.position = new Vector3(0, 0.11, 5);

    // Create rangoli texture
    const rangoliTexture = new DynamicTexture(
      "garbaRangoliTexture",
      { width: 512, height: 512 },
      this.scene
    );

    const ctx = rangoliTexture.getContext();
    
    // Background
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(0, 0, 512, 512);

    // Draw concentric circles with Navratri colors
    const centerX = 256;
    const centerY = 256;
    
    this.navratriColors.forEach((color, index) => {
      const radius = 200 - (index * 20);
      ctx.strokeStyle = `rgb(${Math.floor(color.r * 255)}, ${Math.floor(color.g * 255)}, ${Math.floor(color.b * 255)})`;
      ctx.lineWidth = 8;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
      ctx.stroke();
    });

    // Add decorative patterns
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const x1 = centerX + Math.cos(angle) * 80;
      const y1 = centerY + Math.sin(angle) * 80;
      const x2 = centerX + Math.cos(angle) * 160;
      const y2 = centerY + Math.sin(angle) * 160;

      ctx.strokeStyle = '#FFD700';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }

    rangoliTexture.update();

    const rangoliMaterial = new StandardMaterial("garbaRangoliMaterial", this.scene);
    rangoliMaterial.diffuseTexture = rangoliTexture;
    rangoliMaterial.emissiveColor = new Color3(0.2, 0.15, 0.1);
    rangoli.material = rangoliMaterial;
  }

  createDancers() {
    const dancerPositions = [
      { pos: new Vector3(-8, 0, 5), gender: 'female' },
      { pos: new Vector3(-4, 0, 9), gender: 'male' },
      { pos: new Vector3(4, 0, 9), gender: 'female' },
      { pos: new Vector3(8, 0, 5), gender: 'male' },
      { pos: new Vector3(8, 0, 1), gender: 'female' },
      { pos: new Vector3(4, 0, -3), gender: 'male' },
      { pos: new Vector3(-4, 0, -3), gender: 'female' },
      { pos: new Vector3(-8, 0, 1), gender: 'male' }
    ];

    dancerPositions.forEach((dancerData, index) => {
      const dancer = this.createDancer(dancerData.pos, dancerData.gender, index);
      this.dancers.push(dancer);
    });
  }

  createDancer(position, gender, index) {
    const dancerGroup = {
      body: null,
      head: null,
      costume: null,
      position: position,
      gender: gender,
      isAnimating: false
    };

    // Body
    const body = MeshBuilder.CreateCylinder(
      `dancer_body_${index}`,
      { height: 1.6, diameter: 0.8 },
      this.scene
    );
    body.position = position.clone();
    body.position.y = 0.8;

    // Costume colors based on gender and Navratri colors
    const costumeColor = gender === 'female' ? 
      this.navratriColors[index % this.navratriColors.length] :
      new Color3(0.9, 0.9, 0.9);

    const bodyMaterial = new StandardMaterial(`dancerBodyMaterial_${index}`, this.scene);
    bodyMaterial.diffuseColor = costumeColor;
    bodyMaterial.emissiveColor = costumeColor.scale(0.1);
    body.material = bodyMaterial;

    // Head
    const head = MeshBuilder.CreateSphere(
      `dancer_head_${index}`,
      { diameter: 0.5 },
      this.scene
    );
    head.position = position.clone();
    head.position.y = 1.8;

    const headMaterial = new StandardMaterial(`dancerHeadMaterial_${index}`, this.scene);
    headMaterial.diffuseColor = new Color3(0.8, 0.6, 0.4);
    head.material = headMaterial;

    // Add dandiya sticks for some dancers
    if (index % 2 === 0) {
      this.addDandiyaSticks(position, index);
    }

    // Add dancing animation
    this.addDancingAnimation(body, head, index);

    dancerGroup.body = body;
    dancerGroup.head = head;

    return dancerGroup;
  }

  addDandiyaSticks(position, index) {
    // Left stick
    const leftStick = MeshBuilder.CreateCylinder(
      `leftStick_${index}`,
      { height: 1.2, diameter: 0.05 },
      this.scene
    );
    leftStick.position = position.clone();
    leftStick.position.x -= 0.3;
    leftStick.position.y = 1.2;
    leftStick.rotation.z = Math.PI / 6;

    // Right stick
    const rightStick = MeshBuilder.CreateCylinder(
      `rightStick_${index}`,
      { height: 1.2, diameter: 0.05 },
      this.scene
    );
    rightStick.position = position.clone();
    rightStick.position.x += 0.3;
    rightStick.position.y = 1.2;
    rightStick.rotation.z = -Math.PI / 6;

    const stickMaterial = new StandardMaterial(`stickMaterial_${index}`, this.scene);
    stickMaterial.diffuseColor = new Color3(0.6, 0.3, 0.1);
    leftStick.material = stickMaterial;
    rightStick.material = stickMaterial;
  }

  addDancingAnimation(body, head, index) {
    // Circular movement around the center
    const radius = 8;
    const centerX = 0;
    const centerZ = 5;
    
    // Create circular path animation
    const pathAnimation = Animation.CreateAndStartAnimation(
      `dancerPath_${index}`,
      body,
      "position",
      30,
      300,
      body.position.clone(),
      new Vector3(
        centerX + Math.cos((index / 8) * Math.PI * 2 + Math.PI) * radius,
        body.position.y,
        centerZ + Math.sin((index / 8) * Math.PI * 2 + Math.PI) * radius
      ),
      Animation.ANIMATIONLOOPMODE_CYCLE
    );

    // Sync head movement
    const headPathAnimation = Animation.CreateAndStartAnimation(
      `dancerHeadPath_${index}`,
      head,
      "position",
      30,
      300,
      head.position.clone(),
      new Vector3(
        centerX + Math.cos((index / 8) * Math.PI * 2 + Math.PI) * radius,
        head.position.y,
        centerZ + Math.sin((index / 8) * Math.PI * 2 + Math.PI) * radius
      ),
      Animation.ANIMATIONLOOPMODE_CYCLE
    );

    // Add vertical bobbing
    const bobAnimation = Animation.CreateAndStartAnimation(
      `dancerBob_${index}`,
      body,
      "position.y",
      60,
      60,
      body.position.y,
      body.position.y + 0.3,
      Animation.ANIMATIONLOOPMODE_CYCLE
    );
  }

  createDecorations() {
    // Hanging torans (decorative garlands)
    this.createTorans();
    
    // Festival banners
    this.createBanners();
    
    // Decorative lamps
    this.createDecorativeLamps();
  }

  createTorans() {
    const toranPositions = [
      new Vector3(-15, 8, 0),
      new Vector3(15, 8, 0),
      new Vector3(0, 8, 15)
    ];

    toranPositions.forEach((position, index) => {
      for (let i = 0; i < 10; i++) {
        const flower = MeshBuilder.CreateSphere(
          `toran_flower_${index}_${i}`,
          { diameter: 0.3 },
          this.scene
        );
        flower.position = position.clone();
        flower.position.x += (i - 5) * 0.5;
        flower.position.y -= Math.sin(i * 0.5) * 0.5;

        const flowerMaterial = new StandardMaterial(`toranFlowerMaterial_${index}_${i}`, this.scene);
        const color = this.navratriColors[i % this.navratriColors.length];
        flowerMaterial.diffuseColor = color;
        flowerMaterial.emissiveColor = color.scale(0.2);
        flower.material = flowerMaterial;
      }
    });
  }

  createBanners() {
    const bannerTexts = ['नवरात्रि', 'Navratri', 'गरबा'];
    
    bannerTexts.forEach((text, index) => {
      const banner = MeshBuilder.CreateBox(
        `banner_${index}`,
        { width: 6, height: 2, depth: 0.1 },
        this.scene
      );
      banner.position = new Vector3((index - 1) * 8, 10, -5);

      const bannerMaterial = new StandardMaterial(`bannerMaterial_${index}`, this.scene);
      bannerMaterial.diffuseColor = this.navratriColors[index * 3 % this.navratriColors.length];
      bannerMaterial.emissiveColor = bannerMaterial.diffuseColor.scale(0.3);
      banner.material = bannerMaterial;
    });
  }

  createDecorativeLamps() {
    for (let i = 0; i < 20; i++) {
      const angle = (i / 20) * Math.PI * 2;
      const radius = 15;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      
      const lamp = MeshBuilder.CreateSphere(
        `decorativeLamp_${i}`,
        { diameter: 0.4 },
        this.scene
      );
      lamp.position = new Vector3(x, 3, z);

      const lampMaterial = new StandardMaterial(`decorativeLampMaterial_${i}`, this.scene);
      const color = this.navratriColors[i % this.navratriColors.length];
      lampMaterial.diffuseColor = color;
      lampMaterial.emissiveColor = color.scale(0.6);
      lamp.material = lampMaterial;

      // Add point light
      const pointLight = new PointLight(
        `decorativeLight_${i}`,
        lamp.position.clone(),
        this.scene
      );
      pointLight.diffuse = color;
      pointLight.intensity = 0.3;
      pointLight.range = 5;
    }
  }

  createCostumeDisplays() {
    const costumePositions = [
      new Vector3(-18, 0, -5),
      new Vector3(18, 0, -5)
    ];

    costumePositions.forEach((position, index) => {
      // Display stand
      const stand = MeshBuilder.CreateCylinder(
        `costumeStand_${index}`,
        { height: 0.2, diameter: 2 },
        this.scene
      );
      stand.position = position.clone();
      stand.position.y = 0.1;

      const standMaterial = new StandardMaterial(`costumeStandMaterial_${index}`, this.scene);
      standMaterial.diffuseColor = new Color3(0.6, 0.4, 0.2);
      stand.material = standMaterial;

      // Costume display (simplified)
      const costume = MeshBuilder.CreateBox(
        `costume_${index}`,
        { width: 1.5, height: 2, depth: 0.3 },
        this.scene
      );
      costume.position = position.clone();
      costume.position.y = 1.2;

      const costumeMaterial = new StandardMaterial(`costumeMaterial_${index}`, this.scene);
      const costumeColor = index === 0 ? 
        new Color3(1, 0.2, 0.5) : // Chaniya choli
        new Color3(1, 1, 0.2);    // Kurta
      costumeMaterial.diffuseColor = costumeColor;
      costumeMaterial.emissiveColor = costumeColor.scale(0.1);
      costume.material = costumeMaterial;
    });
  }

  setupDanceLearningSystem() {
    // Define basic Garba steps
    this.danceSteps = [
      { name: 'Basic Step', description: 'Step to the right, clap, step to the left, clap' },
      { name: 'Tali', description: 'Clap hands in rhythm with the music' },
      { name: 'Be Tali', description: 'Double clap pattern' },
      { name: 'Trikoniya', description: 'Three-step triangle pattern' },
      { name: 'Hudo', description: 'Circular movement around the center' }
    ];

    // Create dance instruction display
    this.createDanceInstructionPanel();
  }

  createDanceInstructionPanel() {
    // This would create a UI panel for dance instructions
    // For now, we'll create a simple visual indicator
    const instructionBoard = MeshBuilder.CreateBox(
      "danceInstructions",
      { width: 4, height: 3, depth: 0.1 },
      this.scene
    );
    instructionBoard.position = new Vector3(12, 2, 8);

    const boardMaterial = new StandardMaterial("instructionBoardMaterial", this.scene);
    boardMaterial.diffuseColor = new Color3(0.2, 0.2, 0.2);
    boardMaterial.emissiveColor = new Color3(0.1, 0.1, 0.1);
    instructionBoard.material = boardMaterial;
  }

  setupInteractions() {
    // Setup action manager for the scene
    this.scene.actionManager = new ActionManager(this.scene);

    // Make dancers interactive
    this.dancers.forEach((dancer, index) => {
      dancer.body.actionManager = new ActionManager(this.scene);
      
      dancer.body.actionManager.registerAction(
        new ExecuteCodeAction(ActionManager.OnPickTrigger, () => {
          this.showDancerInfo(dancer, index);
        })
      );
    });

    // Make Durga idol interactive
    if (this.durgaIdol) {
      this.durgaIdol.figure.actionManager = new ActionManager(this.scene);
      
      this.durgaIdol.figure.actionManager.registerAction(
        new ExecuteCodeAction(ActionManager.OnPickTrigger, () => {
          this.showDurgaInfo();
        })
      );
    }

    // Make costume displays interactive
    const costumes = this.scene.meshes.filter(mesh => mesh.name.includes('costume_'));
    costumes.forEach((costume, index) => {
      costume.actionManager = new ActionManager(this.scene);
      
      costume.actionManager.registerAction(
        new ExecuteCodeAction(ActionManager.OnPickTrigger, () => {
          this.showCostumeInfo(index);
        })
      );
    });
  }

  showDancerInfo(dancer, index) {
    const danceStep = this.danceSteps[index % this.danceSteps.length];
    console.log(`Dancer ${index + 1}: Performing ${danceStep.name} - ${danceStep.description}`);
    
    // Notify AI Guide
    if (window.app && window.app.aiGuide) {
      window.app.aiGuide.addUserInteraction(`learned about ${danceStep.name} dance step`);
    }
  }

  showDurgaInfo() {
    console.log('Goddess Durga: The divine mother who represents the power of good over evil. During Navratri, devotees worship her nine forms over nine nights.');
    
    // Show cultural info through UI Manager
    if (window.app && window.app.uiManager) {
      window.app.uiManager.showCulturalInfo('navratri', 'durga');
    }
  }

  showCostumeInfo(index) {
    const costumeInfo = [
      'Chaniya Choli: Traditional Gujarati dress with flared skirt and fitted blouse, worn during Garba dance.',
      'Kurta: Traditional men\'s attire, often paired with dhoti or churidar for Navratri celebrations.'
    ];
    
    console.log(`Traditional Costume: ${costumeInfo[index]}`);
    
    // Notify AI Guide
    if (window.app && window.app.aiGuide) {
      window.app.aiGuide.addUserInteraction('explored traditional Navratri costumes');
    }
  }

  startGarbaDance() {
    if (this.danceInProgress) return;
    
    this.danceInProgress = true;
    
    // Increase animation speed for all dancers
    this.dancers.forEach((dancer, index) => {
      // Speed up existing animations
      const animations = this.scene.getAnimationsByTargetProperty(dancer.body, "position");
      animations.forEach(anim => {
        anim.speedRatio = 2.0;
      });
    });
    
    // Notify AI Guide
    if (window.app && window.app.aiGuide) {
      window.app.aiGuide.addUserInteraction('started Garba dance celebration');
    }
    
    console.log('Garba dance celebration started! Watch the dancers move in traditional patterns.');
  }

  learnDanceStep(stepIndex) {
    if (stepIndex >= 0 && stepIndex < this.danceSteps.length) {
      this.currentDanceStep = stepIndex;
      const step = this.danceSteps[stepIndex];
      
      console.log(`Learning: ${step.name} - ${step.description}`);
      
      // Highlight the dancer performing this step
      const dancer = this.dancers[stepIndex % this.dancers.length];
      if (dancer) {
        // Add highlighting effect
        dancer.body.material.emissiveColor = new Color3(0.3, 0.3, 0.3);
        
        setTimeout(() => {
          dancer.body.material.emissiveColor = new Color3(0.1, 0.1, 0.1);
        }, 2000);
      }
      
      // Record progress
      if (window.app && window.app.progressManager) {
        window.app.progressManager.recordInteraction('navratri', 'danceStepsLearned', 1);
      }
    }
  }

  dispose() {
    // Clean up all Navratri scene objects
    this.dancers.forEach(dancer => {
      dancer.body.dispose();
      dancer.head.dispose();
      if (dancer.costume) dancer.costume.dispose();
    });

    if (this.pandal) this.pandal.dispose();
    
    if (this.durgaIdol) {
      this.durgaIdol.base.dispose();
      this.durgaIdol.figure.dispose();
      this.durgaIdol.crown.dispose();
    }

    this.garbaCircle.forEach(mesh => mesh.dispose());
    this.decorations.forEach(decoration => decoration.dispose());

    // Remove Navratri-specific lights
    const navratriLights = this.scene.lights.filter(light => 
      light.name.includes('navratri') || 
      light.name.includes('decorative') ||
      light.name.includes('idol')
    );
    
    navratriLights.forEach(light => light.dispose());

    console.log('Navratri scene disposed');
  }
}
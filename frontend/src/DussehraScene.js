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
  DirectionalLight
} from '@babylonjs/core';

export class DussehraScene {
  constructor(scene, camera) {
    this.scene = scene;
    this.camera = camera;
    this.ravanaEffigy = null;
    this.ramlilaStage = null;
    this.weaponDisplay = [];
    this.storytellingElements = [];
    this.fireworksSystem = null;
    this.audience = [];
    this.performers = [];
    this.isLoaded = false;
    this.effigyBurning = false;
    this.ramlilaInProgress = false;
    
    // Dussehra colors representing good vs evil
    this.dussehraColors = [
      new Color3(1, 0.8, 0.2),    // Golden (good)
      new Color3(1, 0.2, 0.2),    // Red (power)
      new Color3(0.2, 0.8, 0.2),  // Green (prosperity)
      new Color3(0.8, 0.2, 0.8),  // Purple (royalty)
      new Color3(0.2, 0.2, 0.2)   // Dark (evil)
    ];
  }

  async create() {
    try {
      // Set Dussehra atmosphere
      this.setupAtmosphere();
      
      // Create Ravana effigy
      this.createRavanaEffigy();
      
      // Create Ramlila performance stage
      this.createRamlilaStage();
      
      // Create weapon worship area (Ayudha Puja)
      this.createWeaponWorshipArea();
      
      // Create storytelling elements
      this.createStorytellingElements();
      
      // Create audience area
      this.createAudience();
      
      // Create performers
      this.createPerformers();
      
      // Create fireworks system
      this.createFireworksSystem();
      
      // Setup interactions
      this.setupInteractions();
      
      this.isLoaded = true;
      console.log('Dussehra scene created successfully');
      
    } catch (error) {
      console.error('Error creating Dussehra scene:', error);
    }
  }

  setupAtmosphere() {
    // Evening atmosphere for the celebration
    this.scene.clearColor = new Color4(0.2, 0.1, 0.3, 1.0);
    
    // Dramatic lighting for the festival
    const dramaticLight = new DirectionalLight(
      "dussehraDramaticLight",
      new Vector3(-0.5, -1, -0.5),
      this.scene
    );
    dramaticLight.intensity = 0.8;
    dramaticLight.diffuse = new Color3(1, 0.7, 0.4);
    
    // Ambient light
    const ambientLight = new HemisphericLight(
      "dussehraAmbient",
      new Vector3(0, 1, 0),
      this.scene
    );
    ambientLight.intensity = 0.3;
    ambientLight.diffuse = new Color3(0.6, 0.5, 0.7);
  }

  createRavanaEffigy() {
    // Main body of Ravana
    const ravanaBody = MeshBuilder.CreateCylinder(
      "ravanaBody",
      { height: 8, diameter: 2 },
      this.scene
    );
    ravanaBody.position = new Vector3(0, 4, -15);

    const bodyMaterial = new StandardMaterial("ravanaBodyMaterial", this.scene);
    bodyMaterial.diffuseColor = new Color3(0.6, 0.3, 0.1);
    bodyMaterial.emissiveColor = new Color3(0.1, 0.05, 0.02);
    ravanaBody.material = bodyMaterial;

    // Ravana's ten heads
    const heads = [];
    for (let i = 0; i < 10; i++) {
      const head = MeshBuilder.CreateSphere(
        `ravanaHead_${i}`,
        { diameter: 1.2 },
        this.scene
      );
      
      // Arrange heads in a crown-like formation
      const angle = (i / 10) * Math.PI * 2;
      const radius = i === 0 ? 0 : 1.5; // Center head and surrounding heads
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      
      head.position = new Vector3(x, 8 + (i === 0 ? 0.5 : 0), -15 + z);

      const headMaterial = new StandardMaterial(`ravanaHeadMaterial_${i}`, this.scene);
      headMaterial.diffuseColor = new Color3(0.8, 0.6, 0.4);
      headMaterial.emissiveColor = new Color3(0.1, 0.08, 0.06);
      head.material = headMaterial;

      heads.push(head);
    }

    // Arms
    const leftArm = MeshBuilder.CreateCylinder(
      "ravanaLeftArm",
      { height: 4, diameter: 0.5 },
      this.scene
    );
    leftArm.position = new Vector3(-1.5, 5, -15);
    leftArm.rotation.z = Math.PI / 4;
    leftArm.material = bodyMaterial;

    const rightArm = MeshBuilder.CreateCylinder(
      "ravanaRightArm",
      { height: 4, diameter: 0.5 },
      this.scene
    );
    rightArm.position = new Vector3(1.5, 5, -15);
    rightArm.rotation.z = -Math.PI / 4;
    rightArm.material = bodyMaterial;

    // Crown
    const crown = MeshBuilder.CreateCylinder(
      "ravanaCrown",
      { height: 1, diameterTop: 3, diameterBottom: 2.5 },
      this.scene
    );
    crown.position = new Vector3(0, 9.5, -15);

    const crownMaterial = new StandardMaterial("ravanaCrownMaterial", this.scene);
    crownMaterial.diffuseColor = new Color3(1, 0.8, 0.2);
    crownMaterial.emissiveColor = new Color3(0.3, 0.2, 0.05);
    crown.material = crownMaterial;

    // Base platform
    const platform = MeshBuilder.CreateCylinder(
      "ravanaPlatform",
      { height: 0.5, diameter: 4 },
      this.scene
    );
    platform.position = new Vector3(0, 0.25, -15);

    const platformMaterial = new StandardMaterial("ravanaPlatformMaterial", this.scene);
    platformMaterial.diffuseColor = new Color3(0.5, 0.3, 0.1);
    platform.material = platformMaterial;

    this.ravanaEffigy = {
      body: ravanaBody,
      heads: heads,
      leftArm: leftArm,
      rightArm: rightArm,
      crown: crown,
      platform: platform
    };
  }

  createRamlilaStage() {
    // Stage platform
    const stage = MeshBuilder.CreateBox(
      "ramlilaStage",
      { width: 12, height: 1, depth: 8 },
      this.scene
    );
    stage.position = new Vector3(15, 0.5, 0);

    const stageMaterial = new StandardMaterial("ramlilaStageMateria", this.scene);
    stageMaterial.diffuseColor = new Color3(0.6, 0.4, 0.2);
    stage.material = stageMaterial;

    // Backdrop
    const backdrop = MeshBuilder.CreateBox(
      "ramlilaBackdrop",
      { width: 12, height: 6, depth: 0.2 },
      this.scene
    );
    backdrop.position = new Vector3(15, 3.5, -4);

    const backdropMaterial = new StandardMaterial("ramlilaBackdropMaterial", this.scene);
    backdropMaterial.diffuseColor = new Color3(0.8, 0.6, 0.3);
    backdropMaterial.emissiveColor = new Color3(0.2, 0.15, 0.08);
    backdrop.material = backdropMaterial;

    // Stage decorations
    this.createStageDecorations();
    
    this.ramlilaStage = { platform: stage, backdrop: backdrop };
  }

  createStageDecorations() {
    // Decorative pillars
    for (let i = 0; i < 4; i++) {
      const pillar = MeshBuilder.CreateCylinder(
        `stagePillar_${i}`,
        { height: 6, diameter: 0.5 },
        this.scene
      );
      pillar.position = new Vector3(
        15 + (i < 2 ? -5.5 : 5.5),
        3,
        (i % 2 === 0 ? -3.5 : 3.5)
      );

      const pillarMaterial = new StandardMaterial(`stagePillarMaterial_${i}`, this.scene);
      pillarMaterial.diffuseColor = new Color3(0.8, 0.6, 0.3);
      pillar.material = pillarMaterial;
    }

    // Stage lights
    for (let i = 0; i < 6; i++) {
      const light = MeshBuilder.CreateSphere(
        `stageLight_${i}`,
        { diameter: 0.3 },
        this.scene
      );
      light.position = new Vector3(15 + (i - 2.5) * 2, 6.5, 0);

      const lightMaterial = new StandardMaterial(`stageLightMaterial_${i}`, this.scene);
      lightMaterial.diffuseColor = new Color3(1, 1, 0.8);
      lightMaterial.emissiveColor = new Color3(0.8, 0.8, 0.6);
      light.material = lightMaterial;

      // Add point light
      const pointLight = new PointLight(
        `stagePointLight_${i}`,
        light.position.clone(),
        this.scene
      );
      pointLight.diffuse = new Color3(1, 1, 0.8);
      pointLight.intensity = 0.5;
      pointLight.range = 8;
    }
  }

  createWeaponWorshipArea() {
    // Ayudha Puja area
    const worshipArea = MeshBuilder.CreateCylinder(
      "weaponWorshipArea",
      { height: 0.2, diameter: 6 },
      this.scene
    );
    worshipArea.position = new Vector3(-15, 0.1, 5);

    const areaMaterial = new StandardMaterial("weaponWorshipAreaMaterial", this.scene);
    areaMaterial.diffuseColor = new Color3(0.8, 0.7, 0.5);
    worshipArea.material = areaMaterial;

    // Traditional weapons display
    const weapons = [
      { name: 'sword', pos: new Vector3(-16, 0.5, 3) },
      { name: 'bow', pos: new Vector3(-14, 0.5, 3) },
      { name: 'spear', pos: new Vector3(-16, 0.5, 7) },
      { name: 'mace', pos: new Vector3(-14, 0.5, 7) },
      { name: 'shield', pos: new Vector3(-15, 0.5, 5) }
    ];

    weapons.forEach((weapon, index) => {
      const weaponMesh = this.createWeapon(weapon.name, weapon.pos, index);
      this.weaponDisplay.push(weaponMesh);
    });

    // Worship items
    this.createWorshipItems();
  }

  createWeapon(weaponType, position, index) {
    let weapon;
    
    switch (weaponType) {
      case 'sword':
        weapon = MeshBuilder.CreateBox(
          `weapon_sword_${index}`,
          { width: 0.1, height: 2, depth: 0.3 },
          this.scene
        );
        break;
      case 'bow':
        weapon = MeshBuilder.CreateTorus(
          `weapon_bow_${index}`,
          { diameter: 1.5, thickness: 0.1 },
          this.scene
        );
        weapon.rotation.x = Math.PI / 2;
        break;
      case 'spear':
        weapon = MeshBuilder.CreateCylinder(
          `weapon_spear_${index}`,
          { height: 2.5, diameter: 0.1 },
          this.scene
        );
        break;
      case 'mace':
        weapon = MeshBuilder.CreateCylinder(
          `weapon_mace_${index}`,
          { height: 1.5, diameterTop: 0.3, diameterBottom: 0.1 },
          this.scene
        );
        break;
      case 'shield':
        weapon = MeshBuilder.CreateCylinder(
          `weapon_shield_${index}`,
          { height: 0.2, diameter: 1.5 },
          this.scene
        );
        break;
      default:
        weapon = MeshBuilder.CreateBox(
          `weapon_default_${index}`,
          { width: 0.2, height: 1, depth: 0.2 },
          this.scene
        );
    }
    
    weapon.position = position;

    const weaponMaterial = new StandardMaterial(`weaponMaterial_${index}`, this.scene);
    weaponMaterial.diffuseColor = new Color3(0.7, 0.7, 0.8);
    weaponMaterial.specularColor = new Color3(0.9, 0.9, 1);
    weapon.material = weaponMaterial;

    return weapon;
  }

  createWorshipItems() {
    // Flowers for worship
    for (let i = 0; i < 8; i++) {
      const flower = MeshBuilder.CreateSphere(
        `worshipFlower_${i}`,
        { diameter: 0.2 },
        this.scene
      );
      
      const angle = (i / 8) * Math.PI * 2;
      const x = -15 + Math.cos(angle) * 2;
      const z = 5 + Math.sin(angle) * 2;
      flower.position = new Vector3(x, 0.3, z);

      const flowerMaterial = new StandardMaterial(`worshipFlowerMaterial_${i}`, this.scene);
      const color = this.dussehraColors[i % (this.dussehraColors.length - 1)]; // Exclude dark color
      flowerMaterial.diffuseColor = color;
      flowerMaterial.emissiveColor = color.scale(0.3);
      flower.material = flowerMaterial;
    }

    // Incense sticks
    for (let i = 0; i < 4; i++) {
      const incense = MeshBuilder.CreateCylinder(
        `incense_${i}`,
        { height: 0.8, diameter: 0.02 },
        this.scene
      );
      incense.position = new Vector3(-15 + (i - 1.5) * 0.3, 0.4, 4);

      const incenseMaterial = new StandardMaterial(`incenseMaterial_${i}`, this.scene);
      incenseMaterial.diffuseColor = new Color3(0.4, 0.2, 0.1);
      incense.material = incenseMaterial;

      // Smoke effect
      this.createSmokeEffect(incense.position);
    }
  }

  createSmokeEffect(position) {
    const smokeSystem = new ParticleSystem("incenseSmoke", 50, this.scene);
    smokeSystem.emitter = position.clone();
    smokeSystem.minEmitBox = new Vector3(-0.1, 0.8, -0.1);
    smokeSystem.maxEmitBox = new Vector3(0.1, 1, 0.1);

    smokeSystem.color1 = new Color4(0.8, 0.8, 0.8, 0.5);
    smokeSystem.color2 = new Color4(0.6, 0.6, 0.6, 0.3);
    smokeSystem.colorDead = new Color4(0.4, 0.4, 0.4, 0);

    smokeSystem.minSize = 0.1;
    smokeSystem.maxSize = 0.3;
    smokeSystem.minLifeTime = 2;
    smokeSystem.maxLifeTime = 4;
    smokeSystem.emitRate = 10;

    smokeSystem.direction1 = new Vector3(-0.5, 2, -0.5);
    smokeSystem.direction2 = new Vector3(0.5, 3, 0.5);
    smokeSystem.gravity = new Vector3(0, -0.5, 0);

    smokeSystem.start();
  }

  createStorytellingElements() {
    // Story panels depicting Ramayana
    const storyPanels = [
      { title: 'Rama\'s Exile', pos: new Vector3(-8, 2, -8) },
      { title: 'Sita\'s Abduction', pos: new Vector3(-4, 2, -8) },
      { title: 'Hanuman\'s Journey', pos: new Vector3(0, 2, -8) },
      { title: 'Battle with Ravana', pos: new Vector3(4, 2, -8) },
      { title: 'Victory of Good', pos: new Vector3(8, 2, -8) }
    ];

    storyPanels.forEach((panel, index) => {
      const storyPanel = MeshBuilder.CreateBox(
        `storyPanel_${index}`,
        { width: 2.5, height: 3, depth: 0.1 },
        this.scene
      );
      storyPanel.position = panel.pos;

      const panelMaterial = new StandardMaterial(`storyPanelMaterial_${index}`, this.scene);
      panelMaterial.diffuseColor = this.dussehraColors[index % this.dussehraColors.length];
      panelMaterial.emissiveColor = panelMaterial.diffuseColor.scale(0.2);
      storyPanel.material = panelMaterial;

      this.storytellingElements.push(storyPanel);
    });

    // Moral lesson display
    this.createMoralLessonDisplay();
  }

  createMoralLessonDisplay() {
    const lessonBoard = MeshBuilder.CreateBox(
      "moralLessonBoard",
      { width: 6, height: 2, depth: 0.1 },
      this.scene
    );
    lessonBoard.position = new Vector3(0, 4, -5);

    const boardMaterial = new StandardMaterial("moralLessonBoardMaterial", this.scene);
    boardMaterial.diffuseColor = new Color3(0.8, 0.6, 0.2);
    boardMaterial.emissiveColor = new Color3(0.2, 0.15, 0.05);
    lessonBoard.material = boardMaterial;
  }

  createAudience() {
    // Create audience members watching the celebration
    for (let row = 0; row < 4; row++) {
      for (let seat = 0; seat < 8; seat++) {
        const audienceMember = this.createAudienceMember(
          new Vector3(-12 + seat * 3, 0, 8 + row * 2),
          row * 8 + seat
        );
        this.audience.push(audienceMember);
      }
    }
  }

  createAudienceMember(position, index) {
    // Body
    const body = MeshBuilder.CreateCylinder(
      `audience_body_${index}`,
      { height: 1.4, diameter: 0.5 },
      this.scene
    );
    body.position = position.clone();
    body.position.y = 0.7;

    const bodyMaterial = new StandardMaterial(`audienceBodyMaterial_${index}`, this.scene);
    bodyMaterial.diffuseColor = this.dussehraColors[index % (this.dussehraColors.length - 1)];
    body.material = bodyMaterial;

    // Head
    const head = MeshBuilder.CreateSphere(
      `audience_head_${index}`,
      { diameter: 0.3 },
      this.scene
    );
    head.position = position.clone();
    head.position.y = 1.5;

    const headMaterial = new StandardMaterial(`audienceHeadMaterial_${index}`, this.scene);
    headMaterial.diffuseColor = new Color3(0.8, 0.6, 0.4);
    head.material = headMaterial;

    return { body: body, head: head, position: position };
  }

  createPerformers() {
    // Rama
    const rama = this.createPerformer(new Vector3(12, 0, 0), 'rama');
    
    // Sita
    const sita = this.createPerformer(new Vector3(14, 0, 0), 'sita');
    
    // Hanuman
    const hanuman = this.createPerformer(new Vector3(16, 0, 0), 'hanuman');
    
    // Lakshmana
    const lakshmana = this.createPerformer(new Vector3(18, 0, 0), 'lakshmana');

    this.performers = [rama, sita, hanuman, lakshmana];
  }

  createPerformer(position, character) {
    // Body
    const body = MeshBuilder.CreateCylinder(
      `${character}_body`,
      { height: 1.6, diameter: 0.6 },
      this.scene
    );
    body.position = position.clone();
    body.position.y = 0.8;

    // Character-specific colors
    const characterColors = {
      rama: new Color3(0.2, 0.2, 0.8),    // Blue
      sita: new Color3(1, 0.8, 0.2),      // Golden
      hanuman: new Color3(1, 0.5, 0.2),   // Orange
      lakshmana: new Color3(0.8, 0.2, 0.2) // Red
    };

    const bodyMaterial = new StandardMaterial(`${character}BodyMaterial`, this.scene);
    bodyMaterial.diffuseColor = characterColors[character];
    bodyMaterial.emissiveColor = characterColors[character].scale(0.1);
    body.material = bodyMaterial;

    // Head
    const head = MeshBuilder.CreateSphere(
      `${character}_head`,
      { diameter: 0.4 },
      this.scene
    );
    head.position = position.clone();
    head.position.y = 1.7;

    const headMaterial = new StandardMaterial(`${character}HeadMaterial`, this.scene);
    headMaterial.diffuseColor = new Color3(0.8, 0.6, 0.4);
    head.material = headMaterial;

    // Add performance animation
    this.addPerformanceAnimation(body, head, character);

    return { body: body, head: head, character: character, position: position };
  }

  addPerformanceAnimation(body, head, character) {
    // Different animations for different characters
    const animationSpeed = character === 'hanuman' ? 60 : 30;
    
    const performanceAnimation = Animation.CreateAndStartAnimation(
      `${character}Performance`,
      body,
      "rotation.y",
      animationSpeed,
      120,
      0,
      Math.PI * 2,
      Animation.ANIMATIONLOOPMODE_CYCLE
    );

    const headAnimation = Animation.CreateAndStartAnimation(
      `${character}HeadPerformance`,
      head,
      "rotation.y",
      animationSpeed,
      120,
      0,
      Math.PI * 2,
      Animation.ANIMATIONLOOPMODE_CYCLE
    );
  }

  createFireworksSystem() {
    this.fireworksSystem = new ParticleSystem("dussehraFireworks", 1000, this.scene);
    
    this.fireworksSystem.emitter = new Vector3(0, 0, -15);
    this.fireworksSystem.minEmitBox = new Vector3(-3, 10, -3);
    this.fireworksSystem.maxEmitBox = new Vector3(3, 15, 3);

    this.fireworksSystem.color1 = new Color4(1, 0.8, 0.2, 1);
    this.fireworksSystem.color2 = new Color4(1, 0.4, 0.1, 1);
    this.fireworksSystem.colorDead = new Color4(0.5, 0.2, 0.1, 0);

    this.fireworksSystem.minSize = 0.3;
    this.fireworksSystem.maxSize = 1.2;
    this.fireworksSystem.minLifeTime = 1;
    this.fireworksSystem.maxLifeTime = 3;
    this.fireworksSystem.emitRate = 200;

    this.fireworksSystem.direction1 = new Vector3(-3, 5, -3);
    this.fireworksSystem.direction2 = new Vector3(3, 10, 3);
    this.fireworksSystem.gravity = new Vector3(0, -2, 0);
  }

  setupInteractions() {
    // Setup action manager for the scene
    this.scene.actionManager = new ActionManager(this.scene);

    // Make Ravana effigy interactive
    if (this.ravanaEffigy) {
      this.ravanaEffigy.body.actionManager = new ActionManager(this.scene);
      
      this.ravanaEffigy.body.actionManager.registerAction(
        new ExecuteCodeAction(ActionManager.OnPickTrigger, () => {
          this.burnRavanaEffigy();
        })
      );
    }

    // Make story panels interactive
    this.storytellingElements.forEach((panel, index) => {
      panel.actionManager = new ActionManager(this.scene);
      
      panel.actionManager.registerAction(
        new ExecuteCodeAction(ActionManager.OnPickTrigger, () => {
          this.showStoryPanel(index);
        })
      );
    });

    // Make weapons interactive
    this.weaponDisplay.forEach((weapon, index) => {
      weapon.actionManager = new ActionManager(this.scene);
      
      weapon.actionManager.registerAction(
        new ExecuteCodeAction(ActionManager.OnPickTrigger, () => {
          this.showWeaponInfo(weapon, index);
        })
      );
    });

    // Make performers interactive
    this.performers.forEach((performer, index) => {
      performer.body.actionManager = new ActionManager(this.scene);
      
      performer.body.actionManager.registerAction(
        new ExecuteCodeAction(ActionManager.OnPickTrigger, () => {
          this.showPerformerInfo(performer);
        })
      );
    });
  }

  burnRavanaEffigy() {
    if (this.effigyBurning) return;
    
    this.effigyBurning = true;
    
    // Start fireworks
    this.fireworksSystem.start();
    
    // Create burning effect
    this.createBurningEffect();
    
    // Animate effigy destruction
    this.animateEffigyDestruction();
    
    console.log('Ravana effigy is burning! Victory of good over evil!');
    
    // Notify AI Guide
    if (window.app && window.app.aiGuide) {
      window.app.aiGuide.addUserInteraction('burned Ravana effigy');
    }
    
    // Record progress
    if (window.app && window.app.progressManager) {
      window.app.progressManager.recordInteraction('dussehra', 'effigyBurned', true);
    }
  }

  createBurningEffect() {
    const fireSystem = new ParticleSystem("ravanaFire", 500, this.scene);
    fireSystem.emitter = this.ravanaEffigy.body;
    fireSystem.minEmitBox = new Vector3(-1, 0, -1);
    fireSystem.maxEmitBox = new Vector3(1, 8, 1);

    fireSystem.color1 = new Color4(1, 0.8, 0.2, 1);
    fireSystem.color2 = new Color4(1, 0.4, 0.1, 1);
    fireSystem.colorDead = new Color4(0.5, 0.2, 0.1, 0);

    fireSystem.minSize = 0.5;
    fireSystem.maxSize = 1.5;
    fireSystem.minLifeTime = 1;
    fireSystem.maxLifeTime = 2;
    fireSystem.emitRate = 300;

    fireSystem.direction1 = new Vector3(-2, 3, -2);
    fireSystem.direction2 = new Vector3(2, 6, 2);

    fireSystem.start();
  }

  animateEffigyDestruction() {
    // Gradually scale down the effigy
    Object.values(this.ravanaEffigy).forEach((part, index) => {
      setTimeout(() => {
        const destructionAnimation = Animation.CreateAndStartAnimation(
          `effigyDestruction_${index}`,
          part,
          "scaling",
          30,
          90,
          new Vector3(1, 1, 1),
          new Vector3(0.1, 0.1, 0.1),
          Animation.ANIMATIONLOOPMODE_CONSTANT
        );
      }, index * 500);
    });
  }

  showStoryPanel(index) {
    const stories = [
      'Rama\'s Exile: Prince Rama was exiled to the forest for 14 years due to palace intrigue.',
      'Sita\'s Abduction: Ravana kidnapped Sita and took her to Lanka.',
      'Hanuman\'s Journey: Hanuman crossed the ocean to find Sita and deliver Rama\'s message.',
      'Battle with Ravana: The epic battle between Rama and the ten-headed demon king Ravana.',
      'Victory of Good: Rama\'s victory represents the eternal triumph of righteousness over evil.'
    ];
    
    console.log(`Story Panel ${index + 1}: ${stories[index]}`);
    
    // Show cultural info through UI Manager
    if (window.app && window.app.uiManager) {
      window.app.uiManager.showCulturalInfo('dussehra', 'story');
    }
  }

  showWeaponInfo(weapon, index) {
    const weaponInfo = [
      'Sword: Symbol of courage and protection of dharma',
      'Bow: Represents focus and precision in achieving goals',
      'Spear: Symbolizes the piercing of ignorance with knowledge',
      'Mace: Represents strength and the power to overcome obstacles',
      'Shield: Symbol of protection and defense of righteousness'
    ];
    
    console.log(`Weapon Worship: ${weaponInfo[index]}`);
    
    // Highlight the weapon
    weapon.material.emissiveColor = new Color3(0.3, 0.3, 0.3);
    setTimeout(() => {
      weapon.material.emissiveColor = new Color3(0, 0, 0);
    }, 2000);
    
    // Notify AI Guide
    if (window.app && window.app.aiGuide) {
      window.app.aiGuide.addUserInteraction('learned about weapon worship in Dussehra');
    }
  }

  showPerformerInfo(performer) {
    const characterInfo = {
      rama: 'Lord Rama: The ideal king and embodiment of dharma, righteousness, and virtue.',
      sita: 'Goddess Sita: Symbol of purity, devotion, and feminine strength.',
      hanuman: 'Lord Hanuman: The devoted follower, representing courage, strength, and loyalty.',
      lakshmana: 'Lakshmana: Rama\'s brother, symbolizing selfless service and brotherhood.'
    };
    
    console.log(`Character: ${characterInfo[performer.character]}`);
    
    // Show cultural info through UI Manager
    if (window.app && window.app.uiManager) {
      window.app.uiManager.showCulturalInfo('dussehra', performer.character);
    }
  }

  startRamlila() {
    if (this.ramlilaInProgress) return;
    
    this.ramlilaInProgress = true;
    
    // Animate performers
    this.performers.forEach((performer, index) => {
      // Speed up performance animations
      const animations = this.scene.getAnimationsByTargetProperty(performer.body, "rotation.y");
      animations.forEach(anim => {
        anim.speedRatio = 2.0;
      });
    });
    
    console.log('Ramlila performance started! Watch the epic story of Ramayana unfold.');
    
    // Notify AI Guide
    if (window.app && window.app.aiGuide) {
      window.app.aiGuide.addUserInteraction('started Ramlila performance');
    }
  }

  dispose() {
    // Clean up all Dussehra scene objects
    if (this.ravanaEffigy) {
      Object.values(this.ravanaEffigy).forEach(part => part.dispose());
    }

    if (this.ramlilaStage) {
      Object.values(this.ramlilaStage).forEach(part => part.dispose());
    }

    this.weaponDisplay.forEach(weapon => weapon.dispose());
    this.storytellingElements.forEach(element => element.dispose());
    
    if (this.fireworksSystem) {
      this.fireworksSystem.dispose();
    }

    this.audience.forEach(member => {
      member.body.dispose();
      member.head.dispose();
    });

    this.performers.forEach(performer => {
      performer.body.dispose();
      performer.head.dispose();
    });

    // Remove Dussehra-specific lights
    const dussehraLights = this.scene.lights.filter(light => 
      light.name.includes('dussehra') || 
      light.name.includes('stage')
    );
    
    dussehraLights.forEach(light => light.dispose());

    console.log('Dussehra scene disposed');
  }
}
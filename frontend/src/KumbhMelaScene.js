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
import { WaterMaterial } from '@babylonjs/materials';

export class KumbhMelaScene {
  constructor(scene, camera) {
    this.scene = scene;
    this.camera = camera;
    this.holyRiver = null;
    this.pilgrims = [];
    this.akharas = [];
    this.sadhus = [];
    this.ghats = [];
    this.tents = [];
    this.spiritualPractices = [];
    this.isLoaded = false;
    this.holyDipActive = false;
    this.currentPractice = null;
    
    // Kumbh Mela spiritual colors
    this.spiritualColors = [
      new Color3(1, 0.8, 0.2),    // Saffron (spiritual)
      new Color3(0.9, 0.9, 0.9),  // White (purity)
      new Color3(0.8, 0.4, 0.2),  // Ochre (renunciation)
      new Color3(0.2, 0.5, 0.8),  // Blue (divine)
      new Color3(0.6, 0.3, 0.8)   // Purple (mysticism)
    ];
  }

  async create() {
    try {
      // Set Kumbh Mela atmosphere
      this.setupAtmosphere();
      
      // Create holy river confluence
      this.createHolyRiver();
      
      // Create ghats (steps to river)
      this.createGhats();
      
      // Create massive crowd of pilgrims
      this.createPilgrims();
      
      // Create different akharas
      this.createAkharas();
      
      // Create sadhus and spiritual teachers
      this.createSadhus();
      
      // Create temporary tents and camps
      this.createTentCity();
      
      // Create spiritual practice areas
      this.createSpiritualPractices();
      
      // Setup interactions
      this.setupInteractions();
      
      this.isLoaded = true;
      console.log('Kumbh Mela scene created successfully');
      
    } catch (error) {
      console.error('Error creating Kumbh Mela scene:', error);
    }
  }

  setupAtmosphere() {
    // Early morning spiritual atmosphere
    this.scene.clearColor = new Color4(0.8, 0.9, 1.0, 1.0);
    
    // Soft morning sunlight
    const morningLight = new DirectionalLight(
      "kumbhMorningSun",
      new Vector3(-0.3, -1, -0.2),
      this.scene
    );
    morningLight.intensity = 0.9;
    morningLight.diffuse = new Color3(1, 0.95, 0.8);
    
    // Ambient spiritual light
    const ambientLight = new HemisphericLight(
      "kumbhAmbient",
      new Vector3(0, 1, 0),
      this.scene
    );
    ambientLight.intensity = 0.6;
    ambientLight.diffuse = new Color3(0.9, 0.9, 1);
  }

  createHolyRiver() {
    // Main river body
    const river = MeshBuilder.CreateGround(
      "holyRiver",
      { width: 40, height: 60 },
      this.scene
    );
    river.position = new Vector3(0, -0.5, 0);

    // Create water material with flowing effect
    const waterMaterial = new StandardMaterial("holyWaterMaterial", this.scene);
    waterMaterial.diffuseColor = new Color3(0.3, 0.6, 0.8);
    waterMaterial.specularColor = new Color3(0.8, 0.9, 1);
    waterMaterial.alpha = 0.8;
    river.material = waterMaterial;

    // Add flowing water animation
    this.addWaterFlowAnimation(river);
    
    // Create confluence point (sangam)
    this.createConfluence();
    
    this.holyRiver = river;
  }

  addWaterFlowAnimation(river) {
    // Create flowing water effect with texture animation
    const flowAnimation = Animation.CreateAndStartAnimation(
      "waterFlow",
      river,
      "material.diffuseColor",
      30,
      120,
      new Color3(0.3, 0.6, 0.8),
      new Color3(0.2, 0.5, 0.9),
      Animation.ANIMATIONLOOPMODE_CYCLE
    );
  }

  createConfluence() {
    // Sacred confluence point where rivers meet
    const confluence = MeshBuilder.CreateCylinder(
      "sacredConfluence",
      { height: 0.2, diameter: 8 },
      this.scene
    );
    confluence.position = new Vector3(0, -0.4, 0);

    const confluenceMaterial = new StandardMaterial("confluenceMaterial", this.scene);
    confluenceMaterial.diffuseColor = new Color3(0.8, 0.9, 1);
    confluenceMaterial.emissiveColor = new Color3(0.2, 0.3, 0.4);
    confluence.material = confluenceMaterial;

    // Sacred symbols in the water
    this.createSacredSymbols();
  }

  createSacredSymbols() {
    // Om symbols floating in the confluence
    for (let i = 0; i < 6; i++) {
      const symbol = MeshBuilder.CreateSphere(
        `sacredSymbol_${i}`,
        { diameter: 0.5 },
        this.scene
      );
      
      const angle = (i / 6) * Math.PI * 2;
      const x = Math.cos(angle) * 3;
      const z = Math.sin(angle) * 3;
      symbol.position = new Vector3(x, -0.2, z);

      const symbolMaterial = new StandardMaterial(`sacredSymbolMaterial_${i}`, this.scene);
      symbolMaterial.diffuseColor = new Color3(1, 0.8, 0.2);
      symbolMaterial.emissiveColor = new Color3(0.3, 0.2, 0.05);
      symbol.material = symbolMaterial;

      // Gentle floating animation
      const floatAnimation = Animation.CreateAndStartAnimation(
        `symbolFloat_${i}`,
        symbol,
        "position.y",
        30,
        60,
        -0.2,
        0,
        Animation.ANIMATIONLOOPMODE_CYCLE
      );
    }
  }

  createGhats() {
    // Create stepped ghats leading to the river
    for (let i = 0; i < 8; i++) {
      const ghat = MeshBuilder.CreateBox(
        `ghat_${i}`,
        { width: 35, height: 0.5, depth: 3 },
        this.scene
      );
      ghat.position = new Vector3(0, i * 0.5, -25 + i * 3);

      const ghatMaterial = new StandardMaterial(`ghatMaterial_${i}`, this.scene);
      ghatMaterial.diffuseColor = new Color3(0.8, 0.7, 0.6);
      ghat.material = ghatMaterial;

      this.ghats.push(ghat);
    }

    // Add decorative elements to ghats
    this.decorateGhats();
  }

  decorateGhats() {
    // Temple structures on ghats
    for (let i = 0; i < 4; i++) {
      const temple = MeshBuilder.CreateBox(
        `ghatTemple_${i}`,
        { width: 4, height: 6, depth: 4 },
        this.scene
      );
      temple.position = new Vector3((i - 1.5) * 8, 3, -20);

      const templeMaterial = new StandardMaterial(`ghatTempleMaterial_${i}`, this.scene);
      templeMaterial.diffuseColor = new Color3(0.9, 0.8, 0.6);
      templeMaterial.emissiveColor = new Color3(0.1, 0.08, 0.06);
      temple.material = templeMaterial;

      // Temple spire
      const spire = MeshBuilder.CreateCylinder(
        `templeSpire_${i}`,
        { height: 3, diameterTop: 1, diameterBottom: 2 },
        this.scene
      );
      spire.position = new Vector3((i - 1.5) * 8, 7.5, -20);

      const spireMaterial = new StandardMaterial(`templeSpirematerial_${i}`, this.scene);
      spireMaterial.diffuseColor = new Color3(1, 0.8, 0.2);
      spireMaterial.emissiveColor = new Color3(0.3, 0.2, 0.05);
      spire.material = spireMaterial;
    }
  }

  createPilgrims() {
    // Create massive crowd of pilgrims
    for (let i = 0; i < 50; i++) {
      const pilgrim = this.createPilgrim(
        new Vector3(
          (Math.random() - 0.5) * 30,
          0,
          (Math.random() - 0.5) * 40 + 10
        ),
        i
      );
      this.pilgrims.push(pilgrim);
    }
  }

  createPilgrim(position, index) {
    // Body
    const body = MeshBuilder.CreateCylinder(
      `pilgrim_body_${index}`,
      { height: 1.5, diameter: 0.5 },
      this.scene
    );
    body.position = position.clone();
    body.position.y = 0.75;

    const bodyMaterial = new StandardMaterial(`pilgrimBodyMaterial_${index}`, this.scene);
    const clothingColor = this.spiritualColors[index % this.spiritualColors.length];
    bodyMaterial.diffuseColor = clothingColor;
    body.material = bodyMaterial;

    // Head
    const head = MeshBuilder.CreateSphere(
      `pilgrim_head_${index}`,
      { diameter: 0.3 },
      this.scene
    );
    head.position = position.clone();
    head.position.y = 1.6;

    const headMaterial = new StandardMaterial(`pilgrimHeadMaterial_${index}`, this.scene);
    headMaterial.diffuseColor = new Color3(0.8, 0.6, 0.4);
    head.material = headMaterial;

    // Add prayer/movement animation
    this.addPilgrimAnimation(body, head, index);

    return { body: body, head: head, position: position, type: 'pilgrim' };
  }

  addPilgrimAnimation(body, head, index) {
    // Gentle movement towards river
    const moveAnimation = Animation.CreateAndStartAnimation(
      `pilgrimMove_${index}`,
      body,
      "position.z",
      30,
      300,
      body.position.z,
      body.position.z - 5,
      Animation.ANIMATIONLOOPMODE_CYCLE
    );

    // Head movement
    const headMoveAnimation = Animation.CreateAndStartAnimation(
      `pilgrimHeadMove_${index}`,
      head,
      "position.z",
      30,
      300,
      head.position.z,
      head.position.z - 5,
      Animation.ANIMATIONLOOPMODE_CYCLE
    );

    // Prayer gesture
    const prayerAnimation = Animation.CreateAndStartAnimation(
      `pilgrimPrayer_${index}`,
      body,
      "rotation.y",
      30,
      180,
      0,
      Math.PI / 4,
      Animation.ANIMATIONLOOPMODE_CYCLE
    );
  }

  createAkharas() {
    // Different spiritual orders/camps
    const akharaTypes = [
      { name: 'Juna Akhara', pos: new Vector3(-15, 0, 15), color: new Color3(1, 0.5, 0.2) },
      { name: 'Niranjani Akhara', pos: new Vector3(15, 0, 15), color: new Color3(0.8, 0.2, 0.2) },
      { name: 'Mahanirvani Akhara', pos: new Vector3(-15, 0, -15), color: new Color3(0.2, 0.8, 0.2) },
      { name: 'Atal Akhara', pos: new Vector3(15, 0, -15), color: new Color3(0.2, 0.2, 0.8) }
    ];

    akharaTypes.forEach((akhara, index) => {
      const akharaStructure = this.createAkharaStructure(akhara.pos, akhara.color, index);
      this.akharas.push({
        structure: akharaStructure,
        name: akhara.name,
        position: akhara.pos
      });
    });
  }

  createAkharaStructure(position, color, index) {
    // Main tent/structure
    const tent = MeshBuilder.CreateCylinder(
      `akhara_tent_${index}`,
      { height: 4, diameterTop: 6, diameterBottom: 8 },
      this.scene
    );
    tent.position = position.clone();
    tent.position.y = 2;

    const tentMaterial = new StandardMaterial(`akharaTentMaterial_${index}`, this.scene);
    tentMaterial.diffuseColor = color;
    tentMaterial.emissiveColor = color.scale(0.1);
    tent.material = tentMaterial;

    // Flag pole
    const flagPole = MeshBuilder.CreateCylinder(
      `akhara_flagpole_${index}`,
      { height: 8, diameter: 0.1 },
      this.scene
    );
    flagPole.position = position.clone();
    flagPole.position.y = 4;
    flagPole.position.x += 4;

    const poleMaterial = new StandardMaterial(`akharaPoleMaterial_${index}`, this.scene);
    poleMaterial.diffuseColor = new Color3(0.6, 0.3, 0.1);
    flagPole.material = poleMaterial;

    // Flag
    const flag = MeshBuilder.CreateBox(
      `akhara_flag_${index}`,
      { width: 2, height: 1.5, depth: 0.1 },
      this.scene
    );
    flag.position = position.clone();
    flag.position.y = 7;
    flag.position.x += 5;

    const flagMaterial = new StandardMaterial(`akharaFlagMaterial_${index}`, this.scene);
    flagMaterial.diffuseColor = color;
    flagMaterial.emissiveColor = color.scale(0.3);
    flag.material = flagMaterial;

    // Flag waving animation
    const flagAnimation = Animation.CreateAndStartAnimation(
      `flagWave_${index}`,
      flag,
      "rotation.y",
      30,
      60,
      0,
      Math.PI / 8,
      Animation.ANIMATIONLOOPMODE_CYCLE
    );

    return { tent: tent, flagPole: flagPole, flag: flag };
  }

  createSadhus() {
    // Create various types of sadhus and spiritual teachers
    const sadhuPositions = [
      { pos: new Vector3(-12, 0, 12), type: 'naga' },
      { pos: new Vector3(12, 0, 12), type: 'scholar' },
      { pos: new Vector3(-12, 0, -12), type: 'ascetic' },
      { pos: new Vector3(12, 0, -12), type: 'teacher' },
      { pos: new Vector3(0, 0, 18), type: 'meditation' }
    ];

    sadhuPositions.forEach((sadhuData, index) => {
      const sadhu = this.createSadhu(sadhuData.pos, sadhuData.type, index);
      this.sadhus.push(sadhu);
    });
  }

  createSadhu(position, type, index) {
    // Body
    const body = MeshBuilder.CreateCylinder(
      `sadhu_body_${index}`,
      { height: 1.6, diameter: 0.6 },
      this.scene
    );
    body.position = position.clone();
    body.position.y = 0.8;

    // Different colors for different types of sadhus
    const sadhuColors = {
      naga: new Color3(1, 0.8, 0.6),      // Skin color (minimal clothing)
      scholar: new Color3(1, 0.8, 0.2),   // Saffron robes
      ascetic: new Color3(0.6, 0.4, 0.2), // Earth tones
      teacher: new Color3(0.9, 0.9, 0.9), // White robes
      meditation: new Color3(0.8, 0.4, 0.2) // Ochre robes
    };

    const bodyMaterial = new StandardMaterial(`sadhuBodyMaterial_${index}`, this.scene);
    bodyMaterial.diffuseColor = sadhuColors[type];
    body.material = bodyMaterial;

    // Head
    const head = MeshBuilder.CreateSphere(
      `sadhu_head_${index}`,
      { diameter: 0.4 },
      this.scene
    );
    head.position = position.clone();
    head.position.y = 1.7;

    const headMaterial = new StandardMaterial(`sadhuHeadMaterial_${index}`, this.scene);
    headMaterial.diffuseColor = new Color3(0.8, 0.6, 0.4);
    head.material = headMaterial;

    // Add spiritual accessories
    this.addSadhuAccessories(position, type, index);

    // Add spiritual practice animation
    this.addSpiritualAnimation(body, head, type, index);

    return { body: body, head: head, position: position, type: type };
  }

  addSadhuAccessories(position, type, index) {
    if (type === 'scholar') {
      // Books
      const book = MeshBuilder.CreateBox(
        `sadhu_book_${index}`,
        { width: 0.3, height: 0.4, depth: 0.05 },
        this.scene
      );
      book.position = position.clone();
      book.position.y = 0.3;
      book.position.x += 0.5;

      const bookMaterial = new StandardMaterial(`sadhuBookMaterial_${index}`, this.scene);
      bookMaterial.diffuseColor = new Color3(0.6, 0.4, 0.2);
      book.material = bookMaterial;
    }

    if (type === 'ascetic') {
      // Trident
      const trident = MeshBuilder.CreateCylinder(
        `sadhu_trident_${index}`,
        { height: 2, diameter: 0.05 },
        this.scene
      );
      trident.position = position.clone();
      trident.position.y = 1;
      trident.position.x += 0.8;

      const tridentMaterial = new StandardMaterial(`sadhuTridentMaterial_${index}`, this.scene);
      tridentMaterial.diffuseColor = new Color3(0.7, 0.7, 0.8);
      trident.material = tridentMaterial;
    }
  }

  addSpiritualAnimation(body, head, type, index) {
    switch (type) {
      case 'meditation':
        // Gentle breathing animation
        const breatheAnimation = Animation.CreateAndStartAnimation(
          `sadhuBreathe_${index}`,
          body,
          "scaling.y",
          30,
          60,
          1,
          1.05,
          Animation.ANIMATIONLOOPMODE_CYCLE
        );
        break;
      
      case 'teacher':
        // Teaching gesture
        const teachAnimation = Animation.CreateAndStartAnimation(
          `sadhuTeach_${index}`,
          head,
          "rotation.y",
          30,
          120,
          0,
          Math.PI / 6,
          Animation.ANIMATIONLOOPMODE_CYCLE
        );
        break;
      
      default:
        // General prayer animation
        const prayAnimation = Animation.CreateAndStartAnimation(
          `sadhuPray_${index}`,
          body,
          "rotation.y",
          30,
          180,
          0,
          Math.PI / 8,
          Animation.ANIMATIONLOOPMODE_CYCLE
        );
    }
  }

  createTentCity() {
    // Create temporary tent city for pilgrims
    for (let i = 0; i < 20; i++) {
      const tent = this.createTent(
        new Vector3(
          (Math.random() - 0.5) * 50,
          0,
          20 + Math.random() * 20
        ),
        i
      );
      this.tents.push(tent);
    }
  }

  createTent(position, index) {
    const tent = MeshBuilder.CreateCylinder(
      `tent_${index}`,
      { height: 2.5, diameterTop: 3, diameterBottom: 4 },
      this.scene
    );
    tent.position = position.clone();
    tent.position.y = 1.25;

    const tentMaterial = new StandardMaterial(`tentMaterial_${index}`, this.scene);
    const tentColor = this.spiritualColors[index % this.spiritualColors.length];
    tentMaterial.diffuseColor = tentColor;
    tent.material = tentMaterial;

    return tent;
  }

  createSpiritualPractices() {
    // Yoga area
    this.createYogaArea();
    
    // Meditation circle
    this.createMeditationCircle();
    
    // Chanting area
    this.createChantingArea();
    
    // Sacred fire ceremony
    this.createFireCeremony();
  }

  createYogaArea() {
    const yogaArea = MeshBuilder.CreateCylinder(
      "yogaArea",
      { height: 0.1, diameter: 8 },
      this.scene
    );
    yogaArea.position = new Vector3(-20, 0.05, 0);

    const yogaMaterial = new StandardMaterial("yogaAreaMaterial", this.scene);
    yogaMaterial.diffuseColor = new Color3(0.8, 0.9, 0.7);
    yogaArea.material = yogaMaterial;

    // Yoga practitioners
    for (let i = 0; i < 6; i++) {
      const practitioner = MeshBuilder.CreateSphere(
        `yogaPractitioner_${i}`,
        { diameter: 0.5 },
        this.scene
      );
      
      const angle = (i / 6) * Math.PI * 2;
      const x = -20 + Math.cos(angle) * 3;
      const z = Math.sin(angle) * 3;
      practitioner.position = new Vector3(x, 0.25, z);

      const practitionerMaterial = new StandardMaterial(`yogaPractitionerMaterial_${i}`, this.scene);
      practitionerMaterial.diffuseColor = new Color3(1, 0.9, 0.8);
      practitioner.material = practitionerMaterial;
    }

    this.spiritualPractices.push({ type: 'yoga', area: yogaArea });
  }

  createMeditationCircle() {
    const meditationCircle = MeshBuilder.CreateTorus(
      "meditationCircle",
      { diameter: 10, thickness: 0.3 },
      this.scene
    );
    meditationCircle.position = new Vector3(20, 0.15, 0);
    meditationCircle.rotation.x = Math.PI / 2;

    const circleMaterial = new StandardMaterial("meditationCircleMaterial", this.scene);
    circleMaterial.diffuseColor = new Color3(0.8, 0.6, 0.9);
    circleMaterial.emissiveColor = new Color3(0.2, 0.15, 0.25);
    meditationCircle.material = circleMaterial;

    this.spiritualPractices.push({ type: 'meditation', area: meditationCircle });
  }

  createChantingArea() {
    const chantingArea = MeshBuilder.CreateBox(
      "chantingArea",
      { width: 6, height: 0.2, depth: 6 },
      this.scene
    );
    chantingArea.position = new Vector3(0, 0.1, -25);

    const chantMaterial = new StandardMaterial("chantingAreaMaterial", this.scene);
    chantMaterial.diffuseColor = new Color3(1, 0.8, 0.6);
    chantingArea.material = chantMaterial;

    this.spiritualPractices.push({ type: 'chanting', area: chantingArea });
  }

  createFireCeremony() {
    // Sacred fire pit
    const firePit = MeshBuilder.CreateCylinder(
      "sacredFirePit",
      { height: 0.5, diameter: 2 },
      this.scene
    );
    firePit.position = new Vector3(0, 0.25, 25);

    const firePitMaterial = new StandardMaterial("firePitMaterial", this.scene);
    firePitMaterial.diffuseColor = new Color3(0.4, 0.2, 0.1);
    firePit.material = firePitMaterial;

    // Sacred fire
    const fireSystem = new ParticleSystem("sacredFire", 200, this.scene);
    fireSystem.emitter = firePit;
    fireSystem.minEmitBox = new Vector3(-0.5, 0.5, -0.5);
    fireSystem.maxEmitBox = new Vector3(0.5, 1, 0.5);

    fireSystem.color1 = new Color4(1, 0.8, 0.2, 1);
    fireSystem.color2 = new Color4(1, 0.4, 0.1, 1);
    fireSystem.colorDead = new Color4(0.5, 0.2, 0.1, 0);

    fireSystem.minSize = 0.3;
    fireSystem.maxSize = 0.8;
    fireSystem.minLifeTime = 1;
    fireSystem.maxLifeTime = 2;
    fireSystem.emitRate = 100;

    fireSystem.direction1 = new Vector3(-1, 2, -1);
    fireSystem.direction2 = new Vector3(1, 4, 1);

    fireSystem.start();

    this.spiritualPractices.push({ type: 'fire_ceremony', area: firePit, fire: fireSystem });
  }

  setupInteractions() {
    // Setup action manager for the scene
    this.scene.actionManager = new ActionManager(this.scene);

    // Make holy river interactive
    if (this.holyRiver) {
      this.holyRiver.actionManager = new ActionManager(this.scene);
      
      this.holyRiver.actionManager.registerAction(
        new ExecuteCodeAction(ActionManager.OnPickTrigger, () => {
          this.performHolyDip();
        })
      );
    }

    // Make sadhus interactive
    this.sadhus.forEach((sadhu, index) => {
      sadhu.body.actionManager = new ActionManager(this.scene);
      
      sadhu.body.actionManager.registerAction(
        new ExecuteCodeAction(ActionManager.OnPickTrigger, () => {
          this.showSadhuWisdom(sadhu, index);
        })
      );
    });

    // Make akharas interactive
    this.akharas.forEach((akhara, index) => {
      akhara.structure.tent.actionManager = new ActionManager(this.scene);
      
      akhara.structure.tent.actionManager.registerAction(
        new ExecuteCodeAction(ActionManager.OnPickTrigger, () => {
          this.showAkharaInfo(akhara, index);
        })
      );
    });

    // Make spiritual practice areas interactive
    this.spiritualPractices.forEach((practice, index) => {
      practice.area.actionManager = new ActionManager(this.scene);
      
      practice.area.actionManager.registerAction(
        new ExecuteCodeAction(ActionManager.OnPickTrigger, () => {
          this.joinSpiritualPractice(practice);
        })
      );
    });
  }

  performHolyDip() {
    if (this.holyDipActive) return;
    
    this.holyDipActive = true;
    
    // Create splash effect
    this.createSplashEffect();
    
    // Move camera closer to water
    this.animateCameraToWater();
    
    console.log('Taking holy dip in the sacred confluence! May this cleanse all sins and bring spiritual purification.');
    
    // Notify AI Guide
    if (window.app && window.app.aiGuide) {
      window.app.aiGuide.addUserInteraction('performed holy dip in sacred river');
    }
    
    // Record progress
    if (window.app && window.app.progressManager) {
      window.app.progressManager.recordInteraction('kumbh', 'holyDipTaken', true);
    }
    
    setTimeout(() => {
      this.holyDipActive = false;
    }, 3000);
  }

  createSplashEffect() {
    const splashSystem = new ParticleSystem("holyDipSplash", 300, this.scene);
    splashSystem.emitter = new Vector3(0, -0.3, 0);
    splashSystem.minEmitBox = new Vector3(-2, 0, -2);
    splashSystem.maxEmitBox = new Vector3(2, 0.5, 2);

    splashSystem.color1 = new Color4(0.6, 0.8, 1, 0.8);
    splashSystem.color2 = new Color4(0.4, 0.7, 0.9, 0.6);
    splashSystem.colorDead = new Color4(0.3, 0.5, 0.7, 0);

    splashSystem.minSize = 0.2;
    splashSystem.maxSize = 0.6;
    splashSystem.minLifeTime = 1;
    splashSystem.maxLifeTime = 2;
    splashSystem.emitRate = 500;

    splashSystem.direction1 = new Vector3(-3, 2, -3);
    splashSystem.direction2 = new Vector3(3, 5, 3);
    splashSystem.gravity = new Vector3(0, -3, 0);

    splashSystem.start();

    setTimeout(() => {
      splashSystem.stop();
      setTimeout(() => splashSystem.dispose(), 2000);
    }, 500);
  }

  animateCameraToWater() {
    // Animate camera for immersive holy dip experience
    const originalPosition = this.camera.position.clone();
    const originalTarget = this.camera.target.clone();
    
    const waterPosition = new Vector3(0, 2, 5);
    const waterTarget = new Vector3(0, -0.5, 0);
    
    const positionAnimation = Animation.CreateAndStartAnimation(
      "holyDipCameraPosition",
      this.camera,
      "position",
      30,
      90,
      originalPosition,
      waterPosition,
      Animation.ANIMATIONLOOPMODE_CONSTANT
    );
    
    const targetAnimation = Animation.CreateAndStartAnimation(
      "holyDipCameraTarget",
      this.camera,
      "target",
      30,
      90,
      originalTarget,
      waterTarget,
      Animation.ANIMATIONLOOPMODE_CONSTANT
    );
    
    // Return to original position
    setTimeout(() => {
      Animation.CreateAndStartAnimation(
        "holyDipCameraReturn",
        this.camera,
        "position",
        30,
        90,
        this.camera.position.clone(),
        originalPosition,
        Animation.ANIMATIONLOOPMODE_CONSTANT
      );
      
      Animation.CreateAndStartAnimation(
        "holyDipCameraTargetReturn",
        this.camera,
        "target",
        30,
        90,
        this.camera.target.clone(),
        originalTarget,
        Animation.ANIMATIONLOOPMODE_CONSTANT
      );
    }, 3000);
  }

  showSadhuWisdom(sadhu, index) {
    const wisdom = {
      naga: 'Naga Sadhu: "Renunciation of material possessions leads to spiritual liberation. The body is temporary, the soul is eternal."',
      scholar: 'Vedic Scholar: "Knowledge is the light that dispels the darkness of ignorance. Study the scriptures with devotion."',
      ascetic: 'Ascetic: "Through austerity and self-discipline, one transcends worldly desires and attains inner peace."',
      teacher: 'Spiritual Teacher: "The path to enlightenment is through selfless service and love for all beings."',
      meditation: 'Meditation Master: "In silence, the mind finds its true nature. Meditate regularly to know your inner self."'
    };
    
    console.log(`Spiritual Wisdom: ${wisdom[sadhu.type]}`);
    
    // Show cultural info through UI Manager
    if (window.app && window.app.uiManager) {
      window.app.uiManager.showCulturalInfo('kumbh', sadhu.type);
    }
  }

  showAkharaInfo(akhara, index) {
    const akharaInfo = {
      'Juna Akhara': 'The oldest and largest akhara, known for its Naga sadhus and ancient traditions.',
      'Niranjani Akhara': 'Focuses on the worship of Lord Vishnu and promotes devotional practices.',
      'Mahanirvani Akhara': 'Emphasizes the path of knowledge and philosophical discussions.',
      'Atal Akhara': 'Known for its disciplined practices and warrior-monk traditions.'
    };
    
    console.log(`${akhara.name}: ${akharaInfo[akhara.name]}`);
    
    // Notify AI Guide
    if (window.app && window.app.aiGuide) {
      window.app.aiGuide.addUserInteraction(`learned about ${akhara.name}`);
    }
  }

  joinSpiritualPractice(practice) {
    this.currentPractice = practice.type;
    
    const practiceInfo = {
      yoga: 'Joining yoga session: Practice asanas to unite body, mind, and spirit.',
      meditation: 'Entering meditation circle: Find inner peace through mindful awareness.',
      chanting: 'Participating in chanting: Sacred sounds that purify the mind and heart.',
      fire_ceremony: 'Witnessing fire ceremony: Sacred offerings to the divine through Agni.'
    };
    
    console.log(`Spiritual Practice: ${practiceInfo[practice.type]}`);
    
    // Add visual effect to show participation
    practice.area.material.emissiveColor = new Color3(0.3, 0.3, 0.3);
    setTimeout(() => {
      practice.area.material.emissiveColor = new Color3(0, 0, 0);
    }, 2000);
    
    // Record progress
    if (window.app && window.app.progressManager) {
      window.app.progressManager.recordInteraction('kumbh', 'spiritualPracticeJoined', 1);
    }
  }

  dispose() {
    // Clean up all Kumbh Mela scene objects
    if (this.holyRiver) this.holyRiver.dispose();
    
    this.ghats.forEach(ghat => ghat.dispose());
    
    this.pilgrims.forEach(pilgrim => {
      pilgrim.body.dispose();
      pilgrim.head.dispose();
    });

    this.akharas.forEach(akhara => {
      Object.values(akhara.structure).forEach(part => part.dispose());
    });

    this.sadhus.forEach(sadhu => {
      sadhu.body.dispose();
      sadhu.head.dispose();
    });

    this.tents.forEach(tent => tent.dispose());

    this.spiritualPractices.forEach(practice => {
      practice.area.dispose();
      if (practice.fire) practice.fire.dispose();
    });

    // Remove Kumbh-specific lights
    const kumbhLights = this.scene.lights.filter(light => 
      light.name.includes('kumbh')
    );
    
    kumbhLights.forEach(light => light.dispose());

    console.log('Kumbh Mela scene disposed');
  }
}
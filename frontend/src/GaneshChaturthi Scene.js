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

export class GaneshChaturthiScene {
  constructor(scene, camera) {
    this.scene = scene;
    this.camera = camera;
    this.ganeshIdol = null;
    this.decorations = [];
    this.processionRoute = [];
    this.modakStation = null;
    this.musicInstruments = [];
    this.immersionSetup = null;
    this.ecoFriendlyOptions = [];
    this.devotees = [];
    this.isLoaded = false;
    this.processionActive = false;
    
    // Ganesh festival colors
    this.festivalColors = [
      new Color3(1, 0.8, 0.2),    // Golden
      new Color3(1, 0.4, 0.1),    // Orange
      new Color3(0.8, 0.2, 0.2),  // Red
      new Color3(0.2, 0.8, 0.2),  // Green
      new Color3(0.6, 0.3, 0.8)   // Purple
    ];
  }

  async create() {
    try {
      // Set Ganesh Chaturthi atmosphere
      this.setupAtmosphere();
      
      // Create elaborate Ganesha idol
      this.createGaneshIdol();
      
      // Create decorations
      this.createDecorations();
      
      // Create procession route
      this.createProcessionRoute();
      
      // Create modak preparation station
      this.createModakStation();
      
      // Create music instruments (dhol-tasha)
      this.createMusicInstruments();
      
      // Create immersion ceremony setup
      this.createImmersionSetup();
      
      // Create eco-friendly options
      this.createEcoFriendlyOptions();
      
      // Create devotees
      this.createDevotees();
      
      // Setup interactions
      this.setupInteractions();
      
      this.isLoaded = true;
      console.log('Ganesh Chaturthi scene created successfully');
      
    } catch (error) {
      console.error('Error creating Ganesh Chaturthi scene:', error);
    }
  }

  setupAtmosphere() {
    // Bright festive atmosphere
    this.scene.clearColor = new Color4(0.95, 0.9, 0.8, 1.0);
    
    // Warm sunlight
    const sunLight = new DirectionalLight(
      "ganeshSun",
      new Vector3(-0.5, -1, -0.3),
      this.scene
    );
    sunLight.intensity = 1.1;
    sunLight.diffuse = new Color3(1, 0.95, 0.8);
    
    // Ambient light
    const ambientLight = new HemisphericLight(
      "ganeshAmbient",
      new Vector3(0, 1, 0),
      this.scene
    );
    ambientLight.intensity = 0.7;
    ambientLight.diffuse = new Color3(1, 0.9, 0.7);
  }

  createGaneshIdol() {
    // Idol base/platform
    const platform = MeshBuilder.CreateCylinder(
      "ganeshPlatform",
      { height: 1, diameter: 6 },
      this.scene
    );
    platform.position = new Vector3(0, 0.5, -8);

    const platformMaterial = new StandardMaterial("platformMaterial", this.scene);
    platformMaterial.diffuseColor = new Color3(0.9, 0.8, 0.6);
    platformMaterial.specularColor = new Color3(0.3, 0.3, 0.3);
    platform.material = platformMaterial;

    // Main Ganesha body
    const ganeshBody = MeshBuilder.CreateSphere(
      "ganeshBody",
      { diameter: 3 },
      this.scene
    );
    ganeshBody.position = new Vector3(0, 2.5, -8);
    ganeshBody.scaling.y = 1.2;

    const bodyMaterial = new StandardMaterial("ganeshBodyMaterial", this.scene);
    bodyMaterial.diffuseColor = new Color3(1, 0.8, 0.6);
    bodyMaterial.emissiveColor = new Color3(0.1, 0.08, 0.06);
    ganeshBody.material = bodyMaterial;

    // Ganesha head (elephant head)
    const ganeshHead = MeshBuilder.CreateSphere(
      "ganeshHead",
      { diameter: 2.5 },
      this.scene
    );
    ganeshHead.position = new Vector3(0, 4.2, -8);

    const headMaterial = new StandardMaterial("ganeshHeadMaterial", this.scene);
    headMaterial.diffuseColor = new Color3(1, 0.8, 0.6);
    headMaterial.emissiveColor = new Color3(0.1, 0.08, 0.06);
    ganeshHead.material = headMaterial;

    // Trunk
    const trunk = MeshBuilder.CreateCylinder(
      "ganeshTrunk",
      { height: 1.5, diameterTop: 0.3, diameterBottom: 0.5 },
      this.scene
    );
    trunk.position = new Vector3(0.5, 3.5, -7);
    trunk.rotation.z = Math.PI / 6;
    trunk.material = headMaterial;

    // Ears
    const leftEar = MeshBuilder.CreateSphere(
      "ganeshLeftEar",
      { diameter: 1.2 },
      this.scene
    );
    leftEar.position = new Vector3(-1.2, 4.2, -8);
    leftEar.scaling.z = 0.3;
    leftEar.material = headMaterial;

    const rightEar = MeshBuilder.CreateSphere(
      "ganeshRightEar",
      { diameter: 1.2 },
      this.scene
    );
    rightEar.position = new Vector3(1.2, 4.2, -8);
    rightEar.scaling.z = 0.3;
    rightEar.material = headMaterial;

    // Crown
    const crown = MeshBuilder.CreateCylinder(
      "ganeshCrown",
      { height: 0.8, diameterTop: 2, diameterBottom: 2.2 },
      this.scene
    );
    crown.position = new Vector3(0, 5.2, -8);

    const crownMaterial = new StandardMaterial("crownMaterial", this.scene);
    crownMaterial.diffuseColor = new Color3(1, 0.8, 0.2);
    crownMaterial.emissiveColor = new Color3(0.3, 0.2, 0.05);
    crown.material = crownMaterial;

    // Decorative elements
    this.createIdolDecorations();
    
    this.ganeshIdol = {
      platform: platform,
      body: ganeshBody,
      head: ganeshHead,
      trunk: trunk,
      leftEar: leftEar,
      rightEar: rightEar,
      crown: crown
    };
  }

  createIdolDecorations() {
    // Flower garlands around the idol
    for (let i = 0; i < 20; i++) {
      const angle = (i / 20) * Math.PI * 2;
      const radius = 4;
      const x = Math.cos(angle) * radius;
      const z = -8 + Math.sin(angle) * radius;
      
      const flower = MeshBuilder.CreateSphere(
        `idolFlower_${i}`,
        { diameter: 0.2 },
        this.scene
      );
      flower.position = new Vector3(x, 1.5 + Math.sin(i * 0.5) * 0.3, z);

      const flowerMaterial = new StandardMaterial(`idolFlowerMaterial_${i}`, this.scene);
      const color = this.festivalColors[i % this.festivalColors.length];
      flowerMaterial.diffuseColor = color;
      flowerMaterial.emissiveColor = color.scale(0.2);
      flower.material = flowerMaterial;
    }

    // Decorative lights
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2;
      const radius = 5;
      const x = Math.cos(angle) * radius;
      const z = -8 + Math.sin(angle) * radius;
      
      const light = MeshBuilder.CreateSphere(
        `decorLight_${i}`,
        { diameter: 0.3 },
        this.scene
      );
      light.position = new Vector3(x, 3, z);

      const lightMaterial = new StandardMaterial(`decorLightMaterial_${i}`, this.scene);
      lightMaterial.diffuseColor = new Color3(1, 1, 0.2);
      lightMaterial.emissiveColor = new Color3(0.8, 0.8, 0.1);
      light.material = lightMaterial;

      // Add point light
      const pointLight = new PointLight(
        `decorPointLight_${i}`,
        light.position.clone(),
        this.scene
      );
      pointLight.diffuse = new Color3(1, 1, 0.2);
      pointLight.intensity = 0.4;
      pointLight.range = 6;
    }
  }

  createDecorations() {
    // Pandal decorations
    this.createPandalDecorations();
    
    // Rangoli at the base
    this.createGaneshRangoli();
    
    // Festival banners
    this.createFestivalBanners();
  }

  createPandalDecorations() {
    // Decorative arch
    const arch = MeshBuilder.CreateTorus(
      "decorativeArch",
      { diameter: 12, thickness: 0.5 },
      this.scene
    );
    arch.position = new Vector3(0, 6, -8);
    arch.rotation.x = Math.PI / 2;

    const archMaterial = new StandardMaterial("archMaterial", this.scene);
    archMaterial.diffuseColor = new Color3(1, 0.6, 0.2);
    archMaterial.emissiveColor = new Color3(0.3, 0.15, 0.05);
    arch.material = archMaterial;

    // Hanging decorations
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const x = Math.cos(angle) * 6;
      const z = -8 + Math.sin(angle) * 6;
      
      const decoration = MeshBuilder.CreateSphere(
        `hangingDecor_${i}`,
        { diameter: 0.5 },
        this.scene
      );
      decoration.position = new Vector3(x, 5, z);

      const decorMaterial = new StandardMaterial(`hangingDecorMaterial_${i}`, this.scene);
      const color = this.festivalColors[i % this.festivalColors.length];
      decorMaterial.diffuseColor = color;
      decorMaterial.emissiveColor = color.scale(0.3);
      decoration.material = decorMaterial;
    }
  }

  createGaneshRangoli() {
    const rangoli = MeshBuilder.CreateCylinder(
      "ganeshRangoli",
      { height: 0.02, diameter: 8 },
      this.scene
    );
    rangoli.position = new Vector3(0, 0.01, -8);

    // Create rangoli texture with Ganesha motifs
    const rangoliTexture = new DynamicTexture(
      "ganeshRangoliTexture",
      { width: 512, height: 512 },
      this.scene
    );

    const ctx = rangoliTexture.getContext();
    
    // Background
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(0, 0, 512, 512);

    // Draw lotus petals
    const centerX = 256;
    const centerY = 256;
    
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const x = centerX + Math.cos(angle) * 150;
      const y = centerY + Math.sin(angle) * 150;
      
      ctx.fillStyle = '#FFD700';
      ctx.beginPath();
      ctx.ellipse(x, y, 40, 20, angle, 0, 2 * Math.PI);
      ctx.fill();
    }

    // Center Om symbol (simplified)
    ctx.fillStyle = '#FF6B35';
    ctx.font = '60px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('ॐ', centerX, centerY + 20);

    rangoliTexture.update();

    const rangoliMaterial = new StandardMaterial("ganeshRangoliMaterial", this.scene);
    rangoliMaterial.diffuseTexture = rangoliTexture;
    rangoliMaterial.emissiveColor = new Color3(0.2, 0.15, 0.1);
    rangoli.material = rangoliMaterial;
  }

  createFestivalBanners() {
    const bannerTexts = ['गणेश चतुर्थी', 'Ganesh Chaturthi', 'गणपति बप्पा मोरया'];
    
    bannerTexts.forEach((text, index) => {
      const banner = MeshBuilder.CreateBox(
        `ganeshBanner_${index}`,
        { width: 8, height: 2, depth: 0.1 },
        this.scene
      );
      banner.position = new Vector3((index - 1) * 10, 8, 5);

      const bannerMaterial = new StandardMaterial(`ganeshBannerMaterial_${index}`, this.scene);
      bannerMaterial.diffuseColor = this.festivalColors[index];
      bannerMaterial.emissiveColor = bannerMaterial.diffuseColor.scale(0.3);
      banner.material = bannerMaterial;
    });
  }

  createProcessionRoute() {
    // Create a path for the procession
    const pathPoints = [
      new Vector3(-15, 0, -8),
      new Vector3(-10, 0, -5),
      new Vector3(-5, 0, 0),
      new Vector3(0, 0, 5),
      new Vector3(5, 0, 10),
      new Vector3(10, 0, 15),
      new Vector3(15, 0, 18)
    ];

    pathPoints.forEach((point, index) => {
      const pathMarker = MeshBuilder.CreateCylinder(
        `pathMarker_${index}`,
        { height: 0.2, diameter: 1 },
        this.scene
      );
      pathMarker.position = point.clone();
      pathMarker.position.y = 0.1;

      const markerMaterial = new StandardMaterial(`pathMarkerMaterial_${index}`, this.scene);
      markerMaterial.diffuseColor = new Color3(1, 0.8, 0.2);
      markerMaterial.emissiveColor = new Color3(0.3, 0.2, 0.05);
      pathMarker.material = markerMaterial;

      this.processionRoute.push(pathMarker);
    });
  }

  createModakStation() {
    // Modak preparation area
    const station = MeshBuilder.CreateBox(
      "modakStation",
      { width: 4, height: 1, depth: 3 },
      this.scene
    );
    station.position = new Vector3(12, 0.5, -5);

    const stationMaterial = new StandardMaterial("modakStationMaterial", this.scene);
    stationMaterial.diffuseColor = new Color3(0.6, 0.4, 0.2);
    station.material = stationMaterial;

    // Modaks (sweet dumplings)
    for (let i = 0; i < 12; i++) {
      const modak = MeshBuilder.CreateSphere(
        `modak_${i}`,
        { diameter: 0.3 },
        this.scene
      );
      modak.position = new Vector3(
        12 + (i % 4 - 1.5) * 0.5,
        1.2,
        -5 + Math.floor(i / 4 - 1) * 0.5
      );
      modak.scaling.y = 1.3; // Make them more dumpling-shaped

      const modakMaterial = new StandardMaterial(`modakMaterial_${i}`, this.scene);
      modakMaterial.diffuseColor = new Color3(1, 0.9, 0.7);
      modakMaterial.emissiveColor = new Color3(0.2, 0.18, 0.14);
      modak.material = modakMaterial;
    }

    this.modakStation = station;
  }

  createMusicInstruments() {
    // Dhol (drum)
    const dhol = MeshBuilder.CreateCylinder(
      "dhol",
      { height: 1.5, diameter: 1.2 },
      this.scene
    );
    dhol.position = new Vector3(-8, 0.75, 5);

    const dholMaterial = new StandardMaterial("dholMaterial", this.scene);
    dholMaterial.diffuseColor = new Color3(0.6, 0.3, 0.1);
    dhol.material = dholMaterial;

    // Tasha (smaller drum)
    const tasha = MeshBuilder.CreateCylinder(
      "tasha",
      { height: 0.8, diameter: 0.8 },
      this.scene
    );
    tasha.position = new Vector3(-6, 0.4, 5);

    const tashaMaterial = new StandardMaterial("tashaMaterial", this.scene);
    tashaMaterial.diffuseColor = new Color3(0.7, 0.4, 0.2);
    tasha.material = tashaMaterial;

    // Manjira (cymbals)
    for (let i = 0; i < 4; i++) {
      const manjira = MeshBuilder.CreateCylinder(
        `manjira_${i}`,
        { height: 0.1, diameter: 0.4 },
        this.scene
      );
      manjira.position = new Vector3(-4 + i * 0.5, 0.5, 5);

      const manjiraMaterial = new StandardMaterial(`manjiraMaterial_${i}`, this.scene);
      manjiraMaterial.diffuseColor = new Color3(0.8, 0.7, 0.2);
      manjiraMaterial.emissiveColor = new Color3(0.2, 0.15, 0.05);
      manjira.material = manjiraMaterial;

      this.musicInstruments.push(manjira);
    }

    this.musicInstruments.push(dhol, tasha);
  }

  createImmersionSetup() {
    // Water body for immersion
    const waterBody = MeshBuilder.CreateBox(
      "immersionWater",
      { width: 12, height: 1, depth: 8 },
      this.scene
    );
    waterBody.position = new Vector3(0, 0.5, 20);

    const waterMaterial = new StandardMaterial("immersionWaterMaterial", this.scene);
    waterMaterial.diffuseColor = new Color3(0.2, 0.5, 0.8);
    waterMaterial.specularColor = new Color3(0.5, 0.8, 1);
    waterMaterial.alpha = 0.7;
    waterBody.material = waterMaterial;

    // Ghat steps
    for (let i = 0; i < 5; i++) {
      const step = MeshBuilder.CreateBox(
        `ghatStep_${i}`,
        { width: 10, height: 0.3, depth: 1.5 },
        this.scene
      );
      step.position = new Vector3(0, i * 0.3, 16 + i * 1.5);

      const stepMaterial = new StandardMaterial(`ghatStepMaterial_${i}`, this.scene);
      stepMaterial.diffuseColor = new Color3(0.7, 0.6, 0.5);
      step.material = stepMaterial;
    }

    this.immersionSetup = waterBody;
  }

  createEcoFriendlyOptions() {
    // Eco-friendly idol display
    const ecoIdol = MeshBuilder.CreateSphere(
      "ecoFriendlyIdol",
      { diameter: 1.5 },
      this.scene
    );
    ecoIdol.position = new Vector3(-12, 1, -2);

    const ecoMaterial = new StandardMaterial("ecoIdolMaterial", this.scene);
    ecoMaterial.diffuseColor = new Color3(0.6, 0.8, 0.4);
    ecoMaterial.emissiveColor = new Color3(0.1, 0.15, 0.08);
    ecoIdol.material = ecoMaterial;

    // Information board
    const infoBoard = MeshBuilder.CreateBox(
      "ecoInfoBoard",
      { width: 3, height: 2, depth: 0.1 },
      this.scene
    );
    infoBoard.position = new Vector3(-12, 2, 0);

    const boardMaterial = new StandardMaterial("ecoInfoBoardMaterial", this.scene);
    boardMaterial.diffuseColor = new Color3(0.2, 0.6, 0.2);
    boardMaterial.emissiveColor = new Color3(0.05, 0.15, 0.05);
    infoBoard.material = boardMaterial;

    this.ecoFriendlyOptions.push(ecoIdol, infoBoard);
  }

  createDevotees() {
    const devoteePositions = [
      new Vector3(-3, 0, -5), new Vector3(3, 0, -5),
      new Vector3(-2, 0, -3), new Vector3(2, 0, -3),
      new Vector3(-4, 0, -1), new Vector3(4, 0, -1),
      new Vector3(0, 0, -2)
    ];

    devoteePositions.forEach((position, index) => {
      const devotee = this.createDevotee(position, index);
      this.devotees.push(devotee);
    });
  }

  createDevotee(position, index) {
    // Body
    const body = MeshBuilder.CreateCylinder(
      `devotee_body_${index}`,
      { height: 1.6, diameter: 0.6 },
      this.scene
    );
    body.position = position.clone();
    body.position.y = 0.8;

    const bodyMaterial = new StandardMaterial(`devoteeBodyMaterial_${index}`, this.scene);
    bodyMaterial.diffuseColor = new Color3(1, 0.9, 0.7);
    body.material = bodyMaterial;

    // Head
    const head = MeshBuilder.CreateSphere(
      `devotee_head_${index}`,
      { diameter: 0.4 },
      this.scene
    );
    head.position = position.clone();
    head.position.y = 1.7;

    const headMaterial = new StandardMaterial(`devoteeHeadMaterial_${index}`, this.scene);
    headMaterial.diffuseColor = new Color3(0.8, 0.6, 0.4);
    head.material = headMaterial;

    // Prayer animation
    this.addPrayerAnimation(body, head, index);

    return { body: body, head: head, position: position };
  }

  addPrayerAnimation(body, head, index) {
    // Gentle swaying motion
    const swayAnimation = Animation.CreateAndStartAnimation(
      `devoteeSwayAnimation_${index}`,
      body,
      "rotation.y",
      30,
      120,
      0,
      Math.PI / 8,
      Animation.ANIMATIONLOOPMODE_CYCLE
    );

    // Head movement
    const headSwayAnimation = Animation.CreateAndStartAnimation(
      `devoteeHeadSwayAnimation_${index}`,
      head,
      "rotation.y",
      30,
      120,
      0,
      Math.PI / 8,
      Animation.ANIMATIONLOOPMODE_CYCLE
    );
  }

  setupInteractions() {
    // Setup action manager for the scene
    this.scene.actionManager = new ActionManager(this.scene);

    // Make Ganesh idol interactive
    if (this.ganeshIdol) {
      this.ganeshIdol.head.actionManager = new ActionManager(this.scene);
      
      this.ganeshIdol.head.actionManager.registerAction(
        new ExecuteCodeAction(ActionManager.OnPickTrigger, () => {
          this.showGaneshInfo();
        })
      );
    }

    // Make modak station interactive
    if (this.modakStation) {
      this.modakStation.actionManager = new ActionManager(this.scene);
      
      this.modakStation.actionManager.registerAction(
        new ExecuteCodeAction(ActionManager.OnPickTrigger, () => {
          this.showModakInfo();
        })
      );
    }

    // Make music instruments interactive
    this.musicInstruments.forEach((instrument, index) => {
      instrument.actionManager = new ActionManager(this.scene);
      
      instrument.actionManager.registerAction(
        new ExecuteCodeAction(ActionManager.OnPickTrigger, () => {
          this.playInstrument(instrument, index);
        })
      );
    });

    // Make eco-friendly options interactive
    this.ecoFriendlyOptions.forEach((option, index) => {
      option.actionManager = new ActionManager(this.scene);
      
      option.actionManager.registerAction(
        new ExecuteCodeAction(ActionManager.OnPickTrigger, () => {
          this.showEcoInfo();
        })
      );
    });
  }

  showGaneshInfo() {
    console.log('Lord Ganesha: The remover of obstacles and patron of arts and sciences. Ganesh Chaturthi celebrates his birth and wisdom.');
    
    // Show cultural info through UI Manager
    if (window.app && window.app.uiManager) {
      window.app.uiManager.showCulturalInfo('ganesh', 'idol');
    }
  }

  showModakInfo() {
    console.log('Modak: Lord Ganesha\'s favorite sweet, made from rice flour and jaggery. Offering modaks is believed to bring prosperity and remove obstacles.');
    
    // Notify AI Guide
    if (window.app && window.app.aiGuide) {
      window.app.aiGuide.addUserInteraction('learned about modak preparation');
    }
  }

  playInstrument(instrument, index) {
    // Create visual effect for playing instrument
    instrument.scaling = new Vector3(1.1, 1.1, 1.1);
    
    setTimeout(() => {
      instrument.scaling = new Vector3(1, 1, 1);
    }, 200);
    
    console.log(`Playing ${instrument.name}: Traditional music instrument used in Ganesh processions`);
    
    // Notify AI Guide
    if (window.app && window.app.aiGuide) {
      window.app.aiGuide.addUserInteraction('played traditional music instrument');
    }
  }

  showEcoInfo() {
    console.log('Eco-friendly Ganesha: Made from natural clay and organic colors, these idols dissolve harmlessly in water, protecting our environment.');
    
    // Show cultural info through UI Manager
    if (window.app && window.app.uiManager) {
      window.app.uiManager.showCulturalInfo('ganesh', 'eco');
    }
  }

  startProcession() {
    if (this.processionActive) return;
    
    this.processionActive = true;
    
    // Animate devotees along the procession route
    this.devotees.forEach((devotee, index) => {
      const targetPosition = this.processionRoute[Math.min(index, this.processionRoute.length - 1)].position.clone();
      targetPosition.y = devotee.position.y;
      
      const moveAnimation = Animation.CreateAndStartAnimation(
        `processionMove_${index}`,
        devotee.body,
        "position",
        30,
        180,
        devotee.body.position.clone(),
        targetPosition,
        Animation.ANIMATIONLOOPMODE_CONSTANT
      );
      
      const headMoveAnimation = Animation.CreateAndStartAnimation(
        `processionHeadMove_${index}`,
        devotee.head,
        "position",
        30,
        180,
        devotee.head.position.clone(),
        new Vector3(targetPosition.x, targetPosition.y + 0.9, targetPosition.z),
        Animation.ANIMATIONLOOPMODE_CONSTANT
      );
    });
    
    console.log('Ganesh procession started! Ganpati Bappa Morya!');
    
    // Notify AI Guide
    if (window.app && window.app.aiGuide) {
      window.app.aiGuide.addUserInteraction('started Ganesh procession');
    }
  }

  performImmersion() {
    if (!this.ganeshIdol) return;
    
    // Animate idol moving towards water
    const immersionAnimation = Animation.CreateAndStartAnimation(
      "ganeshImmersion",
      this.ganeshIdol.platform,
      "position",
      30,
      120,
      this.ganeshIdol.platform.position.clone(),
      new Vector3(0, 0.5, 20),
      Animation.ANIMATIONLOOPMODE_CONSTANT
    );
    
    // Animate other parts of the idol
    Object.values(this.ganeshIdol).forEach((part, index) => {
      if (part !== this.ganeshIdol.platform) {
        setTimeout(() => {
          const partAnimation = Animation.CreateAndStartAnimation(
            `ganeshImmersionPart_${index}`,
            part,
            "position.z",
            30,
            120,
            part.position.z,
            20,
            Animation.ANIMATIONLOOPMODE_CONSTANT
          );
        }, index * 100);
      }
    });
    
    console.log('Ganesh immersion ceremony: Ganpati Bappa Morya, Mangal Murti Morya!');
    
    // Record progress
    if (window.app && window.app.progressManager) {
      window.app.progressManager.recordInteraction('ganesh', 'immersionPerformed', true);
    }
  }

  dispose() {
    // Clean up all Ganesh Chaturthi scene objects
    if (this.ganeshIdol) {
      Object.values(this.ganeshIdol).forEach(part => part.dispose());
    }

    this.decorations.forEach(decoration => decoration.dispose());
    this.processionRoute.forEach(marker => marker.dispose());
    
    if (this.modakStation) this.modakStation.dispose();
    
    this.musicInstruments.forEach(instrument => instrument.dispose());
    
    if (this.immersionSetup) this.immersionSetup.dispose();
    
    this.ecoFriendlyOptions.forEach(option => option.dispose());
    
    this.devotees.forEach(devotee => {
      devotee.body.dispose();
      devotee.head.dispose();
    });

    // Remove Ganesh-specific lights
    const ganeshLights = this.scene.lights.filter(light => 
      light.name.includes('ganesh') || 
      light.name.includes('decor')
    );
    
    ganeshLights.forEach(light => light.dispose());

    console.log('Ganesh Chaturthi scene disposed');
  }
}
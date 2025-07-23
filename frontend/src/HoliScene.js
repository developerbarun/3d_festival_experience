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
  SphereParticleEmitter,
  BoxParticleEmitter,
  ConeParticleEmitter
} from '@babylonjs/core';

export class HoliScene {
  constructor(scene, camera) {
    this.scene = scene;
    this.camera = camera;
    this.people = [];
    this.colorPiles = [];
    this.waterGuns = [];
    this.bonfire = null;
    this.sweetStalls = [];
    this.colorParticleSystems = [];
    this.isLoaded = false;
    this.activeColorThrow = null;
    this.coloredSurfaces = new Map();
    
    // Holi colors
    this.holiColors = [
      { name: 'Pink', color: new Color3(1, 0.2, 0.5), powder: new Color4(1, 0.2, 0.5, 0.8) },
      { name: 'Yellow', color: new Color3(1, 1, 0.2), powder: new Color4(1, 1, 0.2, 0.8) },
      { name: 'Green', color: new Color3(0.2, 1, 0.3), powder: new Color4(0.2, 1, 0.3, 0.8) },
      { name: 'Blue', color: new Color3(0.2, 0.4, 1), powder: new Color4(0.2, 0.4, 1, 0.8) },
      { name: 'Purple', color: new Color3(0.7, 0.2, 1), powder: new Color4(0.7, 0.2, 1, 0.8) },
      { name: 'Orange', color: new Color3(1, 0.5, 0.1), powder: new Color4(1, 0.5, 0.1, 0.8) },
      { name: 'Red', color: new Color3(1, 0.1, 0.2), powder: new Color4(1, 0.1, 0.2, 0.8) }
    ];
  }

  async create() {
    try {
      // Set Holi atmosphere
      this.setupAtmosphere();
      
      // Create courtyard architecture
      this.createCourtyard();
      
      // Create people in white clothes
      this.createPeople();
      
      // Create color powder piles
      this.createColorPiles();
      
      // Create water guns and balloons
      this.createWaterElements();
      
      // Create Holika Dahan bonfire
      this.createBonfire();
      
      // Create sweet stalls
      this.createSweetStalls();
      
      // Setup color throwing mechanics
      this.setupColorThrowingMechanics();
      
      // Create ambient color effects
      this.createAmbientColorEffects();
      
      // Setup interactions
      this.setupInteractions();
      
      this.isLoaded = true;
      console.log('Holi scene created successfully');
      
    } catch (error) {
      console.error('Error creating Holi scene:', error);
    }
  }

  setupAtmosphere() {
    // Bright, festive atmosphere
    this.scene.clearColor = new Color4(0.9, 0.95, 1.0, 1.0);
    
    // Bright sunlight
    const sunLight = new DirectionalLight(
      "holiSun",
      new Vector3(-0.5, -1, -0.3),
      this.scene
    );
    sunLight.intensity = 1.2;
    sunLight.diffuse = new Color3(1, 0.95, 0.8);
    
    // Warm ambient light
    const ambientLight = new HemisphericLight(
      "holiAmbient",
      new Vector3(0, 1, 0),
      this.scene
    );
    ambientLight.intensity = 0.8;
    ambientLight.diffuse = new Color3(1, 0.9, 0.8);
  }

  createCourtyard() {
    // Main courtyard ground
    const courtyard = MeshBuilder.CreateGround(
      "courtyard",
      { width: 40, height: 40 },
      this.scene
    );
    
    const courtyardMaterial = new StandardMaterial("courtyardMaterial", this.scene);
    courtyardMaterial.diffuseColor = new Color3(0.9, 0.85, 0.7);
    courtyardMaterial.specularColor = new Color3(0.1, 0.1, 0.1);
    courtyard.material = courtyardMaterial;

    // Traditional buildings around courtyard
    this.createTraditionalBuildings();
    
    // Decorative arches
    this.createDecorativeArches();
  }

  createTraditionalBuildings() {
    const buildingPositions = [
      { pos: new Vector3(-18, 0, -15), width: 8, height: 8, depth: 4 },
      { pos: new Vector3(18, 0, -15), width: 8, height: 8, depth: 4 },
      { pos: new Vector3(-18, 0, 15), width: 8, height: 8, depth: 4 },
      { pos: new Vector3(18, 0, 15), width: 8, height: 8, depth: 4 }
    ];

    buildingPositions.forEach((building, index) => {
      // Main structure
      const structure = MeshBuilder.CreateBox(
        `building_${index}`,
        { width: building.width, height: building.height, depth: building.depth },
        this.scene
      );
      structure.position = building.pos.clone();
      structure.position.y = building.height / 2;

      const buildingMaterial = new StandardMaterial(`buildingMaterial_${index}`, this.scene);
      buildingMaterial.diffuseColor = new Color3(0.95, 0.9, 0.8);
      structure.material = buildingMaterial;

      // Colorful decorations
      this.addBuildingDecorations(structure, index);
    });
  }

  addBuildingDecorations(building, index) {
    const decorationColors = this.holiColors;
    
    // Add colorful banners
    for (let i = 0; i < 3; i++) {
      const banner = MeshBuilder.CreateBox(
        `banner_${index}_${i}`,
        { width: 0.1, height: 2, depth: 6 },
        this.scene
      );
      banner.position = building.position.clone();
      banner.position.x += (i - 1) * 2;
      banner.position.y += 2;
      
      const bannerMaterial = new StandardMaterial(`bannerMaterial_${index}_${i}`, this.scene);
      const color = decorationColors[i % decorationColors.length].color;
      bannerMaterial.diffuseColor = color;
      bannerMaterial.emissiveColor = color.scale(0.2);
      banner.material = bannerMaterial;
    }
  }

  createDecorativeArches() {
    const archPositions = [
      new Vector3(0, 0, -18),
      new Vector3(0, 0, 18),
      new Vector3(-18, 0, 0),
      new Vector3(18, 0, 0)
    ];

    archPositions.forEach((position, index) => {
      const arch = MeshBuilder.CreateTorus(
        `arch_${index}`,
        { diameter: 8, thickness: 0.5 },
        this.scene
      );
      arch.position = position.clone();
      arch.position.y = 4;
      arch.rotation.x = Math.PI / 2;
      
      const archMaterial = new StandardMaterial(`archMaterial_${index}`, this.scene);
      archMaterial.diffuseColor = new Color3(1, 0.8, 0.3);
      archMaterial.emissiveColor = new Color3(0.3, 0.2, 0.1);
      arch.material = archMaterial;
    });
  }

  createPeople() {
    const peoplePositions = [
      new Vector3(-8, 0, -5), new Vector3(-3, 0, -8), new Vector3(5, 0, -3),
      new Vector3(8, 0, 6), new Vector3(-6, 0, 8), new Vector3(3, 0, 10),
      new Vector3(-10, 0, 2), new Vector3(12, 0, -8), new Vector3(0, 0, -12),
      new Vector3(-15, 0, -2), new Vector3(15, 0, 4), new Vector3(2, 0, 15)
    ];

    peoplePositions.forEach((position, index) => {
      const person = this.createPerson(position, index);
      this.people.push(person);
    });
  }

  createPerson(position, index) {
    const personGroup = {
      body: null,
      head: null,
      position: position,
      originalColor: new Color3(0.95, 0.95, 0.95), // White clothes
      colorStains: [],
      isColored: false
    };

    // Body (cylinder for simplicity)
    const body = MeshBuilder.CreateCylinder(
      `person_body_${index}`,
      { height: 1.6, diameter: 0.8 },
      this.scene
    );
    body.position = position.clone();
    body.position.y = 0.8;

    const bodyMaterial = new StandardMaterial(`personBodyMaterial_${index}`, this.scene);
    bodyMaterial.diffuseColor = personGroup.originalColor;
    body.material = bodyMaterial;

    // Head
    const head = MeshBuilder.CreateSphere(
      `person_head_${index}`,
      { diameter: 0.5 },
      this.scene
    );
    head.position = position.clone();
    head.position.y = 1.8;

    const headMaterial = new StandardMaterial(`personHeadMaterial_${index}`, this.scene);
    headMaterial.diffuseColor = new Color3(0.8, 0.6, 0.4); // Skin tone
    head.material = headMaterial;

    // Add dancing animation
    this.addDancingAnimation(body, index);

    personGroup.body = body;
    personGroup.head = head;

    return personGroup;
  }

  addDancingAnimation(mesh, index) {
    // Create gentle swaying animation
    const swayAnimation = Animation.CreateAndStartAnimation(
      `dance_${index}`,
      mesh,
      "rotation.y",
      30,
      120,
      0,
      Math.PI / 4,
      Animation.ANIMATIONLOOPMODE_CYCLE
    );

    // Add vertical bobbing
    const bobAnimation = Animation.CreateAndStartAnimation(
      `bob_${index}`,
      mesh,
      "position.y",
      30,
      60,
      mesh.position.y,
      mesh.position.y + 0.2,
      Animation.ANIMATIONLOOPMODE_CYCLE
    );
  }

  createColorPiles() {
    const pilePositions = [
      { pos: new Vector3(-12, 0, -10), colorIndex: 0 }, // Pink
      { pos: new Vector3(-8, 0, -12), colorIndex: 1 },  // Yellow
      { pos: new Vector3(-4, 0, -10), colorIndex: 2 },  // Green
      { pos: new Vector3(4, 0, -12), colorIndex: 3 },   // Blue
      { pos: new Vector3(8, 0, -10), colorIndex: 4 },   // Purple
      { pos: new Vector3(12, 0, -12), colorIndex: 5 },  // Orange
      { pos: new Vector3(0, 0, -14), colorIndex: 6 }    // Red
    ];

    pilePositions.forEach((pile, index) => {
      const colorPile = this.createColorPile(pile.pos, pile.colorIndex, index);
      this.colorPiles.push(colorPile);
    });
  }

  createColorPile(position, colorIndex, index) {
    const holiColor = this.holiColors[colorIndex];
    
    // Create pile base
    const pile = MeshBuilder.CreateCylinder(
      `colorPile_${index}`,
      { height: 0.4, diameterTop: 1.5, diameterBottom: 2 },
      this.scene
    );
    pile.position = position.clone();
    pile.position.y = 0.2;

    const pileMaterial = new StandardMaterial(`colorPileMaterial_${index}`, this.scene);
    pileMaterial.diffuseColor = holiColor.color;
    pileMaterial.emissiveColor = holiColor.color.scale(0.3);
    pile.material = pileMaterial;

    // Add particle system for powder effect
    const powderSystem = new ParticleSystem(`powder_${index}`, 50, this.scene);
    powderSystem.particleTexture = this.createColorTexture(holiColor.color);
    powderSystem.emitter = pile;
    powderSystem.minEmitBox = new Vector3(-0.5, 0.2, -0.5);
    powderSystem.maxEmitBox = new Vector3(0.5, 0.4, 0.5);

    powderSystem.color1 = holiColor.powder;
    powderSystem.color2 = holiColor.powder;
    powderSystem.colorDead = new Color4(holiColor.color.r, holiColor.color.g, holiColor.color.b, 0);

    powderSystem.minSize = 0.1;
    powderSystem.maxSize = 0.3;
    powderSystem.minLifeTime = 2;
    powderSystem.maxLifeTime = 4;
    powderSystem.emitRate = 10;

    powderSystem.direction1 = new Vector3(-0.5, 1, -0.5);
    powderSystem.direction2 = new Vector3(0.5, 2, 0.5);
    powderSystem.gravity = new Vector3(0, -2, 0);

    powderSystem.start();

    return {
      mesh: pile,
      color: holiColor,
      particleSystem: powderSystem,
      position: position
    };
  }

  createColorTexture(color) {
    const texture = new DynamicTexture("colorTexture", { width: 64, height: 64 }, this.scene);
    const ctx = texture.getContext();
    
    ctx.fillStyle = `rgb(${Math.floor(color.r * 255)}, ${Math.floor(color.g * 255)}, ${Math.floor(color.b * 255)})`;
    ctx.fillRect(0, 0, 64, 64);
    
    texture.update();
    return texture;
  }

  createWaterElements() {
    // Water guns (pichkaris)
    const gunPositions = [
      new Vector3(-5, 0, 5), new Vector3(7, 0, 3), new Vector3(-9, 0, 7)
    ];

    gunPositions.forEach((position, index) => {
      const waterGun = this.createWaterGun(position, index);
      this.waterGuns.push(waterGun);
    });

    // Water balloons
    this.createWaterBalloons();
  }

  createWaterGun(position, index) {
    // Simple water gun representation
    const gun = MeshBuilder.CreateCylinder(
      `waterGun_${index}`,
      { height: 1, diameter: 0.3 },
      this.scene
    );
    gun.position = position.clone();
    gun.position.y = 0.5;
    gun.rotation.z = Math.PI / 4;

    const gunMaterial = new StandardMaterial(`waterGunMaterial_${index}`, this.scene);
    gunMaterial.diffuseColor = new Color3(0.2, 0.6, 0.9);
    gunMaterial.specularColor = new Color3(0.5, 0.8, 1);
    gun.material = gunMaterial;

    return {
      mesh: gun,
      position: position
    };
  }

  createWaterBalloons() {
    const balloonPositions = [
      new Vector3(6, 0, -6), new Vector3(-7, 0, 4), new Vector3(9, 0, 8)
    ];

    balloonPositions.forEach((position, index) => {
      const balloon = MeshBuilder.CreateSphere(
        `waterBalloon_${index}`,
        { diameter: 0.4 },
        this.scene
      );
      balloon.position = position.clone();
      balloon.position.y = 0.2;

      const balloonMaterial = new StandardMaterial(`waterBalloonMaterial_${index}`, this.scene);
      balloonMaterial.diffuseColor = new Color3(0.3, 0.7, 1);
      balloonMaterial.specularColor = new Color3(0.8, 0.9, 1);
      balloonMaterial.alpha = 0.8;
      balloon.material = balloonMaterial;
    });
  }

  createBonfire() {
    // Holika Dahan bonfire
    const bonfirePosition = new Vector3(0, 0, 12);
    
    // Wood pile base
    const woodPile = MeshBuilder.CreateCylinder(
      "woodPile",
      { height: 1, diameter: 3 },
      this.scene
    );
    woodPile.position = bonfirePosition.clone();
    woodPile.position.y = 0.5;

    const woodMaterial = new StandardMaterial("woodMaterial", this.scene);
    woodMaterial.diffuseColor = new Color3(0.6, 0.3, 0.1);
    woodPile.material = woodMaterial;

    // Flames
    const flameSystem = new ParticleSystem("flames", 200, this.scene);
    flameSystem.emitter = woodPile;
    flameSystem.minEmitBox = new Vector3(-1, 0.5, -1);
    flameSystem.maxEmitBox = new Vector3(1, 1, 1);

    flameSystem.color1 = new Color4(1, 0.8, 0.2, 1);
    flameSystem.color2 = new Color4(1, 0.4, 0.1, 1);
    flameSystem.colorDead = new Color4(0.5, 0.2, 0.1, 0);

    flameSystem.minSize = 0.3;
    flameSystem.maxSize = 0.8;
    flameSystem.minLifeTime = 0.5;
    flameSystem.maxLifeTime = 1.5;
    flameSystem.emitRate = 100;

    flameSystem.direction1 = new Vector3(-1, 3, -1);
    flameSystem.direction2 = new Vector3(1, 5, 1);

    flameSystem.start();

    // Bonfire light
    const bonfireLight = new PointLight(
      "bonfireLight",
      bonfirePosition.clone().add(new Vector3(0, 2, 0)),
      this.scene
    );
    bonfireLight.diffuse = new Color3(1, 0.6, 0.2);
    bonfireLight.intensity = 1.5;
    bonfireLight.range = 15;

    this.bonfire = {
      woodPile: woodPile,
      flames: flameSystem,
      light: bonfireLight
    };
  }

  createSweetStalls() {
    const stallPositions = [
      new Vector3(-15, 0, 10),
      new Vector3(15, 0, 10)
    ];

    stallPositions.forEach((position, index) => {
      const stall = this.createSweetStall(position, index);
      this.sweetStalls.push(stall);
    });
  }

  createSweetStall(position, index) {
    // Stall structure
    const stall = MeshBuilder.CreateBox(
      `sweetStall_${index}`,
      { width: 4, height: 2.5, depth: 2 },
      this.scene
    );
    stall.position = position.clone();
    stall.position.y = 1.25;

    const stallMaterial = new StandardMaterial(`sweetStallMaterial_${index}`, this.scene);
    stallMaterial.diffuseColor = new Color3(0.8, 0.6, 0.3);
    stall.material = stallMaterial;

    // Colorful awning
    const awning = MeshBuilder.CreateBox(
      `awning_${index}`,
      { width: 5, height: 0.1, depth: 3 },
      this.scene
    );
    awning.position = position.clone();
    awning.position.y = 2.8;

    const awningMaterial = new StandardMaterial(`awningMaterial_${index}`, this.scene);
    const awningColor = this.holiColors[index % this.holiColors.length].color;
    awningMaterial.diffuseColor = awningColor;
    awning.material = awningMaterial;

    // Sweet displays
    this.createSweetDisplays(position, index);

    return {
      structure: stall,
      awning: awning,
      position: position
    };
  }

  createSweetDisplays(stallPosition, stallIndex) {
    const sweetPositions = [
      new Vector3(-1, 0, 0), new Vector3(0, 0, 0), new Vector3(1, 0, 0)
    ];

    sweetPositions.forEach((offset, index) => {
      const sweetPosition = stallPosition.clone().add(offset);
      sweetPosition.y = 1.5;

      const sweet = MeshBuilder.CreateSphere(
        `sweet_${stallIndex}_${index}`,
        { diameter: 0.3 },
        this.scene
      );
      sweet.position = sweetPosition;

      const sweetMaterial = new StandardMaterial(`sweetMaterial_${stallIndex}_${index}`, this.scene);
      sweetMaterial.diffuseColor = new Color3(1, 0.8, 0.4); // Golden gujiya color
      sweetMaterial.emissiveColor = new Color3(0.2, 0.15, 0.1);
      sweet.material = sweetMaterial;
    });
  }

  setupColorThrowingMechanics() {
    // Setup pointer events for color throwing
    this.scene.onPointerObservable.add((pointerInfo) => {
      switch (pointerInfo.type) {
        case 4: // POINTERDOWN
          this.startColorThrow(pointerInfo);
          break;
        case 8: // POINTERUP
          this.endColorThrow(pointerInfo);
          break;
        case 2: // POINTERMOVE
          if (this.activeColorThrow) {
            this.updateColorThrow(pointerInfo);
          }
          break;
      }
    });
  }

  startColorThrow(pointerInfo) {
    const pickInfo = pointerInfo.pickInfo;
    if (pickInfo.hit) {
      // Find nearest color pile
      const nearestPile = this.findNearestColorPile(pickInfo.pickedPoint);
      if (nearestPile) {
        this.activeColorThrow = {
          startPoint: pickInfo.pickedPoint.clone(),
          color: nearestPile.color,
          pile: nearestPile
        };
      }
    }
  }

  updateColorThrow(pointerInfo) {
    if (!this.activeColorThrow) return;
    
    const pickInfo = pointerInfo.pickInfo;
    if (pickInfo.hit) {
      // Create color trail effect
      this.createColorTrail(this.activeColorThrow.startPoint, pickInfo.pickedPoint, this.activeColorThrow.color);
    }
  }

  endColorThrow(pointerInfo) {
    if (!this.activeColorThrow) return;
    
    const pickInfo = pointerInfo.pickInfo;
    if (pickInfo.hit) {
      // Throw color at target
      this.throwColorAt(pickInfo.pickedPoint, this.activeColorThrow.color);
      
      // Check if we hit a person
      const hitPerson = this.findPersonAt(pickInfo.pickedPoint);
      if (hitPerson) {
        this.colorPerson(hitPerson, this.activeColorThrow.color);
      }
    }
    
    this.activeColorThrow = null;
  }

  findNearestColorPile(position) {
    let nearest = null;
    let minDistance = Infinity;
    
    this.colorPiles.forEach(pile => {
      const distance = Vector3.Distance(position, pile.position);
      if (distance < minDistance && distance < 5) { // Within 5 units
        minDistance = distance;
        nearest = pile;
      }
    });
    
    return nearest;
  }

  findPersonAt(position) {
    return this.people.find(person => {
      const distance = Vector3.Distance(position, person.position);
      return distance < 2; // Within 2 units of person
    });
  }

  createColorTrail(start, end, holiColor) {
    const trailSystem = new ParticleSystem(`colorTrail_${Date.now()}`, 50, this.scene);
    
    // Create emitter along the path
    const midPoint = Vector3.Lerp(start, end, 0.5);
    trailSystem.emitter = midPoint;
    
    trailSystem.color1 = holiColor.powder;
    trailSystem.color2 = holiColor.powder;
    trailSystem.colorDead = new Color4(holiColor.color.r, holiColor.color.g, holiColor.color.b, 0);
    
    trailSystem.minSize = 0.1;
    trailSystem.maxSize = 0.3;
    trailSystem.minLifeTime = 0.5;
    trailSystem.maxLifeTime = 1;
    trailSystem.emitRate = 100;
    
    const direction = end.subtract(start).normalize();
    trailSystem.direction1 = direction.scale(2);
    trailSystem.direction2 = direction.scale(4);
    
    trailSystem.start();
    
    // Stop after short duration
    setTimeout(() => {
      trailSystem.stop();
      setTimeout(() => trailSystem.dispose(), 1000);
    }, 200);
  }

  throwColorAt(targetPosition, holiColor) {
    // Create color explosion at target
    const explosionSystem = new ParticleSystem(`colorExplosion_${Date.now()}`, 200, this.scene);
    explosionSystem.emitter = targetPosition;
    explosionSystem.minEmitBox = new Vector3(-0.5, -0.5, -0.5);
    explosionSystem.maxEmitBox = new Vector3(0.5, 0.5, 0.5);
    
    explosionSystem.color1 = holiColor.powder;
    explosionSystem.color2 = holiColor.powder;
    explosionSystem.colorDead = new Color4(holiColor.color.r, holiColor.color.g, holiColor.color.b, 0);
    
    explosionSystem.minSize = 0.2;
    explosionSystem.maxSize = 0.6;
    explosionSystem.minLifeTime = 1;
    explosionSystem.maxLifeTime = 3;
    explosionSystem.emitRate = 500;
    
    explosionSystem.direction1 = new Vector3(-3, 0, -3);
    explosionSystem.direction2 = new Vector3(3, 3, 3);
    explosionSystem.gravity = new Vector3(0, -1, 0);
    
    explosionSystem.start();
    
    // Stop emission quickly but let particles fade
    setTimeout(() => {
      explosionSystem.stop();
      setTimeout(() => explosionSystem.dispose(), 3000);
    }, 100);
    
    // Notify AI Guide
    if (window.app && window.app.aiGuide) {
      window.app.aiGuide.addUserInteraction(`threw ${holiColor.name.toLowerCase()} color`);
    }
  }

  colorPerson(person, holiColor) {
    if (person.isColored) return;
    
    // Change person's clothing color
    const bodyMaterial = person.body.material;
    const newColor = Color3.Lerp(person.originalColor, holiColor.color, 0.7);
    bodyMaterial.diffuseColor = newColor;
    bodyMaterial.emissiveColor = holiColor.color.scale(0.1);
    
    person.isColored = true;
    person.colorStains.push(holiColor);
    
    // Add celebration animation
    this.addCelebrationAnimation(person);
    
    // Notify AI Guide
    if (window.app && window.app.aiGuide) {
      window.app.aiGuide.addUserInteraction(`colored a person with ${holiColor.name.toLowerCase()}`);
    }
  }

  addCelebrationAnimation(person) {
    // Jumping celebration
    const jumpAnimation = Animation.CreateAndStartAnimation(
      `celebration_${Date.now()}`,
      person.body,
      "position.y",
      60,
      30,
      person.body.position.y,
      person.body.position.y + 1,
      Animation.ANIMATIONLOOPMODE_CONSTANT
    );
    
    // Return to original position
    setTimeout(() => {
      Animation.CreateAndStartAnimation(
        `return_${Date.now()}`,
        person.body,
        "position.y",
        60,
        30,
        person.body.position.y,
        0.8,
        Animation.ANIMATIONLOOPMODE_CONSTANT
      );
    }, 500);
  }

  createAmbientColorEffects() {
    // Floating color particles in the air
    this.holiColors.forEach((holiColor, index) => {
      const ambientSystem = new ParticleSystem(`ambient_${index}`, 30, this.scene);
      
      // Random position in courtyard
      const randomX = (Math.random() - 0.5) * 30;
      const randomZ = (Math.random() - 0.5) * 30;
      ambientSystem.emitter = new Vector3(randomX, 3, randomZ);
      ambientSystem.minEmitBox = new Vector3(-2, -1, -2);
      ambientSystem.maxEmitBox = new Vector3(2, 1, 2);
      
      ambientSystem.color1 = holiColor.powder;
      ambientSystem.color2 = holiColor.powder;
      ambientSystem.colorDead = new Color4(holiColor.color.r, holiColor.color.g, holiColor.color.b, 0);
      
      ambientSystem.minSize = 0.1;
      ambientSystem.maxSize = 0.2;
      ambientSystem.minLifeTime = 5;
      ambientSystem.maxLifeTime = 8;
      ambientSystem.emitRate = 5;
      
      ambientSystem.direction1 = new Vector3(-1, -0.5, -1);
      ambientSystem.direction2 = new Vector3(1, 0.5, 1);
      ambientSystem.gravity = new Vector3(0, -0.2, 0);
      
      ambientSystem.start();
      this.colorParticleSystems.push(ambientSystem);
    });
  }

  setupInteractions() {
    // Setup action manager for the scene
    this.scene.actionManager = new ActionManager(this.scene);

    // Make color piles interactive
    this.colorPiles.forEach((pile, index) => {
      pile.mesh.actionManager = new ActionManager(this.scene);
      
      // Click to create color burst
      pile.mesh.actionManager.registerAction(
        new ExecuteCodeAction(ActionManager.OnPickTrigger, () => {
          this.createColorBurst(pile);
        })
      );

      // Hover effect
      pile.mesh.actionManager.registerAction(
        new ExecuteCodeAction(ActionManager.OnPointerOverTrigger, () => {
          pile.mesh.scaling = new Vector3(1.1, 1.1, 1.1);
        })
      );

      pile.mesh.actionManager.registerAction(
        new ExecuteCodeAction(ActionManager.OnPointerOutTrigger, () => {
          pile.mesh.scaling = new Vector3(1, 1, 1);
        })
      );
    });

    // Make people interactive
    this.people.forEach((person, index) => {
      person.body.actionManager = new ActionManager(this.scene);
      
      person.body.actionManager.registerAction(
        new ExecuteCodeAction(ActionManager.OnPickTrigger, () => {
          this.showPersonInfo(person, index);
        })
      );
    });
  }

  createColorBurst(pile) {
    const burstSystem = new ParticleSystem(`burst_${Date.now()}`, 300, this.scene);
    burstSystem.emitter = pile.mesh;
    burstSystem.minEmitBox = new Vector3(-0.5, 0.2, -0.5);
    burstSystem.maxEmitBox = new Vector3(0.5, 0.5, 0.5);
    
    burstSystem.color1 = pile.color.powder;
    burstSystem.color2 = pile.color.powder;
    burstSystem.colorDead = new Color4(pile.color.color.r, pile.color.color.g, pile.color.color.b, 0);
    
    burstSystem.minSize = 0.2;
    burstSystem.maxSize = 0.5;
    burstSystem.minLifeTime = 2;
    burstSystem.maxLifeTime = 4;
    burstSystem.emitRate = 1000;
    
    burstSystem.direction1 = new Vector3(-5, 2, -5);
    burstSystem.direction2 = new Vector3(5, 8, 5);
    burstSystem.gravity = new Vector3(0, -2, 0);
    
    burstSystem.start();
    
    // Stop quickly but let particles settle
    setTimeout(() => {
      burstSystem.stop();
      setTimeout(() => burstSystem.dispose(), 4000);
    }, 200);
    
    // Notify AI Guide
    if (window.app && window.app.aiGuide) {
      window.app.aiGuide.addUserInteraction(`created ${pile.color.name.toLowerCase()} color burst`);
    }
  }

  showPersonInfo(person, index) {
    const colorInfo = person.colorStains.length > 0 ? 
      `This person has been colored with: ${person.colorStains.map(c => c.name).join(', ')}` :
      'This person is still wearing clean white clothes, waiting to be colored!';
    
    console.log(`Person ${index + 1}: ${colorInfo}`);
    
    // Show cultural info through AI Guide
    if (window.app && window.app.aiGuide) {
      window.app.uiManager.showCulturalInfo('holi', 'person');
    }
  }

  // Public methods for external control
  startColorCelebration() {
    // Create massive color explosion across the scene
    this.colorPiles.forEach((pile, index) => {
      setTimeout(() => {
        this.createColorBurst(pile);
      }, index * 300);
    });
    
    // Color all people gradually
    this.people.forEach((person, index) => {
      if (!person.isColored) {
        setTimeout(() => {
          const randomColor = this.holiColors[Math.floor(Math.random() * this.holiColors.length)];
          this.colorPerson(person, randomColor);
        }, index * 500);
      }
    });
  }

  dispose() {
    // Clean up all Holi scene objects
    this.people.forEach(person => {
      person.body.dispose();
      person.head.dispose();
    });

    this.colorPiles.forEach(pile => {
      pile.mesh.dispose();
      pile.particleSystem.dispose();
    });

    this.waterGuns.forEach(gun => {
      gun.mesh.dispose();
    });

    this.sweetStalls.forEach(stall => {
      stall.structure.dispose();
      stall.awning.dispose();
    });

    if (this.bonfire) {
      this.bonfire.woodPile.dispose();
      this.bonfire.flames.dispose();
      this.bonfire.light.dispose();
    }

    this.colorParticleSystems.forEach(system => {
      system.dispose();
    });

    // Remove Holi-specific lights
    const holiLights = this.scene.lights.filter(light => 
      light.name.includes('holi') || light.name.includes('bonfire')
    );
    
    holiLights.forEach(light => light.dispose());

    console.log('Holi scene disposed');
  }
}
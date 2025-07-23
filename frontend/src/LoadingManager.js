export class LoadingManager {
  constructor() {
    this.loadingStates = new Map();
    this.culturalFacts = [
      "🪔 Diwali is celebrated by over 1 billion people worldwide",
      "🎨 Holi colors traditionally came from flowers, herbs, and natural minerals",
      "💃 Garba dance represents the cosmic dance of creation and time",
      "🐘 Lord Ganesha is invoked before starting any new venture or journey",
      "🏹 Dussehra celebrates the victory of good over evil in multiple traditions",
      "🕉️ Kumbh Mela is the world's largest peaceful gathering of humanity",
      "🌸 Rangoli patterns are believed to bring good luck and prosperity",
      "🥥 Coconut is considered sacred and used in most Hindu rituals",
      "🔔 Temple bells are rung to invite divine presence and ward off evil",
      "🌙 Many Hindu festivals follow the lunar calendar and change dates yearly",
      "🎭 Each festival has regional variations across different states of India",
      "📿 Mantras and chants are believed to have healing and spiritual powers"
    ];
    this.currentFactIndex = 0;
    this.loadingAnimations = new Map();
    
    this.init();
  }

  init() {
    this.createLoadingScreens();
    this.setupLoadingAnimations();
  }

  createLoadingScreens() {
    // Main loading screen
    this.createMainLoadingScreen();
    
    // Scene transition loading
    this.createSceneLoadingScreen();
    
    // Asset loading screen
    this.createAssetLoadingScreen();
  }

  createMainLoadingScreen() {
    const loadingScreen = document.createElement('div');
    loadingScreen.id = 'main-loading-screen';
    loadingScreen.innerHTML = `
      <div class="loading-container">
        <div class="loading-logo">
          <div class="lotus-animation">
            <div class="lotus-petal"></div>
            <div class="lotus-petal"></div>
            <div class="lotus-petal"></div>
            <div class="lotus-petal"></div>
            <div class="lotus-petal"></div>
            <div class="lotus-petal"></div>
            <div class="lotus-petal"></div>
            <div class="lotus-petal"></div>
          </div>
          <div class="om-symbol">🕉️</div>
        </div>
        
        <h2 class="loading-title">Hindu Festivals VR</h2>
        <p class="loading-subtitle">Immersive Cultural Experience</p>
        
        <div class="loading-progress">
          <div class="progress-bar">
            <div class="progress-fill" id="main-progress-fill"></div>
          </div>
          <div class="progress-text" id="main-progress-text">Initializing...</div>
        </div>
        
        <div class="cultural-fact">
          <div class="fact-icon">💡</div>
          <div class="fact-text" id="cultural-fact-text">
            Loading cultural wisdom...
          </div>
        </div>
        
        <div class="loading-tips">
          <p>💡 <strong>Tip:</strong> Use mouse to rotate view, scroll to zoom</p>
          <p>🎯 <strong>Explore:</strong> Click on objects to learn about traditions</p>
          <p>🤖 <strong>Ask:</strong> Use the AI guide for cultural questions</p>
        </div>
      </div>
    `;
    
    document.body.appendChild(loadingScreen);
  }

  createSceneLoadingScreen() {
    const sceneLoading = document.createElement('div');
    sceneLoading.id = 'scene-loading-screen';
    sceneLoading.innerHTML = `
      <div class="scene-loading-container">
        <div class="scene-loading-animation">
          <div class="mandala-spinner">
            <div class="mandala-ring"></div>
            <div class="mandala-ring"></div>
            <div class="mandala-ring"></div>
          </div>
        </div>
        
        <h3 class="scene-loading-title" id="scene-loading-title">Loading Festival...</h3>
        <p class="scene-loading-description" id="scene-loading-description">
          Preparing your cultural journey...
        </p>
        
        <div class="scene-progress">
          <div class="progress-steps">
            <div class="step" id="step-1">
              <div class="step-icon">🏗️</div>
              <div class="step-text">Building Scene</div>
            </div>
            <div class="step" id="step-2">
              <div class="step-icon">🎨</div>
              <div class="step-text">Adding Details</div>
            </div>
            <div class="step" id="step-3">
              <div class="step-icon">✨</div>
              <div class="step-text">Final Touches</div>
            </div>
          </div>
        </div>
      </div>
    `;
    
    document.body.appendChild(sceneLoading);
  }

  createAssetLoadingScreen() {
    const assetLoading = document.createElement('div');
    assetLoading.id = 'asset-loading-screen';
    assetLoading.innerHTML = `
      <div class="asset-loading-container">
        <div class="asset-grid">
          <div class="asset-item" data-type="models">
            <div class="asset-icon">🏛️</div>
            <div class="asset-label">3D Models</div>
            <div class="asset-progress">
              <div class="asset-progress-bar">
                <div class="asset-progress-fill" id="models-progress"></div>
              </div>
            </div>
          </div>
          
          <div class="asset-item" data-type="textures">
            <div class="asset-icon">🎨</div>
            <div class="asset-label">Textures</div>
            <div class="asset-progress">
              <div class="asset-progress-bar">
                <div class="asset-progress-fill" id="textures-progress"></div>
              </div>
            </div>
          </div>
          
          <div class="asset-item" data-type="audio">
            <div class="asset-icon">🎵</div>
            <div class="asset-label">Audio</div>
            <div class="asset-progress">
              <div class="asset-progress-bar">
                <div class="asset-progress-fill" id="audio-progress"></div>
              </div>
            </div>
          </div>
          
          <div class="asset-item" data-type="data">
            <div class="asset-icon">📚</div>
            <div class="asset-label">Cultural Data</div>
            <div class="asset-progress">
              <div class="asset-progress-bar">
                <div class="asset-progress-fill" id="data-progress"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
    
    document.body.appendChild(assetLoading);
  }

  setupLoadingAnimations() {
    const styles = document.createElement('style');
    styles.textContent = `
      #main-loading-screen, #scene-loading-screen, #asset-loading-screen {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(135deg, #1a1a2e, #16213e, #0f3460);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        color: white;
        font-family: 'Inter', sans-serif;
        opacity: 0;
        visibility: hidden;
        transition: all 0.5s ease;
      }
      
      #main-loading-screen.active, #scene-loading-screen.active, #asset-loading-screen.active {
        opacity: 1;
        visibility: visible;
      }
      
      .loading-container, .scene-loading-container, .asset-loading-container {
        text-align: center;
        max-width: 500px;
        padding: 2rem;
      }
      
      .lotus-animation {
        position: relative;
        width: 120px;
        height: 120px;
        margin: 0 auto 2rem;
        animation: lotus-rotate 4s linear infinite;
      }
      
      .lotus-petal {
        position: absolute;
        width: 20px;
        height: 40px;
        background: linear-gradient(45deg, #ff6b35, #ffd700);
        border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
        transform-origin: 50% 100%;
      }
      
      .lotus-petal:nth-child(1) { transform: rotate(0deg) translateY(-50px); }
      .lotus-petal:nth-child(2) { transform: rotate(45deg) translateY(-50px); }
      .lotus-petal:nth-child(3) { transform: rotate(90deg) translateY(-50px); }
      .lotus-petal:nth-child(4) { transform: rotate(135deg) translateY(-50px); }
      .lotus-petal:nth-child(5) { transform: rotate(180deg) translateY(-50px); }
      .lotus-petal:nth-child(6) { transform: rotate(225deg) translateY(-50px); }
      .lotus-petal:nth-child(7) { transform: rotate(270deg) translateY(-50px); }
      .lotus-petal:nth-child(8) { transform: rotate(315deg) translateY(-50px); }
      
      .om-symbol {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 2rem;
        animation: om-pulse 2s ease-in-out infinite;
      }
      
      .loading-title {
        font-size: 2.5rem;
        font-weight: 700;
        margin-bottom: 0.5rem;
        background: linear-gradient(45deg, #ffd700, #ff6b35);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }
      
      .loading-subtitle {
        font-size: 1.2rem;
        opacity: 0.8;
        margin-bottom: 2rem;
      }
      
      .loading-progress {
        margin-bottom: 2rem;
      }
      
      .progress-bar {
        width: 100%;
        height: 6px;
        background: rgba(255, 255, 255, 0.2);
        border-radius: 3px;
        overflow: hidden;
        margin-bottom: 1rem;
      }
      
      .progress-fill {
        height: 100%;
        background: linear-gradient(90deg, #ff6b35, #ffd700);
        border-radius: 3px;
        transition: width 0.3s ease;
        animation: progress-shimmer 2s ease-in-out infinite;
      }
      
      .progress-text {
        font-size: 1rem;
        opacity: 0.9;
      }
      
      .cultural-fact {
        background: rgba(255, 255, 255, 0.1);
        border-radius: 12px;
        padding: 1.5rem;
        margin-bottom: 2rem;
        border: 1px solid rgba(255, 215, 0, 0.3);
      }
      
      .fact-icon {
        font-size: 1.5rem;
        margin-bottom: 0.5rem;
      }
      
      .fact-text {
        font-size: 1rem;
        line-height: 1.5;
        opacity: 0.9;
      }
      
      .loading-tips {
        text-align: left;
        opacity: 0.7;
      }
      
      .loading-tips p {
        margin-bottom: 0.5rem;
        font-size: 0.9rem;
      }
      
      .mandala-spinner {
        position: relative;
        width: 100px;
        height: 100px;
        margin: 0 auto 2rem;
      }
      
      .mandala-ring {
        position: absolute;
        border: 2px solid transparent;
        border-top: 2px solid #ffd700;
        border-radius: 50%;
        animation: mandala-spin 2s linear infinite;
      }
      
      .mandala-ring:nth-child(1) {
        width: 100px;
        height: 100px;
        animation-duration: 2s;
      }
      
      .mandala-ring:nth-child(2) {
        width: 70px;
        height: 70px;
        top: 15px;
        left: 15px;
        border-top-color: #ff6b35;
        animation-duration: 1.5s;
        animation-direction: reverse;
      }
      
      .mandala-ring:nth-child(3) {
        width: 40px;
        height: 40px;
        top: 30px;
        left: 30px;
        border-top-color: #4ecdc4;
        animation-duration: 1s;
      }
      
      .progress-steps {
        display: flex;
        justify-content: space-between;
        margin-top: 2rem;
      }
      
      .step {
        flex: 1;
        text-align: center;
        opacity: 0.5;
        transition: opacity 0.3s ease;
      }
      
      .step.active {
        opacity: 1;
      }
      
      .step.completed {
        opacity: 1;
        color: #4caf50;
      }
      
      .step-icon {
        font-size: 1.5rem;
        margin-bottom: 0.5rem;
      }
      
      .step-text {
        font-size: 0.9rem;
      }
      
      .asset-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 1.5rem;
        margin-top: 2rem;
      }
      
      .asset-item {
        background: rgba(255, 255, 255, 0.1);
        border-radius: 12px;
        padding: 1.5rem;
        border: 1px solid rgba(255, 215, 0, 0.2);
      }
      
      .asset-icon {
        font-size: 2rem;
        margin-bottom: 0.5rem;
      }
      
      .asset-label {
        font-size: 1rem;
        margin-bottom: 1rem;
        font-weight: 600;
      }
      
      .asset-progress-bar {
        width: 100%;
        height: 4px;
        background: rgba(255, 255, 255, 0.2);
        border-radius: 2px;
        overflow: hidden;
      }
      
      .asset-progress-fill {
        height: 100%;
        background: linear-gradient(90deg, #ff6b35, #ffd700);
        border-radius: 2px;
        transition: width 0.3s ease;
      }
      
      @keyframes lotus-rotate {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
      
      @keyframes om-pulse {
        0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
        50% { transform: translate(-50%, -50%) scale(1.1); opacity: 0.8; }
      }
      
      @keyframes progress-shimmer {
        0% { background-position: -200px 0; }
        100% { background-position: 200px 0; }
      }
      
      @keyframes mandala-spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
      
      @media (max-width: 768px) {
        .loading-container, .scene-loading-container, .asset-loading-container {
          padding: 1rem;
        }
        
        .loading-title {
          font-size: 2rem;
        }
        
        .asset-grid {
          grid-template-columns: 1fr;
        }
        
        .progress-steps {
          flex-direction: column;
          gap: 1rem;
        }
      }
    `;
    
    document.head.appendChild(styles);
  }

  showMainLoading() {
    const screen = document.getElementById('main-loading-screen');
    screen.classList.add('active');
    
    this.startCulturalFactRotation();
    this.simulateMainLoading();
  }

  hideMainLoading() {
    const screen = document.getElementById('main-loading-screen');
    screen.classList.remove('active');
    
    this.stopCulturalFactRotation();
  }

  showSceneLoading(festival) {
    const screen = document.getElementById('scene-loading-screen');
    const title = document.getElementById('scene-loading-title');
    const description = document.getElementById('scene-loading-description');
    
    const festivalInfo = {
      diwali: {
        title: 'Loading Diwali Experience',
        description: 'Preparing the Festival of Lights with traditional diyas and rangoli...'
      },
      holi: {
        title: 'Loading Holi Celebration',
        description: 'Setting up the colorful Festival of Colors with vibrant gulal...'
      },
      navratri: {
        title: 'Loading Navratri Festival',
        description: 'Preparing the nine nights of dance with Garba circles...'
      },
      ganesh: {
        title: 'Loading Ganesh Chaturthi',
        description: 'Creating the celebration of Lord Ganesha with elaborate decorations...'
      },
      dussehra: {
        title: 'Loading Dussehra Festival',
        description: 'Building the victory celebration with Ravana effigy...'
      },
      kumbh: {
        title: 'Loading Kumbh Mela',
        description: 'Preparing the sacred gathering at the holy confluence...'
      }
    };
    
    const info = festivalInfo[festival] || festivalInfo.diwali;
    title.textContent = info.title;
    description.textContent = info.description;
    
    screen.classList.add('active');
    this.simulateSceneLoading();
  }

  hideSceneLoading() {
    const screen = document.getElementById('scene-loading-screen');
    screen.classList.remove('active');
  }

  showAssetLoading() {
    const screen = document.getElementById('asset-loading-screen');
    screen.classList.add('active');
    
    this.simulateAssetLoading();
  }

  hideAssetLoading() {
    const screen = document.getElementById('asset-loading-screen');
    screen.classList.remove('active');
  }

  startCulturalFactRotation() {
    this.factRotationInterval = setInterval(() => {
      this.showNextCulturalFact();
    }, 3000);
    
    // Show first fact immediately
    this.showNextCulturalFact();
  }

  stopCulturalFactRotation() {
    if (this.factRotationInterval) {
      clearInterval(this.factRotationInterval);
    }
  }

  showNextCulturalFact() {
    const factText = document.getElementById('cultural-fact-text');
    if (!factText) return;
    
    const fact = this.culturalFacts[this.currentFactIndex];
    
    // Fade out
    factText.style.opacity = '0';
    
    setTimeout(() => {
      factText.textContent = fact;
      factText.style.opacity = '1';
    }, 300);
    
    this.currentFactIndex = (this.currentFactIndex + 1) % this.culturalFacts.length;
  }

  simulateMainLoading() {
    const progressFill = document.getElementById('main-progress-fill');
    const progressText = document.getElementById('main-progress-text');
    
    const steps = [
      { progress: 20, text: 'Loading 3D engine...' },
      { progress: 40, text: 'Initializing cultural database...' },
      { progress: 60, text: 'Setting up AI guide...' },
      { progress: 80, text: 'Preparing festival scenes...' },
      { progress: 100, text: 'Ready to explore!' }
    ];
    
    let currentStep = 0;
    
    const updateProgress = () => {
      if (currentStep < steps.length) {
        const step = steps[currentStep];
        progressFill.style.width = `${step.progress}%`;
        progressText.textContent = step.text;
        currentStep++;
        
        setTimeout(updateProgress, 800 + Math.random() * 400);
      }
    };
    
    updateProgress();
  }

  simulateSceneLoading() {
    const steps = ['step-1', 'step-2', 'step-3'];
    let currentStep = 0;
    
    const activateStep = () => {
      if (currentStep < steps.length) {
        const stepElement = document.getElementById(steps[currentStep]);
        stepElement.classList.add('active');
        
        if (currentStep > 0) {
          const prevStep = document.getElementById(steps[currentStep - 1]);
          prevStep.classList.remove('active');
          prevStep.classList.add('completed');
        }
        
        currentStep++;
        setTimeout(activateStep, 1000 + Math.random() * 500);
      }
    };
    
    activateStep();
  }

  simulateAssetLoading() {
    const assetTypes = ['models', 'textures', 'audio', 'data'];
    
    assetTypes.forEach((type, index) => {
      setTimeout(() => {
        this.animateAssetProgress(type);
      }, index * 500);
    });
  }

  animateAssetProgress(assetType) {
    const progressFill = document.getElementById(`${assetType}-progress`);
    if (!progressFill) return;
    
    let progress = 0;
    const targetProgress = 100;
    const increment = 2 + Math.random() * 3;
    
    const animate = () => {
      progress += increment;
      
      if (progress >= targetProgress) {
        progress = targetProgress;
        progressFill.style.width = `${progress}%`;
        return;
      }
      
      progressFill.style.width = `${progress}%`;
      setTimeout(animate, 50 + Math.random() * 100);
    };
    
    animate();
  }

  // Public API methods
  setLoadingState(id, state) {
    this.loadingStates.set(id, state);
  }

  getLoadingState(id) {
    return this.loadingStates.get(id);
  }

  updateProgress(id, progress, message) {
    const progressFill = document.getElementById(`${id}-progress-fill`);
    const progressText = document.getElementById(`${id}-progress-text`);
    
    if (progressFill) {
      progressFill.style.width = `${progress}%`;
    }
    
    if (progressText && message) {
      progressText.textContent = message;
    }
  }

  showCustomLoading(config) {
    const { title, description, steps, facts } = config;
    
    // Create custom loading screen
    const customLoading = document.createElement('div');
    customLoading.className = 'custom-loading-screen';
    customLoading.innerHTML = `
      <div class="loading-container">
        <div class="loading-animation">
          <div class="custom-spinner"></div>
        </div>
        <h3>${title}</h3>
        <p>${description}</p>
        ${steps ? this.createStepsHTML(steps) : ''}
        ${facts ? this.createFactsHTML(facts) : ''}
      </div>
    `;
    
    document.body.appendChild(customLoading);
    
    return {
      update: (progress, message) => this.updateCustomLoading(customLoading, progress, message),
      hide: () => this.hideCustomLoading(customLoading)
    };
  }

  createStepsHTML(steps) {
    return `
      <div class="custom-steps">
        ${steps.map((step, index) => `
          <div class="custom-step" id="custom-step-${index}">
            <div class="step-icon">${step.icon}</div>
            <div class="step-text">${step.text}</div>
          </div>
        `).join('')}
      </div>
    `;
  }

  createFactsHTML(facts) {
    return `
      <div class="custom-facts">
        <div class="fact-text" id="custom-fact-text">${facts[0]}</div>
      </div>
    `;
  }

  updateCustomLoading(loadingElement, progress, message) {
    // Update custom loading screen
    const progressBar = loadingElement.querySelector('.progress-fill');
    const progressText = loadingElement.querySelector('.progress-text');
    
    if (progressBar) {
      progressBar.style.width = `${progress}%`;
    }
    
    if (progressText && message) {
      progressText.textContent = message;
    }
  }

  hideCustomLoading(loadingElement) {
    loadingElement.style.opacity = '0';
    setTimeout(() => {
      if (loadingElement.parentNode) {
        loadingElement.parentNode.removeChild(loadingElement);
      }
    }, 500);
  }

  dispose() {
    this.stopCulturalFactRotation();
    this.loadingStates.clear();
    this.loadingAnimations.clear();
    
    // Remove loading screens
    const screens = [
      'main-loading-screen',
      'scene-loading-screen', 
      'asset-loading-screen'
    ];
    
    screens.forEach(screenId => {
      const screen = document.getElementById(screenId);
      if (screen) {
        screen.remove();
      }
    });
  }
}
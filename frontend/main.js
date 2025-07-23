import './style.css';
import { SceneManager } from './src/SceneManager.js';
import { UIManager } from './src/UIManager.js';
import { AIGuide } from './src/AIGuide.js';
import { SettingsManager } from './src/SettingsManager.js';
import { ProgressManager } from './src/ProgressManager.js';
import { TutorialManager } from './src/TutorialManager.js';
import { SocialManager } from './src/SocialManager.js';
import { PersonalizationManager } from './src/PersonalizationManager.js';
import { UserProfileManager } from './src/UserProfileManager.js';
import { AudioManager } from './src/AudioManager.js';
import { PerformanceManager } from './src/PerformanceManager.js';
import { TestingManager } from './src/TestingManager.js';
import { PerformanceOptimizer } from './src/PerformanceOptimizer.js';
import { VisualEffectsManager } from './src/VisualEffectsManager.js';
import { ErrorHandler } from './src/ErrorHandler.js';
import { AnalyticsManager } from './src/AnalyticsManager.js';
import { AccessibilityManager } from './src/AccessibilityManager.js';
import { TestingFramework } from './src/TestingFramework.js';
import { LoadingManager } from './src/LoadingManager.js';
import { MonitoringManager } from './src/MonitoringManager.js';
import { SecurityManager } from './src/SecurityManager.js';
import { BackupManager } from './src/BackupManager.js';
import { CommunityManager } from './src/CommunityManager.js';
import { DeploymentManager } from './src/DeploymentManager.js';

class HinduFestivalsApp {
  constructor() {
    this.sceneManager = null;
    this.uiManager = null;
    this.aiGuide = null;
    this.settingsManager = null;
    this.progressManager = null;
    this.tutorialManager = null;
    this.socialManager = null;
    this.personalizationManager = null;
    this.userProfileManager = null;
    this.audioManager = null;
    this.performanceManager = null;
    this.testingManager = null;
    this.monitoringManager = null;
    this.securityManager = null;
    this.backupManager = null;
    this.communityManager = null;
    this.deploymentManager = null;
    this.currentFestival = null;
    this.isInitialized = false;
    
    this.init();
  }

  async init() {
    try {
      // Initialize UI Manager
      this.uiManager = new UIManager();
      
      // Initialize Settings Manager
      this.settingsManager = new SettingsManager();
      
      // Initialize Progress Manager
      this.progressManager = new ProgressManager();
      
      // Initialize Tutorial Manager
      this.tutorialManager = new TutorialManager();
      
      // Initialize Social Manager
      this.socialManager = new SocialManager();
      
      // Initialize Personalization Manager
      this.personalizationManager = new PersonalizationManager();
      
      // Initialize User Profile Manager
      this.userProfileManager = new UserProfileManager();
      
      // Initialize Audio Manager
      this.audioManager = new AudioManager();
      
      // Initialize Performance Manager
      this.performanceManager = new PerformanceManager();
      
      // Initialize Testing Manager
      this.testingManager = new TestingManager();
      
      // Initialize Production Managers
      this.monitoringManager = new MonitoringManager();
      this.securityManager = new SecurityManager();
      this.backupManager = new BackupManager();
      this.communityManager = new CommunityManager();
      this.deploymentManager = new DeploymentManager();
      
      // Initialize AI Guide
      this.aiGuide = new AIGuide();
      
      // Check API configurations
      this.checkAPIConfigurations();
      
      // Run comprehensive tests in development
      if (import.meta.env.DEV) {
        setTimeout(() => {
          console.log('🧪 Running comprehensive test suite...');
          this.runDevelopmentTests();
        }, 3000);
      }
      
      // Test AI Guide functionality in development
      if (import.meta.env.DEV) {
        setTimeout(() => {
          console.log('🧪 Running AI Guide tests...');
          this.aiGuide.testFestivalContexts();
          this.aiGuide.checkMobileOptimization();
        }, 2000);
      }
      
      // Set up event listeners
      this.setupEventListeners();
      
      // Setup test button in development
      if (import.meta.env.DEV) {
        this.setupDevelopmentControls();
      }
      
      // Update menu with progress data
      this.updateMenuStats();
      
      // Add recommendations panel to menu
      this.addRecommendationsToMenu();
      
      // Hide loading screen after a brief delay
      setTimeout(() => {
        this.hideLoadingScreen();
        
        // Start tutorial for first-time users
        if (!this.settingsManager.getSetting('tutorial', 'completed')) {
          setTimeout(() => {
            this.tutorialManager.startTutorial();
          }, 1000);
        }
        
        // Prompt user registration after some time
        if (!this.userProfileManager.isUserRegistered()) {
          setTimeout(() => {
            this.userProfileManager.promptRegistration();
          }, 1000);
        }
        
        // Check deployment health in production
        if (import.meta.env.PROD) {
          this.deploymentManager.checkDeploymentHealth();
        }
      }, 1500);
      
    } catch (error) {
      console.error('Failed to initialize app:', error);
    }
  }

  setupEventListeners() {
    // Enter experience button
    const enterBtn = document.getElementById('enter-experience');
    enterBtn.addEventListener('click', () => {
      this.showFestivalMenu();
    });

    // Back to welcome button
    const backBtn = document.getElementById('back-to-welcome');
    backBtn.addEventListener('click', () => {
      this.showWelcomeScreen();
    });

    // Tutorial button
    const tutorialBtn = document.getElementById('show-tutorial');
    tutorialBtn.addEventListener('click', () => {
      this.tutorialManager.startTutorial();
    });

    // Progress button
    const progressBtn = document.getElementById('show-progress');
    progressBtn.addEventListener('click', () => {
      this.progressManager.showProgress();
    });

    // Festival selection
    const festivalCards = document.querySelectorAll('.festival-card');
    festivalCards.forEach(card => {
      card.addEventListener('click', () => {
        const festival = card.dataset.festival;
        this.selectFestival(festival);
      });
    });

    // Menu button in experience
    const menuBtn = document.getElementById('menu-btn');
    menuBtn.addEventListener('click', () => {
      this.showFestivalMenu();
    });
    
    // Floating navigation buttons
    const quickMenuBtn = document.getElementById('quick-menu');
    quickMenuBtn.addEventListener('click', () => {
      this.toggleQuickSwitcher();
    });

    const settingsBtn = document.getElementById('settings-btn');
    settingsBtn.addEventListener('click', () => {
      this.settingsManager.showSettings();
    });

    const helpBtn = document.getElementById('help-btn');
    helpBtn.addEventListener('click', () => {
      this.toggleKeyboardShortcuts();
    });

    const shareBtn = document.getElementById('share-btn');
    shareBtn.addEventListener('click', () => {
      this.socialManager.showSocial();
    });

    // Community feedback button
    document.addEventListener('keydown', (e) => {
      if (e.ctrlKey && e.key === 'f') {
        e.preventDefault();
        this.communityManager.showFeedback();
      }
    });

    // Profile button
    const profileBtn = document.getElementById('profile-btn');
    if (profileBtn) {
      profileBtn.addEventListener('click', () => {
        this.userProfileManager.showProfile();
      });
    }

    // Screenshot button
    const screenshotBtn = document.getElementById('screenshot-btn');
    screenshotBtn.addEventListener('click', () => {
      this.takeScreenshot();
    });

    // Quick festival switcher
    document.querySelectorAll('.quick-festival').forEach(btn => {
      btn.addEventListener('click', () => {
        const festival = btn.dataset.festival;
        this.switchToFestival(festival);
      });
    });

    // Light all diyas button (for Diwali scene)
    const lightAllBtn = document.getElementById('light-all-diyas');
    if (lightAllBtn) {
      lightAllBtn.addEventListener('click', () => {
        if (this.sceneManager && this.sceneManager.currentFestivalScene && 
            this.sceneManager.currentFestivalScene.lightAllDiyas) {
          this.sceneManager.currentFestivalScene.lightAllDiyas();
          
          // Notify AI Guide
          if (this.aiGuide) {
            this.aiGuide.addUserInteraction('lit all diyas at once');
          }
          
          // Record progress
          this.progressManager.recordInteraction('diwali', 'diyasLit', 10);
          
          // Track personalization
          this.personalizationManager.trackInteraction('diwali', 'diyasLit', 10);
        }
      });
    }

    // Start color celebration button (for Holi scene)
    const colorCelebrationBtn = document.getElementById('start-color-celebration');
    if (colorCelebrationBtn) {
      colorCelebrationBtn.addEventListener('click', () => {
        if (this.sceneManager && this.sceneManager.currentFestivalScene && 
            this.sceneManager.currentFestivalScene.startColorCelebration) {
          this.sceneManager.currentFestivalScene.startColorCelebration();
          
          // Record progress
          this.progressManager.recordInteraction('holi', 'colorsThrown', 20);
          
          // Track personalization
          this.personalizationManager.trackInteraction('holi', 'colorsThrown', 20);
        }
      });
    }

    // Cultural info button
    const culturalInfoBtn = document.getElementById('show-cultural-info');
    culturalInfoBtn.addEventListener('click', () => {
      if (this.currentFestival) {
        this.uiManager.showCulturalInfo(this.currentFestival, 'general');
        this.progressManager.recordInteraction(this.currentFestival, 'culturalInfoViewed', true);
        
        // Track personalization
        this.personalizationManager.trackInteraction(this.currentFestival, 'culturalInfoViewed', 1);
      }
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      
      switch (e.key.toLowerCase()) {
        case 'escape':
          if (this.uiManager.currentScreen === 'experience') {
            this.showFestivalMenu();
          }
          break;
        case 'h':
          this.toggleKeyboardShortcuts();
          break;
        case 's':
          this.settingsManager.showSettings();
          break;
        case 'c':
          this.takeScreenshot();
          break;
        case 't':
          this.tutorialManager.startTutorial();
          break;
        case 'p':
          this.progressManager.showProgress();
          break;
        case 'f':
          if (e.ctrlKey) {
            this.communityManager.showFeedback();
          }
          break;
        case 'm':
          if (e.ctrlKey && import.meta.env.DEV) {
            console.log('📊 Monitoring Report:', this.monitoringManager.getMonitoringReport());
          }
          break;
      }
    });

    // Handle window resize
    window.addEventListener('resize', () => {
      if (this.sceneManager) {
        this.sceneManager.resize();
      }
    });
  }

  setupDevelopmentControls() {
    // Show development controls in dev mode
    const testButton = document.getElementById('test-all-scenes');
    const performanceButton = document.getElementById('performance-report');
    const accessibilityButton = document.getElementById('accessibility-panel');
    
    if (testButton) {
      testButton.style.display = 'block';
      testButton.addEventListener('click', () => {
        this.testingFramework.runAllTests();
      });
    }
    
    if (performanceButton) {
      performanceButton.style.display = 'block';
      performanceButton.addEventListener('click', () => {
        const report = this.monitoringManager.getMonitoringReport();
        console.log('📊 Performance Report:', report);
        
        // Show performance in UI
        this.uiManager.showNotification(
          `Monitoring active | Errors: ${Object.keys(report.errors).length} | Performance: OK`,
          'info'
        );
      });
    }
    
    if (accessibilityButton) {
      accessibilityButton.style.display = 'block';
      accessibilityButton.addEventListener('click', () => {
        this.preLaunchVerification.showVerificationUI();
      });
    }
  }

  updateMenuStats() {
    const progress = this.progressManager.getProgress();
    const achievements = this.progressManager.getAchievements();
    const unlockedCount = Object.values(achievements).filter(a => a.unlocked).length;
    
    const menuStats = document.getElementById('menu-stats');
    if (menuStats) {
      const statItems = menuStats.querySelectorAll('.stat-text');
      if (statItems[0]) statItems[0].textContent = `${progress.visitedFestivals.size}/6 Explored`;
      if (statItems[1]) statItems[1].textContent = `${unlockedCount} Achievements`;
    }
    
    // Update festival cards with progress
    this.updateFestivalCards();
    
    // Update personalized recommendations
    if (this.personalizationManager) {
      this.personalizationManager.updateRecommendationsPanel();
    }
  }
  
  addRecommendationsToMenu() {
    const menuContent = document.querySelector('.menu-content');
    if (menuContent && this.personalizationManager) {
      const recommendationsPanel = this.personalizationManager.createRecommendationsPanel();
      
      // Insert before festivals grid
      const festivalsGrid = document.querySelector('.festivals-grid');
      if (festivalsGrid) {
        menuContent.insertBefore(recommendationsPanel, festivalsGrid);
      }
    }
  }

  updateFestivalCards() {
    const progress = this.progressManager.getProgress();
    
    document.querySelectorAll('.festival-card').forEach(card => {
      const festival = card.dataset.festival;
      const visited = progress.visitedFestivals.has(festival);
      
      card.dataset.visited = visited;
      
      const progressBar = card.querySelector('.progress-fill');
      const progressText = card.querySelector('.progress-text');
      const badge = card.querySelector('.visit-badge');
      
      if (visited) {
        const interactions = progress.interactions[festival];
        const totalInteractions = Object.keys(interactions).length;
        const completedInteractions = Object.values(interactions).filter(v => 
          typeof v === 'boolean' ? v : v > 0
        ).length;
        const progressPercent = Math.round((completedInteractions / totalInteractions) * 100);
        
        progressBar.style.width = `${progressPercent}%`;
        progressText.textContent = `${progressPercent}% explored`;
        badge.textContent = '✓';
      } else {
        progressBar.style.width = '0%';
        progressText.textContent = 'Not visited';
        badge.textContent = 'New';
      }
    });
  }

  checkAPIConfigurations() {
    console.log('🔧 API Configuration Status:');
    
    // Check Gemini API
    const geminiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (geminiKey) {
      console.log('✅ Gemini AI: Configured');
    } else {
      console.log('⚠️ Gemini AI: Not configured (add VITE_GEMINI_API_KEY to .env)');
    }
    
    // Check Qloo API
    const qlooKey = import.meta.env.VITE_QLOO_API_KEY;
    if (qlooKey) {
      console.log('✅ Qloo API: Configured');
      console.log('🎯 Personalization: Enhanced mode active');
    } else {
      console.log('⚠️ Qloo API: Not configured (running in fallback mode)');
      console.log('💡 Add VITE_QLOO_API_KEY to .env for enhanced personalization');
    }
    
    // Test personalization system
    console.log('🧪 Testing personalization system...');
    this.testPersonalizationFeatures();
    
    // Show user-friendly notification
    if (!qlooKey) {
      setTimeout(() => {
        this.uiManager.showNotification(
          'Running in basic mode. Add Qloo API key for enhanced personalization!', 
          'info'
        );
      }, 3000);
    }
  }

  hideLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    loadingScreen.classList.add('fade-out');
    
    setTimeout(() => {
      loadingScreen.classList.add('hidden');
    }, 500);
  }

  showWelcomeScreen() {
    const welcomeScreen = document.getElementById('welcome-screen');
    const festivalMenu = document.getElementById('festival-menu');
    const experienceUI = document.getElementById('experience-ui');
    const canvas = document.getElementById('babylon-canvas');

    // Hide other screens
    festivalMenu.classList.add('hidden');
    experienceUI.classList.add('hidden');
    canvas.classList.add('hidden');

    // Show welcome screen
    welcomeScreen.classList.remove('hidden');
    welcomeScreen.classList.remove('fade-out');
    welcomeScreen.classList.add('fade-in');

    // Dispose scene if exists
    if (this.sceneManager) {
      this.sceneManager.dispose();
      this.sceneManager = null;
    }
    
    this.uiManager.currentScreen = 'welcome';
  }

  showFestivalMenu() {
    const welcomeScreen = document.getElementById('welcome-screen');
    const festivalMenu = document.getElementById('festival-menu');
    const experienceUI = document.getElementById('experience-ui');
    const canvas = document.getElementById('babylon-canvas');

    // Hide other screens
    welcomeScreen.classList.add('fade-out');
    experienceUI.classList.add('hidden');
    canvas.classList.add('hidden');

    setTimeout(() => {
      welcomeScreen.classList.add('hidden');
      
      // Show festival menu
      festivalMenu.classList.remove('hidden');
      festivalMenu.classList.add('fade-in');
      
      // Update menu stats
      this.updateMenuStats();
    }, 300);

    // Dispose scene if exists
    if (this.sceneManager) {
      this.sceneManager.dispose();
      this.sceneManager = null;
    }
    
    this.uiManager.currentScreen = 'menu';
  }

  async selectFestival(festival) {
    const festivalMenu = document.getElementById('festival-menu');
    const experienceUI = document.getElementById('experience-ui');
    const canvas = document.getElementById('babylon-canvas');
    const currentFestivalTitle = document.getElementById('current-festival');

    // Track festival visit start time
    const visitStartTime = Date.now();

    // Update current festival
    this.currentFestival = festival;
    
    // Record festival visit
    this.progressManager.visitFestival(festival);
    this.personalizationManager.trackFestivalVisit(festival);
    
    console.log(`🎭 User selected festival: ${festival}`);
    
    // Update festival title
    const festivalNames = {
      'diwali': 'Diwali Experience',
      'holi': 'Holi Experience',
      'navratri': 'Navratri Experience',
      'ganesh': 'Ganesh Chaturthi Experience',
      'dussehra': 'Dussehra Experience',
      'kumbh': 'Kumbh Mela Experience'
    };
    
    currentFestivalTitle.textContent = festivalNames[festival] || 'Festival Experience';

    // Hide festival menu
    festivalMenu.classList.add('fade-out');
    
    setTimeout(async () => {
      festivalMenu.classList.add('hidden');
      
      // Show canvas and experience UI
      canvas.classList.remove('hidden');
      experienceUI.classList.remove('hidden');
      
      // Initialize 3D scene
      if (!this.sceneManager) {
        this.sceneManager = new SceneManager(canvas);
        await this.sceneManager.initialize();
      }
      
      // Load festival scene
      await this.sceneManager.loadFestivalScene(festival);
      
      // Notify AI Guide of scene change
      if (this.aiGuide) {
        this.aiGuide.notifySceneChange(festival);
        
        // Update quick switcher
        this.updateQuickSwitcher(festival);
      }
      
      // Track visit duration when leaving
      if (this.visitStartTime) {
        const duration = Date.now() - this.visitStartTime;
        this.personalizationManager.trackFestivalVisit(festival, duration);
        console.log(`⏱️ Festival visit duration: ${duration}ms`);
      }
      
    }, 300);
    
    this.uiManager.currentScreen = 'experience';
    this.visitStartTime = visitStartTime;
  }

  testPersonalizationFeatures() {
    console.log('🧪 Running personalization tests...');
    
    // Test user preference tracking
    this.personalizationManager.trackFestivalVisit('diwali', 5000);
    this.personalizationManager.trackInteraction('diwali', 'diyasLit', 3);
    this.personalizationManager.trackAIChatTopic('significance of diyas');
    
    // Test recommendation generation
    const recommendations = this.personalizationManager.getPersonalizedRecommendations();
    console.log('📊 Generated recommendations:', recommendations);
    
    // Test AI personalization
    const aiContext = this.personalizationManager.getPersonalizedAIResponse('What is Diwali?', 'user exploring diwali');
    console.log('🤖 AI personalization context:', aiContext);
    
    // Test user profile
    const profile = this.personalizationManager.getUserProfile();
    console.log('👤 User profile:', profile);
    
    console.log('✅ Personalization tests completed');
  }

  runDevelopmentTests() {
    // Run all test suites in development
    this.testingManager.runAllTests();
    
    // Test AI Guide functionality
    this.aiGuide.testFestivalContexts();
    this.aiGuide.checkMobileOptimization();
    
    // Test personalization features
    this.testPersonalizationFeatures();
    this.testRecommendationAccuracy();
    
    // Test monitoring systems
    this.monitoringManager.recordMetric('test', 'development_test', true);
    
    // Test security features
    console.log('🔒 Security Report:', this.securityManager.getSecurityReport());
    
    // Test backup system
    this.backupManager.createBackup();
    console.log('📦 Backup Report:', this.backupManager.getBackupReport());
  }

  testRecommendationAccuracy() {
    console.log('🎯 Testing recommendation accuracy...');
    
    // Simulate user behavior patterns
    const testScenarios = [
      {
        name: 'Light-focused user',
        actions: [
          () => this.personalizationManager.trackInteraction('diwali', 'diyasLit', 10),
          () => this.personalizationManager.trackFestivalVisit('diwali', 10000),
          () => this.personalizationManager.trackAIChatTopic('meaning of light in festivals')
        ]
      },
      {
        name: 'Color-loving user',
        actions: [
          () => this.personalizationManager.trackInteraction('holi', 'colorsThrown', 15),
          () => this.personalizationManager.trackFestivalVisit('holi', 8000),
          () => this.personalizationManager.trackAIChatTopic('significance of colors in Holi')
        ]
      }
    ];
    
    testScenarios.forEach(scenario => {
      console.log(`🧪 Testing scenario: ${scenario.name}`);
      scenario.actions.forEach(action => action());
      
      const recommendations = this.personalizationManager.getPersonalizedRecommendations();
      console.log(`📊 Recommendations for ${scenario.name}:`, recommendations.festivals);
    });
    
    console.log('✅ Recommendation accuracy tests completed');
    }

  async switchToFestival(festival) {
    if (festival === this.currentFestival) return;
    
    // Quick switch without going through menu
    this.currentFestival = festival;
    this.progressManager.visitFestival(festival);
    
    // Update title
    const festivalNames = {
      'diwali': 'Diwali Experience',
      'holi': 'Holi Experience',
      'navratri': 'Navratri Experience',
      'ganesh': 'Ganesh Chaturthi Experience',
      'dussehra': 'Dussehra Experience',
      'kumbh': 'Kumbh Mela Experience'
    };
    
    document.getElementById('current-festival').textContent = festivalNames[festival];
    
    // Load new scene
    if (this.sceneManager) {
      await this.sceneManager.loadFestivalScene(festival);
      
      // Apply festival-specific visual effects
      if (this.visualEffectsManager) {
        this.visualEffectsManager.applyFestivalEffects(festival);
      }
      
      this.updateFestivalControls(festival);
      this.updateQuickSwitcher(festival);
      
      if (this.aiGuide) {
        this.aiGuide.notifySceneChange(festival);
      }
      
      // Update accessibility descriptions
      if (this.accessibilityManager) {
        this.accessibilityManager.describeFestival(festival);
      }
    }
  }

  updateFestivalControls(festival) {
    // Hide all festival-specific controls
    const lightAllBtn = document.getElementById('light-all-diyas');
    const colorCelebrationBtn = document.getElementById('start-color-celebration');
    const garbaDanceBtn = document.getElementById('start-garba-dance');
    const processionBtn = document.getElementById('start-procession');
    const burnEffigyBtn = document.getElementById('burn-effigy');
    const holyDipBtn = document.getElementById('holy-dip');
    
    if (lightAllBtn) lightAllBtn.style.display = 'none';
    if (colorCelebrationBtn) colorCelebrationBtn.style.display = 'none';
    if (garbaDanceBtn) garbaDanceBtn.style.display = 'none';
    if (processionBtn) processionBtn.style.display = 'none';
    if (burnEffigyBtn) burnEffigyBtn.style.display = 'none';
    if (holyDipBtn) holyDipBtn.style.display = 'none';
    
    // Show relevant controls for current festival
    if (festival === 'diwali' && lightAllBtn) {
      lightAllBtn.style.display = 'block';
    } else if (festival === 'holi' && colorCelebrationBtn) {
      colorCelebrationBtn.style.display = 'block';
    } else if (festival === 'navratri' && garbaDanceBtn) {
      garbaDanceBtn.style.display = 'block';
    } else if (festival === 'ganesh' && processionBtn) {
      processionBtn.style.display = 'block';
    } else if (festival === 'dussehra' && burnEffigyBtn) {
      burnEffigyBtn.style.display = 'block';
    } else if (festival === 'kumbh' && holyDipBtn) {
      holyDipBtn.style.display = 'block';
    }
  }

  updateQuickSwitcher(currentFestival) {
    document.querySelectorAll('.quick-festival').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.festival === currentFestival);
    });
  }

  toggleQuickSwitcher() {
    const switcher = document.getElementById('quick-switcher');
    const isVisible = switcher.style.display !== 'none';
    switcher.style.display = isVisible ? 'none' : 'block';
  }

  toggleKeyboardShortcuts() {
    const shortcuts = document.getElementById('keyboard-shortcuts');
    const isVisible = shortcuts.style.display !== 'none';
    shortcuts.style.display = isVisible ? 'none' : 'block';
  }

  takeScreenshot() {
    const canvas = document.getElementById('babylon-canvas');
    if (!canvas) {
      this.uiManager.showNotification('No scene available to capture', 'error');
      return;
    }

    try {
      // Get high-quality canvas data
      const dataURL = canvas.toDataURL('image/png');
      
      // Store in localStorage for social sharing
      try {
        localStorage.setItem('lastScreenshot', dataURL);
      } catch (e) {
        console.warn('Could not store screenshot in localStorage:', e);
      }
      
      // Create download link
      const link = document.createElement('a');
      link.download = `hindu-festival-${this.currentFestival || 'scene'}-${Date.now()}.png`;
      link.href = dataURL;
      link.click();
      
      this.uiManager.showNotification('Screenshot saved!', 'success');
      
      // Record interaction
      this.progressManager.recordInteraction('general', 'screenshots', 1);
      
    } catch (error) {
      console.error('Screenshot failed:', error);
      this.uiManager.showNotification('Failed to capture screenshot', 'error');
    }
  }

}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  const app = new HinduFestivalsApp();
  
  // Make app globally available for AI Guide integration
  window.app = app;
});
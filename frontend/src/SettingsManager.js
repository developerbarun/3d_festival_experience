export class SettingsManager {
  constructor() {
    this.settings = {
      audio: {
        masterVolume: 0.8,
        musicVolume: 0.7,
        effectsVolume: 0.9,
        ambientVolume: 0.6
      },
      graphics: {
        quality: 'medium', // low, medium, high
        particles: true,
        shadows: true,
        antialiasing: true,
        mobileOptimizations: this.isMobile()
      },
      accessibility: {
        reducedMotion: false,
        highContrast: false,
        largeText: false,
        screenReader: false
      },
      language: 'english', // english, hindi
      tutorial: {
        completed: false,
        showTooltips: true,
        showHints: true
      }
    };
    
    this.loadSettings();
    this.createSettingsPanel();
  }

  isMobile() {
    return window.innerWidth <= 768 || /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }

  loadSettings() {
    const saved = localStorage.getItem('hinduFestivalsSettings');
    if (saved) {
      try {
        const parsedSettings = JSON.parse(saved);
        this.settings = { ...this.settings, ...parsedSettings };
      } catch (error) {
        console.warn('Failed to load settings:', error);
      }
    }
  }

  saveSettings() {
    localStorage.setItem('hinduFestivalsSettings', JSON.stringify(this.settings));
    this.applySettings();
  }

  applySettings() {
    // Apply graphics settings
    this.applyGraphicsSettings();
    
    // Apply audio settings
    this.applyAudioSettings();
    
    // Apply accessibility settings
    this.applyAccessibilitySettings();
    
    // Apply language settings
    this.applyLanguageSettings();
  }

  applyGraphicsSettings() {
    const { quality, particles, shadows, antialiasing, mobileOptimizations } = this.settings.graphics;
    
    document.body.classList.toggle('low-quality', quality === 'low');
    document.body.classList.toggle('medium-quality', quality === 'medium');
    document.body.classList.toggle('high-quality', quality === 'high');
    document.body.classList.toggle('mobile-optimized', mobileOptimizations);
    document.body.classList.toggle('no-particles', !particles);
    document.body.classList.toggle('no-shadows', !shadows);
  }

  applyAudioSettings() {
    // Audio settings would be applied to audio elements when implemented
    const { masterVolume, musicVolume, effectsVolume, ambientVolume } = this.settings.audio;
    
    // Set CSS custom properties for volume levels
    document.documentElement.style.setProperty('--master-volume', masterVolume);
    document.documentElement.style.setProperty('--music-volume', musicVolume);
    document.documentElement.style.setProperty('--effects-volume', effectsVolume);
    document.documentElement.style.setProperty('--ambient-volume', ambientVolume);
  }

  applyAccessibilitySettings() {
    const { reducedMotion, highContrast, largeText, screenReader } = this.settings.accessibility;
    
    document.body.classList.toggle('reduced-motion', reducedMotion);
    document.body.classList.toggle('high-contrast', highContrast);
    document.body.classList.toggle('large-text', largeText);
    document.body.classList.toggle('screen-reader', screenReader);
  }

  applyLanguageSettings() {
    document.body.classList.toggle('hindi-labels', this.settings.language === 'hindi');
  }

  createSettingsPanel() {
    const settingsPanel = document.createElement('div');
    settingsPanel.id = 'settings-panel';
    settingsPanel.innerHTML = `
      <div class="settings-overlay" id="settings-overlay"></div>
      <div class="settings-content">
        <div class="settings-header">
          <h2>Settings</h2>
          <button class="close-settings" id="close-settings">×</button>
        </div>
        
        <div class="settings-tabs">
          <button class="settings-tab active" data-tab="audio">🔊 Audio</button>
          <button class="settings-tab" data-tab="graphics">🎨 Graphics</button>
          <button class="settings-tab" data-tab="accessibility">♿ Accessibility</button>
          <button class="settings-tab" data-tab="language">🌐 Language</button>
        </div>
        
        <div class="settings-sections">
          <!-- Audio Settings -->
          <div class="settings-section active" id="audio-settings">
            <div class="setting-group">
              <label>Master Volume</label>
              <input type="range" id="master-volume" min="0" max="1" step="0.1" value="${this.settings.audio.masterVolume}">
              <span class="volume-value">${Math.round(this.settings.audio.masterVolume * 100)}%</span>
            </div>
            <div class="setting-group">
              <label>Music Volume</label>
              <input type="range" id="music-volume" min="0" max="1" step="0.1" value="${this.settings.audio.musicVolume}">
              <span class="volume-value">${Math.round(this.settings.audio.musicVolume * 100)}%</span>
            </div>
            <div class="setting-group">
              <label>Effects Volume</label>
              <input type="range" id="effects-volume" min="0" max="1" step="0.1" value="${this.settings.audio.effectsVolume}">
              <span class="volume-value">${Math.round(this.settings.audio.effectsVolume * 100)}%</span>
            </div>
            <div class="setting-group">
              <label>Ambient Volume</label>
              <input type="range" id="ambient-volume" min="0" max="1" step="0.1" value="${this.settings.audio.ambientVolume}">
              <span class="volume-value">${Math.round(this.settings.audio.ambientVolume * 100)}%</span>
            </div>
          </div>
          
          <!-- Graphics Settings -->
          <div class="settings-section" id="graphics-settings">
            <div class="setting-group">
              <label>Graphics Quality</label>
              <select id="graphics-quality">
                <option value="low" ${this.settings.graphics.quality === 'low' ? 'selected' : ''}>Low</option>
                <option value="medium" ${this.settings.graphics.quality === 'medium' ? 'selected' : ''}>Medium</option>
                <option value="high" ${this.settings.graphics.quality === 'high' ? 'selected' : ''}>High</option>
              </select>
            </div>
            <div class="setting-group">
              <label>
                <input type="checkbox" id="particles-enabled" ${this.settings.graphics.particles ? 'checked' : ''}>
                Enable Particle Effects
              </label>
            </div>
            <div class="setting-group">
              <label>
                <input type="checkbox" id="shadows-enabled" ${this.settings.graphics.shadows ? 'checked' : ''}>
                Enable Shadows
              </label>
            </div>
            <div class="setting-group">
              <label>
                <input type="checkbox" id="antialiasing-enabled" ${this.settings.graphics.antialiasing ? 'checked' : ''}>
                Enable Antialiasing
              </label>
            </div>
            <div class="setting-group">
              <label>
                <input type="checkbox" id="mobile-optimizations" ${this.settings.graphics.mobileOptimizations ? 'checked' : ''}>
                Mobile Optimizations
              </label>
            </div>
          </div>
          
          <!-- Accessibility Settings -->
          <div class="settings-section" id="accessibility-settings">
            <div class="setting-group">
              <label>
                <input type="checkbox" id="reduced-motion" ${this.settings.accessibility.reducedMotion ? 'checked' : ''}>
                Reduce Motion
              </label>
            </div>
            <div class="setting-group">
              <label>
                <input type="checkbox" id="high-contrast" ${this.settings.accessibility.highContrast ? 'checked' : ''}>
                High Contrast Mode
              </label>
            </div>
            <div class="setting-group">
              <label>
                <input type="checkbox" id="large-text" ${this.settings.accessibility.largeText ? 'checked' : ''}>
                Large Text
              </label>
            </div>
            <div class="setting-group">
              <label>
                <input type="checkbox" id="screen-reader" ${this.settings.accessibility.screenReader ? 'checked' : ''}>
                Screen Reader Support
              </label>
            </div>
          </div>
          
          <!-- Language Settings -->
          <div class="settings-section" id="language-settings">
            <div class="setting-group">
              <label>Interface Language</label>
              <select id="language-select">
                <option value="english" ${this.settings.language === 'english' ? 'selected' : ''}>English</option>
                <option value="hindi" ${this.settings.language === 'hindi' ? 'selected' : ''}>हिंदी (Hindi)</option>
              </select>
            </div>
            <div class="setting-group">
              <label>
                <input type="checkbox" id="show-tooltips" ${this.settings.tutorial.showTooltips ? 'checked' : ''}>
                Show Help Tooltips
              </label>
            </div>
            <div class="setting-group">
              <label>
                <input type="checkbox" id="show-hints" ${this.settings.tutorial.showHints ? 'checked' : ''}>
                Show Interaction Hints
              </label>
            </div>
          </div>
        </div>
        
        <div class="settings-footer">
          <button class="settings-btn secondary" id="reset-settings">Reset to Default</button>
          <button class="settings-btn primary" id="save-settings">Save Changes</button>
        </div>
      </div>
    `;

    document.body.appendChild(settingsPanel);
    this.setupSettingsEvents();
  }

  setupSettingsEvents() {
    // Tab switching
    document.querySelectorAll('.settings-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        const tabName = tab.dataset.tab;
        this.switchSettingsTab(tabName);
      });
    });

    // Close settings
    document.getElementById('close-settings').addEventListener('click', () => {
      this.hideSettings();
    });

    document.getElementById('settings-overlay').addEventListener('click', () => {
      this.hideSettings();
    });

    // Volume sliders
    ['master', 'music', 'effects', 'ambient'].forEach(type => {
      const slider = document.getElementById(`${type}-volume`);
      const valueSpan = slider.nextElementSibling;
      
      slider.addEventListener('input', (e) => {
        const value = parseFloat(e.target.value);
        this.settings.audio[`${type}Volume`] = value;
        valueSpan.textContent = `${Math.round(value * 100)}%`;
      });
    });

    // Graphics settings
    document.getElementById('graphics-quality').addEventListener('change', (e) => {
      this.settings.graphics.quality = e.target.value;
    });

    ['particles', 'shadows', 'antialiasing', 'mobile-optimizations'].forEach(setting => {
      const checkbox = document.getElementById(`${setting}-enabled`) || document.getElementById(setting);
      if (checkbox) {
        checkbox.addEventListener('change', (e) => {
          const key = setting.replace('-', '');
          if (key === 'mobileoptimizations') {
            this.settings.graphics.mobileOptimizations = e.target.checked;
          } else {
            this.settings.graphics[key] = e.target.checked;
          }
        });
      }
    });

    // Accessibility settings
    ['reduced-motion', 'high-contrast', 'large-text', 'screen-reader'].forEach(setting => {
      const checkbox = document.getElementById(setting);
      if (checkbox) {
        checkbox.addEventListener('change', (e) => {
          const key = setting.replace('-', '');
          if (key === 'reducedmotion') {
            this.settings.accessibility.reducedMotion = e.target.checked;
          } else if (key === 'highcontrast') {
            this.settings.accessibility.highContrast = e.target.checked;
          } else if (key === 'largetext') {
            this.settings.accessibility.largeText = e.target.checked;
          } else if (key === 'screenreader') {
            this.settings.accessibility.screenReader = e.target.checked;
          }
        });
      }
    });

    // Language settings
    document.getElementById('language-select').addEventListener('change', (e) => {
      this.settings.language = e.target.value;
    });

    document.getElementById('show-tooltips').addEventListener('change', (e) => {
      this.settings.tutorial.showTooltips = e.target.checked;
    });

    document.getElementById('show-hints').addEventListener('change', (e) => {
      this.settings.tutorial.showHints = e.target.checked;
    });

    // Save and reset buttons
    document.getElementById('save-settings').addEventListener('click', () => {
      this.saveSettings();
      this.hideSettings();
      this.showNotification('Settings saved successfully!', 'success');
    });

    document.getElementById('reset-settings').addEventListener('click', () => {
      this.resetSettings();
    });
  }

  switchSettingsTab(tabName) {
    // Update tab buttons
    document.querySelectorAll('.settings-tab').forEach(tab => {
      tab.classList.toggle('active', tab.dataset.tab === tabName);
    });

    // Update sections
    document.querySelectorAll('.settings-section').forEach(section => {
      section.classList.toggle('active', section.id === `${tabName}-settings`);
    });
  }

  showSettings() {
    document.getElementById('settings-panel').classList.add('active');
    document.body.classList.add('settings-open');
  }

  hideSettings() {
    document.getElementById('settings-panel').classList.remove('active');
    document.body.classList.remove('settings-open');
  }

  resetSettings() {
    if (confirm('Are you sure you want to reset all settings to default?')) {
      localStorage.removeItem('hinduFestivalsSettings');
      location.reload();
    }
  }

  showNotification(message, type = 'info') {
    // Use existing notification system
    if (window.app && window.app.uiManager) {
      window.app.uiManager.showNotification(message, type);
    }
  }

  getSetting(category, key) {
    return this.settings[category]?.[key];
  }

  setSetting(category, key, value) {
    if (this.settings[category]) {
      this.settings[category][key] = value;
      this.saveSettings();
    }
  }
}
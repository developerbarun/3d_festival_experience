export class AudioManager {
  constructor() {
    this.audioContext = null;
    this.masterVolume = 0.8;
    this.musicVolume = 0.7;
    this.effectsVolume = 0.9;
    this.ambientVolume = 0.6;
    this.currentMusic = null;
    this.soundEffects = new Map();
    this.ambientSounds = new Map();
    this.isInitialized = false;
    this.isMuted = false;
    
    this.init();
  }

  async init() {
    try {
      // Initialize Web Audio API
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      
      // Create audio nodes
      this.masterGain = this.audioContext.createGain();
      this.musicGain = this.audioContext.createGain();
      this.effectsGain = this.audioContext.createGain();
      this.ambientGain = this.audioContext.createGain();
      
      // Connect audio graph
      this.musicGain.connect(this.masterGain);
      this.effectsGain.connect(this.masterGain);
      this.ambientGain.connect(this.masterGain);
      this.masterGain.connect(this.audioContext.destination);
      
      // Set initial volumes
      this.updateVolumes();
      
      // Preload festival audio
      this.preloadFestivalAudio();
      
      this.isInitialized = true;
      console.log('Audio Manager initialized successfully');
      
    } catch (error) {
      console.warn('Audio initialization failed:', error);
    }
  }

  preloadFestivalAudio() {
    // Define festival audio assets
    const festivalAudio = {
      diwali: {
        music: 'traditional_diwali_music.mp3',
        ambient: 'crackling_diyas.mp3',
        effects: ['diya_light.mp3', 'firework_burst.mp3']
      },
      holi: {
        music: 'holi_celebration_music.mp3',
        ambient: 'crowd_celebration.mp3',
        effects: ['color_splash.mp3', 'laughter.mp3']
      },
      navratri: {
        music: 'garba_dance_music.mp3',
        ambient: 'dhol_beats.mp3',
        effects: ['dandiya_clash.mp3', 'dance_steps.mp3']
      },
      ganesh: {
        music: 'ganesh_aarti.mp3',
        ambient: 'temple_bells.mp3',
        effects: ['dhol_tasha.mp3', 'water_splash.mp3']
      },
      dussehra: {
        music: 'ramlila_music.mp3',
        ambient: 'crowd_chanting.mp3',
        effects: ['fire_crackling.mp3', 'arrow_shot.mp3']
      },
      kumbh: {
        music: 'spiritual_chants.mp3',
        ambient: 'river_flowing.mp3',
        effects: ['water_splash.mp3', 'bell_ring.mp3']
      }
    };

    // Note: In a real implementation, these would be actual audio files
    // For now, we'll create placeholder audio objects
    Object.entries(festivalAudio).forEach(([festival, audio]) => {
      this.soundEffects.set(festival, {
        music: this.createPlaceholderAudio(audio.music),
        ambient: this.createPlaceholderAudio(audio.ambient),
        effects: audio.effects.map(effect => this.createPlaceholderAudio(effect))
      });
    });

    console.log('Festival audio assets preloaded');
  }

  createPlaceholderAudio(filename) {
    // Create placeholder audio object for development
    return {
      filename: filename,
      duration: 30 + Math.random() * 60, // Random duration 30-90 seconds
      loaded: true,
      play: () => console.log(`Playing: ${filename}`),
      pause: () => console.log(`Pausing: ${filename}`),
      stop: () => console.log(`Stopping: ${filename}`)
    };
  }

  async loadFestivalAudio(festival) {
    if (!this.isInitialized) return;

    try {
      const festivalAudio = this.soundEffects.get(festival);
      if (!festivalAudio) {
        console.warn(`No audio defined for festival: ${festival}`);
        return;
      }

      // In a real implementation, this would load actual audio files
      console.log(`Loading audio for ${festival} festival`);
      
      // Simulate loading time
      await new Promise(resolve => setTimeout(resolve, 500));
      
      console.log(`Audio loaded for ${festival}`);
      
    } catch (error) {
      console.error(`Failed to load audio for ${festival}:`, error);
    }
  }

  playFestivalMusic(festival) {
    if (!this.isInitialized || this.isMuted) return;

    try {
      // Stop current music
      this.stopMusic();
      
      const festivalAudio = this.soundEffects.get(festival);
      if (festivalAudio && festivalAudio.music) {
        this.currentMusic = festivalAudio.music;
        this.currentMusic.play();
        console.log(`Playing ${festival} festival music`);
      }
      
    } catch (error) {
      console.error('Failed to play festival music:', error);
    }
  }

  playAmbientSound(festival) {
    if (!this.isInitialized || this.isMuted) return;

    try {
      const festivalAudio = this.soundEffects.get(festival);
      if (festivalAudio && festivalAudio.ambient) {
        festivalAudio.ambient.play();
        console.log(`Playing ${festival} ambient sounds`);
      }
      
    } catch (error) {
      console.error('Failed to play ambient sound:', error);
    }
  }

  playEffect(festival, effectName) {
    if (!this.isInitialized || this.isMuted) return;

    try {
      const festivalAudio = this.soundEffects.get(festival);
      if (festivalAudio && festivalAudio.effects) {
        const effect = festivalAudio.effects.find(e => e.filename.includes(effectName));
        if (effect) {
          effect.play();
          console.log(`Playing effect: ${effectName}`);
        }
      }
      
    } catch (error) {
      console.error('Failed to play sound effect:', error);
    }
  }

  stopMusic() {
    if (this.currentMusic) {
      this.currentMusic.stop();
      this.currentMusic = null;
    }
  }

  stopAllSounds() {
    this.stopMusic();
    
    // Stop all ambient sounds and effects
    this.soundEffects.forEach(festivalAudio => {
      if (festivalAudio.ambient) festivalAudio.ambient.stop();
      if (festivalAudio.effects) {
        festivalAudio.effects.forEach(effect => effect.stop());
      }
    });
  }

  setMasterVolume(volume) {
    this.masterVolume = Math.max(0, Math.min(1, volume));
    this.updateVolumes();
  }

  setMusicVolume(volume) {
    this.musicVolume = Math.max(0, Math.min(1, volume));
    this.updateVolumes();
  }

  setEffectsVolume(volume) {
    this.effectsVolume = Math.max(0, Math.min(1, volume));
    this.updateVolumes();
  }

  setAmbientVolume(volume) {
    this.ambientVolume = Math.max(0, Math.min(1, volume));
    this.updateVolumes();
  }

  updateVolumes() {
    if (!this.isInitialized) return;

    this.masterGain.gain.value = this.masterVolume;
    this.musicGain.gain.value = this.musicVolume;
    this.effectsGain.gain.value = this.effectsVolume;
    this.ambientGain.gain.value = this.ambientVolume;
  }

  mute() {
    this.isMuted = true;
    if (this.masterGain) {
      this.masterGain.gain.value = 0;
    }
  }

  unmute() {
    this.isMuted = false;
    this.updateVolumes();
  }

  toggleMute() {
    if (this.isMuted) {
      this.unmute();
    } else {
      this.mute();
    }
  }

  // Festival-specific audio methods
  playDiyaLightSound() {
    this.playEffect('diwali', 'diya_light');
  }

  playColorSplashSound() {
    this.playEffect('holi', 'color_splash');
  }

  playDandiyaClashSound() {
    this.playEffect('navratri', 'dandiya_clash');
  }

  playDholTashaSound() {
    this.playEffect('ganesh', 'dhol_tasha');
  }

  playFireCracklingSound() {
    this.playEffect('dussehra', 'fire_crackling');
  }

  playWaterSplashSound() {
    this.playEffect('kumbh', 'water_splash');
  }

  dispose() {
    this.stopAllSounds();
    
    if (this.audioContext) {
      this.audioContext.close();
    }
    
    this.soundEffects.clear();
    this.ambientSounds.clear();
    
    console.log('Audio Manager disposed');
  }
}
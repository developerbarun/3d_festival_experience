export class SocialManager {
  constructor() {
    this.createSocialPanel();
  }

  createSocialPanel() {
    const socialPanel = document.createElement('div');
    socialPanel.id = 'social-panel';
    socialPanel.innerHTML = `
      <div class="social-overlay" id="social-overlay"></div>
      <div class="social-content">
        <div class="social-header">
          <h2>Share Your Journey</h2>
          <button class="close-social" id="close-social">×</button>
        </div>
        
        <div class="social-options">
          <div class="social-option" id="capture-screenshot">
            <div class="social-icon">📸</div>
            <div class="social-info">
              <h3>Capture Scene</h3>
              <p>Take a screenshot of your current festival experience</p>
            </div>
          </div>
          
          <div class="social-option" id="share-progress">
            <div class="social-icon">🏆</div>
            <div class="social-info">
              <h3>Share Progress</h3>
              <p>Share your cultural learning achievements</p>
            </div>
          </div>
          
          <div class="social-option" id="create-festival-card">
            <div class="social-icon">🎭</div>
            <div class="social-info">
              <h3>Festival Card</h3>
              <p>Create a beautiful card about your favorite festival</p>
            </div>
          </div>
          
          <div class="social-option" id="share-knowledge">
            <div class="social-icon">🧠</div>
            <div class="social-info">
              <h3>Share Knowledge</h3>
              <p>Share interesting facts you've learned</p>
            </div>
          </div>
        </div>
        
        <div class="social-platforms" id="social-platforms" style="display: none;">
          <h3>Share on:</h3>
          <div class="platform-buttons">
            <button class="platform-btn twitter" data-platform="twitter">
              <span class="platform-icon">🐦</span>
              Twitter
            </button>
            <button class="platform-btn facebook" data-platform="facebook">
              <span class="platform-icon">📘</span>
              Facebook
            </button>
            <button class="platform-btn whatsapp" data-platform="whatsapp">
              <span class="platform-icon">💬</span>
              WhatsApp
            </button>
            <button class="platform-btn copy" data-platform="copy">
              <span class="platform-icon">📋</span>
              Copy Link
            </button>
          </div>
        </div>
        
        <div class="social-preview" id="social-preview" style="display: none;">
          <h3>Preview:</h3>
          <div class="preview-content" id="preview-content">
            <!-- Preview content will be generated here -->
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(socialPanel);
    this.setupSocialEvents();
  }

  setupSocialEvents() {
    document.getElementById('close-social').addEventListener('click', () => {
      this.hideSocial();
    });

    document.getElementById('social-overlay').addEventListener('click', () => {
      this.hideSocial();
    });

    // Social options
    document.getElementById('capture-screenshot').addEventListener('click', () => {
      this.captureScreenshot();
    });

    document.getElementById('share-progress').addEventListener('click', () => {
      this.shareProgress();
    });

    document.getElementById('create-festival-card').addEventListener('click', () => {
      this.createFestivalCard();
    });

    document.getElementById('share-knowledge').addEventListener('click', () => {
      this.shareKnowledge();
    });

    // Platform buttons
    document.querySelectorAll('.platform-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const platform = btn.dataset.platform;
        const content = this.getCurrentShareContent();
        this.shareOnPlatform(platform, content);
      });
    });
  }

  showSocial() {
    document.getElementById('social-panel').classList.add('active');
    document.body.classList.add('social-open');
  }

  hideSocial() {
    document.getElementById('social-panel').classList.remove('active');
    document.body.classList.remove('social-open');
    
    // Reset panels
    document.getElementById('social-platforms').style.display = 'none';
    document.getElementById('social-preview').style.display = 'none';
  }

  captureScreenshot() {
    const canvas = document.getElementById('babylon-canvas');
    if (!canvas) {
      this.showNotification('No 3D scene available to capture', 'error');
      return;
    }

    try {
      // Get high-quality scene screenshot
      const dataURL = canvas.toDataURL('image/png');
      
      // Store for sharing
      try {
        localStorage.setItem('lastScreenshot', dataURL);
      } catch (e) {
        console.warn('Could not store screenshot:', e);
      }
      
      // Create preview
      this.showSharePreview('screenshot', {
        image: dataURL,
        text: `Exploring Hindu festivals in VR! 🎭✨ #HinduFestivals #CulturalLearning #VR`
      });
      
    } catch (error) {
      console.error('Screenshot capture failed:', error);
      this.showNotification('Failed to capture screenshot', 'error');
    }
  }

  shareProgress() {
    const progress = window.app?.progressManager?.getProgress();
    if (!progress) {
      this.showNotification('No progress data available', 'error');
      return;
    }

    const achievements = window.app.progressManager.getAchievements();
    const unlockedCount = Object.values(achievements).filter(a => a.unlocked).length;
    
    const shareText = `🎭 My Hindu Festivals Journey:
📍 Explored ${progress.visitedFestivals.size}/6 festivals
🏆 Unlocked ${unlockedCount} achievements
🧠 Cultural knowledge: ${progress.culturalKnowledge.score}%

Join me in exploring India's rich cultural heritage! #HinduFestivals #CulturalLearning`;

    this.showSharePreview('progress', {
      text: shareText,
      stats: {
        festivals: progress.visitedFestivals.size,
        achievements: unlockedCount,
        knowledge: progress.culturalKnowledge.score
      }
    });
  }

  createFestivalCard() {
    const currentFestival = window.app?.currentFestival;
    if (!currentFestival) {
      this.showNotification('Please visit a festival first', 'error');
      return;
    }

    const festivalInfo = {
      diwali: {
        name: 'Diwali - Festival of Lights',
        emoji: '🪔',
        description: 'Celebrating the victory of light over darkness',
        colors: ['#FFD700', '#FF6B35']
      },
      holi: {
        name: 'Holi - Festival of Colors',
        emoji: '🎨',
        description: 'Welcoming spring with vibrant colors and joy',
        colors: ['#FF6B9D', '#4ECDC4']
      },
      navratri: {
        name: 'Navratri - Nine Nights of Dance',
        emoji: '💃',
        description: 'Honoring the divine feminine through dance',
        colors: ['#9B59B6', '#E74C3C']
      },
      ganesh: {
        name: 'Ganesh Chaturthi',
        emoji: '🐘',
        description: 'Celebrating Lord Ganesha, remover of obstacles',
        colors: ['#F39C12', '#E67E22']
      },
      dussehra: {
        name: 'Dussehra - Victory of Good',
        emoji: '🏹',
        description: 'Commemorating the triumph of good over evil',
        colors: ['#E74C3C', '#C0392B']
      },
      kumbh: {
        name: 'Kumbh Mela - Sacred Gathering',
        emoji: '🕉️',
        description: 'The world\'s largest peaceful gathering',
        colors: ['#3498DB', '#2980B9']
      }
    };

    const festival = festivalInfo[currentFestival];
    if (!festival) return;

    // Generate festival card
    const cardHTML = this.generateFestivalCard(festival);
    
    this.showSharePreview('festival-card', {
      html: cardHTML,
      text: `✨ Discovering ${festival.name}! ${festival.emoji}\n\n${festival.description}\n\nExplore Hindu festivals in VR: #HinduFestivals #${currentFestival.charAt(0).toUpperCase() + currentFestival.slice(1)}`
    });
  }

  generateFestivalCard(festival) {
    return `
      <div class="festival-card-preview" style="
        background: linear-gradient(135deg, ${festival.colors[0]}, ${festival.colors[1]});
        padding: 2rem;
        border-radius: 16px;
        color: white;
        text-align: center;
        max-width: 400px;
        margin: 0 auto;
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
      ">
        <div style="font-size: 4rem; margin-bottom: 1rem;">${festival.emoji}</div>
        <h2 style="margin: 0 0 1rem 0; font-size: 1.5rem;">${festival.name}</h2>
        <p style="margin: 0; opacity: 0.9; line-height: 1.5;">${festival.description}</p>
        <div style="margin-top: 1.5rem; padding-top: 1rem; border-top: 1px solid rgba(255,255,255,0.3); font-size: 0.9rem; opacity: 0.8;">
          Hindu Festivals VR Experience
        </div>
      </div>
    `;
  }

  shareKnowledge() {
    // Get recent AI interactions or cultural facts
    const knowledgeFacts = [
      "🪔 Diyas in Diwali represent the inner light that protects from spiritual darkness",
      "🎨 Each color in Holi has meaning: Red for love, Yellow for prosperity, Green for new beginnings",
      "💃 Navratri celebrates nine forms of Goddess Durga over nine nights",
      "🐘 Lord Ganesha is invoked before starting any new venture as the remover of obstacles",
      "🏹 Dussehra celebrates Lord Rama's victory over the demon king Ravana",
      "🕉️ Kumbh Mela occurs every 12 years and is the world's largest peaceful gathering"
    ];

    const randomFact = knowledgeFacts[Math.floor(Math.random() * knowledgeFacts.length)];
    
    const shareText = `💡 Cultural Learning:\n\n${randomFact}\n\nDiscover more about Hindu festivals in VR! #HinduFestivals #CulturalWisdom #Learning`;

    this.showSharePreview('knowledge', {
      text: shareText,
      fact: randomFact
    });
  }

  showSharePreview(type, content) {
    const platformsPanel = document.getElementById('social-platforms');
    const previewPanel = document.getElementById('social-preview');
    const previewContent = document.getElementById('preview-content');

    // Store current content for sharing
    this.currentShareContent = content;
    this.currentShareType = type;

    // Show preview
    if (content.html) {
      previewContent.innerHTML = content.html;
    } else if (content.image) {
      previewContent.innerHTML = `<img src="${content.image}" style="max-width: 100%; border-radius: 8px;">`;
    } else {
      previewContent.innerHTML = `<div class="text-preview">${content.text.replace(/\n/g, '<br>')}</div>`;
    }

    platformsPanel.style.display = 'block';
    previewPanel.style.display = 'block';
  }

  getCurrentShareContent() {
    return this.currentShareContent;
  }

  shareOnPlatform(platform, content) {
    const baseURL = window.location.origin;
    const appURL = `${baseURL}?utm_source=${platform}&utm_medium=social&utm_campaign=hindu_festivals`;

    switch (platform) {
      case 'twitter':
        const twitterText = encodeURIComponent(content.text + '\n\n' + appURL);
        window.open(`https://twitter.com/intent/tweet?text=${twitterText}`, '_blank');
        break;

      case 'facebook':
        const facebookURL = encodeURIComponent(appURL);
        const facebookQuote = encodeURIComponent(content.text);
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${facebookURL}&quote=${facebookQuote}`, '_blank');
        break;

      case 'whatsapp':
        const whatsappText = encodeURIComponent(content.text + '\n\n' + appURL);
        window.open(`https://wa.me/?text=${whatsappText}`, '_blank');
        break;

      case 'copy':
        const textToCopy = content.text + '\n\n' + appURL;
        navigator.clipboard.writeText(textToCopy).then(() => {
          this.showNotification('Link copied to clipboard!', 'success');
        }).catch(() => {
          this.showNotification('Failed to copy link', 'error');
        });
        break;
    }

    // Track sharing event
    if (window.app?.progressManager) {
      window.app.progressManager.recordInteraction('general', 'shared', 1);
    }

    this.hideSocial();
  }

  showNotification(message, type = 'info') {
    if (window.app?.uiManager) {
      window.app.uiManager.showNotification(message, type);
    }
  }
}
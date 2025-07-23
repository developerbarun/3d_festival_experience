export class ProgressManager {
  constructor() {
    this.progress = {
      visitedFestivals: new Set(),
      achievements: new Set(),
      interactions: {
        diwali: {
          diyasLit: 0,
          rangoliViewed: false,
          culturalInfoViewed: false
        },
        holi: {
          colorsThrown: 0,
          peopleColored: 0,
          colorBurstsCreated: 0,
          culturalInfoViewed: false
        },
        navratri: {
          danceWatched: false,
          culturalInfoViewed: false
        },
        ganesh: {
          templeVisited: false,
          culturalInfoViewed: false
        },
        dussehra: {
          effigyViewed: false,
          culturalInfoViewed: false
        },
        kumbh: {
          riverVisited: false,
          culturalInfoViewed: false
        }
      },
      culturalKnowledge: {
        score: 0,
        questionsAnswered: 0,
        correctAnswers: 0
      },
      totalTimeSpent: 0,
      lastVisit: null
    };

    this.achievements = {
      'first-visit': {
        name: 'Welcome Explorer',
        description: 'Started your cultural journey',
        icon: '🙏',
        unlocked: false
      },
      'festival-explorer': {
        name: 'Festival Explorer',
        description: 'Visited 3 different festivals',
        icon: '🎭',
        unlocked: false
      },
      'cultural-scholar': {
        name: 'Cultural Scholar',
        description: 'Learned about all 6 festivals',
        icon: '📚',
        unlocked: false
      },
      'diya-master': {
        name: 'Diya Master',
        description: 'Lit 20 diyas in Diwali',
        icon: '🪔',
        unlocked: false
      },
      'color-champion': {
        name: 'Color Champion',
        description: 'Threw 50 colors in Holi',
        icon: '🎨',
        unlocked: false
      },
      'knowledge-seeker': {
        name: 'Knowledge Seeker',
        description: 'Asked 10 questions to AI Guide',
        icon: '🤔',
        unlocked: false
      },
      'tradition-keeper': {
        name: 'Tradition Keeper',
        description: 'Viewed cultural info for all festivals',
        icon: '🕉️',
        unlocked: false
      }
    };

    this.loadProgress();
    this.createProgressUI();
  }

  loadProgress() {
    const saved = localStorage.getItem('hinduFestivalsProgress');
    if (saved) {
      try {
        const parsedProgress = JSON.parse(saved);
        // Convert visitedFestivals and achievements back to Sets
        if (parsedProgress.visitedFestivals) {
          parsedProgress.visitedFestivals = new Set(parsedProgress.visitedFestivals);
        }
        if (parsedProgress.achievements) {
          parsedProgress.achievements = new Set(parsedProgress.achievements);
        }
        this.progress = { ...this.progress, ...parsedProgress };
        
        // Update achievement unlock status
        this.progress.achievements.forEach(achievementId => {
          if (this.achievements[achievementId]) {
            this.achievements[achievementId].unlocked = true;
          }
        });
      } catch (error) {
        console.warn('Failed to load progress:', error);
      }
    }
  }

  saveProgress() {
    // Convert Sets to Arrays for JSON serialization
    const progressToSave = {
      ...this.progress,
      visitedFestivals: Array.from(this.progress.visitedFestivals),
      achievements: Array.from(this.progress.achievements),
      lastVisit: new Date().toISOString()
    };
    
    localStorage.setItem('hinduFestivalsProgress', JSON.stringify(progressToSave));
  }

  visitFestival(festivalName) {
    this.progress.visitedFestivals.add(festivalName);
    this.checkAchievements();
    this.saveProgress();
  }

  recordInteraction(festival, interaction, value = 1) {
    if (this.progress.interactions[festival] && this.progress.interactions[festival][interaction] !== undefined) {
      if (typeof this.progress.interactions[festival][interaction] === 'number') {
        this.progress.interactions[festival][interaction] += value;
      } else {
        this.progress.interactions[festival][interaction] = true;
      }
      this.checkAchievements();
      this.saveProgress();
    }
  }

  recordCulturalKnowledge(correct = true) {
    this.progress.culturalKnowledge.questionsAnswered++;
    if (correct) {
      this.progress.culturalKnowledge.correctAnswers++;
    }
    this.progress.culturalKnowledge.score = Math.round(
      (this.progress.culturalKnowledge.correctAnswers / this.progress.culturalKnowledge.questionsAnswered) * 100
    );
    this.checkAchievements();
    this.saveProgress();
  }

  checkAchievements() {
    // First visit
    if (!this.achievements['first-visit'].unlocked && this.progress.visitedFestivals.size > 0) {
      this.unlockAchievement('first-visit');
    }

    // Festival explorer
    if (!this.achievements['festival-explorer'].unlocked && this.progress.visitedFestivals.size >= 3) {
      this.unlockAchievement('festival-explorer');
    }

    // Cultural scholar
    if (!this.achievements['cultural-scholar'].unlocked && this.progress.visitedFestivals.size >= 6) {
      this.unlockAchievement('cultural-scholar');
    }

    // Diya master
    if (!this.achievements['diya-master'].unlocked && this.progress.interactions.diwali.diyasLit >= 20) {
      this.unlockAchievement('diya-master');
    }

    // Color champion
    if (!this.achievements['color-champion'].unlocked && this.progress.interactions.holi.colorsThrown >= 50) {
      this.unlockAchievement('color-champion');
    }

    // Knowledge seeker
    if (!this.achievements['knowledge-seeker'].unlocked && this.progress.culturalKnowledge.questionsAnswered >= 10) {
      this.unlockAchievement('knowledge-seeker');
    }

    // Tradition keeper
    const allCulturalInfoViewed = Object.values(this.progress.interactions).every(
      festival => festival.culturalInfoViewed
    );
    if (!this.achievements['tradition-keeper'].unlocked && allCulturalInfoViewed) {
      this.unlockAchievement('tradition-keeper');
    }
  }

  unlockAchievement(achievementId) {
    if (this.achievements[achievementId] && !this.achievements[achievementId].unlocked) {
      this.achievements[achievementId].unlocked = true;
      this.progress.achievements.add(achievementId);
      this.showAchievementNotification(this.achievements[achievementId]);
      this.saveProgress();
    }
  }

  showAchievementNotification(achievement) {
    const notification = document.createElement('div');
    notification.className = 'achievement-notification';
    notification.innerHTML = `
      <div class="achievement-content">
        <div class="achievement-icon">${achievement.icon}</div>
        <div class="achievement-text">
          <h4>Achievement Unlocked!</h4>
          <h3>${achievement.name}</h3>
          <p>${achievement.description}</p>
        </div>
      </div>
    `;

    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
      notification.classList.add('show');
    }, 100);

    // Remove after delay
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 500);
    }, 4000);
  }

  createProgressUI() {
    const progressPanel = document.createElement('div');
    progressPanel.id = 'progress-panel';
    progressPanel.innerHTML = `
      <div class="progress-overlay" id="progress-overlay"></div>
      <div class="progress-content">
        <div class="progress-header">
          <h2>Your Cultural Journey</h2>
          <button class="close-progress" id="close-progress">×</button>
        </div>
        
        <div class="progress-stats">
          <div class="stat-card">
            <div class="stat-icon">🎭</div>
            <div class="stat-info">
              <h3>${this.progress.visitedFestivals.size}</h3>
              <p>Festivals Explored</p>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">🏆</div>
            <div class="stat-info">
              <h3>${this.progress.achievements.size}</h3>
              <p>Achievements</p>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">🧠</div>
            <div class="stat-info">
              <h3>${this.progress.culturalKnowledge.score}%</h3>
              <p>Knowledge Score</p>
            </div>
          </div>
        </div>
        
        <div class="progress-sections">
          <div class="progress-section">
            <h3>Festival Progress</h3>
            <div class="festival-progress" id="festival-progress">
              <!-- Festival progress will be populated here -->
            </div>
          </div>
          
          <div class="progress-section">
            <h3>Achievements</h3>
            <div class="achievements-grid" id="achievements-grid">
              <!-- Achievements will be populated here -->
            </div>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(progressPanel);
    this.populateProgressUI();
    this.setupProgressEvents();
  }

  populateProgressUI() {
    this.populateFestivalProgress();
    this.populateAchievements();
  }

  populateFestivalProgress() {
    const container = document.getElementById('festival-progress');
    const festivals = [
      { id: 'diwali', name: 'Diwali', icon: '🪔' },
      { id: 'holi', name: 'Holi', icon: '🎨' },
      { id: 'navratri', name: 'Navratri', icon: '💃' },
      { id: 'ganesh', name: 'Ganesh Chaturthi', icon: '🐘' },
      { id: 'dussehra', name: 'Dussehra', icon: '🏹' },
      { id: 'kumbh', name: 'Kumbh Mela', icon: '🕉️' }
    ];

    container.innerHTML = festivals.map(festival => {
      const visited = this.progress.visitedFestivals.has(festival.id);
      const interactions = this.progress.interactions[festival.id];
      
      let progressText = 'Not visited';
      let progressPercent = 0;
      
      if (visited) {
        const totalInteractions = Object.keys(interactions).length;
        const completedInteractions = Object.values(interactions).filter(v => 
          typeof v === 'boolean' ? v : v > 0
        ).length;
        progressPercent = Math.round((completedInteractions / totalInteractions) * 100);
        progressText = `${progressPercent}% explored`;
      }

      return `
        <div class="festival-progress-item ${visited ? 'visited' : ''}">
          <div class="festival-icon">${festival.icon}</div>
          <div class="festival-info">
            <h4>${festival.name}</h4>
            <p>${progressText}</p>
            <div class="progress-bar">
              <div class="progress-fill" style="width: ${progressPercent}%"></div>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  populateAchievements() {
    const container = document.getElementById('achievements-grid');
    
    container.innerHTML = Object.entries(this.achievements).map(([id, achievement]) => `
      <div class="achievement-item ${achievement.unlocked ? 'unlocked' : 'locked'}">
        <div class="achievement-icon">${achievement.icon}</div>
        <div class="achievement-info">
          <h4>${achievement.name}</h4>
          <p>${achievement.description}</p>
        </div>
        ${achievement.unlocked ? '<div class="achievement-badge">✓</div>' : ''}
      </div>
    `).join('');
  }

  setupProgressEvents() {
    document.getElementById('close-progress').addEventListener('click', () => {
      this.hideProgress();
    });

    document.getElementById('progress-overlay').addEventListener('click', () => {
      this.hideProgress();
    });
  }

  showProgress() {
    this.populateProgressUI();
    document.getElementById('progress-panel').classList.add('active');
    document.body.classList.add('progress-open');
  }

  hideProgress() {
    document.getElementById('progress-panel').classList.remove('active');
    document.body.classList.remove('progress-open');
  }

  getProgress() {
    return this.progress;
  }

  getAchievements() {
    return this.achievements;
  }
}
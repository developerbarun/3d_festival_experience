export class CommunityManager {
  constructor() {
    this.communityFeatures = {
      feedback: true,
      sharing: true,
      reviews: true,
      suggestions: true
    };
    
    this.feedbackData = [];
    this.communityStats = {
      totalUsers: 0,
      activeFestivals: new Map(),
      popularFeatures: new Map(),
      userSatisfaction: 0
    };
    
    this.init();
  }

  init() {
    this.createFeedbackSystem();
    this.setupCommunityFeatures();
    this.loadCommunityData();
  }

  createFeedbackSystem() {
    const feedbackPanel = document.createElement('div');
    feedbackPanel.id = 'community-feedback-panel';
    feedbackPanel.innerHTML = `
      <div class="feedback-overlay" id="feedback-overlay"></div>
      <div class="feedback-content">
        <div class="feedback-header">
          <h2>Share Your Experience</h2>
          <button class="close-feedback" id="close-feedback">×</button>
        </div>
        
        <div class="feedback-form">
          <div class="feedback-section">
            <h3>How was your cultural journey?</h3>
            <div class="rating-stars" id="rating-stars">
              <span class="star" data-rating="1">⭐</span>
              <span class="star" data-rating="2">⭐</span>
              <span class="star" data-rating="3">⭐</span>
              <span class="star" data-rating="4">⭐</span>
              <span class="star" data-rating="5">⭐</span>
            </div>
          </div>
          
          <div class="feedback-section">
            <h3>What did you enjoy most?</h3>
            <div class="feedback-options">
              <label><input type="checkbox" value="3d_experience"> 3D Festival Scenes</label>
              <label><input type="checkbox" value="ai_guide"> AI Cultural Guide</label>
              <label><input type="checkbox" value="interactions"> Interactive Elements</label>
              <label><input type="checkbox" value="cultural_learning"> Cultural Learning</label>
              <label><input type="checkbox" value="visual_effects"> Visual Effects</label>
              <label><input type="checkbox" value="accessibility"> Accessibility Features</label>
            </div>
          </div>
          
          <div class="feedback-section">
            <h3>Tell us more (Optional)</h3>
            <textarea id="feedback-comments" placeholder="Share your thoughts, suggestions, or cultural insights..."></textarea>
          </div>
          
          <div class="feedback-section">
            <h3>Cultural Background (Optional)</h3>
            <select id="feedback-background">
              <option value="">Prefer not to say</option>
              <option value="indian">Indian</option>
              <option value="south_asian">South Asian</option>
              <option value="western">Western</option>
              <option value="east_asian">East Asian</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>
        
        <div class="feedback-actions">
          <button class="feedback-btn secondary" id="feedback-later">Maybe Later</button>
          <button class="feedback-btn primary" id="submit-feedback">Submit Feedback</button>
        </div>
        
        <div class="community-stats">
          <h4>Community Impact</h4>
          <div class="stats-grid">
            <div class="stat-item">
              <span class="stat-number" id="total-users">1,247</span>
              <span class="stat-label">Cultural Explorers</span>
            </div>
            <div class="stat-item">
              <span class="stat-number" id="festivals-explored">7,432</span>
              <span class="stat-label">Festival Visits</span>
            </div>
            <div class="stat-item">
              <span class="stat-number" id="cultural-questions">3,891</span>
              <span class="stat-label">Questions Asked</span>
            </div>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(feedbackPanel);
    this.setupFeedbackEvents();
  }

  setupFeedbackEvents() {
    let selectedRating = 0;
    
    // Star rating
    document.querySelectorAll('.star').forEach(star => {
      star.addEventListener('click', () => {
        selectedRating = parseInt(star.dataset.rating);
        this.updateStarDisplay(selectedRating);
      });
    });
    
    // Close feedback
    document.getElementById('close-feedback').addEventListener('click', () => {
      this.hideFeedback();
    });
    
    document.getElementById('feedback-overlay').addEventListener('click', () => {
      this.hideFeedback();
    });
    
    // Submit feedback
    document.getElementById('submit-feedback').addEventListener('click', () => {
      this.submitFeedback(selectedRating);
    });
    
    // Later button
    document.getElementById('feedback-later').addEventListener('click', () => {
      this.hideFeedback();
      // Show again after 30 minutes
      setTimeout(() => {
        this.promptFeedback();
      }, 1800000);
    });
  }

  updateStarDisplay(rating) {
    document.querySelectorAll('.star').forEach((star, index) => {
      star.style.opacity = index < rating ? '1' : '0.3';
    });
  }

  setupCommunityFeatures() {
    // Auto-prompt feedback after significant engagement
    let interactionCount = 0;
    document.addEventListener('click', () => {
      interactionCount++;
      if (interactionCount === 50 && !this.hasGivenFeedback()) {
        this.promptFeedback();
      }
    });
    
    // Prompt feedback after visiting multiple festivals
    if (window.app?.progressManager) {
      const originalVisitFestival = window.app.progressManager.visitFestival;
      window.app.progressManager.visitFestival = function(festival) {
        originalVisitFestival.call(this, festival);
        
        if (this.progress.visitedFestivals.size === 3 && !window.app.communityManager.hasGivenFeedback()) {
          setTimeout(() => {
            window.app.communityManager.promptFeedback();
          }, 5000);
        }
      };
    }
  }

  loadCommunityData() {
    // Load existing feedback data
    const savedFeedback = localStorage.getItem('hinduFestivalsFeedback');
    if (savedFeedback) {
      try {
        this.feedbackData = JSON.parse(savedFeedback);
      } catch (error) {
        console.warn('Failed to load feedback data:', error);
      }
    }
    
    // Update community stats display
    this.updateCommunityStats();
  }

  promptFeedback() {
    if (this.hasGivenFeedback()) return;
    
    this.showFeedback();
  }

  showFeedback() {
    document.getElementById('community-feedback-panel').classList.add('active');
    document.body.classList.add('feedback-open');
  }

  hideFeedback() {
    document.getElementById('community-feedback-panel').classList.remove('active');
    document.body.classList.remove('feedback-open');
  }

  submitFeedback(rating) {
    const enjoyedFeatures = Array.from(document.querySelectorAll('.feedback-options input:checked'))
      .map(input => input.value);
    
    const comments = document.getElementById('feedback-comments').value;
    const background = document.getElementById('feedback-background').value;
    
    const feedback = {
      rating: rating,
      enjoyedFeatures: enjoyedFeatures,
      comments: comments,
      culturalBackground: background,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      visitedFestivals: window.app?.progressManager?.getProgress()?.visitedFestivals?.size || 0,
      achievements: window.app?.progressManager?.getProgress()?.achievements?.size || 0
    };
    
    this.feedbackData.push(feedback);
    localStorage.setItem('hinduFestivalsFeedback', JSON.stringify(this.feedbackData));
    localStorage.setItem('hinduFestivalsFeedbackGiven', 'true');
    
    // Send to analytics if available
    if (window.app?.analyticsManager) {
      window.app.analyticsManager.trackEvent('feedback_submitted', feedback);
    }
    
    this.hideFeedback();
    this.showThankYouMessage();
    
    console.log('📝 Feedback submitted:', feedback);
  }

  showThankYouMessage() {
    if (window.app?.uiManager) {
      window.app.uiManager.showNotification(
        'Thank you for your feedback! Your insights help us improve the cultural experience. 🙏',
        'success'
      );
    }
  }

  hasGivenFeedback() {
    return localStorage.getItem('hinduFestivalsFeedbackGiven') === 'true';
  }

  updateCommunityStats() {
    // Update displayed community statistics
    const totalUsersEl = document.getElementById('total-users');
    const festivalsExploredEl = document.getElementById('festivals-explored');
    const questionsAskedEl = document.getElementById('cultural-questions');
    
    if (totalUsersEl) totalUsersEl.textContent = this.communityStats.totalUsers.toLocaleString();
    if (festivalsExploredEl) festivalsExploredEl.textContent = this.getFestivalVisitCount().toLocaleString();
    if (questionsAskedEl) questionsAskedEl.textContent = this.getQuestionCount().toLocaleString();
  }

  getFestivalVisitCount() {
    // Simulate community festival visit count
    return 7432 + (this.feedbackData.length * 6);
  }

  getQuestionCount() {
    // Simulate community question count
    return 3891 + (this.feedbackData.length * 3);
  }

  getCommunityInsights() {
    if (this.feedbackData.length === 0) return null;
    
    const avgRating = this.feedbackData.reduce((sum, feedback) => sum + feedback.rating, 0) / this.feedbackData.length;
    
    const popularFeatures = {};
    this.feedbackData.forEach(feedback => {
      feedback.enjoyedFeatures.forEach(feature => {
        popularFeatures[feature] = (popularFeatures[feature] || 0) + 1;
      });
    });
    
    const culturalBackgrounds = {};
    this.feedbackData.forEach(feedback => {
      if (feedback.culturalBackground) {
        culturalBackgrounds[feedback.culturalBackground] = (culturalBackgrounds[feedback.culturalBackground] || 0) + 1;
      }
    });
    
    return {
      averageRating: avgRating.toFixed(1),
      totalFeedback: this.feedbackData.length,
      popularFeatures: Object.entries(popularFeatures).sort(([,a], [,b]) => b - a),
      culturalDiversity: Object.keys(culturalBackgrounds).length,
      recentFeedback: this.feedbackData.slice(-5)
    };
  }

  exportCommunityData() {
    const insights = this.getCommunityInsights();
    const exportData = {
      insights: insights,
      anonymizedFeedback: this.feedbackData.map(feedback => ({
        rating: feedback.rating,
        enjoyedFeatures: feedback.enjoyedFeatures,
        culturalBackground: feedback.culturalBackground,
        timestamp: feedback.timestamp,
        visitedFestivals: feedback.visitedFestivals,
        achievements: feedback.achievements
      })),
      exportedAt: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `hindu-festivals-community-data-${Date.now()}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
  }

  dispose() {
    this.feedbackData = [];
    this.communityStats = {
      totalUsers: 0,
      activeFestivals: new Map(),
      popularFeatures: new Map(),
      userSatisfaction: 0
    };
  }
}
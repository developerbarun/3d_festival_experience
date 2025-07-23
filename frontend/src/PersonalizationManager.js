export class PersonalizationManager {
  constructor() {
    this.userProfile = {
      id: this.generateUserId(),
      preferences: {
        favoriteActivities: [],
        culturalBackground: null,
        learningGoals: [],
        timeSpentPerFestival: {},
        interactionPatterns: {},
        aiChatTopics: [],
        engagementMetrics: {}
      },
      recommendations: {
        festivals: [],
        content: [],
        culturalConnections: [],
        learningPaths: []
      },
      lastUpdated: new Date().toISOString()
    };

    this.qloo = {
      apiKey: import.meta.env.VITE_QLOO_API_KEY || null,
      baseUrl: 'https://api.qloo.com/v1',
      baseUrl: import.meta.env.VITE_QLOO_BASE_URL || 'https://api.qloo.com/v1',
      initialized: false,
      fallbackMode: true // Use fallback until API key is available
    };

    this.loadUserProfile();
    this.initializePersonalization();
  }

  generateUserId() {
    return 'user_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
  }

  loadUserProfile() {
    const saved = localStorage.getItem('hinduFestivalsUserProfile');
    if (saved) {
      try {
        const parsedProfile = JSON.parse(saved);
        this.userProfile = { ...this.userProfile, ...parsedProfile };
      } catch (error) {
        console.warn('Failed to load user profile:', error);
      }
    }
  }

  saveUserProfile() {
    this.userProfile.lastUpdated = new Date().toISOString();
    localStorage.setItem('hinduFestivalsUserProfile', JSON.stringify(this.userProfile));
  }

  initializePersonalization() {
    if (this.qloo.apiKey) {
      // Real Qloo API initialization
      this.qloo.initialized = true;
      this.qloo.fallbackMode = false;
      console.log('✅ Qloo API initialized with real API key');
      this.testQlooConnection();
    } else {
      // Fallback mode with mock data
      this.qloo.initialized = true;
      this.qloo.fallbackMode = true;
      console.log('⚠️ Qloo API running in fallback mode (no API key)');
      console.log('💡 Add VITE_QLOO_API_KEY to .env file when available');
    }
  }

  async testQlooConnection() {
    if (!this.qloo.apiKey) return false;
    
    try {
      const response = await fetch(`${this.qloo.baseUrl}/health`, {
        headers: {
          'Authorization': `Bearer ${this.qloo.apiKey}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        console.log('✅ Qloo API connection successful');
        return true;
      } else {
        console.warn('⚠️ Qloo API connection failed, using fallback mode');
        this.qloo.fallbackMode = true;
        return false;
      }
    } catch (error) {
      console.warn('⚠️ Qloo API connection error, using fallback mode:', error);
      this.qloo.fallbackMode = true;
      return false;
    }
  }

  // Track user interactions
  trackFestivalVisit(festival, duration = 0) {
    if (!this.userProfile.preferences.timeSpentPerFestival[festival]) {
      this.userProfile.preferences.timeSpentPerFestival[festival] = 0;
    }
    this.userProfile.preferences.timeSpentPerFestival[festival] += duration;
    
    console.log(`📊 Analytics: User spent ${duration}ms in ${festival} festival`);
    
    this.updateRecommendations();
    this.saveUserProfile();
  }

  trackInteraction(festival, interaction, value = 1) {
    if (!this.userProfile.preferences.interactionPatterns[festival]) {
      this.userProfile.preferences.interactionPatterns[festival] = {};
    }
    
    if (!this.userProfile.preferences.interactionPatterns[festival][interaction]) {
      this.userProfile.preferences.interactionPatterns[festival][interaction] = 0;
    }
    
    this.userProfile.preferences.interactionPatterns[festival][interaction] += value;
    
    console.log(`📊 Analytics: User performed ${interaction} in ${festival} (count: ${this.userProfile.preferences.interactionPatterns[festival][interaction]})`);
    
    // Track favorite activities
    this.updateFavoriteActivities(interaction);
    this.updateRecommendations();
    this.saveUserProfile();
  }

  trackAIChatTopic(topic) {
    this.userProfile.preferences.aiChatTopics.push({
      topic: topic,
      timestamp: new Date().toISOString()
    });
    
    console.log(`📊 Analytics: User asked about "${topic}"`);
    
    // Keep only last 50 topics
    if (this.userProfile.preferences.aiChatTopics.length > 50) {
      this.userProfile.preferences.aiChatTopics = this.userProfile.preferences.aiChatTopics.slice(-50);
    }
    
    this.updateRecommendations();
    this.saveUserProfile();
  }

  updateFavoriteActivities(interaction) {
    const activityMap = {
      'diyasLit': 'lighting_ceremonies',
      'colorsThrown': 'color_celebrations',
      'danceWatched': 'traditional_dance',
      'culturalInfoViewed': 'cultural_learning',
      'templeVisited': 'spiritual_experiences',
      'riverVisited': 'sacred_rituals'
    };

    const activity = activityMap[interaction];
    if (activity) {
      const existing = this.userProfile.preferences.favoriteActivities.find(a => a.type === activity);
      if (existing) {
        existing.count++;
      } else {
        this.userProfile.preferences.favoriteActivities.push({
          type: activity,
          count: 1
        });
      }
    }
  }

  setCulturalBackground(background) {
    this.userProfile.preferences.culturalBackground = background;
    this.updateRecommendations();
    this.saveUserProfile();
  }

  setLearningGoals(goals) {
    this.userProfile.preferences.learningGoals = goals;
    this.updateRecommendations();
    this.saveUserProfile();
  }

  async updateRecommendations() {
    if (this.qloo.fallbackMode) {
      // Use local recommendation engine
      this.generateFestivalRecommendations();
      this.generateContentRecommendations();
      this.generateCulturalConnections();
      this.generateLearningPaths();
    } else {
      // Use Qloo API for enhanced recommendations
      await this.generateQlooRecommendations();
    }
  }

  async generateQlooRecommendations() {
    try {
      console.log('🎯 Generating Qloo-powered recommendations...');
      
      // Festival recommendations from Qloo
      const festivalRecs = await this.callQlooAPI('/recommendations/festivals', {
        user_profile: this.buildQlooUserProfile(),
        context: 'hindu_festivals',
        limit: 5
      });
      
      // Content recommendations from Qloo
      const contentRecs = await this.callQlooAPI('/recommendations/content', {
        user_profile: this.buildQlooUserProfile(),
        content_types: ['articles', 'videos', 'stories'],
        limit: 10
      });
      
      // Cultural connections from Qloo
      const culturalRecs = await this.callQlooAPI('/recommendations/cultural', {
        user_profile: this.buildQlooUserProfile(),
        cross_cultural: true,
        limit: 8
      });
      
      this.processQlooRecommendations(festivalRecs, contentRecs, culturalRecs);
      
      console.log('✅ Qloo recommendations generated successfully');
      
    } catch (error) {
      console.warn('Qloo API error, falling back to local recommendations:', error);
      this.qloo.fallbackMode = true;
      this.generateFestivalRecommendations();
      this.generateContentRecommendations();
      this.generateCulturalConnections();
      this.generateLearningPaths();
    }
  }

  buildQlooUserProfile() {
    return {
      cultural_background: this.userProfile.preferences.culturalBackground,
      interests: this.userProfile.preferences.favoriteActivities.map(a => a.type),
      engagement_patterns: this.userProfile.preferences.interactionPatterns,
      time_spent: this.userProfile.preferences.timeSpentPerFestival,
      learning_goals: this.userProfile.preferences.learningGoals,
      chat_topics: this.userProfile.preferences.aiChatTopics.slice(-10).map(t => t.topic)
    };
  }

  processQlooRecommendations(festivalRecs, contentRecs, culturalRecs) {
    // Process Qloo festival recommendations
    if (festivalRecs && festivalRecs.recommendations) {
      this.userProfile.recommendations.festivals = festivalRecs.recommendations.map(rec => ({
        festival: rec.item_id,
        reason: rec.explanation || 'Recommended based on your preferences',
        confidence: rec.confidence || 0.8,
        qloo_score: rec.score
      }));
    }
    
    // Process Qloo content recommendations
    if (contentRecs && contentRecs.recommendations) {
      this.userProfile.recommendations.content = contentRecs.recommendations.map(rec => ({
        type: rec.content_type || 'article',
        title: rec.title || 'Cultural Content',
        description: rec.description || 'Discover more about Hindu traditions',
        relevance: rec.confidence || 0.7,
        qloo_score: rec.score,
        url: rec.url
      }));
    }
    
    // Process cultural connections
    if (culturalRecs && culturalRecs.recommendations) {
      this.userProfile.recommendations.culturalConnections = [{
        title: 'Cultural Connections',
        items: culturalRecs.recommendations.map(rec => rec.description || rec.title)
      }];
    }
    
    // Generate learning paths (combine Qloo insights with local logic)
    this.generateLearningPaths();
  }

  generateFestivalRecommendations() {
    const timeSpent = this.userProfile.preferences.timeSpentPerFestival;
    const interactions = this.userProfile.preferences.interactionPatterns;
    
    // Recommend festivals based on user preferences
    const recommendations = [];
    
    // If user likes lighting ceremonies (Diwali), recommend similar festivals
    if (interactions.diwali?.diyasLit > 5) {
      recommendations.push({
        festival: 'kumbh',
        reason: 'You enjoy lighting ceremonies - Kumbh Mela features sacred fire rituals',
        confidence: 0.8
      });
    }
    
    // If user likes color celebrations (Holi), recommend dance festivals
    if (interactions.holi?.colorsThrown > 10) {
      recommendations.push({
        festival: 'navratri',
        reason: 'You love vibrant celebrations - Navratri features colorful dance traditions',
        confidence: 0.9
      });
    }
    
    // If user spends time learning, recommend knowledge-rich festivals
    if (this.userProfile.preferences.aiChatTopics.length > 5) {
      recommendations.push({
        festival: 'ganesh',
        reason: 'You enjoy learning - Ganesh Chaturthi has rich philosophical traditions',
        confidence: 0.7
      });
    }
    
    this.userProfile.recommendations.festivals = recommendations;
  }

  generateContentRecommendations() {
    const favoriteActivities = this.userProfile.preferences.favoriteActivities;
    const recommendations = [];
    
    favoriteActivities.forEach(activity => {
      switch (activity.type) {
        case 'lighting_ceremonies':
          recommendations.push({
            type: 'article',
            title: 'The Sacred Science of Light in Hindu Traditions',
            description: 'Explore the spiritual significance of light across different festivals',
            relevance: activity.count / 10
          });
          break;
        case 'color_celebrations':
          recommendations.push({
            type: 'story',
            title: 'Regional Variations of Holi Celebrations',
            description: 'Discover how different regions celebrate the festival of colors',
            relevance: activity.count / 15
          });
          break;
        case 'cultural_learning':
          recommendations.push({
            type: 'quiz',
            title: 'Test Your Hindu Festival Knowledge',
            description: 'Challenge yourself with questions about traditions and meanings',
            relevance: activity.count / 5
          });
          break;
      }
    });
    
    this.userProfile.recommendations.content = recommendations;
  }

  generateCulturalConnections() {
    const connections = [];
    
    // Based on user's cultural background and interests
    if (this.userProfile.preferences.culturalBackground) {
      connections.push({
        title: 'Similar Festivals Worldwide',
        items: [
          'Chinese New Year - Like Diwali, celebrates new beginnings with lights',
          'Day of the Dead - Like Dussehra, honors the triumph of life',
          'Carnival - Like Holi, celebrates with colors and joy'
        ]
      });
    }
    
    this.userProfile.recommendations.culturalConnections = connections;
  }

  generateLearningPaths() {
    const paths = [];
    const goals = this.userProfile.preferences.learningGoals;
    
    if (goals.includes('spiritual_understanding')) {
      paths.push({
        title: 'Spiritual Journey Through Festivals',
        steps: [
          'Start with Diwali - Understanding light symbolism',
          'Explore Ganesh Chaturthi - Removing obstacles',
          'Experience Kumbh Mela - Sacred gatherings',
          'Complete with Navratri - Divine feminine energy'
        ],
        estimatedTime: '2 hours'
      });
    }
    
    if (goals.includes('cultural_appreciation')) {
      paths.push({
        title: 'Cultural Immersion Path',
        steps: [
          'Begin with Holi - Community celebrations',
          'Continue with Navratri - Regional variations',
          'Discover Dussehra - Historical significance',
          'Conclude with local festival variations'
        ],
        estimatedTime: '3 hours'
      });
    }
    
    this.userProfile.recommendations.learningPaths = paths;
  }

  getPersonalizedRecommendations() {
    return this.userProfile.recommendations;
  }

  getPersonalizedAIResponse(topic, context) {
    const isQlooActive = !this.qloo.fallbackMode && this.qloo.apiKey;
    const background = this.userProfile.preferences.culturalBackground;
    const interests = this.userProfile.preferences.favoriteActivities;
    const chatHistory = this.userProfile.preferences.aiChatTopics;
    
    console.log(`🤖 Personalizing AI response for topic: "${topic}"`);
    console.log(`📊 User context: Background=${background}, Interests=${interests.length}, Qloo=${isQlooActive}`);
    
    let personalizedContext = '';
    
    if (isQlooActive) {
      personalizedContext += 'Enhanced with Qloo AI insights. ';
    }
    
    if (background) {
      personalizedContext += `User's cultural background: ${background}. `;
    }
    
    if (interests.length > 0) {
      const topInterests = interests
        .sort((a, b) => b.count - a.count)
        .slice(0, 3)
        .map(i => i.type);
      personalizedContext += `User shows interest in: ${topInterests.join(', ')}. `;
    }
    
    if (chatHistory.length > 0) {
      const recentTopics = chatHistory
        .slice(-5)
        .map(t => t.topic);
      personalizedContext += `Recent discussion topics: ${recentTopics.join(', ')}. `;
    }
    
    const adaptedLevel = this.adaptResponseDifficulty(topic, context);
    console.log(`🎯 Adapted response level: ${adaptedLevel}`);
    
    return {
      context: personalizedContext,
      adaptedResponse: adaptedLevel,
      qlooEnhanced: isQlooActive
    };
  }

  adaptResponseDifficulty(topic, context) {
    const knowledgeLevel = this.calculateKnowledgeLevel();
    
    if (knowledgeLevel < 0.3) {
      return 'beginner'; // Simple explanations, basic concepts
    } else if (knowledgeLevel < 0.7) {
      return 'intermediate'; // Moderate detail, some cultural context
    } else {
      return 'advanced'; // Deep cultural insights, historical connections
    }
  }

  calculateKnowledgeLevel() {
    const chatCount = this.userProfile.preferences.aiChatTopics.length;
    const culturalViews = Object.values(this.userProfile.preferences.interactionPatterns)
      .reduce((sum, festival) => sum + (festival.culturalInfoViewed || 0), 0);
    const totalInteractions = Object.values(this.userProfile.preferences.timeSpentPerFestival)
      .reduce((sum, time) => sum + time, 0);
    
    // Normalize to 0-1 scale
    return Math.min(1, (chatCount * 0.1 + culturalViews * 0.2 + totalInteractions * 0.001) / 3);
  }

  createRecommendationsPanel() {
    const panel = document.createElement('div');
    panel.id = 'recommendations-panel';
    panel.innerHTML = `
      <div class="recommendations-content">
        <h3>Recommended for You</h3>
        <div class="recommendations-sections">
          <div class="recommendation-section" id="festival-recommendations">
            <h4>🎭 Festivals You Might Enjoy</h4>
            <div class="recommendation-items"></div>
          </div>
          <div class="recommendation-section" id="content-recommendations">
            <h4>📚 Cultural Content</h4>
            <div class="recommendation-items"></div>
          </div>
          <div class="recommendation-section" id="learning-paths">
            <h4>🎯 Learning Paths</h4>
            <div class="recommendation-items"></div>
          </div>
        </div>
      </div>
    `;
    
    return panel;
  }

  updateRecommendationsPanel() {
    const recommendations = this.getPersonalizedRecommendations();
    
    console.log('🔄 Updating recommendations panel with:', recommendations);
    
    // Update festival recommendations
    const festivalSection = document.querySelector('#festival-recommendations .recommendation-items');
    if (festivalSection) {
      festivalSection.innerHTML = recommendations.festivals.map(rec => `
        <div class="recommendation-item" data-festival="${rec.festival}">
          <div class="recommendation-content">
            <h5>${this.getFestivalName(rec.festival)}</h5>
            <p>${rec.reason}</p>
            <div class="confidence-bar">
              <div class="confidence-fill" style="width: ${rec.confidence * 100}%"></div>
            </div>
          </div>
        </div>
      `).join('');
      
      console.log(`✅ Updated ${recommendations.festivals.length} festival recommendations`);
    }
    
    // Update content recommendations
    const contentSection = document.querySelector('#content-recommendations .recommendation-items');
    if (contentSection) {
      contentSection.innerHTML = recommendations.content.map(content => `
        <div class="recommendation-item">
          <div class="recommendation-content">
            <h5>${content.title}</h5>
            <p>${content.description}</p>
            <span class="content-type">${content.type}</span>
          </div>
        </div>
      `).join('');
    }
    
    // Update learning paths
    const pathsSection = document.querySelector('#learning-paths .recommendation-items');
    if (pathsSection) {
      pathsSection.innerHTML = recommendations.learningPaths.map(path => `
        <div class="recommendation-item">
          <div class="recommendation-content">
            <h5>${path.title}</h5>
            <div class="learning-steps">
              ${path.steps.map(step => `<div class="learning-step">${step}</div>`).join('')}
            </div>
            <span class="estimated-time">⏱️ ${path.estimatedTime}</span>
          </div>
        </div>
      `).join('');
    }
  }

  getFestivalName(festivalId) {
    const names = {
      'diwali': 'Diwali - Festival of Lights',
      'holi': 'Holi - Festival of Colors',
      'navratri': 'Navratri - Nine Nights of Dance',
      'ganesh': 'Ganesh Chaturthi',
      'dussehra': 'Dussehra - Victory of Good',
      'kumbh': 'Kumbh Mela - Sacred Gathering'
    };
    return names[festivalId] || festivalId;
  }

  // Mock Qloo API integration
  async callQlooAPI(endpoint, data) {
    if (this.qloo.fallbackMode || !this.qloo.apiKey) {
      // Mock implementation for development/fallback
      console.log(`🔄 Mock Qloo API call to ${endpoint} (fallback mode)`);
      return this.generateMockQlooResponse(endpoint, data);
    }
    
    try {
      console.log(`🌐 Real Qloo API call to ${endpoint}`);
      
      const response = await fetch(`${this.qloo.baseUrl}${endpoint}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.qloo.apiKey}`,
          'Content-Type': 'application/json',
          'User-Agent': 'HinduFestivalsVR/1.0'
        },
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        throw new Error(`Qloo API error: ${response.status} ${response.statusText}`);
      }
      
      const result = await response.json();
      console.log(`✅ Qloo API response from ${endpoint}:`, result);
      return result;
      
    } catch (error) {
      console.error(`❌ Qloo API call failed for ${endpoint}:`, error);
      // Fall back to mock response
      return this.generateMockQlooResponse(endpoint, data);
    }
  }

  generateMockQlooResponse(endpoint, data) {
    // Generate realistic mock responses based on endpoint
    const mockResponses = {
      '/recommendations/festivals': {
        recommendations: [
          {
            item_id: 'navratri',
            confidence: 0.9,
            score: 0.85,
            explanation: 'Based on your interest in colorful celebrations'
          },
          {
            item_id: 'ganesh',
            confidence: 0.8,
            score: 0.78,
            explanation: 'You enjoy spiritual and community aspects'
          }
        ],
        meta: { total: 2, fallback: true }
      },
      '/recommendations/content': {
        recommendations: [
          {
            content_type: 'article',
            title: 'The Philosophy Behind Hindu Festivals',
            description: 'Deep dive into spiritual meanings',
            confidence: 0.8,
            score: 0.82
          },
          {
            content_type: 'story',
            title: 'Regional Variations in Festival Celebrations',
            description: 'How different regions celebrate the same festivals',
            confidence: 0.7,
            score: 0.75
          }
        ],
        meta: { total: 2, fallback: true }
      },
      '/recommendations/cultural': {
        recommendations: [
          {
            title: 'Chinese New Year',
            description: 'Like Diwali, celebrates new beginnings with lights and family gatherings'
          },
          {
            title: 'Day of the Dead',
            description: 'Similar to some Hindu festivals, honors ancestors and spiritual connections'
          }
        ],
        meta: { total: 2, fallback: true }
      }
    };
    
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(mockResponses[endpoint] || {
          recommendations: [],
          meta: { fallback: true, error: 'Unknown endpoint' }
        });
      }, 300); // Simulate network delay
    });
  }

  getUserProfile() {
    return this.userProfile;
  }

  resetProfile() {
    localStorage.removeItem('hinduFestivalsUserProfile');
    this.userProfile = {
      id: this.generateUserId(),
      preferences: {
        favoriteActivities: [],
        culturalBackground: null,
        learningGoals: [],
        timeSpentPerFestival: {},
        interactionPatterns: {},
        aiChatTopics: [],
        engagementMetrics: {}
      },
      recommendations: {
        festivals: [],
        content: [],
        culturalConnections: [],
        learningPaths: []
      },
      lastUpdated: new Date().toISOString()
    };
  }
}
export class AnalyticsManager {
  constructor() {
    this.sessionId = this.generateSessionId();
    this.userId = this.getUserId();
    this.events = [];
    this.metrics = {
      performance: [],
      interactions: [],
      learning: [],
      cultural: [],
      errors: []
    };
    this.isEnabled = true;
    this.batchSize = 10;
    this.flushInterval = 30000; // 30 seconds
    
    this.init();
  }

  init() {
    this.startSession();
    this.setupEventTracking();
    this.setupPerformanceTracking();
    this.setupLearningAnalytics();
    this.setupCulturalAnalytics();
    this.setupBatchProcessing();
  }

  generateSessionId() {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  getUserId() {
    let userId = localStorage.getItem('hinduFestivalsUserId');
    if (!userId) {
      userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('hinduFestivalsUserId', userId);
    }
    return userId;
  }

  startSession() {
    this.trackEvent('session_start', {
      sessionId: this.sessionId,
      userId: this.userId,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      screen: {
        width: window.screen.width,
        height: window.screen.height,
        pixelRatio: window.devicePixelRatio
      },
      device: {
        cores: navigator.hardwareConcurrency,
        memory: navigator.deviceMemory,
        platform: navigator.platform,
        language: navigator.language
      }
    });
  }

  setupEventTracking() {
    // Track page visibility changes
    document.addEventListener('visibilitychange', () => {
      this.trackEvent('visibility_change', {
        hidden: document.hidden,
        timestamp: new Date().toISOString()
      });
    });

    // Track window focus/blur
    window.addEventListener('focus', () => {
      this.trackEvent('window_focus', { timestamp: new Date().toISOString() });
    });

    window.addEventListener('blur', () => {
      this.trackEvent('window_blur', { timestamp: new Date().toISOString() });
    });

    // Track beforeunload for session end
    window.addEventListener('beforeunload', () => {
      this.endSession();
    });
  }

  setupPerformanceTracking() {
    // Track performance metrics
    setInterval(() => {
      const performanceData = {
        timestamp: new Date().toISOString(),
        memory: performance.memory ? {
          used: performance.memory.usedJSHeapSize,
          total: performance.memory.totalJSHeapSize,
          limit: performance.memory.jsHeapSizeLimit
        } : null,
        timing: {
          loadTime: performance.timing.loadEventEnd - performance.timing.navigationStart,
          domReady: performance.timing.domContentLoadedEventEnd - performance.timing.navigationStart
        }
      };
      
      this.metrics.performance.push(performanceData);
      
      // Keep only last 100 performance entries
      if (this.metrics.performance.length > 100) {
        this.metrics.performance.shift();
      }
    }, 10000); // Every 10 seconds
  }

  setupLearningAnalytics() {
    this.learningMetrics = {
      questionsAsked: 0,
      culturalInfoViewed: 0,
      festivalsExplored: new Set(),
      timeSpentLearning: 0,
      interactionDepth: {},
      knowledgeRetention: {}
    };
  }

  setupCulturalAnalytics() {
    this.culturalMetrics = {
      festivalPopularity: {},
      interactionHeatmap: {},
      culturalEngagement: {},
      regionalInterest: {},
      traditionalElementsExplored: new Set()
    };
  }

  setupBatchProcessing() {
    // Batch and send analytics data periodically
    setInterval(() => {
      this.flushEvents();
    }, this.flushInterval);
  }

  trackEvent(eventName, data = {}) {
    if (!this.isEnabled) return;

    const event = {
      id: this.generateEventId(),
      name: eventName,
      sessionId: this.sessionId,
      userId: this.userId,
      timestamp: new Date().toISOString(),
      data: data
    };

    this.events.push(event);
    console.log('📊 Analytics Event:', eventName, data);

    // Process event for specific metrics
    this.processEventForMetrics(event);

    // Flush if batch is full
    if (this.events.length >= this.batchSize) {
      this.flushEvents();
    }
  }

  generateEventId() {
    return 'event_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6);
  }

  processEventForMetrics(event) {
    switch (event.name) {
      case 'festival_visit':
        this.trackFestivalVisit(event.data);
        break;
      case 'interaction':
        this.trackInteraction(event.data);
        break;
      case 'ai_question':
        this.trackAIQuestion(event.data);
        break;
      case 'cultural_info_view':
        this.trackCulturalInfoView(event.data);
        break;
      case 'performance_metric':
        this.trackPerformanceMetric(event.data);
        break;
      case 'error':
        this.trackError(event.data);
        break;
    }
  }

  // Specific tracking methods
  trackFestivalVisit(data) {
    const { festival, duration } = data;
    
    this.learningMetrics.festivalsExplored.add(festival);
    this.learningMetrics.timeSpentLearning += duration || 0;
    
    if (!this.culturalMetrics.festivalPopularity[festival]) {
      this.culturalMetrics.festivalPopularity[festival] = 0;
    }
    this.culturalMetrics.festivalPopularity[festival]++;
    
    this.metrics.cultural.push({
      type: 'festival_visit',
      festival: festival,
      duration: duration,
      timestamp: new Date().toISOString()
    });
  }

  trackInteraction(data) {
    const { festival, interaction, value } = data;
    
    if (!this.learningMetrics.interactionDepth[festival]) {
      this.learningMetrics.interactionDepth[festival] = {};
    }
    
    if (!this.learningMetrics.interactionDepth[festival][interaction]) {
      this.learningMetrics.interactionDepth[festival][interaction] = 0;
    }
    
    this.learningMetrics.interactionDepth[festival][interaction] += value || 1;
    
    // Track interaction heatmap
    const key = `${festival}_${interaction}`;
    if (!this.culturalMetrics.interactionHeatmap[key]) {
      this.culturalMetrics.interactionHeatmap[key] = 0;
    }
    this.culturalMetrics.interactionHeatmap[key]++;
    
    this.metrics.interactions.push({
      festival: festival,
      interaction: interaction,
      value: value,
      timestamp: new Date().toISOString()
    });
  }

  trackAIQuestion(data) {
    const { question, topic, festival } = data;
    
    this.learningMetrics.questionsAsked++;
    
    // Track knowledge retention
    if (!this.learningMetrics.knowledgeRetention[topic]) {
      this.learningMetrics.knowledgeRetention[topic] = {
        questionsAsked: 0,
        lastAsked: null
      };
    }
    
    this.learningMetrics.knowledgeRetention[topic].questionsAsked++;
    this.learningMetrics.knowledgeRetention[topic].lastAsked = new Date().toISOString();
    
    this.metrics.learning.push({
      type: 'ai_question',
      question: question,
      topic: topic,
      festival: festival,
      timestamp: new Date().toISOString()
    });
  }

  trackCulturalInfoView(data) {
    const { festival, element, duration } = data;
    
    this.learningMetrics.culturalInfoViewed++;
    this.culturalMetrics.traditionalElementsExplored.add(`${festival}_${element}`);
    
    if (!this.culturalMetrics.culturalEngagement[festival]) {
      this.culturalMetrics.culturalEngagement[festival] = {
        views: 0,
        totalTime: 0
      };
    }
    
    this.culturalMetrics.culturalEngagement[festival].views++;
    this.culturalMetrics.culturalEngagement[festival].totalTime += duration || 0;
    
    this.metrics.cultural.push({
      type: 'cultural_info_view',
      festival: festival,
      element: element,
      duration: duration,
      timestamp: new Date().toISOString()
    });
  }

  trackPerformanceMetric(data) {
    this.metrics.performance.push({
      ...data,
      timestamp: new Date().toISOString()
    });
  }

  trackError(data) {
    this.metrics.errors.push({
      ...data,
      timestamp: new Date().toISOString()
    });
  }

  // User interaction tracking methods
  trackFestivalSelection(festival) {
    this.trackEvent('festival_selection', { festival });
  }

  trackSceneTransition(fromScene, toScene, duration) {
    this.trackEvent('scene_transition', {
      from: fromScene,
      to: toScene,
      duration: duration
    });
  }

  trackUserEngagement(action, context = {}) {
    this.trackEvent('user_engagement', {
      action: action,
      context: context
    });
  }

  trackLearningProgress(festival, progress) {
    this.trackEvent('learning_progress', {
      festival: festival,
      progress: progress
    });
  }

  trackCulturalAccuracy(festival, accuracy) {
    this.trackEvent('cultural_accuracy', {
      festival: festival,
      accuracy: accuracy
    });
  }

  // Analytics reporting methods
  getFestivalPopularityReport() {
    const sorted = Object.entries(this.culturalMetrics.festivalPopularity)
      .sort(([,a], [,b]) => b - a);
    
    return {
      mostPopular: sorted[0]?.[0],
      leastPopular: sorted[sorted.length - 1]?.[0],
      rankings: sorted,
      totalVisits: Object.values(this.culturalMetrics.festivalPopularity)
        .reduce((sum, count) => sum + count, 0)
    };
  }

  getLearningEffectivenessReport() {
    const totalTime = this.learningMetrics.timeSpentLearning;
    const questionsAsked = this.learningMetrics.questionsAsked;
    const festivalsExplored = this.learningMetrics.festivalsExplored.size;
    const culturalInfoViewed = this.learningMetrics.culturalInfoViewed;
    
    return {
      engagementScore: this.calculateEngagementScore(),
      learningVelocity: questionsAsked / (totalTime / 60000), // questions per minute
      explorationDepth: festivalsExplored / 6, // percentage of festivals explored
      culturalCuriosity: culturalInfoViewed / festivalsExplored || 0,
      retentionIndicators: this.calculateRetentionIndicators()
    };
  }

  calculateEngagementScore() {
    const weights = {
      timeSpent: 0.3,
      interactions: 0.25,
      questions: 0.25,
      exploration: 0.2
    };
    
    const normalizedTime = Math.min(this.learningMetrics.timeSpentLearning / 600000, 1); // 10 minutes max
    const normalizedInteractions = Math.min(
      Object.values(this.learningMetrics.interactionDepth)
        .reduce((sum, festival) => sum + Object.values(festival).reduce((s, v) => s + v, 0), 0) / 50, 1
    );
    const normalizedQuestions = Math.min(this.learningMetrics.questionsAsked / 20, 1);
    const normalizedExploration = this.learningMetrics.festivalsExplored.size / 6;
    
    return (
      normalizedTime * weights.timeSpent +
      normalizedInteractions * weights.interactions +
      normalizedQuestions * weights.questions +
      normalizedExploration * weights.exploration
    ) * 100;
  }

  calculateRetentionIndicators() {
    const topics = Object.keys(this.learningMetrics.knowledgeRetention);
    const repeatedTopics = topics.filter(topic => 
      this.learningMetrics.knowledgeRetention[topic].questionsAsked > 1
    );
    
    return {
      topicsExplored: topics.length,
      repeatedQuestions: repeatedTopics.length,
      retentionRate: repeatedTopics.length / topics.length || 0
    };
  }

  getInteractionHeatmap() {
    return this.culturalMetrics.interactionHeatmap;
  }

  getPerformanceReport() {
    const recentMetrics = this.metrics.performance.slice(-10);
    
    if (recentMetrics.length === 0) return null;
    
    const avgMemory = recentMetrics.reduce((sum, metric) => 
      sum + (metric.memory?.used || 0), 0) / recentMetrics.length;
    
    return {
      averageMemoryUsage: avgMemory / 1048576, // MB
      performanceIssues: this.metrics.errors.filter(error => 
        error.type === 'performance'
      ).length,
      lastUpdated: new Date().toISOString()
    };
  }

  flushEvents() {
    if (this.events.length === 0) return;
    
    const batch = [...this.events];
    this.events = [];
    
    // In production, send to analytics service
    console.log('📊 Flushing analytics batch:', batch.length, 'events');
    
    // Simulate sending to analytics service
    this.sendToAnalyticsService(batch);
  }

  sendToAnalyticsService(events) {
    // In production, this would send to your analytics service
    // For now, we'll store in localStorage as backup
    try {
      const existingData = JSON.parse(localStorage.getItem('analyticsData') || '[]');
      const updatedData = [...existingData, ...events];
      
      // Keep only last 1000 events in localStorage
      if (updatedData.length > 1000) {
        updatedData.splice(0, updatedData.length - 1000);
      }
      
      localStorage.setItem('analyticsData', JSON.stringify(updatedData));
      console.log('📊 Analytics data cached locally');
    } catch (error) {
      console.warn('Failed to cache analytics data:', error);
    }
  }

  endSession() {
    this.trackEvent('session_end', {
      sessionDuration: Date.now() - parseInt(this.sessionId.split('_')[1]),
      eventsGenerated: this.events.length,
      learningMetrics: this.learningMetrics,
      culturalMetrics: {
        festivalPopularity: this.culturalMetrics.festivalPopularity,
        elementsExplored: this.culturalMetrics.traditionalElementsExplored.size
      }
    });
    
    // Flush remaining events
    this.flushEvents();
  }

  // Public API methods
  enable() {
    this.isEnabled = true;
    console.log('Analytics enabled');
  }

  disable() {
    this.isEnabled = false;
    console.log('Analytics disabled');
  }

  getAnalyticsReport() {
    return {
      session: {
        id: this.sessionId,
        userId: this.userId,
        eventsCount: this.events.length
      },
      learning: this.getLearningEffectivenessReport(),
      cultural: this.getFestivalPopularityReport(),
      performance: this.getPerformanceReport(),
      interactions: this.getInteractionHeatmap()
    };
  }

  exportData() {
    const data = {
      events: this.events,
      metrics: this.metrics,
      learningMetrics: this.learningMetrics,
      culturalMetrics: this.culturalMetrics,
      exportedAt: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `hindu-festivals-analytics-${Date.now()}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
  }

  dispose() {
    this.endSession();
    this.events = [];
    this.metrics = { performance: [], interactions: [], learning: [], cultural: [], errors: [] };
  }
}
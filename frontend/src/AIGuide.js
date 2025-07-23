export class AIGuide {
  constructor() {
    this.isOpen = false;
    this.messages = [];
    this.currentFestival = null;
    this.userInteractions = [];
    this.isLoading = false;
    this.apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    this.genAI = null;
    this.model = null;
    this.rateLimiter = {
      requests: [],
      maxRequests: 10,
      timeWindow: 60000 // 1 minute
    };
    
    this.init();
  }

  init() {
    this.createChatInterface();
    this.setupEventListeners();
    this.addWelcomeMessage();
    this.initializeGemini();
  }

  initializeGemini() {
    if (this.apiKey && typeof window !== 'undefined' && window.GoogleGenerativeAI) {
      try {
        this.genAI = new window.GoogleGenerativeAI(this.apiKey);
        this.model = this.genAI.getGenerativeModel({ model: "gemini-pro" });
        console.log('Gemini AI initialized successfully');
      } catch (error) {
        console.error('Failed to initialize Gemini AI:', error);
      }
    }
  }

  setAPIKey(apiKey) {
    this.apiKey = apiKey;
    if (typeof window !== 'undefined' && window.GoogleGenerativeAI) {
      try {
        this.genAI = new window.GoogleGenerativeAI(apiKey);
        this.model = this.genAI.getGenerativeModel({ model: "gemini-pro" });
        console.log('Gemini AI initialized successfully');
      } catch (error) {
        console.error('Failed to initialize Gemini AI:', error);
      }
    }
  }

  createChatInterface() {
    const chatContainer = document.createElement('div');
    chatContainer.id = 'ai-guide-container';
    chatContainer.innerHTML = `
      <div class="chat-bubble" id="chat-bubble">
        <div class="guide-avatar">
          <span class="avatar-icon">🕉️</span>
          <div class="pulse-ring"></div>
        </div>
        <div class="chat-tooltip">Ask me about Hindu festivals!</div>
      </div>
      
      <div class="chat-window" id="chat-window">
        <div class="chat-header">
          <div class="guide-info">
            <div class="guide-avatar-small">🕉️</div>
            <div class="guide-details">
              <h4>Cultural Guide</h4>
              <span class="guide-status">Ready to help</span>
            </div>
          </div>
          <button class="close-chat" id="close-chat">×</button>
        </div>
        
        <div class="chat-messages" id="chat-messages">
          <!-- Messages will be added here -->
        </div>
        
        <div class="preset-questions" id="preset-questions">
          <button class="preset-btn" data-question="tell-about-festival">Tell me about this festival</button>
          <button class="preset-btn" data-question="ritual-significance">What's the significance of this ritual?</button>
          <button class="preset-btn" data-question="regional-celebrations">How is this celebrated in different regions?</button>
          <button class="preset-btn" data-question="next-actions">What should I try next?</button>
        </div>
        
        <div class="chat-input-container">
          <input type="text" id="chat-input" placeholder="Ask about Hindu traditions..." maxlength="200">
          <button id="send-message" class="send-btn">
            <span class="send-icon">→</span>
          </button>
        </div>
      </div>
    `;

    // Add styles
    const styles = document.createElement('style');
    styles.textContent = `
      #ai-guide-container {
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 10000;
        font-family: 'Inter', sans-serif;
      }

      .chat-bubble {
        position: relative;
        width: 60px;
        height: 60px;
        background: linear-gradient(135deg, #FF6B35, #FFD700);
        border-radius: 50%;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 8px 25px rgba(255, 107, 53, 0.3);
        transition: all 0.3s ease;
        animation: gentle-bounce 3s ease-in-out infinite;
      }

      .chat-bubble:hover {
        transform: scale(1.1);
        box-shadow: 0 12px 35px rgba(255, 107, 53, 0.4);
      }

      .guide-avatar {
        position: relative;
        z-index: 2;
      }

      .avatar-icon {
        font-size: 24px;
        color: white;
        text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
      }

      .pulse-ring {
        position: absolute;
        top: -5px;
        left: -5px;
        right: -5px;
        bottom: -5px;
        border: 2px solid rgba(255, 215, 0, 0.6);
        border-radius: 50%;
        animation: pulse 2s ease-out infinite;
      }

      .chat-tooltip {
        position: absolute;
        bottom: 70px;
        right: 0;
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 8px 12px;
        border-radius: 8px;
        font-size: 12px;
        white-space: nowrap;
        opacity: 0;
        transform: translateY(10px);
        transition: all 0.3s ease;
        pointer-events: none;
      }

      .chat-bubble:hover .chat-tooltip {
        opacity: 1;
        transform: translateY(0);
      }

      .chat-window {
        position: absolute;
        bottom: 80px;
        right: 0;
        width: 350px;
        height: 500px;
        background: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(20px);
        border-radius: 16px;
        border: 1px solid rgba(255, 215, 0, 0.3);
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
        display: none;
        flex-direction: column;
        overflow: hidden;
        transform: scale(0.8) translateY(20px);
        opacity: 0;
        transition: all 0.3s ease;
      }

      .chat-window.open {
        display: flex;
        transform: scale(1) translateY(0);
        opacity: 1;
      }

      .chat-header {
        background: linear-gradient(135deg, #FF6B35, #FFD700);
        padding: 16px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        color: white;
      }

      .guide-info {
        display: flex;
        align-items: center;
        gap: 12px;
      }

      .guide-avatar-small {
        width: 40px;
        height: 40px;
        background: rgba(255, 255, 255, 0.2);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 18px;
      }

      .guide-details h4 {
        margin: 0;
        font-size: 16px;
        font-weight: 600;
      }

      .guide-status {
        font-size: 12px;
        opacity: 0.9;
      }

      .close-chat {
        background: none;
        border: none;
        color: white;
        font-size: 24px;
        cursor: pointer;
        width: 32px;
        height: 32px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background-color 0.2s;
      }

      .close-chat:hover {
        background: rgba(255, 255, 255, 0.2);
      }

      .chat-messages {
        flex: 1;
        padding: 16px;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        gap: 12px;
      }

      .message {
        max-width: 80%;
        padding: 12px 16px;
        border-radius: 16px;
        font-size: 14px;
        line-height: 1.4;
        animation: message-appear 0.3s ease;
      }

      .message.user {
        background: linear-gradient(135deg, #FF6B35, #FFD700);
        color: white;
        align-self: flex-end;
        border-bottom-right-radius: 4px;
      }

      .message.guide {
        background: #f5f5f5;
        color: #333;
        align-self: flex-start;
        border-bottom-left-radius: 4px;
        border: 1px solid rgba(255, 215, 0, 0.2);
      }

      .message.loading {
        background: #f5f5f5;
        color: #666;
        align-self: flex-start;
        border-bottom-left-radius: 4px;
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .typing-indicator {
        display: flex;
        gap: 4px;
      }

      .typing-dot {
        width: 6px;
        height: 6px;
        background: #FF6B35;
        border-radius: 50%;
        animation: typing 1.4s ease-in-out infinite;
      }

      .typing-dot:nth-child(2) { animation-delay: 0.2s; }
      .typing-dot:nth-child(3) { animation-delay: 0.4s; }

      .preset-questions {
        padding: 12px 16px;
        border-top: 1px solid rgba(255, 215, 0, 0.2);
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
      }

      .preset-btn {
        background: rgba(255, 107, 53, 0.1);
        border: 1px solid rgba(255, 107, 53, 0.3);
        color: #FF6B35;
        padding: 6px 12px;
        border-radius: 20px;
        font-size: 12px;
        cursor: pointer;
        transition: all 0.2s ease;
        white-space: nowrap;
      }

      .preset-btn:hover {
        background: rgba(255, 107, 53, 0.2);
        transform: translateY(-1px);
      }

      .chat-input-container {
        padding: 16px;
        border-top: 1px solid rgba(255, 215, 0, 0.2);
        display: flex;
        gap: 8px;
        align-items: center;
      }

      #chat-input {
        flex: 1;
        padding: 12px 16px;
        border: 1px solid rgba(255, 215, 0, 0.3);
        border-radius: 24px;
        font-size: 14px;
        outline: none;
        background: white;
        transition: border-color 0.2s;
      }

      #chat-input:focus {
        border-color: #FF6B35;
      }

      .send-btn {
        width: 40px;
        height: 40px;
        background: linear-gradient(135deg, #FF6B35, #FFD700);
        border: none;
        border-radius: 50%;
        color: white;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: transform 0.2s;
      }

      .send-btn:hover {
        transform: scale(1.1);
      }

      .send-btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
        transform: none;
      }

      .send-icon {
        font-size: 16px;
        font-weight: bold;
      }

      @keyframes gentle-bounce {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-5px); }
      }

      @keyframes pulse {
        0% { transform: scale(1); opacity: 1; }
        100% { transform: scale(1.3); opacity: 0; }
      }

      @keyframes message-appear {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }

      @keyframes typing {
        0%, 60%, 100% { transform: translateY(0); }
        30% { transform: translateY(-10px); }
      }

      @media (max-width: 480px) {
        #ai-guide-container {
          bottom: 16px;
          right: 16px;
        }

        .chat-window {
          width: calc(100vw - 32px);
          height: 400px;
          right: -280px;
        }

        .preset-questions {
          flex-direction: column;
        }

        .preset-btn {
          text-align: center;
        }
      }
    `;

    document.head.appendChild(styles);
    document.body.appendChild(chatContainer);
  }

  setupEventListeners() {
    const chatBubble = document.getElementById('chat-bubble');
    const chatWindow = document.getElementById('chat-window');
    const closeChat = document.getElementById('close-chat');
    const chatInput = document.getElementById('chat-input');
    const sendButton = document.getElementById('send-message');
    const presetButtons = document.querySelectorAll('.preset-btn');

    chatBubble.addEventListener('click', () => this.toggleChat());
    closeChat.addEventListener('click', () => this.closeChat());
    
    sendButton.addEventListener('click', () => this.sendMessage());
    chatInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        this.sendMessage();
      }
    });

    presetButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const question = btn.dataset.question;
        this.handlePresetQuestion(question);
      });
    });
  }

  addWelcomeMessage() {
    const welcomeMessage = {
      type: 'guide',
      content: 'Namaste! 🙏 I\'m your cultural guide for Hindu festivals. I can help you understand traditions, rituals, and the significance of what you\'re experiencing. Feel free to ask me anything!',
      timestamp: new Date()
    };
    
    this.messages.push(welcomeMessage);
    this.renderMessages();
  }

  toggleChat() {
    const chatWindow = document.getElementById('chat-window');
    this.isOpen = !this.isOpen;
    
    if (this.isOpen) {
      chatWindow.classList.add('open');
      document.getElementById('chat-input').focus();
    } else {
      chatWindow.classList.remove('open');
    }
  }

  closeChat() {
    const chatWindow = document.getElementById('chat-window');
    this.isOpen = false;
    chatWindow.classList.remove('open');
  }

  async sendMessage() {
    const input = document.getElementById('chat-input');
    const message = input.value.trim();
    
    if (!message || this.isLoading) return;

    // Add user message
    this.addMessage('user', message);
    input.value = '';

    // Get AI response
    await this.getAIResponse(message);
  }

  addMessage(type, content) {
    const message = {
      type,
      content,
      timestamp: new Date()
    };
    
    this.messages.push(message);
    this.renderMessages();
  }

  renderMessages() {
    const messagesContainer = document.getElementById('chat-messages');
    messagesContainer.innerHTML = '';

    this.messages.forEach(message => {
      const messageElement = document.createElement('div');
      messageElement.className = `message ${message.type}`;
      messageElement.textContent = message.content;
      messagesContainer.appendChild(messageElement);
    });

    // Scroll to bottom
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  showLoadingMessage() {
    const messagesContainer = document.getElementById('chat-messages');
    const loadingElement = document.createElement('div');
    loadingElement.className = 'message loading';
    loadingElement.id = 'loading-message';
    loadingElement.innerHTML = `
      <span>Cultural Guide is thinking...</span>
      <div class="typing-indicator">
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
      </div>
    `;
    
    messagesContainer.appendChild(loadingElement);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  hideLoadingMessage() {
    const loadingMessage = document.getElementById('loading-message');
    if (loadingMessage) {
      loadingMessage.remove();
    }
  }

  async getAIResponse(userMessage) {
    // Check rate limiting
    if (!this.checkRateLimit()) {
      this.hideLoadingMessage();
      this.addMessage('guide', 'Please wait a moment before asking another question. I want to give you thoughtful responses! 🙏');
      this.isLoading = false;
      return;
    }

    this.isLoading = true;
    this.showLoadingMessage();
    
    // Track AI chat topic for personalization
    if (window.app && window.app.personalizationManager) {
      window.app.personalizationManager.trackAIChatTopic(userMessage);
    }
    
    try {
      let response;
      
      if (this.model && this.apiKey) {
        // Use Gemini API
        response = await this.callGemini(userMessage);
      } else {
        // Use fallback responses
        response = this.getFallbackResponse(userMessage);
      }
      
      this.hideLoadingMessage();
      this.addMessage('guide', response);
      
    } catch (error) {
      console.error('AI response error:', error);
      this.hideLoadingMessage();
      
      // Provide specific error handling
      if (error.message && error.message.includes('API_KEY')) {
        this.addMessage('guide', 'There seems to be an issue with the AI service configuration. Let me share some cultural insights from my knowledge instead! What would you like to know about Hindu festivals?');
      } else if (error.message && error.message.includes('quota')) {
        this.addMessage('guide', 'The AI service is currently busy. Let me share some traditional knowledge about Hindu festivals while we wait. What interests you most?');
      } else {
        this.addMessage('guide', 'I\'m having trouble connecting to my AI knowledge right now, but I can still share cultural insights! What would you like to learn about Hindu traditions?');
      }
    }
    
    this.isLoading = false;
  }

  checkRateLimit() {
    const now = Date.now();
    
    // Remove old requests outside the time window
    this.rateLimiter.requests = this.rateLimiter.requests.filter(
      timestamp => now - timestamp < this.rateLimiter.timeWindow
    );
    
    // Check if we're under the limit
    if (this.rateLimiter.requests.length >= this.rateLimiter.maxRequests) {
      return false;
    }
    
    // Add current request
    this.rateLimiter.requests.push(now);
    return true;
  }

  async callGemini(userMessage) {
    let context = this.buildContext();
    
    // Get personalized context if available
    if (window.app && window.app.personalizationManager) {
      const personalizedContext = window.app.personalizationManager.getPersonalizedAIResponse(userMessage, context);
      context += ' ' + personalizedContext.context;
      
      console.log(`🤖 AI Response Level: ${personalizedContext.adaptedResponse}`);
      console.log(`🎯 Qloo Enhanced: ${personalizedContext.qlooEnhanced}`);
    }
    
    const prompt = `You are a knowledgeable and friendly cultural guide for Hindu festivals. You help users understand the traditions, rituals, and significance of Hindu celebrations.

Current context: ${context}

Guidelines:
- Be warm, respectful, and educational
- Use simple, accessible language
- Include cultural significance and symbolism
- Mention regional variations when relevant
- Keep responses concise but informative (max 150 words)
- Use appropriate emojis sparingly

User question: ${userMessage}

Please provide a helpful response about Hindu festivals and traditions.`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Gemini API error:', error);
      throw error;
    }
  }

  // Test method for different festival contexts
  testFestivalContexts() {
    const testContexts = [
      { festival: 'diwali', interactions: ['lit 3 diyas', 'viewed rangoli'] },
      { festival: 'holi', interactions: ['threw colors', 'danced'] },
      { festival: 'navratri', interactions: ['watched garba dance'] }
    ];
    
    testContexts.forEach(context => {
      this.currentFestival = context.festival;
      this.userInteractions = context.interactions;
      console.log(`Test context for ${context.festival}:`, this.buildContext());
    });
  }

  // Mobile optimization check
  checkMobileOptimization() {
    const isMobile = window.innerWidth <= 768;
    const chatWindow = document.getElementById('chat-window');
    
    if (isMobile && chatWindow) {
      chatWindow.style.width = 'calc(100vw - 32px)';
      chatWindow.style.height = '70vh';
      chatWindow.style.right = '-280px';
      
      console.log('Mobile optimizations applied');
    }
    
    return isMobile;
  }

  // Test all preset questions
  testPresetQuestions() {
    const presetQuestions = [
      'tell-about-festival',
      'ritual-significance', 
      'regional-celebrations',
      'next-actions'
    ];
    
    presetQuestions.forEach(questionType => {
      console.log(`Testing preset question: ${questionType}`);
      this.handlePresetQuestion(questionType);
    });
  }

  // Verify error handling
  testErrorHandling() {
    // Test with invalid API key
    const originalKey = this.apiKey;
    this.apiKey = 'invalid_key';
    
    this.getAIResponse('Test error handling').then(() => {
      this.apiKey = originalKey;
      console.log('Error handling test completed');
    });
  }

  buildContext() {
    let context = '';
    
    if (this.currentFestival) {
      context += `User is currently exploring: ${this.currentFestival}. `;
    }
    
    if (this.userInteractions.length > 0) {
      context += `User interactions: ${this.userInteractions.join(', ')}. `;
    }
    
    return context || 'User is in the main festival selection area.';
  }

  getFallbackResponse(userMessage) {
    const lowerMessage = userMessage.toLowerCase();
    
    // Enhanced festival knowledge base
    const festivalKnowledge = this.getEnhancedFestivalKnowledge();
    
    // Festival-specific responses
    if (this.currentFestival === 'diwali') {
      if (lowerMessage.includes('diya') || lowerMessage.includes('lamp')) {
        return festivalKnowledge.diwali.diya || 'Diyas are traditional oil lamps made of clay, symbolizing the victory of light over darkness. During Diwali, lighting diyas is believed to invite prosperity and drive away negative energies. Try clicking on the diyas in the scene to light them up! 🪔';
      }
      if (lowerMessage.includes('rangoli')) {
        return festivalKnowledge.diwali.rangoli || 'Rangoli are beautiful floor art patterns made with colored powders, flowers, and rice. They welcome guests and deities into homes during Diwali. Each design has symbolic meaning, often representing lotus flowers or geometric patterns that bring good fortune. 🌸';
      }
      if (lowerMessage.includes('firework') || lowerMessage.includes('cracker')) {
        return festivalKnowledge.diwali.fireworks || 'Fireworks during Diwali represent the joy and celebration of the festival. They symbolize the triumph of good over evil and are believed to ward off evil spirits. The colorful displays add to the festive atmosphere! ✨';
      }
      if (lowerMessage.includes('lakshmi') || lowerMessage.includes('goddess')) {
        return 'Goddess Lakshmi, the deity of wealth and prosperity, is especially worshipped during Diwali. Clean homes and lit diyas are believed to invite her blessings. She represents not just material wealth, but spiritual abundance and well-being. 💰';
      }
      if (lowerMessage.includes('history') || lowerMessage.includes('origin')) {
        return 'Diwali celebrates Lord Rama\'s return to Ayodhya after 14 years of exile and his victory over Ravana. People lit diyas to welcome him home, starting this beautiful tradition. The festival also celebrates Krishna\'s victory over Narakasura and Lakshmi\'s emergence from the ocean. 🏰';
      }
    }
    
    if (this.currentFestival === 'holi') {
      if (lowerMessage.includes('color') || lowerMessage.includes('gulal')) {
        return 'Holi colors (gulal) have deep significance! Red represents love and fertility, yellow symbolizes turmeric and prosperity, green represents new beginnings, blue honors Lord Krishna, and pink celebrates joy. Try clicking on the color piles to create beautiful bursts! 🎨';
      }
      if (lowerMessage.includes('throw') || lowerMessage.includes('play')) {
        return 'Color throwing in Holi represents breaking social barriers and celebrating equality. Everyone, regardless of age or status, plays together with colors. Click and drag from color piles to throw colors at people in the scene! 🌈';
      }
      if (lowerMessage.includes('bonfire') || lowerMessage.includes('holika')) {
        return 'The Holika Dahan bonfire represents the victory of good over evil, based on the legend of Prahlad and Holika. People gather around the fire the night before Holi, symbolizing the burning away of negativity and evil. 🔥';
      }
      if (lowerMessage.includes('water') || lowerMessage.includes('pichkari')) {
        return 'Water guns (pichkaris) and water balloons add extra fun to Holi! The water mixed with colors creates beautiful splashes and helps spread the festive spirit. It also provides relief from the spring heat! 💦';
      }
      if (lowerMessage.includes('sweet') || lowerMessage.includes('gujiya') || lowerMessage.includes('thandai')) {
        return 'Holi sweets like gujiya (sweet dumplings) and thandai (spiced milk drink) are essential! Gujiya represents prosperity, while thandai with its cooling spices balances the excitement of color play. These treats bring families together! 🍯';
      }
    }
    
    if (this.currentFestival === 'navratri') {
      if (lowerMessage.includes('garba') || lowerMessage.includes('dance')) {
        return 'Garba is the traditional dance of Navratri, performed in circles around a lamp or Durga idol. The circular movement represents the cycle of time and life. Each step has meaning, connecting dancers to the divine feminine energy! 💃';
      }
      if (lowerMessage.includes('durga') || lowerMessage.includes('goddess')) {
        return 'Goddess Durga represents the divine feminine power (Shakti). During Navratri\'s nine nights, devotees worship her nine forms, each representing different aspects of strength, wisdom, and protection. She embodies the power to overcome all obstacles! 🙏';
      }
      if (lowerMessage.includes('dandiya') || lowerMessage.includes('stick')) {
        return 'Dandiya is performed with colorful sticks representing the sword of Durga. The rhythmic clashing of sticks symbolizes the battle between good and evil, with dancers celebrating the victory of righteousness! 🥢';
      }
    }
    
    if (this.currentFestival === 'ganesh') {
      if (lowerMessage.includes('ganesha') || lowerMessage.includes('ganesh') || lowerMessage.includes('elephant')) {
        return 'Lord Ganesha, the elephant-headed deity, is the remover of obstacles and patron of arts and sciences. His large ears symbolize listening, his trunk represents adaptability, and his round belly shows contentment. He\'s invoked before starting any new venture! 🐘';
      }
      if (lowerMessage.includes('modak') || lowerMessage.includes('sweet')) {
        return 'Modaks are Ganesha\'s favorite sweets, made from rice flour and filled with jaggery and coconut. Offering modaks is believed to bring prosperity and remove obstacles. The sweet represents the rewards of spiritual practice! 🍯';
      }
      if (lowerMessage.includes('procession') || lowerMessage.includes('immersion')) {
        return 'The Ganesh procession and immersion (Visarjan) symbolize the cycle of creation and dissolution. As the idol dissolves in water, it represents letting go of attachments and the temporary nature of physical forms! 🌊';
      }
    }
    
    if (this.currentFestival === 'dussehra') {
      if (lowerMessage.includes('ravana') || lowerMessage.includes('effigy')) {
        return 'Burning Ravana\'s effigy symbolizes the victory of good over evil. Ravana, despite his knowledge and power, was defeated by his ego and desires. This teaches us that righteousness always triumphs over arrogance! 🏹';
      }
      if (lowerMessage.includes('rama') || lowerMessage.includes('ramayana')) {
        return 'Lord Rama represents the ideal human being - righteous, dutiful, and compassionate. The Ramayana teaches us about dharma (righteous duty), the importance of keeping promises, and standing up for justice! 👑';
      }
      if (lowerMessage.includes('weapon') || lowerMessage.includes('ayudha')) {
        return 'Ayudha Puja (weapon worship) honors the tools and instruments we use in our daily lives. It reminds us to respect our means of livelihood and use our skills and tools for righteous purposes! ⚔️';
      }
    }
    
    if (this.currentFestival === 'kumbh') {
      if (lowerMessage.includes('river') || lowerMessage.includes('ganga') || lowerMessage.includes('holy')) {
        return 'The holy rivers at Kumbh Mela are believed to wash away sins and grant spiritual purification. The confluence (Sangam) of rivers represents the meeting of different spiritual paths leading to the same divine truth! 🌊';
      }
      if (lowerMessage.includes('sadhu') || lowerMessage.includes('sage')) {
        return 'Sadhus are spiritual seekers who have renounced worldly life to pursue enlightenment. They represent different paths to the divine - through knowledge, devotion, meditation, or service. Their presence makes Kumbh Mela a spiritual university! 🧘';
      }
      if (lowerMessage.includes('akhara') || lowerMessage.includes('camp')) {
        return 'Akharas are spiritual orders that preserve ancient traditions and knowledge. Each akhara has its own practices and lineage, creating a rich tapestry of spiritual diversity within Hindu tradition! ⛺';
      }
    }
    
    // General responses
    if (lowerMessage.includes('diwali')) {
      return 'Diwali, the Festival of Lights, celebrates the victory of light over darkness and good over evil. It\'s one of the most important Hindu festivals, typically lasting 5 days. People light diyas, create rangoli, exchange gifts, and celebrate with family. Each tradition has deep spiritual significance! 🪔✨';
    }
    
    if (lowerMessage.includes('holi')) {
      return 'Holi, the Festival of Colors, celebrates spring\'s arrival and good\'s triumph over evil. People throw colored powders (gulal) and water, symbolizing joy, love, and breaking social barriers. The festival is based on the legend of Prahlad and Holika, and celebrates Lord Krishna\'s playful nature! 🎨🌈';
    }
    
    if (lowerMessage.includes('navratri')) {
      return 'Navratri means "nine nights" and honors the divine feminine energy through Goddess Durga. Each night represents different aspects of the goddess. People fast, dance (Garba and Dandiya), and celebrate with vibrant colors. It\'s a time of spiritual renewal and community celebration! 💃🎭';
    }
    
    if (lowerMessage.includes('ganesh') || lowerMessage.includes('chaturthi')) {
      return 'Ganesh Chaturthi celebrates Lord Ganesha\'s birth, the beloved elephant-headed deity who removes obstacles. Communities create elaborate idols, offer prayers and sweets, hold processions, and finally immerse the idols in water, symbolizing the cycle of creation and dissolution! 🐘🎉';
    }
    
    if (lowerMessage.includes('dussehra') || lowerMessage.includes('vijayadashami')) {
      return 'Dussehra celebrates the victory of good over evil, commemorating Lord Rama\'s defeat of Ravana and Goddess Durga\'s victory over Mahishasura. The burning of Ravana\'s effigy symbolizes the destruction of ego and evil within us! 🏹🔥';
    }
    
    if (lowerMessage.includes('kumbh') || lowerMessage.includes('mela')) {
      return 'Kumbh Mela is the world\'s largest peaceful gathering, where millions of pilgrims come to bathe in sacred rivers. It represents the unity of diverse spiritual traditions and the quest for spiritual purification and enlightenment! 🕉️🌊';
    }
    
    // Default responses
    const defaultResponses = [
      'Hindu festivals are rich with symbolism and tradition. Each celebration has deep spiritual meaning and brings communities together. What specific aspect would you like to learn about? 🕉️',
      'These festivals connect us to ancient wisdom while celebrating life, nature, and divine energy. Is there a particular tradition or ritual you\'re curious about? 🌟',
      'Hindu festivals celebrate the cycles of nature, spiritual growth, and community bonds. They often involve light, color, music, and dance. What draws your interest most? 🎭',
      'Each Hindu festival teaches us valuable life lessons through stories, rituals, and celebrations. They unite communities across different backgrounds. What would you like to explore? 🙏',
      'Hindu traditions are incredibly diverse, with each region adding its own flavor to celebrations. These festivals have evolved over thousands of years. What interests you most? 🌺'
    ];
    
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  }

  getEnhancedFestivalKnowledge() {
    return {
      diwali: {
        diya: 'Diyas are traditional clay oil lamps that symbolize the victory of light over darkness, knowledge over ignorance, and good over evil. Each diya represents the inner light that protects us from spiritual darkness. The practice of lighting diyas dates back thousands of years and is mentioned in ancient scriptures. Different regions use different oils - mustard oil in North India, coconut oil in South India. 🪔',
        rangoli: 'Rangoli, also called kolam in Tamil Nadu or alpana in Bengal, are intricate floor art patterns created with colored powders, flowers, rice, or sand. They serve as a welcome mat for deities and guests. Each design has symbolic meaning - lotus represents purity, peacocks represent beauty, and geometric patterns represent cosmic order. The art form varies significantly across regions. 🌸',
        fireworks: 'Fireworks during Diwali represent the joy of the people of Ayodhya when Lord Rama returned home. They also symbolize the destruction of evil and the celebration of good. However, many communities now prefer eco-friendly celebrations with diyas and lights instead of crackers to protect the environment. ✨',
        lakshmi: 'Goddess Lakshmi represents wealth, fortune, prosperity, beauty, and abundance. During Diwali, she is believed to visit clean, well-lit homes. The festival\'s third day, Lakshmi Puja, is dedicated to her worship. She is often depicted with lotus flowers, symbolizing purity and spiritual power. 💰',
        history: 'Diwali has multiple historical and mythological origins: Rama\'s return to Ayodhya, Krishna\'s victory over Narakasura, and the emergence of Lakshmi from the ocean during Samudra Manthan. Different regions emphasize different stories, making it a truly pan-Indian celebration with local flavors. 🏰'
      },
      holi: {
        colors: 'Holi colors (gulal) traditionally came from natural sources: turmeric for yellow, beetroot for red, indigo for blue, and henna for green. Each color has significance - red for love and fertility, yellow for prosperity, green for new beginnings, blue for Krishna, and pink for joy. Modern celebrations often use synthetic colors, but many are returning to natural alternatives. 🎨',
        holika: 'Holika Dahan commemorates the story of Prahlad and Holika. Holika, who was immune to fire, tried to kill the devotee Prahlad but was burned instead due to her evil intentions. This teaches us that divine protection comes to those who have faith, and evil ultimately destroys itself. 🔥',
        krishna: 'Lord Krishna\'s playful nature is central to Holi celebrations. His love for colors and mischievous play with the gopis (cowherd girls) in Vrindavan established many Holi traditions. The festival celebrates divine love, joy, and the breaking down of social barriers. 💙',
        regional: 'Holi celebrations vary across India: Lathmar Holi in Barsana where women playfully beat men with sticks, Phoolon wali Holi with flowers in Vrindavan, and Rang Panchami in Maharashtra. Each region adds its unique cultural elements to the celebration. 🌈'
      },
      navratri: {
        durga: 'Goddess Durga represents Shakti, the divine feminine power that protects the universe. During Navratri\'s nine nights, her nine forms (Navadurga) are worshipped: Shailaputri, Brahmacharini, Chandraghanta, Kushmanda, Skandamata, Katyayani, Kalaratri, Mahagauri, and Siddhidatri. Each form represents different aspects of divine energy. 🙏',
        garba: 'Garba dance originated in Gujarat and represents the cosmic dance of creation. Dancers move in circles around a lamp or Durga idol, symbolizing the cycle of time (kaal chakra). The circular movement represents the eternal nature of life and the universe. Traditional garba songs tell stories of Krishna and Durga. 💃',
        dandiya: 'Dandiya Raas is performed with colorful sticks representing the sword of Durga. The rhythmic clashing symbolizes the battle between good and evil. Partners change frequently, representing the unity and equality of all people in the eyes of the divine. 🥢',
        regional: 'Navratri is celebrated differently across India: Durga Puja in Bengal with elaborate pandals, Golu displays in Tamil Nadu, Bommai Golu in Karnataka, and Garba-Dandiya in Gujarat. Each region emphasizes different aspects of the divine feminine. 🎭'
      },
      ganesh: {
        ganesha: 'Lord Ganesha, the elephant-headed deity, is the remover of obstacles (Vighnaharta) and patron of arts and sciences. His large ears symbolize the importance of listening, his trunk represents adaptability and efficiency, and his round belly shows contentment and the ability to digest both good and bad experiences. 🐘',
        modak: 'Modaks are Ganesha\'s favorite sweets, made from rice flour and filled with jaggery and coconut. The sweet dumpling shape represents the sweetness of the inner self when one realizes the truth. Offering modaks is believed to bring prosperity and remove obstacles from one\'s path. 🍯',
        immersion: 'Ganesh Visarjan (immersion) symbolizes the cycle of creation and dissolution in nature. As the clay idol dissolves in water, it represents the temporary nature of physical forms and the eternal nature of the divine consciousness. This teaches us about letting go and non-attachment. 🌊',
        eco: 'Traditional Ganesha idols were made from natural clay and organic colors, which dissolved harmlessly in water. Modern eco-friendly celebrations are returning to these practices, using natural materials and avoiding harmful chemicals to protect our rivers and environment. 🌱'
      },
      dussehra: {
        ravana: 'Ravana, despite being a great scholar and devotee of Shiva, was defeated by his ego, pride, and desires. His ten heads represent the ten negative qualities: lust, anger, greed, attachment, pride, jealousy, selfishness, injustice, cruelty, and ego. Burning his effigy symbolizes destroying these qualities within ourselves. 🏹',
        rama: 'Lord Rama represents the ideal human being - dharmic (righteous), truthful, compassionate, and dutiful. The Ramayana teaches us about the importance of keeping promises, respecting elders, protecting the innocent, and standing up for justice even in difficult circumstances. 👑',
        ramlila: 'Ramlila performances bring the Ramayana to life through drama, music, and dance. These community performances, especially popular in North India, make the epic accessible to all people regardless of literacy. They preserve cultural values and teach moral lessons through storytelling. 🎭',
        ayudha: 'Ayudha Puja (weapon worship) honors the tools and instruments we use in our daily lives. It reminds us to respect our means of livelihood and use our skills and tools for righteous purposes. In modern times, people worship vehicles, computers, and other tools of their trade. ⚔️'
      },
      kumbh: {
        significance: 'Kumbh Mela is the world\'s largest peaceful gathering, where millions come seeking spiritual purification. It occurs every 12 years at four sacred locations: Haridwar, Allahabad (Prayagraj), Nashik, and Ujjain. The timing is based on astrological calculations when the planetary positions are most auspicious. 🕉️',
        rivers: 'The sacred rivers - Ganga, Yamuna, and the mythical Saraswati - are believed to wash away sins and grant moksha (liberation). The confluence (Sangam) at Prayagraj is especially sacred. Each river has its own spiritual significance and purifying properties in Hindu tradition. 🌊',
        sadhus: 'Sadhus are spiritual seekers who have renounced worldly life to pursue enlightenment. They represent different paths to the divine: Jnana (knowledge), Bhakti (devotion), Karma (action), and Raja (meditation) yoga. Their presence makes Kumbh Mela a living university of spiritual wisdom. 🧘',
        akharas: 'Akharas are ancient spiritual orders that preserve and transmit sacred knowledge. Each akhara has its own traditions, practices, and lineage dating back centuries. They maintain the continuity of spiritual teachings and provide structure to the diverse spiritual community. ⛺'
      }
    };
  }
  handlePresetQuestion(questionType) {
    let question = '';
    
    switch (questionType) {
      case 'tell-about-festival':
        question = this.currentFestival ? 
          `Tell me about ${this.currentFestival} festival` : 
          'Tell me about Hindu festivals in general';
        break;
      case 'ritual-significance':
        question = 'What\'s the significance of the rituals I\'m seeing?';
        break;
      case 'regional-celebrations':
        question = 'How is this festival celebrated in different regions of India?';
        break;
      case 'next-actions':
        question = 'What should I try next in this experience?';
        break;
    }
    
    if (question) {
      this.addMessage('user', question);
      this.getAIResponse(question);
    }
  }

  // Context management methods
  setCurrentFestival(festival) {
    this.currentFestival = festival;
    this.updateGuideStatus();
  }

  addUserInteraction(interaction) {
    this.userInteractions.push(interaction);
    
    // Keep only last 10 interactions
    if (this.userInteractions.length > 10) {
      this.userInteractions = this.userInteractions.slice(-10);
    }
  }

  updateGuideStatus() {
    const statusElement = document.querySelector('.guide-status');
    if (statusElement && this.currentFestival) {
      statusElement.textContent = `Exploring ${this.currentFestival}`;
    }
  }

  // Public methods for integration
  notifyDiyaLit(count) {
    this.addUserInteraction(`lit ${count} diyas`);
    
    if (count === 1) {
      setTimeout(() => {
        this.addMessage('guide', 'Beautiful! You\'ve lit your first diya. In Hindu tradition, each flame represents hope and the divine light within us. Try lighting more diyas to illuminate the entire scene! 🪔✨');
      }, 1000);
    } else if (count >= 5) {
      setTimeout(() => {
        this.addMessage('guide', 'Wonderful! You\'ve created a beautiful display of lights. This is how homes and communities come alive during Diwali - each light adding to the collective celebration of joy and prosperity! 🌟');
      }, 1000);
    }
  }

  notifySceneChange(newScene) {
    this.setCurrentFestival(newScene);
    
    if (newScene === 'diwali') {
      setTimeout(() => {
        this.addMessage('guide', 'Welcome to the Diwali experience! You can click on the diyas to light them up, explore the traditional houses, and learn about the beautiful rangoli patterns. What would you like to know about this Festival of Lights? 🪔');
      }, 2000);
    } else if (newScene === 'holi') {
      setTimeout(() => {
        this.addMessage('guide', 'Welcome to the vibrant Holi celebration! You can click and drag from color piles to throw colors at people, create color bursts by clicking on gulal piles, and explore the festive courtyard. What would you like to know about this Festival of Colors? 🎨');
      }, 2000);
    }
  }
}
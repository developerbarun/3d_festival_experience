# Hindu Festivals VR Experience

An immersive virtual reality experience exploring the rich traditions and celebrations of Hindu festivals.

## 🚀 Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure API Keys:**
   Copy `.env.example` to `.env` and add your API keys:
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` file:
   ```env
   # Required for AI Cultural Guide
   VITE_GEMINI_API_KEY=your_gemini_api_key_here
   
   # Optional: Enhanced Personalization (add when available)
   VITE_QLOO_API_KEY=your_qloo_api_key_here
   VITE_QLOO_BASE_URL=https://api.qloo.com/v1
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

## 🔑 API Configuration

### Gemini AI (Required)
- **Purpose**: Powers the AI Cultural Guide
- **Get API Key**: [Google AI Studio](https://makersuite.google.com/app/apikey)
- **Environment Variable**: `VITE_GEMINI_API_KEY`

### Qloo API (Optional - Enhanced Personalization)
- **Purpose**: Advanced personalization and content recommendations
- **Get API Key**: [Qloo Developer Portal](https://www.qloo.com/developers)
- **Environment Variables**: 
  - `VITE_QLOO_API_KEY`
  - `VITE_QLOO_BASE_URL` (optional, defaults to https://api.qloo.com/v1)

### Production Configuration (Optional)
- **Monitoring**: `VITE_MONITORING_ENDPOINT` for production monitoring
- **Security**: `VITE_SECURITY_ENDPOINT` for security incident reporting
- **CDN**: `VITE_CDN_URL` for content delivery network
- **Metadata**: `VITE_APP_VERSION` and `VITE_BUILD_TIME` for deployment tracking

## 🎯 Features

### Core Experience
- **6 Hindu Festivals**: Diwali, Holi, Navratri, Ganesh Chaturthi, Dussehra, Kumbh Mela
- **3D Interactive Scenes**: Immersive VR-like experience in browser
- **Cultural Learning**: AI-powered cultural guide and educational content
- **Progress Tracking**: Achievement system and learning progress

### Personalization (Qloo API)
- **Smart Recommendations**: Festival suggestions based on user behavior
- **Adaptive Content**: Personalized cultural explanations and learning paths
- **Cultural Connections**: Cross-cultural festival similarities
- **User Profiles**: Optional registration for enhanced personalization

### Accessibility
- **Multi-language**: English and Hindi support
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Accessibility Features**: Screen reader support, high contrast, reduced motion
- **Keyboard Navigation**: Full keyboard accessibility

## 🛠️ Development

### Project Structure
```
src/
├── SceneManager.js          # 3D scene management
├── UIManager.js             # User interface controls
├── AIGuide.js              # AI cultural guide
├── PersonalizationManager.js # Qloo API integration
├── UserProfileManager.js    # User profiles and preferences
├── ProgressManager.js       # Achievement and progress tracking
├── SettingsManager.js       # App settings and preferences
├── TutorialManager.js       # Interactive tutorials
├── SocialManager.js         # Social sharing features
├── DiwaliScene.js          # Diwali festival scene
├── HoliScene.js            # Holi festival scene
└── ...
```

### API Integration Status

The app automatically detects available API keys and adapts functionality:

- **No API Keys**: Basic experience with static content
- **Gemini Only**: AI cultural guide enabled
- **Gemini + Qloo**: Full personalization and enhanced recommendations

### Adding Qloo API Key

When you receive your Qloo API key:

1. **Add to .env file:**
   ```env
   VITE_QLOO_API_KEY=your_actual_qloo_api_key_here
   ```

2. **Restart development server:**
   ```bash
   npm run dev
   ```

3. **Verify integration:**
   - Check browser console for "✅ Qloo API: Configured"
   - Look for enhanced recommendations in the main menu
   - User profiles will show personalized content

## 🎨 Customization

### Adding New Festivals
1. Create new scene file (e.g., `src/NewFestivalScene.js`)
2. Add festival data to `SceneManager.js`
3. Update UI components in `index.html`
4. Add festival-specific interactions

### Personalization Features
- **User Tracking**: Modify `PersonalizationManager.js` to track new behaviors
- **Recommendations**: Extend recommendation algorithms
- **Cultural Connections**: Add new cross-cultural mappings
- **Learning Paths**: Create custom educational journeys

## 📱 Deployment

### Build for Production
```bash
npm run build
```

### Production Deployment Checklist
1. **Environment Variables**: Configure all production environment variables
2. **SSL Certificate**: Ensure HTTPS is properly configured
3. **CDN Setup**: Configure content delivery network for optimal performance
4. **Monitoring**: Set up monitoring endpoints for error tracking and analytics
5. **Security**: Review security configurations and CSP headers
6. **Performance**: Run performance benchmarks and optimize as needed
7. **Accessibility**: Verify all accessibility features are working
8. **Cultural Review**: Ensure cultural accuracy and sensitivity

### Environment Variables for Production
Ensure all API keys are properly configured in your hosting platform:
- Vercel: Add to Environment Variables in dashboard
- Netlify: Add to Site Settings > Environment Variables
- Other platforms: Follow their environment variable configuration

## 🔒 Privacy & Security

- **Local Storage**: User data stored locally for privacy
- **API Key Security**: Keys are environment variables, not in code
- **Optional Registration**: Enhanced features without mandatory signup
- **Data Control**: Users can reset all data anytime
- **Content Security Policy**: XSS protection and secure resource loading
- **Input Sanitization**: All user inputs are sanitized for security
- **Encrypted Storage**: Sensitive data is encrypted in local storage
- **Error Monitoring**: Comprehensive error tracking and reporting
- **Backup System**: Automatic data backup and recovery capabilities

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Hindu cultural traditions and their rich heritage
- Babylon.js for 3D rendering capabilities
- Google Gemini AI for cultural guidance
- Qloo API for personalization features
- The open-source community for inspiration and tools
- Cultural experts and community members for accuracy verification
- Accessibility advocates for inclusive design guidance
- Performance optimization community for best practices
- Security researchers for vulnerability identification and prevention
export class UserProfileManager {
  constructor() {
    this.isRegistered = false;
    this.profile = {
      name: '',
      email: '',
      culturalBackground: '',
      learningGoals: [],
      interests: [],
      location: '',
      preferredLanguage: 'english'
    };
    
    this.loadProfile();
    this.createProfilePanel();
  }

  loadProfile() {
    const saved = localStorage.getItem('hinduFestivalsUserRegistration');
    if (saved) {
      try {
        const parsedProfile = JSON.parse(saved);
        this.profile = { ...this.profile, ...parsedProfile };
        this.isRegistered = true;
      } catch (error) {
        console.warn('Failed to load user registration:', error);
      }
    }
  }

  saveProfile() {
    localStorage.setItem('hinduFestivalsUserRegistration', JSON.stringify(this.profile));
    this.isRegistered = true;
  }

  createProfilePanel() {
    const profilePanel = document.createElement('div');
    profilePanel.id = 'profile-panel';
    profilePanel.innerHTML = `
      <div class="profile-overlay" id="profile-overlay"></div>
      <div class="profile-content">
        <div class="profile-header">
          <h2>Your Cultural Profile</h2>
          <button class="close-profile" id="close-profile">×</button>
        </div>
        
        <div class="profile-form" id="profile-form">
          <div class="form-section">
            <h3>Personal Information</h3>
            <div class="form-group">
              <label for="user-name">Name (Optional)</label>
              <input type="text" id="user-name" placeholder="Your name">
            </div>
            <div class="form-group">
              <label for="user-email">Email (Optional)</label>
              <input type="email" id="user-email" placeholder="your@email.com">
            </div>
          </div>
          
          <div class="form-section">
            <h3>Cultural Background</h3>
            <div class="form-group">
              <label for="cultural-background">Cultural Background</label>
              <select id="cultural-background">
                <option value="">Select your background</option>
                <option value="indian">Indian</option>
                <option value="south-asian">South Asian</option>
                <option value="western">Western</option>
                <option value="east-asian">East Asian</option>
                <option value="middle-eastern">Middle Eastern</option>
                <option value="african">African</option>
                <option value="latin-american">Latin American</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div class="form-group">
              <label for="user-location">Location (Optional)</label>
              <input type="text" id="user-location" placeholder="City, Country">
            </div>
          </div>
          
          <div class="form-section">
            <h3>Learning Preferences</h3>
            <div class="form-group">
              <label>Learning Goals (Select all that apply)</label>
              <div class="checkbox-group">
                <label><input type="checkbox" value="cultural_understanding"> Cultural Understanding</label>
                <label><input type="checkbox" value="spiritual_exploration"> Spiritual Exploration</label>
                <label><input type="checkbox" value="historical_knowledge"> Historical Knowledge</label>
                <label><input type="checkbox" value="artistic_appreciation"> Artistic Appreciation</label>
                <label><input type="checkbox" value="language_learning"> Language Learning</label>
                <label><input type="checkbox" value="travel_preparation"> Travel Preparation</label>
              </div>
            </div>
            <div class="form-group">
              <label>Areas of Interest</label>
              <div class="checkbox-group">
                <label><input type="checkbox" value="rituals_ceremonies"> Rituals & Ceremonies</label>
                <label><input type="checkbox" value="music_dance"> Music & Dance</label>
                <label><input type="checkbox" value="food_traditions"> Food & Traditions</label>
                <label><input type="checkbox" value="art_crafts"> Art & Crafts</label>
                <label><input type="checkbox" value="philosophy_spirituality"> Philosophy & Spirituality</label>
                <label><input type="checkbox" value="regional_variations"> Regional Variations</label>
              </div>
            </div>
            <div class="form-group">
              <label for="preferred-language">Preferred Language</label>
              <select id="preferred-language">
                <option value="english">English</option>
                <option value="hindi">हिंदी (Hindi)</option>
                <option value="both">Both</option>
              </select>
            </div>
          </div>
        </div>
        
        <div class="profile-actions">
          <button class="profile-btn secondary" id="skip-registration">Skip for Now</button>
          <button class="profile-btn primary" id="save-profile">Save Profile</button>
        </div>
        
        <div class="profile-benefits">
          <h4>Benefits of Creating a Profile:</h4>
          <ul>
            <li>🎯 Personalized festival recommendations</li>
            <li>📚 Customized learning content</li>
            <li>🌍 Cultural connections based on your background</li>
            <li>📈 Track your cultural learning progress</li>
            <li>🎭 Discover festivals similar to your interests</li>
          </ul>
        </div>
      </div>
    `;

    document.body.appendChild(profilePanel);
    this.setupProfileEvents();
    this.populateForm();
  }

  setupProfileEvents() {
    document.getElementById('close-profile').addEventListener('click', () => {
      this.hideProfile();
    });

    document.getElementById('profile-overlay').addEventListener('click', () => {
      this.hideProfile();
    });

    document.getElementById('skip-registration').addEventListener('click', () => {
      this.hideProfile();
    });

    document.getElementById('save-profile').addEventListener('click', () => {
      this.saveProfileData();
    });

    // Auto-save on input changes
    const inputs = document.querySelectorAll('#profile-form input, #profile-form select');
    inputs.forEach(input => {
      input.addEventListener('change', () => {
        this.updateProfileFromForm();
      });
    });
  }

  populateForm() {
    if (this.isRegistered) {
      document.getElementById('user-name').value = this.profile.name || '';
      document.getElementById('user-email').value = this.profile.email || '';
      document.getElementById('cultural-background').value = this.profile.culturalBackground || '';
      document.getElementById('user-location').value = this.profile.location || '';
      document.getElementById('preferred-language').value = this.profile.preferredLanguage || 'english';

      // Set learning goals checkboxes
      this.profile.learningGoals.forEach(goal => {
        const checkbox = document.querySelector(`input[value="${goal}"]`);
        if (checkbox) checkbox.checked = true;
      });

      // Set interests checkboxes
      this.profile.interests.forEach(interest => {
        const checkbox = document.querySelector(`input[value="${interest}"]`);
        if (checkbox) checkbox.checked = true;
      });
    }
  }

  updateProfileFromForm() {
    this.profile.name = document.getElementById('user-name').value;
    this.profile.email = document.getElementById('user-email').value;
    this.profile.culturalBackground = document.getElementById('cultural-background').value;
    this.profile.location = document.getElementById('user-location').value;
    this.profile.preferredLanguage = document.getElementById('preferred-language').value;

    // Get learning goals
    const goalCheckboxes = document.querySelectorAll('input[type="checkbox"][value*="_"]');
    this.profile.learningGoals = Array.from(goalCheckboxes)
      .filter(cb => cb.checked && cb.value.includes('_') && !cb.value.includes('rituals'))
      .map(cb => cb.value);

    // Get interests
    const interestCheckboxes = document.querySelectorAll('input[type="checkbox"][value*="rituals"], input[type="checkbox"][value*="music"], input[type="checkbox"][value*="food"], input[type="checkbox"][value*="art"], input[type="checkbox"][value*="philosophy"], input[type="checkbox"][value*="regional"]');
    this.profile.interests = Array.from(interestCheckboxes)
      .filter(cb => cb.checked)
      .map(cb => cb.value);
  }

  saveProfileData() {
    this.updateProfileFromForm();
    this.saveProfile();
    
    // Update personalization manager if available
    if (window.app && window.app.personalizationManager) {
      window.app.personalizationManager.setCulturalBackground(this.profile.culturalBackground);
      window.app.personalizationManager.setLearningGoals(this.profile.learningGoals);
    }
    
    this.hideProfile();
    this.showSuccessMessage();
  }

  showSuccessMessage() {
    if (window.app && window.app.uiManager) {
      window.app.uiManager.showNotification('Profile saved! You\'ll now receive personalized recommendations.', 'success');
    }
  }

  showProfile() {
    document.getElementById('profile-panel').classList.add('active');
    document.body.classList.add('profile-open');
  }

  hideProfile() {
    document.getElementById('profile-panel').classList.remove('active');
    document.body.classList.remove('profile-open');
  }

  getProfile() {
    return this.profile;
  }

  isUserRegistered() {
    return this.isRegistered;
  }

  promptRegistration() {
    // Show registration prompt for new users
    if (!this.isRegistered) {
      setTimeout(() => {
        this.showProfile();
      }, 5000); // Show after 5 seconds of usage
    }
  }
}
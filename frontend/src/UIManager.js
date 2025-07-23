export class UIManager {
  constructor() {
    this.currentScreen = 'welcome';
    this.isTransitioning = false;
  }

  showScreen(screenId) {
    if (this.isTransitioning) return;
    
    this.isTransitioning = true;
    const screens = ['welcome-screen', 'festival-menu', 'experience-ui'];
    
    // Hide all screens
    screens.forEach(id => {
      const screen = document.getElementById(id);
      if (screen && id !== screenId) {
        screen.classList.add('hidden');
      }
    });

    // Show target screen
    const targetScreen = document.getElementById(screenId);
    if (targetScreen) {
      targetScreen.classList.remove('hidden');
      targetScreen.classList.add('fade-in');
    }

    // Update current screen
    this.currentScreen = screenId.replace('-screen', '').replace('-menu', '').replace('-ui', '');
    
    setTimeout(() => {
      this.isTransitioning = false;
    }, 500);
  }

  hideScreen(screenId) {
    const screen = document.getElementById(screenId);
    if (screen) {
      screen.classList.add('fade-out');
      setTimeout(() => {
        screen.classList.add('hidden');
        screen.classList.remove('fade-out');
      }, 300);
    }
  }

  updateFestivalTitle(festival) {
    const festivalNames = {
      'diwali': 'Diwali - Festival of Lights',
      'holi': 'Holi - Festival of Colors',
      'navratri': 'Navratri - Nine Nights of Dance',
      'ganesh': 'Ganesh Chaturthi - Lord Ganesha\'s Birthday',
      'dussehra': 'Dussehra - Victory of Good over Evil',
      'kumbh': 'Kumbh Mela - Sacred Gathering'
    };

    const titleElement = document.getElementById('current-festival');
    if (titleElement) {
      titleElement.textContent = festivalNames[festival] || 'Festival Experience';
    }
  }

  showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Style the notification
    Object.assign(notification.style, {
      position: 'fixed',
      top: '20px',
      right: '20px',
      background: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      borderRadius: '12px',
      padding: '16px 24px',
      color: 'white',
      fontSize: '14px',
      fontWeight: '500',
      zIndex: '9999',
      transform: 'translateX(100%)',
      transition: 'transform 0.3s ease-out',
      maxWidth: '300px',
      wordWrap: 'break-word'
    });

    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
      notification.style.transform = 'translateX(0)';
    }, 100);

    // Remove after delay
    setTimeout(() => {
      notification.style.transform = 'translateX(100%)';
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }, 3000);
  }
  
  showCulturalInfo(festival, objectType) {
    const infoData = {
      diwali: {
        diya: {
          title: "Diya - Oil Lamp",
          description: "Diyas are traditional oil lamps made of clay, lit during Diwali to symbolize the victory of light over darkness and good over evil. Each diya represents hope, prosperity, and the divine light within us.",
          significance: "Lighting diyas is believed to invite Goddess Lakshmi into homes and drive away negative energies."
        },
        rangoli: {
          title: "Rangoli - Sacred Art",
          description: "Rangoli are intricate patterns created on floors using colored powders, flowers, and rice. These beautiful designs welcome guests and deities into the home.",
          significance: "Each pattern has symbolic meaning, often representing lotus flowers, peacocks, or geometric designs that bring good fortune."
        },
        house: {
          title: "Decorated Homes",
          description: "During Diwali, homes are cleaned and decorated with lights, diyas, and rangoli patterns. This preparation is as important as the celebration itself.",
          significance: "Clean and bright homes are believed to attract prosperity and happiness for the coming year."
        }
      }
    };
    
    const info = infoData[festival]?.[objectType];
    if (!info) return;
    
    // Create info panel
    const infoPanel = document.createElement('div');
    infoPanel.id = 'cultural-info-panel';
    infoPanel.innerHTML = `
      <div class="info-content">
        <button class="close-btn" onclick="this.parentElement.parentElement.remove()">×</button>
        <h3>${info.title}</h3>
        <p class="description">${info.description}</p>
        <p class="significance"><strong>Cultural Significance:</strong> ${info.significance}</p>
        <div class="interaction-hint">
          <p><em>Click on diyas to light them up and explore the scene!</em></p>
        </div>
      </div>
    `;
    
    Object.assign(infoPanel.style, {
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      background: 'rgba(0, 0, 0, 0.9)',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(255, 215, 0, 0.3)',
      borderRadius: '16px',
      padding: '24px',
      color: 'white',
      maxWidth: '400px',
      zIndex: '10000',
      fontFamily: 'Inter, sans-serif',
      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5)'
    });
    
    // Style the content
    const style = document.createElement('style');
    style.textContent = `
      #cultural-info-panel .info-content h3 {
        color: #FFD700;
        margin-bottom: 16px;
        font-size: 1.25rem;
        font-weight: 600;
      }
      
      #cultural-info-panel .info-content p {
        margin-bottom: 12px;
        line-height: 1.6;
        color: #E0E0E0;
      }
      
      #cultural-info-panel .info-content .significance {
        color: #FFA726;
        font-size: 0.95rem;
      }
      
      #cultural-info-panel .info-content .interaction-hint {
        margin-top: 16px;
        padding: 12px;
        background: rgba(255, 107, 53, 0.1);
        border-radius: 8px;
        border-left: 3px solid #FF6B35;
      }
      
      #cultural-info-panel .info-content .interaction-hint p {
        margin: 0;
        color: #FFB74D;
        font-size: 0.9rem;
      }
      
      #cultural-info-panel .close-btn {
        position: absolute;
        top: 12px;
        right: 16px;
        background: none;
        border: none;
        color: #FFD700;
        font-size: 24px;
        cursor: pointer;
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        transition: background-color 0.2s;
      }
      
      #cultural-info-panel .close-btn:hover {
        background-color: rgba(255, 215, 0, 0.1);
      }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(infoPanel);
    
    // Animate in
    infoPanel.style.opacity = '0';
    infoPanel.style.transform = 'translate(-50%, -50%) scale(0.8)';
    
    setTimeout(() => {
      infoPanel.style.transition = 'all 0.3s ease-out';
      infoPanel.style.opacity = '1';
      infoPanel.style.transform = 'translate(-50%, -50%) scale(1)';
    }, 10);
  }

  enableTouchOptimizations() {
    // Disable context menu on long press
    document.addEventListener('contextmenu', (e) => {
      e.preventDefault();
    });

    // Disable selection
    document.addEventListener('selectstart', (e) => {
      e.preventDefault();
    });

    // Optimize touch for canvas
    const canvas = document.getElementById('babylon-canvas');
    if (canvas) {
      canvas.style.touchAction = 'none';
    }
  }

  handleOrientationChange() {
    // Handle mobile orientation changes
    window.addEventListener('orientationchange', () => {
      setTimeout(() => {
        // Trigger resize event
        window.dispatchEvent(new Event('resize'));
      }, 100);
    });
  }

  addAccessibilityFeatures() {
    // Add keyboard navigation
    document.addEventListener('keydown', (e) => {
      switch (e.key) {
        case 'Escape':
          if (this.currentScreen === 'experience') {
            document.getElementById('menu-btn').click();
          }
          break;
        case 'Enter':
          if (this.currentScreen === 'welcome') {
            document.getElementById('enter-experience').click();
          }
          break;
      }
    });

    // Add ARIA labels
    const enterBtn = document.getElementById('enter-experience');
    if (enterBtn) {
      enterBtn.setAttribute('aria-label', 'Enter the Hindu Festivals VR Experience');
    }

    const menuBtn = document.getElementById('menu-btn');
    if (menuBtn) {
      menuBtn.setAttribute('aria-label', 'Open festival selection menu');
    }
  }

  optimizePerformance() {
    // Reduce animations on low-end devices
    const isLowEndDevice = navigator.hardwareConcurrency < 4 || 
                          navigator.deviceMemory < 4;
    
    if (isLowEndDevice) {
      document.body.classList.add('reduced-motion');
    }

    // Preload critical resources
    this.preloadResources();
  }

  preloadResources() {
    // Preload fonts
    const fonts = [
      new FontFace('Inter', 'url(https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2)'),
      new FontFace('Playfair Display', 'url(https://fonts.gstatic.com/s/playfairdisplay/v30/nuFvD-vYSZviVYUb_rj3ij__anPXJzDwcbmjWBN2PKeiunDTbtXK-F2qC0s.woff2)')
    ];

    fonts.forEach(font => {
      font.load().then(() => {
        document.fonts.add(font);
      }).catch(err => {
        console.log('Font loading failed:', err);
      });
    });
  }
}
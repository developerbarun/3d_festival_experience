export class TutorialManager {
  constructor() {
    this.currentStep = 0;
    this.isActive = false;
    this.tutorialSteps = [
      {
        target: null,
        title: 'Welcome to Hindu Festivals!',
        content: 'Welcome to your cultural journey through India\'s most vibrant festivals! This tutorial will guide you through the experience.',
        position: 'center'
      },
      {
        target: '#enter-experience',
        title: 'Begin Your Journey',
        content: 'Click here to start exploring Hindu festivals and their rich traditions.',
        position: 'bottom'
      },
      {
        target: '.festival-card',
        title: 'Choose a Festival',
        content: 'Select any festival to explore. Each offers unique traditions and experiences.',
        position: 'top'
      },
      {
        target: '#babylon-canvas',
        title: '3D Experience',
        content: 'Use your mouse to look around. Click and drag to rotate the view, scroll to zoom.',
        position: 'center'
      },
      {
        target: '.ui-controls',
        title: 'Interactive Controls',
        content: 'Use these buttons to interact with the festival scene and learn about traditions.',
        position: 'left'
      },
      {
        target: '#ai-guide-container',
        title: 'AI Cultural Guide',
        content: 'Click here anytime to ask questions about Hindu festivals and traditions.',
        position: 'left'
      }
    ];
    
    this.createTutorialOverlay();
  }

  createTutorialOverlay() {
    const tutorialOverlay = document.createElement('div');
    tutorialOverlay.id = 'tutorial-overlay';
    tutorialOverlay.innerHTML = `
      <div class="tutorial-backdrop"></div>
      <div class="tutorial-spotlight"></div>
      <div class="tutorial-tooltip">
        <div class="tutorial-content">
          <h3 class="tutorial-title"></h3>
          <p class="tutorial-text"></p>
          <div class="tutorial-controls">
            <button class="tutorial-btn secondary" id="skip-tutorial">Skip Tutorial</button>
            <div class="tutorial-navigation">
              <button class="tutorial-btn secondary" id="tutorial-prev" disabled>Previous</button>
              <span class="tutorial-progress">
                <span class="current-step">1</span> / <span class="total-steps">${this.tutorialSteps.length}</span>
              </span>
              <button class="tutorial-btn primary" id="tutorial-next">Next</button>
            </div>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(tutorialOverlay);
    this.setupTutorialEvents();
  }

  setupTutorialEvents() {
    document.getElementById('skip-tutorial').addEventListener('click', () => {
      this.endTutorial();
    });

    document.getElementById('tutorial-prev').addEventListener('click', () => {
      this.previousStep();
    });

    document.getElementById('tutorial-next').addEventListener('click', () => {
      this.nextStep();
    });

    // Close tutorial on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isActive) {
        this.endTutorial();
      }
    });
  }

  startTutorial() {
    // Check if tutorial was already completed
    const tutorialCompleted = localStorage.getItem('hinduFestivalsTutorialCompleted');
    if (tutorialCompleted) return;

    this.isActive = true;
    this.currentStep = 0;
    document.getElementById('tutorial-overlay').classList.add('active');
    document.body.classList.add('tutorial-active');
    
    this.showStep(0);
  }

  showStep(stepIndex) {
    if (stepIndex < 0 || stepIndex >= this.tutorialSteps.length) return;

    const step = this.tutorialSteps[stepIndex];
    const overlay = document.getElementById('tutorial-overlay');
    const spotlight = overlay.querySelector('.tutorial-spotlight');
    const tooltip = overlay.querySelector('.tutorial-tooltip');
    const title = overlay.querySelector('.tutorial-title');
    const text = overlay.querySelector('.tutorial-text');
    const currentStepSpan = overlay.querySelector('.current-step');
    const prevBtn = document.getElementById('tutorial-prev');
    const nextBtn = document.getElementById('tutorial-next');

    // Update content
    title.textContent = step.title;
    text.textContent = step.content;
    currentStepSpan.textContent = stepIndex + 1;

    // Update navigation buttons
    prevBtn.disabled = stepIndex === 0;
    nextBtn.textContent = stepIndex === this.tutorialSteps.length - 1 ? 'Finish' : 'Next';

    // Position spotlight and tooltip
    this.positionTutorialElements(step, spotlight, tooltip);

    this.currentStep = stepIndex;
  }

  positionTutorialElements(step, spotlight, tooltip) {
    const target = step.target ? document.querySelector(step.target) : null;
    
    if (!target && step.position !== 'center' && step.target !== null) {
      // Target not found, skip this step
      this.nextStep();
      return;
    }

    if (step.position === 'center') {
      // Center positioning for general instructions
      spotlight.style.display = 'none';
      tooltip.className = 'tutorial-tooltip center';
      tooltip.style.cssText = `
        position: fixed !important;
        top: 50% !important;
        left: 50% !important;
        transform: translate(-50%, -50%) !important;
        z-index: 10002 !important;
        max-width: 400px !important;
      `;
    } else {
      // Target-specific positioning
      const rect = target.getBoundingClientRect();
      const spotlightSize = Math.max(rect.width + 20, rect.height + 20, 60);
      
      // Position spotlight
      spotlight.style.display = 'block';
      spotlight.style.width = `${spotlightSize}px`;
      spotlight.style.height = `${spotlightSize}px`;
      spotlight.style.left = `${rect.left + rect.width / 2 - spotlightSize / 2}px`;
      spotlight.style.top = `${rect.top + rect.height / 2 - spotlightSize / 2}px`;

      // Position tooltip
      tooltip.className = `tutorial-tooltip ${step.position}`;
      
      switch (step.position) {
        case 'top':
          tooltip.style.left = `${rect.left + rect.width / 2}px`;
          tooltip.style.top = `${rect.top - 20}px`;
          tooltip.style.transform = 'translate(-50%, -100%)';
          break;
        case 'bottom':
          tooltip.style.left = `${rect.left + rect.width / 2}px`;
          tooltip.style.top = `${rect.bottom + 20}px`;
          tooltip.style.transform = 'translate(-50%, 0)';
          break;
        case 'left':
          tooltip.style.left = `${rect.left - 20}px`;
          tooltip.style.top = `${rect.top + rect.height / 2}px`;
          tooltip.style.transform = 'translate(-100%, -50%)';
          break;
        case 'right':
          tooltip.style.left = `${rect.right + 20}px`;
          tooltip.style.top = `${rect.top + rect.height / 2}px`;
          tooltip.style.transform = 'translate(0, -50%)';
          break;
      }
    }
  }

  nextStep() {
    if (this.currentStep < this.tutorialSteps.length - 1) {
      this.showStep(this.currentStep + 1);
    } else {
      this.endTutorial();
    }
  }

  previousStep() {
    if (this.currentStep > 0) {
      this.showStep(this.currentStep - 1);
    }
  }

  endTutorial() {
    this.isActive = false;
    document.getElementById('tutorial-overlay').classList.remove('active');
    document.body.classList.remove('tutorial-active');
    
    // Mark tutorial as completed
    localStorage.setItem('hinduFestivalsTutorialCompleted', 'true');
    
    // Update settings if available
    if (window.app && window.app.settingsManager) {
      window.app.settingsManager.setSetting('tutorial', 'completed', true);
    }
  }

  resetTutorial() {
    localStorage.removeItem('hinduFestivalsTutorialCompleted');
    if (window.app && window.app.settingsManager) {
      window.app.settingsManager.setSetting('tutorial', 'completed', false);
    }
  }

  showTooltip(element, text, position = 'top') {
    // Show contextual tooltip for help
    const tooltip = document.createElement('div');
    tooltip.className = 'help-tooltip';
    tooltip.textContent = text;
    
    document.body.appendChild(tooltip);
    
    const rect = element.getBoundingClientRect();
    
    switch (position) {
      case 'top':
        tooltip.style.left = `${rect.left + rect.width / 2}px`;
        tooltip.style.top = `${rect.top - 10}px`;
        tooltip.style.transform = 'translate(-50%, -100%)';
        break;
      case 'bottom':
        tooltip.style.left = `${rect.left + rect.width / 2}px`;
        tooltip.style.top = `${rect.bottom + 10}px`;
        tooltip.style.transform = 'translate(-50%, 0)';
        break;
    }
    
    // Show tooltip
    setTimeout(() => tooltip.classList.add('show'), 10);
    
    // Remove after delay
    setTimeout(() => {
      tooltip.classList.remove('show');
      setTimeout(() => {
        if (tooltip.parentNode) {
          tooltip.parentNode.removeChild(tooltip);
        }
      }, 300);
    }, 3000);
  }
}
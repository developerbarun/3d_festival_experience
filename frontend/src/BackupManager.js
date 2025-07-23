export class BackupManager {
  constructor() {
    this.backupInterval = 300000; // 5 minutes
    this.maxBackups = 10;
    this.backupData = new Map();
    this.isEnabled = true;
    
    this.init();
  }

  init() {
    this.setupAutomaticBackup();
    this.setupRecoverySystem();
    this.loadExistingBackups();
  }

  setupAutomaticBackup() {
    if (!this.isEnabled) return;
    
    setInterval(() => {
      this.createBackup();
    }, this.backupInterval);
    
    // Create backup on page unload
    window.addEventListener('beforeunload', () => {
      this.createBackup();
    });
  }

  setupRecoverySystem() {
    // Check for corrupted data on startup
    this.validateStoredData();
    
    // Offer recovery if corruption detected
    if (this.hasCorruptedData()) {
      this.offerDataRecovery();
    }
  }

  loadExistingBackups() {
    try {
      const backupsData = localStorage.getItem('hinduFestivalsBackups');
      if (backupsData) {
        const backups = JSON.parse(backupsData);
        this.backupData = new Map(Object.entries(backups));
      }
    } catch (error) {
      console.warn('Failed to load existing backups:', error);
    }
  }

  createBackup() {
    try {
      const timestamp = new Date().toISOString();
      const backupId = `backup_${Date.now()}`;
      
      const dataToBackup = {
        userProfile: localStorage.getItem('hinduFestivalsUserProfile'),
        progress: localStorage.getItem('hinduFestivalsProgress'),
        settings: localStorage.getItem('hinduFestivalsSettings'),
        userRegistration: localStorage.getItem('hinduFestivalsUserRegistration'),
        analyticsData: localStorage.getItem('analyticsData'),
        timestamp: timestamp
      };
      
      this.backupData.set(backupId, dataToBackup);
      
      // Keep only the most recent backups
      if (this.backupData.size > this.maxBackups) {
        const oldestKey = Array.from(this.backupData.keys())[0];
        this.backupData.delete(oldestKey);
      }
      
      // Save to localStorage
      const backupsObject = Object.fromEntries(this.backupData);
      localStorage.setItem('hinduFestivalsBackups', JSON.stringify(backupsObject));
      
      console.log(`📦 Backup created: ${backupId}`);
      
    } catch (error) {
      console.error('Failed to create backup:', error);
    }
  }

  validateStoredData() {
    const keysToValidate = [
      'hinduFestivalsUserProfile',
      'hinduFestivalsProgress',
      'hinduFestivalsSettings'
    ];
    
    keysToValidate.forEach(key => {
      try {
        const data = localStorage.getItem(key);
        if (data) {
          JSON.parse(data); // Test if valid JSON
        }
      } catch (error) {
        console.warn(`Corrupted data detected for ${key}:`, error);
        this.markAsCorrupted(key);
      }
    });
  }

  hasCorruptedData() {
    return localStorage.getItem('hinduFestivalsCorruptedData') !== null;
  }

  markAsCorrupted(key) {
    const corrupted = JSON.parse(localStorage.getItem('hinduFestivalsCorruptedData') || '[]');
    if (!corrupted.includes(key)) {
      corrupted.push(key);
      localStorage.setItem('hinduFestivalsCorruptedData', JSON.stringify(corrupted));
    }
  }

  offerDataRecovery() {
    const corrupted = JSON.parse(localStorage.getItem('hinduFestivalsCorruptedData') || '[]');
    
    if (corrupted.length > 0 && this.backupData.size > 0) {
      const shouldRecover = confirm(
        `Some of your data appears to be corrupted. Would you like to restore from a recent backup?\n\n` +
        `Corrupted items: ${corrupted.join(', ')}\n` +
        `Available backups: ${this.backupData.size}`
      );
      
      if (shouldRecover) {
        this.restoreFromBackup();
      }
    }
  }

  restoreFromBackup(backupId = null) {
    try {
      // Use most recent backup if no specific ID provided
      if (!backupId) {
        const backupIds = Array.from(this.backupData.keys()).sort().reverse();
        backupId = backupIds[0];
      }
      
      const backup = this.backupData.get(backupId);
      if (!backup) {
        throw new Error('Backup not found');
      }
      
      // Restore data
      Object.entries(backup).forEach(([key, value]) => {
        if (key !== 'timestamp' && value !== null) {
          localStorage.setItem(key, value);
        }
      });
      
      // Clear corruption markers
      localStorage.removeItem('hinduFestivalsCorruptedData');
      
      console.log(`✅ Data restored from backup: ${backupId}`);
      
      // Notify user
      if (window.app?.uiManager) {
        window.app.uiManager.showNotification('Data successfully restored from backup!', 'success');
      }
      
      // Reload page to apply restored data
      setTimeout(() => {
        window.location.reload();
      }, 2000);
      
    } catch (error) {
      console.error('Failed to restore from backup:', error);
      
      if (window.app?.uiManager) {
        window.app.uiManager.showNotification('Failed to restore backup. Please try again.', 'error');
      }
    }
  }

  exportBackups() {
    try {
      const backupsData = Object.fromEntries(this.backupData);
      const dataStr = JSON.stringify(backupsData, null, 2);
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `hindu-festivals-backups-${Date.now()}.json`;
      link.click();
      
      URL.revokeObjectURL(url);
      
      console.log('📤 Backups exported successfully');
      
    } catch (error) {
      console.error('Failed to export backups:', error);
    }
  }

  importBackups(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (event) => {
        try {
          const backupsData = JSON.parse(event.target.result);
          this.backupData = new Map(Object.entries(backupsData));
          
          // Save imported backups
          localStorage.setItem('hinduFestivalsBackups', JSON.stringify(backupsData));
          
          console.log('📥 Backups imported successfully');
          resolve(this.backupData.size);
          
        } catch (error) {
          console.error('Failed to import backups:', error);
          reject(error);
        }
      };
      
      reader.onerror = () => {
        reject(new Error('Failed to read backup file'));
      };
      
      reader.readAsText(file);
    });
  }

  getBackupList() {
    return Array.from(this.backupData.entries()).map(([id, backup]) => ({
      id,
      timestamp: backup.timestamp,
      size: JSON.stringify(backup).length
    })).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }

  deleteBackup(backupId) {
    if (this.backupData.has(backupId)) {
      this.backupData.delete(backupId);
      
      // Update localStorage
      const backupsObject = Object.fromEntries(this.backupData);
      localStorage.setItem('hinduFestivalsBackups', JSON.stringify(backupsObject));
      
      console.log(`🗑️ Backup deleted: ${backupId}`);
      return true;
    }
    return false;
  }

  clearAllBackups() {
    this.backupData.clear();
    localStorage.removeItem('hinduFestivalsBackups');
    console.log('🗑️ All backups cleared');
  }

  getBackupReport() {
    return {
      totalBackups: this.backupData.size,
      oldestBackup: this.getOldestBackup(),
      newestBackup: this.getNewestBackup(),
      totalSize: this.getTotalBackupSize(),
      isEnabled: this.isEnabled
    };
  }

  getOldestBackup() {
    const backups = this.getBackupList();
    return backups.length > 0 ? backups[backups.length - 1] : null;
  }

  getNewestBackup() {
    const backups = this.getBackupList();
    return backups.length > 0 ? backups[0] : null;
  }

  getTotalBackupSize() {
    let totalSize = 0;
    this.backupData.forEach(backup => {
      totalSize += JSON.stringify(backup).length;
    });
    return totalSize;
  }

  dispose() {
    this.backupData.clear();
    this.isEnabled = false;
  }
}
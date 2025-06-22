const fs = require('fs-extra');
const path = require('path');

class StorageService {
  constructor() {
    this.dir = path.join(__dirname, '../../data');
    this.alertFile = path.join(this.dir, 'alerts.json');
    this.feedbackFile = path.join(this.dir, 'feedback.json');
    fs.ensureDirSync(this.dir);
    fs.ensureFileSync(this.alertFile);
    fs.ensureFileSync(this.feedbackFile);
  }

  async saveAlert(alert) {
    const alerts = await this.loadAlerts();
    alerts.push(alert);
    await fs.writeJson(this.alertFile, alerts);
  }

  async loadAlerts() {
    return await fs.readJson(this.alertFile).catch(() => []);
  }

  async saveFeedback(fb) {
    const data = await this.loadFeedback();
    data.push(fb);
    await fs.writeJson(this.feedbackFile, data);
  }

  async loadFeedback() {
    return await fs.readJson(this.feedbackFile).catch(() => []);
  }
}

module.exports = new StorageService();
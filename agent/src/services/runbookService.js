const lunr = require('lunr');
const fs = require('fs-extra');
const path = require('path');

class RunbookService {
  constructor() {
    this.runbooksDir = path.join(__dirname, '../../runbooks');
    this.index = null;
    this.docs = new Map();
    this.buildIndex();
  }

  async buildIndex() {
    const files = await fs.readdir(this.runbooksDir);
    const markdownFiles = files.filter(f => f.endsWith('.md'));
    const documents = [];

    for (const file of markdownFiles) {
      const content = await fs.readFile(path.join(this.runbooksDir, file), 'utf-8');
      const title = file.replace('.md', '').replace(/-/g, ' ');
      const doc = { id: file, title, content };
      documents.push(doc);
      this.docs.set(file, doc);
    }

    this.index = lunr(function() {
      this.ref('id');
      this.field('title', { boost: 10 });
      this.field('content');
      documents.forEach(doc => this.add(doc));
    });
  }

  search(query, limit = 3) {
    if (!this.index) return [];
    const results = this.index.search(query);
    return results.slice(0, limit).map(r => this.docs.get(r.ref));
  }

  async getAll() {
    return Array.from(this.docs.values());
  }
}

module.exports = new RunbookService();
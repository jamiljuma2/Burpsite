const axios = require('axios');
const { JSDOM } = require('jsdom');

class Crawler {
  constructor(baseUrl, maxDepth = 2) {
    this.baseUrl = baseUrl;
    this.maxDepth = maxDepth;
    this.visited = new Set();
    this.endpoints = new Set();
  }

  normalizeUrl(url) {
    try {
      const urlObj = new URL(url, this.baseUrl);
      return urlObj.href;
    } catch {
      return null;
    }
  }

  isInScope(url) {
    try {
      const urlObj = new URL(url);
      const baseObj = new URL(this.baseUrl);
      return urlObj.hostname === baseObj.hostname;
    } catch {
      return false;
    }
  }

  async crawl(url = null, depth = 0) {
    url = url || this.baseUrl;

    if (depth > this.maxDepth || this.visited.has(url)) {
      return;
    }

    if (!this.isInScope(url)) {
      return;
    }

    this.visited.add(url);
    this.endpoints.add(url);

    try {
      const response = await axios.get(url, {
        timeout: 10000,
        headers: {
          'User-Agent': 'Burpsite-Crawler/1.0',
        },
      });

      if (!response.headers['content-type']?.includes('text/html')) {
        return;
      }

      const dom = new JSDOM(response.data);
      const links = dom.window.document.querySelectorAll('a[href]');

      for (const link of links) {
        let href = link.getAttribute('href');

        if (!href || href.startsWith('#') || href.startsWith('javascript:')) {
          continue;
        }

        const normalizedUrl = this.normalizeUrl(href);

        if (normalizedUrl && !this.visited.has(normalizedUrl) && this.isInScope(normalizedUrl)) {
          await this.crawl(normalizedUrl, depth + 1);
        }
      }

      // Extract forms
      const forms = dom.window.document.querySelectorAll('form');
      forms.forEach(form => {
        const action = form.getAttribute('action') || url;
        this.endpoints.add(this.normalizeUrl(action) || action);
      });
    } catch (error) {
      console.error(`Error crawling ${url}:`, error.message);
    }
  }

  getEndpoints() {
    return Array.from(this.endpoints);
  }

  buildTree() {
    const tree = {};

    this.endpoints.forEach(endpoint => {
      try {
        const url = new URL(endpoint);
        const pathname = url.pathname || '/';
        const parts = pathname.split('/').filter(p => p);

        let current = tree;
        current['/'] = current['/'] || { type: 'folder', children: {} };

        for (let i = 0; i < parts.length; i++) {
          const part = parts[i];
          if (!current.children) current.children = {};

          if (i === parts.length - 1) {
            current.children[part] = {
              type: 'endpoint',
              path: pathname,
              url: endpoint.split('?')[0],
            };
          } else {
            if (!current.children[part]) {
              current.children[part] = {
                type: 'folder',
                children: {},
              };
            }
            current = current.children[part];
          }
        }
      } catch (error) {
        // Skip invalid URLs
      }
    });

    return tree['/'];
  }
}

module.exports = Crawler;

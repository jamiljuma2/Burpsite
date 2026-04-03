const axios = require('axios');

class ProxyServer {
  constructor(port) {
    this.port = port;
    this.interceptedRequests = new Map();
    this.requestIdCounter = 0;
  }

  generateRequestId() {
    return ++this.requestIdCounter;
  }

  addInterceptedRequest(id, request) {
    this.interceptedRequests.set(id, {
      ...request,
      id,
      timestamp: Date.now(),
      status: 'intercepted',
    });
  }

  getInterceptedRequest(id) {
    return this.interceptedRequests.get(id);
  }

  updateInterceptedRequest(id, updates) {
    const request = this.interceptedRequests.get(id);
    if (request) {
      this.interceptedRequests.set(id, { ...request, ...updates });
      return this.interceptedRequests.get(id);
    }
    return null;
  }

  removeInterceptedRequest(id) {
    this.interceptedRequests.delete(id);
  }

  getAllInterceptedRequests() {
    return Array.from(this.interceptedRequests.values());
  }

  clearInterceptedRequests() {
    this.interceptedRequests.clear();
  }
}

module.exports = ProxyServer;

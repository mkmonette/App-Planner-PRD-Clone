import { STORAGE_KEYS } from './constants';

// Storage Manager for LocalStorage operations
class StorageManager {
  // Generic get method
  get(key) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error(`Error reading from localStorage [${key}]:`, error);
      return null;
    }
  }

  // Generic set method
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`Error writing to localStorage [${key}]:`, error);
      return false;
    }
  }

  // Apps CRUD
  getApps() {
    return this.get(STORAGE_KEYS.APPS) || [];
  }

  setApps(apps) {
    return this.set(STORAGE_KEYS.APPS, apps);
  }

  getApp(id) {
    const apps = this.getApps();
    return apps.find(app => app.id === id);
  }

  createApp(app) {
    const apps = this.getApps();
    apps.push(app);
    this.setApps(apps);
    return app;
  }

  updateApp(id, updates) {
    const apps = this.getApps();
    const index = apps.findIndex(app => app.id === id);
    if (index !== -1) {
      apps[index] = { ...apps[index], ...updates, updated_at: new Date().toISOString() };
      this.setApps(apps);
      return apps[index];
    }
    return null;
  }

  deleteApp(id) {
    const apps = this.getApps().filter(app => app.id !== id);
    this.setApps(apps);
    // Also delete all blocks for this app
    const blocks = this.getBlocks().filter(block => block.app_id !== id);
    this.setBlocks(blocks);
    return true;
  }

  // Blocks CRUD
  getBlocks() {
    return this.get(STORAGE_KEYS.BLOCKS) || [];
  }

  setBlocks(blocks) {
    return this.set(STORAGE_KEYS.BLOCKS, blocks);
  }

  getBlocksByApp(appId) {
    return this.getBlocks().filter(block => block.app_id === appId);
  }

  getBlock(id) {
    const blocks = this.getBlocks();
    return blocks.find(block => block.id === id);
  }

  createBlock(block) {
    const blocks = this.getBlocks();
    blocks.push(block);
    this.setBlocks(blocks);
    return block;
  }

  updateBlock(id, updates) {
    const blocks = this.getBlocks();
    const index = blocks.findIndex(block => block.id === id);
    if (index !== -1) {
      blocks[index] = { ...blocks[index], ...updates, updated_at: new Date().toISOString() };
      this.setBlocks(blocks);
      return blocks[index];
    }
    return null;
  }

  deleteBlock(id) {
    // Soft delete - set status to deprecated
    return this.updateBlock(id, { status: 'deprecated' });
  }

  hardDeleteBlock(id) {
    // Hard delete - remove from storage
    const blocks = this.getBlocks().filter(block => block.id !== id);
    this.setBlocks(blocks);
    return true;
  }

  reorderBlocks(blockIds, parentId = null) {
    const blocks = this.getBlocks();
    blockIds.forEach((id, index) => {
      const blockIndex = blocks.findIndex(block => block.id === id);
      if (blockIndex !== -1) {
        blocks[blockIndex].order = index;
        if (parentId !== undefined) {
          blocks[blockIndex].parent_id = parentId;
        }
        blocks[blockIndex].updated_at = new Date().toISOString();
      }
    });
    this.setBlocks(blocks);
    return blocks;
  }

  // Collapsed state
  getCollapsedState() {
    return this.get(STORAGE_KEYS.COLLAPSED) || {};
  }

  setCollapsedState(state) {
    return this.set(STORAGE_KEYS.COLLAPSED, state);
  }

  toggleCollapsed(blockId) {
    const state = this.getCollapsedState();
    state[blockId] = !state[blockId];
    this.setCollapsedState(state);
    return state[blockId];
  }

  // Calculate progress for an app or block
  calculateProgress(appId, parentId = null) {
    const blocks = this.getBlocksByApp(appId);
    
    // Filter blocks by parent if specified
    const relevantBlocks = parentId 
      ? this.getDescendants(blocks, parentId)
      : blocks;
    
    // Exclude deprecated blocks from progress calculation
    const activeBlocks = relevantBlocks.filter(b => b.status !== 'deprecated');
    
    if (activeBlocks.length === 0) return { total: 0, done: 0, percentage: 0 };
    
    const done = activeBlocks.filter(b => b.status === 'done').length;
    const total = activeBlocks.length;
    const percentage = Math.round((done / total) * 100);
    
    return { total, done, percentage };
  }

  // Get all descendants of a block
  getDescendants(blocks, parentId) {
    const descendants = [];
    const children = blocks.filter(b => b.parent_id === parentId);
    
    children.forEach(child => {
      descendants.push(child);
      descendants.push(...this.getDescendants(blocks, child.id));
    });
    
    return descendants;
  }

  // Build tree structure from flat blocks
  buildTree(blocks, parentId = null) {
    return blocks
      .filter(block => block.parent_id === parentId)
      .sort((a, b) => a.order - b.order)
      .map(block => ({
        ...block,
        children: this.buildTree(blocks, block.id),
      }));
  }

  // Export data
  exportData() {
    return {
      apps: this.getApps(),
      blocks: this.getBlocks(),
      collapsed: this.getCollapsedState(),
      exportedAt: new Date().toISOString(),
    };
  }

  // Import data
  importData(data) {
    if (data.apps) this.setApps(data.apps);
    if (data.blocks) this.setBlocks(data.blocks);
    if (data.collapsed) this.setCollapsedState(data.collapsed);
    return true;
  }

  // Clear all data
  clearAll() {
    localStorage.removeItem(STORAGE_KEYS.APPS);
    localStorage.removeItem(STORAGE_KEYS.BLOCKS);
    localStorage.removeItem(STORAGE_KEYS.COLLAPSED);
    localStorage.removeItem(STORAGE_KEYS.SETTINGS);
    return true;
  }
}

// Export singleton instance
export const storage = new StorageManager();
export default storage;

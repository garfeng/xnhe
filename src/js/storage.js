class WindowStorage {
  constructor() {
    this.db = {};
  }

  setItem(key, value) {
    Object.assign(this.db, value);
  }

  getItem(key) {
    return this.db[key] || null;
  }

  removeItem(key) {
    delete this.db[key];
  }
}

const db = window.localStorage ? window.localStorage : new WindowStorage();

export default db;
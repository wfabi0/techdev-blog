interface CacheData {
  [key: string]: { data: any; expires: number };
}

export default class CacheController {
  private cache: CacheData;

  constructor() {
    this.cache = {};
  }

  get(key: string) {
    return this.cache[key];
  }

  set(key: string, data: any, expires: number = Date.now()): void {
    this.cache[key] = { data, expires };
  }

  has(key: string): boolean {
    return this.cache.hasOwnProperty(key);
  }

  remove(key: string): void {
    delete this.cache[key];
  }

  clear(): void {
    this.cache = {};
  }
}

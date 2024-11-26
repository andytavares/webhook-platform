import { PrismaClient } from '@prisma/client';

class Database {
  private static _instance: PrismaClient;

  private constructor() {}

  static getInstance() {
    if (this._instance) {
      return this._instance;
    }
    this._instance = new PrismaClient();
    return this._instance;
  }
}

export default Database;

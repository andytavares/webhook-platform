import { SchemaRegistry } from '@kafkajs/confluent-schema-registry';
import Winston from '../winston/winston';

class AvroSchemaRegistry {
  private static _instance: SchemaRegistry;
  private static logger = Winston.getInstance();

  private constructor() {}

  static getInstance() {
    if (this._instance) {
      return this._instance;
    }
    this._instance = new SchemaRegistry({ host: 'http://localhost:8081' });
    return this._instance;
  }
}

export default AvroSchemaRegistry;

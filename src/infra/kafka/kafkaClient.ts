import { Kafka, logLevel } from 'kafkajs';
import { Config } from '../../utils/configuration';
import Winston from '../winston/winston';

class KafkaClient {
  private static _instance: Kafka;
  private static logger = Winston.getInstance();

  private constructor() {}

  static getInstance() {
    if (this._instance) {
      return this._instance;
    }
    console.log(process.env.KAFKA_URL);
    this._instance = new Kafka({
      logLevel: logLevel.DEBUG,
      brokers: [Config.getString('KAFKA_URL') || ''],
      clientId: process.env.APP_NAME,
    });
    return this._instance;
  }
}

export default KafkaClient;

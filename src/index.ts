import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import { SignalConstants } from 'os';
import { AdminRouter } from './core/admin/admin.router';
import { CallbackRouter } from './core/callback/callback.router';
import startConsumer from './core/consumer/consumer.router';
import { EventRouter } from './core/events/event.router';
import { ProducerRouter } from './core/producer/producer.router';
import KafkaClient from './infra/kafka/kafkaClient';
import Winston from './infra/winston/winston';
import server from './server';
import {
  handleError,
  handleSignal,
} from './utils/ErrorHandlers/topLevelHandlers';
import { Config } from './utils/configuration';

dotenv.config();

const port = Config.getString('PORT');
const logger = Winston.getInstance();
const eventBus = KafkaClient.getInstance();

server.use(bodyParser.json());
server.use(cors());

server.use('/admin', AdminRouter);
server.use('/producer', ProducerRouter);
server.use('/event', EventRouter);
server.use('/callback', CallbackRouter);

startConsumer();

const errorTypes = ['unhandledRejection', 'uncaughtException'];
const signalTypes = ['SIGTERM', 'SIGINT', 'SIGUSR2'];

errorTypes.forEach((type) => {
  process.on(type, async (error: Error) => {
    try {
      handleError(error);
      process.exit(0);
    } catch (_) {
      process.exit(1);
    }
  });
});

signalTypes.forEach((type) => {
  process.once(type, async (signal: SignalConstants) => {
    try {
      handleSignal(signal);
    } finally {
      process.kill(process.pid, type);
    }
  });
});

server.listen(port, () => {
  console.log(`[server]: Server is runbing on port: ${port}`);
});

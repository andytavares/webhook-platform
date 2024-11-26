import { Request, Response, Router } from 'express';
import { CompressionTypes, Partitioners } from 'kafkajs';
import AvroSchemaRegistry from '../../infra/avro/schema-registry';
import KafkaClient from '../../infra/kafka/kafkaClient';
import Winston from '../../infra/winston/winston';
import { Config } from '../../utils/configuration';

const logger = Winston.getInstance();
const eventBus = KafkaClient.getInstance();
const registry = AvroSchemaRegistry.getInstance();
const router = Router();

router.get('/', async (req: Request, res: Response) => {
  const schemaId = await registry.getLatestSchemaId('events.IncomingMessage');

  const producer = eventBus.producer({
    createPartitioner: Partitioners.LegacyPartitioner,
  });
  await producer.connect();
  const topic = Config.getString('INCOMING_EVENT_TOPIC');

  const getMessage = () => ({
    name: 'event:test:emitted',
    identifier: Math.round(Math.random() * 1000).toString(),
    headers: { 'A-Header': Math.round(Math.random() * 1000).toString() },
    payload: JSON.stringify({
      message: 'this is a test message, it could represent anything',
    }),
  });
  const createMessage = async () => ({
    key: 'event:test:emitted',
    value: await registry.encode(schemaId, getMessage()),
  });

  const finalMessage = await createMessage();

  try {
    const status = await producer.send({
      topic,
      compression: CompressionTypes.GZIP,
      messages: [finalMessage],
    });
    console.log(status);
  } catch (err) {
    logger.error(err);
  }

  producer.disconnect();
  res.send('Done');
});

export { router as ProducerRouter };

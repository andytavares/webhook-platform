import AvroSchemaRegistry from '../../infra/avro/schema-registry';
import KafkaClient from '../../infra/kafka/kafkaClient';
import Database from '../../infra/prisma/prismaClient';
import Winston from '../../infra/winston/winston';
import { Config } from '../../utils/configuration';

const logger = Winston.getInstance();
const eventBus = KafkaClient.getInstance();
const registry = AvroSchemaRegistry.getInstance();
const db = Database.getInstance();

const startConsumer = async () => {
  const schemaId = await registry.getLatestSchemaId('events.IncomingEvent');
  const consumer = eventBus.consumer({
    groupId: Config.getString('CONSUMER_GROUP'),
  });

  await consumer.connect();

  try {
    await consumer.subscribe({
      topics: [Config.getString('INCOMING_EVENT_TOPIC')],
    });

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        const isSubscribed = await db.registration.findFirst({
          where: { subscribedTo: Config.getString('TEST_EVENT') },
        });
        const msgDecoded = await registry.decode(message.value as Buffer);
        const prefix = `${topic}[${partition} | ${message.offset} / ${message.timestamp}]`;
        logger.info(
          `CONSUMER MESSAGE RECEIVED: ${prefix} event: ${message.key} body ${msgDecoded}`
        );

        if (
          message.key?.toString() === Config.getString('TEST_MESSAGE') &&
          isSubscribed
        ) {
          fetch('http://localhost:8080/callback', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: `${msgDecoded}`,
          });
        }
      },
    });
  } catch (err) {
    console.log(err);
    logger.error(`[example/consumer] ${err}`);
    await consumer.disconnect();
  }
};

export default startConsumer;

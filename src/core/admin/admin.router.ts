import { Request, Response, Router } from 'express';
import KafkaClient from '../../infra/kafka/kafkaClient';
import Winston from '../../infra/winston/winston';
import { Config } from '../../utils/configuration';

const logger = Winston.getInstance();
const eventBus = KafkaClient.getInstance();
const router = Router();

router.get('/kafka/configure', async (req: Request, res: Response) => {
  const admin = eventBus.admin();
  try {
    await admin.connect();
  } catch (err) {
    logger.error(err);
  }

  try {
    await admin.createTopics({
      validateOnly: false,
      waitForLeaders: true,
      timeout: 30000,
      topics: [
        {
          topic: Config.getString('INCOMING_EVENT_TOPIC'),
          numPartitions: -1,
          replicationFactor: -1,
          configEntries: [],
        },
      ],
    });
  } catch (err) {
    logger.error(err);
  }

  await admin.disconnect();
  res.send(
    "Process complete! Check logs to make sure it succeeded, if it failed it's likely because the topic already exists"
  );
});

export { router as AdminRouter };

import { Request, Response, Router } from 'express';
import Database from '../../infra/prisma/prismaClient';
import Winston from '../../infra/winston/winston';

const logger = Winston.getInstance();
const db = Database.getInstance();

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const events = await db.event.findMany();
    res.json(events);
  } catch (err) {
    logger.error(err);
  }
});

router.post('/', async (req: Request, res: Response) => {
  try {
    const event = await db.event.create({
      data: {
        event: req.body.event,
        description: req.body.description,
        identifier: req.body.identifier,
      },
    });
    res.json(event);
  } catch (err) {
    logger.error(err);
  }
});

router.get('/:event/subscription', async (req: Request, res: Response) => {
  try {
    const subscriptions = await db.registration.findMany({
      where: { subscribedTo: req.params.event },
    });
    res.json(subscriptions);
  } catch (err) {
    logger.error(err);
  }
});

router.post('/:event/subscription', async (req: Request, res: Response) => {
  try {
    const event = await db.registration.create({
      data: {
        subscribedTo: req.params.event,
        target: req.body.target,
        subscriptionType: req.body.subscriptionType,
      },
    });
    res.json(event);
  } catch (err) {
    logger.error(err);
  }
});

router.delete('/:event/subscription', async (req: Request, res: Response) => {
  try {
    const deleteResult = await db.registration.deleteMany({
      where: {
        subscribedTo: req.params.event,
      },
    });
    res.json(deleteResult);
  } catch (err) {
    logger.error(err);
  }
});

export { router as EventRouter };

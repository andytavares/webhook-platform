import { Request, Response, Router } from 'express';
import Winston from '../../infra/winston/winston';

const logger = Winston.getInstance();
const router = Router();

router.post('/', async (req: Request, res: Response) => {
  console.log(
    `EXTERNAL SERVICE CALLBACK URL CALLED WITH: ${JSON.stringify(
      req.body,
      null,
      2
    )}`
  );
  res.send('OK');
});

export { router as CallbackRouter };

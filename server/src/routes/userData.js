import { Router } from 'express';
import { UserData } from '../models/UserData.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

async function getOrCreateUserData(userId) {
  let data = await UserData.findOne({ userId });
  if (!data) {
    data = await UserData.create({ userId });
  }
  return data;
}

router.get('/', requireAuth, async (req, res) => {
  try {
    const data = await getOrCreateUserData(req.user._id);
    return res.json({
      watchlist: data.watchlist,
      portfolio: data.portfolio,
      alerts: data.alerts,
    });
  } catch (error) {
    console.error('Fetch user data error:', error);
    return res.status(500).json({ error: 'Failed to load user data' });
  }
});

router.put('/', requireAuth, async (req, res) => {
  try {
    const { watchlist, portfolio, alerts } = req.body;
    const data = await getOrCreateUserData(req.user._id);

    if (watchlist !== undefined) data.watchlist = watchlist;
    if (portfolio !== undefined) data.portfolio = portfolio;
    if (alerts !== undefined) data.alerts = alerts;

    await data.save();

    return res.json({
      watchlist: data.watchlist,
      portfolio: data.portfolio,
      alerts: data.alerts,
    });
  } catch (error) {
    console.error('Update user data error:', error);
    return res.status(500).json({ error: 'Failed to save user data' });
  }
});

router.post('/migrate', requireAuth, async (req, res) => {
  try {
    const { watchlist, portfolio, alerts } = req.body;
    const data = await getOrCreateUserData(req.user._id);

    if (!data.watchlist.length && watchlist?.length) {
      data.watchlist = watchlist;
    }
    if (!data.portfolio.length && portfolio?.length) {
      data.portfolio = portfolio;
    }
    if (!data.alerts.length && alerts?.length) {
      data.alerts = alerts;
    }

    await data.save();

    return res.json({
      watchlist: data.watchlist,
      portfolio: data.portfolio,
      alerts: data.alerts,
    });
  } catch (error) {
    console.error('Migrate user data error:', error);
    return res.status(500).json({ error: 'Failed to migrate user data' });
  }
});

export default router;
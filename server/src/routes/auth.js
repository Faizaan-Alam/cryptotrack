import { Router } from 'express';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { User } from '../models/User.js';
import { UserData } from '../models/UserData.js';
import { requireAuth, signToken } from '../middleware/auth.js';
import { getApiUrl, getFrontendUrl } from '../utils/urls.js';

const router = Router();

function formatUser(user) {
  return {
    id: user._id,
    email: user.email,
    name: user.name,
    avatar: user.avatar,
  };
}

async function ensureUserData(userId) {
  let data = await UserData.findOne({ userId });
  if (!data) {
    data = await UserData.create({ userId });
  }
  return data;
}

router.post('/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ error: 'An account with this email already exists' });
    }

    const user = await User.create({
      email: email.toLowerCase(),
      password,
      name: name?.trim() || email.split('@')[0],
    });

    await ensureUserData(user._id);

    const token = signToken(user._id);
    return res.status(201).json({ token, user: formatUser(user) });
  } catch (error) {
    console.error('Register error:', error);
    return res.status(500).json({ error: 'Failed to create account' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user || !user.password) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const valid = await user.comparePassword(password);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    await ensureUserData(user._id);

    const token = signToken(user._id);
    return res.json({ token, user: formatUser(user) });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'Failed to sign in' });
  }
});

router.get('/me', requireAuth, async (req, res) => {
  return res.json({ user: formatUser(req.user) });
});

router.get('/config', (_req, res) => {
  res.json({
    googleEnabled: !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET),
  });
});

const googleEnabled =
  process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET;

if (googleEnabled) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: `${getApiUrl()}/api/auth/google/callback`,
      },
      async (_accessToken, _refreshToken, profile, done) => {
        try {
          const email = profile.emails?.[0]?.value;
          let user = await User.findOne({ googleId: profile.id });

          if (!user && email) {
            user = await User.findOne({ email: email.toLowerCase() });
            if (user) {
              user.googleId = profile.id;
              user.avatar = user.avatar || profile.photos?.[0]?.value;
              await user.save();
            }
          }

          if (!user) {
            user = await User.create({
              googleId: profile.id,
              email: email?.toLowerCase(),
              name: profile.displayName,
              avatar: profile.photos?.[0]?.value,
            });
          }

          await ensureUserData(user._id);
          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  router.get(
    '/google',
    passport.authenticate('google', { scope: ['profile', 'email'], session: false })
  );

  router.get(
    '/google/callback',
    passport.authenticate('google', {
      session: false,
      failureRedirect: `${getFrontendUrl()}/login`,
    }),
    (req, res) => {
      const token = signToken(req.user._id);
      res.redirect(`${getFrontendUrl()}/auth/callback?token=${token}`);
    }
  );
} else {
  router.get('/google', (_req, res) => {
    res.status(503).json({
      error: 'Google sign-in is not configured. Add GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET.',
    });
  });
}

export default router;
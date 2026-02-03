export const config = {
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: Number(process.env.PORT ?? 3000),
  mongoUri: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET,
  googleClientId: process.env.GOOGLE_CLIENT_ID,
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
} as const;

export type Config = typeof config;

export const getCookieOptions = () => ({
  httpOnly: true,
  secure: config.nodeEnv === 'production',
  maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
  sameSite: 'lax' as const,
});

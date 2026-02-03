declare global {
  namespace Express {
    interface Request {
      /** Set by auth middleware after JWT verify. Use req.user.id to load full user from DB if needed. */
      user?: { id: string };
    }
  }
}

export {};

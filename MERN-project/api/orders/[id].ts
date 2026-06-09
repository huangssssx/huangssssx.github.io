import type { Request, Response } from 'express';
export default async function handler(req: Request, res: Response) {
  return res.status(501).json({ error: 'Not implemented yet — complete Phase 2' });
}

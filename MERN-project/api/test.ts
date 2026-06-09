import type { Request, Response } from 'express';

export default async function handler(req: Request, res: Response) {
  console.log('[test] handler called');
  return res.status(200).json({ ok: true, time: new Date().toISOString() });
}

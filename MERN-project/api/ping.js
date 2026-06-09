export default function handler(req, res) {
  console.log('[ping] called');
  return res.status(200).json({ ok: true });
}

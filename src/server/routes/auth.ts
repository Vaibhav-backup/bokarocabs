import express from 'express';
import jwt from 'jsonwebtoken';

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'gobokaro_secret_2024_premium';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'gobokaro2024';

router.post("/login", (req, res) => {
  const { password } = req.body;
  if (password === ADMIN_PASSWORD) {
    const token = jwt.sign({ role: 'admin' }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ success: true, token });
  } else {
    res.status(401).json({ error: "Invalid password" });
  }
});

export default router;
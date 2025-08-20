import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';

// Simple in-memory users for assignment scope
const users: Array<{ name: string; email: string; passwordHash: string }> = [];

const router = Router();

router.post(
  '/register',
  [
    body('name').isString().isLength({ min: 2 }),
    body('email').isEmail(),
    body('password').isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { name, email, password } = req.body;
    const exists = users.find(u => u.email === email);
    if (exists) return res.status(400).json({ message: 'Email already registered' });

    const passwordHash = await bcrypt.hash(password, 10);
    users.push({ name, email, passwordHash });
    return res.status(201).json({ message: 'Registered successfully' });
  }
);

router.post(
  '/login',
  [body('email').isEmail(), body('password').isLength({ min: 6 })],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { email, password } = req.body;
    const user = users.find(u => u.email === email);
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ email }, process.env.JWT_SECRET || 'secret', { expiresIn: '1d' });
    res.json({ token });
  }
);

export default router;



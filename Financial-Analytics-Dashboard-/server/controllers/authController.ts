import { Request, Response } from 'express';
import { loginUser } from '../services/authService.js';

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: 'Please provide both email and password.',
      });
      return;
    }

    const result = await loginUser(email, password);

    res.status(200).json({
      success: true,
      data: result,
      message: 'Login successful.',
    });
  } catch (error: any) {
    res.status(401).json({
      success: false,
      message: error.message || 'Authentication failed.',
    });
  }
};

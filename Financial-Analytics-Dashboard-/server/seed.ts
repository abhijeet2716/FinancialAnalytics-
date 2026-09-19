import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { Transaction } from './models/Transaction.js';
import { User } from './models/User.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/financial_dashboard';

export const seedDatabase = async () => {
  console.log('========================================================');
  console.log('[Seed] Starting Financial Analytics Database Seeding...');
  console.log(`[Seed] Target MongoDB URI: ${MONGODB_URI}`);
  console.log('========================================================');

  try {
    await mongoose.connect(MONGODB_URI);
    console.log('[Seed] Connected to MongoDB successfully.');

    // 1. Seed Demo User
    const demoEmail = 'analyst@finance.com';
    const existingUser = await User.findOne({ email: demoEmail });

    if (!existingUser) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('password123', salt);

      await User.create({
        name: 'Senior Financial Analyst',
        email: demoEmail,
        password: hashedPassword,
      });
      console.log(`[Seed] Demo User created: ${demoEmail} / password123`);
    } else {
      console.log(`[Seed] Demo User already exists: ${demoEmail}`);
    }

    // 2. Read transactions.json
    const transactionsPath = path.resolve(process.cwd(), 'transactions.json');
    if (!fs.existsSync(transactionsPath)) {
      throw new Error(`File not found: ${transactionsPath}`);
    }

    const rawData = fs.readFileSync(transactionsPath, 'utf-8');
    const transactions = JSON.parse(rawData);
    console.log(`[Seed] Read ${transactions.length} records from transactions.json.`);

    // 3. Clear existing and bulk insert to avoid duplicates
    await Transaction.deleteMany({});
    console.log('[Seed] Cleared existing transactions.');

    const formattedTransactions = transactions.map((item: any) => ({
      ...item,
      date: new Date(item.date),
    }));

    const result = await Transaction.insertMany(formattedTransactions);
    console.log(`[Seed] Successfully inserted ${result.length} transactions into MongoDB!`);

    console.log('========================================================');
    console.log('[Seed] Database seeding completed successfully.');
    console.log('Demo Credentials:');
    console.log('Email:    analyst@finance.com');
    console.log('Password: password123');
    console.log('========================================================');
  } catch (error: any) {
    console.error('[Seed] Database seeding failed:', error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
    console.log('[Seed] Database connection closed.');
  }
};

// If run directly via CLI
if (import.meta.url === `file://${process.argv[1]}`) {
  seedDatabase().then(() => process.exit(0));
}

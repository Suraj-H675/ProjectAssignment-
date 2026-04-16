import pool from './database';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

const seed = async () => {
  try {
    console.log('Seeding database...');

    const adminPassword = await bcrypt.hash('admin123', 12);
    const userPassword = await bcrypt.hash('user123', 12);

    const adminId = uuidv4();
    const userId = uuidv4();

    await pool.query(
      `INSERT INTO users (id, email, password, name, role, "createdAt", "updatedAt")
       VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
       ON CONFLICT (email) DO NOTHING`,
      [adminId, 'admin@example.com', adminPassword, 'Admin User', 'admin']
    );

    await pool.query(
      `INSERT INTO users (id, email, password, name, role, "createdAt", "updatedAt")
       VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
       ON CONFLICT (email) DO NOTHING`,
      [userId, 'user@example.com', userPassword, 'Test User', 'user']
    );

    const taskId = uuidv4();
    await pool.query(
      `INSERT INTO tasks (id, title, description, status, priority, "userId", "createdAt", "updatedAt")
       VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
       ON CONFLICT DO NOTHING`,
      [taskId, 'Welcome Task', 'This is a sample task to get you started', 'pending', 'high', userId]
    );

    console.log('Seeding complete!');
    console.log('Admin: admin@example.com / admin123');
    console.log('User: user@example.com / user123');

    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seed();
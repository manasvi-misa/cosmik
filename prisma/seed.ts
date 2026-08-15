/**
 * Cosmik — Database Seed
 * Creates demo admin + user accounts and sample charts.
 * Run: npx prisma db seed
 */

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌌 Seeding Cosmik database...\n');

  // Admin user
  const adminPw = await bcrypt.hash('admin123', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@cosmik.app' },
    update: {},
    create: {
      email: 'admin@cosmik.app',
      name: 'Cosmik Admin',
      password: adminPw,
      role: 'ADMIN',
      emailVerified: new Date(),
      settings: { create: { theme: 'dark' } },
    },
  });
  console.log(`✦ Admin: ${admin.email} / admin123`);

  // Demo user
  const userPw = await bcrypt.hash('demo1234', 12);
  const user = await prisma.user.upsert({
    where: { email: 'demo@cosmik.app' },
    update: {},
    create: {
      email: 'demo@cosmik.app',
      name: 'Demo User',
      password: userPw,
      emailVerified: new Date(),
      settings: { create: { theme: 'dark' } },
    },
  });
  console.log(`✦ Demo: ${user.email} / demo1234`);

  // Sample Vedic chart
  await prisma.birthChart.upsert({
    where: { id: 'seed-vedic-01' },
    update: {},
    create: {
      id: 'seed-vedic-01',
      userId: user.id,
      name: 'Ravi Kumar',
      gender: 'MALE',
      dateOfBirth: new Date('1990-04-14'),
      timeOfBirth: '06:30',
      unknownTime: false,
      country: 'India',
      state: 'Tamil Nadu',
      city: 'Chennai',
      latitude: 13.0827,
      longitude: 80.2707,
      timezone: 'UTC+05:30',
      astrologySystem: 'VEDIC',
      vedicSchool: 'Parashara',
      ayanamsa: 'LAHIRI',
      isFavorite: true,
    },
  });

  // Sample Western chart
  await prisma.birthChart.upsert({
    where: { id: 'seed-western-01' },
    update: {},
    create: {
      id: 'seed-western-01',
      userId: user.id,
      name: 'Emma Wilson',
      gender: 'FEMALE',
      dateOfBirth: new Date('1995-07-22'),
      timeOfBirth: '14:15',
      unknownTime: false,
      country: 'United Kingdom',
      state: 'England',
      city: 'London',
      latitude: 51.5074,
      longitude: -0.1278,
      timezone: 'UTC+01:00',
      astrologySystem: 'WESTERN',
      houseSystem: 'PLACIDUS',
      isFavorite: false,
    },
  });

  // Sample BaZi chart
  await prisma.birthChart.upsert({
    where: { id: 'seed-bazi-01' },
    update: {},
    create: {
      id: 'seed-bazi-01',
      userId: user.id,
      name: 'Li Wei',
      gender: 'MALE',
      dateOfBirth: new Date('1988-03-05'),
      timeOfBirth: '09:00',
      unknownTime: false,
      country: 'China',
      state: 'Beijing',
      city: 'Beijing',
      latitude: 39.9042,
      longitude: 116.4074,
      timezone: 'UTC+08:00',
      astrologySystem: 'BAZI',
      isFavorite: false,
    },
  });

  console.log('\n✅ Seed complete!\n');
  console.log('  Admin Panel:  /admin');
  console.log('  Dashboard:    /dashboard');
  console.log('  Demo Login:   demo@cosmik.app / demo1234\n');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });

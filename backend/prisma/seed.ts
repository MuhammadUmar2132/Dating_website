import { PrismaClient, UserRole, CompetitionStatus, PointCategory, RewardType, UnlockType, AudienceType } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // ── Markets ──────────────────────────────────
  const markets = await Promise.all([
    prisma.market.upsert({ where: { id: 'market-new-york' }, update: {}, create: { id: 'market-new-york', name: 'New York', city: 'New York', state: 'NY' } }),
    prisma.market.upsert({ where: { id: 'market-los-angeles' }, update: {}, create: { id: 'market-los-angeles', name: 'Los Angeles', city: 'Los Angeles', state: 'CA' } }),
    prisma.market.upsert({ where: { id: 'market-chicago' }, update: {}, create: { id: 'market-chicago', name: 'Chicago', city: 'Chicago', state: 'IL' } }),
    prisma.market.upsert({ where: { id: 'market-miami' }, update: {}, create: { id: 'market-miami', name: 'Miami', city: 'Miami', state: 'FL' } }),
    prisma.market.upsert({ where: { id: 'market-austin' }, update: {}, create: { id: 'market-austin', name: 'Austin', city: 'Austin', state: 'TX' } }),
    prisma.market.upsert({ where: { id: 'market-boston' }, update: {}, create: { id: 'market-boston', name: 'Boston', city: 'Boston', state: 'MA' } }),
    prisma.market.upsert({ where: { id: 'market-denver' }, update: {}, create: { id: 'market-denver', name: 'Denver', city: 'Denver', state: 'CO' } }),
    prisma.market.upsert({ where: { id: 'market-dc' }, update: {}, create: { id: 'market-dc', name: 'Washington DC', city: 'Washington', state: 'DC' } }),
  ]);
  console.log(`✅ ${markets.length} markets seeded`);

  // ── Schools ──────────────────────────────────
  const schools = await Promise.all([
    prisma.school.upsert({ where: { id: 'school-nyu' }, update: {}, create: { id: 'school-nyu', name: 'New York University', city: 'New York', state: 'NY', marketId: 'market-new-york' } }),
    prisma.school.upsert({ where: { id: 'school-columbia' }, update: {}, create: { id: 'school-columbia', name: 'Columbia University', city: 'New York', state: 'NY', marketId: 'market-new-york' } }),
    prisma.school.upsert({ where: { id: 'school-ucla' }, update: {}, create: { id: 'school-ucla', name: 'UCLA', city: 'Los Angeles', state: 'CA', marketId: 'market-los-angeles' } }),
    prisma.school.upsert({ where: { id: 'school-usc' }, update: {}, create: { id: 'school-usc', name: 'University of Southern California', city: 'Los Angeles', state: 'CA', marketId: 'market-los-angeles' } }),
    prisma.school.upsert({ where: { id: 'school-uchicago' }, update: {}, create: { id: 'school-uchicago', name: 'University of Chicago', city: 'Chicago', state: 'IL', marketId: 'market-chicago' } }),
    prisma.school.upsert({ where: { id: 'school-northwestern' }, update: {}, create: { id: 'school-northwestern', name: 'Northwestern University', city: 'Evanston', state: 'IL', marketId: 'market-chicago' } }),
    prisma.school.upsert({ where: { id: 'school-um' }, update: {}, create: { id: 'school-um', name: 'University of Miami', city: 'Coral Gables', state: 'FL', marketId: 'market-miami' } }),
    prisma.school.upsert({ where: { id: 'school-ut-austin' }, update: {}, create: { id: 'school-ut-austin', name: 'University of Texas at Austin', city: 'Austin', state: 'TX', marketId: 'market-austin' } }),
    prisma.school.upsert({ where: { id: 'school-mit' }, update: {}, create: { id: 'school-mit', name: 'MIT', city: 'Cambridge', state: 'MA', marketId: 'market-boston' } }),
    prisma.school.upsert({ where: { id: 'school-harvard' }, update: {}, create: { id: 'school-harvard', name: 'Harvard University', city: 'Cambridge', state: 'MA', marketId: 'market-boston' } }),
    prisma.school.upsert({ where: { id: 'school-du' }, update: {}, create: { id: 'school-du', name: 'University of Denver', city: 'Denver', state: 'CO', marketId: 'market-denver' } }),
    prisma.school.upsert({ where: { id: 'school-georgetown' }, update: {}, create: { id: 'school-georgetown', name: 'Georgetown University', city: 'Washington', state: 'DC', marketId: 'market-dc' } }),
  ]);
  console.log(`✅ ${schools.length} schools seeded`);

  // ── Admin User ────────────────────────────────
  const adminPasswordHash = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'Admin@123456', 12);
  const admin = await prisma.user.upsert({
    where: { email: process.env.ADMIN_EMAIL || 'admin@beaapp.com' },
    update: {},
    create: {
      email: process.env.ADMIN_EMAIL || 'admin@beaapp.com',
      fullName: 'Bea Admin',
      passwordHash: adminPasswordHash,
      role: UserRole.ADMIN,
      referralCode: 'ADMIN001',
      emailVerifiedAt: new Date(),
      onboardingCompletedAt: new Date(),
    },
  });
  console.log(`✅ Admin user seeded: ${admin.email}`);

  // ── Competition ───────────────────────────────
  const competition = await prisma.competition.upsert({
    where: { id: 'comp-2024-fall' },
    update: {},
    create: {
      id: 'comp-2024-fall',
      title: 'Bea Fall 2024 Competition',
      description: 'The first Bea national competition. Win amazing prizes!',
      status: CompetitionStatus.ACTIVE,
      startDate: new Date('2024-09-01'),
      endDate: new Date('2024-12-01'),
      gracePeriodEndDate: new Date('2024-12-15'),
      scoringOpen: true,
    },
  });
  console.log(`✅ Competition seeded: ${competition.title}`);

  // ── Point Rules ───────────────────────────────
  await Promise.all([
    prisma.pointRule.upsert({ where: { name: 'WAITLIST_JOIN' }, update: {}, create: { name: 'WAITLIST_JOIN', description: 'Points for joining waitlist', sourceType: 'WAITLIST_JOIN', points: 10, category: PointCategory.PARTICIPATION } }),
    prisma.pointRule.upsert({ where: { name: 'DIRECT_REFERRAL' }, update: {}, create: { name: 'DIRECT_REFERRAL', description: 'Points per direct referral counted', sourceType: 'REFERRAL', points: 50, category: PointCategory.INVITE } }),
    prisma.pointRule.upsert({ where: { name: 'PROMPT_RESPONSE' }, update: {}, create: { name: 'PROMPT_RESPONSE', description: 'Points for responding to a prompt', sourceType: 'PROMPT', points: 20, category: PointCategory.PROMPT } }),
    prisma.pointRule.upsert({ where: { name: 'ONBOARDING_COMPLETE' }, update: {}, create: { name: 'ONBOARDING_COMPLETE', description: 'Points for completing onboarding', sourceType: 'ONBOARDING', points: 25, category: PointCategory.PARTICIPATION } }),
  ]);
  console.log('✅ Point rules seeded');

  // ── Rewards ───────────────────────────────────
  await Promise.all([
    prisma.reward.upsert({ where: { id: 'reward-beach-bundle' }, update: {}, create: { id: 'reward-beach-bundle', title: 'Beach Bundle', description: 'Premium beach bundle with Bea merch', rewardType: RewardType.PHYSICAL, unlockType: UnlockType.AUTOMATIC, audienceType: AudienceType.ALL, requiredInvites: 10, quantity: 50 } }),
    prisma.reward.upsert({ where: { id: 'reward-merch-pack' }, update: {}, create: { id: 'reward-merch-pack', title: 'Merch Pack', description: 'Exclusive Bea merchandise pack', rewardType: RewardType.PHYSICAL, unlockType: UnlockType.AUTOMATIC, audienceType: AudienceType.ALL, requiredInvites: 5, quantity: 200 } }),
    prisma.reward.upsert({ where: { id: 'reward-campus-champ' }, update: {}, create: { id: 'reward-campus-champ', title: 'Campus Champion Prize', description: 'Prize for top campus ambassador', rewardType: RewardType.EXPERIENCE, unlockType: UnlockType.RANKED, audienceType: AudienceType.AMBASSADOR, requiredRank: 1, quantity: 10 } }),
  ]);
  console.log('✅ Rewards seeded');

  // ── Calendar Events ───────────────────────────
  await Promise.all([
    prisma.calendarEvent.upsert({ where: { id: 'event-comp-start' }, update: {}, create: { id: 'event-comp-start', title: 'Competition Starts', description: 'The Fall 2024 Bea competition officially begins!', date: new Date('2024-09-01'), type: 'COMPETITION_START' } }),
    prisma.calendarEvent.upsert({ where: { id: 'event-comp-end' }, update: {}, create: { id: 'event-comp-end', title: 'Competition Ends', description: 'Last day to earn points and referrals', date: new Date('2024-12-01'), type: 'COMPETITION_END' } }),
    prisma.calendarEvent.upsert({ where: { id: 'event-prize-announce' }, update: {}, create: { id: 'event-prize-announce', title: 'Prize Announcement', description: 'Winners announced and prizes distributed', date: new Date('2024-12-15'), type: 'ANNOUNCEMENT' } }),
  ]);
  console.log('✅ Calendar events seeded');

  console.log('\n🎉 Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

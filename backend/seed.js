// ── HOW TO RUN: node seed.js ──────────────────────────────
const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');
require('dotenv').config();

const User         = require('./models/User.js');
const Event        = require('./models/Event.js');
const Registration = require('./models/Registration.js');
const Badge        = require('./models/Badge.js');

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Clear old data
    await User.deleteMany({});
    await Event.deleteMany({});
    await Registration.deleteMany({});
    await Badge.deleteMany({});
    console.log('🗑️  Cleared old data');

    // ── Admin user ────────────────────────────────────────
    const adminPass = await bcrypt.hash('admin@123', 10);
    const admin = await User.create({
      name: 'Admin User', email: 'admin@cvb.com',
      password: adminPass, phone: '9000000001',
      role: 'admin', eventsAttended: 0, badges: []
    });

    // ── Regular users ─────────────────────────────────────
    const pass = await bcrypt.hash('password123', 10);

    const user1 = await User.create({
      name: 'Riya Sharma', email: 'riya@cvb.com',
      password: pass, phone: '9876543210',
      role: 'user', eventsAttended: 3, badges: ['bronze','silver']
    });
    const user2 = await User.create({
      name: 'Arjun Mehta', email: 'arjun@cvb.com',
      password: pass, phone: '9876543211',
      role: 'user', eventsAttended: 1, badges: ['bronze']
    });
    const user3 = await User.create({
      name: 'Priya Patel', email: 'priya@cvb.com',
      password: pass, phone: '9876543212',
      role: 'user', eventsAttended: 0, badges: []
    });
    console.log('👥 4 users created');

    // ── Events ────────────────────────────────────────────
    const today = new Date();
    const days  = (n) => new Date(today.getTime() + n * 86400000);

    const e1 = await Event.create({
      title: 'Tree Plantation Drive',
      description: 'Join us to plant 500 trees at the city park. All equipment provided. Help us create a greener city for future generations.',
      date: days(3), location: 'City Central Park, Pune',
      maxParticipants: 50, currentParticipants: 18,
      createdBy: admin._id, status: 'upcoming'
    });
    const e2 = await Event.create({
      title: 'Blood Donation Camp',
      description: 'Donate blood and save lives. Medical staff on site. Refreshments provided. One donation can save up to 3 lives.',
      date: days(7), location: 'Government Hospital, Shivajinagar, Pune',
      maxParticipants: 30, currentParticipants: 12,
      createdBy: admin._id, status: 'upcoming'
    });
    const e3 = await Event.create({
      title: 'Beach Cleanup Drive',
      description: 'Help clean up Juhu Beach. Gloves and bags provided. Let us restore the beauty of our coastline together.',
      date: days(10), location: 'Juhu Beach, Mumbai',
      maxParticipants: 40, currentParticipants: 22,
      createdBy: admin._id, status: 'upcoming'
    });
    const e4 = await Event.create({
      title: 'Old Age Home Visit',
      description: 'Spend a meaningful afternoon with senior citizens. Bring games, stories, or musical talents. Every smile matters.',
      date: days(14), location: 'Seva Ashram, Kothrud, Pune',
      maxParticipants: 20, currentParticipants: 5,
      createdBy: admin._id, status: 'upcoming'
    });
    const e5 = await Event.create({
      title: 'Teach for Change',
      description: 'Teach basic computer skills to underprivileged children aged 10-14. No formal teaching experience required.',
      date: days(18), location: 'Community Centre, Hadapsar, Pune',
      maxParticipants: 15, currentParticipants: 3,
      createdBy: admin._id, status: 'upcoming'
    });
    const e6 = await Event.create({
      title: 'Park Cleanup (Completed)',
      description: 'Completed past event used for testing the badge system.',
      date: days(-5), location: 'Model Colony Park, Pune',
      maxParticipants: 30, currentParticipants: 25,
      createdBy: admin._id, status: 'completed'
    });
    console.log('📅 6 events created');

    // ── Registrations ─────────────────────────────────────
    await Registration.create({ userId: user1._id, eventId: e1._id, attended: true,  attendedAt: new Date() });
    await Registration.create({ userId: user1._id, eventId: e2._id, attended: true,  attendedAt: new Date() });
    await Registration.create({ userId: user1._id, eventId: e6._id, attended: true,  attendedAt: new Date() });
    await Registration.create({ userId: user2._id, eventId: e1._id, attended: true,  attendedAt: new Date() });
    await Registration.create({ userId: user3._id, eventId: e4._id, attended: false });
    console.log('📋 5 registrations created');

    // ── Badges ────────────────────────────────────────────
    await Badge.create({ userId: user1._id, badgeType: 'bronze', eventsCountAtAward: 1 });
    await Badge.create({ userId: user1._id, badgeType: 'silver', eventsCountAtAward: 3 });
    await Badge.create({ userId: user2._id, badgeType: 'bronze', eventsCountAtAward: 1 });
    console.log('🏅 3 badges created');

    console.log('\n============================================');
    console.log('✅ SEED COMPLETE!');
    console.log('============================================');
    console.log('ADMIN     → admin@cvb.com   | admin@123');
    console.log('USER 1    → riya@cvb.com    | password123  (Silver badge)');
    console.log('USER 2    → arjun@cvb.com   | password123  (Bronze badge)');
    console.log('USER 3    → priya@cvb.com   | password123  (No badge yet)');
    console.log('============================================\n');

    mongoose.connection.close();
  } catch (err) {
    console.error('❌ Seed error:', err);
    mongoose.connection.close();
  }
}

seedDatabase();
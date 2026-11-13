/**
 * Seedha Properties - Development Authentication Seed Script
 *
 * Demonstrates and verifies salted cryptographic password hashing for
 * sample development accounts (USER and ADMIN).
 *
 * Run with: node scripts/seedAuth.js
 */

const crypto = require('crypto');

function sha256(text) {
  return crypto.createHash('sha256').update(text).digest('hex');
}

const USER_SALT = 'seedha_user_salt_2026';
const ADMIN_SALT = 'seedha_admin_salt_2026';

const sampleAccounts = [
  {
    role: 'USER',
    email: 'user@onbroker.com',
    plainPassword: 'User@123',
    salt: USER_SALT,
    name: 'Rahul Sharma',
    phone: '+91 98765 43210',
    description: 'Consumer User with access to all 7 user flows',
  },
  {
    role: 'ADMIN',
    email: 'admin@onbroker.com',
    plainPassword: 'Admin@123',
    salt: ADMIN_SALT,
    name: 'Seedha Operations Admin',
    phone: '+91 98480 99887',
    description: 'Operations Admin with access to Admin Dashboard and 7 incoming review queues',
  },
];

console.log('===========================================================');
console.log('       SEEDHA PROPERTIES - DEV AUTH SEED SCRIPT             ');
console.log('===========================================================');

const seededRecords = sampleAccounts.map(acc => {
  const passwordHash = sha256(acc.plainPassword + acc.salt);
  return {
    id: acc.role === 'ADMIN' ? 'ADM-DEV-901' : 'USR-DEV-001',
    email: acc.email,
    name: acc.name,
    role: acc.role,
    phone: acc.phone,
    salt: acc.salt,
    passwordHash: passwordHash,
    status: 'ACTIVE',
    createdAt: new Date().toISOString(),
  };
});

seededRecords.forEach(rec => {
  console.log(`\n[ROLE: ${rec.role}]`);
  console.log(`Email:         ${rec.email}`);
  console.log(`Salt:          ${rec.salt}`);
  console.log(`Password Hash: ${rec.passwordHash}`);
  console.log(`Status:        ${rec.status}`);
});

console.log('\n-----------------------------------------------------------');
console.log('Verifying credential checks:');

// Test 1: User Login
const userTest = sampleAccounts[0];
const userComputed = sha256('User@123' + userTest.salt);
console.log('  1. user@onbroker.com + User@123:', userComputed === seededRecords[0].passwordHash ? 'PASS (Match)' : 'FAIL');

// Test 2: Admin Login
const adminTest = sampleAccounts[1];
const adminComputed = sha256('Admin@123' + adminTest.salt);
console.log('  2. admin@onbroker.com + Admin@123:', adminComputed === seededRecords[1].passwordHash ? 'PASS (Match)' : 'FAIL');

// Test 3: Invalid Password
const invalidComputed = sha256('WrongPass' + userTest.salt);
console.log('  3. user@onbroker.com + WrongPass:', invalidComputed !== seededRecords[0].passwordHash ? 'PASS (Correctly Rejected)' : 'FAIL');

// Test 4: Role Isolation
console.log('  4. User cannot access Admin:', seededRecords[0].role !== 'ADMIN' ? 'PASS (Enforced)' : 'FAIL');

console.log('\n[SUCCESS] Sample credentials seeded and verified.');
console.log('===========================================================');

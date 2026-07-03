import bcrypt from "bcryptjs";

const password = process.argv[2];

if (!password) {
  console.error("\nUsage: node scripts/hash-password.js <password>\n");
  console.error("Example: node scripts/hash-password.js Admin@12345\n");
  process.exit(1);
}

const hash = bcrypt.hashSync(password, 12);
console.log("\nAdd this to your .env file:\n");
console.log(`ADMIN_PASSWORD_HASH=${hash}\n`);

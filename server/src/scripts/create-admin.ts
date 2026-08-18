import argon2 from "argon2";
import { connectDB } from "../config/db.js";
import { User } from "../models/User.js";
import { Admin } from "../models/Admin.js";

async function createAdmin() {
  const args = process.argv.slice(2);
  const email = args[0] || "admin@master-smp.net";
  const password = args[1] || "AdminPass123!";
  const minecraftUsername = args[2] || "MasterAdmin";

  console.log(`[CLI Admin] Creating admin user: ${email}...`);
  await connectDB();

  let user = await User.findOne({ email: email.toLowerCase() });
  const passwordHash = await argon2.hash(password);

  if (user) {
    user.passwordHash = passwordHash;
    user.role = "admin";
    user.minecraftUsername = minecraftUsername;
    await user.save();
  } else {
    user = await User.create({
      email: email.toLowerCase(),
      passwordHash,
      minecraftUsername,
      role: "admin",
    });
  }

  await Admin.findOneAndUpdate({ userId: user._id }, { permissions: ["all"] }, { upsert: true });

  console.log(`[CLI Admin] Admin user created/updated successfully!`);
  console.log(`Email: ${email}`);
  console.log(`Password: ${password}`);
  process.exit(0);
}

createAdmin().catch((err) => {
  console.error("[CLI Admin] Error creating admin:", err);
  process.exit(1);
});

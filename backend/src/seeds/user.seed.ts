import "dotenv/config";

import mongoose from "mongoose";

import User from "../models/user.model.js";
import { connectDB } from "../lib/db.js";
import { auth } from "../lib/auth.js";

const seedUsers = [
  ["Alex Chen", "alex.chen@example.com", "https://i.pravatar.cc/150?img=1"],
  ["Sam Taylor", "sam.taylor@example.com", "https://i.pravatar.cc/150?img=2"],
  ["Jordan Lee", "jordan.lee@example.com", "https://i.pravatar.cc/150?img=3"],
  ["Maya Patel", "maya.patel@example.com", "https://i.pravatar.cc/150?img=4"],
  ["Casey Morgan", "casey.morgan@example.com", "https://i.pravatar.cc/150?img=5"],
  ["Riley Kim", "riley.kim@example.com", "https://i.pravatar.cc/150?img=6"],
  ["Taylor Brooks", "taylor.brooks@example.com", "https://i.pravatar.cc/150?img=7"],
  ["Jamie Wilson", "jamie.wilson@example.com", "https://i.pravatar.cc/150?img=8"],
  ["Morgan Reed", "morgan.reed@example.com", "https://i.pravatar.cc/150?img=9"],
  ["Avery Scott", "avery.scott@example.com", "https://i.pravatar.cc/150?img=10"],
  ["Quinn Parker", "quinn.parker@example.com", "https://i.pravatar.cc/150?img=11"],
  ["Drew Hayes", "drew.hayes@example.com", "https://i.pravatar.cc/150?img=12"],
  ["Skyler Evans", "skyler.evans@example.com", "https://i.pravatar.cc/150?img=13"],
  ["Harper Lane", "harper.lane@example.com", "https://i.pravatar.cc/150?img=14"],
  ["Charlie Bennett", "charlie.bennett@example.com", "https://i.pravatar.cc/150?img=15"],
  ["Emerson Gray", "emerson.gray@example.com", "https://i.pravatar.cc/16"],
  ["Finley Price", "finley.price@example.com", "https://i.pravatar.cc/150?img=17"],
  ["Rowan Blake", "rowan.blake@example.com", "https://i.pravatar.cc/150?img=18"],
  ["Sage Cooper", "sage.cooper@example.com", "https://i.pravatar.cc/150?img=19"],
  ["Reese Carter", "reese.carter@example.com", "https://i.pravatar.cc/150?img=20"],
];

async function seedDatabase() {
  await connectDB();

  let insertedCount = 0;
  let updatedCount = 0;

  for (const [name, email, image] of seedUsers) {
    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      const result = await auth.api.signUpEmail({
        body: {
          email,
          password: "password123",
          name,
          image,
        },
      });

      if (result && result.user) {
        await User.updateOne(
          { email },
          {
            $set: {
              fullName: name,
              profilePic: image,
              emailVerified: true,
            },
          }
        );
        insertedCount++;
      }
    } else {
      await User.updateOne(
        { email },
        {
          $set: {
            name,
            image,
            fullName: name,
            profilePic: image,
            emailVerified: true,
          },
        }
      );
      updatedCount++;
    }
  }

  console.log(`Seeded users. Registered/Inserted: ${insertedCount}, updated: ${updatedCount}`);
}

seedDatabase()
  .catch((error) => {
    console.error("Failed to seed users:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.connection.close();
  });
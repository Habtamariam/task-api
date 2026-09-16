// Import Argon2 for secure, one-way password hashing.
import argon2 from "argon2";
// Import JWT signing for issuing login tokens.
import jwt, { type SignOptions } from "jsonwebtoken";
// Import Drizzle's equality helper for finding a user by email.
import { eq } from "drizzle-orm";
// Import the database client used to insert the new account.
import { db } from "../db/client.js";
// Import the users table definition.
import { users } from "../db/schema.js";

// Register a user by hashing the password before storing the account.
export const registerUser = async (email: string, password: string) => {
  // Argon2id resists password cracking and side-channel attacks.
  const hashed = await argon2.hash(password, {
    type: argon2.argon2id,
  });

  // Insert only the email and irreversible hash into the database.
  const [user] = await db
    .insert(users)
    .values({ email, password: hashed })
    // Return safe fields only; never expose the password hash in a response.
    .returning({ id: users.id, email: users.email });

  // Return the public user data created by PostgreSQL.
  return user;
};

// Find a user while retaining the password hash for verification.
const findUserByEmail = async (email: string) => {
  const [user] = await db.select().from(users).where(eq(users.email, email));
  return user;
};

// Verify credentials and return a signed JWT when they are correct.
export const loginUser = async (email: string, password: string) => {
  // Look up the account by email without revealing whether it exists.
  const user = await findUserByEmail(email);

  // Use the same generic failure result for an unknown email or wrong password.
  if (!user) {
    return null;
  }

  // Argon2 verifies the password against the stored hash; it never decrypts it.
  const valid = await argon2.verify(user.password, password);

  if (!valid) {
    return null;
  }

  // The signing key must exist and must never be exposed to clients.
  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    throw new Error("JWT_SECRET is not configured");
  }

  // Keep the token payload small; JWT payloads are signed, not encrypted.
  const expiresIn = process.env.JWT_EXPIRES_IN;
  const options: SignOptions = {
    expiresIn: expiresIn ? (expiresIn as SignOptions["expiresIn"]) : "1h",
  };

  // Create a token that proves the authenticated user's identity.
  return jwt.sign({ userId: user.id }, jwtSecret, options);
};

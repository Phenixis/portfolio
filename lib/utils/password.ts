import bcrypt from 'bcryptjs'

const SALT_ROUNDS = 10

/**
 * Hash a password using bcrypt
 * @param password The plain text password to hash
 * @returns Promise<string> The hashed password
 */
export async function hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, SALT_ROUNDS)
}

/**
 * Compare a plain text password with a hash
 * @param password The plain text password to check
 * @param hash The hash to compare against
 * @returns Promise<boolean> True if the password matches the hash
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash)
} 
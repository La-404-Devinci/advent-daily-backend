import { compareSync, hashSync } from "bcrypt";

export default abstract class CypherController {
    /**
     * Hashes a password using bcrypt
     * @param password The password to hash
     * @returns The hashed password
     */
    public static hashPassword(password: string): string {
        return hashSync(password, 10);
    }

    /**
     * Verifies a password using bcrypt
     * @param password The password to verify
     * @param hash The hash of the password
     * @returns True if the password is valid, false otherwise
     */
    public static verifyPassword(password: string, hash: string): boolean {
        return compareSync(password, hash);
    }
}

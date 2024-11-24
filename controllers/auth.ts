import globals from "@/env/env";
import { sign, verify } from "jsonwebtoken";

export default abstract class AuthController {
    public static fakeTime = false;

    /**
     * Creates a creation token for a specific email, which can be used to create a user.
     * The token is valid for 15 minutes.
     * @param email The email of the user
     * @returns The creation token
     */
    public static generateCreationToken(email: string, shouldExpire = true): string {
        return sign(
            { email: email, type: "creation" },
            globals.env.JWT_SECRET,
            shouldExpire ? { expiresIn: "15m" } : undefined
        );
    }

    /**
     * Validates a creation token
     * @param token The token to validate
     * @returns The email of the user or null if the token is invalid
     */
    public static validateCreationToken(token: string): string | null {
        try {
            const email = verify(token, globals.env.JWT_SECRET) as { email: string; type: string };
            if (email.type !== "creation") return null;
            return email.email || null;
        } catch {
            return null;
        }
    }

    /**
     * Creates an authentication token for a specific email
     * @param email The email of the user
     * @returns The authentication token
     */
    public static generateAuthToken(email: string): string {
        return sign({ email: email, type: "auth" }, globals.env.JWT_SECRET);
    }

    /**
     * Validates an authentication token
     * @param token The token to validate
     * @returns The email of the user or null if the token is invalid
     */
    public static validateAuthToken(token: string): string | null {
        try {
            const email = verify(token, globals.env.JWT_SECRET) as { email: string; type: string };
            if (email.type !== "auth") return null;
            return email.email || null;
        } catch {
            return null;
        }
    }

    /**
     * Creates an authentication token for a granter user
     * @param email The email of the user
     * @returns The authentication token
     */
    public static generateGranterAuthToken(email: string): string {
        return sign({ email: email, type: "granters" }, globals.env.JWT_SECRET);
    }

    /**
     * Validates an authentication token
     * @param token The token to validate
     * @returns The email of the user or null if the token is invalid
     */
    public static validateGranterAuthToken(token: string): string | null {
        try {
            const email = verify(token, globals.env.JWT_SECRET) as { email: string; type: string };
            if (email.type !== "granters") return null;
            return email.email || null;
        } catch {
            return null;
        }
    }
}

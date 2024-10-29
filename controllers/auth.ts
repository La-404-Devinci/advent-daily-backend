import globals from "@/env/env";
import * as jwt from "jsonwebtoken";

export default abstract class AuthController {
    /**
     * Creates a creation token for a specific email, which can be used to create a user.
     * The token is valid for 15 minutes.
     * @param email The email of the user
     * @returns The creation token
     */
    public static generateCreationToken(email: string): string {
        return jwt.sign(email, globals.env.JWT_SECRET, { expiresIn: "15m" });
    }

    public static validateCreationToken(token: string): string | null {
        try {
            const email = jwt.verify(token, globals.env.JWT_SECRET);
            return typeof email === "string" ? email : null;
        } catch {
            return null;
        }
    }
}

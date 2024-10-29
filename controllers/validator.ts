export default class ValidatorController {
    /**
     * Validates a password
     * - It must be at least 8 characters long
     * - It must contain at least one uppercase letter
     * - It must contain at least one lowercase letter
     * - It must contain at least one number
     * - It must contain at least one special character
     * @param password The password to validate
     * @returns True if the password is valid, false otherwise
     */
    public static validatePassword(password: string): boolean {
        return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password);
    }

    /**
     * Validates a username
     * - It must be at least 3 characters long
     * - It can contain letters (upper and lower case)
     * - It can contain numbers
     * - It can contain specific characters (-_.)
     * - It can contain spaces
     * - It cannot contain any other characters
     * @param username The username to validate
     * @returns True if the username is valid, false otherwise
     */
    public static validateUsername(username: string): boolean {
        if (username.trim() !== username) return false;
        return /^[-_. a-zA-Z0-9]{3,}$/.test(username);
    }
}

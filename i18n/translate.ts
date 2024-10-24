import Logger from "../log/logger";
import langs from "./langs";

export default function t(lang: string, key: string, replacements?: Record<string, string>): string {
    const keys = key.split(".");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const language = (langs as any)[lang];

    try {
        let translation = keys.reduce((acc, key) => {
            return acc[key];
        }, language);

        if (!translation) throw new Error();

        // Apply placeholders
        if (replacements) {
            Object.entries(replacements).forEach(([key, value]) => {
                translation = translation.replace(`{${key}}`, value);
            });
        }

        return translation;
    } catch {
        Logger.warn(`translate.ts::t | Translation for key ${key} not found in language ${lang}`);
        return key;
    }
}

import { Response, NextFunction, Request } from "express";
import langs from "../i18n/langs";
import Logger from "../log/logger";

export default function middlewareI18n(req: Request, res: Response, next: NextFunction) {
    const clientLocales = [
        req.cookies["lang"], // First, check if the user has a cookie set
        ...req.acceptsLanguages() // Then, check the Accept-Language langs
    ];

    const locale = clientLocales
        // Remove undefined values
        .filter((locale) => locale)
        // Transform locales (en-US) to languages (en)
        .map((locale) => locale.split("-")[0])
        // Find the first language that is supported
        .find((locale) => locale in langs || locale === "*");

    if (!locale) {
        Logger.warn("i18n.ts::middlewareI18n | No supported language found in client locales", clientLocales);
    }

    const language = locale === "*" ? "en" : locale;

    // Set the language for the request
    req.lang = language || "en";
    res.header("Content-Language", language || "en");

    next();
}

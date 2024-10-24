import t from "@/i18n/translate";
import Logger from "@/log/logger";
import type { NextFunction, Request } from "express";

export interface StatusPayload {
    status: number;
    error?: string;
    data?: unknown;
}

export interface GeneratedStatusPayload extends StatusPayload {
    success: boolean;
    translatedError?: string;
}

export interface Payload {
    masterStatus: number;
    sentAt: number;
    response: GeneratedStatusPayload[];
}

export default class Status {
    public static send(req: Request, next: NextFunction, status: StatusPayload | StatusPayload[]) {
        const statusList = Array.isArray(status) ? status : [status];
        const lang = req.lang;

        const response = statusList.map((s) => Status.generatePayload(lang, s));
        const hasSameStatus = response.every((r) => r.status === response[0].status);
        const masterStatus = hasSameStatus ? response[0].status : 207;

        next({
            masterStatus,
            sentAt: Date.now(),
            response
        });
    }

    public static generatePayload(lang: string, payload: StatusPayload): GeneratedStatusPayload {
        if (payload.error && payload.status < 400) {
            Logger.warn("status.ts::generatePayload | Returning success status with error", payload);
        }

        if (!payload.error && payload.status >= 500) {
            Logger.warn("status.ts::generatePayload | Returning error status without error", payload);
        }

        return {
            ...payload,
            success: !payload.error,
            translatedError: payload.error ? t(lang, payload.error) : undefined
        };
    }
}

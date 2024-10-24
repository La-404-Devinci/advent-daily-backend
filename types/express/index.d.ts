export {};

declare global {
    namespace Express {
        interface Request {
            uuid: string;
            receivedAt: number;
            lang: string;
        }
    }
}

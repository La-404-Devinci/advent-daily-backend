export {};

declare global {
    namespace Express {
        interface Request {
            uuid: string;
            receivedAt: number;
            lang: string;
            user?: {
                uuid: string;
                email: string;
            };
            granters?: {
                id: number;
                email: string;
                clubId: number;
            };
        }
    }
}

// export interface ClientToServerEvents {}

import { Server } from "socket.io";
import { EventsMap } from "socket.io/dist/typed-events";

export enum InvalidationSubject {
    LEADERBOARD = "leaderboard"
}

export interface ServerToClientEvents {
    invalidate: (subject: InvalidationSubject) => void;
    notification: (title: string, message: string, iconUrl?: string) => void;
}

// Set "EventsMap" as default type
export type TypedServer = Server<EventsMap, ServerToClientEvents, EventsMap, EventsMap>;

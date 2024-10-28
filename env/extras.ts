import { z } from "zod";

export const zboolean = () => z.enum(["true", "false"]).transform((val) => val === "true");

export const znumber = () =>
    z
        .string()
        .regex(/^[0-9]+$/)
        .transform((val) => parseInt(val));

export const zdate = () =>
    z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/)
        .transform((val) => new Date(val));

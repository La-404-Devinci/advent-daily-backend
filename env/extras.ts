import { z } from "zod";

export const zboolean = () => z.enum(["true", "false"]).transform((val) => val === "true");

export const znumber = () =>
    z
        .string()
        .regex(/^[0-9]+$/)
        .transform((val) => parseInt(val));

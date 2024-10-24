import { TypeOf } from "zod";
import { envSchema } from "./schema";

export default class globals {
    static env: TypeOf<typeof envSchema>;
}

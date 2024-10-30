import "tsconfig-paths/register";
import init from "@/init";

export default async () => {
    globalThis.__TEARDOWN_FUNC__ = await init();
};

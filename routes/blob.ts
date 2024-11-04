import s3 from "@/database/s3";
import Status from "@/models/status";
import { NextFunction, Request, Response } from "express";
import { z } from "zod";

const params = z.object({
    hash: z.string()
});

export default async function Route_Blob_Read(req: Request, res: Response, next: NextFunction) {
    const payload = params.safeParse(req.params);
    if (!payload.success) {
        return Status.send(req, next, {
            status: 400,
            error: "errors.validation"
        });
    }

    const data = await s3.getImage(payload.data.hash);

    if (!data) {
        return Status.send(req, next, {
            status: 404,
            error: "errors.notFound"
        });
    }

    return Status.send(req, next, {
        status: 200,
        data: data
    });
}

import globals from "@/env/env";
import Logger from "@/log/logger";
import compress from "@/utils/compress";
import { randomUUID } from "crypto";
import { Client } from "minio";
import internal from "stream";

export default abstract class S3 {
    public static client: Client;

    public static init() {
        S3.client = new Client({
            endPoint: globals.env.MINIO_HOST,
            port: globals.env.MINIO_PORT,
            useSSL: false,
            accessKey: globals.env.MINIO_ROOT_USER,
            secretKey: globals.env.MINIO_ROOT_PASSWORD,
            pathStyle: true
        });

        S3.client
            .bucketExists(globals.env.MINIO_DEFAULT_BUCKETS)
            .then(
                (exists) =>
                    !exists &&
                    Logger.error(`s3.ts::init | Default bucket ${globals.env.MINIO_DEFAULT_BUCKETS} does not exist`)
            );
    }

    /**
     * Uploads a compressed image to Minio as a base64 string.
     * @param {Blob} data The image data.
     * @param {string} path The path to upload the image to.
     */
    public static async putImage(data: Blob, options?: { path?: string; creator?: string }): Promise<string | null> {
        try {
            const imagePath = options?.path ?? randomUUID();

            const compressedData = await compress(data);
            const buffer = Buffer.from(compressedData, "base64");
            await S3.client.putObject(globals.env.MINIO_DEFAULT_BUCKETS, imagePath, buffer, compressedData.length, {
                "Content-Type": "application/octet-stream",
                "Last-Modified": new Date().toUTCString(),
                "x-amz-acl": "public-read",
                "x-amz-meta-creator": options?.creator
            });

            return imagePath;
        } catch (err) {
            Logger.error("s3.ts::putImage | Error compressing image", err);
            return null;
        }
    }

    /**
     * Gets a base64 image.
     * @param {string} path
     * @returns {Promise<string | null>}
     */
    public static async getImage(path: string): Promise<string | null> {
        const data: internal.Readable = await S3.client.getObject(globals.env.MINIO_DEFAULT_BUCKETS, path);
        if (!data) return null;

        const buffer = await new Promise<Buffer>((resolve, reject) => {
            const chunks: Buffer[] = [];
            data.on("data", (chunk: Buffer) => {
                chunks.push(chunk);
            })
                .on("end", () => {
                    resolve(Buffer.concat(chunks));
                })
                .on("error", (err) => {
                    reject(err);
                });
        });

        return buffer.toString("base64");
    }

    /**
     * @description Deletes an image from the S3 bucket.
     * @param {string} path The path of the image to delete.
     */
    public static async deleteImage(path: string) {
        await S3.client.removeObject(globals.env.MINIO_DEFAULT_BUCKETS, path);
    }
}

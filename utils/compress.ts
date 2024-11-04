import sharp from "sharp";

const compress: (data: string) => Promise<string> = async (data) => {
    const inputBuffer = Buffer.from(data, "base64");

    const outputBuffer = await sharp(inputBuffer)
        .resize(512, 512, {
            fit: "cover",
            position: "center"
        })
        .jpeg({ quality: 60, force: true })
        .toFormat("jpeg")
        .toBuffer();

    return outputBuffer.toString("base64");
};

export default compress;

import Compressor from "compressorjs";

const compress: (data: Blob) => Promise<string> = async (data: Blob) => {
    return new Promise((resolve, reject) => {
        new Compressor(data, {
            quality: 0.6,
            maxHeight: 512,
            maxWidth: 512,
            height: 512,
            width: 512,
            resize: "cover",
            convertTypes: "image/webp",
            success(result) {
                result
                    .text()
                    .then((text) => {
                        resolve(text);
                    })
                    .catch((err) => {
                        reject(err);
                    });
            },
            error(err) {
                reject(err);
            }
        });
    });
};

export default compress;

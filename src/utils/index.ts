interface IBufferToB64 {
  buffer: Buffer;
  imageType: string;
}

export const bufferToB64 = (value: IBufferToB64) => {
  try {
    const b64 = Buffer.from(value.buffer).toString('base64');

    const mimeType = `image/${value.imageType}`; // e.g., image/png

    return `data:${mimeType};base64,${b64}`;
  } catch (error) {
    console.log(error);
  }
};

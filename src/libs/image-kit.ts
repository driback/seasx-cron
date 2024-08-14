import ImageKit from "imagekit";

import type { ImageKitOptions } from "imagekit/dist/libs/interfaces";

const imageKitConfig: ImageKitOptions = {
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY!,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT!,
};

const imageKit = new ImageKit(imageKitConfig);

const isValidImage = async (source: string, output?: string) => {
  const res = await fetch(source);

  if (res.status !== 200) return output ?? "https://placehold.co/480x270?text=THUMBNAIL";

  return source;
};

type UploadImageProps = {
  file: string;
  folder: string;
  fileName: string;
};

export const uploadImage = async ({ file, fileName, folder }: UploadImageProps) => {
  const image = await isValidImage(file);

  const res = await imageKit.upload({
    file: image,
    folder,
    fileName,
  });

  return res;
};

// const deleteImage = async (fileId: string) => {
//   const res = await imageKit.deleteFile(fileId);
//   return res;
// };

// const deleteImageFolder = async (folderpath: string) => {
//   const res = await imageKit.deleteFolder(folderpath);
//   return res;
// };

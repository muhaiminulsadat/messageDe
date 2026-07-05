import ImageKit, {toFile} from "@imagekit/nodejs";

const imagekit = new ImageKit({
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY || "",
});

export function hasImageKitConfig(): boolean {
  return Boolean(process.env.IMAGEKIT_PRIVATE_KEY);
}

// Converts original filename to safe, unique format: chat-[timestamp]-[filename]
function createFileName(originalName: string = "upload"): string {
  const safeName = originalName.replace(/[^a-zA-Z0-9._-]/g, "_");
  return `chat-${Date.now()}-${safeName}`;
}

export interface UploadedFile {
  originalname: string;
  buffer: Buffer;
  mimetype: string;
}

export async function uploadChatMedia(file: UploadedFile): Promise<string> {
  const fileName = createFileName(file.originalname);

  const result = await imagekit.files.upload({
    file: await toFile(file.buffer, fileName, {type: file.mimetype}),
    fileName,
    folder: "/messageDe/Chat",
  });

  if (!result.url) {
    throw new Error("Upload failed: ImageKit did not return a URL.");
  }

  return result.url;
}

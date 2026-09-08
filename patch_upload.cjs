const fs = require("fs");
let code = fs.readFileSync("src/lib/bio.ts", "utf8");

const regex = /export async function uploadMedia\([\s\S]*?\n\}/m;

const replacement = `export async function uploadMedia(
  userId: string,
  file: File,
  folder: string,
  onProgress?: (progress: number) => void,
): Promise<string> {
  // Support background video uploads up to 1MB
  if (file.type.startsWith("video/")) {
    if (file.size > 1 * 1024 * 1024) {
      throw new Error(
        "Uploaded video clip exceeds 1MB. Please select a video file under 1MB.",
      );
    }
  }

  // Guard audio size
  if (file.type.startsWith("audio/")) {
    if (file.size > 15 * 1024 * 1024) {
      throw new Error(
        "Audio file exceeds 15MB. For full songs, please paste a direct audio URL.",
      );
    }
  }

  try {
    const { ref, uploadBytesResumable, getDownloadURL } = await import("firebase/storage");
    const { storage } = await import("./firebase");

    const fileExt = file.name.split(".").pop();
    const fileName = \`\${crypto.randomUUID()}.\${fileExt}\`;
    const filePath = \`\${folder}/\${userId}/\${fileName}\`;
    
    const storageRef = ref(storage, filePath);
    const uploadTask = uploadBytesResumable(storageRef, file);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          if (onProgress) onProgress(progress);
        },
        (error) => {
          reject(new Error("Failed to upload media to Firebase Storage"));
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(downloadURL);
        }
      );
    });
  } catch (err: any) {
    throw new Error(err.message || "Failed to upload media");
  }
}`;

code = code.replace(regex, replacement);

fs.writeFileSync("src/lib/bio.ts", code);

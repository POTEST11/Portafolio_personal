import { adminFetch } from "./client";

interface UploadSignature {
  timestamp: number;
  signature: string;
  api_key: string;
  cloud_name: string;
}

export async function uploadImage(file: File): Promise<string> {
  const sigResponse = await adminFetch("/upload/signature");
  if (!sigResponse.ok) {
    throw new Error("Failed to get upload permission.");
  }
  const sig: UploadSignature = await sigResponse.json();

  const formData = new FormData();
  formData.append("file", file);
  formData.append("api_key", sig.api_key);
  formData.append("timestamp", String(sig.timestamp));
  formData.append("signature", sig.signature);

  const uploadResponse = await fetch(
    `https://api.cloudinary.com/v1_1/${sig.cloud_name}/image/upload`,
    { method: "POST", body: formData }
  );

  if (!uploadResponse.ok) {
    throw new Error("Image upload failed.");
  }

  const result = await uploadResponse.json();
  return result.secure_url as string;
}
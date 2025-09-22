import { S3Client, PutObjectCommand, DeleteObjectCommand, ListObjectsV2Command } from '@aws-sdk/client-s3';

// Funkcja do utworzenia klienta R2 (dynamicznie)
function createR2Client() {
  return new S3Client({
    region: 'auto',
    endpoint: process.env.R2_ENDPOINT,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID!,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
    },
    forcePathStyle: true,
    requestHandler: {
      requestTimeout: 30000, // 30 sekund zamiast domyślnych 120s
      connectionTimeout: 10000, // 10 sekund na połączenie
    },
  });
}

export interface UploadResult {
  success: boolean;
  url?: string;
  key?: string;
  error?: string;
}

export async function uploadToR2(
  file: Buffer,
  key: string,
  contentType: string = 'application/octet-stream'
): Promise<UploadResult> {
  try {
    const r2Client = createR2Client();
    
    const command = new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME!,
      Key: key,
      Body: file,
      ContentType: contentType,
    });

    await r2Client.send(command);
    
    const url = `${process.env.R2_PUBLIC_URL}/${key}`;
    
    return {
      success: true,
      url,
      key,
    };
  } catch (error) {
    console.error('Błąd podczas uploadu do R2:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Nieznany błąd',
    };
  }
}

export async function deleteFromR2(key: string): Promise<boolean> {
  try {
    const r2Client = createR2Client();
    
    const command = new DeleteObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME!,
      Key: key,
    });

    await r2Client.send(command);
    return true;
  } catch (error) {
    console.error('Błąd podczas usywania z R2:', error);
    return false;
  }
}

export async function listR2Objects(prefix?: string): Promise<string[]> {
  try {
    const r2Client = createR2Client();
    
    const command = new ListObjectsV2Command({
      Bucket: process.env.R2_BUCKET_NAME!,
      Prefix: prefix,
    });

    const response = await r2Client.send(command);
    return response.Contents?.map(obj => obj.Key!) || [];
  } catch (error) {
    console.error('Błąd podczas listowania obiektów R2:', error);
    return [];
  }
}

export function getR2Url(key: string): string {
  return `${process.env.R2_PUBLIC_URL}/${key}`;
}
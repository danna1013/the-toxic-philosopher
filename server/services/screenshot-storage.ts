import { kv } from '@vercel/kv';
import fs from 'node:fs';
import { promises as fsPromises } from 'node:fs';
import path from 'node:path';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const LOCAL_UPLOAD_DIR = path.join(__dirname, '../data/uploads');
const isVercel = process.env.VERCEL === '1' || process.env.KV_REST_API_URL !== undefined;

interface KvScreenshotPayload {
  data: string;
  mimeType: string;
  uploadedAt: string;
}

function ensureLocalUploadDir() {
  if (!fs.existsSync(LOCAL_UPLOAD_DIR)) {
    fs.mkdirSync(LOCAL_UPLOAD_DIR, { recursive: true });
  }
}

function resolveMimeType(fileName: string): string {
  const ext = path.extname(fileName).toLowerCase();

  switch (ext) {
    case '.jpg':
    case '.jpeg':
      return 'image/jpeg';
    case '.gif':
      return 'image/gif';
    case '.webp':
      return 'image/webp';
    case '.png':
    default:
      return 'image/png';
  }
}

function generateFileName(originalName: string): string {
  const ext = path.extname(originalName) || '.png';
  const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
  return `screenshot_${uniqueSuffix}${ext}`;
}

export async function persistScreenshot(buffer: Buffer, originalName: string) {
  const fileName = generateFileName(originalName);
  const mimeType = resolveMimeType(fileName);

  if (isVercel) {
    const key = `screenshot:${fileName}`;
    const payload: KvScreenshotPayload = {
      data: buffer.toString('base64'),
      mimeType,
      uploadedAt: new Date().toISOString(),
    };

    await kv.set(key, payload, { ex: 60 * 60 * 24 * 30 });

    return {
      reference: `kv:${fileName}`,
      fileName,
      mimeType,
    };
  }

  ensureLocalUploadDir();
  const filePath = path.join(LOCAL_UPLOAD_DIR, fileName);
  await fsPromises.writeFile(filePath, buffer);

  return {
    reference: `file:${fileName}`,
    fileName,
    mimeType,
    filePath,
  };
}

export async function loadScreenshot(reference: string) {
  if (!reference) {
    return null;
  }

  if (reference.startsWith('kv:')) {
    const fileName = reference.slice(3);
    const key = `screenshot:${fileName}`;
    const payload = await kv.get<KvScreenshotPayload>(key);

    if (!payload) {
      return null;
    }

    return {
      buffer: Buffer.from(payload.data, 'base64'),
      mimeType: payload.mimeType || resolveMimeType(fileName),
      fileName,
    };
  }

  const fileName = reference.startsWith('file:') ? reference.slice(5) : reference;
  const filePath = path.join(LOCAL_UPLOAD_DIR, fileName);

  if (!fs.existsSync(filePath)) {
    return null;
  }

  const buffer = await fsPromises.readFile(filePath);

  return {
    buffer,
    mimeType: resolveMimeType(fileName),
    fileName,
  };
}

export async function deleteScreenshot(reference: string) {
  if (!reference) {
    return;
  }

  if (reference.startsWith('kv:')) {
    const fileName = reference.slice(3);
    const key = `screenshot:${fileName}`;
    await kv.del(key);
    return;
  }

  const fileName = reference.startsWith('file:') ? reference.slice(5) : reference;
  const filePath = path.join(LOCAL_UPLOAD_DIR, fileName);

  try {
    await fsPromises.unlink(filePath);
  } catch (error) {
    // Ignore unlink errors for local storage
  }
}

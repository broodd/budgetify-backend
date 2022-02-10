import * as crypto from 'crypto';
import * as stream from 'stream';
import * as fs from 'fs';

import { ConfigService } from 'src/config';

const configService = new ConfigService();

export interface CreateMockFileReturn {
  filename: string;
  encoding: string;
  mimetype: string;
  filePath: string;
  buffer: Buffer;
  file?: stream.Readable;
}

export function createMockFileMeta(data?: Partial<CreateMockFileReturn>): CreateMockFileReturn {
  const filename = crypto.randomBytes(8).toString('hex') + '.png';
  const filePath = configService.getDest('STORE_DEST', filename);
  const encoding = '7bit';
  const mimetype = 'image/png';
  const buffer = crypto.randomBytes(64);
  const file = stream.Readable.from(buffer.toString());
  return Object.assign({ filename, encoding, mimetype, filePath, file, buffer }, data);
}

export function createMockFile(data?: Partial<CreateMockFileReturn>): CreateMockFileReturn {
  const { filename, encoding, mimetype, filePath, buffer } = createMockFileMeta();
  fs.writeFileSync(filePath, buffer);
  expect(fs.existsSync(filePath)).toEqual(true);
  return Object.assign({ filename, encoding, mimetype, filePath, buffer }, data);
}

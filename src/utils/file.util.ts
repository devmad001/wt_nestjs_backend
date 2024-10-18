import * as FS from 'fs-extra';
import { createHash } from 'crypto';

export class FileUtils {
  static async generateMD5(filePath: string): Promise<string> {
    const buff = await FS.readFile(filePath);
    const hash = createHash('md5').update(buff).digest('hex');
    return hash;
  }
}

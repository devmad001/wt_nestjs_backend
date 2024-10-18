import * as crypto from 'crypto';

export class StringUtils {
  private readonly encryption_method = 'aes-256-cbc';
  private readonly encryptionKey: string;
  private readonly encryptionIV: string;

  constructor() {
    this.encryptionKey = crypto
      .createHash('sha256')
      .update(process.env.AES_KEY)
      .digest('hex')
      .substring(0, 32);
    this.encryptionIV = crypto
      .createHash('sha256')
      .update(process.env.AES_IV)
      .digest('hex')
      .substring(0, 16);
  }

  encryptData(data) {
    const cipher = crypto.createCipheriv(
      this.encryption_method,
      this.encryptionKey,
      this.encryptionIV,
    );
    return Buffer.from(
      cipher.update(data, 'utf8', 'hex') + cipher.final('hex'),
    ).toString('base64');
  }

  decryptData(encryptedData) {
    const buff = Buffer.from(encryptedData, 'base64');
    const decipher = crypto.createDecipheriv(
      this.encryption_method,
      this.encryptionKey,
      this.encryptionIV,
    );
    return (
      decipher.update(buff.toString('utf8'), 'hex', 'utf8') +
      decipher.final('utf8')
    );
  }

  decryptObject(
    object: any,
    fields = [
      'caseFileNumber',
      'threatTagging',
      'publicCorruptionTag',
      'description',
      'trackingNumber',
      'usaoOrderDate',
      'usaoNumber',
      'bankName',
      'agent',
      'returnDate',
      'limitPay',
      'requestorName',
      'requestorPhoneNumber',
      'requestedDate',
    ],
  ) {
    const clonedObj = { ...object };
    fields.forEach((v) => {
      if (clonedObj[v]) {
        clonedObj[v] = this.decryptData(clonedObj[v]);
      }
    });
    return clonedObj;
  }

  encryptObject(
    object: any,
    fields = [
      'caseFileNumber',
      'threatTagging',
      'publicCorruptionTag',
      'description',
      'trackingNumber',
      'usaoOrderDate',
      'usaoNumber',
      'bankName',
      'agent',
      'returnDate',
      'limitPay',
      'requestorName',
      'requestorPhoneNumber',
      'requestedDate',
    ],
  ) {
    const clonedObj = { ...object };
    fields.forEach((v) => {
      if (clonedObj[v]) {
        clonedObj[v] = this.encryptData(clonedObj[v]);
      }
    });
    return clonedObj;
  }

  encryptArray(
    items: any[],
    fields = ['accountNumber', 'accountName', 'pages', 'dateFrom', 'dateTo'],
  ) {
    return items.map((v) => {
      fields.forEach((field) => {
        if (v[field]) {
          v[field] = this.encryptData(v[field]);
        }
      });
      return v;
    });
  }

  decryptArray(
    items: any[],
    fields = ['accountNumber', 'accountName', 'pages', 'dateFrom', 'dateTo'],
  ) {
    return items.map((v) => {
      fields.forEach((field) => {
        if (v[field]) {
          v[field] = this.decryptData(v[field]);
        }
      });
      return v;
    });
  }
}

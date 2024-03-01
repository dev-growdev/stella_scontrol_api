//import { S3 } from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'crypto';

interface UploadFile {
  file: string | Buffer;
  name: string;
  contentType: string;
}

@Injectable()
export class AWSService {
  //private client: S3;

  constructor(private config: ConfigService) {
    // this.client = new S3({
    //   region: this.config.get('AWS_REGION') as string,
    //   credentials: {
    //     accessKeyId: this.config.get('AWS_ACCESS_KEY_ID') as string,
    //     secretAccessKey: this.config.get('AWS_SECRET_ACCESS_KEY') as string,
    //   },
    // });
  }

  async upload(uploadedFile: UploadFile): Promise<string> {
    let body = uploadedFile.file;

    if (typeof uploadedFile.file === 'string') {
      body = Buffer.from(
        uploadedFile.file.replace(/^data:image\/\w+;base64,/, ''),
        'base64',
      );
    }

    const key = `${randomUUID()}-${uploadedFile.name}`;

    // await this.client.putObject({
    //   Bucket: this.config.get('BUCKET_NAME'),
    //   Key: key,
    //   Body: body,
    //   ContentType: uploadedFile.contentType,
    // });

    return key;
  }

  // async delete(key: string) {
  //   await this.client.deleteObject({
  //     Bucket: this.config.get('BUCKET_NAME'),
  //     Key: key,
  //   });
  // }
}

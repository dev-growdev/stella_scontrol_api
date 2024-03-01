// import { GetObjectCommand, S3 } from '@aws-sdk/client-s3';
// import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
// import { Injectable } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';

// @Injectable()
// export class AWSSignature {
//   constructor(private config: ConfigService) {}

//   async generateUrl(key: string): Promise<string> {
//     const client = new S3({
//       region: this.config.get('AWS_REGION') as string,
//       credentials: {
//         accessKeyId: this.config.get('AWS_ACCESS_KEY_ID') as string,
//         secretAccessKey: this.config.get('AWS_SECRET_ACCESS_KEY') as string,
//       },
//     });

//     const comand = new GetObjectCommand({
//       Bucket: this.config.get('BUCKET_NAME'),
//       Key: key,
//     });

//     const url = await getSignedUrl(client, comand, { expiresIn: 3600 });

//     return url;
//   }
// }

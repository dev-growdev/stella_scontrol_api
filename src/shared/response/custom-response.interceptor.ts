import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

interface CustomResponseDTO {
  success: boolean;
  code: number;
  data: any;
  message: string;
  request: { url: string; method: string };
}

@Injectable()
export class CustomResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const res = context.switchToHttp().getResponse();
    const { url, method } = req;

    return next.handle().pipe(
      map((data) => {
        const response: CustomResponseDTO = {
          success: true,
          code: res.statusCode,
          data,
          message: 'Ok',
          request: { url, method },
        };
        return response;
      }),
    );
  }
}

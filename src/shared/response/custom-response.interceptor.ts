import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

interface CustomResponseDto {
  success: boolean;
  code: number;
  data: any;
}

@Injectable()
export class CustomResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const res = context.switchToHttp().getResponse();

    return next.handle().pipe(
      map((data) => {
        const response: CustomResponseDto = {
          success: true,
          code: res.statusCode,
          data,
        };
        return response;
      }),
    );
  }
}

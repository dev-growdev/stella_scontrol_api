import { Provider } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { CustomExceptionFilter } from './shared/exceptions';
import { ClassValidatorPipe } from './shared/pipes/validation.pipe';
import { CustomResponseInterceptor } from './shared/response';

export const commonProviders: Provider[] = [
  {
    provide: APP_FILTER,
    useClass: CustomExceptionFilter,
  },
  // {
  //   provide: APP_INTERCEPTOR,
  //   useClass: CustomResponseInterceptor,
  // },
  {
    provide: APP_PIPE,
    useClass: ClassValidatorPipe,
  },
];

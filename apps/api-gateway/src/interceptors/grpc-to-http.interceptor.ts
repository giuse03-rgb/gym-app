import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Observable, catchError } from 'rxjs';
import { status } from '@grpc/grpc-js';

@Injectable()
export class GrpcToHttpInterceptor implements NestInterceptor {
  public intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((err: any) => {
        switch (err?.code) {
          case status.INVALID_ARGUMENT:
            throw new HttpException(err.details, HttpStatus.BAD_REQUEST);

          case status.ALREADY_EXISTS:
            throw new HttpException(err.details, HttpStatus.CONFLICT);

          case status.NOT_FOUND:
            throw new HttpException(err.details, HttpStatus.NOT_FOUND);

          case status.UNAUTHENTICATED:
            throw new HttpException(err.details, HttpStatus.UNAUTHORIZED);

          case status.PERMISSION_DENIED:
            throw new HttpException(err.details, HttpStatus.FORBIDDEN);

          default:
            throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
        }
      }),
    );
  }
}

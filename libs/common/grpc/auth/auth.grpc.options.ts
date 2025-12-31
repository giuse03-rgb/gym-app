import { GrpcOptions, Transport } from '@nestjs/microservices';

import { join } from 'path';

export const AUTH_GRPC_BASE_OPTIONS: GrpcOptions = {
  transport: Transport.GRPC,
  options: {
    package: 'auth',
    protoPath: join(process.cwd(), 'libs/common/proto/auth.proto'),
  },
};

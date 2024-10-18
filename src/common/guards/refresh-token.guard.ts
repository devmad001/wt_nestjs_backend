import { AuthGuard } from '@nestjs/passport';

export class RefressTokenGuard extends AuthGuard('jwt-refresh') {
  constructor() {
    super();
  }
}

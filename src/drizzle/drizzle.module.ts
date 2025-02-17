import { Global, Module } from '@nestjs/common';
import { DrizzleProvider } from './drizzle.service';

@Global()
@Module({
  providers: [DrizzleProvider],
  exports: [DrizzleProvider],
})
export class DrizzleModule {}

import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const Library = createParamDecorator((data: string, context: ExecutionContext): string => {
  return context.switchToHttp().getRequest().library;
});

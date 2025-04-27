import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const Author = createParamDecorator((data: string, context: ExecutionContext): string => {
  return context.switchToHttp().getRequest().author;
});

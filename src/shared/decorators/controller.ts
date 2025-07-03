import { applyDecorators, Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

export const ApiProjectController = (path: string) => {
  const options: ClassDecorator[] = [Controller({ path }), ApiTags(path)];
  return applyDecorators(...options);
};

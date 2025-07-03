import { applyDecorators } from '@nestjs/common';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ApiPropertyOptions } from '@nestjs/swagger/dist/decorators/api-property.decorator';
import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { ValidationOptions } from 'class-validator/types/decorator/ValidationOptions';
import { Type } from 'class-transformer';

export const ApiProjectProperty = (
  options?: ApiPropertyOptions,
  validationOptions?: ValidationOptions,
) => {
  const decorators = [
    ApiProperty(options),
    IsNotEmpty({ ...(validationOptions || {}) }),
    DecoratedProperty(),
  ];
  if (options?.type) {
    decorators.push(Type(() => options.type as any));
  }
  return applyDecorators(...decorators);
};
export const ApiProjectOptionalProperty = (options?: ApiPropertyOptions) => {
  const decorators = [ApiProperty(options), DecoratedProperty()];
  if (options?.type) {
    decorators.push(Type(() => options.type as any));
  }
  return applyDecorators(...decorators);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const ApiProjectEnumProperty = (
  enumType: any,
  options?: ApiPropertyOptions,
) => {
  return applyDecorators(
    ...[
      ApiProperty({
        type: enumType,
        enum: Object.keys(enumType),
        isArray: false,
        required: true,
        ...options,
      }),
      IsEnum(enumType),
    ],
    IsNotEmpty(),
    DecoratedProperty(),
    Type(() => enumType),
  );
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const ApiProjectOptionalEnumProperty = (
  enumType: any,
  options?: ApiPropertyOptions,
) => {
  return applyDecorators(
    ...[
      ApiPropertyOptional({
        type: enumType,
        enum: Object.keys(enumType),
        isArray: false,
        required: false,
        nullable: true,
        ...options,
      }),
      IsEnum(enumType),
      IsOptional(),
      DecoratedProperty(),
      Type(() => enumType),
    ],
  );
};

// https://stackoverflow.com/questions/49031586/how-to-find-all-properties-decorated-with-a-certain-decoration
const metadataKey = Symbol('DecoratedProperty');

function DecoratedProperty(): (target: object, propertyKey: string) => void {
  return registerProperty;
}

function registerProperty(target: object, propertyKey: string): void {
  const properties: string[] = Reflect.getMetadata(metadataKey, target);
  const newProperties: string[] =
    properties?.length > 0 ? [...properties, propertyKey] : [propertyKey];
  Reflect.defineMetadata(metadataKey, newProperties, target);
}

export function getDecoratedProperties(origin: object): string[] {
  return [...Reflect.getMetadata(metadataKey, origin)];
}

import { SetMetadata, applyDecorators } from '@nestjs/common';

export interface SchemaMetadata
{
    name?: string;
    defaultSortingField?: string;
    auto?: boolean;
}

export const SCHEMA_METADATA = '__schemaMetadata__';

export const Schema = (options: SchemaMetadata = {}): ClassDecorator =>
    applyDecorators((target: object, key?: any, descriptor?: any) =>
        SetMetadata(
            SCHEMA_METADATA,
            {
                name               : options.name || (target as any).name,
                defaultSortingField: options.defaultSortingField,
            },
        )(target, key, descriptor),
    );

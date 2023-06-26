import { Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { SCHEMA_METADATA } from '../decorators';
import { FIELD_METADATA } from '../decorators';
import { CollectionCreateSchema } from 'typesense/lib/Typesense/Collections';

/**
 * examina el target y confirma si tiene metadata de typesense
 * si la tiene, la retorna el objeto schema con sus campos anidados
 */
@Injectable()
export class TypesenseMetadataAccessor
{
    constructor(private readonly reflector: Reflector) { }

    getTypesenseMetadata(target): CollectionCreateSchema | undefined
    {
        if (target.constructor)
        {
            const schema = this.reflector.get(SCHEMA_METADATA, target.constructor);
            const fields = this.reflector.get(FIELD_METADATA, target.constructor);

            if (!schema)
            {
                return undefined;
            }

            if (!(fields || schema.auto))
            {
                return undefined;
            }

            return {
                name                 : schema.name,
                // eslint-disable-next-line camelcase
                default_sorting_field: schema.defaultSortingField,
                fields               : [...(schema.auto ? [{ name: '.*', type: 'auto' }] : []), ...(fields || [])],
            };
        }

        return undefined;
    }
}

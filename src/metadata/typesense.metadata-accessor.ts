import { Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { CollectionCreateSchema } from 'typesense/lib/Typesense/Collections';
import { FIELD_METADATA, SCHEMA_METADATA } from '../decorators';

/**
 * examines the target (schema constructor) and confirms if it has typesense
 * metadata if it does, returns the schema object with its nested fields
 */
@Injectable()
export class TypesenseMetadataAccessor
{
    constructor(
        private readonly reflector: Reflector,
    ) { }

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

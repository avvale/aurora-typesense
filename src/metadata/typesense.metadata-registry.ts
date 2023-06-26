import { Injectable, Logger } from '@nestjs/common';
import { CollectionCreateSchema } from 'typesense/lib/Typesense/Collections';

type Constructor = new (...args: any[]) => { /**/ };

/**
 * Storage schemas typesense and manage them
 */
@Injectable()
export class TypesenseMetadataRegistry
{
    private schemas: Map<Constructor, CollectionCreateSchema> = new Map();

    addSchema(target: Constructor, schema: CollectionCreateSchema): void
    {
        if (this.schemas.has(target))
        {
            Logger.warn(`Schema ${target} already exists`);
        }

        this.schemas.set(target, schema);
    }

    getSchemaByTarget(target: Constructor): CollectionCreateSchema | undefined
    {
        return this.schemas.get(target);
    }

    getTargets(): IterableIterator<Constructor>
    {
        return this.schemas.keys();
    }
}

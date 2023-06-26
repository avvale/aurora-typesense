import { OnModuleInit } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { Client } from 'typesense';
import { TypesenseMetadataRegistry } from '../metadata';

/**
 * Define typesense collections if not exists, according
 * schemas defined in metadata registry
 */
@Injectable()
export class TypesenseCollectionsCreator implements OnModuleInit
{
    constructor(
        private readonly registry: TypesenseMetadataRegistry,
        private readonly typesense: Client,
    ) { }

    async onModuleInit(): Promise<void>
    {
        for (const target of this.registry.getTargets())
        {
            const schema = this.registry.getSchemaByTarget(target);

            try
            {
                // eslint-disable-next-line no-await-in-loop
                await this.typesense.collections(schema!.name).retrieve();
            }
            catch (error)
            {
                if ((error as any).httpStatus === 404)
                {
                    // eslint-disable-next-line no-await-in-loop
                    await this.typesense.collections().create(schema);
                }
            }
        }
    }
}

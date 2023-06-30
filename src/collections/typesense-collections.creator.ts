import { Utils } from '@aurorajs.dev/core';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Client } from 'typesense';
import { TypesenseMetadataRegistry } from '../metadata';

/**
 * Define typesense collections if not exists according
 * schemas defined in metadata registry
 */
@Injectable()
export class TypesenseCollectionsCreator implements OnModuleInit
{
    private readonly logger = new Logger(TypesenseCollectionsCreator.name);

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
                await this.typesense
                    .aliases(schema.name)
                    .retrieve();
            }
            catch (error)
            {
                if ((error as any).httpStatus === 404)
                {
                    const collectionName = schema.name + '_' + Utils.uuid(); // add uuid to avoid name conflicts

                    // create collection with real name
                    // eslint-disable-next-line no-await-in-loop
                    await this.typesense
                        .collections()
                        .create({
                            ...schema,
                            name: collectionName,
                        });
                    this.logger.log(`Collection name ${collectionName} have been created successful`);

                    // add alias to collection
                    // eslint-disable-next-line no-await-in-loop
                    await this.typesense
                        .aliases()
                        .upsert(schema.name, {
                            // eslint-disable-next-line camelcase
                            collection_name: collectionName,
                        });
                    this.logger.log(`Alias ${schema.name} have been created successful`);
                }
            }
        }
    }
}

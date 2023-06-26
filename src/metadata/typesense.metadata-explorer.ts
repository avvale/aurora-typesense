import { Injectable } from '@nestjs/common';
import { OnModuleInit } from '@nestjs/common';
import { DiscoveryService } from '@nestjs/core';
import { InstanceWrapper } from '@nestjs/core/injector/instance-wrapper';

import { TypesenseMetadataAccessor } from './typesense.metadata-accessor';
import { TypesenseMetadataRegistry } from './typesense.metadata-registry';

/**
 * scans the providers and looks for typesense metadata,
 * if found it records it in the metadata registry
 */
@Injectable()
export class TypesenseMetadataExplorer implements OnModuleInit
{
    constructor(
        private readonly discoveryService: DiscoveryService,
        private readonly metadataAccessor: TypesenseMetadataAccessor,
        private readonly metadataRegistry: TypesenseMetadataRegistry,
    ) { }

    onModuleInit(): void
    {
        this.explore();
    }

    explore(): void
    {
        this.discoveryService
            .getProviders()
            .forEach((wrapper: InstanceWrapper) =>
            {
                const { instance } = wrapper;

                if (!instance || !Object.getPrototypeOf(instance))
                {
                    return;
                }

                this.lookupSchema(instance);
            });
    }

    lookupSchema(instance): void
    {
        const metadata = this.metadataAccessor.getTypesenseMetadata(instance);

        if (metadata)
        {
            this.metadataRegistry.addSchema(instance.constructor, metadata);
        }
    }
}

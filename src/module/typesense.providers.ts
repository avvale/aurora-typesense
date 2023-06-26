import { Provider } from '@nestjs/common';
import { Client } from 'typesense';
import { ConfigurationOptions } from 'typesense/lib/Typesense/Configuration';
import { TypesenseCollectionsCreator } from '../collections';
import { TypesenseMetadataAccessor, TypesenseMetadataExplorer, TypesenseMetadataRegistry } from '../metadata';
import { TYPESENSE_MODULE_OPTIONS } from './typesense.constants';

export const createTypesenseProvider = (): Provider[] => [
    TypesenseMetadataAccessor,
    TypesenseMetadataExplorer,
    TypesenseMetadataRegistry,
    TypesenseCollectionsCreator,
];

export const createTypesenseExportsProvider = (): Provider[] => [
    TypesenseMetadataRegistry,
    {
        provide   : Client,
        useFactory: (options: ConfigurationOptions) =>
            new Client({
                nodes: options.nodes || [
                    {
                        host:
                            process.env.TYPESENSE_HOST || process.env.NODE_ENV === 'production'
                                ? 'ts.typesense.svc.cluster.local'
                                : 'localhost',
                        port    : 8108,
                        protocol: 'http',
                    },
                ],
                numRetries                : options.numRetries || 10,
                apiKey                    : options.apiKey || process.env.TYPESENSE_API_KEY,
                connectionTimeoutSeconds  : options.connectionTimeoutSeconds || 10,
                retryIntervalSeconds      : options.retryIntervalSeconds || 0.1,
                healthcheckIntervalSeconds: options.healthcheckIntervalSeconds || 2,
                logLevel                  : options.logLevel || 'info',
            }),
        inject: [
            TYPESENSE_MODULE_OPTIONS,
        ],
    },
];

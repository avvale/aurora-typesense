import { DynamicModule, Module, Provider } from '@nestjs/common';
import { DiscoveryModule } from '@nestjs/core';
import { ConfigurationOptions } from 'typesense/lib/Typesense/Configuration';
import { TypesenseModuleAsyncOptions, TypesenseOptionsFactory } from './typesense-module.interface';
import { TYPESENSE_MODULE_OPTIONS } from './typesense.constants';
import { createTypesenseExportsProvider, createTypesenseProvider } from './typesense.providers';

@Module({
    imports: [
        DiscoveryModule,
    ],
})
export class TypesenseModule
{
    static forRoot(options: ConfigurationOptions): DynamicModule
    {
        const exportsProviders = createTypesenseExportsProvider();
        const providers = createTypesenseProvider();

        return {
            global   : true,
            module   : TypesenseModule,
            providers: [
                // register options with TYPESENSE_MODULE_OPTIONS token
                // to be available for inject
                {
                    provide : TYPESENSE_MODULE_OPTIONS,
                    useValue: options,
                },
                ...providers,
                ...exportsProviders,
            ],
            exports: exportsProviders,
        };
    }

    static forRootAsync(options: TypesenseModuleAsyncOptions): DynamicModule
    {
        const exportsProviders = createTypesenseExportsProvider();
        const providers = createTypesenseProvider();

        return {
            global   : true,
            module   : TypesenseModule,
            imports  : options.imports || [],
            providers: [
                ...this.createAsyncProviders(options),
                ...providers,
                ...exportsProviders,
            ],
            exports: exportsProviders,
        };
    }

    private static createAsyncProviders(options: TypesenseModuleAsyncOptions): Provider[]
    {
        if (options.useExisting || options.useFactory)
        {
            return [this.createAsyncOptionsProvider(options)];
        }

        return [
            this.createAsyncOptionsProvider(options),
            {
                provide : options.useClass!,
                useClass: options.useClass!,
            },
        ];
    }

    private static createAsyncOptionsProvider(options: TypesenseModuleAsyncOptions): Provider
    {
        if (options.useFactory)
        {
            return {
                provide   : TYPESENSE_MODULE_OPTIONS,
                useFactory: options.useFactory,
                inject    : options.inject || [],
            };
        }

        return {
            provide   : TYPESENSE_MODULE_OPTIONS,
            useFactory: (optionsFactory: TypesenseOptionsFactory) => optionsFactory.createTypesenseOptions(),
            inject    : [options.useExisting! || options.useClass!],
        };
    }
}

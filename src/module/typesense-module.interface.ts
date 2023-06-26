import { ModuleMetadata, Type } from '@nestjs/common/interfaces';
import { ConfigurationOptions } from 'typesense/lib/Typesense/Configuration';

export interface TypesenseOptionsFactory {
    createTypesenseOptions(): Promise<ConfigurationOptions> | ConfigurationOptions;
}

export interface TypesenseModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
    useExisting?: Type<TypesenseOptionsFactory>;
    useClass?: Type<TypesenseOptionsFactory>;
    useFactory?: (...args: any[]) => Promise<ConfigurationOptions> | ConfigurationOptions;
    inject?: any[];
}

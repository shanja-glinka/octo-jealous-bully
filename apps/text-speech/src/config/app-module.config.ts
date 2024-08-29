import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { configuration } from './configuration';
import { validationSchema } from './validation.config';

/** This code is creating a configuration module using the `ConfigModule` from the `@nestjs/config`
package. The `forRoot` method is used to configure the module with the following options: */
const configModule = ConfigModule.forRoot({
  isGlobal: true,
  envFilePath: `./.env`,

  load: [configuration],
  validationSchema,
});

/** The AppConfigModule class imports and exports the configModule. */
@Module({
  imports: [configModule],
  exports: [configModule],
})
export class AppConfigModule {}

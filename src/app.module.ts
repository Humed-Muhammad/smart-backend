import { ApolloDriver } from '@nestjs/apollo';
import { Module, ValidationPipe } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';

import { APP_PIPE } from '@nestjs/core';

import { ConfigModule } from '@nestjs/config';
import { UploadsModule } from './uploads/uploads.module';
// import { PuppeteerModule } from 'nest-puppeteer';
import { TestModule } from './test/test.module';

@Module({
  imports: [
    GraphQLModule.forRoot({
      typePaths: ['./**/*.graphql'],
      driver: ApolloDriver,
      context: ({ req }) => ({ req }),
    }),

    // PuppeteerModule
    //   .forRoot
    //   // { pipe: true }, // optional, any Puppeteer launch options here or leave empty for good defaults */,
    //   // 'Chrome', // optional, can be useful for using Chrome and Firefox in the same project
    //   (),

    UploadsModule,
    TestModule,
    ConfigModule.forRoot({}),
  ],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
  ],
})
export class AppModule {}

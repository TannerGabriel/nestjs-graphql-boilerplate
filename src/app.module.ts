import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GraphQLModule } from '@nestjs/graphql';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import 'dotenv/config';

@Module({
  imports: [
    GraphQLModule.forRoot({
      typePaths: ['./**/*.graphql'],
      context: ({ req }) => ({ headers: req.headers }),
    }),
    MongooseModule.forRoot(`mongodb://${process.env.DATABASE_HOST}/nest`),
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import 'dotenv/config';

@Module({
  imports: [
    GraphQLModule.forRoot({
      typePaths: ['./**/*.graphql'],
      context: ({ req }) => ({ headers: req.headers }),
      playground: true,
    }),
    MongooseModule.forRoot(`mongodb://${process.env.DATABASE_HOST}/nest`),
    UserModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { UserModule } from '../src/user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { GraphQLModule } from '@nestjs/graphql';
import { UserDTO } from '../src/user/dto/user.dto';
import { AuthModule } from '../src/auth/auth.module';
import * as mongoose from 'mongoose';

describe('ItemsController (e2e)', () => {
  let app;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        UserModule,
        AuthModule,
        MongooseModule.forRoot(
          `mongodb://${process.env.DATABASE_HOST ||
            'localhost:27017'}/nestgraphqltesting`,
        ),
        GraphQLModule.forRoot({
          typePaths: ['./**/*.graphql'],
          context: ({ req }) => ({ headers: req.headers }),
          playground: true,
        }),
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    mongoose.connection.db.dropDatabase();
    await app.close();
  });

  const user: UserDTO = {
    email: 'test@test.com',
    password: '!somepassword123!',
  };

  const updatedUser: UserDTO = {
    email: 'deom@test.com',
    password: '!somenewgreatpassword123!',
  };

  const createUserQuery = `
    mutation{
        register(email: "${user.email}", password: "${user.password}"){
          email,
          token
        }
      }
  `;

  it('createItem', () => {
    return request(app.getHttpServer())
      .post('/graphql')
      .send({
        operationName: null,
        query: createUserQuery,
      })
      .expect(({ body }) => {
        const data = body.data.register;
        expect(data.email).toBe(user.email);
        expect(data.token).not.toBeNull();
      })
      .expect(200);
  });

  const getUserQuery = `{
    users{
      id,
      email
    }
  }`;

  it('getItems', () => {
    return request(app.getHttpServer())
      .post('/graphql')
      .send({
        operationName: null,
        query: getUserQuery,
      })
      .expect(({ body }) => {
        const data = body.data.users;
        const userResult = data[0];
        expect(data.length).toBeGreaterThan(0);
        expect(userResult.email).toBe(user.email);
        expect(userResult.id).not.toBeNull();
      })
      .expect(200);
  });

  const signInUserQuery = `
    mutation{
      login(email: "${user.email}", password: "${user.password}"){
          email,
          token
        }
      }
  `;

  it('signIn', () => {
    return request(app.getHttpServer())
      .post('/graphql')
      .send({
        operationName: null,
        query: signInUserQuery,
      })
      .expect(({ body }) => {
        const data = body.data.login;
        expect(data.email).toBe(user.email);
        expect(data.token).not.toBeNull();
      })
      .expect(200);
  });

  // const updateUserObject = JSON.stringify(updatedUser).replace(
  //   /\"([^(\")"]+)\":/g,
  //   '$1:',
  // );

  // it('updateItem', () => {
  //   const updateUserQuery = `
  //   mutation{
  //       update(id: ${id}, user: ${updateUserObject}){
  //         email,
  //         id
  //       }
  //     }`;

  //   return request(app.getHttpServer())
  //     .post('/graphql')
  //     .send({
  //       operationName: null,
  //       query: updateUserQuery,
  //     })
  //     .expect(({ body }) => {
  //       const data = body.data.update;
  //       expect(data.id).not.toBeNull();
  //       expect(data.email).toBe(updatedUser.email);
  //     })
  //     .expect(200);
  // });

  const deleteUserQuery = `
      mutation{
        delete(email: "${user.email}"){
          email,
          id
        }
      }
  `;

  it('delete item', () => {
    return request(app.getHttpServer())
      .post('/graphql')
      .send({
        operationName: null,
        query: deleteUserQuery,
      })
      .expect(({ body }) => {
        const data = body.data.delete;
        expect(data.email).toBe(user.email);
        expect(data.token).not.toBeNull();
      })
      .expect(200);
  });
});

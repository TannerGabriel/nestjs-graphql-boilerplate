import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { UserModule } from '../src/user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { GraphQLModule } from '@nestjs/graphql';
import { UserDTO } from '../src/user/dto/user.dto';
import { AuthModule } from '../src/auth/auth.module';

describe('ItemsController (e2e)', () => {
  let app;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        UserModule,
        AuthModule,
        MongooseModule.forRoot('mongodb://localhost/nestgraphqltesting'),
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
    await app.close();
  });

  const user: UserDTO = {
    email: 'test@test.com',
    password: '!somepassword123!',
  };

  let id: string = '';

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
        id = data.id;
        expect(data.email).toBe(user.email);
        expect(data.token).not.toBeNull();
      })
      .expect(200);
  });

  // const getUserQuery = `{
  //   users{
  //     id,
  //     email
  //   }
  // }`;

  // it('getItems', () => {
  //   return request(app.getHttpServer())
  //     .post('/graphql')
  //     .send({
  //       operationName: null,
  //       query: getUserQuery,
  //     })
  //     .expect(({ body }) => {
  //       const data = body.data.users;
  //       const userResult = data[0];
  //       expect(data.length).toBeGreaterThan(0);
  //       expect(userResult.email).toBe(user.email);
  //       expect(userResult.id).not.toBeNull();
  //     })
  //     .expect(200);
  // });

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
});

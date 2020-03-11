import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { UserModule } from '../src/user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { GraphQLModule } from '@nestjs/graphql';
import { CreateUserInput } from '../src/user/dto/user.input';
import { AuthModule } from '../src/auth/auth.module';

describe('Users (e2e)', () => {
  let app;
  const host = process.env.DATABASE_HOST || 'localhost';

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        UserModule,
        AuthModule,
        MongooseModule.forRoot(`mongodb://${host}/nestgraphqltesting`),
        GraphQLModule.forRoot({
          typePaths: ['./**/*.graphql'],
          context: ({ req }) => ({ req }),
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

  const user: CreateUserInput = {
    email: 'test@test.com',
    password: '!somepassword123!',
  };

  const createUserQuery = `
    mutation{
        register(email: "${user.email}", password: "${user.password}"){
          email,
          token
        }
      }
  `;

  let token: string;
  let result;
  it('register', () => {
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
        result = data;
        token = data.token;
      })
      .expect(200);
  });

  const getUserQuery = `{
    users{
      id,
      email
    }
  }`;

  it('getAllUsers', () => {
    return request(app.getHttpServer())
      .post('/graphql')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .send({
        operationName: null,
        query: getUserQuery,
      })
      .expect(({ body }) => {
        const data = body.data.users;
        const userResult = data[0];
        result.id = userResult.id;
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
        token = data.token;
        expect(data.email).toBe(user.email);
        expect(data.token).not.toBeNull();
      })
      .expect(200);
  });

  it('update user', () => {
    console.log(result.id);
    const updateUserQuery = `
      mutation{
        update(id: "${result.id}", user: {email:"test1@test.com"}){
          id,
          email,
          userRole,
        }
      }
  `;

    return request(app.getHttpServer())
      .post('/graphql')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .send({
        operationName: null,
        query: updateUserQuery,
      })
      .expect(({ body }) => {
        const data = body.data.update;
        user.email = data.email
        expect(data.email).toBe("test1@test.com");
      })
      .expect(200);
  });

  
  it('signIn', () => {
    const signInUpdatedUserQuery = `
    mutation{
      login(email: "${user.email}", password: "${user.password}"){
          email,
          token
        }
      }
  `;

    return request(app.getHttpServer())
      .post('/graphql')
      .send({
        operationName: null,
        query: signInUpdatedUserQuery,
      })
      .expect(({ body }) => {
        const data = body.data.login;
        token = data.token;
        expect(data.email).toBe(user.email);
        expect(data.token).not.toBeNull();
      })
      .expect(200);
  });

  it('delete user', () => {
    const deleteUserQuery = `
      mutation{
        delete(email: "${user.email}"){
          email,
          id
        }
      }
  `;

    return request(app.getHttpServer())
      .post('/graphql')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`)
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

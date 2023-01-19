import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../app.module';
import { AccessTokenType } from './types/types';
import { createApp } from '../helpers/createApp';
import { BanUsersBusinessDto } from '../users/api/dto/create.user.buisnes.type';
import { SaBlogsBusinessType } from '../blogs/domain/dto/blogBusinessType';
import { CreateBlogDtoType } from '../blogs/domain/dto/createBlogDbType';

jest.setTimeout(120000);

describe('Admin endpoints (e2e)', () => {
  let app: INestApplication;
  let server: any;
  beforeAll(async () => {
    // Create a NestJS application
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      // .overrideProvider()
      .compile();
    app = module.createNestApplication();
    //created me
    app = createApp(app);
    server = app.getHttpServer();
    //blogsController = app.get<BlogsController>(BlogsController);
    //blogsQueryRepositories = app.get<BlogsQueryRepositories>(BlogsQueryRepositories);
    // Connect to the in-memory server
    await app.init();
    //Create a new MongoDB in-memory server
    //mongoServer = await MongoMemoryServer.create();
    //const mongoUri = mongoServer.getUri();
    // Get the connection string for the in-memory server
    //await mongoose.connect(mongoUri);
  });
  afterAll(async () => {
    await app.close();
    //await mongoose.disconnect();
    //await mongoServer.stop();
  });
  describe(`/sa`, () => {
    beforeAll(async () => {
      await request(server).delete(`/testing/all-data`).expect(204);
    });
    let createdUser: BanUsersBusinessDto;
    let blogs: SaBlogsBusinessType;
    let createdBlog: CreateBlogDtoType;
    let validAccessToken: AccessTokenType;

    it(`01 - POST -> "sa/users": should create new user; status 201; content: created user; used additional methods: GET => /users`, async () => {
      const response = await request(server)
        .post(`/sa/users`)
        .auth('admin', 'qwerty', { type: 'basic' })
        .send({
          login: 'nomad',
          email: 'nomad@mail.ru',
          password: 'nomad.321321',
        })
        .expect(201);

      createdUser = response.body; //first user

      expect(createdUser).toEqual({
        id: expect.any(String),
        login: 'nomad',
        email: 'nomad@mail.ru',
        createdAt: expect.any(String),
        banInfo: {
          isBanned: false,
          banDate: null,
          banReason: null,
        },
      });
    });
    it(`02 - GET -> "/sa/blogs": should be return all blogs (array[]) wit pagination`, async () => {
      const resultView = {
        pagesCount: 0,
        page: 1,
        pageSize: 10,
        totalCount: 0,
        items: [],
      };
      //jest.spyOn(blogsQueryRepositories, "findBlogs").mockImplementation(() => result);
      const responseBlog = await request(server)
        .get(`/sa/blogs`)
        .auth('admin', 'qwerty', { type: 'basic' })
        .expect(200);

      blogs = responseBlog.body;

      expect(blogs).toStrictEqual(resultView);
    });
    it(`03 - GET -> "sa/users": should return status 200; content: users array with pagination; used additional methods: POST -> /users, DELETE -> /users;`, async () => {
      const response = await request(server)
        .post('/sa/users')
        .auth('admin', 'qwerty', { type: 'basic' })
        .send({
          login: 'nomad2',
          email: 'nomad2@mail.ru',
          password: 'nomad2.321321',
        })
        .expect(201);

      createdUser = response.body; //second user

      await request(server)
        .delete(`/sa/users/${createdUser.id}`)
        .auth('admin', 'qwerty', { type: 'basic' })
        .expect(204);

      const response2 = await request(server)
        .get(`/sa/users`)
        .auth('admin', 'qwerty', { type: 'basic' })
        .expect(200);

      const modelUsers = response2.body;

      const resultView = {
        pagesCount: 1,
        page: 1,
        pageSize: 10,
        totalCount: 1,
        items: [expect.any(Object)],
      };
      expect(modelUsers).toEqual(resultView);
      expect(modelUsers.items.length).toBe(1);
    });
    it(`04 - POST, DELETE -> "sa/users": should return error if auth credentials is incorrect; status 401; used additional methods: POST -> /users;`, async () => {
      const createResponse = await request(server)
        .post(`/sa/users`)
        .auth('admin', 'qwerty', { type: 'basic' })
        .send({
          login: 'nomad2',
          email: 'nomad2@mail.ru',
          password: 'nomad2.321321',
        })
        .expect(201);

      await request(server)
        .delete(`/sa/users/${createResponse.body.id}`)
        .auth('admin', '123', { type: 'basic' })
        .expect(401, 'Unauthorized');
    });
    it(`05 - DELETE -> "sa/users/:id": should delete user by id; status 204; used additional methods: POST -> /users, GET -> /users`, async () => {
      const createResponse = await request(server)
        .post(`/sa/users`)
        .auth('admin', 'qwerty', { type: 'basic' })
        .send({
          login: 'nomad3',
          email: 'nomad3@mail.ru',
          password: 'nomad3.321321',
        })
        .expect(201);

      createdUser = createResponse.body;

      await request(server)
        .get(`/sa/users`)
        .auth('admin', 'qwerty', { type: 'basic' })
        .expect(200);

      await request(server)
        .delete(`/sa/users/${createdUser.id}`)
        .auth('admin', 'qwerty', { type: 'basic' })
        .expect(204);
    });
    it(`06 - POST -> "sa/users": should return error if passed body is incorrect; status 400`, async () => {
      const response = await request(server)
        .post(`/sa/users`)
        .auth('admin', 'qwerty', { type: 'basic' })
        .send({ login: '', password: 'raccoon6', email: 'wer@tut.by' })
        .expect(400);

      expect(response.body).toStrictEqual({
        errorsMessages: [
          {
            message: expect.any(String),
            field: 'login',
          },
        ],
      });

      const response21 = await request(server)
        .post(`/sa/users`)
        .auth('admin', 'qwerty', { type: 'basic' })
        .send({ login: 'Dossya', password: 'raccoon6', email: 'wermut.by' })
        .expect(400);

      expect(response21.body).toStrictEqual({
        errorsMessages: [
          {
            message: expect.any(String),
            field: 'email',
          },
        ],
      });

      const response2 = await request(server)
        .post(`/sa/users`)
        .auth(`admin`, `qwerty`, { type: 'basic' })
        .send({ login: 'helloWorld', password: '', email: 'wer@tut.by' })
        .expect(400);

      expect(response2.body).toStrictEqual({
        errorsMessages: [
          {
            message: expect.any(String),
            field: 'password',
          },
        ],
      });
    });
    it(`07 - POST -> "sa/users": should create new user; status 201; content: created user; used additional methods: GET => /users;`, async () => {
      const response = await request(server)
        .post(`/sa/users`)
        .auth('admin', 'qwerty', { type: 'basic' })
        .send({
          login: 'bruno',
          password: 'mars1231231',
          email: 'wer@tut.by',
        })
        .expect(201);

      createdUser = response.body;

      const resultByUsers = await request(server)
        .get(`/sa/users`)
        .auth('admin', 'qwerty', { type: 'basic' })
        .expect(200);

      const modelUser = resultByUsers.body;

      expect(modelUser.items.length).toBe(3);
    });
    it(`08 - PUT -> "sa/users/:id/ban": should update status ban user; and return status 204; `, async () => {
      await request(server)
        .put(`/sa/users/${createdUser.id}/ban`)
        .auth('admin', 'qwerty', { type: 'basic' })
        .send({
          isBanned: true,
          banReason: 'the user wanted a lot of money',
        })
        .expect(204);
    });
    it(`09 - PUT -> "sa/users/:id/ban": should return error status 400, if incorrect input data; `, async () => {
      await request(server)
        .put(`/sa/users/${createdUser.id}/ban`)
        .auth('admin', 'qwerty', { type: 'basic' })
        .send({
          isBanned: true,
          banReason: 'the user',
        })
        .expect(400);

      await request(server)
        .put(`/sa/users/${createdUser.id}/ban`)
        .auth('admin', 'qwerty', { type: 'basic' })
        .send({
          isBanned: 'true',
          banReason: 'the user wanted a lot of many',
        })
        .expect(400);
    });
    it(`10 - GET -> "/sa/blogs": should be return all blogs (array[]) wit pagination`, async () => {
      const result = await request(server)
        .post(`/auth/login`)
        .set(`User-Agent`, `for test`)
        .send({
          loginOrEmail: 'nomad',
          password: 'nomad.321321',
        })
        .expect(200);

      validAccessToken = result.body;

      const responseB = await request(server)
        .post(`/blogger/blogs`)
        .auth(validAccessToken.accessToken, { type: 'bearer' })
        .send({
          name: 'supertest_01',
          description:
            'A mongoose is a small terrestrial carnivorous mammal belonging to the family Herpestidae. This family is currently split into two subfamilies, the Herpestinae and the Mungotinae. The Herpestinae comprises 23 living species that are native to southern Europe, Africa and Asia, whereas the Mungotinae comprises 11 species native to Africa.[2] The Herpestidae originated about 21.8 ± 3.6 million years ago in the Early Miocene and genetically diverged into two main ',
          websiteUrl: 'https://www.youtube.com/watch?v=vuzKKCYXISA',
        })
        .expect(201);

      createdBlog = responseB.body;

      expect(createdBlog).toEqual({
        id: expect.any(String),
        name: 'supertest_01',
        description:
          'A mongoose is a small terrestrial carnivorous mammal belonging to the family Herpestidae. This family is currently split into two subfamilies, the Herpestinae and the Mungotinae. The Herpestinae comprises 23 living species that are native to southern Europe, Africa and Asia, whereas the Mungotinae comprises 11 species native to Africa.[2] The Herpestidae originated about 21.8 ± 3.6 million years ago in the Early Miocene and genetically diverged into two main',
        websiteUrl: 'https://www.youtube.com/watch?v=vuzKKCYXISA',
        createdAt: expect.any(String),
      });

      const responseBlogs = await request(server)
        .get(`/sa/blogs`)
        .auth('admin', 'qwerty', { type: 'basic' })
        .expect(200);

      blogs = responseBlogs.body;

      expect(blogs).toStrictEqual({
        pagesCount: 1,
        page: 1,
        pageSize: 10,
        totalCount: 1,
        items: [expect.any(Object)],
      });
    });
  });
});

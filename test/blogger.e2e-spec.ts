import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { CreateBlogDtoType } from '../src/blogs/domain/dto/createBlogDbType';
import { AppModule } from '../src/app.module';
import { createApp } from '../src/helpers/createApp';
import { MailBoxImap } from './helpers/imap.service';

describe('Integration tests for AuthController', () => {
  let app: INestApplication;
  let server: any;
  const mailBox = new MailBoxImap();

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
    // Connect to the in-memory server
    await app.init();
    await mailBox.connectToMail();
    // const msg = await mailBox.waitNewMessage(1);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Wipe all data before tests', () => {
    it('should wipe all data and return 204 status code', async () => {
      const response = await request(server).delete('/testing/all-data');

      expect(response.status).toBe(204);
    });

    // it('get all blogs should 401 status code', async () => {
    //   const response = await request(server).get('/blogger/blogs');
    //
    //   expect(response.status).toBe(401);
    // });

    it('get all blogs should return empty array after wipe', async () => {
      const blogId = '123';
      const response = await request(server).get(`/blogs/${blogId}`);

      console.log(response.body);
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        pagesCount: 0,
        page: 1,
        pageSize: 10,
        totalCount: 0,
        items: [],
      });
    });
  });
});

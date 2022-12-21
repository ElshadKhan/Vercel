import { AppModule } from '../../app.module';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';

describe('banUser', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const modRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = modRef.createNestApplication();
    await app.init();
  });
  it('should get a JWT then successfully make a call', async () => {
    const template = 'admin:qwerty';
    const base64Data = Buffer.from(template);
    const base64String = base64Data.toString('base64');
    const validAuthHeader = `Basic ${base64String}`;
    console.log(validAuthHeader);
    const userResponse1 = await request(app.getHttpServer())
      .post('/sa/users')
      .set({ authorization: validAuthHeader });
    console.log(userResponse1.body);
  });

  afterAll(async () => {
    await app.close();
  });
});

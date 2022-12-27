import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../../app.module';
import { createApp } from '../../../helpers/createApp';
import { UsersRepository } from '../../../users/infrastructure/users.repository';

describe('Integration tests for AuthController', () => {
  let app: INestApplication;
  let usersRepo: UsersRepository;

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
    // Connect to the in-memory server

    usersRepo = app.get(UsersRepository);

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('End point registration', () => {
    it('should return ', async () => {
      expect(5).toBe(5);
    });
  });
});

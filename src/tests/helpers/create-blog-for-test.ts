import { INestApplication } from '@nestjs/common';
import request from 'supertest';

export const createBlogsForTest = async (
  count: number,
  accessToken: string,
  app: INestApplication,
) => {
  const result: { blog: any }[] = [];
  for (let i = 0; i < count; i++) {
    const responseBlog = await request(app.getHttpServer())
      .post(`/blogger/blogs/`)
      .auth(accessToken, { type: 'bearer' })
      .send({
        name: `Mongoose${i}${i}`,
        description: `A mongoose is a small terrestrial carnivorous mammal belonging to the family Herpestidae`,
        websiteUrl: `https://www.mongoose${i}${i}.com`,
      })
      .expect(201);
    console.log(responseBlog.body);
    result.push({ blog: responseBlog.body });
  }
  return result;
};

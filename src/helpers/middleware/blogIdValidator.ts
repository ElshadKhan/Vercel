import { Injectable } from '@nestjs/common';
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { BlogsQueryRepository } from '../../blogs/infrastructure/blogs.queryRepository';
import { SqlBlogsQueryRepository } from '../../blogs/infrastructure/sql.blogs.queryRepository';

@ValidatorConstraint({ name: 'BlogExists', async: true })
@Injectable()
export class BlogExistsRule implements ValidatorConstraintInterface {
  constructor(private blogsQueryRepository: SqlBlogsQueryRepository) {}
  async validate(value: string) {
    const result = await this.blogsQueryRepository.findBlogById(value);
    if (!result) return false;
    return true;
  }
  defaultMessage(args: ValidationArguments) {
    return 'Blog doesn`t exist';
  }
}

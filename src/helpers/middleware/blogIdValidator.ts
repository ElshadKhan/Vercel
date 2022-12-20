import { Injectable } from '@nestjs/common';
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { BlogsQueryRepository } from '../../blogs/infrastructure/blogs.queryRepository';
import { UsersQueryRepository } from '../../users/infrastructure/users.queryRepository';

@ValidatorConstraint({ name: 'BlogExists', async: true })
@Injectable()
export class BlogExistsRule implements ValidatorConstraintInterface {
  constructor(private blogsQueryRepository: BlogsQueryRepository) {}
  async validate(value: string) {
    const result = await this.blogsQueryRepository.findBlogById(value);
    if (!result || result.blogOwnerInfo.userId) return false;
    return true;
  }
  defaultMessage(args: ValidationArguments) {
    return 'Blog doesn`t exist';
  }
}

@ValidatorConstraint({ name: 'UserExists', async: true })
@Injectable()
export class UserExistsRule implements ValidatorConstraintInterface {
  constructor(private usersQueryRepository: UsersQueryRepository) {}
  async validate(value: string) {
    const result = await this.usersQueryRepository.findUserById(value);
    if (!result) return false;
    return true;
  }
  defaultMessage(args: ValidationArguments) {
    return `Blog doesn't exist`;
  }
}

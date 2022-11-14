import { PartialType } from '@nestjs/mapped-types';
import { CreatePostDtoBlogId } from './create-post.dto';

export class UpdatePostDto extends PartialType(CreatePostDtoBlogId) {}

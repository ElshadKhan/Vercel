import { Injectable } from '@nestjs/common';
import { UpdatePostDtoBlogId } from './dto/update-post.dto';
import { PostsRepository } from './posts.repository';
import { CreatePostDbType, PostDtoType } from './dto/create-post.dto';
import { BlogsQueryRepository } from '../blogs/blogs.queryRepository';
import { LikesQueryRepository } from '../likes/likes.queryRepository';
import { LikeStatusEnam } from '../helpers/helpFunctions';

@Injectable()
export class PostsService {
  constructor(
    private postsRepository: PostsRepository,
    private blogQueryRepository: BlogsQueryRepository,
    private likesQueryRepository: LikesQueryRepository,
  ) {}

  async create(
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
  ): Promise<PostDtoType | null> {
    const blog = await this.blogQueryRepository.findOne(blogId);
    const newPost: CreatePostDbType = {
      id: String(+new Date()),
      title: title,
      shortDescription: shortDescription,
      content: content,
      blogId: blogId,
      blogName: blog.name,
      createdAt: new Date().toISOString(),
    };
    const newPostDto = await this.postsRepository.create(newPost);
    const lastLikes = await this.likesQueryRepository.getLastLikes(
      newPostDto.id,
      LikeStatusEnam.Like,
    );
    return {
      id: newPostDto.id,
      title: newPostDto.title,
      shortDescription: newPostDto.shortDescription,
      content: newPostDto.content,
      blogId: newPostDto.blogId,
      blogName: blog!.name,
      createdAt: newPostDto.createdAt,
      extendedLikesInfo: {
        likesCount: 0,
        dislikesCount: 0,
        myStatus: LikeStatusEnam.None,
        newestLikes: lastLikes.slice(0, 3).map((p) => ({
          addedAt: p.createdAt,
          userId: p.userId,
          login: p.login,
        })),
      },
    };
  }

  update(id: string, updatePostDto: UpdatePostDtoBlogId) {
    return this.postsRepository.update(
      id,
      updatePostDto.title,
      updatePostDto.shortDescription,
      updatePostDto.content,
      updatePostDto.blogId,
    );
  }

  delete(id: string) {
    return this.postsRepository.delete(id);
  }

  deleteAll() {
    return this.postsRepository.deleteAll();
  }
}

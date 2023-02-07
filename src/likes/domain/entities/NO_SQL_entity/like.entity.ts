import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type PostLikeDbTypeWithId = HydratedDocument<PostLike>;

@Schema()
export class PostLike {
  @Prop()
  type: string;
  @Prop()
  userId: string;
  @Prop()
  postId: string;
  @Prop()
  login: string;
  @Prop()
  createdAt: string;
  @Prop()
  isBanned: boolean;
}

export const PostLikeSchema = SchemaFactory.createForClass(PostLike);

export type CommentLikeDbTypeWithId = HydratedDocument<CommentLike>;

@Schema()
export class CommentLike {
  @Prop()
  type: string;
  @Prop()
  userId: string;
  @Prop()
  commentId: string;
  @Prop()
  login: string;
  @Prop()
  createdAt: string;
  @Prop()
  isBanned: boolean;
}

export const CommentLikeSchema = SchemaFactory.createForClass(CommentLike);

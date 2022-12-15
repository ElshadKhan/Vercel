import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { LikesInfoType } from '../dto/likeInfoType';

@Schema()
class LikesInfo {
  @Prop()
  likesCount: number;
  @Prop()
  dislikesCount: number;
  @Prop()
  myStatus: string;
}

const LikesInfoSchema = SchemaFactory.createForClass(LikesInfo);

@Schema({ id: false })
export class commentatorInfoType {
  @Prop({ required: true })
  userId: string;
  @Prop({ required: true })
  userLogin: string;
}
export const commentatorInfoSchema =
  SchemaFactory.createForClass(commentatorInfoType);

@Schema({ id: false })
export class postInfoType {
  @Prop({ required: true })
  id: string;
  @Prop({ required: true })
  title: string;
  @Prop({ required: true })
  blogId: string;
  @Prop({ required: true })
  blogName: string;
}
export const postInfoSchema = SchemaFactory.createForClass(postInfoType);

export type CommentDbTypeWithId = HydratedDocument<Comment>;

@Schema()
export class Comment {
  @Prop()
  id: string;
  @Prop()
  content: string;
  @Prop()
  userId: string;
  @Prop()
  userLogin: string;
  @Prop()
  postId: string;
  @Prop()
  createdAt: string;
  @Prop({ type: LikesInfoSchema })
  likesInfo: LikesInfoType;
  @Prop({ type: commentatorInfoSchema })
  commentatorInfo: commentatorInfoType;
  @Prop({ type: postInfoSchema })
  postInfo: postInfoType;
  @Prop({ require: true })
  ownerUserId: string;
  @Prop()
  isBan: boolean;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);

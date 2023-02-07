import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

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

@Schema()
export class postInfoType {
  @Prop({ require: true })
  ownerUserId: string;
  @Prop({ required: true })
  postId: string;
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
  createdAt: string;
  @Prop({ type: commentatorInfoSchema })
  commentatorInfo: commentatorInfoType;
  @Prop({ type: postInfoSchema })
  postInfo: postInfoType;
  @Prop()
  isBanned: boolean;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);

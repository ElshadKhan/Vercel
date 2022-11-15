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

export class LikesInfoType {
  constructor(
    public likesCount: number,
    public dislikesCount: number,
    public myStatus: string,
  ) {}
}

export type CommentDbType = HydratedDocument<Comment>;

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
}

export const CommentSchema = SchemaFactory.createForClass(Comment);

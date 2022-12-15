import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type PostDbTypeWithId = HydratedDocument<Post>;

@Schema()
export class Post {
  @Prop({ required: true, unique: true })
  id: string;

  @Prop({ required: true, min: 1, max: 30 })
  title: string;

  @Prop({ required: true, min: 1, max: 100 })
  shortDescription: string;

  @Prop({ required: true, min: 1, max: 1000 })
  content: string;

  @Prop({ require: true })
  userId: string;

  @Prop({ required: true })
  blogId: string;

  @Prop({ required: true })
  blogName: string | null;

  @Prop({ required: true })
  createdAt: string;

  @Prop()
  isBan: boolean;
}

export const PostSchema = SchemaFactory.createForClass(Post);

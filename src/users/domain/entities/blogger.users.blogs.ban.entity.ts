import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ id: false })
export class BloggerUsersBanInfoTypeData {
  @Prop()
  isBanned: boolean;

  @Prop()
  banDate: string;

  @Prop()
  banReason: string;
}

const BloggerUsersBanInfoTypeDataSchema = SchemaFactory.createForClass(
  BloggerUsersBanInfoTypeData,
);

export type BloggerUsersBanDocument = HydratedDocument<BloggerUsersBan>;

@Schema()
export class BloggerUsersBan {
  @Prop({ required: true, unique: true })
  id: string;

  @Prop({ required: true })
  blogId: string;

  @Prop({ required: true })
  bloggerId: string;

  @Prop({ required: true })
  banUserId: string;

  @Prop({ required: true })
  login: string;

  @Prop({ type: BloggerUsersBanInfoTypeDataSchema })
  banInfo: BloggerUsersBanInfoTypeData;
}

export const BloggerUsersBanSchema =
  SchemaFactory.createForClass(BloggerUsersBan);

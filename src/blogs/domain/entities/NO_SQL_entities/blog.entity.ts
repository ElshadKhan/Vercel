import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ id: false })
export class BlogOwnerInfo {
  @Prop({ require: true })
  userId: string;
  @Prop({ require: true })
  userLogin: string;
}
const BlogOwnerInfoSchema = SchemaFactory.createForClass(BlogOwnerInfo);

@Schema({ id: false })
export class BlogBanInfoTypeData {
  @Prop()
  isBanned: boolean;

  @Prop()
  banDate: string;
}

export const BlogBanInfoTypeDataSchema =
  SchemaFactory.createForClass(BlogBanInfoTypeData);

export type BlogDbTypeWithId = HydratedDocument<Blog>;

@Schema()
export class Blog {
  @Prop({ required: true, unique: true })
  id: string;

  @Prop({ required: true, min: 1, max: 15 })
  name: string;

  @Prop({ required: true, min: 1, max: 500 })
  description: string;

  @Prop({ required: true, min: 1, max: 100 })
  websiteUrl: string;

  @Prop({ required: true })
  createdAt: string;

  @Prop({ type: BlogOwnerInfoSchema })
  blogOwnerInfo: BlogOwnerInfo;

  @Prop({ type: BlogBanInfoTypeDataSchema })
  banInfo: BlogBanInfoTypeData;
}

export const BlogSchema = SchemaFactory.createForClass(Blog);

import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

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
}

export const BlogSchema = SchemaFactory.createForClass(Blog);

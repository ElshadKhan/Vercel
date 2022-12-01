import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type LikeDbTypeWithId = HydratedDocument<Like>;

@Schema()
export class Like {
  @Prop()
  parentId: string;
  @Prop()
  userId: string;
  @Prop()
  login: string;
  @Prop()
  type: string;
  @Prop()
  createdAt: string;
}

export const LikeSchema = SchemaFactory.createForClass(Like);

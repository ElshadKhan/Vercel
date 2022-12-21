import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type LikeDbTypeWithId = HydratedDocument<Like>;

@Schema()
export class Like {
  @Prop()
  type: string;
  @Prop()
  userId: string;
  @Prop()
  parentId: string;
  @Prop()
  login: string;
  @Prop()
  createdAt: string;
  @Prop()
  isBanned: boolean;
}

export const LikeSchema = SchemaFactory.createForClass(Like);

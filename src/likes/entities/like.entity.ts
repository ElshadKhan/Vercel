import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { LikeStatusEnam } from '../dto/like-enam.dto';

export class LikeDbType {
  constructor(
    public parentId: string,
    public userId: string,
    public login: string,
    public type: LikeStatusEnam,
    public createdAt: string,
  ) {}
}

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

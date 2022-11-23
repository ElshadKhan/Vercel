import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type SessionDbTypeWithId = HydratedDocument<Session>;

@Schema()
export class Session {
  @Prop()
  ip: string;
  @Prop()
  title: string;
  @Prop()
  lastActiveDate: string;
  @Prop()
  expiredDate: string;
  @Prop()
  deviceId: string;
  @Prop()
  userId: string;
}

export const SessionSchema = SchemaFactory.createForClass(Session);

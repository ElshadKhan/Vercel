import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type IpDbType = HydratedDocument<Ip>;

@Schema()
export class Ip {
  @Prop()
  ip: string;
  @Prop()
  endpoint: string;
  @Prop()
  connectionAt: number;
  @Prop()
  isBlocked: boolean;
  @Prop()
  blockedDate: number | null;
}

export const IpSchema = SchemaFactory.createForClass(Ip);

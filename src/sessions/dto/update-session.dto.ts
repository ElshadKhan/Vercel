import { PartialType } from '@nestjs/mapped-types';
import { SessionDto } from './session.dto';

export class UpdateSessionDto extends PartialType(SessionDto) {}

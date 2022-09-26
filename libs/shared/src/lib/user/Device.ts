import { IsOptional, Length } from "class-validator";

export type DeviceInfo = {
  ip?: string;
  firstConnection?: Date;
  lastConnection?: Date;
  os?: string;
  language: string;
  agent: string;
}

export class Device {

  ip?: string;
  firstConnection: Date;
  lastConnection: Date;
  os: string;
  language: string;
  agent: string;

  constructor(info: DeviceInfo) {
    this.ip = info.ip;
    this.firstConnection = info.firstConnection ?? new Date();
    this.lastConnection = info.lastConnection ?? new Date();
    this.os = info.os ?? 'unknown';
    this.agent = info.agent;
    this.language = info.language;
  }

}

export class DeviceBody {
  @Length(2, 256)
  agent: string;

  @Length(2, 256)
  os: string;

  @IsOptional()
  language?: string;

  constructor(agent: string, os: string, language: string) {
    this.agent = agent;
    this.os = os;
    this.language = language;
  }
}

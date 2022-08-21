export type DeviceInfo = {
  ip?: string;
  location?: string;
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

export class AddDeviceBody {
  agent: string;
  os: string;
  language?: string;

  constructor(agent: string, os: string, language: string) {
    this.agent = agent;
    this.os = os;
    this.language = language;
  }
}

declare module 'react-native-androidtv-remote' {
  export type AndroidRemoteCertificate = {
    key?: string;
    cert?: string;
    androidKeyStore?: string;
    certAlias?: string;
    keyAlias?: string;
  };

  export type AndroidRemoteOptions = {
    pairing_port?: number;
    remote_port?: number;
    service_name?: string;
    systeminfo?: { manufacturer: string; model: string };
    cert?: AndroidRemoteCertificate;
  };

  export class AndroidRemote {
    constructor(host: string, options: AndroidRemoteOptions);
    start(): Promise<boolean | void>;
    stop(): void;
    sendPairingCode(code: string): Promise<boolean>;
    cancelPairing(): void;
    sendPower(): void;
    sendAppLink(appLink: string): void;
    sendKey(key: number, direction: number): void;
    getCertificate(): { key?: string; cert?: string };
    on(event: 'secret', listener: () => void): this;
    on(event: 'ready', listener: () => void): this;
    on(event: 'powered', listener: (powered: boolean) => void): this;
    on(event: 'unpaired', listener: () => void): this;
    on(event: 'volume', listener: (volume: unknown) => void): this;
    on(event: 'current_app', listener: (appPackage: string) => void): this;
    on(event: 'error', listener: (error: unknown) => void): this;
  }

  export const RemoteKeyCode: Record<string, number>;
  export const RemoteDirection: Record<string, number>;
}

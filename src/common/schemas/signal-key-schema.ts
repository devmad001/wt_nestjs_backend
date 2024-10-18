import { Prop } from '@nestjs/mongoose';

export class IdentityKey {
  @Prop()
  publicKey: string;

  @Prop()
  privateKey: string;
}

export class SignalPreKey {
  @Prop()
  keyId: number;

  @Prop()
  publicKey: string;
}

export class SignalSignedPreKey {
  @Prop()
  keyId: number;

  @Prop()
  publicKey: string;

  @Prop()
  privateKey: string;

  @Prop()
  signature: string;
}

export class SignalKeysSchema {
  @Prop()
  identityKey: IdentityKey;

  @Prop()
  preKey: SignalPreKey;

  @Prop()
  privateKey: string;

  @Prop()
  registrationId: number;

  @Prop()
  signedPreKey: SignalSignedPreKey;
}

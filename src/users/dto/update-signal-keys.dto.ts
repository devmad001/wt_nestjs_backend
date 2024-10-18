import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class UpdateSignalKeys {
  @ApiProperty({
    example: '{"publicKey":"abc","privateKey":"abc"}',
    description: 'IdentityKey',
  })
  @IsNotEmpty()
  identityKey: any;

  @ApiProperty({
    example: '{"keyId":123,"publicKey":"abc","privateKey":"abc"}',
    description: 'PreKey',
  })
  @IsNotEmpty()
  preKey: any;

  @ApiProperty({
    example: 123,
    description: 'RegistrationId',
  })
  @IsNotEmpty()
  registrationId: number;

  @ApiProperty({
    example:
      '{"keyId":123,"publicKey":"abc","privateKey":"abc","signature":"xyz"}',
    description: 'SignedPreKey',
  })
  @IsNotEmpty()
  signedPreKey: any;
}

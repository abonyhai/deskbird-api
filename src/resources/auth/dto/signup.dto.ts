import { ApiProjectProperty } from 'src/shared/decorators/property';

export class SignupDto {
  @ApiProjectProperty({
    example: 'user@deskbird.com',
    description: 'User email',
  })
  email: string;

  @ApiProjectProperty({ example: 'password123', description: 'User password' })
  password: string;

  @ApiProjectProperty({ example: 'John Doe', description: 'Full name' })
  fullName: string;
}

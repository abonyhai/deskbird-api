import {
  ApiProjectProperty,
  ApiProjectEnumProperty,
  ApiProjectOptionalProperty,
} from 'src/shared/decorators/property';
import { UserRole } from '../user.enum';

export class CreateUserDto {
  @ApiProjectProperty({
    example: 'user@deskbird.com',
    description: 'User email',
  })
  email: string;

  @ApiProjectProperty({
    example: 'password123',
    description: 'User password',
  })
  password: string;

  @ApiProjectProperty({
    example: 'John Doe',
    description: 'Full name',
  })
  fullName: string;

  @ApiProjectEnumProperty(UserRole, {
    example: UserRole.USER,
    description: 'User role',
  })
  role: UserRole;

  @ApiProjectOptionalProperty({
    example: 'hashed-refresh-token',
    description: 'Hashed refresh token',
  })
  refreshToken?: string;
}

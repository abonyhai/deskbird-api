import {
  ApiProjectOptionalProperty,
  ApiProjectOptionalEnumProperty,
} from 'src/shared/decorators/property';
import { UserRole } from '../user.enum';

export class UpdateUserDto {
  @ApiProjectOptionalProperty({
    example: 'user@deskbird.com',
    description: 'User email',
  })
  email?: string;

  @ApiProjectOptionalProperty({
    example: 'password123',
    description: 'User password',
  })
  password?: string;

  @ApiProjectOptionalProperty({
    example: 'John Doe',
    description: 'Full name',
  })
  fullName?: string;

  @ApiProjectOptionalEnumProperty(UserRole, {
    example: UserRole.USER,
    description: 'User role',
  })
  role?: UserRole;
}

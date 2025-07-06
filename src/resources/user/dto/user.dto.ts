import {
  ApiProjectProperty,
  ApiProjectEnumProperty,
} from 'src/shared/decorators/property';
import { UserRole } from '../utils/user.enum';

export class UserDto {
  @ApiProjectProperty({
    example: 1,
    description: 'User ID',
  })
  id: number;

  @ApiProjectProperty({
    example: 'admin@deskbird.com',
    description: 'User email',
  })
  email: string;

  @ApiProjectProperty({
    example: 'Admin User',
    description: 'Full name',
  })
  fullName: string;

  @ApiProjectEnumProperty(UserRole, {
    example: UserRole.ADMIN,
    description: 'User role',
  })
  role: UserRole;
}

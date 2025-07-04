import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import {
  ApiProjectProperty,
  ApiProjectEnumProperty,
} from '../../../shared/decorators/property';
import { UserRole } from '../utils/user.enum';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  @ApiProjectProperty({
    example: 1,
    description: 'User ID',
  })
  id: number;

  @Column({ unique: true })
  @ApiProjectProperty({
    example: 'admin@deskbird.com',
    description: 'User email',
  })
  email: string;

  @Column()
  @ApiProjectProperty({
    example: 'hashedpassword',
    description: 'Hashed password',
  })
  password: string;

  @Column()
  @ApiProjectProperty({
    example: 'Admin User',
    description: 'Full name',
  })
  fullName: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
  @ApiProjectEnumProperty(UserRole, {
    example: UserRole.ADMIN,
    description: 'User role',
  })
  role: UserRole;

  @Column({ nullable: true })
  refreshToken?: string;
}

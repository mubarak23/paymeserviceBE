import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

import { UserRole } from '../enum/user-role.enum';

@Entity({ name: 'User' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  emailAddress: string;

  @Column()
  password: string;

  @Column()
  role: string;
  default: UserRole.NORMAL;
}

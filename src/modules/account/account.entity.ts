import { Length } from 'class-validator';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  DeleteDateColumn,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';

@Entity({ name: 'account' })
export class AccountEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, update: false })
  @Length(8)
  username: string;

  @Column()
  @Length(8)
  password: string;

  @CreateDateColumn()
  createdDate: Date;
  @Column({ default: 'system' })
  createdBy: string;

  @UpdateDateColumn()
  updatedDate: Date;
  @Column({ default: 'system' })
  updatedBy: string;

  @DeleteDateColumn({ nullable: true })
  deletedDate?: Date;
  @Column({ nullable: true })
  deletedBy?: string;

  @VersionColumn()
  version: number;

  @Column({ default: true })
  isActive: boolean;
}

import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 500 })
  name: string;
  
  @Column({ type: 'varchar', length: 255 })
  password: string;

  @Column({ type: 'boolean' })
  password_verified: boolean;

  @Column({ type: 'simple-array' })
  roles: string[];
  @Column({
    type: string,
    
  })
  email: string;
}

email: {
    type: String,
    required: true, // 'Email address is required'
    minlength: 5,
    maxlength: 255,
    trim: true,
    lowercase: true,
    unique: true,
    validate: [validateEmail, 'Please fill a valid email address'],
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please fill a valid email address',
    ],
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    maxlength: 1024,
  },

  verified: {
    required: true,
    type: Boolean,
    default: false,
  },

  roles: [
    {
      type: String,
      required: false,
      enum: RolesEnum,
      default: [RolesEnum.USER],
    },
  ],

  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
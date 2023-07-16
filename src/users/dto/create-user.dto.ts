import { Roles, RolesEnum } from 'src/common/decorators/roles.decorator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, MinLength, Validate } from 'class-validator';
import { IsExist } from 'src/common/validators/is-exists.validator';
import { IsNotExist } from 'src/common/validators/is-not-exists.validator';

export class CreateUserDto {
  @IsNotEmpty()
  @MinLength(3)
  username: string;

  @ApiProperty()
  @MinLength(6)
  @IsNotEmpty()
  password?: string;

  @ApiProperty({ example: 'test1@example.com' })
  @Transform(({ value }) => value?.toLowerCase().trim())
  @IsNotEmpty()
  @Validate(IsNotExist, ['User'], {
    message: 'emailAlreadyExists',
  })
  @IsEmail()
  email: string | null;

  @ApiProperty({ type: Roles })
  @Validate(IsExist, ['Role', 'id'], {
    message: 'roleNotExists',
  })
  roles?: string[] | null;
}

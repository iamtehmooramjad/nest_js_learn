import { IsString, Matches, Max, Min } from 'class-validator';

export class AuthCredentialsDto {
  @IsString()
  @Min(4)
  @Max(20)
  username: string;

  @IsString()
  @Min(8)
  @Max(32)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'Password must have at least one uppercase, one lowercase, one number and special character',
  })
  password: string;
}

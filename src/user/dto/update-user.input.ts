import { IsEmail, IsString, IsNotEmpty } from 'class-validator';
import { Field, InputType } from 'type-graphql';
import { UserRoles } from '../../shared/user-roles';

@InputType()
export class UpdateUserInput {
  @Field({ nullable: true })
  @IsEmail()
  email?: string;
  @Field({ nullable: true })
  @IsString()
  @IsNotEmpty()
  password?: string;
  @Field({ nullable: true })
  @IsString()
  @IsNotEmpty()
  userRole?: UserRoles;
}

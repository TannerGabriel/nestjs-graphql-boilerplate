import { IsEmail, IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { Field, InputType } from 'type-graphql';
import { UserRoles } from '../../shared/user-roles';

@InputType()
export class UpdateUserInput {
  @Field({ nullable: true })
  @IsEmail()
  @IsOptional()
  email?: string;
  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  password?: string;
  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  userRole?: UserRoles;
}

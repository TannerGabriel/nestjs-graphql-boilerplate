import { IsString, IsEmail, IsNotEmpty, IsOptional } from 'class-validator';
import { Field, ObjectType } from 'type-graphql';
import { UserRoles } from '../shared/user-roles';

@ObjectType()
export class UserType {
  @Field()
  @IsEmail()
  email: string;
  @Field()
  @IsString()
  @IsNotEmpty()
  password: string;
  @Field()
  @IsOptional()
  userRole: UserRoles;
}

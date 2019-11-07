import { IsString, IsEmail, IsNotEmpty } from 'class-validator';
import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export class UserType {
  @Field()
  @IsEmail()
  email: string;
  @Field()
  @IsString()
  @IsNotEmpty()
  password: string;
}

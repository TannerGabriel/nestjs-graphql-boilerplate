import { IsString, IsEmail, IsNotEmpty } from 'class-validator';
import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export class AuthType {
  @Field()
  @IsEmail()
  email: string;
  @Field()
  @IsString()
  @IsNotEmpty()
  token: string;
}

import { IsString, IsEmail, IsNotEmpty } from 'class-validator';
import { Field, InputType } from 'type-graphql';

@InputType()
export class CreateUserInput {
  @Field()
  @IsEmail()
  email: string;
  @Field()
  @IsString()
  @IsNotEmpty()
  password: string;
}

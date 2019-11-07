import { IsEmail, IsString, IsNotEmpty } from 'class-validator';
import { Field, InputType } from 'type-graphql';

@InputType()
export class UpdateUserInput {
  @Field({ nullable: true })
  @IsEmail()
  email?: string;
  @Field({ nullable: true })
  @IsString()
  @IsNotEmpty()
  password?: string;
}

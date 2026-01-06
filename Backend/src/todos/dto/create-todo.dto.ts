import { IsString, MinLength } from 'class-validator';

export class CreateTodoDto {
  @IsString()
  @MinLength(1, { message: 'title must not be empty' })
  title!: string;
}
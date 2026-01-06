import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Delete,
  Query,
} from '@nestjs/common';
import { TodosService } from './todos.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';

@Controller('api/todos')
export class TodosController {
  constructor(private readonly service: TodosService) {}


  @Get()
  findAll(@Query('search') search?: string) {
    return this.service.findAll(search);
  }

  @Get('search')
  legacySearch(@Query('title') title?: string) {
    return this.service.findAll(title);
  }

  @Post()
  create(@Body() dto: CreateTodoDto) {
    return this.service.create(dto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateTodoDto) {
    return this.service.update(Number(id), dto);
  }

  @Patch(':id')
  toggle(@Param('id') id: string) {
    return this.service.toggle(Number(id));
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.service.delete(Number(id));
  }
}

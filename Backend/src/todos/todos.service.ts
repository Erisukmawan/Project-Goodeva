import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';

export interface Todo {
  id: number;
  title: string;
  completed: boolean;
  deleted: boolean;
}

@Injectable()
export class TodosService {
  private todos: Todo[] = [];
  private idCounter = 1;

  findAll(search?: string): Todo[] {
    const activeTodos = this.todos.filter((t) => !t.deleted);

    if (!search) return activeTodos;

    const q = search.toLowerCase();
    return activeTodos.filter((t) => t.title.toLowerCase().includes(q));
  }

  create(dto: CreateTodoDto): Todo {
    const todo: Todo = {
      id: this.idCounter++,
      title: dto.title,
      completed: false,
      deleted: false,
    };
    this.todos.push(todo);
    return todo;
  }

  update(id: number, dto: UpdateTodoDto): Todo {
    const todo = this.todos.find((t) => t.id === id && !t.deleted);
    if (!todo) throw new NotFoundException('Todo not found');

    Object.assign(todo, dto);
    return todo;
  }

  toggle(id: number): Todo {
    const todo = this.todos.find((t) => t.id === id && !t.deleted);
    if (!todo) throw new NotFoundException('Todo not found');

    todo.completed = !todo.completed;
    return todo;
  }

  delete(id: number) {
    const todo = this.todos.find((t) => t.id === id && !t.deleted);
    if (!todo) throw new NotFoundException('Todo not found');

    todo.deleted = true;
    return { message: 'Todo deleted' };
  }
}

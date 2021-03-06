import { Controller, Get, Post, Body, Param, Delete, Patch, Query, UsePipes, ValidationPipe, ParseIntPipe, UseGuards } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TaskStatus } from './task-status.enum';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetFilteredTasksDto } from './dto/get-filtered-tasks.dto';
import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipe';
import { Task } from './task.entity';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
    constructor(private tasksService: TasksService) {}

    @Get()
    public getTasks(
        @Query(ValidationPipe) getFilteredTasksDto: GetFilteredTasksDto,
        @GetUser() user: User
    ): Promise<Task[]> {
        return this.tasksService.getAllTasks(getFilteredTasksDto, user);
    }

    @Get('/:id')
    public getTask(
        @Param('id', ParseIntPipe) id: number,
        @GetUser() user: User
    ): Promise<Task> {
        return this.tasksService.getTask(id, user);
    }

    @Post()
    @UsePipes(ValidationPipe)
    public createTask(
        @Body() createTaskDto: CreateTaskDto,
        @GetUser() user: User
    ): Promise<Task> {
        return this.tasksService.createTask(createTaskDto, user);
    }

    @Patch('/:id/status')
    public updateTaskStatus(
        @Param('id', ParseIntPipe) id: number,
        @Body('status', TaskStatusValidationPipe) status: TaskStatus,
        @GetUser() user: User
    ): Promise<Task> {
        return this.tasksService.updateTaskStatus(id, status, user);
    }

    @Delete('/:id')
    public deleteTask(
        @Param('id', ParseIntPipe) id: number,
        @GetUser() user: User
    ) {
        return this.tasksService.deleteTask(id, user);
    }
}

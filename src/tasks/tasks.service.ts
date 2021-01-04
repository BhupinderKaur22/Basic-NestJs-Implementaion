import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './task-status.enum';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetFilteredTasksDto } from './dto/get-filtered-tasks.dto';
import { Task } from './task.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskRepository } from './task.repository';
import { User } from 'src/auth/user.entity';

@Injectable()
export class TasksService {

    constructor(
        @InjectRepository(TaskRepository)
        private taskRepository: TaskRepository 
    ) {}

    public getAllTasks(
        getFilteredTasksDto: GetFilteredTasksDto,
        user: User
    ): Promise<Task[]> {
        return this.taskRepository.getTasks(getFilteredTasksDto, user);
    }

    public async getTask(
        id: number,
        user: User
    ): Promise<Task> {
        const found = await this.taskRepository.findOne({ where: {id, userId: user.id} });
        if (!found) {
            throw new NotFoundException(
                `The Task with ID '${id}' was not found! Please try with a valid Task ID!`
            );
        }
        return found;
    }

    // public getFilteredTasks(getFilteredTasksDto: GetFilteredTasksDto): Task[] {
    //     const {status, searchTerm} = getFilteredTasksDto;
    //     let tasks = this.tasks;

    //     if (status) {
    //         tasks = tasks.filter(task => task.status === status);
    //     }

    //     if (searchTerm) {
    //         tasks = tasks.filter(task => 
    //             task.name.includes(searchTerm) ||
    //             task.description.includes(searchTerm)
    //         );
    //     }

    //     return tasks;
    // }

    public async createTask(
        createTaskDto: CreateTaskDto,
        user: User): Promise<Task> {
        return this.taskRepository.createTask(createTaskDto, user);
    }

    public async updateTaskStatus(
        id: number,
        status: TaskStatus,
        user: User
    ): Promise<Task> {
        const task = await this.getTask(id, user);
        task.status = status;
        await task.save();

        return task;
    }

    // public updateStatus(
    //     id: string,
    //     status: TaskStatus
    // ): Task {
    //     // let convertedStatus: TaskStatus;
    //     // switch(status) {
    //     //     case 'OPEN':        convertedStatus = TaskStatus.OPEN;
    //     //                         break;
    //     //     case 'IN_PROGRESS': convertedStatus = TaskStatus.IN_PROGRESS;
    //     //                         break;
    //     //     case 'COMPLETED':   convertedStatus = TaskStatus.COMPLETED;
    //     //                         break;
    //     //     deafult:            convertedStatus = TaskStatus.OPEN;    
    //     // };
    //     // const task = this.tasks.find(task => task.id === id);
    //     // task.status = convertedStatus;

    //     // this.tasks = this.tasks.filter(task => task.id !== id);
    //     // this.tasks.push(task);

    //     // this.tasks.map(task => {
    //     //     if (task.id === id) {
    //     //         task.status = status;
    //     //         return task;
    //     //     }
    //     // });
    //     // const task = this.tasks.find(task => task.id === id);
    //     const task = this.getTask(id);
    //     task.status = status;

    //     return task;
    // }

    public async deleteTask(
        id: number,
        user: User
    ): Promise<void> {
         const result = await this.taskRepository.delete({ id, userId: user.id });

         if(!result.affected) {
            throw new NotFoundException(
                `The Task with ID '${id}' was not found! Please try with a valid Task ID!`
            );
         }
    }
}

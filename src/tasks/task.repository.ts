import { Repository, EntityRepository } from "typeorm";
import { Task } from "./task.entity";
import { CreateTaskDto } from "./dto/create-task.dto";
import { TaskStatus } from "./task-status.enum";
import { GetFilteredTasksDto } from "./dto/get-filtered-tasks.dto";
import { User } from "src/auth/user.entity";

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {

    public async getTasks(
        getFilteredTasksDto: GetFilteredTasksDto,
        user: User
    ): Promise<Task[]> {
        const { status, searchTerm} = getFilteredTasksDto;
        const query = this.createQueryBuilder('task');

        query.where('task.userId = :userId', { userId: user.id })
        if (status) {
            query.andWhere('task.status = :status', { status });
        }

        if (searchTerm) {
            query.andWhere(
                '(task.name LIKE :searchTerm OR task.description LIKE :searchTerm)',
                { searchTerm: `%${searchTerm}%` })
        }

        const results = await query.getMany();
        return results;
    }

    public async createTask(
        createTaskDto: CreateTaskDto,
        user: User
    ): Promise<Task> {
        const { name, description } = createTaskDto;

        const task = new Task();
        task.name = name;
        task.description = description;
        task.status = TaskStatus.OPEN;
        task.user = user;
        await task.save();

        delete task.user;
        return task;
    }

}
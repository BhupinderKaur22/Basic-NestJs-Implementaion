import { TaskStatus } from "../task-status.enum";
import { IsNotEmpty, IsOptional, IsIn } from 'class-validator';

export class GetFilteredTasksDto {
    @IsOptional()
    @IsIn([TaskStatus.OPEN, TaskStatus.IN_PROGRESS, TaskStatus.COMPLETED])
    status: TaskStatus;

    @IsOptional()
    @IsNotEmpty()
    searchTerm: string;
}
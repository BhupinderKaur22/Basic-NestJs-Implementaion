import { PipeTransform, BadRequestException } from "@nestjs/common";
import { TaskStatus } from '../task-status.enum'

export class TaskStatusValidationPipe implements PipeTransform {

    private readonly allowedStatuses = [
        TaskStatus.OPEN,
        TaskStatus.IN_PROGRESS,
        TaskStatus.COMPLETED
    ];

    public transform(value: any) {
        value = value.toUpperCase();
        if (!this.isValidStatus(value)) {
            throw new BadRequestException(`'${value}' is not a Valid Task Status!`);
        }
        return value;
    }

    private isValidStatus(value: any): boolean {
        const index = this.allowedStatuses.indexOf(value);
        return index !== -1;
    }
}
import { DataSource, EntityRepository, Repository } from 'typeorm';
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/tasks.dto';
import { TaskStatus } from './task-status.enum';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TasksRepository extends Repository<Task> {
  constructor(private dataSource: DataSource) {
    super(Task, dataSource.createEntityManager());
  }

  async getTasks(taskFilterDto: GetTasksFilterDto): Promise<Task[]> {
    const { status, search } = taskFilterDto;
    const query = this.createQueryBuilder('task');

    if (status) {
      query.andWhere('task.status =: status', { status });
    }

    if (search) {
      query.andWhere(
        'LOWER(task.title) LIKE LOWER(:title) OR LOWER(task.description) LIKE LOWER(:description)',
        {
          search: `%${search}%`,
        },
      );
    }
    const tasks = query.getMany();
    return tasks;
  }

  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    const { title, description } = createTaskDto;
    const task = this.create({
      title,
      description,
      status: TaskStatus.OPEN,
    });
    await this.save(task);
    return task;
  }
}

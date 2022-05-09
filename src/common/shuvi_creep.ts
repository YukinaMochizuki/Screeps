export class ShuviCreep {
  public creep: Creep;
  private isTaskChange: boolean;

  public constructor(creep: Creep) {
    this.creep = creep;
    this.isTaskChange = false;

    if (this.creep.memory.task === undefined) {
      this.initMemory();
    }
  }

  public initMemory(): void {
    this.creep.memory.task = "";
    this.creep.memory.stage = "";
    this.creep.memory.taskContext = "";
  }

  public getTaskName(): string {
    return this.creep.memory.task;
  }

  public getStage(): string {
    return this.creep.memory.stage;
  }

  public getTaskContext(): string {
    return this.creep.memory.taskContext;
  }

  public setTaskName(taskName: string): void {
    this.creep.memory.task = taskName;
    this.isTaskChange = true;
  }

  public setStage(stage: string): void {
    this.creep.memory.stage = stage;
    if (this.isTaskChange) {
      this.creep.say(`${this.creep.memory.task}-${this.creep.memory.stage}`);
    } else {
      this.creep.say(`${this.creep.memory.stage}`);
    }
  }

  public setTaskContext(taskContext: string): void {
    this.creep.memory.taskContext = taskContext;
  }
}

import { AbstractComponent } from "manager/abc_component";
import { AbstractTask } from "common/abc_task";
import { CreepExector } from "./creep_exector";
import { ShuviCreep } from "common/shuvi_creep";

export class TaskManager extends AbstractComponent {
  private creepExector: CreepExector;
  private debug: boolean;

  public constructor(debug = false) {
    super("TaskManager");
    this.debug = debug;
    this.creepExector = new CreepExector(debug);
  }

  public execute(creeps: ShuviCreep[], tasks: AbstractTask[]): void {
    const taskExistCreeps: ShuviCreep[] = [];
    const executedTasks: AbstractTask[] = [];

    if (this.debug) {
      console.log("============== [TaskManager] Starting Execute Task ==============");
      console.log("Filtering tasks...");
      console.log("Executing task exist creeps...");
    }

    const [tasksNotExcute, taskNotExistCreeps] = this.filterNotExistTasksAndExecuteTaskExistCreeps(creeps, tasks);

    if (this.debug) {
      console.log("Executing tasks that no excute...");
      console.log(`[TaskManager]: Not execute tasks: ${tasksNotExcute.map(task => task.name).join(",")}`);
      console.log(`[TaskManager]: No task creeps: ${taskNotExistCreeps.map(creep => creep.creep.name).join(",")}`);
      console.log("Erase task not exist creeps...");
    }

    taskNotExistCreeps.forEach(creep => {
      creep.initMemory();
    });

    tasksNotExcute.forEach(task => {
      const otherCreeps = _.difference(taskNotExistCreeps, taskExistCreeps);
      const creep = this.getHighestCreep(task, otherCreeps);
      if (creep) {
        if (this.debug) {
          console.log(`[TaskManager]: execute creep: ${creep.creep.name}, task: ${task.name}`);
        }

        taskExistCreeps.push(creep);
        executedTasks.push(task);
        this.creepExector.execute(creep, task, true);
      }
    });

    if (this.debug) {
      const stillExecuteTasks = _.difference(tasks, tasksNotExcute);
      const notExecutedTasks = _.difference(tasksNotExcute, executedTasks);
      const stillExecuteCreeps = _.difference(creeps, taskNotExistCreeps);
      const otherCreeps = _.difference(taskNotExistCreeps, taskExistCreeps);

      console.log("============== [TaskManager] Dashboard ==============");
      console.log(`[TaskManager]: Still execute tasks: ${stillExecuteTasks.map(task => task.name).join(",")}`);
      console.log(`[TaskManager]: New execute tasks: ${executedTasks.map(task => task.name).join(",")}`);
      console.log(`[TaskManager]: Not execute tasks: ${notExecutedTasks.map(task => task.name).join(",")}`);
      console.log(
        `[TaskManager]: Still execute creeps: ${stillExecuteCreeps.map(creep => creep.creep.name).join(",")}`
      );
      console.log(`[TaskManager]: Not execute creeps: ${otherCreeps.map(creep => creep.creep.name).join(",")}`);
      console.log("============== [TaskManager] End Execute Task ==============");
    }
  }

  public getHighestCreep(task: AbstractTask, creeps: ShuviCreep[]): ShuviCreep | null {
    let highestCreep: ShuviCreep | null = null;
    let highestPoint = 0;
    creeps.forEach(creep => {
      const point = task.creepReview(creep);
      if (point > highestPoint) {
        highestPoint = point;
        highestCreep = creep;
      }
    });
    return highestCreep;
  }

  public filterNotExistTasksAndExecuteTaskExistCreeps(
    creeps: ShuviCreep[],
    tasks: AbstractTask[]
  ): [AbstractTask[], ShuviCreep[]] {
    const taskExistCreeps: ShuviCreep[] = [];

    const target: AbstractTask[] = tasks.filter(task => {
      const otherCreeps = _.difference(creeps, taskExistCreeps);
      const creep = otherCreeps.find(
        value => value.getTaskName() === task.name && task.isEqual(value.getTaskContext())
      );
      if (creep) {
        taskExistCreeps.push(creep);
        this.creepExector.execute(creep, task, false);
        return false;
      } else return true;
    });
    return [target, _.difference(creeps, taskExistCreeps)];
  }
}

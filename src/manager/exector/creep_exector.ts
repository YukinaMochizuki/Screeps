import { AbstractTask } from "common/abc_task";
import { ShuviCreep } from "common/shuvi_creep";

export class CreepExector {
  public debug: boolean;
  public constructor(debug = false) {
    this.debug = debug;
  }

  public execute<T extends AbstractTask>(creep: ShuviCreep, task: T, isInit: boolean): void {
    if (this.debug) {
      console.log(`[CreepExector]: Execute creep: ${creep.creep.name}, task: ${task.name}`);
      console.log(`[CreepExector]: Task context: ${task.serialize()}, isInit: ${String(isInit)}`);
      if (!isInit) {
        console.log(`[CreepExector]: Task stage: ${creep.getStage()}`);
      }
    }

    if (isInit) {
      try {
        creep.initMemory();
        const parser = task.getParser();
        parser.prepare(creep);
        creep.setTaskName(task.name);
        creep.setTaskContext(task.serialize());
      } catch (e) {
        if (!this.debug) {
          console.log(
            `[CreepExector]: Execute creep: ${creep.creep.name} task: ${
              task.name
            } error and task context is ${task.serialize()}`
          );
        }
        console.log(e);
      }
    } else {
      try {
        const parser = task.getParser();
        parser.call(creep.getStage(), creep);
      } catch (e) {
        if (!this.debug) {
          console.log(
            `[CreepExector]: Execute creep: ${creep.creep.name} task: ${
              task.name
            } error and task context is ${task.serialize()}`
          );
        }
        console.log(e);
      }
    }
  }
}

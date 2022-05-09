import { AbstractParser } from "common/abc_parser";
import { BasicBuilderTask } from "common/task/creep/basic/builder";
import { ShuviCreep } from "common/shuvi_creep";

export class BasicBuilderParser extends AbstractParser {
  private basicBuilderTask: BasicBuilderTask;

  public constructor(basicBuilderTask: BasicBuilderTask) {
    super();
    this.basicBuilderTask = basicBuilderTask;
  }

  public prepare(shuviCreep: ShuviCreep): void {
    if (shuviCreep.creep.store.getUsedCapacity(RESOURCE_ENERGY) === 0) {
      shuviCreep.setStage("transfer");
      this.transfer(shuviCreep);
    } else {
      shuviCreep.setStage("build");
      this.build(shuviCreep);
    }
  }

  public call(methodName: string, shuviCreep: ShuviCreep): void {
    if (methodName === "transfer") {
      this.transfer(shuviCreep);
    } else if (methodName === "build") {
      this.build(shuviCreep);
    }
  }

  public transfer(shuviCreep: ShuviCreep): void {
    const creep = shuviCreep.creep;
    const source = this.basicBuilderTask.source;

    if (creep.store.getUsedCapacity(RESOURCE_ENERGY) > 0) {
      shuviCreep.setStage("build");
      this.build(shuviCreep);
    }

    if (creep.withdraw(source, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
      creep.moveTo(source);
    }
  }

  public build(shuviCreep: ShuviCreep): void {
    const creep = shuviCreep.creep;

    if (creep.store.getUsedCapacity(RESOURCE_ENERGY) === 0) {
      shuviCreep.setStage("transfer");
      this.transfer(shuviCreep);
    }

    if (creep.build(this.basicBuilderTask.target) === ERR_NOT_IN_RANGE) {
      creep.moveTo(this.basicBuilderTask.target);
    }
  }
}

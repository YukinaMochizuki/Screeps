import { AbstractParser } from "common/abc_parser";
import { BasicRepairTask } from "common/task/creep/basic/repair";
import { ShuviCreep } from "common/shuvi_creep";

export class BasicRepairParser extends AbstractParser {
  private basicRepairTask: BasicRepairTask;

  public constructor(basicRepairTask: BasicRepairTask) {
    super();
    this.basicRepairTask = basicRepairTask;
  }

  public prepare(shuviCreep: ShuviCreep): void {
    if (shuviCreep.creep.store.getUsedCapacity(RESOURCE_ENERGY) === 0) {
      shuviCreep.setStage("transfer");
      this.transfer(shuviCreep);
    } else {
      shuviCreep.setStage("repair");
      this.repair(shuviCreep);
    }
  }

  public call(methodName: string, shuviCreep: ShuviCreep): void {
    if (methodName === "transfer") {
      this.transfer(shuviCreep);
    } else if (methodName === "repair") {
      this.repair(shuviCreep);
    }
  }

  public transfer(shuviCreep: ShuviCreep): void {
    const creep = shuviCreep.creep;
    const source = this.basicRepairTask.source;

    if (creep.store.getUsedCapacity(RESOURCE_ENERGY) > 0) {
      shuviCreep.setStage("repair");
      this.repair(shuviCreep);
    }

    if (creep.withdraw(source, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
      creep.moveTo(source);
    }
  }

  public repair(shuviCreep: ShuviCreep): void {
    const creep = shuviCreep.creep;
    const target = this.basicRepairTask.target;

    if (creep.store.getUsedCapacity(RESOURCE_ENERGY) === 0) {
      shuviCreep.setStage("transfer");
      this.transfer(shuviCreep);
    }

    if (creep.repair(target) === ERR_NOT_IN_RANGE) {
      creep.moveTo(target);
    }
  }
}

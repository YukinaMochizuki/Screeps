import { AbstractParser } from "common/abc_parser";
import { BasicTransferTask } from "common/task/creep/basic/tranfer";
import { ShuviCreep } from "common/shuvi_creep";

export class BasicTransferParser extends AbstractParser {
  public basicTransferTask: BasicTransferTask;

  public constructor(basicTransferTask: BasicTransferTask) {
    super();
    this.basicTransferTask = basicTransferTask;
  }

  public prepare(shuviCreep: ShuviCreep): void {
    const creep = shuviCreep.creep;

    if (creep.store.getUsedCapacity(RESOURCE_ENERGY) === 0) {
      shuviCreep.setStage("getEnergy");
      this.getEnergy(shuviCreep);
    } else {
      shuviCreep.setStage("transfer");
      this.transfer(shuviCreep);
    }
  }

  public call(methodName: string, shuviCreep: ShuviCreep): void {
    if (methodName === "transfer") {
      this.transfer(shuviCreep);
    } else if (methodName === "getEnergy") {
      this.getEnergy(shuviCreep);
    }
  }

  public transfer(shuviCreep: ShuviCreep): void {
    const creep = shuviCreep.creep;
    const target = this.basicTransferTask.target;

    if (creep.store.getUsedCapacity(RESOURCE_ENERGY) === 0) {
      shuviCreep.setStage("getEnergy");
      this.getEnergy(shuviCreep);
    }

    if (creep.transfer(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
      creep.moveTo(target);
    }
  }

  public getEnergy(shuviCreep: ShuviCreep): void {
    const creep = shuviCreep.creep;
    const source = this.basicTransferTask.source;

    if (creep.store.getUsedCapacity(RESOURCE_ENERGY) > 0) {
      shuviCreep.setStage("transfer");
      this.transfer(shuviCreep);
    }

    if (creep.withdraw(source, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
      creep.moveTo(source);
    }
  }
}

import { AbstractParser } from "common/abc_parser";
import { BasicUpgradeTask } from "common/task/creep/basic/upgrade";
import { ShuviCreep } from "common/shuvi_creep";

export class BasicUpgradeParser extends AbstractParser {
  private basicUpgradeTask: BasicUpgradeTask;

  public constructor(basicUpgradeTask: BasicUpgradeTask) {
    super();
    this.basicUpgradeTask = basicUpgradeTask;
  }

  public prepare(shuviCreep: ShuviCreep): void {
    if (shuviCreep.creep.store.getUsedCapacity(RESOURCE_ENERGY) === 0) {
      shuviCreep.setStage("transfer");
      this.transfer(shuviCreep);
    } else {
      shuviCreep.setStage("upgrade");
      this.upgrade(shuviCreep);
    }
  }

  public call(methodName: string, shuviCreep: ShuviCreep): void {
    if (methodName === "transfer") {
      this.transfer(shuviCreep);
    } else if (methodName === "upgrade") {
      this.upgrade(shuviCreep);
    }
  }

  public upgrade(shuviCreep: ShuviCreep): void {
    const creep = shuviCreep.creep;
    const target = this.basicUpgradeTask.target;

    if (creep.store.getUsedCapacity(RESOURCE_ENERGY) === 0) {
      shuviCreep.setStage("transfer");
      this.transfer(shuviCreep);
    }

    if (creep.upgradeController(target) === ERR_NOT_IN_RANGE) {
      creep.moveTo(target);
    }
  }

  public transfer(shuviCreep: ShuviCreep): void {
    const creep = shuviCreep.creep;
    const source = this.basicUpgradeTask.source;

    if (creep.store.getFreeCapacity(RESOURCE_ENERGY) === 0) {
      shuviCreep.setStage("upgrade");
      this.upgrade(shuviCreep);
    }

    if (creep.withdraw(source, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
      creep.moveTo(source);
    }
  }
}

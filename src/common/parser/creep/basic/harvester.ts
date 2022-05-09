import { AbstractParser } from "common/abc_parser";
import { BasicHarvesterTask } from "common/task/creep/basic/harvester";
import { ShuviCreep } from "common/shuvi_creep";

export class BasicHarvesterParser extends AbstractParser {
  private basicHarvesterTask: BasicHarvesterTask;

  public constructor(basicHarvesterTask: BasicHarvesterTask) {
    super();
    this.basicHarvesterTask = basicHarvesterTask;
  }

  public prepare(shuviCreep: ShuviCreep): void {
    const creep = shuviCreep.creep;
    if (creep.store.getUsedCapacity(RESOURCE_ENERGY) !== 0) {
      shuviCreep.setStage("transport");
      this.transport(shuviCreep);
    } else {
      shuviCreep.setStage("mining");
      this.mining(shuviCreep);
    }
  }

  public call(methodName: string, shuviCreep: ShuviCreep): void {
    if (methodName === "mining") {
      this.mining(shuviCreep);
    } else if (methodName === "transport") {
      this.transport(shuviCreep);
    }
  }

  private mining(shuviCreep: ShuviCreep): void {
    const creep = shuviCreep.creep;
    const source = this.basicHarvesterTask.source;

    if (creep.harvest(source) === ERR_NOT_IN_RANGE) {
      creep.moveTo(source);
    }

    if (creep.store.getFreeCapacity() === 0) {
      shuviCreep.setStage("transport");
    }
  }

  private transport(shuviCreep: ShuviCreep): void {
    const creep = shuviCreep.creep;
    const target = this.basicHarvesterTask.target;

    if (creep.transfer(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
      creep.moveTo(target);
    }

    if (creep.store.getUsedCapacity() === 0) {
      shuviCreep.setStage("mining");
    }
  }
}

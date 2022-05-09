import { AbstractParser } from "common/abc_parser";
import { AbstractTask } from "common/abc_task";
import { BasicRepairParser } from "common/parser/creep/basic/repair";
import { ShuviCreep } from "common/shuvi_creep";
import { Utility } from "common/util";

export class BasicRepairTask extends AbstractTask {
  public source: StructureStorage | StructureContainer;
  public target: StructureRoad | StructureWall | StructureContainer | StructureRampart;

  public constructor(
    source: StructureStorage | StructureContainer,
    target: StructureRoad | StructureWall | StructureContainer | StructureRampart
  ) {
    super("BasicRepairTask");
    this.source = source;
    this.target = target;
  }

  public creepReview(shuviCreep: ShuviCreep): number {
    return 10;
  }

  public serialize(): string {
    const valueMap = new Map();
    valueMap.set("sourceId", this.source.id);
    valueMap.set("targetId", this.target.id);

    return Utility.mapToString(valueMap);
  }

  public deserialize(str: string): BasicRepairTask | null {
    const valueMap = Utility.stringToMap(str);
    const sourceId = valueMap.get("sourceId");
    const targetId = valueMap.get("targetId");

    if (sourceId !== undefined && targetId !== undefined) {
      return new BasicRepairTask(
        Game.getObjectById(sourceId as Id<StructureStorage | StructureContainer>) as
          | StructureStorage
          | StructureContainer,
        Game.getObjectById(targetId as Id<StructureRoad | StructureWall | StructureContainer | StructureRampart>) as
          | StructureRoad
          | StructureWall
          | StructureContainer
          | StructureRampart
      );
    } else return null;
  }

  public getParser(): AbstractParser {
    return new BasicRepairParser(this);
  }
}

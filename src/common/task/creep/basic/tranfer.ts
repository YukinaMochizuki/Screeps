import { AbstractParser } from "common/abc_parser";
import { AbstractTask } from "common/abc_task";
import { BasicTransferParser } from "common/parser/creep/basic/transfer";
import { ShuviCreep } from "common/shuvi_creep";
import { Utility } from "common/util";

export class BasicTransferTask extends AbstractTask {
  public source: StructureStorage | StructureContainer;
  public target: StructureSpawn | StructureExtension;

  public constructor(source: StructureStorage | StructureContainer, target: StructureSpawn | StructureExtension) {
    super("BasicTransferTask");
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

  public deserialize(str: string): BasicTransferTask | null {
    const valueMap = Utility.stringToMap(str);
    const sourceId = valueMap.get("sourceId");
    const targetId = valueMap.get("targetId");

    if (sourceId !== undefined && targetId !== undefined) {
      return new BasicTransferTask(
        Game.getObjectById(sourceId as Id<StructureStorage | StructureContainer>) as
          | StructureStorage
          | StructureContainer,
        Game.getObjectById(targetId as Id<StructureSpawn | StructureExtension>) as StructureSpawn | StructureExtension
      );
    } else return null;
  }

  public getParser(): AbstractParser {
    return new BasicTransferParser(this);
  }
}

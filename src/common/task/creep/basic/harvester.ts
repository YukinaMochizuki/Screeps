import { AbstractParser } from "common/abc_parser";
import { AbstractTask } from "common/abc_task";
import { BasicHarvesterParser } from "common/parser/creep/basic/harvester";
import { ShuviCreep } from "common/shuvi_creep";
import { Utility } from "common/util";

export class BasicHarvesterTask extends AbstractTask {
  public source: Source;
  public target: StructureSpawn | StructureExtension | StructureStorage | StructureContainer;
  public constructor(
    source: Source,
    target: StructureSpawn | StructureExtension | StructureStorage | StructureContainer
  ) {
    super("BasicHarvesterTask");
    this.source = source;
    this.target = target;
  }

  public static getBasicHarvesterTask(sourceUid: string, targetUid: string): BasicHarvesterTask {
    const source = Game.getObjectById<Source>(sourceUid as Id<Source>) as Source;
    const target = Game.getObjectById(
      targetUid as Id<StructureSpawn | StructureExtension | StructureStorage | StructureContainer>
    ) as StructureSpawn | StructureExtension | StructureStorage | StructureContainer;
    return new BasicHarvesterTask(source, target);
  }

  public getParser(): AbstractParser {
    return new BasicHarvesterParser(this);
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

  public deserialize(str: string): BasicHarvesterTask | null {
    const valueMap = Utility.stringToMap(str);
    const sourceId = valueMap.get("sourceId");
    const targetId = valueMap.get("targetId");

    if (sourceId !== undefined && targetId !== undefined) {
      return BasicHarvesterTask.getBasicHarvesterTask(sourceId, targetId);
    } else return null;
  }
}

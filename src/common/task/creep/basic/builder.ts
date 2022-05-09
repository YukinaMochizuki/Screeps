import { AbstractParser } from "common/abc_parser";
import { AbstractTask } from "common/abc_task";
import { BasicBuilderParser } from "common/parser/creep/basic/builder";
import { ShuviCreep } from "common/shuvi_creep";
import { Utility } from "common/util";

export class BasicBuilderTask extends AbstractTask {
  public source: StructureStorage | StructureContainer;
  public target: ConstructionSite;

  public constructor(source: StructureStorage | StructureContainer, target: ConstructionSite) {
    super("BasicBuilderTask");
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

  public deserialize(context: string): BasicBuilderTask | null {
    const valueMap = Utility.stringToMap(context);
    const sourceId = valueMap.get("sourceId");
    const targetId = valueMap.get("targetId");

    if (sourceId !== undefined && targetId !== undefined) {
      return new BasicBuilderTask(
        Game.getObjectById(sourceId as Id<StructureStorage | StructureContainer>) as
          | StructureStorage
          | StructureContainer,
        Game.getObjectById(targetId as Id<ConstructionSite>) as ConstructionSite
      );
    } else return null;
  }

  public getParser(): AbstractParser {
    return new BasicBuilderParser(this);
  }
}

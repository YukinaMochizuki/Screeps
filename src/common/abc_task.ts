import { AbstractParser } from "./abc_parser";
import { ShuviCreep } from "./shuvi_creep";

export abstract class AbstractTask {
  public name: string;

  public constructor(name: string) {
    this.name = name;
  }

  public isEqual(taskContext: string): boolean {
    if (this.serialize() === taskContext) return true;
    else return false;
  }

  public abstract creepReview(shuviCreep: ShuviCreep): number;

  public abstract serialize(): string;

  public abstract deserialize(str: string): any;

  public abstract getParser(): AbstractParser;
}

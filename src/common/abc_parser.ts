import { ShuviCreep } from "./shuvi_creep";

export abstract class AbstractParser {
  public abstract prepare(shuviCreep: ShuviCreep): void;
  public abstract call(methodName: string, shuviCreep: ShuviCreep): void;
}

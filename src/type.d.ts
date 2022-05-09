import { LoDashStatic } from "lodash";

declare global {
  const _: LoDashStatic;
  interface Memory {
    uuid: number;
    log: any;
    flag: boolean;
  }

  interface CreepMemory {
    task: string;
    stage: string;
    taskContext: string;
  }
}

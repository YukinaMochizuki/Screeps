import { AbstractTask } from "common/abc_task";
import { ShuviCreep } from "common/shuvi_creep";
import { BasicBuilderTask } from "common/task/creep/basic/builder";
import { BasicHarvesterTask } from "common/task/creep/basic/harvester";
import { BasicRepairTask } from "common/task/creep/basic/repair";
import { BasicTransferTask } from "common/task/creep/basic/tranfer";
import { BasicUpgradeTask } from "common/task/creep/basic/upgrade";
import { TaskManager } from "manager/exector/manager";
import { ErrorMapper } from "utils/ErrorMapper";

let startBuild: boolean;

// When compiling TS to JS and bundling with rollup, the line numbers and file names in error messages change
// This utility uses source maps to get the line numbers and file names of the original, TS source code
export const loop = ErrorMapper.wrapLoop(() => {
  console.log(`Current game tick is ${Game.time}`);

  const sources = Game.spawns.Shuvi.room.find(FIND_SOURCES);
  const storage = Game.spawns.Shuvi.room.storage;

  const defaultCreeps = _.filter(Game.creeps, creep => creep.owner.username === "Yukina");
  const shuviCreeps: ShuviCreep[] = [];

  defaultCreeps.forEach(creep => {
    shuviCreeps.push(new ShuviCreep(creep));
  });

  const targets = Game.spawns.Shuvi.room.find(FIND_CONSTRUCTION_SITES);
  const noFullSpawnOrExtension = Game.spawns.Shuvi.room.find(FIND_STRUCTURES, {
    filter: structure => {
      return (
        (structure.structureType === STRUCTURE_EXTENSION ||
          structure.structureType === STRUCTURE_SPAWN ||
          structure.structureType === STRUCTURE_TOWER) &&
        structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0
      );
    }
  });

  const noFullHitpointStructure = Game.spawns.Shuvi.room.find(FIND_STRUCTURES, {
    filter: structure => {
      return (
        (structure.structureType === STRUCTURE_WALL ||
          structure.structureType === STRUCTURE_RAMPART ||
          structure.structureType === STRUCTURE_ROAD ||
          structure.structureType === STRUCTURE_CONTAINER) &&
        structure.hits < structure.hitsMax
      );
    }
  });

  const tasks: AbstractTask[] = [];

  console.log(`Default creeps count: ${defaultCreeps.length}`);

  if (defaultCreeps.length < 6) {
    const newName = String(Game.time);
    Game.spawns.Shuvi.spawnCreep([WORK, WORK, CARRY, CARRY, MOVE, MOVE], newName);
  }

  if (storage !== undefined) {
    if (storage.store.getFreeCapacity(RESOURCE_ENERGY) > 0) {
      tasks.push(new BasicHarvesterTask(sources[0], storage));
      tasks.push(new BasicHarvesterTask(sources[0], storage));
      tasks.push(new BasicHarvesterTask(sources[0], storage));
    }

    if ((Memory.flag === false || Memory.flag === undefined) && storage.store.getUsedCapacity(RESOURCE_ENERGY) > 3000) {
      Memory.flag = true;
    } else if (Memory.flag === true && storage.store.getUsedCapacity(RESOURCE_ENERGY) < 1000) {
      Memory.flag = false;
    }

    if (Memory.flag) {
      if (noFullHitpointStructure.length > 0) {
        tasks.push(new BasicRepairTask(storage, noFullHitpointStructure[0] as StructureRoad));
      } else if (targets.length > 0) {
        tasks.push(new BasicBuilderTask(storage, targets[0]));
      }

      if (noFullSpawnOrExtension.length > 0) {
        tasks.push(new BasicTransferTask(storage, noFullSpawnOrExtension[0] as StructureSpawn | StructureExtension));
      } else if (targets.length > 0) {
        tasks.push(new BasicBuilderTask(storage, targets[0]));
      } else {
        tasks.push(new BasicHarvesterTask(sources[0], storage));
      }

      if (Game.spawns.Shuvi.room.controller !== undefined) {
        tasks.push(new BasicUpgradeTask(storage, Game.spawns.Shuvi.room.controller));
      } else if (targets.length > 0) {
        tasks.push(new BasicBuilderTask(storage, targets[0]));
      }
    } else {
      tasks.push(new BasicHarvesterTask(sources[0], storage));
      tasks.push(new BasicHarvesterTask(sources[0], storage));

      if (noFullSpawnOrExtension.length > 0 && storage.store.getUsedCapacity(RESOURCE_ENERGY) > 800) {
        tasks.push(new BasicTransferTask(storage, noFullSpawnOrExtension[0] as StructureSpawn | StructureExtension));
      } else tasks.push(new BasicHarvesterTask(sources[0], storage));
    }

    const taskManager = new TaskManager(true);
    taskManager.execute(shuviCreeps, tasks);
  }

  // Automatically delete memory of missing creeps
  for (const name in Memory.creeps) {
    if (!(name in Game.creeps)) {
      delete Memory.creeps[name];
    }
  }
});

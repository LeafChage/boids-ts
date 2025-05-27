import { GridHash } from "./grid-hash";
import { Vec2 } from "./vec";

export type Individual = {
  id: string,
  velocity: Vec2,
  position: Vec2;
};

export type SimulateFn = (
  point: Individual,
  crowds: Individual[],
  gridHash: GridHash<Individual>,
) => Vec2;

export type Simulate =
  (input: Individual[]) => Individual[];

export class SimulaterBuilder {
  private readonly actions: SimulateFn[];

  public constructor() {
    this.actions = [];
  }

  public add = (fn: SimulateFn): SimulaterBuilder => {
    this.actions.push(fn);
    return this
  }

  public build = (cellSize: number = 1): Simulate => {
    return (input) => {
      const gridHash = new GridHash(input, cellSize);
      const result = new Array<Individual>;
      for (const p of input) {
        const vs = this.actions.map((action) => action(p, input, gridHash));
        p.velocity = Vec2.div(Vec2.sum(vs), 100);
        p.position = Vec2.add(p.position, p.velocity);
        result.push(p);
      }
      return result;
    }
  }
}



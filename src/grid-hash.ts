import { Vec2 } from "./vec";

type GridItem = { position: Vec2 };

export class GridHash<T extends GridItem> {
  private readonly cellSize: number;
  private readonly gridHash: Map<string, T[]>;

  public constructor(input: T[], cellSize: number = 1) {
    this.cellSize = cellSize;
    this.gridHash = new Map();
    for (const individual of input) {
      const index = this.index(individual);
      const v = this.gridHash.get(Vec2.items(index).toString());
      if (v === undefined) {
        this.gridHash.set(Vec2.items(index).toString(), [individual])
      } else {
        this.gridHash.set(Vec2.items(index).toString(), [...v, individual]);
      }
    }
  }

  private index = (cell: T): Vec2 =>
    Vec2.map(Vec2.div(cell.position, this.cellSize), Math.floor);

  private innerGet = (v: Vec2): T[] =>
    this.gridHash.get(Vec2.items(v).toString()) ?? [];

  /**
    * @param range: should be uint and range >= 1
    */
  public get = (cell: T, range: number = 1): T[] => {
    if (range < 1) {
      throw new Error("range should be more or equal than 1");
    }
    const index = this.index(cell);
    const result = new Array<T>(...this.innerGet(index));
    for (let r = 1; r < range; r++) {
      result.push(...this.innerGet({ x: index.x + r, y: index.y }));
      result.push(...this.innerGet({ x: index.x, y: index.y + r }));
      result.push(...this.innerGet({ x: index.x - r, y: index.y }));
      result.push(...this.innerGet({ x: index.x, y: index.y - r }));
    }
    return result;
  }
};





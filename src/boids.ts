import { Vec2 } from "./vec";
import type { SimulateFn } from "./simulater";

// boids
export class Boids {
  private readonly sightLength;
  private readonly personalSpaceLength;
  public constructor(sightLength: number, personalSpaceLength: number) {
    this.sightLength = sightLength;
    this.personalSpaceLength = personalSpaceLength;
  }

  // the power to gather to the center
  public cohesion: SimulateFn = (point, _crowds, gridHash) => {
    const inSights = new Array<Vec2>;
    for (const c of gridHash.get(point, this.sightLength)) {
      if (point.id !== c.id) {
        inSights.push(c.position);
      }
    }
    return (inSights.length === 0)
      ? Vec2.zero()
      : Vec2.normalize(Vec2.sub(
        Vec2.average(inSights),
        point.position
      ));
  }

  public separation: SimulateFn = (point, _crowds, gridHash) => {
    const closePoints = new Array<Vec2>;
    for (const c of gridHash.get(point, this.personalSpaceLength)) {
      if (point.id !== c.id) {
        closePoints.push(
          Vec2.mul(
            Vec2.sub(
              point.position,
              c.position
            ),
            1 - (Vec2.distance(c.position, point.position) / this.personalSpaceLength))
        );
      }
    }
    return Vec2.normalize(Vec2.sum(closePoints));
  }

  public align: SimulateFn = (point, _crowds, gridHash) => {
    const inSights = new Array<Vec2>;
    for (const c of gridHash.get(point, this.sightLength)) {
      if (point.id !== c.id) {
        inSights.push(c.velocity);
      }
    }
    return Vec2.normalize(Vec2.average(inSights));
  }

  public moveForward: SimulateFn = (point, _) => {
    return Vec2.normalize(point.velocity);
  }
}

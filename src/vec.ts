interface VecCal<V> {
  zero(): V,
  items(v: V): number[],
  init(n: number[]): V,
  add(a: V, b: V): V,
  sub(a: V, b: V): V,
  div(v: V, n: number): V,
  mul(v: V, n: number): V,
  sum(vs: V[]): V,
  average(vs: V[]): V,
  inverse(v: V): V,
  distance(a: V, b: V): number,
  normalize(v: V): V,
  map(v: V, fn: (v: number) => number): V,
}

export type Vec2 = { x: number, y: number };
export const Vec2 = {
  zero: (): Vec2 => ({ x: 0, y: 0 }),
  items: (v: Vec2): number[] => [v.x, v.y],
  init: (n: number[]): Vec2 => ({ x: n[0], y: n[1] }),
  add: (a: Vec2, b: Vec2): Vec2 => ({ x: a.x + b.x, y: a.y + b.y }),
  sub: (a: Vec2, b: Vec2): Vec2 => ({ x: a.x - b.x, y: a.y - b.y }),
  div: (v: Vec2, n: number): Vec2 => ({ x: v.x / n, y: v.y / n }),
  mul: (v: Vec2, n: number): Vec2 => ({ x: v.x * n, y: v.y * n }),
  sum: (vs: Vec2[]): Vec2 => vs.reduce((a, b) => Vec2.add(a, b), Vec2.zero()),
  average: (vs: Vec2[]): Vec2 => (vs.length === 0) ? Vec2.zero() : Vec2.div(Vec2.sum(vs), vs.length),
  inverse: (v: Vec2): Vec2 => ({ x: -v.x, y: -v.y }),
  distance: (a: Vec2, b: Vec2): number => {
    const sub = Vec2.sub(a, b);
    return Math.sqrt(sub.x ** 2 + sub.y ** 2);
  },
  normalize: (v: Vec2): Vec2 => {
    const d = Vec2.distance(Vec2.zero(), v);
    return (d === 0) ? Vec2.zero() : Vec2.div(v, d);
  },
  map: (v: Vec2, fn: (v: number) => number): Vec2 => Vec2.init([fn(v.x), fn(v.y)])
} satisfies VecCal<Vec2>;


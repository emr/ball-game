// see: http://hyperphysics.phy-astr.gsu.edu/hbase/vect.html

const fixFloat = (num: number): number => parseFloat(num.toFixed(16));

const atan = (x: number, y: number): number => {
  const sck = 10 ** -6;
  if (Math.abs(x) < sck) {
    if (Math.abs(y) < sck) return 0;
    if (y >= 0) return Math.PI / 2;
    if (y < 0) return Math.PI * 3 / 2;
  }
  if (x > 0) {
    if (y >= 0) return Math.atan(y / x);
    if (y < 0) return Math.atan(y / x) + (2 * Math.PI);
  }
  if (y >= 0) return Math.PI - Math.atan(-y / x);
  return Math.PI + Math.atan(y / x);
};

export default class Vector<T extends number> {
  constructor(public readonly value: T, public readonly angle: number) {}

  static multiplyBy = (vector: Vector<number>, scalar: number): Vector<number> => ({ ...vector, value: vector.value * scalar });

  static resultant = (vectors: Vector<number>[]): Vector<number> => {
    const { x, y } = vectors.reduce(
      (a, { value, angle }) => ({
        x: a.x + (value * Math.cos(angle)),
        y: a.y + (value * Math.sin(angle)),
      }),
      { x: 0, y: 0 },
    );
    const value = Math.sqrt((x ** 2) + (y ** 2));
    const angle = atan(x, y);

    return new Vector(fixFloat(value), fixFloat(angle));
  };
}

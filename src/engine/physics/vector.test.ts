import Vector from './vector';

const fixFloat = (num: number) => parseFloat(num.toFixed(16));
const radian = (degree: number) => fixFloat(degree * Math.PI / 180);

describe('vector', () => {
  it('multiply vector with a scalar', () => {
    expect.assertions(1);
    const vector = new Vector(91, 1.996);
    expect(Vector.multiplyBy(vector, 3)).toStrictEqual({ ...vector, value: 91 * 3 });
  });

  describe('calculate resultant vector', () => {
    const tests: {
      vectors: Vector<number>[],
      expected: Vector<number>
    }[] = [
      // two vectors
      {
        vectors: [
          new Vector(2, 0),
          new Vector(2, Math.PI),
        ],
        expected: new Vector(2e-16, 0),
      },
      {
        vectors: [
          new Vector(1, Math.PI / 2),
          new Vector(1, 0),
        ],
        expected: new Vector(Math.sqrt(2), Math.PI / 4),
      },
      {
        vectors: [
          new Vector(10, radian(53)),
          new Vector(15, radian(180 + 53)),
        ],
        expected: new Vector(5, radian(180 + 53)),
      },
      {
        vectors: [
          new Vector(5, radian(-53)),
          new Vector(5, radian(180 + 53)),
        ],
        expected: new Vector(7.986355100472928, radian(270)),
      },
      // one vector
      {
        vectors: [new Vector(1, radian(1))],
        expected: new Vector(1, radian(1)),
      },
      {
        vectors: [new Vector(0, radian(0))],
        expected: new Vector(0, radian(0)),
      },
      {
        vectors: [new Vector(21, radian(-34))],
        expected: new Vector(21, radian(360 - 34)),
      },
    ];
    tests.forEach(({ vectors, expected }, index) => {
      it(`case ${index}`, () => {
        expect.assertions(1);
        const resultant = Vector.resultant(vectors);
        expect(resultant).toMatchObject(expected);
      });
    });
  });
});

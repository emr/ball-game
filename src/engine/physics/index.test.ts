import {
  Acceleration, Displacement, Time, Vector, Velocity, velocityAtTime,
} from './index';

describe('physics', () => {
  describe('calculate velocity at time', () => {
    describe('velocity without acceleration', () => {
      const tests: {
        args: [Time, Vector<Velocity>],
        expected: Vector<Velocity>
      }[] = [
        {
          args: [
            5,
            new Vector(10, 0),
          ],
          expected: new Vector(10, 0),
        },
        {
          args: [
            8,
            new Vector(-10, 0),
          ],
          expected: new Vector(10, Math.PI),
        },
        {
          args: [
            12,
            new Vector(90, 0.123123),
          ],
          expected: new Vector(90, 0.123123),
        },
        {
          args: [
            12,
            new Vector(0, 0.321),
          ],
          expected: new Vector(0, 0),
        },
      ];
      tests.forEach(({
        args: [time, velocity],
        expected,
      }, index) => {
        it(`case ${index}`, () => {
          expect.assertions(1);
          expect(velocityAtTime(time, velocity)).toMatchObject(expected);
        });
      });
    });

    describe('velocity with acceleration', () => {
      const tests: {
        args: [Time, Vector<Velocity>, Vector<Acceleration>],
        expected: Vector<Velocity>
      }[] = [
        {
          args: [
            5,
            new Vector(10, 0),
            new Vector(10, 0),
          ],
          expected: new Vector(60, 0),
        },
        {
          args: [
            5,
            new Vector(-10, 0),
            new Vector(10, 0),
          ],
          expected: new Vector(40, 0),
        },
        {
          args: [
            1,
            new Vector(10, 0),
            new Vector(-10, 0),
          ],
          expected: new Vector(0, 0),
        },
        {
          args: [
            5,
            new Vector(0, 0.9999),
            new Vector(1, 0.9999),
          ],
          expected: new Vector(5, 0.9999),
        },
      ];
      tests.forEach(({
        args: [time, velocity, acceleration],
        expected,
      }, index) => {
        it(`case ${index}`, () => {
          expect.assertions(1);
          expect(velocityAtTime(time, velocity, acceleration)).toMatchObject(expected);
        });
      });
    });
  });

  describe('calculate displacement in time', () => {
    describe('velocity without acceleration', () => {
      const tests: {
        args: [Time, Vector<Velocity>, Vector<Acceleration>],
        expected: Vector<Displacement>
      }[] = [
        {
          args: [
            5,
            new Vector(10, 0),
            new Vector(10, 0),
          ],
          expected: new Vector(60, 0),
        },
      ];
      tests.forEach(({
        args: [time, velocity, acceleration],
        expected,
      }, index) => {
        it(`case ${index}`, () => {
          expect.assertions(1);
          expect(velocityAtTime(time, velocity, acceleration)).toMatchObject(expected);
        });
      });
    });
  });
});

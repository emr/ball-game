import {
  Acceleration, Mass, Time, Vector, Velocity, velocityAtTime,
} from './physics';
import { Point } from '../geometry';

interface ObjectState {
  velocity: Vector<Velocity>,
  acceleration: Vector<Acceleration>,
  position: Point,
  mass: Mass,
}

type ObjectStateChangeset = Partial<ObjectState>;

type Field = {
  width: number,
  height: number,
};

export const calculate = (
  states: { [key: string]: ObjectState },
  field: Field,
  time: Time,
): { [key: string]: ObjectStateChangeset } => Object.entries(states).reduce(
  (changeset, [objectId, state]) => {
    const { acceleration, position, velocity } = state;
    if (velocity.value === 0 && acceleration.value === 0) {
      return {
        asd: {
          position: {},
        },
      };
    }
    return {
      [objectId]: {
        acceleration,
        velocity: velocityAtTime(time, velocity, acceleration),
      },
    };
  },
  {},
);

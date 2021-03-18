import Vector from './vector';
import {
  Time, Velocity, Acceleration, Displacement, Mass,
} from './units';

export {
  Vector, Time, Velocity, Acceleration, Displacement, Mass,
};

export const velocityAtTime = (time: Time, velocity: Vector<Velocity>, acceleration?: Vector<Acceleration>): Vector<Velocity> => Vector.resultant([
  velocity,
  acceleration ? Vector.multiplyBy(acceleration, time) : undefined,
].filter<Vector<never>>((v): v is Vector<never> => !!v));

export const displacement = (time: Time, velocity: Vector<Velocity>, acceleration?: Vector<Acceleration>): Vector<Displacement> => Vector.resultant([
  Vector.multiplyBy(velocity, time),
  acceleration ? Vector.multiplyBy(acceleration, (time ** 2) / 2) : undefined,
].filter<Vector<never>>((v): v is Vector<never> => !!v));

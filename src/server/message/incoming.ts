import { MoveDirectionType } from '../../move';

export abstract class IncomingMessage {
  headers = [];
}

export class StartMessage extends IncomingMessage {
  static validate = (plain: any): boolean => !!plain?.start;
}

export class ReadyMessage extends IncomingMessage {
  static validate = (plain: any): boolean => !!plain?.ready;
}

export class MoveMessage extends IncomingMessage {
  constructor(public direction: MoveDirectionType) {
    super();
  }

  static validate = (plain: { move?: string }): boolean => !!plain.move && ['left', 'right'].includes(plain.move);

  static transform = (plain: { move: MoveDirectionType }) => new MoveMessage(plain.move);
}

/*
 * Parses the message string as a `Message` object.
 * Returns undefined if the message is invalid.
 */
export const parse = (msg: string): IncomingMessage|undefined => {
  let plain;
  try {
    plain = JSON.parse(msg);
  } catch (e) {
    return undefined;
  }

  switch (true) {
    case StartMessage.validate(plain):
      return new StartMessage();
    case ReadyMessage.validate(plain):
      return new ReadyMessage();
    case MoveMessage.validate(plain):
      return MoveMessage.transform(plain);
    default:
      return undefined;
  }
};

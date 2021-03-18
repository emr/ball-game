import { Socket } from 'net';
import { createServer, IncomingMessage } from 'http';
import { createHash } from 'crypto';
import { Connection } from '../connection';
import { OutgoingMessage } from '../message/outgoing';
import Server from './server';
import Channel from '../channel';

const WEBSOCKET_SPECIFICATION_GUID = '258EAFA5-E914-47DA-95CA-C5AB0DC85B11';

export const generateWebSocketAcceptKey = (acceptKey: string): string => createHash('sha1')
  .update(acceptKey + WEBSOCKET_SPECIFICATION_GUID, 'binary')
  .digest('base64');

function constructReply(data: any): Buffer {
  // Convert the data to JSON and copy it into a buffer
  const json = JSON.stringify(data);
  const jsonByteLength = Buffer.byteLength(json);
  // Note: we're not supporting > 65535 byte payloads at this stage
  const lengthByteCount = jsonByteLength < 126 ? 0 : 2;
  const payloadLength = lengthByteCount === 0 ? jsonByteLength : 126;
  const buffer = Buffer.alloc(2 + lengthByteCount + jsonByteLength);
  // Write out the first byte, using opcode `1` to indicate that the message
  // payload contains text data

  buffer.writeUInt8(0b10000001, 0);
  buffer.writeUInt8(payloadLength, 1);
  // Write the length of the JSON payload to the second byte
  let payloadOffset = 2;
  if (lengthByteCount > 0) {
    buffer.writeUInt16BE(jsonByteLength, 2); payloadOffset += lengthByteCount;
  }
  // Write the JSON data to the data buffer
  buffer.write(json, payloadOffset);
  return buffer;
}

export default class HttpServer extends Server {
  constructor(channel: Channel) {
    super(createServer((req, res) => {
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end('okay');
    }), channel);
    this.server.on('upgrade', this.upgrade);
  }

  private upgrade = (req: IncomingMessage, socket: Socket) => {
    if (req.headers.upgrade !== 'websocket') {
      socket.end('HTTP/1.1 400 Bad Request');
      return;
    }
    const acceptKey = req.headers['sec-websocket-key'];
    if (!acceptKey) {
      socket.end('HTTP/1.1 400 Bad Request');
      return;
    }
    const hash = generateWebSocketAcceptKey(acceptKey);
    const responseHeaders = [
      'HTTP/1.1 101 Web Socket Protocol Handshake',
      'Upgrade: WebSocket',
      'Connection: Upgrade',
      `Sec-WebSocket-Accept: ${hash}`,
    ].join('\r\n');
    socket.write(`${responseHeaders}\r\n\r\n`);

    setTimeout(() => socket.write('hello', console.log), 5000);
  };

  send = ({ socket }: Connection, msg: OutgoingMessage) => {
    socket.write(`${JSON.stringify(msg)}\r\n`);
  };
}

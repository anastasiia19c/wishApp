import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  transports: ['websocket'],
})
export class WishGateway {
  @WebSocketServer()
  server: Server;

  // Exemple d'événement de test
  @SubscribeMessage('message')
  handleMessage(client: any, payload: any): string {
    return 'Hello world!';
  }

  // Pour émettre un événement vers tous les clients
  emit(event: string, data: any) {
    this.server.emit(event, data);
  }
}

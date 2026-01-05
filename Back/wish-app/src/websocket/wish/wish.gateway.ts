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

  @SubscribeMessage('joinWish')
  joinWishRoom(client: any) {
    client.join('wish');
  }

  // Pour émettre un événement vers tous les clients
  emit(event: string, data: any) {
    this.server.to('wish').emit(event, data);
  }
}
// .to('wish').
import type { DataConnection } from 'peerjs';
import { Peer } from 'peerjs';
import { io } from 'socket.io-client';
//import { wait } from './utils/wait';

export const socket = io(process.env.NEXT_PUBLIC_URL ?? '', {
  autoConnect: false,
  path: '/api/socket',
  addTrailingSlash: false,
});

const pouPeerCreator = () => {
  let peer: Peer;
  let conn: DataConnection;
  // let peerId = 'f6e0854a-ebc9-4e43-b969-3c797a411d17';
  // let isInitiator: boolean = false;

  // const getId = (isPeer: boolean = false): string => {
  //   if (!isPeer)
  //     return `f6e0854a-ebc9-4e43-b969-3c797a411d17-${
  //       isInitiator ? 'init' : 'signee'
  //     }`;

  //   return `f6e0854a-ebc9-4e43-b969-3c797a411d17-${
  //     isInitiator ? 'signee' : 'init'
  //   }`;
  // };

  const setup = (id: string, initiator: boolean): Peer => {
    //peerId = id;
    // isInitiator = initiator;

    if (initiator) {
      peer = new Peer('f6e0854a-ebc9-4e43-b969-3c797a411d17');

      peer.on('open', function (id) {
        console.log('My peer ID is: ' + id);
        conn = peer.connect('f6e0854a-ebc9-4e43-b969-3c797a411d17-s');
        conn.on('open', async () => {
          console.log('OPENS IT');
        });

        conn.on('open', async () => {
          console.log('OPENS IT');
        });

        conn.on('data', (data) => {
          // Will print 'hi!'
          console.log(333, data);
        });
      });

      peer.on('connection', (innerconn) => {
        console.log(111, innerconn);
        conn = innerconn;
        innerconn.on('data', (data) => {
          // Will print 'hi!'
          console.log('connection init', data);
        });
        //innerconn.send('234234');
      });
    } else {
      peer = new Peer('f6e0854a-ebc9-4e43-b969-3c797a411d17-s');
      //conn = peer.connect('f6e0854a-ebc9-4e43-b969-3c797a411d17-s');

      peer.on('open', function (id) {
        console.log('My peer ID is: ' + id);
        conn = peer.connect('f6e0854a-ebc9-4e43-b969-3c797a411d17');
        conn.on('open', async () => {
          console.log('OPENS IT');
        });

        conn.on('open', async () => {
          console.log('OPENS IT');
        });

        conn.on('data', (data) => {
          // Will print 'hi!'
          console.log(333, data);
        });
      });

      peer.on('connection', (innerconn) => {
        console.log(innerconn);
        conn = innerconn;

        setTimeout(() => {
          innerconn.send('234234');
        }, 1000);

        innerconn.on('open', async () => {
          console.log('OPENS IT');
          innerconn.send('open');
        });

        innerconn.on('data', (data) => {
          // Will print 'hi!'
          console.log('connection signee', data);
        });
      });
    }

    // peerId = id;

    // if (initiator) {
    //   const initPeer = new Peer('f6e0854a-ebc9-4e43-b969-3c797a411d17-signee');
    //   initPeer.on('connection', function (innerconn) {
    //     console.log('CONNECTION', innerconn.open);

    //     innerconn.on('data', function (data) {
    //       console.log('DATA', data);
    //     });

    //     innerconn.on('open', () => {
    //       console.log('OPEN');
    //     });
    //   });
    // }

    return peer;
  };

  const connect = async (): Promise<DataConnection> => {
    //setTimeout(() => {

    // conn = peer.connect(getId(true), {
    //   metadata: {
    //     peerId: getId(),
    //   },
    // });

    // if (!isInitiator) {
    //   peer.connect(getId(), {
    //     metadata: {
    //       peerId: getId(true),
    //     },
    //   });
    // }

    // // }, 2000);

    // console.log('CONN', conn);
    return conn;
  };

  const disconnect = () => {
    console.log('DISCONNECT');
    // peer.disconnect();
    // peer.destroy();
    //peerId = '';
    // isInitiator = false;
  };

  const get = () => {
    return { peer, conn };
  };

  return {
    setup,
    connect,
    disconnect,
    get,
  };
};

export const pouPeer = pouPeerCreator();

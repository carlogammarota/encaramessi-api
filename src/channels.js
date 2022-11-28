module.exports = function(app) {
  if(typeof app.channel !== 'function') {
    // If no real-time functionality has been configured just return
    // return;
  }

  // app.configure(socketio(function(io) {
  //   io.on('connection', function(socket) {
  //     console.log("NEW USER CONECTED")
  //     socket.emit('news', { text: 'A client connected!' });
  //     socket.on('my other event', function (data) {
  //       console.log(data);
  //     });
  //   });
  //   io.on('disconnect', (reason) => {
  //     // Show offline message
  //     console.log("disconnect")
  //   });
    
  //   // Registering Socket.io middleware
  //   io.use(function (socket, next) {
  //     // Exposing a request property to services and hooks
  //     socket.feathers.referrer = socket.request.referrer;
  //     next();
  //   });
  // }));
  let usuariosConectados = 0;

  app.on("connection", (connection) => {
    const { user } = connection;

    // socket.join("some room");
    // app.channel('anonymous').join(connection);
    // app.channel('anonymous').emit("users-only", 30);
    // console.log("app io", app.io)
    
    // app.channel.to("anonymous").emit("some event");
    console.log("Nuevo usuario conectado")
    usuariosConectados++;
    app.io.emit("users-only", usuariosConectados)
    console.log("Usuarios Conectados: ", usuariosConectados)
    // console.log("app", app)
    // app.socketio.on('message', (data) => {
    //   console.log(data);
    // });

    // app.service('messages').on("find", function (data) {
    //   console.log(data);
    // });
    
  });

  
  // app.on('connection', function(socket) {
    
  //   // console.log("Nuevo usuario conectado", socket)
  //   // socket.socket.emit('news', { text: 'A client connected!' });
  //   // socket.on('my other event', function (data) {
  //   //   console.log(data);
  //   // });
  //   app.channel('anonymous').join(socket);
  //   socket.to("anonymous").emit("some event");
  //   console.log("Nuevo usuario conectado")
  //   usuariosConectados++;
  // });

  // app.on('connection', (io) => {
  //   // On a new real-time connection, add it to the anonymous channel
  //   console.log("Nuevo usuario conectado")
  //   usuariosConectados++;
  //   app.channel('anonymous').join(io);
  //   console.log("Usuarios Conectados: ", usuariosConectados)
  //   io.emit('users-only', usuariosConectados);
   
  // });
  app.on('disconnect', (reason) => {
    usuariosConectados--;
     // Show offline message
     app.io.emit("users-only", usuariosConectados)
     console.log("Usuario desconectado")
     console.log("Usuarios Conectados: ", usuariosConectados)
    //  app.emit('users-only', usuariosConectados);
   });

  app.on('login', (authResult, { connection }) => {
    // console.log("Nuevo usuario conectado", connection)
    // usuariosConectados++;
    // connection can be undefined if there is no
    // real-time connection, e.g. when logging in via REST
    if(connection) {
      // Obtain the logged in user from the connection
      // const user = connection.user;
      
      // The connection is no longer anonymous, remove it
      app.channel('anonymous').leave(connection);

      // Add it to the authenticated user channel
      app.channel('authenticated').join(connection);

      // Channels can be named anything and joined on any condition 
      
      // E.g. to send real-time events only to admins use
      // if(user.isAdmin) { app.channel('admins').join(connection); }

      // If the user has joined e.g. chat rooms
      // if(Array.isArray(user.rooms)) user.rooms.forEach(room => app.channel(`rooms/${room.id}`).join(connection));
      
      // Easily organize users by email and userid for things like messaging
      // app.channel(`emails/${user.email}`).join(connection);
      // app.channel(`userIds/${user.id}`).join(connection);
    }
  });

  // eslint-disable-next-line no-unused-vars
  app.publish((data, hook) => {
    // Here you can add event publishers to channels set up in `channels.js`
    // To publish only for a specific event use `app.publish(eventname, () => {})`

    console.log('Publishing all events to all authenticated users. See `channels.js` and https://docs.feathersjs.com/api/channels.html for more information.'); // eslint-disable-line

    // e.g. to publish all service events to all authenticated users use
    return app.channel('authenticated');
  });

  // Here you can also add service specific event publishers
  // e.g. the publish the `users` service `created` event to the `admins` channel
  // app.service('users').publish('created', () => app.channel('admins'));
  
  // With the userid and email organization from above you can easily select involved users
  // app.service('messages').publish(() => {
  //   return [
  //     app.channel(`userIds/${data.createdBy}`),
  //     app.channel(`emails/${data.recipientEmail}`)
  //   ];
  // });
};

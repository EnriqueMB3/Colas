const { io } = require('../server');
const { TicketControl } = require('../classes/ticket-control');



const ticketControl = new TicketControl();

let ultimosCuatros = ticketControl.getUltimosCuatro();



io.on('connection', (client) => {

    client.on('siguienteTicket', (data, callback) => {
        let siguiente = ticketControl.siguiente();
        console.log(siguiente);
        callback(siguiente);
    });
    //emitir un evento estado actual

    client.emit('estadoActual', {
        ultimosCuatro: ultimosCuatros,
        actual: ticketControl.getUltimoTicket()

    });

    client.on('atenderTicket', (data, callback) => {

        if (!data.escritorio) {
            return callback({
                err: true,
                mensaje: 'El escritorio es necesario'
            })
        }

        let atenderTicket = ticketControl.atenderTicket(data.escritorio);

        callback(atenderTicket);

        //actualizar/ notificar cambios
        client.broadcast.emit('ultimosCuatro', {
            ultimosCuatro: ticketControl.getUltimosCuatro()
        });
    });
});
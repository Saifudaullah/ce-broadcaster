import router from './domains/routes';
import express from 'express';

const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http)
const bodyParser = require('body-parser')
const path = require('path');

app.use(bodyParser.json());
app.use(router);

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.static(path.join(__dirname, 'files')))
app.use(express.static(path.join(__dirname, 'uploads')))

//set views
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

let totalRiders = 0;

app.post('/broadcast_jobs', function (req, res) {

    var task = {
        message: req.body.message,
        total: req.body.total,
        pickup_point: {
            latitude: 0,
            longitude: 0,
            address: 'Taman wangsapuri',
        },
        delivery_point: {
            latitude: 0,
            longitude: 0,
            address: 'Taman melati',
        }
    }

    io.emit('new task', { task });

    res.json(
        {
            data:
            {
                task: task,
                message: 'New job was created.'
            },
            status_code: 200,
            error: false
        }
    );
})

//socket io handler


io.on('connection', function (socket) {

    socket.on('task accepted', function (payload) {
        console.log('task accepted' + JSON.stringify(payload))
        socket.emit('has new job', JSON.stringify(payload));
        socket.broadcast.emit('task occupied', JSON.stringify(payload));
    })

    socket.on('task declined', function (payload) {
        console.log('task declined', JSON.stringify(payload))
        socket.emit('task declined', JSON.stringify(payload));
    })

    // socket.on('task accepted',function(payload){
    //     io.emit('task accepted',{jobId: })
    // })

    console.log("client connected count : ", io.sockets.server.engine.clientsCount);    //socket.emit('get active riders', { count: io.sockets.clients().filter(c => !!c).length })

});


http.listen(3000, function () {
    console.log('listening on *:3000');
});


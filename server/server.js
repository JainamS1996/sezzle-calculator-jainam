const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
let calcArray = [];

const PORT = process.env.PORT || 3000;

var array = new Array()
array.push = function (){
    if (this.length >= 10) {
        this.shift();
    }
    return Array.prototype.push.apply(this,arguments);
}

// Serve static files
app.use('/', express.static('client'));

app.get('/', (_, res) => {
  res.sendFile(path.join(__dirname, 'client', 'index.html'));
});

io.on('connection',(socket)=>{

	socket.emit('connection',JSON.stringify(array))
	socket.on('calculation',(calc)=>{
		array.push(calc);
		io.emit('calculation',JSON.stringify(array));
	})
});


// Catch-all handler for any initial request that doesn't
// match one above; send to home route.
app.get('*', (_, res) => {
  res.redirect('/');
});

server.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});
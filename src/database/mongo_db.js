let mongoose = require('mongoose');

const username = "superchatdb";
const password = "7zSIlFazqV13BKMR";
const dbName = "super-chat";    

class Database {
    constructor() {
        this._connect();
    }
    _connect() {
        var mongoURI = `mongodb+srv://${username}:${password}@clusterzero.qnzrk.mongodb.net/${dbName}?retryWrites=true&w=majority`;
        mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
            .then(() => {
                console.log('Database connection successful!');
            })
            .catch((error) => {
                console.log(mongoURI);
                console.error('Database connection error:', error.message);
            });
    }
}

module.exports = new Database()

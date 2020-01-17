const express = require('express')
const fetch = require('fetch').fetchUrl
const cors = require('cors')
const app = express()
const port = 8000
const host = "0.0.0.0"

app.use(cors())
app.use(express.json({limit: '30MB'}));

app.get('/', (_, res) => {
    res.send("Informer 2019 Server")
});

app.post('/addReport', (req, res) => {
    if(req.body) {
        const MongoClient = require('mongodb').MongoClient;
        const uri = "mongodb+srv://SIH2019Login:GbeLZqT6vFzP1gLd@informer2019db-yp3zc.mongodb.net/test?retryWrites=true&w=majority";
        const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        client.connect(err => {
            if(err){
                res.status(400).send(err);
            }
            else{
                const db = client.db("SIH2020");
                const collection = db.collection("Reports");
                collection.insertOne(req.body, (err, data) => {
                    if(err){
                        res.status(400).send(err);
                        client.close();
                    }
                    else{
                        res.status(200).send(data);
                        client.close();
                    }
                });
            }
        });
    }
    else{
        res.status(400).send("Missing Arguments");
    }
});

app.get('/getReports', (_, res) => {
    const MongoClient = require('mongodb').MongoClient;
    const uri = "mongodb+srv://SIH2019Login:GbeLZqT6vFzP1gLd@informer2019db-yp3zc.mongodb.net/test?retryWrites=true&w=majority";
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    client.connect(err => {
        if(err){
            res.status(400).send(err);
        }
        else{
            client.db("SIH2020").collection("Reports").find({}).toArray((err, body) => {
                if(err){
                    res.status(400).send(err);
                    client.close();
                }
                else{
                    res.status(200).send(body);
                    client.close();
                }
            });
        }
    });
});

app.get('/getReport', (req, res) => {
    if(req.query.id){
        const mongo = require('mongodb');
        const MongoClient = mongo.MongoClient;
        const uri = "mongodb+srv://SIH2019Login:GbeLZqT6vFzP1gLd@informer2019db-yp3zc.mongodb.net/test?retryWrites=true&w=majority";
        const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        client.connect(err => {
            if(err){
                res.status(400).send(err);
            }
            else{
                client.db("SIH2020").collection("Reports").findOne(mongo.ObjectId(req.query.id)).then((err, body) => {
                    if(err){
                        res.status(400).send(err);
                        client.close();
                    }
                    else{
                        res.status(200).send(body);
                        client.close();
                    }
                });
            }
        });
    }
    else{
        res.status(400).send("Missing Arguments");
    }
});

app.delete('/deleteReport', (req, res) => {
    if(req.query.id){
        const mongo = require('mongodb');
        const MongoClient = mongo.MongoClient;
        const uri = "mongodb+srv://SIH2019Login:GbeLZqT6vFzP1gLd@informer2019db-yp3zc.mongodb.net/test?retryWrites=true&w=majority";
        const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        client.connect(err => {
            if(err){
                res.status(400).send(err);
            }
            else{
                client.db("SIH2020").collection("Reports").deleteOne({"_id": mongo.ObjectId(req.query.id)}).then((err, body) => {
                    if(err){
                        res.status(400).send(err);
                        client.close();
                    }
                    else{
                        res.status(200).send(body);
                        client.close();
                    }
                });
            }
        });
    }
    else{
        res.status(400).send("Missing Arguments");
    }
});

app.get('/getHosps', (req, res) => {
    if(req.query.lat && req.query.lon) {
        let payload = [];
        let latitude = req.query.lat;
        let longitude = req.query.lon;
        let limit = req.query.limit;
        fetch(`https://nominatim.openstreetmap.org/search.php?limit=${limit}&format=json&q=hospitals%20near%20[${latitude},${longitude}]`, (error, meta, body) => {
            if(body){
                try{
                    body = JSON.parse(body.toString());
                    body.map(value => {
                        payload.push({
                            name: value.display_name,
                            lat: value.lat,
                            lon: value.lon,
                            dist: calcDist(latitude, longitude, value.lat, value.lon)
                        });
                    })
                    res.status(200).send(payload);
                }
                catch(err){
                    res.status(400).send(err);
                }
            }
            if(error){
                res.status(400).send(error);
            }
        })
    }
    else {
        res.sendStatus(400);
    }
});

app.get('/getPolice', (req, res) => {
    if(req.query.lat && req.query.lon) {
        let payload = [];
        let latitude = req.query.lat;
        let longitude = req.query.lon;
        let limit = req.query.limit;
        fetch(`https://nominatim.openstreetmap.org/search.php?limit=${limit}&format=json&q=police%20near%20[${latitude},${longitude}]`, (error, meta, body) => {
            if(body){
                try{
                    body = JSON.parse(body.toString());
                    body.map(value => {
                        payload.push({
                            name: value.display_name,
                            lat: value.lat,
                            lon: value.lon,
                            dist: calcDist(latitude, longitude, value.lat, value.lon)
                        });
                    })
                    res.status(200).send(payload);
                }
                catch(err){
                    res.status(400).send(err);
                }
            }
            if(error){
                res.status(400).send(error);
            }
        })
    }
    else {
        res.sendStatus(400);
    }
});

app.get('/getFire', (req, res) => {
    if(req.query.lat && req.query.lon) {
        let payload = [];
        let latitude = req.query.lat;
        let longitude = req.query.lon;
        let limit = req.query.limit;
        fetch(`https://nominatim.openstreetmap.org/search.php?limit=${limit}&format=json&q=fire%20near%20[${latitude},${longitude}]`, (error, meta, body) => {
            if(body){
                try{
                    body = JSON.parse(body.toString());
                    body.map(value => {
                        payload.push({
                            name: value.display_name,
                            lat: value.lat,
                            lon: value.lon,
                            dist: calcDist(latitude, longitude, value.lat, value.lon)
                        });
                    })
                    res.status(200).send(payload);
                }
                catch(err){
                    res.status(400).send(err);
                }
            }
            if(error){
                res.status(400).send(error);
            }
        })
    }
    else {
        res.sendStatus(400);
    }
});

app.post('/addUser', (req, res) => {
    if(req.body) {
        const MongoClient = require('mongodb').MongoClient;
        const uri = "mongodb+srv://SIH2019Login:GbeLZqT6vFzP1gLd@informer2019db-yp3zc.mongodb.net/test?retryWrites=true&w=majority";
        const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        client.connect(err => {
            if(err){
                res.status(400).send(err);
            }
            else{
                const db = client.db("SIH2020");
                const collection = db.collection("Users");
                collection.insertOne(req.body, (err, data) => {
                    if(err){
                        res.status(400).send(err);
                        client.close();
                    }
                    else{
                        res.status(200).send(data);
                        client.close();
                    }
                });
            }
        });
    }
    else{
        res.status(400).send("Missing Arguments");
    }
});

app.get('/getUsers', (_, res) => {
    const MongoClient = require('mongodb').MongoClient;
    const uri = "mongodb+srv://SIH2019Login:GbeLZqT6vFzP1gLd@informer2019db-yp3zc.mongodb.net/test?retryWrites=true&w=majority";
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    client.connect(err => {
        if(err){
            res.status(400).send(err);
        }
        else{
            client.db("SIH2020").collection("Users").find({}).toArray((err, body) => {
                if(err){
                    res.status(400).send(err);
                    client.close();
                }
                else{
                    res.status(200).send(body);
                    client.close();
                }
            });
        }
    });
});

app.get('/getUser', (req, res) => {
    if(req.query.id){
        const mongo = require('mongodb');
        const MongoClient = mongo.MongoClient;
        const uri = "mongodb+srv://SIH2019Login:GbeLZqT6vFzP1gLd@informer2019db-yp3zc.mongodb.net/test?retryWrites=true&w=majority";
        const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        client.connect(err => {
            if(err){
                res.status(400).send(err);
            }
            else{
                client.db("SIH2020").collection("Users").findOne(mongo.ObjectId(req.query.id)).then((err, body) => {
                    if(err){
                        res.status(400).send(err);
                        client.close();
                    }
                    else{
                        res.status(200).send(body);
                        client.close();
                    }
                });
            }
        });
    }
    else{
        res.status(400).send("Missing Arguments");
    }
});

app.delete('/deleteUser', (req, res) => {
    if(req.query.id){
        const mongo = require('mongodb');
        const MongoClient = mongo.MongoClient;
        const uri = "mongodb+srv://SIH2019Login:GbeLZqT6vFzP1gLd@informer2019db-yp3zc.mongodb.net/test?retryWrites=true&w=majority";
        const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        client.connect(err => {
            if(err){
                res.status(400).send(err);
            }
            else{
                client.db("SIH2020").collection("Users").deleteOne({"_id": mongo.ObjectId(req.query.id)}).then((err, body) => {
                    if(err){
                        res.status(400).send(err);
                        client.close();
                    }
                    else{
                        res.status(200).send(body);
                        client.close();
                    }
                });
            }
        });
    }
    else{
        res.status(400).send("Missing Arguments");
    }
});

calcDist = (x1, y1, x2, y2) => {
    if ((x1 == x2) && (y1 == y2)) {
		return 0;
	}
	else {
		var radlat1 = Math.PI * x1/180;
		var radlat2 = Math.PI * x2/180;
		var theta = y1-y2;
		var radtheta = Math.PI * theta/180;
		var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
		if (dist > 1) {
			dist = 1;
		}
		dist = Math.acos(dist);
		dist = dist * 180/Math.PI;
		dist = dist * 60 * 1.1515;
		dist = dist * 1.609344;
		return dist.toFixed(2);
	}
}

app.listen(port, host, () => {
    console.log(`Server running at http://${host}:${port}`);
});
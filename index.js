const express = require('express')
const fetch = require('fetch').fetchUrl
const cors = require('cors')
const app = express()
const port = 8000

app.use(cors())
app.use(express.json({limit: '15MB'}));

app.get('/', (req, res) => {
    res.send('Informer 2019 Server')
})

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
})

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
})

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
})

app.post('/analyzeImage', (req, res) => {
    if(req.body.image){
        res.status(200).send(req.body.image);
    }
    else{
        res.sendStatus(400);
    }
})

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

app.listen(port, '0.0.0.0', () => {
    console.log(`Server running @ port ${port}!`);
})
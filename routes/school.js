const express = require('express')
const router = express.Router();
const db = require('../db.js')


//add school route

router.post('/addSchool', (req, res)=>{
    if(!req.body){
        return res.status(400).json({message: 'Please provide all required fields'});
    }
    const {name,address, latitude,longitude} = req.body;

    if(!name || !address || !latitude || !longitude){
        return res.status(400).json({message: 'Please provide all required fields'});
    }
    const sql = `INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)`;
    db.query(sql, [ name, address, latitude, longitude], (err, result) => {
        if (err) {
            console.error('Error inserting data:', err);
            return res.status(500).json({ message: 'Error inserting data' });
        }
        res.status(201).json({ message: 'School added successfully', schoolId: result.insertId });
    });

})

//getSchool route

router.get('/getSchool', (req, res)=>{
    const userLat = req.query.lat;
    const userLong = req.query.long;
    if(isNaN(userLat) || isNaN(userLong)){
        return res.status(400).json({message: 'Please provide valid latitude and longitude'});
    }
    const sql = 'SELECT * from schools';
    db.query(sql, (error, result)=>{
        if(error) return res.status(400).json({error});

        result.forEach(school => {
            const dLat = (userLat-school.latitude)* Math.PI/180;
            const dLong = (userLong - school.longitude)*Math.PI/180;
            //geopgraphical distnace
            const a = Math.sin(dLat/2)**2 + Math.cos(userLat*Math.PI/180)*
            Math.cos(school.latitude *Math.PI/180)*
            Math.sin(dLong/2)**2;

            const c = 2*Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
            const R = 6371;
            school.distance = R*c;
        });
        //sort the result based on distance
        result.sort((a,b)=> a.distance - b.distance);
        res.json(result);
    });
});

module.exports = router;

const express = require('express');
const axios = require('axios');

var app = express();
const PORT = process.env.PORT||5000;
app.listen(PORT);
app.get('/:location',(req,res)=>{
    var location=req.params.location
    var encodedAddress = encodeURIComponent(location);
    var googleKey = 'YOUR-GOOGLE-API-TOKEN';
    var skyKey = 'YOUR-SKY-API-TOKEN';
    var geocodeUrl = 'https://maps.googleapis.com/maps/api/geocode/json?key='+googleKey+'&address='+encodedAddress;


    axios.get(geocodeUrl)
    .then((response) =>{
        if(response.data.status === 'ZERO_RESULTS'){
            throw new Error('The address has been not found from Google API');
        }
        //we collect lat/lnt from google
        var lat = response.data.results[0].geometry.location.lat;
        var lng = response.data.results[0].geometry.location.lng;
        var weatherUrl = 'https://api.darksky.net/forecast/'+skyKey+'/'+lat+','+lng;
        //we print the address
        //console.log('Address -> '+response.data.results[0].formatted_address);
        finalJson = [];
        finalJson = [{'address' : response.data.results[0].formatted_address}];
        //console.log(finalJson);
        return axios.get(weatherUrl);
    })
    .then((response)=>{
        var temperature = ((response.data.currently.temperature-32)*5)/9;
        var apparentTemperature = ((response.data.currently.apparentTemperature-32)*5)/9;
        var summary = response.data.currently.summary;
        var summaryDaily =  response.data.daily.summary;
        var pressure =  response.data.currently.pressure;
        var humidity =  response.data.currently.humidity;
        var timezone =  response.data.currently.timezone;

        //console.log('Temperature -> '+temperature+'(F)');
        finalJson.push
        ({'temperature (C°)':temperature},
        {'apparentTemperature (C°)':apparentTemperature},
        {'currentWeather':summary},
        {'pressure': pressure},
        {'humidity' : humidity}, 
        {'summaryDaily' : summaryDaily},
        {'Author' : 'Daniele Salvigni ~ SanGy ~'});
       //console.log(JSON.stringify(finalJson,undefined,2));
       res.send(finalJson);
        
    })
    .catch((e)=>{
        if(e.code === 'ENOTFOUND'){
           // console.log('Unable to connect to Google API Server.')
        } else{
           // console.log(e.message);
        }
        
    });

});



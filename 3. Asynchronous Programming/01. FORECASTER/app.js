 function attachEvents() {
    
    let submitButton = document.querySelector('#submit');
    let locationInput = document.querySelector('#location');
    let forecastDiv = document.querySelector('#forecast');
    let currentDiv = forecastDiv.querySelector('#current');
    let currentDivLabel = currentDiv.querySelector('div');
    let upcomingDiv = forecastDiv.querySelector('#upcoming');
    let url = 'https://judgetests.firebaseio.com/locations.json';
    
    submitButton.addEventListener('click',async ()=>{
        let time = Date.now();
        forecastDiv.setAttribute('style', 'display:true');
        try{
        //Remove the old data if there is
            removeOldData();
        //Call the functions and get the details
        let code = await getCityCode();
        let conditions = await getConditions(code);
        let forecast = await get3DayForecast(code);

        currentDivLabel.innerText = 'Current conditions'
        upcomingDiv.setAttribute('style', 'display:true');

        let forecastsDiv = document.createElement('div');
        forecastsDiv.setAttribute('class', 'forecasts');

        let conditionSymbolSpan = document.createElement('span');
        conditionSymbolSpan.setAttribute('class', 'condition symbol');
        //Add the condition symbol
        conditionSymbolSpan.innerText = getConditionSymbol(conditions.forecast.condition);

        //Creating the new elements
        let conditionForecastSpan = document.createElement('span');
        conditionForecastSpan.setAttribute('class', 'condition');

        let citySpan = document.createElement('span');
        citySpan.setAttribute('class', 'forecast-data');
        citySpan.innerText = conditions.name;

        let temperaturesSpan = document.createElement('span');
        temperaturesSpan.setAttribute('class', 'forecast-data');
        temperaturesSpan.innerText = `${conditions.forecast.low}°/${conditions.forecast.high}°`;

        let conditionSpan = document.createElement('span');
        conditionSpan.setAttribute('class', 'forecast-data');
        conditionSpan.innerText = conditions.forecast.condition;

        conditionForecastSpan.appendChild(citySpan);
        conditionForecastSpan.appendChild(temperaturesSpan);
        conditionForecastSpan.appendChild(conditionSpan);

        forecastsDiv.appendChild(conditionSymbolSpan);
        forecastsDiv.appendChild(conditionForecastSpan);

        //Adding it to the main div element
        currentDiv.appendChild(forecastsDiv);

        //3 days cast as array
        let futureForecasts = forecast.forecast;

        let threeDayForecastDiv = document.createElement('div');
        threeDayForecastDiv.setAttribute('class', 'forecast-info');
        //Cycling through all the elements
        for (const item of futureForecasts) {
            //Creating the elements
            let upComingSpan = document.createElement('span');
            upComingSpan.setAttribute('class', 'upcoming');

            let symbolSpan = document.createElement('span');
            symbolSpan.setAttribute('class', 'symbol');
            symbolSpan.innerText = getConditionSymbol(item.condition);

            let temperaturesSpan2 = document.createElement('forecast-data');
            temperaturesSpan2.setAttribute('class', 'forecast-data');
            temperaturesSpan2.innerText = `${item.low}°/${item.high}°`;

            let conditionSpan2 = document.createElement('forecast-data');
            conditionSpan2.setAttribute('class', 'forecast-data');
            conditionSpan2.innerText = item.condition;

            //Appending all the elements
            upComingSpan.appendChild(symbolSpan);
            upComingSpan.appendChild(temperaturesSpan2);
            upComingSpan.appendChild(conditionSpan2);
            
            threeDayForecastDiv.appendChild(upComingSpan);

            console.log(Date.now() - time);
        }

        //Appending the forecasts in the big div
        upcomingDiv.appendChild(threeDayForecastDiv);
        }catch(err){
            //If there is an error we set the innertext to error and hide the upcoming div
            removeOldData();
            currentDivLabel.innerText = 'Error'
            upcomingDiv.setAttribute('style', 'display:none');
            return;
        }
    })

    function removeOldData(){
        //Check if there is data in the forecast and remove it
        let existingDivs = Array.from(currentDiv.querySelectorAll('.forecasts'));
            while (existingDivs.length) {
                existingDivs[0].remove();
                existingDivs.splice(0,1);
            }
        //Check if there is data in the three day forecast and remove it
        let existingThreeDayDivs = Array.from(upcomingDiv.querySelectorAll('.forecast-info'));
        while(existingThreeDayDivs.length){
            existingThreeDayDivs[0].remove();
            existingThreeDayDivs.splice(0,1);
        }
    }

    function getConditionSymbol(condition){
        switch(condition){
            case 'Sunny': return '☀';
            case 'Partly sunny': return '⛅'; 
            case 'Overcast': return '☁'; 
            case 'Rain': return '☂';
        }
    }

    async function get3DayForecast(code){
        let threeDayForecastURL = `https://judgetests.firebaseio.com/forecast/upcoming/${code}.json`;
        let forecast = await fetch(threeDayForecastURL).then(result => result.json());
        return forecast;
    }

    async function getConditions(code){
        let conditionURL = `https://judgetests.firebaseio.com/forecast/today/${code}.json`;
        let conditions = await fetch(conditionURL).then(result => result.json());
        return conditions;
    }

    async function getCityCode(){
        let cities = await fetch(url).then(result=> result.json());
        let currentCityInput = locationInput.value;
        let cityObject = cities.find(x=>x.name === currentCityInput);
        if (!cityObject) {
            throw new Error('There is no such city!');
        }
        return cityObject.code;
        };
}

attachEvents();
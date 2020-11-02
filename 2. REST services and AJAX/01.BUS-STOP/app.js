function getInfo() {
    let inputStopId = document.querySelector('#stopId');
    let divStopName = document.querySelector('#stopName');
    let busUL = document.querySelector('#buses');
    busUL.innerHTML = '';
        let stopId = inputStopId.value;
        let url = `https://judgetests.firebaseio.com/businfo/${stopId}.json`;

        fetch(url)
            .then(response=> response.json())
            .then(data =>{
                if (!!data.error) {
                    divStopName.innerHTML = 'Error';
                    return;
                }
                divStopName.innerHTML = data.name;
                let buses = data.buses;
                let busIds = Object.keys(buses);
                inputStopId.value = '';
                busUL.innerHTML = busIds.map(x=> `<li>Bus ${x} arrives in ${buses[x]} minutes</li>`).join('');
            });


            //With httpRequest
        // const httpRequest = new XMLHttpRequest();

        // httpRequest.addEventListener('loadend', function(){
        //     if (this.status === 401) {
        //         divStopName.innerHTML = 'Error';
        //         busUL.innerHTML = '';
        //         return;
        //     }
        //     let response = JSON.parse(httpRequest.responseText);
        //     divStopName.innerHTML = response.name;
        //     let buses = response.buses;
        //     let busIds = Object.keys(buses);
            
        //     busUL.innerHTML = busIds.map(x=> `<li>Bus ${x} arrives in ${buses[x]} minutes</li>`).join('');
        // });
        
        // httpRequest.open('GET', url);
        // httpRequest.send();
}
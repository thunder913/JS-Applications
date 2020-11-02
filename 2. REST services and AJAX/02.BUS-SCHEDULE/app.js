function solve() {
    let departInput = document.querySelector('#depart');
    let arriveInput = document.querySelector('#arrive');
    let infoDiv = document.querySelector('#info');
    let nextStationID = 'depot';
    let currentStationObj = '';
    let url = '';
    function depart() {
            url = `https://judgetests.firebaseio.com/schedule/${nextStationID}.json`;
            fetch(url)
                .then(response => response.json())
                .then(response => {
                    currentStationObj = response;
                    infoDiv.textContent = `Next stop ${currentStationObj.name}`;
                })
                departInput.setAttribute('disabled', 'true');
                arriveInput.removeAttribute('disabled');
    }

    function arrive() {
        infoDiv.textContent = `Arriving at ${currentStationObj.name}`;
        nextStationID = currentStationObj.next;
        arriveInput.setAttribute('disabled', 'true');
        departInput.removeAttribute('disabled');
    }

    return {
        depart,
        arrive
    };
}

let result = solve();
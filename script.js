let timeEl = document.getElementById('time');
let dateEl = document.getElementById('date');
let currentWeatherItemsEl = document.getElementById('current-weather-items');
let timezone = document.getElementById('time-zone');
let countryEl = document.getElementById('country');
let weatherForecastEl = document.getElementById('weather-forecast');
let currentTempEl = document.getElementById('current-temp');
let h3 = document.querySelector("h3");
let offCanva = document.querySelector(".offcanvas-body");
let placeContainerEl = document.querySelector('.place-container');


// input.addEventListener("GetInfo()",display);
// call both time 
let storageList = [];
let before_search = JSON.parse(localStorage.getItem('City Name'))
if (before_search){
    storageList = before_search
}

function city_name() {
    document.getElementById('weather-forecast').innerHTML = "";
    let newName = document.getElementById("cityInput").value;
    getFutureForcastData(newName);
    getCurrentForcastData(newName);
    storageList.push(newName);
    console.log("STORAGE: ", storageList);
    localStorage.setItem("City Name", JSON.stringify(storageList) )
    // let cityName= document.getElementById("cityName");
    //  cityName.innerHTML="--"+newName.value+"--"
    document.getElementById("cityInput").value = "";
}

display()
function display() {
    //localStorage.setItem('newName', input.value);
    let data = JSON.parse(localStorage.getItem('City Name'));
    for (let i = 0; i < data.length; i++) {
        let btnEl = document.createElement("button");
        btnEl.setAttribute("class", "btn btn-primary");
        btnEl.setAttribute("class", "btn-element");
        btnEl.innerHTML = data[i];
        offCanva.append(btnEl)
    }
   // console.log(localStorage.getItem('newName'));
}
let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

//let listBtn = document.querySelector(".btn-element");

offCanva.addEventListener("click", (e) => {
    document.getElementById('weather-forecast').innerHTML = "";
    let element = e.target.innerHTML;
    console.log("EVENT: ", element.innerHTML);
    getFutureForcastData(element)
    getCurrentForcastData(element);
})

function CheckDay(days) {
    if (days + time.getDay() > 6) {
        return days + time.getDay() - 7
    }
    else {
        return days + time.getDay();
    }
}
//console.log(CheckDay);
setInterval(() => {
    let time = new Date();
    let month = time.getMonth();
    let date = time.getDate();
    let day = time.getDay();
    let hour = time.getHours();
    let hoursIn12HrFormat = hour >= 13 ? hour % 12 : hour
    let minutes = time.getMinutes();
    let ampm = hour >= 12 ? 'PM' : 'AM'

    timeEl.innerHTML = (hoursIn12HrFormat < 10 ? '0' + hoursIn12HrFormat : hoursIn12HrFormat) + ':' + (minutes < 10 ? '0' + minutes : minutes) + '' + `<span id="am-pm">${ampm}</span>`

    dateEl.innerHTML = days[day] + ', ' + date + ' ' + months[month]

}, 1000);

let API_KEY = '5657df8791b81f5bcce648257200e552';
//getWeatherData()
//future
function getFutureForcastData(city_name) {
    //let city_name= document.getElementById("cityInput");
    navigator.geolocation.getCurrentPosition((success) => {
        // console.log(success);
        let { latitude, longitude } = success.coords;
        //api add city name but need space
        fetch(
            //`https://api.openweathermap.org/data/2.5/forecast?lat={latitude}&lon={longitude}&units=imerial&appid={API_KEY}`
            `https://api.openweathermap.org/data/2.5/forecast?q=${city_name}&units=imperial&appid=${API_KEY}`)
            .then(res => res.json())
            .then(data => {
                //futureCast(data)

                console.log("beginning: ",data)
                //return showWeatherData(data);

                getFiveDaysForcast(data.list)
                showWeatherData(data)
            })


    })
}

function getFiveDaysForcast(daily) {
   // let result = [];
    let x = moment().add(1, 'day').startOf('day').unix();
    let y = moment().add(6, 'day').startOf('day').unix();
    for (let i = 0; i < daily.length; i++) {
        //console.log("RESPONSE: ", data.list[i])
        if (daily[i].dt >= x && daily[i].dt < y) {
            if (daily[i].dt_txt.slice(11, 13) == "12") {
                //console.log("RES: ", daily[i])
                //result.push(daily[i])
                //console.log("RESULT: ", result)
                //result.forEach((el) => {
                    loadDom(daily[i])
                //});        
            }
        }
    }
}

function loadDom (x) {
    let game = `
                                <div class="other">
                                <img src="http://openweathermap.org/img/wn/${x.weather[0].icon}@4x.png" alt="weather icon" class="w-icon">
                                <div class="day">${window.moment(x.dt * 1000).format('ddd')}</div>
                                <div>${x.main.temp}&#176;</div>
                                </div>
    
                                `
                                let mainEl = document.createElement("div")
                                mainEl.innerHTML = game;
                              // console.log("GAME: ", game);
                               console.log("MAINEL: ", mainEl);
                                weatherForecastEl.appendChild(mainEl)
                               // return game;
}
///////////////////////////////////////////////
function getCurrentForcastData(city_name){
    navigator.geolocation.getCurrentPosition((success) => {
        let { latitude, longitude } = success.coords;
        fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city_name}&units=imperial&appid=${API_KEY}`)
            .then(res => res.json())
            .then(data => {
                console.log("today: ",data)

                currentDom(data);
    }
    )}
)}
function currentDom (y) {
    let nowTemp = `<div class="today" id="current-temp">
    <div class="day">${window.moment(y.dt * 1000).format('ddd')}</div>
    <div>${y.main.temp}&#176;</div>
    <img src="http://openweathermap.org/img/wn/${y.weather[0].icon}@4x.png" alt="weather icon" class="w-icon">
    </div>`

    let mainEl = document.createElement("div")
                                mainEl.innerHTML = nowTemp;
                               console.log("MAINEL: ", mainEl);
                               placeContainerEl.appendChild(mainEl)
}

//////////////////////////////////////////////////////
// function futureCast(data) {
//     let otherDayForcast = ''
//     for (i = 0; i < data.length; i++) {
//         otherDayForcast.innerHTML +=

//             `
//         <div class="weather-forecast-item">
//         <div class="day">${day}</div>
//         <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="weather icon" class="w-icon">
//         <div class="temp"> {temp}${day.main.temp}&#176;</div>
        
//                             </div>
//                             <div class="weather-forecast-item">
//                 <div class="day">${day}</div>
//                 <img src="http://openweathermap.org/img/wn/10d@2x.png" alt="weather icon" class="w-icon">
//                 <div class="temp">${temp}&#176;</div>
//                 </div>
//             <div class="weather-forecast-item">
//             <div class="day">${day}</div>
//                 <img src="http://openweathermap.org/img/wn/10d@2x.png" alt="weather icon" class="w-icon">
//                 <div class="temp">${temp}&#176;</div>

//             </div>
//             <div class="weather-forecast-item">
//             <div class="day">${day}</div>
//                 <img src="http://openweathermap.org/img/wn/10d@2x.png" alt="weather icon" class="w-icon">
//                 <div class="temp">${temp}&#176;</div>
//             </div>
//             <div class="weather-forecast-item">
//             <div class="day">${day}</div>
//                 <img src="http://openweathermap.org/img/wn/10d@2x.png" alt="weather icon" class="w-icon">
//                 <div class="temp">${temp}&#176;</div>
//                 </div>
//                 `

//     }

// }
// function today API
function showWeatherData(data) {
    //console.log("SWD: ", data)
    let { humidity, pressure, temp } = data.list[0].main;
    let { speed } = data.list[0].wind;

    currentWeatherItemsEl.innerHTML =
        `<div class="weather-item">
    <div>humidity</div>
    <div>${humidity}%</div>
    </div>
    <div class="weather-item">
    <div>pressure</div>
    <div>${pressure}</div>
    </div>
    <div class="weather-item">
    <div>wind speed</div>
    <div>${speed}</div>
    </div>`;

}

// var test = [
//     "<h1>Hello World!</h1>",
//     "<h1>Hello World!</h1>",
//     "<h1>Hello World!</h1>",
//     "<h1>Hello World!</h1>"
// ]

// for (let i = 0; i < test.length; i++) {
//     var test1 = document.createElement("div")
//     test1.innerHTML = test[i]
//     console.log(test1);
//     weatherForecastEl.appendChild(test1)
// }




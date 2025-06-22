const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weather-container");

const grantAccessContainer = document.querySelector(".grant-location-container");
const searchForm = document.querySelector("[data-searchForm]");
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");

   //initaially variables need????

   let oldTab = userTab;
   const API_KEY = "2451f295590109b7bcbf33143f35e336";
   //const API_KEY = "d1845658f92b31c64bd94f06f7188c9c";
   oldTab.classList.add("current-tab");
    getfromSessionStorage();

   function switchTab(newTab) {
    if(newTab != oldTab) {
        oldTab.classList.remove("current-tab");
        oldTab = newTab;
        oldTab.classList.add("current-tab");

        if(!searchForm.classList.contains("active"))
        {
            // kya search form bala invigible if yes then make it visible
          userInfoContainer.classList.remove("active");
          grantAccessContainer.classList.remove("active");
          searchForm.classList.add("active");   
        }
        else{
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");
            getfromSessionStorage();
        }
     }
   }
   userTab.addEventListener("click",() => {
         //pass clicked tab as input parameter
       switchTab(userTab);    
   });

   searchTab.addEventListener("click",() => {
    //pass clicked tab as input parameter
  switchTab(searchTab);    
   });
    //https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API key}&units=metric

//check if coordinate are alreaddy present in session strorage
function getfromSessionStorage() {
    const localCoordinates = sessionStorage.getItem("user-coordinates");
    if(!localCoordinates)
    {
        grantAccessContainer.classList.add("active");
    }
    else{
        const coordinates = JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }
}

 async function fetchUserWeatherInfo(coordinates)
{
    const {lat, lon} = coordinates;
    // make grantcontainer invisible
     grantAccessContainer.classList.remove("active");
     //make loader visible
     loadingScreen.classList.add("active");

     //API CALL
     try{
        const response = await fetch(
             `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
        );
        const data = await response.json();

        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
     }
     catch(err) {
        loadingScreen.classList.remove("active");
        console.error("Error fetching user weather info:", err);
     }
}

 function renderWeatherInfo(weatherInfo){
       //firstly,we have to fetch the elements

       const cityName = document.querySelector("[data-cityName]");
       const countryIcon = document.querySelector("[data-countryIcon]");
       const desc = document.querySelector("[data-weatherDesc]");
       const weatherIcon = document.querySelector("[data-weatherIcon]");
       const temp = document.querySelector("[data-temp]");
       const windspeed = document.querySelector("[data-windspeed]");
       const humidity = document.querySelector("[data-humidity]");
       const cloudiness = document.querySelector("[data-cloudiness]");

       //fetch value from weatherINFO object and put it UI elements
       cityName.innerText = weatherInfo?.name;
       countryIcon.src = `https://flagcdn.com/48x36/${weatherInfo?.sys?.country.toLowerCase()}.png`;
       desc.innerText = weatherInfo?.weather?.[0]?.description;
       weatherIcon.src = `https://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
       temp.innerText = `${weatherInfo?.main?.temp}°C `;
       windspeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
       humidity.innerText = `${weatherInfo?.main?.humidity} %`;
       cloudiness.innerText = `${weatherInfo?.clouds?.all} %`;

 }

 function getLocation() {
    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
        //HW- show an alert for no geolocation support available
    }
 }

 function showPosition(position) {
    const UserCoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    }

    sessionStorage.setItem("user-coordinates",JSON.stringify(UserCoordinates));
    fetchUserWeatherInfo(UserCoordinates);

  }

  const grantAccessButton = document.querySelector("[data-grantAccess]");
  grantAccessButton.addEventListener("click",getLocation);

const searchInput = document.querySelector("[data-searchInput]");

searchForm.addEventListener("submit",(e) => {
    e.preventDefault();
    let cityName = searchInput.value;

    if(cityName === "")
        return;
    else
      fetchSearchWeatherInfo(cityName);
})

async function fetchSearchWeatherInfo(city) {
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");

    try{
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
       );
       const data = await response.json();

       loadingScreen.classList.remove("active");
       userInfoContainer.classList.add("active");
       renderWeatherInfo(data);
    }

    catch(err) {
        loadingScreen.classList.remove("active");
    console.error("Error fetching searched city weather:", err);
    alert("City not found or something went wrong.");

    }
}
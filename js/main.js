let cityValue, country;
if (!localStorage.getItem("city"))
{
    cityValue = "Hays, KS";
    country = "us";
}
else
{
    cityValue = localStorage.getItem("city") + ", " + localStorage.getItem("state");
    country = localStorage.getItem("country");
}


document.addEventListener("readystatechange", (event) => 
{
    if (event.target.readyState === "complete") 
    {
        initApp();
    }
});

const initApp = () => 
{
    const searchForm = document.getElementById("searchForm");
    searchForm.addEventListener("submit", (event) => 
    {
      event.preventDefault();
      processSubmission();
    })
};

const processSubmission = () =>
{
    let country = document.getElementById("country");
    let city = document.getElementById("city");
    let state = document.getElementById("state");
    
    let cityValue = city.value;
    if (state != "")
    {
        cityValue += ", " + state;
    }

    fetchAPI(cityValue, country.value, 1);

    localStorage.setItem("country", country.value);
    localStorage.setItem("state", state.value);
    localStorage.setItem("city", city.value);
};

const fetchAPI = (cityValue, country, newOrOld) =>
{
    const data = fetch("https://api.openweathermap.org/data/2.5/weather?q="+ cityValue + "," + country +"&units=imperial&APPID=393ba4ad43d3647fb67665c515dab1d0")
    .then(response => {
        return response.json();
    }).then(data =>{
        let icon = data.weather[0].icon;
        let temp = data.main.temp;
        let desc = data.weather[0].description;

        if (newOrOld == 1)
        {
            displayNewData(icon, temp, desc);
        }
        else if (newOrOld == 0)
        {
            displayOldData(icon, temp, desc, cityValue);
        }
    }).catch((error) =>
    {
        let errMessage = document.getElementById("cityAndState");
        let image = document.getElementById("image");
        let temp = document.getElementById("temp");
        let desc = document.getElementById("description");
        errMessage.innerHTML = "Invalid city name";
        image.style = "visibility: hidden;";
        temp.style = "visibility: hidden;";
        desc.style = "visibility: hidden;";
    });
}

fetchAPI(cityValue, country , 0);

const displayNewData = (icon, temp, desc) =>
{
        let image = document.getElementById("image");
        image.style = "visibility: visible;";
        image.src = "http://openweathermap.org/img/wn/" + icon + "@2x.png"
        let myTemp = document.getElementById("temp");
        myTemp.style = "visibility: visible;";
        myTemp.innerHTML = temp + "&#8457;";
        let cityAndState = document.getElementById("cityAndState");
        cityAndState.innerHTML = city.value + ", " + state.value;
        let description = document.getElementById("description");
        description.style = "visibility: visible;";
        description.innerHTML = desc;
};

const displayOldData = (icon, temp, desc, city_state) =>
{
        let image = document.getElementById("image");
        image.src = "http://openweathermap.org/img/wn/" + icon + "@2x.png"
        let myTemp = document.getElementById("temp");
        myTemp.innerHTML = temp + "&#8457;";
        let cityAndState = document.getElementById("cityAndState");
        cityAndState.innerHTML = city_state;
        let description = document.getElementById("description");
        description.innerHTML = desc;
};

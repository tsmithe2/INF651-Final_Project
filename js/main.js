
/*
    This portion is used to gather local storage data.
*/
let cityValue, country;
if (!localStorage.getItem("city"))
{
    cityValue = "Hays, KS";
    country = "us";
}
else if (localStorage.getItem("country") != "us")
{
    cityValue = localStorage.getItem("city") + ", " + localStorage.getItem("country");
    country = localStorage.getItem("country");
}
else
{
    cityValue = localStorage.getItem("city") + ", " + localStorage.getItem("state");
    country = localStorage.getItem("country");
}

/*
    When the webpage has loaded fully, then initialize the app.
 */
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

/*
    Get data from input. Check for numbers and invalid city names.
    This is limited in ability to error check since some invalid
    city names can successfuly query with the OpenWeatherMap API.
 */
const processSubmission = () =>
{
    let country = document.getElementById("country");
    let city = document.getElementById("city");
    let state = document.getElementById("state");
    let cityValue = city.value;
    if (state != "N/A")
    {
        cityValue += ", " + state;
    }

    let nums = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
    let flag = 0; // value is zero when there are no numbers in city.
    for (let i = 0; i < city.value.length; i++)
    {
        if (city.value[i] in nums)
        {
            flag = 1;
        }
    }

    if (flag == 0)
    {
        fetchAPI(cityValue, country.value, 1);
        localStorage.setItem("country", country.value);
        localStorage.setItem("state", state.value);
        localStorage.setItem("city", city.value);
    }
    else if (flag == 1)
    {
        let errMessage = document.getElementById("cityAndState");
        let image = document.getElementById("image");
        let temp = document.getElementById("temp");
        let desc = document.getElementById("description");
        errMessage.innerHTML = "Invalid city name";
        image.style = "visibility: hidden;";
        temp.style = "visibility: hidden;";
        desc.style = "visibility: hidden;";
        updateScreenReaderConfirmation("There was an error. Make sure that city is spelled correctly.");
    }
};

/*
    Fetch associated data from the OpenWeatherMap API. Catch errors where city names
    are misspelled or invalid.
 */
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
            displayNewData(icon, temp, desc, country);
            updateScreenReaderConfirmation("Request was made successfully");
        }
        else if (newOrOld == 0)
        {
            displayOldData(icon, temp, desc, cityValue);
            updateScreenReaderConfirmation("Request was made successfully");
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
        updateScreenReaderConfirmation("There was an error. Make sure that city is spelled correctly.");
    });
}

fetchAPI(cityValue, country , 0); //used for first instance, and when returning to the app.

/*
    Display the data that was requested.
 */
const displayNewData = (icon, temp, desc, country) =>
{
        let image = document.getElementById("image");
        image.style = "visibility: visible;";
        image.src = "http://openweathermap.org/img/wn/" + icon + "@2x.png"
        let myTemp = document.getElementById("temp");
        myTemp.style = "visibility: visible;";
        myTemp.innerHTML = temp + "&#8457;";
        let cityAndState = document.getElementById("cityAndState");
        console.log(country);
        if (country != "us")
        {
            cityAndState.innerHTML = city.value + ", " + country;
        }
        else if (state.value != "N/A")
        {
            cityAndState.innerHTML = city.value + ", " + state.value;
        }
        else if (state.value == "N/A")
        {
            cityAndState.innerHTML = city.value + ", " + country;
        }
        let description = document.getElementById("description");
        description.style = "visibility: visible;";
        description.innerHTML = desc;
        updateScreenReaderConfirmation("Displaying new data");
};

/*
    Display data when the screen is refreshed.
 */
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
        updateScreenReaderConfirmation("Displaying old data");
};

/*
    Update the screen reader text when the user performs an action.
 */
const updateScreenReaderConfirmation = (action) =>
{
    document.getElementById("confirmation").textContent = `${action}`;
};
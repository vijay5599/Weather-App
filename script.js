const wrapper = document.querySelector('.wrapper'),
inputPart = wrapper.querySelector(".input-part"),
infoTxt = inputPart.querySelector(".info-text"),
inpputField = inputPart.querySelector("input"),
locationBtn = inputPart.querySelector('button'),
wIcon = wrapper.querySelector('.weather-part img')
arrowBack = wrapper.querySelector("header i")

let api;
inpputField.addEventListener("keyup", e =>{
    if(e.key == 'Enter' && inpputField.value != " "){
        requestApi(inpputField.value);
    }
});

locationBtn.addEventListener("click", () =>{
    // if browser support geolocation api
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(onSuccess, onError);
    }else{
        alert("You browser not support geolocation api")
    }
})

function onError(error){
    // if any error occur while getting user location then we'll show it in infoText
    infoTxt.innerHTML = error.message;
    infoTxt.classList.add("error");
}

function onSuccess(position){
    const {latitude, longitude} = position.coords;
    api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apikey}`;
    fetchData();
}


let apikey = `6d63b96598ec13a02342e25bb766ab95`;
function requestApi(city){
    api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apikey}`;
    fetchData();
    
}

function fetchData(city){
    infoTxt.innerHTML = `Getting weather details.....`;
    infoTxt.classList.add("pending");
    fetch(api).then(res => res.json()).then(result => weatherDetails(result)).catch(() =>{
        infoTxt.innerText = "Something went wrong";
        infoTxt.classList.replace("pending", "error");
    });
}

function weatherDetails(info){
    if(info.cod == "404"){
        infoTxt.classList.replace("pending", "error");
        infoTxt.innerHTML = `<b>${inpputField.value}</b> isn't valid city`;
    }else{
        const city = info.name;
        const country = info.sys.country;
        const {description, id} = info.weather[0];
        const {feels_like, humidity, temp} = info.main;

        if(id == 800){
            wIcon.scr ="icons/clear.svg"
        }
        else if(id >= 200 && id <= 232){
            wIcon.scr ="icons/strom.svg"
        }
        else if(id >= 600 && id <= 622){
            wIcon.scr ="icons/snow.svg"
        }
        else if(id >= 701 && id <= 781){
            wIcon.scr ="icons/haze.svg"
        }
         else if(id >= 801 && id <= 804){
            wIcon.src = "icons/cloud.svg";
         }
        else if((id >= 500 && id <= 531) || (id >= 300 && id <= 321)){
            wIcon.src = "icons/rain.svg";
        }

        //Passing above values to perticular HTML element
        wrapper.querySelector(".temp .numb").innerHTML = Math.floor(temp);
        wrapper.querySelector(".weather").innerHTML = description;
        wrapper.querySelector(".location span").innerHTML = `${city}, ${country}`;
        wrapper.querySelector(".temp .numb-2").innerHTML = Math.floor(feels_like);
        wrapper.querySelector(".humidity span").innerHTML = `${humidity}%`;
        infoTxt.classList.remove("pending", "error");
        // infoTxt.innerText = "";
        // inputField.value = " ";
        wrapper.classList.add("active");
        console.log(info)
    }
    // 
}

arrowBack.addEventListener("click", () => {
    wrapper.classList.remove("active")
    infoTxt.innerText = "";
    // inputField.value = "";
})
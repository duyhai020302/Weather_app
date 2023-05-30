
const APP_ID='68b2ae4140087cc339f2331eb62d53df'; //ko nen api key o client side
const searchInput=document.querySelector('#search-input');
const cityName = document.querySelector('.city-name');
const weatherState = document.querySelector('.weather-state');
const weatherIcon = document.querySelector('.weather-icon');
const temperature = document.querySelector('.temperature');
const DEFAULT_value='--';

const sunrise = document.querySelector('.sunrise');
const sunset = document.querySelector('.sunset');
const humidity = document.querySelector('.humidity');
const windspeed=document.querySelector('.windspeed');

searchInput.addEventListener('change', (event) => {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${event.target.value}&appid=${APP_ID}&units=metric&lang=vi`)
        .then(async res=>{
            const data=await res.json();
            console.log('[seachInput]',data);
            cityName.innerHTML=data.name || DEFAULT_value;
            weatherState.innerHTML=data.weather[0].description || DEFAULT_value;
            weatherIcon.setAttribute('src',`https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`);
            temperature.innerHTML=Math.round(data.main.temp) || DEFAULT_value;
            sunrise.innerHTML=moment.unix(data.sys.sunrise).format('H:m') ||DEFAULT_value;
            sunset.innerHTML=moment.unix(data.sys.sunset).format('H:m') ||DEFAULT_value;
            humidity.innerHTML=data.main.humidity ||DEFAULT_value;
            windspeed.innerHTML=(data.wind.speed * 3.6).toFixed(1) ||DEFAULT_value;
        });
});

var SpeechRecognition=SpeechRecognition || webkitSpeechRecognition;
const recognition=new SpeechRecognition();
const microphone= document.querySelector('.microphone');
microphone.addEventListener('click', (event)=>{
    event.preventDefault();
    recognition.start();
    microphone.classList.add('recording');
});
//confict recognition
recognition.lang='vi-VI';
recognition.continous=false; //giúp dữ liệu từ web api trả về ngay khi kết thúc việc tìm bằng giọng nói

//method when receive API
const handleVoice = (text)=>{
    console.log('text is: ', text);

    const handleText=text.toLowerCase();
    if(handleText.includes('thời tiết tại')){
        const location=handleText.split('tại')[1].trim();//split thoi tiet tai Ha Noi to 2 element 1 is thoi tiet tai 2 is city; [1]: is second element (city) in array after split
        //trim to delete white space
        searchInput.value=location;
        const changeEvent =new Event('change');
        searchInput.dispatchEvent(changeEvent);
    }
};


recognition.onspeechend=()=>{
    recognition.stop();
    microphone.classList.remove('recording');
}

recognition.onerror = (error)=> {
    console.log(error);
    microphone.classList.remove('recording');
}

//event when receive the result from web API
recognition.onresult = (event) =>{
    console.log('onresult', event); //event will be the object contain api after we finished speech
    //take from the path that api return to us in event
    const text=event.results[0][0].transcript;
    handleVoice(text);
}
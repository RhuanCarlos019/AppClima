document.getElementById('search-button').addEventListener('click', function() {
    const query = document.getElementById('search-input').value;
    fetchWeather(query);
});

async function fetchWeather(query) {
    const apiKey = '2ee41cb542b1d1a20e963bef0971cf51';
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${query}&appid=${apiKey}&units=metric&lang=pt`;

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`Erro: ${response.statusText}`);
        }
        const data = await response.json();
        if (data.cod !== 200) {
            throw new Error(`Erro: ${data.message}`);
        }
        displayWeather(data);
        changeBackground(data.main.temp);
        checkExtremeTemperature(data.main.temp);
    } catch (error) {
        console.error('Erro ao buscar dados do clima:', error);
        showModal('Cidade não encontrada. Por favor, verifique o nome e tente novamente.');
    }
}

function displayWeather(data) {
    const weatherInfo = document.getElementById('weather-info');
    weatherInfo.innerHTML = `
        <div class="weather-item"><i class="fas fa-thermometer-half"></i> Temperatura: ${data.main.temp} °C</div>
        <div class="weather-item"><i class="fas fa-tint"></i> Umidade: ${data.main.humidity} %</div>
        <div class="weather-item"><i class="fas fa-wind"></i> Velocidade do vento: ${data.wind.speed} m/s</div>
        <div class="weather-item"><i class="fas fa-temperature-low"></i> Sensação térmica: ${data.main.feels_like} °C</div>
        <div class="weather-item"><i class="fas fa-cloud"></i> Condição: ${data.weather[0].description}</div>
    `;
}

function changeBackground(temp) {
    if (temp < 16) {
        document.body.className = 'cold';
    } else if (temp < 24) {
        document.body.className = 'cool';
    } else if (temp < 31) {
        document.body.className = 'warm';
    } else if (temp < 40) {
        document.body.className = 'hot';
    } else {
        document.body.className = 'very-hot';
    }
}

function checkExtremeTemperature(temp) {
    if (temp < 15) {
        showModal('Agasalhe-se, o dia está muito frio.', 'cold-warning');
    } else if (temp > 40) {
        showModal('Refresque-se, está muito calor.', 'hot-warning');
    }
}

function showModal(message, className) {
    const modal = document.getElementById('error-modal');
    const closeButton = document.querySelector('.close-button');
    const modalContent = document.querySelector('.modal-content');

    modalContent.className = `modal-content ${className || ''}`;
    modalContent.querySelector('p').textContent = message;
    modal.style.display = 'block';

    closeButton.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    });
}

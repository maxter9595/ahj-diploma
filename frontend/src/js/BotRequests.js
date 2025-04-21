import Geolocation from "./Geolocation";
import Templates from "./Templates";

export default class BotRequests {
  /**
   * Creates a new BotRequests object.
   *
   * @param {HTMLElement} mainInput - Main input element for sending user messages.
   * @param {Encryption} encryption - Object responsible for encrypting and decrypting messages.
   * @param {string} url - Base URL for making requests to the server.
   */
  constructor(mainInput, encryption, url) {
    this.mainInput = mainInput;
    this.crypto = encryption;
    this.baseURL = url;
    this.weatherKey = '6888c976737ba72139d9aa3c13e35cdf';
  }

  /**
   * Processes input text and determines the appropriate response or action.
   * 
   * Extracts text content from the main input, trims it, and checks if it starts with the command prefix '@chaos:'.
   * Based on the command following the prefix, it performs different actions such as fetching weather data, exchange rates,
   * a phrase from the server, or facts based on a date. If no known command is found, it returns a default message.
   * If encryption is enabled, it encrypts the input text. Otherwise, it returns the plain text.
   * 
   * @returns {Promise<Object>} An object containing the processed content, encryption status, and command string.
   *                            The content varies based on the command and can be a string or an object.
   */
  async inputProcessing() {
    const inputText = this.mainInput.textContent.trim();
    let content;
    let encryption = false;
    let command;
  
    if (inputText.startsWith('@chaos:')) {
      command = inputText.replace('@chaos:', '').trim().toLowerCase();

      switch(command) {
        case 'погода':
          content = await BotRequests.getWeather(this.showPopup, this.weatherKey);
          break;
        case 'курс':
          content = await BotRequests.getExchangeRates();
          break;
        case 'фраза':
          console.log('фраза url', this.baseURL);
          content = await BotRequests.getPhrase(this.baseURL);
          break;
        default:
          if (/^(0?[1-9]|[1-2][0-9]|3[0-1])\/(0?[1-9]|1[0-2])$/.test(command)) {
            const [day, month] = command.split('/');
            const facts = await BotRequests.getFactsNumber({ day, month });
            content = { facts, this_day: { day, month } };
          } else {
            content = "Неизвестная команда. Доступные команды: погода, курс, фраза, дата";
          }
      }
    }

    else if (this.crypto.encryption) {
      content = this.crypto.encryptMessage(inputText, this.crypto.encryptPassword);
      encryption = true;

    } else {
      content = inputText;
    }
  
    return { 
      content, 
      encryption, 
      command 
    };
  }

  /**
   * Fetches a phrase from the server.
   *
   * @param {string} url - The base URL of the server.
   * @returns {Promise<Object|string>} The server response if successful, 
   *                                   otherwise an error message.
   */
  static async getPhrase(url) {
    const request = await fetch(`${url}/phrase`);
    const response = await request.json();

    if (response.success) {
      return response;
    }
    
    return 'Ошибка сервера'
  }

  /**
   * Fetches the current weather data for the user's location.
   *
   * Obtains the user's geographical location using the Geolocation service
   * and retrieves weather information from the OpenWeatherMap API.
   *
   * @param {function} callback - Callback function to handle geolocation errors.
   * @param {string} weatherKey - API key for authenticating with the OpenWeatherMap service.
   * @returns {Promise<Object>} A promise that resolves to the weather data object.
   */
  static async getWeather(callback, weatherKey) {
    const location = await Geolocation.getLocation(callback);
    const request = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${location.latitude}&lon=${location.longitude}&lang=ru&appid=${weatherKey}`);
    const response = await request.json();
    return response;
  }

  /**
   * Retrieves the current exchange rates for various currencies.
   * 
   * @returns {Promise<Object>} A promise that resolves to the exchange rates object.
   */
  static async getExchangeRates() {
    const request = await fetch('https://www.cbr-xml-daily.ru/daily_json.js');
    const response = await request.json();
    return response;
  }

  /**
   * Retrieves a random historical event that occurred on the given date.
   *
   * Uses the MediaWiki API to obtain a list of historical events that occurred
   * on the given month and day, and then randomly selects one of the events
   * to return.
   *
   * @param {Object} object - An object containing the month and day of the
   *                          event to retrieve.
   * @param {number} object.month - The month of the event to retrieve.
   * @param {number} object.day - The day of the event to retrieve.
   * @returns {Promise<Object|string>} A promise that resolves to the randomly
   *                                   selected event object, or an error message
   *                                   if the API request fails.
   */
  static async getFactsNumber(object) {
    const request = await fetch(`https://api.wikimedia.org/feed/v1/wikipedia/ru/onthisday/all/${object.month}/${object.day}`);
    const response = await request.json();
        
    if (response.events) {
      const randomNumber = Math.floor(Math.random() * response.events.length) + 1   
      return response.events[randomNumber];
    }

    return 'Ошибка сервера'
  }

  /**
   * Retrieves a message to be displayed from the chaos bot, given the server
   * response.
   *
   * @param {Object} message - The server response from the chaos bot.
   * @returns {Object} A promise that resolves to an object containing the
   *                   content and bodyID to be used in the message template.
   */
  static chaosMesEngine(message) {
    let content;
    let bodyID;

    if (message.latitude && message.longitude) {
      const cleanLat = String(message.latitude).replace(/&nbsp;|\u00A0/g, ' ').trim();
      const cleanLng = String(message.longitude).replace(/&nbsp;|\u00A0/g, ' ').trim();
      content = `<span class="coords">Координаты: [${cleanLat}, ${cleanLng}]</span><a class="coords-btn" href="https://www.google.com/maps/place/${cleanLat},${cleanLng}" target="_blank">🌐</a>`;    
    }

    if (message.weather) {
      content = Templates.weatherMarkup(message);
    }

    if (message.Valute) {
      content = Templates.exchangeMarkup(message);
      bodyID = 'chaos';
    }

    if (message.facts) {
      const fact = `<div>В ${message.facts.year} году ${message.facts.text}</div>`;
      content = `<div class="historical-fact"><h3>В этот день ( ${message.this_day.day}.${message.this_day.month} ):</h3>
      ${fact}</div>`
    }

    return {
      content,
      bodyID,
    }
  }
}

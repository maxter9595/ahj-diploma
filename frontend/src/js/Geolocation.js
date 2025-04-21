export default class Geolocation {
  /**
   * Asks user for geolocation and returns it or error message.
   *
   * If user allows geolocation, returns object with latitude and longitude.
   * If user denies geolocation, or geolocation is not supported, returns object
   * with error message.
   *
   * @param {function} callback - Callback for errors. If callback is given,
   *                              it will be called with error message as argument.
   *                              If callback is not given, error message will be
   *                              returned in object.
   * @param {object} context - Context for callback.
   * @returns {Promise<Object>}
   */
  static getLocation(callback, context) {
    return new Promise((resolve) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => resolve(Geolocation.succesHandler(position)),

          (error) => {
            if (callback) {
              resolve(Geolocation.errorHandler(error, callback.bind(context)));
            } else {
              console.log('error', error);
              const errorMessage = Geolocation.getErrorMessage(error);
              resolve({ error: errorMessage });
            }
          },

          {
            enableHighAccuracy: false,
            timeout: 5000,
            maximumAge: 0,
          }
        );

      } else {
        const info = 'Ваш браузер не поддерживает геолокацию, смените браузер и повторите попытку.';
        
        if (callback) {
          resolve(callback.call(context, info));
        } else {
          resolve({ error: info });
        }
      }
    });
  }

  /**
   * Success handler for geolocation.
   *
   * Returns object with rounded latitude and longitude with 5 decimal places.
   *
   * @param {Object} position - Geolocation position.
   * @returns {Object} Object with rounded latitude and longitude with 5 decimal
   *                   places.
   */
  static succesHandler(position) {
    const { latitude, longitude } = position.coords;

    const coords = {
      latitude: +latitude.toFixed(5),
      longitude: +longitude.toFixed(5),
    };
    
    return coords;
  }

  /**
   * Handles geolocation errors by retrieving an error message and invoking the provided callback.
   *
   * @param {Object} error - The error object received from the geolocation API.
   * @param {function} callback - Callback function to be invoked with the error message.
   * @returns {*} The result of invoking the callback with the error message.
   */
  static errorHandler(error, callback) {
    const message = Geolocation.getErrorMessage(error);
    return callback(message);
  }

  /**
   * Returns an error message corresponding to the given error code.
   *
   * @param {Object} error - The error object received from the geolocation API.
   * @returns {string} An error message explaining the cause of the error.
   */
  static getErrorMessage(error) {
    switch (error.code) {
      case error.PERMISSION_DENIED:
      case 1:
        return 'Настройки текущего браузера запрещают определение вашего местоположения, измените настройки конфидициальности в текущем браузере и повторите попытку.';
      case error.POSITION_UNAVAILABLE:
        return 'Информация о вашем текущем местоположении недоступна, повторите попытку позже';
      case error.TIMEOUT:
        return 'Истекло время ожидания, поскольку информация о геолокации не была получена в отведенное время, повторите попытку';
      default:
        return 'Произошла неизвестная ошибка';
    }
  }
}

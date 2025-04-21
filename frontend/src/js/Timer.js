export default class Timer {
  /**
   * Initializes the Timer class.
   *
   * @param {HTMLElement} element - The element that will be used to display the timer.
   *
   * Checks if the element is an instance of HTMLElement and throws an error
   * if it is not. Assigns the element to `this.timer`.
   * Initializes `this.min` and `this.sec` to 0 and `this.stopTime` to true.
   * Binds the `this.timeCycle` method to the `this` context.
   */
  constructor(element) {
    if (!(element instanceof HTMLElement)) {
      throw new Error('element is not HTMLElement');
    }

    this.timer = element;
    this.min = 0;
    this.sec = 0;
    this.stopTime = true;
    
    this.timeCycle = this.timeCycle.bind(this);
  }

  /**
   * Starts the timer if it is currently stopped.
   *
   * Sets the stopTime flag to false and initiates the timeCycle
   * method to begin the timer countdown.
   */
  startTimer() {
    if (this.stopTime) {
      this.stopTime = !this.stopTime;
      this.timeCycle();
    }
  }

  /**
   * Stops the timer if it is currently running.
   *
   * Sets the stopTime flag to true to prevent the timeCycle
   * method from continuing the timer countdown.
   */
  stopTimer() {
    if (!this.stopTime) {
      this.stopTime = !this.stopTime;
    }
  }

  /**
   * Handles the timer countdown if the stopTime flag is false.
   *
   * Increments the seconds counter by 1. If the seconds counter
   * equals 60, increments the minutes counter by 1 and resets the
   * seconds counter to 0. Formats the minutes and seconds counters
   * so that they display a leading 0 if they are less than 10.
   * Displays the minutes and seconds counters in the timer element.
   * Calls itself every 1000 milliseconds via setTimeout until the
   * stopTime flag is set to true.
   */
  timeCycle() {
    if (!this.stopTime) {
      this.sec = +this.sec + 1;

      if (this.sec === 60) {
        this.min = +this.min + 1;
        this.sec = 0;
      }

      if (this.sec < 10 || this.sec === 0) {
        this.sec = `0${+this.sec}`;
      }

      if (this.min < 10 || this.min === 0) {
        this.min = `0${+this.min}`;
      }

      this.timer.textContent = `${this.min}:${this.sec}`;
      setTimeout(this.timeCycle, 1000);
    }
  }

  /**
   * Resets the timer display to '00:00' and stops the timer.
   *
   * Sets the stopTime flag to true, and resets both the minutes 
   * and seconds counters to 0. Updates the timer element's 
   * innerHTML to show '00:00'.
   */
  resetTimer() {
    this.timer.innerHTML = '00:00';
    this.stopTime = true;
    this.min = 0;
    this.sec = 0;
  }
}

/* eslint-disable no-console */
import MainPage from "./MainPage";
import Templates from "./Templates";

require('dotenv').config();

export default class LoginPage {
  /**
   * Initializes the LoginPage class.
   *
   * @param {HTMLElement} element - The container element where the login page operates.
   *
   * Sets up DOM references for login form, register form, and login/register buttons.
   * Binds event handlers for login form, register form, and button clicks.
   * Initializes the MainPage instance that will be used after a successful login.
   */
  constructor(element) {
    if (!(element instanceof HTMLElement)) {
      throw new Error('element is not HTMLElement');
    }

    this.container = element;
    // this.baseURL = process.env.BASE_URL;
    this.baseURL = process.env.BASE_URL || 'https://ahj-diploma-6967.onrender.com';
    this.mainPage = new MainPage(this.container, this.baseURL);

    this.onLoginFormSubmit = this.onLoginFormSubmit.bind(this);
    this.onRegisterBtnClick = this.onRegisterBtnClick.bind(this);
    this.onRegisterFormSubmit = this.onRegisterFormSubmit.bind(this);
    this.onPopupBtnCloseClick = this.onPopupBtnCloseClick.bind(this);
    this.onLogoutBtnClick = this.onLogoutBtnClick.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  /**
   * Initializes the login page.
   *
   * Clears the container and populates it with login, register, popup, and loading page markup.
   * Finds and assigns the necessary DOM elements for the login and register pages.
   * Binds event handlers for login form, register form, and button clicks.
   * Assigns the loading page DOM element.
   */
  init() {
    this.container.innerHTML = '';
    this.container.insertAdjacentHTML('beforeend', Templates.markupLogin);
    this.container.insertAdjacentHTML('beforeend', Templates.markupRegister);
    this.container.insertAdjacentHTML('beforeend', Templates.markupPopup);
    this.container.insertAdjacentHTML('beforeend', Templates.markupLoading);
    this.loadingPage = this.container.querySelector('.app__loading-page');
    
    this.popup = this.container.querySelector('.app__popup');
    this.popupContent = this.popup.querySelector('.app-popup__text');
    this.popupBtnClose = this.container.querySelector('.app-popup__button');
    this.popupBtnClose.addEventListener('click', this.onPopupBtnCloseClick);

    this.loginElement = this.container.querySelector('.app__login-page');
    this.registerElement = this.container.querySelector('.app__register-page');
    
    this.loginForm = document.forms.login_form;
    this.loginForm.addEventListener('submit', this.onLoginFormSubmit);

    this.registerForm = document.forms.register_form;
    this.registerForm.addEventListener('submit', this.onRegisterFormSubmit);

    this.avatar = document.querySelector('.register-page__avatar');
    this.avatarElement = document.querySelector('.register-page__file-element');
    this.avatarElement.addEventListener('change', this.onChange)

    this.registerBtn = this.container.querySelector('.register-page__link');
    this.registerBtn.addEventListener('click', this.onRegisterBtnClick);
  }

  /**
   * Handles the change event of the avatar file input element.
   *
   * Gets the selected avatar file, generates a blob URL for it,
   * and sets the avatar element's background image to the blob URL.
   * Resets the avatar element's inner HTML.
   */
  onChange() {
    const file = Array.from(this.avatarElement.files)[0];
    this.blobURL = URL.createObjectURL(file);
    this.avatar.style.backgroundImage = `url('${this.blobURL}')`;
    this.avatar.innerHTML = '';
  }

  /**
   * Displays a popup with the specified text.
   *
   * Removes the 'd_none' class from the popup element to make it visible
   * and updates the popup's content with the provided text.
   *
   * @param {string} text - The text to display in the popup.
   */
  showPopup(text) {
    this.popup.classList.remove('d_none');
    this.popupContent.textContent = text;
  }

  /**
   * Hides the popup.
   *
   * Adds the 'd_none' class to the popup element to hide it
   * and resets the popup's content to an empty string.
   */
  onPopupBtnCloseClick() {
    this.popup.className = 'app__popup d_none';
    this.popupContent.textContent = '';
  }

  /**
   * Handles the submission of the login form.
   *
   * Prevents the default form submission behavior, displays the loading page,
   * sends a request to the server to log in, and parses the response.
   * If the login is successful, hides the login page, initializes the main page,
   * and adds an event listener to the logout button. If the login is unsuccessful,
   * hides the loading page and shows a popup with an error message.
   *
   * @param {Event} evt - The event object from the form submission.
   */
  async onLoginFormSubmit(evt) {
    evt.preventDefault();
    this.loadingPage.classList.remove('d_none');

    console.log(this.baseURL);

    const response = await fetch(`${this.baseURL}/login`, {
      method: 'POST',
      body: new FormData(this.loginForm),
    });

    const result = await response.json();
    this.loginForm.reset();

    if (result.success) {
      this.loadingPage.classList.add('d_none');
      this.hideLoginPage();
      this.mainPage.init(result.data);
      this.mainPage.btnLogout.addEventListener('click', this.onLogoutBtnClick);
    } else {
      this.loadingPage.classList.add('d_none');
      this.showPopup('Неверный логин или пароль')
    }
  }

  /**
   * Handles the click event on the logout button.
   *
   * Closes the WebSocket connection, resets the login page,
   * and resets the fetching flag and the current chunk index.
   */
  onLogoutBtnClick() {
    this.mainPage.ws.close();
    this.init();
    this.mainPage.fetching = false;
    this.mainPage.currentChunk = 0;
  }

  /**
   * Handles the submission of the registration form.
   *
   * Prevents the default form submission behavior, displays the loading page,
   * sends a request to the server to register a new user and parses the response.
   * If the registration is successful, hides the loading page, the registration page,
   * initializes the main page, and adds an event listener to the logout button.
   *
   * @param {Event} evt - The event object from the form submission.
   */
  async onRegisterFormSubmit(evt) {
    evt.preventDefault();
    this.loadingPage.classList.remove('d_none');
    URL.revokeObjectURL(this.blobURL);

    const formData = new FormData(this.registerForm);
    
    if (this.avatarElement.value) {
      const file = Array.from(this.avatarElement.files)[0];
      formData.append('avatar', file);
    }
    
    const response = await fetch(`${this.baseURL}/register`, {
      method: 'POST',
      body: formData,
    });
    
    const result = await response.json();
    this.registerForm.reset();
    
    if (result.success) {
      this.loadingPage.classList.add('d_none');
      this.hideRegisterPage();
      this.mainPage.init(result.data);
      this.mainPage.btnLogout.addEventListener('click', this.onLogoutBtnClick);
    }
  }

  /**
   * Handles the click event on the registration button.
   *
   * Hides the login page and displays the registration page.
   */
  onRegisterBtnClick() {
    this.loginElement.classList.add('d_none');
    this.registerElement.classList.remove('d_none');
  }

  /**
   * Hides the registration page.
   *
   * Adds the 'd_none' class to the registration page element to hide it from view.
   */
  hideRegisterPage() {
    this.registerElement.classList.add('d_none');
  }

  /**
   * Hides the login page.
   *
   * Adds the 'd_none' class to the login page element to hide it from view.
   */
  hideLoginPage() {
    this.loginElement.classList.add('d_none');
  }

  /**
   * Displays the login page.
   *
   * Removes the 'd_none' class from the login page element to show it from view.
   */
  showLoginPage() {
    this.loginElement.classList.remove('d_none');
  }
}

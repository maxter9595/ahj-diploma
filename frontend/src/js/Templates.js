/* eslint-disable no-param-reassign */
/* intno-cond-assign */
/* eslint-disable-next-line no-cond-assign */
/* eslint-disable-next-line no-shadow */
import hljs from 'highlight.js';
import Utils from "./utils/utils";

export default class Templates {
  /**
   * Generate markup for exchange rate block
   * @param {object} data - response from API
   * @param {object} data.Valute - object with exchange rates
   * @returns {string} HTML markup for exchange rate block
   */
  static exchangeMarkup(data) {
    const { Valute } = data;

    return `<div class="exchange">
    <div class="exchange__title">Курс валют в России</div>
    <ul class="exchange__list">
      <li class="exchange-list__item">
        <div class="exchange-item__text">${Valute.USD.CharCode} (${Valute.USD.Name})</div>
        <div class="exchange-item__num">${Valute.USD.Value}</div>
      </li>

      <li class="exchange-list__item">
        <div class="exchange-item__text">${Valute.EUR.CharCode} (${Valute.EUR.Name})</div>
        <div class="exchange-item__num">${Valute.EUR.Value}</div>
      </li>

      <li class="exchange-list__item">
        <div class="exchange-item__text">${Valute.GBP.CharCode} (${Valute.GBP.Name})</div>
        <div class="exchange-item__num">${Valute.GBP.Value}</div>
      </li>

      <li class="exchange-list__item">
        <div class="exchange-item__text">${Valute.CHF.CharCode} (${Valute.CHF.Name})</div>
        <div class="exchange-item__num">${Valute.CHF.Value}</div>
      </li>

      <li class="exchange-list__item">
        <div class="exchange-item__text">${Valute.PLN.CharCode} (${Valute.PLN.Name})</div>
        <div class="exchange-item__num">${Valute.PLN.Value}</div>
      </li>

      <li class="exchange-list__item">
        <div class="exchange-item__text">${Valute.JPY.CharCode} (${Valute.JPY.Name})</div>
        <div class="exchange-item__num">${Valute.JPY.Value}</div>
      </li>

      <li class="exchange-list__item">
        <div class="exchange-item__text">${Valute.UAH.CharCode} (${Valute.UAH.Name})</div>
        <div class="exchange-item__num">${Valute.UAH.Value}</div>
      </li>

      <li class="exchange-list__item">
        <div class="exchange-item__text">${Valute.MDL.CharCode} (${Valute.MDL.Name})</div>
        <div class="exchange-item__num">${Valute.MDL.Value}</div>
      </li>

      <li class="exchange-list__item">
        <div class="exchange-item__text">${Valute.BYN.CharCode} (${Valute.BYN.Name})</div>
        <div class="exchange-item__num">${Valute.BYN.Value}</div>
      </li>

      <li class="exchange-list__item">
        <div class="exchange-item__text">${Valute.KZT.CharCode} (${Valute.KZT.Name})</div>
        <div class="exchange-item__num">${Valute.KZT.Value}</div>
      </li>
    </ul>

    <a class="api__link" href="https://www.cbr-xml-daily.ru/" target="_blank">Курсы валют, API</a>
  </div>`
  }

  /**
   * Return HTML markup for weather data.
   * @param {Object} data - Object from API, containing weather data
   * @returns {string} HTML markup for weather data
   */
  static weatherMarkup(data) {
    return `<div class="weather">
      <ul class="weather__header">
        <li class="weather__city">${data.name}</li>

        <li class="weather__preview">
          <div class="weather__icon" data-weather="icon">
            <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="${data.weather[0].description}">
          </div>
          <div class="weather__temp" data-weather="temp">${Math.round(+data.main.temp - 273)}&deg;</div>
        </li>
        
        <li class="weather__description" data-weather="description">${data.weather[0].description}</li>
      </ul>

      <ul class="weather__more">
        <li class="weather-more__item">
          <div class="weather-more__text">Ощущается:</div>
          <div class="weather-more__num" data-weather="wind">${Math.round(+data.main.feels_like - 273)}&deg;</div>
        </li>

        <li class="weather-more__item">
          <div class="weather-more__text">Облачность:</div>
          <div class="weather-more__num" data-weather="wind">${data.clouds.all} &#37;</div>
        </li>

        <li class="weather-more__item">
          <div class="weather-more__text">Влажность:</div>
          <div class="weather-more__num" data-weather="humidity">${data.main.humidity} &#37;</div>
        </li>

        <li class="weather-more__item">
          <div class="weather-more__text">Давление:</div>
          <div class="weather-more__num" data-weather="pressure">${data.main.pressure} мм рт. ст.</div>
        </li>

        <li class="weather-more__item">
          <div class="weather-more__text">Скорость ветра:</div>
          <div class="weather-more__num" data-weather="wind">${data.wind.speed} м/с</div>
        </li>
      </ul>
    </div>`
  }

  /**
   * Generate markup for chat messages block
   * @param {string} [chatName=''] - name of the chat
   * @param {string} [numberUsers=''] - number of users in the chat
   * @param {string} [numberOnlineUsers=''] - number of online users in the chat
   * @returns {string} HTML markup for chat messages block
   */
  static appMessagesMarkup(chatName = '', numberUsers = '', numberOnlineUsers = '') {
    return `<div class="app__messages">
      <div class="messages__header column_header">
        <div class="messages-header__info">
          <div class="messages-header__title">${chatName}</div>

          <label>
            <span class="messages-header__text">Всего участников:</span>
            <span class="messages-header__number">${numberUsers}</span>
          </label>
          
          <label>
            <span class="messages-header__text">Участников онлайн:</span>
            <span class="messages-header__number online">${numberOnlineUsers}</span>
          </label>
        </div>
        
        <div class="messages-header__buttons">
          <div class="btn-wrap">
            <button class="button find"></button>
          </div>
          <div class="btn-wrap">
            <button class="button menu"></button>
          </div>
        </div>
      </div>

      <ul class="messages__content"></ul>

      <div class="messages__footer">
        <div class="footer__controls">
          <div class="footer-controls__emojy-clip">
            <div class="btn-wrap">
              <button class="button inform"></button>
            </div>

            <div class="btn-wrap lock">
              <button class="button mail_lock"></button>
            </div>

            <div class="btn-wrap file-input__wrap">
              <input type="file" class="file__input visually_hidden">
              <button class="button clip"></button>
            </div>

            <div class="btn-wrap">
              <button class="button smile"></button>
            </div>
          </div>

          <div class="footer-controls__input" contenteditable="true" data-placeholder="Введите сообщение"></div>

          <div class="footer-controls__send-btn d_none">
            <div class="btn-wrap">
              <button class="button send"></button>
            </div>
          </div>

          <div class="footer-controls__media">
            <div class="btn-wrap">
              <button class="button micro"></button>
            </div>

            <div class="btn-wrap">
              <button class="button video"></button>
            </div>

            <div class="btn-wrap">
              <button class="button geo"></button>
            </div>
          </div>

          <div class="footer-controls__media record d_none">
            <div class="btn-wrap">
              <button class="button confirm"></button>
            </div>

            <span class="record-timer">00:00</span>

            <div class="btn-wrap">
              <button class="button close"></button>
            </div>
          </div>
        </div>
      </div>

      <video src="" class="messages__preview-record d_none" muted></video>

      <ul class="messages__emoji d_none"></ul>

      <div class="messages__encrypt-form d_none">
        <div class="messages-encrypt-form__body">
          <form action="" class="messages-encrypt-form__form">
            <div class="messages-encrypt-form__text">Придумайте пароль для расшифровки сообщения</div>
            <input type="text" class="messages-encrypt-form__input" placeholder="Введите пароль..." required>
            <button class="messages-encrypt-form__button">Сохранить</button>
          </form>

          <form action="" class="messages-decrypt-form__form d_none">
            <div class="messages-decrypt-form__text">Введите пароль для расшифровки сообщения</div>
            <input type="text" class="messages-decrypt-form__input" placeholder="Введите пароль..." required>
            <button class="messages-decrypt-form__button">Сохранить</button>
          </form>

          <button class="messages-encrypt-form__btn-close"></button>
        </div>
      </div>

      <div class="messages__info d_none">
        <div class="messages-info__body">
          <div class="messages-info__title">Список доступных команд:</div>

          <ul class="messages-info__list">
            <li class="messages-info__item"><span class="info__command">@chaos: погода</span><span class="info__text">запрос погоды</span></li>
            <li class="messages-info__item"><span class="info__command">@chaos: курс</span><span class="info__text">запрос курса валют</span></li>
            <li class="messages-info__item"><span class="info__command">@chaos: фраза</span><span class="info__text">запрос рандомной хакерской фразы</span></li>
            <li class="messages-info__item"><span class="info__command">@chaos: <ДЕНЬ>/<МЕСЯЦ></span><span class="info__text">запрос исторических фактов об этой дате.<br>
              Например: <span class="info__command">@chaos: 30/01</span></span>
            </li>
          </ul>
          
          <button class="messages-info__button">ЗАКРЫТЬ</button>
        </div>
      </div>
    </div>`;
  }

  /**
   * Return a string of an emoji item markup.
   *
   * @param {String} emoji - An emoji string.
   * @return {String} A string of an emoji item markup.
   */
  static emojiMarkup(emoji) {
    return `<li class="messages-emoji__item">${emoji}</li>`;
  }

  /**
   * Generates a container with HTML markup for historical facts.
   *
   * Iterates over the provided data array and creates a div element
   * for each historical fact, inserting it into the container.
   *
   * @param {Array} data - An array of objects, each containing a 'year' and 'text' property
   *                       representing the historical fact.
   * @returns {HTMLElement} A div element containing the markup for historical facts.
   */
  static factsMarkup(data) {
    const container = document.createElement('div');
    container.className = 'historicalFact';

    data.forEach((elem) => {
      container.insertAdjacentHTML(
        'beforeend', 
        `<div>В ${elem.year} году ${elem.text}</div>`
      )
    });

    return container;
  }

  /**
   * Generates a string of an HTML markup for a message item.
   *
   * Checks if the provided content is a string and if it contains a newline
   * character or a <br> tag. If so, adds a 'multiline' class to the message
   * element.
   *
   * @param {Object} options - An object containing the following properties:
   *   @property {String} chaosClassName - The class name for the message element.
   *   @property {String} mesID - The ID for the message element.
   *   @property {String} bodyID - The ID for the message body element.
   *   @property {String} chaosUserName - The name of the user who sent the message.
   *   @property {String} time - The time when the message was sent.
   *   @property {String|undefined} content - The content of the message.
   *   @property {String|undefined} filePreview - The HTML markup for the file preview.
   *   @property {String|undefined} button - The HTML markup for the message button.
   *   @property {String|undefined} lockClassName - The class name for the lock element.
   * @returns {String} A string of an HTML markup for a message item.
   */
  static messageMarkup(options) {
    if (options.content === undefined) {
      options.content = 'Не удалось сформировать сообщение или получить информацию';
    }
    
    const isMultiline = typeof options.content === 'string' && 
      (options.content.includes('\n') ||
      options.content.includes('<br>'));
    
    const multilineClass = isMultiline ? 'multiline' : '';
    const shouldRenderContent = options.content && 
                              options.content !== '' && 
                              options.content !== 'Не удалось сформировать сообщение или получить информацию';
    
    return `
      <li class="message ${options.chaosClassName} ${multilineClass}" data-id="${options.mesID}">
        <div id="${options.bodyID}" class="message__body">
          <div class="message__header">
            <div class="message__name">${options.chaosUserName}</div>
            <div class="message__date">${options.time}</div>
          </div>
          ${options.filePreview || ''}
          ${shouldRenderContent ? `
            <div class="message__content ${options.lockClassName}">
              ${this.formatMessageContent(options.content)}
            </div>
          ` : ''}
          ${options.button || ''}
        </div>
      </li>
    `;
  }

  /**
   * Format the given message content for display in the messages list.
   * 
   * - If the content is not a string, return it as is.
   * - If the content contains HTML elements for the weather or exchange rate,
   *   return it as is.
   * - If the content contains a '@chaos:' command, replace all spaces with
   *   non-breaking spaces and trim the string.
   * - Replace all newlines in the content with <br> tags.
   * - Process the content for URLs and replace them with links.
   * 
   * @param {string} content - The message content to be formatted.
   * 
   * @returns {string} The formatted message content.
   */
  static formatMessageContent(content) {
    if (!content) return '';
  
    if (typeof content !== 'string') {
      return content;
    }
  
    if (content.includes('weather__header') || content.includes('exchange__title')) {
      return content;
    }
  
    if (content.includes('@chaos:')) {
      content = content
        .replace(/ /g, '&nbsp;')
        .trim();
    }
  
    const codeBlockRegex = /```([\s\S]*?)```/g;
    content = content.replace(codeBlockRegex, (match, code) => {
      const cleanedCode = code
        .replace(/<br\s*\/?>/gi, '\n')
        .replace(/^\n+|\n+$/g, '');

      if (typeof hljs !== 'undefined') {
        try {
          const highlighted = hljs.highlightAuto(cleanedCode).value;
          return `<pre><code>${highlighted}</code></pre>`;
        } catch (e) {
          console.error('Highlight.js error:', e);
        }
      }
      
      return `<pre><code>${cleanedCode}</code></pre>`;
    });
  
    return this.processLinks(
      content
        .replace(/[\r\n]+/g, '<br>')
        .replace(/<br\s*\/?>/gi, '<br>')
    );
  }

  /**
   * Replaces URLs in the given text with links, but only if they are not
   * already within HTML tags. This is useful for processing text that
   * already contains some HTML tags, such as links created by the user.
   *
   * @param {string} text - The text in which to replace URLs with links.
   * @returns {string} The text with URLs replaced with links.
   */
  static processLinks(text) {
    // Обрабатываем только ссылки вне HTML-тегов
    return text.replace(
      /(^|\s)(https?:\/\/[^\s]+)/gi, 
      (match, p1, p2) => `${p1}<a href="${p2}" target="_blank" rel="noopener noreferrer">${p2}</a>`
    );
  }

  /**
   * Replaces all URLs in the given text with links.
   *
   * @param {string} text - The text in which to replace URLs with links.
   * @returns {string} The text with all URLs replaced with links.
   */
  static getLink(text) {
    return text.replace(
      /(https?:\/\/[^\s]+)/gi, 
      '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>'
    );
  }

  /**
   * Creates a markup for a file preview based on the given file template and
   * file object. The file template is usually an HTML string that contains
   * a preview of the file, and the file object contains metadata about the
   * file, such as its name and extension.
   * 
   * @param {string} fileTemplate - The file template string.
   * @param {File} fileObj - The file object.
   * @param {string} baseURL - The base URL of the application.
   * @returns {string} The markup for the file preview.
   */
  static fileMarkup(fileTemplate, fileObj, baseURL) {
    const fileExt = fileObj.name.split('.').pop().toLowerCase();

    const iconMap = {
      doc: '📝', 
      docx: '📝', 
      odt: '📝', 
      rtf: '📝', 
      pdf: '📕',
      xls: '📊', 
      xlsx: '📊', 
      csv: '📊', 
      ods: '📊',
      ppt: '📽️', 
      pptx: '📽️', 
      odp: '📽️',
      txt: '📄', 
      md: '📄', 
      log: '📄',
      zip: '🗜️', 
      rar: '🗜️', 
      '7z': '🗜️', 
      tar: '🗜️', 
      gz: '🗜️',
      exe: '⚙️', 
      msi: '⚙️',
      dmg: '⚙️', 
      pkg: '⚙️', 
      deb: '⚙️', 
      js: '📜', 
      ts: '📜', 
      py: '📜', 
      java: '📜', 
      cpp: '📜', 
      h: '📜',
      cs: '📜', 
      php: '📜', 
      rb: '📜', 
      go: '📜', 
      swift: '📜',
      html: '🌐', 
      css: '🎨', 
      scss: '🎨', 
      less: '🎨', 
      json: '🔣',
      xml: '🔣', 
      yml: '🔣', 
      yaml: '🔣',
      sql: '🗃️',
      db: '🗃️', 
      sqlite: '🗃️', 
      mdb: '🗃️',
      jpg: '🖼️', 
      jpeg: '🖼️', 
      png: '🖼️', 
      gif: '🖼️', 
      bmp: '🖼️', 
      svg: '🖼️', 
      webp: '🖼️', 
      psd: '🎨',
      mp3: '🎵', 
      wav: '🎵', 
      ogg: '🎵', 
      flac: '🎵',
      mp4: '🎬', 
      mov: '🎬', 
      avi: '🎬', 
      mkv: '🎬', 
      webm: '🎬',
      vdi: '💻', 
      vmdk: '💻', 
      ova: '💻',
      iso: '💿', 
      dll: '🧩', 
      bat: '🛠️', 
      sh: '🛠️',
      default: '📎'
    };

    if (fileTemplate.includes('<object')) {
      return `
        <div class="message__preview-file file-preview">
          <div class="file-preview__body">
            <div class="btn-wrap">
              <a href="${baseURL}/files/${fileObj.name}" download="${fileObj.name}" rel="noopener" class="button download"></a>
            </div>
            <div class="message__file">
              <div class="document-icon">${iconMap[fileExt] || iconMap.default}</div>
              <div class="document-info" style="justify-self: center; align-self: center">
                <div class="document-name" style="justify-self: center; align-self: center">${fileObj.originalName || fileObj.name}</div>
                <div class="document-meta" style="justify-self: center; align-self: center">
                  <span class="document-type" style="color: white">${fileExt.toUpperCase()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
    }

    return `<div class="message__preview-file file-preview">
      <div class="file-preview__body">
        <div class="btn-wrap">
          <a href="${baseURL}/files/${fileObj.name}" download="${fileObj.name}" rel="noopener" class="button download"></a>
        </div>
        <div class="message__file">
          ${fileTemplate}
        </div>
      </div>
    </div>`
  }

  /**
   * Generates HTML markup for the file preview section.
   *
   * The generated markup includes a container for the file preview
   * with an image display area, an input field for adding a caption, 
   * and buttons to cancel or send the file preview.
   *
   * @returns {string} HTML string representing the file preview section.
   */
  static previewFileMarkup() {
    return `<div class="messages__preview-file preview d_none">
      <div class="preview__body">
        <div class="preview__image"></div>
        <input class="preview__input" type="text" placeholder="Подпись">
        <div class="preview__buttons">
          <button class="preview__btn cancel">Отмена</button>
          <button class="preview__btn send">Отправить</button>
        </div>
      </div>
    </div>`
  }

  /**
   * Returns the initial HTML markup for the start of the application.
   *
   * The markup includes the main title of the application and a container 
   * for the content.
   *
   * @returns {string} HTML markup for the application's starting point.
   */
  static get startMarkUp() {
    return `<h1 class="app__title">Chaos Organizer</h1>
    <div class="app__content"></div>`;
  }

  /**
   * Generates HTML markup for a chat group item.
   *
   * @param {string} id - The unique identifier for the chat group.
   * @param {string} chatName - The name of the chat group.
   * @param {string} state - The CSS class indicating the state of the chat (e.g., active).
   *
   * @returns {string} HTML string representing a chat group list item.
   */
  static chatsGroupsItemMarkup(id, chatName, state) {
    return `<li class="general__chat chat ${state}" data-id="${id}">
      <div class="chat__content">
        <div class="chat-content__header">
          <div class="chat-content__title">${chatName}</div>
          <div class="chat-content__time"></div>
        </div>

        <div class="chat-content__preview">
          <span class="preview__checkbox"></span>
          <span class="preview__text"></span>
        </div>
      </div>
    </li>`
  }

  /**
   * Generates HTML markup for the chat groups and chats container.
   *
   * The markup includes the user's name, search form, and two lists of chat groups
   * and chats. The search form is used to search for a chat in the list of chats.
   *
   * @param {string} userName - The name of the user.
   *
   * @returns {string} HTML string representing the chat groups and chats container.
   */
  static chatsHeaderMarkup(userName) {
    return `<div class="app__chats">
      <div class="chats__header column_header">
        <div class="chat-header__user">
          <div class="chats-header__avatar"></div>
          <div class="chat-header__name">${userName}</div>
        </div>

        <div class="btn-wrap">
          <button class="button logout"></button>
        </div>
      </div>

      <form class="chats__search search" action="">
        <label class="search__items">
          <button class="search__button_on"></button>
          <button class="search__button_of d_none"></button>
          <input type="text" class="search__input" placeholder="Поиск по чатам">
        </label>
      </form>

      <ul class="chats__group-list"></ul>
      <ul class="chats__list"></ul>
    </div>`
  }

  /**
   * Generates HTML markup for a chat list item.
   *
   * @param {string} id - The unique identifier for the chat.
   * @param {string} name - The name of the chat or user associated with the chat.
   *
   * @returns {string} HTML string representing a chat list item.
   */
  static chatsUsersListItemMarkup(id, name) {
    return `<li class="chats__chat chat" data-id="${id}">
      <div class="chat__avatar"></div>

      <div class="chat__content">
        <div class="chat-content__header">
          <div class="chat-content__title">${name}</div>
          <div class="chat-content__time"></div>
        </div>
        
        <div class="chat-content__preview">
          <span class="preview__checkbox"></span>
          <span class="preview__text"></span>
        </div>
      </div>
    </li>`
  }

  /**
   * Gets the HTML markup for the popup overlay.
   *
   * @returns {string} The HTML string representing the popup overlay.
   */
  static get markupPopup() {
    return `<div class="app__popup d_none">
      <div class="app-popup__body">
        <div class="app-popup__content">
          <div class="app-popup__text">
          </div>
          <button class="app-popup__button">ЗАКРЫТЬ</button>
        </div>
      </div>
    </div>`
  }

  /**
   * Gets the HTML markup for the loading page overlay.
   *
   * @returns {string} The HTML string representing the loading page overlay.
   */
  static get markupLoading() {
    return `<div class="app__loading-page d_none">
      <div class="app-loading_page__content"></div>
    </div>`
  }

  /**
   * Gets the HTML markup for the register page overlay.
   *
   * @returns {string} The HTML string representing the register page overlay.
   */
  static get markupRegister() {
    return `<div class="app__register-page d_none">
    <div class="register-page__body">
      <div class="register-page__avatar-element">
        <label for="avatar" class="register-page__avatar">
          Загрузить аватар
        </label>
        <input id="avatar" type="file" class="register-page__file-element visually_hidden">
      </div>

      <form name="register_form" class="register-page__content">
        <label class="register-page__item">
          <div class="register-page__text">Логин</div>
          <input name="login" class="login-page__input" type="text" required>
        </label>

        <label class="register-page__item">
          <div class="register-page__text">Пароль</div>
          <input name="password" class="login-page__input" type="password" required>
        </label>

        <button class="register-page__button">Зарегистрироваться</button>
      </form>
    </div>
  </div>`
  }

  /**
   * Gets the HTML markup for the login page overlay.
   *
   * @returns {string} The HTML string representing the login page overlay.
   */
  static get markupLogin() {
    return `<div class="app__login-page">
      <div class="login-page__body">
        <form name="login_form" class="login-page__content">
          <label class="login-page__item">
            <div class="login-page__text">Логин</div>
            <input name="login" class="login-page__input" type="text" required>
          </label>

          <label class="login-page__item">
            <div class="login-page__text">Пароль</div>
            <input name="password" class="login-page__input" type="password" required>
          </label>

          <button class="login-page__button">Войти</button>
        </form>

        <div class="register-page__register">
          <button class="register-page__link">зарегистрироваться</button>
        </div>
      </div>
    </div>`;
  }

  /**
   * Gets the HTML markup for the sidebar of the messages page.
   * 
   * @returns {string} The HTML string representing the sidebar of the messages page.
   */
  static get sidebarMarkup() {
    return `<div class="app__sidebar search-mes d_none">
    <div class="sidebar__header column_header">
      <div class="btn-wrap">
        <button class="button close-sb"></button>
      </div>

      <div class="sidebar-header__title">Поиск сообщений</div>
    </div>

    <form class="sidebar__search search" action="">
      <label class="search__items">
        <button class="search__button_on" data-id="sidebar_btn-on"></button>
        <button class="search__button_of d_none" data-id="sidebar_btn-of"></button>
        <input data-id="sidebar_search" type="text" class="search__input" placeholder="Поиск...">
      </label>
    </form>
    
    <ul class="sidebar__found-list"></ul>
  </div>
  
  <div class="app__sidebar info d_none">
    <div class="sidebar__header column_header">
      <div class="btn-wrap">
        <button class="button close-sb"></button>
      </div>
      <div class="sidebar-header__title">Информация о чате</div>
    </div>

    <ul class="sidebar__attachments-list">
      <li class="attachment" data-name="photo">
        <div class="attachment__item">
          <div class="attachment__icon photo"></div>
          <div class="attachment__text">Фото и GIF:</div>
        </div>
        <div class="attachment__number" data-number="photo"></div>
      </li>

      <li class="attachment" data-name="video">
        <div class="attachment__item">
          <div class="attachment__icon video"></div>
          <div class="attachment__text">Видео :</div>
        </div>
        <div class="attachment__number" data-number="video"></div>
      </li>

      <li class="attachment" data-name="audio">
        <div class="attachment__item">
          <span class="attachment__icon audio"></span>
          <span class="attachment__text">Аудиофайлов :</span>
        </div>
        <div class="attachment__number" data-number="audio"></div>
      </li>

      <li class="attachment" data-name="link">
        <div class="attachment__item">
          <span class="attachment__icon link"></span>
          <span class="attachment__text">Ссылок :</span>
        </div>
        <div class="attachment__number" data-number="link"></div>
      </li>

      <li class="attachment" data-name="voice">
        <div class="attachment__item">
          <span class="attachment__icon voice"></span>
          <span class="attachment__text">Голосовых сообщений :</span>
        </div>
        <div class="attachment__number" data-number="voice"></div>
      </li>
    </ul>

    <div class="sidebar__preview d_none" data-name="preview-menu">
      <div class="sidebar-preview__header">
        <div class="btn-wrap">
          <button class="button back"></button>
        </div>
        <div class="sidebar-preview__title"></div>
      </div>
      
      <ul class="sidebar-preview__photo visually_hidden" data-id="photo"></ul>
      <ul class="sidebar-preview__video visually_hidden" data-id="video"></ul>
      <ul class="sidebar-preview__voice visually_hidden" data-id="voice"></ul>
      <ul class="sidebar-preview__audio visually_hidden" data-id="audio"></ul>
      <ul class="sidebar-preview__link visually_hidden" data-id="link"></ul>
    </div>
  </div>`
  }

  /**
   * Generates HTML markup for a photo preview item.
   *
   * @param {string} image - The filename of the image to be displayed.
   * @param {string} baseURL - The base URL where the image is hosted.
   *
   * @returns {string} The HTML markup for a list item containing the image preview
   *                   with a link to the full image.
   */
  static previewPhotoMarkup(image, baseURL) {
    return `<li class="photo__item"><a href="${baseURL}/files/${image}" target="_blank">
      <img src="${baseURL}/${image}">
    </a></li>`
  }

  /**
   * Generates HTML markup for a video preview item.
   *
   * @param {string} fileName - The filename of the video to be displayed.
   * @param {string} baseURL - The base URL where the video is hosted.
   *
   * @returns {string} The HTML markup for a list item containing the video preview
   *                   with a link to the full video.
   */
  static previewVideoMarkup(fileName, baseURL) {
    return `<li class="video__item"><a href="${baseURL}/files/${fileName}" target="_blank">
      <video src="${baseURL}/${fileName}" controls></video>
    </a></li>`
  }

  /**
   * Generates HTML markup for an audio preview item.
   *
   * @param {string} fileName - The filename of the audio file to be displayed.
   * @param {string} baseURL - The base URL where the audio file is hosted.
   *
   * @returns {string} The HTML markup for a list item containing the audio player
   *                   with a download button for the audio file.
   */
  static previewAudioMarkup(fileName, baseURL) {
    return `<li class="voice__item"><audio src="${baseURL}/${fileName}" controls></audio>
      <div class="btn-wrap">
        <a class="button download" href="${baseURL}/files/${fileName}" download="${fileName}" rel="noopener"></a>
      </div>
    </li> `
  }

  /**
   * Generates HTML markup for a link preview item.
   *
   * @param {Object} elem - An object containing the message and timestamp of the link.
   *
   * @returns {string} The HTML markup for a list item containing the link preview
   *                   with a timestamp and a link to the original message.
   */
  static previewLinkMarkup(elem) {
    return `<li class="link__item">
      <div class="link-item__img"></div>
      <div class="link-item__content">
        <div class="link-item__data">${elem.time}</div>
        <div class="link-item__link">${Utils.getLink(elem.message)}</div>
      </div>
    </li>`
  }
}

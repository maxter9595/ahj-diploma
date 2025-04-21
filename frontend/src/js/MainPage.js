/* eslint-disable no-param-reassign */
/* eslint-disable import/no-cycle */
/* eslint-disable no-console */
import Sidebar from "./Sidebar";
import Templates from './Templates';
import Encryption from "./Encryption";
import BotRequests from "./BotRequests";
import EmojiHandler from "./EmojiHandler";
import MediaHandler from "./MediaHandler";
import FileInputHandler from "./FileInputHandler";
import Utils from "./utils/utils";

require('dotenv').config();

export default class MainPage {
  /**
   * Constructor for MainPage class.
   *
   * @param {HTMLElement} element - The element that contains all the elements
   *                                that will be used by this class.
   * @param {string} baseURL - The base URL for requests to the server.
   *
   * Sets up the class properties and assigns the element to `this.container`.
   * Checks if the element is an instance of HTMLElement and throws an error
   * if it is not.
   * Sets up the WebSockets URL and some internal properties.
   */
  constructor(element, baseURL) {
    if (!(element instanceof HTMLElement)) {
      throw new Error('element is not HTMLElement');
    }

    this.container = element;
    this.baseURL = baseURL;
    // this.wsURL = process.env.WS_URL;
    this.wsURL = process.env.WS_URL || 'wss://ahj-diploma-6967.onrender.com';
    this.currentChunk = 0;
    this.fetching = false;
    this.decryption = false;

    this.showPopup = this.showPopup.bind(this);
  }

  /**
   * Initializes the main page.
   *
   * @param {Object} data - The response data from the server after logging in.
   *                        Contains user information and list of dialogues and users.
   *
   * Sets up the app content, header, messages, footer, and popup elements.
   * Sets up the sidebar, emoji handler, encryption, and bot requests.
   * Assigns event handlers and connects to the WebSocket server.
   */
  async init(data) {
    this.userID = data.user.id;
    this.container.insertAdjacentHTML('afterbegin', Templates.startMarkUp);
    
    this.appContent = this.container.querySelector('.app__content');
    this.appContent.insertAdjacentHTML('beforeend', Templates.chatsHeaderMarkup(data.user.login));
    this.appContent.insertAdjacentHTML('beforeend', Templates.appMessagesMarkup());
    
    this.appMessages = this.container.querySelector('.app__messages');
    this.appMessages.insertAdjacentHTML('beforeend', Templates.previewFileMarkup());
    
    this.sendBtnBox = this.container.querySelector('.footer-controls__send-btn');
    this.mediaBtnsBox = this.container.querySelector('.footer-controls__media');

    this.mainInput = this.container.querySelector('.footer-controls__input');
    this.activateInputObserver();

    this.messagesHeaderTitle = this.container.querySelector('.messages-header__title');
    this.numberOfUsers = this.container.querySelector('.messages-header__number');
    this.numberOfOnlineUsers = this.container.querySelector('.messages-header__number.online');
    this.messagesContent = this.container.querySelector('.messages__content');
    
    this.userAvatar = this.container.querySelector('.chats-header__avatar');
    this.drawAvatar(data);

    this.groupList = this.container.querySelector('.chats__group-list');
    this.redrawDialogues(data);

    this.chatsList = this.container.querySelector('.chats__list');
    this.redrawUsers(data.users);

    this.btnLogout = this.container.querySelector('.button.logout');
    this.messagesFooter = this.container.querySelector('.messages__footer');

    this.popup = this.container.querySelector('.app__popup');
    this.popupContent = this.popup.querySelector('.app-popup__text');

    this.emojiList = this.container.querySelector('.messages__emoji');
    this.emoji = new EmojiHandler(this.container, this.baseURL)

    this.encryptionBtn = this.container.querySelector('.button.mail_lock').closest('.btn-wrap');
    this.crypto = new Encryption(this.container, this.baseURL);
    
    this.infoBtn = this.container.querySelector('.button.inform').closest('.btn-wrap');
    this.infoTooltip = this.container.querySelector('.messages__info');
    this.infoTooltipBtn = this.container.querySelector('.messages-info__button');

    this.botRequists = new BotRequests(this.mainInput, this.crypto, this.baseURL);
    
    this.asignEventHandlers();
    this.onSocketConnect();
  }

  /**
   * Assigns event handlers for the main page elements.
   *
   * Assigns event handlers to the send button box, main input,
   * messages content, info button, and info tooltip button.
   */
  asignEventHandlers() {
    this.sendBtnBox.addEventListener('click', (evt) => this.onSendBtnClick(evt));
    this.mainInput.addEventListener('keydown', (evt) => this.onMaininputKeydown(evt));
    this.messagesContent.addEventListener('scroll', (evt) => this.onScroll(evt));
    this.infoBtn.addEventListener('click', () => this.infoTooltip.classList.remove('d_none'))
    this.infoTooltipBtn.addEventListener('click', () => this.infoTooltip.classList.add('d_none'))
  }

  /**
   * Handles the scroll event on the messages content.
   * 
   * Checks if the first message element is at the top of the messages content.
   * If it is and there are more messages than are currently displayed,
   * set the fetching flag to true and increment the current chunk index.
   * If the fetching flag is set, sends a message to the server to fetch more messages.
   * 
   * @param {Event} evt - The scroll event object.
   * 
   * @async
   */
  async onScroll(evt) {
    [this.firstChild] = evt.target.children;
    this.firstChildCoords = evt.target.children[0].getBoundingClientRect();

    const targetCoords = this.messagesContent.getBoundingClientRect().top;
    const { paddingTop } = window.getComputedStyle(this.messagesContent);
    
    if (this.firstChildCoords.top - parseInt(paddingTop, 10) === targetCoords
      && document.querySelectorAll('.message').length < this.totalMessages) {
      this.fetching = true;
      this.currentChunk += 1;

      if (this.fetching) {
        const data = {
          type: 'more_messages',
          data: {
            currentChunk: this.currentChunk,
            dialog: this.checkDialog(),
            dialogID: this.activeChatID,
          }
        }
        
        this.ws.send(JSON.stringify(data));
      }
    }
  }

  /**
   * Scrolls the messages content to the last message.
   *
   * If the first child element exists, scrolls it into view.
   */
  scrollToLastMessage() {
    if (this.firstChild) {
      this.firstChild.scrollIntoView(true);
    }
  }

  /**
   * Scrolls the messages content to the bottom.
   *
   * Sets the scrollTop property of the messages content to its scrollHeight property.
   */
  scrollToBottom() {
    this.messagesContent.scrollTop = this.messagesContent.scrollHeight;
  }

  /**
   * Displays the popup with the specified text.
   *
   * Removes the 'd_none' class from the popup element to make it visible
   * and sets the popup's content to the provided text.
   *
   * @param {string} text - The text to display in the popup.
   */
  showPopup(text) {
    this.popup.classList.remove('d_none');
    this.popupContent.textContent = text;
  }

  /**
   * Processes the input text message data for sending.
   *
   * Utilizes the bot requests to process the input text or command and determine the content and encryption status.
   * If the input is a command starting with '@chaos', handles specific bot responses which may include data objects.
   * For regular text inputs, strips HTML tags unless encryption is enabled. If encrypted, it tests the encryption cycle.
   * 
   * @param {string|null} htmlContent - Optional HTML content to be used as the message content. Defaults to null.
   * 
   * @returns {Promise<Object>} A promise that resolves to an object containing the message type, encryption status,
   *                            encryption password, user ID, dialog type, dialog ID, and the processed message content.
   */
  async getTextMesData(htmlContent = null) {
    let messageContent;

    const { content, encryption } = await this.botRequists.inputProcessing();
    const { command } = await this.botRequists.inputProcessing();
    
    if (typeof content !== 'string' && command !== "фраза") {
      messageContent = content;
    
    } else if (command === 'фраза') {
        messageContent = content.data;

    } else {
      messageContent = htmlContent || this.mainInput.innerText;

      if (!encryption) {
        messageContent = messageContent.replace(/<[^br][^>]*>/g, '');

      } else {
        messageContent = content;
      }
    }

    return {
      type: 'text_message',
      data: {
        encryption,
        password: this.crypto.encryptPassword,
        user: this.userID,
        dialog: this.checkDialog(),
        dialogID: this.activeChatID,
        message:  messageContent ,
      },
    }
  }

  /**
   * Handles the keydown event on the main input.
   *
   * Listens for the 'Enter' key press without the 'Shift' key. 
   * Prevents the default behavior and processes the input text using `getTextMesData`.
   * Sends the processed data using `sendData`.
   *
   * @param {KeyboardEvent} evt - The keyboard event object.
   *
   * @async
   */
  async onMaininputKeydown(evt) {
    if (evt.code === 'Enter' && !evt.shiftKey) {
      evt.preventDefault();
      const htmlContent = this.mainInput.innerHTML;
      const data = await this.getTextMesData(htmlContent);
      this.sendData(data);
    }
  }

  /**
   * Handles the click event on the send button.
   *
   * Listens for clicks on the send button element. 
   * If the element is the send button, processes the input text using `getTextMesData`.
   * Sends the processed data using `sendData`.
   *
   * @param {MouseEvent} evt - The mouse event object.
   *
   * @async
   */
  async onSendBtnClick(evt) {
    if (evt.target.closest('.btn-wrap')) {
      const data = await this.getTextMesData();
      this.sendData(data);
    }
  }

  /**
   * Sends the processed data using WebSocket and resets the UI state.
   *
   * @param {Object} data - The processed data to be sent.
   *
   * Resests the main input text, hides the emoji list, removes the 'emoji' class from the messages content,
   * resets the encryption state and the encryption password, and removes the 'checked' class from the
   * encryption button.
   */
  sendData(data) {
    this.ws.send(JSON.stringify(data));
    this.mainInput.innerText = '';
    this.emojiList.classList.add('d_none');
    this.messagesContent.classList.remove('emoji');
    this.crypto.encryption = false;
    this.crypto.encryptPassword = null;
    this.encryptionBtn.classList.remove('checked');
  }

  /**
   * Determines the type of active chat dialog.
   *
   * Checks if there is an active chat within the group list. If found, it
   * returns 'group'; otherwise, it returns 'personal'.
   *
   * @returns {string} - The type of the active chat dialog: 'group' or 'personal'.
   */
  checkDialog() {
    let dialog;
    if (this.groupList.querySelector('.chat.active')) {
      dialog = 'group'
    } else {
      dialog = 'personal'
    }
    return dialog;
  }

  /**
   * Observes the main input element for changes and toggles the display of the send button and media buttons.
   *
   * When the main input is not empty, displays the send button and hides the media buttons.
   * When the main input is empty, hides the send button and displays the media buttons.
   */
  activateInputObserver() {
    this.mainInputObserver = new MutationObserver(() => {
      this.sendBtnBox.className = 'footer-controls__send-btn'
      this.mediaBtnsBox.className = 'footer-controls__media d_none'
      
      if (this.mainInput.innerText === '') {
        this.sendBtnBox.className = 'footer-controls__send-btn d_none'
        this.mediaBtnsBox.className = 'footer-controls__media'
      }
    });

    this.mainInputObserver.observe(this.mainInput, {
      childList: true,
      characterData: true,
      subtree: true,
    })
  }

  /**
   * Establishes a 5-second interval for sending a 'type: interval' WebSocket message.
   *
   * This interval is used to keep the WebSocket connection alive, as some networks may
   * disconnect the connection after a period of inactivity.
   */
  wsInterval() {
    const data = JSON.stringify({
      type: 'interval'
    });
    
    setInterval(() => {
      this.ws.send(data);
    }, 5000)
  }

  /**
   * Establishes a WebSocket connection and sets up event listeners for the connection.
   *
   * Creates a new WebSocket connection to the server at `this.wsURL` and sets the binary type to 'blob'.
   * Listens for the WebSocket connection to open, and when it does, sends a 'type: ping' message to the server,
   * initializes the sidebar, media handler, and file input handler, and starts the WebSocket interval.
   * Listens for WebSocket messages, connection close events, and errors, and logs relevant information to the console.
   */
  onSocketConnect() {
    this.ws = new WebSocket(this.wsURL);
    this.ws.binaryType = 'blob';

    this.ws.addEventListener('open', () => {
      const data = JSON.stringify({
        type: 'ping',
        data: {
          currentChunk: this.currentChunk,
          user: this.userID,
          dialog: this.checkDialog(),
          dialogID: this.activeChatID,
        }
      });

      this.ws.send(data);
      
      this.sidebar = new Sidebar(this.container, {
        ws: this.ws,
        user: this.userID,
        dialogID: this.activeChatID,
      });

      this.sidebar.init();
      
      this.mediaHandler = new MediaHandler(this.container, {
        ws: this.ws,
        user: this.userID,
        dialogID: this.activeChatID,
        url: this.baseURL,
      });

      this.fileInputHandler = new FileInputHandler(this.container, {
        ws: this.ws,
        user: this.userID,
        dialogID: this.activeChatID,
        url: this.baseURL,
        crypto: this.crypto,
      });

      this.wsInterval();
    });

    this.ws.addEventListener('message', (evt) => this.onWsMessage(evt));

    this.ws.addEventListener('close', () => {
      console.log('conection closed');
    });
    
    this.ws.addEventListener('error', (err) => {
      console.error(err);
    })
  }

  /**
   * Handles WebSocket messages.
   *
   * This function is called whenever a WebSocket message is received from the server.
   * It determines the type of the message and takes appropriate actions, including
   * redrawing the user list, drawing new messages, or updating the total number of messages.
   *
   * @param {Event} evt - The WebSocket message event.
   * @returns {boolean} - Always returns false.
   */
  onWsMessage(evt) {
    const message = JSON.parse(evt.data);

    if (message.type === 'pong') {

      if (message.users.length > 1) {
        const { users } = message;
        this.redrawUsers(users);
      }

      this.drawMessages(message);
      this.scrollToBottom();
      this.totalMessages = message.totalMessages;
      
      return false;
    }

    if (message.type === 'text_message') {
      const { data } = message;
      this.messagesContent.innerHTML = '';

      this.drawMessages(data);
      this.scrollToBottom();

      this.currentChunk = 0;
      this.fetching = false;
      this.totalMessages = data.totalMessages;

      return false;
    }

    if (message.type === 'logout' ) {
      const { users } = message;
      
      this.redrawUsers(users);
      return false;
    }

    if (message.type === 'more_messages') {
      const { data } = message;

      this.drawMessages(data);
      this.scrollToLastMessage();
      
      this.fetching = false;
      this.totalMessages = data.totalMessages;
      
      return false;
    }

    if (message.type === 'interval') {
      return false;
    }

    return false;
  }

  /**
   * Draws messages in the chat window from the given data.
   *
   * @param {Object} data - The data about the chat messages, containing the chat name,
   *   an array of messages, and the total number of messages.
   * @returns {undefined} - Does not return anything.
   */
  drawMessages(data) {
    this.messagesHeaderTitle.textContent = data.chatName;

    if (data.messages) {
      data.messages.reverse().forEach((message) => {

        let className;
        if (message.userID === this.userID) {
          className = 'right';
        } else {
          className = 'left';
        }

        this.messagesContent.insertAdjacentHTML('afterbegin', this.messageTemplate(
          className,
          message.message,
          message.time,
          message.userName,
          message.mesID,
          message.file,
          message.encryption,
          message.password,
        ));
      });
    }
  }

  /**
   * Draws the list of users in the sidebar from the given data.
   *
   * @param {Object} users - The data about the users, containing the user ID,
   *   login, avatar URL, and online status.
   * @returns {undefined} - Does not return anything.
   */
  redrawUsers(users) {
    this.chatsList.innerHTML = '';

    users.forEach((user) => {
      if (user.id !== this.userID) {
        this.chatsList.insertAdjacentHTML('beforeend', Templates.chatsUsersListItemMarkup(
          user.id,
          user.login,
        ));

        const avatar = this.chatsList.lastElementChild.querySelector('.chat__avatar');

        if (user.avatar) {
          avatar.style.backgroundImage = `url('${this.baseURL}/${user.avatar}')`;
        } else {
          avatar.style.backgroundImage = `url('${this.baseURL}/avatar.png')`;
        }

        if (user.online) {
          avatar.className = 'chat__avatar online';
        } else {
          avatar.className = 'chat__avatar';
        }
      }
    });

    this.numberOfUsers.textContent = users.length;
    this.numberOfOnlineUsers.textContent = this.container.querySelectorAll('.chat__avatar.online').length + 1;
  }

  /**
   * Sets the user's avatar image.
   *
   * @param {Object} data - The data object containing user information.
   *                        Expects a `user` property with an `avatar` URL.
   *
   * Updates the `userAvatar` element's background image with the user's avatar URL.
   * If no avatar URL is provided, defaults to a generic avatar image.
   */
  drawAvatar(data) {
    if (data.user.avatar) {
      this.userAvatar.style.backgroundImage = `url('${this.baseURL}/${data.user.avatar}')`;
    } else {
      this.userAvatar.style.backgroundImage = `url('${this.baseURL}/avatar.png')`;
    }
  }

  /**
   * Redraws the list of chat groups in the sidebar from the given data.
   *
   * @param {Object} data - The data object containing chat groups and users.
   *                        Expects a `groups` property with an array of chat group data,
   *                        and a `users` property with an array of user data.
   *
   * Clears the existing chat groups from the sidebar and populates it with the
   * given chat groups. If a chat group is marked as 'active', updates the messages
   * header title with the chat group name, updates the user count with the number
   * of users in the chat group, and sets the active chat ID to the ID of the
   * active chat group.
   */
  redrawDialogues(data) {
    let state = '';

    data.groups.forEach((group) => {
      if (group.active) {
        state = 'active';
        this.messagesHeaderTitle.textContent = group.name;
        this.numberOfUsers.textContent = data.users.length;
        this.activeChatID = group.id;
      }
      
      this.groupList.insertAdjacentHTML('beforeend', Templates.chatsGroupsItemMarkup(
        group.id,
        group.name,
        state,
      ));
    })
  }

  /**
   * Returns a template for a message item in the messages list.
   *
   * @param {string} className - The CSS class name for the message item.
   * @param {string|Object} message - The message content. Can be a string, or an object
   *                                  with data for the chaos bot.
   * @param {string} time - The timestamp for the message.
   * @param {string} userName - The name of the user who sent the message.
   * @param {string} mesID - The ID of the message.
   * @param {Object} [fileObj] - Optional file object data.
   * @param {boolean} [encryption] - Optional flag for encrypted message.
   * @param {string} [password] - Optional password for encrypted message.
   *
   * @returns {string} The message template HTML string.
   */
  messageTemplate(className, message, time, userName, mesID, fileObj = '', encryption, password) {
    let lockClassName;
    let button;
    let filePreview;
    let template;
    let chaosClassName = className;
    let chaosUserName = userName;
    let bodyID = '';

    console.log('className', className);
    console.log('message', message);
    console.log('time', time);
    console.log('userName', userName);
    console.log('mesID', mesID);
    console.log('fileObj', fileObj);
    console.log('encryption', encryption);
    console.log('password', password);


    if (encryption) {
      console.log('encryption', encryption);
      lockClassName = 'lock';
      button = `<div class="btn-wrap lock checked"><button class="button mail_lock"></button></div>`;
    } else {
      lockClassName = '';
      button = '';
    }
    
    let content = message;
    if (typeof message !== 'object' && Utils.checkLink(message)) {
      content = Utils.getLink(message);
    }

    if (typeof message === 'string') {
      console.log("message", message);
      content = Utils.formatMessageText(message);
    }

    if (typeof message === 'object') {
      if (message.weather || message.Valute || message.facts) {
        chaosClassName = 'left';
        chaosUserName = 'chaos';
      }

      content = BotRequests.chaosMesEngine(message).content;
      bodyID = BotRequests.chaosMesEngine(message).bodyID;
    }

    if (fileObj) {
      template = FileInputHandler.fileTemplateEngine(fileObj, this.baseURL)

      if (fileObj && !encryption) {
        filePreview = Templates.fileMarkup(template, fileObj, this.baseURL)
      }

      if (fileObj && encryption) {
        if (message) {
          content = this.crypto.encryptMessage(message, password);
        }

        filePreview = `
        <div class="encryptedFile">
          <span class="encryptedFile__content">${this.crypto.encryptMessage(Templates.fileMarkup(template, fileObj, this.baseURL), password)}</span>
        </div>`
      }

    } else {
      template = '';
      filePreview = '';
    }

    return Templates.messageMarkup({ 
      chaosClassName, 
      mesID, 
      bodyID, 
      chaosUserName, 
      time, 
      filePreview, 
      lockClassName, 
      content, 
      button 
    })
  }
}

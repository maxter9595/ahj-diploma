/* eslint-disable class-methods-use-this */
import CryptoJS from 'crypto-js';

export default class Encryption {
  /**
   * Constructor for Encryption class.
   * 
   * @param {HTMLElement} container - The element that contains all the elements 
   *                                  that will be used by this class.
   * @param {string} url - The base URL for requests to the server.
   * 
   * Sets up the class properties and event handlers for encrypting and decrypting 
   * messages.
   */
  constructor(container, url) {
    this.container = container;
    this.encryption = false;
    this.encryptPassword = null;
    this.baseURL = url;

    this.encryptionBtn = this.container.querySelector('.button.mail_lock').closest('.btn-wrap');
    this.encryptPopup = this.container.querySelector('.messages__encrypt-form');
    this.mesEncryptForm = this.container.querySelector('.messages-encrypt-form__form');
    this.mesDecryptForm = this.container.querySelector('.messages-decrypt-form__form');
    
    this.mesEncryptFormText = this.container.querySelector('.messages-encrypt-form__text');
    this.mesDecryptFormText = this.container.querySelector('.messages-decrypt-form__text');

    this.mesEncryptFormInput = this.container.querySelector('.messages-encrypt-form__input');
    this.mesDecryptFormInput = this.container.querySelector('.messages-decrypt-form__input');
    this.mesFormButtonClose = this.container.querySelector('.messages-encrypt-form__btn-close');

    this.popup = this.container.querySelector('.app__popup');
    this.popupContent = this.popup.querySelector('.app-popup__text');

    this.messagesContent = this.container.querySelector('.messages__content');
    this.groupList = this.container.querySelector('.chats__group-list');

    this.onEncryptionBtnClick = this.onEncryptionBtnClick.bind(this);
    this.onEncryptFormSubmit = this.onEncryptFormSubmit.bind(this);
    this.onMesFormBtnCloseClick = this.onMesFormBtnCloseClick.bind(this);
    this.onMessagesContentClick = this.onMessagesContentClick.bind(this);
    this.onDecryptFormSubmit = this.onDecryptFormSubmit.bind(this);

    this.encryptionBtn.addEventListener('click', this.onEncryptionBtnClick);
    this.mesEncryptForm.addEventListener('submit', this.onEncryptFormSubmit);
    this.mesDecryptForm.addEventListener('submit', this.onDecryptFormSubmit);
    this.mesFormButtonClose.addEventListener('click', this.onMesFormBtnCloseClick);
    this.messagesContent.addEventListener('click', this.onMessagesContentClick);
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
   * Encrypts a message given a key.
   * 
   * @param {string | Object} word - The message to be encrypted. If not a string,
   *                                  it is stringified first.
   * @param {string} key - The encryption key.
   * @returns {string} The encrypted message in Base64 format.
   * @throws If the encryption process fails.
   */
  encryptMessage(word, key) {
    try {
      const dataToEncrypt = typeof word === 'string' ? word : JSON.stringify(word);      
      const encrypted = CryptoJS.AES.encrypt(dataToEncrypt, key).toString();

      return CryptoJS.enc.Base64.stringify(
        CryptoJS.enc.Utf8.parse(encrypted)
      );
      
    } catch (err) {
      console.error('Encryption error:', err);
      throw err;
    }
  }

  /**
   * Decrypts an encrypted message using a given key.
   * 
   * This function first trims any whitespace and newlines from the input,
   * then performs the following steps:
   * 1. Decodes the Base64-encoded input.
   * 2. Decrypts the decoded string using AES with the provided key.
   * 3. Converts the decrypted bytes to a UTF-8 string.
   * 4. Attempts to parse the decrypted string as JSON. If parsing fails,
   *    returns the string as-is.
   * 
   * @param {string} word - The encrypted message in Base64 format.
   * @param {string} key - The decryption key.
   * @returns {Promise<string|Object>} A promise that resolves to the decrypted message.
   * @throws Will throw an error if decryption fails or if the result is empty.
   */
  async decryptMessage(word, key) {
    try {
      const trimmedWord = word.trim();      
      const decoded = CryptoJS.enc.Base64.parse(trimmedWord).toString(CryptoJS.enc.Utf8);
      
      const bytes = CryptoJS.AES.decrypt(decoded, key);      
      const decrypted = bytes.toString(CryptoJS.enc.Utf8);
      
      if (!decrypted) {
        throw new Error('Empty decryption result');
      }
      
      try {
        return JSON.parse(decrypted);
      } catch {
        return decrypted;
      }
      
    } catch (err) {
      console.log('Decryption failed:', {
        error: err.message,
        input: word,
        key
      });
      return "";
    }
  }

  /**
   * Shows the popup with a given text.
   * 
   * @param {string} text - The text to display in the popup.
   */
  showPopup(text) {
    this.popup.classList.remove('d_none');
    this.popupContent.textContent = text;
  }

  /**
   * Handles the click event for the encryption button.
   * 
   * Toggles the encryption state:
   * - If encryption is not active, it activates encryption by adding the 'checked' class 
   *   to the button, setting the encryption flag to true, and displaying the encryption form.
   * - If encryption is active, it deactivates encryption by removing the 'checked' class 
   *   from the button, setting the encryption flag to false, and clearing the encryption password.
   */
  onEncryptionBtnClick() {
    if (!this.encryption) {
      this.encryptionBtn.classList.add('checked');
      this.encryption = true;
      this.showEncryptForm();
    } else {
      this.encryptionBtn.classList.remove('checked');
      this.encryption = false;
      this.encryptPassword = null;
    }
  }

  /**
   * Shows the encryption form.
   * 
   * Toggles the visibility of the encryption form elements by setting the class names.
   * The encryption form is set to 'messages-encrypt-form__form' and the decryption form 
   * is set to 'messages-decrypt-form__form d_none'. Finally, the encryption popup is 
   * shown by removing the 'd_none' class.
   */
  showEncryptForm() {
    this.mesEncryptForm.className = 'messages-encrypt-form__form';
    this.mesDecryptForm.className = 'messages-decrypt-form__form d_none';
    this.encryptPopup.classList.remove('d_none');
  }

  /**
   * Shows the decryption form.
   * 
   * Toggles the visibility of the encryption and decryption form elements by setting the class names.
   * The encryption form is set to 'messages-encrypt-form__form d_none' and the decryption form 
   * is set to 'messages-decrypt-form__form'. Finally, the encryption popup is shown by removing the 'd_none' class.
   */
  showDecryptForm() {
    this.mesEncryptForm.className = 'messages-encrypt-form__form d_none';
    this.mesDecryptForm.className = 'messages-decrypt-form__form';
    this.encryptPopup.classList.remove('d_none');
  }

  /**
   * Hides the encryption popup.
   *
   * Adds the 'd_none' class to the encryption popup element to hide it from view.
   */
  hideEncryptPopup() {
    this.encryptPopup.classList.add('d_none');
  }

  /**
   * Handles the submission of the encryption form.
   *
   * Prevents the default form submission behavior and retrieves the password 
   * entered by the user. This password is stored for encryption purposes. 
   * Afterward, the encryption popup is hidden, and the input field is cleared.
   *
   * @param {Event} evt - The event object from the form submission.
   */
  onEncryptFormSubmit(evt) {
    evt.preventDefault();
    this.encryptPassword = this.mesEncryptFormInput.value;
    this.hideEncryptPopup();
    this.mesEncryptFormInput.value = '';
  }

  /**
   * Sends a request to the server to decrypt a message.
   *
   * Collects data related to the active chat and message, 
   * then submits a POST request to the server's decryption endpoint.
   * The server's response is returned as a JSON object.
   *
   * @returns {Promise<Object>} A promise that resolves to the server's response.
   *                            Typically contains the result of the decryption request.
   */
  async requestDecryption() {
    this.activeChatID = document.querySelector('.chat.active').dataset.id;
    const { id } = this.targetMesEl.closest('.message').dataset;
    const formData = new FormData();
    
    formData.append('mesID', id);
    formData.append('dialog', this.checkDialog());
    formData.append('dialogID', this.activeChatID);

    const request = await fetch(`${this.baseURL}/decryption`, {
      method: 'POST',
      body: formData,
    })
    
    const result = await request.json();
    return result;
  }

  /**
   * Handles the submission of the decryption form.
   * 
   * Prevents the default form submission behavior, hides the encryption popup, 
   * and sends a request to the server to decrypt a message.
   * If the decryption is successful, decrypts the message content (file and text) 
   * using the provided key, and removes the 'lock' class from the decrypted elements.
   * If the decryption is unsuccessful, shows a popup with an error message.
   * 
   * @param {Event} evt - The event object from the form submission.
   */
  async onDecryptFormSubmit(evt) {
    evt.preventDefault();
    this.hideEncryptPopup();
  
    const result = await this.requestDecryption();
    
    if (result.success) {
      let decryptedText;
      const userProvidedKey = this.mesDecryptFormInput.value;
      const correctKey = result.data;
      
      if (userProvidedKey === correctKey) {
        this.encryptPassword = correctKey;
        this.targetMesEl.classList.remove('checked');
        this.targetMesEl.style.display = 'none';
  
        // Получаем оба элемента (файл и текст)
        const messageBody = this.targetMesEl.closest('.message__body');
        const fileContentEl = messageBody.querySelector('.encryptedFile__content');
        const textContentEl = messageBody.querySelector('.message__content');
  
        try {
          if (fileContentEl) {
            const decryptedFile = await this.decryptMessage(fileContentEl.textContent, correctKey);
            fileContentEl.innerHTML = decryptedFile;
          }
  
          if (textContentEl && textContentEl.classList.contains('lock')) {

            if (textContentEl.textContent) {
              decryptedText = await this.decryptMessage(textContentEl.textContent, correctKey);
            } else {
              textContentEl.classList.add('d_none');
            }

            if (decryptedText) { 
              textContentEl.innerHTML = decryptedText;
            }

            textContentEl.classList.remove('lock');
          }

        } catch (err) {
          console.error('Failed to decrypt:', err);
          this.showPopup('Ошибка дешифровки!');
        }
        
      } else {
        this.showPopup('Неверный пароль!');
      }
      
      this.mesDecryptFormInput.value = '';
    }
  }

  /**
   * Handles the click event on the close button of the encryption form.
   * 
   * Hides the encryption popup, removes the 'checked' class from the encryption button,
   * and sets the encryption flag to false.
   */
  onMesFormBtnCloseClick() {
    this.hideEncryptPopup();
    this.encryptionBtn.classList.remove('checked')
    this.encryption = false;
  }

  /**
   * Handles click events within the messages content area.
   *
   * This function specifically targets clicks on elements with the class 'btn-wrap lock'.
   * If the clicked element is already marked as 'checked', it displays the decryption form.
   * Otherwise, it marks the element as 'checked', retrieves the message content, and encrypts it.
   * The function also handles different content types, such as regular messages and encrypted files.
   *
   * @param {Event} evt - The click event object.
   */
  async onMessagesContentClick(evt) {
    if (evt.target.closest('.btn-wrap.lock')) {
      this.targetMesEl = evt.target.closest('.btn-wrap.lock');

      if (this.targetMesEl.classList.contains('checked')) {
        this.showDecryptForm();

      } else {
        let contentEl;

        this.targetMesEl.classList.add('checked');
        const text = this.targetMesEl.closest('.message__body').querySelector('.message__content');

        if (this.targetMesEl.closest('.message__body').querySelector('.encryptedFile')) {
          contentEl = this.targetMesEl.closest('.message__body').querySelector('.encryptedFile__content');
        } else {
          contentEl = this.targetMesEl.closest('.message__body').querySelector('.message__content');
        }

        const result = await this.requestDecryption();
        const originalText = this.encryptMessage(contentEl.innerHTML, result.data);
        contentEl.textContent = originalText;
        
        if (text.textContent) {
          const textInfo = this.encryptMessage(text.textContent, result.data);
          text.textContent = textInfo;
        }
      }
    }
  }
}

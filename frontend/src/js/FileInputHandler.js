export default class FileInputHandler {
  /**
   * Initializes the FileInputHandler class.
   *
   * @param {HTMLElement} container - The container element where file input operations are managed.
   * @param {Object} options - Configuration options for the handler.
   * @param {WebSocket} options.ws - The WebSocket connection for real-time communication.
   * @param {string} options.dialogID - The ID of the active chat dialog.
   * @param {string} options.user - The user ID.
   * @param {string} options.url - The base URL for server requests.
   * @param {Object} options.crypto - The encryption object for secure file handling.
   *
   * Sets up DOM references for file input elements, preview components, 
   * and encryption button. Binds event listeners for file input changes, 
   * preview actions, and drag-and-drop functionality.
   */
  constructor(container, options) {
    this.container = container;
    this.ws = options.ws
    this.activeChatID = options.dialogID;
    this.userID = options.user;
    this.baseURL = options.url;
    this.crypto = options.crypto;

    this.fileInput = this.container.querySelector('.file__input');
    this.wrapFileInput = this.container.querySelector('.file-input__wrap');
    this.dropTooltip = this.container.querySelector('.dropTooltip');
    this.messagesContent = this.container.querySelector('.messages__content');

    this.previewFile = this.container.querySelector('.messages__preview-file.preview');
    this.previewImage = this.previewFile.querySelector('.preview__image');
    this.previewInput = this.previewFile.querySelector('.preview__input');
    this.previewCancelBtn = this.previewFile.querySelector('.preview__btn.cancel');
    this.previewSendBtn = this.previewFile.querySelector('.preview__btn.send');

    this.popup = this.container.querySelector('.app__popup');
    this.groupList = this.container.querySelector('.chats__group-list');
    this.encryptionBtn = this.container.querySelector('.button.mail_lock').closest('.btn-wrap');

    this.fileInput.addEventListener('change', (evt) => this.onFileIputChange(evt));
    this.wrapFileInput.addEventListener('click', (evt) => this.onWrapFileInputClick(evt));
    
    this.previewCancelBtn.addEventListener('click', () => this.onPreviewCancelBtnClick());
    this.previewSendBtn.addEventListener('click', () => this.onPreviewSendBtnClick());

    this.messagesContent.addEventListener('dragover', (evt) => this.onAppMessagesDragover(evt));
    this.messagesContent.addEventListener('dragleave', () => this.onAppMessagesDragleave());
    this.messagesContent.addEventListener('drop', (evt) => this.onDrop(evt));
  }

  /**
   * Handles the drop event within the messages content area.
   *
   * Prevents the default browser behavior, extracts the dropped file, 
   * and creates a preview of the file to be sent. 
   * 
   * @param {Event} evt - The drop event object.
   */
  async onDrop(evt) {
    evt.preventDefault();
    this.file = await [...evt.dataTransfer.files][0];
    this.previewURL = URL.createObjectURL(this.file);
    this.adaptationPreview(this.file);
  }

  /**
   * Handles the dragleave event within the messages content area.
   *
   * Hides the drag-and-drop tooltip.
   */
  onAppMessagesDragleave() {
    this.hideTooltip();
  }

  /**
   * Handles the dragover event within the messages content area.
   *
   * Prevents the default browser behavior and displays the drag-and-drop tooltip.
   * This function is triggered when a dragged item is over the designated area.
   *
   * @param {Event} evt - The dragover event object.
   */
  onAppMessagesDragover(evt) {
    evt.preventDefault()
    this.showTooltip();
  }

  /**
   * Checks the type of active chat dialog.
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
   * Sends a file to the server.
   *
   * Creates a FormData object and appends the following data to it:
   * - user ID
   * - dialog type (group or personal)
   * - dialog ID
   * - the file object
   * - description of the file
   * - encryption settings (as JSON)
   * - encryption password
   * 
   * Submits a POST request to the server's /files endpoint with the FormData object as the request body.
   * The server's response is returned as a JSON object.
   * 
   * @param {string} description - The description of the file to be sent.
   * @returns {Promise<Object>} A promise that resolves to the server's response.
   */
  async sendingFile(description) {
    const formData = new FormData();

    const dataEncrypt = {
      encrypt: this.crypto.encryption
    }

    formData.append('user', this.userID);
    formData.append('dialog', this.checkDialog());
    formData.append('dialogID', this.activeChatID);
    formData.append('file', this.file);
    formData.append('description', description);
    formData.append('encryption', JSON.stringify(dataEncrypt));
    formData.append('password', this.crypto.encryptPassword);

    const request = await fetch(`${this.baseURL}/files`, {
      method: 'POST',
      body: formData,
    });
    
    const result = await request.json();
    return result;
  }

  /**
   * Attaches a file to the active chat and sends a message to the server
   * to notify other users of the new message.
   * 
   * If the file attachment is successful, it resets the current chunk to 0,
   * sends a message to the server to notify other users of the new message,
   * and hides the file preview.
   * 
   * @param {string} description - The description of the file to be sent.
   * @returns {Promise<void>} A promise that resolves when the function is finished.
   */
  async attachFile(description = '') {
    const result = await this.sendingFile(description);

    if (result.success) {
      this.currentChunk = 0;

      const data = {
        type: 'messages',
        data: {
          dialog: this.checkDialog(),
          dialogID: this.activeChatID,
        }
      }

      this.ws.send(JSON.stringify(data));
      this.hidePreviewFile();
      
      this.crypto.encryption = false;
      this.crypto.encryptPassword = null;
      this.encryptionBtn.classList.remove('checked');
    }
  }

  /**
   * Handles the click event of the send button within the file preview.
   * 
   * Prevents the default button behavior, sends a file to the server
   * by calling the `attachFile` method, and resets the file description input.
   * 
   * @returns {Promise<void>} A promise that resolves when the function is finished.
   */
  async onPreviewSendBtnClick() {
    let description = '';
    this.previewImage.innerHTML = '<div class="preview__loading"></div>';
    
    if (this.previewInput.value) {
      description = this.previewInput.value;
      this.previewInput.value = '';
    }
    
    this.attachFile(description);
  }

  /**
   * Handles the click event of the cancel button within the file preview.
   * 
   * Hides the drag-and-drop tooltip and the file preview, and revokes the object URL for the file.
   * 
   * @returns {void} Nothing.
   */
  onPreviewCancelBtnClick() {
    this.hideTooltip();
    this.hidePreviewFile();
    URL.revokeObjectURL(this.previewURL);
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
   * Handles the click event on the file input wrapper.
   *
   * Checks if the clicked target is within the designated file input wrapper element.
   * If true, it programmatically triggers a click event on the file input element.
   *
   * @param {Event} evt - The click event object.
   */
  onWrapFileInputClick(evt) {
    if (evt.target.closest('.btn-wrap.file-input__wrap')) {
      const event = new MouseEvent('click');
      this.fileInput.dispatchEvent(event);
    }
  }

  /**
   * Handles the change event of the file input element.
   *
   * Prevents the default event behavior, extracts the selected file,
   * and generates a preview URL for the file. If a file is selected,
   * the preview is adapted for display.
   *
   * @param {Event} evt - The change event object from the file input.
   */
  async onFileIputChange(evt) {
    evt.preventDefault();
    this.file = await [...evt.currentTarget.files][0];
    
    if (this.file) {
      this.previewURL = URL.createObjectURL(this.file);
      this.adaptationPreview(this.file);
    }
  }

  /**
   * Displays the drag-and-drop tooltip.
   *
   * Adds the 'tooltip' class to the messages content element to make the tooltip visible.
   *
   * @returns {void} Nothing.
   */
  showTooltip() {
    this.messagesContent.className = 'messages__content tooltip';
  }

  /**
   * Hides the drag-and-drop tooltip.
   *
   * Removes the 'tooltip' class from the messages content element to hide the tooltip.
   *
   * @returns {void} Nothing.
   */
  hideTooltip() {
    this.messagesContent.className = 'messages__content'
  }

  /**
   * Shows the file preview.
   *
   * Removes the 'd_none' class from the preview element to make it visible.
   *
   * @returns {void} Nothing.
   */
  showPreviewFile() {
    this.previewFile.classList.remove('d_none');
  }

  /**
   * Hides the file preview.
   *
   * Adds the 'd_none' class to the file preview element to hide it from view.
   * Resets the background image and inner HTML of the preview image.
   *
   * @returns {void} Nothing.
   */
  hidePreviewFile() {
    this.previewFile.classList.add('d_none');
    this.previewImage.style.backgroundImage = `none`;
    this.previewImage.innerHTML = '';
  }

  /**
   * Adapts the preview of a file according to its type.
   *
   * Checks the type of the file and sets the background image or inner HTML of the
   * preview image accordingly. If the file type is not supported, it is shown as an
   * icon with the file name below.
   * 
   * @param {File} file - The file to be previewed.
   *
   * @returns {void} Nothing.
   */
  adaptationPreview(file) {
    if (file.size > 134217728) {
      this.showPopup('Размер файла превышает лимит 128Мб');
      this.hideTooltip();
      return;
    }

    if (file.type.startsWith('image')) {
      this.previewImage.style.backgroundImage = `url('${this.previewURL}')`;
    }

    else if  (file.type.startsWith('audio')) {
      this.previewImage.innerHTML = `<audio src="${this.previewURL}" controls></audio>`;
    }

    else if  (file.type.startsWith('video')) {
      this.previewImage.innerHTML = `<video src="${this.previewURL}" height="300px" width="450px" controls></video>`;
    }

    else if  (file.type === 'application/pdf') {
      this.previewImage.innerHTML = `<object height="300px" width="450px" data="${this.previewURL}" type="application/pdf"></object>`;
    }

    else if  (file.type === 'text/plain') {
      this.previewImage.innerHTML = `<object height="300px" width="450px" data="${this.previewURL}" type="text/plain"></object>`;
    }

    else {
      const fileExt = file.name.split('.').pop().toLowerCase();

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
        default: '📎'
      };

      this.previewImage.innerHTML = `
        <div style="
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;
        ">
          <div style="font-size: 250px; line-height: 1;">${iconMap[fileExt] || iconMap.default}</div>
          <div style="
            font-size: 16px; 
            margin-top: 10px;
            word-break: break-all;
            text-align: center;
            max-width: 100%;
            padding: 0 10px;
          ">${file.name}</div>
        </div>
      `;
    }

    this.showPreviewFile();
    this.hideTooltip();
  }

  /**
   * Returns a template string for the given file object and URL.
   * Depending on the file type, a different template is generated.
   * @param {File} fileObj - The file object
   * @param {string} url - The URL to the file
   * @returns {string} The template string
   */
  static fileTemplateEngine(fileObj, url) {
    let fileTemplate;
    
    if (fileObj.type.startsWith('audio') && fileObj.type !== 'audio/webm;codecs=opus') {
      fileTemplate = `<audio src="${url}/${fileObj.name}" controls></audio>`
    }

    if (fileObj.type === 'audio/webm;codecs=opus') {
      fileTemplate = `<div class="voice">Голосовое сообщение:</div><audio src="${url}/${fileObj.name}" controls></audio>`
    }

    if (fileObj.type.startsWith('video')) {
      fileTemplate = `<video src="${url}/${fileObj.name}" width="350" height="200" controls></video>`
    }
    
    if (fileObj.type.startsWith('text')) {
      fileTemplate = `<object data="${url}/${fileObj.name}" width="350" height="450" type="text/plain"></object>`
    }
    
    if (fileObj.type.startsWith('application')) {
      fileTemplate = `<object data="${url}/${fileObj.name}" width="350" height="450"></object>`
    }
    
    if (fileObj.type.startsWith('image')) {
      fileTemplate = `<img src="${url}/${fileObj.name}">`
    }
    
    return fileTemplate;
  }
}

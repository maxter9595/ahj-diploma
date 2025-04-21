import Geolocation from "./Geolocation";
import Timer from "./Timer";

export default class MediaHandler {
  /**
   * Initializes the MediaHandler class.
   *
   * @param {HTMLElement} container - The container element where the media handler operates.
   * @param {Object} options - Configuration options for the handler.
   * @param {WebSocket} options.ws - The WebSocket connection for real-time communication.
   * @param {string} options.dialogID - The ID of the active chat dialog.
   * @param {string} options.user - The user ID.
   * @param {string} options.url - The base URL for server requests.
   *
   * Sets up DOM references for media buttons box, record box, popup, popup content, timer, group list, and preview record.
   * Binds event handlers for media button clicks, record button clicks, start record, data available, and stop record.
   * Adds event listeners for media button and record button clicks.
   */
  constructor(container, options) {
    this.container = container;
    this.ws = options.ws;
    this.activeChatID = options.dialogID;
    this.userID = options.user;
    this.baseURL = options.url;
    this.cancellation = false;
    
    this.mediaBtnsBox = this.container.querySelector('.footer-controls__media');
    this.mediaRecordBox = this.container.querySelector('.footer-controls__media.record');

    this.popup = this.container.querySelector('.app__popup');
    this.popupContent = this.popup.querySelector('.app-popup__text');
    
    this.timer = new Timer(document.querySelector('.record-timer'));
    this.groupList = this.container.querySelector('.chats__group-list');
    this.previewRecord = this.container.querySelector('.messages__preview-record');

    this.onMediaBtnsClick = this.onMediaBtnsClick.bind(this);
    this.onMediaRecordClick = this.onMediaRecordClick.bind(this);
    this.startRecord = this.startRecord.bind(this);
    this.dataavailable = this.dataavailable.bind(this);
    this.stopRecord = this.stopRecord.bind(this);

    this.mediaBtnsBox.addEventListener('click', this.onMediaBtnsClick);
    this.mediaRecordBox.addEventListener('click', this.onMediaRecordClick);
  }

  /**
   * Determines the type of the active chat dialog.
   *
   * Checks the group list for an active chat element. If an active chat
   * is found, it identifies the dialog as 'group'; otherwise, it is 
   * identified as 'personal'.
   *
   * @returns {string} - Returns 'group' if an active chat is found in 
   * the group list; otherwise, returns 'personal'.
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
   * Shows the popup with a given text.
   * 
   * @param {string} text - The text to display in the popup.
   */
  showPopup(text) {
    this.popup.classList.remove('d_none');
    this.popupContent.textContent = text;
  }

  /**
   * Pushes the received data chunk to the chunks array if the cancellation
   * flag is not set.
   *
   * @param {BlobEvent} evt - The event fired when the media stream data is
   *                           available.
   */
  dataavailable(evt) {
    if (!this.cancellation) {
      this.chunks.push(evt.data);
    }
  }

  /**
   * Stops the recording process, finalizes the media file, and resets the UI.
   *
   * If the recording has not been cancelled, this function creates a new file
   * from the recorded data chunks, hides the media record box, shows the media
   * buttons box, resets the timer, and attaches the file for further processing.
   */
  stopRecord() {
    const type = this.recorder.mimeType;

    if (!this.cancellation) {
      this.file = new File(this.chunks, '', { type });
      
      this.mediaRecordBox.classList.add('d_none');
      this.mediaBtnsBox.classList.remove('d_none');

      this.timer.resetTimer();
      this.attachFile();
    }
  }

  /**
   * Attaches the recorded file to the active chat and sends a message to the server
   * to notify other users of the new message.
   *
   * If the file attachment is successful, it sends a message to the server to notify
   * other users of the new message.
   *
   * @returns {Promise<void>} A promise that resolves when the function is finished.
   */
  async attachFile() {
    const result = await this.sendingFile();

    if (result.success) {
      const data = {
        type: 'messages',
        data: {
          dialog: this.checkDialog(),
          dialogID: this.activeChatID,
        }
      }
      
      this.ws.send(JSON.stringify(data));
    }
  }

  /**
   * Sends a file to the server.
   *
   * Creates a FormData object containing the following data:
   * - User ID
   * - Dialog type and ID
   * - File object
   * - Description (empty string by default)
   * - Encryption settings (default to not encrypt)
   * - Encryption password (null by default)
   *
   * Submits a POST request to the server's /files endpoint with the FormData object as the request body.
   * Returns the server's response as a JSON object.
   *
   * @returns {Promise<Object>} A promise that resolves to the server's response.
   */
  async sendingFile() {
    const formData = new FormData();

    const dataEncrypt = {
      encrypt: false,
    }

    formData.append('user', this.userID);
    formData.append('dialog', this.checkDialog());
    formData.append('dialogID', this.activeChatID);
    formData.append('file', this.file);
    formData.append('description', '');
    formData.append('encryption', JSON.stringify(dataEncrypt));
    formData.append('password', null);

    const request = await fetch(`${this.baseURL}/files`, {
      method: 'POST',
      body: formData,
    });
    
    const result = await request.json();
    return result;
  }

  /**
   * Starts the recording process and changes the UI to display the media record box.
   * 
   * This function hides the media buttons box, shows the media record box, and starts the timer.
   */
  startRecord() {
    this.mediaBtnsBox.classList.add('d_none');
    this.mediaRecordBox.classList.remove('d_none');
    this.timer.startTimer();
  }

  /**
   * Handles the click event on the media record box.
   *
   * Depending on which button is clicked, this function either cancels the recording
   * process and resets the UI, or stops the recording process and hides the media
   * record box.
   *
   * @param {Event} evt - The click event object.
   */
  onMediaRecordClick(evt) {
    if (evt.target.closest('.btn-wrap').querySelector('.button.close')) {
      this.cancellation = true;

      this.mediaRecordBox.classList.add('d_none');
      this.mediaBtnsBox.classList.remove('d_none');
      this.recorder.stop();
      
      this.stream.getTracks().forEach((track) => track.stop());
      this.timer.resetTimer();
      
      if (this.contentType === 'video') {
        this.previewRecord.classList.add('d_none');
      }
    }

    if (evt.target.closest('.btn-wrap').querySelector('.button.confirm')) {
      this.recorder.stop();
      this.stream.getTracks().forEach((track) => track.stop());
      
      if (this.contentType === 'video') {
        this.previewRecord.classList.add('d_none');
      }
    }
  }

  /**
   * Handles the click event on the microphone button.
   *
   * This function requests permission for the user's microphone and if permission is granted,
   * it sets the content type to 'audio' and starts the recording process.
   */
  async onMicroBtnClick() {
    this.contentType = 'audio';

    this.stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: false,
    });
  }

  /**
   * Handles the click event for the geolocation button.
   *
   * Initiates a request for the user's geolocation using the Geolocation service.
   * If successful, it constructs a message containing the user's location data,
   * user ID, dialog information, and sends this message over the WebSocket connection.
   *
   * If an error occurs, it triggers a popup to display the error message.
   */
  onGeoBtnClick() {
    const promise = Geolocation.getLocation(this.showPopup, this);

    promise.then((data) => {
      if (data) {
        const msg = {
          type: 'text_message',
          data: {
            user: this.userID,
            dialog: this.checkDialog(),
            dialogID: this.activeChatID,
            message: data,
          },
        }
        
        this.ws.send(JSON.stringify(msg));
      }
    })
  }

  /**
   * Handles the click event on the video button.
   *
   * This function requests permission for the user's video and if permission is granted,
   * it sets the content type to 'video', assigns the stream to the video element, and starts playing the video.
   */
  async onVideoBtnClick() {
    this.contentType = 'video';

    this.stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });

    this.previewRecord.classList.remove('d_none')
    this.previewRecord.srcObject = this.stream;
    this.previewRecord.play();
  }

  /**
   * Handles the click event for the media buttons.
   *
   * Checks if the MediaDevices API is supported and if the user has granted permission
   * for the microphone and/or video. If permission has been granted, it starts the recording
   * process by creating a MediaRecorder instance and adding event listeners for the
   * 'start', 'dataavailable', and 'stop' events.
   *
   * If an error occurs, it triggers a popup to display the error message.
   *
   * @param {Event} evt - The click event object.
   */
  async onMediaBtnsClick(evt) {
    if (!navigator.mediaDevices) {
      this.showPopup('Ваш браузер не поддерживает API MediaDevices');
      return;
    }

    try {
      if (this.cancellation) {
        this.cancellation = false;
      }
      
      if (evt?.target?.closest('.btn-wrap')?.querySelector('.button.micro')) {
        await this.onMicroBtnClick();
      }

      if (evt?.target?.closest('.btn-wrap')?.querySelector('.button.video')) {
        await this.onVideoBtnClick();
      }

      if (evt?.target?.closest('.btn-wrap')?.querySelector('.button.geo')) {
        this.onGeoBtnClick();
        return;
      }

      if (!window.MediaRecorder) {
        this.showPopup('Ваш браузер не поддерживает API MediaRecorder');
        return;
      }

      this.recorder = new MediaRecorder(this.stream);
      
      this.chunks = [];
      this.recorder.addEventListener('start', this.startRecord);
      this.recorder.addEventListener('dataavailable', this.dataavailable);
      this.recorder.addEventListener('stop', this.stopRecord);
      this.recorder.start();

    } catch (err) {
      this.showPopup('Настройки вашего браузера запрещают доступ к микрофону или видеокамере');
      console.error(err);
    }
  }
}

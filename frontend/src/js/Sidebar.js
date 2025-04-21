/* eslint-disable no-param-reassign */
/* eslint-disable import/no-cycle */
import { debounceTime, fromEvent, pluck, filter, switchMap } from "rxjs";
import Templates from "./Templates";

require('dotenv').config();

export default class Sidebar {
  /**
   * Initializes the Sidebar class.
   *
   * @param {HTMLElement} container - The container element for the sidebar.
   * @param {Object} options - Configuration options for the sidebar.
   * @param {WebSocket} options.ws - The WebSocket connection for real-time communication.
   * @param {string} options.dialogID - The ID of the active chat dialog.
   * @param {string} options.user - The user ID.
   *
   * Binds event listeners for the messages header buttons, back button, attachment menu,
   * and search input.
   */
  constructor(container, options) {
    this.container = container;
    this.ws = options.ws;
    this.activeChatID = options.dialogID;
    this.userID = options.user;
    // this.baseURL = process.env.BASE_URL;
    this.baseURL = process.env.BASE_URL || 'https://ahj-diploma-6967.onrender.com';

    this.onMessagesHeaderBtnsClick = this.onMessagesHeaderBtnsClick.bind(this);
    this.onBackBtnClick = this.onBackBtnClick.bind(this);
    this.onAttachmentMenuClick = this.onAttachmentMenuClick.bind(this);
    this.onInput = this.onInput.bind(this);
    this.onSidebarFoundMessagesClick = this.onSidebarFoundMessagesClick.bind(this);
  }

  /**
   * Initializes the sidebar.
   *
   * Sets up the sidebar content by inserting the necessary markup into the app content.
   * Finds and assigns DOM elements for various sidebar components including messages header buttons,
   * search input, info sidebar, attachment menu, and back button.
   * Binds event handlers for sidebar elements and initializes observers.
   */
  init() {
    this.appContent = this.container.querySelector('.app__content');
    this.appContent.insertAdjacentHTML('beforeend', Templates.sidebarMarkup);

    this.messagesHeaderBtns = this.container.querySelector('.messages-header__buttons');
    this.sideBarSearch = this.container.querySelector('.app__sidebar.search-mes');
    this.sideBarInfo = this.container.querySelector('.app__sidebar.info');

    this.sidebarBtnClose = this.container.querySelectorAll('.button.close-sb');
    this.attachmentMenu = this.container.querySelector('.sidebar__attachments-list');
    this.backBtn = this.container.querySelector('.button.back');

    this.previewMenu = this.container.querySelector('[data-name="preview-menu"]');
    this.mainInput = this.container.querySelector('.footer-controls__input');
    this.groupList = this.container.querySelector('.chats__group-list');
    
    this.numbPhotos = this.container.querySelector('[data-number="photo"]')
    this.numbVideo = this.container.querySelector('[data-number="video"]')
    this.numbLink = this.container.querySelector('[data-number="link"]')
    this.numbVoice = this.container.querySelector('[data-number="voice"]')
    this.numbFile = this.container.querySelector('[data-number="file"]')
    this.numbAudio = this.container.querySelector('[data-number="audio"]')
    
    this.previewPhotos = this.container.querySelector('[data-id="photo"]')
    this.previewVideos = this.container.querySelector('[data-id="video"]')
    this.previewVoices = this.container.querySelector('[data-id="voice"]')
    this.previewAudios = this.container.querySelector('[data-id="audio"]')
    this.previewLinks = this.container.querySelector('[data-id="link"]')

    this.previewTitle = this.container.querySelector('.sidebar-preview__title')
    this.messagesContainer = this.container.querySelector('.messages__content');
    this.sidebarForm = this.container.querySelector('.sidebar__search.search');

    this.sidebarSearchInput = this.container.querySelector('[data-id="sidebar_search"]');
    this.sidebarSearchBtnsOn = this.container.querySelector('[data-id="sidebar_btn-on"]')
    this.sidebarSearchBtnsOf = this.container.querySelector('[data-id="sidebar_btn-of"]');
    
    this.popup = this.container.querySelector('.app__popup');
    this.sidebarFoundMessages = this.container.querySelector('.sidebar__found-list')

    this.asignEventHandlers();
    this.activateMessagesObserver();
  }

  /**
   * Clears the sidebar found messages list when the search input value is empty.
   *
   * @param {Event} evt - The input event.
   */
  onInput(evt) {
    if (!evt.target.value) {
      this.sidebarFoundMessages.innerHTML = '';
    }
  }

  /**
   * Attaches an event listener to the sidebar search input for handling input events.
   * 
   * Utilizes RxJS operators to debounce the input events, extract the input value,
   * filter out empty values, and perform an asynchronous request with the input value.
   * The result of the request is passed to the drawPreviewMessage method to update
   * the sidebar with the preview of messages.
   */
  validateSearchInput() {
    this.sidebarSearchInput.addEventListener('input', this.onInput)

    fromEvent(this.sidebarSearchInput, 'input').pipe(
      debounceTime(100),
      pluck('target', 'value'),
      filter((value) => value.trim() !== ''),
      
      switchMap((value) => {
        this.searchInputValue = value;
        return this.getRequest(value)
      })
    )
      .subscribe((value) => {
        this.drawPreviewMessage(value);
      })
  }

  /**
   * Updates the sidebar found messages list with the preview of messages that match the search query.
   * 
   * @param {Array} data - An array of objects containing data about messages to be previewed in the sidebar.
   * 
   * @returns {void} Nothing.
   */
  drawPreviewMessage(data) {
    this.sidebarFoundMessages.innerHTML = '';

    if (data.length) {
      data.forEach((item) => {
        this.sidebarFoundMessages.insertAdjacentHTML(
          'beforeend', this.previewMessageMarkup(item)
        )
      })
    }
  }

  /**
   * Creates a markup for a single preview message to be displayed in the sidebar.
   * 
   * @param {Object} data - An object containing data about the message to be previewed.
   * 
   * @returns {String} A string of HTML representing the preview message.
   */
  previewMessageMarkup(data) {
    let replace;
    
    if (this.searchInputValue) {
      replace = data.message.replace(
        this.searchInputValue, (value) => `<span class="marker">${value}</span>`
      )
    }

    return `<li class="found-list__found" data-id="${data.mesID}">
    <div class="found__title">
      <div class="found__text">${data.userName}</div>
      <div class="found__time">${data.time}</div>
    </div>
    <div class="found__content">${replace}</div>
  </li>`
  }

  /**
   * Makes a POST request to the server's /validate_mes endpoint.
   * 
   * The request body is a FormData object containing the search query value,
   * dialog type (group or personal), and dialog ID.
   * 
   * The server's response is returned as a JSON object. If the request was successful,
   * the response data is an array of objects containing data about messages that
   * match the search query. Otherwise, an empty array is returned.
   * 
   * @param {string} value - The search query value.
   * 
   * @returns {Promise<Array<Object>>} A promise that resolves to an array of objects.
   */
  async getRequest(value) {
    const formData = new FormData();

    formData.append('value', value);
    formData.append('dialog', this.checkDialog());
    formData.append('dialogID', this.activeChatID)
    
    const request = await fetch(`${this.baseURL}/validate_mes`, {
      method: 'POST',
      body: formData,
    });

    const result = await request.json();
    
    if (result.success) {
      return result.data;
    }
    
    return [];
  }

  /**
   * Displays the popup with the specified text.
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
   * Observes the messages container and reloads attachments when a new message is added.
   * 
   * This method creates a MutationObserver that listens for changes in the messages container.
   * When a new message is added, it sends a POST request to the '/attachments' endpoint
   * with the dialog type and ID as the request body, and reloads the attachments based on the response.
   */
  activateMessagesObserver() {
    this.messagesObserver = new MutationObserver(async () => {
      const formData = new FormData();

      formData.append('dialog', this.checkDialog());
      formData.append('dialogID', this.activeChatID)
      
      const request = await fetch(`${this.baseURL}/attachments`, {
        method: 'POST',
        body: formData,
      });

      const result = await request.json();
      
      if (result.success) {
        this.reloadPhotos(result.data.images);
        this.reloadVideos(result.data.video);
        this.reloadVoices(result.data.voice);
        this.reloadAudios(result.data.audio);
        this.reloadLinks(result.data.links);
      }
    });

    this.messagesObserver.observe(this.messagesContainer, {
      childList: true,
      characterData: true,
      subtree: true,
    })
  }

  /**
   * Reloads the list of photos in the sidebar preview.
   * 
   * @param {Array<string>} data - An array of strings representing the paths to the images.
   * 
   * @returns {void} Nothing.
   */
  reloadPhotos(data) {
    this.previewPhotos.innerHTML = '';
    this.numbPhotos.textContent = data.length;
    data.forEach((image) => {
      this.previewPhotos.insertAdjacentHTML(
        'beforeend', 
        Templates.previewPhotoMarkup(
          image, 
          this.baseURL
        )
      )
    })
  }

  /**
   * Reloads the list of videos in the sidebar preview.
   * 
   * @param {Array<string>} data - An array of strings representing the paths to the video files.
   * 
   * @returns {void} Nothing.
   */
  reloadVideos(data) {
    this.previewVideos.innerHTML = '';
    this.numbVideo.textContent = data.length;
    data.forEach((video) => {
      this.previewVideos.insertAdjacentHTML(
        'beforeend', 
        Templates.previewVideoMarkup(
          video, 
          this.baseURL
        )
      )
    })
  }

  /**
   * Reloads the list of voice messages in the sidebar preview.
   * 
   * @param {Array<string>} data - An array of strings representing the paths to the voice files.
   * 
   * Clears the existing voice messages from the sidebar and populates it with
   * new voice messages using the provided data. Updates the count of voice
   * messages displayed in the sidebar.
   */
  reloadVoices(data) {
    this.previewVoices.innerHTML = '';
    this.numbVoice.textContent = data.length;
    data.forEach((voice) => {
      this.previewVoices.insertAdjacentHTML(
        'beforeend', 
        Templates.previewAudioMarkup(
          voice, 
          this.baseURL
        )
      )
    })
  }

  /**
   * Reloads the list of audio files in the sidebar preview.
   * 
   * @param {Array<string>} data - An array of strings representing the paths to the audio files.
   * 
   * Clears the existing audio files from the sidebar and populates it with
   * new audio files using the provided data. Updates the count of audio
   * messages displayed in the sidebar.
   */
  reloadAudios(data) {
    this.previewAudios.innerHTML = '';
    this.numbAudio.textContent = data.length;
    data.forEach((audio) => {
      this.previewAudios.insertAdjacentHTML(
        'beforeend', 
        Templates.previewAudioMarkup(
          audio, 
          this.baseURL
        )
      )
    })
  }

  /**
   * Reloads the list of link messages in the sidebar preview.
   * 
   * @param {Array<Object>} data - An array of objects representing the link messages.
   * 
   * Clears the existing link messages from the sidebar and populates it with
   * new link messages using the provided data. Updates the count of link
   * messages displayed in the sidebar.
   */
  reloadLinks(data) {
    this.previewLinks.innerHTML = '';
    this.numbLink.textContent = data.length;
    
    data.forEach((elem) => {
      this.previewLinks.insertAdjacentHTML(
        'beforeend', 
        Templates.previewLinkMarkup(elem)
      );
    })
  }

  /**
   * Assigns event handlers for the sidebar elements.
   * 
   * Assigns event handlers to the messages header buttons, close button,
   * back button, attachment menu, sidebar form, search button, search input,
   * and document.
   * 
   * The event handlers are used to toggle the visibility of the sidebar,
   * toggle the visibility of the attachment menu, toggle the visibility of
   * the search input, validate the search input, and update the list of
   * found messages.
   */
  asignEventHandlers() {
    this.messagesHeaderBtns.addEventListener('click', this.onMessagesHeaderBtnsClick);

    this.sidebarBtnClose.forEach((elem) => {
      elem.addEventListener('click', (evt) => {
        evt.target.closest('.app__sidebar').classList.add('d_none');
        this.mainInput.classList.remove('sb-active');
      })
    });

    this.backBtn.addEventListener('click', this.onBackBtnClick);
    this.attachmentMenu.addEventListener('click', this.onAttachmentMenuClick);
    this.sidebarForm.addEventListener('submit', (evt) => evt.preventDefault());

    this.sidebarSearchBtnsOn.addEventListener('click', () => {
      this.sidebarSearchInput.focus();
      this.sidebarSearchBtnsOn.classList.add('d_none');
      this.sidebarSearchBtnsOf.classList.remove('d_none');
    });

    this.sidebarSearchBtnsOf.addEventListener('click', () => {
      this.sidebarSearchInput.blur();
      this.sidebarSearchBtnsOn.classList.remove('d_none');
      this.sidebarSearchBtnsOf.classList.add('d_none');
      this.sidebarFoundMessages.innerHTML = '';
      this.sidebarSearchInput.value = '';
    });

    this.sidebarSearchInput.addEventListener('focus', () => {
      this.sidebarSearchBtnsOn.classList.add('d_none');
      this.sidebarSearchBtnsOf.classList.remove('d_none');
    });

    document.addEventListener('click', (evt) => {
      if (!evt.target.closest('.search__items') && !evt.target.closest('.sidebar__found-list')) {
        document.querySelectorAll('.search__button_on').forEach((elem) => {
          elem.className = 'search__button_on';
        })
        document.querySelectorAll('.search__button_of').forEach((elem) => {
          elem.className = 'search__button_of d_none';
        })
        document.querySelectorAll('.search__input').forEach((elem) => {
          elem.value = '';
        })
        this.sidebarFoundMessages.innerHTML = '';
      }
    });
    
    this.sidebarFoundMessages.addEventListener('click', this.onSidebarFoundMessagesClick)
    this.validateSearchInput();
  }

  /**
   * Handles click event on the sidebar found messages list.
   *
   * If the target element is a message from the found list, it saves the target
   * element to the class property and calls the scrollByElement method.
   *
   * @param {Event} evt - The event object.
   */
  onSidebarFoundMessagesClick(evt) {
    if (evt.target.closest('.found-list__found')) {
      this.target = evt.target.closest('.found-list__found');
      const { id } = evt.target.closest('.found-list__found').dataset;
      this.scrollByElement(id)
    }
  }

  /**
   * Scrolls the messages container by the element with the given ID.
   *
   * If the element is found in the messages container, it scrolls the element
   * into view and adds a temporary highlight. If the element is not found,
   * it scrolls to the top of the messages container and schedules a retry
   * in 100ms.
   *
   * @param {string} id - The ID of the element to scroll to.
   */
  scrollByElement(id) {
    if (this.messagesContainer.querySelector(`[data-id="${id}"]`)) {
      const foundMes = this.messagesContainer.querySelector(`[data-id="${id}"]`);
      foundMes.scrollIntoView(true);
      foundMes.style.backgroundColor = '#747faa77'
      
      setTimeout(() => {
        foundMes.style.backgroundColor = '';
      }, 2000);
      
    } else {
      this.messagesContainer.scrollTop = 0;
      setTimeout(() => this.scrollByElement(id), 100)
    }
  }

  /**
   * Handles click event on the messages header buttons.
   *
   * If the target element is the 'find' button, it toggles the visibility of
   * the search block and hides the information block if it is visible. If the
   * target element is the 'menu' button, it toggles the visibility of the
   * information block and hides the search block if it is visible.
   *
   * @param {Event} evt - The event object.
   */
  onMessagesHeaderBtnsClick(evt) {
    if (evt.target.closest('.btn-wrap').querySelector('.button.find')) {
      this.mainInput.classList.add('sb-active');
      this.sideBarSearch.classList.toggle('d_none');

      if (!this.sideBarInfo.classList.contains('d_none')) {
        this.sideBarInfo.classList.toggle('d_none');
      }
    }

    if (evt.target.closest('.btn-wrap').querySelector('.button.menu')) {
      this.mainInput.classList.add('sb-active');
      this.sideBarInfo.classList.toggle('d_none');

      if (!this.sideBarSearch.classList.contains('d_none')) {
        this.sideBarSearch.classList.toggle('d_none');
      }
    }
  }

  /**
   * Handles click event on the back button within the attachment preview.
   *
   * Hides the attachment preview menu and shows the attachment menu.
   */
  onBackBtnClick() {
    this.previewMenu.classList.add('d_none');
    this.attachmentMenu.classList.remove('d_none');
  }

  /**
   * Handles click events on the attachment menu.
   *
   * Based on the clicked attachment type (photo, video, audio, voice, link),
   * updates the class list to switch the view to the appropriate preview section 
   * and sets the preview title accordingly.
   *
   * @param {Event} evt - The click event object.
   */
  onAttachmentMenuClick(evt) {
    if (evt.target.closest('[data-name="photo"]')) {
      const { name } = evt.target.closest('[data-name="photo"]').dataset;
      this.changeClassList(name)
      this.previewTitle.textContent = 'Фото и GIF'
    }

    if (evt.target.closest('[data-name="video"]')) {
      const { name } = evt.target.closest('[data-name="video"]').dataset;
      this.changeClassList(name);
      this.previewTitle.textContent = 'Видео'
    }

    if (evt.target.closest('[data-name="audio"]')) {
      const { name } = evt.target.closest('[data-name="audio"]').dataset;
      this.changeClassList(name);
      this.previewTitle.textContent = 'Аудиофайлы';
    }

    if (evt.target.closest('[data-name="voice"]')) {
      const { name } = evt.target.closest('[data-name="voice"]').dataset;
      this.changeClassList(name);
      this.previewTitle.textContent = 'Голосовые сообщения';
    }
    
    if (evt.target.closest('[data-name="link"]')) {
      const { name } = evt.target.closest('[data-name="link"]').dataset;
      this.changeClassList(name);
      this.previewTitle.textContent = 'Ссылки';
    }
  }

  /**
   * Updates the visibility of preview sections in the sidebar.
   *
   * This function hides all preview sections and shows the section
   * corresponding to the specified name. It also toggles the visibility
   * of the preview and attachment menus.
   *
   * @param {string} name - The identifier for the section to be displayed.
   */
  changeClassList(name) {
    this.previewMenu.classList.remove('d_none');
    this.attachmentMenu.classList.add('d_none');

    this.previewMenu.querySelectorAll('ul').forEach((elem) => {
      elem.classList.add('visually_hidden');
    });

    document.querySelector(`[data-id="${name}"]`).classList.remove('visually_hidden');
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
}

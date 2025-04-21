import Templates from "./Templates";

export default class EmojiHandler {
  /**
   * Initializes the EmojiHandler class.
   *
   * @param {HTMLElement} container - The container element where the emoji handler operates.
   * @param {string} url - The base URL for network requests.
   *
   * Sets up DOM references for emoji list, emoji button, main input, and messages content.
   * Binds event handlers for emoji list and button clicks.
   * Adds event listeners for emoji interactions.
   */
  constructor(container, url) {
    this.container = container;
    this.baseURL = url;
    
    this.emojiList = this.container.querySelector('.messages__emoji');
    this.emojiBtn = this.container.querySelector('.button.smile').closest('.btn-wrap');
    this.mainInput = this.container.querySelector('.footer-controls__input');
    this.messagesContent = this.container.querySelector('.messages__content');

    this.onEmojiListClick = this.onEmojiListClick.bind(this);
    this.onEmojiBtnClick = this.onEmojiBtnClick.bind(this);

    this.emojiList.addEventListener('click', this.onEmojiListClick);
    this.emojiBtn.addEventListener('click', this.onEmojiBtnClick);
  }

  /**
   * Handles emoji list item clicks.
   *
   * @param {MouseEvent} evt - The event object from the emoji list item click.
   *
   * Adds the clicked emoji to the main input field.
   */
  onEmojiListClick(evt) {
    if (evt.target.className === 'messages-emoji__item') {
      const emoji = evt.target.textContent;
      this.mainInput.innerHTML += emoji;
    }
  }

  /**
   * Handles emoji button clicks.
   *
   * @async
   *
   * Fetches emoji data from the server if the emoji list is empty.
   * If the request is successful, draws the emoji list and toggles the emoji button.
   * Also toggles the messages content to an "emoji" class.
   * Scrolls the messages content to the bottom.
   */
  async onEmojiBtnClick() {
    if (this.emojiList.innerHTML === '') {
      const request = await fetch(`${this.baseURL}/emoji`);
      this.emojiResult = await request.json();
    }
    
    if (this.emojiResult.success) {
      this.drawEmoji(this.emojiResult.data);
      this.emojiList.classList.toggle('d_none');
      this.messagesContent.classList.toggle('emoji');
      this.scrollToBottom();
    }
  }

  /**
   * Renders the list of emojis.
   *
   * @param {Array} data - An array containing emoji data to be displayed.
   *
   * Clears the existing emojis from the emoji list and populates it with new emojis
   * using the provided data. Each emoji is inserted as a list item in the emoji list.
   */
  drawEmoji(data) {
    this.emojiList.innerHTML = '';
    data.forEach((emoji) => {
      this.emojiList.insertAdjacentHTML('beforeend', Templates.emojiMarkup(emoji));
    })
  }

  /**
   * Scrolls the messages content to the bottom.
   *
   * Sets the scrollTop property of the messages content to its scrollHeight property.
   * This is used to scroll the user to the bottom of the messages content when the
   * emoji list is opened.
   */
  scrollToBottom() {
    this.messagesContent.scrollTop = this.messagesContent.scrollHeight;
  }
}

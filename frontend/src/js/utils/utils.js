export default class Utils {
  /**
   * Check if given text contains link(s).
   *
   * @param {string} value
   * @return {boolean} true if text contains link(s), false otherwise
   */
  static checkLink(value) {
    return value.match(/https?:\/\/[^\s]+/gm) !== null;
  }

  /**
   * Replaces all URLs in the given text with links.
   *
   * @param {string} value
   * @return {string} The given text with all URLs replaced with links.
   */
  static getLink(value) {
    return value.replace(/https?:\/\/[^\s]+/gm, (link) => `<a href='${link}' target='_blank'>${link}</a>`);
  }

  /**
   * Replaces all newlines in the given text with <br> tags
   * and wraps the text in a .multiline-message div if it is a multiline text.
   * @param {string} text
   * @return {string} The given text with newlines replaced with <br> tags
   *                  and wrapped in a .multiline-message div if it is a multiline text.
   */
  static formatMessageText(text) {
    if (text.startsWith('@chaos:')) {
      return text;
    }
    let formatted = text.replace(/\n/g, '<br>');
    if (formatted.includes('<br>')) {
      formatted = `<div class="multiline-message">${formatted}</div>`;
    }
    return formatted;
  }
}

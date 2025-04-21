const { v4: uuidv4 } = require('uuid');
const server = require('../server')
const fs = require('fs');
const path = require('path');

module.exports = class DataBase {
  /**
   * Class constructor.
   * Initializes data base with demo data.
   */
  constructor() {
    this.users = [
      {
        id: '22c355f8-b537-4e82-b267-1af2940d0fde',
        avatar: 'demo_avatar.png',
        login: 'demo',
        online: false,
        password: 'demo',
        dialogues: [],
        created: '14:59 10.11.2022',
      },
    ];
    
    this.clients = new Map();

    this.groups = [
      {
        id: '11111111-1111-1111-1111-111111111111',
        active: true,
        avatar: 'svoi.jpg',
        name: 'Общий чат',
        messages: [
          {
            time: DataBase.getDate(),
            mesID: uuidv4(),
            message: 'message 1',
            encryption: false,
            userName: 'demo',
            userID: '22c355f8-b537-4e82-b267-1af2940d0fde',
          },
          {
            time: DataBase.getDate(),
            mesID: uuidv4(),
            message: 'message 2',
            encryption: false,
            userName: 'demo',
            userID: '22c355f8-b537-4e82-b267-1af2940d0fde',
          },
          {
            time: DataBase.getDate(),
            mesID: uuidv4(),
            message: 'message 3',
            encryption: false,
            userName: 'demo',
            userID: '22c355f8-b537-4e82-b267-1af2940d0fde',
          },
          {
            time: DataBase.getDate(),
            mesID: uuidv4(),
            message: 'message 4',
            encryption: false,
            userName: 'demo',
            userID: '22c355f8-b537-4e82-b267-1af2940d0fde',
          },
          {
            time: DataBase.getDate(),
            mesID: uuidv4(),
            message: 'message 5',
            encryption: false,
            userName: 'demo',
            userID: '22c355f8-b537-4e82-b267-1af2940d0fde',
          },
          {
            time: DataBase.getDate(),
            mesID: uuidv4(),
            message: 'message 6',
            encryption: false,
            userName: 'demo',
            userID: '22c355f8-b537-4e82-b267-1af2940d0fde',
          },
          {
            time: DataBase.getDate(),
            mesID: uuidv4(),
            message: 'message 7',
            encryption: false,
            userName: 'demo',
            userID: '22c355f8-b537-4e82-b267-1af2940d0fde',
          },
          {
            time: DataBase.getDate(),
            mesID: uuidv4(),
            message: 'message 8',
            encryption: false,
            userName: 'demo',
            userID: '22c355f8-b537-4e82-b267-1af2940d0fde',
          },
          {
            time: DataBase.getDate(),
            mesID: uuidv4(),
            message: 'message 9',
            encryption: false,
            userName: 'demo',
            userID: '22c355f8-b537-4e82-b267-1af2940d0fde',
          },
          {
            time: DataBase.getDate(),
            mesID: uuidv4(),
            message: 'message 10',
            encryption: false,
            userName: 'demo',
            userID: '22c355f8-b537-4e82-b267-1af2940d0fde',
          },
          {
            time: DataBase.getDate(),
            mesID: uuidv4(),
            message: 'message 11',
            encryption: false,
            userName: 'demo',
            userID: '22c355f8-b537-4e82-b267-1af2940d0fde',
          },
          {
            time: DataBase.getDate(),
            mesID: uuidv4(),
            message: 'message 12',
            encryption: false,
            userName: 'demo',
            userID: '22c355f8-b537-4e82-b267-1af2940d0fde',
          },
          {
            time: DataBase.getDate(),
            mesID: uuidv4(),
            message: 'message 13',
            encryption: false,
            userName: 'demo',
            userID: '22c355f8-b537-4e82-b267-1af2940d0fde',
          },
          {
            time: DataBase.getDate(),
            mesID: uuidv4(),
            message: 'message 14',
            encryption: false,
            userName: 'demo',
            userID: '22c355f8-b537-4e82-b267-1af2940d0fde',
          },
          {
            time: DataBase.getDate(),
            mesID: uuidv4(),
            message: 'message 15',
            encryption: false,
            userName: 'demo',
            userID: '22c355f8-b537-4e82-b267-1af2940d0fde',
          },
          {
            time: DataBase.getDate(),
            mesID: uuidv4(),
            message: 'message 16',
            encryption: false,
            userName: 'demo',
            userID: '22c355f8-b537-4e82-b267-1af2940d0fde',
          },
          {
            time: DataBase.getDate(),
            mesID: uuidv4(),
            message: 'message 17',
            encryption: false,
            userName: 'demo',
            userID: '22c355f8-b537-4e82-b267-1af2940d0fde',
          },
          {
            time: DataBase.getDate(),
            mesID: uuidv4(),
            message: 'message 18',
            encryption: false,
            userName: 'demo',
            userID: '22c355f8-b537-4e82-b267-1af2940d0fde',
          },
          {
            time: DataBase.getDate(),
            mesID: uuidv4(),
            message: 'message 19',
            encryption: false,
            userName: 'demo',
            userID: '22c355f8-b537-4e82-b267-1af2940d0fde',
          },
          {
            time: DataBase.getDate(),
            mesID: uuidv4(),
            message: 'message 20',
            encryption: false,
            userName: 'demo',
            userID: '22c355f8-b537-4e82-b267-1af2940d0fde',
          },
          {
            time: DataBase.getDate(),
            mesID: uuidv4(),
            message: 'message 21',
            encryption: false,
            userName: 'demo',
            userID: '22c355f8-b537-4e82-b267-1af2940d0fde',
          },
          {
            time: DataBase.getDate(),
            mesID: uuidv4(),
            message: 'message 22',
            encryption: false,
            userName: 'demo',
            userID: '22c355f8-b537-4e82-b267-1af2940d0fde',
          },
          {
            time: DataBase.getDate(),
            mesID: uuidv4(),
            message: 'message 23 😎 😎 😎 😾',
            encryption: false,
            userName: 'demo',
            userID: '22c355f8-b537-4e82-b267-1af2940d0fde',
          },
          {
            time: DataBase.getDate(),
            mesID: uuidv4(),
            message: 'message 24 😺 😸 😹 😻',
            encryption: false,
            userName: 'demo',
            userID: '22c355f8-b537-4e82-b267-1af2940d0fde',
          },
          {
            time: DataBase.getDate(),
            mesID: '09f14c6b-d6f0-4f7c-a9e0-29b596b6a759',
            message: 'message 25 😼 😽 🙀 😿',
            encryption: false,
            userName: 'demo',
            userID: '22c355f8-b537-4e82-b267-1af2940d0fde',
          },
          {
            time: DataBase.getDate(),
            mesID: uuidv4(),
            message: 'message 26 <br> https://www.google.com/',
            encryption: false,
            userName: 'demo',
            userID: '22c355f8-b537-4e82-b267-1af2940d0fde',
          },
          {
            time: DataBase.getDate(),
            mesID: uuidv4(),
            message: 'message 27 <br> https://www.google.com/',
            encryption: false,
            userName: 'demo',
            userID: '22c355f8-b537-4e82-b267-1af2940d0fde',
          },
          {
            time: '17:12 14.01.2022',
            mesID: 'd337259b-b6b3-4b01-be2d-5e0035a53111',
            message: '',
            encryption: false,
            userName: 'demo',
            userID: '22c355f8-b537-4e82-b267-1af2940d0fde',
            file: {
              type: 'video/mp4',
              name: 'a20b42b9-d32e-46ed-8c39-a981fcc58e3f.mp4'
            }
          },
          {
            time: '17:17 14.01.2022',
            mesID: '5c8202ec-09af-41b3-9a4e-875f89f07a26',
            message: '',
            encryption: false,
            userName: 'demo',
            userID: '22c355f8-b537-4e82-b267-1af2940d0fde',
            file: {
              type: 'audio/mpeg',
              name: '7e21749c-23e7-40d4-8ccc-976caa773f19.mp3'
            }
          },
          {
            time: '17:29 14.01.2022',
            mesID: 'c9426414-e579-4ee0-a796-a47489e5a600',
            message: '',
            encryption: false,
            userName: 'demo',
            userID: '22c355f8-b537-4e82-b267-1af2940d0fde',
            file: {
              type: 'audio/webm;codecs=opus',
              name: 'dca14845-f9eb-4f55-8708-bfc692ffef85'
            }
          },
          {
            time: '17:38 14.01.2022',
            mesID: '2a072aea-796b-4ea0-a4e9-9d6d47cbdb81',
            message: 'Never gonna give you up, never gonna let you down <br> Never gonna run around and desert you <br> Never gonna make you cry, never gonna say goodbye <br> Never gonna tell a lie and hurt you 🤘🤟🤘🤟🤘🤟',
            encryption: false,
            userName: 'demo',
            userID: '22c355f8-b537-4e82-b267-1af2940d0fde',
            file: {
              type: 'image/jpeg',
              name: '194508cb-de8d-40f9-b064-e88709dde509.jpg'
            }
          },
          {
            time: DataBase.getDate(),
            mesID: uuidv4(),
            message: '```console.log("Hello, World!");```',
            encryption: false,
            userName: 'demo',
            userID: '22c355f8-b537-4e82-b267-1af2940d0fde',
          },
        ],
      },
    ]

    this.chunkLength = 10;
    this.fileName = null;
    this.emoji = `😀 😁 😂 🤣 😃 😄 😅 😆 😉 😊 😋 😎 😍 😘 🥰 😗 😜 😙 😚 🙂 🤗 🤩 🤔 🤨 😐 😑 😶 🙄 😏 😣 😥 😮 🤐 😯 😪 😫 😴 😌 😛 😝 🤤 😒 😓 😔 😕 🙃 🤑 😲 ☹️ 🙁 😖 😞 😟 😤 😢 😭 😦 😧 😨 😩 🤯 😬 😰 😱 🥵 🥶 😳 🤪 😵 😡 😠 🤬 😷 🤒 🤕 🤢 🤮 🤧 😇 🤠 🤡 🥳 🥴 🥺 🤥 🤫 🤭 🧐 🤓 😈 👹 👺 💀 👻 👽 🤖 💩 😺 😸 😹 😻 😼 😽 🙀 😿 😾 👋 🤚 🖐 ✋ 🖖 👌 🤌 🤏 ✌️ 🤞 🤟 🤘 🤙 👈 👉 👆 🖕 👇 ☝️ 👍 👎 ✊ 👊 🤛 🤜 👏 🙌 👐 🤲 🤝 🙏 ✍️ 💅 🤳 💪 🦾 🦵 🦿 🦶 👣 👂 🦻 👃 🫀 🫁 🧠 🦷 🦴 👀 👁 👅 👄 💋 🩸`.split(' ');
  }

  /**
   * Gets the password for the given message id
   * @param {String} dialog - dialog type
   * @param {String} dialogID - dialog id
   * @param {String} mesID - message id
   * @returns {String} password for the given message id
   */
  getMesPassword(dialog, dialogID, mesID) {
    const { messages } = this.getDialog(dialogID, dialog);
    if (messages.some((mes) => mes.mesID === mesID)) {
      return messages.find((mes) => mes.mesID === mesID).password;
    }
  }

  /**
   * Checks if the given value contains at least one link
   * @param {String} value - value to check
   * @returns {Boolean} true if the value contains at least one link, false otherwise
   */
  checkLink(value) {
    if (value.match(/https?:\/\/[^\s]+/gm) !== null) {
      return value.match(/https?:\/\/[^\s]+/gm) !== null;
    }
  }

  /**
   * Filters messages in a group chat by the given value
   * @param {{dialog: String, dialogID: String, value: String}} data - object with dialog type, dialog id, and value to filter by
   * @returns {Array<Object>} array of filtered messages
   */
  filterMessages(data) {
    if (data.dialog === 'group') {
      const { messages } = this.getDialog(data.dialogID, data.dialog);
      return messages
        .filter((mes) => typeof mes.message !== 'object')
        .filter((mes) => mes.message.match(data.value));
    }
  }

  /**
   * Gets attachments in a group chat
   * @param {String} dialog - dialog type
   * @param {String} dialogID - dialog id
   * @returns {Object} object with arrays of images, video, voice, audio, and links in the group chat
   */
  getAttachments(dialog, dialogID) {
    if (dialog === 'group') {
      const { messages } = this.getDialog(dialogID, dialog);
      const fileMes = messages.filter((mes) => mes.file);
      const links = messages
        .filter((mes) => typeof mes.message !== 'object')
        .filter((mes) => this.checkLink(mes.message))
      const images = fileMes
        .filter((mes) => mes.file.type.startsWith('image'))
        .map((mes) => mes.file.name)
      const video = fileMes
        .filter((mes) => mes.file.type.startsWith('video'))
        .map((mes) => mes.file.name)
      const voice = fileMes
        .filter((mes) => mes.file.type === 'audio/webm;codecs=opus')
        .map((mes) => mes.file.name)
      const audio = fileMes
        .filter((mes) => mes.file.type.startsWith('audio') && mes.file.type !== 'audio/webm;codecs=opus')
        .map((mes) => mes.file.name)
      return { images, video, voice, audio, links };
    }
  }

  /**
   * Sets the online status for the given user id
   * @param {String} id - user id
   */
  setOnlineStatus(id) {
    this.users.find((user) => user.id === id).online = true;
  }

  /**
   * Sets the offline status for the given user id
   * @param {String} id - user id
   */
  setOflineStatus(id) {
    this.users.find((user) => user.id === id).online = false;
  }

  /**
   * Adds a new user to the database
   * @param {Object} data - object with user data {login: String, password: String}
   * @param {String} [avatar=null] - avatar filename
   */
  addUser(data, avatar = null) {
    this.users.push({
      id: uuidv4(),
      avatar: avatar,
      login: data.login,
      online: false,
      password: data.password,
      dialogues: [],
      created: DataBase.getDate(),
    });
  }

  /**
   * Returns the latest messages of a given dialog
   * @param {String} dialog - dialog type
   * @param {String} dialogID - dialog id
   * @returns {Array<Object>} array of latest messages
   */
  getLatestMessages(dialog, dialogID) {
    if (dialog === 'group') {
      const group = this.getDialog(dialogID, dialog);
      return group.messages.slice(group.messages.length - this.chunkLength, group.messages.length);
    }
  }

  /**
   * Splits an array into chunks of length this.chunkLength
   * @param {Array} array - array to split
   * @returns {Array<Array>} array of arrays
   */
  splitData(array) {
    const splicedArr = [];
    for (let i = 0; i <= array.length - 1; i += 1) {
      splicedArr.push(array[i]);
    }
    const splitArr = [];
    while (splicedArr.length) {
      splitArr.push(splicedArr.splice(splicedArr.length - this.chunkLength, splicedArr.length));
    }
    return splitArr;
  }

  /**
   * Adds a new text message to the database
   * @param {String} userID - id of the user sending the message
   * @param {String} dialog - dialog type
   * @param {String} dialogID - dialog id
   * @param {String} message - message text
   * @param {Boolean} encryption - should the message be encrypted
   * @param {String} [password=null] - password for encryption
   */
  addTextMessage(userID, dialog, dialogID, message, encryption, password) {
    const user = this.users.find((user) => user.id === userID);
    const messageObj = {
      time: DataBase.getDate(),
      mesID: uuidv4(),
      message,
      userName: user.login,
      userID,
      encryption,
      password,
    }
    if (dialog === 'group') {
      const group = this.groups.find((group) => group.id === dialogID);
      group.messages.push(messageObj);
    }
    if (dialog === 'personal') {
      if (user.dialogues.some((dialog) => dialog.id === dialogID)) {
        user.dialogues.find((dialog) => dialog.id === dialogID).messages.push(messageObj);
      } else {
        this.addDialog(user.dialogues, user.id);
        user.dialogues.find((dialog) => dialog.id === dialogID).messages.push(messageObj);
      }
    }
  }

  /**
   * Adds a new dialog to the given list of dialogues for a user
   * @param {Array<Object>} dialogues - array of existing dialogues
   * @param {String} userID - user id to associate with the new dialog
   */
  addDialog(dialogues, userID) {
    const dialog = {
      id: userID,
      messages: [],
    }
    dialogues.push(dialog);
  }

  /**
   * Adds a new file message to the database
   * @param {File} file - file object
   * @param {{dialog: String, dialogID: String, user: String, description: String, encryption: String, password: String}} data - object with data for the new message
   */
  addFileMessage(file, data) {
    if (data.dialog === 'group') {
      const group = this.getDialog(data.dialogID, data.dialog);
      const user = this.findUser(data.user);
      const dataEncrypt = JSON.parse(data.encryption)
      const messageObj = {
        time: DataBase.getDate(),
        mesID: uuidv4(),
        message: data.description,
        userName: user.login,
        userID: user.id,
        encryption: dataEncrypt.encrypt,
        password: data.password,
        file: {
          type: file.type,
          name: this.fileName,
          originalName: file.originalName || file.name
        }
      }
      group.messages.push(messageObj);
    }
  }

  /**
   * Finds a dialog in the database by its id
   * @param {String} dialogID - dialog id
   * @param {String} dialog - dialog type
   * @returns {Object} dialog object
   */
  getDialog(dialogID, dialog) {
    if (dialog === 'group') {
      return this.groups.find((group) => group.id === dialogID);
    }
  }

  /**
   * Saves a file to the public folder and assigns it a unique id
   * @param {Object} data - object with file data
   * @param {String} data.name - original name of the file
   * @param {String} data.path - path to the file
   */
  saveFile(data) {
    const id = uuidv4();
    const extension = data.name.slice(data.name.lastIndexOf('.'), data.name.length);
    this.fileName = id + extension;
    const url = path.join(server.public, this.fileName);
    const file = fs.readFileSync(data.path, 'binary');
    fs.writeFileSync(url, file, 'binary');
    data.originalName = data.name;
  }

  /**
   * Checks if a user exists in the database with the given login and password
   * @param {Object} data - object with {login, password} properties
   * @returns {Boolean} true if the user exists
   */
  checkUser(data) {
    return this.users
      .some((user) => user.login === data.login
        && user.password === data.password);
  }

/**
 * Finds a user in the database by their id
 * @param {String} id - user id
 * @returns {Object|Boolean} user object if found, otherwise false
 */
  findUser(id) {
    if (this.users.some((user) => user.id === id)) {
      return this.users.find((user) => user.id === id);
    }
    return false;
  }

/**
 * Retrieves a user from the database by their login and password
 * @param {Object} data - object with user credentials {login: String, password: String}
 * @returns {Object|undefined} user object if found, otherwise undefined
 */
  getUser(data) {
    return this.users
      .find((user) => user.login === data.login &&
        user.password === data.password);
  }

  /**
   * Retrieves the current date in the format "DD MMM YYYY HH:mm" in the Europe/Moscow timezone
   * @returns {String} current date and time
   */
  static getDate() {
    const formatter = new Intl.DateTimeFormat("ru", {
      timeZone: "Europe/Moscow",
      hour: "numeric",
      minute: "numeric",
      day: "numeric",
      month: "numeric",
      year: "numeric",
    });
    return ((str) => {
      const temp = str.split(' ');
      const date = [temp[1], temp[0].slice(0, -1)].join(' ');
      return date;
    })(formatter.format(new Date()));
  }
}

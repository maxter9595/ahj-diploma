const server = require('../server')

/**
 * Handles WebSocket messages and performs actions based on the message type.
 * 
 * @param {Object} msg - The message object received from a WebSocket connection.
 * @param {Object} msg.data - Data related to the message.
 * @param {String} msg.data.dialogID - ID of the dialog associated with the message.
 * @param {String} msg.data.dialog - Type of dialog (e.g., group, personal).
 * @param {String} msg.data.user - User ID related to online status.
 * @param {String} msg.data.message - Text message to be added to the dialog.
 * @param {Boolean} msg.data.encryption - Indicates if the message should be encrypted.
 * @param {String} msg.data.password - Password for encrypted messages.
 * @param {String} msg.data.currentChunk - The current chunk of messages requested.
 * @param {String} msg.type - Type of the message (e.g., 'ping', 'messages', 'text_message', 'more_messages', 'interval').
 * 
 * @returns {String} JSON stringified response based on the message type, 
 * containing information such as total messages, chat name, user list, 
 * and messages in the chat.
 */
module.exports = function wsMessageHandler(msg) {
  if (msg.data) {
    const { messages } = server.db.getDialog(msg.data.dialogID, msg.data.dialog);
    const { name } = server.db.getDialog(msg.data.dialogID, msg.data.dialog);

    switch (msg.type) {
      case 'ping':
        server.db.setOnlineStatus(msg.data.user);
        return JSON.stringify({
          totalMessages: messages.length,
          type: 'pong',
          users: server.db.users,
          chatName: name,
          messages: server.db.splitData(messages)[+msg.data.currentChunk],
        });

      case 'messages':
        return JSON.stringify({
          type: 'text_message',
          data: {
            totalMessages: messages.length,
            chatName: name,
            messages: server.db.getLatestMessages(msg.data.dialog, msg.data.dialogID),
          }
        });

      case 'text_message':
        server.db.addTextMessage(
          msg.data.user,
          msg.data.dialog,
          msg.data.dialogID,
          msg.data.message,
          msg.data.encryption,
          msg.data.password,
        )

        return JSON.stringify({
          type: 'text_message',
          data: {
            totalMessages: messages.length,
            chatName: name,
            messages: server.db.getLatestMessages(msg.data.dialog, msg.data.dialogID),
          }
        });

      case 'more_messages':
        return JSON.stringify({
          type: 'more_messages',
          data: {
            totalMessages: messages.length,
            chatName: name,
            messages: server.db.splitData(messages)[+msg.data.currentChunk],
          }
        });

      default:
        return JSON.stringify({
          type: 'unknown'
        });
    }

  } else {
    if (msg.type === 'interval') {
      return JSON.stringify({
        type: 'interval'
      })
    }
  }
}

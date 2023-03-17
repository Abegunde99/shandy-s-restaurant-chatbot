const moment = require('moment');
const time = moment().format('h:mm a');

const formatMessage = (message) => {
  return {
    message,
    time,
  };
};

module.exports = formatMessage;
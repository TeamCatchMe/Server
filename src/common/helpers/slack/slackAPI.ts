import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const sendMessageToSlack = (type: string, message: string) => {
  try {
    if (process.env.NODE_ENV === 'production') {
      axios
        .post(process.env.SLACK_ERROR, { text: message })
        .then()
        .catch((e) => {
          throw e;
        });
    }
  } catch (e) {
    console.error(e);
  }
};

export default {
  sendMessageToSlack,
};

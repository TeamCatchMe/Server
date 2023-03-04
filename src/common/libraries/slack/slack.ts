import dayjs from 'dayjs';
import slackAPI from './slackAPI';

const slackForSignUp = () => {
  const dateToday: string = dayjs().format('YYYY-MM-DD HH:mm:ss').toString();
  const slackMessage = `-- `;

  slackAPI.sendMessageToSlack('MONIT', slackMessage);
};

export { slackForSignUp };

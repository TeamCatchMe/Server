const V1 = 'v1';

const AUTH_ROOT = 'auth';
const USER_ROOT = 'user';
const ACTIVITY_ROOT = 'activity';

export const routesV1 = {
  version: V1,
  auth: {
    root: AUTH_ROOT,
    signin: `/${AUTH_ROOT}/login`,
    signup: `/${AUTH_ROOT}/signup`,
    token: `/${AUTH_ROOT}/token`,
    withdraw: `/${AUTH_ROOT}`,
  },

  user: {
    root: USER_ROOT,
    nickname: `/${USER_ROOT}/nickname`,
    nickname_check: `/${USER_ROOT}/nickname`,
  },

  activity: {
    root: ACTIVITY_ROOT,
    calender: `/${ACTIVITY_ROOT}/`,
    specificDate: `/${ACTIVITY_ROOT}/:date`,
    create: `/${ACTIVITY_ROOT}/`,
    update: `/${ACTIVITY_ROOT}/:activity_id`,
    delete: `/${ACTIVITY_ROOT}/:activity_id`,
  },
} as const;

const V1 = 'v1';

const AUTH_ROOT = 'auth';
const USER_ROOT = 'user';
const ACTIVITY_ROOT = 'activity';
const CHARACTER_ROOT = 'character';

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
    character: `/${ACTIVITY_ROOT}/character/:character_id`,
    create: `/${ACTIVITY_ROOT}/`,
    update: `/${ACTIVITY_ROOT}/:activity_id`,
    delete: `/${ACTIVITY_ROOT}/:activity_id`,
  },

  character: {
    root: CHARACTER_ROOT,
    create: `/${CHARACTER_ROOT}/`,
    update: `/${CHARACTER_ROOT}/`,
    main: `/${CHARACTER_ROOT}/`,
    block: `/${CHARACTER_ROOT}/block`,
    looking: `/${CHARACTER_ROOT}/looking`,
    list: `/${CHARACTER_ROOT}/list`,
    detail: `/${CHARACTER_ROOT}/detail/:character_id`,
    calender: `/${CHARACTER_ROOT}/calender`,
    specificDate: `/${CHARACTER_ROOT}/:date`,
    delete: `/${CHARACTER_ROOT}/:character_id`,
  },
} as const;

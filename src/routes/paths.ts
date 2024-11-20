// ----------------------------------------------------------------------

function path(root: string, sublink?: string) {
  return `${root}${sublink || ''}`;
}

const ROOTS_AUTH = '/auth';
const ROOTS_DASHBOARD = '/dashboard';

// ----------------------------------------------------------------------

export const PATH_AUTH = {
  root: ROOTS_AUTH,
  login: path(ROOTS_AUTH, '/login'),
  register: path(ROOTS_AUTH, '/register'),
  loginUnprotected: path(ROOTS_AUTH, '/login-unprotected'),
  registerUnprotected: path(ROOTS_AUTH, '/register-unprotected'),
  verify: path(ROOTS_AUTH, '/verify'),
  resetPassword: path(ROOTS_AUTH, '/reset-password'),
  newPassword: path(ROOTS_AUTH, '/new-password'),
};

export const PATH_PAGE = {
  comingSoon: '/coming-soon',
  maintenance: '/maintenance',

  about: '/about-us',
  contact: '/contact-us',

  page403: '/403',
  page404: '/404',
  page500: '/500',
};

export const PATH_DASHBOARD = {
  root: ROOTS_DASHBOARD,

  permissionDenied: path('/permission-denied'),
  // dashboard: {
  //   root: path('/dashboard'),
  // },
  user: {
    root: path('/user'),
    new: path('/user/new'),
    create:(id?:string)=> path(`/user/user-create/${id}`),
    // create: path(`/user/user-create`),

    list: path('/user/list'),
    cards: path('/user/cards'),
    profile: path('/user/profile'),
    account: path('/user/account'),
    edit: (name: string) => path(`/user/${name}/edit`),
  },
  wells: {
    list: path('/well/list'),
  },
  pits: {
    list: path('/pit/list'),
  },
  crops: {
    list: path('/crop/list'),
  },
  equipments: {
    list: path('/equipment/list'),
  },
};

export const PATH_DOCS = 'https://docs-minimals.vercel.app/introduction';

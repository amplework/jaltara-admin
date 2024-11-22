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

  sevek: {
    root: path('/sevek'),
    new: path('/sevek/new'),
    list: path('/sevek/list'),
    cards: path('/sevek/cards'),
    create: path(`/sevek/sevek-create`),
    edit:(id?:string)=> path(`/sevek/sevek-edit/${id}`),
    profile: path('/sevek/profile'),
    account: path('/sevek/account'),
    // edit: (name: string) => path(ROOTS_DASHBOARD, `/sevek/${name}/edit`),
  },
  farmers: {
    list: path('/farmer/list'),
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

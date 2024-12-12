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

  sevak: {
    root: path('/sevak'),
    new: path('/sevak/new'),
    list: path('/sevak/list'),
    cards: path('/sevak/cards'),
    create: path(`/sevak/sevak-create`),
    edit: (id?: string) => path(`/sevak/sevak-edit/${id}`),
    profile: path('/sevak/profile'),
    account: path('/sevak/account'),
    details: (id: string) => path(`/sevak/details/${id}`),
    // edit: (name: string) => path(ROOTS_DASHBOARD, `/sevak/${name}/edit`),
  },
  farmers: {
    list: path('/farmers/list'),
    new: path('/farmers/create'),
    edit: (id?: string) => path(`/farmers/edit/${id}`),
    details: (id: string) => path(`/farmers/details/${id}`),
  },
  pits: {
    list: path('/pits/list'),
    details: (id: string) => path(`/pits/details/${id}`),
  },
  wells: {
    list: path('/wells/list'),
    details: (id: string) => path(`/wells/details/${id}`),
  },
  crops: {
    list: path('/crop/list'),
  },
  location: {
    list: path('/location/list'),
  },
  equipments: {
    list: path('/equipment/list'),
    create: path('/equipment/create'),
    edit: (id: string) => path(`/equipment/edit/${id}`),
    logs: (id: string) => path(`/equipment/logs/${id}`),
  },
  masterdata: {
    root: path('/masterdata'),
    cropList: path('/masterdata/croplist'),
    create: path('/masterdata/create'),
    edit: (id: string) => path(`/masterdata/edit/${id}`),
    challangesList: path('/masterdata/challanges'),
    tutorial:path('/masterdata/tutorial'),
    tutorialCreate:path('/masterdata/tutorial-create'),
    tutorialEdit:(id:string)=>path(`/masterdata/tutorial-edit/${id}`),
    tutorialDetails:(id:string)=>path(`/masterdata/tutorial-details/${id}`)
  },

};

export const PATH_DOCS = 'https://docs-minimals.vercel.app/introduction';

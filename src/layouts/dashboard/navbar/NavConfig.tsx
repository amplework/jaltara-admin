// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// components
import Label from '../../../components/Label';
import Iconify from '../../../components/Iconify';
import SvgIconStyle from '../../../components/SvgIconStyle';

// ----------------------------------------------------------------------

const getIcon = (name: string) => (
  <SvgIconStyle src={name} sx={{ width: 1, height: 1 }} />
  // <Iconify icon={''} sx={{ width: 1, height: 1 }}/>
);

const ICONS = {
  sevek: getIcon('fa-solid:user-friends'),
  farmer: getIcon('game-icons:farmer'),
  pit: getIcon('tabler:shovel-pitchforks'),
  well: getIcon('game-icons:well'),
  location: getIcon('subway:location'),
  tools: getIcon('vscode-icons:file-type-light-rust-toolchain'),
  masterdata: getIcon('eos-icons:big-data'),
};

const navConfig = [
  {
    subheader: '',
    items: [
      {
        title: 'sevek',
        path: PATH_DASHBOARD.sevek.list,
        icon: ICONS.sevek,
      },
      {
        title: 'farmers',
        path: PATH_DASHBOARD.farmers.list,
        icon: ICONS.farmer,
      },
      {
        title: 'pits',
        path: PATH_DASHBOARD.pits.list,
        icon: ICONS.pit,
      },
      {
        title: 'wells',
        path: PATH_DASHBOARD.wells.list,
        icon: ICONS.well,
      },
      {
        title: 'location',
        path: PATH_DASHBOARD.location.list,
        icon: ICONS.location,
      },
      {
        title: 'equipment',
        path: PATH_DASHBOARD.equipments.list,
        icon: ICONS.tools,
      },
      {
        title: 'master Data',
        path: PATH_DASHBOARD.masterdata.root,
        icon: ICONS.masterdata,
        children: [
          { title: 'crops', path:PATH_DASHBOARD.masterdata.cropList},
          { title: 'farmer challanges', path: PATH_DASHBOARD.masterdata.challangesList },
        ],
      },
    ],
  },
];

export default navConfig;

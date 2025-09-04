import { INavData } from '@coreui/angular-pro';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const navItems: any = [
  {
    menus: [
      {
        name: 'Status Cuadratura',
        url: 'status-cuadratura',
        iconComponent: { name: 'cil-list' },
      },
      {
        name: 'Liquidaciones',
        url: '',
        iconComponent: { name: 'cil-list' },
        children: [
          {
            name: 'Crédito',
            url: '/liquidacion/credito',
          },
          {
            name: 'Débito',
            url: '/liquidacion/debito',
          },
        ],
      },
      {
        name: 'Cartola',
        url: '',
        iconComponent: { name: 'cil-list' },
        children: [
          {
            name: 'Crédito',
            url: 'cartola-tbk/credito',
          },
          {
            name: 'Débito',
            url: 'cartola-tbk/debito',
          },
        ],
      },
    ],
  },
];

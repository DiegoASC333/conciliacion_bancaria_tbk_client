import { INavData } from '@coreui/angular-pro';

export const navItems: any = [
  {
    role: 'DAFE',
    menus: [
      {
        name: 'Status Cuadratura',
        url: 'status-cuadratura',
        iconComponent: { name: 'cil-list' },
      },
    ],
  },
  {
    role: 'TESORERIA',
    menus: [
      {
        name: 'Liquidaciones',
        url: 'liquidacion',
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
        url: 'cartola-tbk',
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
  {
    role: 'CONTABILIDAD',
    menus: [
      {
        name: 'Cartola',
        url: 'cartola-tbk',
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
      {
        name: 'Contabilidad',
        url: 'archivos-contabilidad',
        iconComponent: { name: 'cil-list' },
      },
    ],
  },
  {
    role: 'ADMINISTRADOR',
    menus: [
      {
        name: 'Status Cuadratura',
        url: 'status-cuadratura',
        iconComponent: { name: 'cil-list' },
      },
      {
        name: 'Liquidaciones',
        url: 'liquidacion',
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
        url: 'cartola-tbk',
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
      {
        name: 'Contabilidad',
        url: 'archivos-contabilidad',
        iconComponent: { name: 'cil-list' },
      },
    ],
  },
];

import { INavData } from '@coreui/angular-pro';

export const navItems: any = [
  {
    role: 'DAFE',
    menus: [
      {
        name: 'Status Cuadratura',
        url: 'status-cuadratura',
        iconComponent: { name: 'cil-calculator' },
      },
      {
        name: 'Ventas',
        url: 'ventas-tbk',
        iconComponent: { name: 'cil-credit-card' },
        children: [
          {
            name: 'Crédito',
            url: 'ventas-tbk/credito',
          },
          {
            name: 'Débito',
            url: 'ventas-tbk/debito',
          },
        ],
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
        iconComponent: { name: 'cil-history' },
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
        name: 'Ventas',
        url: 'ventas-tbk',
        iconComponent: { name: 'cil-credit-card' },
        children: [
          {
            name: 'Crédito',
            url: 'ventas-tbk/credito',
          },
          {
            name: 'Débito',
            url: 'ventas-tbk/debito',
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
        iconComponent: { name: 'cil-history' },
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
        iconComponent: { name: 'cil-paperclip' },
      },
      {
        name: 'Descarga Excel',
        url: 'descarga-excel',
        iconComponent: { name: 'cil-cloud-download' },
      },
      {
        name: 'Saldo Pendiente',
        url: 'saldo-pendiente',
        iconComponent: { name: 'cil-tags' },
      },
      {
        name: 'Ventas',
        url: 'ventas-tbk',
        iconComponent: { name: 'cil-credit-card' },
        children: [
          {
            name: 'Crédito',
            url: 'ventas-tbk/credito',
          },
          {
            name: 'Débito',
            url: 'ventas-tbk/debito',
          },
        ],
      },
    ],
  },
  {
    role: 'ADMINISTRADOR',
    menus: [
      {
        name: 'Status Cuadratura',
        url: 'status-cuadratura',
        iconComponent: { name: 'cil-calculator' },
      },
      {
        name: 'Liquidaciones',
        url: 'liquidacion',
        iconComponent: { name: 'cil-dollar' },
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
        iconComponent: { name: 'cil-history' },
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
        iconComponent: { name: 'cil-paperclip' },
      },
      {
        name: 'Descarga Excel',
        url: 'descarga-excel',
        iconComponent: { name: 'cil-cloud-download' },
      },
      {
        name: 'Saldo Pendiente',
        url: 'saldo-pendiente',
        iconComponent: { name: 'cil-tags' },
        children: [
          {
            name: 'Crédito',
            url: 'saldo-pendiente/credito',
          },
          {
            name: 'Débito',
            url: 'saldo-pendiente/debito',
          },
        ],
      },
      {
        name: 'Ventas',
        url: 'ventas-tbk',
        iconComponent: { name: 'cil-credit-card' },
        children: [
          {
            name: 'Crédito',
            url: 'ventas-tbk/credito',
          },
          {
            name: 'Débito',
            url: 'ventas-tbk/debito',
          },
        ],
      },
    ],
  },
];

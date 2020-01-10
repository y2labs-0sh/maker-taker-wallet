import Root from 'pages/Root'
import NoMatch from 'components/NoMatch'
import {
  Asset,
  Transaction,
  Staking,
  Loan,
  Setting,
  Contact
} from 'routes/sync'

const routes = [
  {
    component: Root,
    routes: [
      {
        path: '/',
        exact: true,
        component: Asset
      },
      {
        path: '/asset',
        exact: true,
        component: Asset
      },
      {
        path: '/transaction',
        exact: true,
        component: Transaction
      },
      {
        path: '/loan',
        exact: true,
        component: Loan
      },
      {
        path: '/setting',
        exact: true,
        component: Setting
      },
      {
        path: '/saving',
        exact: true,
        component: Staking
      },
      {
        path: '/contact',
        exact: true,
        component: Contact
      },
      {
        path: '*',
        component: NoMatch
      }
    ]
  }
]

export default routes

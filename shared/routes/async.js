import { hot } from 'react-hot-loader/root'
import { asyncComponent } from 'components/DynamicComponent'

export const Asset = hot(asyncComponent(() => import('pages/Asset'/* webpackChunkName: 'Asset' */)))
// export const Transaction = hot(asyncComponent(() => import('pages/Transaction'/* webpackChunkName: 'Transaction' */)))
// export const Staking = hot(asyncComponent(() => import('pages/Staking'/* webpackChunkName: 'Staking' */)))
// export const Loan = hot(asyncComponent(() => import('pages/Loan'/* webpackChunkName: 'Loan' */)))
export const Setting = hot(asyncComponent(() => import('pages/Setting'/* webpackChunkName: 'Setting' */)))
// export const Contact = hot(asyncComponent(() => import('pages/Contact'/* webpackChunkName: 'Contact' */)))
export const Market = hot(asyncComponent(() => import('pages/Market'/* webpackChunkName */)))

import { InjectedConnector } from '@web3-react/injected-connector'
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'
import { NetworkConnector } from '@web3-react/network-connector'
import { FORTMATIC_API_KEY, PORTIS_DAPP_ID, RPC_URLS } from '../../config'
import { LatticeConnector } from '@web3-react/lattice-connector'
import { FortmaticConnector } from '@web3-react/fortmatic-connector'
import { PortisConnector } from '@web3-react/portis-connector'
import { TorusConnector } from '@web3-react/torus-connector'
import { WalletLinkConnector } from '@web3-react/walletlink-connector'

console.log(RPC_URLS)

export const injected = new InjectedConnector({
  supportedChainIds: [1, 3, 4, 5, 42],
})

export const walletconnect = new WalletConnectConnector({
  rpc: { 1: RPC_URLS[1] },
  qrcode: true,
})

export const network = new NetworkConnector({
  urls: { 1: RPC_URLS[1], 4: RPC_URLS[4] },
  defaultChainId: 1,
})

export const walletlink = new WalletLinkConnector({
  url: RPC_URLS[1],
  appName: 'web3-react example',
  supportedChainIds: [1, 3, 4, 5, 42, 10, 137, 69, 420, 80001],
})

// const POLLING_INTERVAL = 12000
// export const ledger = new LedgerConnector({ chainId: 1, url: RPC_URLS[1], pollingInterval: POLLING_INTERVAL })

// export const trezor = new TrezorConnector({
//   chainId: 1,
//   url: RPC_URLS[1],
//   pollingInterval: POLLING_INTERVAL,
//   manifestEmail: 'dummy@abc.xyz',
//   manifestAppUrl: 'http://localhost:1234'
// })

export const lattice = new LatticeConnector({
  chainId: 4,
  appName: 'web3-react',
  url: RPC_URLS[4],
})

// export const frame = new FrameConnector({ supportedChainIds: [1] })

// export const authereum = new AuthereumConnector({ chainId: 42 })

export const fortmatic = new FortmaticConnector({
  apiKey: FORTMATIC_API_KEY,
  chainId: 4,
})

// export const magic = new MagicConnector({
//   apiKey: process.env.MAGIC_API_KEY as string,
//   chainId: 4,
//   email: 'hello@example.org'
// })

export const portis = new PortisConnector({
  dAppId: PORTIS_DAPP_ID as string,
  networks: [1, 100],
})

export const torus = new TorusConnector({ chainId: 1 })

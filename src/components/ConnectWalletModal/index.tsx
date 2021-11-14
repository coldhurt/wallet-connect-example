import React, { FC } from 'react'
import { useWeb3React, UnsupportedChainIdError } from '@web3-react/core'
import {
  NoEthereumProviderError,
  UserRejectedRequestError as UserRejectedRequestErrorInjected,
} from '@web3-react/injected-connector'
import { UserRejectedRequestError as UserRejectedRequestErrorWalletConnect } from '@web3-react/walletconnect-connector'
import { Web3Provider } from '@ethersproject/providers'

import { useEagerConnect, useInactiveListener } from './hooks'
import {
  fortmatic,
  injected,
  lattice,
  network,
  portis,
  torus,
  walletconnect,
  walletlink,
} from './connectors'
import { Col, Modal, Row, Toast } from '@douyinfe/semi-ui'
import FullButton from '../Button/FullButton'

enum ConnectorNames {
  Injected = 'MetaMask',
  WalletConnect = 'WalletConnect',
  Network = 'Network',
  Lattice = 'Lattice',
  WalletLink = 'Coinbase Wallet',
  // Ledger = 'Ledger',
  // Trezor = 'Trezor',
  // Frame = 'Frame',
  // Authereum = 'Authereum',
  Fortmatic = 'Fortmatic',
  // Magic = 'Magic',
  Portis = 'Portis',
  Torus = 'Torus',
}

const connectorsByName: { [name: string]: any } = {
  [ConnectorNames.Injected]: injected,
  [ConnectorNames.WalletConnect]: walletconnect,
  [ConnectorNames.Lattice]: lattice,
  [ConnectorNames.Network]: network,
  [ConnectorNames.Fortmatic]: fortmatic,
  [ConnectorNames.Portis]: portis,
  [ConnectorNames.Torus]: torus,
  [ConnectorNames.WalletLink]: walletlink,
}

const walletImages: { [name: string]: any } = {
  [ConnectorNames.Injected]: '/images/wallets/metamask.png',
  [ConnectorNames.WalletConnect]: '/images/wallets/wallet-connect.svg',
  [ConnectorNames.Lattice]: '/images/wallets/lattice.png',
  [ConnectorNames.Fortmatic]: '/images/wallets/fortmatic.png',
  [ConnectorNames.Portis]: '/images/wallets/portis.png',
  [ConnectorNames.Torus]: '/images/wallets/torus.png',
  [ConnectorNames.WalletLink]: '/images/wallets/coinbase.svg',
}

function getErrorMessage(error: Error) {
  debugger
  if (error instanceof NoEthereumProviderError) {
    return 'No Ethereum browser extension detected, install MetaMask on desktop or visit from a dApp browser on mobile.'
  } else if (error instanceof UnsupportedChainIdError) {
    return "You're connected to an unsupported network."
  } else if (
    error instanceof UserRejectedRequestErrorInjected ||
    error instanceof UserRejectedRequestErrorWalletConnect
  ) {
    return 'Please authorize this website to access your Ethereum account.'
  } else {
    console.error(error)
    return 'An unknown error occurred. Check the console for more details.'
  }
}

type TConnectWalletModal = {
  visible: boolean
  onClose: (e: React.MouseEvent) => void | Promise<any>
}

const ConnectWalletModal: FC<TConnectWalletModal> = ({ visible, onClose }) => {
  const context = useWeb3React<Web3Provider>()
  const {
    connector,
    library,
    account,
    activate,
    deactivate,
    active,
    error,
    chainId,
  } = context

  // handle logic to recognize the connector currently being activated
  const [activatingConnector, setActivatingConnector] = React.useState<any>()
  React.useEffect(() => {
    if (activatingConnector && activatingConnector === connector) {
      setActivatingConnector(undefined)
    }
  }, [activatingConnector, connector])

  // handle logic to eagerly connect to the injected ethereum provider, if it exists and has granted access already
  const triedEager = useEagerConnect()

  // handle logic to connect in reaction to certain events on the injected ethereum provider, if it exists
  useInactiveListener(!triedEager || !!activatingConnector)

  return (
    <Modal
      visible={visible}
      onCancel={onClose}
      onOk={onClose}
      footer={null}
      title='Connect to a wallet'
    >
      <Row type='flex'>
        {Object.keys(connectorsByName).map((name) => {
          const currentConnector = connectorsByName[name]
          const activating = currentConnector === activatingConnector
          const connected = currentConnector === connector
          const disabled =
            !triedEager || !!activatingConnector || connected || !!error

          return (
            <Col key={name} style={{ marginBottom: 10 }} span={24}>
              <FullButton
                type='primary'
                block={true}
                loading={activating}
                disabled={disabled}
                style={{ justifyContent: 'start' }}
                iconPosition='right'
                icon={
                  walletImages[name] ? (
                    <img
                      src={walletImages[name]}
                      alt={name}
                      style={{ width: 30 }}
                    />
                  ) : null
                }
                onClick={() => {
                  setActivatingConnector(currentConnector)
                  activate(connectorsByName[name])
                }}
              >
                <Row type='flex' justify='start' style={{ width: 330 }}>
                  <Col>
                    {name}
                    {connected && (
                      <span role='img' aria-label='check'>
                        ✅
                      </span>
                    )}
                  </Col>
                </Row>
              </FullButton>
            </Col>
          )
        })}
      </Row>
      <Row>
        {(active || error) && (
          <FullButton
            type='danger'
            onClick={() => {
              deactivate()
            }}
          >
            Deactivate
          </FullButton>
        )}

        {!!error && (
          <h4 style={{ marginTop: '1rem', marginBottom: '0' }}>
            {getErrorMessage(error)}
          </h4>
        )}
      </Row>
      <hr style={{ margin: '2rem' }} />
      <Row>
        {!!(library && account) && (
          <FullButton
            onClick={() => {
              library
                .getSigner(account)
                .signMessage('👋')
                .then((signature: any) => {
                  Toast.success(`Success!\n\n${signature}`)
                })
                .catch((error: any) => {
                  Toast.error(
                    'Failure!' +
                      (error && error.message ? `\n\n${error.message}` : '')
                  )
                })
            }}
          >
            Sign Message
          </FullButton>
        )}

        {connector === connectorsByName[ConnectorNames.WalletConnect] && (
          <FullButton
            onClick={() => {
              ;(connector as any).close()
            }}
          >
            Kill WalletConnect Session
          </FullButton>
        )}
        {!!(
          connector === connectorsByName[ConnectorNames.Network] && chainId
        ) && (
          <FullButton
            onClick={() => {
              ;(connector as any).changeChainId(chainId === 1 ? 4 : 1)
            }}
          >
            Switch Networks
          </FullButton>
        )}
        {/* {connector === connectorsByName[ConnectorNames.WalletLink] && (
          <FullButton
            style={{
              height: '3rem',
              borderRadius: '1rem',
              cursor: 'pointer',
            }}
            onClick={() => {
              ;(connector as any).close()
            }}
          >
            Kill WalletLink Session
          </FullButton>
        )}
        {connector === connectorsByName[ConnectorNames.Fortmatic] && (
          <FullButton
            style={{
              height: '3rem',
              borderRadius: '1rem',
              cursor: 'pointer',
            }}
            onClick={() => {
              ;(connector as any).close()
            }}
          >
            Kill Fortmatic Session
          </FullButton>
        )}
        {connector === connectorsByName[ConnectorNames.Magic] && (
          <FullButton
            style={{
              height: '3rem',
              borderRadius: '1rem',
              cursor: 'pointer',
            }}
            onClick={() => {
              ;(connector as any).close()
            }}
          >
            Kill Magic Session
          </FullButton>
        )}
        {connector === connectorsByName[ConnectorNames.Portis] && (
          <>
            {chainId !== undefined && (
              <FullButton
                style={{
                  height: '3rem',
                  borderRadius: '1rem',
                  cursor: 'pointer',
                }}
                onClick={() => {
                  ;(connector as any).changeNetwork(chainId === 1 ? 100 : 1)
                }}
              >
                Switch Networks
              </FullButton>
            )}
            <FullButton
              style={{
                height: '3rem',
                borderRadius: '1rem',
                cursor: 'pointer',
              }}
              onClick={() => {
                ;(connector as any).close()
              }}
            >
              Kill Portis Session
            </FullButton>
          </>
        )}
        {connector === connectorsByName[ConnectorNames.Torus] && (
          <FullButton
            style={{
              height: '3rem',
              borderRadius: '1rem',
              cursor: 'pointer',
            }}
            onClick={() => {
              ;(connector as any).close()
            }}
          >
            Kill Torus Session
          </FullButton>
        )} */}
      </Row>
    </Modal>
  )
}

export default ConnectWalletModal

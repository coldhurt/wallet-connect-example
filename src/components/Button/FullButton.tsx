import { Button } from '@douyinfe/semi-ui'
import { ButtonProps } from '@douyinfe/semi-ui/lib/es/button/Button'
import { FC } from 'react'

const FullButton: FC<ButtonProps> = ({ children, ...others }) => (
  <Button {...others} style={{ width: '100%', height: 40 }}>
    {children}
  </Button>
)

export default FullButton

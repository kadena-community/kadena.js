import React, { ReactNode } from 'react'
import 'react-responsive-modal/styles.css'
import { Modal as ReactResponsiveModal } from 'react-responsive-modal'

interface IProps {
  title: string
  onClose: () => void
  children?: ReactNode
}

export const Modal: React.FC<IProps> = ({ title, onClose, children }): JSX.Element => {
  return (
    <div>
      <ReactResponsiveModal open onClose={onClose} closeOnEsc={false} center>
        <h2>{title}</h2>
        {children}
      </ReactResponsiveModal>
    </div>
  )
}

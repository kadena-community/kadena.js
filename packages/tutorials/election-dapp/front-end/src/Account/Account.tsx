import React, { useState } from 'react'
import { Modal } from '../Modal/Modal'
import './Account.css'

interface IProps {
  account: string
  voteAllowed: boolean,
  onSetAccount: (account: string) => void
}

export const Account: React.FC<IProps> = ({ account, voteAllowed, onSetAccount }): JSX.Element => {
  const [showModal, setShowModal] = useState<boolean>(false)
  const [inputValue, setInputValue] = useState<string>('')

  const handleInputChange = (event: any): void => {
    setInputValue(event.target.value)
  }

  const handleOnSaveClick = (event: any): void => {
    setShowModal(false)
    onSetAccount(inputValue)
  }

  const renderAccountDetails = () => (
    <div className="Account-details">
      <span>{account}</span>
      {voteAllowed ? <span>Please cast your vote below!</span> : <span>You have already voted!</span>}
    </div>
  )

  return (
    <div className="Account">
      <h2>My Account</h2>
      {account && renderAccountDetails()}
      <button className="Account-set-button" onClick={() => setShowModal(true)}>{account ? 'Update' : 'Set'} Account</button>
      {showModal &&
        <Modal title="Provide your k:account" onClose={() => setShowModal(false)}>
          <div className="Account-input-wrapper">
            <input onChange={handleInputChange} value={inputValue} className="Account-input"></input>
            <button onClick={handleOnSaveClick}>Save</button>
          </div>
        </Modal>}
    </div>
  )
}
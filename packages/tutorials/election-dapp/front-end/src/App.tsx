import React, { useState, useEffect, useCallback } from 'react'
import { Account } from './Account/Account'
import { Candidates } from './Candidates/Candidates'
import { hasUserVoted, vote } from './contract'
import './App.css'

const App: React.FC = (): JSX.Element => {
  const [account, setAccount] = useState<string>('')
  const [voteAllowed, setVoteAllowed] = useState<boolean>(false)
  const [voteInProgress, setVoteInProgress] = useState<boolean>(false)

  const getVoteStatus = useCallback(async () => {
    if (account) {
      const voted = await hasUserVoted(account)
      setVoteAllowed(!voted)
    } else {
      setVoteAllowed(false)
    }
  }, [account])

  useEffect(() => {
    getVoteStatus()
  }, [account, getVoteStatus])

  const onVote = async (candidateId: string): Promise<void> => {
    setVoteInProgress(true)
    await vote(account, candidateId)
    await getVoteStatus()
    setVoteInProgress(false)
  }

  return (
    <div className="App">
      <header className="App-header">
        <p>
          Guide: Building a voting dApp
        </p>
      </header>
      <section className="Voting-section">
        <Account onSetAccount={(accountVal) => setAccount(accountVal)} account={account} voteAllowed={voteAllowed}/>
        <Candidates voteAllowed={voteAllowed} voteInProgress={voteInProgress} onVote={onVote} />
      </section>
    </div>
  )
}

export default App
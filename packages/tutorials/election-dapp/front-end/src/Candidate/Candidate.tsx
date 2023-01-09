import React, { useState, useEffect } from 'react'
import { getVotes } from '../contract'
import './Candidate.css'

export interface ICandidate {
  id: string
  name: string
}

interface IProps {
  candidate: ICandidate
  voteAllowed: boolean
  voteInProgress: boolean
  onVote: (candidateId: string) => void
}

export const Candidate: React.FC<IProps> = ({ candidate: { id, name }, voteAllowed, voteInProgress, onVote }): JSX.Element => {
  const [voteCount, setVoteCount] = useState<number>(0)

  const retrieveCandidateVotes = async (id: string) => {
    const votes = await getVotes(id)
    setVoteCount(votes)
  }

  useEffect(() => {
    if (!voteInProgress) {
      retrieveCandidateVotes(id)
    }
  }, [id, voteInProgress])

  return (
    <section className="Candidate-row">
      <div>
        <span className="Candidate-row-header">Candidate Id</span>
        <p className="Candidate-row-content">{id}</p>
      </div>
      <div>
        <span className="Candidate-row-header">Name</span>
        <p className="Candidate-row-content">{name}</p>
      </div>
      <div>
        <span className="Candidate-row-header">Total votes</span>
        <p className="Candidate-row-content">{voteCount}</p>
      </div>
      <div className="Candidate-vote-container">
        <button disabled={!voteAllowed || voteInProgress} onClick={() => onVote(id)}>Vote Now</button>
      </div>
    </section>
  )
}

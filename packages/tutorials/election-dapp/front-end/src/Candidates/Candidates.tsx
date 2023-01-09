import React from 'react'
import { Candidate, ICandidate } from '../Candidate/Candidate'
import { SpinnerRoundFilled } from 'spinners-react'
import './Candidates.css'

const candidates: Array<ICandidate> = [
  { id: '1', name: 'Jamesgatia Wardanic' },
  { id: '2', name: 'Shazora Bradleflame' },
  { id: '3', name: 'Isobel O\'Quinn' },
  { id: '4', name: 'Washingtonganta' },
  { id: '5', name: 'Campbelliri Kumariverse' }
]

interface IProps {
  voteAllowed: boolean
  voteInProgress: boolean
  onVote: (candidateId: string) => void
}

export const Candidates: React.FC<IProps> = ({ voteAllowed, voteInProgress, onVote }): JSX.Element => (
  <div className="Candidates">
    <header className="Candidates-heading">
      <h2>Candidates</h2>
      {voteInProgress &&
        <div className="Candidates-progress">
          <span>Voting transaction in progress ...</span>
          <SpinnerRoundFilled size={30} color="#ed098f" />
        </div>
      }
    </header>
    <section className="Candidates-list">
      {candidates.map(candidate =>
        <Candidate
          key={candidate.id}
          voteAllowed={voteAllowed}
          voteInProgress={voteInProgress}
          candidate={candidate}
          onVote={onVote}
        />)}
    </section>
  </div>
)

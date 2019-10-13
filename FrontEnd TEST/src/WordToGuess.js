import React from 'react'
import PropTypes from 'prop-types'
import './WordToGuess.css'

const HIDDEN_SYMBOL = '_'

const Letter = ({ lettre, feedback}) => (
    <div className={`lettre ${feedback}`} >
      <span className="symbol">
        {feedback === 'hidden' ? HIDDEN_SYMBOL : lettre}
      </span>
    </div>
  )

Letter.propTypes = {
    lettre: PropTypes.string.isRequired,
    feedback: PropTypes.oneOf([
      'hidden',
      'visible',
    ]).isRequired,
  }
export default Letter
import React from 'react'
import PropTypes from 'prop-types'
import './GuessCount.css'

const GuessCount = ({ guesses }) => <div className="guesses">Number of guesses : {guesses}</div>



GuessCount.propTypes = {
    guesses: PropTypes.number.isRequired,
  }

export default GuessCount

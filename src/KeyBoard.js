import React from 'react'
import PropTypes from 'prop-types'
import './KeyBoard.css'

const Key = ({ touche, feedback, index, onClick }) => (
    <div className={`touche ${feedback}`} onClick={feedback === 'visible' ? () => onClick(index) : () => {}} >
      <span className="symbol">
        {touche}
      </span>
    </div>
  )

Key.propTypes = {
    touche: PropTypes.string.isRequired,
    feedback: PropTypes.oneOf([
      'hidden',
      'visible',
    ]).isRequired,
    index: PropTypes.number.isRequired,
    onClick: PropTypes.func.isRequired,
  }
export default Key

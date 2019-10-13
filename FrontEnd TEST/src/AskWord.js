// import React, { Component } from 'react'

// import './HighScoreInput.css'


// class askWord extends Component {
//   state = { word :this.props.word, temporaryWord : this.props.temporaryWord}

//   storeWord = event => {
//     this.setState({temporaryWord : event.target.value.toUpperCase()});
//   }

//   handleWordUpdate = event => {
//     const result = [];
//     var Word = this.state.temporaryWord;
//     for (var i = 0; i < Word.length; i++) {
//       result.push(Word.charAt(i));
//     }
//     this.setState({word : result })
//   }


//   render() {
//     return (
//       <form className="highScoreInput" onSubmit = {this.handleWordUpdate}>
//         <p>
//           <label>
//             Bravo ! Entre ton prénom :
//             <input 
//             type="text" 
//             autoComplete="given-name" 
//             onChange = {this.storeWord}
//             value = {this.state.temporaryWord}/>
//           </label>
//           <button type="submit">J’ai gagné !</button>
//         </p>
//       </form>
//     )
//   }
// }


// export default askWord

import PropTypes from 'prop-types'
import React, { Component } from 'react'

import './AskWord.css'



class AskWord extends Component {
  state = { temporaryWord :'' , word : []}

  handleWordUpdate = event => {
    this.setState({temporaryWord : event.target.value.toUpperCase()});
  }

  persistWinner = event => {
    event.preventDefault();
    const result = [];
    var Word = this.state.temporaryWord;
    for (var i = 0; i < Word.length; i++) {
      result.push(Word.charAt(i));
    }
    this.props.StoreWord(result)
  }


  render() {
    return (
      <form className="askWord" onSubmit = {this.persistWinner}>
        <p>
          <label>
            Saisir un mot :
            <input 
            type="text"
            onChange = {this.handleWordUpdate}
            value = {this.state.temporaryWord}
            maxLength = {14}/>
          </label>
          <button type="submit">Jouer</button>
        </p>
      </form>
    )
  }
}

AskWord.propTypes = {
  StoreWord : PropTypes.func.isRequired,
}

export default AskWord


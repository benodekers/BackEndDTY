import React, { Component } from 'react'
import './App.css'

import Key from './KeyBoard'
import Letter from './WordToGuess'
import GuessCount from './GuessCount'
import HallOfFame from './HallOfFame'
import AskWord from './AskWord'
import HighScoreInput from './HighScoreInput'




const SYMBOLS = 'A B C D E F G H I J K L M N O P Q R S T U V W X Y Z'

const Dictionnaire = [
  'LIPINddddddddddddd',
  'PROOOddddddddd'
]

class App extends Component {
  constructor(props) {
    super(props);
    this.initialState = {
      keys: this.generateKeyBoard(),
      word : [],
      guesses: 0,
      usedKeys: [],
      foundLetters: [],
      hallOfFame: null,
      temporaryWord:'',
      failedAttempt: 0,
      imageAddress: '',
    };
    this.state = this.initialState;
  }

  onResetClick(e) {
    e.preventDefault();
    this.setState(this.initialState);
  }

  state = {
    keys: this.generateKeyBoard(),
    word : [],
    guesses: 0,
    usedKeys: [],
    foundLetters: [],
    hallOfFame: null,
    temporaryWord:'',
    failedAttempt: 0,
    imageAddress: '',
  }



  chooseWord(){
    const result = []

    var Word = Dictionnaire[Math.floor(Math.random()*Dictionnaire.length)];
     
    for (var i = 0; i < Word.length; i++) {
      result.push(Word.charAt(i));
    }
    return result

  }

  generateKeyBoard() {
    
    return SYMBOLS.split(' ');
  }

  displayHallOfFame = hallOfFame => {
    this.setState({hallOfFame})
  }

  StoreWord = Word => {
    this.setState({word: Word})
  }

  getFeedbackForKeyBoard(index, wordExist, lost, won) {
    const {usedKeys } = this.state
    const isUsed = usedKeys.includes(index)
  
    if (isUsed ||!wordExist || won ||lost) {
      return 'hidden'
    }
    return 'visible'
  }

  getFeedbackForLetter(index) {
    const {foundLetters, word } = this.state
    const isFound = foundLetters.includes(word[index])
  
    if (isFound) {
      return 'visible'
    }
    return 'hidden'
  }

  handleCardClick = index => {
    this.handleNewGuess(index);
  }

  handleNewGuess(index) {
    const { word, guesses, usedKeys, foundLetters, failedAttempt } = this.state;
    const newUsedKey = [index];
    const isIn = (word.includes(SYMBOLS.split(' ')[index]) && !(foundLetters.includes(SYMBOLS.split(' ')[index])));
    const boolFailedAttempt = (!(word.includes(SYMBOLS.split(' ')[index])) && !(foundLetters.includes(SYMBOLS.split(' ')[index])))

    const newGuesses = guesses + 1;
    const newFailedAttempt = (failedAttempt < 8) ? (boolFailedAttempt? failedAttempt + 1 : failedAttempt) : failedAttempt

    this.setState({ usedKeys: [...usedKeys, ...newUsedKey], guesses: newGuesses });
    if (isIn) {
      var newLetters = [];
      for(var i = 0; i < word.length; i++){
        if (SYMBOLS.split(' ')[index] === word[i]){
          newLetters.push(word[i]);
        }
      }
      this.setState({ foundLetters: [...foundLetters, ...newLetters] })
    }
    if (boolFailedAttempt) {
      const newImageAddress = './ImagePendu/Image'+newFailedAttempt.toString(10) + '.jpg'
      console.log(newImageAddress)
      this.setState({ failedAttempt: newFailedAttempt, imageAddress: newImageAddress})
    }
  }

  


  render() {
    const {keys, word, guesses, foundLetters, hallOfFame, imageAddress, failedAttempt}=this.state;
    const won = ((foundLetters.length === word.length)&&(foundLetters.length!==0));
    const lost = failedAttempt===8;
    const wordExist = (word.length !== 0)
    return (
      
      <div className="Pendu">
        {!wordExist &&(
        <AskWord StoreWord = {this.StoreWord}/>
        )}

        <GuessCount guesses={guesses} />

        <div className="wordToGuess">
          {word.map((lettre, index) => (
            <Letter lettre = {lettre}
            feedback = {this.getFeedbackForLetter(index)}
            key = {index} />
          ))}
        </div>
        
        

        <div className="images" class="behind">
          {failedAttempt>0 && <img src={ require(`${imageAddress}`)} alt=""  width='80%' height = 'auto' />}
        </div>
        
        <div className="KeyBoard">
          {keys.map((touche, index) => (
            <Key touche = {touche}
            feedback = {this.getFeedbackForKeyBoard(index, wordExist, lost, won)}
            key = {touche}
            index = {index}
            onClick = {this.handleCardClick}
             />
          ))}
        </div>
        
        {won && (
          (hallOfFame ? (<HallOfFame entries={hallOfFame}/>) : 
          (<HighScoreInput guesses={guesses} onStored = {this.displayHallOfFame}/>))
        )}

        {won && (hallOfFame && 
          <div className="ResetButton">
            <button type="button" onClick={this.onResetClick.bind(this)}>Reset</button>
          </div>
        )}

        {lost && (
          <div className="ResetButton">
            <p>The word was {word}<br></br>
            </p>
            <button type="button" onClick={this.onResetClick.bind(this)}>Rejouer</button>
          </div>
        )}
      </div>
    )
  }
}

export default App

import React, {Component} from 'react'
import './App.css';


//players tokens go in spaces 
//to win the player must fill 4 spaces in a line
function Grid(props){
  return <div className="Grid"><div className={props.value}></div></div>
}

// spaces make up columns which can be clicked on
function Column(props){
    return <div className="Column" onClick={() => props.handleClick()}>
      {[...Array(props.spaces.length)].map((x, j) => 
        <Grid key={j} value={props.spaces[j]}></Grid>)}
      </div>
 }

class Board extends Component {

  constructor() {
    super();

    //occurs when app is opened
    this.state = {
      //An empty board with 7 columns and 6 rows created using a double array
      boardState: new Array(7).fill(new Array(6).fill(null)),
      //red player starts
      playerTurn: 'Red',
      //game has not started yet
      gameSelected: true,
      //no said winner
      winner: '',
      // All grids are empty
      full:0
    }
  }

  //when user starts a game
  startGame(){
    this.setState({
      //game has bstarted
       gameSelected: true, 
       //the board is empty 
       boardState: new Array(7).fill(new Array(6).fill(null)),
      // if full, set back to 0
      full:0
    })
  }

  //when a column is selected then the move gets made 
  makeMove(colID){
    //a copy of the board gets created
    const boardCopy = this.state.boardState.map(function(arr) {
      return arr.slice();
    });
    //confirmation that the column isnt full 
    if( boardCopy[colID].indexOf(null) !== -1 ){
      //player's token gets added to the column on the board 
      let newColumn = boardCopy[colID].reverse()
      newColumn[newColumn.indexOf(null)] = this.state.playerTurn
      newColumn.reverse()
      //board updates when move is made, now its the next players turn 
      this.setState({
        playerTurn: (this.state.playerTurn === 'Red') ? 'Yellow' : 'Red',
        boardState: boardCopy,
        full:this.state.full+1
      })
    }

  }

  //move is made when clicked
  handleClick(colID) {
    //this only works when the game is still going and no one has won 
    if(this.state.winner === ''){
      this.makeMove(colID)
    }
  }
  
  //every time the board is updated/move is made it checks for a winner
  componentDidUpdate(){
    let winner = checkWinner(this.state.boardState)
    if(this.state.winner !== winner)
      this.setState({winner: winner})
  }

  render(){

    //display winner message when the game is won
    let winnerMessageStyle
    if(this.state.winner !== ""){
      winnerMessageStyle = "winnerMessage appear"
    }else {
      winnerMessageStyle = "winnerMessage"
    }

    //Contruct columns
    let columns = [...Array(this.state.boardState.length)].map((x, i) => 
      <Column 
          key={i}
          spaces={this.state.boardState[i]}
          handleClick={() => this.handleClick(i)}
      ></Column>
    )

    //columns are displayed, and winner message is showed if available 
    return (
      <div>
        {this.state.gameSelected &&
          <div className="Board">
            {columns}
          </div>
        }
        <div className={winnerMessageStyle}>{this.state.winner}</div>
        {(!this.state.gameSelected || this.state.winner !== '' || this.state.full===42) &&
          <div>
            <button onClick={() => this.startGame()}>Play a New Game</button>
          </div>
        }
      </div>
    )
  }
}


class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <h2>Connect Four</h2>
        </div>
        <div className="Game">
          <Board></Board>
        </div>
      </div>
    );
  }
}

//check if line is empty and if it is all the same colour tokens
function checkLine(a,b,c,d) {
    return ((a !== null) && (a === b) && (a === c) && (a === d));
}

//checks if there is a winner and display the message if there is one
function checkWinner(bs) {
//c columns 
//r rows 
//bs[c][r] items in a double array, these are considered as teh spaces and are filled with the players tokens
  //check vertical lines
    for (let c = 0; c < 7; c++)
        for (let r = 0; r < 4; r++)
            if (checkLine(bs[c][r], bs[c][r+1], bs[c][r+2], bs[c][r+3]))
               return bs[c][r] +' wins!'

    //check horizontal right
    for (let r = 0; r < 6; r++)
         for (let c = 0; c < 4; c++)
             if (checkLine(bs[c][r], bs[c+1][r], bs[c+2][r], bs[c+3][r]))
                 return bs[c][r] +' wins!'

    //check diagonal lines, left
    for (let r = 0; r < 3; r++)
         for (let c = 0; c < 4; c++)
             if (checkLine(bs[c][r], bs[c+1][r+1], bs[c+2][r+2], bs[c+3][r+3]))
                return bs[c][r] +' wins!'

    //checks diagonal lines, right
    for (let r = 0; r < 4; r++)
         for (let c = 3; c < 6; c++)
             if (checkLine(bs[c][r], bs[c-1][r+1], bs[c-2][r+2], bs[c-3][r+3]))
                return bs[c][r] +' wins!'

    //if there's no winner ,the winner message is not displayed
    return "";
}


export default App;

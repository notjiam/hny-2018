import React, { Component } from 'react';
import StageWrapper from './stage-wrapper';
import Background from './background';
import _ from 'lodash';
import { connect } from 'react-redux';
import { play, finish, startGame, stopGame, resetGame, updateGameStage, startPowerUp, stopPowerUp } from '../actions';


import ReactCountdownClock from 'react-countdown-clock';
import styled from 'styled-components';

import '../App.css';


const Ui = styled.div`
  position: absolute;
  top: 15px;
  left: 15px;
  z-index: 200;
`;

const Score = styled.div`
  background: #FFF;
  color: #666;
  border-radius: 8px;
  padding: 10px 20px;
  font-size: 32px;
  top: 15px;
  left: 15px;
  font-weight: bold;
  display: inline-block;
  user-select: none;
`;

const SuccessWrapper = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 1000;
`;
const Success = styled.div`
  background: #fff;
  width: 80%;
  max-width: 280px;
  margin-left: auto;
  margin-right: auto;
  border-radius: 20px;
  margin-top: 25%;
  box-shadow: 0 5px 100px rgba(74,144,226,0.4);
  text-align: center;
  padding: 20px 20px 30px;
  color: #333;
  z-index: 1100;
  h2{
    color: #999;
  }
  h1{
    font-size:40px;
    color: #4A90E2;
    text-shadow: 0 3px 10px rgba(74,144,226,0.15);
  }
`;

const ButtonRestart = styled.button`
  border: none;
  border-radius : 8px;
  background: #4A90E2;
  color: #fff;
  font-size: 20px;
  padding: 15px 20px;
  border-bottom: #1F66B9 3px solid;
  box-shadow: 0 5px 50px rgba(74,144,226,0.2);
  cursor: pointer;
`;

const CountdownWrapper = styled.div`
  position: absolute;
  right: 10px; 
  top: 10px;
  z-index: 1000;
`;

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      stageW : window.innerWidth,
      stageH : window.innerHeight
    };
    this.onResize = this.onResize.bind(this);
    this.resetGame = this.resetGame.bind(this);
    this.timeouts = [];
    this.gameTimeLimit = 30; //Sec
    this.powerupScoreLimit = 3000;

    setTimeout( ()=> {
       this.showGameCountdownToStartGame();
    }, 3000);
  }

  onResize(e){
    this.setState({
      stageW : window.innerWidth,
      stageH : window.innerHeight
    });
  }

  showGameCountdownToStartGame(){
    
    this.powerupScoreLimit = 3000;

    const timeCountDown = 3000; //3Sec
    const countdownNumbers = [
      {time: 0, callback: ()=>{
        this.props.play();
        this.props.updateGameStage('showCountdown3');
      }},
      {time: 1000, callback: ()=>{
        this.props.updateGameStage('showCountdown2');
      }},
      {time: 2000, callback: ()=>{
        this.props.updateGameStage('showCountdown1');
      }},
      {time: 3000, callback: ()=>{
        this.props.updateGameStage('showCountdownGo');
        this.props.startGame();
      }},

      // EndGame
      {time: ( this.gameTimeLimit*1000 + timeCountDown )-3000, callback: ()=>{
        this.props.updateGameStage('showCountdown3');
      }},
      {time: ( this.gameTimeLimit*1000 + timeCountDown )-2000 , callback: ()=>{
        this.props.updateGameStage('showCountdown2');
      }},
      {time: ( this.gameTimeLimit*1000 + timeCountDown )-1000, callback: ()=>{
        this.props.updateGameStage('showCountdown1');
      }},
      {time: ( this.gameTimeLimit*1000 + timeCountDown ), callback: ()=>{
        this.props.stopGame();
      }},
      {time: ( this.gameTimeLimit*1000 + timeCountDown )+500, callback: ()=>{
        this.props.finish();
      }}
    ];
    countdownNumbers.forEach( (countdown)=>{
      this.timeouts.push( setTimeout( ()=> {
        countdown.callback();
      }, countdown.time) );
    } );
  }

  clearGameCountdown(){
    this.timeouts.forEach(clearTimeout);
  }

  componentDidMount(){
    window.addEventListener( 'resize', _.debounce( this.onResize , 300).bind(this) );
  }

  componentWillReceiveProps(nextProps){
    if( nextProps.powerupScore > this.powerupScoreLimit ){
      this.props.startPowerUp();
      this.powerupScoreLimit *= 2;
      setTimeout( ()=> {
        if( this.props.status !== 'stop' ){
         this.props.stopPowerUp();
        }
      }, 1000);
    }
  }

  resetGame(){
      this.props.resetGame(); 
      setTimeout( ()=>{ 
        this.showGameCountdownToStartGame();
      }, 100 );
  }

  render() {
    return (
      <div className="App">

        { this.props.status === 'finish' ? 
        <SuccessWrapper>
          <Success>
            <h2>Your Score!</h2>
            <h1>{ this.props.score.toLocaleString() }</h1>
            <ButtonRestart onTouchStart={ this.resetGame } onClick={ this.resetGame } >Play again!</ButtonRestart>
          </Success>
        </SuccessWrapper>
        : null
        }

        <Ui>
          <Score>{ this.props.score.toLocaleString() }</Score>
        </Ui>
        { this.props.status === 'start' ? 
          <CountdownWrapper>
            <ReactCountdownClock 
              seconds={this.gameTimeLimit}
              color="#4A90E2"
              size={60}
            />
          </CountdownWrapper>
           :  null
        }
        <StageWrapper width={this.state.stageW} height={this.state.stageH} status={this.props.gameStage} />
        <Background height={ (100 - (this.props.powerupScore/this.powerupScoreLimit * 100 ) ) } />
      </div>
    );
  }
}

function mapStateToProps( state ){
  return {
    score: state.game.score,
    status: state.game.status,
    gameStage : state.game.gameStage,
    powerupScore : state.game.powerupScore
  }
}

export default connect( mapStateToProps , { play, finish, startGame, stopGame, resetGame, updateGameStage, startPowerUp, stopPowerUp  } )(App);

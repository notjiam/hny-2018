import { combineReducers } from 'redux';
import GameReducer from './reducer_game';

const rootReducer = combineReducers({
  game: GameReducer 
});

export default rootReducer;

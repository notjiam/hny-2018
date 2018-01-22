import { 
	PLAY,
	FINISH,
	START_GAME, 
	STOP_GAME, 
	RESET_GAME, 
	UPDATE_SCORE, 
	UPDATE_GAME_STAGE, 
	START_POWERUP, 
	STOP_POWERUP } from '../actions';

export default function( state = { score : 0, status: 'stop', gameState : '', powerupScore : 0 }, action ){
	switch( action.type ){
		case PLAY:		
			return { ...state, ...action.payload };
		case FINISH:
			return { ...state, ...action.payload };
		case START_GAME:		
			return { ...state, ...action.payload };
		case STOP_GAME:
			return { ...state, ...action.payload };
		case RESET_GAME:		
			return { ...state, ...action.payload };
		case UPDATE_GAME_STAGE:		
			return { ...state, ...action.payload };
		case UPDATE_SCORE:
			if( state.status !== 'stop' ){
				return { ...state, 
					score: state.score + action.payload.score,
					powerupScore: state.powerupScore + action.payload.score
				};
			}else{
				return { ...state };
			}
		case START_POWERUP:
			return { ...state, ...action.payload };
		case STOP_POWERUP:
			return { ...state, ...action.payload };
		default:
			return state;
	}
};
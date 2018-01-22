export const PLAY = 'PLAY';
export const FINISH = 'FINISH';
export const START_GAME = 'START_GAME';
export const STOP_GAME = 'STOP_GAME';
export const START_POWERUP = 'START_POWERUP';
export const STOP_POWERUP = 'STOP_POWERUP';
export const RESET_GAME = 'RESET_GAME';
export const UPDATE_GAME_STAGE = 'UPDATE_GAME_STAGE';
export const UPDATE_SCORE = 'UPDATE_SCORE';

export function play(){
	return {
		type : PLAY,
		payload: {
			status: 'play'
		}
	}
}
export function finish(){
	return {
		type : FINISH,
		payload: {
			status: 'finish'
		}
	}
}

export function resetGame(){
	return {
		type : RESET_GAME,
		payload: {
			gameStage: 'reset',
			status: 'stop',
			score: 0,
			powerupScore: 0
		}
	}
}

export function startGame(){
	return {
		type : START_GAME,
		payload: {
			gameStage: 'start',
			status: 'start'
		}
	}
}

export function stopGame(){
	return {
		type : STOP_GAME,
		payload : {
			gameStage: 'stop',
			status: 'stop'
		}
	}
}

export function startPowerUp(){
	return {
		type : START_POWERUP,
		payload : {
			gameStage: 'startPowerUp',
			powerupScore: 0
		}
	}
}

export function stopPowerUp(){
	return {
		type : STOP_POWERUP,
		payload : {
			gameStage: 'stopPowerUp',
			powerupScore: 0
		}
	}
}

export function updateGameStage( status ){
	return {
		type : UPDATE_GAME_STAGE,
		payload : {
			gameStage: status
		}
	}
}

export function updateScore( score ){
	return {
		type : UPDATE_SCORE,
		payload : {
			score: score
		}
	}
}
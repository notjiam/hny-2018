import React, { Component } from 'react';
import Box2D from 'box2d-es6';

import { connect } from 'react-redux';
import { updateScore } from '../actions';

import imageSpriteWithBody from '../sprites/imageSpriteWithBody';
import imageSprite from '../sprites/imageSprite';

import stageElementsData from '../data/stage-elements-data';
import Count3 from '../assets/3.svg';
import Count2 from '../assets/2.svg';
import Count1 from '../assets/1.svg';
import CountGo from '../assets/go.svg';

import Ball1 from '../assets/ball-1.png';
import Ball2 from '../assets/ball-2.png';
import Ball3 from '../assets/ball-3.png';
import Ball4 from '../assets/ball-4.png';
import Ball5 from '../assets/ball-5.png';
import BallPowerup from '../assets/ball-powerup.png';

const b2World	= Box2D.Dynamics.b2World,
b2Vec2 = Box2D.Common.Math.b2Vec2,
b2ContactListener = Box2D.Dynamics.b2ContactListener,
b2RevoluteJointDef = Box2D.Dynamics.Joints.b2RevoluteJointDef;

const devicePixelRatio = window.devicePixelRatio;

class StageWrapper extends Component{

	constructor(props){
		super(props);
		this.bodies = [];
		this.actors = [];
		this.stageElements = [];
		this.jointL = null;
		this.jointR = null;
		this.startCreateBall = null;
		this.startPowerUp = null;
	}

	shouldComponentUpdate(){
		return false;
	}

	componentWillReceiveProps(nextProps){
		if( nextProps.width !== this.props.width || nextProps.height !== this.props.height ){
			this.resizeStage(nextProps.width  * devicePixelRatio, nextProps.height * devicePixelRatio);
		}
		
		switch( nextProps.status ){
			case 'start':
				this.gameStart(nextProps.width* devicePixelRatio, nextProps.height * devicePixelRatio);
			break;
			case 'stop':
				this.gameStop();
			break;
			case 'reset':
				this.gameReset();
			break;
			case 'startPowerUp':
				this.gameStartPowerUp();
			break;
			case 'stopPowerUp':
				this.gameStopPowerUp();
			break;
			case 'showCountdown1':
				this.showCountdown(Count1);
			break;
			case 'showCountdown2':
				this.showCountdown(Count2);
			break;
			case 'showCountdown3':
				this.showCountdown(Count3);
			break;
			case 'showCountdownGo':
				this.showCountdown(CountGo);
			break;

			default:
			break;
		}

	}

	showCountdown(CountImage){
		
		let conuntText = imageSprite( this.stage, {
			imgUrl: CountImage,
			imageSize: {width: 200, height: 200},
			position: {x: (this.props.width/2) * devicePixelRatio , y: (this.props.height/2) * devicePixelRatio },
		} );

		this.stage.addChild(conuntText);

		window.Tweener.addTween(conuntText, {scaleX:2,scaleY:2, alpha: 0, time:1,  transition:"easeOutExpo", 
		  onComplete: () => {
		    this.stage.removeChild(conuntText);
		  }
		});
	}

	jointToggle(){
		if( this.jointL !== null ){
			this.jointL.SetMotorSpeed( this.jointL.GetMotorSpeed() * -1 );
		}
		if( this.jointR !== null ){
			this.jointR.SetMotorSpeed( this.jointR.GetMotorSpeed() * -1 );
		}
	}

	componentDidMount(){
		this.stage =  new window.Stage(this.refs.canvas.id);
		this.world = new b2World(new b2Vec2(0, 10),  true);

		this.resizeStage(this.props.width * devicePixelRatio, this.props.height * devicePixelRatio);
		this.stage.addEventListener( window.Event.ENTER_FRAME, this.onEnterFrame.bind(this) );

		this.setWorldListiner();
		
		document.addEventListener('mousedown', () => {
			this.jointToggle();
		});

		document.addEventListener('mouseup', () => {
			this.jointToggle();
		});

		document.addEventListener('touchstart', () => {
			this.jointToggle();
		});

		document.addEventListener('touchend', () => {
			this.jointToggle();
		});
		
	}

	gameStart(stageWidth, stageHeight){
		this.createBall();
		// this.resizeStage(stageWidth, stageHeight);
		if( this.startCreateBall != null ){
			clearTimeout(this.startCreateBall);
		}
		this.startCreateBall = setInterval(() => {
			this.createBall();
		}, 8000);
	}

	gameStop(){
		clearTimeout(this.startCreateBall);
		this.gameStopPowerUp();
	}

	gameReset(){
		clearTimeout(this.startCreateBall);
		for(var i=0; i< this.actors.length; i++){
			var body  = this.bodies[i];
			var actor = this.actors[i];
			if( body.GetUserData().name === 'platform-left' || body.GetUserData().name === 'platform-right' ){
				continue;
			}
			this.removeItemFromStage(actor, body);
		}
	}

	gameStartPowerUp(){
		if( this.startPowerUp != null ){
			clearTimeout(this.startPowerUp);
		}
		this.startPowerUp = setInterval(() => {
			this.createBall('powerup');
		}, 500);
	}
	gameStopPowerUp(){
		clearTimeout(this.startPowerUp);
	}

	hitElement( elementUserData ){

		if( this.props.status === 'stop'){
			return;
		}

		let element = this.stageElements.filter( element => {
			if( element.body && element.body.GetUserData().name === elementUserData.name ){
				return true
			}
			return false;
		})[0];

		let _score = elementUserData.score;

		let _scaleX = element.actor.orgScaleX;
		let _scaleY = element.actor.orgScaleY;
		window.Tweener.addTween(element.actor, {scaleX:_scaleX+0.2, scaleY:_scaleY+0.2, time:0.01,  transition:"easeInBounce", 
		  onComplete: function(){
		    window.Tweener.addTween(element.actor, {scaleX:_scaleX, scaleY:_scaleY, time:0.3,  transition:"easeOutBounce"} );
		  }
		});

		let t1 = new window.TextField();
		let f1 = new window.TextFormat("Verdana", 26, 0xFE5252, true);
		t1.selectable = false;
		t1.setTextFormat(f1);
		t1.text = _score;
		t1.width = t1.textWidth; 
		t1.height = t1.textHeight;
		t1.x = element.actor.x;
		t1.y = element.actor.y-70;
		this.stage.addChild(t1);
		window.Tweener.addTween(t1, {y:t1.y-100, alpha: 0, time:1,  transition:"easeOutExpo", 
		  onComplete: () => {
		    this.stage.removeChild(t1);
		  }
		});

		this.props.updateScore(_score);

	}	

	setWorldListiner(){
		let elementScore = ['b1','b2','b3','title'];
		let listener = new b2ContactListener();

		listener.BeginContact = (contact) => {
		  var userDataA = contact.GetFixtureA().GetBody().GetUserData();
		  var userDataB = contact.GetFixtureB().GetBody().GetUserData();
		  if( userDataB && elementScore.indexOf( userDataB.name ) !== -1 ){
		    this.hitElement(userDataB);
		  }
		  if( userDataA  && elementScore.indexOf( userDataA.name ) !== -1  ){
		    this.hitElement(userDataA);
		  }
		}
		this.world.SetContactListener(listener);
	}

	buildStage( stageWidth, stageHeight ){
		this.stageElements = stageElementsData(stageWidth , stageHeight ).map( (element) => {
			if( element.type ){
				return imageSpriteWithBody( this.stage, this.world, element );
			}else{
				return { actor: imageSprite( this.stage, element ) };
			}
		});
	}

	createPlatform(){

		// ------------ LEFT ------------
		let platformLeft = this.stageElements.filter( element => {
			if( element.body && element.body.GetUserData().name === 'platform-left' ){
				return true
			}
			return false;
		})[0];

		let pinLeft = this.stageElements.filter( element => {
			if( element.body && element.body.GetUserData().name === 'pin-left' ){
				return true
			}
			return false;
		})[0];
		
		this.bodies.push( platformLeft.body );
		this.actors.push( platformLeft.actor );

		let rjdL = new b2RevoluteJointDef();
		rjdL.Initialize(pinLeft.body, platformLeft.body, pinLeft.body.GetWorldCenter() );

		rjdL.motorSpeed = 5 * Math.PI;
		rjdL.maxMotorTorque = 4000;
		rjdL.enableMotor = true;
		rjdL.enableLimit = true;
		rjdL.lowerAngle = -10  * Math.PI/180;
		rjdL.upperAngle = 6 * (Math.PI/180);

		this.jointL = this.world.CreateJoint(rjdL);

		// ------------ RIGHT ------------
		
		let platformRight = this.stageElements.filter( element => {
			if( element.body && element.body.GetUserData().name === 'platform-right' ){
				return true
			}
			return false;
		})[0];

		this.bodies.push( platformRight.body );
		this.actors.push( platformRight.actor );

		let pinRight = this.stageElements.filter( element => {
			if( element.body && element.body.GetUserData().name === 'pin-right' ){
				return true
			}
			return false;
		})[0];

		let rjdR = new b2RevoluteJointDef();
		rjdR.Initialize(pinRight.body, platformRight.body, pinRight.body.GetWorldCenter() );

		rjdR.motorSpeed = 5 * -Math.PI;
		rjdR.maxMotorTorque = 4000;
		rjdR.enableMotor = true;
		rjdR.enableLimit = true;
		rjdR.lowerAngle = -6  * Math.PI/180;
		rjdR.upperAngle = 10 * (Math.PI/180);

		this.jointR = this.world.CreateJoint(rjdR);
	}

	createBall(type = null){

		let nBall = 5;
		if(type === 'powerup'){
			nBall = 15;
		}

		for (let i = 0; i <= nBall; i++) {
			let sizeRan = 20+Math.random()*10;
			let hw = sizeRan + Math.random()*15 * devicePixelRatio;
			let images = [Ball1,Ball2,Ball3,Ball4,Ball5];
			let image = images[ Math.floor(Math.random() * images.length) ];
			if(type === 'powerup'){
				image = BallPowerup;
			}
			let item = imageSpriteWithBody( this.stage, this.world, {
				imgUrl: image,
				imageSize: {width: 47, height: 47},
				type: 'ball',
				isDynamic: true,
				size: {width: hw, height: hw },
				position : { x: ( Math.random() * ( this.props.width * devicePixelRatio ) ), y: ( -500 + Math.random() * 500 ) }
			} );

			item.actor.addEventListener(MouseEvent.MOUSE_MOVE, (event)=>{
				let a = event.currentTarget;
				var i = this.actors.indexOf(a);
				if(i>=25 && Math.sqrt(a.mouseX*a.mouseX + a.mouseY*a.mouseY) > 100) return;
				this.bodies[i].ApplyImpulse(new b2Vec2(0, -1), this.bodies[i].GetWorldCenter());
			} );

			this.bodies.push(item.body);
			this.actors.push(item.actor);
		}
	}

	resizeStage( width, height ){
		this.stage.stageWidth = width;
		this.stage.stageHeight = height;

		this.stageElements.forEach( (element) => {
			this.removeItemFromStage(element.actor, element.body );
		});

		this.buildStage( width, height );
		this.createPlatform();

	}

	removeItemFromStage(actor, body = null){
		if( actor ){ this.stage.removeChild( actor );	}
		if( body ){ this.world.DestroyBody( body );	}
	}

	onEnterFrame(){
		this.world.Step(1 / 60,  3,  3);
		this.world.ClearForces();

		for(var i=0; i< this.actors.length; i++)
		{
			var body  = this.bodies[i];
			var actor = this.actors[i];
			var p = body.GetPosition();
			actor.x = p.x *100;
			actor.y = p.y *100;
			actor.rotation = body.GetAngle()*180/Math.PI;

			if(p.y > ( (this.props.height  * devicePixelRatio ) /100)+1 ){
				this.removeItemFromStage(actor, body);
			}
		}

	}

	render() {
	  return (
	  	<div style={ {position: 'absolute', top: 0, left: 0, zIndex: 100} }>
	  		<canvas id="canvas" ref="canvas" width={this.props.width} height={this.props.height} />
	  	</div>
	  );
	}
}

export default connect( null, { updateScore })( StageWrapper );
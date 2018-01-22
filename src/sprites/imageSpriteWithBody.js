import Box2D from 'box2d-es6';
import imageSprite from './imageSprite';

export default function imageSpriteWithBody( stage, world, option ){

	const	b2Vec2		= Box2D.Common.Math.b2Vec2,
	b2BodyDef	= Box2D.Dynamics.b2BodyDef,
	b2Body		= Box2D.Dynamics.b2Body,
	b2FixtureDef	= Box2D.Dynamics.b2FixtureDef,
	b2PolygonShape	= Box2D.Collision.Shapes.b2PolygonShape,
	b2CircleShape	= Box2D.Collision.Shapes.b2CircleShape;

	const defaultOption = {
		type: 'ball',
		imgUrl: null, 
		imageSize: {width: 0, height: 0},
		position: {x: 0, y: 0},
		rotation: 0, 
		size: null,
		userData:null
	}

	let setting = Object.assign({}, defaultOption, option);


	if( !setting.size ){
		setting.size = setting.imageSize;
	}

	const ratio = 200;
	const box2dRotation =  setting.rotation/180*Math.PI;
	let bxFixDef = new b2FixtureDef();

	if(setting.type === 'box'){
		bxFixDef.shape = new b2PolygonShape();

		bxFixDef.shape.SetAsOrientedBox(setting.size.width/ratio, setting.size.height/ratio, new b2Vec2(0, 0), box2dRotation);
	}else{
		bxFixDef.shape = new b2CircleShape();
		bxFixDef.shape.SetRadius(setting.size.width/ratio);
	}

	let bodyDef = new b2BodyDef();
	
	if( setting.isDynamic ){
		bxFixDef.density = 1;
	  bodyDef.type = b2Body.b2_dynamicBody;
	}else{
		bxFixDef.restitution = 1;	
		bodyDef.type = b2Body.b2_staticBody;
	}

	bodyDef.userData = setting;
	bodyDef.position.Set(setting.position.x/100, setting.position.y/100);

	let body = world.CreateBody(bodyDef);
	body.CreateFixture(bxFixDef);

	return {
		body : body,
		actor: setting.imgUrl != null ? imageSprite( stage, setting ) : null
	};
}
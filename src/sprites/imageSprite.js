export default function imageSprite( stage, option ){

	const defaultOption = {
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
	
	let bm = new window.Bitmap( new window.BitmapData(setting.imgUrl) );
	bm.x = -(setting.imageSize.width/2);
	bm.y = -(setting.imageSize.height/2);

	let sp = new window.Sprite();
	sp.scaleX = setting.size.width/setting.imageSize.width;
	sp.scaleY = setting.size.height/setting.imageSize.height;
	sp.x = setting.position.x;
	sp.y = setting.position.y;
	sp.rotation = setting.rotation;
	sp.addChild(bm);
	stage.addChild(sp);

	sp.orgScaleX = sp.scaleX;
	sp.orgScaleY = sp.scaleY;
	sp.userData = setting;

	return sp;
}
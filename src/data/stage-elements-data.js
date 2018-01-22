import B1Image from '../assets/b1.png';
import B2Image from '../assets/b2.png';
import B3Image from '../assets/b3.png';
import hny2018Image from '../assets/hny2018.png';
import textImage from '../assets/text.png';
import platformImage from '../assets/platform.png';

export default function stageElementsData( stageW , stageH ){
	return [
						{
							name: 'b1',
							type: 'ball',
							imgUrl: B1Image,
							imageSize: {width: 112, height: 112},
							position: {x: stageW*0.23, y: stageH*0.35},
							rotation: 10, 
							size: {width: 150, height: 150},
							score: 50
						},
						{
							name: 'b2',
							type: 'ball',
							imgUrl: B2Image,
							imageSize: {width: 119, height: 120},
							position: {x: stageW/2, y: stageH*0.15},
							rotation: 0, 
							size: {width: 180, height: 180},
							score: 50
						},
						{
							name: 'b3',
							type: 'ball',
							imgUrl: B3Image,
							imageSize: {width: 112, height: 119},
							position: {x: stageW*0.7, y: stageH*0.4},
							rotation: 0, 
							size: {width: 160, height: 160},
							score: 50
						},
						{
							name: 'title',
							type: 'box',
							imgUrl: hny2018Image,
							imageSize: {width: 285, height: 144},
							position: {x: stageW/2 , y: stageH*0.6 },
							rotation: 4, 
							score: 100
						},
						{
							name: 'text',
							imgUrl: textImage,
							imageSize: {width: 266, height: 34},
							position: {x: stageW/2 , y: (stageH*0.6)+ 110 },
							rotation: 0, 
							score: 100
						},
						{
							name: 'border-left',
							type: 'box',
							imgUrl: null,
							imageSize: {width: 10, height: stageH-100},
							position: {x: -10, y: (stageH/2) - 100 }
						},
						{
							name: 'border-right',
							type: 'box',
							imgUrl: null,
							imageSize: {width: 10, height: stageH-100},
							position: {x: stageW, y: (stageH/2) - 100 }
						},
						{
							name: 'platform-left',
							type: 'box',
							imgUrl: platformImage,
							imageSize: {width: 703, height: 102},
							position: {x: ( (stageW*0.45) *0.4) , y: stageH-10 },
							rotation: 4,
							isDynamic: true,
							size : {width: (stageW*0.45), height: 80}
						},
						{
							name: 'platform-right',
							type: 'box',
							imgUrl: platformImage,
							imageSize: {width: 703, height: 102},
							position: {x: ( stageW-(stageW*0.45) *0.4) , y: stageH-10 },
							rotation: -4,
							isDynamic: true,
							size : {width: (stageW*0.45), height: 80}
						},
						{
							name: 'pin-left',
							type: 'ball',
							imgUrl: null,
							imageSize: {width: 10, height: 10},
							position: {x: ( (stageW*0.45) *0.4) , y: stageH-10 },
						},
						{
							name: 'pin-right',
							type: 'ball',
							imgUrl: null,
							imageSize: {width: 10, height: 10},
							position: {x: ( stageW-(stageW*0.45) *0.4) , y: stageH-10 },
						}
					];
}
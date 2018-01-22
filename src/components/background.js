import React, { Component } from 'react';
import _ from 'lodash';
import BgImage from '../assets/bg.svg';
import BgImage2 from '../assets/bg2.svg';

import styled from 'styled-components';

const BackgroundWrapper = styled.div`
  position: fixed;
  top: 0;
  bottom: 0; 
  left: 0;
  right: 0;
  width: 100%;
  user-select: none;
  z-index:0;
`;

const Bg = styled.div`
  background: url(${BgImage2}) repeat-x center top;
  position: fixed;
  top: 0;
  bottom: 0; 
  left: 0;
  right: 0;
  width: 100%;
  user-select: none;
  z-index:1;
`;

const BgPogress = styled.div`
  background: url(${BgImage}) repeat-x center top;
  background-attachment: fixed;
  height: ${ props => props.height };
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
  user-select: none;
  z-index:2;
  transition: height 0.6s ease;
`;

export default class Background extends Component {
	constructor(props) {
     super(props);
     this.lastUpdate = 0;
     this.shouldRender = false;
 	}

 	componentWillReceiveProps(props) {
 		if(props.height === 100 || ( props.height < 50 && props.height <= this.lastUpdate - 5 )) {
 			this.lastUpdate = props.height;
 			this.shouldRender = true;
 		}else{
 			this.shouldRender = false;
 		}
  }  

  shouldComponentUpdate() {
      return this.shouldRender;
  }

	render(){
		return(
			<BackgroundWrapper>
				<BgPogress height={ this.props.height+'%' } />
				<Bg />
			</BackgroundWrapper>
		);
	}

}
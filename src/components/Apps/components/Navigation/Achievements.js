// BASIC
import React, { Component } from 'react'
import styled, {css} from 'styled-components';
// COMPONENTS
// import Points from './components/Points'
// import Hamburger from './components/Hamburger/Hamburger'

const AchievementsComponent = styled.div`
	display: flex;
	width: 100%;
	justify-content: space-between;
`

const Achievement = styled.div`
	color: var(--color-secondary);
`
const Value = styled.strong`
	color: var(--color-main);
	${props =>
		props.empty &&
		css`
			color: var(--color-primary);
		`
	};
`
const Add = styled.b`
	position: relative;
	::after {
		content: '${props => props.points}';
		position: absolute;
		color: var(--color-primary);
		transform: translateX(-10px);
		transition: all 0.3s ease;
		opacity: 0;
		${props =>
			props.show &&
			css`
				transform: translateX(10px);
				opacity: 1;
			`
		};
	}
`

class Achievements extends Component {
	render() {
		return (
				<AchievementsComponent>
					<Achievement>
						Punkty: {this.props.points !== 0 ? <Value>{this.props.points}</Value>	: <Value empty>{this.props.points}</Value>}
						<Add show={this.props.pointsAnimation} points={this.props.pointsAnimation} />
					</Achievement>
					<Achievement>
						Poziom: <Value>{this.props.level}</Value>
					</Achievement>
				</AchievementsComponent>
		);
	}
}

export default Achievements
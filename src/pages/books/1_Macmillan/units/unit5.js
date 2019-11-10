// BASIC
import React, {Component} from 'react';
import {Route} from 'react-router-dom';
// COMPONENTS
import WorkPage from '../../../../components/Work/Work'
// IMAGES
import working from '../../../../images/working.png'

class Unit5 extends Component {
	render() {
		return (
			<>
				{/* Rozdział 5 - Życie rodzinne i towarzyskie */}
				{/* Etapy życia */}
				<Route path="/macmillan/rozdział-5/etapy-życia" render={(props) =>
					<WorkPage
						{...props}
						title="Prace trwają"
						image={working}
					/>
				}/>
				{/* Członkowie rodziny, koledzy i przyjaciele */}
				<Route path="/macmillan/rozdział-5/członkowie-rodziny-koledzy-i-przyjaciele" render={(props) =>
					<WorkPage
						{...props}
						title="Prace trwają"
						image={working}
					/>
				}/>
				{/* Czynności życia codziennego */}
				<Route path="/macmillan/rozdział-5/czynności-życia-codziennego" render={(props) =>
					<WorkPage
						{...props}
						title="Prace trwają"
						image={working}
					/>
				}/>
				{/* Formy spędzania czasu wolnego */}
				<Route path="/macmillan/rozdział-5/formy-spędzania-czasu-wolnego" render={(props) =>
					<WorkPage
						{...props}
						title="Prace trwają"
						image={working}
					/>
				}/>
				{/* Święta i uroczystości */}
				<Route path="/macmillan/rozdział-5/święta-i-uroczystości" render={(props) =>
					<WorkPage
						{...props}
						title="Prace trwają"
						image={working}
					/>
				}/>
				{/* Styl życia, konflikty i problemy */}
				<Route path="/macmillan/rozdział-5/styl-życia-konflikty-i-problemy" render={(props) =>
					<WorkPage
						{...props}
						title="Prace trwają"
						image={working}
					/>
				}/>
				{/* Inne */}
				<Route path="/macmillan/rozdział-5/inne" render={(props) =>
					<WorkPage
						{...props}
						title="Prace trwają"
						image={working}
					/>
				}/>
				{/* Test */}
				<Route path="/macmillan/rozdział-5/test" render={(props) =>
					<WorkPage
						{...props}
						title="Prace trwają"
						image={working}
					/>
				}/>
			</>
		);
	}
}

export default Unit5;

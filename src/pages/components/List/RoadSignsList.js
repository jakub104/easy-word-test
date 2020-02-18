// BASIC
import React, { Component } from 'react'
import styled from 'styled-components'
// STYLES
import Global from '../../../Components/Styles/Global'
import { Wrapper } from '../../../Components/Styles/Components'
// COMPONENTS
import Book from './components/Book'
import Header from './components/ListElement/Header'
import ListWrapper from './components/ListElement/ListWrapper'
import ListElement from './components/ListElement/ListElement'
import ListElementTest from './components/ListElement/ListElementTest'
// FILES
import roadSignsBook from '../../../Components/Images/road-signs-book.png'

const ListElementWrapper = styled.div``

const Separator = styled.hr`
	display: none;
	@media (min-width: 800px) {
		display: flex;
		width: 0;
		border: 0.5px solid gold;
		height: calc(100vh - 60px);
		margin: 0 30px;
	}
`

const SectionTitle = styled.h3`
	color: lightgray;
`;

const SectionList = styled.ul`
	list-style: none;
`

class List extends Component {
	render() {
		return (
			<>
				<Global />
				<Wrapper list>
					<Book src={roadSignsBook}/>
					<Separator />
					<ListElementWrapper>
						<Header />
						<ListWrapper>
							<SectionTitle>1 - Znaki drogowe pionowe</SectionTitle>
							<SectionList>
								<ListElement content="Znaki ostrzegawcze" path="/znaki-drogowe/rozdział-1/znaki-ostrzegawcze" />
								<ListElement content="Znaki zakazu" path="/znaki-drogowe/rozdział-1/znaki-zakazu" />
								<ListElement content="Znaki nakazu" path="/znaki-drogowe/rozdział-1/znaki-nakazu" />
								<ListElement content="Znaki informacyjne" path="/znaki-drogowe/rozdział-1/znaki-informacyjne" />
								<ListElement content="Znaki kierunku i miejscowości" path="/znaki-drogowe/rozdział-1/znaki-kierunku-i-miejscowości" />
								<ListElement content="Znaki uzupełniające" path="/znaki-drogowe/rozdział-1/znaki-uzupełniające" />
								<ListElement content="Tabliczki do znaków drogowych" path="/znaki-drogowe/rozdział-1/tabliczki-do-znaków-drogowych" />
								<ListElement content="Znaki dodatkowe" path="/znaki-drogowe/rozdział-1/znaki-dodatkowe" />
								<ListElementTest content="Test" path="/znaki-drogowe/rozdział-1/test" />
							</SectionList>
							<SectionTitle>2 - Znaki drogowe poziome</SectionTitle>
							<SectionList>
								<ListElementTest content="Test" path="/znaki-drogowe/rozdział-2/test" />
							</SectionList>
							<SectionTitle>3 - Sygnały świetlne</SectionTitle>
							<SectionList>
								<ListElement content="Sygnały świetlne dla kierujących i pieszych" path="/znaki-drogowe/rozdział-3/sygnały-świetlne-dla-kierujących-i-pieszych" />
								<ListElement content="Sygnały świetlne dla kierujących pojazdami wykonującymi odpłatny przewóz osób na regularnych liniach" path="/znaki-drogowe/rozdział-3/sygnały-świetlne-dla-kierujących-pojazdami-wykonującymi-odpłatny-przewóz-osób-na-regularnych-liniach" />
								<ListElementTest content="Test" path="/znaki-drogowe/rozdział-3/test" />
							</SectionList>
						</ListWrapper>
					</ListElementWrapper>
				</Wrapper>
			</>
		);
	}
}

export default List
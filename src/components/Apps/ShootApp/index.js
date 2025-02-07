// BASIC
import React, {Component} from 'react'
// import styled, { css } from 'styled-components'
// import greatAnimationData from '../lotties/data/72-favourite-app-icon.json'
// import goodAnimationData from '../lotties/data/433-checked-done.json'
import latinize from 'latinize'
import styled from 'styled-components'
import {db, au} from '../../../Config/firebase'
// COMPONENTS
import Preloader from '../../Preloader'
import Cathegory from '../components/Cathegory'
import Achievements from '../components/Navigation/Achievements'
import Word from '../components/Word'
import Picture from '../components/Picture'
import Input from '../components/WritingApp/Input'
import Choise from './components/Choise'
import AppNavigation from '../components/AppNavigation';
import Answer from '../components/Answer'
import SocialMedia from '../components/SocialMedia'
import Congratulations from '../components/Congratulations'
import Information from '../components/Information'
import End from '../components/End'
import Premium from '../components/Premium'
import Ban from '../components/Ban'
// FUNCTIONS
import getWord from '../functions/chooseWord'
import female from '../functions/createFemaleTranslations'
import similarTranslation from '../similarTranslation'

const AppSite = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	width: 100vw;
	height: 100vh;
	padding: 20px;
	text-align: center;
`
const Center = styled.div`
	height: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: space-evenly;
	/* background-color: gray; */
	margin-bottom: 30px;
`
class App extends Component {
	state = {
		banTime: undefined,
		isAdmin: false,
		premium: false,
		languageOrder: {
			word: 'word',
			translation: 'translation'
		},
		langChanges: 1,
		answers: 5,
		userId: null,
		showInformation: false,
		points: 0,
		appLevel: 0,
		goal: 30,
		prevGoal: 0,
		experience: 0,
		words: null,
		goodAnswers: [],
		baseWord: null,
		hideAnswer: true,
		hideKeyboard: false,
		answer: '',
		counter: 0,
		info: {},
		badAnswers: [],
		waitRounds: 0,
		lastAnswer: true,
		appsComplete: 0,
		chooseWords: [],
		// animations
		endMessage: false,
		animation: '',
		message: false,
		pointsAnimation: null
	}
	componentDidMount() {
		let {bookName, unitNumber} = this.props.match.params;
		if (bookName === 'repetytorium') {
			bookName = 'book_01'
		}
		else if (bookName === 'wsip') {
			bookName = 'book_02'
		}
		else if (bookName === 'jezyk-angielski-zawodowy') {
			bookName = 'book_03'
		}
		else if (bookName === 'znaki-drogowe') {
			bookName = 'book_04'
		}
		else if (bookName === 'czasowniki-nieregularne') {
			bookName = 'book_05'
		}
		let partNumber;
		if (unitNumber.includes('.') && Number(unitNumber)) {
			partNumber = unitNumber.replace(/[0-9]*\./g,'');
			unitNumber = unitNumber.replace(/\.[0-9]*/g, '').padStart(2, '0');
		}
		else if (Number(unitNumber)) {
			unitNumber = unitNumber.padStart(2, '0');
		}
		else {
			alert('nie ma strony!');
		}
		const unit = `unit_${unitNumber}`;
		const part = partNumber ? `part_${partNumber.padStart(2, '0')}` : 'test';
		au.onAuthStateChanged(user => {
			db.collection('books').get().then((snaps) => {
				let units = [];
				let result = {};
				snaps.forEach(snap => {
					if (snap.data().info.id.includes(this.props.match.params.bookName)) {
						units = units.concat(Object.values(snap.data()).slice(1))
					}
				})
				units.forEach((prop, index) => result[`unit_${(index + 1).toString().padStart(2, '0')}`] = prop);
				let partWords = [];
				const words = result[unit];
				if (part !== 'test') {
					partWords = Object.values(words.parts[part].words);
				}
				else {
					Object.values(words.parts).forEach(({words}) => {
						words = words ? Object.values(words) : [];
						partWords = partWords.concat(Object.values(words));
					});
				}
				this.setState(() => {
					return {
						words: partWords,
						baseWord: getWord(partWords),
						info: {
							unit,
							part,
							bookName
						}
					};
				}, () => {
					this.filterWords('empty');
				});

			})
			if(user) {
				user.getIdTokenResult().then(idTokenResult => {
					if (idTokenResult.claims.admin) {
						this.setState({isAdmin: true})
					}
					else {
						this.setState({isAdmin: false})
					}
					user.admin = idTokenResult.claims.admin
				})
				this.setState({userId: user.uid});
				db.collection('users').doc(user.uid).onSnapshot(snap => {
					const book = bookName;
					const app = snap.data()['easy-word']['points'][book].units[unit].parts[part]
					const points = app.points;
					const appLevel = app.level;
					const goodAnswers = app.goodAnswers ? app.goodAnswers : [];
					const experience = snap.data()['easy-word'].experience;
					this.setState({
						points, experience, appLevel, goodAnswers,
						premium: snap.data()['easy-word'].premium,
						banTime: snap.data()['easy-word'].banTime,
						langChanges: snap.data()['easy-word'].langChanges,
						answers: snap.data()['easy-word'].answers,
						languageOrder: app.languageOrder ? app.languageOrder : this.state.languageOrder,
						appsComplete: app.complete ? app.complete : this.state.appsComplete
					})
					if (appLevel === 1) {
						this.setState({prevGoal: 0});
						this.setState({goal: 10});
					}
					else if (appLevel === 2) {
						this.setState({prevGoal: 10});
						this.setState({goal: 30});
					}
					else if (appLevel === 3) {
						this.setState({prevGoal: 30});
						this.setState({goal: 60});
					}
					else if (appLevel === 4) {
						this.setState({prevGoal: 60});
						this.setState({goal: 100});
					}
					else if (appLevel === 5) {
						this.setState({prevGoal: 100});
						this.setState({goal: 150});
					}
					else if (appLevel === 6) {
						this.setState({prevGoal: 150});
						this.setState({goal: 210});
					}
					else if (appLevel === 7) {
						this.setState({prevGoal: 210});
						this.setState({goal: 280});
					}
					else if (appLevel === 8) {
						this.setState({prevGoal: 280});
						this.setState({goal: 460});
					}
					else if (appLevel === 9) {
						this.setState({prevGoal: 460});
						this.setState({goal: 550});
					}
					else if (appLevel === 10) {
						this.setState({prevGoal: 550});
						this.setState({goal: 650});
					}
					if (this.state.points >= this.state.goal) {
						this.showNotification();
					}
				});
			}
			else {
				this.setState({showInformation: true})
			}
		})
	}
	edit = (variable) => {
		if (this.state.isAdmin && typeof variable === 'string') {
			const unit = Number(this.state.info.unit.replace('unit_', ''));
			const bookName = unit <= 10 ? this.props.match.params.bookName : `${this.props.match.params.bookName}2`
			db.collection('books').doc(bookName).get().then(snap => {
				const {unit, part} = this.state.info;
				const words = Object.values(snap.data()[unit].parts[part].words);
				let wordIndex;
				words.forEach((object, index) => {
					if (object.word1 === this.state.baseWord.word1) {
						wordIndex = index;
					}
				})
				console.log(snap.data())
				const data = prompt(`${variable}:`, this.state.baseWord[variable]);
				console.log(`${unit}.parts.${part}.words.${wordIndex}.${variable}`)
				if (data) {
					db.collection('books').doc(bookName).update({
						[`${unit}.parts.${part}.words.${wordIndex}.${variable}`]: data
					})
				}
			})
		}
	}
	showNotification = () => {
		const {unit, part, bookName} = this.state.info;
		const appLevel = `easy-word.points.${bookName}.units.${unit}.parts.${part}.level`;
		if (this.state.appLevel <= 10) {
			this.setState({prize: this.state.goal * this.state.appLevel});
			if (this.state.userId) {
				db.collection('users').doc(this.state.userId).update({
					'easy-word.experience': this.state.experience + this.state.goal * this.state.appLevel,
					[appLevel]: this.state.appLevel + 1
				})
			}
			this.handleMessage()
		}
	}
	getNew = () => {
		if (this.state.hideAnswer === true || this.state.answer === '') {
			if (this.state.badAnswers.length !== 0) {
				if (this.state.badAnswers.length === 1 && this.state.lastAnswer === false && this.state.words.length !== 0) {
					this.setState({
						baseWord: getWord(this.state.words.filter((word) => word.word1 !== this.state.baseWord.word1)),
					});
				}
				else {
					this.setState({
						baseWord: this.state.badAnswers[0],
						badAnswers: this.state.badAnswers.filter((answer, index) => index !== 0),
					});
				}
			}
			else {
				this.setState({
					baseWord: getWord(this.state.words),
				});
			}
			this.chooseWords()
		}
		else {
			alert('Wpisz prawidłowe słowo, aby przejść dalej ;)');
		}
	}
	filterWords = (x) => {
		console.log(x)
		const {bookName, unit, part} = this.state.info;
		const app = `easy-word.points.${bookName}.units.${unit}.parts.${part}`;
		let goodAnswers = this.state.goodAnswers
		if (x !== 'empty') {
			if (!this.state.goodAnswers.includes(this.state.baseWord.word1)) {
				goodAnswers = this.state.goodAnswers.concat({word: this.state.baseWord.word1, translation: this.state.baseWord.translation1});
			}
		}
		if (this.state.userId) {
			db.collection('users').doc(this.state.userId).update({
				[`${app}.goodAnswers`]: goodAnswers
			})
		}
		else {
			this.setState({goodAnswers})
		}
		const goodWords = [];
		goodAnswers.forEach((answer) => goodWords.push(answer.word))
		const filtered = this.state.words.filter(({word1}) => {
			return !goodWords.includes(word1)
		});
		if (filtered.length !== 0 || this.state.badAnswers.length !== 0) {
			this.setState(() => {
				return {
					words: filtered,
				};
			}, () => {
				if (x === 'empty') {
					this.chooseWords();
				}
			});
		}
		else {
			db.collection('users').doc(this.state.userId).update({
				[`${app}.goodAnswers`]: [],
				[`${app}.complete`]: this.state.appsComplete + 1
			});
			db.collection('books').doc(this.props.match.params.bookName).get().then((snap) => {
				let partWords;
				const words = snap.data()[unit];
				if (part !== 'test') {
					partWords = Object.values(words.parts[part].words);
				}
				else {
					Object.values(words.parts).forEach(({words}) => {
						words = words ? Object.values(words) : [];
						partWords = partWords.concat(Object.values(words));
					});
				}
				this.setState(() => {
					return {
						words: partWords,
					};
				}, () => {
					// this.chooseWords();
				});
			});
			if (x !== 'empty') {
				this.endMessage();
			}
		}
	}
	chooseWords = () => {
		console.log(this.state.words.length);
		// console.log(this.state.baseWord);
		const w1 = this.state.baseWord.word1;
		const choose1 = getWord(this.state.words.filter(({word1}) => word1 !== w1))
		const choose2 = getWord(this.state.words.filter(({word1}) => word1 !== w1 && word1 !== choose1.word1))
		const choose3 = getWord(this.state.words.filter(({word1}) => word1 !== w1 && word1 !== choose1.word1 && word1 !== choose2.word1))
		const chooseWords = [
			this.state.baseWord,
			choose1 ? choose1 : {
				word1: getWord(this.state.goodAnswers).word,
				translation1: getWord(this.state.goodAnswers).translation
			},
			choose2 ? choose2 : {
				word1: getWord(this.state.goodAnswers).word,
				translation1: getWord(this.state.goodAnswers).translation
			},
			choose3 ? choose3 : {
				word1: getWord(this.state.goodAnswers).word,
				translation1: getWord(this.state.goodAnswers).translation
			}
		];
		console.log(chooseWords);
		const shuffle = (array) => {
			for (let i = array.length - 1; i > 0; i--) {
				const j = Math.floor(Math.random() * (i + 1));
				[array[i], array[j]] = [array[j], array[i]];
			}
			return array;
		}
		this.setState({
			chooseWords: shuffle(chooseWords)
		});
	}
	check = (e) => {
		let userWord = e.target.innerHTML;
		const translation = this.state.languageOrder.translation;
		const translation1 = this.state.baseWord[`${translation}1`];
		const translation2 = this.state.baseWord[`${translation}2`];
		const translation3 = this.state.baseWord[`${translation}3`];
		const {bookName, unit, part} = this.state.info;
		const app = `easy-word.points.${bookName}.units.${unit}.parts.${part}`;
		const appPoints = `${app}.points`;
		if (
			userWord === translation1 ||
			userWord === translation2 ||
			userWord === translation3
			) {
				const target = e.target
				this.setState({
					answer: '',
					hideAnswer: false,
					counter: 0
				});
				if (this.state.hideAnswer) {
					this.setState({
						lastAnswer: true
					});
				}
				e.persist();
				this.filterWords();
				this.setState({
					animation: 'great',
					pointsAnimation: '+2'
				});
				setTimeout(() => {
					this.setState({chooseWords: []})
					if (this.state.userId) {
						db.collection('users').doc(this.state.userId).update({
							[appPoints]: this.state.points + 2,
							'easy-word.experience': this.state.experience + 2
						})
					}
					else {
						this.setState({points: this.state.points + 2})
					}
					target.innerHTML = '';
					this.getNew();
					this.setState({
						hideAnswer: true,
						animation: '',
						pointsAnimation: null,
					});
				}, 1000)
		}
		else {
			console.log(e.target.style.opacity = 0);
			console.log(e.target.style.cursor = 'default');
			this.getAnswer()
		}
	}
	getAnswer = () => {
		this.setState({
			badAnswers: !this.state.badAnswers.includes(this.state.baseWord) ? this.state.badAnswers.concat(this.state.baseWord) : this.state.badAnswers,
			waitRounds: this.state.waitRounds + 1,
			lastAnswer: false
		});
		if (this.state.hideAnswer !== false) {
			const translation = this.state.languageOrder.translation;
			let translation1 = this.state.baseWord[`${translation}1`];
			let translation2 = this.state.baseWord[`${translation}2`];
			let translation3 = this.state.baseWord[`${translation}3`];
			const full_translation1 = female(this.state.baseWord)[`full_${translation}1`];
			const full_translation2 = female(this.state.baseWord)[`full_${translation}2`];
			const full_translation3 = female(this.state.baseWord)[`full_${translation}3`];
			const {bookName, unit, part} = this.state.info;
			const appPoints = `easy-word.points.${bookName}.units.${unit}.parts.${part}.points`;
			if (full_translation1 !== undefined) {
				translation1 = full_translation1;
			}
			if (full_translation2 !== undefined) {
				translation2 = full_translation2;
			}
			if (full_translation3 !== undefined) {
				translation3 = full_translation3;
			}
			if (this.state.points >= 2) {
				if (this.state.userId) {
					db.collection('users').doc(this.state.userId).update({
						[appPoints]: this.state.points - 2
					})
				}
				else {
					this.setState({points: this.state.points - 2})
				}
			}
			else {
				this.setState({points: 0});
			}
			let answer = [translation1, translation2, translation3].join('  ').trim().replace('    ', ', ').replace('  ', ', ').trim();
			this.setState({answer: answer, hideAnswer: false})
		}
	}
	keyPress = (e) => {
		if (e.key === 'Enter' && e.shiftKey) {
			this.getNew();
		}
		
		else if (e.key === 'Enter') {
			this.getAnswer();
		}
	}
	handleMessage = () => {
		this.setState({hideKeyboard: true})
		setTimeout(() => {
			!this.state.message ? this.setState({message: true}) : this.setState({message: false});
			this.setState({hideKeyboard: false})
		}, 50);
		// alert('o')
	}

	closeInformation = () => {
		this.setState({showInformation: false});
	}

	logIn = () => {
		this.props.history.push(`/login`);
	}
	endMessage = () => {
		if (!this.state.appComplete) {
			!this.state.endMessage ? this.setState({endMessage: true}) : this.setState({endMessage: false})
		}
		this.changeLanguage('free');
	}
	changeLanguage = (free) => {
		const {bookName, unit, part} = this.state.info;
		const app = `easy-word.points.${bookName}.units.${unit}.parts.${part}`;
		if (this.state.userId) {
			db.collection('users').doc(this.state.userId).get().then(snap => {
				const languageOrder = snap.data()['easy-word'].points[bookName].units[unit].parts[part].languageOrder;
				const langChanges = snap.data()['easy-word'].langChanges;
					if (!languageOrder || languageOrder.word === 'word') {
						if (free !== 'free') {
							if (langChanges > 0) {
								db.collection('users').doc(this.state.userId).update({
									'easy-word.langChanges': langChanges - 1
								})
								db.collection('users').doc(this.state.userId).update({
									[`${app}.languageOrder`]: {
										word: 'translation',
										translation: 'word'
									}
								})
							}
							else {
								alert('Nie posiadasz juz zmian języka! Przejdź do sklepu, by kupić ich więcej ;)')
							}
						}
						else {
							db.collection('users').doc(this.state.userId).update({
								[`${app}.languageOrder`]: {
									word: 'translation',
									translation: 'word'
								}
							})
						}
					}
					else {
						if (free !== 'free') {
							if (langChanges > 0) {
								db.collection('users').doc(this.state.userId).update({
									'easy-word.langChanges': langChanges - 1
								})
								db.collection('users').doc(this.state.userId).update({
									[`${app}.languageOrder`]: {
										word: 'word',
										translation: 'translation'
									}
								})
							}
							else {
								alert('Nie posiadasz juz zmian języka! Przejdź do sklepu, by kupić ich więcej ;)')
							}
						}
						else {
							db.collection('users').doc(this.state.userId).update({
								[`${app}.languageOrder`]: {
									word: 'word',
									translation: 'translation'
								}
							})
						}
					}
			})
		}
		else {
			if (this.state.langChanges > 0) {
				this.state.languageOrder.word === 'word' ? (
					this.setState({
						languageOrder: {
							word: 'translation',
							translation: 'word'
						},
						langChanges: this.state.langChanges - 1
					})
				) : (
					this.setState({
						languageOrder: {
							word: 'word',
							translation: 'translation'
						},
						langChanges: this.state.langChanges - 1
					})
				)
			}
			else {
				alert('Zaloguj się, aby móc dalej korzystać ze zmiany języka!')
			}
		}
	}
	hint = () => {
		if (this.state.hideAnswer) {
			if (this.state.userId) {
				db.collection('users').doc(this.state.userId).get().then(snap => {
					const answers = snap.data()['easy-word'].answers;
					if (answers > 0) {
						db.collection('users').doc(this.state.userId).update({
							'easy-word.answers': answers - 1
						});
						this.setState({
							badAnswers: this.state.badAnswers.concat(this.state.baseWord),
							waitRounds: this.state.waitRounds + 1,
							lastAnswer: false,
							hideAnswer: false,
							answer: this.state.baseWord[`${this.state.languageOrder.translation}1`]
						})
					}
					else {
						alert('Wykorzystałeś już wszystkie podpowiedzi! Przejdź do sklepu, aby kupic ich więcej ;)')
					}
	
				})
			}
			else {
				if (this.state.answers > 0) {
					document.getElementById('answer').style.color = 'green';
					this.setState({
						badAnswers: this.state.badAnswers.concat(this.state.baseWord),
						waitRounds: this.state.waitRounds + 1,
						lastAnswer: false,
						answers: this.state.answers - 1,
						hideAnswer: false,
						answer: this.state.baseWord[`${this.state.languageOrder.translation}1`]
					})
				}
				else {
					alert('Zaloguj się, aby skorzystać z wiekszej ilości podpowiedzi!')
				}
			}
		}
		else {
			alert('Po co chcesz wykorzystać podpowiedź? Masz ją przecież podane 😅')
		}
	}
	render = () => {
		let baseWord = {};
		if (this.state.baseWord) {
			baseWord = this.state.baseWord;
		}
		const word = this.state.languageOrder.word;
		// replace empty images
		let image = baseWord.image;
		if (image === `url`) {
			image = `https://fakeimg.pl/647x400/?text=${latinize(baseWord[`${word}1`])}`;
		}
		// subtype and subsubtype exceptions
		let cathegory = baseWord.type;
		if(baseWord.subtype !== undefined) {
			cathegory = `${cathegory} (${baseWord.subtype})`;
		}
		
		else if (baseWord.subsubtype !== undefined) {
			cathegory = `${cathegory} (${baseWord.subsubtype})`;
		}
		// word2 and word3 exceptions
		let word1 = baseWord[`${word}1`];
		if(baseWord[`${word}3`]) {
			word1 = `${word1} / ${baseWord[`${word}2`]} / ${baseWord[`${word}3`]}`;
		}
		else if(baseWord[`${word}2`]) {
			word1 = `${word1} / ${baseWord[`${word}2`]}`;
		}

		return (
			<AppSite>
				<Preloader />
				{!this.state.banTime ? <> {this.state.premium ? <>
						<Cathegory content={cathegory} />
						<Achievements points={this.state.points} level={this.state.appLevel} pointsAnimation={this.state.pointsAnimation}/>
						<Center>
							<Word content={word1} />
							<Picture
								isAdmin={this.state.isAdmin}
								onEdit={this.edit}
								animation={this.state.animation}
								onClick={this.deleteImg}
								src={image}
								word={word}
								link={`https://pxhere.com/pl/photos?q=${baseWord[`${word}1`]}`}
								answer={this.state.answer}
							/>
							{/* <Input readOnly={this.state.hideKeyboard} onChange={this.check} press={this.keyPress} points={this.state.points} goal={this.state.goal} prevGoal={this.state.prevGoal} /> */}
							<Choise answer={this.state.answer} check={this.check} words={this.state.chooseWords} translation={`${this.state.languageOrder.translation}1`} />
							<AppNavigation check={this.getAnswer} change={this.getNew} />
						</Center>
						{/* <Answer hideAnswer={this.state.hideAnswer} text={this.state.answer} /> */}
						{this.state.showInformation ? <Information onClick={this.logIn} onBack={this.closeInformation} /> : ''}
						{/* <Congratulations preview={this.state.message} level={this.state.appLevel} prize={this.state.prize} onClick={this.handleMessage} /> */}
						<End part={this.state.info.part} bookName={this.props.match.params.bookName} onBack={this.endMessage} show={this.state.endMessage} />
					</> : <Premium game="EasyShoot" />}
				</> : <Ban time={this.state.banTime} />}
				{/* <Congratulations preview='true' level={this.state.appLevel} prize={this.state.prize} onClick={this.handleMessage} /> */}
				<SocialMedia premium={this.state.premium} lang={this.state.languageOrder} langChanges={this.state.langChanges} changeLanguage={this.changeLanguage} answers={this.state.answers} hint={this.hint} />
			</AppSite>
		);
	}
}

export default App
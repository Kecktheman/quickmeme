import { h, Component } from 'preact';
import Meme from '../components/meme/meme';
import './app.css';

/* Required for exstenstion manifest */
import img16 from '../images/quickmeme_16.png';
import img32 from '../images/quickmeme_32.png';
import img48 from '../images/quickmeme_48.png';
import img128 from '../images/quickmeme_128.png';

export default class App extends Component {
	loadMemes(url) {
		if (this.firstLoad !== '' && url === undefined) {
			// memes already loaded, fetch those instead
			console.warn(
				'Memes already fetched, ..getting them for ya!',
				this.firstLoad
			);
			this.setState(
				{
					memes: [],
					message: ''
				},
				() => {
					this.setState({
						memes: this.firstLoad
					});
				}
			);
			document.querySelectorAll('.lds-default')[0].classList.add('hide');
		} else {
			// memes not in memory, loading from api
			console.warn('Fetching memes..');

			const apiKey = 'f415da48218c88a';
			let requestUrl = null;

			if (url) {
				requestUrl = url;
			} else {
				requestUrl =
					'https://api.imgur.com/3/gallery/hot/viral/0.json?page=' +
					this.state.page;
			}

			this.setState({
				memes: []
			});

			let getStuff = new Promise(resolve => {
				let req = new XMLHttpRequest();

				req.onreadystatechange = function() {
					if (req.readyState === 4 && req.status === 200) {
						console.warn('Processing request...');

						if (req.responseText === 'Not found') {
							console.warn('Imgur album not found.');
						} else {
							let json = JSON.parse(req.responseText);
							console.warn('jonson', json);

							resolve(json);
						}
					} else {
						console.warn('Error with Imgur Request.');
					}
				};
				req.open('GET', requestUrl, true); // true for asynchronous
				req.setRequestHeader('Authorization', 'Client-ID ' + apiKey);
				req.send(null);
			});

			getStuff.then(value => {
				if (this.firstLoad === '') {
					this.firstLoad = value.data;
				}

				this.setState({
					memes: value.data,
					showMore: true
				});
				document.querySelectorAll('.lds-default')[0].classList.add('hide');
			});
		}
	}

	loadMore() {
		this.setState({
			page: this.state.page + 1
		});
		this.loadMemes();
	}

	setSearchQuery(e) {
		if (typeof e === 'object') {
			this.setState({
				searchQ: e.target.value
			});
		} else if (typeof e === 'string') {
			this.setState(
				{
					searchQ: e
				},
				this.searchQuery
			);
		} else {
			console.warn('No valid type of search:', typeof e);
		}
	}

	searchQuery() {
		let url = '';
		console.log('Searching for ', this.state.searchQ, '...');
		if (this.state.searchQ !== '') {
			url =
				'https://api.imgur.com/3/gallery/search/top/all/0?q=' +
				this.state.searchQ;
			this.setState(
				{
					message: 'Showing results for: "' + this.state.searchQ + '"',
					errorMsg: null,
					showMore: false
				},
				this.scroll
			);
		} else {
			url = 'https://api.imgur.com/3/gallery/hot/viral/0.json?page=0';
			this.setState({
				message: null,
				errorMsg:
					'insufficiens search string: ' +
					this.state.searchQ +
					', showing most viral',
				showMore: false
			});
		}

		this.setState({
			memes: []
		});
		this.loadMemes(url);
	}

	showSecondary() {
		this.state.showSecondary === true
			? this.setState({ showSecondary: false })
			: this.setState({ showSecondary: true });
	}

	scroll() {
		window.requestAnimationFrame(() => {
			document.querySelector('#header').scrollIntoView({ behavior: 'smooth' });
		});
	}

	constructor(props) {
		super(props);
		this.state = {
			memes: [],
			page: 0,
			searchQ: '',
			errorMsg: null,
			showSecondary: false,
			showMore: false
		};

		this.firstLoad = '';

		this.loadMemes = this.loadMemes.bind(this);
		this.setSearchQuery = this.setSearchQuery.bind(this);
		this.searchQuery = this.searchQuery.bind(this);
		this.showSecondary = this.showSecondary.bind(this);
		this.loadMore = this.loadMore.bind(this);
		this.scroll = this.scroll.bind(this);
	}

	componentDidMount() {
		this.loadMemes();

		/* Load initial memes */
	}

	render() {
		return (
			<div id="app-root">
				<div id="header" class="flex-between">
					<h2>Quickmeme </h2>
					<div class="primary nav">
						<button onClick={this.loadMemes}>Show most viral</button>
						<button
							onClick={this.showSecondary}
							class={this.state.showSecondary ? 'active' : ''}
						>
							Serach memes
						</button>
					</div>
				</div>

				<div
					class={
						this.state.showSecondary
							? 'secondary nav flex-between show'
							: 'secondary nav flex-between'
					}
				>
					<input
						type="text"
						onChange={this.setSearchQuery}
						value={this.state.searchQ}
						placeholder="So many memes.."
					></input>
					<button onClick={this.searchQuery}>Search</button>
				</div>
				{this.state.message ? (
					<div class="msg">{this.state.message}</div>
				) : null}
				{this.state.errorMsg ? (
					<div class="msg errorMsg">{this.state.errorMsg}</div>
				) : null}
				<div id="meme-container">
					<div class="lds-default">
						<div></div>
						<div></div>
						<div></div>
						<div></div>
						<div></div>
						<div></div>
						<div></div>
						<div></div>
						<div></div>
						<div></div>
						<div></div>
						<div></div>
					</div>
					{this.state.memes ? (
						this.state.memes.map(item => (
							<Meme item={item} tagClick={this.setSearchQuery} />
						))
					) : (
						<span>No memes found</span>
					)}
				</div>

				<div class={this.state.showMore ? 'more' : 'more hide'}>
					<button onClick={this.loadMore}>Load more memes</button>
				</div>

				<div id="scroller" onClick={this.scroll} />
			</div>
		);
	}
}

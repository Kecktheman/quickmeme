import { useState, useEffect, useRef } from 'preact/hooks';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFire, faFireAlt, faPlus, faTrophy, faBolt, faSort } from '@fortawesome/free-solid-svg-icons'

import Meme from './components/meme/meme';
import useDebounce from "./helpers/useDebounce"
import './app.scss';
const apiBaseUri = 'https://api.imgur.com/3/gallery'
const apiKey = 'f415da48218c88a'

export default function App() {
	const [memes, setMemes] = useState(new Array)
	const [message, setMessage] = useState(null)
	const [errorMessage, setErrorMessage] = useState(null)
	const [showSearch, setShowSearch] = useState(false)
	const searchInputRef = useRef(null)
	const appRootRef = useRef(null)

	const [loading, setLoading] = useState(true)
	const [loadedContent, setLoadedContent] = useState(new Array)

	const sortByOptions = [ { value: 'viral', label: 'Viral' }, { value: 'top', label: 'Top' }, { value: 'time', label: 'Latest' } ]
	const [urlParams, setUrlParams] = useState({
		section: 'hot',
		sort: sortByOptions[0],
		window: 'day',
		page: 0,
		showViral: true,
		showMature: true,
		albumPreviews: false,
		query: null
	})
	const [urlString, setUrlString] = useState(null)

	useEffect(() => {
		setUrlParams({
			...urlParams,
			page: 0
		})

		const prevScrollTop = localStorage.getItem('scrollTop')
		const appRoot = appRootRef.current

		if (prevScrollTop) {
			console.log("prev scroll", prevScrollTop)
			
			setTimeout(() => {
				appRoot.scrollTop = prevScrollTop
			}, 1000)
		}	

		appRoot.addEventListener('scroll', (e) => {
			localStorage.setItem('scrollTop', appRoot.scrollTop);
		})
	}, [])

	// Update template string when urlParams changes
	useEffect(() => {
		const { section, sort, window, page, showViral, showMature, albumPreviews, query } = urlParams
		let url = null
		let computedQuery = query

		console.log("computedQuery", computedQuery)

		if (computedQuery) {
			// Modify query if string contains unaccepted characters (not valid in Imgur API)
			computedQuery = computedQuery.replace('å', 'a').replace('Å', 'A')
			computedQuery = computedQuery.replace('ä', 'a').replace('Ä', 'A')
			computedQuery = computedQuery.replace('ö', 'o').replace('Ö', 'O')

			url = `${apiBaseUri}/search/${sort.value}/${window}/${page}?q=${computedQuery}`
		}
		else
			url = `${apiBaseUri}/${section}/${sort.value}/${window}/${page}?showViral=${showViral}&mature=${showMature}&album_previews=${albumPreviews}`

		setLoading(true)
		setUrlString(url)
	}, [urlParams])

	// Run loadContent after debounce on urlParams build to string
	useDebounce(() => loadContent(urlString), 500, [urlString])


	const loadContent = (url) => new Promise(resolve => {
		setLoading(true)
		setMemes(new Array)
		setMessage(null)
		setErrorMessage(null)

		let req = new XMLHttpRequest()

		req.onreadystatechange = function () {
			setMessage("")

			if (req.readyState === 4 && req.status === 200) {
				if (req.responseText === 'Not found') {
					setMessage('Imgur album not found.')
				} 
				else {
					let json = JSON.parse(req.responseText)
					resolve(json)
				}
			} 
		}

		req.open('GET', url, true) // true for asynchronous
		req.setRequestHeader('Authorization', 'Client-ID ' + apiKey)
		req.send(null)	
	})
	.then(value => {
		if (loadedContent.length == 0)
			setLoadedContent(value.data)

		setLoading(false)
		setMemes(value.data)
	})
	.catch(err => {
		setErrorMessage(err)
		setLoading(false)
	})
	
	const scrollUp = () => {
		window.requestAnimationFrame(() => {
			document.querySelector('#anchor').scrollIntoView({ behavior: 'smooth' });
		});
	}

	const NavButton = ({ title, values, icon, className }) => {
		return (
			<button className={`action ${urlParams.section == values['section'] ? 'active' : ''} ${className}`} onClick={() =>
				setUrlParams({
					...urlParams,
					section: values.section ? values['section'] : urlParams.section,
					sort: values.sort ? values['sort'] : urlParams.sort,
					page: 0,
					query: null
				})}>
				{
					icon && <FontAwesomeIcon icon={icon} />
				}
				{title}
			</button>
		)
	}

	const Select = ({ value, id, label, options }) => {
		const [hide, setHide] = useState(true)

		return (
			<span className="select">		
				<label for={id} className="select__label" onClick={() => setHide(!hide)}>{ label }</label>
				<button for={id} className={`action select__present ${hide ? '' : 'active'}`} onClick={() => setHide(!hide)}>
					{ urlParams.sort.label } 
					<FontAwesomeIcon icon={faSort} />
				</button>
				<div id={id} className={`select__dropdown ${ hide ? 'select__dropdown--hide' : ''}`}>
					{
						options.map(item => {
							return <button className="action select__button" onClick={() => {
								setUrlParams({ ...urlParams, sort: item });
								setHide(false)
							}}>{ item.label }</button>	
						})
					}
				</div>	
			</span>
		)
	}

	return (
		<div id="app-root" ref={appRootRef}>
			<div id="anchor"></div>
			<div id="header" className="flex-between">
				<h2>Quickmeme</h2>
				<div className="primary nav">

					<Select value={urlParams.sort} id={"sortby"} label={"Sort by"} options={sortByOptions}></Select>

					<NavButton title={'Hot'} values={{ section: 'hot', sort: sortByOptions.find(x => x.value == 'viral') }} icon={faFireAlt} className={'button--hot'} />
					<NavButton title={'Top'} values={{ section: 'top', sort: sortByOptions.find(x => x.value == 'viral') }} icon={faTrophy} className={'button--top'} />
					{/* <NavButton title={'New'} values={{ section: 'user', sort: 'time' }} icon={faPlus} className={'button-new'} /> */}

					<button onClick={() => {
							setShowSearch(!showSearch)
							searchInputRef.current.focus()
						}}
						className={`action ${showSearch ? 'active' : ''}`}>
						Serach
					</button>
				</div>
			</div>

			<div className={
					showSearch
						? 'secondary nav flex-between show'
						: 'secondary nav flex-between'
				}>
				<form onSubmit={(e) => {
					e.preventDefault()
					console.log("submit", searchInputRef.value)
					setUrlParams({ ...urlParams, query: searchInputRef.value })
				}}>
					<input
						type="text"
						onChange={(e) => {
							setUrlParams({ ...urlParams, query: e.target.value })
						}}
						value={urlParams.query}
						ref={searchInputRef}
						placeholder="Query me!">¨
					</input>
				</form>
				<button className='action' onClick={() => setUrlParams({ ...urlParams, query: searchInputRef.value })}>Search</button>
			</div>

			{urlParams.query ? (
				<div className="msg">
					{`Showing results for: ${urlParams.query}`}
				</div>
			) : null}

			{message ? (
				<div className="msg">{message}</div>
			) : null}

			{errorMessage ? (
				<div className="msg errorMsg">{errorMessage}</div>
			) : null}

			<div id="meme-container">
				{
					loading &&
					<div id="loader">
						<div className="lds-default">
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
					</div>
				}

				{memes ? (
					memes.map(item => (
						<Meme item={item} tagClick={(_urlParams) => setUrlParams({ ...urlParams, ..._urlParams })} />
					))
				) : (
					<span>No memes found</span>
				)}
			</div>

			{
				memes && memes.length > 0 &&
				<div className={'more'}>
					<button onClick={() => setUrlParams({ ...urlParams, page: urlParams.page += 1 })}>
						Load more
					</button>
				</div>
			}

			<div id="scroller" onClick={() => scrollUp()} />
		</div>
	)
}
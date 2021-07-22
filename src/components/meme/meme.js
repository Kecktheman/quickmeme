import { h, Component } from 'preact';
import Image from '../image/image';
import './meme.css';

export default class meme extends Component {
	tagClick(display_name) {
		this.props.tagClick(display_name);
	}

	constructor(props) {
		super(props);

		this.state = {
			title: this.props.item.title,
			link: this.props.item.link,
			points: this.props.item.points,
			views: this.props.item.views,
			images: this.props.item.images,
			tags: this.props.item.tags
		};

		/* 		this.tagClick = this.tagClick.bind(this);
		 */
	}

	render() {
		return (
			<div class="meme">
				<h3>{this.state.title}</h3>

				{this.state.description ? <h4>{this.state.description}</h4> : null}

				{this.state.link ? (
					this.state.images ? (
						this.state.images.map(image => {
							return <Image src={image.link} link={this.state.link} />;
						})
					) : (
						<Image src={this.state.link} link={this.state.link} />
					)
				) : (
					<span>No iamges found</span>
				)}

				<div class="memeBar">
					<div class="tags">
						{this.state.tags.map(tag => {
							return tag.accent ? (
								<span
									onClick={this.tagClick.bind(this, tag.display_name)}
									class="tag"
									style={{ backgroundColor: '#' + tag.accent }}
								>
									{tag.display_name}
								</span>
							) : (
								<span
									onClick={this.tagClick.bind(this, tag.display_name)}
									class="tag"
									style={{ backgroundColor: '#1bb76e' }}
								>
									{tag.display_name}
								</span>
							);
						})}
					</div>
					<div class="flex-between">
						<b>Points: {this.state.points}</b>
						<b>Views: {this.state.views}</b>
					</div>
				</div>
			</div>
		);
	}
}

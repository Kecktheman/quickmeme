import {Component} from 'preact';
import './image.css';

/*
	TODO: Upgrade from class component to functional component
*/

export default class Image extends Component {
  loading (event) {
    if (event.target.complete)
      this.setState ({
        loaded: true,
      });
  }

  inview (entries, observer) {
    entries.forEach (entry => {
      if (entry.intersectionRatio) {
        entry.target.addEventListener ('load', this.loading.bind (this));
        setTimeout (() => {
          if (this.state.isVideo) {
            entry.target.firstChild.src = entry.target.firstChild.getAttribute (
              'data-src'
            );
            entry.target.replaceWith (entry.target);
          } else {
            entry.target.src = entry.target.getAttribute ('data-src');
          }
          observer.unobserve (entry.target);
        }, 500);
      }
    });
  }

  constructor (props) {
    super (props);

    this.state = {
      src: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
      dataSrc: false,
      loaded: false,
      isVideo: this.props.src.indexOf ('.mp4') !== -1,
    };
  }

  componentDidMount () {
    this.setState ({
      dataSrc: this.props.src,
      link: this.props.link,
      loaded: false,
    });

    const observer = new IntersectionObserver (this.inview.bind (this));

    this.state.isVideo
      ? observer.observe (this.element.parentElement)
      : observer.observe (this.element);
  }

  render () {
    return this.state.isVideo
      ? <a href={this.state.link} target="_blank" className="image-container">
          <video width="368" controls autoplay muted>
            <source
              src={this.state.src}
              data-src={this.props.src}
              ref={element => (this.element = element)}
              type="video/mp4"
            />
          </video>
        </a>
      : <a href={this.state.link} target="_blank" className="image-container">
          <div className={this.state.loaded === true ? 'hide' : ''}>
            <div class="lds-ripple">
              <div />
              <div />
            </div>
          </div>
          <img
            src={this.state.src}
            data-src={this.state.dataSrc}
            ref={element => (this.element = element)}
          />
        </a>;
  }
}

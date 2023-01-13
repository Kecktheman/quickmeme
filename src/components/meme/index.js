import {useState} from 'preact/hooks';
import Image from '../image';
import './meme.css';
import Toast from '../toast';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faShare} from '@fortawesome/free-solid-svg-icons';

export default function Meme({item, tagClick}) {
  const [state, setState] = useState ({
    title: item.title,
    link: item.link,
    points: item.points,
    views: item.views,
    images: item.images,
    tags: item.tags,
  });

  const createShareLink = () => {
    if (!'clipboard' in navigator) return;

    const linkToShare = state.link;

    navigator.clipboard.writeText (linkToShare);

    Toast ('Link copied to clipboard!');
  };

  return (
    <div class="meme">
      <h3>
        {state.title}
        <button title="Share link" className='share' onClick={() => createShareLink ()}> <FontAwesomeIcon icon={faShare} /></button>
      </h3>

      {state.description ? <h4>{state.description}</h4> : null}

      {state.link
        ? state.images
            ? state.images.map (image => {
                return <Image src={image.link} link={state.link} />;
              })
            : <Image src={state.link} link={state.link} />
        : <span>No iamges found</span>}

      <div class="memeBar">
        <div class="tags">
          {state.tags.map (tag => (
            <span
              onClick={() => tagClick ({query: tag.display_name, page: 0})}
              class="tag"
              style={
                tag.accent
                  ? {backgroundColor: '#' + tag.accent}
                  : {backgroundColor: '#1bb76e'}
              }
            >
              {tag.display_name}
            </span>
          ))}
        </div>
        {/* <div class="flex-between">
						<b>Points: {state.points}</b>
						<b>Views: {state.views}</b>
					</div> */}
      </div>
    </div>
  );
}

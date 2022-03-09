import {h, Component} from 'preact';
import {useState} from 'preact/hooks';
import Image from '../image/image';
import './meme.css';

export default function meme({item, tagClick}) {
  const [state, setState] = useState ({
    title: item.title,
    link: item.link,
    points: item.points,
    views: item.views,
    images: item.images,
    tags: item.tags,
  });

  return (
    <div class="meme">
      <h3>{state.title}</h3>

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

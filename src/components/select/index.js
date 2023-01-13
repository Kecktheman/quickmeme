import {useState} from 'preact/hooks';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faSort} from '@fortawesome/free-solid-svg-icons';

export default function Select({id, label, options, urlParams, setUrlParams}) {
  const [hide, setHide] = useState (true);

  return (
    <span className="select">
      <label for={id} className="select__label" onClick={() => setHide (!hide)}>
        {label}
      </label>
      <button
        for={id}
        className={`action select__present ${hide ? '' : 'active'}`}
        onClick={() => setHide (!hide)}
      >
        {urlParams.sort.label}
        <FontAwesomeIcon icon={faSort} />
      </button>
      <div
        id={id}
        className={`select__dropdown ${hide ? 'select__dropdown--hide' : ''}`}
      >
        {options.map (item => {
          return (
            <button
              className="action select__button"
              onClick={() => {
                setUrlParams ({...urlParams, sort: item});
                setHide (false);
              }}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </span>
  );
}

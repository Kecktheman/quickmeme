import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

export default function NavButton({options}) {
  const {title, values, icon, className, urlParams, setUrlParams} = options;

  return (
    <button
      className={`action ${urlParams.section == values['section'] ? 'active' : ''} ${className}`}
      onClick={() =>
        setUrlParams ({
          ...urlParams,
          section: values.section ? values['section'] : urlParams.section,
          sort: values.sort ? values['sort'] : urlParams.sort,
          page: 0,
          query: null,
        })}
    >
      {icon && <FontAwesomeIcon icon={icon} />}
      {title}
    </button>
  );
}

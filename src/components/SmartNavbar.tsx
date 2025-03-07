interface namesProp {
  names: string[];
  links: string[];
}

const SmartNavbar = ({ names, links }: namesProp) => {
  return (
    <ul id="smart-navbar" className="column">
      {names.map((name, index) => (
        <li>
          <a href={links[index]} key={index}>
            {name}
          </a>
        </li>
      ))}
    </ul>
  );
};

export default SmartNavbar;

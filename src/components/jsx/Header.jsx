export const Header = ({ title, links }) => {
  return (
    <header>
      {title}

      <nav>
        <ul>
          {links.map((link) => (
            <li>
              <a href={link.href}>{link.text}</a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
};

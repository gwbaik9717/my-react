import { Content } from "./Content";
import { Header } from "./Header";

export const App = () => {
  const headerLinks = [
    { href: "#home", text: "Home" },
    { href: "#about", text: "About" },
  ];

  return (
    <div id="app">
      <Header title={"My Website"} links={headerLinks} />
      <Content>
        <div>Main Content</div>
      </Content>
    </div>
  );
};

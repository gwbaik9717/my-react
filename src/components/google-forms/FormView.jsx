import { rerender } from "../..";
import { React } from "../../lib/react";
import { Screen1 } from "./Screen1";
import { Screen2 } from "./Screen2";
import { Screen3 } from "./Screen3";

export const FormView = () => {
  const [currentScreen, setCurrentScreen] = React.useState(1);
  const [formData, setFormData] = React.useState({
    "radio input": ["radio option1"],
  });

  const resetForm = () => {
    setFormData({});
    setCurrentScreen(1);
    rerender();
  };

  const handleClickPrev = () => {
    setCurrentScreen((prev) => prev - 1);
    rerender();
  };

  const handleClickNext = () => {
    setCurrentScreen((prev) => prev + 1);
    rerender();
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 1:
        return (
          <Screen1
            formData={formData}
            setFormData={setFormData}
            onNext={handleClickNext}
          />
        );
      case 2:
        return (
          <Screen2
            formData={formData}
            setFormData={setFormData}
            onNext={handleClickNext}
          />
        );
      case 3:
        return (
          <Screen3
            formData={formData}
            setFormData={setFormData}
            onNext={handleClickNext}
            resetForm={resetForm}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div>
      {renderScreen()}
      {currentScreen > 1 && <button onClick={handleClickPrev}>Previous</button>}
    </div>
  );
};

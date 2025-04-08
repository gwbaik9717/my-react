import { rerender } from "../..";
import { React } from "../../lib/react";

export const Screen1 = ({ formData, setFormData, onNext }) => {
  const handleRadioChange = (event) => {
    setFormData({
      ...formData,
      "radio input": [event.target.value],
    });
    rerender();
  };

  const handleCheckboxChange = (event) => {
    const { value, checked } = event.target;
    const currentValues = formData["checkbox input"] || [];
    const updatedValues = checked
      ? [...currentValues, value]
      : currentValues.filter((v) => v !== value);

    setFormData({
      ...formData,
      "checkbox input": updatedValues,
    });
    rerender();
  };

  const handleClickNext = () => {
    const isRadioSelected = formData["radio input"]?.length > 0;
    const isCheckboxSelected = formData["checkbox input"]?.length > 0;

    if (!isRadioSelected || !isCheckboxSelected) {
      alert("모든 필수 항목을 선택해주세요.");
      return;
    }

    onNext();
  };

  return (
    <div>
      <h2>Survey</h2>
      <p>* 표시는 필수 질문임</p>

      <div>
        <h3>radio input *</h3>
        <label>
          <input
            type="radio"
            name="radio-input"
            value="radio option1"
            checked={formData["radio input"]?.includes("radio option1")}
            onChange={handleRadioChange}
          />
          radio option1
        </label>
        <label>
          <input
            type="radio"
            name="radio-input"
            value="radio option2"
            checked={formData["radio input"]?.includes("radio option2")}
            onChange={handleRadioChange}
          />
          radio option2
        </label>
        <label>
          <input
            type="radio"
            name="radio-input"
            value="radio option3"
            checked={formData["radio input"]?.includes("radio option3")}
            onChange={handleRadioChange}
          />
          radio option3
        </label>
      </div>

      <div>
        <h3>checkbox input *</h3>
        <label>
          <input
            type="checkbox"
            value="checkbox option1"
            checked={formData["checkbox input"]?.includes("checkbox option1")}
            onChange={handleCheckboxChange}
          />
          checkbox option1
        </label>
        <label>
          <input
            type="checkbox"
            value="checkbox option2"
            checked={formData["checkbox input"]?.includes("checkbox option2")}
            onChange={handleCheckboxChange}
          />
          checkbox option2
        </label>
        <label>
          <input
            type="checkbox"
            value="checkbox option3"
            checked={formData["checkbox input"]?.includes("checkbox option3")}
            onChange={handleCheckboxChange}
          />
          checkbox option3
        </label>
      </div>

      <button onClick={handleClickNext}>Next</button>
    </div>
  );
};

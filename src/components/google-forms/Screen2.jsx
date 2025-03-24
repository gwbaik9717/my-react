import { rerender } from "../..";
import { React } from "../../lib/react";

export const Screen2 = ({ formData, setFormData, onNext }) => {
  const handleSelectChange = (event) => {
    setFormData({
      ...formData,
      select: event.target.value,
    });

    rerender();
  };

  const handleTextareaChange = (event) => {
    setFormData({
      ...formData,
      textarea: event.target.value,
    });

    rerender();
  };

  const handleClickNext = () => {
    const isSelectFilled = !!formData.select;
    const isTextareaFilled = !!formData.textarea;

    if (!isSelectFilled || !isTextareaFilled) {
      alert("모든 필수 항목을 입력해주세요.");
      return;
    }

    onNext();
  };

  return (
    <div>
      <h2>Survey</h2>
      <p>* 표시는 필수 질문임</p>

      <div>
        <h3>select *</h3>
        <select value={"select option2"} onChange={handleSelectChange}>
          <option value="" disabled>
            선택
          </option>
          <option value="select option1">select option1</option>
          <option value="select option2">select option2</option>
          <option value="select option3">select option3</option>
        </select>
      </div>

      <div>
        <h3>textarea *</h3>
        <textarea
          value={formData.textarea || ""}
          onChange={handleTextareaChange}
          placeholder="내 답변"
        />
      </div>

      <button onClick={handleClickNext}>Next</button>
    </div>
  );
};

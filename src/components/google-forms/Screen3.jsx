import { React } from "../../lib/react";

export const Screen3 = ({ formData, resetForm }) => {
  return (
    <div>
      <h2>Survey</h2>
      <p>응답이 기록되었습니다.</p>
      <div>
        <h3>최종 답변:</h3>
        <pre>{JSON.stringify(formData, null, 2)}</pre>
      </div>
      <button onClick={resetForm}>처음으로</button>
    </div>
  );
};

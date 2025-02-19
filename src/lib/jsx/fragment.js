/**
 * 주어진 props의 children을 배열로 반환하는 컴포넌트입니다.
 *
 * @param {Object} props - 컴포넌트의 속성 객체.
 * @param {Object} [props.children] - 렌더링할 자식 요소들.
 * @returns {Array} 자식 요소들의 배열을 반환합니다. 자식 요소가 없을 경우 빈 배열을 반환.
 */
export const Fragment = (props) => {
  if (props.children) {
    return [...props.children];
  }

  return [];
};

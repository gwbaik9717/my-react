import { EffectTag } from "./render";

const setEffectTag = (newReactElement, oldReactElement) => {
  if (oldReactElement || newReactElement) {
    if (!newReactElement) {
      oldReactElement.effectTag = EffectTag.Deletion;
      return;
    }

    if (!oldReactElement) {
      newReactElement.effectTag = EffectTag.Placement;
      return;
    }

    if (oldReactElement.type !== newReactElement.type) {
      oldReactElement.effectTag = EffectTag.Deletion;
      newReactElement.effectTag = EffectTag.Placement;
      return;
    }

    if (oldReactElement.type === "text" && newReactElement.type === "text") {
      if (oldReactElement.text !== newReactElement.text) {
        newReactElement.effectTag = EffectTag.Update;
      }

      return;
    }

    // 추가 또는 변경된 prop 이 있는지 확인
    for (const [newPropKey, newPropValue] of Object.entries(
      newReactElement.props
    )) {
      if (newPropKey === "children") {
        continue;
      }

      const oldProps = oldReactElement.props;

      if (!newPropKey in oldProps) {
        newReactElement.effectTag = EffectTag.Update;
        return;
      }

      if (newPropValue !== oldProps[newPropKey]) {
        newReactElement.effectTag = EffectTag.Update;
        return;
      }
    }

    // 삭제된 prop 이 있는지 확인
    for (const [oldPropKey, oldPropValue] of Object.entries(
      oldReactElement.props
    )) {
      if (oldPropKey === "children") {
        continue;
      }

      const newProps = newReactElement.props;

      if (!oldPropKey in newProps) {
        newReactElement.effectTag = EffectTag.Update;
        return;
      }

      if (oldPropValue !== newProps[oldPropKey]) {
        oldReactElement.effectTag = EffectTag.Update;
        return;
      }
    }
  }
};

export const reconcile = (newReactElement, oldReactElement) => {
  if (!newReactElement && !oldReactElement) {
    return;
  }

  reconcile(newReactElement?.child, oldReactElement?.child);

  reconcile(newReactElement?.sibling, oldReactElement?.sibling);

  setEffectTag(newReactElement, oldReactElement);
};

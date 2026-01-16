import React, { useMemo, useState } from "react";
import RadioGroup from "react-native-radio-buttons-group";

export default function RadioButton({ options, selectedId, onChange }) {
  const defaultOptions = useMemo(() => [{ id: "1", value: "option1" }], []);

  const radioButtons = options ?? defaultOptions;

  /** Used if pressable logic is placed on the radio button itself**/

  // const [selectedIdState, setSelectedIdState] = useState();
  // const selectedId = selectedIdProp ?? selectedIdState;
  // const handlePress = (id) => {
  //   if (selectedIdProp === undefined) setSelectedIdState(id);
  //   onChange?.(id);
  // };

  return (
    <RadioGroup
      radioButtons={radioButtons}
      onPress={onChange || (() => {})}
      selectedId={selectedId}
    />
  );
}

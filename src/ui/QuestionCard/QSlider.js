import { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import Slider from "@react-native-community/slider";
import { ORANGE } from "../Layout/colors";

const clampValue = (value, min, max) => {
  if (typeof value !== "number" || Number.isNaN(value)) return min;
  return Math.min(Math.max(value, min), max);
};

const formatSliderValue = (value, format = "currency", suffix = "") => {
  if (format === "currency") {
    return `\u00A3${Math.round(value).toLocaleString("en-GB")}`;
  }
  return `${value}${suffix}`;
};

const QSlider = ({
  id,
  Title,
  Description,
  value,
  onChange,
  min = 0,
  max = 10,
  step = 1,
  format = "currency",
  suffix = "",
  minimumLabel,
  maximumLabel,
}) => {
  const currentValue = useMemo(
    () => clampValue(typeof value === "number" ? value : min, min, max),
    [max, min, value],
  );
  const displayValue =
    maximumLabel && currentValue >= max
      ? maximumLabel
      : formatSliderValue(currentValue, format, suffix);

  return (
    <View>
      <View style={styles.header}>
        <View style={styles.textWrap}></View>
        <Text style={styles.valueBadge}>{displayValue}</Text>
      </View>

      <Slider
        value={currentValue}
        minimumValue={min}
        maximumValue={max}
        step={step}
        onValueChange={(nextValue) => onChange?.(nextValue, id)}
        minimumTrackTintColor={ORANGE.main}
        maximumTrackTintColor="#D1D5DB"
        thumbTintColor={ORANGE.dark}
      />

      <View style={styles.labelRow}>
        <Text style={styles.labelText}>
          {minimumLabel ?? formatSliderValue(min, format, suffix)}
        </Text>
        <Text style={styles.labelText}>
          {maximumLabel ?? formatSliderValue(max, format, suffix)}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  //   card: {
  //     borderColor: "#E5E7EB",
  //     borderRadius: 12,
  //     backgroundColor: "#FFFFFF",
  //     paddingVertical: 14,
  //     paddingHorizontal: 14,
  //     marginVertical: 7,
  //   },
  header: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  textWrap: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  desc: {
    marginTop: 4,
    color: "#6B7280",
    fontSize: 12,
    lineHeight: 18,
  },
  valueBadge: {
    width: "100%",
    textAlign: "center",
    fontSize: 22,
    fontWeight: "700",
    color: ORANGE.main,
  },
  labelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 4,
  },
  labelText: {
    fontSize: 11,
    color: "#6B7280",
  },
});

export default QSlider;

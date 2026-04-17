import { useEffect, useState } from "react";
import {
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import DateTimePicker, {
  DateTimePickerAndroid,
} from "@react-native-community/datetimepicker";
import { Clock3 } from "lucide-react-native";
import Selector from "../Navigation/Selector";
import { ORANGE } from "../Layout/colors";

export const DEFAULT_TIME_VALUE = "09:00";

const FALLBACK_TIME_OPTIONS = [
  { label: "9:00 AM", value: "09:00" },
  { label: "10:00 AM", value: "10:00" },
  { label: "11:00 AM", value: "11:00" },
  { label: "1:00 PM", value: "13:00" },
  { label: "2:00 PM", value: "14:00" },
  { label: "3:00 PM", value: "15:00" },
  { label: "4:00 PM", value: "16:00" },
];

const buildDateFromTimeValue = (timeValue) => {
  const baseDate = new Date();

  if (!timeValue) {
    baseDate.setHours(9, 0, 0, 0);
    return baseDate;
  }

  const [hourValue, minuteValue] = timeValue.split(":").map(Number);
  baseDate.setHours(hourValue ?? 9, minuteValue ?? 0, 0, 0);

  return baseDate;
};

const buildTimeValueFromDate = (date) =>
  `${String(date.getHours()).padStart(2, "0")}:${String(
    date.getMinutes(),
  ).padStart(2, "0")}`;

export const formatTimeLabel = (timeValue) => {
  if (!timeValue) {
    return "Choose time";
  }

  const [hourValue, minuteValue] = timeValue.split(":").map(Number);
  const meridiem = hourValue >= 12 ? "PM" : "AM";
  const twelveHourValue = hourValue % 12 || 12;

  return `${twelveHourValue}:${String(minuteValue).padStart(2, "0")} ${meridiem}`;
};

const TimePicker = ({
  visible,
  selectedTime,
  options = FALLBACK_TIME_OPTIONS,
  onSelectTime,
  onClose,
}) => {
  const [draftTime, setDraftTime] = useState(() =>
    buildDateFromTimeValue(selectedTime),
  );

  useEffect(() => {
    if (visible) {
      setDraftTime(buildDateFromTimeValue(selectedTime));
    }
  }, [selectedTime, visible]);

  useEffect(() => {
    if (!visible || Platform.OS !== "android") {
      return undefined;
    }

    DateTimePickerAndroid.open({
      value: buildDateFromTimeValue(selectedTime),
      mode: "time",
      is24Hour: false,
      onChange: (event, date) => {
        if (event.type === "set" && date) {
          onSelectTime(buildTimeValueFromDate(date));
        }

        onClose();
      },
    });

    return undefined;
  }, [onClose, onSelectTime, selectedTime, visible]);

  const handleDone = () => {
    onSelectTime(buildTimeValueFromDate(draftTime));
    onClose();
  };

  if (Platform.OS === "android") {
    return null;
  }

  if (Platform.OS !== "ios") {
    const handleSelectTime = (timeValue) => {
      onSelectTime(timeValue);
      onClose();
    };

    return (
      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={onClose}
        statusBarTranslucent
      >
        <View style={styles.overlay}>
          <Pressable style={styles.backdrop} onPress={onClose} />
          <View style={styles.dialog}>
            <View style={styles.header}>
              <View style={styles.titleGroup}>
                <View style={styles.iconBadge}>
                  <Clock3 color="#1d4ed8" size={16} strokeWidth={2.1} />
                </View>
                <View>
                  <Text style={styles.title}>Choose time</Text>
                  <Text style={styles.subtitle}>
                    {formatTimeLabel(selectedTime)}
                  </Text>
                </View>
              </View>
              <Pressable onPress={onClose} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>Done</Text>
              </Pressable>
            </View>

            <View style={styles.optionGrid}>
              {options.map((option) => {
                const isSelected = option.value === selectedTime;

                return (
                  <Selector
                    key={option.value}
                    onPress={() => handleSelectTime(option.value)}
                    style={[
                      styles.optionButton,
                      isSelected ? styles.optionButtonSelected : null,
                    ]}
                    pressedStyle={styles.optionButtonPressed}
                  >
                    <Text
                      style={[
                        styles.optionLabel,
                        isSelected ? styles.optionLabelSelected : null,
                      ]}
                    >
                      {option.label}
                    </Text>
                  </Selector>
                );
              })}
            </View>
          </View>
        </View>
      </Modal>
    );
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />
        <View style={styles.dialog}>
          <View style={styles.header}>
            <View style={styles.titleGroup}>
              <View style={styles.iconBadge}>
                <Clock3 color="#1d4ed8" size={16} strokeWidth={2.1} />
              </View>
              <View>
                <Text style={styles.title}>Choose time</Text>
                <Text style={styles.subtitle}>
                  {formatTimeLabel(buildTimeValueFromDate(draftTime))}
                </Text>
              </View>
            </View>
            <View style={styles.headerActions}>
              <Pressable onPress={onClose} style={styles.ghostButton}>
                <Text style={styles.ghostButtonText}>Cancel</Text>
              </Pressable>
              <Pressable onPress={handleDone} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>Done</Text>
              </Pressable>
            </View>
          </View>

          <View style={styles.spinnerShell}>
            <DateTimePicker
              value={draftTime}
              mode="time"
              display="spinner"
              onChange={(_, date) => {
                if (date) {
                  setDraftTime(date);
                }
              }}
              minuteInterval={5}
              textColor="#111827"
              themeVariant="light"
              style={styles.spinner}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    padding: 18,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(15, 23, 42, 0.45)",
  },
  dialog: {
    backgroundColor: "#ffffff",
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: "#e4e7ec",
    shadowColor: "#101828",
    shadowOpacity: 0.16,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 10 },
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 12,
  },
  titleGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
  },
  headerActions: {
    flexDirection: "row",
    gap: 8,
  },
  iconBadge: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#eaf2ff",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#101828",
  },
  subtitle: {
    marginTop: 4,
    fontSize: 13,
    color: "#667085",
  },
  ghostButton: {
    minHeight: 36,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: "#f8fafc",
    alignItems: "center",
    justifyContent: "center",
  },
  ghostButtonText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#667085",
  },
  closeButton: {
    minHeight: 36,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: "#f2f4f7",
    alignItems: "center",
    justifyContent: "center",
  },
  closeButtonText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#344054",
  },
  spinnerShell: {
    marginTop: 18,
    borderRadius: 18,
    overflow: "hidden",
    backgroundColor: "#f8fafc",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
  },
  spinner: {
    width: "100%",
  },
  optionGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 18,
  },
  optionButton: {
    width: "47%",
    minHeight: 52,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#e4e7ec",
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 12,
  },
  optionButtonSelected: {
    backgroundColor: ORANGE.tint,
    borderColor: ORANGE.tintBorder,
  },
  optionButtonPressed: {
    opacity: 0.85,
  },
  optionLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#344054",
  },
  optionLabelSelected: {
    color: ORANGE.dark,
  },
});

export default TimePicker;

import { useEffect, useState } from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { ChevronLeft, ChevronRight } from "lucide-react-native";
import Selector from "../Navigation/Selector";

const WEEKDAY_LABELS = ["S", "M", "T", "W", "T", "F", "S"];

const pad = (value) => String(value).padStart(2, "0");

const createDateId = (date) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

const parseDateId = (dateId) => {
  if (!dateId) {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), today.getDate());
  }

  const [year, month, day] = dateId.split("-").map(Number);
  return new Date(year, month - 1, day);
};

const startOfMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 1);

const buildCalendarWeeks = (monthDate) => {
  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();
  const firstDayIndex = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = Array(firstDayIndex).fill(null);

  for (let day = 1; day <= daysInMonth; day += 1) {
    cells.push(createDateId(new Date(year, month, day)));
  }

  while (cells.length % 7 !== 0) {
    cells.push(null);
  }

  const weeks = [];

  for (let index = 0; index < cells.length; index += 7) {
    weeks.push(cells.slice(index, index + 7));
  }

  return weeks;
};

export const getTodayDateId = () => createDateId(new Date());

export const formatDateLabel = (dateId) =>
  parseDateId(dateId).toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });

const CalendarPicker = ({
  visible,
  selectedDate,
  onSelectDate,
  onClose,
}) => {
  const [displayedMonth, setDisplayedMonth] = useState(() =>
    startOfMonth(parseDateId(selectedDate ?? getTodayDateId())),
  );

  useEffect(() => {
    if (visible) {
      setDisplayedMonth(startOfMonth(parseDateId(selectedDate ?? getTodayDateId())));
    }
  }, [selectedDate, visible]);

  const weeks = buildCalendarWeeks(displayedMonth);
  const todayDateId = getTodayDateId();

  const handleSelectDate = (dateId) => {
    onSelectDate(dateId);
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
            <View>
              <Text style={styles.title}>Choose date</Text>
              <Text style={styles.subtitle}>{formatDateLabel(selectedDate)}</Text>
            </View>
            <Pressable onPress={onClose} style={styles.doneButton}>
              <Text style={styles.doneButtonText}>Done</Text>
            </Pressable>
          </View>

          <View style={styles.monthRow}>
            <Selector
              onPress={() =>
                setDisplayedMonth(
                  (current) =>
                    new Date(current.getFullYear(), current.getMonth() - 1, 1),
                )
              }
              style={styles.navButton}
              pressedStyle={styles.navButtonPressed}
            >
              <ChevronLeft color="#344054" size={18} strokeWidth={2.2} />
            </Selector>
            <Text style={styles.monthLabel}>
              {displayedMonth.toLocaleDateString("en-GB", {
                month: "long",
                year: "numeric",
              })}
            </Text>
            <Selector
              onPress={() =>
                setDisplayedMonth(
                  (current) =>
                    new Date(current.getFullYear(), current.getMonth() + 1, 1),
                )
              }
              style={styles.navButton}
              pressedStyle={styles.navButtonPressed}
            >
              <ChevronRight color="#344054" size={18} strokeWidth={2.2} />
            </Selector>
          </View>

          <View style={styles.weekdayRow}>
            {WEEKDAY_LABELS.map((label) => (
              <Text key={label} style={styles.weekdayLabel}>
                {label}
              </Text>
            ))}
          </View>

          <View style={styles.weeks}>
            {weeks.map((week, weekIndex) => (
              <View key={`week-${weekIndex}`} style={styles.weekRow}>
                {week.map((dateId, dayIndex) => {
                  if (!dateId) {
                    return <View key={`blank-${weekIndex}-${dayIndex}`} style={styles.daySlot} />;
                  }

                  const dayDate = parseDateId(dateId);
                  const isSelected = dateId === selectedDate;
                  const isToday = dateId === todayDateId;

                  return (
                    <Selector
                      key={dateId}
                      onPress={() => handleSelectDate(dateId)}
                      style={[
                        styles.daySlot,
                        styles.dayButton,
                        isToday ? styles.dayButtonToday : null,
                        isSelected ? styles.dayButtonSelected : null,
                      ]}
                      pressedStyle={styles.dayButtonPressed}
                    >
                      <Text
                        style={[
                          styles.dayLabel,
                          isToday ? styles.dayLabelToday : null,
                          isSelected ? styles.dayLabelSelected : null,
                        ]}
                      >
                        {dayDate.getDate()}
                      </Text>
                    </Selector>
                  );
                })}
              </View>
            ))}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 18,
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
  doneButton: {
    minHeight: 36,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: "#f2f4f7",
    alignItems: "center",
    justifyContent: "center",
  },
  doneButtonText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#344054",
  },
  monthRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 18,
    marginBottom: 14,
  },
  navButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1,
    borderColor: "#e4e7ec",
    backgroundColor: "#f8fafc",
    alignItems: "center",
    justifyContent: "center",
  },
  navButtonPressed: {
    opacity: 0.85,
  },
  monthLabel: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1d2939",
  },
  weekdayRow: {
    flexDirection: "row",
    marginBottom: 8,
  },
  weekdayLabel: {
    flex: 1,
    textAlign: "center",
    fontSize: 11,
    fontWeight: "700",
    color: "#98a2b3",
  },
  weeks: {
    gap: 8,
  },
  weekRow: {
    flexDirection: "row",
  },
  daySlot: {
    flex: 1,
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  dayButton: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "transparent",
  },
  dayButtonToday: {
    borderColor: "#bfd4ff",
    backgroundColor: "#f5f8ff",
  },
  dayButtonSelected: {
    backgroundColor: "#2563eb",
    borderColor: "#2563eb",
  },
  dayButtonPressed: {
    opacity: 0.85,
  },
  dayLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#344054",
  },
  dayLabelToday: {
    color: "#1d4ed8",
  },
  dayLabelSelected: {
    color: "#ffffff",
  },
});

export default CalendarPicker;

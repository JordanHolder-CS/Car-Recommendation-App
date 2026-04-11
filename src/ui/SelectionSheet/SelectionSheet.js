import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Check } from "lucide-react-native";
import Selector from "../Navigation/Selector";

const SelectionSheet = ({
  visible,
  title,
  subtitle,
  options = [],
  selectedKey = null,
  getOptionKey = (option) => option?.key,
  getOptionLabel = (option) => `${option ?? ""}`,
  getOptionMeta = () => "",
  onSelect = () => {},
  onClose = () => {},
  closeLabel = "Close",
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.backdropShell}>
        <Pressable style={styles.backdrop} onPress={onClose} />
        <View style={styles.sheet}>
          <Text style={styles.title}>{title}</Text>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
          <ScrollView
            style={styles.optionList}
            contentContainerStyle={styles.optionListContent}
          >
            {options.map((option) => {
              const optionKey = getOptionKey(option);
              const optionMeta = getOptionMeta(option);
              const isSelected = optionKey === selectedKey;

              return (
                <Selector
                  key={optionKey}
                  onPress={() => onSelect(option)}
                  style={styles.optionItem}
                  pressedStyle={styles.optionItemPressed}
                >
                  <View style={styles.optionTextWrap}>
                    <Text style={styles.optionTitle}>{getOptionLabel(option)}</Text>
                    {optionMeta ? (
                      <Text style={styles.optionMeta}>{optionMeta}</Text>
                    ) : null}
                  </View>
                  {isSelected ? <Check size={18} color="#16A34A" /> : null}
                </Selector>
              );
            })}
          </ScrollView>
          <Selector
            onPress={onClose}
            style={styles.closeButton}
            pressedStyle={styles.closeButtonPressed}
          >
            <Text style={styles.closeLabel}>{closeLabel}</Text>
          </Selector>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdropShell: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(15, 23, 42, 0.34)",
  },
  backdrop: {
    flex: 1,
  },
  sheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
    maxHeight: "68%",
  },
  title: {
    fontSize: 17,
    fontWeight: "700",
    color: "#111827",
  },
  subtitle: {
    marginTop: 6,
    fontSize: 12,
    lineHeight: 18,
    color: "#6B7280",
  },
  optionList: {
    marginTop: 14,
  },
  optionListContent: {
    gap: 10,
    paddingBottom: 8,
  },
  optionItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  optionItemPressed: {
    backgroundColor: "#F9FAFB",
  },
  optionTextWrap: {
    flex: 1,
    paddingRight: 12,
  },
  optionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
  },
  optionMeta: {
    marginTop: 4,
    fontSize: 12,
    color: "#6B7280",
  },
  closeButton: {
    marginTop: 10,
    minHeight: 48,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 12,
  },
  closeButtonPressed: {
    backgroundColor: "#E5E7EB",
  },
  closeLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
  },
});

export default SelectionSheet;

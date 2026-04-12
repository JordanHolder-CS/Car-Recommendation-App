import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import Selector from "../ui/Navigation/Selector";

const Form = ({
  children,
  onSubmit,
  submitLabel = "Send booking request",
  submitDisabled = false,
}) => {
  return (
    <View style={styles.formContainer}>
      <View style={styles.formItems}>{children}</View>
      {onSubmit ? (
        <Pressable
          disabled={submitDisabled}
          onPress={onSubmit}
          style={({ pressed }) => [
            styles.submitButton,
            submitDisabled ? styles.submitButtonDisabled : null,
            pressed && !submitDisabled ? styles.submitButtonPressed : null,
          ]}
        >
          <Text
            style={[
              styles.submitButtonLabel,
              submitDisabled ? styles.submitButtonLabelDisabled : null,
            ]}
          >
            {submitLabel}
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
};

const SectionTitle = ({ icon: Icon, children }) => {
  return (
    <View style={styles.sectionTitleRow}>
      {Icon ? <Icon color="#667085" size={14} strokeWidth={2.1} /> : null}
      <Text style={styles.sectionTitleText}>{children}</Text>
    </View>
  );
};

const Card = ({ children, style }) => {
  return <View style={[styles.card, style]}>{children}</View>;
};

const InfoBanner = ({ icon: Icon, children }) => {
  return (
    <View style={styles.infoBanner}>
      {Icon ? <Icon color="#3b82f6" size={15} strokeWidth={2.1} /> : null}
      <Text style={styles.infoBannerText}>{children}</Text>
    </View>
  );
};

const DetailCard = ({ label, title, subtitle, icon: Icon }) => {
  return (
    <Card>
      <View style={styles.detailLabelRow}>
        {Icon ? <Icon color="#94a3b8" size={14} strokeWidth={2} /> : null}
        <Text style={styles.detailLabel}>{label}</Text>
      </View>
      <Text style={styles.detailTitle}>{title}</Text>
      {subtitle ? <Text style={styles.detailSubtitle}>{subtitle}</Text> : null}
    </Card>
  );
};

const ChoiceOption = ({
  label,
  description,
  selected,
  onPress,
  isLast = false,
}) => {
  return (
    <Selector
      onPress={onPress}
      style={[styles.choiceOption, !isLast ? styles.choiceDivider : null]}
      pressedStyle={styles.choiceOptionPressed}
    >
      <View
        style={[styles.radioOuter, selected ? styles.radioOuterSelected : null]}
      >
        {selected ? <View style={styles.radioInner} /> : null}
      </View>
      <View style={styles.choiceTextGroup}>
        <Text style={styles.choiceLabel}>{label}</Text>
        {description ? (
          <Text style={styles.choiceDescription}>{description}</Text>
        ) : null}
      </View>
    </Selector>
  );
};

const ChoiceChip = ({ label, selected, onPress, style }) => {
  return (
    <Selector
      onPress={onPress}
      style={[
        styles.choiceChip,
        selected ? styles.choiceChipSelected : null,
        style,
      ]}
      pressedStyle={styles.choiceChipPressed}
    >
      <Text
        style={[
          styles.choiceChipLabel,
          selected ? styles.choiceChipLabelSelected : null,
        ]}
      >
        {label}
      </Text>
    </Selector>
  );
};

const InputText = ({
  label,
  value,
  onChange,
  placeholder,
  multiline = false,
  autoCapitalize = "sentences",
  keyboardType = "default",
  icon: Icon,
  required = false,
}) => {
  return (
    <View style={styles.inputShell}>
      <View style={styles.inputLabelRow}>
        {Icon ? <Icon color="#667085" size={14} strokeWidth={2.1} /> : null}
        <Text style={styles.inputLabel}>
          {label}
          {required ? " *" : ""}
        </Text>
      </View>
      <TextInput
        returnKeyType="done"
        value={value ?? ""}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor="#9ca3af"
        multiline={multiline}
        autoCapitalize={autoCapitalize}
        keyboardType={keyboardType}
        style={[
          styles.itemTextInput,
          multiline ? styles.itemTextInputMultiline : null,
        ]}
        textAlignVertical={multiline ? "top" : "center"}
      />
    </View>
  );
};

Form.SectionTitle = SectionTitle;
Form.Card = Card;
Form.InfoBanner = InfoBanner;
Form.DetailCard = DetailCard;
Form.ChoiceOption = ChoiceOption;
Form.ChoiceChip = ChoiceChip;
Form.InputText = InputText;

const styles = StyleSheet.create({
  formContainer: {
    width: "100%",
    gap: 16,
  },
  formItems: {
    gap: 14,
  },
  sectionTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 2,
  },
  sectionTitleText: {
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    color: "#475467",
  },
  card: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e4e7ec",
    borderRadius: 14,
    padding: 14,
  },
  infoBanner: {
    flexDirection: "row",
    gap: 10,
    alignItems: "flex-start",
    backgroundColor: "#eef4ff",
    borderWidth: 1,
    borderColor: "#d6e4ff",
    borderRadius: 12,
    padding: 12,
  },
  infoBannerText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 17,
    color: "#475467",
  },
  detailLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 10,
  },
  detailLabel: {
    fontSize: 12,
    color: "#667085",
  },
  detailTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
  },
  detailSubtitle: {
    marginTop: 4,
    fontSize: 12,
    color: "#667085",
  },
  choiceOption: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    minHeight: 52,
    paddingVertical: 4,
  },
  choiceDivider: {
    borderBottomWidth: 1,
    borderBottomColor: "#edf0f5",
    marginBottom: 4,
    paddingBottom: 8,
  },
  choiceOptionPressed: {
    opacity: 0.8,
  },
  radioOuter: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.5,
    borderColor: "#d0d5dd",
    alignItems: "center",
    justifyContent: "center",
  },
  radioOuterSelected: {
    borderColor: "#2f6fed",
  },
  radioInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#2f6fed",
  },
  choiceTextGroup: {
    flex: 1,
  },
  choiceLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#1f2937",
  },
  choiceDescription: {
    marginTop: 2,
    fontSize: 11,
    color: "#667085",
  },
  choiceChip: {
    minHeight: 46,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e4e7ec",
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 14,
  },
  choiceChipSelected: {
    backgroundColor: "#edf4ff",
    borderColor: "#9ec5ff",
  },
  choiceChipPressed: {
    opacity: 0.85,
  },
  choiceChipLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#344054",
  },
  choiceChipLabelSelected: {
    color: "#174ea6",
  },
  inputShell: {
    gap: 8,
  },
  inputLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#111827",
  },
  itemTextInput: {
    minHeight: 48,
    backgroundColor: "#fafafa",
    borderWidth: 0.5,
    borderColor: "#d0d5dd",
    borderRadius: 9,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: "#111827",
    fontSize: 15,
  },
  itemTextInputMultiline: {
    minHeight: 96,
    paddingTop: 12,
  },
  submitButton: {
    minHeight: 52,
    borderRadius: 14,
    backgroundColor: "#1f2937",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    shadowColor: "#101828",
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
  },
  submitButtonDisabled: {
    backgroundColor: "#d7dce4",
    shadowOpacity: 0,
  },
  submitButtonPressed: {
    opacity: 0.9,
  },
  submitButtonLabel: {
    fontSize: 15,
    fontWeight: "700",
    color: "#ffffff",
  },
  submitButtonLabelDisabled: {
    color: "#8a94a3",
  },
});

export default Form;

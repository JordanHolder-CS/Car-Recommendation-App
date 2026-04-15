import { StyleSheet, Text, View } from "react-native";

const ComparisonRowsCard = ({ rows = [] }) => {
  return (
    <View style={styles.TableCard}>
      <Text style={styles.TableTitle}>Why this over that</Text>
      <Text style={styles.TableSubtitle}>
        Fit scores are explained in plain English so the percentages are not just
        black-box numbers.
      </Text>
      <View style={styles.RowsWrap}>
        {rows.map((row) => (
          <View key={row.key} style={styles.ComparisonBlock}>
            <View style={styles.RowHeader}>
              <Text style={styles.RowLabel}>{row.label}</Text>
              {row.description ? (
                <Text style={styles.RowDescription}>{row.description}</Text>
              ) : null}
            </View>

            <View style={styles.ComparisonRow}>
              <View
                style={[
                  styles.ValueCell,
                  row.winner === "left" ? styles.WinnerCell : null,
                ]}
              >
                <Text
                  style={[
                    styles.ValueText,
                    row.winner === "left" ? styles.WinnerText : null,
                  ]}
                >
                  {row.leftText}
                </Text>
                {row.leftDetail ? (
                  <Text style={styles.ValueDetail}>{row.leftDetail}</Text>
                ) : null}
              </View>

              <View style={styles.ValueDivider}>
                <Text style={styles.ValueDividerText}>vs</Text>
              </View>

              <View
                style={[
                  styles.ValueCell,
                  row.winner === "right" ? styles.WinnerCell : null,
                ]}
              >
                <Text
                  style={[
                    styles.ValueText,
                    row.winner === "right" ? styles.WinnerText : null,
                  ]}
                >
                  {row.rightText}
                </Text>
                {row.rightDetail ? (
                  <Text style={styles.ValueDetail}>{row.rightDetail}</Text>
                ) : null}
              </View>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  TableCard: {
    marginTop: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 18,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 10,
  },
  TableTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#111827",
  },
  TableSubtitle: {
    marginTop: 5,
    fontSize: 11,
    lineHeight: 16,
    color: "#6B7280",
  },
  RowsWrap: {
    marginTop: 10,
    gap: 12,
  },
  ComparisonBlock: {
    borderWidth: 1,
    borderColor: "#F3F4F6",
    borderRadius: 14,
    backgroundColor: "#FCFCFD",
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  RowHeader: {
    alignItems: "center",
    paddingHorizontal: 8,
    marginBottom: 8,
  },
  ComparisonRow: {
    flexDirection: "row",
    alignItems: "stretch",
    gap: 8,
  },
  ValueCell: {
    flex: 1,
    minHeight: 68,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  WinnerCell: {
    borderColor: "#BBF7D0",
    backgroundColor: "#F0FDF4",
  },
  ValueText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#111827",
    textAlign: "center",
  },
  ValueDetail: {
    marginTop: 4,
    fontSize: 10,
    lineHeight: 13,
    color: "#6B7280",
    textAlign: "center",
  },
  WinnerText: {
    color: "#15803D",
  },
  ValueDivider: {
    width: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  ValueDividerText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#9CA3AF",
    textTransform: "uppercase",
  },
  RowLabel: {
    fontSize: 12,
    lineHeight: 15,
    fontWeight: "700",
    color: "#111827",
    textAlign: "center",
  },
  RowDescription: {
    marginTop: 4,
    fontSize: 10,
    lineHeight: 14,
    color: "#6B7280",
    textAlign: "center",
  },
});

export default ComparisonRowsCard;

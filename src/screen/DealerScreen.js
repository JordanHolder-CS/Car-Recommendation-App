import { useEffect, useState } from "react";
import {
  ScrollView,
  Text,
  StyleSheet,
  View,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Screen from "../ui/Layout/screen.js";
import BackButton from "../ui/Navigation/BackButton.js";
import DealerList from "../Lists/DealerList.js";

const API_BASE_URL =
  process.env.HTTPS_URL || "https://car-recommendation-database.co.uk/api";
const DEALER_API_URL = `${API_BASE_URL}/dealers`;

export const DealerScreen = ({ navigation }) => {
  const [dealers, setDealers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDealers = async () => {
      try {
        setLoading(true);
        setError(null);
        setDealers([]);

        const response = await fetch(DEALER_API_URL, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setDealers(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching dealers:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDealers();
  }, []);

  const onBack = () => {
    navigation.goBack();
  };

  const onSelectDealer = (dealer) => {
    navigation.navigate("ExpandedDealer", {
      selectedDealer: dealer,
    });
  };

  if (loading) {
    return (
      <Screen>
        <View style={styles.CenterContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.LoadingText}>Loading dealers...</Text>
        </View>
      </Screen>
    );
  }

  if (error) {
    return (
      <Screen>
        <View style={styles.CenterContainer}>
          <Text style={styles.ErrorText}>Error: {error}</Text>
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <SafeAreaView style={styles.Header} edges={["top"]}>
        <BackButton onBack={onBack} />
        <View style={styles.HeaderText}>
          <Text style={styles.HeaderTitle}>Dealers</Text>
        </View>
        <View style={styles.HeaderSpacer} />
      </SafeAreaView>
      <View style={styles.SafeArea}>
        {dealers.length ? (
          <ScrollView>
            <DealerList dealers={dealers} onSelect={onSelectDealer} />
          </ScrollView>
        ) : (
          <View style={styles.CenterContainer}>
            <Text style={styles.EmptyTitle}>No dealers found</Text>
            <Text style={styles.EmptyText}>
              Try again once the dealer endpoint is available.
            </Text>
          </View>
        )}
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  SafeArea: { marginHorizontal: 15, flex: 1 },
  Header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 8,
    paddingVertical: 12,
    backgroundColor: "white",
  },
  HeaderText: {
    alignItems: "center",
  },
  HeaderTitle: {
    fontSize: 17,
    fontWeight: "600",
  },
  HeaderProfile: {
    marginTop: 3,
    fontSize: 13,
    fontWeight: "600",
    color: "#111827",
  },
  HeaderSubtitle: {
    marginTop: 2,
    fontSize: 11,
    color: "#6B7280",
    textTransform: "capitalize",
  },
  HeaderNotice: {
    marginTop: 4,
    maxWidth: 260,
    fontSize: 11,
    color: "#92400E",
    textAlign: "center",
  },
  HeaderSpacer: {
    width: 44,
  },
  CenterContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  LoadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#666",
  },
  ErrorText: {
    fontSize: 16,
    color: "#FF3B30",
    textAlign: "center",
    paddingHorizontal: 20,
  },
  EmptyTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 8,
  },
  EmptyText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
    paddingHorizontal: 24,
  },
  EmptyButtonWrap: {
    width: 220,
  },
});

export default DealerScreen;

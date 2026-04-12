import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Screen from "../ui/Layout/screen";
import BackButton from "../ui/Navigation/BackButton";
import ExpandedDealer from "../ui/DealerCard/expandedDealer";
import DealerInventList from "../Lists/DealerInventList";

const API_BASE_URL =
  process.env.HTTPS_URL || "https://car-recommendation-database.co.uk/api";

const ExpandedDealerScreen = ({ navigation, route }) => {
  const selectedDealer =
    route?.params?.selectedDealer || route?.params?.dealer || null;
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const dealerId = selectedDealer?.dealer_id;

    if (!dealerId) {
      setListings([]);
      setError(null);
      setLoading(false);
      return;
    }

    const fetchDealerListings = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          `${API_BASE_URL}/dealers/${dealerId}/listings`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          },
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setListings(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching dealer listings:", err);
        setError(err.message);
        setListings([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDealerListings();
  }, [selectedDealer?.dealer_id]);

  const handleSelectListing = (listing) => {
    navigation.push("BookingScreen", {
      bookingContext: listing,
      selectedDealer,
    });
  };

  return (
    <Screen>
      <SafeAreaView style={styles.Header} edges={["top"]}>
        <BackButton onBack={() => navigation.goBack()} />
        <View style={styles.HeaderText}>
          <Text style={styles.HeaderTitle}>Dealer</Text>
        </View>
        <View style={styles.HeaderSpacer} />
      </SafeAreaView>

      <View style={styles.SafeArea}>
        {selectedDealer ? (
          <ScrollView contentInsetAdjustmentBehavior="automatic">
            <ExpandedDealer dealer={selectedDealer}>
              <View style={styles.Section}>
                <Text style={styles.SectionTitle}>Current listings</Text>
                {loading ? (
                  <View style={styles.StatusRow}>
                    <ActivityIndicator size="small" color="#007AFF" />
                    <Text style={styles.StatusText}>Loading listings...</Text>
                  </View>
                ) : error ? (
                  <Text style={styles.ErrorText}>Error: {error}</Text>
                ) : listings.length ? (
                  <DealerInventList
                    listings={listings}
                    onSelect={handleSelectListing}
                  />
                ) : (
                  <Text style={styles.StatusText}>No listings found.</Text>
                )}
              </View>
            </ExpandedDealer>
          </ScrollView>
        ) : (
          <View style={styles.EmptyState}>
            <Text style={styles.EmptyText}>Dealer unavailable</Text>
          </View>
        )}
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  SafeArea: {
    // marginHorizontal: 15,
    flex: 1,
  },
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
  HeaderSpacer: {
    width: 44,
  },
  Section: {
    paddingTop: 14,
  },
  SectionTitle: {
    fontWeight: "600",
    color: "#111827",
    fontSize: 14,
  },
  StatusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 8,
  },
  StatusText: {
    marginTop: 8,
    fontSize: 13,
    color: "#6B7280",
  },
  ErrorText: {
    marginTop: 8,
    fontSize: 13,
    color: "#DC2626",
  },
  EmptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  EmptyText: {
    fontSize: 16,
    color: "#6B7280",
  },
});

export default ExpandedDealerScreen;

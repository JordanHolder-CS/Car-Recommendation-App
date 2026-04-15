import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import BookingForm from "../Form/BookingForm";
import BackButton from "../ui/Navigation/BackButton";

const API_BASE_URL =
  process.env.HTTPS_URL || "https://car-recommendation-database.co.uk/api";

const BookingScreen = ({ navigation, route }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const bookingContext = route?.params?.bookingContext ?? null;

  const handleSubmit = async (payload) => {
    try {
      setIsSubmitting(true);

      const requestPayload = {
        ...payload,
        dealerId: bookingContext?.dealerId ?? null,
        dealerInventoryId: bookingContext?.dealerInventoryId ?? null,
        carId: bookingContext?.carId ?? null,
      };

      const response = await fetch(`${API_BASE_URL}/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestPayload),
      });

      const responseData = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          responseData?.error ||
            responseData?.message ||
            `HTTP error! status: ${response.status}`,
        );
      }

      Alert.alert(
        "Booking saved",
        "Your test drive request has been submitted.",
        [{ text: "OK", onPress: () => navigation.goBack() }],
      );
    } catch (error) {
      console.error("Error creating booking:", error);
      Alert.alert("Booking failed", error.message || "Unable to save booking.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const pageTitle = "Book Test Drive";
  const pageSubtitle =
    bookingContext?.dealerName && bookingContext?.vehicleName
      ? `${bookingContext.dealerName} for ${bookingContext.vehicleName}`
      : bookingContext?.dealerName ?? bookingContext?.vehicleName ?? null;

  return (
    <View style={styles.screen}>
      <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
        <View style={styles.header}>
          <BackButton onBack={() => navigation.goBack()} />
          <View style={styles.headerText}>
            <Text style={styles.headerTitle}>{pageTitle}</Text>
            {pageSubtitle ? (
              <Text style={styles.headerSubtitle}>{pageSubtitle}</Text>
            ) : null}
          </View>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            <BookingForm
              onSubmit={handleSubmit}
              bookingContext={bookingContext}
              submitDisabled={isSubmitting}
              submitLabel={
                isSubmitting ? "Sending booking request..." : "Send booking request"
              }
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default BookingScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  safeArea: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 8,
    paddingVertical: 12,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#eef2f6",
  },
  headerText: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 12,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#111827",
  },
  headerSubtitle: {
    marginTop: 2,
    fontSize: 11,
    color: "#6b7280",
    textAlign: "center",
  },
  headerSpacer: {
    width: 44,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 28,
  },
  content: {
    width: "100%",
    maxWidth: 720,
    alignSelf: "center",
  },
});

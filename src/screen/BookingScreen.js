import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BookingForm from "../Form/BookingForm";
import BackButton from "../ui/Navigation/BackButton";

const BookingScreen = ({ navigation, route }) => {
  const bookingContext = route?.params?.bookingContext ?? null;
  const selectedCar =
    route?.params?.selectedCar ?? bookingContext?.selectedCar ?? null;
  const selectedDealer =
    route?.params?.selectedDealer ??
    route?.params?.dealer ??
    bookingContext?.selectedDealer ??
    null;
  const originalEvent =
    bookingContext || selectedCar || selectedDealer
      ? {
          ...bookingContext,
          vehicleName:
            bookingContext?.vehicleName ??
            [
              bookingContext?.year ??
                bookingContext?.model_year ??
                selectedCar?.year ??
                selectedCar?.model_year,
              bookingContext?.brand_name ??
                bookingContext?.brand ??
                selectedCar?.brand_name,
              bookingContext?.car_name ??
                bookingContext?.model ??
                selectedCar?.car_name,
            ]
              .filter(Boolean)
              .join(" "),
          image_url:
            bookingContext?.image_url ??
            bookingContext?.image ??
            selectedCar?.image_url ??
            selectedCar?.image,
          dealerName:
            bookingContext?.dealerName ??
            bookingContext?.dealer_name ??
            selectedDealer?.dealer_name ??
            selectedDealer?.name,
          dealerAddress:
            bookingContext?.dealerAddress ??
            bookingContext?.location ??
            selectedDealer?.location ??
            selectedDealer?.address,
          selectedCar,
          selectedDealer,
        }
      : null;

  const handleSubmit = (payload) => {
    console.log("Booking request preview:", payload);
  };

  const pageTitle = "Book Test Drive";
  const pageSubtitle =
    originalEvent?.dealerName && originalEvent?.vehicleName
      ? `${originalEvent.dealerName} for ${originalEvent.vehicleName}`
      : originalEvent?.dealerName ?? originalEvent?.vehicleName ?? null;

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
            <BookingForm onSubmit={handleSubmit} originalEvent={originalEvent} />
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

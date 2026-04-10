import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BookingForm from "../Form/BookingForm";

const BookingScreen = ({ route }) => {
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
              selectedCar?.year ?? selectedCar?.model_year,
              selectedCar?.brand_name,
              selectedCar?.car_name,
            ]
              .filter(Boolean)
              .join(" "),
          image_url:
            bookingContext?.image_url ??
            selectedCar?.image_url ??
            selectedCar?.image,
          dealerName:
            bookingContext?.dealerName ??
            selectedDealer?.dealer_name ??
            selectedDealer?.name,
          dealerAddress:
            bookingContext?.dealerAddress ??
            selectedDealer?.location ??
            selectedDealer?.address,
          selectedCar,
          selectedDealer,
        }
      : null;

  const handleSubmit = (payload) => {
    console.log("Booking request preview:", payload);
  };

  return (
    <View style={styles.screen}>
      <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.shell}>
            <BookingForm
              onSubmit={handleSubmit}
              originalEvent={originalEvent}
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
    backgroundColor: "#e9edf2",
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 14,
    paddingVertical: 18,
    justifyContent: "center",
  },
});

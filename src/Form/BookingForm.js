import { useEffect, useState } from "react";
import { ImageBackground, StyleSheet, Text, View } from "react-native";
import {
  CalendarDays,
  ChevronRight,
  CircleAlert,
  Clock3,
  Mail,
  Phone,
  UserRound,
} from "lucide-react-native";
import Form from "./Form";
import Selector from "../ui/Navigation/Selector";
import CalendarPicker, {
  formatDateLabel,
  getTodayDateId,
} from "../ui/Calendar/Calendar";
import TimePicker, {
  DEFAULT_TIME_VALUE,
  formatTimeLabel,
} from "../ui/Calendar/Timer";

const DEFAULT_CAR_IMAGE =
  "https://evcentral.com.au/wp-content/uploads/2022/12/Mercedes-AMG-C63-tracking-corner-Ascari.jpg";

const buildVehicleName = (car) =>
  car?.vehicleName ??
  ([
    car?.year ?? car?.model_year,
    car?.brand_name ?? car?.brand,
    car?.car_name ?? car?.model ?? car?.Name,
  ]
    .filter(Boolean)
    .join(" ") ||
    "2023 AMG C63");

const getVehicleImage = (car) =>
  car?.image_url ??
  car?.image ??
  car?.Image ??
  car?.selectedCar?.image_url ??
  DEFAULT_CAR_IMAGE;

const splitVehicleHeading = (vehicleName) => {
  const normalizedVehicleName = String(vehicleName || "").trim();
  const tokens = normalizedVehicleName.split(/\s+/);

  if (tokens.length > 1 && /^\d{4}$/.test(tokens[0])) {
    return {
      eyebrow: tokens[0],
      title: tokens.slice(1).join(" "),
    };
  }

  return {
    eyebrow: null,
    title: normalizedVehicleName,
  };
};

const buildInitialForm = (originalEvent, ownerUserId) => ({
  selectedDate: originalEvent?.selectedDate ?? getTodayDateId(),
  selectedTime: originalEvent?.selectedTime ?? DEFAULT_TIME_VALUE,
  fullName: originalEvent?.fullName ?? "",
  email: originalEvent?.email ?? "",
  phone: originalEvent?.phone ?? "",
});

const BookingForm = ({
  onSubmit = () => {},
  ownerUserId = null,
  originalEvent = null,
}) => {
  const [form, setForm] = useState(() =>
    buildInitialForm(originalEvent, ownerUserId),
  );
  const [isCalendarVisible, setIsCalendarVisible] = useState(false);
  const [isTimePickerVisible, setIsTimePickerVisible] = useState(false);

  useEffect(() => {
    setForm(buildInitialForm(originalEvent, ownerUserId));
  }, [originalEvent, ownerUserId]);

  const handleChange = (field, value) => {
    setForm((currentForm) => ({
      ...currentForm,
      [field]: value,
    }));
  };

  const handleSubmit = () => {
    const vehicleName = buildVehicleName(originalEvent);
    const dealerName = originalEvent?.dealerName ?? "City Motors Manchester";
    const dealerAddress =
      originalEvent?.dealerAddress ?? "Manchester City Centre";

    onSubmit({
      ...form,
      fullName: form.fullName.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      ownerUserId: form.ownerUserId ?? ownerUserId,
      vehicleName,
      dealerName,
      dealerAddress,
    });
  };

  const vehicleName = buildVehicleName(originalEvent);
  const dealerName = originalEvent?.dealerName ?? "City Motors Manchester";
  const dealerAddress =
    originalEvent?.dealerAddress ?? "Manchester City Centre";
  const vehicleImage = getVehicleImage(originalEvent);
  const vehicleHeading = splitVehicleHeading(vehicleName);
  const isSubmitDisabled =
    !form.fullName.trim() || !form.email.trim() || !form.phone.trim();

  return (
    <View style={styles.container}>
      <Form
        onSubmit={handleSubmit}
        submitLabel="Send booking request"
        submitDisabled={isSubmitDisabled}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Book Test Drive</Text>
        </View>

        <ImageBackground
          source={{ uri: vehicleImage }}
          imageStyle={styles.heroImage}
          style={styles.heroCard}
        >
          <View style={styles.heroOverlay}>
            <View style={styles.heroTop}>
              {vehicleHeading.eyebrow ? (
                <Text style={styles.heroEyebrow}>{vehicleHeading.eyebrow}</Text>
              ) : null}
              <Text style={styles.heroTitle}>{vehicleHeading.title}</Text>
            </View>
            <View style={styles.heroBottom}>
              <Text style={styles.heroDealerName}>{dealerName}</Text>
              <Text style={styles.heroDealerAddress}>{dealerAddress}</Text>
            </View>
          </View>
        </ImageBackground>

        <Form.SectionTitle icon={CalendarDays}>Choose date</Form.SectionTitle>
        <SelectionField
          icon={CalendarDays}
          label="Preferred date"
          value={formatDateLabel(form.selectedDate)}
          onPress={() => setIsCalendarVisible(true)}
        />

        <Form.SectionTitle icon={Clock3}>Choose time</Form.SectionTitle>
        <SelectionField
          icon={Clock3}
          label="Preferred time"
          value={formatTimeLabel(form.selectedTime)}
          onPress={() => setIsTimePickerVisible(true)}
        />

        <Form.SectionTitle>Your contact details</Form.SectionTitle>
        <Form.InputText
          icon={UserRound}
          label="Full name"
          required
          value={form.fullName}
          onChange={(value) => handleChange("fullName", value)}
          placeholder="Enter your name"
          autoCapitalize="words"
        />
        <Form.InputText
          icon={Mail}
          label="Email address"
          required
          value={form.email}
          onChange={(value) => handleChange("email", value)}
          placeholder="Enter your email"
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <Form.InputText
          icon={Phone}
          label="Phone number"
          required
          value={form.phone}
          onChange={(value) => handleChange("phone", value)}
          placeholder="Enter your phone number"
          keyboardType="phone-pad"
        />
      </Form>

      <CalendarPicker
        visible={isCalendarVisible}
        selectedDate={form.selectedDate}
        onSelectDate={(dateId) => handleChange("selectedDate", dateId)}
        onClose={() => setIsCalendarVisible(false)}
      />

      <TimePicker
        visible={isTimePickerVisible}
        selectedTime={form.selectedTime}
        onSelectTime={(timeValue) => handleChange("selectedTime", timeValue)}
        onClose={() => setIsTimePickerVisible(false)}
      />
    </View>
  );
};

const SelectionField = ({ icon: Icon, label, value, onPress }) => {
  return (
    <Selector
      onPress={onPress}
      style={styles.selectionField}
      pressedStyle={styles.selectionFieldPressed}
    >
      <View style={styles.selectionFieldLeft}>
        <View style={styles.selectionIconBadge}>
          <Icon color="#667085" size={15} strokeWidth={2.1} />
        </View>
        <View style={styles.selectionTextGroup}>
          <Text style={styles.selectionLabel}>{label}</Text>
          <Text style={styles.selectionValue}>{value}</Text>
        </View>
      </View>
      <ChevronRight color="#98a2b3" size={18} strokeWidth={2.3} />
    </Selector>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  header: {
    marginBottom: 2,
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#101828",
  },
  heroCard: {
    minHeight: 250,
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "#1f2937",
  },
  heroImage: {
    borderRadius: 20,
  },
  heroOverlay: {
    flex: 1,
    justifyContent: "space-between",
    padding: 14,
    backgroundColor: "rgba(10, 14, 20, 0.42)",
  },
  heroTop: {
    alignItems: "flex-start",
  },
  heroEyebrow: {
    fontSize: 18,
    lineHeight: 21,
    color: "#ffffff",
  },
  heroTitle: {
    marginTop: 1,
    maxWidth: "72%",
    fontSize: 18,
    lineHeight: 21,
    fontWeight: "700",
    color: "#ffffff",
  },
  heroBottom: {
    alignItems: "flex-start",
  },
  heroDealerName: {
    maxWidth: "88%",
    fontSize: 23,
    lineHeight: 27,
    color: "#ffffff",
    fontWeight: "300",
  },
  heroDealerAddress: {
    marginTop: 2,
    fontSize: 17,
    lineHeight: 21,
    color: "rgba(255, 255, 255, 0.78)",
    fontWeight: "300",
  },
  selectionField: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e4e7ec",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    minHeight: 68,
  },
  selectionFieldPressed: {
    opacity: 0.85,
  },
  selectionFieldLeft: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
  selectionIconBadge: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#f2f4f7",
    alignItems: "center",
    justifyContent: "center",
  },
  selectionTextGroup: {
    gap: 4,
  },
  selectionLabel: {
    fontSize: 12,
    color: "#667085",
  },
  selectionValue: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
  },
});

export default BookingForm;

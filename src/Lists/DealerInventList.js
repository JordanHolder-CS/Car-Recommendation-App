import { View } from "react-native";
import DealerInventItem from "./DealerInventItem";

const DealerInventList = ({ listings = [], onSelect = () => {} }) => {
  return (
    <View>
      {listings.map((listing) => (
        <DealerInventItem
          key={listing.dealerinventory_id}
          listing={listing}
          onSelect={onSelect}
        />
      ))}
    </View>
  );
};

export default DealerInventList;

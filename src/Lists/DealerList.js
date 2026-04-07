import { View } from "react-native";
import DealerItem from "./DealerItem";

const DealerList = ({ dealers = [], onSelect = () => {} }) => {
  return (
    <View>
      {dealers.map((dealer) => (
        <DealerItem
          key={dealer.dealer_id}
          dealer={dealer}
          onSelect={onSelect}
        />
      ))}
    </View>
  );
};

export default DealerList;

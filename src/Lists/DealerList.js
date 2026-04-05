import { View } from "react-native";
import DealerItem from "./DealerItem";

const DealerList = ({ dealers = [] }) => {
  return (
    <View>
      {dealers.map((dealer) => (
        <DealerItem key={dealer.dealer_id} dealer={dealer} />
      ))}
    </View>
  );
};

export default DealerList;

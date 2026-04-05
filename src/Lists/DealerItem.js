import { DealerContent } from "../ui/DealerCard/collapsedDealer";
import Selector from "../ui/Navigation/Selector";

const DealerItem = ({ dealer, onSelect = () => {} }) => {
  return (
    <Selector onPress={() => onSelect(dealer)}>
      <DealerContent dealer={dealer} />
    </Selector>
  );
};

export default DealerItem;

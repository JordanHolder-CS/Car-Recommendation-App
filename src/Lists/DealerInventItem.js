import Selector from "../ui/Navigation/Selector";
import InventoryContent from "../ui/IntentoryCard.js/collapsedInventory";

const DealerInventItem = ({ listing, onSelect = () => {} }) => {
  return (
    <Selector onPress={() => onSelect(listing)}>
      <InventoryContent listing={listing} />
    </Selector>
  );
};

export default DealerInventItem;

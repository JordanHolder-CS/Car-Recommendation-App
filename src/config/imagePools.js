export const RECOMMENDATION_IMAGE_POOL = [
  "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=1920&q=80",
  "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?w=1920&q=80",
  "https://images.unsplash.com/photo-1547744152-14d985cb937f?w=1920&q=80",
  "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=1920&q=80",
  "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=1920&q=80",
  "https://images.unsplash.com/photo-1618843479619-f3d0d3e8b8c0?w=1920&q=80",
  "https://images.unsplash.com/photo-1502877338535-766e1452684a?w=1920&q=80",
  "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1920&q=80",
  "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=1920&q=80",
  "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=1920&q=80",
];

export const DEALER_INVENTORY_IMAGE_POOL = [
  "https://images.unsplash.com/photo-1542362567-b07e54358753?w=1920&q=80",
  "https://images.unsplash.com/photo-1511918984145-48de785d4c4e?w=1920&q=80",
  "https://images.unsplash.com/photo-1553440569-bcc63803a83d?w=1920&q=80",
  "https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?w=1920&q=80",
  "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1920&q=80",
  "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=1920&q=80",
  "https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?w=1920&q=80",
  "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=1920&q=80",
  "https://images.unsplash.com/photo-1550355291-bbee04a92027?w=1920&q=80",
  "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=1920&q=80",
];

export const DEALER_IMAGE_POOL = [
  "https://media.wired.com/photos/628431090c454f12d5142777/3%3A2/w_2560%2Cc_limit/New-Honda-Facility-Design-Business.jpg",
  "https://www.shutterstock.com/image-photo/outdoor-photo-modern-car-dealership-600nw-2591202017.jpg",
  "https://www.shutterstock.com/image-photo/electric-car-sales-promotion-advertisement-600nw-2584926325.jpg",
  "https://www.shutterstock.com/image-photo/luxurious-sports-cars-parked-showroom-600nw-2591681549.jpg",
  "https://www.shutterstock.com/image-photo/new-car-parked-showroom-details-600nw-2571328087.jpg",
  "https://www.thecollection.com/wp-content/uploads/2025/02/Lamborghini-South-Dade6.png",
  "https://c.files.bbci.co.uk/7918/production/_128000013_merc-benz-ayl-010.jpg",
  "https://www.ffkr.com/wp-content/uploads/2018/11/Dealership-Lindon-Mercedes-Exterior-Entrance-Evening.jpg",
  "https://t4.ftcdn.net/jpg/08/84/60/29/360_F_884602980_aJOH4D7FwuqCQmfZWfOXw7YyfiWjbxB7.jpg",
  "https://www.palmcoastford.com/static/dealer-16495/Used_car_dealer_33_banner.jpg",
];

export const assignImagesInOrder = (items = [], imagePool = []) => {
  if (!Array.isArray(items) || !items.length || !imagePool.length) {
    return [];
  }

  return items.map((item, index) => ({
    ...item,
    image_url: imagePool[index % imagePool.length],
  }));
};

import ServiceCard from "./ServiceCard";

/** Wrapper for Home page grid — delegates to ServiceCard */
const ProductCard = ({ product, index = 0 }) => (
  <ServiceCard service={product} index={index} />
);

export default ProductCard;

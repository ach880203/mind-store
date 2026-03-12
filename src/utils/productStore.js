import productsdb from "../data/productsdb";

const PRODUCT_STORAGE_KEY = "admin_products_v1";

export const loadProducts = () => {
  try {
    const saved = JSON.parse(localStorage.getItem(PRODUCT_STORAGE_KEY));
    if (Array.isArray(saved) && saved.length > 0) {
      return saved;
    }
  } catch (error) {
    // 저장소 값이 비정상이어도 기본 상품 데이터를 보여 주기 위해 안전하게 처리합니다.
  }

  return productsdb;
};

export const findProduct = ({ productId, productName }) => {
  const products = loadProducts();

  if (productId) {
    const matchedById = products.find(
      (product) => String(product.id) === String(productId)
    );
    if (matchedById) {
      return matchedById;
    }
  }

  if (productName) {
    return (
      products.find((product) => String(product.name) === String(productName)) ??
      null
    );
  }

  return null;
};

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

export const saveProducts = (list) => {
  const safeList = Array.isArray(list) ? list : [];
  localStorage.setItem(PRODUCT_STORAGE_KEY, JSON.stringify(safeList));
  return safeList;
};

export const updateProductStock = (productId, quantity = 1) => {
  const parsedQuantity = Number(quantity) || 0;
  const products = loadProducts();
  let updatedProduct = null;

  const nextProducts = products.map((product) => {
    if (String(product.id) !== String(productId)) {
      return product;
    }

    // 주문 후 재고가 화면에 바로 반영되어야 사용자 흐름이 자연스럽습니다.
    const nextStock = Math.max(0, Number(product.stock || 0) - parsedQuantity);
    updatedProduct = {
      ...product,
      stock: nextStock,
      status: nextStock > 0 ? "판매중" : "품절",
    };

    return updatedProduct;
  });

  saveProducts(nextProducts);
  return updatedProduct;
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

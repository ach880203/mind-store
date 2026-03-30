import { loadProducts, updateProductStock } from "./utils/productStore";
import { clearCurrentUser, getCurrentUser, setCurrentUser } from "./utils/auth";

beforeEach(() => {
  localStorage.clear();
});

test("현재 사용자 저장과 조회가 동작한다", () => {
  const user = { user_id: "tester", nick: "테스터", admin: 0 };

  setCurrentUser(user);
  expect(getCurrentUser()).toEqual(user);

  clearCurrentUser();
  expect(getCurrentUser()).toBeNull();
});

test("상품 재고를 차감하면 재고와 상태가 함께 갱신된다", () => {
  const [firstProduct] = loadProducts();
  const originalStock = Number(firstProduct.stock);
  const updatedProduct = updateProductStock(firstProduct.id, 1);

  expect(updatedProduct.stock).toBe(Math.max(0, originalStock - 1));
  expect(updatedProduct.status).toBe(
    Math.max(0, originalStock - 1) > 0 ? "판매중" : "품절"
  );
});

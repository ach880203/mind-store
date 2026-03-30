import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "../../../utils/auth";
import { addOrder, initOrders } from "../../../utils/orderStore";
import { loadProducts, updateProductStock } from "../../../utils/productStore";
import "../shared/UserPage.css";
import "./Products.css";

const priceFormatter = new Intl.NumberFormat("ko-KR");

const Products = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [keyword, setKeyword] = useState("");
  const [notice, setNotice] = useState("");
  const [products, setProducts] = useState([]);

  useEffect(() => {
    initOrders();
    setProducts(loadProducts());
  }, []);

  const categories = useMemo(() => {
    const next = new Set(products.map((product) => product.category).filter(Boolean));
    return ["전체", ...next];
  }, [products]);

  const filteredProducts = useMemo(() => {
    const normalizedKeyword = keyword.trim().toLowerCase();

    return products.filter((product) => {
      const matchesCategory =
        selectedCategory === "전체" || product.category === selectedCategory;

      const targetText = [product.name, product.description, product.category]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesKeyword = !normalizedKeyword || targetText.includes(normalizedKeyword);
      return matchesCategory && matchesKeyword;
    });
  }, [keyword, products, selectedCategory]);

  const handleOrder = (product) => {
    if (!getCurrentUser()) {
      setNotice("주문 내역을 기억하려면 로그인 상태가 필요합니다.");
      navigate("/login");
      return;
    }

    try {
      addOrder({
        product: product.name,
        productId: product.id,
        quantity: 1,
        price: Number(product.price),
      });
      const updatedProduct = updateProductStock(product.id, 1);
      setProducts(loadProducts());

      if (!updatedProduct) {
        setNotice("주문은 저장되었지만 상품 재고 반영에 실패했습니다.");
        return;
      }

      setNotice(
        `'${product.name}' 주문이 저장되었습니다. 남은 재고는 ${updatedProduct.stock}개입니다.`
      );
    } catch (error) {
      setNotice(error.message || "주문 저장 중 문제가 발생했습니다.");
    }
  };

  return (
    <div className="user-page product-page">
      <p className="product-intro">상담과 함께 마음을 정리할 소품을 활용해 보세요.</p>

      <section className="user-section" id="product-list">
        <div className="section-header">
          <div>
            <h2 className="section-title">상품 카탈로그</h2>
          </div>
        </div>

        <div className="product-controls">
          <input
            className="search-input product-search"
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
            placeholder="상품명, 설명, 카테고리로 검색해 보세요"
          />

          <div className="chip-list">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                className={`chip-button ${selectedCategory === category ? "active" : ""}`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {notice && <p className="product-notice">{notice}</p>}

        {filteredProducts.length === 0 ? (
          <div className="empty-state">
            <h3 className="empty-title">조건에 맞는 상품이 아직 없습니다.</h3>
            <p className="empty-description">검색어를 줄이거나 다른 카테고리를 선택하면 더 많은 상품을 볼 수 있습니다.</p>
          </div>
        ) : (
          <div className="product-grid">
            {filteredProducts.map((product) => (
              <article key={product.id} className="user-card product-card">
                <img className="product-image" src={product.image} alt={product.name} />
                <div className="product-body">
                  <span className="product-category">{product.category}</span>
                  <div>
                    <h3>{product.name}</h3>
                    <p className="product-description">{product.description}</p>
                  </div>

                  <div className="product-footer">
                    <div>
                      <div className="product-price">{priceFormatter.format(product.price)}원</div>
                      <div className="product-stock">
                        {Number(product.stock) > 0 ? `재고 ${product.stock}개 남음` : "현재 재고를 준비 중입니다"}
                      </div>
                    </div>
                    <span className="status-pill">{product.status}</span>
                  </div>

                  <button
                    type="button"
                    className="product-order-button"
                    disabled={Number(product.stock) <= 0 || product.status !== "판매중"}
                    onClick={() => handleOrder(product)}
                  >
                    {Number(product.stock) <= 0 || product.status !== "판매중" ? "재고 준비 중" : "바로 주문"}
                  </button>

                  <button
                    type="button"
                    className="product-detail-button"
                    onClick={() => navigate(`/products/detail?id=${product.id}`)}
                  >
                    상세보기
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

    </div>
  );
};

export default Products;

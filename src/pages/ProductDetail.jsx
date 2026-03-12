import { useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { findProduct } from "../utils/productStore";
import "./UserPage.css";
import "./ProductDetail.css";

const priceFormatter = new Intl.NumberFormat("ko-KR");

const ProductDetail = () => {
  const [searchParams] = useSearchParams();
  const productId = searchParams.get("id");
  const productName = searchParams.get("name");
  const source = searchParams.get("from");

  const product = useMemo(
    () => findProduct({ productId, productName }),
    [productId, productName]
  );

  const backTarget = source === "mypage" ? "/mypage?tab=orders" : "/products";

  if (!product) {
    return (
      <div className="user-page product-detail-page">
        <div className="empty-state">
          <h2 className="empty-title">상품 정보를 찾을 수 없습니다.</h2>
          <div className="page-actions">
            <Link to={backTarget} className="primary-link">
              돌아가기
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="user-page product-detail-page">
      <section className="product-detail-card page-surface">
        <div className="product-detail-media">
          <img src={product.image} alt={product.name} />
        </div>

        <div className="product-detail-copy">
          <span className="product-detail-category">{product.category}</span>
          <h1 className="product-detail-title">{product.name}</h1>
          <p className="product-detail-description">{product.description}</p>

          <div className="product-detail-meta">
            <div className="product-detail-meta-item">
              <span>가격</span>
              <strong>{priceFormatter.format(product.price)}원</strong>
            </div>
            <div className="product-detail-meta-item">
              <span>재고</span>
              <strong>{Number(product.stock) > 0 ? `${product.stock}개` : "준비 중"}</strong>
            </div>
            <div className="product-detail-meta-item">
              <span>상태</span>
              <strong>{product.status}</strong>
            </div>
          </div>

          <div className="page-actions">
            <Link to={backTarget} className="primary-link">
              돌아가기
            </Link>
            <Link to="/products" className="secondary-link">
              상품 목록
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProductDetail;

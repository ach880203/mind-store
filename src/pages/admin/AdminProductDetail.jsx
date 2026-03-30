import React, { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { findProduct } from "../../utils/productStore";
import "./AdminProduct.css";

const AdminProductDetail = () => {
  const { id } = useParams();

  const product = useMemo(() => findProduct({ productId: id }), [id]);

  if (!product) {
    return (
      <div className="admin-page">
        <h1>상품 상세</h1>
        <div className="dash-card">
          <p>선택한 상품 정보를 찾을 수 없습니다.</p>
          <Link to="/admin/products" className="admin-home-btn">
            상품 목록으로 돌아가기
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <h1>상품 상세</h1>

      <div className="dash-card">
        {/* 상세 페이지가 비어 보이지 않도록 기본 상품 정보를 모두 보여 줍니다. */}
        <p><strong>상품명:</strong> {product.name}</p>
        <p><strong>카테고리:</strong> {product.category}</p>
        <p><strong>가격:</strong> {Number(product.price).toLocaleString()}원</p>
        <p><strong>재고:</strong> {product.stock}개</p>
        <p><strong>상태:</strong> {product.status}</p>
        <p><strong>설명:</strong> {product.description}</p>
        <div style={{ marginTop: 16 }}>
          <img
            src={product.image}
            alt={product.name}
            style={{ width: "100%", maxWidth: 360, borderRadius: 16 }}
          />
        </div>
        <div style={{ marginTop: 20 }}>
          <Link to="/admin/products" className="admin-home-btn">
            상품 목록으로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminProductDetail;

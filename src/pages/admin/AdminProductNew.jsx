import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminProductNew.css";

const PRODUCT_KEY = "admin_products_v1";

const AdminProductNew = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    category: "",
    price: "",
    stock: "",
    image: "",
    description: "",
  });

  const [toast, setToast] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = () => {
    if (!form.name || !form.price) {
      setToast("상품명과 가격은 필수입니다");
      return;
    }

    // 기존 상품 불러오기
    const saved = JSON.parse(localStorage.getItem(PRODUCT_KEY)) || [];

    // 새 상품 생성
    const newProduct = {
      id: Date.now(), // 임시 PK
      ...form,
      price: Number(form.price),
      stock: Number(form.stock || 0),
      status: Number(form.stock) > 0 ? "판매중" : "품절",
    };

    // 저장
    localStorage.setItem(
      PRODUCT_KEY,
      JSON.stringify([newProduct, ...saved])
    );

    setToast("데모 버전에서는 상품 등록이 제한됩니다");

    // 목록으로 이동
    setTimeout(() => {
      navigate("/admin/products");
    }, 800);
  };

  return (
    <div className="admin-page">
      <h1>상품 등록</h1>

      <div className="product-new-card">
        <div className="form-left">
          <input name="name" placeholder="상품명" onChange={handleChange} />
          <input name="category" placeholder="카테고리" onChange={handleChange} />
          <input name="price" placeholder="가격" onChange={handleChange} />
          <input name="stock" placeholder="재고" onChange={handleChange} />
          <input name="image" placeholder="이미지 URL" onChange={handleChange} />
          <textarea
            name="description"
            placeholder="상품 설명"
            onChange={handleChange}
          />
        </div>

        <div className="preview">
          {form.image ? (
            <img src={form.image} alt="preview" />
          ) : (
            <div className="empty-preview">이미지 미리보기</div>
          )}
          <h3>{form.name || "상품명"}</h3>
          <p>{form.description || "상품 설명"}</p>
        </div>
      </div>

      <div className="form-actions">
        <button className="ghost" onClick={() => navigate(-1)}>
          취소
        </button>
        <button className="primary" onClick={submit}>
          등록
        </button>
      </div>

      {toast && <div className="toast">{toast}</div>}
      <p style={{ opacity: 0.6, marginTop: 12, fontSize: 25 }}>
  ※ 본 프로젝트는 포트폴리오용 데모로, 데모 환경에서는 상품 등록이 제한됩니다. 실제 서비스에서는 서버 API로 등록됩니다.
</p>
    </div>
    
  );
};

export default AdminProductNew;

// src/pages/admin/AdminProduct.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import productsdb from "../../data/productsdb";
import "./AdminProduct.css";
import { useNavigate } from "react-router-dom";

/* 상태 상수 (reservations처럼) */
const STATUS = {
  ON: "판매중",
  SOLDOUT: "품절",
};

const LS_KEY = "admin_products_v1";

const AdminProduct = () => {
  const [products, setProducts] = useState([]);
  const [selected, setSelected] = useState(null);
  const [closing, setClosing] = useState(false);
  const [toast, setToast] = useState("");

  const [statusFilter, setStatusFilter] = useState("전체"); // 전체 | 판매중 | 품절
  const [keyword, setKeyword] = useState("");
  const [debouncedKeyword, setDebouncedKeyword] = useState("");

  const toastTimer = useRef(null);
  const hydratedRef = useRef(false);
  const navigate = useNavigate();


  useEffect(() => {
    try {
      const saved = localStorage.getItem(LS_KEY);
      if (saved) {
      const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setProducts(parsed);
          hydratedRef.current = true;
        return;
        }
      }
    } catch (e) {}

  setProducts(productsdb);
  }, []);

  // persist
  useEffect(() => {
    if (!hydratedRef.current) return;
    localStorage.setItem(LS_KEY, JSON.stringify(products));
  }, [products]);

  // debounce
  useEffect(() => {
    const t = setTimeout(() => setDebouncedKeyword(keyword.trim()), 300);
    return () => clearTimeout(t);
  }, [keyword]);

  const showToast = (msg) => {
    clearTimeout(toastTimer.current);
    setToast(msg);
    toastTimer.current = setTimeout(() => setToast(""), 2000);
  };

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchStatus = statusFilter === "전체" || p.status === statusFilter;

      const k = debouncedKeyword;
      const matchKeyword =
        !k ||
        String(p.name || "").includes(k) ||
        String(p.category || "").includes(k) ||
        String(p.description || "").includes(k);

      return matchStatus && matchKeyword;
    });
  }, [products, statusFilter, debouncedKeyword]);

  const closePanel = () => {
    setClosing(true);
    setTimeout(() => {
      setSelected(null);
      setClosing(false);
    }, 220);
  };

  const updateStatus = (id, newStatus) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: newStatus } : p))
    );

    if (selected?.id === id) {
      setSelected((prev) => ({ ...prev, status: newStatus }));
    }

    showToast(`상품이 '${newStatus}' 상태로 변경되었습니다`);
  };

  const resetDemo = () => {
    if (!window.confirm("더미 데이터로 초기화할까요? (현재 변경사항 삭제)")) return;
    localStorage.removeItem(LS_KEY);
    setProducts(productsdb);
    setSelected(null);
    showToast("초기화 완료");
  };

  const deleteProduct = (id) => {
    const p = products.find((x) => x.id === id);
    if (!window.confirm(`정말 삭제하시겠습니까?\n- ${p?.name}`)) return;

    setProducts((prev) => prev.filter((x) => x.id !== id));
    if (selected?.id === id) closePanel();
    showToast("삭제 완료");
  };

  return (
    <>
      <div className="admin-page">
        <h1>상품 관리</h1>

        <div className="admin-controls">
          <div className="status-filters">
            {["전체", "판매중", "품절"].map((s) => (
              <button
                key={s}
                className={statusFilter === s ? "active" : ""}
                onClick={() => setStatusFilter(s)}
              >
                {s}
              </button>
            ))}
          </div>

          <div className="right-tools">

            <button className="add-btn" onClick={() => navigate("/admin/products/new")}>
              상품 등록
            </button>

            <button className="ghost-btn" onClick={resetDemo}>
              초기화
            </button>

            <input
              className="search-input"
              placeholder="상품명/카테고리/설명 검색"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          </div>
        </div>

        <table className="reservation-table">
          <thead>
            <tr>
              <th>상품명</th>
              <th>카테고리</th>
              <th>가격</th>
              <th>재고</th>
              <th>상태</th>
            </tr>
          </thead>

          <tbody>
            {filteredProducts.length === 0 ? (
              <tr>
                <td colSpan={5} className="empty">
                  검색 결과가 없어요…
                </td>
              </tr>
            ) : (
              filteredProducts.map((p) => (
                <tr key={p.id} onClick={() => setSelected(p)}>
                  <td>{p.name}</td>
                  <td>{p.category}</td>
                  <td>{Number(p.price).toLocaleString()}원</td>
                  <td>{p.stock}</td>
                  <td>
                    <span className={`status ${p.status}`}>{p.status}</span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {selected && (
        <>
          <div className="admin-overlay" onClick={closePanel} />

          <ProductDetailPanel
            product={selected}
            closing={closing}
            onClose={closePanel}
            onStatusChange={updateStatus}
            onDelete={() => deleteProduct(selected.id)}
          />
        </>
      )}

      {toast && <div className="toast">{toast}</div>}
    </>
  );
};

export default AdminProduct;

const ProductDetailPanel = ({ product, closing, onClose, onStatusChange, onDelete }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div className={`admin-detail-panel ${closing ? "closing" : ""}`}>
      <button className="panel-close" onClick={onClose}>✕</button>

      <h2>상품 상세</h2>

      <div className="product-image">
        <img src={product.image} alt={product.name} />
      </div>

      <DetailRow label="상품명" value={product.name} />
      <DetailRow label="카테고리" value={product.category} />
      <DetailRow label="설명" value={product.description} />
      <DetailRow label="가격" value={`${Number(product.price).toLocaleString()}원`} />
      <DetailRow label="재고" value={product.stock} />
      <DetailRow
        label="상태"
        value={<span className={`status ${product.status}`}>{product.status}</span>}
      />

      <div className="status-action">
        <button
          disabled={product.status === STATUS.ON}
          onClick={() => onStatusChange(product.id, STATUS.ON)}
        >
          판매중
        </button>

        <button
          disabled={product.status === STATUS.SOLDOUT}
          onClick={() => onStatusChange(product.id, STATUS.SOLDOUT)}
        >
          품절
        </button>

        <button className="danger" onClick={onDelete}>
          삭제
        </button>
      </div>
    </div>
  );
};

const DetailRow = ({ label, value }) => (
  <div className="detail-row">
    <span className="detail-label">{label}</span>
    <span className="detail-value">{value}</span>
  </div>
);

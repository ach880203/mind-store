import ordersdb from "../data/ordersdb";
import usersdb from "../data/usersdb";
import { getCurrentUser } from "./auth";

const ORDER_STORAGE_KEY = "admin_orders_v1";

const nowString = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const date = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${date} ${hours}:${minutes}`;
};

const normalizeOrder = (order) => {
  const matchedUser = usersdb.find(
    (user) =>
      user.user_id === order?.userId ||
      user.name === order?.user ||
      user.nick === order?.user ||
      user.nick === order?.userNick
  );

  return {
    id: Number(order?.id ?? Date.now()),
    user: order?.user ?? matchedUser?.name ?? matchedUser?.nick ?? "",
    userId: order?.userId ?? matchedUser?.user_id ?? "",
    userNick: order?.userNick ?? matchedUser?.nick ?? "",
    product: order?.product ?? "",
    productId: Number(order?.productId ?? 0),
    quantity: Number(order?.quantity ?? 1),
    price: Number(order?.price ?? 0),
    status: order?.status ?? "결제완료",
    date: order?.date ?? nowString(),
  };
};

const parseOrders = () => {
  try {
    const saved = JSON.parse(localStorage.getItem(ORDER_STORAGE_KEY));
    if (Array.isArray(saved) && saved.length > 0) {
      return saved.map(normalizeOrder);
    }
  } catch (error) {
    // 저장소 데이터가 깨져도 주문 화면이 완전히 비지 않도록 기본 더미 데이터로 복구합니다.
  }

  return null;
};

export const saveOrders = (list) => {
  const normalizedList = Array.isArray(list) ? list.map(normalizeOrder) : [];
  localStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(normalizedList));
  return normalizedList;
};

export const initOrders = (seed = ordersdb) => {
  const savedOrders = parseOrders();
  if (savedOrders) {
    return savedOrders;
  }

  return saveOrders(seed);
};

export const loadOrders = () => {
  return parseOrders() ?? initOrders();
};

export const addOrder = (orderInput) => {
  const currentUser = getCurrentUser();

  if (!currentUser) {
    throw new Error("주문은 로그인 후 이용할 수 있습니다.");
  }

  const previousOrders = loadOrders();
  const nextOrder = normalizeOrder({
    ...orderInput,
    id: Date.now(),
    user: currentUser.name || currentUser.nick,
    userId: currentUser.user_id,
    userNick: currentUser.nick,
    status: "결제완료",
    date: nowString(),
  });

  const nextOrders = [nextOrder, ...previousOrders];
  saveOrders(nextOrders);
  return nextOrder;
};

export const updateOrderStatus = (id, status) => {
  const nextOrders = loadOrders().map((order) =>
    order.id === id ? { ...order, status } : order
  );

  saveOrders(nextOrders);
  return nextOrders;
};

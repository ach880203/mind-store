import usersdb from "../data/usersdb";

const USER_STORAGE_KEY = "admin_users_v1";

const todayString = () => new Date().toLocaleDateString("sv-SE");

const normalizeUser = (user) => ({
  id: Number(user?.id ?? Date.now()),
  name: user?.name ?? "",
  user_id: user?.user_id ?? "",
  user_pw: user?.user_pw ?? "",
  nick: user?.nick ?? "",
  phone: user?.phone ?? "",
  admin: Number(user?.admin ?? 0),
  email: user?.email ?? "",
  reg_date: user?.reg_date ?? todayString(),
  address: user?.address ?? "",
});

const parseUsers = () => {
  try {
    const saved = JSON.parse(localStorage.getItem(USER_STORAGE_KEY));
    if (Array.isArray(saved) && saved.length > 0) {
      return saved.map(normalizeUser);
    }
  } catch (error) {
    // 저장소 데이터가 깨졌을 때도 기본 더미 데이터로 복구할 수 있게 안전하게 처리합니다.
  }

  return null;
};

export const saveUsers = (list) => {
  const normalizedList = Array.isArray(list) ? list.map(normalizeUser) : [];
  localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(normalizedList));
  return normalizedList;
};

export const initUsers = (seed = usersdb) => {
  const savedUsers = parseUsers();
  if (savedUsers) {
    return savedUsers;
  }

  return saveUsers(seed);
};

export const loadUsers = () => {
  return parseUsers() ?? initUsers();
};

export const findUserById = (userId) => {
  return loadUsers().find((user) => user.user_id === userId) ?? null;
};

export const findUserByCredentials = (userId, password) => {
  return (
    loadUsers().find(
      (user) => user.user_id === userId && user.user_pw === password
    ) ?? null
  );
};

export const isDuplicateUserId = (userId, ignoreUserId = null) => {
  return loadUsers().some(
    (user) => user.user_id === userId && user.user_id !== ignoreUserId
  );
};

export const isDuplicateNick = (nick, ignoreUserId = null) => {
  return loadUsers().some(
    (user) => user.nick === nick && user.user_id !== ignoreUserId
  );
};

export const createUser = (userInput) => {
  const currentUsers = loadUsers();
  const maxId = currentUsers.reduce(
    (largestId, user) => Math.max(largestId, Number(user.id) || 0),
    0
  );

  const nextUser = normalizeUser({
    ...userInput,
    id: maxId + 1,
    admin: 0,
    reg_date: todayString(),
  });

  const nextUsers = [nextUser, ...currentUsers];
  saveUsers(nextUsers);
  return nextUser;
};

export const updateUser = (userId, updates) => {
  let updatedUser = null;

  const nextUsers = loadUsers().map((user) => {
    if (user.user_id !== userId) {
      return user;
    }

    updatedUser = normalizeUser({
      ...user,
      ...updates,
      id: user.id,
      user_id: user.user_id,
      reg_date: user.reg_date,
    });

    return updatedUser;
  });

  saveUsers(nextUsers);
  return updatedUser;
};

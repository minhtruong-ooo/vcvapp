import { useEffect, useRef } from "react";
import { useKeycloak } from "@react-keycloak/web";

const INACTIVITY_TIMEOUT = 15 * 60 * 1000; // 15 phút không hoạt động thì logout
const REFRESH_INTERVAL = 60 * 1000; // refresh mỗi 1 phút nếu có hoạt động

const useTokenAutoRefresh = () => {
  const { keycloak } = useKeycloak();
  const lastActivityTimeRef = useRef(Date.now());
  const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const logoutTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Gọi khi có thao tác người dùng
  const updateActivity = () => {
    lastActivityTimeRef.current = Date.now();

    // Reset logout timer
    if (logoutTimeoutRef.current) clearTimeout(logoutTimeoutRef.current);
    logoutTimeoutRef.current = setTimeout(() => {
      keycloak.logout();
    }, INACTIVITY_TIMEOUT);
  };

  useEffect(() => {
    // Đăng ký listener theo dõi thao tác người dùng
    const events = ["mousemove", "keydown", "click"];
    events.forEach((event) => window.addEventListener(event, updateActivity));

    // Thiết lập refresh token định kỳ
    refreshIntervalRef.current = setInterval(() => {
      const now = Date.now();
      const timeSinceLastActivity = now - lastActivityTimeRef.current;

      if (timeSinceLastActivity < INACTIVITY_TIMEOUT) {
        keycloak.updateToken(60).catch(() => {
          keycloak.logout();
        });
      }
    }, REFRESH_INTERVAL);

    updateActivity(); // reset lần đầu

    return () => {
      events.forEach((event) => window.removeEventListener(event, updateActivity));
      if (refreshIntervalRef.current) clearInterval(refreshIntervalRef.current);
      if (logoutTimeoutRef.current) clearTimeout(logoutTimeoutRef.current);
    };
  }, [keycloak]);
};

export default useTokenAutoRefresh;

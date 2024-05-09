export const drawerWidth = 240;
export const drawerWidthClosed = 50;
// Consolidate repetitive axios config setup
export const axiosConfig = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };
};

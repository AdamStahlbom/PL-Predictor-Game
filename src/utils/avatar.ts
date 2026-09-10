export const getFallbackAvatar = (name: string, userId: string) => {
  const colors = [
    "bg-blue-500",
    "bg-emerald-500",
    "bg-violet-500",
    "bg-pink-500",
    "bg-amber-500",
  ];
  const charCode = userId.charCodeAt(userId.length - 1) || 0;
  return {
    color: colors[charCode % colors.length],
    initial: name.substring(0, 1).toUpperCase(),
  };
};

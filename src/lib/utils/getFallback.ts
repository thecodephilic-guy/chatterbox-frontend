export const getFallBack = (fullName: string): string => {
  const words = fullName.trim().split(" ");
  const initials = words.map((word) => word.charAt(0).toUpperCase()).join("");
  return initials;
};

export function formatLastSeen(dateString: Date): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInMinutes < 1) return "Just now";
  if (diffInHours < 24 && date.getDate() === now.getDate()) return "Today";
  if (diffInDays === 1 || (diffInHours < 48 && date.getDate() === now.getDate() - 1)) return "Yesterday";
  if (diffInDays <= 7) return `${diffInDays} days ago`;
  if (diffInDays <= 15) return "A few days ago";

  return "A long time ago";
}

export function formatMessageDate(dateString: Date): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInMinutes < 1) return "just now";
  if (diffInHours < 24 && date.getDate() === now.getDate()) return "today";
  if (diffInDays === 1 || (diffInHours < 48 && date.getDate() === now.getDate() - 1)) return "yesterday";
  if (diffInDays <= 7) return `${diffInDays} days ago`;

  // For older dates, return in dd/mm/yyyy format
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}
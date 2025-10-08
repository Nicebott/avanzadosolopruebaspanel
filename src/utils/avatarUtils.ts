export const getInitials = (name: string | undefined | null): string => {
  if (!name || typeof name !== 'string' || name.trim() === '') return '?';
  
  const words = name.trim().split(' ').filter(word => word.length > 0);
  
  if (words.length === 0) return '?';
  
  if (words.length === 1) {
    return words[0].substring(0, 2).toUpperCase();
  }
  
  return `${words[0][0]}${words[1][0]}`.toUpperCase();
};

export const getAvatarColor = (name: string | undefined | null): string => {
  // Verificación de seguridad para valores undefined/null/vacíos
  if (!name || typeof name !== 'string' || name.trim() === '') {
    return 'bg-gradient-to-br from-gray-500 to-gray-600';
  }
  
  const colors = [
    'bg-gradient-to-br from-blue-500 to-blue-600',
    'bg-gradient-to-br from-green-500 to-green-600',
    'bg-gradient-to-br from-purple-500 to-purple-600',
    'bg-gradient-to-br from-pink-500 to-pink-600',
    'bg-gradient-to-br from-yellow-500 to-yellow-600',
    'bg-gradient-to-br from-red-500 to-red-600',
    'bg-gradient-to-br from-indigo-500 to-indigo-600',
    'bg-gradient-to-br from-teal-500 to-teal-600',
  ];
  
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  return colors[Math.abs(hash) % colors.length];
};
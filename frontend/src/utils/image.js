// Utility function to build correct image URLs from backend paths
export const buildSrc = (path, backendUrl) => {
  if (!path) return '';
  try {
    // If it's already an absolute URL, use it as is
    if (/^https?:\/\//i.test(path)) return path;
    // Remove any leading slashes and normalize path separators
    const normalized = path.replace(/\\\\/g, '/').replace(/^\//, '');
    // Build full URL to backend uploads folder
    const base = (backendUrl || 'http://localhost:8000').replace(/\/$/, '');
    return `${base}/${normalized}`;
  } catch (err) {
    console.error('Error building image URL:', err);
    return '';
  }
};
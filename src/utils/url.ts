import { getBaseUrl } from '@/services/api';

/**
 * Resolves a storage file path or relative URL to a fully qualified URL.
 * Handles paths starting with 'http', absolute paths, and relative backend uploads.
 */
export const getFileUrl = (path: string | null | undefined, defaultPrefix = ''): string => {
  if (!path) return '#';
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  const cleanBase = getBaseUrl();
  const isLegacy = Boolean(defaultPrefix && !path.includes('/') && !path.startsWith('http'));
  
  let normalizedPath = path.startsWith('/') ? path : `/${path}`;
  if (isLegacy) {
    normalizedPath = `/${defaultPrefix.replace(/^\/|\/$/g, '')}/${path}`;
  }

  return `${cleanBase}${normalizedPath}`;
};

/**
 * Alias for getFileUrl for semantic readability when resolving general URLs.
 */
export const resolveUrl = getFileUrl;

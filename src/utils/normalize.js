export function safeParseColors(colors) {
  if (!colors) return ['#18181b', '#ffffff'];
  if (Array.isArray(colors)) return colors;
  if (typeof colors === 'string') {
    let current = colors.trim();
    for (let i = 0; i < 3; i++) {
      if (typeof current === 'string' && (current.startsWith('[') || current.startsWith('{') || current.startsWith('"') || current.startsWith("'"))) {
        try {
          current = JSON.parse(current);
        } catch (e) {
          break;
        }
      } else {
        break;
      }
    }
    if (Array.isArray(current)) return current;
    if (typeof current === 'string' && current.length > 0) {
      if (current.includes(',')) {
        return current.split(',').map((c) => c.trim()).filter(Boolean);
      }
      return [current];
    }
    if (typeof current === 'object' && current !== null) {
      return [current];
    }
  }
  return ['#18181b', '#ffffff'];
}

export function safeParseSizes(sizes) {
  if (!sizes) return ['S', 'M', 'L', 'XL'];
  if (Array.isArray(sizes)) return sizes;
  if (typeof sizes === 'string') {
    let current = sizes.trim();
    for (let i = 0; i < 3; i++) {
      if (typeof current === 'string' && (current.startsWith('[') || current.startsWith('"') || current.startsWith("'"))) {
        try {
          current = JSON.parse(current);
        } catch (e) {
          break;
        }
      } else {
        break;
      }
    }
    if (Array.isArray(current)) return current;
    if (typeof current === 'string' && current.length > 0) {
      if (current.includes(',')) {
        return current.split(',').map((s) => s.trim()).filter(Boolean);
      }
      return [current];
    }
  }
  return ['S', 'M', 'L', 'XL'];
}

export function normalizeCategory(category) {
  if (!category) return 'Apparel';
  if (typeof category === 'object') {
    return category.name || category.title || category.id || 'Apparel';
  }
  return String(category).trim() || 'Apparel';
}

export function normalizeProduct(p) {
  if (!p) return p;
  const rawCat = normalizeCategory(p.category);
  return {
    ...p,
    category: rawCat,
    categoryName: rawCat,
    colors: safeParseColors(p.colors),
    sizes: safeParseSizes(p.sizes)
  };
}

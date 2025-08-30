export const buildCategoryTree = (categories, parentId = null, level = 0) => {
  return categories
    .filter((cat) => cat.parentId === parentId)
    .map((cat) => ({
      ...cat,
      level,
      children: buildCategoryTree(categories, cat._id, level + 1),
    }));
};

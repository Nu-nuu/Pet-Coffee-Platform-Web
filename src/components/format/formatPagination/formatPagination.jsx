export function formatPaginationData(data, pageNumber, pageSize) {
    const startIndex = (pageNumber - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize, data?.length);
    const items = data?.slice(startIndex, endIndex);
    const totalPages = Math.ceil(data?.length / pageSize);
    const hasNext = endIndex < data?.length;
    const hasPrevious = pageNumber > 1;
    return {
        pageSize,
        pageNumber,
        totalPages,
        hasNext,
        hasPrevious,
        items,
    };
}

import React, { useMemo, useCallback } from 'react';
import { FixedSizeGrid as Grid, GridChildComponentProps } from 'react-window';

interface VirtualizedGridProps<T> {
  items: T[];
  renderItem: (item: T, index: number, style: React.CSSProperties) => React.ReactNode;
  itemHeight: number;
  itemWidth: number;
  containerHeight: number;
  containerWidth?: number | string;
  columnCount?: number;
  className?: string;
  gap?: number;
}

function VirtualizedGrid<T>({
  items,
  renderItem,
  itemHeight,
  itemWidth,
  containerHeight,
  containerWidth = 1200,
  columnCount = 3,
  className = '',
  gap = 16
}: VirtualizedGridProps<T>) {
  const gridWidth = typeof containerWidth === 'number' ? containerWidth : 1200;
  const actualColumnCount = Math.min(columnCount, items.length);
  const rowCount = Math.ceil(items.length / actualColumnCount);

  const Cell = useCallback(({ columnIndex, rowIndex, style }: GridChildComponentProps) => {
    const index = rowIndex * actualColumnCount + columnIndex;
    const item = items[index];

    if (!item) return null;

    const cellStyle: React.CSSProperties = {
      ...style,
      left: (typeof style.left === 'number' ? style.left : 0) + gap / 2,
      top: (typeof style.top === 'number' ? style.top : 0) + gap / 2,
      width: (typeof style.width === 'number' ? style.width : itemWidth) - gap,
      height: (typeof style.height === 'number' ? style.height : itemHeight) - gap,
    };

    return (
      <div style={cellStyle}>
        {renderItem(item, index, cellStyle)}
      </div>
    );
  }, [items, actualColumnCount, renderItem, gap, itemWidth, itemHeight]);

  const memoizedGrid = useMemo(() => (
    <Grid
      className={className}
      columnCount={actualColumnCount}
      columnWidth={itemWidth + gap}
      height={containerHeight}
      rowCount={rowCount}
      rowHeight={itemHeight + gap}
      width={gridWidth}
    >
      {Cell}
    </Grid>
  ), [
    className,
    actualColumnCount,
    itemWidth,
    gap,
    containerHeight,
    rowCount,
    itemHeight,
    gridWidth,
    Cell
  ]);

  return memoizedGrid;
}

export default VirtualizedGrid; 
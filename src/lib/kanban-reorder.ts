import type { DropResult } from "@hello-pangea/dnd";

export function buildKanbanOrderUpdates<T extends { id: string; column_id: string; sort_order: number }>(
  items: T[],
  columnIds: readonly string[],
  result: DropResult,
): Pick<T, "id" | "column_id" | "sort_order">[] {
  const { destination, source, draggableId } = result;
  if (!destination) return [];
  if (destination.droppableId === source.droppableId && destination.index === source.index) return [];

  const grouped: Record<string, T[]> = {};
  for (const c of columnIds) {
    grouped[c] = items.filter((t) => t.column_id === c).sort((a, b) => a.sort_order - b.sort_order);
  }

  const colSource = source.droppableId;
  const colDest = destination.droppableId;
  if (!grouped[colSource] || !grouped[colDest]) return [];

  const sourceList = [...grouped[colSource]];
  const destList = colSource === colDest ? sourceList : [...grouped[colDest]];

  const fromIndex = sourceList.findIndex((t) => t.id === draggableId);
  if (fromIndex === -1) return [];
  const [moved] = sourceList.splice(fromIndex, 1);
  if (!moved) return [];

  if (colSource === colDest) {
    sourceList.splice(destination.index, 0, moved);
    grouped[colSource] = sourceList;
  } else {
    destList.splice(destination.index, 0, moved);
    grouped[colSource] = sourceList;
    grouped[colDest] = destList;
  }

  const updates: Pick<T, "id" | "column_id" | "sort_order">[] = [];
  for (const c of columnIds) {
    grouped[c].forEach((t, i) => {
      updates.push({ id: t.id, column_id: c, sort_order: i });
    });
  }
  return updates;
}

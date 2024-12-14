import { Draggable } from '@hello-pangea/dnd';
import { TabsTrigger } from '@/components/ui/tabs';

interface DraggableTabProps {
  league: string;
  index: number;
}

export function DraggableTab({ league, index }: DraggableTabProps) {
  return (
    <Draggable draggableId={league} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={{
            ...provided.draggableProps.style,
            display: 'inline-block'
          }}
        >
          <TabsTrigger
            value={league}
            className={`px-4 py-2 text-sm font-medium whitespace-nowrap cursor-move ${
              snapshot.isDragging ? 'opacity-50' : ''
            }`}
          >
            {league}
          </TabsTrigger>
        </div>
      )}
    </Draggable>
  );
}
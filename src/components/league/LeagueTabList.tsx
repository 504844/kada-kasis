import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useEffect, useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

const LEAGUE_ORDER_KEY = 'kada-kasis-league-order';

interface LeagueTabListProps {
  leagues: string[];
}

export function LeagueTabList({ leagues }: LeagueTabListProps) {
  const [orderedLeagues, setOrderedLeagues] = useState<string[]>(() => {
    const stored = localStorage.getItem(LEAGUE_ORDER_KEY);
    if (stored) {
      const parsedOrder = JSON.parse(stored);
      const newLeagues = leagues.filter(league => !parsedOrder.includes(league));
      return [...parsedOrder, ...newLeagues];
    }
    return leagues;
  });

  useEffect(() => {
    const newLeagues = leagues.filter(league => !orderedLeagues.includes(league));
    if (newLeagues.length > 0) {
      setOrderedLeagues(prev => [...prev, ...newLeagues]);
    }
  }, [leagues]);

  useEffect(() => {
    localStorage.setItem(LEAGUE_ORDER_KEY, JSON.stringify(orderedLeagues));
  }, [orderedLeagues]);

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(orderedLeagues);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setOrderedLeagues(items);
  };

  return (
    <ScrollArea className="w-full">
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="leagues" direction="horizontal">
          {(provided) => (
            <TabsList
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="inline-flex p-1.5 bg-muted/50 rounded-full gap-2"
            >
              {orderedLeagues.map((league, index) => (
                <Draggable key={league} draggableId={league} index={index}>
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
              ))}
              {provided.placeholder}
            </TabsList>
          )}
        </Droppable>
      </DragDropContext>
    </ScrollArea>
  );
}
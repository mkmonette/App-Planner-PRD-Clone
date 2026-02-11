import { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import BlockItem from '@/components/BlockItem';

const BlockTree = ({
  blocks,
  allBlocks,
  selectedBlockId,
  onSelectBlock,
  onUpdateBlock,
  onDeleteBlock,
  onAddBlock,
  onReorderBlocks,
  collapsedState,
  onToggleCollapse,
}) => {
  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;
    
    // Get the parent ID from the droppable ID
    const sourceParentId = source.droppableId === 'root' ? null : source.droppableId;
    const destParentId = destination.droppableId === 'root' ? null : destination.droppableId;
    
    // Get siblings at destination
    const destSiblings = allBlocks
      .filter(b => b.parent_id === destParentId)
      .sort((a, b) => a.order - b.order);
    
    // Create new order
    const draggedBlock = allBlocks.find(b => b.id === draggableId);
    if (!draggedBlock) return;

    // Remove from current position
    const filteredSiblings = destSiblings.filter(b => b.id !== draggableId);
    
    // Insert at new position
    filteredSiblings.splice(destination.index, 0, draggedBlock);
    
    // Update order for all siblings
    const newOrder = filteredSiblings.map(b => b.id);
    onReorderBlocks(newOrder, destParentId);
  };

  const renderBlockWithChildren = (block, index, parentId = 'root') => {
    const isCollapsed = collapsedState[block.id];
    const hasChildren = block.children && block.children.length > 0;

    return (
      <Draggable key={block.id} draggableId={block.id} index={index}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            className={snapshot.isDragging ? 'z-50' : ''}
          >
            <BlockItem
              block={block}
              isSelected={selectedBlockId === block.id}
              isCollapsed={isCollapsed}
              hasChildren={hasChildren}
              onSelect={() => onSelectBlock(block.id)}
              onUpdate={(updates) => onUpdateBlock(block.id, updates)}
              onDelete={() => onDeleteBlock(block.id)}
              onAddChild={onAddBlock}
              onToggleCollapse={() => onToggleCollapse(block.id)}
              dragHandleProps={provided.dragHandleProps}
              isDragging={snapshot.isDragging}
            />
            
            {/* Children */}
            {hasChildren && !isCollapsed && (
              <div className="ml-6 pl-4 border-l border-[#27272a]">
                <Droppable droppableId={block.id} type="BLOCK">
                  {(droppableProvided, droppableSnapshot) => (
                    <div
                      ref={droppableProvided.innerRef}
                      {...droppableProvided.droppableProps}
                      className={`min-h-[8px] ${droppableSnapshot.isDraggingOver ? 'bg-blue-500/5 rounded' : ''}`}
                    >
                      {block.children.map((child, childIndex) => 
                        renderBlockWithChildren(child, childIndex, block.id)
                      )}
                      {droppableProvided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            )}
          </div>
        )}
      </Draggable>
    );
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="root" type="BLOCK">
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`space-y-2 ${snapshot.isDraggingOver ? 'bg-blue-500/5 rounded-lg p-2' : ''}`}
          >
            {blocks.map((block, index) => renderBlockWithChildren(block, index))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default BlockTree;

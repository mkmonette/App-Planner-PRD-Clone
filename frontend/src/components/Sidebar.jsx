import { useState } from 'react';
import { ChevronRight, ChevronDown, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuLabel } from '@/components/ui/dropdown-menu';
import { BLOCK_TYPE_CONFIG, BLOCK_STATUS_CONFIG } from '@/utils/constants';
import storage from '@/utils/storage';

const SidebarItem = ({ 
  block, 
  depth = 0, 
  selectedBlockId, 
  onSelectBlock, 
  onAddBlock,
  collapsedState,
  onToggleCollapse,
  allBlocks
}) => {
  const children = allBlocks.filter(b => b.parent_id === block.id).sort((a, b) => a.order - b.order);
  const hasChildren = children.length > 0;
  const isCollapsed = collapsedState[block.id];
  const isSelected = selectedBlockId === block.id;
  const config = BLOCK_TYPE_CONFIG[block.type] || {};
  const statusConfig = BLOCK_STATUS_CONFIG[block.status] || {};
  const isDeprecated = block.status === 'deprecated';

  return (
    <div>
      <div
        data-testid={`sidebar-block-${block.id}`}
        className={`
          flex items-center gap-1 px-2 py-1.5 cursor-pointer group transition-colors
          ${isSelected ? 'bg-orange-500/10 border-l-2 border-orange-500' : 'border-l-2 border-transparent hover:bg-white/5'}
          ${isDeprecated ? 'opacity-50' : ''}
        `}
        style={{ paddingLeft: `${depth * 16 + 8}px` }}
        onClick={() => onSelectBlock(block.id)}
      >
        {/* Expand/Collapse Toggle */}
        <button
          data-testid={`toggle-collapse-${block.id}`}
          onClick={(e) => {
            e.stopPropagation();
            onToggleCollapse(block.id);
          }}
          className="w-5 h-5 flex items-center justify-center text-[#52525b] hover:text-[#a1a1aa] shrink-0"
        >
          {hasChildren ? (
            isCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )
          ) : (
            <span className="w-4" />
          )}
        </button>

        {/* Type Indicator */}
        <span 
          className="w-2 h-2 rounded-full shrink-0" 
          style={{ backgroundColor: config.color || '#52525b' }}
        />

        {/* Title */}
        <span 
          className={`
            flex-1 text-sm truncate
            ${isSelected ? 'text-[#ededed]' : 'text-[#a1a1aa]'}
            ${isDeprecated ? 'line-through' : ''}
          `}
        >
          {block.title}
        </span>

        {/* Status Indicator */}
        <span 
          className="w-1.5 h-1.5 rounded-full shrink-0"
          style={{ backgroundColor: statusConfig.color || '#52525b' }}
          title={statusConfig.label}
        />

        {/* Add Child Button */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
            <Button
              data-testid={`add-child-${block.id}`}
              variant="ghost"
              size="icon"
              className="w-5 h-5 opacity-0 group-hover:opacity-100 text-[#52525b] hover:text-[#a1a1aa] hover:bg-[#27272a]"
            >
              <Plus className="w-3 h-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-[#121212] border-[#27272a] w-48">
            <DropdownMenuLabel className="text-[#71717a] text-xs">Add Child Block</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-[#27272a]" />
            {Object.entries(BLOCK_TYPE_CONFIG).map(([type, typeConfig]) => (
              <DropdownMenuItem
                key={type}
                data-testid={`add-child-${type}-${block.id}`}
                className="cursor-pointer text-[#a1a1aa] hover:text-[#ededed] focus:text-[#ededed] focus:bg-[#27272a] text-xs"
                onClick={(e) => {
                  e.stopPropagation();
                  onAddBlock(type, block.id);
                }}
              >
                <span 
                  className="w-2 h-2 rounded-full mr-2" 
                  style={{ backgroundColor: typeConfig.color }}
                />
                {typeConfig.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Children */}
      {hasChildren && !isCollapsed && (
        <div className="animate-slide-down">
          {children.map((child) => (
            <SidebarItem
              key={child.id}
              block={child}
              depth={depth + 1}
              selectedBlockId={selectedBlockId}
              onSelectBlock={onSelectBlock}
              onAddBlock={onAddBlock}
              collapsedState={collapsedState}
              onToggleCollapse={onToggleCollapse}
              allBlocks={allBlocks}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const Sidebar = ({ 
  blocks, 
  selectedBlockId, 
  onSelectBlock, 
  onAddBlock,
  collapsedState,
  onToggleCollapse
}) => {
  const rootBlocks = blocks
    .filter(b => b.parent_id === null)
    .sort((a, b) => a.order - b.order);

  return (
    <aside className="w-64 bg-[#020202] border-r border-[#27272a] flex flex-col noise-texture shrink-0">
      {/* Sidebar Header */}
      <div className="px-4 py-3 border-b border-[#27272a]">
        <h2 className="text-xs font-semibold text-[#52525b] uppercase tracking-wider">
          Blocks
        </h2>
      </div>

      {/* Block Tree */}
      <ScrollArea className="flex-1">
        <div className="py-2">
          {rootBlocks.length === 0 ? (
            <div className="px-4 py-8 text-center">
              <p className="text-xs text-[#52525b]">No blocks yet</p>
              <p className="text-xs text-[#3f3f46] mt-1">
                Add a block to get started
              </p>
            </div>
          ) : (
            rootBlocks.map((block) => (
              <SidebarItem
                key={block.id}
                block={block}
                selectedBlockId={selectedBlockId}
                onSelectBlock={onSelectBlock}
                onAddBlock={onAddBlock}
                collapsedState={collapsedState}
                onToggleCollapse={onToggleCollapse}
                allBlocks={blocks}
              />
            ))
          )}
        </div>
      </ScrollArea>

      {/* Sidebar Footer */}
      <div className="p-3 border-t border-[#27272a]">
        <p className="text-xs text-[#52525b] text-center">
          {blocks.length} block{blocks.length !== 1 ? 's' : ''} total
        </p>
      </div>
    </aside>
  );
};

export default Sidebar;

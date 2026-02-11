import { useState } from 'react';
import { 
  GripVertical, 
  ChevronRight, 
  ChevronDown, 
  Plus,
  MoreHorizontal,
  Trash2,
  Copy,
  ExternalLink
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuLabel } from '@/components/ui/dropdown-menu';
import { 
  BLOCK_TYPE_CONFIG, 
  BLOCK_STATUS_CONFIG, 
  BLOCK_PRIORITY_CONFIG,
  BLOCK_STATUSES,
  BLOCK_PRIORITIES
} from '@/utils/constants';

const BlockItem = ({
  block,
  isSelected,
  isCollapsed,
  hasChildren,
  onSelect,
  onUpdate,
  onDelete,
  onAddChild,
  onToggleCollapse,
  dragHandleProps,
  isDragging,
}) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editTitle, setEditTitle] = useState(block.title);
  
  const typeConfig = BLOCK_TYPE_CONFIG[block.type] || {};
  const statusConfig = BLOCK_STATUS_CONFIG[block.status] || {};
  const priorityConfig = block.priority ? BLOCK_PRIORITY_CONFIG[block.priority] : null;
  const isDeprecated = block.status === 'deprecated';

  const handleTitleSubmit = () => {
    if (editTitle.trim() && editTitle !== block.title) {
      onUpdate({ title: editTitle.trim() });
    } else {
      setEditTitle(block.title);
    }
    setIsEditingTitle(false);
  };

  const handleTitleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleTitleSubmit();
    } else if (e.key === 'Escape') {
      setEditTitle(block.title);
      setIsEditingTitle(false);
    }
  };

  return (
    <div
      data-testid={`block-item-${block.id}`}
      className={`
        group rounded-md border transition-all duration-200
        ${isSelected 
          ? 'border-l-2 border-l-orange-500 border-[#3f3f46] bg-orange-500/5' 
          : 'border-[#27272a] hover:border-[#3f3f46] hover:bg-white/[0.02]'
        }
        ${isDragging ? 'shadow-lg bg-[#1a1a1a] border-blue-500' : ''}
        ${isDeprecated ? 'opacity-60' : ''}
      `}
      onClick={onSelect}
    >
      <div className="flex items-center gap-2 px-3 py-2.5">
        {/* Drag Handle */}
        <div
          {...dragHandleProps}
          className="drag-handle text-[#52525b] hover:text-[#a1a1aa] cursor-grab active:cursor-grabbing"
        >
          <GripVertical className="w-4 h-4" />
        </div>

        {/* Expand/Collapse */}
        <button
          data-testid={`block-toggle-${block.id}`}
          onClick={(e) => {
            e.stopPropagation();
            onToggleCollapse();
          }}
          className="w-5 h-5 flex items-center justify-center text-[#52525b] hover:text-[#a1a1aa]"
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

        {/* Type Badge */}
        <span
          data-testid={`block-type-${block.id}`}
          className={`text-[10px] uppercase tracking-wider font-bold px-1.5 py-0.5 rounded-sm border ${typeConfig.bgColor} ${typeConfig.borderColor}`}
          style={{ color: typeConfig.color }}
        >
          {typeConfig.label?.split(' ')[0] || 'Block'}
        </span>

        {/* Title (Inline Editable) */}
        <div className="flex-1 min-w-0">
          {isEditingTitle ? (
            <Input
              data-testid={`block-title-input-${block.id}`}
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onBlur={handleTitleSubmit}
              onKeyDown={handleTitleKeyDown}
              autoFocus
              className="h-7 px-2 py-1 text-sm bg-[#121212] border-blue-500 text-[#ededed]"
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <span
              data-testid={`block-title-${block.id}`}
              className={`
                text-sm font-medium cursor-text hover:text-orange-400 transition-colors
                ${isSelected ? 'text-[#ededed]' : 'text-[#a1a1aa]'}
                ${isDeprecated ? 'line-through' : ''}
              `}
              onDoubleClick={(e) => {
                e.stopPropagation();
                setIsEditingTitle(true);
              }}
            >
              {block.title}
            </span>
          )}
        </div>

        {/* Priority Badge */}
        {priorityConfig && (
          <span
            data-testid={`block-priority-${block.id}`}
            className={`text-[9px] uppercase tracking-wider font-bold px-1.5 py-0.5 rounded-sm border ${priorityConfig.bgColor} ${priorityConfig.borderColor} ${priorityConfig.textColor}`}
          >
            {priorityConfig.label?.split(' ')[0]}
          </span>
        )}

        {/* Status Dropdown */}
        <Select
          value={block.status}
          onValueChange={(value) => onUpdate({ status: value })}
        >
          <SelectTrigger 
            data-testid={`block-status-select-${block.id}`}
            className={`
              h-6 w-auto min-w-[90px] text-[10px] uppercase tracking-wider font-bold 
              border ${statusConfig.bgColor} ${statusConfig.borderColor} ${statusConfig.textColor}
              bg-transparent hover:bg-white/5
            `}
            onClick={(e) => e.stopPropagation()}
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-[#121212] border-[#27272a]">
            {Object.entries(BLOCK_STATUS_CONFIG).map(([status, config]) => (
              <SelectItem 
                key={status} 
                value={status}
                data-testid={`status-option-${status}`}
                className={`text-xs ${config.textColor} focus:bg-[#27272a]`}
              >
                {config.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Priority Dropdown */}
        <Select
          value={block.priority || 'none'}
          onValueChange={(value) => onUpdate({ priority: value === 'none' ? null : value })}
        >
          <SelectTrigger 
            data-testid={`block-priority-select-${block.id}`}
            className="h-6 w-auto min-w-[70px] text-[10px] uppercase tracking-wider font-bold border border-[#27272a] text-[#71717a] bg-transparent hover:bg-white/5"
            onClick={(e) => e.stopPropagation()}
          >
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent className="bg-[#121212] border-[#27272a]">
            <SelectItem 
              value="none"
              className="text-xs text-[#71717a] focus:bg-[#27272a]"
            >
              No Priority
            </SelectItem>
            {Object.entries(BLOCK_PRIORITY_CONFIG).map(([priority, config]) => (
              <SelectItem 
                key={priority} 
                value={priority}
                data-testid={`priority-option-${priority}`}
                className={`text-xs ${config.textColor} focus:bg-[#27272a]`}
              >
                {config.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Actions */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {/* Add Child */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                data-testid={`add-child-btn-${block.id}`}
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-[#52525b] hover:text-[#a1a1aa] hover:bg-[#27272a]"
                onClick={(e) => e.stopPropagation()}
              >
                <Plus className="w-3.5 h-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-[#121212] border-[#27272a] w-48">
              <DropdownMenuLabel className="text-[#71717a] text-xs">Add Child Block</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-[#27272a]" />
              {Object.entries(BLOCK_TYPE_CONFIG).map(([type, config]) => (
                <DropdownMenuItem
                  key={type}
                  data-testid={`add-child-type-${type}-${block.id}`}
                  className="cursor-pointer text-[#a1a1aa] hover:text-[#ededed] focus:text-[#ededed] focus:bg-[#27272a] text-xs"
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddChild(type, block.id);
                  }}
                >
                  <span 
                    className="w-2 h-2 rounded-full mr-2" 
                    style={{ backgroundColor: config.color }}
                  />
                  {config.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* More Actions */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                data-testid={`block-more-actions-${block.id}`}
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-[#52525b] hover:text-[#a1a1aa] hover:bg-[#27272a]"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreHorizontal className="w-3.5 h-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-[#121212] border-[#27272a]">
              <DropdownMenuItem
                data-testid={`copy-block-id-${block.id}`}
                className="cursor-pointer text-[#a1a1aa] focus:text-[#ededed] focus:bg-[#27272a] text-xs"
                onClick={(e) => {
                  e.stopPropagation();
                  navigator.clipboard.writeText(block.id);
                }}
              >
                <Copy className="w-3.5 h-3.5 mr-2" />
                Copy Block ID
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-[#27272a]" />
              <DropdownMenuItem
                data-testid={`delete-block-btn-${block.id}`}
                className="cursor-pointer text-red-400 focus:text-red-400 focus:bg-red-500/10 text-xs"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                }}
              >
                <Trash2 className="w-3.5 h-3.5 mr-2" />
                Deprecate Block
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Description Preview (if exists and not collapsed) */}
      {block.description && !isCollapsed && (
        <div className="px-3 pb-2.5 pt-0">
          <p className="text-xs text-[#71717a] line-clamp-2 pl-[52px]">
            {block.description}
          </p>
        </div>
      )}
    </div>
  );
};

export default BlockItem;

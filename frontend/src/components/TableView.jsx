import { useState } from 'react';
import { ArrowUpDown, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  BLOCK_TYPE_CONFIG, 
  BLOCK_STATUS_CONFIG, 
  BLOCK_PRIORITY_CONFIG,
} from '@/utils/constants';

const TableView = ({
  blocks,
  onSelectBlock,
  onUpdateBlock,
  onDeleteBlock,
}) => {
  const [sortField, setSortField] = useState('created_at');
  const [sortDirection, setSortDirection] = useState('desc');

  const sortedBlocks = [...blocks].sort((a, b) => {
    let aVal = a[sortField];
    let bVal = b[sortField];
    
    if (sortField === 'created_at' || sortField === 'updated_at') {
      aVal = new Date(aVal).getTime();
      bVal = new Date(bVal).getTime();
    }
    
    if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const SortButton = ({ field, children }) => (
    <Button
      variant="ghost"
      size="sm"
      className="h-8 px-2 text-[#71717a] hover:text-[#ededed] hover:bg-[#27272a] -ml-2"
      onClick={() => handleSort(field)}
    >
      {children}
      <ArrowUpDown className="ml-1 h-3 w-3" />
    </Button>
  );

  return (
    <div className="rounded-lg border border-[#27272a] overflow-hidden">
      <Table>
        <TableHeader className="bg-[#0a0a0b]">
          <TableRow className="border-[#27272a] hover:bg-transparent">
            <TableHead className="text-[#71717a] font-medium">
              <SortButton field="title">Title</SortButton>
            </TableHead>
            <TableHead className="text-[#71717a] font-medium w-32">
              <SortButton field="type">Type</SortButton>
            </TableHead>
            <TableHead className="text-[#71717a] font-medium w-32">
              <SortButton field="status">Status</SortButton>
            </TableHead>
            <TableHead className="text-[#71717a] font-medium w-28">
              <SortButton field="priority">Priority</SortButton>
            </TableHead>
            <TableHead className="text-[#71717a] font-medium w-36">
              <SortButton field="updated_at">Updated</SortButton>
            </TableHead>
            <TableHead className="text-[#71717a] font-medium w-20">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedBlocks.map((block) => {
            const typeConfig = BLOCK_TYPE_CONFIG[block.type] || {};
            const statusConfig = BLOCK_STATUS_CONFIG[block.status] || {};
            const priorityConfig = block.priority ? BLOCK_PRIORITY_CONFIG[block.priority] : null;
            const isDeprecated = block.status === 'deprecated';

            return (
              <TableRow
                key={block.id}
                data-testid={`table-row-${block.id}`}
                className={`
                  border-[#27272a] cursor-pointer 
                  hover:bg-white/[0.02] transition-colors
                  ${isDeprecated ? 'opacity-50' : ''}
                `}
                onClick={() => onSelectBlock(block.id)}
              >
                {/* Title */}
                <TableCell className="font-medium">
                  <span 
                    data-testid={`table-title-${block.id}`}
                    className={`text-[#ededed] ${isDeprecated ? 'line-through' : ''}`}
                  >
                    {block.title}
                  </span>
                  {block.description && (
                    <p className="text-xs text-[#52525b] mt-0.5 line-clamp-1">
                      {block.description}
                    </p>
                  )}
                </TableCell>

                {/* Type */}
                <TableCell>
                  <span
                    data-testid={`table-type-${block.id}`}
                    className={`text-[10px] uppercase tracking-wider font-bold px-1.5 py-0.5 rounded-sm border ${typeConfig.bgColor} ${typeConfig.borderColor}`}
                    style={{ color: typeConfig.color }}
                  >
                    {typeConfig.label?.split(' ')[0] || 'Block'}
                  </span>
                </TableCell>

                {/* Status */}
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <Select
                    value={block.status}
                    onValueChange={(value) => onUpdateBlock(block.id, { status: value })}
                  >
                    <SelectTrigger 
                      data-testid={`table-status-${block.id}`}
                      className={`
                        h-6 w-full text-[10px] uppercase tracking-wider font-bold 
                        border ${statusConfig.bgColor} ${statusConfig.borderColor} ${statusConfig.textColor}
                        bg-transparent hover:bg-white/5
                      `}
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#121212] border-[#27272a]">
                      {Object.entries(BLOCK_STATUS_CONFIG).map(([status, config]) => (
                        <SelectItem 
                          key={status} 
                          value={status}
                          className={`text-xs ${config.textColor} focus:bg-[#27272a]`}
                        >
                          {config.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>

                {/* Priority */}
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <Select
                    value={block.priority || 'none'}
                    onValueChange={(value) => onUpdateBlock(block.id, { priority: value === 'none' ? null : value })}
                  >
                    <SelectTrigger 
                      data-testid={`table-priority-${block.id}`}
                      className={`
                        h-6 w-full text-[10px] uppercase tracking-wider font-bold 
                        border ${priorityConfig ? `${priorityConfig.bgColor} ${priorityConfig.borderColor} ${priorityConfig.textColor}` : 'border-[#27272a] text-[#52525b]'}
                        bg-transparent hover:bg-white/5
                      `}
                    >
                      <SelectValue placeholder="—" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#121212] border-[#27272a]">
                      <SelectItem 
                        value="none"
                        className="text-xs text-[#52525b] focus:bg-[#27272a]"
                      >
                        No Priority
                      </SelectItem>
                      {Object.entries(BLOCK_PRIORITY_CONFIG).map(([priority, config]) => (
                        <SelectItem 
                          key={priority} 
                          value={priority}
                          className={`text-xs ${config.textColor} focus:bg-[#27272a]`}
                        >
                          {config.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>

                {/* Updated */}
                <TableCell className="text-xs text-[#71717a]">
                  {formatDate(block.updated_at)}
                </TableCell>

                {/* Actions */}
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <Button
                    data-testid={`table-delete-${block.id}`}
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-[#52525b] hover:text-red-400 hover:bg-red-500/10"
                    onClick={() => onDeleteBlock(block.id)}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default TableView;

import { useState, useEffect } from 'react';
import { X, Trash2, Clock, Hash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { 
  BLOCK_TYPE_CONFIG, 
  BLOCK_STATUS_CONFIG, 
  BLOCK_PRIORITY_CONFIG,
  BLOCK_TYPES
} from '@/utils/constants';

const BlockEditor = ({ block, onUpdate, onClose, onDelete }) => {
  const [localBlock, setLocalBlock] = useState(block);
  
  useEffect(() => {
    setLocalBlock(block);
  }, [block]);

  const handleChange = (field, value) => {
    setLocalBlock(prev => ({ ...prev, [field]: value }));
  };

  const handleBlur = (field) => {
    if (localBlock[field] !== block[field]) {
      onUpdate({ [field]: localBlock[field] });
    }
  };

  const typeConfig = BLOCK_TYPE_CONFIG[block.type] || {};
  const statusConfig = BLOCK_STATUS_CONFIG[block.status] || {};
  const isDeprecated = block.status === 'deprecated';

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <aside 
      data-testid="block-editor-panel"
      className="w-80 bg-[#0a0a0b] border-l border-[#27272a] flex flex-col shrink-0"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#27272a]">
        <div className="flex items-center gap-2">
          <span
            className={`text-[10px] uppercase tracking-wider font-bold px-1.5 py-0.5 rounded-sm border ${typeConfig.bgColor} ${typeConfig.borderColor}`}
            style={{ color: typeConfig.color }}
          >
            {typeConfig.label || 'Block'}
          </span>
        </div>
        <Button
          data-testid="close-editor-btn"
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="h-7 w-7 text-[#52525b] hover:text-[#ededed] hover:bg-[#27272a]"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Content */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-5">
          {/* Title */}
          <div className="space-y-2">
            <Label className="text-xs text-[#71717a] uppercase tracking-wider">Title</Label>
            <Input
              data-testid="editor-title-input"
              value={localBlock.title}
              onChange={(e) => handleChange('title', e.target.value)}
              onBlur={() => handleBlur('title')}
              className={`bg-[#121212] border-[#27272a] text-[#ededed] focus:border-blue-500 ${isDeprecated ? 'line-through' : ''}`}
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label className="text-xs text-[#71717a] uppercase tracking-wider">Description</Label>
            <Textarea
              data-testid="editor-description-input"
              value={localBlock.description || ''}
              onChange={(e) => handleChange('description', e.target.value)}
              onBlur={() => handleBlur('description')}
              placeholder="Add a description..."
              className="bg-[#121212] border-[#27272a] text-[#ededed] placeholder:text-[#52525b] focus:border-blue-500 min-h-[80px] resize-none"
            />
          </div>

          <Separator className="bg-[#27272a]" />

          {/* Type */}
          <div className="space-y-2">
            <Label className="text-xs text-[#71717a] uppercase tracking-wider">Type</Label>
            <Select
              value={localBlock.type}
              onValueChange={(value) => {
                handleChange('type', value);
                onUpdate({ type: value });
              }}
            >
              <SelectTrigger 
                data-testid="editor-type-select"
                className="bg-[#121212] border-[#27272a] text-[#ededed]"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[#121212] border-[#27272a]">
                {Object.entries(BLOCK_TYPE_CONFIG).map(([type, config]) => (
                  <SelectItem 
                    key={type} 
                    value={type}
                    className="text-[#a1a1aa] focus:bg-[#27272a] focus:text-[#ededed]"
                  >
                    <div className="flex items-center gap-2">
                      <span 
                        className="w-2 h-2 rounded-full" 
                        style={{ backgroundColor: config.color }}
                      />
                      {config.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label className="text-xs text-[#71717a] uppercase tracking-wider">Status</Label>
            <Select
              value={localBlock.status}
              onValueChange={(value) => {
                handleChange('status', value);
                onUpdate({ status: value });
              }}
            >
              <SelectTrigger 
                data-testid="editor-status-select"
                className={`bg-[#121212] border-[#27272a] ${statusConfig.textColor}`}
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[#121212] border-[#27272a]">
                {Object.entries(BLOCK_STATUS_CONFIG).map(([status, config]) => (
                  <SelectItem 
                    key={status} 
                    value={status}
                    className={`${config.textColor} focus:bg-[#27272a]`}
                  >
                    {config.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Priority */}
          <div className="space-y-2">
            <Label className="text-xs text-[#71717a] uppercase tracking-wider">Priority</Label>
            <Select
              value={localBlock.priority || 'none'}
              onValueChange={(value) => {
                const newValue = value === 'none' ? null : value;
                handleChange('priority', newValue);
                onUpdate({ priority: newValue });
              }}
            >
              <SelectTrigger 
                data-testid="editor-priority-select"
                className="bg-[#121212] border-[#27272a] text-[#a1a1aa]"
              >
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent className="bg-[#121212] border-[#27272a]">
                <SelectItem 
                  value="none"
                  className="text-[#52525b] focus:bg-[#27272a]"
                >
                  No Priority
                </SelectItem>
                {Object.entries(BLOCK_PRIORITY_CONFIG).map(([priority, config]) => (
                  <SelectItem 
                    key={priority} 
                    value={priority}
                    className={`${config.textColor} focus:bg-[#27272a]`}
                  >
                    {config.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Separator className="bg-[#27272a]" />

          {/* Notes */}
          <div className="space-y-2">
            <Label className="text-xs text-[#71717a] uppercase tracking-wider">Notes</Label>
            <Textarea
              data-testid="editor-notes-input"
              value={localBlock.notes || ''}
              onChange={(e) => handleChange('notes', e.target.value)}
              onBlur={() => handleBlur('notes')}
              placeholder="Add notes..."
              className="bg-[#121212] border-[#27272a] text-[#ededed] placeholder:text-[#52525b] focus:border-blue-500 min-h-[100px] resize-none"
            />
          </div>

          <Separator className="bg-[#27272a]" />

          {/* Metadata */}
          <div className="space-y-3">
            <Label className="text-xs text-[#71717a] uppercase tracking-wider">Metadata</Label>
            
            <div className="flex items-center gap-2 text-xs text-[#52525b]">
              <Hash className="w-3.5 h-3.5" />
              <span className="mono text-[#71717a]">{block.id}</span>
            </div>
            
            <div className="flex items-center gap-2 text-xs text-[#52525b]">
              <Clock className="w-3.5 h-3.5" />
              <span>Created: {formatDate(block.created_at)}</span>
            </div>
            
            <div className="flex items-center gap-2 text-xs text-[#52525b]">
              <Clock className="w-3.5 h-3.5" />
              <span>Updated: {formatDate(block.updated_at)}</span>
            </div>
          </div>
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="p-4 border-t border-[#27272a]">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              data-testid="editor-delete-btn"
              variant="outline"
              className="w-full border-red-900/50 text-red-400 hover:bg-red-500/10 hover:text-red-400 hover:border-red-800"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Deprecate Block
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="bg-[#121212] border-[#27272a]">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-[#ededed]">Deprecate Block</AlertDialogTitle>
              <AlertDialogDescription className="text-[#a1a1aa]">
                This will mark the block as deprecated. It will remain visible but greyed out. Child blocks will not be affected.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="bg-[#27272a] text-[#ededed] border-[#3f3f46] hover:bg-[#3f3f46] hover:text-[#ededed]">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                data-testid="confirm-deprecate-btn"
                onClick={onDelete}
                className="bg-red-600 hover:bg-red-500 text-white"
              >
                Deprecate
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </aside>
  );
};

export default BlockEditor;

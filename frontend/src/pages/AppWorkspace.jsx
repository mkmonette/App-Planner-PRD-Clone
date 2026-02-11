import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  LayoutGrid, 
  List, 
  Plus, 
  Search,
  Filter,
  ChevronDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuLabel } from '@/components/ui/dropdown-menu';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import storage from '@/utils/storage';
import { BLOCK_TYPES, BLOCK_TYPE_CONFIG, BLOCK_STATUSES, createBlock } from '@/utils/constants';
import Sidebar from '@/components/Sidebar';
import BlockTree from '@/components/BlockTree';
import TableView from '@/components/TableView';
import BlockEditor from '@/components/BlockEditor';

const AppWorkspace = () => {
  const { appId } = useParams();
  const navigate = useNavigate();
  
  const [app, setApp] = useState(null);
  const [blocks, setBlocks] = useState([]);
  const [selectedBlockId, setSelectedBlockId] = useState(null);
  const [editingBlock, setEditingBlock] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [activeView, setActiveView] = useState('tree');
  const [collapsedState, setCollapsedState] = useState({});
  const [progress, setProgress] = useState({ total: 0, done: 0, percentage: 0 });

  const loadData = useCallback(() => {
    const loadedApp = storage.getApp(appId);
    if (!loadedApp) {
      toast.error('App not found');
      navigate('/');
      return;
    }
    setApp(loadedApp);
    
    const loadedBlocks = storage.getBlocksByApp(appId);
    setBlocks(loadedBlocks);
    
    const loadedCollapsed = storage.getCollapsedState();
    setCollapsedState(loadedCollapsed);
    
    const prog = storage.calculateProgress(appId);
    setProgress(prog);
  }, [appId, navigate]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleAddBlock = (type, parentId = null) => {
    const siblings = blocks.filter(b => b.parent_id === parentId);
    const order = siblings.length;
    const newBlock = createBlock(type, parentId, appId, order);
    storage.createBlock(newBlock);
    loadData();
    toast.success(`${BLOCK_TYPE_CONFIG[type].label} added`);
  };

  const handleUpdateBlock = (blockId, updates) => {
    storage.updateBlock(blockId, updates);
    loadData();
  };

  const handleDeleteBlock = (blockId) => {
    storage.deleteBlock(blockId);
    loadData();
    toast.success('Block moved to deprecated');
  };

  const handleReorderBlocks = (blockIds, parentId) => {
    storage.reorderBlocks(blockIds, parentId);
    loadData();
  };

  const handleToggleCollapse = (blockId) => {
    const newState = { ...collapsedState, [blockId]: !collapsedState[blockId] };
    setCollapsedState(newState);
    storage.setCollapsedState(newState);
  };

  const handleSelectBlock = (blockId) => {
    setSelectedBlockId(blockId);
    const block = blocks.find(b => b.id === blockId);
    if (block) {
      setEditingBlock(block);
    }
  };

  const filteredBlocks = blocks.filter(block => {
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesTitle = block.title.toLowerCase().includes(query);
      const matchesDescription = block.description?.toLowerCase().includes(query);
      if (!matchesTitle && !matchesDescription) return false;
    }
    
    // Status filter
    if (statusFilter !== 'all' && block.status !== statusFilter) return false;
    
    // Type filter
    if (typeFilter !== 'all' && block.type !== typeFilter) return false;
    
    return true;
  });

  const treeData = storage.buildTree(filteredBlocks, null);

  if (!app) {
    return (
      <div className="min-h-screen bg-[#09090b] flex items-center justify-center">
        <p className="text-[#71717a]">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#09090b] flex flex-col">
      {/* Header */}
      <header className="bg-black border-b border-[#27272a] px-4 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <Button
            data-testid="back-to-dashboard-btn"
            variant="ghost"
            size="icon"
            onClick={() => navigate('/')}
            className="text-[#71717a] hover:text-[#ededed] hover:bg-[#27272a]"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-lg font-semibold text-[#ededed]">{app.name}</h1>
            {app.description && (
              <p className="text-xs text-[#71717a] truncate max-w-md">{app.description}</p>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Progress */}
          <div className="hidden md:flex items-center gap-3 mr-4">
            <div className="text-right">
              <span className="text-xs text-[#71717a]">Progress</span>
              <p className="text-sm font-medium text-[#ededed]">
                {progress.done}/{progress.total} ({progress.percentage}%)
              </p>
            </div>
            <Progress value={progress.percentage} className="w-24 h-2 bg-[#27272a]" />
          </div>
          
          {/* Add Block Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                data-testid="add-block-btn"
                className="bg-orange-600 hover:bg-orange-500 text-white gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Block
                <ChevronDown className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-[#121212] border-[#27272a] w-56">
              <DropdownMenuLabel className="text-[#71717a]">Block Type</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-[#27272a]" />
              {Object.entries(BLOCK_TYPE_CONFIG).map(([type, config]) => (
                <DropdownMenuItem
                  key={type}
                  data-testid={`add-${type}-btn`}
                  className="cursor-pointer text-[#a1a1aa] hover:text-[#ededed] focus:text-[#ededed] focus:bg-[#27272a]"
                  onClick={() => handleAddBlock(type)}
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
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar
          blocks={blocks}
          selectedBlockId={selectedBlockId}
          onSelectBlock={handleSelectBlock}
          onAddBlock={handleAddBlock}
          collapsedState={collapsedState}
          onToggleCollapse={handleToggleCollapse}
        />

        {/* Main Canvas */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Toolbar */}
          <div className="bg-[#0a0a0b] border-b border-[#27272a] px-4 py-3 flex items-center gap-4">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#52525b]" />
              <Input
                data-testid="search-blocks-input"
                placeholder="Search blocks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-[#121212] border-[#27272a] text-[#ededed] placeholder:text-[#52525b] focus:border-blue-500"
              />
            </div>

            {/* Filters */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  data-testid="status-filter-btn"
                  variant="outline" 
                  className="gap-2 bg-transparent border-[#27272a] text-[#a1a1aa] hover:bg-[#27272a] hover:text-[#ededed]"
                >
                  <Filter className="w-4 h-4" />
                  Status
                  {statusFilter !== 'all' && (
                    <span className="bg-blue-500/20 text-blue-400 text-xs px-1.5 py-0.5 rounded">
                      {statusFilter}
                    </span>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-[#121212] border-[#27272a]">
                <DropdownMenuItem
                  className="cursor-pointer text-[#a1a1aa] focus:text-[#ededed] focus:bg-[#27272a]"
                  onClick={() => setStatusFilter('all')}
                >
                  All Statuses
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-[#27272a]" />
                {Object.values(BLOCK_STATUSES).map((status) => (
                  <DropdownMenuItem
                    key={status}
                    data-testid={`filter-status-${status}`}
                    className="cursor-pointer text-[#a1a1aa] focus:text-[#ededed] focus:bg-[#27272a]"
                    onClick={() => setStatusFilter(status)}
                  >
                    {status.replace('_', ' ')}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  data-testid="type-filter-btn"
                  variant="outline" 
                  className="gap-2 bg-transparent border-[#27272a] text-[#a1a1aa] hover:bg-[#27272a] hover:text-[#ededed]"
                >
                  <Filter className="w-4 h-4" />
                  Type
                  {typeFilter !== 'all' && (
                    <span className="bg-orange-500/20 text-orange-400 text-xs px-1.5 py-0.5 rounded">
                      {typeFilter}
                    </span>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-[#121212] border-[#27272a]">
                <DropdownMenuItem
                  className="cursor-pointer text-[#a1a1aa] focus:text-[#ededed] focus:bg-[#27272a]"
                  onClick={() => setTypeFilter('all')}
                >
                  All Types
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-[#27272a]" />
                {Object.entries(BLOCK_TYPE_CONFIG).map(([type, config]) => (
                  <DropdownMenuItem
                    key={type}
                    data-testid={`filter-type-${type}`}
                    className="cursor-pointer text-[#a1a1aa] focus:text-[#ededed] focus:bg-[#27272a]"
                    onClick={() => setTypeFilter(type)}
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

            {/* View Toggle */}
            <Tabs value={activeView} onValueChange={setActiveView} className="ml-auto">
              <TabsList className="bg-[#121212] border border-[#27272a]">
                <TabsTrigger 
                  data-testid="tree-view-tab"
                  value="tree" 
                  className="data-[state=active]:bg-[#27272a] data-[state=active]:text-[#ededed] text-[#71717a]"
                >
                  <LayoutGrid className="w-4 h-4 mr-2" />
                  Tree
                </TabsTrigger>
                <TabsTrigger 
                  data-testid="table-view-tab"
                  value="table" 
                  className="data-[state=active]:bg-[#27272a] data-[state=active]:text-[#ededed] text-[#71717a]"
                >
                  <List className="w-4 h-4 mr-2" />
                  Table
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-auto p-6">
            {filteredBlocks.length === 0 ? (
              <div className="empty-state py-20">
                <LayoutGrid className="w-12 h-12 mx-auto mb-4 text-[#3f3f46]" />
                <h2 className="text-lg font-semibold text-[#ededed] mb-2">
                  {searchQuery || statusFilter !== 'all' || typeFilter !== 'all' 
                    ? 'No blocks match your filters' 
                    : 'No blocks yet'}
                </h2>
                <p className="text-[#71717a] mb-4">
                  {searchQuery || statusFilter !== 'all' || typeFilter !== 'all'
                    ? 'Try adjusting your search or filters'
                    : 'Add your first block to start planning'}
                </p>
                {!searchQuery && statusFilter === 'all' && typeFilter === 'all' && (
                  <Button
                    data-testid="add-first-block-btn"
                    onClick={() => handleAddBlock(BLOCK_TYPES.PLANNER_SECTION)}
                    className="bg-orange-600 hover:bg-orange-500 text-white gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add First Block
                  </Button>
                )}
              </div>
            ) : activeView === 'tree' ? (
              <BlockTree
                blocks={treeData}
                allBlocks={blocks}
                selectedBlockId={selectedBlockId}
                onSelectBlock={handleSelectBlock}
                onUpdateBlock={handleUpdateBlock}
                onDeleteBlock={handleDeleteBlock}
                onAddBlock={handleAddBlock}
                onReorderBlocks={handleReorderBlocks}
                collapsedState={collapsedState}
                onToggleCollapse={handleToggleCollapse}
              />
            ) : (
              <TableView
                blocks={filteredBlocks}
                onSelectBlock={handleSelectBlock}
                onUpdateBlock={handleUpdateBlock}
                onDeleteBlock={handleDeleteBlock}
              />
            )}
          </div>
        </main>

        {/* Block Editor Panel */}
        {editingBlock && (
          <BlockEditor
            block={editingBlock}
            onUpdate={(updates) => {
              handleUpdateBlock(editingBlock.id, updates);
              setEditingBlock({ ...editingBlock, ...updates });
            }}
            onClose={() => {
              setEditingBlock(null);
              setSelectedBlockId(null);
            }}
            onDelete={() => {
              handleDeleteBlock(editingBlock.id);
              setEditingBlock(null);
              setSelectedBlockId(null);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default AppWorkspace;

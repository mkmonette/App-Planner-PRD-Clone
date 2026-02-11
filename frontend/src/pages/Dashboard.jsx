import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, FolderKanban, Trash2, MoreVertical, Clock, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import storage from '@/utils/storage';
import { createApp } from '@/utils/constants';

const Dashboard = () => {
  const navigate = useNavigate();
  const [apps, setApps] = useState([]);
  const [newAppName, setNewAppName] = useState('');
  const [newAppDescription, setNewAppDescription] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [deleteAppId, setDeleteAppId] = useState(null);
  const [appProgress, setAppProgress] = useState({});

  useEffect(() => {
    loadApps();
  }, []);

  const loadApps = () => {
    const loadedApps = storage.getApps();
    setApps(loadedApps);
    
    // Calculate progress for each app
    const progress = {};
    loadedApps.forEach(app => {
      progress[app.id] = storage.calculateProgress(app.id);
    });
    setAppProgress(progress);
  };

  const handleCreateApp = () => {
    if (!newAppName.trim()) {
      toast.error('Please enter an app name');
      return;
    }

    const app = createApp(newAppName.trim());
    app.description = newAppDescription.trim();
    storage.createApp(app);
    
    setNewAppName('');
    setNewAppDescription('');
    setIsCreateDialogOpen(false);
    loadApps();
    toast.success('App created successfully');
  };

  const handleDeleteApp = () => {
    if (deleteAppId) {
      storage.deleteApp(deleteAppId);
      setDeleteAppId(null);
      loadApps();
      toast.success('App deleted successfully');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-[#09090b]">
      {/* Header */}
      <header className="bg-black border-b border-[#27272a] px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FolderKanban className="w-7 h-7 text-orange-500" />
            <h1 className="text-xl font-bold text-[#ededed] tracking-tight">
              App Planner & PRD Manager
            </h1>
          </div>
          
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                data-testid="create-app-btn"
                className="bg-orange-600 hover:bg-orange-500 text-white gap-2"
              >
                <Plus className="w-4 h-4" />
                New App
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-[#121212] border-[#27272a]">
              <DialogHeader>
                <DialogTitle className="text-[#ededed]">Create New App</DialogTitle>
                <DialogDescription className="text-[#a1a1aa]">
                  Start planning your next application
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div>
                  <label className="text-sm font-medium text-[#a1a1aa] mb-2 block">
                    App Name
                  </label>
                  <Input
                    data-testid="new-app-name-input"
                    placeholder="My Awesome App"
                    value={newAppName}
                    onChange={(e) => setNewAppName(e.target.value)}
                    className="bg-[#09090b] border-[#27272a] text-[#ededed] placeholder:text-[#52525b]"
                    onKeyDown={(e) => e.key === 'Enter' && handleCreateApp()}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-[#a1a1aa] mb-2 block">
                    Description (optional)
                  </label>
                  <Input
                    data-testid="new-app-description-input"
                    placeholder="A brief description of your app"
                    value={newAppDescription}
                    onChange={(e) => setNewAppDescription(e.target.value)}
                    className="bg-[#09090b] border-[#27272a] text-[#ededed] placeholder:text-[#52525b]"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="ghost"
                  onClick={() => setIsCreateDialogOpen(false)}
                  className="text-[#a1a1aa] hover:text-[#ededed] hover:bg-[#27272a]"
                >
                  Cancel
                </Button>
                <Button
                  data-testid="confirm-create-app-btn"
                  onClick={handleCreateApp}
                  className="bg-orange-600 hover:bg-orange-500 text-white"
                >
                  Create App
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {apps.length === 0 ? (
          <div className="empty-state py-20">
            <FolderKanban className="w-16 h-16 mx-auto mb-4 text-[#3f3f46]" />
            <h2 className="text-xl font-semibold text-[#ededed] mb-2">No apps yet</h2>
            <p className="text-[#71717a] mb-6 max-w-md mx-auto">
              Create your first app to start planning features, user flows, and data models.
            </p>
            <Button
              data-testid="create-first-app-btn"
              onClick={() => setIsCreateDialogOpen(true)}
              className="bg-orange-600 hover:bg-orange-500 text-white gap-2"
            >
              <Plus className="w-4 h-4" />
              Create Your First App
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {apps.map((app) => (
              <Card
                key={app.id}
                data-testid={`app-card-${app.id}`}
                className="bg-[#121212] border-[#27272a] hover:border-[#3f3f46] transition-all cursor-pointer group"
                onClick={() => navigate(`/app/${app.id}`)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-[#ededed] text-lg truncate">
                        {app.name}
                      </CardTitle>
                      {app.description && (
                        <CardDescription className="text-[#71717a] mt-1 line-clamp-2">
                          {app.description}
                        </CardDescription>
                      )}
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                        <Button
                          data-testid={`app-menu-${app.id}`}
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-[#71717a] hover:text-[#ededed] hover:bg-[#27272a] opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="bg-[#121212] border-[#27272a]">
                        <DropdownMenuItem
                          data-testid={`delete-app-${app.id}`}
                          className="text-red-400 focus:text-red-400 focus:bg-red-500/10 cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeleteAppId(app.id);
                          }}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete App
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Progress */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="text-[#71717a]">Progress</span>
                      <span className="text-[#a1a1aa] font-medium">
                        {appProgress[app.id]?.percentage || 0}%
                      </span>
                    </div>
                    <Progress 
                      value={appProgress[app.id]?.percentage || 0} 
                      className="h-1.5 bg-[#27272a]"
                    />
                  </div>
                  
                  {/* Stats */}
                  <div className="flex items-center gap-4 text-xs text-[#71717a]">
                    <div className="flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>
                        {appProgress[app.id]?.done || 0}/{appProgress[app.id]?.total || 0} done
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{formatDate(app.updated_at)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteAppId} onOpenChange={() => setDeleteAppId(null)}>
        <AlertDialogContent className="bg-[#121212] border-[#27272a]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-[#ededed]">Delete App</AlertDialogTitle>
            <AlertDialogDescription className="text-[#a1a1aa]">
              Are you sure you want to delete this app? This will permanently remove all blocks and data associated with it. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-[#27272a] text-[#ededed] border-[#3f3f46] hover:bg-[#3f3f46] hover:text-[#ededed]">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              data-testid="confirm-delete-app-btn"
              onClick={handleDeleteApp}
              className="bg-red-600 hover:bg-red-500 text-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Dashboard;

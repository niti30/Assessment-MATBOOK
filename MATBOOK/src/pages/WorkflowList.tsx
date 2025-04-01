import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Star, Edit, MoreVertical, ChevronLeft, ChevronRight, Menu, ArrowUp, ArrowDown, CheckCircle, XCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface Execution {
  date: string;
  status: 'passed' | 'failed';
}

interface Workflow {
  id: string;
  name: string;
  last_edited_by?: string;
  last_edited_time?: string;
  description: string;
  isFavorite: boolean;
  status?: 'draft' | 'passed' | 'failed';
  executions?: Execution[];
  isExpanded?: boolean;
}

const WorkflowList: React.FC = () => {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signOut, user } = useAuth();

  // Fetch workflows from Supabase
  useEffect(() => {
    const fetchWorkflows = async () => {
      if (!user) return;

      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('workflows')
          .select('*')
          .eq('user_id', user.id);

        if (error) {
          throw error;
        }

        // Transform the data to match our UI
        const transformedData = data.map((workflow) => {
          // Generate some mock executions for demo purposes
          const mockExecutions = [
            { date: '28/05 - 22:43 IST', status: 'passed' as const },
            { date: '28/05 - 22:43 IST', status: 'failed' as const },
            { date: '28/05 - 22:43 IST', status: 'failed' as const }
          ];

          return {
            id: workflow.id,
            name: workflow.name || 'Workflow Name here...',
            last_edited_by: 'Zubin Khanna',
            last_edited_time: new Date(workflow.updated_at).toLocaleString(),
            description: workflow.description || 'Some Description Here Regarding The Flow..',
            isFavorite: false,
            status: workflow.status as 'draft' | 'passed' | 'failed',
            executions: mockExecutions,
            isExpanded: false
          };
        });

        setWorkflows(transformedData);
      } catch (error: any) {
        console.error('Error fetching workflows:', error.message);
        toast({
          title: "Error",
          description: "Failed to load workflows",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchWorkflows();
  }, [user]);

  const handleCreateWorkflow = () => {
    navigate('/workflow-editor');
  };

  const handleEditWorkflow = (id: string) => {
    navigate(`/workflow-editor/${id}`);
  };

  const handleExecute = (id: string) => {
    toast({
      title: "Workflow Execution",
      description: `Executing workflow ${id}`,
    });
  };

  const handleToggleFavorite = (id: string) => {
    setWorkflows(workflows.map(workflow => 
      workflow.id === id ? { ...workflow, isFavorite: !workflow.isFavorite } : workflow
    ));
  };

  const toggleExpand = (id: string) => {
    setWorkflows(workflows.map(workflow => 
      workflow.id === id ? { ...workflow, isExpanded: !workflow.isExpanded } : workflow
    ));
  };

  // Filter workflows based on search term
  const filteredWorkflows = workflows.filter(workflow => 
    workflow.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    workflow.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-highbridge-cream">
      <header className="bg-white shadow-sm p-4 relative">
        <div className="flex items-center px-4">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2">
            <Menu size={20} className="text-gray-600" />
          </button>
          <h1 className="text-lg font-medium ml-4">Workflow Builder</h1>
        </div>

        {isMenuOpen && (
          <div ref={menuRef} className="absolute top-full left-0 w-64 bg-white shadow-lg z-50">
            <nav className="py-2">
              <button onClick={() => navigate('/')} className="w-full text-left px-4 py-2 hover:bg-gray-100">
                Dashboard
              </button>
              <button onClick={() => navigate('/workflow-editor')} className="w-full text-left px-4 py-2 hover:bg-gray-100">
                Create Workflow
              </button>
              <button onClick={signOut} className="w-full text-left px-4 py-2 hover:bg-gray-100">
                Sign Out
              </button>
            </nav>
          </div>
        )}
      </header>

      <main className="container mx-auto p-4">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center mb-8">
            <div className="relative">
              <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                placeholder="Search By Workflow Name/ID"
                className="w-80 pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button
              onClick={handleCreateWorkflow}
              className="bg-black text-white px-3 py-2 rounded-2xl flex items-center hover:bg-gray-800 transition whitespace-nowrap text-sm sm:text-base sm:px-4"
            >
              <Plus size={18} className="mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Create New Process</span>
              <span className="sm:hidden">New</span>
            </button>
          </div>

          {isLoading ? (
            <div className="flex justify-center my-10">
              <div className="w-10 h-10 border-4 border-t-red-500 border-gray-200 rounded-full animate-spin"></div>
            </div>
          ) : filteredWorkflows.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">No workflows found</p>
              <button
                onClick={handleCreateWorkflow}
                className="bg-red-500 text-white px-4 py-2 rounded-md inline-flex items-center hover:bg-red-600 transition"
              >
                <Plus size={18} className="mr-2" />
                Create Your First Workflow
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-4">Workflow Name</th>
                    <th className="text-left p-4">ID</th>
                    <th className="text-left p-4">Last Edited On</th>
                    <th className="text-left p-4">Description</th>
                    <th className="text-right p-4"></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredWorkflows.map((workflow) => (
                    <React.Fragment key={workflow.id}>
                      <tr className="border-b hover:bg-gray-50">
                        <td className="p-4">{workflow.name}</td>
                        <td className="p-4 text-gray-600">#{workflow.id.substring(0, 3)}</td>
                        <td className="p-4 text-gray-600">{workflow.last_edited_time}</td>
                        <td className="p-4 text-gray-600 truncate max-w-xs">{workflow.description}</td>
                        <td className="p-4">
                          <div className="flex items-center justify-end space-x-2">
                            <button 
                              onClick={() => handleToggleFavorite(workflow.id)} 
                              className={`${workflow.isFavorite ? 'text-yellow-400' : 'text-gray-400'} hover:text-yellow-400 active:scale-75 transition-transform`}
                            >
                              <svg width="18" height="18" viewBox="0 0 24 24" fill={workflow.isFavorite ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                              </svg>
                            </button>
                            <button 
                              onClick={() => handleExecute(workflow.id)} 
                              className="px-3 py-1 bg-gray-100 text-gray-700 rounded-2xl text-sm"
                            >
                              Execute
                            </button>
                            <button 
                              onClick={() => handleEditWorkflow(workflow.id)} 
                              className="px-3 py-1 bg-gray-100 text-gray-700 rounded-2xl text-sm"
                            >
                              Edit
                            </button>
                            <button onClick={() => toggleExpand(workflow.id)}>
                              {workflow.isExpanded ? <ArrowUp size={18} /> : <ArrowDown size={18} />}
                            </button>
                          </div>
                        </td>
                      </tr>
                      {workflow.isExpanded && workflow.executions && (
                        <tr>
                          <td colSpan={5}>
                            <div className="bg-gray-50 p-4 pl-16 border-t border-purple-200">
                              {workflow.executions.map((execution, execIndex) => (
                                <div key={execIndex} className="flex items-center mb-2 last:mb-0">
                                  <div className="w-2 h-2 rounded-full bg-orange-500 mr-3"></div>
                                  <div className="text-sm mr-3">{execution.date}</div>
                                  <Badge className={`${execution.status === 'passed' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'} text-xs py-1`}>
                                    {execution.status === 'passed' ? (
                                      <span className="flex items-center">
                                        <CheckCircle size={14} className="mr-1" /> Passed
                                      </span>
                                    ) : (
                                      <span className="flex items-center">
                                        <XCircle size={14} className="mr-1" /> Failed
                                      </span>
                                    )}
                                  </Badge>
                                  <button className="ml-3">
                                    <Edit size={14} />
                                  </button>
                                </div>
                              ))}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {filteredWorkflows.length >= 10 && (
            <div className="flex justify-center mt-8">
              <nav className="inline-flex">
                <button className="px-3 py-1 rounded-l-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50">
                  <ChevronLeft size={18} />
                </button>
                <button className="px-3 py-1 border-t border-b border-gray-300 bg-gray-50 text-gray-700 hover:bg-gray-100">
                  1
                </button>
                <button className="px-3 py-1 border-t border-b border-gray-300 bg-white text-gray-700 hover:bg-gray-50">
                  2
                </button>
                <button className="px-3 py-1 border-t border-b border-gray-300 bg-white text-gray-700 hover:bg-gray-50">
                  3
                </button>
                <button className="px-3 py-1 border-t border-b border-gray-300 bg-white text-gray-700 hover:bg-gray-50">
                  ...
                </button>
                <button className="px-3 py-1 border-t border-b border-gray-300 bg-white text-gray-700 hover:bg-gray-50">
                  15
                </button>
                <button className="px-3 py-1 rounded-r-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50">
                  <ChevronRight size={18} />
                </button>
              </nav>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default WorkflowList;
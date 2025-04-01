import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronLeft, Save, Plus } from "lucide-react";
import WorkflowNode from "../components/WorkflowNode";
import SaveWorkflowModal from "../components/SaveWorkflowModal";
import EmailConfigModal from "../components/EmailConfigModal";
import ApiConfigModal from "../components/ApiConfigModal";
import NodeSelector from "../components/NodeSelector";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Json } from "@/integrations/supabase/types";
import TextBoxConfigModal from "../components/TextBoxConfigModal";

interface Node {
  id: string;
  type: "start" | "end" | "api" | "email" | "textbox";
  status?: "success" | "error" | "pending";
  config?: any;
}

interface WorkflowData {
  id?: string;
  name?: string;
  description?: string;
  status?: "draft" | "passed" | "failed";
  nodes?: Node[];
}

function hasNodes(json: Json | null): json is { nodes: any[] } {
  return typeof json === "object" && json !== null && "nodes" in json;
}

const WorkflowEditor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [workflowData, setWorkflowData] = useState<WorkflowData>({
    name: "Untitled",
    description: "",
    status: "draft",
    nodes: [
      { id: "start", type: "start" },
      { id: "end", type: "end" },
    ],
  });

  const [zoomLevel, setZoomLevel] = useState(100);
  const [history, setHistory] = useState<WorkflowData[]>([workflowData]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [isSaved, setIsSaved] = useState(false);
  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 10, 200));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 10, 50));

  useEffect(() => {
    if (workflowData.nodes) {
      setHistory((prev) => [...prev, workflowData]);
      setHistoryIndex((prev) => prev + 1);
    }
  }, [workflowData.nodes]);

  const handleUndo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setWorkflowData(history[newIndex]);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setWorkflowData(history[newIndex]);
    }
  };
  const [isLoading, setIsLoading] = useState(id ? true : false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showApiConfigModal, setShowApiConfigModal] = useState(false);
  const [showEmailConfigModal, setShowEmailConfigModal] = useState(false);
  const [showTextBoxConfigModal, setShowTextBoxConfigModal] = useState(false);
  const [showNodeSelector, setShowNodeSelector] = useState(false);
  const [currentNodeIndex, setCurrentNodeIndex] = useState<number | null>(null);
  const [addNodeIndex, setAddNodeIndex] = useState<number | null>(null);

  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    const fetchWorkflow = async () => {
      if (!id || !user) return;

      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from("workflows")
          .select("*")
          .eq("id", id)
          .eq("user_id", user.id)
          .single();

        if (error) {
          throw error;
        }

        if (data) {
          const defaultNodes: Node[] = [
            { id: "start", type: "start" },
            { id: "end", type: "end" },
          ];

          let workflowNodes: Node[] = defaultNodes;

          if (hasNodes(data.workflow_data)) {
            workflowNodes = data.workflow_data.nodes.map(
              (node: any): Node => ({
                id: node.id,
                type: ["start", "end", "api", "email", "textbox"].includes(
                  node.type,
                )
                  ? (node.type as Node["type"])
                  : "api",
                ...(node.status &&
                ["success", "error", "pending"].includes(node.status)
                  ? { status: node.status as "success" | "error" | "pending" }
                  : {}),
                ...(node.config ? { config: node.config } : {}),
              }),
            );
          }

          setWorkflowData({
            id: data.id,
            name: data.name,
            description: data.description,
            status: data.status as "draft" | "passed" | "failed",
            nodes: workflowNodes,
          });
        }
      } catch (error: any) {
        console.error("Error fetching workflow:", error.message);
        toast({
          title: "Error",
          description: "Failed to load workflow",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchWorkflow();
  }, [id, user]);

  const handleAddNode = (index: number) => {
    setAddNodeIndex(index);
    setShowNodeSelector(true);
  };

  const checkApiAndEmailExist = () => {
    if (!workflowData.nodes) return false;

    const innerNodes = workflowData.nodes.slice(1, -1);

    if (innerNodes.length < 2) return false;

    const hasApi = innerNodes.some(
      (node) => node.type === "api" && node.status === "success",
    );
    const hasEmail = innerNodes.some(
      (node) => node.type === "email" && node.status === "success",
    );

    return hasApi && hasEmail;
  };

  const handleSelectNodeType = (nodeType: "api" | "email" | "textbox") => {
    if (addNodeIndex === null || !workflowData.nodes) return;

    const newNodes = [...workflowData.nodes];

    if (newNodes.length === 2 && nodeType === "textbox") {
      const apiNode = {
        id: `node-${Date.now()}-api`,
        type: "api" as const,
        status: "pending" as const,
      };

      const emailNode = {
        id: `node-${Date.now()}-email`,
        type: "email" as const,
        status: "pending" as const,
      };

      const textboxNode = {
        id: `node-${Date.now()}-textbox`,
        type: "textbox" as const,
        status: "pending" as const,
      };

      newNodes.splice(1, 0, apiNode, emailNode, textboxNode);
      setWorkflowData({ ...workflowData, nodes: newNodes });
      setShowNodeSelector(false);
      setAddNodeIndex(null);

      setCurrentNodeIndex(1);
      setShowApiConfigModal(true);
      return;
    }

    if (newNodes.length === 2 && nodeType === "email") {
      const apiNode = {
        id: `node-${Date.now()}-api`,
        type: "api" as const,
        status: "pending" as const,
      };

      const emailNode = {
        id: `node-${Date.now()}-email`,
        type: "email" as const,
        status: "pending" as const,
      };

      newNodes.splice(1, 0, apiNode, emailNode);
      setWorkflowData({ ...workflowData, nodes: newNodes });
      setShowNodeSelector(false);
      setAddNodeIndex(null);

      setCurrentNodeIndex(1);
      setShowApiConfigModal(true);
      return;
    }

    if (nodeType === "textbox" && !checkApiAndEmailExist()) {
      toast({
        title: "Invalid workflow structure",
        description:
          "You must configure API and Email nodes before adding a Text Box",
        variant: "destructive",
      });
      setShowNodeSelector(false);
      setAddNodeIndex(null);
      return;
    }

    const newNode = {
      id: `node-${Date.now()}`,
      type: nodeType,
      status: "pending" as const,
    };

    newNodes.splice(addNodeIndex + 1, 0, newNode);
    setWorkflowData({ ...workflowData, nodes: newNodes });
    setShowNodeSelector(false);

    setCurrentNodeIndex(addNodeIndex + 1);
    if (nodeType === "api") {
      setShowApiConfigModal(true);
    } else if (nodeType === "email") {
      setShowEmailConfigModal(true);
    } else if (nodeType === "textbox") {
      setShowTextBoxConfigModal(true);
    }

    setAddNodeIndex(null);
  };

  const handleDeleteNode = (index: number) => {
    if (!workflowData.nodes) return;

    const nodeToDelete = workflowData.nodes[index];

    if (nodeToDelete.type === "api") {
      const hasEmailDependency = workflowData.nodes.some(
        (node, idx) => idx > index && node.type === "email",
      );

      if (hasEmailDependency) {
        toast({
          title: "Cannot delete API node",
          description:
            "Remove the Email node first before deleting the API node",
          variant: "destructive",
        });
        return;
      }
    }

    if (nodeToDelete.type === "api") {
      setCurrentNodeIndex(index);
      setShowApiConfigModal(true);
      return;
    }

    if (nodeToDelete.type === "email") {
      setCurrentNodeIndex(index);
      setShowEmailConfigModal(true);
      return;
    }

    const newNodes = [...workflowData.nodes];
    newNodes.splice(index, 1);
    setWorkflowData({ ...workflowData, nodes: newNodes });
  };

  const handleGoBack = () => {
    navigate("/workflows");
  };

  const validateWorkflow = (): boolean => {
    if (!workflowData.nodes || workflowData.nodes.length < 3) {
      toast({
        title: "Invalid workflow",
        description:
          "Workflow must have at least one node between start and end",
        variant: "destructive",
      });
      return false;
    }

    const innerNodes = workflowData.nodes.slice(1, -1);
    const allConfigured = innerNodes.every((node) => node.status === "success");

    if (!allConfigured) {
      toast({
        title: "Incomplete workflow",
        description: "All nodes must be configured successfully",
        variant: "destructive",
      });
      return false;
    }

    const firstNode = innerNodes[0];

    if (firstNode && firstNode.type !== "api") {
      toast({
        title: "Invalid workflow structure",
        description: "First node must be an API Call",
        variant: "destructive",
      });
      return false;
    }

    if (innerNodes.length > 1 && innerNodes[1].type !== "email") {
      toast({
        title: "Invalid workflow structure",
        description: "Second node must be an Email",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleSave = async (name: string, description: string) => {
    if (!user) {
      toast({
        title: "Authentication error",
        description: "You must be logged in to save workflows",
        variant: "destructive",
      });
      return;
    }

    if (!validateWorkflow()) {
      return;
    }

    try {
      const workflowObject = {
        name,
        description,
        status: workflowData.status,
        workflow_data: { nodes: workflowData.nodes } as unknown as Json,
        user_id: user.id,
      };

      let result;

      if (id) {
        result = await supabase
          .from("workflows")
          .update(workflowObject)
          .eq("id", id)
          .eq("user_id", user.id);
      } else {
        result = await supabase.from("workflows").insert(workflowObject);
      }

      if (result.error) {
        throw result.error;
      }

      setWorkflowData({
        ...workflowData,
        name,
        description,
      });

      setShowSaveModal(false);
      toast({
        title: "Workflow saved",
        description: `Saved as ${name}`,
        duration: 1000,
      });
      navigate("/workflows");
    } catch (error: any) {
      console.error("Error saving workflow:", error.message);
      toast({
        title: "Error",
        description: "Failed to save workflow",
        variant: "destructive",
      });
    }
  };

  const handleApiConfigSave = (data: any) => {
    if (currentNodeIndex === null || !workflowData.nodes) return;

    if (!data.method || !data.url || !data.headers || !data.body) {
      toast({
        title: "Incomplete configuration",
        description: "All API configuration fields are required",
        variant: "destructive",
      });
      return;
    }

    const newNodes = [...workflowData.nodes];
    newNodes[currentNodeIndex] = {
      ...newNodes[currentNodeIndex],
      config: data,
      status: "success",
    };

    const allConfigured = newNodes.every(
      (node) =>
        node.type === "start" ||
        node.type === "end" ||
        node.status === "success",
    );

    setWorkflowData({
      ...workflowData,
      nodes: newNodes,
      status: allConfigured ? "passed" : "draft",
    });
    setShowApiConfigModal(false);
    setCurrentNodeIndex(null);

    if (
      currentNodeIndex + 1 < newNodes.length &&
      newNodes[currentNodeIndex + 1].type === "email" &&
      newNodes[currentNodeIndex + 1].status !== "success"
    ) {
      setCurrentNodeIndex(currentNodeIndex + 1);
      setShowEmailConfigModal(true);
    }
  };

  const handleEmailConfigSave = (data: any) => {
    if (currentNodeIndex === null || !workflowData.nodes) return;

    if (!data.emailContent) {
      toast({
        title: "Incomplete configuration",
        description: "Email content is required",
        variant: "destructive",
      });
      return;
    }

    const newNodes = [...workflowData.nodes];
    newNodes[currentNodeIndex] = {
      ...newNodes[currentNodeIndex],
      config: data,
      status: "success",
    };

    const allConfigured = newNodes.every(
      (node) =>
        node.type === "start" ||
        node.type === "end" ||
        node.status === "success",
    );

    setWorkflowData({
      ...workflowData,
      nodes: newNodes,
      status: allConfigured ? "passed" : "draft",
    });
    setShowEmailConfigModal(false);
    setCurrentNodeIndex(null);
  };

  const handleTextBoxConfigSave = (data: any) => {
    if (currentNodeIndex === null || !workflowData.nodes) return;

    if (!data.message) {
      toast({
        title: "Incomplete configuration",
        description: "Message field is required",
        variant: "destructive",
      });
      return;
    }

    const newNodes = [...workflowData.nodes];
    newNodes[currentNodeIndex] = {
      ...newNodes[currentNodeIndex],
      config: data,
      status: "success",
    };

    const allConfigured = newNodes.every(
      (node) =>
        node.type === "start" ||
        node.type === "end" ||
        node.status === "success",
    );

    setWorkflowData({
      ...workflowData,
      nodes: newNodes,
      status: allConfigured ? "passed" : "draft",
    });
    setShowTextBoxConfigModal(false);
    setCurrentNodeIndex(null);
  };

  const handleConfigureNode = (index: number) => {
    if (!workflowData.nodes) return;

    setCurrentNodeIndex(index);
    const node = workflowData.nodes[index];

    if (node.type === "api") {
      setShowApiConfigModal(true);
    } else if (node.type === "email") {
      setShowEmailConfigModal(true);
    } else if (node.type === "textbox") {
      setShowTextBoxConfigModal(true);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-t-red-500 border-gray-200 rounded-full animate-spin"></div>
      </div>
    );
  }

  const isFirstNode = workflowData.nodes?.length === 2;

  return (
    <div className="min-h-screen bg-highbridge-cream">
      <header className="bg-white shadow p-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleGoBack}
              className="flex items-center hover:underline"
            >
              <ChevronLeft size={16} className="mr-1" /> Go Back
            </button>
            <h1 className="text-xl">{workflowData.name || "Untitled"}</h1>
          </div>
          <button
            onClick={() => {
              setShowSaveModal(true);
              setIsSaved(true);
            }}
            className={`flex items-center ${
              isSaved ? "text-yellow-500" : "text-gray-600 hover:text-gray-800"
            }`}
            style={{
              position: "absolute",
              top: "24px",
              left: "230px",
              zIndex: 1000,
            }}
          >
            <Save size={16} />
          </button>
        </div>
      </header>

      <main
        className="container mx-auto p-4 flex flex-col items-center justify-center relative overflow-hidden"
        style={{ minHeight: "calc(100vh - 120px)" }}
      >
        <div
          style={{
            transform: `scale(${zoomLevel / 100})`,
            transition: "transform 0.2s",
            transformOrigin: "center center",
          }}
        >
          <div className="flex flex-col items-center space-y-8 py-8">
            {workflowData.nodes?.map((node, index) => (
              <React.Fragment key={node.id}>
                {index > 0 && (
                  <>
                    <div className="h-8 w-0.5 bg-gray-300"></div>
                    <div className="relative">
                      <button
                        className="w-8 h-8 rounded-full border border-gray-300 bg-white flex items-center justify-center shadow-sm hover:shadow-md transition-shadow"
                        onClick={() => handleAddNode(index - 1)}
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                    <div className="h-8 w-0.5 bg-gray-300"></div>
                  </>
                )}
                <WorkflowNode
                  type={node.type}
                  status={node.status}
                  onDelete={
                    index > 0 && index < workflowData.nodes.length - 1
                      ? () => handleDeleteNode(index)
                      : undefined
                  }
                  onConfigure={
                    index > 0 && index < workflowData.nodes.length - 1
                      ? () => handleConfigureNode(index)
                      : undefined
                  }
                />
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="fixed bottom-4 right-4 flex items-center space-x-2 bg-white/50 backdrop-blur-sm p-2 rounded-lg">
          <div
            style={{
              position: "relative",
              left: "-225%",
              display: "flex",
              gap: "8px",
              zIndex: 9999,
              margin: "0",
              padding: "0",
              transform: "none",
            }}
          >
            <button
              onClick={() => handleUndo()}
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "4px",
                border: "1px solid #e5e7eb",
                backgroundColor: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                fontSize: "18px",
              }}
            >
              ←
            </button>
            <button
              onClick={() => handleRedo()}
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "4px",
                border: "1px solid #e5e7eb",
                backgroundColor: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                fontSize: "18px",
              }}
            >
              →
            </button>
          </div>
          <button
            onClick={handleZoomOut}
            className="w-8 h-8 rounded-md border border-gray-300 bg-white flex items-center justify-center hover:bg-gray-50"
            style={{ minWidth: "32px", minHeight: "32px" }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M5 12H19"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <input
            type="range"
            className="w-32"
            style={{ minWidth: "128px" }}
            min="50"
            max="200"
            value={zoomLevel}
            onChange={(e) => setZoomLevel(parseInt(e.target.value))}
          />
          <button
            onClick={handleZoomIn}
            className="w-8 h-8 rounded-md border border-gray-300 bg-white flex items-center justify-center hover:bg-gray-50"
            style={{ minWidth: "32px", minHeight: "32px" }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 5V19"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M5 12H19"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </main>

      <SaveWorkflowModal
        isOpen={showSaveModal}
        onClose={() => setShowSaveModal(false)}
        onSave={handleSave}
      />

      <ApiConfigModal
        isOpen={showApiConfigModal}
        onClose={() => {
          setShowApiConfigModal(false);
          setCurrentNodeIndex(null);
        }}
        onSave={handleApiConfigSave}
      />

      <EmailConfigModal
        isOpen={showEmailConfigModal}
        onClose={() => {
          setShowEmailConfigModal(false);
          setCurrentNodeIndex(null);
        }}
        onSave={handleEmailConfigSave}
      />

      <TextBoxConfigModal
        isOpen={showTextBoxConfigModal}
        onClose={() => {
          setShowTextBoxConfigModal(false);
          setCurrentNodeIndex(null);
        }}
        onSave={handleTextBoxConfigSave}
      />

      <NodeSelector
        visible={showNodeSelector}
        onClose={() => setShowNodeSelector(false)}
        onSelect={handleSelectNodeType}
        isFirstNode={isFirstNode}
      />
    </div>
  );
};

export default WorkflowEditor;
import { useCallback, useState, useEffect, useRef } from 'react';
import ReactFlow, {
  Node,
  Edge,
  addEdge,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  Connection,
  BackgroundVariant,
  ReactFlowInstance,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Download, Upload, Trash2, Edit3, X, Save } from 'lucide-react';

interface WorkflowDiagramEditorProps {
  onDiagramChange?: (nodes: Node[], edges: Edge[]) => void;
  initialNodes?: Node[];
  initialEdges?: Edge[];
}

const nodeTypes = {
  agent: 'Agent',
  process: 'Process', 
  decision: 'Decision',
  data: 'Data'
};

const nodeColors = {
  agent: '#3B82F6',
  process: '#10B981', 
  decision: '#F59E0B',
  data: '#8B5CF6'
};

const defaultNodes: Node[] = [
  {
    id: '1',
    type: 'default',
    position: { x: 250, y: 100 },
    data: { label: 'Start Agent' },
    style: { backgroundColor: nodeColors.agent, color: 'white', border: 'none' }
  }
];

const defaultEdges: Edge[] = [];

// Storage keys for persistence
const STORAGE_KEY_NODES = 'workflow-diagram-nodes';
const STORAGE_KEY_EDGES = 'workflow-diagram-edges';
const STORAGE_KEY_NODE_ID = 'workflow-diagram-node-id';

// Load from localStorage with fallback
const loadFromStorage = (key: string, fallback: any) => {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch {
    return fallback;
  }
};

// Save to localStorage
const saveToStorage = (key: string, data: any) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch {
    // Silently fail if localStorage is not available
  }
};

export default function WorkflowDiagramEditor({ onDiagramChange, initialNodes: propInitialNodes, initialEdges: propInitialEdges }: WorkflowDiagramEditorProps) {
  // Load persisted state or use provided initial values
  const [nodes, setNodes, onNodesChange] = useNodesState(
    propInitialNodes || loadFromStorage(STORAGE_KEY_NODES, defaultNodes)
  );
  const [edges, setEdges, onEdgesChange] = useEdgesState(
    propInitialEdges || loadFromStorage(STORAGE_KEY_EDGES, defaultEdges)
  );
  const [nodeId, setNodeId] = useState(loadFromStorage(STORAGE_KEY_NODE_ID, 2));
  const [selectedNodeType, setSelectedNodeType] = useState<keyof typeof nodeTypes>('agent');
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [editingNodeId, setEditingNodeId] = useState<string | null>(null);
  const [editingNodeLabel, setEditingNodeLabel] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);
  const reactFlowInstance = useRef<ReactFlowInstance | null>(null);

  // Save to localStorage whenever nodes or edges change
  useEffect(() => {
    saveToStorage(STORAGE_KEY_NODES, nodes);
  }, [nodes]);

  useEffect(() => {
    saveToStorage(STORAGE_KEY_EDGES, edges);
  }, [edges]);

  useEffect(() => {
    saveToStorage(STORAGE_KEY_NODE_ID, nodeId);
  }, [nodeId]);

  useEffect(() => {
    if (onDiagramChange) {
      onDiagramChange(nodes, edges);
    }
  }, [nodes, edges, onDiagramChange]);

  // Mark as loaded on first render
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Initialize ReactFlow instance and fit view when nodes are loaded
  const onInit = useCallback((instance: ReactFlowInstance) => {
    reactFlowInstance.current = instance;
    // Fit view after a small delay to ensure nodes are rendered
    setTimeout(() => {
      if (nodes.length > 0) {
        instance.fitView({ padding: 0.2 });
      }
    }, 200);
  }, [nodes]);

  // Fit view when component loads with existing nodes from localStorage
  useEffect(() => {
    if (isLoaded && reactFlowInstance.current && nodes.length > 0) {
      setTimeout(() => {
        reactFlowInstance.current?.fitView({ padding: 0.2 });
      }, 300);
    }
  }, [isLoaded, nodes.length]);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
  }, []);

  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
    setEditingNodeId(null);
  }, []);

  const deleteSelectedNode = useCallback(() => {
    if (selectedNode) {
      setNodes((nds) => nds.filter((n) => n.id !== selectedNode.id));
      setEdges((eds) => eds.filter((e) => e.source !== selectedNode.id && e.target !== selectedNode.id));
      setSelectedNode(null);
    }
  }, [selectedNode, setNodes, setEdges]);

  const startEditingNode = useCallback(() => {
    if (selectedNode) {
      setEditingNodeId(selectedNode.id);
      setEditingNodeLabel(selectedNode.data.label);
    }
  }, [selectedNode]);

  const saveNodeLabel = useCallback(() => {
    if (editingNodeId && editingNodeLabel.trim()) {
      setNodes((nds) =>
        nds.map((node) =>
          node.id === editingNodeId
            ? { ...node, data: { ...node.data, label: editingNodeLabel.trim() } }
            : node
        )
      );
    }
    setEditingNodeId(null);
    setEditingNodeLabel('');
  }, [editingNodeId, editingNodeLabel, setNodes]);

  const cancelEditingNode = useCallback(() => {
    setEditingNodeId(null);
    setEditingNodeLabel('');
  }, []);

  const onEdgesDelete = useCallback(
    (edgesToDelete: Edge[]) => {
      setEdges((eds) => eds.filter((e) => !edgesToDelete.some((ed) => ed.id === e.id)));
    },
    [setEdges]
  );

  const addNode = useCallback(() => {
    const newNode: Node = {
      id: nodeId.toString(),
      type: 'default',
      position: {
        x: Math.random() * 400 + 100,
        y: Math.random() * 300 + 100,
      },
      data: { label: `${nodeTypes[selectedNodeType]} ${nodeId}` },
      style: { 
        backgroundColor: nodeColors[selectedNodeType], 
        color: 'white', 
        border: 'none',
        borderRadius: '8px',
        padding: '10px'
      }
    };

    setNodes((nds) => [...nds, newNode]);
    setNodeId((id: number) => id + 1);
  }, [nodeId, selectedNodeType, setNodes]);

  const clearDiagram = useCallback(() => {
    setNodes([]);
    setEdges([]);
    setNodeId(1);
    // Clear localStorage as well
    localStorage.removeItem(STORAGE_KEY_NODES);
    localStorage.removeItem(STORAGE_KEY_EDGES);
    localStorage.removeItem(STORAGE_KEY_NODE_ID);
  }, [setNodes, setEdges]);

  const exportDiagram = useCallback(() => {
    const diagramData = {
      nodes,
      edges,
      nodeId
    };
    const dataStr = JSON.stringify(diagramData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = 'workflow-diagram.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  }, [nodes, edges, nodeId]);

  const importDiagram = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const diagramData = JSON.parse(event.target?.result as string);
            setNodes(diagramData.nodes || []);
            setEdges(diagramData.edges || []);
            setNodeId(diagramData.nodeId || 1);
          } catch (error) {
            console.error('Error importing diagram:', error);
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  }, [setNodes, setEdges]);

  return (
    <Card className="w-full h-[600px]">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg">Workflow Diagram Editor</CardTitle>
        <div className="flex flex-wrap gap-2 items-center">
          <div className="flex gap-1">
            {Object.entries(nodeTypes).map(([type, label]) => (
              <Button
                key={type}
                variant={selectedNodeType === type ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedNodeType(type as keyof typeof nodeTypes)}
                style={{ 
                  backgroundColor: selectedNodeType === type ? nodeColors[type as keyof typeof nodeColors] : undefined 
                }}
              >
                {label}
              </Button>
            ))}
          </div>
          <Button onClick={addNode} size="sm" variant="outline">
            <Plus className="w-4 h-4 mr-1" />
            Add Node
          </Button>
          {selectedNode && (
            <>
              <Button onClick={startEditingNode} size="sm" variant="outline">
                <Edit3 className="w-4 h-4 mr-1" />
                Rename
              </Button>
              <Button onClick={deleteSelectedNode} size="sm" variant="outline">
                <Trash2 className="w-4 h-4 mr-1" />
                Delete Node
              </Button>
            </>
          )}
          <Button onClick={clearDiagram} size="sm" variant="outline">
            <Trash2 className="w-4 h-4 mr-1" />
            Clear All
          </Button>
          <Button onClick={exportDiagram} size="sm" variant="outline">
            <Download className="w-4 h-4 mr-1" />
            Export
          </Button>
          <Button onClick={importDiagram} size="sm" variant="outline">
            <Upload className="w-4 h-4 mr-1" />
            Import
          </Button>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Save className="w-3 h-3" />
            Auto-saved
          </div>
        </div>
        
        {editingNodeId && (
          <div className="mt-3 p-3 border rounded-lg bg-gray-50 dark:bg-gray-800">
            <Label htmlFor="node-label" className="text-sm font-medium">
              Edit Node Label
            </Label>
            <div className="flex gap-2 mt-1">
              <Input
                id="node-label"
                value={editingNodeLabel}
                onChange={(e) => setEditingNodeLabel(e.target.value)}
                placeholder="Enter node label"
                className="flex-1"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') saveNodeLabel();
                  if (e.key === 'Escape') cancelEditingNode();
                }}
                autoFocus
              />
              <Button onClick={saveNodeLabel} size="sm">
                Save
              </Button>
              <Button onClick={cancelEditingNode} size="sm" variant="outline">
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {selectedNode && (
          <div className="mt-2 text-sm text-muted-foreground">
            Selected: <span className="font-medium">{selectedNode.data.label}</span>
            <span className="ml-2">• Click node to select • Press Delete to remove edges</span>
          </div>
        )}
      </CardHeader>
      <CardContent className="p-0 h-[500px]">
        <ReactFlow
          key={`reactflow-${nodes.length}-${edges.length}`}
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          onPaneClick={onPaneClick}
          onEdgesDelete={onEdgesDelete}
          onInit={onInit}
          deleteKeyCode={["Backspace", "Delete"]}
          fitView
          className="bg-gray-50 dark:bg-gray-900"
        >
          <Controls />
          <MiniMap 
            nodeColor={(node) => node.style?.backgroundColor as string || '#3B82F6'}
            className="bg-white dark:bg-gray-800"
          />
          <Background gap={12} size={1} />
        </ReactFlow>
      </CardContent>
    </Card>
  );
}
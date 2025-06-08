import { useCallback, useState, useEffect } from 'react';
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
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Download, Upload, Trash2, Edit3, X, Save, Check } from 'lucide-react';

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

const STORAGE_KEY = 'workflow-diagram';

export default function WorkflowDiagramEditor({ }: WorkflowDiagramEditorProps) {
  // Load initial state only once
  const [initialState] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const data = JSON.parse(saved);
        return {
          nodes: data.nodes || defaultNodes,
          edges: data.edges || defaultEdges,
          nodeId: data.nodeId || 2
        };
      }
    } catch (error) {
      console.error('Failed to load saved diagram:', error);
    }
    return {
      nodes: defaultNodes,
      edges: defaultEdges,
      nodeId: 2
    };
  });
  const [nodes, setNodes, onNodesChange] = useNodesState(initialState.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialState.edges);
  const [nodeId, setNodeId] = useState(initialState.nodeId);
  const [selectedNodeType, setSelectedNodeType] = useState<keyof typeof nodeTypes>('agent');
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [editingNodeId, setEditingNodeId] = useState<string | null>(null);
  const [editingNodeLabel, setEditingNodeLabel] = useState('');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  // Removed onDiagramChange callback to prevent infinite loops

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
      setEditingNodeId(null);
      setEditingNodeLabel('');
    }
  }, [editingNodeId, editingNodeLabel, setNodes]);

  const cancelEditingNode = useCallback(() => {
    setEditingNodeId(null);
    setEditingNodeLabel('');
  }, []);

  const onEdgesDelete = useCallback((edgesToDelete: Edge[]) => {
    setEdges((eds) => eds.filter((e) => !edgesToDelete.find((ed) => ed.id === e.id)));
  }, [setEdges]);

  const addNode = useCallback(() => {
    const newNode: Node = {
      id: nodeId.toString(),
      type: 'default',
      position: { x: Math.random() * 300 + 100, y: Math.random() * 300 + 100 },
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
    setSaveStatus('idle');
    localStorage.removeItem(STORAGE_KEY);
  }, [setNodes, setEdges]);

  const saveDiagram = useCallback(() => {
    setSaveStatus('saving');
    try {
      const data = { nodes, edges, nodeId };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (error) {
      console.error('Failed to save diagram:', error);
      setSaveStatus('idle');
    }
  }, [nodes, edges, nodeId]);

  const exportDiagram = useCallback(() => {
    const data = { nodes, edges, nodeId };
    const dataStr = JSON.stringify(data, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const link = document.createElement('a');
    link.setAttribute('href', dataUri);
    link.setAttribute('download', 'workflow-diagram.json');
    link.click();
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
            const data = JSON.parse(event.target?.result as string);
            if (data.nodes && data.edges) {
              setNodes(data.nodes);
              setEdges(data.edges);
              setNodeId(data.nodeId || data.nodes.length + 1);
              setSelectedNode(null);
            }
          } catch (error) {
            console.error('Failed to import diagram:', error);
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  }, [setNodes, setEdges]);

  return (
    <Card className="w-full">
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
          <Button 
            onClick={saveDiagram} 
            size="sm" 
            variant="outline"
            disabled={saveStatus === 'saving'}
            className={saveStatus === 'saved' ? 'border-green-500 text-green-600' : ''}
          >
            {saveStatus === 'saving' && <Save className="w-4 h-4 mr-1 animate-spin" />}
            {saveStatus === 'saved' && <Check className="w-4 h-4 mr-1" />}
            {saveStatus === 'idle' && <Save className="w-4 h-4 mr-1" />}
            {saveStatus === 'saving' ? 'Saving...' : saveStatus === 'saved' ? 'Saved' : 'Save'}
          </Button>
        </div>
        
        {editingNodeId && (
          <div className="mt-3 p-3 border rounded-lg bg-gray-50 dark:bg-gray-800">
            <Label htmlFor="node-label" className="text-sm font-medium">
              Edit Node Label
            </Label>
            <div className="flex gap-2 mt-2">
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
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          onPaneClick={onPaneClick}
          onEdgesDelete={onEdgesDelete}
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
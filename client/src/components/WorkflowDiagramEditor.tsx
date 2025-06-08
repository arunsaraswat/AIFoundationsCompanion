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
  BackgroundVariant,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Download, Upload, Trash2 } from 'lucide-react';

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

const initialNodes: Node[] = [
  {
    id: '1',
    type: 'default',
    position: { x: 250, y: 100 },
    data: { label: 'Start Agent' },
    style: { backgroundColor: nodeColors.agent, color: 'white', border: 'none' }
  }
];

const initialEdges: Edge[] = [];

export default function WorkflowDiagramEditor({ onDiagramChange, initialNodes: propInitialNodes, initialEdges: propInitialEdges }: WorkflowDiagramEditorProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState(propInitialNodes || initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(propInitialEdges || initialEdges);
  const [nodeId, setNodeId] = useState(2);
  const [selectedNodeType, setSelectedNodeType] = useState<keyof typeof nodeTypes>('agent');

  useEffect(() => {
    if (onDiagramChange) {
      onDiagramChange(nodes, edges);
    }
  }, [nodes, edges, onDiagramChange]);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
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
    setNodeId((id) => id + 1);
  }, [nodeId, selectedNodeType, setNodes]);

  const clearDiagram = useCallback(() => {
    setNodes([]);
    setEdges([]);
    setNodeId(1);
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
          <Button onClick={clearDiagram} size="sm" variant="outline">
            <Trash2 className="w-4 h-4 mr-1" />
            Clear
          </Button>
          <Button onClick={exportDiagram} size="sm" variant="outline">
            <Download className="w-4 h-4 mr-1" />
            Export
          </Button>
          <Button onClick={importDiagram} size="sm" variant="outline">
            <Upload className="w-4 h-4 mr-1" />
            Import
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0 h-[500px]">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
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
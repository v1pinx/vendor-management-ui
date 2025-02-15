"use client";
import { useState, useCallback, useMemo } from "react";
import { Search, Edit, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import ReactFlow, {
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  addEdge,
  Handle,
  Position,
} from "reactflow";
import "reactflow/dist/style.css";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { DialogDescription } from "@radix-ui/react-dialog";
import { initialNodes, initialEdges } from "../data/nodes";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

// Initial nodes and edges counter
let regionalNodes = 3;
let cityNodes = 4;
let localNodes = 4;

// Node color based on type
const nodeColor = (type) => {
  switch (type) {
    case "superVendorNode":
      return "#574696";
    case "regionalVendorNode":
      return "#f6ad55";
    case "cityVendorNode":
      return "#f687b3";
    case "localVendorNode":
      return "#63b3ed";
    default:
      return "#f6ad55";
  }
};

// Vendor Node component
const VendorNode = ({ data, isConnectable, type, id }) => {
  const [showMoveDialog, setShowMoveDialog] = useState(false);
  const [selectedParent, setSelectedParent] = useState("");

  // Get available parents based on vendor type
  const getAvailableParents = () => {
    switch (type) {
      case "cityVendorNode":
        return initialNodes
          .filter((node) => node.type === "regionalVendorNode")
          .map((node) => ({
            id: node.id,
            name: node.data.label.name,
          }));
      case "localVendorNode":
        return initialNodes
          .filter((node) => node.type === "cityVendorNode")
          .map((node) => ({
            id: node.id,
            name: node.data.label.name,
          }));
      default:
        return [];
    }
  };

  // Move vendor to new parent
  const handleMove = () => {
    console.log("Moving", id, "to", selectedParent);
    if (selectedParent) {
      data.onMoveVendor(id, selectedParent);
      setShowMoveDialog(false);
    }
  };

  return (
    <Card className="w-64 h-40">
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
      />

      <div className="relative">
        <div
          className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full border-2 border-white"
          style={{ backgroundColor: nodeColor(type) }}
        />

        <div className="absolute top-2 right-2 flex gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Edit className="w-4 h-4 text-gray-400 hover:text-gray-600 cursor-pointer" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Edit Vendor</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      <CardHeader className="pt-6">
        <CardTitle className="text-sm">{data.label.name}</CardTitle>
        <CardDescription className="text-xs">
          {data.label.email}
        </CardDescription>
      </CardHeader>

      {(type === "cityVendorNode" || type === "localVendorNode") && (
        <CardFooter className="p-4">
          <Dialog open={showMoveDialog} onOpenChange={setShowMoveDialog}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="w-full border-[#562BC2] text-[#562BC2] hover:bg-[#562BC2] hover:text-white transition-colors"
              >
                Move Profile
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Move Vendor</DialogTitle>
                <DialogDescription>
                  Select a new parent vendor to move this vendor under
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <Select
                  onValueChange={setSelectedParent}
                  value={selectedParent}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select new parent" />
                  </SelectTrigger>
                  <SelectContent>
                    {getAvailableParents().map((parent) => (
                      <SelectItem key={parent.id} value={parent.id}>
                        {parent.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowMoveDialog(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleMove}
                  disabled={!selectedParent}
                  className="bg-[#562BC2] hover:bg-[#4a248f]"
                >
                  Move Vendor
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardFooter>
      )}

      <Handle
        type="source"
        position={Position.Bottom}
        id="a"
        isConnectable={isConnectable}
      />
    </Card>
  );
};

// Node types
const nodeTypes = {
  superVendorNode: VendorNode,
  regionalVendorNode: VendorNode,
  cityVendorNode: VendorNode,
  localVendorNode: VendorNode,
};

// Vendor Hierarchy Tree component
export default function VendorHierarchyTree() {
  const [searchTerm, setSearchTerm] = useState("");
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newVendor, setNewVendor] = useState({
    name: "",
    email: "",
    type: "",
    parentId: "",
  });

  const { toast } = useToast();

  // Filter nodes based on search term
  const filteredNodes = useMemo(() => {
    if (!searchTerm) return nodes;
    return nodes.map((node) => {
      const matchesSearch =
        node.data.label.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        node.data.label.email.toLowerCase().includes(searchTerm.toLowerCase());

      return {
        ...node,
        style: {
          ...node.style,
          opacity: matchesSearch ? 1 : 0.2,
        },
      };
    });
  }, [nodes, searchTerm]);

  // Add edge on connect
  const onConnect = useCallback(
    (connection) => {
      const edge = {
        ...connection,
        id: `${connection.source}-${connection.target}`,
        type: "smoothstep",
      };
      setEdges((prevEdges) => addEdge(edge, prevEdges));
    },
    [setEdges]
  );

  // Move vendor to new parent
  const handleMoveVendor = (vendorId, newParentId) => {
    const oldEdge = edges.find((edge) => edge.target === vendorId);
    if (oldEdge) {
      setEdges(edges.filter((edge) => edge.id !== oldEdge.id));
    }

    const newEdge = {
      id: `${newParentId}-${vendorId}`,
      source: newParentId,
      target: vendorId,
      type: "smoothstep",
    };
    setEdges((edges) => [...edges, newEdge]);

    toast({
      title: "Vendor Moved",
      description: "Vendor has been moved successfully",
      type: "success",
    });
  };

  // Add new vendor
  const handleAddVendor = () => {
    const newId = `${nodes.length + 1}`;
    const parentNode = nodes.find((node) => node.id === newVendor.parentId);
    const nodeType = newVendor.type;
    let newX = -300;
    if (nodeType === "regionalVendorNode") {
      newX = regionalNodes * 300;
      regionalNodes++;
    } else if (nodeType === "cityVendorNode") {
      newX = cityNodes * 300;
      cityNodes++;
    } else if (nodeType === "localVendorNode") {
      newX = localNodes * 300;
      localNodes++;
    }

    const newPosition = {
      x: newX,
      y: parentNode.position.y + 200,
    };

    const newNode = {
      id: newId,
      position: newPosition,
      type: newVendor.type,
      data: {
        label: {
          name: newVendor.name,
          email: newVendor.email,
        },
        onMoveVendor: handleMoveVendor,
      },
    };
    setNodes([...nodes, newNode]);

    const newEdge = {
      id: `${newVendor.parentId}-${newId}`,
      source: newVendor.parentId,
      target: newId,
      type: "smoothstep",
    };
    setEdges([...edges, newEdge]);

    setShowAddDialog(false);
    setNewVendor({ name: "", email: "", type: "", parentId: "" });
    toast({
      title: "Vendor Added",
      description: "Vendor has been added successfully",
      type: "success",
    });
  };

  // Get available parent types based on vendor type
  const getAvailableParentTypes = (vendorType) => {
    switch (vendorType) {
      case "regionalVendorNode":
        return nodes.filter((node) => node.type === "superVendorNode");
      case "cityVendorNode":
        return nodes.filter((node) => node.type === "regionalVendorNode");
      case "localVendorNode":
        return nodes.filter((node) => node.type === "cityVendorNode");
      default:
        return [];
    }
  };

  const badge = ({ color, vendorType }) => {
    return (
      <div className="flex items-center gap-2">
        <div
          className="w-3 h-3 rounded-full"
          style={{ backgroundColor: color }}
        />
        <span className="text-sm">{vendorType}</span>
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className=""
    >
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold ml-4 mt-4">My Team</h1>
      </div>

      <div className="flex justify-between mx-4">
        <div className="flex gap-2">
          <div className="relative w-64 mb-6">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search by name or email"
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                onClick={(e) => setSearchTerm("")}
                className="absolute right-2 top-2 text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            )}
          </div>
          <Button onClick={() => setShowAddDialog(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Vendor
          </Button>
        </div>

        <div className="flex flex-wrap gap-4 mb-6">
          {badge({ color: "#574696", vendorType: "Super Vendor" })}
          {badge({ color: "#f6ad55", vendorType: "Regional Vendor" })}
          {badge({ color: "#f687b3", vendorType: "City Vendor" })}
          {badge({ color: "#63b3ed", vendorType: "Local Vendor" })}
        </div>
      </div>

      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Vendor</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Vendor Name"
              value={newVendor.name}
              onChange={(e) =>
                setNewVendor({ ...newVendor, name: e.target.value })
              }
            />
            <Input
              placeholder="Email"
              value={newVendor.email}
              onChange={(e) =>
                setNewVendor({ ...newVendor, email: e.target.value })
              }
            />
            <Select
              onValueChange={(value) =>
                setNewVendor({ ...newVendor, type: value, parentId: "" })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select vendor type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="regionalVendorNode">
                  Regional Vendor
                </SelectItem>
                <SelectItem value="cityVendorNode">City Vendor</SelectItem>
                <SelectItem value="localVendorNode">Local Vendor</SelectItem>
              </SelectContent>
            </Select>
            {newVendor.type && (
              <Select
                onValueChange={(value) =>
                  setNewVendor({ ...newVendor, parentId: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select parent vendor" />
                </SelectTrigger>
                <SelectContent>
                  {getAvailableParentTypes(newVendor.type).map((parent) => (
                    <SelectItem key={parent.id} value={parent.id}>
                      {parent.data.label.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            <Button
              onClick={handleAddVendor}
              disabled={
                !newVendor.name ||
                !newVendor.email ||
                !newVendor.type ||
                !newVendor.parentId
              }
            >
              Add Vendor
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <div style={{ height: 800 }}>
        <ReactFlow
          nodes={filteredNodes.map((node) => ({
            ...node,
            data: {
              ...node.data,
              onMoveVendor: handleMoveVendor,
              filteredNodes,
            },
          }))}
          edges={edges}
          onConnect={onConnect}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          fitView
        >
          <Background />
          <Controls />
        </ReactFlow>
      </div>
    </motion.div>
  );
}

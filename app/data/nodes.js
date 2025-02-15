// React Flow nodes data
const initialNodes = [
  {
    id: "s1",
    position: { x: 150, y: 50 },
    type: "superVendorNode",
    data: {
      label: { name: "Super Vendor (National)", email: "admin@gmail.com" },
    },
  },
  // Regional Vendors
  {
    id: "r1",
    position: { x: 0, y: 250 },
    type: "regionalVendorNode",
    data: {
      label: { name: "Regional Vendor (North)", email: "north.vendor@example.com" },
    },
  },
  {
    id: "r2",
    position: { x: 300, y: 250 },
    type: "regionalVendorNode",
    data: {
      label: { name: "Regional Vendor (South)", email: "south.vendor@example.com" },
    },
  },
  {
    id: "r3",
    position: { x: 600, y: 250 },
    type: "regionalVendorNode",
    data: {
      label: { name: "Regional Vendor (West)", email: "west.vendor@example.com" },
    },
  },
  // City Vendors
  {
    id: "c1",
    position: { x: 0, y: 450 },
    type: "cityVendorNode",
    data: {
      label: { name: "City Vendor (Delhi)", email: "delhi.vendor@example.com" },
    },
  },
  {
    id: "c2",
    position: { x: 300, y: 450 },
    type: "cityVendorNode",
    data: {
      label: { name: "City Vendor (Bangalore)", email: "bangalore.vendor@example.com" },
    },
  },
  {
    id: "c3",
    position: { x: 600, y: 450 },
    type: "cityVendorNode",
    data: {
      label: { name: "City Vendor (Mumbai)", email: "mumbai.vendor@example.com" },
    },
  },
  {
    id: "c4",
    position: { x: 900, y: 450 },
    type: "cityVendorNode",
    data: {
      label: { name: "City Vendor (Chennai)", email: "chennai.vendor@example.com" },
    },
  },
  // Local Vendors
  {
    id: "l1",
    position: { x: 0, y: 650 },
    type: "localVendorNode",
    data: {
      label: { name: "Local Vendor (Delhi Central)", email: "delhi.central@example.com" },
    },
  },
  {
    id: "l2",
    position: { x: 300, y: 650 },
    type: "localVendorNode",
    data: {
      label: { name: "Local Vendor (Bangalore South)", email: "bangalore.south@example.com" },
    },
  },
  {
    id: "l3",
    position: { x: 600, y: 650 },
    type: "localVendorNode",
    data: {
      label: { name: "Local Vendor (Mumbai Central)", email: "mumbai.central@example.com" },
    },
  },
  {
    id: "l4",
    position: { x: 900, y: 650 },
    type: "localVendorNode",
    data: {
      label: { name: "Local Vendor (Chennai North)", email: "chennai.north@example.com" },
    },
  },
];

const initialEdges = [
  { id: "s1-r1", source: "s1", target: "r1", type: "smoothstep" },
  { id: "s1-r2", source: "s1", target: "r2", type: "smoothstep" },
  { id: "s1-r3", source: "s1", target: "r3", type: "smoothstep" },
  { id: "r1-c1", source: "r1", target: "c1", type: "smoothstep" },
  { id: "r2-c2", source: "r2", target: "c2", type: "smoothstep" },
  { id: "r3-c3", source: "r3", target: "c3", type: "smoothstep" },
  { id: "r3-c4", source: "r3", target: "c4", type: "smoothstep" },
  { id: "c1-l1", source: "c1", target: "l1", type: "smoothstep" },
  { id: "c2-l2", source: "c2", target: "l2", type: "smoothstep" },
  { id: "c3-l3", source: "c3", target: "l3", type: "smoothstep" },
  { id: "c4-l4", source: "c4", target: "l4", type: "smoothstep" },
];

export { initialNodes, initialEdges};
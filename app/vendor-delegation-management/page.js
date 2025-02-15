"use client";
import { useState, useEffect } from "react";
import { AlertCircle, XCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { vendors } from "../data/mockData";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

// Mock Permissions data
const permissions = [
  {
    id: "fleet_onboarding",
    category: "Fleet Management",
    actions: [
      {
        id: "manage_vehicles",
        name: "Add Vehicles, Edit Vehicle Details, Assign Vehicles",
      },
    ],
  },
  {
    id: "driver_onboarding",
    category: "Driver Management",
    actions: [
      {
        id: "manage_drivers",
        name: "Add Drivers, Verify Documents, Assign Drivers to Vehicles",
      },
    ],
  },
  {
    id: "operations",
    category: "Operations",
    actions: [
      {
        id: "manage_operations",
        name: "Manage Bookings, Process Payments, Track Compliance",
      },
    ],
  },
];

// Vendor Delegation Manager component
const VendorDelegationManager = () => {
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [vendorPermissions, setVendorPermissions] = useState({});
  const [delegationStatus, setDelegationStatus] = useState({});

  const { toast } = useToast();

    // Initialize permissions and delegation status for each vendor
  useEffect(() => {
    const initialPermissions = {};
    const initialDelegationStatus = {};

    vendors.forEach((vendor) => {
      initialPermissions[vendor.vendorId] = {};
      permissions.forEach((category) => {
        category.actions.forEach((action) => {
          initialPermissions[vendor.vendorId][
            `${category.id}_${action.id}`
          ] = false;
        });
      });
      initialDelegationStatus[vendor.vendorId] = false;
    });

    setVendorPermissions(initialPermissions);
    setDelegationStatus(initialDelegationStatus);
  }, []);


  // Check if the vendor is eligible for delegation
  const isVendorEligible = (vendor) => {
    return vendor.vendorType === "regionalVendor" && vendor.status === "Active";
  };


  // Handle permission toggle
  const handlePermissionToggle = (categoryId, actionId) => {
    if (!selectedVendor || !isVendorEligible(selectedVendor)) return;

    setVendorPermissions((prev) => ({
      ...prev,
      [selectedVendor.vendorId]: {
        ...prev[selectedVendor.vendorId],
        [`${categoryId}_${actionId}`]:
          !prev[selectedVendor.vendorId][`${categoryId}_${actionId}`],
      },
    }));
  };

  // Handle delegation toggle
  const handleDelegationToggle = (vendorId) => {
    const vendor = vendors.find((v) => v.vendorId === vendorId);
    if (!isVendorEligible(vendor)) return;

    setDelegationStatus((prev) => ({
      ...prev,
      [vendorId]: !prev[vendorId],
    }));

    if (delegationStatus[vendorId]) {
      setVendorPermissions((prev) => ({
        ...prev,
        [vendorId]: Object.keys(prev[vendorId]).reduce(
          (acc, key) => ({
            ...acc,
            [key]: false,
          }),
          {}
        ),
      }));
    }
  };

  // Handle reset permissions
  const handleReset = () => {
    if (!selectedVendor || !isVendorEligible(selectedVendor)) return;

    setVendorPermissions((prev) => ({
      ...prev,
      [selectedVendor.vendorId]: Object.keys(
        prev[selectedVendor.vendorId]
      ).reduce(
        (acc, key) => ({
          ...acc,
          [key]: false,
        }),
        {}
      ),
    }));
  };


  // Handle save permissions
  const handleSave = () => {
    if (!selectedVendor || !isVendorEligible(selectedVendor)) return;

    console.log("Saving permissions:", {
      vendorId: selectedVendor?.vendorId,
      permissions: vendorPermissions[selectedVendor?.vendorId],
      delegationStatus: delegationStatus[selectedVendor?.vendorId],
    });
    setSelectedVendor(null);
    toast({
      title: "Success",
      description: "Permissions saved successfully",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="space-y-6 p-6"
    >
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Vendor Delegation Management</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Sub-vendors</CardTitle>
            <CardDescription>
              Only regional vendors are eligible for delegation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Vendor</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Delegation</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {vendors.map(
                  (vendor) =>
                    isVendorEligible(vendor) && (
                      <TableRow
                        key={vendor.vendorId}
                        className={`cursor-pointer hover:bg-gray-50 ${
                          selectedVendor?.vendorId === vendor.vendorId
                            ? "bg-gray-50"
                            : ""
                        }`}
                      >
                        <TableCell
                          className="font-medium"
                          onClick={() => setSelectedVendor(vendor)}
                        >
                          {vendor.name}
                        </TableCell>
                        <TableCell>
                          {vendor.vendorType.charAt(0).toUpperCase() +
                            vendor.vendorType
                              .slice(1)
                              .replace(/([A-Z])/g, " $1")
                              .trim()}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              vendor.status === "Active"
                                ? "success"
                                : "secondary"
                            }
                          >
                            {vendor.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {isVendorEligible(vendor) ? (
                            <Switch
                              checked={
                                delegationStatus[vendor.vendorId] || false
                              }
                              onCheckedChange={() =>
                                handleDelegationToggle(vendor.vendorId)
                              }
                            />
                          ) : (
                            <XCircle className="h-5 w-5 text-gray-300" />
                          )}
                        </TableCell>
                      </TableRow>
                    )
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Permission Delegation</CardTitle>
            <CardDescription>
              {selectedVendor
                ? `Managing permissions for ${selectedVendor.name}`
                : "Select a vendor to manage permissions"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {selectedVendor ? (
              isVendorEligible(selectedVendor) ? (
                <div className="space-y-6">
                  {permissions.map((category) => (
                    <div key={category.id} className="space-y-4">
                      <h3 className="font-semibold text-lg">
                        {category.category}
                      </h3>
                      <div className="space-y-2">
                        {category.actions.map((action) => (
                          <div
                            key={action.id}
                            className="flex items-center justify-between p-2 hover:bg-gray-50 rounded"
                          >
                            <span>{action.name}</span>
                            <Switch
                              checked={
                                vendorPermissions[selectedVendor.vendorId]?.[
                                  `${category.id}_${action.id}`
                                ] || false
                              }
                              onCheckedChange={() =>
                                handlePermissionToggle(category.id, action.id)
                              }
                              disabled={
                                !delegationStatus[selectedVendor.vendorId]
                              }
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}

                  <div className="flex justify-end space-x-2 pt-4">
                    <Button
                      variant="outline"
                      onClick={handleReset}
                      disabled={!delegationStatus[selectedVendor.vendorId]}
                    >
                      Reset
                    </Button>
                    <Button
                      onClick={handleSave}
                      disabled={!delegationStatus[selectedVendor.vendorId]}
                    >
                      Save Changes
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-64 text-red-500">
                  <XCircle className="mr-2 h-5 w-5" />
                  This vendor is not eligible for delegation
                </div>
              )
            ) : (
              <div className="flex items-center justify-center h-64 text-gray-500">
                <AlertCircle className="mr-2 h-5 w-5" />
                Select a vendor to manage permissions
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
};

export default VendorDelegationManager;

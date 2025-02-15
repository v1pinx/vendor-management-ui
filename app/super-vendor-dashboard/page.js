"use client";
import { Car, Users, FileCheck } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { vendors, superVendorDashboardData } from "../data/mockData";
import { motion } from "framer-motion";

export default function SuperVendorDashboard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="space-y-6 p-6"
    >
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Super Vendor Control Center</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Total Sub-vendors (Regional Included)
                </p>
                <p className="text-2xl font-bold">
                  {superVendorDashboardData[0].totalSubVendors}
                </p>
              </div>
              <Users className="h-8 w-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Active Vehicles
                </p>
                <p className="text-2xl font-bold">
                  {superVendorDashboardData[0].activeVehicles}
                </p>
              </div>
              <Car className="h-8 w-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Available Drivers
                </p>
                <p className="text-2xl font-bold">
                  {superVendorDashboardData[0].driversAvailable}
                </p>
              </div>
              <Users className="h-8 w-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Pending Approvals
                </p>
                <p className="text-2xl font-bold">
                  {superVendorDashboardData[0].pendingDocumentApprovals}
                </p>
              </div>
              <FileCheck className="h-8 w-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Sub-vendor Network</CardTitle>
          <CardDescription>Real-time status of all sub-vendors</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Vendor</TableHead>
                <TableHead>Active Vehicles</TableHead>
                <TableHead>Available Drivers</TableHead>
                <TableHead>Pending Approvals</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vendors.map(
                (vendor) =>
                  (vendor.vendorType === "cityVendor" ||
                    vendor.vendorType === "localVendor") && (
                    <TableRow key={vendor.vendorId}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{vendor.name}</p>
                          {vendor.vendorType == "cityVendor" ? (
                            <p className="text-sm text-gray-500">City Vendor</p>
                          ) : (
                            <p className="text-sm text-gray-500">
                              Local Vendor
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          {vendor.activeVehicles}
                        </div>
                      </TableCell>
                      <TableCell>{vendor.availableDrivers}</TableCell>
                      <TableCell>{vendor.pendingApprovals}</TableCell>
                      <TableCell>
                        <Button variant="secondary" size="sm">
                          Manage
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </motion.div>
  );
}

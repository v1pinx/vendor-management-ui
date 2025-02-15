"use client";
import { useState } from "react";
import {
  Car,
  User,
  AlertCircle,
  Plus,
  Calendar,
  Search,
  CheckCircle2,
  Edit,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { vehiclesData, driversData } from "../data/mockData";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

export default function FleetDriverManagement() {
  const [activeTab, setActiveTab] = useState("vehicles");
  const [showAddVehicle, setShowAddVehicle] = useState(false);
  const [showAddDriver, setShowAddDriver] = useState(false);
  const [vehicles, setVehicles] = useState(vehiclesData);
  const [drivers, setDrivers] = useState(driversData);
  const [searchQuery, setSearchQuery] = useState("");

  const { toast } = useToast();

  // Filter vehicles and drivers based on search query
  const filteredVehicles = vehicles.filter(
    (vehicle) =>
      vehicle.registrationNumber
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      vehicle.model.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filter drivers based on search query
  const filteredDrivers = drivers.filter(
    (driver) =>
      driver.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      driver.licenseNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Vehicle form component
  const VehicleForm = () => {
    const [errors, setErrors] = useState({});
    const [newVehicle, setNewVehicle] = useState({
      registrationNumber: "",
      model: "",
      seatingCapacity: "",
      fuelType: "",
      status: "Active",
      documentStatus: "Pending",
    });

    // Validate form fields
    const validateForm = () => {
      const newErrors = {};
      if (!newVehicle.registrationNumber.trim()) {
        newErrors.registrationNumber = "Registration number is required";
      }
      if (!newVehicle.model.trim()) {
        newErrors.model = "Model is required";
      }
      if (!newVehicle.seatingCapacity || newVehicle.seatingCapacity <= 0) {
        newErrors.seatingCapacity = "Valid seating capacity is required";
      }
      if (!newVehicle.fuelType) {
        newErrors.fuelType = "Fuel type is required";
      }
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };

    const handleAddVehicle = (e) => {
      e.preventDefault();

      if (!validateForm()) {
        return;
      }

      const vehicleId = `V${vehicles.length + 1}`;
      const newVehicleData = {
        vehicleId,
        ...newVehicle,
        assignedDriver: null,
        seatingCapacity: parseInt(newVehicle.seatingCapacity),
        createdAt: new Date().toISOString(),
      };

      setVehicles([...vehicles, newVehicleData]);
      setShowAddVehicle(false);
      setNewVehicle({
        registrationNumber: "",
        model: "",
        seatingCapacity: "",
        fuelType: "",
        status: "Active",
        documentStatus: "Pending",
      });
      toast({
        title: "Vehicle added successfully",
        description: "Vehicle details have been saved",
      });
    };

    return (
      <form onSubmit={handleAddVehicle} className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <Input
            placeholder="Registration Number"
            value={newVehicle.registrationNumber}
            onChange={(e) =>
              setNewVehicle({
                ...newVehicle,
                registrationNumber: e.target.value,
              })
            }
            className={errors.registrationNumber ? "border-red-500" : ""}
          />
          {errors.registrationNumber && (
            <p className="text-red-500 text-sm">{errors.registrationNumber}</p>
          )}
        </div>

        <div className="space-y-1">
          <Input
            placeholder="Model"
            value={newVehicle.model}
            onChange={(e) =>
              setNewVehicle({ ...newVehicle, model: e.target.value })
            }
            className={errors.model ? "border-red-500" : ""}
          />
          {errors.model && (
            <p className="text-red-500 text-sm">{errors.model}</p>
          )}
        </div>

        <div className="space-y-1">
          <Input
            placeholder="Seating Capacity"
            type="number"
            min="1"
            value={newVehicle.seatingCapacity}
            onChange={(e) =>
              setNewVehicle({ ...newVehicle, seatingCapacity: e.target.value })
            }
            className={errors.seatingCapacity ? "border-red-500" : ""}
          />
          {errors.seatingCapacity && (
            <p className="text-red-500 text-sm">{errors.seatingCapacity}</p>
          )}
        </div>

        <div className="space-y-1">
          <Select
            value={newVehicle.fuelType}
            onValueChange={(value) =>
              setNewVehicle({ ...newVehicle, fuelType: value })
            }
          >
            <SelectTrigger className={errors.fuelType ? "border-red-500" : ""}>
              <SelectValue placeholder="Fuel Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Petrol">Petrol</SelectItem>
              <SelectItem value="Diesel">Diesel</SelectItem>
              <SelectItem value="CNG">CNG</SelectItem>
              <SelectItem value="EV">Electric</SelectItem>
            </SelectContent>
          </Select>
          {errors.fuelType && (
            <p className="text-red-500 text-sm">{errors.fuelType}</p>
          )}
        </div>

        <div className="col-span-2 space-y-4">
          <div>
            <p className="text-sm font-medium mb-2">Upload License</p>
            <Input type="file" accept=".pdf,.jpg,.jpeg,.png" />
          </div>
        </div>

        <div className="col-span-2 flex justify-end space-x-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => setShowAddVehicle(false)}
          >
            Cancel
          </Button>
          <Button type="submit">Add Vehicle</Button>
        </div>
      </form>
    );
  };

  // Driver form component
  const DriverForm = () => {
    const [errors, setErrors] = useState({});
    const [newDriver, setNewDriver] = useState({
      name: "",
      email: "",
      assignedVehicle: "",
      licenseNumber: "",
      status: "Valid",
      documentStatus: "Pending",
      licenseExpiryDate: new Date().toISOString().split("T")[0],
    });

    // Validate form fields
    const validateForm = () => {
      const newErrors = {};

      if (!newDriver.name.trim()) {
        newErrors.name = "Full name is required";
      }

      if (!newDriver.email.trim()) {
        newErrors.email = "Email is required";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newDriver.email)) {
        newErrors.email = "Enter a valid email address";
      }

      if (!newDriver.licenseNumber.trim()) {
        newErrors.licenseNumber = "License number is required";
      }

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };

    // Add new driver
    const handleAddDriver = (e) => {
      e.preventDefault();

      if (!validateForm()) {
        return;
      }

      const driverId = `D${drivers.length + 1}`;
      const newDriverData = {
        driverId,
        ...newDriver,
        createdAt: new Date().toISOString(),
        assignedVehicleName: newDriver.assignedVehicle
          ? vehicles.find(
              (v) => v.registrationNumber === newDriver.assignedVehicle
            )?.model
          : null,
      };

      setDrivers([...drivers, newDriverData]);
      setShowAddDriver(false);
      setNewDriver({
        name: "",
        email: "",
        assignedVehicle: "",
        licenseNumber: "",
        status: "Active",
        documentStatus: "Pending",
        licenseExpiryDate: new Date().toISOString().split("T")[0],
      });

      toast({
        title: "Driver added successfully",
        description: "Driver details have been saved",
      });
    };

    return (
      <form onSubmit={handleAddDriver} className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <Input
            placeholder="Full Name"
            value={newDriver.name}
            onChange={(e) =>
              setNewDriver({ ...newDriver, name: e.target.value })
            }
            className={errors.name ? "border-red-500" : ""}
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
        </div>

        <div className="space-y-1">
          <Input
            placeholder="Email"
            type="email"
            value={newDriver.email}
            onChange={(e) =>
              setNewDriver({ ...newDriver, email: e.target.value })
            }
            className={errors.email ? "border-red-500" : ""}
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email}</p>
          )}
        </div>

        <div className="space-y-1">
          <Input
            placeholder="License Number"
            value={newDriver.licenseNumber}
            onChange={(e) =>
              setNewDriver({ ...newDriver, licenseNumber: e.target.value })
            }
            className={errors.licenseNumber ? "border-red-500" : ""}
          />
          {errors.licenseNumber && (
            <p className="text-red-500 text-sm">{errors.licenseNumber}</p>
          )}
        </div>

        <div className="space-y-1">
          <Select
            value={newDriver.assignedVehicle}
            onValueChange={(value) =>
              setNewDriver({ ...newDriver, assignedVehicle: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Assign Vehicle" />
            </SelectTrigger>
            <SelectContent>
              {vehicles
                .filter((vehicle) => !vehicle.assignedDriver)
                .map((vehicle) => (
                  <SelectItem
                    key={vehicle.vehicleId}
                    value={vehicle.registrationNumber}
                  >
                    {vehicle.registrationNumber} - {vehicle.model}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1">
          <Input
            type="date"
            value={newDriver.licenseExpiryDate}
            onChange={(e) =>
              setNewDriver({ ...newDriver, licenseExpiryDate: e.target.value })
            }
          />
          <p className="text-sm text-gray-500">License Expiry Date</p>
        </div>

        <div className="col-span-2 space-y-4">
          <div>
            <p className="text-sm font-medium mb-2">Upload Driving License</p>
            <Input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setNewDriver({ ...newDriver, licenseFile: file });
                }
              }}
            />
          </div>
        </div>

        <div className="col-span-2 flex justify-end space-x-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => setShowAddDriver(false)}
          >
            Cancel
          </Button>
          <Button type="submit">Add Driver</Button>
        </div>
      </form>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="space-y-6 p-6"
    >
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Fleet & Driver Management</h1>
        <div className="flex space-x-2">
          <Dialog open={showAddVehicle} onOpenChange={setShowAddVehicle}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Add Vehicle
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Vehicle</DialogTitle>
                <DialogDescription>
                  Enter vehicle details and upload required documents
                </DialogDescription>
              </DialogHeader>
              <VehicleForm />
            </DialogContent>
          </Dialog>

          <Dialog open={showAddDriver} onOpenChange={setShowAddDriver}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Add Driver
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Driver</DialogTitle>
                <DialogDescription>
                  Enter driver details and upload required documents
                </DialogDescription>
              </DialogHeader>
              <DriverForm />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <Tabs defaultValue="vehicles" className="w-full">
          <TabsList>
            <TabsTrigger
              value="vehicles"
              onClick={() => setActiveTab("vehicles")}
            >
              <Car className="mr-2 h-4 w-4" />
              Vehicles
            </TabsTrigger>
            <TabsTrigger
              value="drivers"
              onClick={() => setActiveTab("drivers")}
            >
              <User className="mr-2 h-4 w-4" />
              Drivers
            </TabsTrigger>
          </TabsList>

          <TabsContent value="vehicles">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Vehicle Fleet</CardTitle>
                    <CardDescription>
                      Manage your vehicles and their documentation
                    </CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Search className="h-4 w-4 text-gray-500" />
                    <Input
                      placeholder="Search vehicles..."
                      className="w-64"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Reg. Number</TableHead>
                      <TableHead>Model</TableHead>
                      <TableHead>Capacity</TableHead>
                      <TableHead>Fuel Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Documents</TableHead>
                      <TableHead>Driver</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredVehicles.map((vehicle) => (
                      <TableRow key={vehicle.vehicleId}>
                        <TableCell className="font-medium">
                          {vehicle.registrationNumber}
                        </TableCell>
                        <TableCell>{vehicle.model}</TableCell>
                        <TableCell>{vehicle.seatingCapacity}</TableCell>
                        <TableCell>{vehicle.fuelType}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              vehicle.status === "Active"
                                ? "success"
                                : "warning"
                            }
                          >
                            {vehicle.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            {vehicle.documentStatus === "Approved" ? (
                              <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
                            ) : (
                              <AlertCircle className="mr-2 h-4 w-4 text-amber-500" />
                            )}
                            {vehicle.documentStatus}
                          </div>
                        </TableCell>
                        <TableCell>
                          {vehicle.assignedDriver ? (
                            <p>{vehicle.assignedDriver}</p>
                          ) : (
                            <p className="italic text-gray-400">Not assigned</p>
                          )}
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="drivers">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Drivers</CardTitle>
                    <CardDescription>
                      Manage drivers and their documentation
                    </CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Search className="h-4 w-4 text-gray-500" />
                    <Input
                      placeholder="Search drivers..."
                      className="w-64"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Vehicle</TableHead>
                      <TableHead>License No.</TableHead>
                      <TableHead>License Expiry</TableHead>
                      <TableHead>Document Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDrivers.map((driver) => (
                      <TableRow key={driver.driverId}>
                        <TableCell className="font-medium">
                          {driver.name}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              driver.status == "Valid" ? "success" : "warning"
                            }
                          >
                            {driver.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{driver.assignedVehicleName}</TableCell>
                        <TableCell>{driver.licenseNumber}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Calendar className="mr-2 h-4 w-4" />
                            {driver.licenseExpiryDate}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            {driver.documentStatus === "Valid" ? (
                              <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
                            ) : (
                              <AlertCircle className="mr-2 h-4 w-4 text-amber-500" />
                            )}
                            {driver.documentStatus}
                          </div>
                        </TableCell>

                        <TableCell>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </motion.div>
  );
}

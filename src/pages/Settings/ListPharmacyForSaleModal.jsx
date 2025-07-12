import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { UploadCloud, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { read, utils } from 'xlsx';

export default function ListPharmacyForSaleModal({ open, onOpenChange, onSubmit, initialPharmacy }) {
  const [monthlySales, setMonthlySales] = useState("");
  const [saleType, setSaleType] = useState("");
  const [excelFile, setExcelFile] = useState(null);
  const [previewData, setPreviewData] = useState(null);
  const [price, setPrice] = useState("");
  const [priceError, setPriceError] = useState("");
  const [monthlySalesError, setMonthlySalesError] = useState("");

  const handleFilePreview = async (file) => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const workbook = read(arrayBuffer);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = utils.sheet_to_json(worksheet, { header: 1 });

      // Remove empty rows and columns
      const filteredData = jsonData
        .filter(row => row.some(cell => cell !== ""))
        .map(row => row.map(cell => cell || ""));

      if (filteredData.length > 0) {
        setPreviewData(filteredData);
      } else {
        setPreviewData(null);
      }
    } catch (error) {
      console.error('Error reading file:', error);
      setPreviewData(null);
    }
  };

  const handleExcelChange = (e) => {
    const file = e.target.files[0];
    if (file && (file.name.endsWith('.xlsx') || file.name.endsWith('.xls') || file.name.endsWith('.csv'))) {
      setExcelFile(file);
      handleFilePreview(file);
    }
  };

  const handleExcelDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && (file.name.endsWith('.xlsx') || file.name.endsWith('.xls') || file.name.endsWith('.csv'))) {
      setExcelFile(file);
      handleFilePreview(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleExcelClear = () => {
    setExcelFile(null);
    setPreviewData(null);
  };

  const handleClose = () => {
    setMonthlySales("");
    setSaleType("");
    setExcelFile(null);
    setPreviewData(null);
    setPrice("");
    setPriceError("");
    setMonthlySalesError("");
    onOpenChange(false);
  };

  const handlePriceChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    if (value.length > 10) {
      setPriceError("Maximum 10 digits allowed");
    } else {
      setPriceError("");
      setPrice(value);
    }
  };

  const handleMonthlySalesChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    if (value.length > 10) {
      setMonthlySalesError("Maximum 10 digits allowed");
    } else {
      setMonthlySalesError("");
      setMonthlySales(value);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (priceError || monthlySalesError) return;
    const formData = new FormData();
    formData.append("pharmacyPrice", price);
    formData.append("monthlySales", monthlySales);
    formData.append("saleType", saleType);
    if (excelFile) {
      formData.append("medicinesList", excelFile);
    }
    onSubmit(formData);
    handleClose();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] p-0 max-h-[90vh] flex flex-col">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle className="text-center">List Pharmacy for Sale</DialogTitle>
        </DialogHeader>
        
        <div className="px-6 py-4 overflow-y-auto flex-1">
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div>
              <Label htmlFor="pharmacyPrice" className="mb-2.5">Pharmacy Price</Label>
              <Input
                id="pharmacyPrice"
                name="pharmacyPrice"
                type="number"
                value={price}
                onChange={handlePriceChange}
                placeholder="Enter pharmacy price"
                required
                maxLength={10}
              />
              {priceError && <p className="text-red-500 text-xs mt-1">{priceError}</p>}
            </div>

            <div>
              <Label htmlFor="monthlySales" className="mb-2.5">Monthly Sales</Label>
              <Input
                id="monthlySales"
                type="number"
                value={monthlySales}
                onChange={handleMonthlySalesChange}
                placeholder="Enter monthly sales"
                required
                maxLength={10}
              />
              {monthlySalesError && <p className="text-red-500 text-xs mt-1">{monthlySalesError}</p>}
            </div>

            <div>
              <Label htmlFor="saleType" className="mb-2.5">Sale Type</Label>
              <Select value={saleType} onValueChange={setSaleType} required>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select sale type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pharmacy_with_medicines">With Medicines</SelectItem>
                  <SelectItem value="pharmacy_only">Without Medicines</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              <div>
                <Label className="text-gray-700 font-medium mb-2.5   block">
                  Medicines List (Optional)
                </Label>
                <label
                  htmlFor="excelFile"
                  className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-white hover:bg-gray-50 transition-colors"
                  onDrop={handleExcelDrop}
                  onDragOver={handleDragOver}
                >
                  <div className="flex items-center gap-2 py-2">
                    <UploadCloud className="w-6 h-6 text-gray-400" />
                    {excelFile ? (
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600 truncate max-w-[200px]">
                          {excelFile.name}
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            handleExcelClear();
                          }}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          <XCircle size={16} />
                        </button>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-600">
                        Click or drag to upload file (.xlsx, .xls, .csv)
                      </span>
                    )}
                  </div>
                  <Input
                    id="excelFile"
                    name="excelFile"
                    type="file"
                    accept=".xlsx,.xls,.csv"
                    className="hidden"
                    onChange={handleExcelChange}
                  />
                </label>
              </div>

              {previewData && previewData.length > 0 && (
                <div className="border rounded-lg overflow-hidden bg-white">
                  <div className="bg-gray-50 px-4 py-2 border-b flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">File Preview</span>
                    <span className="text-xs text-gray-500">
                      Showing {Math.min(4, previewData.length - 1)} of {previewData.length - 1} rows
                    </span>
                  </div>
                  <div className="max-h-[200px] overflow-auto">
                    <table className="w-full border-collapse" style={{ direction: 'rtl' }}>
                      <thead>
                        <tr className="bg-gray-50 sticky top-0">
                          {previewData[0]?.map((header, idx) => (
                            <th
                              key={idx}
                              className="py-2 px-4 text-right text-xs font-medium text-gray-600 bg-gray-50 border-b whitespace-nowrap"
                              style={{ minWidth: '120px' }}
                            >
                              {header}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {previewData.slice(1, 5).map((row, rowIdx) => (
                          <tr key={rowIdx} className="border-b hover:bg-gray-50">
                            {row.map((cell, cellIdx) => (
                              <td
                                key={cellIdx}
                                className="px-4 py-2 text-right text-sm text-gray-600 whitespace-nowrap"
                              >
                                {cell}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-2 justify-end pt-4 border-t mt-auto">
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button type="submit" className="bg-primary hover:bg-primary-hover text-white">
                List for Sale
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
} 
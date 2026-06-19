// frontend/src/services/csvExporter.js
import { analyzeInventoryHealthAI } from './aiEngine.js';

export const exportExpiryReportToCSV = (criticalBatchArray, warningBatchArray) => {
  // Combine priority risk vectors for holistic data coverage
  const allRiskBatches = [...criticalBatchArray, ...warningBatchArray];
  
  if (allRiskBatches.length === 0) {
    alert("No active expiration tracking data available to generate reports.");
    return;
  }

  // 1. Define clean spreadsheet table header string structures
  const headers = [
    "Product Name",
    "Barcode ID",
    "Category",
    "MSRP Price",
    "Quantity Left",
    "Cost Price (Unit)",
    "Expiration Date",
    "Days Remaining",
    "AI Waste Risk Level",
    "AI Recommended Markdown %",
    "Current Action Status"
  ];

  // 2. Parse database array objects into sanitized matrix data strings
  const csvRows = allRiskBatches.map(batch => {
    const aiReport = analyzeInventoryHealthAI(batch);
    
    const rowValues = [
      `"${batch.productId?.name || 'Unknown Product'}"`,
      `"${batch.productId?.barcode || ''}"`,
      `"${batch.productId?.category || 'General'}"`,
      batch.productId?.price || 0,
      batch.quantityRemaining || 0,
      batch.costPrice || 0,
      new Date(batch.expiryDate).toLocaleDateString(),
      aiReport.daysRemaining,
      `"${aiReport.wasteRisk}"`,
      `${aiReport.markdownPercent}%`,
      `"${batch.status === 'discounted' ? 'DISCOUNT RUNNING' : 'PENDING ACTION'}"`
    ];
    
    return rowValues.join(",");
  });

  // 3. Assemble document structures with proper line termination encodings
  const csvContent = [headers.join(","), ...csvRows].join("\n");

  // 4. Construct virtual document node wrappers to trigger download mechanics
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const downloadUrl = URL.createObjectURL(blob);
  
  const linkElement = document.createElement("a");
  linkElement.setAttribute("href", downloadUrl);
  linkElement.setAttribute("download", `StockPulse_Expiry_Report_${new Date().toISOString().split('T')[0]}.csv`);
  
  document.body.appendChild(linkElement);
  linkElement.click(); // Trigger native click action event loop
  document.body.removeChild(linkElement); // Immediately destroy ghost node to avoid leaks
};

// frontend/src/services/aiEngine.js

/**
 * Custom Lightweight AI Pricing & Waste Prediction Engine
 * Computes optimized markdown parameters using structural decay and cost constraints.
 */
export const analyzeInventoryHealthAI = (batch) => {
  if (!batch || !batch.expiryDate) {
    return { markdownPercent: 0, wasteRisk: 'Low', alternativeAction: 'Keep at full retail price' };
  }

  const today = new Date();
  const expiry = new Date(batch.expiryDate);
  
  // Calculate remaining shelf-life days mathematically
  const diffTime = expiry - today;
  const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  const quantity = batch.quantityRemaining || 1;
  const costPrice = batch.costPrice || 0;

  let markdownPercent = 0;
  let wasteRisk = 'Low';
  let alternativeAction = 'Monitor closely on current store shelf configurations';

  // AI Rule Matrix Branch A: Critical Expiration (Under 3 Days)
  if (daysRemaining <= 3) {
    wasteRisk = quantity > 30 ? 'Critical' : 'High';
    
    if (quantity > 50) {
      markdownPercent = 70; // Heavy price cut to liquidate heavy volume immediately
      alternativeAction = 'Bundle: Buy 1 Get 1 Free near primary store entry gates';
    } else {
      markdownPercent = 50;
      alternativeAction = 'Place on specialized front clearance endcap displays';
    }
  } 
  // AI Rule Matrix Branch B: Warning Window (4 to 7 Days)
  else if (daysRemaining <= 7) {
    wasteRisk = quantity > 40 ? 'High' : 'Moderate';
    
    if (costPrice > 200) {
      markdownPercent = 25; // Protect high-margin luxury items with conservative price drops
      alternativeAction = 'Cross-promote with matching baseline product categories';
    } else {
      markdownPercent = 35;
      alternativeAction = 'Flash Markdown: Apply promotional orange clearance label tags';
    }
  }
  // AI Rule Matrix Branch C: Safe Zone
  else {
    if (quantity > 100) {
      wasteRisk = 'Moderate';
      markdownPercent = 10; // Early minor markdown due to overstocking issues
      alternativeAction = 'Introduce small volume price drops to drive velocity';
    }
  }

  // Ensure markdown parameters do not fall below zero boundaries
  markdownPercent = Math.max(0, markdownPercent);

  return {
    markdownPercent,
    wasteRisk,
    alternativeAction,
    daysRemaining: daysRemaining > 0 ? daysRemaining : 0
  };
};

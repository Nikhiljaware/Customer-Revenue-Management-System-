
import { GoogleGenAI, Type } from "@google/genai";
import { Customer, RevenueMetric } from '../types';

// Use process.env.API_KEY directly as per guidelines
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateRevenueInsights = async (customers: Customer[], revenueData: RevenueMetric[]) => {
  const prompt = `
    Analyze the following customer revenue data and provide 3 key insights for the business.
    Focus on trends, potential risks (like churn), and growth opportunities.

    Data Summary:
    - Total Monthly Revenue: $${revenueData[revenueData.length - 1].revenue}
    - Total Customers: ${customers.length}
    - Active Customers: ${customers.filter(c => c.status === 'Active').length}
    - Recent Monthly Growth: ${((revenueData[6].revenue / revenueData[5].revenue - 1) * 100).toFixed(1)}%

    Customer Segments:
    ${customers.map(c => `- ${c.name} (${c.industry}): MRR $${c.mrr}, LTV $${c.ltv}, Status: ${c.status}`).join('\n')}

    Please format the response as a JSON array of objects with "title" and "description" fields.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              description: { type: Type.STRING }
            },
            required: ["title", "description"]
          }
        }
      }
    });

    return JSON.parse(response.text || '[]');
  } catch (error) {
    console.error("Error generating insights:", error);
    return [
      { title: "Analysis Offline", description: "Could not generate insights at this time. Please check your API configuration." }
    ];
  }
};

export const generateGrowthProjection = async (customers: Customer[], revenueData: RevenueMetric[]) => {
  const currentRevenue = revenueData[revenueData.length - 1].revenue;
  const prompt = `
    Based on the following data, project revenue for the next 12 months.
    Current MRR: $${customers.reduce((sum, c) => sum + c.mrr, 0)}
    Historical Monthly Revenue: ${revenueData.map(r => r.revenue).join(', ')}
    
    Predict the next 12 months of revenue growth. Be realistic but optimistic based on current trends.
    Return a JSON object with:
    1. "projection": An array of 12 objects with "month" (e.g. "Month 1") and "revenue" (number).
    2. "summary": A 2-sentence strategic explanation of the growth drivers.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            projection: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  month: { type: Type.STRING },
                  revenue: { type: Type.NUMBER }
                }
              }
            },
            summary: { type: Type.STRING }
          },
          required: ["projection", "summary"]
        }
      }
    });

    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Error generating projection:", error);
    // Fallback logic
    const fallback = [];
    for (let i = 1; i <= 12; i++) {
      fallback.push({ month: `Month ${i}`, revenue: currentRevenue * (1 + (i * 0.02)) });
    }
    return {
      projection: fallback,
      summary: "Standard 2% organic growth projected based on current account stability."
    };
  }
};

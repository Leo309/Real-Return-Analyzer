import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import useCalculatorStore from '@/store/calculatorStore';
import { countries } from '@/data/countries';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const ResultsDisplay: React.FC = () => {
  const { result, amount, countryCode, startYear, endYear, investmentType } = useCalculatorStore();
  const countryData = countries[countryCode];

  if (!result) {
    return null;
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: countryData.currency,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return (value >= 0 ? '+' : '') + value.toFixed(2) + '%';
  };

  // Calculate changes
  const inflationImpact = ((result.inflationAdjustedValue - amount) / amount) * 100;
  const opportunityCostImpact = investmentType !== 'none' 
    ? ((result.opportunityCostValue - amount) / amount) * 100
    : 0;

  // Prepare chart data
  const labels = result.yearlyBreakdown.map(item => item.year.toString());
  
  const chartData = {
    labels,
    datasets: [
      {
        label: 'Nominal Value',
        data: result.yearlyBreakdown.map(item => item.nominal),
        borderColor: 'rgb(75, 85, 99)',
        backgroundColor: 'rgba(75, 85, 99, 0.5)',
      },
      {
        label: 'Inflation-Adjusted Value',
        data: result.yearlyBreakdown.map(item => item.inflationAdjusted),
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.5)',
      },
    ]
  };

  // Add opportunity cost data if an investment type was selected
  if (investmentType !== 'none') {
    chartData.datasets.push({
      label: investmentType === 'savings' ? 'Savings Account Value' : 'Stock Market Value',
      data: result.yearlyBreakdown.map(item => item.opportunityCost),
      borderColor: 'rgb(34, 197, 94)',
      backgroundColor: 'rgba(34, 197, 94, 0.5)',
    });
  }

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Value Over Time',
      },
    },
  };

  // Message based on results
  const getMessage = () => {
    if (investmentType === 'none') {
      return `Due to inflation, your ${formatCurrency(amount)} has lost 
              ${formatPercentage(inflationImpact)} in purchasing power from ${startYear} to ${endYear}.`;
    } else {
      const investmentName = investmentType === 'savings' ? 'a savings account' : 'the stock market';
      return `If you had invested ${formatCurrency(amount)} in ${investmentName} in ${startYear}, 
              it would be worth ${formatCurrency(result.opportunityCostValue)} today 
              (${formatPercentage(opportunityCostImpact)}). After adjusting for inflation, 
              the real value is ${formatCurrency(result.inflationAdjustedValue)} 
              (${formatPercentage(inflationImpact)}).`;
    }
  };

  // Shocking comparisons
  const getShockingComparisons = () => {
    const lostValue = amount - result.inflationAdjustedValue;
    
    if (lostValue <= 0) return null;
    
    const coffeePrice = countryCode === 'US' ? 5 : 6;
    const iphonePrice = countryCode === 'US' ? 1000 : 1200;
    const hourlyWage = countryCode === 'US' ? 20 : 25;
    
    return (
      <div className="mt-4 p-4 bg-red-50 rounded-lg">
        <h3 className="font-bold text-lg mb-2">What You've Lost:</h3>
        <ul className="space-y-2">
          <li>☕ Equivalent to {Math.round(lostValue / coffeePrice)} premium coffees</li>
          <li>📱 That's {(lostValue / iphonePrice).toFixed(2)} new smartphones</li>
          <li>⏱️ Represents {Math.round(lostValue / hourlyWage)} hours of work</li>
        </ul>
      </div>
    );
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Results</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-100 p-4 rounded-lg">
          <p className="text-gray-600 text-sm">Nominal Value</p>
          <p className="text-2xl font-bold">{formatCurrency(amount)}</p>
        </div>
        
        <div className="bg-red-100 p-4 rounded-lg">
          <p className="text-gray-600 text-sm">Inflation-Adjusted Value</p>
          <p className="text-2xl font-bold">{formatCurrency(result.inflationAdjustedValue)}</p>
          <p className={`text-sm ${inflationImpact < 0 ? 'text-red-600' : 'text-green-600'}`}>
            {formatPercentage(inflationImpact)}
          </p>
        </div>
        
        {investmentType !== 'none' && (
          <div className="bg-green-100 p-4 rounded-lg">
            <p className="text-gray-600 text-sm">
              {investmentType === 'savings' ? 'Savings Account Value' : 'Stock Market Value'}
            </p>
            <p className="text-2xl font-bold">{formatCurrency(result.opportunityCostValue)}</p>
            <p className={`text-sm ${opportunityCostImpact < 0 ? 'text-red-600' : 'text-green-600'}`}>
              {formatPercentage(opportunityCostImpact)}
            </p>
          </div>
        )}
      </div>
      
      <div className="mb-6">
        <p className="text-lg">{getMessage()}</p>
        {inflationImpact < 0 && getShockingComparisons()}
      </div>
      
      <div className="h-64">
        <Line options={chartOptions} data={chartData} />
      </div>
    </div>
  );
};

export default ResultsDisplay;
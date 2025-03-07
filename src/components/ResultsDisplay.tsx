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
  
  // Check if dark mode is active
  const isDarkMode = document.documentElement.classList.contains('dark');

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
  const realInvestmentImpact = investmentType !== 'none'
    ? ((result.combinedValue - amount) / amount) * 100
    : 0;

  // Prepare chart data
  const labels = result.yearlyBreakdown.map(item => item.year.toString());
  
  const chartData = {
    labels,
    datasets: [
      {
        label: 'Original Amount',
        data: result.yearlyBreakdown.map(item => item.nominal),
        borderColor: 'rgb(75, 85, 99)',
        backgroundColor: 'rgba(75, 85, 99, 0.5)',
      },
      {
        label: 'True Value (Inflation Impact)',
        data: result.yearlyBreakdown.map(item => item.inflationAdjusted),
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.5)',
      },
    ]
  };

  // Add opportunity cost data if an investment type was selected
  if (investmentType !== 'none') {
    chartData.datasets.push({
      label: investmentType === 'savings' ? 'With Savings Interest' : 'With Stock Returns',
      data: result.yearlyBreakdown.map(item => item.opportunityCost),
      borderColor: 'rgb(34, 197, 94)',
      backgroundColor: 'rgba(34, 197, 94, 0.5)',
    });
    
    chartData.datasets.push({
      label: 'Real Growth After Inflation',
      data: result.yearlyBreakdown.map(item => item.combined),
      borderColor: 'rgb(168, 85, 247)', // Purple color
      backgroundColor: 'rgba(168, 85, 247, 0.5)',
    });
  }

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: isDarkMode ? '#FFFFFF' : '#000000'
        }
      },
      title: {
        display: true,
        text: 'Value Over Time',
        color: isDarkMode ? '#FFFFFF' : '#000000'
      },
      tooltip: {
        backgroundColor: isDarkMode ? 'rgba(50, 50, 50, 0.8)' : 'rgba(255, 255, 255, 0.8)',
        titleColor: isDarkMode ? '#FFFFFF' : '#000000',
        bodyColor: isDarkMode ? '#FFFFFF' : '#000000',
        borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        borderWidth: 1
      }
    },
    scales: {
      x: {
        ticks: {
          color: isDarkMode ? '#CCCCCC' : '#666666'
        },
        grid: {
          color: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
        }
      },
      y: {
        ticks: {
          color: isDarkMode ? '#CCCCCC' : '#666666',
          callback: (value: number) => formatCurrency(value)
        },
        grid: {
          color: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
        }
      }
    }
  };

  // Message based on results with dark mode support
  const getMessage = () => {
    const messageClass = isDarkMode ? 'text-gray-200' : 'text-gray-800';
    
    if (investmentType === 'none') {
      return (
        <p className={`text-lg ${messageClass}`}>
          Due to inflation, your {formatCurrency(amount)} has lost 
          {formatPercentage(inflationImpact)} in purchasing power from {startYear} to {endYear}.
        </p>
      );
    } else {
      const investmentName = investmentType === 'savings' ? 'a savings account' : 'the stock market';
      return (
        <p className={`text-lg ${messageClass}`}>
          After applying {investmentName} returns and adjusting for inflation, 
          your real investment value is {formatCurrency(result.combinedValue)} 
          ({formatPercentage(realInvestmentImpact)}).
        </p>
      );
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
      <div className={`mt-4 p-4 ${isDarkMode ? 'bg-red-900/30' : 'bg-red-50'} rounded-lg`}>
        <h3 className={`font-bold text-lg mb-2 ${isDarkMode ? 'text-red-300' : 'text-red-800'}`}>
          What You've Lost:
        </h3>
        <ul className="space-y-2">
          <li className={isDarkMode ? 'text-red-200' : 'text-red-700'}>
            ☕ Equivalent to {Math.round(lostValue / coffeePrice)} premium coffees
          </li>
          <li className={isDarkMode ? 'text-red-200' : 'text-red-700'}>
            📱 That's {(lostValue / iphonePrice).toFixed(2)} new smartphones
          </li>
          <li className={isDarkMode ? 'text-red-200' : 'text-red-700'}>
            ⏱️ Represents {Math.round(lostValue / hourlyWage)} hours of work
          </li>
        </ul>
      </div>
    );
  };

  return (
    <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-md`}>
      <h2 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Results</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className={`${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'} p-4 rounded-lg`}>
          <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Original Amount</p>
          <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {formatCurrency(amount)}
          </p>
        </div>
        
        <div className={`${isDarkMode ? 'bg-red-900/30' : 'bg-red-100'} p-4 rounded-lg`}>
          <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            True Value Today
          </p>
          <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {formatCurrency(result.inflationAdjustedValue)}
          </p>
          <p className={`text-sm ${inflationImpact < 0 
            ? (isDarkMode ? 'text-red-300' : 'text-red-600') 
            : (isDarkMode ? 'text-green-300' : 'text-green-600')}`}
          >
            {formatPercentage(inflationImpact)}
          </p>
        </div>
        
        {investmentType !== 'none' && (
          <>
            <div className={`${isDarkMode ? 'bg-green-900/30' : 'bg-green-100'} p-4 rounded-lg`}>
              <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {investmentType === 'savings' ? 'If You Used Savings' : 'If You Invested in Stocks'}
              </p>
              <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {formatCurrency(result.opportunityCostValue)}
              </p>
              <p className={`text-sm ${opportunityCostImpact < 0 
                ? (isDarkMode ? 'text-red-300' : 'text-red-600') 
                : (isDarkMode ? 'text-green-300' : 'text-green-600')}`}
              >
                {formatPercentage(opportunityCostImpact)}
              </p>
            </div>
            
            <div className={`${isDarkMode ? 'bg-purple-900/30' : 'bg-purple-100'} p-4 rounded-lg`}>
              <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Actual Growth After Inflation
              </p>
              <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {formatCurrency(result.combinedValue)}
              </p>
              <p className={`text-sm ${(result.combinedValue - amount) < 0 
                ? (isDarkMode ? 'text-red-300' : 'text-red-600') 
                : (isDarkMode ? 'text-green-300' : 'text-green-600')}`}
              >
                {formatPercentage(((result.combinedValue - amount)/amount)*100)}
              </p>
            </div>
          </>
        )}
      </div>
      
      {/* Add Money Lost section when inflation has negative impact */}
      {inflationImpact < 0 && (
        <div className={`mt-4 mb-6 p-4 ${isDarkMode ? 'bg-red-900/30' : 'bg-red-50'} rounded-lg`}>
          <h3 className={`font-bold text-lg mb-2 ${isDarkMode ? 'text-red-300' : 'text-red-800'}`}>
            Money Lost to Inflation:
          </h3>
          <p className={`text-xl font-bold ${isDarkMode ? 'text-red-200' : 'text-red-700'}`}>
            {formatCurrency(Math.abs(amount - result.inflationAdjustedValue))}
          </p>
          <p className={isDarkMode ? 'text-red-200' : 'text-red-700'}>
            That's {formatPercentage(Math.abs(inflationImpact))} of your original investment gone.
          </p>
        </div>
      )}
      
      <div className="mb-6">
        {getMessage()}
        {inflationImpact < 0 && getShockingComparisons()}
      </div>
      
      <div className="h-64 mt-8">
        <Line options={chartOptions} data={chartData} />
      </div>
    </div>
  );
};

export default ResultsDisplay;
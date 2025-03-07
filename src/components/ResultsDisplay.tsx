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
import { TrendingDown, TrendingUp, DollarSign } from 'lucide-react';

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

  // Prepare inflation chart data
  const labels = result.yearlyBreakdown.map(item => item.year.toString());
  
  const inflationChartData = {
    labels,
    datasets: [
      {
        label: 'Original Amount',
        data: result.yearlyBreakdown.map(() => amount),
        borderColor: 'rgb(75, 85, 99)',
        backgroundColor: 'rgba(75, 85, 99, 0.5)',
        borderWidth: 2,
        borderDash: [5, 5],
      },
      {
        label: 'True Value (Inflation Impact)',
        data: result.yearlyBreakdown.map(item => item.inflationAdjusted),
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.5)',
        borderWidth: 3,
      },
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: isDarkMode ? '#FFFFFF' : '#000000',
          boxWidth: 15,
          padding: 15
        }
      },
      title: {
        display: false
      },
      tooltip: {
        backgroundColor: isDarkMode ? 'rgba(50, 50, 50, 0.8)' : 'rgba(255, 255, 255, 0.8)',
        titleColor: isDarkMode ? '#FFFFFF' : '#000000',
        bodyColor: isDarkMode ? '#FFFFFF' : '#000000',
        borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        borderWidth: 1,
        callbacks: {
          label: function(context) {
            return context.dataset.label + ': ' + formatCurrency(context.parsed.y);
          }
        }
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

  // Investment comparison chart data (only if investment type is not none)
  const investmentChartData = investmentType !== 'none' ? {
    labels,
    datasets: [
      {
        label: 'Original Amount',
        data: result.yearlyBreakdown.map(() => amount),
        borderColor: 'rgb(75, 85, 99)',
        backgroundColor: 'rgba(75, 85, 99, 0.5)',
        borderWidth: 2,
        borderDash: [5, 5],
      },
      {
        label: investmentType === 'savings' ? 'Savings Account Growth' : 'Stock Market Growth',
        data: result.yearlyBreakdown.map(item => item.opportunityCost),
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.5)',
        borderWidth: 3,
      },
      {
        label: 'True Growth After Inflation',
        data: result.yearlyBreakdown.map(item => item.combined),
        borderColor: 'rgb(168, 85, 247)',
        backgroundColor: 'rgba(168, 85, 247, 0.5)',
        borderWidth: 3,
      },
    ]
  } : null;

  return (
    <div className="space-y-8">
      <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Results</h2>
      
      {/* Section 1: Original Amount vs. True Value Today */}
      <div className={`p-6 rounded-lg ${isDarkMode ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
        <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
          Inflation Impact ({startYear} - {endYear})
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className={`p-5 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
            <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Original Amount ({startYear})
            </p>
            <p className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {formatCurrency(amount)}
            </p>
          </div>
          
          <div className={`p-5 rounded-lg ${inflationImpact < 0 
            ? (isDarkMode ? 'bg-red-900/40' : 'bg-red-100') 
            : (isDarkMode ? 'bg-green-900/40' : 'bg-green-100')
            } shadow-md`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  True Value Today ({endYear})
                </p>
                <p className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {formatCurrency(result.inflationAdjustedValue)}
                </p>
              </div>
              <div className={`p-3 rounded-full ${inflationImpact < 0 
                ? (isDarkMode ? 'bg-red-800/50' : 'bg-red-200') 
                : (isDarkMode ? 'bg-green-800/50' : 'bg-green-200')}`}>
                {inflationImpact < 0 
                  ? <TrendingDown size={24} className={isDarkMode ? 'text-red-300' : 'text-red-600'} /> 
                  : <TrendingUp size={24} className={isDarkMode ? 'text-green-300' : 'text-green-600'} />}
              </div>
            </div>
            <p className={`mt-2 text-sm font-medium ${inflationImpact < 0 
              ? (isDarkMode ? 'text-red-300' : 'text-red-600') 
              : (isDarkMode ? 'text-green-300' : 'text-green-600')}`}>
              {formatPercentage(inflationImpact)} change in purchasing power
            </p>
          </div>
        </div>
        
        {/* Loss breakdown */}
        {inflationImpact < 0 && (
          <div className={`p-4 mb-4 rounded-lg ${isDarkMode ? 'bg-red-900/30' : 'bg-red-50'}`}>
            <div className="flex items-center">
              <DollarSign className={isDarkMode ? 'text-red-300' : 'text-red-600'} size={20} />
              <h4 className={`ml-2 font-bold ${isDarkMode ? 'text-red-300' : 'text-red-800'}`}>
                Money Lost to Inflation: {formatCurrency(Math.abs(amount - result.inflationAdjustedValue))}
              </h4>
            </div>
            <p className={`mt-1 ${isDarkMode ? 'text-red-200' : 'text-red-700'}`}>
              That's equivalent to {Math.round((amount - result.inflationAdjustedValue) / (countryCode === 'US' ? 5 : 6))} premium coffees 
              or {Math.round((amount - result.inflationAdjustedValue) / (countryCode === 'US' ? 20 : 25))} hours of work.
            </p>
          </div>
        )}
        
        {/* Inflation chart */}
        <div className="h-60 mt-6">
          <Line options={chartOptions} data={inflationChartData} />
        </div>
      </div>
      
      {/* Section 2: Investment Impact (Only show if investment type is not none) */}
      {investmentType !== 'none' && (
        <div className={`p-6 rounded-lg ${isDarkMode ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
          <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
            {investmentType === 'savings' ? 'Savings Account' : 'Stock Market'} Performance
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className={`p-5 rounded-lg ${isDarkMode ? 'bg-green-900/40' : 'bg-green-100'} shadow-md`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {investmentType === 'savings' ? 'With Savings Interest' : 'With Stock Returns'}
                  </p>
                  <p className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {formatCurrency(result.opportunityCostValue)}
                  </p>
                </div>
                <div className={`p-3 rounded-full ${isDarkMode ? 'bg-green-800/50' : 'bg-green-200'}`}>
                  <TrendingUp size={24} className={isDarkMode ? 'text-green-300' : 'text-green-600'} />
                </div>
              </div>
              <p className={`mt-2 text-sm font-medium ${isDarkMode ? 'text-green-300' : 'text-green-600'}`}>
                {formatPercentage(opportunityCostImpact)} nominal growth
              </p>
            </div>
            
            <div className={`p-5 rounded-lg ${realInvestmentImpact < 0 
              ? (isDarkMode ? 'bg-red-900/40' : 'bg-red-100') 
              : (isDarkMode ? 'bg-purple-900/40' : 'bg-purple-100')
              } shadow-md`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Real Growth After Inflation
                  </p>
                  <p className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {formatCurrency(result.combinedValue)}
                  </p>
                </div>
                <div className={`p-3 rounded-full ${realInvestmentImpact < 0 
                  ? (isDarkMode ? 'bg-red-800/50' : 'bg-red-200') 
                  : (isDarkMode ? 'bg-purple-800/50' : 'bg-purple-200')}`}>
                  {realInvestmentImpact < 0 
                    ? <TrendingDown size={24} className={isDarkMode ? 'text-red-300' : 'text-red-600'} /> 
                    : <TrendingUp size={24} className={isDarkMode ? 'text-purple-300' : 'text-purple-600'} />}
                </div>
              </div>
              <p className={`mt-2 text-sm font-medium ${realInvestmentImpact < 0 
                ? (isDarkMode ? 'text-red-300' : 'text-red-600') 
                : (isDarkMode ? 'text-purple-300' : 'text-purple-600')}`}>
                {formatPercentage(realInvestmentImpact)} real growth
              </p>
            </div>
          </div>
          
          {/* Investment chart */}
          <div className="h-60 mt-6">
            <Line options={chartOptions} data={investmentChartData} />
          </div>
        </div>
      )}
      
      {/* Summary message */}
      <div className={`p-5 rounded-lg ${isDarkMode ? 'bg-blue-900/30' : 'bg-blue-50'} shadow-md text-center`}>
        <p className={`text-lg font-medium ${isDarkMode ? 'text-blue-200' : 'text-blue-800'}`}>
          {investmentType === 'none' 
            ? `Due to inflation, your ${formatCurrency(amount)} from ${startYear} has ${inflationImpact < 0 ? 'lost' : 'gained'} ${formatPercentage(Math.abs(inflationImpact))} in purchasing power.` 
            : `By investing in ${investmentType === 'savings' ? 'a savings account' : 'the stock market'}, your ${formatCurrency(amount)} from ${startYear} has ${realInvestmentImpact < 0 ? 'decreased' : 'increased'} to ${formatCurrency(result.combinedValue)} in real terms (${formatPercentage(realInvestmentImpact)}).`}
        </p>
      </div>
    </div>
  );
};

export default ResultsDisplay;
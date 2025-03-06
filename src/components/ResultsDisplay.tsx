'use client';

import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { DollarSign, TrendingDown, ShoppingBag, Coffee, Car } from 'lucide-react';
import useCalculatorStore from '@/store/calculatorStore';

const ResultsDisplay = () => {
  const { result, inputs } = useCalculatorStore();
  
  if (!result) return null;
  
  // Determine if we're in dark mode by checking the HTML class
  const isDarkMode = typeof document !== 'undefined' ? 
    document.documentElement.classList.contains('dark') : false;
  
  // Format currency with appropriate symbol based on country
  const formatCurrency = (value) => {
    const currencySymbols = {
      'USA': '$',
      'UK': '£',
      'EU': '€',
      'Japan': '¥',
      'China': '¥',
      // Add more countries as needed
    };
    
    const symbol = currencySymbols[inputs.country] || '$';
    return `${symbol}${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
  };
  
  // Format percentage with + or - sign
  const formatPercentage = (value) => {
    const sign = value >= 0 ? '+' : '';
    return `${sign}${value.toFixed(1)}%`;
  };
  
  // Prepare chart data
  const chartData = result.yearlyData.map(item => ({
    year: item.year,
    original: inputs.amount,
    inflationAdjusted: item.inflationAdjustedValue,
    invested: item.investedValue,
  }));
  
  // Calculate the "lost to inflation" amount
  const lostToInflation = inputs.amount - result.finalValues.inflationAdjustedValue;
  
  // Example equivalents for what the lost amount could buy
  const coffeePrice = 5; // Average price of a coffee
  const groceryPrice = 150; // Average weekly grocery cost
  const carPayment = 400; // Average monthly car payment
  
  return (
    <div className="space-y-8">
      <h2 className={`text-2xl font-bold mb-6 flex items-center ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
        <DollarSign className={`mr-2 ${isDarkMode ? 'text-blue-400' : 'text-blue-500'}`} size={24} />
        Results Analysis
      </h2>
      
      {/* Key metrics cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className={`p-5 rounded-xl shadow-md border ${isDarkMode ? 'bg-blue-900/20 border-blue-800' : 'bg-blue-50 border-blue-100'} transition-all duration-300 hover:shadow-lg`}>
          <p className={`text-sm font-medium mb-1 ${isDarkMode ? 'text-blue-300' : 'text-blue-700'}`}>Original Amount</p>
          <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {formatCurrency(inputs.amount)}
          </p>
          <p className={`text-xs mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Today's value
          </p>
        </div>
        
        <div className={`p-5 rounded-xl shadow-md border ${isDarkMode ? 'bg-red-900/20 border-red-800' : 'bg-red-50 border-red-100'} transition-all duration-300 hover:shadow-lg`}>
          <p className={`text-sm font-medium mb-1 ${isDarkMode ? 'text-red-300' : 'text-red-700'}`}>Future Buying Power</p>
          <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {formatCurrency(result.finalValues.inflationAdjustedValue)}
          </p>
          <p className={`text-xs mt-2 ${isDarkMode ? 'text-red-400' : 'text-red-500'}`}>
            {formatPercentage((result.finalValues.inflationAdjustedValue/inputs.amount - 1) * 100)} change
          </p>
        </div>
        
        <div className={`p-5 rounded-xl shadow-md border ${isDarkMode ? 'bg-green-900/20 border-green-800' : 'bg-green-50 border-green-100'} transition-all duration-300 hover:shadow-lg`}>
          <p className={`text-sm font-medium mb-1 ${isDarkMode ? 'text-green-300' : 'text-green-700'}`}>If Invested</p>
          <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {formatCurrency(result.finalValues.investedValue)}
          </p>
          <p className={`text-xs mt-2 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
            {formatPercentage((result.finalValues.investedValue/inputs.amount - 1) * 100)} growth
          </p>
        </div>
        
        <div className={`p-5 rounded-xl shadow-md border ${isDarkMode ? 'bg-purple-900/20 border-purple-800' : 'bg-purple-50 border-purple-100'} transition-all duration-300 hover:shadow-lg`}>
          <p className={`text-sm font-medium mb-1 ${isDarkMode ? 'text-purple-300' : 'text-purple-700'}`}>Investment Advantage</p>
          <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {formatCurrency(result.finalValues.investedValue - result.finalValues.inflationAdjustedValue)}
          </p>
          <p className={`text-xs mt-2 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`}>
            Compared to doing nothing
          </p>
        </div>
      </div>
      
      {/* What You've Lost Section */}
      <div className={`mt-8 p-6 rounded-xl shadow-md ${isDarkMode ? 'bg-gray-800/50 border border-gray-700' : 'bg-gray-50 border border-gray-200'}`}>
        <h3 className={`text-xl font-bold mb-4 flex items-center ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          <TrendingDown className={`mr-2 ${isDarkMode ? 'text-red-400' : 'text-red-500'}`} size={22} />
          What You've Lost to Inflation
        </h3>
        
        <p className={`mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          If you keep {formatCurrency(inputs.amount)} as cash for {inputs.years} years, 
          inflation will reduce its purchasing power by {formatCurrency(lostToInflation)}.
          Here's what that loss could buy today:
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div className={`flex items-center p-4 rounded-lg ${isDarkMode ? 'bg-gray-700/50' : 'bg-white'} shadow-sm transition-transform duration-300 hover:scale-105`}>
            <div className={`p-3 rounded-full mr-4 ${isDarkMode ? 'bg-amber-900/30 text-amber-300' : 'bg-amber-100 text-amber-600'}`}>
              <Coffee size={28} />
            </div>
            <div>
              <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {Math.floor(lostToInflation / coffeePrice).toLocaleString()}
              </p>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>cups of coffee</p>
            </div>
          </div>
          
          <div className={`flex items-center p-4 rounded-lg ${isDarkMode ? 'bg-gray-700/50' : 'bg-white'} shadow-sm transition-transform duration-300 hover:scale-105`}>
            <div className={`p-3 rounded-full mr-4 ${isDarkMode ? 'bg-green-900/30 text-green-300' : 'bg-green-100 text-green-600'}`}>
              <ShoppingBag size={28} />
            </div>
            <div>
              <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {Math.floor(lostToInflation / groceryPrice).toLocaleString()}
              </p>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>weeks of groceries</p>
            </div>
          </div>
          
          <div className={`flex items-center p-4 rounded-lg ${isDarkMode ? 'bg-gray-700/50' : 'bg-white'} shadow-sm transition-transform duration-300 hover:scale-105`}>
            <div className={`p-3 rounded-full mr-4 ${isDarkMode ? 'bg-blue-900/30 text-blue-300' : 'bg-blue-100 text-blue-600'}`}>
              <Car size={28} />
            </div>
            <div>
              <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {Math.floor(lostToInflation / carPayment).toLocaleString()}
              </p>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>monthly car payments</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Chart Section */}
      <div className={`mt-8 p-6 rounded-xl shadow-md ${isDarkMode ? 'bg-gray-800/50 border border-gray-700' : 'bg-white border border-gray-200'}`}>
        <h3 className={`text-xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Value Over Time
        </h3>
        
        <div className="h-80 mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? "#444" : "#eee"} />
              <XAxis 
                dataKey="year" 
                stroke={isDarkMode ? "#aaa" : "#666"}
                tick={{ fontSize: 12 }}
              />
              <YAxis
                tickFormatter={(value) => formatCurrency(value).split('.')[0]}
                stroke={isDarkMode ? "#aaa" : "#666"}
                tick={{ fontSize: 12 }}
              />
              <Tooltip 
                formatter={(value) => [formatCurrency(value), ""]}
                labelFormatter={(label) => `Year: ${label}`}
                contentStyle={{
                  backgroundColor: isDarkMode ? '#1f2937' : '#fff',
                  borderColor: isDarkMode ? '#374151' : '#e5e7eb',
                  color: isDarkMode ? '#fff' : '#000'
                }}
              />
              <Legend
                verticalAlign="bottom"
                height={36}
                iconType="circle"
                formatter={(value) => {
                  const labels = {
                    original: "Original Amount",
                    inflationAdjusted: "After Inflation",
                    invested: "If Invested"
                  };
                  return <span style={{ color: isDarkMode ? '#ddd' : '#666', fontSize: '14px' }}>{labels[value]}</span>;
                }}
              />
              <Line
                type="monotone"
                dataKey="original"
                name="original"
                stroke="#8884d8"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
                strokeDasharray="5 5"
              />
              <Line
                type="monotone"
                dataKey="inflationAdjusted"
                name="inflationAdjusted"
                stroke="#ff7782"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="invested"
                name="invested"
                stroke="#4ade80"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      {/* Extra tips section */}
      <div className={`mt-6 p-6 rounded-xl ${isDarkMode ? 'bg-blue-900/20 border border-blue-800' : 'bg-blue-50 border border-blue-100'}`}>
        <h3 className={`text-lg font-semibold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Expert Tip
        </h3>
        <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          {inputs.investmentType === 'stocks' ? 
            `While the stock market has historically outpaced inflation, remember that past performance doesn't guarantee future results. Consider diversifying your investments to manage risk.` :
            `${inputs.investmentType} can be a good way to preserve purchasing power, but consider diversifying across multiple asset classes for optimal long-term results.`
          }
        </p>
      </div>
    </div>
  );
};

export default ResultsDisplay;
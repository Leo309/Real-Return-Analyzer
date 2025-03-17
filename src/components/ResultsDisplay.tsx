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
  Legend,
  TooltipItem,
  type ChartOptions
} from 'chart.js';
import useCalculatorStore from '@/store/calculatorStore';
import { countries } from '@/data/countries';
import { TrendingDown, TrendingUp, DollarSign } from 'lucide-react';
import ShareCard from '@/components/ShareCard';
import type { ChartData } from 'chart.js';
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

  if (!result || amount === null) {
    return null;
  }
  const validAmount = amount;


  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: countryData.currency,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return value.toFixed(2) + '%'; // 移除自动添加的+号
  };

  // Calculate changes
  const inflationImpact = ((result.inflationAdjustedValue - validAmount) / validAmount) * 100;
  const opportunityCostImpact = investmentType !== 'none'
    ? ((result.opportunityCostValue - validAmount) / validAmount) * 100
    : 0;
  const realInvestmentImpact = investmentType !== 'none'
    ? ((result.combinedValue - validAmount) / validAmount) * 100
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

  const chartOptions: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: isDarkMode ? '#FFFFFF' : '#000000',
          boxWidth: 15,
          padding: 15
        }
      },
      title: { display: false },
      tooltip: {
        backgroundColor: isDarkMode ? 'rgba(50, 50, 50, 0.8)' : 'rgba(255, 255, 255, 0.8)',
        titleColor: isDarkMode ? '#FFFFFF' : '#000000',
        bodyColor: isDarkMode ? '#FFFFFF' : '#000000',
        borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        borderWidth: 1,
        callbacks: {
          label: (context: TooltipItem<"line">) => {
            return `${context.dataset.label}: ${formatCurrency(context.parsed.y)}`;
          }
        }
      }
    },
    scales: {
      x: {
        type: 'category',
        ticks: {
          color: isDarkMode ? '#CCCCCC' : '#666666'
        },
        grid: {
          color: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
        }
      },
      y: {
        type: 'linear',
        ticks: {
          color: isDarkMode ? '#CCCCCC' : '#666666',
          callback: (value: string | number) => {
            // 确保数值类型处理
            const numericValue = Number(value);
            return formatCurrency(numericValue);
          }
        },
        grid: {
          color: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
        }
      }
    }
  };



  // Investment comparison chart data (only if investment type is not none)
  const investmentChartData: ChartData<"line"> | undefined = investmentType !== 'none' ? {
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
        label: investmentType === 'savings'
          ? 'Savings Account Growth'
          : investmentType === 'custom'
            ? `Custom Investment (${useCalculatorStore.getState().customRate}%)`
            : 'Stock Market Growth',
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
  } : undefined;

  return (
    <div className="flex flex-col gap-6">
      <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-4`}>Results</h2>

      {/* Inflation Impact Section */}
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
              {`${inflationImpact >= 0 ? '+' : ''}${formatPercentage(inflationImpact)}`} change in purchasing power
            </p>
          </div>
        </div>

        {inflationImpact < 0 && (
          <div className={`p-4 mb-4 rounded-lg ${isDarkMode ? 'bg-red-900/30' : 'bg-red-50'}`}>
            <div className="flex items-center">
              <DollarSign className={isDarkMode ? 'text-red-300' : 'text-red-600'} size={20} />
              <h4 className={`ml-2 font-bold ${isDarkMode ? 'text-red-300' : 'text-red-800'}`}>
                Money Lost to Inflation: {formatCurrency(Math.abs(amount - result.inflationAdjustedValue))}
              </h4>
            </div>
            <p className={`mt-1 ${isDarkMode ? 'text-red-200' : 'text-red-700'}`}>
              That&apos;s equivalent to {Math.round((amount - result.inflationAdjustedValue) / (countryCode === 'US' ? 5 : 6))} premium coffees
              or {Math.round((amount - result.inflationAdjustedValue) / (countryCode === 'US' ? 20 : 25))} hours of work.
            </p>
          </div>
        )}

        <div className="h-60 mt-6">
          <Line options={chartOptions} data={inflationChartData} />
        </div>
        {investmentType === 'stockMarket' && (
          <p className={`text-xs mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} italic`}>
            * Historical returns based on {countryCode === 'US' ? 'S&P 500' : 'S&P/TSX'} index performance
          </p>
        )}

        {investmentType === 'none' && (
          <div className={`p-5 rounded-lg ${isDarkMode ? 'bg-blue-900/30' : 'bg-blue-50'} shadow-md text-center mt-6`}>
            <p className={`text-lg font-medium ${isDarkMode ? 'text-blue-200' : 'text-blue-800'}`}>
              {`Due to inflation, your ${formatCurrency(amount)} lost ${formatCurrency(amount - result.inflationAdjustedValue)} 
              purchasing power (${formatPercentage(inflationImpact)}) from ${startYear} to ${endYear}`}
            </p>
          </div>
        )}
      </div>

      {investmentType !== 'none' && (
        <div className={`p-6 rounded-lg ${isDarkMode ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
          <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
            {investmentType === 'custom'
              ? `Custom Investment (${useCalculatorStore.getState().customRate}%)`
              : investmentType === 'savings'
                ? 'Savings Account'
                : 'Stock Market'} Performance
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className={`p-5 rounded-lg ${isDarkMode ? 'bg-green-900/40' : 'bg-green-100'} shadow-md`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {investmentType === 'savings'
                      ? 'With Savings Interest'
                      : investmentType === 'custom'
                        ? `Custom Investment (${useCalculatorStore.getState().customRate}%)`
                        : 'With Stock Returns'}
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
                {`${opportunityCostImpact >= 0 ? '+' : ''}${formatPercentage(opportunityCostImpact)}`} nominal growth
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
              <p className={`mt-2 text-sm font-medium ${realInvestmentImpact >= 0
                ? (isDarkMode ? 'text-purple-300' : 'text-purple-600')
                : (isDarkMode ? 'text-red-300' : 'text-red-600')
                }`}>
                {`${realInvestmentImpact >= 0 ? '+' : ''}${formatPercentage(realInvestmentImpact)}`} real growth
              </p>
            </div>
          </div>

          {investmentType !== 'none' && investmentChartData && (
            <div className="h-60 mt-6">
              <Line options={chartOptions} data={investmentChartData} />
            </div>
          )}

          <div className={`p-5 rounded-lg ${isDarkMode ? 'bg-purple-900/30' : 'bg-purple-50'} shadow-md text-center mt-6`}>
            <p className={`text-lg font-medium ${isDarkMode ? 'text-purple-200' : 'text-purple-800'}`}>
              {investmentType === 'custom'
                ? `With ${useCalculatorStore.getState().customRate}% annual returns: ${formatCurrency(amount)} ➔ 
                  ${formatCurrency(result.combinedValue)} after inflation`
                : `By investing in ${investmentType === 'savings' ? 'a savings account' : 'the stock market'}: 
                  ${formatCurrency(amount)} ➔ ${formatCurrency(result.combinedValue)} 
                  (${`${realInvestmentImpact >= 0 ? '+' : ''}${formatPercentage(realInvestmentImpact)}`})`}
            </p>
          </div>
        </div>
      )}

      {/* Add Share Card component */}
      {result && (
        <div className="mt-4">
          <ShareCard />
        </div>
      )}
    </div>
  );
};

export default ResultsDisplay;
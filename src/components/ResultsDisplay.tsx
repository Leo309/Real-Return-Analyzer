'use client'; // Make sure we're using client-side rendering

import React, { useRef, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
// Use ChartJS types to avoid 'as' keyword syntax errors in some builds
import type { ChartData, ChartOptions, TooltipItem, Chart } from 'chart.js';
// Create a type alias instead of using 'as' keyword
type ChartType = Chart;

// Dynamically import Chart.js components with explicit SSR false flag and error handling
const Line = dynamic(
  () => import('react-chartjs-2')
    .then(mod => mod.Line)
    .catch(err => {
      console.error('Failed to load Line chart:', err);
      // Return a minimal placeholder component
      return () => <div className="h-full w-full flex items-center justify-center p-4 bg-gray-100 dark:bg-gray-800 rounded-lg"><p>Chart unavailable</p></div>;
    }),
  { ssr: false, loading: () => <div className="h-full w-full flex items-center justify-center p-4 bg-gray-100 dark:bg-gray-800 rounded-lg"><p>Loading chart...</p></div> }
);

import useCalculatorStore from '@/store/calculatorStore';
import { historicalData } from '@/data/historical';
import { TrendingDown, TrendingUp, DollarSign } from 'lucide-react';
import ShareCard from '@/components/ShareCard';
import { useTranslation } from '@/hooks/useTranslation';
import { getThemeColor, getValueColor } from '@/lib/themeColors';

// Improved gradient plugin for better SSR compatibility
const createGradientPlugin = (isDarkMode: boolean) => {
  return {
    id: 'customCanvasBackgroundColor',
    beforeDraw: (chart: ChartType) => {
      try {
        if (!chart || !chart.ctx) return;
        
        const { ctx, chartArea } = chart;
        if (!chartArea) return;
        
        const { top, bottom, left, right } = chartArea;
        const height = bottom - top;
        const width = right - left;
        
        if (height <= 0 || width <= 0) return;
        
        const gradient = ctx.createLinearGradient(0, top, 0, bottom);
        if (isDarkMode) {
          gradient.addColorStop(0, 'rgba(73, 145, 214, 0.1)'); // Lighter primary-blue with low opacity
          gradient.addColorStop(1, 'rgba(90, 130, 167, 0.02)'); // Lighter secondary-blue with very low opacity
        } else {
          gradient.addColorStop(0, 'rgba(46, 117, 182, 0.1)'); // primary-blue with low opacity
          gradient.addColorStop(1, 'rgba(169, 196, 226, 0.05)'); // secondary-blue with very low opacity
        }
        
        ctx.fillStyle = gradient;
        ctx.fillRect(left, top, width, height);
      } catch (err) {
        console.error('Chart plugin error:', err);
        // Use fallback solid color if gradient fails
        if (chart?.ctx) {
          chart.ctx.fillStyle = isDarkMode ? 'rgba(34, 197, 94, 0.05)' : 'rgba(34, 197, 94, 0.02)';
          try {
            const { top, bottom, left, right } = chart.chartArea || {};
            if (top !== undefined && bottom !== undefined && left !== undefined && right !== undefined) {
              chart.ctx.fillRect(left, top, right - left, bottom - top);
            }
          } catch (e) {
            // Silently fail
          }
        }
      }
    }
  };
};

/**
 * Result Summary Card Component
 * A reusable component for displaying result values with semantic color coding
 */
const ResultSummaryCard = ({ 
  title, 
  value, 
  percentage = 0, 
  isDarkMode,
  currencyFormatter,
  icon = null,
  className = ''
}) => {
  return (
    <div className={`p-5 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} ${className}`}>
      <div className="flex flex-col h-full justify-between">
        <div>
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            {title}
          </p>
          <p className={`text-2xl font-bold mt-2 mb-1 ${percentage !== 0 ? getValueColor(percentage, isDarkMode, 'text') : (isDarkMode ? 'text-white' : 'text-gray-900')}`}>
            {currencyFormatter(value)}
          </p>
          
          {percentage !== 0 && (
            <div className="flex items-center mt-1">
              {icon || (
                percentage < 0 
                  ? <TrendingDown size={16} className={getValueColor(percentage, isDarkMode, 'text')} /> 
                  : <TrendingUp size={16} className={getValueColor(percentage, isDarkMode, 'text')} />
              )}
              <p className={`text-sm font-medium ml-1 ${getValueColor(percentage, isDarkMode, 'text')}`}>
                {`${percentage >= 0 ? '+' : ''}${percentage.toFixed(2)}%`}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const ResultsDisplay: React.FC = () => {
  const { t } = useTranslation();
  const inflationChartRef = useRef<HTMLDivElement | null>(null);
  const investmentChartRef = useRef<HTMLDivElement | null>(null);
  const { result, amount, countryCode, startYear, endYear, investmentType, customRate } = useCalculatorStore();
  const countryData = historicalData[countryCode];
  
  // State for client-side rendering
  const [isMounted, setIsMounted] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [chartsLoaded, setChartsLoaded] = useState(false);
  const [chartError, setChartError] = useState(false);
  const [chartPluginsInitialized, setChartPluginsInitialized] = useState(false);
  
  // Important: Only run on client-side
  useEffect(() => {
    setIsMounted(true);
    setIsDarkMode(document.documentElement.classList.contains('dark'));
    
    // Listen for theme changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          setIsDarkMode(document.documentElement.classList.contains('dark'));
        }
      });
    });
    
    observer.observe(document.documentElement, { attributes: true });
    return () => observer.disconnect();
  }, []);
  
  // Initialize Chart.js only on client-side
  useEffect(() => {
    if (typeof window === 'undefined' || chartPluginsInitialized) return;
    
    const initChartJs = async () => {
      try {
        // Import Chart.js modules
        const chartImport = await import('chart.js');
        
        const { 
          Chart, 
          CategoryScale, 
          LinearScale, 
          PointElement, 
          LineElement, 
          Title, 
          Tooltip, 
          Legend, 
          Filler 
        } = chartImport;
        
        // Verify essential components are available
        if (!Chart || !CategoryScale || !LineElement) {
          throw new Error('Chart.js components missing');
        }
        
        Chart.register(
          CategoryScale,
          LinearScale,
          PointElement,
          LineElement,
          Title,
          Tooltip,
          Legend,
          Filler
        );
        
        // Set globally sensible defaults for Chart.js
        Chart.defaults.animation = false; // Disable animations for stability
        
        // Set additional safe defaults for production
        Chart.defaults.elements = Chart.defaults.elements || {};
        Chart.defaults.elements.line = Chart.defaults.elements.line || {};
        Chart.defaults.elements.line.tension = 0; // Use straight lines by default

        // Prevent control point errors in bezier curves more robustly
        try {
          // @ts-ignore - accessing Chart.js internals
          const elements = Chart.registry?.elements || {};
          const LineElement = elements.line || Chart.elements?.line || Chart.elements?.Line;
          
          if (LineElement?.prototype) {
            const originalUpdateControlPoints = LineElement.prototype.updateControlPoints;
            
            LineElement.prototype.updateControlPoints = function() {
              try {
                // Ensure 'this' has necessary properties before attempting calculation
                if (!this || this.cp1x === undefined || this.cp1y === undefined ||
                    this.cp2x === undefined || this.cp2y === undefined) {
                  // Initialize control points with safe defaults if undefined
                  this.cp1x = this.x;
                  this.cp1y = this.y;
                  this.cp2x = this.x;
                  this.cp2y = this.y;
                  return;
                }
                
                return originalUpdateControlPoints.apply(this, arguments);
              } catch (err) {
                console.warn('Safely handling control points calculation error:', err);
                // Set safe defaults for control points
                if (this) {
                  this.cp1x = this.x || 0;
                  this.cp1y = this.y || 0;
                  this.cp2x = this.x || 0;
                  this.cp2y = this.y || 0;
                }
                return;
              }
            };
          }
        } catch (err) {
          console.warn('Could not patch control points handling', err);
        }
        
        // Patch canvas if needed
        if (typeof HTMLCanvasElement !== 'undefined' && 
            typeof HTMLCanvasElement.prototype.getContext === 'function') {
          const originalGetContext = HTMLCanvasElement.prototype.getContext;
          
          HTMLCanvasElement.prototype.getContext = function(type, options) {
            const context = originalGetContext.call(this, type, options);
            if (type === '2d' && context) {
              // Ensure canvas has proper dimensions
              if (!this.style.width) this.style.width = '100%';
              if (!this.style.height) this.style.height = '100%';
            }
            return context;
          };
        }
        
        setChartPluginsInitialized(true);
        setChartsLoaded(true);
      } catch (error) {
        console.error('Failed to initialize Chart.js:', error);
        setChartError(true);
      }
    };
    
    initChartJs();
  }, [chartPluginsInitialized]);
  
  // Force a rerender when new results come in
  useEffect(() => {
    if (!isMounted || !result || !result.yearlyBreakdown?.length) return;
    
    // Reset states
    setChartError(false);
    
    // Longer delay to ensure DOM and Chart.js are fully ready
    const timer = setTimeout(() => {
      setChartsLoaded(true);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [result, isMounted]);
  
  // Handle chart errors
  useEffect(() => {
    if (!isMounted) return;
    
    const handleError = (event: ErrorEvent) => {
      if (event.message && 
          (event.message.includes('chart') || 
           event.message.includes('cp1x') || 
           event.message.includes('unexpected identifier'))) {
        setChartError(true);
        console.warn('Detected chart rendering error');
      }
    };
    
    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, [isMounted]);

  // Early return conditions
  if (!result || amount === null) {
    return null;
  }
  
  // Don't render on server
  if (!isMounted) {
    return <div className="animate-pulse h-96 w-full bg-gray-200 dark:bg-gray-700 rounded-lg"></div>;
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
    return value.toFixed(2) + '%';
  };

  // Calculate changes
  const inflationImpact = ((result.inflationAdjustedValue - validAmount) / validAmount) * 100;
  const opportunityCostImpact = investmentType !== 'none'
    ? ((result.opportunityCostValue - validAmount) / validAmount) * 100
    : 0;
  const realInvestmentImpact = investmentType !== 'none'
    ? ((result.combinedValue - validAmount) / validAmount) * 100
    : 0;

  // Prepare inflation chart data - with null checking
  const filteredBreakdown = result.yearlyBreakdown.filter(item => 
    item && typeof item.inflationAdjusted === 'number' && !isNaN(item.inflationAdjusted));
  
  const labels = filteredBreakdown.map(item => item.year.toString());

  // This additional function explicitly ensures all data points are valid numbers
  const validateDataPoints = (data) => {
    if (!Array.isArray(data)) return [];
    
    // Create a new array with guaranteed valid points
    const validData = [];
    
    for (let i = 0; i < data.length; i++) {
      const value = data[i];
      if (value !== undefined && value !== null && typeof value === 'number' && !isNaN(value)) {
        // Create a complete point object with all required properties
        validData.push(value);
      } else {
        // Fill in gaps with null to maintain array indexing
        // Chart.js handles null better than undefined
        validData.push(null);
      }
    }
    
    return validData;
  };
  
  // Apply validation to chart data
  const inflationChartData = {
    labels,
    datasets: [
      {
        label: t('calculator.originalAmount'),
        data: validateDataPoints(filteredBreakdown.map(() => amount)),
        borderColor: isDarkMode ? '#9F9F9F' : '#555555',
        backgroundColor: 'transparent',
        borderWidth: 2.5,
        borderDash: [6, 4],
        tension: 0 // Use straight lines for stability
      },
      {
        label: t('calculator.trueValueToday'),
        data: validateDataPoints(filteredBreakdown.map(item => item.inflationAdjusted)),
        borderColor: isDarkMode ? '#60A5FA' : '#2563EB', // Use theme colors
        backgroundColor: isDarkMode ? 'rgba(96, 165, 250, 0.5)' : 'rgba(37, 99, 235, 0.65)',
        borderWidth: 3,
        fill: true,
        tension: 0, // Use straight lines for stability
        pointRadius: 0,
        pointHoverRadius: 7,
      },
    ]
  };

  const chartOptions: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: {
        left: 10,
        right: 10,
        top: 20,
        bottom: 10
      }
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: isDarkMode ? '#FFFFFF' : '#000000',
          boxWidth: 15,
          padding: 15,
          font: {
            family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            size: 12
          }
        }
      },
      title: { display: false },
      tooltip: {
        backgroundColor: isDarkMode ? 'rgba(30, 41, 59, 0.9)' : 'rgba(255, 255, 255, 0.95)',
        titleColor: isDarkMode ? '#FFFFFF' : '#595959',
        bodyColor: isDarkMode ? '#FFFFFF' : '#595959',
        borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
        borderWidth: 1,
        padding: 14,
        cornerRadius: 8,
        boxPadding: 8,
        usePointStyle: true,
        titleFont: {
          family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          size: 13,
          weight: 'bold'
        },
        bodyFont: {
          family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          size: 13
        },
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
          autoSkip: true,
          maxRotation: 0,
          maxTicksLimit: 8,
          color: isDarkMode ? '#BBBBBB' : '#333333',
          font: {
            family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            size: 11,
            weight: '600'
          },
          padding: 8
        },
        grid: {
          color: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(170, 170, 170, 0.7)',
          tickLength: 8,
          lineWidth: 0.7
        },
        border: {
          display: false
        }
      },
      y: {
        type: 'linear',
        beginAtZero: false,
        ticks: {
          color: isDarkMode ? '#BBBBBB' : '#333333',
          callback: (value: string | number) => {
            return formatCurrency(Number(value));
          },
          font: {
            family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            size: 11,
            weight: '600'
          },
          padding: 8
        },
        grid: {
          color: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(170, 170, 170, 0.7)',
          tickLength: 8,
          lineWidth: 0.7
        },
        border: {
          display: false
        }
      }
    },
    interaction: {
      mode: 'index',
      intersect: false,
    },
    animations: {
      tension: false
    },
    elements: {
      point: {
        radius: 0,
        hoverRadius: 6,
      }
    }
  };

  // Get the current country's stock market name
  const getStockMarketName = () => {
    switch (countryCode) {
      case 'US': return 'S&P 500';
      case 'CA': return 'S&P/TSX';
      case 'UK': return 'FTSE 100';
      case 'DE': return 'DAX';
      case 'JP': return 'Nikkei 225';
      case 'CN': return 'Shanghai Composite';
      case 'AU': return 'S&P/ASX 200';
      default: return countryData?.metadata?.stockMarketBenchmark || 'Stock Market';
    }
  };

  // Get investment type name
  const getInvestmentTypeName = () => {
    switch (investmentType) {
      case 'cash': return t('investmentTypes.cash.name');
      case 'bonds': return t('investmentTypes.bonds.name');
      case 'stocks': return t('investmentTypes.stocks.name');
      case 'realEstate': return t('investmentTypes.realEstate.name');
      case 'custom': return `${t('investmentTypes.custom.name')} (${customRate}%)`;
      default: return t('investmentTypes.none.name');
    }
  };

  // Investment comparison chart data with improved validation
  const investmentChartData: ChartData<"line"> | undefined = investmentType !== 'none' ? {
    labels,
    datasets: [
      {
        label: t('calculator.originalAmount'),
        data: validateDataPoints(filteredBreakdown.map(() => amount)),
        borderColor: isDarkMode ? '#9F9F9F' : '#7F7F7F',
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderDash: [5, 5],
        tension: 0,
      },
      {
        label: getInvestmentTypeName(),
        data: validateDataPoints(filteredBreakdown.map(item => item.opportunityCost)),
        borderColor: isDarkMode ? '#60A5FA' : '#2563EB',
        backgroundColor: 'transparent',
        borderWidth: 3.5,
        fill: false,
        tension: 0,
        pointRadius: 0,
        pointHoverRadius: 7,
      },
      {
        label: t('calculator.realGrowthAfterInflation'),
        data: validateDataPoints(filteredBreakdown.map(item => item.combined)),
        borderColor: isDarkMode ? '#9F9F9F' : '#555555',
        backgroundColor: isDarkMode ? 'rgba(96, 165, 250, 0.2)' : 'rgba(37, 99, 235, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0,
        pointRadius: 0,
        pointHoverRadius: 7,
      },
    ]
  } : undefined;

  // Create plugin instance
  const gradientPlugin = createGradientPlugin(isDarkMode);

  return (
    <div className="flex flex-col gap-6 max-w-full overflow-hidden">
      <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-4`}>Results</h2>

      {/* Summary Cards - Using the semantic color approach */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Original Amount Card */}
        <ResultSummaryCard
          title={`${t('calculator.originalAmount')} (${startYear})`}
          value={amount}
          percentage={0}
          isDarkMode={isDarkMode}
          currencyFormatter={formatCurrency}
        />
        
        {/* True Value Today Card */}
        <ResultSummaryCard
          title={`${t('calculator.trueValueToday')} (${endYear})`}
          value={result.inflationAdjustedValue}
          percentage={inflationImpact}
          isDarkMode={isDarkMode}
          currencyFormatter={formatCurrency}
        />
        
        {/* Real Growth After Inflation Card */}
        {investmentType !== 'none' ? (
          <ResultSummaryCard
            title={t('calculator.realGrowthAfterInflation')}
            value={result.combinedValue}
            percentage={realInvestmentImpact}
            isDarkMode={isDarkMode}
            currencyFormatter={formatCurrency}
          />
        ) : (
          <div></div> // Empty div for grid alignment when no investment is selected
        )}
      </div>

      {/* Inflation Impact Section */}
      <div className={`p-6 rounded-lg shadow-sm ${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`}>
        <h3 className={`text-xl font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
          {t('calculator.inflationImpact')} ({startYear} - {endYear})
        </h3>

        {inflationImpact < 0 && (
          <div className={`p-4 mb-4 rounded-lg ${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`}>
            <div className="flex items-center">
              <div className={`p-2 rounded-full ${isDarkMode ? 'bg-red-900/30 text-red-400' : 'bg-red-50 text-red-600'}`}>
                <DollarSign size={20} />
              </div>
              <h4 className={`ml-2 font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                {t('calculator.moneyLostToInflation')}: {formatCurrency(Math.abs(amount - result.inflationAdjustedValue))}
              </h4>
            </div>
            <p className={`mt-2 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              That&apos;s equivalent to {Math.round((amount - result.inflationAdjustedValue) / (countryCode === 'US' ? 5 : 6))} premium coffees
              or {Math.round((amount - result.inflationAdjustedValue) / (countryCode === 'US' ? 20 : 25))} hours of work.
            </p>
          </div>
        )}

        <div className="h-72 mt-6 relative w-full overflow-hidden" ref={inflationChartRef}>
          {/* Try to render chart first if conditions are good */}
          {isMounted && chartPluginsInitialized && !chartError && (
            <div className="relative h-full w-full" style={{ minHeight: '288px' }}>
              <Line 
                options={{...chartOptions, responsive: true, maintainAspectRatio: false}} 
                data={inflationChartData} 
                plugins={[gradientPlugin]}
                key={`inflation-chart-${isDarkMode}`} // Force rerender on theme change
              />
            </div>
          )}
          
          {/* Fallback when charts fail to load */}
          {chartError && (
            <div className="absolute inset-0 flex items-center justify-center bg-opacity-90 bg-white dark:bg-gray-800 dark:bg-opacity-90 rounded-lg border dark:border-gray-700 border-gray-200">
              <div className={`text-center p-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                <p className="font-medium mb-2">Investment Value Over Time</p>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between border-b dark:border-gray-700 border-gray-200 pb-2">
                    <span>Starting value ({startYear}):</span>
                    <span className="font-bold">{formatCurrency(amount)}</span>
                  </div>
                  <div className="flex items-center justify-between border-b dark:border-gray-700 border-gray-200 pb-2">
                    <span>Ending value ({endYear}):</span>
                    <span className={`font-bold ${inflationImpact < 0 ? 'text-red-500' : 'text-green-500'}`}>
                      {formatCurrency(result.inflationAdjustedValue)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <span>Percent change:</span>
                    <span className={`font-bold ${inflationImpact < 0 ? 'text-red-500' : 'text-green-500'}`}>
                      {formatPercentage(inflationImpact)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {investmentType === 'stocks' && (
          <p className={`text-xs mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} italic`}>
            * Historical returns based on {getStockMarketName()} index performance
          </p>
        )}

        {investmentType === 'none' && (
          <div className={`p-5 rounded-lg shadow-sm text-center mt-6 border ${
            isDarkMode 
              ? 'bg-gray-700 border-gray-600 text-gray-300' 
              : 'bg-gray-50 border-gray-200 text-gray-700'
          }`}>
            <p className={`text-lg font-medium`}>
              {`Due to inflation, your ${formatCurrency(amount)} ${inflationImpact < 0 ? 'lost' : 'gained'} ${formatCurrency(Math.abs(amount - result.inflationAdjustedValue))} 
              purchasing power (${formatPercentage(inflationImpact)}) from ${startYear} to ${endYear}`}
            </p>
          </div>
        )}
      </div>

      {investmentType !== 'none' && (
        <div className={`p-6 rounded-lg shadow-sm ${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`}>
          <h3 className={`text-xl font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
          {getInvestmentTypeName()} {t('calculator.investmentPerformance')}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className={`p-5 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} shadow-sm border ${isDarkMode ? 'border-gray-600' : 'border-gray-200'}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {t('calculator.withInvestmentReturns')}
                  </p>
                  <p className={`text-2xl font-bold ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                    {formatCurrency(result.opportunityCostValue)}
                  </p>
                  <p className={`mt-1 text-sm font-medium ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                    {`${opportunityCostImpact >= 0 ? '+' : ''}${formatPercentage(opportunityCostImpact)}`} {t('calculator.nominalGrowth')}
                  </p>
                </div>
                <div className={`p-3 rounded-full ${isDarkMode ? 'bg-blue-900/50' : 'bg-blue-100'}`}>
                  <TrendingUp size={24} className={isDarkMode ? 'text-blue-400' : 'text-blue-600'} />
                </div>
              </div>
            </div>

            <div className={`p-5 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} shadow-sm border ${isDarkMode ? 'border-gray-600' : 'border-gray-200'}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {t('calculator.realGrowthAfterInflation')}
                  </p>
                  <p className={`text-2xl font-bold ${getValueColor(realInvestmentImpact, isDarkMode, 'text')}`}>
                    {formatCurrency(result.combinedValue)}
                  </p>
                  <p className={`mt-1 text-sm font-medium ${getValueColor(realInvestmentImpact, isDarkMode, 'text')}`}>
                    {`${realInvestmentImpact >= 0 ? '+' : ''}${formatPercentage(realInvestmentImpact)}`} {t('calculator.realGrowth')}
                  </p>
                </div>
                <div className={`p-3 rounded-full ${
                  realInvestmentImpact < 0
                    ? (isDarkMode ? 'bg-red-900/50' : 'bg-red-100')
                    : (isDarkMode ? 'bg-blue-900/50' : 'bg-blue-100')
                }`}>
                  {realInvestmentImpact < 0
                    ? <TrendingDown size={24} className={isDarkMode ? 'text-red-400' : 'text-red-600'} />
                    : <TrendingUp size={24} className={isDarkMode ? 'text-blue-400' : 'text-blue-600'} />}
                </div>
              </div>
            </div>
          </div>

          {investmentChartData && (
            <div className="h-72 mt-6 relative w-full overflow-hidden" ref={investmentChartRef}>
              {/* Try to render chart first if conditions are good */}
              {isMounted && chartPluginsInitialized && !chartError && (
                <div className="relative h-full w-full" style={{ minHeight: '288px' }}>
                  <Line 
                    options={{...chartOptions, responsive: true, maintainAspectRatio: false}} 
                    data={investmentChartData} 
                    plugins={[gradientPlugin]}
                    key={`investment-chart-${isDarkMode}`} // Force rerender on theme change
                  />
                </div>
              )}
              
              {/* Fallback when charts fail to load */}
              {chartError && (
                <div className="absolute inset-0 flex items-center justify-center bg-opacity-90 bg-white dark:bg-gray-800 dark:bg-opacity-90 rounded-lg border dark:border-gray-700 border-gray-200">
                  <div className={`text-center p-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    <p className="font-medium mb-2">{getInvestmentTypeName()} Performance</p>
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center justify-between border-b dark:border-gray-700 border-gray-200 pb-2">
                        <span>Initial amount ({startYear}):</span>
                        <span className="font-bold">{formatCurrency(amount)}</span>
                      </div>
                      <div className="flex items-center justify-between border-b dark:border-gray-700 border-gray-200 pb-2">
                        <span>Investment return:</span>
                        <span className="font-bold text-green-500">
                          {formatCurrency(result.opportunityCostValue)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between border-b dark:border-gray-700 border-gray-200 pb-2">
                        <span>After inflation ({endYear}):</span>
                        <span className={`font-bold ${realInvestmentImpact < 0 ? 'text-red-500' : 'text-purple-500'}`}>
                          {formatCurrency(result.combinedValue)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between pt-1">
                        <span>Real growth:</span>
                        <span className={`font-bold ${realInvestmentImpact < 0 ? 'text-red-500' : 'text-purple-500'}`}>
                          {formatPercentage(realInvestmentImpact)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className={`p-5 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} shadow-sm text-center mt-6 border ${isDarkMode ? 'border-gray-600' : 'border-gray-200'}`}>
            <p className={`text-lg font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              {investmentType === 'custom'
                ? `With ${customRate}% annual returns: ${formatCurrency(amount)} ➔ 
                  ${formatCurrency(result.combinedValue)} after inflation`
                : `By investing in ${getInvestmentTypeName()}: 
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
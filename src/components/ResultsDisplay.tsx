'use client'; // Add this line at the top

// Extend Window interface to avoid using 'any'
declare global {
  interface Window {
    _canvasGetContextPatched?: boolean;
    _originalGetContext?: typeof HTMLCanvasElement.prototype.getContext;
  }
}

import React, { useRef, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import type { ChartData, ChartOptions, TooltipItem, Chart as ChartType } from 'chart.js';

// Dynamic import for Chart.js and Line component
const Line = dynamic(
  () => import('react-chartjs-2').then(mod => mod.Line),
  { ssr: false, loading: () => <div className="h-full w-full flex items-center justify-center p-4 bg-gray-100 dark:bg-gray-800 rounded-lg"><p>Loading chart...</p></div> }
);
import useCalculatorStore from '@/store/calculatorStore';
import { historicalData } from '@/data/historical';
import { TrendingDown, TrendingUp, DollarSign } from 'lucide-react';
import ShareCard from '@/components/ShareCard';
import { useTranslation } from '@/hooks/useTranslation';

// Create gradient plugin function that's more compatible with server-side rendering
const createGradientPlugin = (container: HTMLDivElement | null, isDarkMode: boolean) => {
  return {
    id: 'customCanvasBackgroundColor',
    beforeDraw: (chart: ChartType) => {
      try {
        const canvas = chart.canvas;
        if (!canvas || !chart.ctx) {
          return;
        }
        
        const ctx = chart.ctx;
        // Make sure all dimensions are available
        if (typeof chart.height !== 'number' || typeof chart.width !== 'number' || chart.width <= 0 || chart.height <= 0) {
          return;
        }
        
        // Create gradient safely
        try {
          const gradient = ctx.createLinearGradient(0, 0, 0, chart.height);
          if (isDarkMode) {
            gradient.addColorStop(0, 'rgba(34, 197, 94, 0.1)');  // Green at top
            gradient.addColorStop(1, 'rgba(59, 130, 246, 0.02)'); // Blue at bottom
          } else {
            gradient.addColorStop(0, 'rgba(34, 197, 94, 0.1)');  // Green at top
            gradient.addColorStop(1, 'rgba(59, 130, 246, 0.05)'); // Blue at bottom
          }
          ctx.fillStyle = gradient;
          ctx.fillRect(0, 0, chart.width, chart.height);
        } catch (err) {
          console.error('Error creating gradient:', err);
          // Use a solid color as fallback
          ctx.fillStyle = isDarkMode ? 'rgba(34, 197, 94, 0.05)' : 'rgba(34, 197, 94, 0.02)';
          ctx.fillRect(0, 0, chart.width, chart.height);
        }
      } catch (err) {
        console.error('Chart plugin error:', err);
        // Silent error - just continue if there's an error
      }
    }
  };
};

const ResultsDisplay: React.FC = () => {
  const { t } = useTranslation();
  const inflationChartRef = useRef<HTMLDivElement | null>(null);
  const investmentChartRef = useRef<HTMLDivElement | null>(null);
  const { result, amount, countryCode, startYear, endYear, investmentType, customRate } = useCalculatorStore();
  const countryData = historicalData[countryCode];
  
  // Move dark mode check to state with useEffect
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [chartsLoaded, setChartsLoaded] = useState(false);
  const [chartError, setChartError] = useState(false);
  
  // Check dark mode on client side only
  useEffect(() => {
    setIsDarkMode(document.documentElement.classList.contains('dark'));
    
    // Optional: Add listener for theme changes
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
  
  // Create gradient plugin with current state
  const [gradientPlugin, setGradientPlugin] = useState<{
    id: string;
    beforeDraw: (chart: ChartType) => void;
  } | null>(null);
  
  useEffect(() => {
    // Delay plugin creation to ensure DOM is ready
    const timer = setTimeout(() => {
      if (inflationChartRef.current) {
        setGradientPlugin(createGradientPlugin(inflationChartRef.current, isDarkMode));
      }
    }, 100);
    
    return () => clearTimeout(timer);
  }, [isDarkMode]);
  
  // Initialize Chart.js on client-side only
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Fix for potential canvas rendering issues in some browsers/environments
      const originalGetContext = HTMLCanvasElement.prototype.getContext;
      // Add _canvasGetContextPatched property to Window interface
      if (!window._canvasGetContextPatched && originalGetContext) {
        window._canvasGetContextPatched = true;
        window._originalGetContext = originalGetContext;
        HTMLCanvasElement.prototype.getContext = function(type, options) {
          const context = originalGetContext.call(this, type, options) as CanvasRenderingContext2D | null;
          if (type === '2d' && context) {
            // Ensure the canvas has valid dimensions
            if (!this.style.width) this.style.width = '100%';
            if (!this.style.height) this.style.height = '100%';
          }
          return context;
        };
      }

      // Load and register Chart.js components
      const initChart = async () => {
        try {
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
          } = await import('chart.js');
          
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

          // Set a global default animation duration that's more compatible
          Chart.defaults.animation.duration = 800;
          
          // Flag charts as initialized
          setChartsLoaded(true);
        } catch (error) {
          console.error('Failed to initialize Chart.js:', error);
          setChartError(true);
        }
      };
      
      initChart();
    }
    
    // Cleanup function to restore original getContext if needed
    return () => {
      if (typeof window !== 'undefined' && window._canvasGetContextPatched && window._originalGetContext) {
        HTMLCanvasElement.prototype.getContext = window._originalGetContext;
        window._canvasGetContextPatched = false;
      }
    };
  }, []);
  
  // Add additional effect to ensure charts render properly after the component mounts
  useEffect(() => {
    if (typeof window !== 'undefined' && result) {
      // Reset chart states on new results
      setChartsLoaded(false);
      setChartError(false);
      
      // Force a small delay to ensure DOM is fully ready
      const timer = setTimeout(() => {
        // Force a re-render by updating state
        setIsDarkMode(prev => {
          // This triggers a re-render without changing the actual value
          setTimeout(() => {
            setIsDarkMode(prev);
            // Mark charts as attempted to load after a delay
            setTimeout(() => setChartsLoaded(true), 1000);
          }, 0);
          return prev;
        });
      }, 200);
      
      return () => clearTimeout(timer);
    }
  }, [result]);
  
  // Handle chart load errors
  useEffect(() => {
    const handleError = () => {
      setChartError(true);
    };
    
    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

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

  // Prepare inflation chart data
  const labels = result.yearlyBreakdown.map(item => item.year.toString());

  const inflationChartData = {
    labels,
    datasets: [
      {
        label: t('calculator.originalAmount'),
        data: result.yearlyBreakdown.map(() => amount),
        borderColor: isDarkMode ? 'rgb(100, 116, 139)' : 'rgb(75, 85, 99)',
        backgroundColor: isDarkMode ? 'rgba(100, 116, 139, 0.5)' : 'rgba(75, 85, 99, 0.5)',
        borderWidth: 2,
        borderDash: [5, 5],
        tension: 0.4,
      },
      {
        label: t('calculator.trueValueToday'),
        data: result.yearlyBreakdown.map(item => item.inflationAdjusted),
        borderColor: isDarkMode ? 'rgb(248, 113, 113)' : 'rgb(239, 68, 68)',
        backgroundColor: isDarkMode ? 'rgba(248, 113, 113, 0.5)' : 'rgba(239, 68, 68, 0.5)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
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
        backgroundColor: isDarkMode ? 'rgba(50, 50, 50, 0.8)' : 'rgba(255, 255, 255, 0.9)',
        titleColor: isDarkMode ? '#FFFFFF' : '#000000',
        bodyColor: isDarkMode ? '#FFFFFF' : '#000000',
        borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
        boxPadding: 6,
        usePointStyle: true,
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
          color: isDarkMode ? '#CCCCCC' : '#666666',
          font: {
            family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            size: 11
          }
        },
        grid: {
          color: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'
        },
        border: {
          display: false
        }
      },
      y: {
        type: 'linear',
        beginAtZero: false,
        ticks: {
          color: isDarkMode ? '#CCCCCC' : '#666666',
          callback: (value: string | number) => {
            // Ensure numeric value handling
            const numericValue = Number(value);
            return formatCurrency(numericValue);
          },
          font: {
            family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            size: 11
          }
        },
        grid: {
          color: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'
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
      tension: {
        duration: 1000,
        easing: 'easeInOutCubic',
        from: 0.8,
        to: 0.4,
        loop: false
      }
    },
    elements: {
      point: {
        radius: 0, // Hide points normally
        hoverRadius: 6, // Show on hover
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

  // Investment comparison chart data (only if investment type is not none)
  const investmentChartData: ChartData<"line"> | undefined = investmentType !== 'none' ? {
    labels,
    datasets: [
      {
        label: t('calculator.originalAmount'),
        data: result.yearlyBreakdown.map(() => amount),
        borderColor: isDarkMode ? 'rgb(100, 116, 139)' : 'rgb(75, 85, 99)',
        backgroundColor: isDarkMode ? 'rgba(100, 116, 139, 0.5)' : 'rgba(75, 85, 99, 0.5)',
        borderWidth: 2,
        borderDash: [5, 5],
        tension: 0.4,
      },
      {
        label: getInvestmentTypeName(),
        data: result.yearlyBreakdown.map(item => item.opportunityCost),
        borderColor: isDarkMode ? 'rgb(74, 222, 128)' : 'rgb(34, 197, 94)',
        backgroundColor: isDarkMode ? 'rgba(74, 222, 128, 0.5)' : 'rgba(34, 197, 94, 0.5)',
        borderWidth: 3,
        fill: false,
        tension: 0.4,
      },
      {
        label: t('calculator.realGrowthAfterInflation'),
        data: result.yearlyBreakdown.map(item => item.combined),
        borderColor: isDarkMode ? 'rgb(192, 132, 252)' : 'rgb(168, 85, 247)',
        backgroundColor: isDarkMode ? 'rgba(192, 132, 252, 0.5)' : 'rgba(168, 85, 247, 0.5)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
      },
    ]
  } : undefined;

  return (
    <div className="flex flex-col gap-6 max-w-full overflow-hidden">
      <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-4`}>Results</h2>

      {/* Enhanced Animation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className={`p-5 rounded-lg ${isDarkMode ? 'bg-gray-700/70' : 'bg-white'} shadow-lg transform transition-all duration-500 hover:shadow-xl hover:-translate-y-1`}>
          <div className="flex flex-col h-full justify-between">
            <div>
              <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {t('calculator.originalAmount')} ({startYear})
              </p>
              <p className={`text-3xl font-bold mt-2 mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {formatCurrency(amount)}
              </p>
            </div>
            <div className={`mt-3 h-1 w-full rounded-full overflow-hidden ${isDarkMode ? 'bg-gray-600' : 'bg-gray-200'}`}>
              <div className={`h-full rounded-full ${isDarkMode ? 'bg-blue-500' : 'bg-blue-600'}`} style={{ width: '100%' }}></div>
            </div>
          </div>
        </div>

        <div className={`p-5 rounded-lg ${inflationImpact < 0
          ? (isDarkMode ? 'bg-red-900/30' : 'bg-red-50')
          : (isDarkMode ? 'bg-green-900/30' : 'bg-green-50')
          } shadow-lg transform transition-all duration-500 hover:shadow-xl hover:-translate-y-1`}>
          <div className="flex flex-col h-full justify-between">
            <div>
              <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {t('calculator.trueValueToday')} ({endYear})
              </p>
              <p className={`text-3xl font-bold mt-2 mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {formatCurrency(result.inflationAdjustedValue)}
              </p>
              <p className={`text-sm font-medium ${inflationImpact < 0
                ? (isDarkMode ? 'text-red-300' : 'text-red-600')
                : (isDarkMode ? 'text-green-300' : 'text-green-600')}`}>
                {`${inflationImpact >= 0 ? '+' : ''}${formatPercentage(inflationImpact)}`} {t('calculator.changeInPurchasingPower')}
              </p>
            </div>
            <div className={`mt-3 h-1 w-full rounded-full overflow-hidden ${isDarkMode ? 'bg-gray-600' : 'bg-gray-200'}`}>
              <div 
                className={`h-full rounded-full ${
                  inflationImpact < 0
                    ? (isDarkMode ? 'bg-red-500' : 'bg-red-600')
                    : (isDarkMode ? 'bg-green-500' : 'bg-green-600')
                }`} 
                style={{ width: `${Math.min(100, Math.max(0, (result.inflationAdjustedValue / amount) * 100))}%` }}
              ></div>
            </div>
          </div>
        </div>

        {investmentType !== 'none' ? (
          <div className={`p-5 rounded-lg ${realInvestmentImpact < 0
            ? (isDarkMode ? 'bg-red-900/30' : 'bg-red-50')
            : (isDarkMode ? 'bg-purple-900/30' : 'bg-purple-50')
            } shadow-lg transform transition-all duration-500 hover:shadow-xl hover:-translate-y-1`}>
            <div className="flex flex-col h-full justify-between">
              <div>
                <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {t('calculator.realGrowthAfterInflation')}
                </p>
                <p className={`text-3xl font-bold mt-2 mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {formatCurrency(result.combinedValue)}
                </p>
                <p className={`text-sm font-medium ${realInvestmentImpact >= 0
                  ? (isDarkMode ? 'text-purple-300' : 'text-purple-600')
                  : (isDarkMode ? 'text-red-300' : 'text-red-600')
                  }`}>
                  {`${realInvestmentImpact >= 0 ? '+' : ''}${formatPercentage(realInvestmentImpact)}`} {t('calculator.realGrowth')}
                </p>
              </div>
              <div className={`mt-3 h-1 w-full rounded-full overflow-hidden ${isDarkMode ? 'bg-gray-600' : 'bg-gray-200'}`}>
                <div 
                  className={`h-full rounded-full ${
                    realInvestmentImpact < 0
                      ? (isDarkMode ? 'bg-red-500' : 'bg-red-600')
                      : (isDarkMode ? 'bg-purple-500' : 'bg-purple-600')
                  }`} 
                  style={{ 
                    width: `${Math.min(100, Math.max(0, (result.combinedValue / amount) * 100))}%` 
                  }}
                ></div>
              </div>
            </div>
          </div>
        ) : (
          <div></div> // Empty div for grid alignment when no investment is selected
        )}
      </div>

      {/* Inflation Impact Section */}
      <div className={`p-6 rounded-lg ${isDarkMode ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
        <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
          {t('calculator.inflationImpact')} ({startYear} - {endYear})
        </h3>

        {inflationImpact < 0 && (
          <div className={`p-4 mb-4 rounded-lg ${isDarkMode ? 'bg-red-900/30' : 'bg-red-50'}`}>
            <div className="flex items-center">
              <DollarSign className={isDarkMode ? 'text-red-300' : 'text-red-600'} size={20} />
              <h4 className={`ml-2 font-bold ${isDarkMode ? 'text-red-300' : 'text-red-800'}`}>
                {t('calculator.moneyLostToInflation')}: {formatCurrency(Math.abs(amount - result.inflationAdjustedValue))}
              </h4>
            </div>
            <p className={`mt-1 ${isDarkMode ? 'text-red-200' : 'text-red-700'}`}>
              That&apos;s equivalent to {Math.round((amount - result.inflationAdjustedValue) / (countryCode === 'US' ? 5 : 6))} premium coffees
              or {Math.round((amount - result.inflationAdjustedValue) / (countryCode === 'US' ? 20 : 25))} hours of work.
            </p>
          </div>
        )}

        <div className="h-72 mt-6 relative w-full overflow-hidden" ref={inflationChartRef}>
          {typeof window !== 'undefined' && (
            <>
              {!chartError && (
                <Line 
                  options={chartOptions} 
                  data={inflationChartData} 
                  plugins={gradientPlugin ? [gradientPlugin] : undefined}
                />
              )}
              
              {/* Fallback when charts fail to load */}
              {(chartError || (chartsLoaded && !inflationChartRef.current?.querySelector('canvas'))) && (
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
            </>
          )}
        </div>

        {investmentType === 'stocks' && (
          <p className={`text-xs mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} italic`}>
            * Historical returns based on {getStockMarketName()} index performance
          </p>
        )}

        {investmentType === 'none' && (
          <div className={`p-5 rounded-lg ${isDarkMode ? 'bg-blue-900/30' : 'bg-blue-50'} shadow-md text-center mt-6`}>
            <p className={`text-lg font-medium ${isDarkMode ? 'text-blue-200' : 'text-blue-800'}`}>
              {`Due to inflation, your ${formatCurrency(amount)} ${inflationImpact < 0 ? 'lost' : 'gained'} ${formatCurrency(Math.abs(amount - result.inflationAdjustedValue))} 
              purchasing power (${formatPercentage(inflationImpact)}) from ${startYear} to ${endYear}`}
            </p>
          </div>
        )}
      </div>

      {investmentType !== 'none' && (
        <div className={`p-6 rounded-lg ${isDarkMode ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
          <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
            {getInvestmentTypeName()} {t('calculator.investmentPerformance')}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className={`p-5 rounded-lg ${isDarkMode ? 'bg-green-900/40' : 'bg-green-100'} shadow-md`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {t('calculator.withInvestmentReturns')}
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
                {`${opportunityCostImpact >= 0 ? '+' : ''}${formatPercentage(opportunityCostImpact)}`} {t('calculator.nominalGrowth')}
              </p>
            </div>

            <div className={`p-5 rounded-lg ${realInvestmentImpact < 0
              ? (isDarkMode ? 'bg-red-900/40' : 'bg-red-100')
              : (isDarkMode ? 'bg-purple-900/40' : 'bg-purple-100')
              } shadow-md`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {t('calculator.realGrowthAfterInflation')}
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
                {`${realInvestmentImpact >= 0 ? '+' : ''}${formatPercentage(realInvestmentImpact)}`} {t('calculator.realGrowth')}
              </p>
            </div>
          </div>

          {investmentChartData && (
            <div className="h-72 mt-6 relative w-full overflow-hidden" ref={investmentChartRef}>
              {typeof window !== 'undefined' && (
                <>
                  {!chartError && (
                    <Line 
                      options={chartOptions} 
                      data={investmentChartData} 
                      plugins={gradientPlugin ? [gradientPlugin] : undefined}
                    />
                  )}
                  
                  {/* Fallback when charts fail to load */}
                  {(chartError || (chartsLoaded && !investmentChartRef.current?.querySelector('canvas'))) && (
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
                </>
              )}
            </div>
          )}

          <div className={`p-5 rounded-lg ${isDarkMode ? 'bg-purple-900/30' : 'bg-purple-50'} shadow-md text-center mt-6`}>
            <p className={`text-lg font-medium ${isDarkMode ? 'text-purple-200' : 'text-purple-800'}`}>
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
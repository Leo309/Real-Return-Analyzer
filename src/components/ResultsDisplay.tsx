'use client'; // Make sure we're using client-side rendering

import React, { useRef, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
// Use ChartJS types to avoid 'as' keyword syntax errors in some builds
import type { ChartData, ChartOptions, TooltipItem, Chart } from 'chart.js';
// Create a type alias instead of using 'as' keyword
type ChartType = Chart;

// Constants for chart stability
const CHART_LOAD_TIMEOUT = 10000; // 10 seconds timeout for chart loading
const CHART_RETRY_ATTEMPTS = 3; // Number of retries for chart initialization

// Import chart patches to fix rendering issues
import { applyAllPatchesWithRetry } from '@/lib/chart-patches';

// Dynamically import Chart.js components with enhanced error handling and retry logic
const Line = dynamic(
  () => {
    let attempts = 0;
    const loadChart = () => {
      attempts++;
      return import('react-chartjs-2')
        .then(mod => mod.Line)
        .catch(err => {
          console.error(`Failed to load Line chart (attempt ${attempts}/${CHART_RETRY_ATTEMPTS}):`, err);
          if (attempts < CHART_RETRY_ATTEMPTS) {
            console.log(`Retrying chart load, attempt ${attempts + 1}...`);
            return loadChart();
          }
          // Return a functional placeholder component when all retries fail
          return () => <div className="h-full w-full flex items-center justify-center p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <div className="text-center">
              <p className="mb-2 font-medium">Chart unavailable</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Please refresh the page to try again</p>
            </div>
          </div>;
        });
    };
    return loadChart();
  },
  { 
    ssr: false, 
    loading: () => <div className="h-full w-full flex items-center justify-center p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
      <div className="flex flex-col items-center">
        <div className="w-10 h-10 border-4 border-gray-300 dark:border-gray-600 border-t-blue-500 dark:border-t-blue-400 rounded-full animate-spin mb-2"></div>
        <p>Loading chart...</p>
      </div>
    </div> 
  }
);

import useCalculatorStore from '@/store/calculatorStore';
import { historicalData } from '@/data/historical';
import { TrendingDown, TrendingUp, DollarSign } from 'lucide-react';
import ShareCard from '@/components/ShareCard';
import { useTranslation } from '@/hooks/useTranslation';

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
          gradient.addColorStop(0, 'rgba(34, 197, 94, 0.1)');
          gradient.addColorStop(1, 'rgba(59, 130, 246, 0.02)');
        } else {
          gradient.addColorStop(0, 'rgba(34, 197, 94, 0.1)');
          gradient.addColorStop(1, 'rgba(59, 130, 246, 0.05)');
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
  const [shouldUseTextFallback, setShouldUseTextFallback] = useState(false);
  
  // Important: Only run on client-side
  useEffect(() => {
    setIsMounted(true);
    setIsDarkMode(document.documentElement.classList.contains('dark'));
    
    // Disable the automatic fallback to text mode
    // We want to show charts whenever possible
    setShouldUseTextFallback(false);
    
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
  
  // Initialize Chart.js only on client-side with enhanced reliability
  useEffect(() => {
    if (typeof window === 'undefined' || chartPluginsInitialized) return;
    
    let retryCount = 0;
    const maxRetries = 3;
    
    const initChartJs = async () => {
      try {
        // Apply all our custom patches with enhanced retry mechanism
        const patchResult = await applyAllPatchesWithRetry();
        
        if (!patchResult) {
          console.warn('Chart patches could not be applied properly, proceeding anyway');
        }
        
        // Set a timeout to catch potential loading issues
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Chart.js initialization timed out')), CHART_LOAD_TIMEOUT);
        });
        
        // Race the import against the timeout
        const chartImport = await Promise.race([
          import('chart.js'),
          timeoutPromise
        ]);
        
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
        
        // Use try-catch for registration to prevent silent failures
        try {
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
        } catch (regError) {
          console.error('Failed to register Chart.js components:', regError);
          throw regError; // Rethrow to trigger retry logic
        }
        
        // Add global Chart.js defaults for better stability
        Chart.defaults.font.family = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
        Chart.defaults.responsive = true;
        Chart.defaults.maintainAspectRatio = false;
        
        // Disable animations by default for better stability
        Chart.defaults.animations = false;
        Chart.defaults.transitions = {
          active: {
            animation: {
              duration: 0
            }
          }
        };
        
        setChartPluginsInitialized(true);
        setChartsLoaded(true);
        setChartError(false); // Reset error state on success
      } catch (error) {
        console.error(`Failed to initialize Chart.js (attempt ${retryCount + 1}/${maxRetries}):`, error);
        
        // Implement retry logic
        if (retryCount < maxRetries - 1) {
          retryCount++;
          console.log(`Retrying Chart.js initialization, attempt ${retryCount + 1}...`);
          // Add increasing delay between retries
          setTimeout(initChartJs, 1000 * retryCount);
          return;
        }
        
        setChartError(true);
        setShouldUseTextFallback(true);
        console.warn('All Chart.js initialization attempts failed, using fallback');
      }
    };
    
    initChartJs();
    
    // Cleanup function
    return () => {
      retryCount = maxRetries; // Stop any pending retries
    };
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
        setShouldUseTextFallback(true);
        console.warn('Detected chart rendering error, using text fallback');
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
        borderColor: isDarkMode ? 'rgb(100, 116, 139)' : 'rgb(75, 85, 99)',
        backgroundColor: isDarkMode ? 'rgba(100, 116, 139, 0.5)' : 'rgba(75, 85, 99, 0.5)',
        borderWidth: 2,
        borderDash: [5, 5],
        tension: 0, // Use straight lines for stability
      },
      {
        label: t('calculator.trueValueToday'),
        data: validateDataPoints(filteredBreakdown.map(item => item.inflationAdjusted)),
        borderColor: isDarkMode ? 'rgb(248, 113, 113)' : 'rgb(239, 68, 68)',
        backgroundColor: isDarkMode ? 'rgba(248, 113, 113, 0.5)' : 'rgba(239, 68, 68, 0.5)',
        borderWidth: 3,
        fill: true,
        tension: 0, // Use straight lines for stability
      },
    ]
  };

  const chartOptions: ChartOptions<"line"> = {
    // Disable bezier curves in production to prevent control point errors
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
            return formatCurrency(Number(value));
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
      // Disable animations that could cause issues with control points
      tension: false
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

  // Investment comparison chart data with improved validation
  const investmentChartData: ChartData<"line"> | undefined = investmentType !== 'none' ? {
    labels,
    datasets: [
      {
        label: t('calculator.originalAmount'),
        data: validateDataPoints(filteredBreakdown.map(() => amount)),
        borderColor: isDarkMode ? 'rgb(100, 116, 139)' : 'rgb(75, 85, 99)',
        backgroundColor: isDarkMode ? 'rgba(100, 116, 139, 0.5)' : 'rgba(75, 85, 99, 0.5)',
        borderWidth: 2,
        borderDash: [5, 5],
        tension: 0, // Use straight lines for stability
      },
      {
        label: getInvestmentTypeName(),
        data: validateDataPoints(filteredBreakdown.map(item => item.opportunityCost)),
        borderColor: isDarkMode ? 'rgb(74, 222, 128)' : 'rgb(34, 197, 94)',
        backgroundColor: isDarkMode ? 'rgba(74, 222, 128, 0.5)' : 'rgba(34, 197, 94, 0.5)',
        borderWidth: 3,
        fill: false,
        tension: 0, // Use straight lines for stability
      },
      {
        label: t('calculator.realGrowthAfterInflation'),
        data: validateDataPoints(filteredBreakdown.map(item => item.combined)),
        borderColor: isDarkMode ? 'rgb(192, 132, 252)' : 'rgb(168, 85, 247)',
        backgroundColor: isDarkMode ? 'rgba(192, 132, 252, 0.5)' : 'rgba(168, 85, 247, 0.5)',
        borderWidth: 3,
        fill: true,
        tension: 0, // Use straight lines for stability
      },
    ]
  } : undefined;

  // Create plugin instance
  const gradientPlugin = createGradientPlugin(isDarkMode);

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

        <div className="h-auto mt-6 relative w-full overflow-hidden" ref={inflationChartRef}>
          {/* Container for both chart and data */}
          <div className="grid grid-cols-1 gap-4 items-start">
            {/* Chart Container with fixed height */}
            <div className="min-h-[300px] relative w-full rounded-lg p-2 bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700">
              {isMounted ? (
                  chartPluginsInitialized && !chartError && !shouldUseTextFallback ? (
                <div className="absolute inset-0 p-4 overflow-hidden">
                  <div className="w-full h-full" style={{ position: 'relative', minHeight: '300px' }}>
                    <Line 
                      options={{
                        ...chartOptions, 
                        responsive: true, 
                        maintainAspectRatio: false,
                        devicePixelRatio: 2, // Higher resolution rendering
                      }} 
                      data={inflationChartData} 
                      plugins={[gradientPlugin]}
                      key={`inflation-chart-${isDarkMode}`} // Force rerender on theme change
                    />
                  </div>
                </div>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="animate-pulse flex flex-col items-center">
                    <div className="rounded-md bg-gray-200 dark:bg-gray-700 h-8 w-44 mb-2.5"></div>
                    <div className="rounded-md bg-gray-200 dark:bg-gray-700 h-4 w-32 mb-2.5"></div>
                    <div className="rounded-md bg-gray-200 dark:bg-gray-700 h-4 w-40"></div>
                  </div>
                </div>
              )}
            </div>
            

          </div>
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
            <div className="h-auto mt-6 relative w-full overflow-hidden" ref={investmentChartRef}>
              {/* Container for both chart and data */}
              <div className="grid grid-cols-1 gap-4 items-start">
                {/* Chart Container with fixed height */}
                <div className="min-h-[300px] relative w-full rounded-lg p-2 bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700">
                  {isMounted ? (
                  chartPluginsInitialized && !chartError && !shouldUseTextFallback ? (
                    <div className="absolute inset-0 p-4 overflow-hidden">
                      <div className="w-full h-full" style={{ position: 'relative', minHeight: '300px' }}>
                        <Line 
                          options={{
                            ...chartOptions, 
                            responsive: true, 
                            maintainAspectRatio: false,
                            devicePixelRatio: 2, // Higher resolution rendering
                          }} 
                          data={investmentChartData} 
                          plugins={[gradientPlugin]}
                          key={`investment-chart-${isDarkMode}`} // Force rerender on theme change
                        />
                      </div>
                    </div>
                  ) : (
                    // Enhanced fallback for chart loading issues
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="animate-pulse flex flex-col items-center">
                        <div className="rounded-md bg-gray-200 dark:bg-gray-700 h-8 w-44 mb-2.5"></div>
                        <div className="rounded-md bg-gray-200 dark:bg-gray-700 h-4 w-32 mb-2.5"></div>
                        <div className="rounded-md bg-gray-200 dark:bg-gray-700 h-4 w-40"></div>
                      </div>
                    </div>
                  )}
                </div>
                

              </div>
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
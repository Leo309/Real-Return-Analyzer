export interface CountryData {
    name: string;
    code: string;
    currency: string;
    symbol: string;
    inflationRates: Record<number, number>;
    stockMarketReturns: Record<number, number>;
    savingsRates: Record<number, number>;
  }
  
  export const countries: Record<string, CountryData> = {
    US: {
      name: "United States",
      code: "US",
      currency: "USD",
      symbol: "$",
      inflationRates: {
        // Historical annual inflation rates (%) U.S. Bureau of Labor Statistics
        2000:3.4,
        2001:1.6,
        2002:2.4,
        2003:1.9,
        2004:3.3,
        2005:3.4,
        2006:2.5, 
        2007:4.1,
        2008:0.1,
        2009:2.7,
        2010:1.5,
        2011:3.0,
        2012:1.7,
        2013:1.5,
        2014:0.8,
        2015: 0.7,
        2016: 2.1,
        2017: 2.1,
        2018: 1.9,
        2019: 2.3,
        2020: 1.4,
        2021: 7.0,
        2022: 6.5,
        2023: 3.4,
        2024: 2.9
      },
      stockMarketReturns: {
        // S&P 500 annual returns (%)
        2000:-9.1,
        2001:-11.9,
        2002:-22.1,
        2003:28.7,
        2004:10.9,
        2005:4.9,
        2006:15.8,
        2007:5.5,
        2008:-37.0,
        2009:26.5,
        2010:15.1,
        2011:2.1,
        2012:16.0,
        2013:32.4,
        2014:13.7,
        2015: 1.38,
        2016: 11.96,
        2017: 21.83,
        2018: -4.38,
        2019: 31.49,
        2020: 18.40,
        2021: 28.71,
        2022: -18.11,
        2023: 26.29,
        2024: 25.02
      },
      savingsRates: {
        // Average high-yield savings account rates (%)  need to verify the data
        2000: 6.00,
        2001: 4.50,
        2002: 2.50,
        2003: 1.00,
        2004: 1.00,
        2005: 3.00,
        2006: 4.00,
        2007: 5.00,
        2008: 3.00,
        2009: 0.10,
        2010: 0.50,
        2011: 0.30,
        2012: 0.20,
        2013: 0.10,
        2014: 0.10,  
        2015: 0.60,
        2016: 0.55,
        2017: 0.60,
        2018: 0.95,
        2019: 1.70,
        2020: 0.50,
        2021: 0.40,
        2022: 1.90,
        2023: 4.50,
        2024: 4.75
      }
    },
    CA: {
      name: "Canada",
      code: "CA",
      currency: "CAD",
      symbol: "$",
      inflationRates: {
        // Historical annual inflation rates (%)
        2000:2.7,
        2001:2.5, 
        2002:2.3,
        2003:2.8,
        2004:1.9, 
        2005:2.2,
        2006:2.0,
        2007:2.1,
        2008:2.4,
        2009:0.3,
        2010:1.8,
        2011:2.9, 
        2012:1.5,
        2013:0.9,
        2014:1.9,
        2015: 1.1,
        2016: 1.4,
        2017: 1.6,
        2018: 2.3,
        2019: 1.9,
        2020: 0.7,
        2021: 4.8,
        2022: 6.8,
        2023: 3.9,
        2024: 2.9
      },
      stockMarketReturns: {
        // S&P/TSX Composite annual returns (%) need to verfiy the data
        2000: -11.7,
        2001: -13.9,
        2002: -14.0, 
        2003: 24.2,
        2004: 14.5,
        2005: 21.9,
        2006: 14.5,
        2007: 7.2,
        2008: -35.0,
        2009: 30.7,
        2010: 14.5,
        2011: -11.1,
        2012: 4.0,
        2013: 9.6,
        2014: 7.4,
        2015: -8.32,
        2016: 17.51,
        2017: 6.03,
        2018: -8.89,
        2019: 19.13,
        2020: 5.60,
        2021: 21.74,
        2022: -5.84,
        2023: 8.12,
        2024: 10.70
      },
      savingsRates: {
        // Average high-yield savings account rates (%) need to verify the data
        2000: 2.50,
        2001: 2.40,
        2002: 2.30,
        2003: 2.80,
        2004: 1.90,
        2005: 2.20,
        2006: 2.00,
        2007: 2.10,
        2008: 2.40,
        2009: 0.30,
        2010: 1.80,
        2011: 2.90,
        2012: 1.50,
        2013: 0.90,
        2014: 1.90, 
        2015: 0.80,
        2016: 0.75,
        2017: 0.80,
        2018: 1.10,
        2019: 1.80,
        2020: 0.60,
        2021: 0.50,
        2022: 2.20,
        2023: 4.10,
        2024: 4.40
      }
    }
  };
  
  export const getAvailableYears = (): number[] => {
    // Get available years from US data (assuming both countries have the same years)
    return Object.keys(countries.US.inflationRates).map(year => parseInt(year));
  };
  
  export const getCurrentYear = (): number => {
    return new Date().getFullYear();
  };
  
  export const getEarliestYear = (): number => {
    return Math.min(...getAvailableYears());
  };
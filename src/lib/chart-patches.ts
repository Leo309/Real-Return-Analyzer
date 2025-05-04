/**
 * Chart.js Patches to Fix Production Rendering Issues
 * 
 * This file contains patches for Chart.js to prevent common rendering issues
 * in production environments, especially on Vercel deployments.
 * 
 * Enhanced for improved stability in cloud environments like Vercel
 * with additional safeguards for rendering and error recovery.
 */

// Make sure this only runs on the client side
const isBrowser = typeof window !== 'undefined';

/**
 * Patches Chart.js to prevent control point rendering issues
 * that commonly cause "Cannot set properties of undefined (setting 'cp1x')" errors
 */
export async function applyChartJsPatches() {
  if (!isBrowser) return;
  
  try {
    // Import Chart.js only on client side
    const { Chart } = await import('chart.js');
    
    // Save the original Line element
    let LineElementClass;
    
    // Try different approaches to find the Line element class
    if (Chart.registry?.elements?.line) {
      LineElementClass = Chart.registry.elements.line;
    } else if (Chart.elements?.Line) {
      LineElementClass = Chart.elements.Line;
    } else if (Chart.elements?.line) {
      LineElementClass = Chart.elements.line;
    }
    
    if (LineElementClass?.prototype) {
      // First, save a reference to the original updateControlPoints method
      const originalUpdateControlPoints = LineElementClass.prototype.updateControlPoints;
      
      // Patch the updateControlPoints method with a safer version
      LineElementClass.prototype.updateControlPoints = function() {
        try {
          // Check if this object has the required properties
          if (!this || 
              typeof this.x === 'undefined' || 
              typeof this.y === 'undefined') {
            // Missing essential properties, set safe defaults
            this.cp1x = 0;
            this.cp1y = 0;
            this.cp2x = 0;
            this.cp2y = 0;
            return;
          }
          
          // Initialize control points if they're undefined
          if (this.cp1x === undefined) this.cp1x = this.x;
          if (this.cp1y === undefined) this.cp1y = this.y;
          if (this.cp2x === undefined) this.cp2x = this.x;
          if (this.cp2y === undefined) this.cp2y = this.y;
          
          // Try to run the original method
          return originalUpdateControlPoints.apply(this, arguments);
        } catch (err) {
          console.warn('Chart.js control points calculation error safely handled');
          // Gracefully handle errors by setting safe default values
          this.cp1x = this.x || 0;
          this.cp1y = this.y || 0;
          this.cp2x = this.x || 0;
          this.cp2y = this.y || 0;
          return;
        }
      };
      
      // Also patch draw method for extra safety
      const originalDraw = LineElementClass.prototype.draw;
      LineElementClass.prototype.draw = function(ctx) {
        try {
          if (!ctx || !this) return;
          
          // Ensure required points exist before drawing
          if (this.cp1x === undefined || this.cp1y === undefined ||
              this.cp2x === undefined || this.cp2y === undefined) {
            // Set defaults based on available properties
            this.updateControlPoints();
          }
          
          // Call original draw method
          return originalDraw.apply(this, arguments);
        } catch (err) {
          console.warn('Chart.js draw error safely handled', err);
          // Try a simpler draw approach if the original fails
          try {
            if (ctx && this.x !== undefined && this.y !== undefined) {
              // Draw a simple point instead
              ctx.beginPath();
              ctx.arc(this.x, this.y, 3, 0, 2 * Math.PI);
              ctx.fillStyle = this.options?.backgroundColor || 'rgba(0, 0, 0, 0.1)';
              ctx.fill();
            }
          } catch (e) {
            // Silent fail if even the fallback fails
          }
        }
      };
    }
    
    // Set safer global defaults
    Chart.defaults = Chart.defaults || {};
    Chart.defaults.animation = {
      duration: 400, // Lower animation duration
      easing: 'linear' // Simpler easing function
    };
    
    Chart.defaults.elements = Chart.defaults.elements || {};
    Chart.defaults.elements.line = Chart.defaults.elements.line || {};
    Chart.defaults.elements.line.tension = 0; // Use straight lines instead of curves
    
    console.log('Chart.js patches successfully applied');
    return true;
  } catch (err) {
    console.error('Failed to apply Chart.js patches:', err);
    return false;
  }
}

/**
 * Patch Canvas to ensure it has proper dimensions and context
 */
export function patchCanvas() {
  if (!isBrowser) return;
  
  try {
    if (typeof HTMLCanvasElement !== 'undefined' && 
        typeof HTMLCanvasElement.prototype.getContext === 'function') {
      const originalGetContext = HTMLCanvasElement.prototype.getContext;
      
      HTMLCanvasElement.prototype.getContext = function(type, options) {
        const context = originalGetContext.call(this, type, options);
        
        if (type === '2d' && context) {
          // Ensure canvas has proper dimensions
          if (!this.style.width) this.style.width = '100%';
          if (!this.style.height) this.style.height = '100%';
          
          // Make sure canvas is visible
          this.style.display = 'block';
        }
        
        return context;
      };
    }
    
    return true;
  } catch (err) {
    console.error('Failed to patch Canvas:', err);
    return false;
  }
}

/**
 * Apply all patches at once
 */
export async function applyAllPatches() {
  if (!isBrowser) return;
  
  try {
    // First patch Canvas
    patchCanvas();
    
    // Then patch Chart.js
    await applyChartJsPatches();
    
    return true;
  } catch (err) {
    console.error('Failed to apply patches:', err);
    return false;
  }
}

/**
 * Detect and fix issues with window.devicePixelRatio
 * This can cause rendering issues on some devices and in some browsers
 */
export function fixDevicePixelRatio() {
  if (!isBrowser) return;
  
  try {
    // Make sure devicePixelRatio is defined
    if (typeof window.devicePixelRatio === 'undefined') {
      Object.defineProperty(window, 'devicePixelRatio', {
        configurable: true,
        get: function() { return 1; }
      });
    }
    
    // Cap devicePixelRatio to a reasonable value to prevent rendering issues
    if (window.devicePixelRatio > 3) {
      const originalRatio = window.devicePixelRatio;
      Object.defineProperty(window, 'devicePixelRatio', {
        configurable: true,
        get: function() { return Math.min(originalRatio, 3); }
      });
    }
    
    return true;
  } catch (err) {
    console.error('Failed to fix devicePixelRatio:', err);
    return false;
  }
}

/**
 * Apply a complete set of patches for maximum reliability
 * This is the recommended method to call from components
 */
export async function applyAllPatchesWithRetry(maxRetries = 3) {
  if (!isBrowser) return;
  
  let attempts = 0;
  
  const attemptPatches = async () => {
    attempts++;
    try {
      // Apply patches in sequence
      fixDevicePixelRatio();
      patchCanvas();
      await applyChartJsPatches();
      
      console.log(`Chart.js patches successfully applied (attempt ${attempts})`);
      return true;
    } catch (err) {
      console.error(`Failed to apply patches (attempt ${attempts}/${maxRetries}):`, err);
      
      if (attempts < maxRetries) {
        console.log(`Retrying in ${attempts * 500}ms...`);
        return new Promise(resolve => {
          setTimeout(() => {
            resolve(attemptPatches());
          }, attempts * 500);
        });
      }
      
      console.warn('All patch attempts failed, charts may have rendering issues');
      return false;
    }
  };
  
  return attemptPatches();
}

// Auto-patch if enabled via environment variable
if (isBrowser && (process.env.NEXT_PUBLIC_ENABLE_CHARTS === 'true' || process.env.NODE_ENV === 'production')) {
  applyAllPatchesWithRetry().then(success => {
    if (success) {
      console.log('Chart.js patches automatically applied');
    }
  });
}

#!/usr/bin/env node

/**
 * WebPageTest Comparison Script
 * Compares web performance between craftycto.com/blog and cto4.ai
 * Uses WebPageTest's free API
 */

import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const PAGES_TO_TEST = [
  {
    name: 'Homepage/Blog Listing',
    old: 'https://craftycto.com/blog',
    new: 'https://cto4.ai'
  },
  {
    name: 'GPT-4 Code Interpreter Article',
    old: 'https://craftycto.com/blog/gpt4-code-interpreter-big-deal-pt1',
    new: 'https://cto4.ai/p/gpt4-code-interpreter-big-deal-pt1'
  },
  {
    name: 'Shape Up Your Agile',
    old: 'https://craftycto.com/blog/shape-up-your-agile',
    new: 'https://cto4.ai/p/shape-up-your-agile'
  },
  {
    name: 'Hugo Responsive Images',
    old: 'https://craftycto.com/blog/hugo-responsive-images',
    new: 'https://cto4.ai/p/hugo-responsive-images'
  },
  {
    name: 'ChatGPT Images Pictorial',
    old: 'https://craftycto.com/blog/chatgpt-images-pictorial',
    new: 'https://cto4.ai/p/chatgpt-images-pictorial'
  }
];

// WebPageTest configuration
const WPT_API_KEY = process.env.WPT_API_KEY || ''; // Optional: Add your API key for more tests
const WPT_API_URL = 'https://www.webpagetest.org/runtest.php';
const WPT_RESULT_URL = 'https://www.webpagetest.org/jsonResult.php';

// Test settings
const TEST_LOCATION = 'Dulles:Chrome'; // Use a US location
const RUNS = 1; // Number of test runs (1 for free tier)
const FIRST_VIEW_ONLY = 0; // Test both first view and repeat view

/**
 * Submit a test to WebPageTest
 */
async function submitTest(url, label) {
  return new Promise((resolve, reject) => {
    const params = new URLSearchParams({
      url: url,
      location: TEST_LOCATION,
      runs: RUNS,
      fvonly: FIRST_VIEW_ONLY,
      video: 1,
      f: 'json',
      label: label
    });
    
    if (WPT_API_KEY) {
      params.append('k', WPT_API_KEY);
    }
    
    const requestUrl = `${WPT_API_URL}?${params.toString()}`;
    
    https.get(requestUrl, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          if (result.statusCode === 200) {
            resolve({
              testId: result.data.testId,
              jsonUrl: result.data.jsonUrl,
              userUrl: result.data.userUrl,
              summaryUrl: result.data.summary
            });
          } else {
            reject(new Error(result.statusText || 'Test submission failed'));
          }
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

/**
 * Poll for test results
 */
async function getTestResults(testId) {
  return new Promise((resolve, reject) => {
    const checkResult = () => {
      const url = `${WPT_RESULT_URL}?test=${testId}`;
      
      https.get(url, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          try {
            const result = JSON.parse(data);
            
            if (result.statusCode === 200) {
              resolve(result.data);
            } else if (result.statusCode === 100 || result.statusCode === 101) {
              // Test still running, check again in 5 seconds
              console.log(`    Test ${testId} still running...`);
              setTimeout(checkResult, 5000);
            } else {
              reject(new Error(`Test failed: ${result.statusText}`));
            }
          } catch (e) {
            reject(e);
          }
        });
      }).on('error', reject);
    };
    
    checkResult();
  });
}

/**
 * Extract key metrics from test results
 */
function extractMetrics(data) {
  const run = data.runs?.[1] || data.average || {};
  const firstView = run.firstView || {};
  
  return {
    loadTime: firstView.loadTime || 0,
    ttfb: firstView.TTFB || 0,
    fcp: firstView['chromeUserTiming.firstContentfulPaint'] || firstView.firstContentfulPaint || 0,
    lcp: firstView['chromeUserTiming.LargestContentfulPaint'] || firstView.largestContentfulPaint || 0,
    cls: firstView['chromeUserTiming.CumulativeLayoutShift'] || 0,
    tbt: firstView.TotalBlockingTime || 0,
    speedIndex: firstView.SpeedIndex || 0,
    visualComplete: firstView.visualComplete || 0,
    fullyLoaded: firstView.fullyLoaded || 0,
    docComplete: firstView.docComplete || 0,
    bytesIn: firstView.bytesIn || 0,
    requests: firstView.requests || 0,
    score: firstView.lighthouse?.Performance?.score || 0
  };
}

/**
 * Format bytes to human readable
 */
function formatBytes(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

/**
 * Format milliseconds to seconds
 */
function formatTime(ms) {
  return (ms / 1000).toFixed(2) + 's';
}

/**
 * Calculate improvement percentage
 */
function calculateImprovement(oldVal, newVal) {
  if (!oldVal || !newVal || oldVal === 0) return 'N/A';
  
  const improvement = ((oldVal - newVal) / oldVal) * 100;
  
  return improvement > 0 
    ? `🟢 ${improvement.toFixed(1)}% faster`
    : `🔴 ${Math.abs(improvement).toFixed(1)}% slower`;
}

/**
 * Generate comparison report
 */
function generateReport(results) {
  let markdown = `# WebPageTest Performance Comparison Report

**Date**: ${new Date().toISOString()}  
**Comparison**: CraftyCTO.com/blog (Hugo) vs CTO4.AI (Astro)
**Test Location**: ${TEST_LOCATION}
**Test Runs**: ${RUNS} run(s) per URL

## Summary

This report compares the real-world performance of the Hugo-based blog at craftycto.com/blog with the new Astro-based blog at cto4.ai using WebPageTest.

`;

  for (const page of results) {
    markdown += `\n## ${page.name}\n\n`;
    markdown += `- **Old URL**: ${page.old.url}\n`;
    markdown += `- **New URL**: ${page.new.url}\n`;
    markdown += `- **Test URLs**: [Old Test](${page.old.testUrl}) | [New Test](${page.new.testUrl})\n\n`;
    
    const oldMetrics = page.old.metrics;
    const newMetrics = page.new.metrics;
    
    markdown += `### Performance Metrics\n\n`;
    markdown += `| Metric | CraftyCTO (Hugo) | CTO4.AI (Astro) | Improvement |\n`;
    markdown += `|--------|------------------|-----------------|-------------|\n`;
    markdown += `| **Load Time** | ${formatTime(oldMetrics.loadTime)} | ${formatTime(newMetrics.loadTime)} | ${calculateImprovement(oldMetrics.loadTime, newMetrics.loadTime)} |\n`;
    markdown += `| **Time to First Byte** | ${formatTime(oldMetrics.ttfb)} | ${formatTime(newMetrics.ttfb)} | ${calculateImprovement(oldMetrics.ttfb, newMetrics.ttfb)} |\n`;
    markdown += `| **First Contentful Paint** | ${formatTime(oldMetrics.fcp)} | ${formatTime(newMetrics.fcp)} | ${calculateImprovement(oldMetrics.fcp, newMetrics.fcp)} |\n`;
    markdown += `| **Largest Contentful Paint** | ${formatTime(oldMetrics.lcp)} | ${formatTime(newMetrics.lcp)} | ${calculateImprovement(oldMetrics.lcp, newMetrics.lcp)} |\n`;
    markdown += `| **Speed Index** | ${oldMetrics.speedIndex}ms | ${newMetrics.speedIndex}ms | ${calculateImprovement(oldMetrics.speedIndex, newMetrics.speedIndex)} |\n`;
    markdown += `| **Total Blocking Time** | ${oldMetrics.tbt}ms | ${newMetrics.tbt}ms | ${calculateImprovement(oldMetrics.tbt, newMetrics.tbt)} |\n`;
    markdown += `| **Cumulative Layout Shift** | ${oldMetrics.cls.toFixed(3)} | ${newMetrics.cls.toFixed(3)} | ${calculateImprovement(oldMetrics.cls, newMetrics.cls)} |\n`;
    markdown += `| **Visual Complete** | ${formatTime(oldMetrics.visualComplete)} | ${formatTime(newMetrics.visualComplete)} | ${calculateImprovement(oldMetrics.visualComplete, newMetrics.visualComplete)} |\n`;
    markdown += `| **Fully Loaded** | ${formatTime(oldMetrics.fullyLoaded)} | ${formatTime(newMetrics.fullyLoaded)} | ${calculateImprovement(oldMetrics.fullyLoaded, newMetrics.fullyLoaded)} |\n`;
    
    markdown += `\n### Resource Loading\n\n`;
    markdown += `| Metric | CraftyCTO (Hugo) | CTO4.AI (Astro) | Improvement |\n`;
    markdown += `|--------|------------------|-----------------|-------------|\n`;
    markdown += `| **Total Size** | ${formatBytes(oldMetrics.bytesIn)} | ${formatBytes(newMetrics.bytesIn)} | ${calculateImprovement(oldMetrics.bytesIn, newMetrics.bytesIn)} |\n`;
    markdown += `| **Total Requests** | ${oldMetrics.requests} | ${newMetrics.requests} | ${calculateImprovement(oldMetrics.requests, newMetrics.requests)} |\n`;
    
    if (oldMetrics.score && newMetrics.score) {
      markdown += `| **Lighthouse Score** | ${Math.round(oldMetrics.score * 100)} | ${Math.round(newMetrics.score * 100)} | ${calculateImprovement(100 - oldMetrics.score * 100, 100 - newMetrics.score * 100)} |\n`;
    }
    
    markdown += '\n---\n';
  }
  
  markdown += `\n## Key Findings

### Overall Performance
- Compare Load Time and Speed Index for overall user experience
- Lower values are better for all metrics except Lighthouse Score

### Core Web Vitals
- **LCP (Largest Contentful Paint)**: Target < 2500ms for good score
- **FCP (First Contentful Paint)**: Target < 1800ms for good score
- **CLS (Cumulative Layout Shift)**: Target < 0.1 for good score
- **TBT (Total Blocking Time)**: Target < 300ms for good score

### Recommendations
1. Focus on pages showing red (slower) metrics
2. Optimize resources (images, JS, CSS) for better load times
3. Improve server response time (TTFB) if consistently slow
4. Reduce JavaScript execution for better interactivity

---
*Generated using WebPageTest API*
*Full test results available at the provided test URLs*
`;
  
  return markdown;
}

/**
 * Main comparison function
 */
async function comparePerformance() {
  console.log('🚀 Starting WebPageTest Performance Comparison\n');
  console.log('=' .repeat(60));
  console.log('Note: Tests may take 1-3 minutes per URL to complete\n');
  
  const results = [];
  
  for (const page of PAGES_TO_TEST) {
    console.log(`\nTesting: ${page.name}`);
    console.log('-'.repeat(40));
    
    try {
      // Submit tests for both URLs
      console.log(`  Submitting test for old site (Hugo)...`);
      const oldTest = await submitTest(page.old, `Hugo: ${page.name}`);
      console.log(`  ✅ Test ID: ${oldTest.testId}`);
      console.log(`  📊 View at: ${oldTest.userUrl}`);
      
      console.log(`  Submitting test for new site (Astro)...`);
      const newTest = await submitTest(page.new, `Astro: ${page.name}`);
      console.log(`  ✅ Test ID: ${newTest.testId}`);
      console.log(`  📊 View at: ${newTest.userUrl}`);
      
      // Wait for both tests to complete
      console.log(`  ⏳ Waiting for tests to complete...`);
      
      const [oldResults, newResults] = await Promise.all([
        getTestResults(oldTest.testId),
        getTestResults(newTest.testId)
      ]);
      
      const oldMetrics = extractMetrics(oldResults);
      const newMetrics = extractMetrics(newResults);
      
      results.push({
        name: page.name,
        old: {
          url: page.old,
          testUrl: oldTest.userUrl,
          metrics: oldMetrics
        },
        new: {
          url: page.new,
          testUrl: newTest.userUrl,
          metrics: newMetrics
        }
      });
      
      console.log(`  ✅ Tests completed!`);
      console.log(`     Hugo Load Time: ${formatTime(oldMetrics.loadTime)}`);
      console.log(`     Astro Load Time: ${formatTime(newMetrics.loadTime)}`);
      console.log(`     Improvement: ${calculateImprovement(oldMetrics.loadTime, newMetrics.loadTime)}`);
      
    } catch (error) {
      console.error(`  ❌ Test failed: ${error.message}`);
      console.log(`  Skipping this page...`);
    }
    
    // Add delay between page tests to be respectful of the free service
    if (PAGES_TO_TEST.indexOf(page) < PAGES_TO_TEST.length - 1) {
      console.log('\n  Waiting 10 seconds before next test...');
      await new Promise(resolve => setTimeout(resolve, 10000));
    }
  }
  
  // Generate and save report
  console.log('\n' + '='.repeat(60));
  console.log('📊 Generating Performance Report...\n');
  
  const report = generateReport(results);
  
  const reportPath = path.join(process.cwd(), 'webpagetest-report.md');
  fs.writeFileSync(reportPath, report);
  console.log(`✅ Report saved to: ${reportPath}`);
  
  // Save raw data
  const jsonPath = path.join(process.cwd(), 'webpagetest-data.json');
  fs.writeFileSync(jsonPath, JSON.stringify(results, null, 2));
  console.log(`✅ Raw data saved to: ${jsonPath}`);
  
  return results;
}

// Run the comparison
comparePerformance().catch(console.error);

export { comparePerformance };
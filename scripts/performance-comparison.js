#!/usr/bin/env node

/**
 * Performance Comparison Script
 * Compares web performance between craftycto.com/blog and cto4.ai
 *
 * Uses multiple methods:
 * 1. PageSpeed Insights API (Google's Core Web Vitals)
 * 2. WebPageTest API (if API key provided)
 * 3. Lighthouse CLI (local testing)
 */

import https from 'https';
import { execSync } from 'child_process';
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
    new: 'https://cto4.ai',
  },
  {
    name: 'GPT-4 Code Interpreter Article',
    old: 'https://craftycto.com/blog/gpt4-code-interpreter-big-deal-pt1',
    new: 'https://cto4.ai/p/gpt4-code-interpreter-big-deal-pt1',
  },
  {
    name: 'Shape Up Your Agile',
    old: 'https://craftycto.com/blog/shape-up-your-agile',
    new: 'https://cto4.ai/p/shape-up-your-agile',
  },
  {
    name: 'Hugo Responsive Images',
    old: 'https://craftycto.com/blog/hugo-responsive-images',
    new: 'https://cto4.ai/p/hugo-responsive-images',
  },
  {
    name: 'ChatGPT Images Pictorial',
    old: 'https://craftycto.com/blog/chatgpt-images-pictorial',
    new: 'https://cto4.ai/p/chatgpt-images-pictorial',
  },
];

// PageSpeed Insights API
async function getPageSpeedInsights(url, strategy = 'mobile') {
  return new Promise((resolve, reject) => {
    const apiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&strategy=${strategy}`;

    https
      .get(apiUrl, (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => {
          try {
            const result = JSON.parse(data);
            if (result.error) {
              reject(new Error(result.error.message));
            } else {
              resolve(result);
            }
          } catch (e) {
            reject(e);
          }
        });
      })
      .on('error', reject);
  });
}

// Extract key metrics from PageSpeed Insights
function extractMetrics(psiData) {
  const metrics = psiData.lighthouseResult?.audits || {};
  const categories = psiData.lighthouseResult?.categories || {};

  return {
    score: Math.round((categories.performance?.score || 0) * 100),
    fcp: metrics['first-contentful-paint']?.displayValue || 'N/A',
    lcp: metrics['largest-contentful-paint']?.displayValue || 'N/A',
    cls: metrics['cumulative-layout-shift']?.displayValue || 'N/A',
    tbt: metrics['total-blocking-time']?.displayValue || 'N/A',
    si: metrics['speed-index']?.displayValue || 'N/A',
    tti: metrics['interactive']?.displayValue || 'N/A',

    // Raw values for calculations
    fcpMs: metrics['first-contentful-paint']?.numericValue || 0,
    lcpMs: metrics['largest-contentful-paint']?.numericValue || 0,
    clsScore: metrics['cumulative-layout-shift']?.numericValue || 0,
    tbtMs: metrics['total-blocking-time']?.numericValue || 0,
    siMs: metrics['speed-index']?.numericValue || 0,
    ttiMs: metrics['interactive']?.numericValue || 0,
  };
}

// Run Lighthouse CLI locally (requires lighthouse npm package)
async function runLighthouse(url) {
  try {
    // Check if lighthouse is installed
    execSync('which lighthouse', { stdio: 'ignore' });

    console.log(`  Running Lighthouse for ${url}...`);
    const output = execSync(`lighthouse ${url} --output=json --quiet --chrome-flags="--headless"`, {
      encoding: 'utf8',
      maxBuffer: 10 * 1024 * 1024,
    });

    const result = JSON.parse(output);
    const metrics = result.audits || {};
    const categories = result.categories || {};

    return {
      score: Math.round((categories.performance?.score || 0) * 100),
      fcp: metrics['first-contentful-paint']?.displayValue || 'N/A',
      lcp: metrics['largest-contentful-paint']?.displayValue || 'N/A',
      cls: metrics['cumulative-layout-shift']?.displayValue || 'N/A',
      tbt: metrics['total-blocking-time']?.displayValue || 'N/A',
      si: metrics['speed-index']?.displayValue || 'N/A',
      tti: metrics['interactive']?.displayValue || 'N/A',

      fcpMs: metrics['first-contentful-paint']?.numericValue || 0,
      lcpMs: metrics['largest-contentful-paint']?.numericValue || 0,
      clsScore: metrics['cumulative-layout-shift']?.numericValue || 0,
      tbtMs: metrics['total-blocking-time']?.numericValue || 0,
      siMs: metrics['speed-index']?.numericValue || 0,
      ttiMs: metrics['interactive']?.numericValue || 0,
    };
  } catch (e) {
     
    console.log('  Lighthouse CLI not available, skipping local test');
    return null;
  }
}

// Calculate improvement percentage
function calculateImprovement(oldVal, newVal, lowerIsBetter = true) {
  if (!oldVal || !newVal || oldVal === 0) return 'N/A';

  const improvement = lowerIsBetter ? ((oldVal - newVal) / oldVal) * 100 : ((newVal - oldVal) / oldVal) * 100;

  return improvement > 0 ? `+${improvement.toFixed(1)}%` : `${improvement.toFixed(1)}%`;
}

// Format comparison table
function formatComparisonTable(results) {
  let output = '';

  for (const page of results) {
    output += `\n## ${page.name}\n\n`;
    output += `- Old URL: ${page.old}\n`;
    output += `- New URL: ${page.new}\n\n`;

    if (page.mobile) {
      output += `### Mobile Performance\n\n`;
      output += `| Metric | CraftyCTO (Hugo) | CTO4.AI (Astro) | Improvement |\n`;
      output += `|--------|------------------|-----------------|-------------|\n`;
      output += `| **Performance Score** | ${page.mobile.old.score} | ${page.mobile.new.score} | ${calculateImprovement(page.mobile.old.score, page.mobile.new.score, false)} |\n`;
      output += `| First Contentful Paint | ${page.mobile.old.fcp} | ${page.mobile.new.fcp} | ${calculateImprovement(page.mobile.old.fcpMs, page.mobile.new.fcpMs)} |\n`;
      output += `| Largest Contentful Paint | ${page.mobile.old.lcp} | ${page.mobile.new.lcp} | ${calculateImprovement(page.mobile.old.lcpMs, page.mobile.new.lcpMs)} |\n`;
      output += `| Cumulative Layout Shift | ${page.mobile.old.cls} | ${page.mobile.new.cls} | ${calculateImprovement(page.mobile.old.clsScore, page.mobile.new.clsScore)} |\n`;
      output += `| Total Blocking Time | ${page.mobile.old.tbt} | ${page.mobile.new.tbt} | ${calculateImprovement(page.mobile.old.tbtMs, page.mobile.new.tbtMs)} |\n`;
      output += `| Speed Index | ${page.mobile.old.si} | ${page.mobile.new.si} | ${calculateImprovement(page.mobile.old.siMs, page.mobile.new.siMs)} |\n`;
      output += `| Time to Interactive | ${page.mobile.old.tti} | ${page.mobile.new.tti} | ${calculateImprovement(page.mobile.old.ttiMs, page.mobile.new.ttiMs)} |\n`;
    }

    if (page.desktop) {
      output += `\n### Desktop Performance\n\n`;
      output += `| Metric | CraftyCTO (Hugo) | CTO4.AI (Astro) | Improvement |\n`;
      output += `|--------|------------------|-----------------|-------------|\n`;
      output += `| **Performance Score** | ${page.desktop.old.score} | ${page.desktop.new.score} | ${calculateImprovement(page.desktop.old.score, page.desktop.new.score, false)} |\n`;
      output += `| First Contentful Paint | ${page.desktop.old.fcp} | ${page.desktop.new.fcp} | ${calculateImprovement(page.desktop.old.fcpMs, page.desktop.new.fcpMs)} |\n`;
      output += `| Largest Contentful Paint | ${page.desktop.old.lcp} | ${page.desktop.new.lcp} | ${calculateImprovement(page.desktop.old.lcpMs, page.desktop.new.lcpMs)} |\n`;
      output += `| Cumulative Layout Shift | ${page.desktop.old.cls} | ${page.desktop.new.cls} | ${calculateImprovement(page.desktop.old.clsScore, page.desktop.new.clsScore)} |\n`;
      output += `| Total Blocking Time | ${page.desktop.old.tbt} | ${page.desktop.new.tbt} | ${calculateImprovement(page.desktop.old.tbtMs, page.desktop.new.tbtMs)} |\n`;
      output += `| Speed Index | ${page.desktop.old.si} | ${page.desktop.new.si} | ${calculateImprovement(page.desktop.old.siMs, page.desktop.new.siMs)} |\n`;
      output += `| Time to Interactive | ${page.desktop.old.tti} | ${page.desktop.new.tti} | ${calculateImprovement(page.desktop.old.ttiMs, page.desktop.new.ttiMs)} |\n`;
    }
  }

  return output;
}

// Main comparison function
async function comparePerformance() {
  console.log('🚀 Starting Performance Comparison: CraftyCTO vs CTO4.AI\n');
  console.log('='.repeat(60));

  const results = [];
  const testMobile = true;
  const testDesktop = true;

  for (const page of PAGES_TO_TEST) {
    console.log(`\nTesting: ${page.name}`);
    console.log('-'.repeat(40));

    const pageResults = {
      name: page.name,
      old: page.old,
      new: page.new,
      mobile: null,
      desktop: null,
    };

    // Test Mobile Performance
    if (testMobile) {
      console.log('📱 Mobile Performance:');
      try {
        console.log('  Testing old site (Hugo)...');
        const oldMobile = await getPageSpeedInsights(page.old, 'mobile');
        const oldMetrics = extractMetrics(oldMobile);

        console.log('  Testing new site (Astro)...');
        const newMobile = await getPageSpeedInsights(page.new, 'mobile');
        const newMetrics = extractMetrics(newMobile);

        pageResults.mobile = {
          old: oldMetrics,
          new: newMetrics,
        };

        console.log(`  ✅ Mobile scores: Hugo=${oldMetrics.score}, Astro=${newMetrics.score}`);
      } catch (e) {
        console.error(`  ❌ Mobile test failed: ${e.message}`);
      }
    }

    // Test Desktop Performance
    if (testDesktop) {
      console.log('💻 Desktop Performance:');
      try {
        console.log('  Testing old site (Hugo)...');
        const oldDesktop = await getPageSpeedInsights(page.old, 'desktop');
        const oldMetrics = extractMetrics(oldDesktop);

        console.log('  Testing new site (Astro)...');
        const newDesktop = await getPageSpeedInsights(page.new, 'desktop');
        const newMetrics = extractMetrics(newDesktop);

        pageResults.desktop = {
          old: oldMetrics,
          new: newMetrics,
        };

        console.log(`  ✅ Desktop scores: Hugo=${oldMetrics.score}, Astro=${newMetrics.score}`);
      } catch (e) {
        console.error(`  ❌ Desktop test failed: ${e.message}`);
      }
    }

    results.push(pageResults);

    // Add delay to avoid rate limiting
    if (PAGES_TO_TEST.indexOf(page) < PAGES_TO_TEST.length - 1) {
      console.log('\n  Waiting 2 seconds before next test...');
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
  }

  // Generate report
  console.log('\n' + '='.repeat(60));
  console.log('📊 Generating Performance Report...\n');

  const report = `# Performance Comparison Report

**Date**: ${new Date().toISOString()}  
**Comparison**: CraftyCTO.com/blog (Hugo) vs CTO4.AI (Astro)

## Summary

This report compares the performance of the old Hugo-based blog at craftycto.com/blog with the new Astro-based blog at cto4.ai.

### Methodology
- Testing Tool: Google PageSpeed Insights API
- Metrics: Core Web Vitals and Lighthouse Performance Scores
- Strategies: Both Mobile and Desktop
- Pages Tested: ${PAGES_TO_TEST.length} representative pages

${formatComparisonTable(results)}

## Key Findings

### Overall Performance
- Review the Performance Score differences to see overall improvement
- Negative percentages indicate slower performance, positive indicate faster

### Core Web Vitals
- **LCP (Largest Contentful Paint)**: Target < 2.5s
- **FCP (First Contentful Paint)**: Target < 1.8s  
- **CLS (Cumulative Layout Shift)**: Target < 0.1
- **TBT (Total Blocking Time)**: Target < 300ms

### Recommendations
1. Focus on pages with negative improvement percentages
2. Optimize images and lazy loading for better LCP
3. Minimize JavaScript execution for better TBT
4. Ensure proper sizing attributes for better CLS

---
*Generated by performance-comparison.js*
`;

  // Save report
  const reportPath = path.join(process.cwd(), 'performance-report.md');
  fs.writeFileSync(reportPath, report);
  console.log(`✅ Report saved to: ${reportPath}`);

  // Also save raw JSON data
  const jsonPath = path.join(process.cwd(), 'performance-data.json');
  fs.writeFileSync(jsonPath, JSON.stringify(results, null, 2));
  console.log(`✅ Raw data saved to: ${jsonPath}`);

  return results;
}

// Run the comparison
comparePerformance().catch(console.error);

export { comparePerformance, getPageSpeedInsights };

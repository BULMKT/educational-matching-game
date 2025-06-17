import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

// Aggressive mobile scrolling fix with debugging
const forceScrollingFix = () => {
  console.log('🔧 Applying mobile scrolling fix...');
  
  // Get computed styles before fix
  const htmlBefore = window.getComputedStyle(document.documentElement);
  const bodyBefore = window.getComputedStyle(document.body);
  console.log('📊 Before fix - HTML height:', htmlBefore.height, 'overflow:', htmlBefore.overflow);
  console.log('📊 Before fix - Body height:', bodyBefore.height, 'overflow:', bodyBefore.overflow);
  
  // Force style overrides
  const htmlStyle = document.documentElement.style;
  htmlStyle.setProperty('height', 'auto', 'important');
  htmlStyle.setProperty('max-height', 'none', 'important');
  htmlStyle.setProperty('overflow-y', 'auto', 'important');
  htmlStyle.setProperty('overflow-x', 'hidden', 'important');
  htmlStyle.setProperty('-webkit-overflow-scrolling', 'touch', 'important');
  
  const bodyStyle = document.body.style;
  bodyStyle.setProperty('height', 'auto', 'important');
  bodyStyle.setProperty('max-height', 'none', 'important');
  bodyStyle.setProperty('min-height', '100vh', 'important');
  bodyStyle.setProperty('overflow-y', 'auto', 'important');
  bodyStyle.setProperty('overflow-x', 'hidden', 'important');
  bodyStyle.setProperty('-webkit-overflow-scrolling', 'touch', 'important');
  
  const root = document.getElementById('root');
  if (root) {
    const rootStyle = root.style;
    rootStyle.setProperty('height', 'auto', 'important');
    rootStyle.setProperty('max-height', 'none', 'important');
    rootStyle.setProperty('min-height', '100vh', 'important');
    rootStyle.setProperty('overflow', 'visible', 'important');
  }
  
  // Get computed styles after fix
  const htmlAfter = window.getComputedStyle(document.documentElement);
  const bodyAfter = window.getComputedStyle(document.body);
  console.log('✅ After fix - HTML height:', htmlAfter.height, 'overflow:', htmlAfter.overflow);
  console.log('✅ After fix - Body height:', bodyAfter.height, 'overflow:', bodyAfter.overflow);
  
  // Test scroll capability
  setTimeout(() => {
    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = document.documentElement.clientHeight;
    console.log('📏 Scroll test - scrollHeight:', scrollHeight, 'clientHeight:', clientHeight);
    console.log('📏 Can scroll:', scrollHeight > clientHeight ? 'YES' : 'NO');
  }, 1000);
};

// Apply fix at multiple points
forceScrollingFix();
document.addEventListener('DOMContentLoaded', forceScrollingFix);
window.addEventListener('load', forceScrollingFix);

// Also apply on window resize (mobile orientation change)
window.addEventListener('resize', () => {
  setTimeout(forceScrollingFix, 100);
});

const container = document.getElementById("root");
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}

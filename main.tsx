import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

// Aggressive mobile scrolling fix with debugging
const forceScrollingFix = () => {
  console.log('🔧 Applying mobile scrolling fix...');
  
  const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  
  if (isMobile) {
    console.log('� Mobile device detected - applying aggressive fixes');
    
    // Mobile-specific fixes
    const applyMobileFix = (element, name) => {
      if (element) {
        const style = element.style;
        style.setProperty('height', 'auto', 'important');
        style.setProperty('max-height', 'none', 'important');
        style.setProperty('min-height', '100vh', 'important');
        style.setProperty('overflow', 'visible', 'important');
        style.setProperty('overflow-y', 'auto', 'important');
        style.setProperty('overflow-x', 'hidden', 'important');
        style.setProperty('-webkit-overflow-scrolling', 'touch', 'important');
        style.setProperty('overscroll-behavior-y', 'auto', 'important');
        style.setProperty('position', 'static', 'important');
        style.setProperty('-webkit-transform', 'translate3d(0,0,0)', 'important');
        style.setProperty('transform', 'translate3d(0,0,0)', 'important');
        
        console.log(`✅ Applied mobile fixes to ${name}`);
      }
    };
    
    applyMobileFix(document.documentElement, 'HTML');
    applyMobileFix(document.body, 'BODY');
    applyMobileFix(document.getElementById('root'), 'ROOT');
    
    // Force viewport meta tag for mobile
    let viewportMeta = document.querySelector('meta[name="viewport"]');
    if (viewportMeta) {
      viewportMeta.setAttribute('content', 'width=device-width, initial-scale=1.0, user-scalable=yes, viewport-fit=cover');
    }
    
  } else {
    console.log('💻 Desktop device - using standard fixes');
    
    // Standard fixes for desktop
    const htmlStyle = document.documentElement.style;
    htmlStyle.setProperty('height', 'auto', 'important');
    htmlStyle.setProperty('max-height', 'none', 'important');
    htmlStyle.setProperty('overflow-y', 'auto', 'important');
    
    const bodyStyle = document.body.style;
    bodyStyle.setProperty('height', 'auto', 'important');
    bodyStyle.setProperty('max-height', 'none', 'important');
    bodyStyle.setProperty('overflow-y', 'auto', 'important');
    
    const root = document.getElementById('root');
    if (root) {
      root.style.setProperty('height', 'auto', 'important');
      root.style.setProperty('overflow', 'visible', 'important');
    }
  }
  
  // Test scroll capability after fixes
  setTimeout(() => {
    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = document.documentElement.clientHeight;
    console.log('📏 Scroll test - scrollHeight:', scrollHeight, 'clientHeight:', clientHeight);
    console.log('📏 Can scroll:', scrollHeight > clientHeight ? 'YES ✅' : 'NO ❌');
    console.log('📏 Device type:', isMobile ? 'Mobile 📱' : 'Desktop 💻');
  }, 1500);
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

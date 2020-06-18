if ('serviceWorker' in navigator) {
  // Use the window load event to keep the page load performant
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/etc.clientlibs/we-retail-journal/clientlibs/clientlib-site/resources/service-worker.js', {scope:'/'});
  });
}
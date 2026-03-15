import ErrorBoundary from "./components/ErrorBoundary";
import ErrorFallback from "./components/ErrorFallback";
import MainPage from "./pages/MainPage";

function App() {
  return (
    <ErrorBoundary fallback={<ErrorFallback />}>
      <MainPage />
    </ErrorBoundary>
  );
}

export default App;

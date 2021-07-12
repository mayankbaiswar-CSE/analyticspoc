import logo from './logo.svg';
import './App.css';
import useAnalytics, { GasEventTypes, AnalyticsConfig } from './useAnalytics';

function App() {
  const { sendAnalytics, sendObservability } = useAnalytics();
  sendObservability()
  const analytics = sendAnalytics('invoiceScreen', GasEventTypes.UI);
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          // data-analytics={true}
          onClick={() => {
            analytics({
                actionsubject: AnalyticsConfig[GasEventTypes.UI].SUBJECT.BUTTON,
                action: AnalyticsConfig[GasEventTypes.UI].ACTION.CLICKED,
                actionsubjectid: AnalyticsConfig[GasEventTypes.UI].SUBJECTID.OPENSIDEBARLINK
              });
          }}
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;

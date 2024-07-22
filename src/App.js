import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Address from './components/Address';
import City from './components/City';
import District from './components/District';
import Street from './components/Street';
import './App.css';
import Organization from "./components/Organization";
import ServiceS from "./components/ServiceS";
import Subscriber from "./components/Subscriber";
import ATS from "./components/ATS";
import Phone from "./components/Phone";
import Subscription from "./components/Subscription";
import ServiceConnection from "./components/ServiceConnection";
import CallLog from "./components/CallLog";
import SqlQueryExecutor from "./components/SqlQueryExecutor";
import SearchSubscribers from "./components/SearchSubscribers";
import SearchFreePhones from "./components/SearchFreePhones";
import SearchSubscribersWithDebt from "./components/SearchSubscribersWithDebt";
import ATSDebtStats from "./components/ATSDebtStats";
import SearchPayphones from "./components/SearchPayphones";
import SubscriberPercentages from "./components/SubscriberPercentages";
import SubscriberInfo from "./components/SubscriberInfo";
import PhoneSearch from "./components/PhoneSearch";
import CitySearch from "./components/CitySearch";
import PhoneSearch_ from "./components/PhoneSearch_";
import PairedPhonesSearch from "./components/PairedPhonesSearch";
import DebtorsSearch from "./components/DebtorsSearch"; // Импорт нового компонента

function App() {
  const [leftSidebarVisible, setLeftSidebarVisible] = useState(false);
  const [rightSidebarVisible, setRightSidebarVisible] = useState(false);

  return (
      <Router>
        <div className="App">
          <header className="App-header">
            <button
                className="toggle-button left"
                onClick={() => setLeftSidebarVisible(!leftSidebarVisible)}
            >
              ☰
            </button>
            <h1>SQL Query Executor</h1>
            <button
                className="toggle-button right"
                onClick={() => setRightSidebarVisible(!rightSidebarVisible)}
            >
              ☰
            </button>
          </header>
          <div className="main-container">
            <div className={`sidebar left ${leftSidebarVisible ? 'visible' : ''}`}>
              <nav>
                <Link to="/search-subscribers">Search Subscribers</Link>
                <Link to="/search-free-phones">Search free phones</Link>
                <Link to="/search-subscribers-with-debt">Search subscribers with debt</Link>
                <Link to="/ats-debt-stats">ATS debt stats</Link>
                <Link to="/search-payphones">Search payphones</Link>
                <Link to="/subscriber-percentages">Subscriber percentages</Link>
                <Link to="/subscriber-info">Subscriber info parallel</Link>
                <Link to="/phone-search">Phone search</Link>
                <Link to="/city-search">City search</Link>
                <Link to="/phone-search_">Search subscribers by phone_no</Link>
                <Link to="/paired-phones-search">paired phones search</Link>
                <Link to="/debtors-search">Debtors search</Link>
              </nav>
            </div>

            <div className={`sidebar right ${rightSidebarVisible ? 'visible' : ''}`}>
              <nav>
                <Link to="/">SQL Query Executor</Link>
                <Link to="/address">Addresses</Link>
                <Link to="/city">Cities</Link>
                <Link to="/district">Districts</Link>
                <Link to="/street">Streets</Link>
                <Link to="/organization">Organizations</Link>
                <Link to="/service">Services</Link>
                <Link to="/subscriber">Subscribers</Link>
                <Link to="/ats">ats</Link>
                <Link to="/phone">phones</Link>
                <Link to="/subscription">subscriptions</Link>
                <Link to="/service-connection">Service connections</Link>
                <Link to="/call-logs">Call logs</Link>
              </nav>
            </div>

            <div className="content">
              <Routes>
                <Route path="/address" element={<Address />} />
                <Route path="/city" element={<City />} />
                <Route path="/district" element={<District />} />
                <Route path="/street" element={<Street />} />
                <Route path="/organization" element={<Organization />} />
                <Route path="/service" element={<ServiceS />} />
                <Route path="/subscriber" element={<Subscriber />} />
                <Route path="/ats" element={<ATS />} />
                <Route path="/phone" element={<Phone />} />
                <Route path="/subscription" element={<Subscription />} />
                <Route path="/service-connection" element={<ServiceConnection />} />
                <Route path="/call-logs" element={<CallLog />} />
                <Route path="/" element={<SqlQueryExecutor />} />
                <Route path="/search-subscribers" element={<SearchSubscribers />} />
                <Route path="/search-free-phones" element={<SearchFreePhones />} />
                <Route path="/search-subscribers-with-debt" element={<SearchSubscribersWithDebt />} />
                <Route path="/ats-debt-stats" element={<ATSDebtStats />} />
                <Route path="/search-payphones" element={<SearchPayphones />} />
                <Route path="/subscriber-percentages" element={<SubscriberPercentages />} />
                <Route path="/subscriber-info" element={<SubscriberInfo />} />
                <Route path="/phone-search" element={<PhoneSearch />} />
                <Route path="/city-search" element={<CitySearch />} />
                <Route path="/phone-search_" element={<PhoneSearch_ />} />
                <Route path="/paired-phones-search" element={<PairedPhonesSearch />} />
                <Route path="/debtors-search" element={<DebtorsSearch />} />
              </Routes>
            </div>
          </div>
        </div>
      </Router>
  );
}

export default App;

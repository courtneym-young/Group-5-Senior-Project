import BusinessProfile from './components/BusinessProfile';

const App = () => {
  // Simulated initial business data
  const initialBusinessData = {
    name: 'Business 1',
    contactInfo: 'contact@business1.com',
    address: '123 Business St, Cityville',
    hours: '9 AM - 5 PM',
    minorityOwned: true,
  };

  return (
    <div>
      <h1>Business Directory</h1>
      <BusinessProfile initialBusiness={initialBusinessData} />
    </div>
  );
};

export default App;

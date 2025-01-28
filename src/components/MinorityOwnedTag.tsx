// Define props interface to accept `onChange` function from the parent
interface MinorityOwnedTagProps {
    minorityOwned: boolean; // current status of minority owned
    onChange: () => void; // callback to toggle status
}

const MinorityOwnedTag: React.FC<MinorityOwnedTagProps> = ({ minorityOwned, onChange }) => {
  const handleToggle = () => {
    // Toggle local state and call the parent callback
    onChange(); // Notify parent component to update the global state
  };

  return (
    <div>
      <label>
        Minority-Owned Business
        <input
          type="checkbox"
          checked={minorityOwned}
          onChange={handleToggle}
        />
      </label>
    </div>
  );
};

export default MinorityOwnedTag;

// Already correct OptionLists.jsx
const OptionLists = ({ options, onOptionSelected, selectedOption }) => {
  return (
    <ul className="list-group mb-4">
      {options?.map((opt) => (
        <li
          key={opt._id}
          className={`list-group-item ${
            selectedOption && selectedOption._id === opt._id ? "active" : ""
          }`}
          onClick={() => onOptionSelected(opt)}
          style={{ cursor: "pointer" }}
        >
          {opt.name}
        </li>
      ))}
    </ul>
  );
};
export default OptionLists;

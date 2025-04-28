export function Input({ label, type = 'text', value, onChange, ...props }) {
    return (
      <div className="flex flex-col gap-2 mb-4">
        <label className="text-sm font-semibold">{label}</label>
        <input
          className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          type={type}
          value={value}
          onChange={onChange}
          {...props}
        />
      </div>
    );
  }
  
export default function InputField({ value, onChange, placeholder }: { value: string; onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void; placeholder: string }) {
  return (
    <input
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="p-3 w-full border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
    />
  );
}
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

interface TenureSelectorProps {
  options: string[];
  value: string;
  onChange: (value: string) => void;
  color: string;
}

const TenureSelector: React.FC<TenureSelectorProps> = ({ options, value, onChange, color }) => (
  <div>
    <label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-[180px]" style={{ color, border: 'none' }}>
          <SelectValue placeholder="Select tenure" />
        </SelectTrigger>
        <SelectContent>
          {options.map(option => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </label>
  </div>
);

export default TenureSelector;
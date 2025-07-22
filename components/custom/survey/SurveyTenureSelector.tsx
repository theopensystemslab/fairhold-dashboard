import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/select";

interface SurveyTenureSelectorProps {
  options: string[];
  value: string;
  onChange: (value: string) => void;
  color: string;
}

const SurveyTenureSelector: React.FC<SurveyTenureSelectorProps> = ({ options, value, onChange, color }) => (
  <div>
    <label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-[180px]" style={{ color, border: `1px solid ${color}` }}>
          <SelectValue placeholder="Select tenure" />
        </SelectTrigger>
        <SelectContent>
          {options.map(option => (
            <SelectItem 
              key={option} 
              value={option}
              className="text-xs focus:bg-gray-200"              >
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </label>
  </div>
);

export default SurveyTenureSelector;
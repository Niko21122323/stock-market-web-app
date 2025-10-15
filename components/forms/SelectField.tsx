import { Controller } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "../ui/label";

const SelectField = ({
  name,
  label,
  placeholder,
  options,
  control,
  error,
  required = false,
}: SelectFieldProps) => {
  return (
    <div className="space-y-2 last:sm:col-span-2 last:lg:col-span-1">
      <Label htmlFor={name} className="text-foreground text-lg font-medium">
        {label}
      </Label>
      <Controller
        name={name}
        control={control}
        rules={{
          required: required ? `Please select ${label.toLowerCase()}` : false,
        }}
        render={({ field }) => (
          <Select value={field.value} onValueChange={field.onChange}>
            <SelectTrigger className="px-3 py-6 text-foreground focus:placeholder:text-muted-foreground/50 !bg-background !outline-primary w-full">
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent className="bg-background border-border text-white">
              {options.map((option) => (
                <SelectItem
                  value={option.value}
                  key={option.value}
                  className="focus:bg-secondary focus:text-white"
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
            {error && <p className="text-sm text-red-500">{error.message}</p>}
          </Select>
        )}
      />
    </div>
  );
};

export default SelectField;

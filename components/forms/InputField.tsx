import { cn } from "@/lib/utils";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

const InputField = ({
  name,
  label,
  placeholder,
  type = "text",
  register,
  error,
  validation,
  disabled,
  value,
}: FormInputProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor={name} className="text-foreground text-lg font-medium">
        {label}
      </Label>
      <Input
        type={type}
        id={name}
        placeholder={placeholder}
        disabled={disabled}
        value={value}
        className={cn(
          "px-3 py-6 text-foreground focus:placeholder:text-muted-foreground/50 !bg-background !outline-primary",
          {
            "opacity-50 cursor-not-allowed": error,
          }
        )}
        {...register(name, validation)}
      />
      {error && <p className="text-sm text-red-500">{error.message}</p>}
    </div>
  );
};

export default InputField;

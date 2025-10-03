import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function Combobox({
  Data,
  open,
  setOpen,
  value,
  setValue,
  currentWallet,
}: {
  Data: string[];
  open: boolean;
  setOpen: (open: boolean) => void;
  value: string;
  setValue: (value: string) => void;
  currentWallet: string;
}) {
  // Set default wallet if none selected
  React.useEffect(() => {
    if (!value && currentWallet) {
      setValue(currentWallet);
    }
  }, [currentWallet, value, setValue]);

  // Store selected wallet in localStorage
  // React.useEffect(() => {
  //   if (value) {
  //     localStorage.setItem("currentWallet", value)
  //     console.log("Selected wallet:", value)
  //   }
  // }, [value])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[400px] justify-between"
        >
          {value || "Select wallet..."}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0">
        <Command>
          <CommandInput placeholder="Search wallet..." className="h-9" />
          <CommandList>
            <CommandEmpty>No wallets found.</CommandEmpty>
            <CommandGroup>
              {Data.map((item) => (
                <CommandItem
                  key={item}
                  value={item}
                  onSelect={(selected) => {
                    setValue(item);
                    localStorage.setItem("currentWallet", item);
                    setOpen(false);
                  }}
                >
                  {item}
                  <Check
                    className={cn(
                      "ml-auto",
                      value === item ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

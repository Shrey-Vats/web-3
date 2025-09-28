import { Input } from "./ui/input";
import { toast } from "sonner";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import {Trash2} from "lucide-react"

export interface vaults {
  publicKey: string;
  secretKey: string;
  signature : string;
  id: string;
}

interface vaultsProps {
  vaults: vaults[];
}

function Vaults({ vaults }: vaultsProps) {
  const copy = (value: string) => {
    navigator.clipboard.writeText(value);
    toast.success("Successfuly copied!", {
      className: "border border-green-600 bg-black/10 text-2xl text-green-500"
    })
  };

  if (vaults.length === 0) {
    return (
      <div className="w-full gap-5 overflow-y-auto flex flex-col justify-center items-center mt-10">
        <h1 className="text-3xl font-bold">No Vaults Found</h1>
      </div>
    );
  }

  return (
    <div className="w-full gap-5 overflow-y-auto flex flex-col justify-center items-center mt-10 ">
      
      <div className="w-full flex justify-between items-center">
        <h1 className="text-3xl font-bold">Your Vaults</h1>
        {/* <Trash2 className="ml-3 cursor-pointer text-red-600" size={20} onClick={() => {
          localStorage.removeItem("wallets");
          window.location.reload();
        }} /> */}
      </div>
      {vaults.map((vault, index) => (
        <div key={vault.id} className="flex h-72 w-full flex-col rounded-2xl border border-white/20  text-white shadow-sidebar-border">

          <div className="flex justify-between w-[95%] items-center">
              <h1 className="h-10 mx-4 my-2 text-2xl font-bold">
            Wallet {index + 1}
          </h1>
           <Trash2 className="ml-3 cursor-pointer text-red-600" size={20} onClick={() => {
            const updatedVaults = vaults.filter(v => v.id !== vault.id);
            localStorage.setItem("wallets", JSON.stringify(updatedVaults));
            window.location.reload();
           }} />
          </div>

          <div className="flex-1 w-full rounded-2xl  bg-neutral-800/90 px-4 py-2">
            <div className="w-full">
              <h1 className="font-medium text-xl ">Public Key</h1>
              <Tooltip>                          
                <TooltipTrigger>
                  <p  onClick={() => copy(vault.publicKey)} className="text-gray-400 cursor-pointer">{vault.publicKey}</p>
                </TooltipTrigger>
                <TooltipContent className="px-2 py-1 text-base font-medium">
                  <p>Tab to copy</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <div className="w-full mt-5">
              <h1 className="font-medium text-xl ">Private Key</h1>
              <Tooltip>
                <TooltipTrigger>
                  <Input
                    readOnly
                    onClick={() => copy(vault.secretKey)}
                    type={"password"}
                    className="text-gray-400 border-none cursor-pointer "
                    value={vault.secretKey}
                  />
                </TooltipTrigger>
                <TooltipContent className="px-2 py-1 text-base font-medium">
                  <p>Tab to copy</p>
                </TooltipContent>
              </Tooltip>

              {/* <p className="text-gray-400">{vault.secretKey}</p> */}
            </div>
            <div className="w-full mt-5">
              <h1 className="font-medium text-xl ">Signature</h1>
              {/* <p className="text-gray-400">{vault.secretPhrase}</p> */}
              <Tooltip>
                <TooltipTrigger>
                  <Input
                    readOnly
                    onClick={() => copy(vault.signature )}
                    type={"password"}
                    className="text-gray-400 cursor-pointer border-none"
                    value={vault.signature }
                  />
                </TooltipTrigger>
                <TooltipContent className="px-2 py-1 text-base font-medium">
                  <p>Tab to copy</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Vaults;

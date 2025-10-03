import { Box } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

function Navbar() {

  return (
    <div className="w-full h-16 mt-2  flex fixed items-center py-2 border border-white/20  backdrop-blur-xl justify-between px-5 rounded-b-lg">
      <Box className="h-12 w-12" />
      <div>
      </div>
    </div>
  );
}

export default Navbar;

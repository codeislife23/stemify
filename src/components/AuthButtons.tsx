
import React from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { LogIn, LogOut, User } from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import AuthForms from "@/components/AuthForms";

const AuthButtons = () => {
  const { user, signOut, isLoading } = useAuth();
  const [open, setOpen] = React.useState(false);

  if (isLoading) {
    return (
      <Button variant="ghost" size="sm" disabled>
        <span className="animate-pulse">Loading...</span>
      </Button>
    );
  }

  if (user) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm hidden sm:inline-block">
          {user.email}
        </span>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => signOut()}
          className="flex items-center gap-1"
        >
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:inline-block">Sign Out</span>
        </Button>
      </div>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-1">
          <LogIn className="h-4 w-4" />
          <span>Sign In</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Sign In or Create Account</DialogTitle>
        </DialogHeader>
        <AuthForms onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
};

export default AuthButtons;

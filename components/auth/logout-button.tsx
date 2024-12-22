"use client";

import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useAuth } from "@/lib/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";

interface LogoutButtonProps {
  variant?: "default" | "ghost" | "outline";
  showIcon?: boolean;
}

export function LogoutButton({ 
  variant = "ghost",
  showIcon = true 
}: LogoutButtonProps) {
  const { logout } = useAuth();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Logged out successfully",
        description: "You have been securely logged out"
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Logout failed",
        description: "Please try again"
      });
    }
  };

  return (
    <Button 
      variant={variant} 
      onClick={handleLogout}
      className="gap-2"
    >
      {showIcon && <LogOut className="h-4 w-4" />}
      Sign Out
    </Button>
  );
}
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LogoutButton } from "@/components/auth/logout-button";
import {
  LayoutDashboard,
  Users,
  FileText,
  Mic,
  Brain,
  ClipboardList,
  Video,
  Shield,
  Stethoscope,
  FileKey,
  Wallet,
  Bell,
  Settings
} from "lucide-react";
import { useAuth } from "@/lib/hooks/use-auth";
import { ROUTES } from "@/lib/constants/routes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuGroup,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";

export function Navbar() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <nav className="border-b bg-background sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link href={ROUTES.DASHBOARD} className="text-xl font-bold flex items-center">
            <Stethoscope className="h-6 w-6 mr-2" />
            Dr. Mitchell
          </Link>
          
          <div className="flex items-center space-x-4">
            <Link href={ROUTES.DASHBOARD}>
              <Button variant="ghost" size="sm">
                <LayoutDashboard className="h-4 w-4 mr-2" />
                Dashboard
              </Button>
            </Link>

            <Link href={ROUTES.PATIENTS}>
              <Button variant="ghost" size="sm">
                <Users className="h-4 w-4 mr-2" />
                Patients
              </Button>
            </Link>

            <Link href={ROUTES.PATIENT_REPORT}>
              <Button variant="ghost" size="sm">
                <ClipboardList className="h-4 w-4 mr-2" />
                Patient Report
              </Button>
            </Link>

            <Link href={ROUTES.VOICE_NOTES}>
              <Button variant="ghost" size="sm">
                <Mic className="h-4 w-4 mr-2" />
                Voice Notes
              </Button>
            </Link>

            <Link href={ROUTES.AI_ASSISTANT}>
              <Button variant="ghost" size="sm">
                <Brain className="h-4 w-4 mr-2" />
                AI Assistant
              </Button>
            </Link>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Account Settings</DropdownMenuLabel>
                <DropdownMenuGroup>
                  <DropdownMenuItem>Profile</DropdownMenuItem>
                  <DropdownMenuItem>Notifications</DropdownMenuItem>
                  <DropdownMenuItem>Email Settings</DropdownMenuItem>
                  <DropdownMenuItem>Data Export</DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <LogoutButton variant="ghost" />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button variant="ghost" size="sm">
              <Bell className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
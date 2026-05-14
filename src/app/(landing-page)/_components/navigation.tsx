import { NavigationClient } from "./navigation-client";
import { navigationItems } from "@/features/navigation/header/components/navigation-data";

export async function Navigation() {
  return <NavigationClient items={navigationItems} />;
}

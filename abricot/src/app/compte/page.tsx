"use client";

import { useRouter } from "next/navigation";
import Menu from "@/components/Menu/Menu";
import AccountForm from "@/components/AccountForm/AccountForm";
import Footer from "@/components/Footer/Footer";

/** Page du compte utilisateur : modifier nom, prénom, email, mot de passe */
export default function ComptePage() {
  /** Router pour la navigation */
  const router = useRouter();

  return (
    <>
      {/* Navigation avec liens Dashboard/Projets */}
      <Menu
        activePage="dashboard"
        onPageChange={(page) => {
          if (page === "dashboard") router.push("/");
          else router.push("/projets");
        }}
      />
      <AccountForm />
      <Footer />
    </>
  );
}

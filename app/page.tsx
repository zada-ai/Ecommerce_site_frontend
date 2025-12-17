"use client"
import Navbar from "./Home/Navbar/page";
import MainNav from "./Home/mainNav/page";
import Center from "./Userview/Center/page";
import CandlesSection from "./Userview/Cards/Candles/page";
import BouquitSection from "./Userview/Cards/bouquit/page";
import Bracelet from "./Userview/Cards/bracelet/page";
import Footer from "./Userview/Footer/page";
import WhatsAppButton from "./Userview/Whatsappicon/page";

export default function Home() {
  return (
    <div className="bg-white">
      <Navbar />
      <MainNav />
      <Center />
      <CandlesSection />
      <BouquitSection />
      <WhatsAppButton />
      <Bracelet />
      <Footer />
    </div>
  );
}


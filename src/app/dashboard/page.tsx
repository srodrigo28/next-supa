import UserCards from "@/components/cardsUser";
import Header from "@/components/header";

export default function Dashboard() {
  return (
    <div>
      <Header />
      <h1 className="text-3xl font-bold">Dashboard</h1>

      <UserCards />
    </div>
  );
}
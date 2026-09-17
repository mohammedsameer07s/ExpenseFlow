import "./globals.css";
export const metadata = {
  title: "ExpenseFlow | Personal Finance Dashboard",
  description:
    "Track income, expenses, budgets, savings goals and financial habits.",
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

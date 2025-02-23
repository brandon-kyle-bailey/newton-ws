"use client";
import { SessionContext } from "@/components/providers/session.provider";
import { ThemeTogglecomponent } from "@/components/theme-toggle.component";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { useContext } from "react";
import Image from "next/image";

export default function Home() {
  const { state } = useContext(SessionContext);
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start w-full">
        <div className="flex flex-col gap-4 items-center w-full rounded-lg p-2">
          <ThemeTogglecomponent />
          <Table className="text-primary">
            <TableHeader>
              <TableRow>
                <TableHead className="text-primary w-[200px]">Coin</TableHead>
                <TableHead className="text-primary">24H change</TableHead>
                <TableHead className="text-primary">Live price</TableHead>
                <TableHead className="text-primary">Sell price</TableHead>
                <TableHead className="text-primary">Buy price</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {state.rates.map((rate) => (
                <TableRow key={rate.symbol}>
                  <TableCell className="font-bold flex gap-2 justify-start items-center p-2">
                    {rate.image && (
                      <Image
                        src={rate.image}
                        width={24}
                        height={24}
                        alt={rate.symbol}
                      />
                    )}
                    <span className="font-bold w-full p-2">{rate.symbol}</span>
                  </TableCell>
                  <TableCell
                    className={cn(
                      "p-2",
                      rate.change > 0 ? "text-green-500" : "text-red-500",
                    )}
                  >
                    <span>
                      {rate.change > 0 ? "+" : ""}
                      {rate.change.toFixed(2)}%
                    </span>
                  </TableCell>
                  <TableCell className="p-2">
                    <span>${rate.spot.toFixed(2)}</span>
                  </TableCell>
                  <TableCell className="p-2">
                    <span>${rate.ask.toFixed(2)}</span>
                  </TableCell>
                  <TableCell className="p-2">
                    <span>${rate.bid.toFixed(2)}</span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {state.rates.length === 0 && (
            <div className="flex flex-col gap-2">
              <p className="animate-pulse">
                Data can take up to 13 seconds to load. This is due to rate
                limiting by coingeckos api.
              </p>
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-52" />
              <Skeleton className="h-4 w-32" />
            </div>
          )}
        </div>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center"></footer>
    </div>
  );
}

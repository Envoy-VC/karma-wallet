import { useState } from "react";

import { Button } from "@karma-wallet/ui/components/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@karma-wallet/ui/components/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@karma-wallet/ui/components/table";
import { cn } from "@karma-wallet/ui/lib/utils";
import type { ColumnDef } from "@tanstack/react-table";
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { ChevronsUpDownIcon, CopyIcon, ExternalLinkIcon } from "lucide-react";
import { toast } from "sonner";

type DepositEvent = {
  txHash: string;
  timestamp: number;
  gasUsed: number;
  gasSaved: number;
};

export const events: DepositEvent[] = [
  {
    gasSaved: 12134,
    gasUsed: 253457,
    timestamp: 1754832280,
    txHash:
      "0x02ea0f4bd9b6b733b195085d453cec1d66e94520ed3fd019761635ad649c26c8",
  },
  {
    gasSaved: 12134,
    gasUsed: 253457,
    timestamp: 1754832280,
    txHash:
      "0x02ea0f4bd9b6b733b195085d453cec1d66e94520ed3fd019761635ad649c26c8",
  },
  {
    gasSaved: 12134,
    gasUsed: 253457,
    timestamp: 1754832280,
    txHash:
      "0x02ea0f4bd9b6b733b195085d453cec1d66e94520ed3fd019761635ad649c26c8",
  },
];

const ethPrice = 4000;
export const columns: ColumnDef<DepositEvent>[] = [
  {
    accessorKey: "txHash",
    cell: ({ row }) => {
      const txHash = row.getValue("txHash") as string;
      const truncated = `${txHash.slice(0, 8)}...${txHash.slice(-5)}`;
      return (
        <div className="flex flex-row items-center gap-1 text-neutral-600">
          <div>{truncated}</div>
          <Button
            onClick={async () => {
              await navigator.clipboard.writeText(txHash);
              toast.success("Copied to clipboard");
            }}
            size="icon"
            variant="link"
          >
            <CopyIcon className="size-4 text-neutral-500" />
          </Button>
          <a
            href={`https://etherscan.io/tx/${txHash}`}
            rel="noreferrer"
            target="_blank"
          >
            <ExternalLinkIcon className="size-4 text-neutral-500" />
          </a>
        </div>
      );
    },
    header: ({ column }) => {
      return (
        <button
          className="flex cursor-pointer flex-row items-center gap-2 text-base text-neutral-600"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          type="button"
        >
          Transaction Hash
          <ChevronsUpDownIcon className="size-5" />
        </button>
      );
    },
  },
  {
    accessorKey: "timestamp",
    cell: ({ row }) => {
      const timestamp = parseInt(row.getValue("timestamp"));
      const date = new Date(timestamp * 1000);

      const day = date.getDate();
      const suffix =
        day % 10 === 1 && day !== 11
          ? "st"
          : day % 10 === 2 && day !== 12
            ? "nd"
            : day % 10 === 3 && day !== 13
              ? "rd"
              : "th";

      const month = date.toLocaleString("en-US", { month: "long" });

      const time = date.toLocaleString("en-US", {
        hour: "2-digit",
        hour12: true,
        minute: "2-digit",
      });

      return (
        <div className="font-medium text-neutral-600">{`${day}${suffix} ${month}, ${time}`}</div>
      );
    },
    header: ({ column }) => {
      return (
        <button
          className="flex cursor-pointer flex-row items-center gap-2 text-base text-neutral-600"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          type="button"
        >
          Date & Time
          <ChevronsUpDownIcon className="size-5" />
        </button>
      );
    },
  },
  {
    accessorKey: "gasUsed",
    cell: ({ row }) => {
      const gasUsedGwei = row.getValue("gasUsed") as number;
      const gasInEth = gasUsedGwei / 1e9;
      const gasInUsd = gasInEth * ethPrice;

      return (
        <div className="text-center font-medium text-neutral-600">
          ${gasInUsd.toFixed(2)}
        </div>
      );
    },
    header: ({ column }) => {
      return (
        <button
          className="flex w-full cursor-pointer flex-row items-center justify-center gap-2 text-base text-neutral-600"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          type="button"
        >
          Gas Used
          <ChevronsUpDownIcon className="size-5" />
        </button>
      );
    },
  },
  {
    accessorKey: "gasSaved",
    cell: ({ row }) => {
      const gasSavedGwei = row.getValue("gasSaved") as number;
      const gasInEth = gasSavedGwei / 1e9;
      const gasInUsd = gasInEth * ethPrice;

      return (
        <div className="text-center font-medium text-neutral-600">
          ${gasInUsd.toFixed(2)}
        </div>
      );
    },
    header: ({ column }) => {
      return (
        <button
          className="flex w-full cursor-pointer flex-row items-center justify-center gap-2 text-base text-neutral-600"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          type="button"
        >
          Gas Saved
          <ChevronsUpDownIcon className="size-5" />
        </button>
      );
    },
  },
];

export const SavingsTable = () => {
  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    columns,
    data: events,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting,
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base md:text-xl">History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-hidden rounded-md">
          <Table className="!border-none">
            <TableHeader className="!border-none">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow
                  className="hover:!bg-primary/15 !p-10 !border-none bg-primary/10"
                  key={headerGroup.id}
                >
                  {headerGroup.headers.map((header, index) => {
                    return (
                      <TableHead
                        className={cn(
                          "h-12 px-4",
                          index === 0 && "rounded-tl-xl rounded-bl-xl",
                          index === headerGroup.headers.length - 1 &&
                            "rounded-tr-xl rounded-br-xl",
                        )}
                        key={header.id}
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length > 0 ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    className="border-b border-dashed"
                    data-state={row.getIsSelected() && "selected"}
                    key={row.id}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell className="px-4" key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    className="h-24 text-center"
                    colSpan={columns.length}
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

import Image from "next/image"
import React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Typography } from "@/components/ui/typography"

export default function InvoiceComponent() {
  return (
    <div className="w-full">
      <Typography variant="h5" className="font-bold text-foreground mb-2">
        Payment Invoice
      </Typography>

      <div className="flex flex-col lg:flex-row lg:gap-70 bg-background rounded-lg p-4 gap-2">
        <div className="lg:flex-row w-full">
          <div className="flex flex-col lg:flex-row gap-4">
            <Card className="rounded-xl shadow-md overflow-hidden bg-primary text-background lg:h-[260px] lg:w-[350px] w-full relative">
              <CardContent className="py-4">
                {/* decorative background circles */}
                <div aria-hidden className="pointer-events-none">
                  <div className="absolute -top-17 -right-17 h-36 w-36 rounded-full bg-secondary/40" />
                  <div className="absolute -right-17 bottom-[-100px] h-56 w-56 rounded-full bg-secondary/40" />
                  <div className="absolute -bottom-20 -left-20 h-36 w-36 rounded-full bg-secondary/40" />
                </div>
                <div className="lg:mb-14">
                  <Image
                    src="/logo-invoice.svg"
                    alt="Logo"
                    width={120}
                    height={120}
                  />
                </div>

                <div className="space-y-2 text-sm">
                  <div>Date: 12 Nov, 2023</div>
                  <div>Said By: High Tech User</div>
                  <div>Location: Business address City, State, IN</div>
                </div>
              </CardContent>
            </Card>

            <div className="bg-muted rounded-lg lg:h-[260px] p-4 lg:w-[350px] w-full">
              <div className="flex flex-col">
                <div className="bg-background rounded-lg p-2">
                  <Typography
                    variant="span"
                    className="text-foreground font-semibold"
                  >
                    Bill To
                  </Typography>
                  <div className="text-xs text-foreground leading-relaxed">
                    Parkway Good
                    <br />
                    Street 1122 Block D United States
                    <br />
                    Block A USA
                    <br />
                    New York, NY 1001
                  </div>
                </div>

                <div className=" rounded-lg p-2">
                  <Typography
                    variant="span"
                    className="text-foreground font-semibold"
                  >
                    Ship To
                  </Typography>
                  <div className="text-xs text-foreground leading-relaxed">
                    Parkway Good
                    <br />
                    Street 1122 Block D United States
                    <br />
                    Block A USA
                    <br />
                    New York, NY 1001
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-background rounded-lg mb-6 mt-4 overflow-x-auto border-b">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>#No.</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="text-right">Tax</TableHead>
                  <TableHead className="text-right ">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>01</TableCell>
                  <TableCell>Skin care</TableCell>
                  <TableCell className="text-right">$199.99</TableCell>
                  <TableCell className="text-right">$20.00</TableCell>
                  <TableCell className="text-right">219.99</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          <div className="flex justify-end mb-8">
            <div className="w-40 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-foreground">Sub total:</span>
                <span className=" text-foreground">$219.99</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-foreground">Card fee:</span>
                <span className="text-foreground">$00.00</span>
              </div>
              <div className="flex justify-between font-semibold">
                <span className="text-foreground">Grand total:</span>
                <span className="text-foreground">$219.00</span>
              </div>
            </div>
          </div>

          <div className="border-t border-dashed border-muted pt-8">
            <div className="">
              <Typography
                variant="p"
                className="font-bold text-foreground mb-6"
              >
                Signature
              </Typography>
              <div className="text-muted-foreground text-xs">
                Lorem ipsum dolor sit amet consectetur adipiscing elit Ut et
                massa mi. Aliquam in hendrerit urna. Pellentesque sit amet
                sapien fringilla, mattis ligula consectetur, ultrices mauris.
                Maecenas vitae mattis tellus. Nullam quis imperdiet augue.
                Vestibulum auctor ornare leo, non suscipit magna interdum eu.
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 lg:mt-0">
          <Button
            variant="default"
            className="w-full lg:w-auto text-background"
          >
            Download Invoice
          </Button>
        </div>
      </div>
    </div>
  )
}

import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "./table";

const meta = {
  title: "UI/Table",
  component: Table,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
} satisfies Meta<typeof Table>;

export default meta;

export const Default: StoryObj = {
  render: () => (
    <Table>
      <TableCaption>タイムテーブル</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>時刻</TableHead>
          <TableHead>内容</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>18:30</TableCell>
          <TableCell>開場</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>19:00</TableCell>
          <TableCell>挨拶</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
};

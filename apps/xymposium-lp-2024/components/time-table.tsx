import { JSX } from "react";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export interface Props {
  caption?: string;
  data: {
    time: string;
    title?: string;
    description?: string;
  }[];
}

/**
 * タイムテーブル
 */
export default function TimeTable(props: Props): JSX.Element {
  return (
    <div className="pt-5">
      <Table>
        <TableCaption>{props.caption}</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>time</TableHead>
            <TableHead>content/speaker</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {props.data.map((item, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium">{item.time}</TableCell>
              <TableCell>
                <p className="font-bold">{item.title}</p>
                <p>{item.description}</p>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

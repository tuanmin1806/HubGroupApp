import { lazy } from "react";
import Box from "@mui/material/Box";
const Editor = lazy(() => import("./editor"));


interface RichTextEditorProps {
  value?: string;
  onChange?: (value: string) => void;
}

export default function RichTextEditorComponent({ value, onChange }: RichTextEditorProps) {
  return (
    <Box sx={{ maxWidth: '100%', margin: "0 auto" }}>
      <Editor value={value} onChange={onChange} />
    </Box>
  );
}
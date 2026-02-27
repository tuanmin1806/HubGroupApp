import { Box } from "@mui/material";
import Editor from "./editor";

interface RichTextEditorProps {
  value?: string;
  onChange?: (value: string) => void;
}

export default function RichTextEditorComponent({ value, onChange }: RichTextEditorProps) {
  return (
    <Box sx={{ p: 3, maxWidth: '100%', margin: "0 auto" }}>
      <Editor value={value} onChange={onChange} />
    </Box>
  );
}
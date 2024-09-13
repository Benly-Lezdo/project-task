import { Box, Button, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import EditIcon from "@mui/icons-material/Edit";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import ChangeCircleIcon from "@mui/icons-material/ChangeCircle";
import ClearIcon from "@mui/icons-material/Clear";
import CheckIcon from "@mui/icons-material/Check";

export default function Home() {
  const [val, setVal] = useState("");
  const [responseData, setResponseData] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editableData, setEditableData] = useState(responseData);
  const [showClearBtn, setShowClearBtn] = useState(false);

  useEffect(() => {
    setShowClearBtn(val.length > 0);
  }, [val]);

  const handleOnChange = (e) => {
    setVal(e.target.value);
  };

  const query = async (data) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.3",
        {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_APP_HF_API_KEY}`,
            "Content-Type": "application/json",
          },
          method: "POST",
          body: JSON.stringify(data),
        }
      );

      if (!res.ok) {
        throw new Error("API request failed");
      }

      const result = await res.json();
      console.log("result", result);
      setResponseData(result[0]?.generated_text);
      setEditableData(result[0]?.generated_text);
    } catch (err) {
      setError(err.message);
      toast.error(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = () => {
    if (val.trim().length < 3) {
      toast.warning("Please enter a valid query");
      return;
    }
    query({
      inputs: `Can you please provide some business ideas about ${val}? ${
        editableData && `continue with ${editableData}`
      }`,
    });
  };

  const handleEditClick = () => {
    setIsEditing((prev) => !prev);
  };

  const handleCopyClick = () => {
    navigator.clipboard
      .writeText(responseData)
      .then(() => toast.success("Copied to clipboard!"))
      .catch(() => toast.error("Failed to copy"));
  };

  const handleClear = () => {
    setVal("");
    setResponseData("");
  };

  return (
    <>
      <Box sx={{ width: "100%" }}>
        <Box className="p-2 text-center">
          <Typography variant="h5">
            Pitch Deck Co-Pilot from Ideas and Assistance
          </Typography>
        </Box>
        <Box className="mt-5">
          <Box className="text-center">
            <Box className="d-flex">
              <Box className="mx-1" sx={{ width: "100%" }}>
                <TextField
                  sx={{ width: "100%" }}
                  size="medium"
                  label="Enter your business ideas"
                  value={val}
                  onChange={handleOnChange}
                />
              </Box>
            </Box>
            <Box className="d-flex align-items-center justify-content-center">
              <Box className="mt-2">
                <Button
                  className="mx-2"
                  variant="contained"
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  {loading ? "Loading..." : "Send"}
                </Button>
              </Box>
              {showClearBtn && (
                <Box className="mt-2">
                  <Button
                    className="mx-2"
                    variant="outlined"
                    onClick={handleClear}
                  >
                    Clear Conversation
                  </Button>
                </Box>
              )}
            </Box>
          </Box>
        </Box>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: "500", color: "green" }}>
            Result :
          </Typography>
          <Box sx={{ border: "2px dashed #cbcbcb", padding: 2 }}>
            {error && <Typography color="error">Error: {error}</Typography>}
            {isEditing ? (
              <>
                <TextField
                  multiline
                  minRows={4}
                  fullWidth
                  value={editableData}
                  onChange={(e) => setEditableData(e.target.value)}
                  variant="outlined"
                />
              </>
            ) : responseData ? (
              <>
                <Typography>{val} ?</Typography>
                <pre
                  className="mt-2"
                  style={{
                    whiteSpace: "pre-wrap",
                    wordWrap: "break-word",
                    overflowWrap: "break-word",
                  }}
                >
                  {responseData}
                </pre>
              </>
            ) : (
              <Typography className="text-center">No result yet</Typography>
            )}
          </Box>
          <Box className="d-flex align-items-center">
            <>
              {responseData && (
                <Box className="d-flex justify-content-start mt-2">
                  <Box className="mx-1">
                    <ContentCopyIcon
                      onClick={handleCopyClick}
                      style={{ cursor: "pointer" }}
                    />
                  </Box>

                  <Box className="mx-1">
                    <ChangeCircleIcon
                      style={{ cursor: "pointer" }}
                      onClick={handleSubmit}
                    />
                  </Box>
                  <Box className="mx-1">
                    <ClearIcon
                      onClick={handleClear}
                      style={{ cursor: "pointer" }}
                    />
                  </Box>
                  <Box className="mx-1">
                    <EditIcon
                      onClick={handleEditClick}
                      style={{ cursor: "pointer", marginRight: 8 }}
                    />
                  </Box>
                </Box>
              )}{" "}
              <Box className="mt-2">
                <CheckIcon
                  style={{ cursor: "pointer" }}
                  onClick={handleSubmit}
                />
              </Box>
            </>
          </Box>
        </Box>
      </Box>
    </>
  );
}
